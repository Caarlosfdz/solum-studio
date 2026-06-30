# Solum Studio — Guía para Carlos y Jostin

## Cómo ver la web en tu ordenador

1. Abre la carpeta `solum-studio`.
2. Haz doble clic en `index.html`.
3. Se abre en tu navegador. Si ves la web, todo funciona.

---

## Cómo subir la web a Hostinger

1. Entra en tu panel de Hostinger → **File Manager** (o usa FTP con FileZilla).
2. Navega a la carpeta `public_html`.
3. **Arrastra toda la carpeta** `solum-studio` al File Manager — o su contenido si quieres que sea la raíz.
4. Asegúrate de que `index.html` queda en la raíz (o dentro de `public_html`).
5. Listo. Abre tu dominio en el navegador.

---

## Cómo cambiar el número de WhatsApp

1. Abre `lib/manifest.js` con el Bloc de notas (clic derecho → Abrir con → Bloc de notas).
2. Busca la línea: `whatsapp: "+34711235683"`
3. Cambia el número. También cambia `whatsappRaw: "34711235683"` (sin el +).
4. Guarda el archivo.
5. Sube `lib/manifest.js` a Hostinger.

---

## Cómo cambiar el email

1. Abre `lib/manifest.js`.
2. Busca `email: "hola@solumstudio.es"`.
3. Cambia por tu email real.
4. Guarda y sube.

---

## Cómo cambiar textos del hero, servicios o testimonios

Todos los textos editables están en `lib/manifest.js`. Está organizado así:

```
window.__SOLUM__ = {
  brand: { nombre, whatsapp, email, instagram... },
  team: [ Carlos, Jostin ],
  services: [ 6 servicios ],
  testimonials: [ 9 testimonios ],
  faq: [ 5 preguntas ],
  stats: [ 4 estadísticas ]
}
```

Abre el archivo, encuentra el campo que quieras cambiar, edita el texto entre comillas, guarda.

**Importante:** no borres las comas ni las comillas. Si algo deja de funcionar, cierra sin guardar y vuelve a intentarlo.

---

## Cómo añadir o cambiar un testimonio

En `lib/manifest.js`, busca `testimonials: [`. Cada testimonio tiene esta forma:

```js
{ initials: "MR", name: "María R.", business: "Clínica estética", city: "Sevilla",
  stars: 5, quote: "Texto del testimonio...", badge: "+200% consultas" }
```

Cambia los valores entre comillas. Guarda y sube.

---

## Si la web no se actualiza después de subir cambios

1. Pulsa **Ctrl+F5** (o Ctrl+Shift+R en Chrome) para forzar recarga.
2. Si sigue igual: abre `index.html` con el Bloc de notas, busca `?v=20260601` y cámbialo por la fecha de hoy, por ejemplo `?v=20260610`. Guarda y sube `index.html`.

---

## Cómo reemplazar las librerías GSAP (para animaciones mejoradas)

En este entorno las librerías se crearon como versiones básicas. Para animaciones más fluidas:

1. Descarga desde: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
2. Descarga desde: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
3. Reemplaza los archivos en `lib/` con los descargados.
4. Sube la carpeta `lib/` al hosting.

---

## Estructura de la carpeta

```
solum-studio/
├── index.html          ← la web
├── styles.css          ← todos los estilos
├── main.js             ← todas las animaciones
├── .htaccess           ← caché y rendimiento (no tocar)
├── lib/
│   ├── manifest.js     ← AQUÍ editas todo el contenido
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
└── assets/
    └── img/logo/       ← logos SVG
```

---

Hecho con criterio desde Cádiz · Solum Studio 2026
