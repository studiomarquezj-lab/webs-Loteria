// ==========================================
// ZOOLÓGICO ACTIVO - JAVASCRIPT PRINCIPAL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initParticles()
  initMobileMenu()
  initSmoothScroll()
  initCountdown()
  initFloatingCoins()
  initLastResults()
  initAnimalsGrid()
  initHeroBanner()
  initScheduleGrid()
  initCalculator()
  initStatistics()
  initPurchasePopup()
  initCookieBanner()
})

// ==========================================
// PARTÍCULAS FLOTANTES
// ==========================================
function initParticles() {
  const container = document.getElementById("particles")
  if (!container) return

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.animationDelay = Math.random() * 15 + "s"
    particle.style.animationDuration = 10 + Math.random() * 10 + "s"
    container.appendChild(particle)
  }
}

// ==========================================
// MENÚ MÓVIL
// ==========================================
// ==========================================
// MENÚ MÓVIL
// ==========================================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      // Alternar clase 'active' en el botón
      this.classList.toggle('active');

      // Alternar clase 'mobile-active' en el menú
      navLinks.classList.toggle('mobile-active');

      // Prevenir scroll cuando el menú está abierto
      if (navLinks.classList.contains('mobile-active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('mobile-active');
        document.body.style.overflow = '';
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) &&
        !mobileMenuBtn.contains(e.target) &&
        navLinks.classList.contains('mobile-active')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('mobile-active');
        document.body.style.overflow = '';
      }
    });

    // Cerrar menú con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('mobile-active')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('mobile-active');
        document.body.style.overflow = '';
      }
    });
  }
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  })
}

// ==========================================
// COUNTDOWN (CUENTA REGRESIVA)
// ==========================================
function initCountdown() {
  const hoursEl = document.getElementById("countHours")
  const minutesEl = document.getElementById("countMinutes")
  const secondsEl = document.getElementById("countSeconds")

  if (!hoursEl || !minutesEl || !secondsEl) return

  // Horas de sorteo (9am a 6pm)
  const scheduleHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  function updateCountdown() {
    const now = new Date()
    let nextSorteo = null

    // Buscar el próximo sorteo hoy
    for (const hour of scheduleHours) {
      const drawDate = new Date(now)
      drawDate.setHours(hour, 0, 0, 0)

      if (drawDate > now) {
        nextSorteo = drawDate
        break
      }
    }

    // Si no hay más sorteos hoy, programar para mañana a las 9 AM
    if (!nextSorteo) {
      nextSorteo = new Date(now)
      nextSorteo.setDate(nextSorteo.getDate() + 1)
      nextSorteo.setHours(9, 0, 0, 0)
    }

    const diff = nextSorteo - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    hoursEl.textContent = String(hours).padStart(2, "0")
    minutesEl.textContent = String(minutes).padStart(2, "0")
    secondsEl.textContent = String(seconds).padStart(2, "0")
  }

  updateCountdown()
  setInterval(updateCountdown, 1000)
}

// ==========================================
// MONEDAS FLOTANTES
// ==========================================
function initFloatingCoins() {
  const container = document.getElementById("floatingCoins")
  if (!container) return

  const coins = ["🪙", "💰", "✨"]

  for (let i = 0; i < 15; i++) {
    const coin = document.createElement("span")
    coin.className = "coin"
    coin.textContent = coins[Math.floor(Math.random() * coins.length)]
    coin.style.left = Math.random() * 100 + "%"
    coin.style.top = Math.random() * 100 + "%"
    coin.style.animationDelay = Math.random() * 5 + "s"
    coin.style.animationDuration = 8 + Math.random() * 7 + "s"
    container.appendChild(coin)
  }
}

