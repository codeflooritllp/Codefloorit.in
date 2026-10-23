"""Draws one 1200x630 social preview per Insights article into public/og/<slug>.png.
Re-run after adding or retitling an article:  python scripts/og-images.py   (needs Pillow)"""
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
FONT = ROOT / "node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2"
W, H, PAD = 1200, 630, 80
NAVY, INK, CYAN, BLUE, MUTED = (11, 19, 34), (16, 36, 58), (0, 212, 255), (22, 119, 255), (148, 166, 190)

articles = json.loads(subprocess.check_output(
    ["node", "-e", "import('./src/data/insights.js').then(m=>console.log(JSON.stringify(m.articles)))"], cwd=ROOT))


def font(size, weight):
    f = ImageFont.truetype(str(FONT), size)
    f.set_variation_by_axes([weight])
    return f


def wrap(draw, text, f, width):
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=f) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    return lines + [line]


def background():
    # vertical wash from navy to ink
    img = Image.new("RGB", (W, H), NAVY)
    img.paste(Image.new("RGB", (W, H), INK), mask=Image.linear_gradient("L").resize((W, H)))
    # soft cyan/blue glows, top right and bottom left
    glow = Image.new("RGB", (W, H))
    g = ImageDraw.Draw(glow)
    g.ellipse((780, -260, 1460, 360), fill=(0, 120, 160))
    g.ellipse((-300, 420, 360, 900), fill=(10, 60, 150))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    img = Image.composite(glow, img, glow.convert("L").point(lambda v: min(255, v * 3)))
    # faint grid, the site's neon-floor motif
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, W, 60):
        d.line((x, 0, x, H), fill=(255, 255, 255, 10))
    for y in range(0, H, 60):
        d.line((0, y, W, y), fill=(255, 255, 255, 10))
    # accent bar along the bottom, cyan to blue
    ramp = Image.linear_gradient("L").rotate(90).resize((W, 8))
    img.paste(Image.composite(Image.new("RGB", (W, 8), BLUE), Image.new("RGB", (W, 8), CYAN), ramp), (0, H - 8))
    return img


def card(a, bg, logo):
    img = bg.copy()
    d = ImageDraw.Draw(img, "RGBA")
    img.paste(logo, (PAD - 6, 56), logo)

    pill_f = font(24, 600)
    label = a["categoryLabel"].upper()
    tw = d.textlength(label, font=pill_f) + 3 * len(label)
    d.rounded_rectangle((PAD, 196, PAD + tw + 36, 240), radius=22, fill=(0, 212, 255, 28), outline=(0, 212, 255, 140), width=2)
    x = PAD + 18
    for ch in label:  # letter-spaced
        d.text((x, 205), ch, font=pill_f, fill=CYAN)
        x += d.textlength(ch, font=pill_f) + 3

    for size in (68, 60, 54, 48):
        title_f = font(size, 700)
        lines = wrap(d, a["title"], title_f, W - 2 * PAD)
        if len(lines) <= 3:
            break
    y = 272
    for line in lines:
        d.text((PAD, y), line, font=title_f, fill=(255, 255, 255))
        y += int(size * 1.14)

    meta_f = font(26, 500)
    d.text((PAD, H - 80), f"Insights  ·  {a['readMins']} min read", font=meta_f, fill=MUTED)
    site = "codefloorit.in"
    d.text((W - PAD - d.textlength(site, font=meta_f), H - 80), site, font=meta_f, fill=(255, 255, 255))
    return img


OUT.mkdir(exist_ok=True)
logo = Image.open(ROOT / "public/logo.png").convert("RGBA")
logo = logo.resize((int(logo.width * 104 / logo.height), 104), Image.LANCZOS)
bg = background()
for a in articles:
    card(a, bg, logo).save(OUT / f"{a['slug']}.png", optimize=True)
print(f"wrote {len(articles)} images to {OUT.relative_to(ROOT)}")
