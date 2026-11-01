#!/usr/bin/env python3
"""Skywell static site -> Tilda Vibe blocks (tplid 1370).
Writes blocks/<page>-NN-<name>.html, head/<page>.html, meta.json"""
import json, os, re, sys

SRC = '/home/claude/spectrtech.github.io/skywell'
OUT = os.path.dirname(os.path.abspath(__file__))
MAP = json.load(open(os.path.join(OUT, 'map.json')))
PAGES = {'index': ('index.html', '/'), 'et5': ('et5.html', '/et5'), 'hti': ('ht-i.html', '/ht-i')}
HDR_H = 69
SHA = sys.argv[1] if len(sys.argv) > 1 else 'main'
CDN = 'https://cdn.jsdelivr.net/gh/spectrtech/spectrtech.github.io@%s/skywell/tilda/' % SHA


def links(s):
    s = re.sub(r'(?<![\w/.-])index\.html', '/', s)
    s = re.sub(r'(?<![\w/.-])et5\.html', '/et5', s)
    s = re.sub(r'(?<![\w/.-])ht-i\.html', '/ht-i', s)
    return s


def imgs(s):
    for k in sorted(MAP, key=len, reverse=True):
        v = MAP[k]
        s = s.replace(k.replace('&', '&amp;'), v).replace(k, v)
        if k.startswith('https://wsrv'):  # JSON-escaped / variants
            s = s.replace(k.replace('/', '\\/'), v)
    return s


# ---------- CSS: scope everything under #allrecords ----------
def scope_sel(sel):
    out = []
    for s in sel.split(','):
        s = s.strip()
        if not s:
            continue
        if s == ':root' or s == 'body':
            out.append('#allrecords')
        elif s.startswith('html'):
            out.append(s)
        elif s.startswith('body'):
            out.append('#allrecords' + s[4:])
        else:
            out.append('#allrecords ' + s)
    return ','.join(out)


def scope_css(css):
    res, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0:
            res.append(css[i:]); break
        head = css[i:j].strip()
        if head.startswith('@media') or head.startswith('@supports'):
            depth, k = 1, j + 1
            while depth:
                if css[k] == '{': depth += 1
                elif css[k] == '}': depth -= 1
                k += 1
            res.append(head + '{' + scope_css(css[j + 1:k - 1]) + '}')
            i = k
        elif head.startswith('@'):
            depth, k = 1, j + 1
            while depth:
                if css[k] == '{': depth += 1
                elif css[k] == '}': depth -= 1
                k += 1
            res.append(css[i:k].strip()); i = k
        else:
            k = css.find('}', j)
            res.append(scope_sel(head) + css[j:k + 1]); i = k + 1
    return ''.join(res)


css = open(f'{SRC}/assets/app.css').read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
css = scope_css(css)
css = css.replace('overflow-x:hidden}', 'overflow-x:clip}', 1) if '#allrecords{margin:0' in css else css
css = re.sub(r'(#allrecords\{margin:0;[^}]*?)overflow-x:hidden', r'\1overflow-x:clip', css)
css = re.sub(r'#allrecords \.hd\{position:sticky;top:0;', '#allrecords .hd{position:fixed;left:0;right:0;top:0;', css)
css = imgs(css)
css += ('#allrecords .sw-sp{height:%dpx}' % HDR_H +
        'html{scroll-padding-top:%dpx}' % (HDR_H + 12) +
        '#allrecords[data-tilda-mode="edit"] .hd{position:relative}'
        '#allrecords[data-tilda-mode="edit"] .sw-sp{display:none}'
        '#allrecords[data-tilda-mode="edit"] .rv{opacity:1;transform:none}'
        '#allrecords .t-rec{background:var(--bg)}')

js = {f: open(f'{SRC}/assets/{f}').read() for f in ('i18n.js', 'data.js', 'app.js')}
js = {k: imgs(links(v)) for k, v in js.items()}
for k in js:
    js[k] = js[k].replace('</script', '<\\/script')


os.makedirs(f'{SRC}/tilda', exist_ok=True)
open(f'{SRC}/tilda/sw.css', 'w').write(css)
open(f'{SRC}/tilda/sw.js', 'w').write(
    '/* Skywell Azerbaijan — Tilda build. Source: skywell/_src, assets/*.js */\n'
    '(function(){var m=document.querySelector("[data-sw-page]");if(m&&!document.body.getAttribute("data-page"))document.body.setAttribute("data-page",m.getAttribute("data-sw-page"));})();\n'
    + js['i18n.js'] + '\n' + js['data.js'] + '\n' + js['app.js'])


