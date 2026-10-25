#!/usr/bin/env node
// SpectrTech Global — static site generator.
// Usage: node src/build.mjs   (run from the repository root)
// Generates the studio pages for every locale into the repository root,
// copies studio assets and rewrites sitemap.xml. Legacy product/blog/tool pages are never touched.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, "..");
const rd = (p) => JSON.parse(fs.readFileSync(path.join(SRC, p), "utf8"));
const cfg = rd("config.json");
const markets = rd("data/markets.json");
const data = rd("data/projects.json");
const LOCS = Object.keys(cfg.locales).filter((l) => {
  const ok = fs.existsSync(path.join(SRC, `i18n/${l}.json`));
  if (!ok) console.warn(`[i18n] ${l}: dictionary missing — locale skipped`);
  return ok;
});
const DEF = cfg.defaultLocale;
const dict = Object.fromEntries(LOCS.map((l) => [l, rd(`i18n/${l}.json`)]));

/* ---------- translation completeness ---------- */
function compare(ref, val, at, out) {
  if (Array.isArray(ref)) {
    if (!Array.isArray(val) || val.length !== ref.length) return out.push(`${at}: array length`);
    ref.forEach((r, i) => compare(r, val[i], `${at}[${i}]`, out));
  } else if (ref && typeof ref === "object") {
    if (!val || typeof val !== "object") return out.push(`${at}: missing`);
    for (const k of Object.keys(ref)) compare(ref[k], val[k], at ? `${at}.${k}` : k, out);
  } else if (typeof val !== "string" || !val.trim()) out.push(`${at}: empty`);
  else {
    const tags = (s) => (s.match(/<\/?[a-z]+>/g) || []).sort().join();
    if (tags(ref) !== tags(val)) out.push(`${at}: markup differs`);
  }
}
const complete = {};
let problems = 0;
for (const l of LOCS) {
  const out = [];
  compare(dict[DEF], dict[l], "", out);
  complete[l] = out.length === 0;
  if (out.length) { problems += out.length; console.warn(`[i18n] ${l}: ${out.length} problem(s) — locale set to noindex and left out of hreflang/sitemap\n  ` + out.slice(0, 12).join("\n  ")); }
}
const LIVE = LOCS.filter((l) => complete[l]);

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = (s) => String(s).replace(/<[^>]+>/g, "");
const base = (l) => (cfg.locales[l].path ? `/${cfg.locales[l].path}/` : "/");
const url = (l, page, hash = "") => (page === "home" ? base(l) : `${base(l)}${page}/`) + hash;
const abs = (u) => cfg.siteUrl + u;
const hash = (f) => crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 8);
const arrow = '<span class="arr" aria-hidden="true">→</span>';

