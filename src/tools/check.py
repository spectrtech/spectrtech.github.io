#!/usr/bin/env python3
"""SpectrTech QA: links, JS errors, overflow, images, SEO, hreflang, forms, interactions, i18n leftovers.
Usage (repository root):  python3 src/tools/check.py
Starts a local static server on 127.0.0.1:8899. Exit code 1 if anything fails.
"""
import asyncio, json, re, sys, pathlib, threading, functools, http.server, socketserver, html
from urllib.parse import urlparse, unquote
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "src"
cfg = json.loads((SRC / "config.json").read_text("utf-8"))
LOCS = [l for l in cfg["locales"] if (SRC / "i18n" / f"{l}.json").exists()]
D = {l: json.loads((SRC / "i18n" / f"{l}.json").read_text("utf-8")) for l in LOCS}
BASE = "http://127.0.0.1:8899"
fails, warns, passes = [], [], []

def url(l, page):
    b = f"/{cfg['locales'][l]['path']}/" if cfg["locales"][l]["path"] else "/"
    return b if page == "home" else f"{b}{page}/"

PAGES = [(l, p, url(l, p)) for l in LOCS for p in cfg["pages"]]

def serve():
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Q, directory=str(ROOT))
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.ThreadingTCPServer(("127.0.0.1", 8899), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()

def local_exists(path):
    path = unquote(path.split("#")[0].split("?")[0])
    f = ROOT / path.lstrip("/")
    if path.endswith("/"):
        f = f / "index.html"
    return f.exists()

# ---------- static checks ----------
def static_checks():
    ext = set()
    for l, p, u in PAGES:
        f = ROOT / u.lstrip("/") / "index.html"
        s = f.read_text("utf-8")
        tag = f"{u}"
        for m in re.finditer(r'(?:href|src)="([^"]+)"', s):
            v = html.unescape(m.group(1))
            if v.startswith(("mailto:", "tel:", "#", "data:", "javascript:")):
                continue
            if v.startswith("//"):
                ext.add("https:" + v); continue
            if v.startswith("http"):
                if v.startswith(cfg["siteUrl"]):
                    if not local_exists(v[len(cfg["siteUrl"]):] or "/"):
                        fails.append(f"{tag}: broken absolute link {v}")
                else:
                    ext.add(v)
                continue
            if not local_exists(v if v.startswith("/") else u + v):
                fails.append(f"{tag}: broken link {v}")
        # SEO
        title = re.search(r"<title>(.*?)</title>", s)
        desc = re.search(r'<meta name="description" content="([^"]*)"', s)
        if not title or not title.group(1).strip(): fails.append(f"{tag}: no <title>")
        elif len(html.unescape(title.group(1))) > 70: warns.append(f"{tag}: title {len(html.unescape(title.group(1)))} chars")
        if not desc: fails.append(f"{tag}: no description")
        elif not 50 <= len(html.unescape(desc.group(1))) <= 170: warns.append(f"{tag}: description {len(html.unescape(desc.group(1)))} chars")
        if s.count("<h1") != 1: fails.append(f"{tag}: {s.count('<h1')} h1")
        can = re.search(r'<link rel="canonical" href="([^"]+)"', s)
        if not can or can.group(1) != cfg["siteUrl"] + u: fails.append(f"{tag}: canonical mismatch")
        if f'<html lang="{l}" dir="{cfg["locales"][l]["dir"]}"' not in s: fails.append(f"{tag}: html lang/dir")
        for og in ["og:title", "og:description", "og:image", "og:url", "og:locale"]:
            if f'property="{og}"' not in s: fails.append(f"{tag}: missing {og}")
        img = re.search(r'property="og:image" content="([^"]+)"', s)
        if img and not local_exists(img.group(1)[len(cfg["siteUrl"]):]): fails.append(f"{tag}: og:image file missing")
        for j in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
            try: json.loads(j)
            except Exception as e: fails.append(f"{tag}: JSON-LD invalid {e}")
        # hreflang reciprocity
        alts = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', s))
        noindex = 'name="robots" content="noindex' in s
        if not noindex:
            if alts.get(l) != cfg["siteUrl"] + u: fails.append(f"{tag}: hreflang self-reference missing")
            if "x-default" not in alts: fails.append(f"{tag}: x-default missing")
            for x, href in alts.items():
                if x == "x-default": continue
                tf = ROOT / href[len(cfg["siteUrl"]):].lstrip("/") / "index.html"
                if not tf.exists(): fails.append(f"{tag}: hreflang target missing {href}"); continue
                back = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', tf.read_text("utf-8")))
                if back.get(l) != cfg["siteUrl"] + u: fails.append(f"{tag}: hreflang not reciprocal with {x}")
    # sitemap
    sm = (ROOT / "sitemap.xml").read_text("utf-8")
    locs = re.findall(r"<loc>([^<]+)</loc>", sm)
    for v in locs:
        if not local_exists(v[len(cfg["siteUrl"]):] or "/"): fails.append(f"sitemap: missing file for {v}")
    if len(locs) != len(set(locs)): fails.append("sitemap: duplicate URLs")
    rb = (ROOT / "robots.txt").read_text("utf-8")
    if "Sitemap: https://spectrtech.si/sitemap.xml" not in rb: fails.append("robots.txt: sitemap line")
    passes.append(f"static: {len(PAGES)} pages, {len(locs)} sitemap URLs checked")
    return sorted(ext)

# ---------- i18n leftovers ----------
KEEP = re.compile(r"^(READY|EXTEND|REDESIGN|CUSTOM|SpectrTech|Wedding Planner|Coin Drop Tycoon|Moving Planner with QR Box Labels|Telegram|Email|E-mail|DEMO|Instagram|Facebook)$")
# Words that are spelled the same as in English in that language (reviewed).
SAME_OK = {"de": {"Websites", "Status", "Details", "Studio"},
           "fr": {"Menu", "Services", "Contact", "Structure", "Questions", "Guides", "Message", "Studio"}}
def flat(o, p=""):
    if isinstance(o, dict):
        for k, v in o.items(): yield from flat(v, f"{p}.{k}" if p else k)
    elif isinstance(o, list):
        for i, v in enumerate(o): yield from flat(v, f"{p}[{i}]")
    else: yield p, o
def i18n_checks():
    en = dict(flat(D["en"]))
    for l in LOCS:
        if l == "en": continue
        same = [k for k, v in flat(D[l]) if en.get(k) == v and len(v) > 3 and not KEEP.match(v) and v not in SAME_OK.get(l, ())]
        for k in same: warns.append(f"i18n {l}: identical to English at {k}: {en[k][:50]}")
        if l == "ar":
            latin_heavy = [k for k, v in flat(D[l]) if len(re.findall(r"[A-Za-z]", v)) > 0.6 * max(1, len(v)) and not KEEP.match(v) and len(v) > 12]
            for k in latin_heavy: warns.append(f"i18n ar: mostly Latin text at {k}")
    passes.append(f"i18n: {len(LOCS)} dictionaries compared")

# ---------- browser checks ----------
async def browser_checks():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        widths = [360, 390, 768, 1366]
        for w in widths:
            ctx = await b.new_context(viewport={"width": w, "height": 860}, reduced_motion="reduce")
            await ctx.route(re.compile(r"^https?://(?!127\.0\.0\.1)"), lambda r: r.abort())
            pg = await ctx.new_page()
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            bad = []
            pg.on("response", lambda r: r.status >= 400 and r.url.startswith(BASE) and bad.append(f"{r.status} {r.url}"))
            for l, page, u in PAGES:
                errs.clear(); bad.clear()
                await pg.goto(BASE + u, wait_until="load")
                await pg.evaluate("""async()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');
                    for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,15))}
                    await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));window.scrollTo(0,0)}""")
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                if sw > w:
                    culprits = await pg.evaluate(f"""[...document.querySelectorAll('body *')].filter(e=>{{const r=e.getBoundingClientRect();return r.right>{w}+1||r.left<-1}}).slice(0,4).map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right))""")
                    fails.append(f"{u} @{w}: horizontal overflow {sw}px {culprits}")
                broken = await pg.evaluate("[...document.images].filter(i=>!i.naturalWidth).map(i=>i.currentSrc||i.src)")
                for x in broken: fails.append(f"{u} @{w}: image failed {x}")
                for e in errs: fails.append(f"{u} @{w}: JS error {e}")
                for x in bad: fails.append(f"{u} @{w}: HTTP {x}")
                if w == 390:
                    small = await pg.evaluate("""[...document.querySelectorAll('a,button,summary,input,select,textarea')].filter(e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!='hidden'&&r.height<24&&!e.closest('.foot,.lang ul,p,li,dd,label,.pknote,.cmpnote,.note')}).map(e=>e.tagName+' '+(e.textContent||'').trim().slice(0,20))""")
                    for x in small: warns.append(f"{u} @390: small tap target {x}")
            await ctx.close()
        passes.append(f"browser: {len(PAGES)} pages x {len(widths)} widths (overflow, images, JS, HTTP)")

        # interactions
        ctx = await b.new_context(viewport={"width": 390, "height": 860}, locale="ru-RU")
        await ctx.route(re.compile(r"^https?://(?!127\.0\.0\.1)"), lambda r: r.abort())
        pg = await ctx.new_page()
        await pg.goto(BASE + "/")
        await pg.click(".burger")
        if not await pg.is_visible("#nav"): fails.append("mobile menu does not open")
        await pg.keyboard.press("Escape")
        if await pg.is_visible("#nav"): fails.append("mobile menu does not close on Escape")
        if "ru" in LOCS:
            vis = await pg.is_visible("#langbar")
            href = await pg.get_attribute("#langbar a", "href")
            if not vis or href != "/ru/": fails.append(f"language suggestion banner (ru browser) visible={vis} href={href}")
            await pg.click("#langbar button")
            await pg.reload()
            if await pg.is_visible("#langbar"): fails.append("banner reappears after dismiss")
        await pg.click(".seg button[data-show=social]")
        if await pg.get_attribute(".cmp", "data-show") != "social" or not await pg.is_visible(".cmp td.social"): fails.append("compare toggle")
        await pg.goto(BASE + "/projects/")
        await pg.click("#wedding .thumbs button:nth-child(2)")
        src = await pg.get_attribute("#wedding .main img", "src")
        if "seating-close" not in src: fails.append("gallery thumbnail switch")
        # form
        await pg.goto(BASE + "/contact/?package=extend")
        if await pg.eval_on_selector("#f-interest", "e=>e.selectedOptions[0].dataset.pkg") != "extend": fails.append("contact: ?package preselect")
        await pg.click("#lead [type=submit]")
        inv = await pg.eval_on_selector_all("#lead [aria-invalid=true]", "e=>e.map(x=>x.id)")
        if set(inv) != {"f-name", "f-email", "f-message", "f-consent"}: fails.append(f"form validation flags {inv}")
        await pg.evaluate("window.ST.go=u=>{window.__mail=u}")
        await pg.fill("#f-name", "Test Person"); await pg.fill("#f-email", "bad")
        await pg.fill("#f-message", "Hello"); await pg.check("#f-consent")
        await pg.click("#lead [type=submit]")
        if await pg.get_attribute("#f-email", "aria-invalid") != "true": fails.append("form: invalid email accepted")
        await pg.fill("#f-email", "test@example.com"); await pg.fill("#f-company", "ACME")
        await pg.click("#lead [type=submit]")
        mail = await pg.evaluate("window.__mail")
        if not mail or not mail.startswith("mailto:to@spectrtech.si?subject=") or "ACME" not in unquote(mail): fails.append(f"form: mailto not built ({mail})")
        if "ok" not in (await pg.get_attribute(".fstat", "class")): fails.append("form: status message not shown")
        # RTL
        if "ar" in LOCS:
            await pg.goto(BASE + "/ar/")
            d = await pg.evaluate("getComputedStyle(document.body).direction")
            if d != "rtl": fails.append("ar: body direction not rtl")
            ff = await pg.evaluate("getComputedStyle(document.querySelector('h1')).fontFamily")
            if "Kufi" not in ff: fails.append(f"ar: heading font {ff}")
        # keyboard: skip link
        await pg.goto(BASE + "/")
        await pg.keyboard.press("Tab")
        if await pg.evaluate("document.activeElement.className") != "skip": fails.append("skip link is not first focusable")
        await ctx.close()
        passes.append("interactions: menu, language banner, compare, gallery, form validation + mailto, RTL, skip link")
        await b.close()

serve()
ext = static_checks()
i18n_checks()
asyncio.run(browser_checks())
print("PASS:"); [print("  ✓", x) for x in passes]
print(f"WARN ({len(warns)}):"); [print("  !", x) for x in warns[:80]]
print(f"FAIL ({len(fails)}):"); [print("  ✗", x) for x in fails[:120]]
print(f"External links not verified from here ({len(ext)}):"); [print("   ", x) for x in ext]
sys.exit(1 if fails else 0)