def top_elems(html):
    """split html into top-level elements (start,end) — simple depth tracker"""
    void = {'img', 'br', 'meta', 'link', 'input', 'source', 'hr', 'wbr', 'area', 'col', 'embed', 'track', 'path',
            'circle', 'rect', 'line', 'polyline', 'polygon', 'use', 'stop'}
    parts, depth, start = [], 0, None
    for m in re.finditer(r'<(/?)([a-zA-Z][\w-]*)([^>]*?)(/?)>|<!--.*?-->', html, re.S):
        if m.group(0).startswith('<!--'):
            continue
        close, tag, selfc = m.group(1), m.group(2).lower(), m.group(4)
        if tag in void or selfc:
            if depth == 0:
                parts.append((m.start(), m.end()))
            continue
        if not close:
            if depth == 0: start = m.start()
            depth += 1
        else:
            depth -= 1
            if depth == 0: parts.append((start, m.end()))
    return [html[a:b] for a, b in parts]


meta = {}
os.makedirs(f'{OUT}/blocks', exist_ok=True)
os.makedirs(f'{OUT}/head', exist_ok=True)
for pid, (fn, url) in PAGES.items():
    s = open(f'{SRC}/{fn}').read()
    head = s[:s.index('</head>')]
    g = lambda pat: (re.search(pat, head, re.S) or [None, ''])[1]
    meta[pid] = {
        'title': g(r'<title>(.*?)</title>'),
        'descr': g(r'<meta name="description" content="(.*?)">'),
        'og_title': g(r'<meta property="og:title" content="(.*?)">'),
        'og_descr': g(r'<meta property="og:description" content="(.*?)">'),
        'alias': url.strip('/'),
    }
    ld = re.findall(r'<script type="application/ld\+json">.*?</script>', head, re.S)
    hc = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
          '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
          '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&display=swap">\n'
          '<link rel="stylesheet" href="' + CDN + 'sw.css">\n'
          '<meta name="theme-color" content="#0A111B">\n' + '\n'.join(ld))
    open(f'{OUT}/head/{pid}.html', 'w').write(imgs(hc))

    body = s[s.index('>', s.index('<body')) + 1:s.index('</body>')]
    body = re.sub(r'<script\b[^>]*>.*?</script>\s*', '', body, flags=re.S)
    els = top_elems(body)
    blocks = []
    hdr = []
    for e in els:
        if e.startswith('<a class="skip"') or e.startswith('<header'):
            hdr.append(e); continue
        if e.startswith('<main'):
            inner = e[e.index('>') + 1:e.rindex('</main>')]
            secs = top_elems(inner)
            for i, sec in enumerate(secs):
                blocks.append(sec)
            continue
        blocks.append(e)
    # skip link target: first section id
    first = blocks[0]
    fid = re.search(r'^<\w+[^>]*\sid="([^"]+)"', first)
    if fid:
        hdr[0] = hdr[0].replace('href="#main"', 'href="#%s"' % fid.group(1))
    else:
        blocks[0] = re.sub(r'^<(\w+)', r'<\1 id="main"', first, count=1)
    hdr_html = '\n'.join(hdr) + '\n<div class="sw-sp" aria-hidden="true"></div>'
    hdr_html = hdr_html.replace('<header class="hd"', '<header class="hd" data-sw-page="%s"' % pid, 1)
    out = [('header', hdr_html)]
    for b in blocks:
        m = re.match(r'<(\w+)([^>]*)>', b)
        idm = re.search(r'\sid="([^"]+)"', m.group(2))
        clm = re.search(r'\sclass="([^"]+)"', m.group(2))
        name = (idm and idm.group(1)) or (clm and clm.group(1).split()[0]) or m.group(1)
        out.append((name, b))
    # forms that send nothing through Tilda
    out = [(n, re.sub(r'<form\b([^>]*?)class="([^"]*)"', r'<form\1class="\2 t-form-off"', h)) for n, h in out]
    out = [(n, h if 't-form-off' in h or '<form' not in h else h.replace('<form ', '<form class="t-form-off" ', 1)) for n, h in out]
    # scripts into the last block
    scr = '<script src="' + CDN + 'sw.js"></script>'
    n, h = out[-1]
    out[-1] = (n, h + '\n' + scr)
    files = []
    for i, (n, h) in enumerate(out):
        h = imgs(links(h))
        f = f'{pid}-{i:02d}-{re.sub(r"[^a-z0-9-]", "", n.lower())}.html'
        open(f'{OUT}/blocks/{f}', 'w').write(h)
        files.append(f)
    meta[pid]['blocks'] = files
json.dump(meta, open(f'{OUT}/meta.json', 'w'), ensure_ascii=False, indent=1)
for pid in meta:
    print(pid, meta[pid]['alias'], [(f, os.path.getsize(f'{OUT}/blocks/{f}')) for f in meta[pid]['blocks']])
