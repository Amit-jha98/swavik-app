from PIL import Image
import numpy as np

img = Image.open('test_key4.png').convert('RGBA')
data = np.array(img)
alpha = data[:,:,3]

total_pixels = alpha.size
transparent_pixels = np.sum(alpha == 0)
opaque_pixels = np.sum(alpha == 255)
semi_transparent = total_pixels - transparent_pixels - opaque_pixels

print(f"Total: {total_pixels}")
print(f"Transparent: {transparent_pixels} ({transparent_pixels/total_pixels*100:.2f}%)")
print(f"Opaque: {opaque_pixels} ({opaque_pixels/total_pixels*100:.2f}%)")
print(f"Semi: {semi_transparent} ({semi_transparent/total_pixels*100:.2f}%)")
