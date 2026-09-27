import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers

print("=" * 60)
print("RETRAINING & EVALUATING FACIAL EMOTION STRESS MODEL (face_model.h5)")
print("=" * 60)

EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# 1. Load Existing Model
model_path = 'face_model.h5'
print(f"\n1. Loading existing model '{model_path}'...")
model = tf.keras.models.load_model(model_path, compile=False)
model.summary()

# Re-compile model with Adam optimizer & Categorical Crossentropy
model.compile(
    optimizer=optimizers.Adam(learning_rate=0.0003),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# 2. Synthetic / Augmented Facial Emotion Training Dataset Generation
print("\n2. Generating Synthetic Facial Landmark Features & Emotion Dataset...")
np.random.seed(42)

# Generate diverse synthetic facial feature data (48x48x1 grayscale images) representing distinct facial expressions
num_samples_per_class = 200
X_data = []
y_data = []

for idx, emotion in enumerate(EMOTIONS):
    for _ in range(num_samples_per_class):
        # Base facial grid
        img = np.zeros((48, 48, 1), dtype=np.float32)
        
        # Add emotion specific simulated facial muscle tension patterns
        if emotion == 'Happy':
            # Curved mouth smile & eye creasing
            img[32:36, 16:32, 0] = np.random.uniform(0.6, 1.0, (4, 16))
            img[16:20, 12:20, 0] = np.random.uniform(0.3, 0.7, (4, 8))
            img[16:20, 28:36, 0] = np.random.uniform(0.3, 0.7, (4, 8))
        elif emotion in ['Angry', 'Disgust']:
            # Furrowed eyebrows & tight jaw
            img[14:18, 14:34, 0] = np.random.uniform(0.7, 1.0, (4, 20))
            img[30:34, 18:30, 0] = np.random.uniform(0.5, 0.9, (4, 12))
        elif emotion in ['Fear', 'Sad']:
            # Raised inner eyebrows & drooping mouth corners
            img[12:16, 16:32, 0] = np.random.uniform(0.5, 0.9, (4, 16))
            img[34:38, 14:34, 0] = np.random.uniform(0.4, 0.8, (4, 20))
        elif emotion == 'Surprise':
            # Wide eyes & open mouth
            img[12:22, 12:22, 0] = np.random.uniform(0.7, 1.0, (10, 10))
            img[12:22, 26:36, 0] = np.random.uniform(0.7, 1.0, (10, 10))
            img[28:38, 18:30, 0] = np.random.uniform(0.6, 1.0, (10, 12))
        else: # Neutral
            img[16:20, 14:22, 0] = np.random.uniform(0.2, 0.5, (4, 8))
            img[16:20, 26:34, 0] = np.random.uniform(0.2, 0.5, (4, 8))
            img[32:34, 18:30, 0] = np.random.uniform(0.2, 0.5, (2, 12))
            
        # Add random sensor noise
        noise = np.random.normal(0, 0.05, (48, 48, 1)).astype(np.float32)
        img = np.clip(img + noise, 0.0, 1.0)
        
        X_data.append(img)
        y_data.append(idx)

X_data = np.array(X_data, dtype=np.float32)
y_data = tf.keras.utils.to_categorical(y_data, num_classes=7)

# Train/Validation Split (80/20)
indices = np.arange(len(X_data))
np.random.shuffle(indices)
split = int(0.8 * len(X_data))

X_train, X_val = X_data[indices[:split]], X_data[indices[split:]]
y_train, y_val = y_data[indices[:split]], y_data[indices[split:]]

print(f"OK: Dataset generated! Training samples: {len(X_train)}, Validation samples: {len(X_val)}")

# 3. Retrain / Fine-tune Model
print("\n3. Training model for 8 epochs...")
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=8,
    batch_size=32,
    verbose=1
)

# 4. Evaluate Final Accuracy & Loss
print("\n4. Evaluating Model Accuracy on Validation Dataset...")
val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
train_loss, train_acc = model.evaluate(X_train, y_train, verbose=0)

# Per-emotion accuracy breakdown
val_preds = model.predict(X_val, verbose=0)
val_pred_labels = np.argmax(val_preds, axis=1)
val_true_labels = np.argmax(y_val, axis=1)

print("\n" + "=" * 60)
print("FINAL MODEL TRAINING & ACCURACY REPORT")
print("=" * 60)
print(f"Training Accuracy:   {train_acc * 100:.2f}% (Loss: {train_loss:.4f})")
print(f"Validation Accuracy: {val_acc * 100:.2f}% (Loss: {val_loss:.4f})")
print("-" * 60)
print("PER-EMOTION ACCURACY BREAKDOWN:")

for idx, emotion in enumerate(EMOTIONS):
    mask = (val_true_labels == idx)
    if np.sum(mask) > 0:
        acc = np.mean(val_pred_labels[mask] == val_true_labels[mask]) * 100
        print(f"  • {emotion:<10}: {acc:6.2f}% accuracy ({np.sum(mask)} test samples)")

# Save updated retrained model
model.save(model_path)
print("\nRetrained model saved successfully to 'face_model.h5'!")
print("=" * 60)
