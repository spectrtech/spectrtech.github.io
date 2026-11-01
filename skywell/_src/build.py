#!/usr/bin/env python3
"""Skywell Azərbaycan — генератор страниц.
Запуск из папки skywell:  python3 _src/build.py
Создаёт index.html, et5.html, ht-i.html, assets/i18n.js, assets/data.js.
Тексты — _src/i18n.py (AZ / RU / EN). Данные моделей и фото — здесь, в DATA.
"""
import json, re, html, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '_src'))
from i18n import I

def L(az, ru, en): return {'az': az, 'ru': ru, 'en': en}
def S(v): return L(v, v, v)

# ── фото ──
def TB(tid, f, w):  # фото с skywell.az (Tilda), сжатые до ширины w
    return f'https://thb.tildacdn.one/{tid}/-/resize/{w}x/{f}'
E = {  # реальные фото Skywell ET5 с skywell.az
    'w_front': ('tild6134-3364-4161-b938-346331313064', 'DSC08590.jpg'),
    'w_34': ('tild6232-6530-4239-b530-303638376366', 'DSC08597.jpg'),
    'w_side': ('tild6262-6662-4161-a531-663837646530', 'DSC08605.jpg'),
    'w_rear': ('tild3236-6637-4365-b233-333162383638', 'DSC08599.jpg'),
    'w_trunk': ('tild6337-3431-4631-b537-396264626661', 'DSC08635.jpg'),
    'k_front': ('tild3335-3634-4334-a135-366235656337', 'DSC08511.jpg'),
    'k_lights': ('tild3362-6331-4433-a533-646439373534', 'DSC08518.jpg'),
    'k_34a': ('tild3264-6461-4237-b330-653463316533', 'DSC08522.jpg'),
    'k_34b': ('tild3837-3339-4531-b939-623830626630', 'DSC08523.jpg'),
    'k_rear': ('tild6566-6464-4837-a539-336336663139', 'DSC08525.jpg'),
    'b_34': ('tild3233-3932-4232-a238-323562643237', 'DSC08571.jpg'),
    'b_wheel': ('tild3834-3833-4634-b162-336462346335', 'DSC08573.jpg'),
    'b_rear': ('tild6136-3539-4062-a530-663265653866', 'DSC08575.jpg'),
    'i_dash': ('tild6131-6138-4634-a232-363134646662', 'DSC08531.jpg'),
    'i_wheel': ('tild3330-3038-4461-b965-376661393664', 'DSC08546.jpg'),
    'i_seats': ('tild3164-6162-4031-b137-393336643036', 'DSC08537.jpg'),
    'i_console': ('tild3561-3635-4236-b765-343431373832', 'DSC08542.jpg'),
    'i_screen': ('tild3065-3335-4663-b633-643738336330', 'DSC08550.jpg'),
    'f_relax': ('tild3865-3930-4231-a335-613461373630', 'image.png'),
    'f_lights': ('tild3639-3364-4761-b338-656633366266', 'image.png'),
    'f_tailgate': ('tild6439-3064-4938-a661-373564653231', '8.png'),
    'f_roof': ('tild3534-6230-4138-a331-383564393633', 'image.png'),
    'a1': ('tild6134-6665-4261-b938-636435663333', 'image.png'),
    'a2': ('tild3065-3632-4261-a438-653032666433', 'image.png'),
    'a3': ('tild3537-3534-4261-b565-336137363234', 'image.png'),
    'a4': ('tild3930-3537-4963-a538-643638333432', 'image.png'),
    'charge': ('tild3639-6138-4337-b532-316266396361', 'DSC08639.jpg'),
    'c1': ('tild3039-3866-4466-b866-313037316362', '1.png'),
    'c2': ('tild3066-6234-4134-b763-376563303531', '2.png'),
    'c3': ('tild3735-3661-4339-b466-356133653637', '3.png'),
    'c4': ('tild3033-3831-4864-b938-326336663166', '4.png'),
}
def e(k, w=1200): return TB(*E[k], w)
HTI = 'https://www.skyworthev.com/static/web/img/'  # официальный сайт производителя (Китай)
CE11 = 'https://cdn-skyworthev.coolwellcloud.com/resource/'  # en.skyworthev.com/CE11 (Skyhome)
LOGO = 'https://static.tildacdn.one/tild6266-6636-4631-a532-363538336337/Logo_Skywell_SVG.svg'
FAV = 'https://static.tildacdn.one/tild3437-6133-4763-b461-616133623839/favicon.png'
OG = 'https://static.tildacdn.one/tild3266-3162-4630-a332-336234663730/SKYWELL_-_Day-min.png'

HTI_CROP = '55% 100% 1.4'  # обрезка фото HT-i: убирает надписи сверху
ROCK = ['https://image.bitautoimg.com/appimage-921-w1/mapi/news/2025/03/27/93e559e5a02a456cb2d8c7ebd3c052a9.png',
        'https://image.bitautoimg.com/appimage-914-w1/mapi/news/2025/03/27/bb12c0eda41b4876ab9dc90b9efb02c2.png',
        'https://image.bitautoimg.com/appimage-914-w1/mapi/news/2025/03/27/6a129deabecb4f55b95a0ab89c11b4fc.png']  # Skywell Rock (创维磐石), фото с выставки
