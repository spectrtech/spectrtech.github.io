// spectrtech.si — статика из assets + демосайты клиентов.
// 1) Файлы подтверждения поисковиков (*.html) отдаются по точному адресу, без переадресации.
// 2) Всё, что есть в статике, отдаётся как есть.
// 3) Если файла нет и адрес похож на демо (/demo/<slug>/…, /<slug>, приём статистики /api/t), запрос уходит
//    в общую систему демо — Worker spectrtech-az (service binding AZ). Адрес при этом не меняется (spectrtech.si),
//    поэтому демо, плашка DEMO и статистика работают на домене spectrtech.si.
// 4) Иначе — своя страница 404.
const DEMO_PATH = /^\/(?:demo\/[a-z0-9-]+(?:\/.*)?|[a-z0-9-]+\/?|api\/t\/?)$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (/^\/(google[0-9a-f]+|yandex_[0-9a-f]+|BingSiteAuth)\.(html|xml)$/.test(url.pathname)) {
      const res = await env.ASSETS.fetch(new Request(new URL(url.pathname.replace(/\.html$/, ''), url.origin)));
      if (res.ok) return new Response(res.body, { status: 200, headers: { 'content-type': url.pathname.endsWith('.xml') ? 'application/xml' : 'text/html; charset=utf-8' } });
    }
    const isPost = request.method === 'POST';
    const asset = isPost ? null : await env.ASSETS.fetch(request);
    if (asset && asset.status !== 404) return asset;
    if (env.AZ && DEMO_PATH.test(url.pathname)) {
      try {
        // метка рынка: Worker spectrtech-az показывает здесь только демо рынка si
        const fwd = new Request(request);
        fwd.headers.set('x-st-market', 'si');
        const res = await env.AZ.fetch(fwd);
        if (!(res.status === 404 && res.headers.get('x-st-notfound'))) return res;
      } catch (e) { /* система демо недоступна — показываем обычную 404 */ }
    }
    if (asset) return asset;
    const page = await env.ASSETS.fetch(new Request(new URL('/404.html', url.origin)));
    return new Response(page.body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  },
};
