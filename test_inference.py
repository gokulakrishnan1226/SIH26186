import base64
import json
import os
import cv2
import numpy as np
import tensorflow as tf
from app import analyze_crop_with_gemini, detect_faces_deep

def test_inference():
    print("=" * 60)
    print("TESTING SENTINEL AI HIGH-ACCURACY FACE DETECTION & INFERENCE")
    print("=" * 60)

    # 1. Local TensorFlow Model Verification
    print("\n1. Testing Local TensorFlow Model ('face_model.h5')...")
    model = tf.keras.models.load_model('face_model.h5', compile=False)
    dummy_input = np.random.rand(1, 48, 48, 1).astype(np.float32)
    preds = model.predict(dummy_input, verbose=0)[0]
    emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
    top_idx = int(np.argmax(preds))
    print(f"OK: Local model functional. Sample emotion: {emotions[top_idx]} ({preds[top_idx]*100:.1f}%)")

    # 2. YuNet DNN High-Precision Face Detection Verification
    print("\n2. Testing YuNet DNN Deep Neural Face Detector...")
    img = cv2.imread('stress_capture_1.jpg')
    if img is not None:
        h, w, _ = img.shape
        faces = detect_faces_deep(img)
        print(f"OK: YuNet DNN detected {len(faces)} face(s) in 'stress_capture_1.jpg':")
        for x, y, fw, fh, conf in faces:
            print(f"   - Face BBox: [{x}, {y}, {fw}, {fh}], Confidence: {conf*100:.1f}%")
            
            # Crop face region and test Gemini Vision AI analysis
            roi_bgr = img[y:y+fh, x:x+fw]
            if roi_bgr.size > 0:
                _, crop_buf = cv2.imencode('.jpg', roi_bgr)
                crop_b64 = base64.b64encode(crop_buf).decode('utf-8')
                gemini_res = analyze_crop_with_gemini(crop_b64)
                if gemini_res:
                    print("   - ✨ Gemini Vision Micro-expression Analysis Output:")
                    print(f"     Emotion: {gemini_res.get('top_emotion')} ({gemini_res.get('confidence')}%)")
                    print(f"     Stress Index: {gemini_res.get('stress_score')}/100")
                    print(f"     Micro-expression: {gemini_res.get('micro_expression')}")
                else:
                    print("   - Info: Gemini Vision fallback active, YuNet DNN active.")
    else:
        print("WARN: Test image 'stress_capture_1.jpg' not found.")

if __name__ == '__main__':
    test_inference()