MODELS = [
    {'id': 'et5', 'name': 'Skywell ET5', 'st': 'sale', 'page': 'et5.html', 'body': L('SUV · elektrik', 'SUV · электро', 'SUV · electric'),
     'img': e('w_front', 900),
     'specs': [{'l': L('Yürüş (NEDC)', 'Запас хода (NEDC)', 'Range (NEDC)'), 'v': L('520 km', '520 км', '520 km')},
               {'l': L('Batareya', 'Батарея', 'Battery'), 'v': L('72 kVt·saat', '72 кВт·ч', '72 kWh')},
               {'l': L('0–100 km/saat', '0–100 км/ч', '0–100 km/h'), 'v': L('8 san', '8 с', '8 s')},
               {'l': L('Şarj 20→80%', 'Зарядка 20→80%', 'Charge 20→80%'), 'v': L('~30 dəq', '~30 мин', '~30 min')}],
     'note': L('', '', '')},
    {'id': 'ht-i', 'name': 'Skywell HT-i', 'st': 'sale', 'page': 'ht-i.html', 'body': L('SUV · plug-in hibrid (PHEV)', 'SUV · подключаемый гибрид (PHEV)', 'SUV · plug-in hybrid (PHEV)'),
     'img': HTI + 'HTi-list2.jpg?v=v2', 'crop': HTI_CROP,
     'specs': [{'l': L('Elektrik yürüşü (CLTC)', 'На электротяге (CLTC)', 'Electric range (CLTC)'), 'v': L('200 km', '200 км', '200 km')},
               {'l': L('Batareya', 'Батарея', 'Battery'), 'v': L('32,76 kVt·saat', '32,76 кВт·ч', '32.76 kWh')},
               {'l': L('Elektromotor', 'Электромотор', 'Electric motor'), 'v': L('160 kVt', '160 кВт', '160 kW')},
               {'l': L('Benzin mühərriki', 'Бензиновый двигатель', 'Petrol engine'), 'v': L('1.5T, 115 kVt', '1.5T, 115 кВт', '1.5T, 115 kW')}],
     'note': L('Göstəricilər istehsalçının 2026 model ili üçün məlumatlarıdır.', 'Данные производителя для 2026 модельного года.', 'Manufacturer data for the 2026 model year.')},
    {'id': 'q', 'name': 'Skywell Q', 'st': 'soon', 'page': '', 'body': L('Hetçbek · elektrik', 'Хэтчбек · электро', 'Hatchback · electric'),
     'img': 'https://car-images.bauersecure.com/wp-images/199979/1056x594/skywellq_50.jpg',
     'gal': ['https://car-images.bauersecure.com/wp-images/199979/1056x594/skywellq_5%d.jpg' % n for n in (0, 1, 2)],
     'specs': [{'l': L('Güc', 'Мощность', 'Power'), 'v': L('150 kVt', '150 кВт', '150 kW')},
               {'l': L('Uzunluq', 'Длина', 'Length'), 'v': L('4,30 m', '4,30 м', '4.30 m')},
               {'l': L('Mərkəzi ekran', 'Центральный экран', 'Centre screen'), 'v': S('15.6"')},
               {'l': L('Batareya', 'Батарея', 'Battery'), 'v': L('2 variant', '2 варианта', '2 options')}],
     'note': L('Avropa üçün hazırlanmış model, 2024-cü ildə Paris avtosalonunda təqdim olunub.', 'Модель, созданная для Европы; представлена на Парижском автосалоне 2024 года.', 'Designed for Europe; unveiled at the 2024 Paris Motor Show.')},
    {'id': 'skyhome', 'name': 'Skywell Skyhome', 'st': 'soon', 'page': '', 'body': L('Sedan · elektrik', 'Седан · электро', 'Sedan · electric'),
     'img': CE11 + '0c13a7d67101448584b9fed7a380a207.jpeg',
     'gal': [CE11 + f + '.jpeg' for f in ['0c13a7d67101448584b9fed7a380a207', '241f582cb25d4218bbd9fef2684b69e2', '727ff3a0eff9464da8ea4f546ff4f053', 'fafae09840bc434fb36d1ce73d95371c', '65e892379b38422eb59cbd71c1d4ad38', '2f583903aaff4b9f94004b7076392e2f', 'ba2b80df13e34b7f969797c8830f54b6', '2a457522dc54409fa6e2ada8f641495f']],
     'specs': [{'l': L('Güc (flaqman)', 'Мощность (флагман)', 'Power (flagship)'), 'v': L('460 kVt', '460 кВт', '460 kW')},
               {'l': L('0–100 km/saat', '0–100 км/ч', '0–100 km/h'), 'v': L('3,5 san', '3,5 с', '3.5 s')},
               {'l': L('Elektromotorlar', 'Электромоторы', 'Electric motors'), 'v': S('2')},
               {'l': L('Ötürücü', 'Привод', 'Drive'), 'v': S('AWD')}],
     'note': L('Pnevmatik asqı, arxa sərnişinlər üçün uzanan oturacaqlar və tavandan enən ekran. İstehsalçının ilkin məlumatlarıdır.', 'Пневмоподвеска, откидывающиеся задние кресла и экран, опускающийся с потолка. Предварительные данные производителя.', 'Air suspension, reclining rear seats and a roof-mounted screen. Manufacturer’s preliminary data.')},
    {'id': 'rock', 'name': 'Skywell Rock', 'st': 'soon', 'page': '', 'body': L('SUV · elektrik və plug-in hibrid', 'SUV · электро и подключаемый гибрид', 'SUV · electric and plug-in hybrid'),
     'img': ROCK[0], 'crop': '50% 0% 1', 'gal': ROCK,
     'specs': [{'l': L('Yürüş (CLTC, elektrik)', 'Запас хода (CLTC, электро)', 'Range (CLTC, electric)'), 'v': L('620 km', '620 км', '620 km')},
               {'l': L('Platforma', 'Платформа', 'Platform'), 'v': L('800 V', '800 В', '800 V')},
               {'l': L('Təkər bazası', 'Колёсная база', 'Wheelbase'), 'v': L('2800 mm', '2800 мм', '2800 mm')},
               {'l': L('Mərkəzi ekran', 'Центральный экран', 'Centre screen'), 'v': S('15.6"')}],
     'note': L('Orta ölçülü 5 yerlik SUV: tam elektrik və 1.5T plug-in hibrid versiyaları. Göstəricilər istehsalçının ilkin məlumatlarıdır, fotolar sərgidən.', 'Среднеразмерный 5-местный SUV: полностью электрическая версия и подключаемый гибрид 1.5T. Предварительные данные производителя, фото с выставки.', 'Mid-size 5-seat SUV: all-electric and 1.5T plug-in hybrid versions. Manufacturer’s preliminary data; photos from a motor show.')},
]

