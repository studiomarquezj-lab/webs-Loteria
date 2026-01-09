# Documentación Técnica - Zoológico Activo
**Para:** Alex (Programador)
**Fecha:** 16 de Julio de 2024

## 1. Estructura del Proyecto

El proyecto es una web estática (HTML/CSS/JS) sin dependencias de compilación (no requiere Node.js ni Webpack).

- **index.html**: Página principal (Home). Contiene la ruleta, resultados en vivo y banners.
- **resultados.html**: Página de historial de resultados con filtros.
- **reglamento.html**: Reglas del juego y texto legal.
- **css/styles.css**: Hoja de estilos única. Contiene todas las variables de color, animaciones y media queries.
- **js/data.js**: **IMPORTANTE**. Contiene la "base de datos" local. Aquí se definen los animales, horarios y se simulan los resultados.
- **js/main.js**: Lógica de la página principal (Ruleta, cuenta regresiva, carga de resultados).
- **js/results.js**: Lógica de la página de resultados (Tabla, filtros, paginación).
- **ANIMALITOS/**: Carpeta con las imágenes de los animales (00.png, 0.png, 01.png... 63.png).
- **images/**: Carpeta con assets gráficos (Logos, Cococrupier, Banners).

## 2. Gestión de Datos (js/data.js)

Toda la información de los animales está en el array `ANIMALS` en `js/data.js`.

```javascript
const ANIMALS = [
  { number: "00", name: "Ballena", emoji: "🐋", image: "ANIMALITOS/00.png", special: true },
  // ...
];
```

- **image**: Ruta a la imagen del animal. Si no existe, el sistema hará fallback al emoji.
- **number**: El número del animal. **Nota:** Para números de un solo dígito, usar el formato "01", "02", etc., excepto para el "0" (Delfín) y "00" (Ballena).

## 3. Modificación de Banners (js/main.js)

Los banners del carrusel principal ("Hero Banner") se configuran dinámicamente en el archivo `js/main.js`.

Para modificar las imágenes, textos o hotspots:

1.  Abre `js/main.js`.
2.  Busca la función `initHeroBanner()`.
3.  Dentro encontrarás el objeto `sections`:

```javascript
const sections = {
  comodin: {
    image: "URL_DE_LA_IMAGEN", // Puede ser local o remota
    label: "Texto del Botón",
    title: "Título Principal",
    subtitle: "Descripción del banner"
  },
  // ... otras secciones
}
```

4.  **Para cambiar una imagen:** Reemplaza la URL en la propiedad `image`.
5.  **Para cambiar textos:** Edita `title` y `subtitle`.

### Hotspots (Puntos Interactivos)

Los hotspots se definen en el HTML (`index.html`) dentro de `<div class="hotspots-container">`.

- Cada `.hotspot` tiene un atributo `data-dest` que debe coincidir con una clave en el objeto `sections` de JS (ej: `comodin`, `compra`).
- Para cambiar el icono o texto del hotspot, edita directamente el HTML dentro de `.hotspot-label` y `.hotspot-details`.

## 4. Formulario de Compra (WhatsApp)

El formulario de compra es un popup modal que envía los datos a WhatsApp.

### Configuración del Número de Teléfono

Para cambiar el número de WhatsApp al que llegan los mensajes:

1.  Abre `js/main.js`.
2.  Busca la función `initPurchasePopup()`.
3.  Encuentra la variable `whatsappNumber`:

```javascript
// Número de WhatsApp (PLACEHOLDER)
const whatsappNumber = "58000000000"; 
```

4.  Reemplaza `58000000000` con el número real (incluyendo código de país, sin símbolos `+`).

### Modificar Campos del Formulario

Si necesitas agregar o quitar campos:

1.  **HTML (`index.html`)**: Modifica el formulario dentro de `<div id="purchaseModal">`. Agrega los `input` necesarios con sus `id`.
2.  **JS (`js/main.js`)**: En `initPurchasePopup()`, captura los valores de los nuevos inputs y agrégalos a la variable `message` que se construye para enviar a WhatsApp.

```javascript
const message = `Hola, quiero comprar zoologico activo.
Cedula: ${cedula}
Nuevo Campo: ${nuevoCampo}
...`;
```

## 4. Activos Gráficos y CSS

- **Cococrupier**: La imagen está en `index.html` fuera del contenedor de la ruleta para permitir que flote por encima (`z-index: 20`).
    - Clase CSS: `.cococrupier-img`
- **Logos**: Los logos se redimensionan mediante CSS (`max-height`, `width: auto`) para mantener la calidad de los archivos originales de alta resolución.
    - Clases CSS: `.logo-img`, `.footer-logo`, `.fda-logo`.

## 5. Notas Adicionales

- **Favicon**: Se usa la imagen del comodín (`ANIMALITOS/63.png`).
- **Reglamento**: El texto legal completo se encuentra al final de `reglamento.html` como un anexo.
- **Simulación**: Actualmente los resultados se generan aleatoriamente en `data.js` (`generateMockResults`). Para producción, esto debería reemplazarse por una llamada a una API real.