// ==========================================
// ÚLTIMOS RESULTADOS
// ==========================================
function initLastResults() {
  const container = document.getElementById("resultsScroll")
  if (!container) return

  // Usar datos globales de data.js
  const recentResults = MOCK_RESULTS.slice(0, 10)

  recentResults.forEach((result, index) => {
    const card = document.createElement("div")

    // Determinar clase de color
    let colorClass = ""
    if (result.isComodin) {
      colorClass = "comodin"
    } else {
      // Alternar verde y amarillo (basado en el índice)
      colorClass = index % 2 === 0 ? "green" : "yellow"
    }

    // Asegurarnos de que las clases existan en CSS o usar estilos en línea si es necesario
    // Asumiremos que existen clases .result-card.green y .result-card.yellow
    // O usaremos estilos directos si las clases no están definidas

    card.className = `result-card ${colorClass}`

    // Usar imagen si está disponible, sino emoji
    const imageHtml = result.image
      ? `<img src="${result.image}" alt="${result.animal}" class="result-image">`
      : `<div style="font-size: 2.5rem; margin-bottom: 5px;">${result.emoji}</div>`

    card.innerHTML = `
            <div class="result-time">${result.time}</div>
            ${imageHtml}
            <div class="result-number">${result.number}</div>
            <div class="result-animal">${result.animal}</div>
        `
    container.appendChild(card)
  })
}

// ==========================================
// GRILLA DE ANIMALITOS
// ==========================================
function initAnimalsGrid() {
  const grid = document.getElementById("animalsGrid")
  if (!grid) return

  let selectedAnimal = null

  // Usar datos globales de data.js
  ANIMALS.forEach((animal) => {
    const cell = document.createElement("div")
    cell.className = "animal-cell"
    cell.dataset.number = animal.number

    if (animal.special) cell.classList.add("special")
    if (animal.comodin) cell.classList.add("comodin")

    // Usar imagen si está disponible, sino emoji
    const imageHtml = animal.image
      ? `<img src="${animal.image}" alt="${animal.name}" class="animal-image">`
      : `<div style="font-size: 2rem; margin-bottom: 5px;">${animal.emoji}</div>`

    cell.innerHTML = `
            ${imageHtml}
            <div class="animal-number">${animal.number}</div>
            <div class="animal-name">${animal.name}</div>
        `

    cell.addEventListener("click", () => {
      if (selectedAnimal) {
        selectedAnimal.classList.remove("selected")
      }
      if (selectedAnimal !== cell) {
        cell.classList.add("selected")
        selectedAnimal = cell
      } else {
        selectedAnimal = null
      }
    })

    grid.appendChild(cell)
  })
}

