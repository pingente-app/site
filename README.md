# pingente.app

Site do **Pingente** — landing page, página de revendedores e arquivos dos cases para impressão 3D. Publicado via GitHub Pages em <https://pingente.app>.

## Estrutura

- `index.html` — landing principal
- `revendedores/index.html` — subpágina B2B (guia de compra, tiers de ativação, repositório de cases)
- `assets/css/site.css` — folha única (tokens + componentes das duas páginas)
- `assets/img/` — identidade (lockup/ícone SVG), hero, faces 250×122 (cores puras)
- `assets/fonts/` — Manrope variável (woff2, subset latin) auto-hospedada
- `cases/` — arquivos **STL/3MF** dos cases, versionados aqui mesmo — **sem Git LFS** (o GitHub Pages não serve arquivos LFS, entrega apenas o pointer)
- `CNAME` — domínio custom (`pingente.app`)

## Design (verdade visual)

O site implementa o handoff aprovado no Claude Design, versionado em [pingente-app/design](https://github.com/pingente-app/design) → `mockups/site/` (spec `README.md`, `copy.json`, screens PNG 2×). Os PNGs são o critério de aceite visual; a copy vem do `copy.json` (base do i18n PT/EN/ES).

## ⚠️ Pré-lançamento (reverter no dia do lançamento)

O site está **fora dos buscadores** (`noindex`) até o app chegar às lojas. Para reverter:

1. Remover a linha `<meta name="robots" content="noindex">` de `index.html` e `revendedores/index.html`
2. Restaurar o `robots.txt` para:

       User-agent: *
       Allow: /

       Sitemap: https://pingente.app/sitemap.xml

O site continua acessível por URL direta (para beta, QR da face de boas-vindas e demonstração a revendedores) — apenas não aparece em buscas. Lembrete: sites do GitHub Pages são sempre públicos; proteção por senha não existe nesta hospedagem.

### Pendências conhecidas

- **Botões de download dos cases** estão no estado "em breve" até os STL/3MF reais serem adicionados em `cases/` (os hrefs prontos estão comentados no HTML).
- **Tier 10+ (R$ 7,99)** é placeholder — marcado com asterisco na página, confirmar valor.
- **i18n EN/ES** (`/en/`, `/es/`) ainda não gerado — base: `copy.json` no repo design.
- `hero-produto.png` é ilustração — substituir por foto real do case impresso quando houver.

## Deploy

GitHub Pages, branch `main`, raiz. O redirect `www.pingente.app` → `pingente.app` é feito pelo próprio GitHub Pages quando os dois registros DNS existem.

## DNS (Cloudflare)

| Tipo | Nome | Valor | Proxy |
|---|---|---|---|
| `A` | `@` | `185.199.108.153` | DNS only |
| `A` | `@` | `185.199.109.153` | DNS only |
| `A` | `@` | `185.199.110.153` | DNS only |
| `A` | `@` | `185.199.111.153` | DNS only |
| `CNAME` | `www` | `pingente-app.github.io` | DNS only |

> ⚠️ Manter "DNS only" (nuvem cinza); o `.app` força HTTPS (HSTS no TLD). **Não tocar** nos registros MX/TXT do Email Routing da Cloudflare.

## Contexto

O QR da face de boas-vindas das tags aponta para `https://pingente.app` — a URL é contrato.
