# Informe Técnico Detallado: Triple Pirámide de Oro

**Fecha:** 7 de Diciembre, 2025
**Preparado por:** Jhonny Marquez.
**Cliente:** Operadora El Emperador de Oro, C.A. / Lotería de Guayana

---

## 1. Resumen Ejecutivo
Este documento proporciona un desglose técnico granular de cada componente implementado en el sitio web "Triple Pirámide de Oro". Se detalla la función de cada sección y se especifica explícitamente dónde interviene el código de programación (JavaScript) para aportar interactividad o lógica de negocio.

---

## 2. Desglose Detallado por Página

### 2.1. Página de Inicio (`index.html`)
La portada del sitio integra la mayor cantidad de lógica interactiva para captar la atención del usuario.

| Sección / Componente | Descripción Detallada | ¿Usa JavaScript? | Funcionalidad JS Específica |
| :--- | :--- | :--- | :--- |
| **Navbar (Barra de Navegación)** | Menú superior fijo con logotipo y enlaces. En móviles se convierte en un botón "hamburguesa". | **SÍ** | Controla la apertura/cierre del menú en móviles y el bloqueo del scroll del cuerpo al abrirse. |
| **Hero Section (Cabecera Principal)** | Área visual de alto impacto con título, subtítulo y botones de llamada a la acción. Fondo con efectos visuales. | **SÍ** | Generación y animación de partículas flotantes en el fondo para dar efecto de profundidad y lujo. |
| **Temporizador (Countdown)** | Contador regresivo prominente que muestra horas, minutos y segundos. | **SÍ** | Calcula en tiempo real cuánto falta para el próximo sorteo (11:45, 15:45, 18:45). Se reinicia automáticamente al cumplirse la hora. |
| **Resultados de Hoy** | Tabla simplificada que muestra únicamente los sorteos ocurridos en el día actual. | **SÍ** | Consulta la "API" interna para obtener los datos del día y genera las filas de la tabla dinámicamente. Muestra "Pendiente" si el sorteo no ha ocurrido. |
| **Sección Zodiacal** | Muestra el signo del zodiaco regente del día y una galería de los 12 signos. | **SÍ** | Algoritmo que determina el signo destacado basado en la fecha del sistema y renderiza la galería interactiva. |
| **Tarjetas de Premios** | Información estática sobre los multiplicadores (x600, x60, x6000). | NO | Solo HTML y CSS para efectos visuales (hover). |
| **Pasos "Cómo Jugar"** | Guía visual de 4 pasos. | NO | Estructura estática. |
| **Carrusel de Promociones** | Banners deslizantes con ofertas ("5 tickets y 1 gratis", etc.). | **SÍ** | Lógica de rotación automática cada 5 segundos y control manual con flechas (anterior/siguiente). |
| **Preguntas Frecuentes (FAQ)** | Lista de preguntas con respuestas ocultas que se despliegan al hacer clic. | **SÍ** | Manejo del evento "click" para expandir/colapsar las respuestas con animación suave (Acordeón). |
| **Pie de Página (Footer)** | Información legal, redes sociales y logotipos de aliados (Conalot, Lotería de Guayana). | NO | Estático. |
| **Modal de Compra** | Formulario emergente para solicitar tickets. Pide Nombre, Teléfono, Tipo de Jugada y Monto. | **SÍ** | 1. Abre/Cierra el modal. <br> 2. **Valida** los campos obligatorios. <br> 3. **Formatea** los datos ingresados y construye un enlace de WhatsApp API para enviar el pedido directamente al chat de ventas. |
| **Banner de Cookies** | barra inferior avisando sobre el uso de cookies. | **SÍ** | Verifica en el navegador del usuario si ya aceptó las cookies anteriormente. Si no, muestra el banner y guarda la preferencia al aceptar. |

---

### 2.2. Página de Resultados (`resultados.html`)
Diseñada como una aplicación de consulta de datos históricos.

