# main_face_fixed.py
import torch
import torchvision
from torchvision import transforms
from PIL import Image
import numpy as np
import cv2
import requests
from io import BytesIO
import matplotlib.pyplot as plt
import os
import urllib.request

print("="*60)
print("🚀 PERSONNEL STRESS MONITORING WITH FACE DETECTION")
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
        
        # Use DNN face detector instead of Haar Cascade
        self.use_dnn = False
        self.face_net = None
        
        # Try to load DNN face detector
        try:
            os.makedirs("models", exist_ok=True)
            
            proto_path = "models/deploy.prototxt"
            model_path = "models/res10_300x300_ssd_iter_140000.caffemodel"
            
            # Download if not exists
            if not os.path.exists(proto_path):
                print("📥 Downloading face detection model...")
                urllib.request.urlretrieve(
                    "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt",
                    proto_path
                )
                urllib.request.urlretrieve(
                    "https://raw.githubusercontent.com/opencv/opencv_3rdparty/master/dnn_samples/face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel",
                    model_path
                )
                print("✅ Face detection model downloaded!")
            
            self.face_net = cv2.dnn.readNetFromCaffe(proto_path, model_path)
            self.use_dnn = True
            print("✅ DNN face detector loaded!")
        except Exception as e:
            print(f"⚠️ DNN face detector not available: {e}")
            print("   Using fallback method...")
            self.use_dnn = False
        
        # Alternative: Use OpenCV's face detection from file
        self.face_cascade = None
        try:
            # Try to load from OpenCV's built-in data
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            if os.path.exists(cascade_path):
                self.face_cascade = cv2.CascadeClassifier(cascade_path)
                print("✅ Haar Cascade face detector loaded!")
        except:
            pass
        
        print("✅ Model loaded!")
    
    def detect_faces_dnn(self, image):
        """Detect faces using DNN"""
        if not self.use_dnn or self.face_net is None:
            return []
        
        if isinstance(image, np.ndarray):
            img = image
        else:
            img = np.array(image)
        
        (h, w) = img.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0,
                                     (300, 300), (104.0, 177.0, 123.0))
        
        self.face_net.setInput(blob)
        detections = self.face_net.forward()
        
        faces = []
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > 0.5:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                # Ensure coordinates are within image bounds
                startX = max(0, startX)
                startY = max(0, startY)
                endX = min(w, endX)
                endY = min(h, endY)
                faces.append((startX, startY, endX - startX, endY - startY))
        
        return faces
    
    def detect_faces_simple(self, image):
        """Simple face detection using basic image processing"""
        # Convert to grayscale
        if isinstance(image, np.ndarray):
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
        
        # Try Haar Cascade first
        if self.face_cascade is not None:
            try:
                faces = self.face_cascade.detectMultiScale(
                    gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(60, 60)
                )
                if len(faces) > 0:
                    return [(int(x), int(y), int(w), int(h)) for (x, y, w, h) in faces]
            except:
                pass
        
        # Fallback: Use simple brightness-based detection
        # This is a very basic fallback - just take center region
        h, w = gray.shape
        center_x, center_y = w // 2, h // 2
        face_size = min(w, h) // 3
        
        # Return center region as "face"
        return [(center_x - face_size//2, center_y - face_size//2, face_size, face_size)]
    
    def get_face_region(self, image):
        """Extract face region from image"""
        if isinstance(image, str):
            if image.startswith('http'):
                response = requests.get(image)
                img = Image.open(BytesIO(response.content))
                img_array = np.array(img)
            else:
                img = Image.open(image)
                img_array = np.array(img)
        elif isinstance(image, np.ndarray):
            img_array = image
        else:
            img_array = np.array(image)
        
        # Try DNN first
        faces = self.detect_faces_dnn(img_array)
        
        # If no faces found with DNN, try simple method
        if len(faces) == 0:
            faces = self.detect_faces_simple(img_array)
        
        if len(faces) > 0:
            # Get the largest face
            (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
            
            # Ensure coordinates are valid
            x = max(0, x)
            y = max(0, y)
            w = min(w, img_array.shape[1] - x)
            h = min(h, img_array.shape[0] - y)
            
            if w > 10 and h > 10:  # Minimum face size
                face_roi = img_array[y:y+h, x:x+w]
                return face_roi, (x, y, w, h)
        
        return None, None
    
    def analyze(self, image):
        """Analyze image for emotion and stress with face detection"""
        # Get face region
        face_roi, face_coords = self.get_face_region(image)
        
        if face_roi is None:
            return {
                'emotion': 'No Face',
                'confidence': 0,
                'stress_score': 0,
                'is_stressed': False,
                'level': 'NO_FACE',
                'color': '⚪',
                'all_emotions': {e: 0 for e in self.EMOTIONS},
                'face_detected': False
            }
        
        # Convert face ROI to PIL Image
        img = Image.fromarray(cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
        
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
            'all_emotions': {self.EMOTIONS[i]: float(probabilities[i] * 100) for i in range(len(self.EMOTIONS))},
            'face_detected': True,
            'face_coords': face_coords
        }
    
    def analyze_webcam(self, camera_id=0):
        """Real-time analysis from webcam with face detection"""
        print("\n🎥 Opening webcam...")
        cap = cv2.VideoCapture(camera_id)
        
        if not cap.isOpened():
            print("❌ Cannot open webcam.")
            return
        
        print("✅ Webcam opened successfully!")
        print("\n📋 Instructions:")
        print("   - Press 'q' to quit")
        print("   - Press 's' to save current frame")
        print("   - Press 'r' to reset")
        
        frame_count = 0
        saved_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Process every 2nd frame for performance
            if frame_count % 2 == 0:
                try:
                    result = self.analyze(frame)
                    
                    # Draw face rectangle
                    if result.get('face_detected', False) and 'face_coords' in result:
                        (x, y, w, h) = result['face_coords']
                        color = (0, 255, 0) if not result['is_stressed'] else (0, 0, 255)
                        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                        
                        # Add label near face
                        cv2.putText(frame, result['emotion'], (x, y-10),
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                    
                    # Display results on frame
                    color = (0, 0, 255) if result['is_stressed'] else (0, 255, 0)
                    
                    # Background overlay for text
                    overlay = frame.copy()
                    cv2.rectangle(overlay, (0, 0), (400, 180), (0, 0, 0), -1)
                    cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)
                    
                    # Add text
                    cv2.putText(frame, f"Emotion: {result['emotion']}", (10, 35),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
                    cv2.putText(frame, f"Confidence: {result['confidence']:.1f}%", (10, 70),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                    cv2.putText(frame, f"Stress Score: {result['stress_score']:.1f}%", (10, 100),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                    cv2.putText(frame, f"Level: {result['color']} {result['level']}", (10, 130),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                    cv2.putText(frame, f"Face: {'✅' if result.get('face_detected', False) else '❌'}", (10, 160),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
                    
                    # Show emotion bars on right side
                    bar_x = frame.shape[1] - 200
                    bar_y_start = 50
                    bar_height = 20
                    bar_spacing = 28
                    
                    for i, (emotion, score) in enumerate(result['all_emotions'].items()):
                        if i < 7:
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
            cv2.imshow('Personnel Stress Monitor - Face Detection', frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s'):
                saved_count += 1
                filename = f"stress_capture_{saved_count}.jpg"
                cv2.imwrite(filename, frame)
                print(f"📸 Saved: {filename}")
            elif key == ord('r'):
                print("🔄 Reset")
        
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
    print("1. Start Webcam (Real-time with Face Detection)")
    print("2. Test with sample image")
    print("3. Test with local image file")
    print("="*60)
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == '1':
        detector.analyze_webcam(0)
    elif choice == '2':
        test_url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
        result = detector.analyze(test_url)
        
        print(f"\n📊 Results:")
        print(f"   🎭 Emotion: {result['emotion']}")
        print(f"   📊 Confidence: {result['confidence']:.1f}%")
        print(f"   😰 Stress: {result['stress_score']:.1f}%")
        print(f"   🚦 Level: {result['color']} {result['level']}")
        print(f"   👤 Face Detected: {'✅' if result.get('face_detected', False) else '❌'}")
        
    elif choice == '3':
        image_path = input("\nEnter image path: ").strip()
        result = detector.analyze(image_path)
        
        print(f"\n📊 Results:")
        print(f"   🎭 Emotion: {result['emotion']}")
        print(f"   📊 Confidence: {result['confidence']:.1f}%")
        print(f"   😰 Stress: {result['stress_score']:.1f}%")
        print(f"   🚦 Level: {result['color']} {result['level']}")
        print(f"   👤 Face Detected: {'✅' if result.get('face_detected', False) else '❌'}")
    
    print("\n" + "="*60)
    print("✅ Done!")
    print("="*60)