function price(l, id) {
  const mk = markets[cfg.locales[l].market];
  const p = mk.packages[id];
  const T = dict[l].ui;
  if (!p || p.price == null) return { html: esc(T.priceOnRequest), value: null, currency: mk.currency };
  const fmtLocale = cfg.locales[l].currencyLocale || cfg.locales[l].intl;
  const f = new Intl.NumberFormat(fmtLocale, { style: "currency", currency: mk.currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(p.price);
  return { html: (p.from ? `${esc(T.from)} ` : "") + `<bdi dir="ltr">${esc(f)}</bdi>`, value: p.price, currency: mk.currency };
}

/* ---------- assets ---------- */
const ASSET_DIR = path.join(ROOT, "assets/studio");
fs.mkdirSync(path.join(ASSET_DIR, "fonts"), { recursive: true });
for (const f of ["studio.css", "studio.js", "spectrtech-mark.svg"]) fs.copyFileSync(path.join(SRC, "assets", f), path.join(ASSET_DIR, f));
const fontSrc = path.join(SRC, "assets/fonts");
for (const f of fs.readdirSync(fontSrc)) fs.copyFileSync(path.join(fontSrc, f), path.join(ASSET_DIR, "fonts", f));
const V = { css: hash(path.join(ASSET_DIR, "studio.css")), js: hash(path.join(ASSET_DIR, "studio.js")) };
const PRELOAD = {
  latin: ["onest-latin-400-normal.woff2", "unbounded-latin-500-normal.woff2"],
  cyrillic: ["onest-cyrillic-400-normal.woff2", "unbounded-cyrillic-500-normal.woff2"],
  arabic: ["ibm-plex-sans-arabic-arabic-400-normal.woff2", "noto-kufi-arabic-arabic-700-normal.woff2"],
};
const preloadFor = (l) => (l === "ru" ? PRELOAD.cyrillic : l === "ar" ? PRELOAD.arabic : PRELOAD.latin);

/* ---------- layout ---------- */
const ICON_GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';

function head(l, page, { jsonld = [] } = {}) {
  const L = cfg.locales[l];
  const m = dict[l].meta[page];
  const canonical = abs(url(l, page));
  const indexable = complete[l];
  const alts = indexable
    ? LIVE.map((x) => `<link rel="alternate" hreflang="${x}" href="${abs(url(x, page))}">`).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${abs(url(DEF, page))}">`
    : "";
  const ogImg = abs(`/assets/studio/og/og-${l}.jpg`);
  const ogAlts = LIVE.filter((x) => x !== l).map((x) => `<meta property="og:locale:alternate" content="${cfg.locales[x].og}">`).join("");
  const verify = l === DEF && page === "home"
    ? '<meta name="p:domain_verify" content="30a823c3a57715d7f0f37f142a7b5971">\n<meta name="google-site-verification" content="Lp4IV_xpd2NWidDV3CBiDsDTsr1pPp-sfIxkhxxz4iQ">\n' : "";
  return `<!DOCTYPE html>
<html lang="${l}" dir="${L.dir}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${verify}<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.desc)}">
${indexable ? "" : '<meta name="robots" content="noindex, follow">\n'}<link rel="canonical" href="${canonical}">
${alts}
<meta property="og:type" content="website">
<meta property="og:site_name" content="SpectrTech">
<meta property="og:title" content="${esc(m.title)}">
<meta property="og:description" content="${esc(m.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${L.og}">${ogAlts}
<meta property="og:image" content="${ogImg}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0E1124">
<link rel="icon" href="/assets/spectrtech-avatar.jpg">
${preloadFor(l).map((f) => `<link rel="preload" href="/assets/studio/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
<link rel="stylesheet" href="/assets/studio/studio.css?v=${V.css}">
<script>document.documentElement.classList.remove("no-js")</script>
<script defer src="/assets/studio/studio.js?v=${V.js}"></script>
<script data-goatcounter="https://spectrtech.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>`;
}

function langAlt(l, page) {
  const o = {};
  for (const x of LIVE) if (x !== l) o[x] = { url: url(x, page), text: dict[x].ui.bannerText, cta: dict[x].ui.bannerSwitch, stay: dict[x].ui.bannerDismiss, dir: cfg.locales[x].dir };
  return o;
}

function header(l, page) {
  const T = dict[l].ui;
  const cur = (p) => (p === page ? ' aria-current="page"' : "");
  const langs = LIVE.concat(complete[l] ? [] : [l]).map((x) =>
    `<li><a href="${url(x, page)}" hreflang="${x}" lang="${x}"${x === l ? ' aria-current="true"' : ""}>${esc(cfg.locales[x].name)}<small>${x}</small></a></li>`).join("");
  return `<body>
<a class="skip" href="#main">${esc(T.skip)}</a>
<div class="langbar" id="langbar" hidden><div class="wrap"><span data-t></span><a href="#"></a><button type="button"></button></div></div>
<script>window.ST={alt:${JSON.stringify(langAlt(l, page)).replace(/</g, "\\u003c")}}</script>
<header class="top"><div class="wrap">
<a class="logo" href="${url(l, "home")}" aria-label="SpectrTech — ${esc(T.home)}"><img src="/assets/studio/spectrtech-mark.svg" alt="SpectrTech" width="134" height="40"></a>
<button class="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="${esc(T.menu)}" data-open="${esc(T.menu)}" data-close="${esc(T.close)}"><span></span></button>
<nav class="nav" id="nav" aria-label="${esc(T.home)}">
<a href="${url(l, "home", "#services")}">${esc(T.services)}</a>
<a href="${url(l, "websites")}"${cur("websites")}>${esc(T.websites)}</a>
<a href="${url(l, "projects")}"${cur("projects")}>${esc(T.projects)}</a>
<details class="lang"><summary aria-label="${esc(T.language)}: ${esc(cfg.locales[l].name)}">${ICON_GLOBE}<span>${l.toUpperCase()}</span></summary><ul>${langs}</ul></details>
<a class="btn" href="${url(l, "contact")}"${cur("contact")}>${esc(T.startProject)}</a>
</nav>
</div></header>
<main id="main">`;
}

function footer(l) {
  const F = dict[l].footer, T = dict[l].ui, P = dict[l].projects;
  const y = 2026;
  return `</main>
<footer class="foot"><div class="wrap">
<div class="cols">
<div class="about"><a class="logo" href="${url(l, "home")}"><img src="/assets/studio/spectrtech-mark.svg" alt="SpectrTech" width="134" height="40" loading="lazy"></a><p>${esc(F.tagline)}</p></div>
<nav aria-label="${esc(F.studio)}"><h2>${esc(F.studio)}</h2><ul>
<li><a href="${url(l, "websites")}">${esc(T.websites)}</a></li>
<li><a href="${url(l, "websites", "#process")}">${esc(T.process)}</a></li>
<li><a href="${url(l, "websites", "#packages")}">${esc(dict[l].websites.packagesTitle)}</a></li>
<li><a href="${url(l, "contact")}">${esc(T.contact)}</a></li></ul></nav>
<nav aria-label="${esc(F.products)}"><h2>${esc(F.products)}</h2><ul>
${data.products.map((p) => `<li><a href="${p.page}" hreflang="en">${esc(P.items[p.id].name)}</a></li>`).join("")}
<li><a href="/tools/" hreflang="en">${esc(P.tools)}</a></li>
<li><a href="/blog/" hreflang="en">${esc(P.guides)}</a></li>
<li><a href="/affiliates/" hreflang="en">${esc(P.affiliates)}</a></li></ul></nav>
<div><h2>${esc(T.contact)}</h2><ul>
<li><a href="mailto:${cfg.contact.email}"><bdi dir="ltr">${cfg.contact.email}</bdi></a></li>
<li><a href="${url(l, "privacy")}">${esc(F.privacy)}</a></li></ul></div>
</div>
<div class="bottom"><span>© ${y} SpectrTech. ${esc(F.rights)}</span>
<nav class="soc" aria-label="${esc(F.follow)}">${cfg.social.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener me">${n}</a>`).join("")}</nav></div>
</div></footer>
</body>
</html>
`;
}

const ORG = {
  "@type": "Organization", "@id": cfg.siteUrl + "/#org", name: "SpectrTech", url: cfg.siteUrl + "/",
  logo: cfg.siteUrl + "/assets/spectrtech-logo.png", email: cfg.contact.email,
  sameAs: cfg.social.map((s) => s[1]).concat(["https://spectrtech.gumroad.com/", "https://spectrtech.az"]),
};
const crumbs = (l, page) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SpectrTech", item: abs(url(l, "home")) },
    { "@type": "ListItem", position: 2, name: strip(dict[l].ui[page] || dict[l][page].eyebrow), item: abs(url(l, page)) },
  ],
});

/* ---------- sections ---------- */
function fanSvg() {
  const cols = ["#F23C5A", "#F23C86", "#F23CBF", "#E33CF2", "#AA3CF2", "#703CF2", "#3C42F2", "#3C7CF2", "#3CB5F2"];
  let p = "";
  for (let i = 0; i < 27; i++) {
    const a = (-70 + i * 5.2) * Math.PI / 180;
    const ex = 600 + Math.cos(a) * 560, ey = 520 + Math.sin(a) * 560;
    const cx = 600 + Math.cos(a + 0.35) * 260, cy = 520 + Math.sin(a + 0.35) * 260;
    p += `<path d="M600 520 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${cols[Math.floor(i / 3)]}" style="animation-delay:${(i * 0.04).toFixed(2)}s"/>`;
  }
  return `<svg class="fan" viewBox="0 0 1200 1040" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">${p}</svg>`;
}

