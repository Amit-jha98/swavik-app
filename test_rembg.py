import cv2
from rembg import remove
import time

print("Loading rembg...")
start = time.time()
frame = cv2.imread('test_frame_24.png')
print(f"Loaded image in {time.time() - start:.2f}s")

# convert to rgb
rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

print("Starting removal...")
r_start = time.time()
output = remove(rgb_frame, post_process_mask=True, bgcolor=(0,0,0,0))
print(f"Removal took {time.time() - r_start:.2f}s")

# output is rgba, convert to bgra for opencv
bgra_frame = cv2.cvtColor(output, cv2.COLOR_RGBA2BGRA)
cv2.imwrite('rembg_test_24.png', bgra_frame)
print("Done!")
