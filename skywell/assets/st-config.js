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
        { k: 'specs', label: { az: 'Göstəricilər', ru: 'Характеристики', en: 'Specs' }, type: 'list',
          item: { title: function (s, ctx) { return ((s.l && (s.l[ctx.lang] || s.l.az)) || '…') + ': ' + ((s.v && (s.v[ctx.lang] || s.v.az)) || ''); },
            fields: [
              { k: 'l', label: { az: 'Ad', ru: 'Название', en: 'Label' }, type: 'i18n' },
              { k: 'v', label: { az: 'Dəyər', ru: 'Значение', en: 'Value' }, type: 'i18n', hint: { az: 'Hər dildə eynidirsə, bir dəfə yazmaq kifayətdir.', ru: 'Если на всех языках одинаково, заполните один раз.', en: 'If it is the same in every language, fill it in once.' } }
            ],
            add: function () { return { l: { az: '', ru: '', en: '' }, v: { az: '', ru: '', en: '' } }; } } },
        { k: 'note', label: { az: 'Qeyd', ru: 'Примечание', en: 'Note' }, type: 'i18n', optional: true }
      ],
      add: function () { return { id: uid('m'), name: 'Skywell ', st: 'soon', body: { az: '', ru: '', en: '' }, img: '', specs: [], note: { az: '', ru: '', en: '' } }; } } };

  var TL = { title: { az: 'Brendin tarixi', ru: 'История бренда', en: 'Brand history' },
    item: { title: function (x) { return x.y || '…'; },
      fields: [
        { k: 'y', label: { az: 'İl', ru: 'Год', en: 'Year' }, type: 'text', w: 'sm' },
        { k: 't', label: { az: 'Mətn', ru: 'Текст', en: 'Text' }, type: 'i18n' }
      ],
      add: function () { return { y: String(new Date().getFullYear()), t: { az: '', ru: '', en: '' } }; } } };

  window.ST_EDITOR = {
    site: 'skywell-az',
    brand: 'Skywell',
    langs: L,
    pages: [
      { id: 'index', file: 'index.html', name: { az: 'Ana səhifə', ru: 'Главная', en: 'Home' }, data: { MODELS: MODELS, TL: TL } }
    ]
  };
})();