// ==========================================
// BANNER CAROUSEL
// ==========================================
// ==========================================
// HERO BANNER (NUEVO DISEÑO)
// ==========================================
function initHeroBanner() {
  const bannerBg = document.getElementById("bannerBg")
  const currentSection = document.getElementById("currentSection")
  const destDots = document.querySelectorAll(".dest-dot")
  const hotspots = document.querySelectorAll(".hotspot")

  if (!bannerBg) return

  // Configuración de secciones (imágenes de stock selva/naturaleza)
  // Configuración de secciones (imágenes de stock selva/naturaleza)
  const sections = {
    comodin: {
      image: "https://images.unsplash.com/photo-1534234828563-025c93f3fda6?auto=format&fit=crop&w=1920&q=80", // Bosque frondoso
      label: "¡Gana x100!",
      title: "GANA X 100 con el comodin",
      subtitle: "Multiplica tu suerte con el número 63. ¡La oportunidad de ganar en grande está aquí!"
    },
    aproximados: {
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80", // Naturaleza con niebla
      label: "Gana x4",
      title: "Como ganar con los aproxmados",
      subtitle: "Si tu animal está cerca, ¡también ganas! Descubre cómo los aproximados te dan más chances."
    },
    compra: {
      image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1920&q=80", // Hojas verdes detalle
      label: "Compra Rápida",
      title: "Compra Zoologico Activo",
      subtitle: "Haz tu jugada ahora mismo vía WhatsApp. Rápido, seguro y confiable."
    }
  }

  // Setup inicial (Comodin por defecto)
  bannerBg.style.backgroundImage = `url('${sections.comodin.image}')`

  // Efecto hover en el banner
  const banner = document.querySelector(".hero-banner")
  if (banner) {
    banner.addEventListener("mouseenter", () => {
      bannerBg.style.transform = "scale(1.05)"
    })

    banner.addEventListener("mouseleave", () => {
      bannerBg.style.transform = "scale(1)"
    })
  }

  function updateBanner(sectionKey) {
    // Actualizar dots
    destDots.forEach(d => {
      if (d.dataset.dest === sectionKey) d.classList.add("active")
      else d.classList.remove("active")
    })

    // Transición de fondo y texto
    bannerBg.style.opacity = "0"
    const bannerTitle = document.getElementById("bannerTitle")
    const bannerSubtitle = document.getElementById("bannerSubtitle")

    if (bannerTitle) bannerTitle.style.opacity = "0"
    if (bannerSubtitle) bannerSubtitle.style.opacity = "0"

    setTimeout(() => {
      if (sections[sectionKey]) {
        bannerBg.style.backgroundImage = `url('${sections[sectionKey].image}')`
        if (currentSection) currentSection.textContent = sections[sectionKey].label
        if (bannerTitle) bannerTitle.textContent = sections[sectionKey].title
        if (bannerSubtitle) bannerSubtitle.textContent = sections[sectionKey].subtitle
      }
      bannerBg.style.opacity = "1"

      if (bannerTitle) {
        bannerTitle.style.opacity = "1"
        bannerTitle.style.animation = "none"
        bannerTitle.offsetHeight /* forzar reflow */
        bannerTitle.style.animation = "fadeUp 1s ease forwards 0.2s"
      }
      if (bannerSubtitle) {
        bannerSubtitle.style.opacity = "1"
        bannerSubtitle.style.animation = "none"
        bannerSubtitle.offsetHeight /* forzar reflow */
        bannerSubtitle.style.animation = "fadeUp 1s ease forwards 0.4s"
      }
    }, 300)
  }

  // Navegación por dots
  destDots.forEach(dot => {
    dot.addEventListener("click", function () {
      const dest = this.getAttribute("data-dest")
      updateBanner(dest)
      resetAutoRotate()
    })
  })

  // Navegación por hotspots
  hotspots.forEach(hotspot => {
    hotspot.addEventListener("click", function (e) {
      if (e.target.closest(".hotspot-details")) return

      const dest = this.getAttribute("data-dest")

      // Si es compra, abrir modal
      if (dest === 'compra') {
        const modal = document.getElementById('purchaseModal');
        if (modal) {
          modal.classList.add('show');
          document.body.style.overflow = 'hidden'; // Prevenir scroll
        }
      }

      updateBanner(dest)
      resetAutoRotate()
    })
  })

  // Auto-rotación
  let currentIndex = 0
  const sectionKeys = Object.keys(sections)
  let autoRotateInterval

  function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % sectionKeys.length
      updateBanner(sectionKeys[currentIndex])
    }, 6000)
  }

  function resetAutoRotate() {
    clearInterval(autoRotateInterval)
    startAutoRotate()
  }

  startAutoRotate()
}

// ==========================================
// HORARIOS
// ==========================================
function initScheduleGrid() {
  const grid = document.getElementById("scheduleGrid")
  if (!grid) return

  const now = new Date()
  const currentHour = now.getHours()

  // Limpiar grid para evitar duplicados
  grid.innerHTML = ""

  // Usar datos globales de data.js
  SCHEDULE.forEach((time) => {
    const hour = Number.parseInt(time)
    const isPM = time.includes("PM")
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour

    const item = document.createElement("div")
    item.className = "schedule-item"

    // Marcar el horario activo o próximo
    if (hour24 === currentHour || (hour24 > currentHour && !grid.querySelector(".active"))) {
      item.classList.add("active")
    }

    item.innerHTML = `
            <div class="schedule-time">${time}</div>
            <div class="schedule-label">Sorteo</div>
        `

    grid.appendChild(item)
  })
}

