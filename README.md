
# Hogarix — Sitio estático (GitHub Pages)

Este paquete está listo para publicar en **GitHub Pages**.

## Pasos rápidos
1. Crea un repositorio en GitHub llamado `hogarix` (o el nombre que prefieras).
2. Sube **todos** los archivos de esta carpeta a la rama `main`.
3. En el repo: **Settings → Pages → Build and deployment → Source: `main` / Root (`/`)**.
4. Espera unos segundos y abre la URL que te muestra GitHub Pages (por ejemplo: `https://tu-usuario.github.io/hogarix/`).

> Importante: este paquete incluye el archivo **.nojekyll** para evitar que GitHub procese el sitio con Jekyll.

## Estructura
- `index.html` — página principal con catálogo, buscador, reservas (comprobante JSON) y WhatsApp.
- `assets/` — estilos y scripts.
- `data/services.json` — catálogo (además ya está embebido).
- `favicon.svg` — icono.
- `.nojekyll` — requerido por GitHub Pages.

## Personalización
- Edita `assets/app.js` y cambia `WHATSAPP_NUMBER` por tu número real en formato internacional **sin +**.
- Puedes editar textos, colores y contenido directamente en `index.html` y `assets/styles.css`.

¡Listo! Tu sitio de Hogarix quedará publicado con GitHub Pages.
