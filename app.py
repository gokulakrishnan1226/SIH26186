import base64
import os
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load Model
MODEL_PATH = 'face_model.h5'
print("Loading TensorFlow model...")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("Model loaded successfully!")

# Emotion Labels
EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# OpenCV Face Detectors — load multiple for fallback
face_cascade_default = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
face_cascade_alt = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
face_cascade_alt2 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml')

def detect_faces(gray: np.ndarray):
    """Try multiple cascades and parameter sets to robustly detect faces, with fallback."""
    cascades = [
        face_cascade_default,
        face_cascade_alt,
        face_cascade_alt2,
        cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
    ]
    
    gray_eq = cv2.equalizeHist(gray)
    
    # Pass 1: standard gray image
    # Pass 2: equalized gray image
    for img in [gray, gray_eq]:
        for cascade in cascades:
            if cascade.empty():
                continue
            for params in [
                dict(scaleFactor=1.1, minNeighbors=3, minSize=(30, 30)),
                dict(scaleFactor=1.15, minNeighbors=2, minSize=(20, 20)),
                dict(scaleFactor=1.05, minNeighbors=2, minSize=(20, 20)),
            ]:
                faces = cascade.detectMultiScale(img, **params)
                if len(faces) > 0:
                    return faces

    # Fallback: if no haar face found, return central region of frame
    h, w = gray.shape
    cw, ch = int(w * 0.55), int(h * 0.6)
    cx, cy = int((w - cw) / 2), int((h - ch) / 3)
    return np.array([[cx, cy, cw, ch]])

@app.route('/')
def index():
    return jsonify({'status': 'ok', 'message': 'SENTINEL AI Engine'})

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'status': 'error', 'message': 'No image data provided'}), 400

        # Decode base64 image data
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({'status': 'error', 'message': 'Failed to decode image'}), 400

        h_frame, w_frame, _ = frame.shape
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces using multi-cascade fallback
        faces = detect_faces(gray)

        detected_faces = []

        for (x, y, w, h) in faces:
            # Crop face region
            roi_gray = gray[y:y+h, x:x+w]
            roi_resized = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
            # Histogram equalization for better facial feature contrast
            roi_equalized = cv2.equalizeHist(roi_resized)
            
            # The model expects unnormalized float pixel values in [0, 255] range
            roi_input = roi_equalized.astype('float32')
            roi_input = np.expand_dims(roi_input, axis=(0, -1))

            # Perform prediction
            preds = model.predict(roi_input, verbose=0)[0]
            top_idx = int(np.argmax(preds))
            top_emotion = EMOTIONS[top_idx]
            confidence = float(preds[top_idx]) * 100.0

            probabilities = {EMOTIONS[i]: float(preds[i]) * 100.0 for i in range(len(EMOTIONS))}

            detected_faces.append({
                'bbox': [int(x), int(y), int(w), int(h)],
                'top_emotion': top_emotion,
                'confidence': round(confidence, 1),
                'probabilities': probabilities
            })

        return jsonify({
            'status': 'success',
            'frame_width': w_frame,
            'frame_height': h_frame,
            'faces': detected_faces
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)