function hero(l, H, { compact = false, mock = false } = {}) {
  const T = dict[l].ui;
  return `<section class="hero${compact ? " compact" : ""}"><div class="glow"></div>${fanSvg()}<div class="wrap">
<div><span class="eyebrow">${esc(H.eyebrow)}</span><h1>${H.title}</h1><p class="lead">${esc(H.lead)}</p>
${H.ctas !== false ? `<div class="btns"><a class="btn light" href="${url(l, "contact")}">${esc(T.startProject)} ${arrow}</a><a class="btn line-light" href="${url(l, "websites", "#packages")}">${esc(T.seePackages)}</a></div>` : ""}
${H.note ? `<p class="note">${esc(H.note)}</p>` : ""}</div>
${mock ? `<div class="mock" aria-hidden="true"><div class="bar"><i></i><i></i><i></i><b>your-company.com</b></div><span class="badge-demo">DEMO</span><div class="pg"><div class="h"></div><div class="h s"></div><div class="h s2"></div><div class="cta"></div><div class="row"><span></span><span></span><span></span></div></div></div>` : ""}
</div></section>`;
}

function packages(l, { teaser = false } = {}) {
  const W = dict[l].websites;
  const ids = ["ready", "extend", "redesign", "custom"];
  const cards = ids.map((id) => {
    const p = W.packages[id], pr = price(l, id);
    return `<article class="rv${id === "ready" ? " hl" : ""}"><span class="name">${esc(p.name)}</span><span class="tag">${esc(p.tag)}</span>
${pr.value ? `<div class="price">${pr.html} <small>${esc(dict[l].projects.oneTime)}</small></div>` : `<div class="price req">${pr.html}</div>`}<p class="tag">${esc(p.d)}</p>
${teaser ? "" : `<ul>${p.f.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`}
<a class="btn ${id === "ready" ? "" : "line"}" href="${url(l, "contact")}?package=${id}">${esc(W.packagesCta)}</a></article>`;
  }).join("");
  return `<div class="pk">${cards}</div><p class="pknote">${esc(W.packagesLead)}</p>`;
}

function productCards(l) {
  const P = dict[l].projects;
  return `<div class="pcards">${data.products.map((p) => {
    const it = P.items[p.id], im = p.images[p.portrait ? 0 : 0];
    const img = p.portrait ? "/coin-drop-tycoon/img/og.jpg" : im[0];
    const [w, h] = p.portrait ? [1024, 500] : [im[1], im[2]];
    return `<a class="pcard rv" href="${url(l, "projects")}#${p.id}"><div class="im"><img src="${img}" alt="${esc(it.name)}" width="${w}" height="${h}" loading="lazy" decoding="async"></div><div class="tx"><span class="kind">${esc(it.kind)}</span><h3>${esc(it.name)}</h3><p>${esc(it.platforms)}</p></div></a>`;
  }).join("")}</div>`;
}

/* ---------- pages ---------- */
function pageHome(l) {
  const H = dict[l].home, T = dict[l].ui;
  const jsonld = [
    { "@context": "https://schema.org", ...ORG },
    { "@context": "https://schema.org", "@type": "WebSite", name: "SpectrTech", url: abs(url(l, "home")), inLanguage: l, publisher: { "@id": ORG["@id"] } },
  ];
  return head(l, "home", { jsonld }) + header(l, "home") +
    hero(l, { eyebrow: H.eyebrow, title: H.title, lead: H.lead, note: H.heroNote }, { mock: true }) +
    `<div class="wrap"><div class="facts">${H.facts.map((f) => `<div><b>${esc(f.k)}</b><span>${esc(f.v)}</span></div>`).join("")}</div></div>
<section id="services"><div class="wrap"><div class="shead split"><h2>${esc(H.servicesTitle)}</h2><p class="lead">${esc(H.servicesLead)}</p></div>
<div class="svc">${H.services.map((s, i) => `<article class="rv"><span class="n">0${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></article>`).join("")}</div></div></section>
<section id="why" style="padding-top:0"><div class="wrap"><div class="shead"><h2>${esc(H.whyTitle)}</h2><p class="lead">${esc(H.whyLead)}</p></div>
<div class="cmp rv" data-show="site"><div class="seg" role="group" aria-label="${esc(H.whyTitle)}"><button type="button" data-show="social" aria-pressed="false">${esc(H.whySocial)}</button><button type="button" data-show="site" aria-pressed="true">${esc(H.whySite)}</button></div>
<table><thead><tr><th scope="col"><span class="sr">—</span></th><th scope="col">${esc(H.whySocial)}</th><th scope="col" class="site">${esc(H.whySite)}</th></tr></thead><tbody>
${H.whyRows.map((r) => `<tr><th scope="row">${esc(r.l)}</th><td class="social">${esc(r.s)}</td><td class="site">${esc(r.w)}</td></tr>`).join("")}
</tbody></table></div><p class="cmpnote">${esc(H.whyNote)}</p></div></section>
<section class="dark" id="process"><div class="glow"></div><div class="wrap" style="position:relative"><div class="shead"><span class="eyebrow">${esc(H.modelEyebrow)}</span><h2>${esc(H.modelTitle)}</h2><p class="lead">${esc(H.modelLead)}</p></div>
<ol class="steps">${H.modelSteps.map((s) => `<li class="rv"><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join("")}</ol>
<p class="note">${esc(H.modelNote)} <a href="${url(l, "contact")}" style="color:#fff">${esc(T.startProject)}</a></p></div></section>
<section id="packages"><div class="wrap"><div class="shead split"><h2>${esc(H.packagesTitle)}</h2><p class="lead">${esc(H.packagesLead)} <a href="${url(l, "websites", "#packages")}">${esc(T.seePackages)}</a></p></div>${packages(l, { teaser: true })}</div></section>
<section id="projects" style="padding-top:0"><div class="wrap"><div class="shead split"><h2>${esc(H.projectsTitle)}</h2><p class="lead">${esc(H.projectsLead)}</p></div>${productCards(l)}
<p style="margin-top:24px"><a class="btn line" href="${url(l, "projects")}">${esc(T.allProjects)} ${arrow}</a></p></div></section>
${band(l, H.ctaTitle, H.ctaLead)}` + footer(l);
}

function band(l, title, lead) {
  return `<section style="padding-top:0"><div class="wrap"><div class="band rv"><div><h2>${esc(title)}</h2><p>${esc(lead)}</p></div><div class="btns"><a class="btn light" href="${url(l, "contact")}">${esc(dict[l].ui.startProject)} ${arrow}</a></div></div></div></section>`;
}

function pageWebsites(l) {
  const W = dict[l].websites, T = dict[l].ui;
  const mk = markets[cfg.locales[l].market];
  const offers = ["ready", "extend", "redesign", "custom"].map((id) => {
    const pr = price(l, id);
    const o = { "@type": "Offer", name: W.packages[id].name + " — " + W.packages[id].tag, description: W.packages[id].d, url: abs(url(l, "websites", "#packages")) };
    if (pr.value) { o.price = pr.value; o.priceCurrency = mk.currency; }
    return o;
  });
  const jsonld = [
    { "@context": "https://schema.org", "@type": "Service", name: strip(W.eyebrow), serviceType: "Website development", provider: { ...ORG }, areaServed: "Worldwide", inLanguage: l, url: abs(url(l, "websites")),
      hasOfferCatalog: { "@type": "OfferCatalog", name: W.packagesTitle, itemListElement: offers } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: W.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    crumbs(l, "websites"),
  ];
  return head(l, "websites", { jsonld }) + header(l, "websites") +
    hero(l, { eyebrow: W.eyebrow, title: W.title, lead: W.lead }, { compact: true }) +
    `<section><div class="wrap"><div class="shead"><h2>${esc(W.reasonsTitle)}</h2></div>
<div class="grid3">${W.reasons.map((r) => `<article class="rv"><h3>${esc(r.t)}</h3><p>${esc(r.d)}</p></article>`).join("")}</div></div></section>
<section id="process" style="padding-top:0"><div class="wrap"><div class="shead"><h2>${esc(W.processTitle)}</h2></div>
<ol class="steps light six">${W.process.map((s) => `<li class="rv"><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join("")}</ol></div></section>
<section id="packages" style="padding-top:0"><div class="wrap"><div class="shead"><h2>${esc(W.packagesTitle)}</h2></div>${packages(l)}</div></section>
<section style="padding-top:0"><div class="wrap"><div class="shead"><h2>${esc(W.includedTitle)}</h2></div>
<div class="inc"><div class="yes rv"><h3>${esc(W.includedYes)}</h3><ul>${W.included.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
<div class="no rv"><h3>${esc(W.includedNo)}</h3><ul>${W.notIncluded.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div></div></section>
<section id="faq" style="padding-top:0"><div class="wrap"><div class="shead"><h2>${esc(W.faqTitle)}</h2></div>
<div class="faq">${W.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div></div></section>
${band(l, dict[l].home.ctaTitle, dict[l].home.ctaLead)}` + footer(l);
}

function pageProjects(l) {
  const P = dict[l].projects;
  const jsonld = [
    ...data.products.map((p) => {
      const it = P.items[p.id];
      const o = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: it.name, applicationCategory: p.category, operatingSystem: p.os, description: it.d, url: abs(p.page), image: abs(p.images[0][0]), author: { "@id": ORG["@id"] } };
      if (p.price) o.offers = { "@type": "Offer", price: p.price.replace(/[^0-9.]/g, ""), priceCurrency: "USD", url: p.buy };
      return o;
    }),
    crumbs(l, "projects"),
  ];
  const items = data.products.map((p) => {
    const it = P.items[p.id];
    const imgs = p.images;
    const thumbs = imgs.map((im, i) => `<button type="button" data-src="${im[0]}" data-alt="${esc(it.name)} — ${i + 1}" aria-pressed="${i === 0}" aria-label="${esc(it.name)} — ${i + 1}"><img src="${im[0]}" alt="" width="${im[1]}" height="${im[2]}" loading="lazy" decoding="async"></button>`).join("");
    const btns = p.buy
      ? `<a class="btn" href="${p.buy}" rel="noopener">${esc(P.buy)} · ${esc(p.price)}</a><a class="btn line" href="${p.demo}" hreflang="en">${esc(P.demo)}</a><a class="btn line" href="${p.page}" hreflang="en">${esc(P.details)}</a>`
      : `<a class="btn" href="${p.page}" hreflang="en">${esc(P.seeGame)}</a><a class="btn line" href="${p.join}">${esc(P.joinTest)}</a>`;
    return `<article class="pr" id="${p.id}"><div class="gal${p.portrait ? " portrait" : ""}"><div class="main"><img src="${imgs[0][0]}" alt="${esc(it.name)} — 1" width="${imgs[0][1]}" height="${imgs[0][2]}" loading="lazy" decoding="async"></div><div class="thumbs">${thumbs}</div></div>
<div><span class="kind">${esc(it.kind)}</span><h3>${esc(it.name)}</h3><p class="d">${esc(it.d)}</p>
<h4 class="sr">${esc(P.features)}</h4><ul>${it.f.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
<dl><dt>${esc(P.platforms)}</dt><dd>${esc(it.platforms)}</dd><dt>${esc(P.status)}</dt><dd>${esc(it.status)}</dd></dl>
<div class="btns">${btns}</div></div></article>`;
  }).join("");
  const portfolio = data.portfolio.length
    ? `<section id="portfolio" style="padding-top:0"><div class="wrap"><div class="shead"><h2>${esc(P.portfolioTitle)}</h2><p class="lead">${esc(P.portfolioLead)}</p></div>
<div class="pcards">${data.portfolio.map((w) => `<a class="pcard rv" href="${w.url}" rel="noopener"><div class="im"><img src="${w.image}" alt="${esc(w.name)}" loading="lazy" width="1200" height="750"></div><div class="tx"><span class="kind">${esc(w.kind || "")}</span><h3>${esc(w.name)}</h3></div></a>`).join("")}</div></div></section>`
    : "";
  return head(l, "projects", { jsonld }) + header(l, "projects") +
    hero(l, { eyebrow: P.eyebrow, title: P.title, lead: P.lead, ctas: false }, { compact: true }) +
    `<section><div class="wrap"><div class="prj">${items}</div></div></section>${portfolio}
<section style="padding-top:0"><div class="wrap"><div class="shead"><h2>${esc(P.moreTitle)}</h2></div><div class="more">
<a href="/tools/" hreflang="en"><b>${esc(P.tools)}</b><span>${esc(P.toolsD)}</span></a>
<a href="/blog/" hreflang="en"><b>${esc(P.guides)}</b><span>${esc(P.guidesD)}</span></a>
<a href="/affiliates/" hreflang="en"><b>${esc(P.affiliates)}</b><span>${esc(P.affiliatesD)}</span></a></div></div></section>
${band(l, dict[l].home.ctaTitle, dict[l].home.ctaLead)}` + footer(l);
}

function pageContact(l) {
  const C = dict[l].contact;
  const ids = ["website", "redesign", "custom", "product", "other"];
  const msg = {
    to: cfg.contact.email, endpoint: cfg.leadEndpoint,
    required: C.required, invalidEmail: C.invalidEmail, consentRequired: C.consentRequired,
    sending: C.sending, success: C.success, error: C.error, mailtoReady: C.mailtoReady, mailtoFallback: C.mailtoFallback,
    l: { name: C.name, email: C.email, company: C.company, country: C.country, link: C.link, interest: C.interest },
  };
  const fld = (id, label, { type = "text", req = false, full = false, hint = "", ac = "" } = {}) =>
    `<div class="fld${full ? " full" : ""}"><label for="f-${id}">${esc(label)}${req ? ' <span aria-hidden="true">*</span>' : ""}</label>
${type === "textarea" ? `<textarea id="f-${id}" name="${id}"${req ? " required" : ""}${hint ? ` aria-describedby="f-${id}-hint f-${id}-err"` : ` aria-describedby="f-${id}-err"`}></textarea>`
      : `<input id="f-${id}" name="${id}" type="${type}"${ac ? ` autocomplete="${ac}"` : ""}${req ? " required" : ""} aria-describedby="${hint ? `f-${id}-hint ` : ""}f-${id}-err">`}
${hint ? `<small id="f-${id}-hint">${esc(hint)}</small>` : ""}<span class="err" id="f-${id}-err"></span></div>`;
  const pkgOpts = ["ready", "extend", "redesign", "custom"].map((id) => `<option value="${dict[l].websites.packages[id].name}" data-pkg="${id}">${dict[l].websites.packages[id].name} — ${esc(dict[l].websites.packages[id].tag)}</option>`).join("");
  const form = `<form class="lf" id="lead" novalidate data-msg="${esc(JSON.stringify(msg))}">
${fld("name", C.name, { req: true, ac: "name" })}${fld("email", C.email, { type: "email", req: true, ac: "email" })}
${fld("company", C.company, { ac: "organization" })}${fld("country", C.country, { ac: "country-name" })}
${fld("link", C.link, { type: "url", full: true, hint: C.linkHint })}
<div class="fld full"><label for="f-interest">${esc(C.interest)}</label><select id="f-interest" name="interest">${C.interests.map((x, i) => `<option value="${esc(x)}" data-id="${ids[i]}">${esc(x)}</option>`).join("")}<optgroup label="${esc(dict[l].websites.packagesTitle)}">${pkgOpts}</optgroup></select></div>
${fld("message", C.message, { type: "textarea", req: true, full: true, hint: C.messageHint })}
<label class="hp" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off"></label>
<div class="chk"><input id="f-consent" name="consent" type="checkbox" value="yes" required aria-describedby="f-consent-err"><label for="f-consent">${esc(C.consent)} <a href="${url(l, "privacy")}">${esc(C.privacyLink)}</a></label><span class="err" id="f-consent-err" style="grid-column:2"></span></div>
<div class="fld full"><button class="btn" type="submit">${esc(C.submit)}</button></div>
<div class="fstat" role="status" aria-live="polite" tabindex="-1"></div>
</form>
<script>(function(){var p=new URLSearchParams(location.search).get("package");if(!p)return;var o=document.querySelector('#f-interest option[data-pkg="'+p+'"]');if(o)o.selected=true})()</script>`;
  return head(l, "contact", { jsonld: [crumbs(l, "contact"), { "@context": "https://schema.org", "@type": "ContactPage", url: abs(url(l, "contact")), inLanguage: l, about: { "@id": ORG["@id"] } }] }) + header(l, "contact") +
    hero(l, { eyebrow: C.eyebrow, title: C.title, lead: C.lead, ctas: false }, { compact: true }) +
    `<section><div class="wrap"><div class="cgrid">${form}
<aside class="side"><h2 style="font-size:20px;margin-bottom:4px">${esc(C.directTitle)}</h2>
<a class="ch" href="mailto:${cfg.contact.email}"><small>${esc(C.emailLabel)}</small><bdi dir="ltr">${cfg.contact.email}</bdi></a>
<a class="ch" href="${cfg.contact.telegram}" target="_blank" rel="noopener"><small>${esc(C.telegramLabel)}</small><bdi dir="ltr">@${cfg.contact.telegram.split("/").pop()}</bdi></a>
<p>${esc(C.azNote)} <a href="https://spectrtech.az" hreflang="az">spectrtech.az</a></p></aside></div></div></section>` + footer(l);
}

function pagePrivacy(l) {
  const P = dict[l].privacy;
  return head(l, "privacy", { jsonld: [crumbs(l, "privacy")] }) + header(l, "privacy") +
    hero(l, { eyebrow: P.eyebrow, title: esc(P.title), lead: P.updated, ctas: false }, { compact: true }) +
    `<section><div class="wrap"><div class="prose">${P.sections.map((s) => `<div><h2>${esc(s.h)}</h2><p>${esc(s.p)}</p></div>`).join("")}
<p><a href="/coin-drop-tycoon/privacy/" hreflang="en">Coin Drop Tycoon — privacy policy</a></p></div></div></section>` + footer(l);
}

/* ---------- write ---------- */
const PAGES = { home: pageHome, websites: pageWebsites, projects: pageProjects, contact: pageContact, privacy: pagePrivacy };
const written = [];
for (const l of LOCS) for (const page of cfg.pages) {
  const rel = url(l, page).replace(/^\//, "") + "index.html";
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PAGES[page](l));
  written.push(rel);
}

/* ---------- sitemap ---------- */
const legacy = fs.readFileSync(path.join(SRC, "legacy-urls.txt"), "utf8").split("\n").map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
const today = cfg.updated; // bump in config.json when studio content changes
let sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
for (const page of cfg.pages) for (const l of LIVE) {
  sm += `<url><loc>${abs(url(l, page))}</loc><lastmod>${today}</lastmod>` +
    LIVE.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${abs(url(x, page))}"/>`).join("") +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${abs(url(DEF, page))}"/></url>\n`;
}
for (const u of legacy) sm += `<url><loc>${cfg.siteUrl}${u}</loc></url>\n`;
sm += "</urlset>\n";
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sm);

console.log(`Built ${written.length} pages for ${LOCS.length} locales (indexable: ${LIVE.join(", ")}). i18n problems: ${problems}. Sitemap: ${LIVE.length * cfg.pages.length + legacy.length} URLs.`);
