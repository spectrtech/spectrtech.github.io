/* Skywell Azərbaycan — общий скрипт страниц (index, et5, ht-i).
   Тексты: window.SW_I (assets/i18n.js), данные: window.SW_D (assets/data.js) — оба создаёт _src/build.py.
   Правки владельца: SpectrTech editor (st-content.js → STC). */
(function () {
  'use strict';
  var D = document, W = window;
  var I = W.SW_I || { az: {} }, DATA = W.SW_D || {};
  var PAGE = D.body.getAttribute('data-page') || 'index';
  var lang = 'az';
  var STC = W.STC || { use: function () {}, img: function (p) { return p; } };

  var PD = PAGE === 'index' ? { MODELS: DATA.MODELS, TL: DATA.TL }
    : PAGE === 'et5' ? { COLORS: DATA.COLORS, GAL_EXT: DATA.GAL_EXT, GAL_INT: DATA.GAL_INT }
    : { GAL_HTI: DATA.GAL_HTI };
  STC.use(PAGE, { I: I, data: PD, wa: ['994994400007'], refresh: function () { apply(lang); } });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tr(v) { return v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] || v.az || '') : (v == null ? '' : String(v)); }
  function t(k) { var d = I[lang] || I.az; return d[k] != null ? d[k] : (I.az[k] != null ? I.az[k] : ''); }
  var $ = function (id) { return D.getElementById(id); };
  function img(u) { return STC.img(u || ''); }

  var CAR = '<svg viewBox="0 0 240 90" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><path d="M14 64c0-8 4-12 14-14l34-6 30-22c6-4 12-6 20-6h46c8 0 14 3 20 8l24 22 18 4c6 2 8 6 8 12v6c0 3-2 5-5 5h-14"/><path d="M60 69H34M156 69H90"/><circle cx="74" cy="68" r="14"/><circle cx="174" cy="68" r="14"/><path d="M98 42l22-18h30l20 18z"/></svg>';

  /* фото не загрузилось → заглушка или скрыть */
  function guard(root) {
    (root || D).querySelectorAll('img:not([data-gd])').forEach(function (im) {
      im.setAttribute('data-gd', '1');
      var bad = function () {
        var ph = im.closest('.ph');
        if (ph) { var nf = ph.querySelector('.nf'); im.remove(); if (nf) nf.hidden = false; return; }
        if (im.closest('#logo')) { $('logo').classList.add('nologo'); return; }
        var box = im.closest('.gi,.tcards article,.adas,.et5-img,.split,.colimg,.phero-car');
        im.style.visibility = 'hidden';
        if (box && box.classList.contains('gi')) box.hidden = true;
      };
      im.addEventListener('error', bad);
      if (im.complete && im.naturalWidth === 0 && im.getAttribute('src')) bad();
    });
  }

  /* ── главная: модели ── */
  var filter = 'all';
  function renderModels() {
    var g = $('mgrid'); if (!g) return;
    g.innerHTML = (DATA.MODELS || []).map(function (m, i) {
      if (filter !== 'all' && m.st !== filter) return '';
      var src = img(m.img);
      var ph = (src ? '<img src="' + esc(src) + '" alt="' + esc(m.name) + '" loading="lazy" width="900" height="560"' + cropStyle(m.crop) + '>' : '') +
        '<div class="nf"' + (src ? ' hidden' : '') + '>' + CAR + '<span>' + esc(t('photoSoon')) + '</span></div>';
      var sp = (m.specs || []).filter(function (s) { return tr(s.v); }).map(function (s) { return '<div><dt>' + esc(tr(s.l)) + '</dt><dd>' + esc(tr(s.v)) + '</dd></div>'; }).join('');
      var note = tr(m.note);
      var gl = (m.gal || []).filter(Boolean).length;
      var act = (m.page ? '<a class="btn p" href="' + esc(m.page) + '">' + esc(t('more')) + '</a>' : '') +
        '<a class="btn ' + (m.page ? 'o' : 'p') + '" href="#contact" data-model="' + esc(m.name) + '">' + esc(t('ask')) + '</a>' +
        (!m.page && gl ? '<button type="button" class="btn o" data-mgal="' + i + '">' + esc(t('photos')) + ' (' + gl + ')</button>' : '');
      var title = m.page ? '<a href="' + esc(m.page) + '">' + esc(m.name) + '</a>' : esc(m.name);
      return '<article class="mc ' + (m.st === 'sale' ? 'is-sale' : 'is-soon') + '" data-st="MODELS.' + i + '"><div class="ph">' + ph + '<span class="badge ' + (m.st === 'sale' ? 'sale' : '') + '">' + esc(t(m.st === 'sale' ? 'sale' : 'soon')) + '</span></div>' +
        '<div class="bd"><div><div class="tp">' + esc(tr(m.body)) + '</div><h3>' + title + '</h3></div>' +
        (sp ? '<dl class="specs">' + sp + '</dl>' : '') + (note ? '<p class="note">' + esc(note) + '</p>' : '') +
        '<div class="act">' + act + '</div></div></article>';
    }).join('');
    guard(g);
  }
  function cropStyle(c) {
    var p = String(c || '').trim().split(/\s+/);
    if (p.length !== 3 || !/^[\d.]+%$/.test(p[0]) || !/^[\d.]+%$/.test(p[1]) || !/^[\d.]+$/.test(p[2])) return '';
    return ' style="object-position:' + p[0] + ' ' + p[1] + ';transform:scale(' + p[2] + ');transform-origin:' + p[0] + ' ' + p[1] + '"';
  }
  function renderTL() {
    var o = $('tl'); if (!o) return;
    o.innerHTML = (DATA.TL || []).map(function (x, i) { return '<li data-st="TL.' + i + '"><b>' + esc(x.y) + '</b><p>' + esc(tr(x.t)) + '</p></li>'; }).join('');
  }
  function renderModelSelect() {
    var s = $('fModel'); if (!s) return;
    var cur = s.value;
    s.innerHTML = (DATA.MODELS || []).map(function (m) { return '<option>' + esc(m.name) + '</option>'; }).join('') + '<option value="-">' + esc(t('mOther')) + '</option>';
    if (cur) s.value = cur;
    if (!s.value) s.selectedIndex = 0;
  }

  /* ── ET5: версии ── */
  function renderTrims() {
    var b = $('trims'); if (!b) return;
    b.innerHTML = (DATA.TRIMS || []).map(function (r) {
      var cons = lang === 'en' ? r[3] : r[3].replace('.', ',');
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1] + ' ' + t('kwh')) + '</td><td>' + esc(lang === 'ru' ? r[2].replace('km', 'км') : r[2]) + '</td><td>' + esc(cons + ' ' + t('per100')) + '</td><td>' + esc(r[4]) + '</td><td>' + esc(r[5]) + '</td></tr>';
    }).join('');
  }

  /* ── галереи + просмотр ── */
  var LB = { list: [], i: 0 };
  function big(u) { return String(u).replace(/\/-\/resize\/\d+x\//, '/-/resize/1600x/'); }
  function small(u, w) { return String(u).replace(/\/-\/resize\/\d+x\//, '/-/resize/' + w + 'x/'); }
  function renderGals() {
    D.querySelectorAll('[data-gal]').forEach(function (box) {
      var name = box.getAttribute('data-gal'), list = (PD[name] || []).filter(Boolean), wide = box.classList.contains('wide');
      var alt = (W.SW_ALT || {})[name] || 'Skywell';
      box.innerHTML = list.map(function (u, i) {
        var src = img(u);
        var pic = '<img src="' + esc(wide ? src : small(src, 900)) + '" alt="' + esc(alt) + '" loading="lazy" width="900" height="600">';
        return wide ? '<figure class="gi" data-st="' + name + '.' + i + '">' + pic + '</figure>'
          : '<button type="button" class="gi" data-st="' + name + '.' + i + '" data-g="' + name + '" data-i="' + i + '" aria-label="' + esc(t('openPhoto') + ' ' + (i + 1)) + '">' + pic + '</button>';
      }).join('');
      guard(box);
    });
  }
  var lb = $('lb');
  function lbShow() {
    var u = img(LB.list[LB.i]); $('lbI').src = big(u); $('lbI').alt = (LB.alt || 'Skywell') + ' — ' + (LB.i + 1);
    $('lbC').textContent = (LB.i + 1) + ' / ' + LB.list.length;
  }
  function lbOpen(name, i, list, alt) {
    if (!lb || !lb.showModal) return;
    LB.list = (list || PD[name] || []).filter(Boolean); LB.i = i; LB.alt = alt || 'Skywell ET5'; lbShow(); lb.showModal();
  }
  if (lb) {
    $('lbX').addEventListener('click', function () { lb.close(); });
    $('lbP').addEventListener('click', function () { LB.i = (LB.i - 1 + LB.list.length) % LB.list.length; lbShow(); });
    $('lbN').addEventListener('click', function () { LB.i = (LB.i + 1) % LB.list.length; lbShow(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') $('lbP').click(); if (e.key === 'ArrowRight') $('lbN').click(); });
  }
  D.addEventListener('click', function (e) {
    var g = e.target.closest && e.target.closest('button.gi[data-g]');
    if (g) lbOpen(g.getAttribute('data-g'), +g.getAttribute('data-i'));
    var mg = e.target.closest && e.target.closest('[data-mgal]');
    if (mg) { var m = (DATA.MODELS || [])[+mg.getAttribute('data-mgal')]; if (m) lbOpen('', 0, m.gal, m.name); }
  });

  /* ── ET5: цвета ── */
  function setColor(n) {
    var ci = $('colImg'); if (!ci || !PD.COLORS) return;
    ci.style.visibility = ''; ci.src = img(PD.COLORS[n]);
    D.querySelectorAll('.swatches button').forEach(function (b) { b.setAttribute('aria-checked', String(+b.getAttribute('data-c') === n)); b.tabIndex = +b.getAttribute('data-c') === n ? 0 : -1; });
  }
  D.querySelectorAll('.swatches button').forEach(function (b, i, all) {
    b.addEventListener('click', function () { setColor(+b.getAttribute('data-c')); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return; e.preventDefault(); var n = (i + d + all.length) % all.length; setColor(n); all[n].focus();
    });
  });

  /* ── язык ── */
  function apply(lg) {
    lang = I[lg] ? lg : 'az';
    D.documentElement.lang = lang;
    var tk = { index: 't_index', et5: 't_et5', hti: 't_hti' }[PAGE]; if (t(tk)) D.title = t(tk);
    D.querySelectorAll('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (v !== '' && !Array.isArray(v)) el.textContent = v; });
    D.querySelectorAll('[data-i18n-html]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-html')); if (v !== '') el.innerHTML = STC.clean ? STC.clean(v) : v; });
    D.querySelectorAll('[data-i18n-aria]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-aria')); if (v) el.setAttribute('aria-label', v); });
    D.querySelectorAll('[data-i18n-list]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-list')); if (Array.isArray(v)) el.innerHTML = v.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); });
    D.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    D.querySelectorAll('[data-wa-model]').forEach(function (a) { a.href = 'https://wa.me/994994400007?text=' + encodeURIComponent(t('waHi').replace('{m}', a.getAttribute('data-wa-model'))); });
    renderModels(); renderTL(); renderModelSelect(); renderTrims(); renderGals();
    try { localStorage.setItem('sw_lang', lang); } catch (e) {}
  }
  var q = (location.search.match(/[?&]lang=(az|ru|en)\b/) || [])[1], saved = null;
  try { saved = localStorage.getItem('sw_lang'); } catch (e) {}
  apply(q || saved || 'az');
  D.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-lang')); }); });
  guard(D);

  /* модель из ссылки: index.html?model=Skywell%20ET5#contact */
  var qm = (location.search.match(/[?&]model=([^&#]+)/) || [])[1];
  if (qm && $('fModel')) { try { $('fModel').value = decodeURIComponent(qm); } catch (e) {} }

  /* фильтр моделей */
  D.querySelectorAll('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.getAttribute('data-f');
      D.querySelectorAll('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderModels();
    });
  });

  /* мобильное меню */
  var burger = $('burger'), mnav = $('mnav'), main = $('main'), foot = D.querySelector('footer');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    mnav.classList.toggle('open', open);
    [main, foot].forEach(function (el) { if (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } });
    D.body.style.overflow = open ? 'hidden' : '';
    if (open) { var a = mnav.querySelector('a'); if (a) a.focus(); }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('open')) { setMenu(false); burger.focus(); } });
  W.addEventListener('resize', function () { if (W.innerWidth > 1080 && mnav.classList.contains('open')) setMenu(false); });

  /* предвыбор модели/темы в форме */
  D.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-model],[data-topic]');
    if (!a || !$('fModel')) return;
    var m = a.getAttribute('data-model'), tp = a.getAttribute('data-topic');
    if (m) { $('fModel').value = m; $('fTopic').value = 'buy'; }
    if (tp) $('fTopic').value = tp;
  });

  /* форма → WhatsApp / e-mail */
  var form = $('form');
  if (form) {
    var err = function (id, msg) { var inp = $(id), e = $(id === 'fName' ? 'eName' : 'eTel'); e.textContent = msg || ''; if (msg) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); };
    var check = function () {
      var n = $('fName').value.trim(), p = $('fTel').value.replace(/\D/g, ''), ok = true, first = null;
      if (n.length < 2) { err('fName', t('eName')); ok = false; first = first || $('fName'); } else err('fName');
      if (p.length < 9 || p.length > 15) { err('fTel', t('eTel')); ok = false; first = first || $('fTel'); } else err('fTel');
      if (first) first.focus();
      return ok;
    };
    var text = function () {
      var tp = $('fTopic'), md = $('fModel');
      var lines = [t('msgHi'), t('msgName') + ': ' + $('fName').value.trim(), t('msgTel') + ': ' + $('fTel').value.trim(),
        t('msgModel') + ': ' + (md.value === '-' ? t('mOther') : md.value), t('msgTopic') + ': ' + tp.options[tp.selectedIndex].text];
      var m = $('fMsg').value.trim(); if (m) lines.push(t('msgMsg') + ': ' + m);
      return lines.join('\n');
    };
    ['fName', 'fTel'].forEach(function (id) { $(id).addEventListener('input', function () { if ($(id).getAttribute('aria-invalid')) check(); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); $('fOk').textContent = '';
      if (!check()) return;
      var url = STC.url ? STC.url('https://wa.me/994994400007') : 'https://wa.me/994994400007';
      W.open(url + '?text=' + encodeURIComponent(text()), '_blank', 'noopener');
      $('fOk').textContent = t('okWa');
    });
    $('fMail').addEventListener('click', function () {
      $('fOk').textContent = '';
      if (!check()) return;
      location.href = 'mailto:sales@onvolt.az?subject=' + encodeURIComponent(t('mailSubj')) + '&body=' + encodeURIComponent(text());
      $('fOk').textContent = t('okMail');
    });
  }

  /* появление блоков */
  var rv = D.querySelectorAll('.rv');
  if ('IntersectionObserver' in W && !W.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });
})();
