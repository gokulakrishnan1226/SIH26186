import tensorflow as tf

def main():
    print("Loading model...")
    model = tf.keras.models.load_model('face_model.h5', compile=False)
    print("Model loaded successfully!")
    model.summary()

if __name__ == "__main__":
    main()
