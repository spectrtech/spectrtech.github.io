# SpectrTech — Digital Tools That Work Offline

Single-file HTML tools that open in any browser. No account, no subscription, no server.

**Site:** https://spectrtech.si

## Wedding Planner

A complete wedding planner in one HTML file: guest list, seating plan with auto-arrange, floor plan, budget (estimated → quoted → final), vendors, payments, day-of timeline, invitations (PDF/ZIP). 17 connected sections, 9 languages, works offline.

- Product page: https://spectrtech.si/wedding-planner/
- Buy on Gumroad: https://spectrtech.gumroad.com/l/weddingplanner

## Free wedding tools

- Budget calculator — https://spectrtech.si/tools/wedding-budget-calculator/
- Seating chart maker — https://spectrtech.si/tools/wedding-seating-chart-maker/
- Planning checklist — https://spectrtech.si/tools/wedding-planning-checklist/

## Guides

https://spectrtech.si/blog/

## Studio site (SpectrTech Global)

The home page and the pages `/websites/`, `/projects/`, `/contact/`, `/privacy/` (plus `/ru/`, `/de/`, `/fr/`, `/es/`, `/ar/` versions) are **generated**. Do not edit them by hand.

| What | Where |
|---|---|
| Texts per language | `src/i18n/<lang>.json` (English is the reference) |
| Languages, contacts, form endpoint | `src/config.json` |
| Prices per market (no AZN here — Azerbaijan is spectrtech.az) | `src/data/markets.json` |
| Products and future client portfolio | `src/data/projects.json` |
| Design system | `src/assets/studio.css`, `src/assets/studio.js` |
| Optional form receiver (Cloudflare Worker → Telegram) | `src/worker/` |

```
node src/build.mjs          # generate pages, assets, sitemap.xml
python3 src/tools/og.py     # regenerate social preview images (after text changes)
python3 src/tools/check.py  # QA: links, JS errors, overflow, images, SEO, hreflang, form, i18n
```

A language whose dictionary is incomplete is built with `noindex` and left out of hreflang and the sitemap automatically. Product pages, guides and tools are not touched by the generator.
