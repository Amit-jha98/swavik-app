from PIL import Image
from pathlib import Path

src = Path('public/media/bottle_types.png')
out_dir = Path('public/media/bottles')
out_dir.mkdir(parents=True, exist_ok=True)
img = Image.open(src).convert('RGBA')
w, h = img.size
# Fixed crop windows based on the 5 x 2 source layout, with generous padding.
cols, rows = 5, 2
cell_w, cell_h = w / cols, h / rows
outputs = []
for row in range(rows):
    for col in range(cols):
        index = row * cols + col + 1
        left = int(max(0, col * cell_w + 8))
        top = int(max(0, row * cell_h + 10))
        right = int(min(w, (col + 1) * cell_w - 8))
        bottom = int(min(h, (row + 1) * cell_h - 10))
        crop = img.crop((left, top, right, bottom))

        # Detect visible pixels to tighten crop while preserving dark bottle bodies.
        px = crop.load()
        min_x, min_y = crop.width, crop.height
        max_x, max_y = 0, 0
        for y in range(crop.height):
            for x in range(crop.width):
                r, g, b, a = px[x, y]
                if a > 0 and max(r, g, b) > 8:
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)
        pad = 12
        if max_x > min_x and max_y > min_y:
            crop = crop.crop((max(0, min_x - pad), max(0, min_y - pad), min(crop.width, max_x + pad), min(crop.height, max_y + pad)))

        # Make only pure/near-pure black background transparent.
        data = []
        for r, g, b, a in crop.getdata():
            if a == 0 or max(r, g, b) <= 3:
                data.append((0, 0, 0, 0))
            else:
                data.append((r, g, b, a))
        crop.putdata(data)

        # Normalize canvas so product cards align nicely.
        canvas = Image.new('RGBA', (260, 360), (0, 0, 0, 0))
        crop.thumbnail((230, 330), Image.Resampling.LANCZOS)
        canvas.alpha_composite(crop, ((canvas.width - crop.width) // 2, (canvas.height - crop.height) // 2))
        out = out_dir / f'bottle-type-{index:02d}.png'
        canvas.save(out)
        outputs.append(f'{out.as_posix()} {canvas.size[0]}x{canvas.size[1]}')
print('\n'.join(outputs))