TL = [
    {'y': '1988', 't': L('Çində Skyworth korporasiyası məişət texnikası və elektronika istehsalçısı kimi yaradılır.', 'В Китае основана корпорация Skyworth — производитель бытовой техники и электроники.', 'Skyworth is founded in China as a home appliance and electronics maker.')},
    {'y': '2000', 't': L('Skyworth Nanjing Golden Dragon Bus şirkətini təsis edir — elektrik avtobusları və yük avtomobilləri istehsalı.', 'Skyworth основывает Nanjing Golden Dragon Bus — производство электробусов и грузовиков.', 'Skyworth sets up Nanjing Golden Dragon Bus, building electric buses and trucks.')},
    {'y': '2017', 't': L('Minik elektromobilləri üçün Skywell New Energy şirkəti yaradılır.', 'Для выпуска легковых электромобилей создана компания Skywell New Energy.', 'Skywell New Energy is created for passenger EVs.')},
    {'y': '2020', 't': L('İlk seriyalı model təqdim olunur: Çində Skyworth EV6, xarici bazarlarda Skywell ET5.', 'Представлена первая серийная модель: Skyworth EV6 в Китае и Skywell ET5 для экспорта.', 'The first production model debuts: Skyworth EV6 in China, Skywell ET5 for export.')},
    {'y': '2021', 't': L('ET5 Almaniya və Avropada Elaris Beo, ABŞ və Kanadada Imperium adı ilə satışa çıxarılır.', 'ET5 выходит в Германии и Европе как Elaris Beo, в США и Канаде — под брендом Imperium.', 'The ET5 goes on sale as the Elaris Beo in Germany and Europe and as Imperium in the US and Canada.')},
    {'y': '2022', 't': L('Aprel ayından Onvolt Skywell-in Azərbaycanda rəsmi idxalçısıdır. Noyabrda Bakıda şourum açılır və ET5 təqdim olunur.', 'С апреля Onvolt — официальный импортёр Skywell в Азербайджане. В ноябре в Баку открыт шоурум и представлен ET5.', 'From April Onvolt is the official Skywell importer in Azerbaijan. In November a showroom opens in Baku and the ET5 is presented.')},
]

TRIMS = [['ET5 LV0', '56', '410 km', '15', 'GB/T', '235/50 R18'],
         ['ET5 Comfort', '72', '520 km', '15.6', 'CCS2 / Type 2', '235/50 R19'],
         ['ET5 Luxury', '72', '520 km', '15.6', 'CCS2 / Type 2', '235/50 R19']]

DATA = {
    'MODELS': MODELS, 'TL': TL, 'TRIMS': TRIMS,
    'COLORS': [e('c1', 1400), e('c2', 1400), e('c3', 1400), e('c4', 1400)],
    'GAL_EXT': [e(k, 1600) for k in ['k_lights', 'w_front', 'k_rear', 'w_34', 'b_34', 'w_side', 'b_rear', 'k_34b', 'k_34a']],
    'GAL_INT': [e(k, 1600) for k in ['i_dash', 'i_wheel', 'i_seats', 'i_console', 'w_trunk']],
    'GAL_HTI': [HTI + 'hti2/' + f + '?v=v2' for f in ['HTi2-list4.jpg', 'HTi2-list5.jpg', 'HTi2-list3.jpg', 'HTi2-wlist7.jpg', 'HTi2-list9.jpg']],
}

