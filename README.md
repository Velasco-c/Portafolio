# Portafolio — Carlos Elias Tzoy Velasco

Portafolio personal hecho con HTML, CSS y JavaScript nativo. No utiliza Vite ni dependencias externas para ejecutarse.

## Requisitos

- Node.js 18 o superior para los comandos incluidos.
- Un navegador moderno.

## Ejecutar localmente

Clona el repositorio, entra a la carpeta y ejecuta:

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). El servidor local es necesario para que el navegador cargue los módulos de JavaScript.

Comandos disponibles:

```bash
npm run check    # revisa sintaxis y estructura del contenido
npm run build    # genera la versión estática en dist/
npm run preview  # sirve dist/ en http://localhost:5173
```

No hace falta ejecutar `npm install`: el proyecto no tiene dependencias.

## Publicar en GitHub Pages

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila el sitio y publica `dist/` automáticamente cuando haces push a `main`.

1. En GitHub, abre **Settings → Pages** del repositorio.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Sube los cambios a la rama `main` y revisa el progreso en la pestaña **Actions**.

Al terminar, el sitio estará en `https://velasco-c.github.io/Portafolio/`.

Las rutas de la página y de sus imágenes son relativas, por lo que funcionan tanto en `localhost` como bajo la ruta `/Portafolio/` de GitHub Pages. Si publicas desde una rama distinta, selecciónala en Pages.

## Personalizar el contenido

Edita [`src/content/portfolio.js`](src/content/portfolio.js) para cambiar el nombre, descripción, experiencia, tecnologías, proyectos, enlaces y contacto. Coloca imágenes en `public/` y referencia su ruta, por ejemplo `./public/images/mi-foto.png`.

## Estructura

```text
index.html              Página principal
src/content/portfolio.js Contenido del portafolio
src/sections/            Secciones de la página
src/animations/          Animaciones e interacciones
src/effects/              Efectos WebGL y canvas
src/styles/main.css       Estilos
public/                   Imágenes, iconos y otros recursos
scripts/                  Servidor local, compilación y revisión
```