// ==========================================
// CALCULADORA
// ==========================================
function initCalculator() {
  const betInput = document.getElementById("betAmount")
  const quickBtns = document.querySelectorAll(".quick-btn")
  const resultDirect = document.getElementById("resultDirect")
  const resultApprox = document.getElementById("resultApprox")
  const resultComodin = document.getElementById("resultComodin")

  if (!betInput) return

  function formatNumber(num) {
    return num.toLocaleString("es-VE") + " Bs"
  }

  function updateResults() {
    const bet = Number.parseFloat(betInput.value) || 0

    if (resultDirect) resultDirect.textContent = formatNumber(bet * 40)
    if (resultApprox) resultApprox.textContent = formatNumber(bet * 4)
    if (resultComodin) resultComodin.textContent = formatNumber(bet * 100)
  }

  betInput.addEventListener("input", updateResults)

  quickBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      quickBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      betInput.value = btn.dataset.amount
      updateResults()
    })
  })

  updateResults()
}

// ==========================================
// ESTADÍSTICAS
// ==========================================
function initStatistics() {
  const hotList = document.getElementById("hotList")
  const coldList = document.getElementById("coldList")
  const comodinCount = document.getElementById("comodinCount")
  const comodinLast = document.getElementById("comodinLast")
  const filterBtns = document.querySelectorAll(".stats-filter .filter-btn")

  if (!hotList || !coldList) return

  function updateStats() {
    // Usar datos globales de data.js
    const sorted = Object.values(MOCK_STATS).sort((a, b) => b.count - a.count)

    // Validar que hay datos
    if (sorted.length === 0 || sorted[0].count === 0) return

    const maxCount = sorted[0].count

    // Top 5 más frecuentes
    const hot = sorted.slice(0, 5)
    // Top 5 menos frecuentes (filtrar solo los que tienen 0 o pocos, o simplemente los últimos)
    // Para que sea más realista, mostramos los que menos han salido (count = 0 o 1)
    const cold = sorted.filter(item => item.count === 0).slice(0, 5)
    // Si no hay suficientes con 0, rellenamos con los de menor conteo
    if (cold.length < 5) {
      const others = sorted.filter(item => item.count > 0).reverse().slice(0, 5 - cold.length)
      cold.push(...others)
    }

    function renderList(list, container, isHot) {
      container.innerHTML = ""
      list.forEach((item, index) => {
        // Evitar división por cero
        const percent = maxCount > 0 ? (item.count / maxCount) * 100 : 0

        const div = document.createElement("div")
        div.className = "stat-item"

        // Usar imagen si está disponible
        const imageHtml = item.image
          ? `<img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px; object-fit: contain; margin-right: 10px;">`
          : `<span style="font-size: 1.2rem; margin-right: 10px;">${item.emoji}</span>`

        div.innerHTML = `
                    <span class="stat-rank">${index + 1}</span>
                    <div class="stat-info">
                        <div style="display: flex; align-items: center;">
                            ${imageHtml}
                            <span class="stat-animal">${item.number} - ${item.name}</span>
                        </div>
                        <div class="stat-bar">
                            <div class="stat-bar-fill" style="width: ${percent}%"></div>
                        </div>
                    </div>
                    <span class="stat-count">${item.count}x</span>
                `
        container.appendChild(div)
      })
    }

    renderList(hot, hotList, true)
    renderList(cold, coldList, false)

    // Actualizar Estadísticas de Comodín
    if (comodinCount && comodinLast) {
      // Buscar el comodín en las estadísticas (número 63 - asumiendo que es el comodín)
      // O buscar por propiedad comodin: true
      const comodinData = Object.values(MOCK_STATS).find(s => s.number === "63" || s.comodin)

      if (comodinData) {
        comodinCount.textContent = comodinData.count

        // Buscar la última vez que salió
        const lastAppearance = MOCK_RESULTS.find(r => r.number === comodinData.number)
        // MOCK_RESULTS está ordenado por defecto descendente? 
        // En data.js STATIC_RESULTS empieza en ID 41 (Hoy) hasta ID 1 (Pasado).
        // Así que el primero que encuentre será el más reciente.

        if (lastAppearance) {
          // Calcular días de diferencia
          const today = new Date("2025-05-15") // Usamos la fecha "HOY" del demo
          const drawDate = new Date(lastAppearance.date)
          const diffTime = Math.abs(today - drawDate)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays === 0) {
            comodinLast.textContent = "Hoy"
          } else if (diffDays === 1) {
            comodinLast.textContent = "Ayer"
          } else {
            comodinLast.textContent = `Hace ${diffDays} días`
          }
        } else {
          comodinLast.textContent = "Nunca"
        }
      }
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      // En una implementación real, aquí filtrarías por el período
      updateStats()
    })
  })

  updateStats()
}
// ==========================================
// Inicialización