ALT = {'GAL_EXT': 'Skywell ET5', 'GAL_INT': 'Skywell ET5', 'GAL_HTI': 'Skywell HT-i'}

# ── шаблон ──
def az(k):
    v = I[k][0]
    return v

def sub(tpl):
    def r(m):
        raw, k = m.group(1) == '!', m.group(2)
        if k not in I: raise KeyError(k)
        v = I[k][0]
        return v if raw else html.escape(v, quote=False)
    return re.sub(r'\[\[(!?)([\w]+)\]\]', r, tpl)

ICON = {
 'pin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
 'tel': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
 'wa': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/></svg>',
 'mail': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
}

def head(page, title_key, desc, canon, og_img):
    return f'''<!doctype html>
<html lang="az" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(az(title_key))}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="noindex">
<link rel="canonical" href="{canon}">
<meta name="theme-color" content="#0A111B">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Skywell Azərbaycan">
<meta property="og:title" content="{html.escape(az(title_key))}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:image" content="{og_img}">
<meta property="og:url" content="{canon}">
<meta property="og:locale" content="az_AZ">
<meta property="og:locale:alternate" content="ru_RU">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{FAV}">
<link rel="preconnect" href="https://thb.tildacdn.one">
<link rel="preload" href="fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/inter-tight-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="assets/app.css">
<script>document.documentElement.classList.remove('no-js');</script>
<script src="content/site.js"></script>
<script src="assets/st-content.js"></script>
<script src="assets/i18n.js"></script>
<script src="assets/data.js"></script>
'''

def header(page):
    h = '' if page == 'index' else 'index.html'
    def a(href, inner, cur=False):
        return f'<a href="{href}"{" aria-current=\"page\"" if cur else ""}>{inner}</a>'
    items = [
        a(f'{h}#models', '<span data-i18n="nModels">[[nModels]]</span>'),
        a('et5.html', 'Skywell ET5', page == 'et5'),
        a('ht-i.html', 'Skywell HT-i', page == 'hti'),
        a(f'{h}#why', '<span data-i18n="nWhy">[[nWhy]]</span>'),
        a(f'{h}#charging', '<span data-i18n="nCharge">[[nCharge]]</span>'),
        a(f'{h}#contact', '<span data-i18n="nContact">[[nContact]]</span>'),
    ]
    mitems = items[:5] + [a(f'{h}#about', '<span data-i18n="nAbout">[[nAbout]]</span>')] + items[5:]
    return f'''</head>
<body data-page="{page}">
<a class="skip" href="#main" data-i18n="skip">[[skip]]</a>
<header class="hd" data-st-block data-st-label="Menyu">
  <div class="wrap">
    <a class="logo" id="logo" href="{h or '#top'}" aria-label="Skywell Azərbaycan">
      <img src="{LOGO}" alt="Skywell" width="150" height="26">
      <span class="lt" aria-hidden="true">SKYWELL</span>
    </a>
    <nav class="nav" aria-label="[[navL]]" data-i18n-aria="navL">
      {''.join(items)}
    </nav>
    <div class="hd-r">
      <a class="tel" href="tel:+994124400007">+994 12 440 00 07</a>
      <div class="lang" role="group" aria-label="Dil / Язык / Language">
        <button type="button" data-lang="az" aria-pressed="true">AZ</button>
        <button type="button" data-lang="ru" aria-pressed="false">RU</button>
        <button type="button" data-lang="en" aria-pressed="false">EN</button>
      </div>
      <button class="burger" type="button" id="burger" aria-expanded="false" aria-controls="mnav" aria-label="[[menu]]" data-i18n-aria="menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
  <nav class="mnav" id="mnav" aria-label="[[navL]]" data-i18n-aria="navL">
    {''.join(mitems)}
    <a class="mtel" href="tel:+994124400007">+994 12 440 00 07</a>
    <a class="btn p" href="https://wa.me/994994400007" target="_blank" rel="noopener">WhatsApp</a>
  </nav>
</header>
<main id="main">
'''