| Sección / Componente | Descripción Detallada | ¿Usa JavaScript? | Funcionalidad JS Específica |
| :--- | :--- | :--- | :--- |
| **Pantalla de Carga (Loading)** | Pantalla completa con animación de pirámide dorada que aparece al entrar. | **SÍ** | Se muestra mientras cargan los recursos y se oculta automáticamente cuando el sitio está listo (`window.onload`). |
| **Filtros de Búsqueda** | Controles para filtrar por Fecha (Calendario), Sorteo (Select) y Número (Input de texto). | **SÍ** | Escucha los cambios en los inputs y ejecuta la función de búsqueda en tiempo real (con un retraso "debounce" para optimizar). |
| **Tabla de Resultados** | Tabla principal donde se listan todos los sorteos históricos. Incluye columnas para Triple A/B, Terminales y Zodiacal. | **SÍ** | Es el componente más complejo. Recibe datos filtrados, limpia la tabla actual e inyecta el nuevo HTML fila por fila. Maneja estados de "Cargando" y "No hay resultados". |
| **Paginación** | Botones "Anterior" y "Siguiente" al pie de la tabla. | **SÍ** | Controla qué bloque de datos se muestra (ej. resultados 1 al 20) y actualiza el contador de páginas. |
| **Estadísticas Rápidas** | 4 tarjetas que muestran métricas: Sorteos Hoy, Total Histórico, Número Más Frecuente, Signo de Suerte. | **SÍ** | Analiza *todo* el conjunto de datos disponible en la API simulada para calcular estos valores matemáticamente al cargar la página. |
| **Botón Exportar** | Botón para descargar resultados. | **SÍ** | Simula una descarga de archivo (funcionalidad visual demostrativa). |

---

### 2.3. Página de Reglamento (`reglamento.html`)
Página de contenido denso optimizada para la lectura.

| Sección / Componente | Descripción Detallada | ¿Usa JavaScript? | Funcionalidad JS Específica |
| :--- | :--- | :--- | :--- |
| **Índice Interactivo** | Lista de capítulos (I al V) al inicio o lateral. | **SÍ** | 1. **Scroll Suave:** Lleva al usuario a la sección correspondiente suavemente al hacer clic. <br> 2. **Observador:** Detecta qué capítulo está leyendo el usuario y resalta el botón correspondiente en el índice automáticamente. |
| **Artículos Legales** | Texto completo del reglamento. | **SÍ** | Funcionalidad para colapsar/expandir el contenido de los artículos al hacer clic en los títulos, facilitando la navegación en móviles. |

---

## 3. Tecnologías y Librerías Utilizadas

Para lograr estas funcionalidades sin incurrir en costos de licencias o servidores pesados, se utilizaron tecnologías estándar y optimizadas:

*   **HTML5 Semántico:** Estructura base para SEO y Accesibilidad.
*   **CSS3 Moderno:**
    *   **Variables CSS:** Para manejo global de colores (Dorado, Púrpura, Blanco).
    *   **Flexbox y Grid:** Para maquetación responsiva.
    *   **Animaciones Keyframes:** Para efectos de partículas y brillos.
*   **JavaScript (Vanilla ES6+):**
    *   No se utilizaron frameworks pesados (como React o Angular) para mantener el sitio **ligero y rápido**.
    *   Uso de `Local Storage` para persistencia de datos (cookies).
    *   Uso de `Intl.NumberFormat` y `Intl.DateTimeFormat` para formateo profesional de monedas y fechas.
*   **FontAwesome:** Librería de iconos vectoriales (svg) para toda la interfaz visual.
*   **Fuentes Google:** Playfair Display (Títulos de lujo), Cinzel (Números y detalles egipcios), Inter (Textos legibles).

---

## 4. Valor de la Implementación "Backend-less" (Simulación de API)

Es importante destacar la ingeniería detrás del archivo `js/backend-api.js`.
Aunque el sitio no está conectado a una base de datos real en la nube (MySQL/PostgreSQL) en esta etapa, **se programó una base de datos simulada en memoria**.

*   **¿Qué significa esto?** El sitio se comporta *exactamente* como si tuviera un servidor real. Puede buscar, filtrar, paginar y calcular estadísticas.
*   **Beneficio:** Permite validar toda la experiencia de usuario y los flujos de negocio sin gastar dinero en servidores durante la fase de desarrollo y aprobación.

---

## 5. Documentación del Código

Para garantizar la independencia tecnológica del cliente, se entregó el código fuente con el siguiente estándar:
*   **Comentarios en Español:** Cada función crítica en el archivo `script.js` explica qué hace (ej: `// Función para calcular tiempo restante`).
*   **Nombres Claros:** Las variables y clases CSS usan nombres descriptivos (ej: `.btn-comprar`, `loadResults()`).

Esta documentación detallada asegura que cualquier equipo técnico futuro pueda retomar el proyecto sin fricción.
