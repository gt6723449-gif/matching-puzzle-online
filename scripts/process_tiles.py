from collections import deque
from pathlib import Path
from PIL import Image

TILES = Path(__file__).resolve().parents[1] / "public" / "tiles"


def is_background(pixel):
    red, green, blue, alpha = pixel
    return alpha == 0 or (min(red, green, blue) >= 225 and max(red, green, blue) - min(red, green, blue) <= 22)


def remove_connected_background(image):
    image = image.convert("RGBA")
    pixels = image.load()
    width, height = image.size
    queue = deque()
    visited = bytearray(width * height)

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if visited[index]:
            continue
        visited[index] = 1
        if not is_background(pixels[x, y]):
            continue
        red, green, blue, _ = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)
        if x: queue.append((x - 1, y))
        if x + 1 < width: queue.append((x + 1, y))
        if y: queue.append((x, y - 1))
        if y + 1 < height: queue.append((x, y + 1))

    return image


for source in sorted(TILES.glob("*.png")):
    with Image.open(source) as original:
        image = original.convert("RGBA")
        image.thumbnail((512, 512), Image.Resampling.LANCZOS)
        image = remove_connected_background(image)
        output = source.with_suffix(".webp")
        image.save(output, "WEBP", quality=82, method=6, exact=True)
        print(f"{output.name}: {output.stat().st_size // 1024} KB")
