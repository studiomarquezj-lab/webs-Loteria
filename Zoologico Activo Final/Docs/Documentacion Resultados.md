# Documentación Técnica - Zoológico Activo

## Resumen del Proyecto

Este proyecto es una aplicación web para el juego de lotería "Zoológico Activo". Está construido con HTML5, CSS3 moderno (con variables CSS) y JavaScript vainilla (sin frameworks externos de frontend).

### Estructura de Archivos

- **`index.html`**: Página de inicio. Contiene el banner hero, ruleta animada, últimos resultados (ticker), grilla de animalitos y calculadora de ganancias.
- **`resultados.html`**: Página dedicada a consultar el histórico de resultados con filtros avanzados (fecha, animal, hora) y paginación.
- **`reglamento.html`**: Documentación de las reglas del juego, tabla de pagos y bases legales.
- **`css/styles.css`**: Hoja de estilos principal. Utiliza un sistema de variables CSS para facilitar cambios de tema ("Premium").
- **`js/data.js`**: Archivo de datos centralizado. Contiene la lista de animales (`ANIMALS`) y horarios (`SCHEDULE`), así como funciones para generar datos de prueba (`MOCK_RESULTS`).
- **`js/main.js`**: Lógica principal para `index.html`. Maneja el menú móvil, cuenta regresiva, banners y animaciones.
- **`js/results.js`**: Lógica específica para `resultados.html`. Maneja la tabla de datos, filtrado, ordenamiento y paginación.

---

## Funcionalidades Frontend

### 1. Sistema de Diseño
Se utiliza una paleta de colores definida en `:root` en `styles.css`.
- **Colores Principales**: Verde Manzana (`--color-primary`), Azul Eléctrico (`--color-dark`), Dorado (`--color-secondary`).
- **Efectos**: Glassmorphism (vidrio) y sombras brillantes (`glow`).

### 2. Animaciones
- **Partículas**: `initParticles()` en `main.js` crea elementos `div` flotantes en el fondo.
- **Ruleta**: CSS Keyframes `spin` hacen girar el contenedor `.roulette`. La imagen central (`.cococrupier-img`) está posicionada absolutamente sobre la ruleta.
- **Monedas**: `initFloatingCoins()` añade emojis de monedas con animación de flotación.

### 3. Lógica de Negocio (JavaScript)
- **Datos Centralizados**: Todos los módulos consumen `ANIMALS` y `SCHEDULE` de `data.js`. Esto evita inconsistencias.
- **Filtros en Resultados**: `js/results.js` implementa un filtrado en el cliente sobre el array `tableState.data`.
  - El filtro de fecha comprueba concordancia exacta `YYYY-MM-DD`.
  - El filtro de hora maneja formatos "09:00 AM" convirtiéndolos a 24h para comparar.

---

## Guía de Integración Backend (Ruby on Rails)

Para hacer que la aplicación sea dinámica y muestre resultados reales cargados por un administrador, se recomienda integrar un backend con Ruby on Rails.

### 1. Modelado de Datos (Sugerencia)

Necesitarás al menos estos modelos en tu base de datos:

```ruby
# app/models/animal.rb
# Campos: number (string), name (string), image_path (string)
class Animal < ApplicationRecord
  has_many :draws
end

# app/models/draw.rb
# Campos: draw_time (time/string), draw_date (date), animal_id (integer)
class Draw < ApplicationRecord
  belongs_to :animal

  validates :draw_date, presence: true
  validates :draw_time, presence: true
end
```

### 2. API Endpoints

El frontend espera recibir objetos JSON. Crea un controlador para servir los resultados.

**Controlador API:**

```ruby
# app/controllers/api/v1/results_controller.rb
module Api
  module V1
    class ResultsController < ApplicationController
      def index
        # Obtener sorteos ordenados por fecha/hora reciente
        @draws = Draw.includes(:animal).order(draw_date: :desc, draw_time: :desc).limit(100)
        
        render json: @draws.map { |d|
          {
            id: d.id,
            date: d.draw_date.strftime("%Y-%m-%d"),
            time: d.draw_time.strftime("%I:%M %p"), # 09:00 AM
            number: d.animal.number,
            animal: d.animal.name,
            emoji: "🦁", # Podrías guardar el emoji en DB también
            image: d.animal.image_path, # Ruta a la imagen (ej: "ANIMALITOS/05.png")
            isComodin: d.animal.number == "63"
          }
        }
      end
    end
  end
end
```

