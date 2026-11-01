/* Skywell Azərbaycan — сайт. Тексты: словарь I (az, ru, en). Списки: MODELS, TL. CMS: st-content.js (STC). */
(function () {
  'use strict';
  var D = document, W = window;

  var I = {
    az: {
      title: 'Skywell Azərbaycan — elektrik avtomobilləri, Bakı',
      skip: 'Əsas məzmuna keçid', navL: 'Əsas menyu', menu: 'Menyu', filterL: 'Modelləri süz',
      nModels: 'Modellər', nWhy: 'Zəmanət və servis', nCharge: 'Şarj', nAbout: 'Brend haqqında', nContact: 'Əlaqə',
      heroK: 'Onvolt — Skywell-in Azərbaycanda rəsmi idxalçısı',
      heroT: 'Skywell — Azərbaycanda rəsmi təqdim olunan <em>ilk tam elektrik</em> avtomobil brendi',
      heroP: 'Skywell ET5 elektrik krossoveri bir dolumla 520 km-ə qədər yol gedir. Satış, rəsmi servis, ehtiyat hissələri və şarj — Bakıda, bir ünvanda.',
      ctaModels: 'Modellərə baxın', ctaContact: 'Bizimlə əlaqə',
      hs1: 'yürüş, NEDC', hs2v: '30 dəq', hs2: 'sürətli şarj 20→80%', hs3v: '8 il', hs3: 'batareyaya zəmanət',
      mK: 'Model çeşidi', mT: 'Skywell modelləri', mP: 'Skywell ET5 artıq Bakıda satışdadır. HT-i, Q və Skyhome tezliklə Azərbaycana gəlir.',
      fAll: 'Hamısı', fSale: 'Satışda', fSoon: 'Tezliklə',
      sale: 'Satışda', soon: 'Tezliklə', photoSoon: 'Foto tezliklə', more: 'Ətraflı', ask: 'Məlumat alın', stock: 'Salonda',
      mNote: 'Yeni modellərin göstəriciləri istehsalçının və beynəlxalq avtomobil mətbuatının açıqladığı məlumatlardır. Azərbaycan üçün versiyalarda fərqlənə bilər — dəqiq məlumat üçün bizimlə əlaqə saxlayın.',
      eT: 'Hər gün üçün tam elektrik SUV', eP: 'Ailə üçün geniş krossover: 2800 mm təkər bazası, 467–1141 litr baqaj, 360° kamera və sürücüyə köməkçi sistemlər.',
      k1: 'yürüş (NEDC)', kWh72: '72 kVt·s', k2: 'batareya', k3v: '~30 dəq', k3: '20→80%, 80 kVt DC', k4v: '8 san', k4: '0–100 km/saat', k5v: '160 km/saat', k5: 'maks. sürət', k6v: '320 N·m', k6: 'fırlanma momenti',
      btnStock: 'Salondakı avtomobillər', btnVideo: 'Video reportaj',
      tCap: 'Skywell ET5 versiyaları', t0: 'Versiya', t1: 'Batareya', t2: 'Yürüş (NEDC)', t3: 'Sərfiyyat', t4: 'Şarj portu', t5: 'Təkərlər',
      kwh: 'kVt·s', per100: 'kVt·s/100 km',
      d1: 'Ölçülər', d2: 'Təkər bazası', d3: 'Klirens', d4: 'Kütlə', d4v: '1820–1920 kq', d5: 'Baqaj', d5v: '467–1141 l',
      fe1T: 'Salon', fe2T: 'Təhlükəsizlik', fe3T: 'Rahatlıq',
      fe1: ['12,3" rəqəmsal cihazlar paneli və 12,8" multimedia ekranı', '128 rəngli ambient işıqlandırma', 'Yaddaşlı elektrik ön oturacaqlar', 'İsidilən və ventilyasiyalı ön oturacaqlar', '15 W simsiz telefon şarjı', 'Hava təmizləyici, 4G və Wi-Fi'],
      fe2: ['Adaptiv kruiz-kontrol', 'Zolaqda saxlama sistemi', 'Avtomatik təcili əyləc', 'Kor zona xəbərdarlığı', 'Yol nişanlarının tanınması', '6–8 təhlükəsizlik yastığı'],
      fe3: ['Açarsız giriş və işə salma', 'Ayaqla açılan elektrik baqaj qapısı', '360° kamera və park radarları', 'Avtomatik parkovka', 'İsidilən elektrik güzgüləri', 'Relax, Camping və Party rejimləri'],
      colT: 'Rənglər:', c1: 'Qara', c2: 'Ağ', c3: 'Boz', c4: 'Mavi',
      eFine: 'Avadanlıq versiyadan asılıdır. Dəqiq komplektasiya və qiymət üçün satış şöbəsi ilə əlaqə saxlayın.',
      wK: 'Niyə Skywell', wT: 'Alışdan sonra da yanınızdayıq',
      w1T: 'Zəmanət', w1P: 'İstehsalçı zəmanəti: avtomobilə 5 il və ya 150 000 km, batareyaya 8 il və ya 200 000 km.',
      w2T: 'Rəsmi servis', w2P: 'Plan üzrə texniki baxış, zəmanət xidməti, diaqnostika və proqram yeniləmələri.', w2L: 'Servis mərkəzi xəritədə →',
      w3T: 'Ehtiyat hissələri', w3P: 'İdxal olunan hər avtomobil üçün istehsalçının tələb etdiyi sayda orijinal ehtiyat hissəsi anbarda saxlanılır.',
      w4T: 'Rəsmi idxalçı', w4P: '2022-ci ilin aprelindən Onvolt Skywell-in Azərbaycanda rəsmi idxalçısıdır. Avtomobillər Avropa standartlarına uyğun sertifikatlaşdırılıb.',
      cK: 'Şarj', cT: 'Evdə, ofisdə və yolda', cP: 'Comfort və Luxury versiyalarında CCS2 (DC) və Type 2 (AC) portları var — Avropa standartı.',
      ch1T: 'Şourumda sürətli şarj', ch1P: 'Ceyhun Hacıbəyli 194 ünvanındakı şourumda 60 kW gücündə sürətli şarj stansiyası işləyir. Stansiya GoFar şəbəkəsinə daxildir.', ch1B: 'GoFar xəritəsi',
      ch2T: 'Ev üçün stansiya', ch2P: '72 kVt·s batareyanı 0-dan 100%-ədək təxminən 10 saata doldurur — gecə ərzində tam şarj.',
      ch3T: 'Ofis və biznes üçün', ch3P: 'Üç fazalı şəbəkə üçün güclü stansiya. Elcar ilə əməkdaşlıqda quraşdırılır.',
      chOrder: 'Stansiya sifariş et',
      chNote: 'Şarj müddəti stansiyanın gücünə əsasən hesablanıb; faktiki vaxt avtomobilin bort şarj cihazından və şəbəkədən asılıdır.',
      aK: 'Brend haqqında', aT: 'Skyworth-dan Skywell-ə',
      aP1: 'Skywell Çinin Skyworth korporasiyasının avtomobil brendidir. Korporasiya elektronika istehsalçısı kimi başlayıb, sonra elektrik avtobusları və minik elektromobilləri istehsalına keçib.',
      aP2: 'Onvolt MMC 2022-ci ildən Skywell-in Azərbaycanda rəsmi idxalçısıdır və Qafqazda brendin yeganə idxalçısıdır.',
      n1: 'Onvolt Bakıda yeni şourum açdı və Skywell ET5-i təqdim etdi', n2: 'Bakıda elektromobil həvəskarları üçün Skywell ET5 təqdimatı', n3: 'Skywell ET5 — video reportaj', read: 'Oxu →', watch: 'İzlə →',
      ctT: 'Şourumda sizi gözləyirik', ctP: 'Sualınızı yazın — satış şöbəsi sizinlə əlaqə saxlayacaq.',
      ciA: 'Şourum', ciT: 'Telefon', addr: 'Bakı, Ceyhun Hacıbəyli 194',
      fT: 'Sorğu göndərin', fName: 'Adınız *', fTel: 'Telefon *', fModel: 'Model', fTopic: 'Mövzu', fMsg: 'Mesaj',
      tp1: 'Avtomobil alışı', tp2: 'Servis', tp3: 'Şarj stansiyası', tp4: 'Digər', mOther: 'Digər / bilmirəm',
      fSend: 'WhatsApp ilə göndər', fMail: 'E-mail ilə göndər', fHint: 'Göndər düyməsi hazır mətnlə WhatsApp və ya poçt proqramını açır.',
      eName: 'Adınızı yazın.', eTel: 'Telefon nömrəsini düzgün yazın, məsələn: +994 50 123 45 67.',
      okWa: 'WhatsApp açıldı. Mesajı orada göndərin.', okMail: 'Poçt proqramı açıldı. Məktubu orada göndərin.',
      msgHi: 'Salam! skywell.az saytından sorğu.', msgName: 'Ad', msgTel: 'Telefon', msgModel: 'Model', msgTopic: 'Mövzu', msgMsg: 'Mesaj', mailSubj: 'Skywell — sorğu',
      ftP: 'Onvolt MMC — Skywell elektrik avtomobillərinin Azərbaycanda rəsmi idxalçısı.', ftNav: 'Bölmələr', ftMore: 'Onvolt', ftC: '© 2026 Onvolt MMC. Bütün hüquqlar qorunur.'
    },
    ru: {
      title: 'Skywell Азербайджан — электромобили, Баку',
      skip: 'Перейти к содержанию', navL: 'Главное меню', menu: 'Меню', filterL: 'Фильтр моделей',
      nModels: 'Модели', nWhy: 'Гарантия и сервис', nCharge: 'Зарядка', nAbout: 'О бренде', nContact: 'Контакты',
      heroK: 'Onvolt — официальный импортёр Skywell в Азербайджане',
      heroT: 'Skywell — первый <em>полностью электрический</em> автобренд, официально представленный в Азербайджане',
      heroP: 'Электрокроссовер Skywell ET5 проезжает до 520 км на одной зарядке. Продажа, официальный сервис, запчасти и зарядка — в Баку, по одному адресу.',
      ctaModels: 'Смотреть модели', ctaContact: 'Связаться с нами',
      hs1: 'запас хода, NEDC', hs2v: '30 мин', hs2: 'быстрая зарядка 20→80%', hs3v: '8 лет', hs3: 'гарантия на батарею',
      mK: 'Модельный ряд', mT: 'Модели Skywell', mP: 'Skywell ET5 уже в продаже в Баку. HT-i, Q и Skyhome скоро появятся в Азербайджане.',
      fAll: 'Все', fSale: 'В продаже', fSoon: 'Скоро',
      sale: 'В продаже', soon: 'Скоро', photoSoon: 'Фото скоро', more: 'Подробнее', ask: 'Узнать больше', stock: 'В наличии',
      mNote: 'Характеристики новых моделей — данные производителя и международной автомобильной прессы. Для версий для Азербайджана они могут отличаться — точные данные уточняйте у нас.',
      eT: 'Полностью электрический SUV на каждый день', eP: 'Просторный семейный кроссовер: колёсная база 2800 мм, багажник 467–1141 л, камера 360° и системы помощи водителю.',
      k1: 'запас хода (NEDC)', kWh72: '72 кВт·ч', k2: 'батарея', k3v: '~30 мин', k3: '20→80%, 80 кВт DC', k4v: '8 с', k4: '0–100 км/ч', k5v: '160 км/ч', k5: 'макс. скорость', k6v: '320 Н·м', k6: 'крутящий момент',
      btnStock: 'Авто в наличии', btnVideo: 'Видеорепортаж',
      tCap: 'Версии Skywell ET5', t0: 'Версия', t1: 'Батарея', t2: 'Запас хода (NEDC)', t3: 'Расход', t4: 'Разъём зарядки', t5: 'Шины',
      kwh: 'кВт·ч', per100: 'кВт·ч/100 км',
      d1: 'Габариты', d2: 'Колёсная база', d3: 'Клиренс', d4: 'Масса', d4v: '1820–1920 кг', d5: 'Багажник', d5v: '467–1141 л',
      fe1T: 'Салон', fe2T: 'Безопасность', fe3T: 'Комфорт',
      fe1: ['Цифровая приборная панель 12,3" и мультимедиа 12,8"', 'Атмосферная подсветка, 128 цветов', 'Электрические передние сиденья с памятью', 'Подогрев и вентиляция передних сидений', 'Беспроводная зарядка телефона 15 Вт', 'Очиститель воздуха, 4G и Wi-Fi'],
      fe2: ['Адаптивный круиз-контроль', 'Удержание в полосе', 'Автоматическое экстренное торможение', 'Контроль слепых зон', 'Распознавание дорожных знаков', '6–8 подушек безопасности'],
      fe3: ['Бесключевой доступ и запуск', 'Электропривод багажника с открытием ногой', 'Камера 360° и парктроники', 'Автоматическая парковка', 'Электрозеркала с подогревом', 'Режимы Relax, Camping и Party'],
      colT: 'Цвета:', c1: 'Чёрный', c2: 'Белый', c3: 'Серый', c4: 'Синий',
      eFine: 'Оснащение зависит от версии. Точную комплектацию и цену уточняйте в отделе продаж.',
      wK: 'Почему Skywell', wT: 'Рядом с вами и после покупки',
      w1T: 'Гарантия', w1P: 'Гарантия производителя: на автомобиль 5 лет или 150 000 км, на батарею 8 лет или 200 000 км.',
      w2T: 'Официальный сервис', w2P: 'Плановое ТО, гарантийное обслуживание, диагностика и обновление ПО.', w2L: 'Сервисный центр на карте →',
      w3T: 'Запчасти', w3P: 'Для каждого ввезённого автомобиля на складе хранится требуемое производителем количество оригинальных запчастей.',
      w4T: 'Официальный импортёр', w4P: 'С апреля 2022 года Onvolt — официальный импортёр Skywell в Азербайджане. Автомобили сертифицированы по европейским стандартам.',
      cK: 'Зарядка', cT: 'Дома, в офисе и в пути', cP: 'Версии Comfort и Luxury оснащены разъёмами CCS2 (DC) и Type 2 (AC) — европейский стандарт.',
      ch1T: 'Быстрая зарядка в шоуруме', ch1P: 'В шоуруме на Джейхуна Гаджибейли, 194 работает быстрая зарядная станция мощностью 60 кВт. Станция входит в сеть GoFar.', ch1B: 'Карта GoFar',
      ch2T: 'Станция для дома', ch2P: 'Заряжает батарею 72 кВт·ч с 0 до 100% примерно за 10 часов — полная зарядка за ночь.',
      ch3T: 'Для офиса и бизнеса', ch3P: 'Мощная станция для трёхфазной сети. Устанавливается совместно с Elcar.',
      chOrder: 'Заказать станцию',
      chNote: 'Время зарядки рассчитано по мощности станции; фактическое время зависит от бортового зарядного устройства автомобиля и сети.',
      aK: 'О бренде', aT: 'От Skyworth к Skywell',
      aP1: 'Skywell — автомобильный бренд китайской корпорации Skyworth. Корпорация начинала как производитель электроники, затем перешла к выпуску электробусов и легковых электромобилей.',
      aP2: 'С 2022 года Onvolt — официальный импортёр Skywell в Азербайджане и единственный импортёр бренда на Кавказе.',
      n1: 'Onvolt открыл в Баку новый шоурум и представил Skywell ET5', n2: 'Презентация Skywell ET5 для любителей электромобилей в Баку', n3: 'Skywell ET5 — видеорепортаж', read: 'Читать →', watch: 'Смотреть →',
      ctT: 'Ждём вас в шоуруме', ctP: 'Напишите вопрос — отдел продаж свяжется с вами.',
      ciA: 'Шоурум', ciT: 'Телефон', addr: 'Баку, ул. Джейхуна Гаджибейли, 194',
      fT: 'Отправить запрос', fName: 'Ваше имя *', fTel: 'Телефон *', fModel: 'Модель', fTopic: 'Тема', fMsg: 'Сообщение',
      tp1: 'Покупка автомобиля', tp2: 'Сервис', tp3: 'Зарядная станция', tp4: 'Другое', mOther: 'Другое / не знаю',
      fSend: 'Отправить в WhatsApp', fMail: 'Отправить по e-mail', fHint: 'Кнопка открывает WhatsApp или почту с готовым текстом.',
      eName: 'Введите имя.', eTel: 'Введите номер правильно, например: +994 50 123 45 67.',
      okWa: 'WhatsApp открыт. Отправьте сообщение там.', okMail: 'Почтовое приложение открыто. Отправьте письмо там.',
      msgHi: 'Здравствуйте! Запрос с сайта skywell.az.', msgName: 'Имя', msgTel: 'Телефон', msgModel: 'Модель', msgTopic: 'Тема', msgMsg: 'Сообщение', mailSubj: 'Skywell — запрос',
      ftP: 'Onvolt MMC — официальный импортёр электромобилей Skywell в Азербайджане.', ftNav: 'Разделы', ftMore: 'Onvolt', ftC: '© 2026 Onvolt MMC. Все права защищены.'
    },
    en: {
      title: 'Skywell Azerbaijan — electric cars in Baku',
      skip: 'Skip to content', navL: 'Main menu', menu: 'Menu', filterL: 'Filter models',
      nModels: 'Models', nWhy: 'Warranty & service', nCharge: 'Charging', nAbout: 'About', nContact: 'Contact',
      heroK: 'Onvolt — official Skywell importer in Azerbaijan',
      heroT: 'Skywell — the first <em>all-electric</em> car brand officially launched in Azerbaijan',
      heroP: 'The Skywell ET5 electric SUV covers up to 520 km on a single charge. Sales, official service, spare parts and charging — in Baku, all at one address.',
      ctaModels: 'View models', ctaContact: 'Contact us',
      hs1: 'range, NEDC', hs2v: '30 min', hs2: 'fast charge 20→80%', hs3v: '8 years', hs3: 'battery warranty',
      mK: 'Line-up', mT: 'Skywell models', mP: 'The Skywell ET5 is on sale in Baku now. HT-i, Q and Skyhome are coming to Azerbaijan soon.',
      fAll: 'All', fSale: 'On sale', fSoon: 'Coming soon',
      sale: 'On sale', soon: 'Coming soon', photoSoon: 'Photo coming soon', more: 'Details', ask: 'Get info', stock: 'In stock',
      mNote: 'Figures for the new models come from the manufacturer and the international motoring press. Versions for Azerbaijan may differ — contact us for exact details.',
      eT: 'An all-electric SUV for every day', eP: 'A roomy family SUV: 2800 mm wheelbase, 467–1141 L boot, 360° camera and driver assistance.',
      k1: 'range (NEDC)', kWh72: '72 kWh', k2: 'battery', k3v: '~30 min', k3: '20→80%, 80 kW DC', k4v: '8 s', k4: '0–100 km/h', k5v: '160 km/h', k5: 'top speed', k6v: '320 Nm', k6: 'torque',
      btnStock: 'Cars in stock', btnVideo: 'Video review',
      tCap: 'Skywell ET5 versions', t0: 'Version', t1: 'Battery', t2: 'Range (NEDC)', t3: 'Consumption', t4: 'Charging port', t5: 'Tyres',
      kwh: 'kWh', per100: 'kWh/100 km',
      d1: 'Dimensions', d2: 'Wheelbase', d3: 'Ground clearance', d4: 'Weight', d4v: '1820–1920 kg', d5: 'Boot', d5v: '467–1141 L',
      fe1T: 'Interior', fe2T: 'Safety', fe3T: 'Comfort',
      fe1: ['12.3" digital instruments and 12.8" infotainment screen', '128-colour ambient lighting', 'Power front seats with memory', 'Heated and ventilated front seats', '15 W wireless phone charging', 'Air purifier, 4G and Wi-Fi'],
      fe2: ['Adaptive cruise control', 'Lane keeping assist', 'Automatic emergency braking', 'Blind-spot warning', 'Traffic sign recognition', '6–8 airbags'],
      fe3: ['Keyless entry and start', 'Power tailgate with foot sensor', '360° camera and parking sensors', 'Automatic parking', 'Heated power mirrors', 'Relax, Camping and Party modes'],
      colT: 'Colours:', c1: 'Black', c2: 'White', c3: 'Grey', c4: 'Blue',
      eFine: 'Equipment depends on the version. Ask our sales team for the exact specification and price.',
      wK: 'Why Skywell', wT: 'With you after the purchase too',
      w1T: 'Warranty', w1P: 'Manufacturer warranty: 5 years or 150,000 km on the car, 8 years or 200,000 km on the battery.',
      w2T: 'Official service', w2P: 'Scheduled maintenance, warranty service, diagnostics and software updates.', w2L: 'Service centre on the map →',
      w3T: 'Spare parts', w3P: 'For every imported car, the number of genuine spare parts required by the manufacturer is kept in stock.',
      w4T: 'Official importer', w4P: 'Since April 2022 Onvolt has been the official Skywell importer in Azerbaijan. The cars are certified to European standards.',
      cK: 'Charging', cT: 'At home, at work and on the road', cP: 'Comfort and Luxury versions have CCS2 (DC) and Type 2 (AC) ports — the European standard.',
      ch1T: 'Fast charging at the showroom', ch1P: 'A 60 kW fast charger runs at our showroom, 194 Jeyhun Hajibeyli St. The station is part of the GoFar network.', ch1B: 'GoFar map',
      ch2T: 'Home charger', ch2P: 'Charges a 72 kWh battery from 0 to 100% in about 10 hours — full overnight.',
      ch3T: 'For offices and business', ch3P: 'A powerful station for three-phase supply. Installed together with Elcar.',
      chOrder: 'Order a charger',
      chNote: 'Charging times are based on the station’s power; actual time depends on the car’s on-board charger and the grid.',
      aK: 'About', aT: 'From Skyworth to Skywell',
      aP1: 'Skywell is the car brand of China’s Skyworth corporation. It started as an electronics maker, then moved into electric buses and passenger EVs.',
      aP2: 'Since 2022 Onvolt has been the official Skywell importer in Azerbaijan and the brand’s only importer in the Caucasus.',
      n1: 'Onvolt opens a new showroom in Baku and presents the Skywell ET5', n2: 'Skywell ET5 presentation for EV fans in Baku', n3: 'Skywell ET5 — video review', read: 'Read →', watch: 'Watch →',
      ctT: 'Visit our showroom', ctP: 'Send us your question — our sales team will get back to you.',
      ciA: 'Showroom', ciT: 'Phone', addr: '194 Jeyhun Hajibeyli St, Baku',
      fT: 'Send a request', fName: 'Your name *', fTel: 'Phone *', fModel: 'Model', fTopic: 'Topic', fMsg: 'Message',
      tp1: 'Buying a car', tp2: 'Service', tp3: 'Charging station', tp4: 'Other', mOther: 'Other / not sure',
      fSend: 'Send via WhatsApp', fMail: 'Send by e-mail', fHint: 'The button opens WhatsApp or your mail app with the text ready.',
      eName: 'Please enter your name.', eTel: 'Please enter a valid number, e.g. +994 50 123 45 67.',
      okWa: 'WhatsApp is open. Send the message there.', okMail: 'Your mail app is open. Send the e-mail there.',
      msgHi: 'Hello! Request from skywell.az.', msgName: 'Name', msgTel: 'Phone', msgModel: 'Model', msgTopic: 'Topic', msgMsg: 'Message', mailSubj: 'Skywell — request',
      ftP: 'Onvolt LLC — official importer of Skywell electric cars in Azerbaijan.', ftNav: 'Sections', ftMore: 'Onvolt', ftC: '© 2026 Onvolt MMC. All rights reserved.'
    }
  };

  /* Модели: st = sale | soon; img = путь к фото ('' — заглушка); specs — [{l:{az,ru,en}, v}] */
  function L(az, ru, en) { return { az: az, ru: ru, en: en }; }
  function S(v) { return L(v, v, v); }
  var MODELS = [
    { id: 'et5', name: 'Skywell ET5', st: 'sale', body: L('SUV · elektrik', 'SUV · электро', 'SUV · electric'),
      img: 'https://static.tildacdn.one/tild6333-6130-4634-b435-616166343236/DSC04413.jpg',
      specs: [
        { l: L('Yürüş (NEDC)', 'Запас хода (NEDC)', 'Range (NEDC)'), v: L('520 km', '520 км', '520 km') },
        { l: L('Batareya', 'Батарея', 'Battery'), v: L('72 kVt·s', '72 кВт·ч', '72 kWh') },
        { l: L('0–100 km/saat', '0–100 км/ч', '0–100 km/h'), v: L('8 san', '8 с', '8 s') },
        { l: L('Şarj 20→80%', 'Зарядка 20→80%', 'Charge 20→80%'), v: L('~30 dəq', '~30 мин', '~30 min') }
      ],
      note: L('', '', '') },
    { id: 'ht-i', name: 'Skywell HT-i', st: 'soon', body: L('SUV · plug-in hibrid (PHEV)', 'SUV · подключаемый гибрид (PHEV)', 'SUV · plug-in hybrid (PHEV)'),
      img: '',
      specs: [
        { l: L('Elektriklə yürüş', 'Запас хода на электричестве', 'Electric range'), v: L('148 km (CLTC)', '148 км (CLTC)', '148 km (CLTC)') },
        { l: L('Batareya', 'Батарея', 'Battery'), v: L('32,8 kVt·s', '32,8 кВт·ч', '32.8 kWh') },
        { l: L('Elektromotor', 'Электромотор', 'Electric motor'), v: L('160 kVt', '160 кВт', '160 kW') },
        { l: L('Benzin mühərriki', 'Бензиновый двигатель', 'Petrol engine'), v: L('1.5T, 115 kVt', '1.5T, 115 кВт', '1.5T, 115 kW') }
      ],
      note: L('Göstəricilər 2026 model ilinin Çin bazarı versiyasına aiddir.', 'Данные для версии 2026 модельного года для рынка Китая.', 'Figures for the 2026 model year, China-market version.') },
    { id: 'q', name: 'Skywell Q', st: 'soon', body: L('Hetçbek · elektrik', 'Хэтчбек · электро', 'Hatchback · electric'),
      img: '',
      specs: [
        { l: L('Yürüş', 'Запас хода', 'Range'), v: L('480 km-dən çox', 'более 480 км', '480+ km') },
        { l: L('Güc', 'Мощность', 'Power'), v: L('150 kVt', '150 кВт', '150 kW') },
        { l: L('Uzunluq', 'Длина', 'Length'), v: L('4,30 m', '4,30 м', '4.30 m') },
        { l: L('Mərkəzi ekran', 'Центральный экран', 'Centre screen'), v: S('15.6"') }
      ],
      note: L('Avropa üçün hazırlanmış model, 2024-cü ildə Paris avtosalonunda təqdim olunub. Yürüş böyük batareyalı versiyaya aiddir.', 'Модель, созданная для Европы; представлена на Парижском автосалоне 2024 года. Запас хода — для версии с большой батареей.', 'Designed for Europe; unveiled at the 2024 Paris Motor Show. Range is for the larger battery.') },
    { id: 'skyhome', name: 'Skywell Skyhome', st: 'soon', body: L('Sedan · elektrik', 'Седан · электро', 'Sedan · electric'),
      img: '',
      specs: [
        { l: L('Güc (flaqman)', 'Мощность (флагман)', 'Power (flagship)'), v: L('460 kVt', '460 кВт', '460 kW') },
        { l: L('0–100 km/saat', '0–100 км/ч', '0–100 km/h'), v: L('3,5 san', '3,5 с', '3.5 s') },
        { l: L('Elektromotorlar', 'Электромоторы', 'Electric motors'), v: S('2') },
        { l: L('Ötürücü', 'Привод', 'Drive'), v: S('2WD / AWD') }
      ],
      note: L('Pnevmatik asqı, arxa sərnişinlər üçün uzanan oturacaqlar, soyuducu və tavandan enən ekran. İstehsalçının ilkin məlumatlarıdır.', 'Пневмоподвеска, откидывающиеся задние кресла, холодильник и экран, опускающийся с потолка. Предварительные данные производителя.', 'Air suspension, reclining rear seats, a fridge and a roof-mounted screen. Manufacturer’s preliminary data.') }
  ];

  var TL = [
    { y: '1988', t: L('Çində Skyworth korporasiyası məişət texnikası və elektronika istehsalçısı kimi yaradılır.', 'В Китае основана корпорация Skyworth — производитель бытовой техники и электроники.', 'Skyworth is founded in China as a home appliance and electronics maker.') },
    { y: '2000', t: L('Skyworth Nanjing Golden Dragon Bus şirkətini təsis edir — elektrik avtobusları və yük avtomobilləri istehsalı.', 'Skyworth основывает Nanjing Golden Dragon Bus — производство электробусов и грузовиков.', 'Skyworth sets up Nanjing Golden Dragon Bus, building electric buses and trucks.') },
    { y: '2017', t: L('Minik elektromobilləri üçün Skywell New Energy şirkəti yaradılır.', 'Для выпуска легковых электромобилей создана компания Skywell New Energy.', 'Skywell New Energy is created for passenger EVs.') },
    { y: '2020', t: L('İlk seriyalı model təqdim olunur: Çində Skyworth EV6, xarici bazarlarda Skywell ET5.', 'Представлена первая серийная модель: Skyworth EV6 в Китае и Skywell ET5 для экспорта.', 'The first production model debuts: Skyworth EV6 in China, Skywell ET5 for export.') },
    { y: '2021', t: L('ET5 Almaniya və Avropada Elaris Beo, ABŞ və Kanadada Imperium adı ilə satışa çıxarılır.', 'ET5 выходит в Германии и Европе как Elaris Beo, в США и Канаде — под брендом Imperium.', 'The ET5 goes on sale as the Elaris Beo in Germany and Europe and as Imperium in the US and Canada.') },
    { y: '2022', t: L('Aprel ayından Onvolt Skywell-in Azərbaycanda rəsmi idxalçısıdır. Noyabrda Bakıda şourum açılır və ET5 təqdim olunur.', 'С апреля Onvolt — официальный импортёр Skywell в Азербайджане. В ноябре в Баку открыт шоурум и представлен ET5.', 'From April Onvolt is the official Skywell importer in Azerbaijan. In November a showroom opens in Baku and the ET5 is presented.') }
  ];

  var TRIMS = [
    ['ET5 LV0', '56', '410 km', '15', 'GB/T', '235/50 R18'],
    ['ET5 Comfort', '72', '520 km', '15.6', 'CCS2 / Type 2', '235/50 R19'],
    ['ET5 Luxury', '72', '520 km', '15.6', 'CCS2 / Type 2', '235/50 R19']
  ];

  var STC = W.STC || { use: function () {}, img: function (p) { return p; } };
  var lang = 'az';
  STC.use('index', { I: I, data: { MODELS: MODELS, TL: TL }, wa: ['994994400007'], refresh: function () { apply(lang); } });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tr(v) { return v && typeof v === 'object' ? (v[lang] || v.az || '') : (v == null ? '' : String(v)); }
  function t(k) { var d = I[lang] || I.az; return d[k] != null ? d[k] : (I.az[k] != null ? I.az[k] : ''); }
  var $ = function (id) { return D.getElementById(id); };

  var CAR = '<svg viewBox="0 0 240 90" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><path d="M14 64c0-8 4-12 14-14l34-6 30-22c6-4 12-6 20-6h46c8 0 14 3 20 8l24 22 18 4c6 2 8 6 8 12v6c0 3-2 5-5 5h-14"/><path d="M60 69H34M156 69H90"/><circle cx="74" cy="68" r="14"/><circle cx="174" cy="68" r="14"/><path d="M98 42l22-18h30l20 18z"/></svg>';

  var filter = 'all';
  function renderModels() {
    var g = $('mgrid'); if (!g) return;
    g.innerHTML = MODELS.map(function (m, i) {
      if (filter !== 'all' && m.st !== filter) return '';
      var src = STC.img(m.img || '');
      var ph = src ? '<img src="' + esc(src) + '" alt="' + esc(m.name) + '" loading="lazy" width="800" height="500">' : '';
      ph += '<div class="nf"' + (src ? ' hidden' : '') + '>' + CAR + '<span>' + esc(t('photoSoon')) + '</span></div>';
      var sp = (m.specs || []).filter(function (s) { return tr(s.v); }).map(function (s) { return '<div><dt>' + esc(tr(s.l)) + '</dt><dd>' + esc(tr(s.v)) + '</dd></div>'; }).join('');
      var note = tr(m.note);
      var act = m.st === 'sale'
        ? '<a class="btn p" href="#et5">' + esc(t('more')) + '</a><a class="btn o" href="#contact" data-model="' + esc(m.name) + '">' + esc(t('ask')) + '</a>'
        : '<a class="btn p" href="#contact" data-model="' + esc(m.name) + '">' + esc(t('ask')) + '</a>';
      return '<article class="mc" data-st="MODELS.' + i + '"><div class="ph">' + ph + '<span class="badge ' + (m.st === 'sale' ? 'sale' : '') + '">' + esc(t(m.st === 'sale' ? 'sale' : 'soon')) + '</span></div>' +
        '<div class="bd"><div><div class="tp">' + esc(tr(m.body)) + '</div><h3>' + esc(m.name) + '</h3></div>' +
        (sp ? '<dl class="specs">' + sp + '</dl>' : '') + (note ? '<p class="note">' + esc(note) + '</p>' : '') +
        '<div class="act">' + act + '</div></div></article>';
    }).join('');
    g.querySelectorAll('.ph img').forEach(function (im) {
      im.addEventListener('error', function () { im.remove(); var nf = im.parentNode && im.parentNode.querySelector('.nf'); if (nf) nf.hidden = false; });
      if (im.complete && im.naturalWidth === 0 && im.currentSrc) { var nf = im.parentNode.querySelector('.nf'); im.remove(); if (nf) nf.hidden = false; }
    });
  }

  function renderTrims() {
    var b = $('trims'); if (!b) return;
    b.innerHTML = TRIMS.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1] + ' ' + t('kwh')) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3].replace('.', lang === 'en' ? '.' : ',') + ' ' + t('per100')) + '</td><td>' + esc(r[4]) + '</td><td>' + esc(r[5]) + '</td></tr>';
    }).join('');
  }

  function renderTL() {
    var o = $('tl'); if (!o) return;
    o.innerHTML = TL.map(function (x, i) { return '<li data-st="TL.' + i + '"><b>' + esc(x.y) + '</b><p>' + esc(tr(x.t)) + '</p></li>'; }).join('');
  }

  function renderModelSelect() {
    var s = $('fModel'); if (!s) return;
    var cur = s.value;
    s.innerHTML = MODELS.map(function (m) { return '<option>' + esc(m.name) + '</option>'; }).join('') + '<option value="-">' + esc(t('mOther')) + '</option>';
    if (cur) s.value = cur;
    if (!s.value) s.selectedIndex = 0;
  }

  function apply(lg) {
    lang = I[lg] ? lg : 'az';
    var d = D.documentElement; d.lang = lang;
    D.title = t('title');
    D.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); var v = t(k); if (v !== '') el.textContent = v; });
    D.querySelectorAll('[data-i18n-html]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-html')); if (v !== '') el.innerHTML = STC.clean ? STC.clean(v) : v; });
    D.querySelectorAll('[data-i18n-aria]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-aria')); if (v) el.setAttribute('aria-label', v); });
    D.querySelectorAll('[data-i18n-list]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-list')); if (Array.isArray(v)) el.innerHTML = v.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); });
    D.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    renderModels(); renderTrims(); renderTL(); renderModelSelect();
    try { localStorage.setItem('sw_lang', lang); } catch (e) {}
  }

  /* язык: ?lang= → сохранённый → az */
  var q = (location.search.match(/[?&]lang=(az|ru|en)\b/) || [])[1], saved = null;
  try { saved = localStorage.getItem('sw_lang'); } catch (e) {}
  apply(q || saved || 'az');
  D.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-lang')); }); });

  /* фильтр моделей */
  D.querySelectorAll('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.getAttribute('data-f');
      D.querySelectorAll('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderModels();
    });
  });

  /* логотип: если внешний SVG не загрузился — текстовый */
  var lg = D.querySelector('#logo img');
  if (lg) { var bad = function () { $('logo').classList.add('nologo'); }; lg.addEventListener('error', bad); if (lg.complete && lg.naturalWidth === 0) bad(); }
  var hb = D.querySelector('.hero-bg img');
  if (hb) { var hbad = function () { hb.style.display = 'none'; }; hb.addEventListener('error', hbad); if (hb.complete && hb.naturalWidth === 0) hbad(); }
  var ei = D.querySelector('.et5-img img');
  if (ei) { var ebad = function () { ei.style.display = 'none'; }; ei.addEventListener('error', ebad); if (ei.complete && ei.naturalWidth === 0) ebad(); }

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
    if (!a) return;
    var m = a.getAttribute('data-model'), tp = a.getAttribute('data-topic');
    if (m) { $('fModel').value = m; $('fTopic').value = 'buy'; }
    if (tp) $('fTopic').value = tp;
  });

  /* форма → WhatsApp / e-mail */
  var form = $('form');
  function err(id, msg) { var inp = $(id), e = $(id === 'fName' ? 'eName' : 'eTel'); e.textContent = msg || ''; if (msg) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); }
  function check() {
    var n = $('fName').value.trim(), p = $('fTel').value.replace(/\D/g, ''), ok = true, first = null;
    if (n.length < 2) { err('fName', t('eName')); ok = false; first = first || $('fName'); } else err('fName');
    if (p.length < 9 || p.length > 15) { err('fTel', t('eTel')); ok = false; first = first || $('fTel'); } else err('fTel');
    if (first) first.focus();
    return ok;
  }
  function text() {
    var tp = $('fTopic'), md = $('fModel');
    var lines = [t('msgHi'), t('msgName') + ': ' + $('fName').value.trim(), t('msgTel') + ': ' + $('fTel').value.trim(),
      t('msgModel') + ': ' + (md.value === '-' ? t('mOther') : md.value), t('msgTopic') + ': ' + tp.options[tp.selectedIndex].text];
    var m = $('fMsg').value.trim(); if (m) lines.push(t('msgMsg') + ': ' + m);
    return lines.join('\n');
  }
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

  /* появление блоков */
  var rv = D.querySelectorAll('.rv');
  if ('IntersectionObserver' in W && !W.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });
})();
