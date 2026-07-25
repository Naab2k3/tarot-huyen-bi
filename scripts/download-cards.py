"""
Download Rider-Waite-Smith tarot card images from
lambiengcode/flutter-tarot-card GitHub repo.

Convention:
  m00.jpg - m21.jpg  → Major Arcana (22 cards)
  c01.jpg - c14.jpg  → Cups
  p01.jpg - p14.jpg  → Pentacles
  s01.jpg - s14.jpg  → Swords
  w01.jpg - w14.jpg  → Wands
"""
import os
import urllib.request
import sys

BASE_URL = "https://raw.githubusercontent.com/lambiengcode/flutter-tarot-card/master/images"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "public", "images", "cards")

CARDS = {
    "major": [f"m{i:02d}.jpg" for i in range(22)],
    "cups": [f"c{i:02d}.jpg" for i in range(1, 15)],
    "pentacles": [f"p{i:02d}.jpg" for i in range(1, 15)],
    "swords": [f"s{i:02d}.jpg" for i in range(1, 15)],
    "wands": [f"w{i:02d}.jpg" for i in range(1, 15)],
}

def download():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    total = sum(len(v) for v in CARDS.values())
    downloaded = 0

    for group, files in CARDS.items():
        for fname in files:
            url = f"{BASE_URL}/{fname}"
            out_path = os.path.join(OUTPUT_DIR, fname)
            if os.path.exists(out_path):
                print(f"  EXISTS {fname}")
                downloaded += 1
                continue
            try:
                urllib.request.urlretrieve(url, out_path)
                downloaded += 1
                kb = os.path.getsize(out_path) / 1024
                print(f"  OK {fname} ({kb:.0f} KB)")
            except Exception as e:
                print(f"  FAIL {fname}: {e}", file=sys.stderr)

    print(f"\nDone: {downloaded}/{total} cards → {OUTPUT_DIR}")

if __name__ == "__main__":
    download()
