"""Generate responsive WebP derivatives; keep original source images unchanged.

Run manually after updating public/images: python scripts/optimize-images.py
Requires Pillow 12.3.0 (pip install Pillow==12.3.0).
Generated files are committed, so production builds need no Python runtime.
"""
from pathlib import Path
import json
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source = root / "public/images"
output = source / "optimized"
output.mkdir(exist_ok=True)
manifest = {}
for path in sorted(source.glob("*.png")):
    with Image.open(path) as original:
        img = ImageOps.exif_transpose(original)
        logo = path.stem == "bthander-logo-mark"
        widths = [64, 128] if logo else [480, 800, 1200]
        variants = []
        for width in sorted(set(min(width, img.width) for width in widths)):
            height = round(img.height * width / img.width)
            target = output / f"{path.stem}-{width}.webp"
            img.resize((width, height), Image.Resampling.LANCZOS).save(target, "WEBP", quality=85, method=6)
            variants.append({"url": f"/images/optimized/{target.name}", "width": width})
        manifest[f"/images/{path.name}"] = {
            "src": variants[-1]["url"],
            "srcSet": ", ".join(f"{v['url']} {v['width']}w" for v in variants),
            "width": img.width,
            "height": img.height,
        }
target = root / "src/constants/image-manifest.json"
target.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Generated {len(manifest)} responsive image sets.")
