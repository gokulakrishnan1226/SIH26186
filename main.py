

# main.py - Complete working script with webcam
import torch
import torchvision
from torchvision import transforms
from PIL import Image
import numpy as np
import cv2
import requests
from io import BytesIO
import matplotlib.pyplot as plt

# Add this at the very top of your main.py (after imports)
import os
import json

# Download pre-trained weights function
def download_emotion_weights():
    """Download pre-trained emotion detection weights"""
    weights_path = "models/emotion_model.pth"
    if os.path.exists(weights_path):
        print("✅ Pre-trained weights found!")
        return True
    
    print("📥 Downloading pre-trained weights...")
    os.makedirs("models", exist_ok=True)
    
    # Try to download from multiple sources
    urls = [
        "https://github.com/erhwenkuo/deep-learning-with-pytorch/raw/master/emotion_model.pth",
        "https://raw.githubusercontent.com/priya-dwivedi/face-emotion-recognition/master/emotion_model.hdf5",
    ]
    
    for url in urls:
        try:
            import urllib.request
            urllib.request.urlretrieve(url, weights_path)
            print(f"✅ Downloaded from: {url}")
            return True
        except:
            continue
    
    print("⚠️ Could not download weights. Using random initialization.")
    return False

print("="*60)
print("🚀 PERSONNEL STRESS MONITORING SYSTEM")
print("="*60)