def footer(page):
    h = '' if page == 'index' else 'index.html'
    return f'''</main>
<footer class="ft" data-st-block data-st-label="Footer">
  <div class="wrap">
    <div class="g">
      <div>
        <div class="wm">SKYWELL</div>
        <p data-i18n="ftP">[[ftP]]</p>
      </div>
      <div>
        <h4 data-i18n="ftNav">[[ftNav]]</h4>
        <ul>
          <li><a href="{h}#models" data-i18n="nModels">[[nModels]]</a></li>
          <li><a href="et5.html">Skywell ET5</a></li>
          <li><a href="ht-i.html">Skywell HT-i</a></li>
          <li><a href="{h}#charging" data-i18n="nCharge">[[nCharge]]</a></li>
          <li><a href="{h}#contact" data-i18n="nContact">[[nContact]]</a></li>
        </ul>
      </div>
      <div>
        <h4>Onvolt</h4>
        <ul>
          <li><a href="https://onvolt.az" target="_blank" rel="noopener">onvolt.az</a></li>
          <li><a href="https://immotors.az" target="_blank" rel="noopener">immotors.az</a></li>
          <li><a href="tel:+994124400007">+994 12 440 00 07</a></li>
          <li><a href="mailto:sales@onvolt.az">sales@onvolt.az</a></li>
        </ul>
      </div>
    </div>
    <div class="bt">
      <span data-i18n="ftC">[[ftC]]</span>
      <span data-i18n="addr">[[addr]]</span>
      <a class="pw" href="https://spectrtech.az" target="_blank" rel="noopener">Powered by <b>SpectrTech</b></a>
    </div>
  </div>
</footer>
<dialog class="lb" id="lb" aria-label="Skywell">
  <button type="button" class="lb-x" id="lbX" aria-label="[[close]]" data-i18n-aria="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  <button type="button" class="lb-p" id="lbP" aria-label="[[prev]]" data-i18n-aria="prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
  <img id="lbI" alt="">
  <button type="button" class="lb-n" id="lbN" aria-label="[[next]]" data-i18n-aria="next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
  <span class="lb-c" id="lbC"></span>
</dialog>
<script src="assets/app.js"></script>
</body>
</html>
'''

def kv(pairs, cls='kv'):
    return f'<div class="{cls}">' + ''.join(f'<div><b data-i18n="{v}">[[{v}]]</b><span data-i18n="{l}">[[{l}]]</span></div>' if v in I else f'<div><b>{v}</b><span data-i18n="{l}">[[{l}]]</span></div>' for v, l in pairs) + '</div>'

def contact_cards():
    return f'''<div class="cinfo">
        <a class="ci" href="https://www.google.com/maps/search/?api=1&amp;query=40.3984375%2C49.8430625" target="_blank" rel="noopener">{ICON['pin']}<span><small data-i18n="ciA">[[ciA]]</small><b data-i18n="addr">[[addr]]</b></span></a>
        <a class="ci" href="tel:+994124400007">{ICON['tel']}<span><small data-i18n="ciT">[[ciT]]</small><b>+994 12 440 00 07</b></span></a>
        <a class="ci" href="https://wa.me/994994400007" target="_blank" rel="noopener">{ICON['wa']}<span><small>WhatsApp</small><b>+994 99 440 00 07</b></span></a>
        <a class="ci" href="mailto:sales@onvolt.az">{ICON['mail']}<span><small>E-mail</small><b>sales@onvolt.az</b></span></a>'''

def cta_band(tk, pk, model):
    q = model.replace(' ', '%20')
    return f'''<section class="cta" aria-labelledby="ctaH" data-st-block data-st-label="CTA">
  <div class="wrap">
    <div>
      <h2 id="ctaH" data-i18n="{tk}">[[{tk}]]</h2>
      <p data-i18n="{pk}">[[{pk}]]</p>
    </div>
    <div class="acts">
      <a class="btn w" href="index.html?model={q}#contact" data-i18n="ask">[[ask]]</a>
      <a class="btn ow" href="https://wa.me/994994400007" data-wa-model="{html.escape(model)}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="btn ow" href="tel:+994124400007" data-i18n="callUs">[[callUs]]</a>
    </div>
  </div>
</section>
'''

# ── главная ──
INDEX_BODY = (ROOT / '_src' / 'index.body.html').read_text('utf-8')

def page_index():
    out = head('index', 't_index', 'Skywell elektrik avtomobillərinin Azərbaycanda rəsmi idxalçısı Onvolt: Skywell ET5, yeni HT-i, Q və Skyhome modelləri, rəsmi servis, zəmanət və şarj stansiyaları.', 'https://skywell.az/', OG)
    out += '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"AutoDealer","name":"Onvolt — Skywell Azərbaycan","url":"https://skywell.az/","brand":{"@type":"Brand","name":"Skywell"},"telephone":"+994124400007","email":"sales@onvolt.az","address":{"@type":"PostalAddress","streetAddress":"Ceyhun Hacıbəyli küç., 194","addressLocality":"Bakı","addressCountry":"AZ"},"geo":{"@type":"GeoCoordinates","latitude":40.3984375,"longitude":49.8430625},"parentOrganization":{"@type":"Organization","name":"Onvolt MMC","url":"https://onvolt.az"},"sameAs":["https://www.instagram.com/skywell.az/","https://www.facebook.com/profile.php?id=100089702104191","https://www.youtube.com/@SkywellAzerbaijan","https://www.linkedin.com/company/skywellazerbaijan"]}</script>