// ==========================================
// MODAL DE COMPRA
// ==========================================
function initPurchasePopup() {
  const modal = document.getElementById('purchaseModal');
  const closeBtn = document.querySelector('.modal-close');
  const form = document.getElementById('purchaseForm');
  const animalsDatalist = document.getElementById('animalsDatalist');
  const animalInput = document.getElementById('animalInput');
  const animalPreview = document.getElementById('animalPreview');
  const addAnimalBtn = document.getElementById('addAnimalBtn');
  const selectedAnimalsList = document.getElementById('selectedAnimalsList');
  const emptyListMsg = document.getElementById('emptyListMsg');
  const heroBuyBtn = document.getElementById('heroBuyBtn');

  let selectedAnimals = [];

  if (!modal || !form || !animalsDatalist) return;

  // Llenar datalist de animales
  ANIMALS.forEach(animal => {
    const option = document.createElement('option');
    option.value = `${animal.number} - ${animal.name}`;
    animalsDatalist.appendChild(option);
  });

  // Función para actualizar la vista previa de imagen
  function updatePreview() {
    let rawValue = animalInput.value.trim();
    let animalData = null;

    if (rawValue.includes(" - ")) {
      const numberPart = rawValue.split(" - ")[0].trim();
      animalData = ANIMALS.find(a => a.number === numberPart);
    } else {
      let searchNum = rawValue;
      if (!isNaN(rawValue) && rawValue !== "0" && rawValue.length === 1) {
        searchNum = rawValue.padStart(2, '0');
      }
      animalData = ANIMALS.find(a => a.number === searchNum) ||
        ANIMALS.find(a => a.name.toLowerCase() === rawValue.toLowerCase());
    }

    if (animalData && animalData.image) {
      animalPreview.innerHTML = `<img src="${animalData.image}" alt="${animalData.name}">`;
      animalPreview.style.borderColor = "var(--color-primary)";
    } else {
      animalPreview.innerHTML = "";
      animalPreview.style.borderColor = "rgba(59, 130, 246, 0.2)";
    }
  }

  // Listener para la vista previa
  animalInput.addEventListener('input', updatePreview);

  // Función para agregar animal
  function addAnimal() {
    let rawValue = animalInput.value.trim();
    if (rawValue === "") {
      alert("Por favor ingresa un número o nombre de animal");
      return;
    }

    let animalData = null;

    // 1. Intentar buscar por el formato del datalist "00 - Nombre"
    if (rawValue.includes(" - ")) {
      const numberPart = rawValue.split(" - ")[0].trim();
      animalData = ANIMALS.find(a => a.number === numberPart);
    }

    // 2. Si no se encontró, intentar buscar por número exacto
    if (!animalData) {
      // Normalizar número (si es "5" -> "05", pero ignorar si es "0")
      let searchNum = rawValue;
      if (!isNaN(rawValue) && rawValue !== "0" && rawValue.length === 1) {
        searchNum = rawValue.padStart(2, '0');
      }
      animalData = ANIMALS.find(a => a.number === searchNum);
    }

    // 3. Si no se encontró, intentar buscar por nombre (insensible a mayúsculas)
    if (!animalData) {
      animalData = ANIMALS.find(a => a.name.toLowerCase() === rawValue.toLowerCase());
    }

    if (!animalData) {
      alert("No se encontró ningún animal que coincida con \"" + rawValue + "\". Por favor usa el número (00-63) o el nombre exacto.");
      return;
    }

    // Evitar duplicados
    if (selectedAnimals.some(a => a.number === animalData.number)) {
      alert("El animal \"" + animalData.name + "\" ya está en tu jugada");
      return;
    }

    // Agregar al array
    selectedAnimals.push({
      number: animalData.number,
      name: animalData.name,
      image: animalData.image
    });
    renderSelectedAnimals();

    // Limpiar input y preview
    animalInput.value = "";
    updatePreview();
    animalInput.focus();
  }

  function renderSelectedAnimals() {
    selectedAnimalsList.innerHTML = "";
    if (selectedAnimals.length === 0) {
      emptyListMsg.style.display = "block";
    } else {
      emptyListMsg.style.display = "none";
      selectedAnimals.forEach((animal, index) => {
        const li = document.createElement("li");
        li.className = "selected-animal-item";
        li.innerHTML = `
          <div class="selected-animal-info">
            <img src="${animal.image}" alt="${animal.name}" class="selected-animal-img">
            <span><strong>${animal.number}</strong> - ${animal.name}</span>
          </div>
          <i class="fas fa-trash remove-animal" data-index="${index}"></i>
        `;
        selectedAnimalsList.appendChild(li);
      });
    }

    // Asignar eventos de eliminar
    document.querySelectorAll('.remove-animal').forEach(btn => {
      btn.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        selectedAnimals.splice(index, 1);
        renderSelectedAnimals();
      });
    });
  }

  // Evento botón agregar
  addAnimalBtn.addEventListener('click', addAnimal);

  // Abrir modal
  if (heroBuyBtn) {
    heroBuyBtn.addEventListener('click', () => {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    selectedAnimals = []; // Limpiar lista al cerrar
    renderSelectedAnimals();
    form.reset();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Lógica de Moneda y Métodos de Pago
  const monedaRadios = document.querySelectorAll('input[name="moneda"]');
  const methodGroups = document.querySelectorAll('.payment-method-group');
  const montoLabel = document.getElementById('label-monto');

  monedaRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedMoneda = radio.value;

      // Actualizar label de monto
      if (montoLabel) {
        montoLabel.textContent = `Monto (${selectedMoneda}) por animal`;
      }

      // Mostrar métodos correspondientes
      methodGroups.forEach(group => {
        if (group.id === `methods-${selectedMoneda}`) {
          group.style.display = 'block';
          // Activar el primer radio del grupo visible
          const firstRadio = group.querySelector('input[type="radio"]');
          if (firstRadio) firstRadio.checked = true;
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // Manejar envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedAnimals.length === 0) {
      alert("Por favor agrega al menos un animal a tu jugada");
      return;
    }

    const cedula = document.getElementById('cedula').value;
    const telefono = document.getElementById('telefono').value;
    const monto = document.getElementById('monto').value;
    const moneda = form.elements['moneda'].value;
    const pago = form.elements['pago'].value;

    const animalsString = selectedAnimals.map(a => `${a.number} - ${a.name}`).join(", ");

    const message = `¡Hola! Quiero comprar Zoológico Activo. 🦁

*Datos del cliente:*
- Cédula: ${cedula}
- Teléfono: ${telefono}

*Detalles de la jugada:*
- Animales: ${animalsString}
- Monto por animal: ${monto} ${moneda}
- Total a pagar: ${monto * selectedAnimals.length} ${moneda}

*Método de pago:*
- ${pago} (${moneda})

¡Espero su respuesta!`;

    const whatsappNumber = "584127786726";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    closeModal();
  });
}

// ==========================================
// COOKIE BANNER
// ==========================================
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');

  if (!banner || !acceptBtn) return;

  // Verificar si ya aceptó
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 2000); // Mostrar después de 2 segundos
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.classList.remove('show');
  });
}
