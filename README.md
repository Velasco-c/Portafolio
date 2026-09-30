# Carlos Velasco — Portfolio

Portfolio personal de Carlos Elias Tzoy Velasco, construido con Vite, JavaScript modular y CSS.

## Stack

- HTML5
- CSS3
- JavaScript ES Modules
- Vite
- Lucide

## Arquitectura

```text
src/
├── app/
│   └── app.js
├── components/
│   └── render.js
├── data/
│   └── portfolio-data.js
├── interactions/
│   └── interaction.js
└── styles/
    ├── animations.css
    ├── components.css
    ├── layout.css
    ├── main.css
    ├── reset.css
    ├── responsive.css
    ├── sections.css
    ├── tokens.css
    └── typography.css
```

El contenido está centralizado en `src/data/portfolio-data.js`. La interfaz se renderiza desde componentes pequeños y las interacciones están separadas de la presentación.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Publicación

El proyecto está preparado para desplegarse como sitio estático. La URL de portfolio configurada en los metadatos es:

`https://velasco-c.github.io/Portafolio/`
