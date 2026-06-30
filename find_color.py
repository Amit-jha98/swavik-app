import cv2
import numpy as np

cap = cv2.VideoCapture("public/media/on_complete_green_screen_back.mp4")
cap.set(cv2.CAP_PROP_POS_FRAMES, 24)
ret, frame = cap.read()
if ret:
    bg_region = frame[50:150, 50:150]
    avg_color = np.mean(bg_region, axis=(0,1))
    print(f"Average BG BGR color: {avg_color}")
    
    cv2.imwrite("test_frame_24.png", frame)
