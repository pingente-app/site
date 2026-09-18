# models — arquivos 3D publicados

Arquivos para download, carregados **dinamicamente** pela página de cases. Chegam aqui um a um, **só depois de validados em impressão** — o gerador vive no repositório privado `pingente-app/models`, que produz muito mais do que publicamos.

```
models/
  embed/{stl,3mf}/      módulo de embutir (o vão que o maker subtrai da peça dele) e o negativo
  magnet/{stl,3mf}/     peças prontas de ímã de geladeira
  keychain/{stl,3mf}/   peças prontas de chaveiro / tag de mala
```

## Nome dos arquivos

```
<marca>_<modelo>_<forma>_<tipo>.<ext>      peças:   gicisky_2.1_heart_magnet.stl
<marca>_<modelo>[_negativo].<ext>          módulo:  gicisky_2.1.stl · gicisky_2.1_negativo.stl
```

- `marca`: `gicisky` · `panda` · `hipoink`
- `modelo`: `2.1` · `2.9` · `2.13`
- `forma`: nome curto da silhueta (`heart`, `bone`, `lock`…), **sem `_`** — o separador é reservado aos campos
- `tipo`: `magnet` · `keychain`
- `ext`: `stl` · `3mf`

O underscore separa os campos, então `split('_')` basta para a página montar o catálogo. Os nomes são **estáveis**: uma revisão do modelo substitui o arquivo, mantendo o link.

## Impressão

Todos os STL saem **orientados com a frente na mesa** — a primeira camada é a face que aparece, o que dá o melhor acabamento e pega a textura do plate. Perfil recomendado: **3 paredes · 5 camadas de topo/base · 15 % de preenchimento · sem suportes**. Peças de ímã usam **2 ímãs de neodímio ∅10 × 3 mm**, colados nos rebaixos do verso.

## Licença

Peças e módulos: **CC BY 4.0** (Pingente). As silhuetas de origem são de domínio público.