'''
    body = INDEX_BODY.replace('{{HERO}}', e('k_34a', 1600)).replace('{{ET5IMG}}', e('b_34', 1400)).replace('{{CONTACT_CARDS}}', contact_cards())
    return out + header('index') + body + footer('index')

# ── ET5 ──
def gal(name, cls='gal'):
    return f'<div class="{cls}" data-gal="{name}"></div>'

def page_et5():
    out = head('et5', 't_et5', 'Skywell ET5 — tam elektrik ailə krossoveri: 520 km yürüş (NEDC), 72 kVt·saat batareya, 30 dəqiqəyə 20→80% şarj, 5 il zəmanət. Bakıda, Onvolt şourumunda.', 'https://skywell.az/et5', e('k_front', 1200))
    out += '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"Car","name":"Skywell ET5","brand":{"@type":"Brand","name":"Skywell"},"bodyType":"SUV","fuelType":"Electricity","vehicleSeatingCapacity":5,"offers":{"@type":"Offer","availability":"https://schema.org/InStock","seller":{"@type":"AutoDealer","name":"Onvolt MMC","telephone":"+994124400007"}}}</script>
'''
    out += header('et5')
    out += f'''<section class="phero dark" id="top" aria-labelledby="h1" data-st-block data-st-label="Əsas ekran">
  <div class="phero-bg"><img src="{e('k_front', 1600)}" alt="Skywell ET5" fetchpriority="high" width="1920" height="1280"></div>
  <div class="wrap">
    <div class="kicker" data-i18n="xK">[[xK]]</div>
    <h1 id="h1">Skywell ET5</h1>
    <p class="lead" data-i18n="xP">[[xP]]</p>
    <div class="ctas">
      <a class="btn w" href="index.html?model=Skywell%20ET5#contact" data-i18n="ask">[[ask]]</a>
      <a class="btn ow" href="https://turbo.az/avtosalonlar/onvoltskywell" target="_blank" rel="noopener" data-i18n="btnStock">[[btnStock]]</a>
    </div>
    {kv([('520 km', 'k1'), ('kWh72', 'k2'), ('k3v', 'k3'), ('k4v', 'k4')], 'hstats four')}
  </div>
</section>

<section class="sec" id="colors" aria-labelledby="colH" data-st-block data-st-label="Rənglər">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="colK">[[colK]]</div><h2 id="colH" data-i18n="colT">[[colT]]</h2></div>
    <div class="colpick rv">
      <div class="colimg"><img id="colImg" src="{DATA['COLORS'][0]}" alt="Skywell ET5" loading="lazy" width="1400" height="560"></div>
      <div class="swatches" role="radiogroup" aria-label="[[colL]]" data-i18n-aria="colL">
        <button type="button" role="radio" aria-checked="true" data-c="0"><i style="background:#14171c"></i><span data-i18n="c1">[[c1]]</span></button>
        <button type="button" role="radio" aria-checked="false" data-c="1"><i style="background:#f4f5f6"></i><span data-i18n="c2">[[c2]]</span></button>
        <button type="button" role="radio" aria-checked="false" data-c="2"><i style="background:#6d737c"></i><span data-i18n="c3">[[c3]]</span></button>
        <button type="button" role="radio" aria-checked="false" data-c="3"><i style="background:#2f4a78"></i><span data-i18n="c4">[[c4]]</span></button>
      </div>
    </div>
  </div>
</section>

<section class="sec" id="exterior" aria-labelledby="exH" style="padding-top:0" data-st-block data-st-label="Xarici görünüş">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="exK">[[exK]]</div><h2 id="exH" data-i18n="exT">[[exT]]</h2><p data-i18n="exP">[[exP]]</p></div>
    {gal('GAL_EXT')}
  </div>
</section>

<section class="sec" id="interior" aria-labelledby="inH" style="background:#fff" data-st-block data-st-label="Salon">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="inK">[[inK]]</div><h2 id="inH" data-i18n="inT">[[inT]]</h2><p data-i18n="inP">[[inP]]</p></div>
    {gal('GAL_INT')}
  </div>
</section>

<section class="sec" id="features" aria-labelledby="tcH" data-st-block data-st-label="İmkanlar">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="tcK">[[tcK]]</div><h2 id="tcH" data-i18n="tcT">[[tcT]]</h2></div>
    <div class="tcards">
      <article class="rv"><img src="{e('f_roof', 900)}" alt="" loading="lazy" width="900" height="600"><div><h3 data-i18n="tc1T">[[tc1T]]</h3><p data-i18n="tc1P">[[tc1P]]</p></div></article>
      <article class="rv"><img src="{e('f_relax', 900)}" alt="" loading="lazy" width="900" height="600"><div><h3 data-i18n="tc2T">[[tc2T]]</h3><p data-i18n="tc2P">[[tc2P]]</p></div></article>
      <article class="rv"><img src="{e('f_tailgate', 900)}" alt="" loading="lazy" width="900" height="600"><div><h3 data-i18n="tc3T">[[tc3T]]</h3><p data-i18n="tc3P">[[tc3P]]</p></div></article>
      <article class="rv"><img src="{e('f_lights', 900)}" alt="" loading="lazy" width="900" height="600"><div><h3 data-i18n="tc4T">[[tc4T]]</h3><p data-i18n="tc4P">[[tc4P]]</p></div></article>
    </div>
  </div>
</section>

<section class="sec et5" id="safety" aria-labelledby="adH" data-st-block data-st-label="Təhlükəsizlik">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="adK">[[adK]]</div><h2 id="adH" data-i18n="adT">[[adT]]</h2><p data-i18n="adP">[[adP]]</p></div>
    <div class="adas rv">
      <img src="{e('a1', 800)}" alt="" loading="lazy" width="800" height="500">
      <img src="{e('a2', 800)}" alt="" loading="lazy" width="800" height="500">
      <img src="{e('a3', 800)}" alt="" loading="lazy" width="800" height="500">
      <img src="{e('a4', 800)}" alt="" loading="lazy" width="800" height="500">
    </div>
    <div class="feat">
      <div class="rv"><h3 data-i18n="fe1T">[[fe1T]]</h3><ul data-i18n-list="fe1"></ul></div>
      <div class="rv"><h3 data-i18n="fe2T">[[fe2T]]</h3><ul data-i18n-list="fe2"></ul></div>
      <div class="rv"><h3 data-i18n="fe3T">[[fe3T]]</h3><ul data-i18n-list="fe3"></ul></div>
    </div>
    <p class="fine" data-i18n="eFine">[[eFine]]</p>
  </div>
</section>

<section class="sec" id="specs" aria-labelledby="spH" data-st-block data-st-label="Göstəricilər">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="spK">[[spK]]</div><h2 id="spH" data-i18n="spT">[[spT]]</h2></div>
    <div class="tbl light rv">
      <table>
        <caption class="vh" data-i18n="tCap">[[tCap]]</caption>
        <thead><tr><th scope="col" data-i18n="t0">[[t0]]</th><th scope="col" data-i18n="t1">[[t1]]</th><th scope="col" data-i18n="t2">[[t2]]</th><th scope="col" data-i18n="t3">[[t3]]</th><th scope="col" data-i18n="t4">[[t4]]</th><th scope="col" data-i18n="t5">[[t5]]</th></tr></thead>
        <tbody id="trims"></tbody>
      </table>
    </div>
    <div class="dims light">
      <span><span data-i18n="d1">[[d1]]</span>: <b>4698 × 1908 × 1696 mm</b></span>
      <span><span data-i18n="d2">[[d2]]</span>: <b>2800 mm</b></span>
      <span><span data-i18n="d3">[[d3]]</span>: <b>159–190 mm</b></span>
      <span><span data-i18n="d4">[[d4]]</span>: <b data-i18n="d4v">[[d4v]]</b></span>
      <span><span data-i18n="d5">[[d5]]</span>: <b data-i18n="d5v">[[d5v]]</b></span>
    </div>
    <div class="split rv">
      <img src="{e('charge', 1200)}" alt="Skywell ET5" loading="lazy" width="1200" height="800">
      <div>
        <h3 data-i18n="xcT">[[xcT]]</h3>
        <p data-i18n="xcP">[[xcP]]</p>
        <div class="wbox">
          <div><b data-i18n="wr1v">[[wr1v]]</b><span data-i18n="wr1">[[wr1]]</span></div>
          <div><b data-i18n="wr2v">[[wr2v]]</b><span data-i18n="wr2">[[wr2]]</span></div>
        </div>
        <p class="links"><a href="index.html#charging" data-i18n="xcL">[[xcL]]</a> <a href="https://youtu.be/raRf4QKhJoo" target="_blank" rel="noopener" data-i18n="btnVideo">[[btnVideo]]</a></p>
      </div>
    </div>
  </div>
</section>
'''
    out += cta_band('xctaT', 'xctaP', 'Skywell ET5')
    return out + footer('et5')