class StressDetector:
    def __init__(self):
        self.EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
        self.STRESS_EMOTIONS = ['Angry', 'Fear', 'Sad', 'Disgust']
        
        print("\n📥 Loading model...")
        self.model = torchvision.models.resnet18(pretrained=True)
        self.model.fc = torch.nn.Linear(512, 7)
        self.model.eval()
        
        self.preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        print("✅ Model loaded!")
    
    def analyze(self, image):
        """Analyze image for emotion and stress"""
        # Load image
        if isinstance(image, str):
            if image.startswith('http'):
                response = requests.get(image)
                img = Image.open(BytesIO(response.content))
            else:
                img = Image.open(image)
        elif isinstance(image, np.ndarray):
            img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        else:
            img = image
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Preprocess
        img_tensor = self.preprocess(img)
        img_tensor = img_tensor.unsqueeze(0)
        
        # Predict
        with torch.no_grad():
            outputs = self.model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        
        # Get results
        predicted_idx = torch.argmax(probabilities).item()
        confidence = float(probabilities[predicted_idx] * 100)
        emotion = self.EMOTIONS[predicted_idx]
        
        # Stress analysis
        stress_score = sum(probabilities[self.EMOTIONS.index(e)] for e in self.STRESS_EMOTIONS) * 100 / len(self.STRESS_EMOTIONS)
        is_stressed = emotion in self.STRESS_EMOTIONS
        
        # Determine level
        if stress_score > 60:
            level, color = "CRITICAL", "🔴"
        elif stress_score > 40:
            level, color = "HIGH", "🟠"
        elif stress_score > 20:
            level, color = "MEDIUM", "🟡"
        else:
            level, color = "LOW", "🟢"
        
        return {
            'emotion': emotion,
            'confidence': confidence,
            'stress_score': float(stress_score),
            'is_stressed': is_stressed,
            'level': level,
            'color': color,
            'all_emotions': {self.EMOTIONS[i]: float(probabilities[i] * 100) for i in range(len(self.EMOTIONS))}
        }
    
    def analyze_webcam(self, camera_id=0):
        """
        Real-time analysis from webcam
        camera_id: 0 for default webcam, 1 for external camera
        """
        print("\n🎥 Opening webcam...")
        cap = cv2.VideoCapture(camera_id)
        
        if not cap.isOpened():
            print("❌ Cannot open webcam. Please check:")
            print("   1. Is your webcam connected?")
            print("   2. Is webcam being used by another application?")
            print("   3. Try changing camera_id to 1 or 2")
            return
        
        print("✅ Webcam opened successfully!")
        print("\n📋 Instructions:")
        print("   - Press 'q' to quit")
        print("   - Press 's' to save current frame")
        print("   - Press 'r' to reset/clear screen")
        
        frame_count = 0
        saved_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to capture frame")
                break
            
            frame_count += 1
            
            # Process every 3rd frame for better performance
            if frame_count % 3 == 0:
                try:
                    result = self.analyze(frame)
                    
                    # Display results on frame
                    color = (0, 0, 255) if result['is_stressed'] else (0, 255, 0)
                    
                    # Background overlay for text
                    overlay = frame.copy()
                    cv2.rectangle(overlay, (0, 0), (400, 150), (0, 0, 0), -1)
                    cv2.addWeighted(overlay, 0.5, frame, 0.5, 0, frame)
                    
                    # Add text
                    cv2.putText(frame, f"Emotion: {result['emotion']}", (10, 35),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
                    cv2.putText(frame, f"Confidence: {result['confidence']:.1f}%", (10, 70),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                    cv2.putText(frame, f"Stress Score: {result['stress_score']:.1f}%", (10, 100),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                    cv2.putText(frame, f"Level: {result['color']} {result['level']}", (10, 130),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                    
                    # Show emotion bars on right side
                    bar_x = frame.shape[1] - 200
                    bar_y_start = 50
                    bar_height = 20
                    bar_spacing = 28
                    
                    for i, (emotion, score) in enumerate(result['all_emotions'].items()):
                        if i < 7:  # Show all 7 emotions
                            y_pos = bar_y_start + (i * bar_spacing)
                            bar_width = int((score / 100) * 150)
                            bar_color = (0, 0, 255) if emotion in self.STRESS_EMOTIONS else (0, 255, 0)
                            cv2.rectangle(frame, (bar_x, y_pos), (bar_x + bar_width, y_pos + bar_height), bar_color, -1)
                            cv2.putText(frame, f"{emotion[:3]}: {score:.0f}%", (bar_x + bar_width + 5, y_pos + 15),
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
                    
                    # Large warning if stressed
                    if result['is_stressed']:
                        cv2.putText(frame, "⚠️ STRESS DETECTED!", (frame.shape[1]//2 - 150, 30),
                                   cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)
                    
                except Exception as e:
                    print(f"Error processing frame: {e}")
            
            # Show frame
            cv2.imshow('Personnel Stress Monitor', frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s'):
                # Save current frame
                saved_count += 1
                filename = f"stress_capture_{saved_count}.jpg"
                cv2.imwrite(filename, frame)
                print(f"📸 Saved: {filename}")
            elif key == ord('r'):
                # Reset display
                print("🔄 Display reset")
        
        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        print(f"\n✅ Webcam stopped. Captured {saved_count} images.")

# Main execution
if __name__ == "__main__":
    detector = StressDetector()
    
    print("\n" + "="*60)
    print("📋 SELECT MODE")
    print("="*60)
    print("1. Test with sample image (online)")
    print("2. Start Webcam (real-time)")
    print("3. Test with local image file")
    print("="*60)
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == '1':
        # Test with sample image
        print("\n🧪 Testing with sample image...")
        test_url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
        result = detector.analyze(test_url)
        
        print(f"\n📊 Results:")
        print(f"   🎭 Emotion: {result['emotion']}")
        print(f"   📊 Confidence: {result['confidence']:.1f}%")
        print(f"   😰 Stress: {result['stress_score']:.1f}%")
        print(f"   🚦 Level: {result['color']} {result['level']}")
        print(f"   Status: {'⚠️ STRESSED' if result['is_stressed'] else '✅ CALM'}")
        
        # Show emotion chart
        try:
            fig, ax = plt.subplots(figsize=(8, 4))
            emotions = list(result['all_emotions'].keys())
            values = list(result['all_emotions'].values())
            colors = ['red' if e in detector.STRESS_EMOTIONS else 'green' for e in emotions]
            
            bars = ax.bar(emotions, values, color=colors)
            ax.set_title("Emotion Probabilities", fontsize=14, fontweight='bold')
            ax.set_ylabel("Confidence %")
            ax.set_ylim(0, 100)
            ax.tick_params(axis='x', rotation=45)
            
            for bar, value in zip(bars, values):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height,
                       f'{value:.1f}%', ha='center', va='bottom', fontsize=9)
            
            plt.tight_layout()
            plt.show()
        except:
            pass
            
    elif choice == '2':
        # Start webcam
        print("\n🎥 Starting webcam mode...")
        # Try different camera IDs if default doesn't work
        detector.analyze_webcam(0)
        
    elif choice == '3':
        # Test with local image
        image_path = input("\nEnter image path: ").strip()
        try:
            result = detector.analyze(image_path)
            print(f"\n📊 Results:")
            print(f"   🎭 Emotion: {result['emotion']}")
            print(f"   📊 Confidence: {result['confidence']:.1f}%")
            print(f"   😰 Stress: {result['stress_score']:.1f}%")
            print(f"   🚦 Level: {result['color']} {result['level']}")
            print(f"   Status: {'⚠️ STRESSED' if result['is_stressed'] else '✅ CALM'}")
        except Exception as e:
            print(f"❌ Error loading image: {e}")
    
    else:
        print("❌ Invalid choice!")
    
    print("\n" + "="*60)
    print("✅ Done!")
    print("="*60)
    