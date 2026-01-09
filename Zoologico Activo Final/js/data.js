// ==========================================
// DATOS DE ANIMALITOS - ZOOLÓGICO ACTIVO
// ==========================================

const ANIMALS = [
  { number: "00", name: "Ballena", emoji: "🐋", image: "ANIMALITOS/00.png" },
  { number: "0", name: "Delfín", emoji: "🐬", image: "ANIMALITOS/0.png" },
  { number: "01", name: "Carnero", emoji: "🐏", image: "ANIMALITOS/01.png" },
  { number: "02", name: "Toro", emoji: "🐂", image: "ANIMALITOS/02.png" },
  { number: "03", name: "Ciempiés", emoji: "🐛", image: "ANIMALITOS/03.png" },
  { number: "04", name: "Alacrán", emoji: "🦂", image: "ANIMALITOS/04.png" },
  { number: "05", name: "León", emoji: "🦁", image: "ANIMALITOS/05.png" },
  { number: "06", name: "Sapo", emoji: "🐸", image: "ANIMALITOS/06.png" },
  { number: "07", name: "Loro", emoji: "🦜", image: "ANIMALITOS/07.png" },
  { number: "08", name: "Ratón", emoji: "🐭", image: "ANIMALITOS/08.png" },
  { number: "09", name: "Águila", emoji: "🦅", image: "ANIMALITOS/09.png" },
  { number: "10", name: "Tigre", emoji: "🐯", image: "ANIMALITOS/10.png" },
  { number: "11", name: "Gato", emoji: "🐱", image: "ANIMALITOS/11.png" },
  { number: "12", name: "Caballo", emoji: "🐴", image: "ANIMALITOS/12.png" },
  { number: "13", name: "Mono", emoji: "🐵", image: "ANIMALITOS/13.png" },
  { number: "14", name: "Paloma", emoji: "🕊️", image: "ANIMALITOS/14.png" },
  { number: "15", name: "Zorro", emoji: "🦊", image: "ANIMALITOS/15.png" },
  { number: "16", name: "Oso", emoji: "🐻", image: "ANIMALITOS/16.png" },
  { number: "17", name: "Pavo", emoji: "🦃", image: "ANIMALITOS/17.png" },
  { number: "18", name: "Burro", emoji: "🫏", image: "ANIMALITOS/18.png" },
  { number: "19", name: "Cabra", emoji: "🐐", image: "ANIMALITOS/19.png" },
  { number: "20", name: "Cerdo", emoji: "🐷", image: "ANIMALITOS/20.png" },
  { number: "21", name: "Gallo", emoji: "🐓", image: "ANIMALITOS/21.png" },
  { number: "22", name: "Camello", emoji: "🐫", image: "ANIMALITOS/22.png" },
  { number: "23", name: "Cebra", emoji: "🦓", image: "ANIMALITOS/23.png" },
  { number: "24", name: "Iguana", emoji: "🦎", image: "ANIMALITOS/24.png" },
  { number: "25", name: "Gallina", emoji: "🐔", image: "ANIMALITOS/25.png" },
  { number: "26", name: "Vaca", emoji: "🐄", image: "ANIMALITOS/26.png" },
  { number: "27", name: "Perro", emoji: "🐕", image: "ANIMALITOS/27.png" },
  { number: "28", name: "Zamuro", emoji: "🦅", image: "ANIMALITOS/28.png" },
  { number: "29", name: "Elefante", emoji: "🐘", image: "ANIMALITOS/29.png" },
  { number: "30", name: "Caimán", emoji: "🐊", image: "ANIMALITOS/30.png" },
  { number: "31", name: "Lapa", emoji: "🦫", image: "ANIMALITOS/31.png" },
  { number: "32", name: "Ardilla", emoji: "🐿️", image: "ANIMALITOS/32.png" },
  { number: "33", name: "Pescado", emoji: "🐟", image: "ANIMALITOS/33.png" },
  { number: "34", name: "Venado", emoji: "🦌", image: "ANIMALITOS/34.png" },
  { number: "35", name: "Jirafa", emoji: "🦒", image: "ANIMALITOS/35.png" },
  { number: "36", name: "Conejo", emoji: "🐰", image: "ANIMALITOS/36.png" },
  { number: "37", name: "Colibrí", emoji: "🐦", image: "ANIMALITOS/37.png" },
  { number: "38", name: "Flamenco", emoji: "🦩", image: "ANIMALITOS/38.png" },
  { number: "39", name: "Gavilán", emoji: "🦅", image: "ANIMALITOS/39.png" },
  { number: "40", name: "Halcón", emoji: "🦅", image: "ANIMALITOS/40.png" },
  { number: "41", name: "Pelícano", emoji: "🦢", image: "ANIMALITOS/41.png" },
  { number: "42", name: "Garza", emoji: "🦢", image: "ANIMALITOS/42.png" },
  { number: "43", name: "Canguro", emoji: "🦘", image: "ANIMALITOS/43.png" },
  { number: "44", name: "Culebra", emoji: "🐍", image: "ANIMALITOS/44.png" },
  { number: "45", name: "Tortuga", emoji: "🐢", image: "ANIMALITOS/45.png" },
  { number: "46", name: "Corocoro", emoji: "🐦", image: "ANIMALITOS/46.png" },
  { number: "47", name: "Avestruz", emoji: "🐦", image: "ANIMALITOS/47.png" },
  { number: "48", name: "Coyote", emoji: "🐺", image: "ANIMALITOS/48.png" },
  { number: "49", name: "Pingüino", emoji: "🐧", image: "ANIMALITOS/49.png" },
  { number: "50", name: "Cisne", emoji: "🦢", image: "ANIMALITOS/50.png" },
  { number: "51", name: "Búho", emoji: "🦉", image: "ANIMALITOS/51.png" },
  { number: "52", name: "Lobo", emoji: "🐺", image: "ANIMALITOS/52.png" },
  { number: "53", name: "Ganso", emoji: "🪿", image: "ANIMALITOS/53.png" },
  { number: "54", name: "Tiburón", emoji: "🦈", image: "ANIMALITOS/54.png" },
  { number: "55", name: "Gacela", emoji: "🦌", image: "ANIMALITOS/55.png" },
  { number: "56", name: "Hiena", emoji: "🐕", image: "ANIMALITOS/56.png" },
  { number: "57", name: "Buitre", emoji: "🦅", image: "ANIMALITOS/57.png" },
  { number: "58", name: "Bisonte", emoji: "🦬", image: "ANIMALITOS/58.png" },
  { number: "59", name: "Pantera", emoji: "🐈‍⬛", image: "ANIMALITOS/59.png" },
  { number: "60", name: "Camaleón", emoji: "🦎", image: "ANIMALITOS/60.png" },
  { number: "61", name: "Panda", emoji: "🐼", image: "ANIMALITOS/61.png" },
  { number: "62", name: "Cachicamo", emoji: "🦔", image: "ANIMALITOS/62.png" },
  { number: "63", name: "Comodín", emoji: "⭐", image: "ANIMALITOS/63.png", comodin: true },
]

