# Portafolio de Carlos Velasco

## Requisitos

- Node.js 22 o superior
- npm

## Iniciar en local

```bash
npm ci
npm run dev
```

Abre <http://localhost:3000>.

## Comprobar y generar el sitio

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

La exportación estática queda en `out/`. Para GitHub Pages, el workflow configura automáticamente la ruta `/Portafolio` y publica el sitio cuando hay cambios en `main`.
