// Файлы подтверждения поисковиков (*.html) должны отдаваться по точному адресу, без переадресации.
// Остальное — статика из assets.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (/^\/(google[0-9a-f]+|yandex_[0-9a-f]+|BingSiteAuth)\.(html|xml)$/.test(url.pathname)) {
      const res = await env.ASSETS.fetch(new Request(new URL(url.pathname.replace(/\.html$/, ''), url.origin)));
      if (res.ok) return new Response(res.body, { status: 200, headers: { 'content-type': url.pathname.endsWith('.xml') ? 'application/xml' : 'text/html; charset=utf-8' } });
    }
    return env.ASSETS.fetch(request);
  },
};
