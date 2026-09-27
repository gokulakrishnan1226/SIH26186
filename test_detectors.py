import cv2
import numpy as np
import os

print("Testing Caffe SSD...")
proto_path = 'models/deploy.prototxt'
caffe_path = 'models/res10_300x300_ssd_iter_140000.caffemodel'
net = cv2.dnn.readNetFromCaffe(proto_path, caffe_path)
print("OK: Caffe ResNet SSD loaded cleanly!")

# Create a test dummy frame (640x480x3 BGR uint8)
frame = np.zeros((480, 640, 3), dtype=np.uint8)
cv2.circle(frame, (320, 240), 80, (200, 200, 200), -1) # Draw a face shape

# Test Caffe SSD forward pass
blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
net.setInput(blob)
detections = net.forward()
print(f"OK: Caffe SSD inference executed cleanly! Output shape: {detections.shape}")

# Test YuNet
yunet_path = 'models/face_detection_yunet_2023mar.onnx'
if hasattr(cv2, 'FaceDetectorYN') and os.path.exists(yunet_path):
    detector = cv2.FaceDetectorYN.create(
        model=yunet_path,
        config='',
        input_size=(640, 480),
        score_threshold=0.3,
        nms_threshold=0.3
    )
    detector.setInputSize((640, 480))
    frame_cont = np.ascontiguousarray(frame, dtype=np.uint8)
    _, det = detector.detect(frame_cont)
    print("OK: YuNet inference executed cleanly!")