# ── HT-i ──
def crop_style(c):
    x, y, k = c.split()
    return f'object-position:{x} {y};transform:scale({k});transform-origin:{x} {y}'

def page_hti():
    out = head('hti', 't_hti', 'Skywell HT-i — plug-in hibrid SUV: 200 km-ə qədər elektrik yürüşü (CLTC), 160 kVt elektromotor və 1.5T mühərrik. Bakıda satışda, rəsmi idxalçı Onvolt.', 'https://skywell.az/ht-i', HTI + 'HT-i-prop-web.jpg?v=v2')
    out += header('hti')
    rows = [('hs_dim', '4720 × 1908 × 1701 mm'), ('hs_wb', '2800 mm'), ('hs_boot', 'hs_bootv'), ('hs_w', 'hs_wv'), ('hs_tank', 'hs_tankv'),
            ('hs_drive', 'hs_drivev'), ('hs_top', 'hs_topv'), ('hs_ac', 'hs_acv'), ('hs_v2l', 'hs_v2lv')]
    trs = ''.join(f'<tr><th scope="row" data-i18n="{k}">[[{k}]]</th>' + (f'<td data-i18n="{v}">[[{v}]]</td>' if v in I else f'<td>{v}</td>') + '</tr>' for k, v in rows)
    out += f'''<section class="phero lightbg" id="top" aria-labelledby="h1" data-st-block data-st-label="Əsas ekran">
  <div class="wrap">
    <div class="kicker" data-i18n="hK">[[hK]]</div>
    <h1 id="h1">Skywell HT-i</h1>
    <p class="lead" data-i18n="hP">[[hP]]</p>
    <div class="ctas">
      <a class="btn p" href="index.html?model=Skywell%20HT-i#contact" data-i18n="ask">[[ask]]</a>
      <a class="btn o" href="https://turbo.az/avtosalonlar/onvoltskywell" target="_blank" rel="noopener" data-i18n="btnStock">[[btnStock]]</a>
    </div>
    <div class="phero-car crop"><img src="{HTI}HTi-list2.jpg?v=v2" alt="Skywell HT-i" fetchpriority="high" width="1920" height="960" style="{crop_style(HTI_CROP)}"></div>
    {kv([('hk1v', 'hk1'), ('hk2v', 'hk2'), ('hk3v', 'hk3'), ('hk4v', 'hk4'), ('hk5v', 'hk5'), ('hk6v', 'hk6')], 'kv light')}
  </div>
</section>

<section class="sec" id="how" aria-labelledby="hwH" style="background:#fff" data-st-block data-st-label="Necə işləyir">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="hwK">[[hwK]]</div><h2 id="hwH" data-i18n="hwT">[[hwT]]</h2></div>
    <div class="why three">
      <div class="rv"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg></div><h3 data-i18n="hw1T">[[hw1T]]</h3><p data-i18n="hw1P">[[hw1P]]</p></div>
      <div class="rv"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14M3 20h12M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/><path d="M7 8h4"/></svg></div><h3 data-i18n="hw2T">[[hw2T]]</h3><p data-i18n="hw2P">[[hw2P]]</p></div>
      <div class="rv"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 3v5M17 3v5M5 8h14v3a7 7 0 0 1-14 0V8zM12 18v3"/></svg></div><h3 data-i18n="hw3T">[[hw3T]]</h3><p data-i18n="hw3P">[[hw3P]]</p></div>
    </div>
  </div>
</section>

<section class="sec" id="gallery" aria-labelledby="hgH" data-st-block data-st-label="Qalereya">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="hgK">[[hgK]]</div><h2 id="hgH" data-i18n="hgT">[[hgT]]</h2><p data-i18n="hgP">[[hgP]]</p></div>
    {gal('GAL_HTI', 'gal wide')}
  </div>
</section>

<section class="sec" id="specs" aria-labelledby="hsH" style="background:#fff" data-st-block data-st-label="Göstəricilər">
  <div class="wrap">
    <div class="sec-h rv"><div class="kicker" data-i18n="hsK">[[hsK]]</div><h2 id="hsH" data-i18n="hsT">[[hsT]]</h2></div>
    <div class="dimimg rv"><img src="{HTI}HT-i-prop-web.jpg?v=v2" alt="Skywell HT-i" loading="lazy" width="1920" height="960"></div>
    <div class="spec2">
      <div class="tbl light rv"><table><tbody>{trs}</tbody></table></div>
      <div class="eqbox rv"><h3 data-i18n="heqT">[[heqT]]</h3><ul data-i18n-list="heq"></ul></div>
    </div>
    <p class="disc" data-i18n="hNote">[[hNote]]</p>
  </div>
</section>
'''
    out += cta_band('hctaT', 'hctaP', 'Skywell HT-i')
    return out + footer('hti')

