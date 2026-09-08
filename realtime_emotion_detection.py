import cv2
import numpy as np
import tensorflow as tf

def main():
    print("Loading TensorFlow model...")
    model = tf.keras.models.load_model('face_model.h5', compile=False)
    print("Model loaded successfully!")

    # Emotion class labels standard for FER-2013 dataset
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

    # Load OpenCV pre-trained Haar Cascade for Face Detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    print("Opening webcam...")
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    print("\nStarting live webcam stream... Press 'q' in the window to quit.\n")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame from webcam.")
            break

        # Convert frame to grayscale for face detection and model input
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(
            gray_frame, 
            scaleFactor=1.3, 
            minNeighbors=5, 
            minSize=(30, 30)
        )

        for (x, y, w, h) in faces:
            # Draw bounding box around the detected face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Crop face region of interest (ROI)
            roi_gray = gray_frame[y:y+h, x:x+w]
            
            # Resize ROI to 48x48 as expected by the model
            roi_resized = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
            
            # Histogram equalization for better facial feature contrast
            roi_equalized = cv2.equalizeHist(roi_resized)
            
            # The model expects unnormalized float pixel values in [0, 255] range
            roi_input = roi_equalized.astype('float32')
            roi_input = np.expand_dims(roi_input, axis=(0, -1))

            # Perform prediction
            predictions = model.predict(roi_input, verbose=0)
            predicted_index = np.argmax(predictions[0])
            predicted_emotion = emotion_labels[predicted_index]
            confidence = predictions[0][predicted_index] * 100

            # Format label string
            label_text = f"{predicted_emotion} ({confidence:.1f}%)"

            # Draw emotion label above face box
            cv2.putText(
                frame, 
                label_text, 
                (x, y - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                0.8, 
                (0, 255, 0), 
                2
            )

        # Display the live stream window
        cv2.imshow('Real-time Emotion Detector', frame)

        # Exit loop if 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Webcam stream stopped.")

if __name__ == '__main__':
    main()
