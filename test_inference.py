import numpy as np
import tensorflow as tf

def test_model():
    print("Loading model...")
    model = tf.keras.models.load_model('face_model.h5', compile=False)
    print("Model input shape requirement:", model.input_shape)

    # Determine input shape expected by the model
    # Usually (None, height, width, channels)
    input_shape = model.input_shape
    if len(input_shape) == 4:
        batch, h, w, c = input_shape
        h = h if h is not None else 48
        w = w if w is not None else 48
        c = c if c is not None else 1
    else:
        h, w, c = 48, 48, 1

    print(f"Creating dummy input image of shape (1, {h}, {w}, {c})...")
    dummy_input = np.random.rand(1, h, w, c).astype(np.float32)

    print("Running model prediction...")
    predictions = model.predict(dummy_input)
    print("Predictions shape:", predictions.shape)
    print("Prediction raw outputs (probabilities / logits):")
    print(predictions[0])

    emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
    if predictions.shape[1] == len(emotions):
        predicted_class_idx = np.argmax(predictions[0])
        print(f"\nPredicted Emotion Index: {predicted_class_idx}")
        print(f"Predicted Emotion Label: {emotions[predicted_class_idx]}")

if __name__ == '__main__':
    test_model()