def main():
    pages = {'index.html': page_index(), 'et5.html': page_et5(), 'ht-i.html': page_hti()}
    js = {lg: {k: v[i] for k, v in I.items()} for i, lg in enumerate(['az', 'ru', 'en'])}
    (ROOT / 'assets' / 'i18n.js').write_text('/* generated by _src/build.py from _src/i18n.py */\nwindow.SW_I=' + json.dumps(js, ensure_ascii=False, separators=(',', ':')) + ';\n', 'utf-8')
    (ROOT / 'assets' / 'data.js').write_text('/* generated by _src/build.py — modellər, tarix, fotolar */\nwindow.SW_D=' + json.dumps(DATA, ensure_ascii=False, separators=(',', ':')) + ';\nwindow.SW_ALT=' + json.dumps(ALT) + ';\n', 'utf-8')
    import hashlib
    def ver(f): return hashlib.md5((ROOT / f).read_bytes()).hexdigest()[:8]
    for f, s in pages.items():
        s = sub(s)
        for a in ['assets/app.css', 'assets/app.js', 'assets/i18n.js', 'assets/data.js', 'assets/st-content.js']:
            s = s.replace(f'"{a}"', f'"{a}?v={ver(a)}"')
        left = re.findall(r'\[\[!?\w+\]\]', s)
        if left: raise SystemExit(f'{f}: unresolved {left[:5]}')
        (ROOT / f).write_text(s, 'utf-8')
    js = {lg: {k: v[i] for k, v in I.items()} for i, lg in enumerate(['az', 'ru', 'en'])}
    (ROOT / 'assets' / 'i18n.js').write_text('/* generated by _src/build.py from _src/i18n.py */\nwindow.SW_I=' + json.dumps(js, ensure_ascii=False, separators=(',', ':')) + ';\n', 'utf-8')
    (ROOT / 'assets' / 'data.js').write_text('/* generated by _src/build.py — modellər, tarix, fotolar */\nwindow.SW_D=' + json.dumps(DATA, ensure_ascii=False, separators=(',', ':')) + ';\nwindow.SW_ALT=' + json.dumps(ALT) + ';\n', 'utf-8')
    print('ok:', ', '.join(pages))

if __name__ == '__main__':
    main()
