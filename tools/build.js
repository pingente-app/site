// pingente.app — gera as páginas por idioma a partir das fontes trilíngues.
//
//   bun tools/build.js
//
// Fontes: src/pages/*.html, no formato "trilíngue" (elementos com data-lang="pt-BR|en-US|es-419";
// <title> e <meta name="description"> também por idioma). Saída: inglês na raiz (/, /resellers/…),
// português em /pt/… e espanhol em /es/…, cada página só com o idioma dela, <html lang> certo,
// canonical + hreflang e o seletor de idioma como links para as irmãs.
//
// Páginas "de runtime" (/t/, /codes/, 404.html) não são geradas por idioma: continuam trilíngues com
// troca em JavaScript (assets/js/lang.js), porque chegam por link do app ou da Paddle. Aqui só
// recebem os links internos localizados (dentro de cada bloco data-lang) e 404.html = cópia de /t/.
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'src', 'pages');
const ORIGIN = 'https://pingente.app';

const LANGS = [
  { code: 'en-US', short: 'en', prefix: '', html: 'en', hreflang: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', short: 'pt', prefix: '/pt', html: 'pt-BR', hreflang: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'es-419', short: 'es', prefix: '/es', html: 'es', hreflang: 'es', label: 'Español', flag: '🇪🇸' },
];
const DEFAULT = LANGS[0];

// Páginas geradas por idioma. `path` é a URL sem prefixo.
const PAGES = [
  { src: 'index.html', path: '/' },
  { src: 'resellers.html', path: '/resellers/' },
  { src: 'terms.html', path: '/terms/' },
  { src: 'privacy.html', path: '/privacy/' },
  { src: 'privacy-delete.html', path: '/privacy/delete/' },
  { src: 'refund.html', path: '/refund/' },
];
const LOCALIZED = new Set(PAGES.map((p) => p.path));

// Páginas de runtime (ficam onde estão; só os links são localizados).
const RUNTIME = ['t/index.html', 'codes/index.html'];

const byCode = Object.fromEntries(LANGS.map((l) => [l.code, l]));

/** `/terms/#x` → `/pt/terms/#x` quando a rota é localizada; assets, /t/, /codes/ ficam. */
function localizeHref(href, lang) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return href;
  const m = href.match(/^([^?#]*)(.*)$/);
  const path = m[1] || '/';
  const rest = m[2] || '';
  if (!LOCALIZED.has(path)) return href;
  return `${lang.prefix}${path}${rest}`;
}

function switcher(page, lang) {
  return LANGS.map((l) => {
    const current = l.code === lang.code ? ' aria-current="page"' : '';
    return `<a href="${l.prefix}${page.path}" hreflang="${l.hreflang}" lang="${l.html}"${current}>${l.flag} ${l.label}</a>`;
  }).join('');
}

function alternates(page) {
  const links = LANGS.map((l) => `  <link rel="alternate" hreflang="${l.hreflang}" href="${ORIGIN}${l.prefix}${page.path}">`);
  links.push(`  <link rel="alternate" hreflang="x-default" href="${ORIGIN}${DEFAULT.prefix}${page.path}">`);
  return links.join('\n');
}

async function renderPage(page, lang) {
  const source = readFileSync(join(SRC, page.src), 'utf8');
  const url = `${ORIGIN}${lang.prefix}${page.path}`;
  const rewriter = new HTMLRewriter()
    .on('html', { element(el) { el.setAttribute('lang', lang.html); el.setAttribute('data-lang', lang.code); } })
    .on('[data-lang]', {
      element(el) {
        const code = el.getAttribute('data-lang');
        if (!(code in byCode)) return; // ex.: data-lang-switch não entra aqui
        if (code !== lang.code) { el.remove(); return; }
        el.removeAttribute('hidden');
      },
    })
    .on('[data-lang-switch]', {
      element(el) {
        el.setAttribute('aria-label', 'Language');
        el.setInnerContent(switcher(page, lang), { html: true });
      },
    })
    .on('a[href]', { element(el) { el.setAttribute('href', localizeHref(el.getAttribute('href'), lang)); } })
    .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', url); } })
    .on('meta[property="og:url"]', { element(el) { el.setAttribute('content', url); } })
    .on('head', { element(el) { el.append(`\n${alternates(page)}\n`, { html: true }); } });
  const html = await rewriter.transform(new Response(source)).text();
  const out = join(ROOT, lang.prefix.replace(/^\//, ''), page.path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  return out;
}

/** Páginas trilíngues de runtime: links dentro de cada bloco data-lang apontam para o idioma do bloco. */
async function localizeRuntime(rel) {
  const file = join(ROOT, rel);
  const source = readFileSync(file, 'utf8');
  const stack = [];
  const rewriter = new HTMLRewriter()
    .on('[data-lang]', {
      element(el) {
        const code = el.getAttribute('data-lang');
        if (!(code in byCode)) return;
        stack.push(code);
        el.onEndTag(() => { stack.pop(); });
      },
    })
    .on('a[href]', {
      element(el) {
        const lang = byCode[stack[stack.length - 1]] || DEFAULT;
        // Normaliza primeiro (tira prefixo antigo) para o build ser idempotente.
        const raw = el.getAttribute('href').replace(/^\/(pt|es)(\/|$)/, '/');
        el.setAttribute('href', localizeHref(raw, lang));
      },
    });
  const html = await rewriter.transform(new Response(source)).text();
  writeFileSync(file, html);
}

const written = [];
for (const page of PAGES) for (const lang of LANGS) written.push(await renderPage(page, lang));
for (const rel of RUNTIME) await localizeRuntime(rel);
copyFileSync(join(ROOT, 't', 'index.html'), join(ROOT, '404.html'));

// sitemap.xml com todas as URLs (o robots.txt decide se os buscadores entram).
const urls = [];
for (const page of PAGES) for (const lang of LANGS) urls.push(`${ORIGIN}${lang.prefix}${page.path}`);
writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
    '\n</urlset>\n',
);
console.log(`${written.length} páginas geradas · ${RUNTIME.length} páginas de runtime localizadas · 404.html = t/index.html · sitemap.xml`);
