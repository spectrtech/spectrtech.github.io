/* SpectrTech · st-config.js — что редактируется на сайте Skywell Azərbaycan.
   Тексты (словарь I) редактируются кликом по тексту или во вкладке «Mətnlər».
   Телефоны и ссылки — во вкладке контактов. Здесь — списки: модели и история бренда. */
(function () {
  var L = ['az', 'ru', 'en'];
  function opts(list) { return function (ctx) { return list.map(function (o) { return { v: o[0], label: o[1][ctx.lang] || o[1].az }; }); }; }
  function uid(p) { return p + Date.now().toString(36).slice(-5); }
  var ST = [['sale', { az: 'Satışda', ru: 'В продаже', en: 'On sale' }], ['soon', { az: 'Tezliklə', ru: 'Скоро', en: 'Coming soon' }]];

  var MODELS = { title: { az: 'Modellər', ru: 'Модели', en: 'Models' },
    hint: { az: 'Foto olmayan modeldə «Foto tezliklə» göstərilir. Göstəricilər kartda yuxarıdan aşağı sıra ilə çıxır.', ru: 'Если фото нет, показывается «Фото скоро». Характеристики выводятся на карточке по порядку.', en: 'Without a photo the card shows “Photo coming soon”. Specs are shown in order.' },
    item: { title: function (m) { return m.name || '…'; },
      fields: [
        { k: 'name', label: { az: 'Ad', ru: 'Название', en: 'Name' }, type: 'text' },
        { k: 'st', label: { az: 'Status', ru: 'Статус', en: 'Status' }, type: 'select', w: 'md', options: opts(ST) },
        { k: 'body', label: { az: 'Kuzov və mühərrik növü', ru: 'Кузов и тип привода', en: 'Body and powertrain' }, type: 'i18n' },
        { k: 'img', label: { az: 'Foto', ru: 'Фото', en: 'Photo' }, type: 'image', dir: 'img/m/', ext: '.jpg', optional: true },
        { k: 'crop', label: { az: 'Fotonun kəsilməsi', ru: 'Обрезка фото', en: 'Photo crop' }, type: 'text', w: 'md', optional: true, hint: { az: 'Məsələn: 55% 100% 1.4 (mərkəz X, mərkəz Y, böyütmə). Boş — tam foto.', ru: 'Например: 55% 100% 1.4 (центр X, центр Y, увеличение). Пусто — фото целиком.', en: 'E.g. 55% 100% 1.4 (centre X, centre Y, zoom). Empty — whole photo.' } },
        { k: 'gal', label: { az: 'Əlavə fotolar (Fotolar düyməsi)', ru: 'Дополнительные фото (кнопка «Фото»)', en: 'Extra photos (Photos button)' }, type: 'list', optional: true,
          item: { title: function (u, ctx, i) { return (ctx.lang === 'ru' ? 'Фото ' : ctx.lang === 'en' ? 'Photo ' : 'Foto ') + (i + 1); },
            fields: [{ k: '$', label: { az: 'Foto', ru: 'Фото', en: 'Photo' }, type: 'image', dir: 'img/m/', ext: '.jpg' }],
            add: function () { return ''; } } },
        { k: 'page', label: { az: 'Modelin səhifəsi (məs. et5.html)', ru: 'Страница модели (напр. et5.html)', en: 'Model page (e.g. et5.html)' }, type: 'text', w: 'md', optional: true },
        { k: 'specs', label: { az: 'Göstəricilər', ru: 'Характеристики', en: 'Specs' }, type: 'list',
          item: { title: function (s, ctx) { return ((s.l && (s.l[ctx.lang] || s.l.az)) || '…') + ': ' + ((s.v && (s.v[ctx.lang] || s.v.az)) || ''); },
            fields: [
              { k: 'l', label: { az: 'Ad', ru: 'Название', en: 'Label' }, type: 'i18n' },
              { k: 'v', label: { az: 'Dəyər', ru: 'Значение', en: 'Value' }, type: 'i18n', hint: { az: 'Hər dildə eynidirsə, bir dəfə yazmaq kifayətdir.', ru: 'Если на всех языках одинаково, заполните один раз.', en: 'If it is the same in every language, fill it in once.' } }
            ],
            add: function () { return { l: { az: '', ru: '', en: '' }, v: { az: '', ru: '', en: '' } }; } } },
        { k: 'note', label: { az: 'Qeyd', ru: 'Примечание', en: 'Note' }, type: 'i18n', optional: true }
      ],
      add: function () { return { id: uid('m'), name: 'Skywell ', st: 'soon', body: { az: '', ru: '', en: '' }, img: '', crop: '', gal: [], page: '', specs: [], note: { az: '', ru: '', en: '' } }; } } };

  var TL = { title: { az: 'Brendin tarixi', ru: 'История бренда', en: 'Brand history' },
    item: { title: function (x) { return x.y || '…'; },
      fields: [
        { k: 'y', label: { az: 'İl', ru: 'Год', en: 'Year' }, type: 'text', w: 'sm' },
        { k: 't', label: { az: 'Mətn', ru: 'Текст', en: 'Text' }, type: 'i18n' }
      ],
      add: function () { return { y: String(new Date().getFullYear()), t: { az: '', ru: '', en: '' } }; } } };

  function PHOTOS(title, dir) {
    return { title: title, item: { title: function (u, ctx, i) { return (ctx.lang === 'ru' ? 'Фото ' : ctx.lang === 'en' ? 'Photo ' : 'Foto ') + (i + 1); },
      fields: [{ k: '$', label: { az: 'Foto', ru: 'Фото', en: 'Photo' }, type: 'image', dir: dir, ext: '.jpg' }],
      add: function () { return ''; } } };
  }
  var COLORS = PHOTOS({ az: 'Rənglər (Qara, Ağ, Boz, Mavi)', ru: 'Цвета (чёрный, белый, серый, синий)', en: 'Colours (black, white, grey, blue)' }, 'img/et5/');
  COLORS.fixed = true;

  window.ST_EDITOR = {
    site: 'skywell-az',
    brand: 'Skywell',
    langs: L,
    pages: [
      { id: 'index', file: 'index.html', name: { az: 'Ana səhifə', ru: 'Главная', en: 'Home' }, data: { MODELS: MODELS, TL: TL } },
      { id: 'et5', file: 'et5.html', name: { az: 'Skywell ET5', ru: 'Skywell ET5', en: 'Skywell ET5' },
        data: { GAL_EXT: PHOTOS({ az: 'Xarici görünüş — fotolar', ru: 'Экстерьер — фото', en: 'Exterior — photos' }, 'img/et5/'), GAL_INT: PHOTOS({ az: 'Salon — fotolar', ru: 'Салон — фото', en: 'Interior — photos' }, 'img/et5/') } },
      { id: 'hti', file: 'ht-i.html', name: { az: 'Skywell HT-i', ru: 'Skywell HT-i', en: 'Skywell HT-i' },
        data: { GAL_HTI: PHOTOS({ az: 'Qalereya', ru: 'Галерея', en: 'Gallery' }, 'img/hti/') } }
    ]
  };
})();
