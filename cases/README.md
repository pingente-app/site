# Cases para impressão 3D

Arquivos **STL** e **3MF** dos cases do Pingente, para a tag **Gicisky 2,1" BWR 250×122** (dimensões de partida: 70 × 34,7 × 13,6 mm — medir a unidade real antes de fechar tolerâncias).

## Estrutura por case

    cases/<nome-do-case>/
      <nome>.stl
      <nome>.3mf
      README.md   # materiais, tolerâncias, tempo de impressão, fotos

## Diretrizes de design (do vault do produto)

- Bumper em TPU na borda + tela recuada abaixo do lábio (o vidro do e-ink é frágil)
- Esconder a tira de código de barras da etiqueta; emoldurar só o display
- Argola/mosquetão integrado na impressão (não colado)
- Tampa de acesso à bateria (2× CR2450) sem destruir o case
- Prever acesso ao botão de reset e ao LED de status

> Sem Git LFS neste repositório: o GitHub Pages não serve arquivos LFS.