### 3. Conexión con el Frontend

1.  **Eliminar Mock Data**: En `js/data.js`, elimina o comenta la generación de `MOCK_RESULTS`.
2.  **Fetch Real**: Modifica `js/results.js` (y `js/main.js` para el ticker) para obtener los datos del servidor al cargar.

**Ejemplo de modificación en `js/results.js`:**

```javascript
/* Reemplazar:
   const tableState = {
     data: [...MOCK_RESULTS],
     ...
   }
*/

// Nuevo Código:
let tableState = {
    data: [], // Iniciar vacío
    filteredData: [],
    // ... resto del estado
};

async function loadResults() {
    try {
        const response = await fetch('/api/v1/results');
        const data = await response.json();
        
        tableState.data = data;
        tableState.filteredData = data;
        renderTable(); // Renderizar tabla una vez cargados los datos
    } catch (error) {
        console.error("Error cargando resultados:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ... inits anteriores
    loadResults(); // Llamar a la API
});
```

## 6. Integración con Backend (Rails)

Para integrar la aplicación con el backend en Ruby on Rails, se deben seguir los siguientes pasos:

### 6.1. API de Resultados

El frontend espera consumir los resultados desde un endpoint API que devuelva un JSON con la siguiente estructura. Es fundamental mantener los nombres de las claves para que `js/results.js` funcione correctamente.

**Endpoint Sugerido:** `GET /api/v1/results`

**Estructura JSON Esperada:**

```json
[
  {
    "id": 1054,                  // ID único del sorteo (Número del Sorteo)
    "date": "2025-12-04",        // Fecha en formato YYYY-MM-DD
    "time": "09:00 AM",          // Hora del sorteo (String formateado)
    "number": "05",              // Número ganador (String, dos dígitos)
    "animal": "León",            // Nombre del animal
    "image": "ANIMALITOS/05.png",// Ruta relativa o absoluta a la imagen
    "isComodin": false           // Booleano, true si es comodín
  },
  {
    "id": 1053,
    "date": "2025-12-04",
    "time": "10:00 AM",
    "number": "63",
    "animal": "Comodín",
    "image": "ANIMALITOS/63.png",
    "isComodin": true
  }
  // ... más resultados
]
```

**Instrucciones para Alex:**
1.  Crear el endpoint en Rails que devuelva los últimos resultados (paginados o limitados según necesidad).
2.  En `js/results.js` y `js/main.js`, reemplazar la variable `MOCK_RESULTS` por una llamada `fetch()` a este endpoint.
3.  Asegurarse de que el campo `image` apunte a la ubicación correcta de los assets en el servidor o CDN.

### 6.2. Analíticas y Estadísticas

**CRÍTICO:** Actualmente, las estadísticas (Animales más frecuentes "Calientes" y menos frecuentes "Fríos") se generan en el frontend usando datos simulados (`MOCK_STATS` en `js/data.js`).

**Requerimiento:**
Una vez que la integración con Rails esté lista, **las analíticas deben depender 100% de los resultados reales**.

**Pasos a seguir:**
1.  **Opción A (Backend - Recomendada):** Crear un endpoint `/api/v1/stats` que devuelva ya calculados los animales más frecuentes y menos frecuentes. Esto reduce la carga en el cliente.
2.  **Opción B (Frontend):** Si se decide calcular en el frontend, se debe asegurar que la función `initStatistics()` en `js/main.js` utilice el array completo de resultados reales obtenidos de la API, y NO los datos de `MOCK_STATS`.

El cálculo debe iterar sobre todos los resultados históricos disponibles para determinar con precisión la frecuencia de cada animal.

---
*Cualquier duda, revisar los comentarios en el código fuente (en español).*


---

## Mantenimiento

- **Cambio de Imágenes**: Las imágenes de animales están en la carpeta `ANIMALITOS/`. Si cambias una imagen, asegúrate de mantener el nombre de archivo o actualizar `js/data.js`.
- **Cambio de Horarios**: Edita el array `SCHEDULE` en `js/data.js`.
