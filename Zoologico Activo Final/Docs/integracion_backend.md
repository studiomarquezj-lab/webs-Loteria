Guía de Integración Backend (Rails)
Este frontend espera que los datos existan en el navegador antes de inicializar la interfaz, o que se reinicialicen los componentes una vez cargados los datos.

Estructura de Datos Esperada
El sistema espera un arreglo global MOCK_RESULTS (que puedes renombrar a GLOBAL_RESULTS o similar, ajustando las referencias) con objetos de esta forma:

{
  "id": 123,
  "date": "2025-05-15",
  "time": "06:00 PM",
  "number": "05",
  "animal": "León",
  "emoji": "🦁",
  "image": "ANIMALITOS/05.png", // Opcional, ruta a la imagen
  "isComodin": false // true si es el comodín (63)
}
Flujo de Carga
Opción A: Inyección Directa (Server-Side Rendering)
Si inyectas los datos directamente en el HTML o en un script generado:

Reemplaza el contenido de 
js/data.js
 con tus datos reales.
Asegúrate de que MOCK_STATS también se genere o se calcule.
La función 
generateMockStats()
 en 
js/data.js
 ya está lista para calcular estadísticas basadas en MOCK_RESULTS. Simplemente asegúrate de llamarla después de definir MOCK_RESULTS.
// Ejemplo de js/data.js generado por Rails
const MOCK_RESULTS = [ ... datos de DB ... ];
const MOCK_STATS = generateMockStats(); // Calcula estadísticas automáticamente
Opción B: Fetch Asíncrono (API)
Si cargas los datos vía fetch():

Modifica 
js/main.js
 y 
js/results.js
 para no inicializar inmediatamente.
Carga los datos.
Asigna los datos a window.MOCK_RESULTS.
Ejecuta la lógica de estadísticas.
Llama a 
initStatistics()
, 
initResultsTable()
, etc.
Notas Importantes
Estadísticas Dinámicas: La visualización de estadísticas en 
index.html
 (calientes/fríos y comodín) depende de la función 
initStatistics()
 en 
js/main.js
. Esta función lee MOCK_STATS. Si actualizas los datos, asegúrate de refrescar MOCK_STATS y volver a llamar a 
initStatistics()
.