// Horarios de sorteos
const SCHEDULE = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
]

// Hardcoded Demo Results
const STATIC_RESULTS = [
  // --- DÍA 3: 15 de Mayo 2025 ---
  { id: 41, date: "2025-05-15", time: "06:00 PM", number: "05", animal: "León", emoji: "🦁", image: "ANIMALITOS/05.png", isComodin: false },
  { id: 40, date: "2025-05-15", time: "05:00 PM", number: "10", animal: "Tigre", emoji: "🐯", image: "ANIMALITOS/10.png", isComodin: false },
  { id: 39, date: "2025-05-15", time: "04:00 PM", number: "00", animal: "Ballena", emoji: "🐋", image: "ANIMALITOS/00.png", isComodin: false },
  { id: 38, date: "2025-05-15", time: "03:00 PM", number: "33", animal: "Pescado", emoji: "🐟", image: "ANIMALITOS/33.png", isComodin: false },
  { id: 37, date: "2025-05-15", time: "02:00 PM", number: "15", animal: "Zorro", emoji: "🦊", image: "ANIMALITOS/15.png", isComodin: false },
  { id: 36, date: "2025-05-15", time: "01:00 PM", number: "25", animal: "Gallina", emoji: "🐔", image: "ANIMALITOS/25.png", isComodin: false },
  { id: 35, date: "2025-05-15", time: "12:00 PM", number: "63", animal: "Comodín", emoji: "⭐", image: "ANIMALITOS/63.png", isComodin: true },
  { id: 34, date: "2025-05-15", time: "11:00 AM", number: "08", animal: "Ratón", emoji: "🐭", image: "ANIMALITOS/08.png", isComodin: false },
  { id: 33, date: "2025-05-15", time: "10:00 AM", number: "40", animal: "Halcón", emoji: "🦅", image: "ANIMALITOS/40.png", isComodin: false },
  { id: 32, date: "2025-05-15", time: "09:00 AM", number: "55", animal: "Gacela", emoji: "🦌", image: "ANIMALITOS/55.png", isComodin: false },

  // --- DÍA 2: 14 de Mayo 2025 ---
  { id: 31, date: "2025-05-14", time: "06:00 PM", number: "12", animal: "Caballo", emoji: "🐴", image: "ANIMALITOS/12.png", isComodin: false },
  { id: 30, date: "2025-05-14", time: "05:00 PM", number: "29", animal: "Elefante", emoji: "🐘", image: "ANIMALITOS/29.png", isComodin: false },
  { id: 29, date: "2025-05-14", time: "04:00 PM", number: "36", animal: "Conejo", emoji: "🐰", image: "ANIMALITOS/36.png", isComodin: false },
  { id: 28, date: "2025-05-14", time: "03:00 PM", number: "02", animal: "Toro", emoji: "🐂", image: "ANIMALITOS/02.png", isComodin: false },
  { id: 27, date: "2025-05-14", time: "02:00 PM", number: "17", animal: "Pavo", emoji: "🦃", image: "ANIMALITOS/17.png", isComodin: false },
  { id: 26, date: "2025-05-14", time: "01:00 PM", number: "53", animal: "Ganso", emoji: "🪿", image: "ANIMALITOS/53.png", isComodin: false },
  { id: 25, date: "2025-05-14", time: "12:00 PM", number: "44", animal: "Culebra", emoji: "🐍", image: "ANIMALITOS/44.png", isComodin: false },
  { id: 24, date: "2025-05-14", time: "11:00 AM", number: "22", animal: "Camello", emoji: "🐫", image: "ANIMALITOS/22.png", isComodin: false },
  { id: 23, date: "2025-05-14", time: "10:00 AM", number: "04", animal: "Alacrán", emoji: "🦂", image: "ANIMALITOS/04.png", isComodin: false },
  { id: 22, date: "2025-05-14", time: "09:00 AM", number: "60", animal: "Camaleón", emoji: "🦎", image: "ANIMALITOS/60.png", isComodin: false },

  // --- DÍA 1: 13 de Mayo 2025 ---
  { id: 21, date: "2025-05-13", time: "06:00 PM", number: "19", animal: "Cabra", emoji: "🐐", image: "ANIMALITOS/19.png", isComodin: false },
  { id: 20, date: "2025-05-13", time: "05:00 PM", number: "06", animal: "Sapo", emoji: "🐸", image: "ANIMALITOS/06.png", isComodin: false },
  { id: 19, date: "2025-05-13", time: "04:00 PM", number: "18", animal: "Burro", emoji: "🫏", image: "ANIMALITOS/18.png", isComodin: false },
  { id: 18, date: "2025-05-13", time: "03:00 PM", number: "31", animal: "Lapa", emoji: "🦫", image: "ANIMALITOS/31.png", isComodin: false },
  { id: 17, date: "2025-05-13", time: "02:00 PM", number: "63", animal: "Comodín", emoji: "⭐", image: "ANIMALITOS/63.png", isComodin: true },
  { id: 16, date: "2025-05-13", time: "01:00 PM", number: "09", animal: "Águila", emoji: "🦅", image: "ANIMALITOS/09.png", isComodin: false },
  { id: 15, date: "2025-05-13", time: "12:00 PM", number: "27", animal: "Perro", emoji: "🐕", image: "ANIMALITOS/27.png", isComodin: false },
  { id: 14, date: "2025-05-13", time: "11:00 AM", number: "45", animal: "Tortuga", emoji: "🐢", image: "ANIMALITOS/45.png", isComodin: false },
  { id: 13, date: "2025-05-13", time: "10:00 AM", number: "11", animal: "Gato", emoji: "🐱", image: "ANIMALITOS/11.png", isComodin: false },
  { id: 12, date: "2025-05-13", time: "09:00 AM", number: "01", animal: "Carnero", emoji: "🐏", image: "ANIMALITOS/01.png", isComodin: false },

  // --- ANTERIORES: 12 de Mayo 2025 ---
  { id: 11, date: "2025-05-12", time: "06:00 PM", number: "30", animal: "Caimán", emoji: "🐊", image: "ANIMALITOS/30.png", isComodin: false },
  { id: 10, date: "2025-05-12", time: "05:00 PM", number: "21", animal: "Gallo", emoji: "🐓", image: "ANIMALITOS/21.png", isComodin: false },
  { id: 9, date: "2025-05-12", time: "04:00 PM", number: "50", animal: "Cisne", emoji: "🦢", image: "ANIMALITOS/50.png", isComodin: false },
  { id: 8, date: "2025-05-12", time: "03:00 PM", number: "14", animal: "Paloma", emoji: "🕊️", image: "ANIMALITOS/14.png", isComodin: false },
  { id: 7, date: "2025-05-12", time: "02:00 PM", number: "03", animal: "Ciempiés", emoji: "🐛", image: "ANIMALITOS/03.png", isComodin: false },
  { id: 6, date: "2025-05-12", time: "01:00 PM", number: "59", animal: "Pantera", emoji: "🐈‍⬛", image: "ANIMALITOS/59.png", isComodin: false },
  { id: 5, date: "2025-05-12", time: "12:00 PM", number: "07", animal: "Loro", emoji: "🦜", image: "ANIMALITOS/07.png", isComodin: false },
  { id: 4, date: "2025-05-12", time: "11:00 AM", number: "39", animal: "Gavilán", emoji: "🦅", image: "ANIMALITOS/39.png", isComodin: false },
  { id: 3, date: "2025-05-12", time: "10:00 AM", number: "35", animal: "Jirafa", emoji: "🦒", image: "ANIMALITOS/35.png", isComodin: false },
  { id: 2, date: "2025-05-12", time: "09:00 AM", number: "20", animal: "Cerdo", emoji: "🐷", image: "ANIMALITOS/20.png", isComodin: false },

  // --- ANTERIORES: 11 de Mayo 2025 ---
  { id: 1, date: "2025-05-11", time: "06:00 PM", number: "00", animal: "Ballena", emoji: "🐋", image: "ANIMALITOS/00.png", isComodin: false },
]

// Generar estadísticas REALES basadas en los resultados
function generateMockStats() {
  const stats = {}

  // 1. Inicializar todos los animales con contador 0
  ANIMALS.forEach((animal) => {
    stats[animal.number] = {
      ...animal,
      count: 0,
    }
  })

  // 2. Contar ocurrencias en MOCK_RESULTS
  MOCK_RESULTS.forEach((result) => {
    if (stats[result.number]) {
      stats[result.number].count++
    }
  })

  return stats
}

// Exportar datos
// const MOCK_RESULTS = generateMockResults(100)
const MOCK_RESULTS = STATIC_RESULTS
const MOCK_STATS = generateMockStats()
