#!/usr/bin/env python3
"""Render localized Open Graph images (1200x630) into assets/studio/og/.
Usage (repository root):  python3 src/tools/og.py
Needs: pip install playwright && python3 -m playwright install chromium
"""
import asyncio, json, os, re, tempfile, pathlib, html
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "src"
cfg = json.loads((SRC / "config.json").read_text("utf-8"))
FONTS = (SRC / "assets" / "fonts").as_uri()
LOGO = (SRC / "assets" / "spectrtech-mark.svg").read_text("utf-8")
OUT = ROOT / "assets" / "studio" / "og"
OUT.mkdir(parents=True, exist_ok=True)

def page(lang, d, direction):
    title = re.sub(r"</?em>", "", d["home"]["title"])
    tag = d["og"]["tagline"]
    eyebrow = d["home"]["eyebrow"]
    disp = "'Kufi Arabic','Plex Arabic'" if lang == "ar" else "'Unbounded'"
    text = "'Plex Arabic'" if lang == "ar" else "'Onest'"
    fans = "".join(
        f'<path d="M1100 560 Q{1100-300+i*9} {300-i*6} {700+i*26} {40+i*3}" stroke="{c}" />'
        for i, c in enumerate(["#F23C5A","#F23C86","#F23CBF","#E33CF2","#AA3CF2","#703CF2","#3C42F2","#3C7CF2","#3CB5F2"]*2))
    return f"""<!doctype html><html lang="{lang}" dir="{direction}"><meta charset="utf-8"><style>
@font-face{{font-family:Unbounded;font-weight:500;src:url({FONTS}/unbounded-latin-500-normal.woff2)}}
@font-face{{font-family:Unbounded;font-weight:500;src:url({FONTS}/unbounded-latin-ext-500-normal.woff2);unicode-range:U+0100-024F,U+1E00-1EFF}}
@font-face{{font-family:Unbounded;font-weight:500;src:url({FONTS}/unbounded-cyrillic-500-normal.woff2);unicode-range:U+0400-045F}}
@font-face{{font-family:Onest;font-weight:400;src:url({FONTS}/onest-latin-400-normal.woff2)}}
@font-face{{font-family:Onest;font-weight:400;src:url({FONTS}/onest-latin-ext-400-normal.woff2);unicode-range:U+0100-024F,U+1E00-1EFF}}
@font-face{{font-family:Onest;font-weight:400;src:url({FONTS}/onest-cyrillic-400-normal.woff2);unicode-range:U+0400-045F}}
@font-face{{font-family:'Plex Arabic';font-weight:400;src:url({FONTS}/ibm-plex-sans-arabic-arabic-400-normal.woff2)}}
@font-face{{font-family:'Kufi Arabic';font-weight:700;src:url({FONTS}/noto-kufi-arabic-arabic-700-normal.woff2)}}
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;background:#0E1124;color:#fff;font-family:{text},sans-serif;position:relative;overflow:hidden}}
.g{{position:absolute;right:-240px;bottom:-420px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(112,60,242,.45),rgba(60,124,242,.15) 45%,transparent 70%)}}
svg.f{{position:absolute;inset:0;opacity:.5}} svg.f path{{fill:none;stroke-width:2}}
[dir=rtl] svg.f{{transform:scaleX(-1)}}
.c{{position:absolute;inset:64px 72px;display:flex;flex-direction:column}}
.logo{{background:#fff;border-radius:16px;padding:10px 18px;align-self:flex-start;height:72px}}
.logo svg{{height:52px;width:auto;display:block}}
.e{{margin-top:auto;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:#A9AECB}}
[lang=ar] .e{{letter-spacing:0}}
h1{{font-family:{disp},sans-serif;font-weight:{700 if lang=='ar' else 500};font-size:{54 if lang!='ar' else 56}px;line-height:{1.15 if lang!='ar' else 1.45};letter-spacing:-.02em;margin:18px 0 22px;max-width:980px}}
.t{{font-size:26px;color:#ECEEFA}}
.bar{{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#F23C5A,#E33CF2 30%,#703CF2 55%,#3C7CF2 78%,#3CB5F2)}}
</style><body><div class="g"></div><svg class="f" viewBox="0 0 1200 630">{fans}</svg>
<div class="c"><div class="logo">{LOGO}</div><div class="e">{html.escape(eyebrow)}</div><h1>{html.escape(title)}</h1><div class="t">{html.escape(tag)} · spectrtech.si</div></div><div class="bar"></div></body></html>"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1200, "height": 630})
        for lang, L in cfg["locales"].items():
            f = SRC / "i18n" / f"{lang}.json"
            if not f.exists():
                continue
            d = json.loads(f.read_text("utf-8"))
            with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as t:
                t.write(page(lang, d, L["dir"]))
            await pg.goto(pathlib.Path(t.name).as_uri())
            await pg.evaluate("document.fonts.ready")
            await pg.screenshot(path=str(OUT / f"og-{lang}.jpg"), type="jpeg", quality=86)
            os.unlink(t.name)
            print("og", lang)
        await b.close()

asyncio.run(main())
