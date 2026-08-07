# pingente.app

Site do **Pingente** — landing page, página de revendedores e arquivos dos cases para impressão 3D. Publicado via GitHub Pages em <https://pingente.app>.

## Estrutura

- `index.html` — landing principal (placeholder até a implementação do design aprovado no Claude Design; processo no vault do produto, nota `Prompt landing (Claude Design)`)
- `revendedores/` — subpágina B2B (guia de compra, tiers de ativação, repositório de cases)
- `cases/` — arquivos **STL/3MF** dos cases, versionados aqui mesmo — **sem Git LFS** (o GitHub Pages não serve arquivos LFS, entrega apenas o pointer)
- `CNAME` — domínio custom (`pingente.app`)

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

> ⚠️ Manter "DNS only" (nuvem cinza) ao menos até o certificado TLS do Pages ser emitido; o `.app` força HTTPS (HSTS no TLD). **Não tocar** nos registros MX/TXT do Email Routing da Cloudflare.

## Contexto

O design é o critério de aceite visual: o site é implementado como HTML/CSS estático validado contra os mockups aprovados. Identidade visual e tokens: [pingente-app/design](https://github.com/pingente-app/design). O QR da face de boas-vindas das tags aponta para `https://pingente.app` — a URL é contrato.
