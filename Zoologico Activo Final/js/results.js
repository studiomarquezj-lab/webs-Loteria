// ==========================================
// ZOOLÓGICO ACTIVO - PÁGINA DE RESULTADOS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initParticles()
  initMobileMenu()
  initFilters()
  initResultsTable()
  initModal()
})

// Partículas y menú móvil (reutilizados de main.js)
function initParticles() {
  const container = document.getElementById("particles")
  if (!container) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.animationDelay = Math.random() * 15 + "s"
    particle.style.animationDuration = 10 + Math.random() * 10 + "s"
    container.appendChild(particle)
  }
}

function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active")
      navLinks.classList.toggle("mobile-active") // Match CSS class
    })

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("active")
        navLinks.classList.remove("mobile-active")
      })
    })

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove("active")
        navLinks.classList.remove("mobile-active") // Match CSS class
      }
    })
  }

  // Smooth scroll para anclas
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
// ESTADO DE LA TABLA
// ==========================================
const tableState = {
  // Usar datos globales de data.js
  data: [...MOCK_RESULTS],
  filteredData: [...MOCK_RESULTS],
  currentPage: 1,
  itemsPerPage: 15,
  sortColumn: "date",
  sortDirection: "desc",
  filters: {
    search: "",
    date: "",
    animal: "",
    time: "",
  },
}

// ==========================================
// FILTROS
// ==========================================
// ==========================================
// FILTROS (INTERFAZ RICA - ESTILO ACORDEÓN)
// ==========================================
function initFilters() {
  const searchInput = document.getElementById("searchInput")
  const filterDate = document.getElementById("filterDate")
  const clearBtn = document.getElementById("clearFilters")

  // Elementos del Acordeón
  const expansionPanel = document.getElementById("expansionPanel")
  const chips = document.querySelectorAll(".filter-chip")
  const contents = document.querySelectorAll(".expansion-content")

  // Contenedores de Filtros Personalizados
  const animalGrid = document.getElementById("animalGrid")
  const timeScroller = document.getElementById("timeScroller")
  // selectedAnimalText fue removido del HTML, así que ignoramos esa referencia
  // y usamos el estado visual del panel expandido.

  // --- 1. Lógica del Acordeón ---
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const targetId = chip.dataset.target
      const isAlreadyActive = chip.classList.contains("active")

      // Reset all
      chips.forEach(c => c.classList.remove("active"))
      contents.forEach(c => c.classList.remove("active"))
      expansionPanel.classList.remove("active")

      if (!isAlreadyActive) {
        // Activar click
        chip.classList.add("active")
        document.getElementById(targetId).classList.add("active")
        expansionPanel.classList.add("active")
      }
    })
  })

  // --- 2. Poblar Grilla de Animales ---
  // Agregar opción "Todos"
  const allOption = document.createElement("div")
  allOption.className = "animal-option selected"
  allOption.dataset.value = ""
  allOption.innerHTML = `<span>Todos</span>`
  allOption.onclick = () => selectAnimal("", allOption)
  if (animalGrid) animalGrid.appendChild(allOption)

  if (typeof ANIMALS !== "undefined" && animalGrid) {
    ANIMALS.forEach(animal => {
      const el = document.createElement("div")
      el.className = "animal-option"
      el.dataset.value = animal.name
      el.innerHTML = `
         <img src="${animal.image}" alt="${animal.name}">
         <span>${animal.number}</span>
       `
      el.onclick = () => selectAnimal(animal.name, el)
      animalGrid.appendChild(el)
    })
  }

  // --- 3. Poblar Scroll de Horas ---
  // Agregar píldora "Todas"
  const allTimePill = document.createElement("div")
  allTimePill.className = "time-pill active"
  allTimePill.textContent = "Todas"
  allTimePill.onclick = () => selectTime("", allTimePill)
  if (timeScroller) timeScroller.appendChild(allTimePill)

  if (typeof SCHEDULE !== "undefined" && timeScroller) {
    SCHEDULE.forEach(time => {
      const pill = document.createElement("div")
      pill.className = "time-pill"
      pill.textContent = time
      pill.onclick = () => selectTime(time, pill)
      timeScroller.appendChild(pill)
    })
  }

  // --- 4. Funciones de Selección ---
  function selectAnimal(value, element) {
    tableState.filters.animal = value

    // Actualizar clase active
    if (animalGrid) {
      animalGrid.querySelectorAll(".animal-option").forEach(el => el.classList.remove("selected"))
    }
    element.classList.add("selected")

    // Actualizar apariencia del Chip (Opcional: Indicar si el filtro está activo)
    const animalChip = document.getElementById("chipAnimal")
    if (value) {
      animalChip.classList.add("has-value")
    } else {
      animalChip.classList.remove("has-value")
    }

    applyFilters()
  }

  function selectTime(value, element) {
    tableState.filters.time = value

    // Actualizar clase active
    if (timeScroller) {
      timeScroller.querySelectorAll(".time-pill").forEach(el => el.classList.remove("active"))
    }
    element.classList.add("active")

    // Actualizar Chip
    const timeChip = document.getElementById("chipTime")
    if (value) {
      timeChip.classList.add("has-value")
    } else {
      timeChip.classList.remove("has-value")
    }

    applyFilters()
  }

  // --- 5. Inputs Estándar ---
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      tableState.filters.search = e.target.value.toLowerCase()
      applyFilters()
    })
  }

  // --- Lógica de Calendario Personalizado ---
  let calendarDate = new Date()
  let selectedDate = null

  const calendarGrid = document.getElementById("calendarGrid")
  const currentMonthDisplay = document.getElementById("currentMonthDisplay")
  const prevMonthBtn = document.getElementById("prevMonth")
  const nextMonthBtn = document.getElementById("nextMonth")

  if (calendarGrid) {
    function renderCalendar() {
      calendarGrid.innerHTML = ""
      const year = calendarDate.getFullYear()
      const month = calendarDate.getMonth()

      // Actualizar Encabezado
      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
      currentMonthDisplay.textContent = `${monthNames[month]} ${year}`

      // Primer día del mes
      const firstDayIndex = new Date(year, month, 1).getDay()
      // Último día del mes
      const lastDay = new Date(year, month + 1, 0).getDate()

      // Relleno mes anterior
      for (let i = 0; i < firstDayIndex; i++) {
        const empty = document.createElement("div")
        empty.className = "calendar-day empty"
        calendarGrid.appendChild(empty)
      }

      // Días
      const today = new Date()
      for (let i = 1; i <= lastDay; i++) {
        const dayEl = document.createElement("div")
        dayEl.className = "calendar-day"
        dayEl.textContent = i

        // Revisar si es hoy
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          dayEl.classList.add("today")
        }

        // Revisar si está seleccionado
        if (selectedDate &&
          i === selectedDate.getDate() &&
          month === selectedDate.getMonth() &&
          year === selectedDate.getFullYear()) {
          dayEl.classList.add("selected")
        }

        dayEl.onclick = () => {
          selectedDate = new Date(year, month, i)

          // Formato para filtro: YYYY-MM-DD
          const yearStr = selectedDate.getFullYear()
          const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0')
          const dayStr = String(selectedDate.getDate()).padStart(2, '0')
          const dateString = `${yearStr}-${monthStr}-${dayStr}`

          tableState.filters.date = dateString
          if (filterDate) filterDate.value = dateString // Actualizar input oculto

          // Actualizar Chip
          const dateChip = document.getElementById("chipDate")
          if (dateChip) dateChip.classList.add("has-value")

          // Renderizar de nuevo para mostrar selección
          renderCalendar()
          applyFilters()
        }

        calendarGrid.appendChild(dayEl)
      }
    }

    // Navegación
    prevMonthBtn.addEventListener("click", () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1)
      renderCalendar()
    })

    nextMonthBtn.addEventListener("click", () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1)
      renderCalendar()
    })

    // Render Inicial
    renderCalendar()
  }

  /* 
  // Listener original de fecha removido
  if (filterDate) {
    filterDate.addEventListener("change", (e) => { ... })
  } 
  */

  // --- 6. Limpiar Filtros ---
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      // Resetear Estado
      tableState.filters = { search: "", date: "", animal: "", time: "" }

      // Resetear Inputs
      if (searchInput) searchInput.value = ""
      if (filterDate) filterDate.value = ""

      // Resetear Estado de Calendario Personalizado
      selectedDate = null
      if (typeof renderCalendar === "function") renderCalendar()

      // Resetear UI Chips
      chips.forEach(c => c.classList.remove("active", "has-value"))

      // Cerrar Acordeón
      expansionPanel.classList.remove("active")
      contents.forEach(c => c.classList.remove("active"))

      // Resetear Selectores UI Personalizados
      if (animalGrid) {
        animalGrid.querySelectorAll(".animal-option").forEach(el => el.classList.remove("selected"))
        if (animalGrid.firstChild) animalGrid.firstChild.classList.add("selected")
      }

      if (timeScroller) {
        timeScroller.querySelectorAll(".time-pill").forEach(el => el.classList.remove("active"))
        if (timeScroller.firstChild) timeScroller.firstChild.classList.add("active")
      }

      applyFilters()
    })
  }
}

function applyFilters() {
  const { search, date, animal, time } = tableState.filters

  tableState.filteredData = tableState.data.filter((item) => {
    // Búsqueda
    if (search) {
      const searchMatch = item.number.toLowerCase().includes(search) || item.animal.toLowerCase().includes(search)
      if (!searchMatch) return false
    }

    // Fecha
    if (date && item.date !== date) return false

    // Animal
    if (animal && item.animal !== animal) return false

    // Hora
    if (time) {
      // Parsear la hora del item (ej: "09:00 AM" -> 9, "01:00 PM" -> 13)
      const timeParts = item.time.match(/(\d+):(\d+)\s?(AM|PM)/i)
      if (!timeParts) return false

      let hours = Number.parseInt(timeParts[1])
      const period = timeParts[3].toUpperCase()

      if (period === "PM" && hours !== 12) hours += 12
      if (period === "AM" && hours === 12) hours = 0

      // Parsear el filtro (ej: "09:00" -> 9, "13:00" -> 13)
      const filterParts = time.split(":")
      const filterHours = Number.parseInt(filterParts[0])

      if (hours !== filterHours) return false
    }

    return true
  })

  tableState.currentPage = 1
  renderTable()
}

// ==========================================
// TABLA DE RESULTADOS
// ==========================================
function initResultsTable() {
  const headers = document.querySelectorAll(".results-table th.sortable")

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const column = header.dataset.sort

      if (tableState.sortColumn === column) {
        tableState.sortDirection = tableState.sortDirection === "asc" ? "desc" : "asc"
      } else {
        tableState.sortColumn = column
        tableState.sortDirection = "asc"
      }

      sortData()
      renderTable()

      // Actualizar indicadores visuales
      headers.forEach((h) => h.classList.remove("sorted"))
      header.classList.add("sorted")
    })
  })

  renderTable()
}

function sortData() {
  const { sortColumn, sortDirection } = tableState

  tableState.filteredData.sort((a, b) => {
    let valA, valB

    switch (sortColumn) {
      case "id":
        valA = a.id
        valB = b.id
        break
      case "date":
        valA = new Date(a.date)
        valB = new Date(b.date)
        break
      case "time":
        valA = a.time
        valB = b.time
        break
      case "number":
        valA = a.number === "00" ? -1 : Number.parseInt(a.number)
        valB = b.number === "00" ? -1 : Number.parseInt(b.number)
        break
      case "animal":
        valA = a.animal
        valB = b.animal
        break
      default:
        return 0
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1
    if (valA > valB) return sortDirection === "asc" ? 1 : -1
    return 0
  })
}

function renderTable() {
  const tbody = document.getElementById("resultsBody")
  const pagination = document.getElementById("pagination")
  const summary = document.getElementById("resultsSummary")

  if (!tbody) return

  const { filteredData, currentPage, itemsPerPage } = tableState
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pageData = filteredData.slice(startIndex, endIndex)

  // Renderizar filas
  tbody.innerHTML = ""

  if (pageData.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
                    No se encontraron resultados
                </td>
            </tr>
        `
  } else {
    pageData.forEach((item, index) => {
      const tr = document.createElement("tr")

      // Alternar colores: Verde (par) y Amarillo (impar)
      if (index % 2 === 0) {
        tr.classList.add("row-green")
      } else {
        tr.classList.add("row-yellow")
      }

      if (item.isComodin) tr.classList.add("comodin-row")

      // Usar imagen si está disponible
      const imageHtml = item.image
        ? `<img src="${item.image}" alt="${item.animal}" class="animal-img">`
        : `<span class="animal-emoji">${item.emoji}</span>`

      tr.innerHTML = `
                <td class="animal-cell" style="cursor: pointer;">
                    <div class="animal-badge ${item.isComodin ? "badge-purple" : index % 2 === 0 ? "badge-green" : "badge-yellow"}">
                        ${imageHtml}
                        ${item.animal}
                    </div>
                </td>
                <td class="number-cell">${item.number}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.time}</td>
                <td class="id-cell">#${item.id}</td>
                <td class="prize-cell">${item.isComodin ? "1x100" : "1x40"}</td>
            `

      // Evento click en la celda del animal para abrir modal
      const animalCell = tr.querySelector(".animal-cell")
      const theme = item.isComodin ? "theme-purple" : (index % 2 === 0 ? "theme-green" : "theme-yellow")
      animalCell.addEventListener("click", () => openModal(item, theme))

      tbody.appendChild(tr)
    })
  }

  // Renderizar paginación
  if (pagination) {
    pagination.innerHTML = ""

    // Botón anterior
    const prevBtn = document.createElement("button")
    prevBtn.className = "page-btn"
    prevBtn.textContent = "←"
    prevBtn.disabled = currentPage === 1
    prevBtn.addEventListener("click", () => {
      tableState.currentPage--
      renderTable()
    })
    pagination.appendChild(prevBtn)

    // Números de página
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement("button")
      pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`
      pageBtn.textContent = i
      pageBtn.addEventListener("click", () => {
        tableState.currentPage = i
        renderTable()
      })
      pagination.appendChild(pageBtn)
    }

    // Botón siguiente
    const nextBtn = document.createElement("button")
    nextBtn.className = "page-btn"
    nextBtn.textContent = "→"
    nextBtn.disabled = currentPage === totalPages
    nextBtn.addEventListener("click", () => {
      tableState.currentPage++
      renderTable()
    })
    pagination.appendChild(nextBtn)
  }

  // Actualizar resumen
  if (summary) {
    const start = startIndex + 1
    const end = Math.min(endIndex, filteredData.length)
    summary.textContent = `Mostrando ${start}-${end} de ${filteredData.length} resultados`
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const options = { day: "2-digit", month: "short", year: "numeric" }
  return date.toLocaleDateString("es-VE", options)
}

// ==========================================
// MODAL DE DETALLES
// ==========================================
function initModal() {
  const modal = document.getElementById("resultModal")
  const closeBtn = document.getElementById("closeModal")

  if (!modal || !closeBtn) return

  closeBtn.addEventListener("click", closeModal)

  // Cerrar al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal()
  })

  // Cerrar con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal()
    }
  })
}

function openModal(item, theme = "theme-green") {
  const modal = document.getElementById("resultModal")
  const modalContent = modal.querySelector(".modal-content")
  const modalBody = document.getElementById("modalBody")

  if (!modal || !modalBody) return

  // Resetear temas
  modalContent.classList.remove("theme-green", "theme-yellow", "theme-purple")
  modalContent.classList.add(theme)

  // Usar imagen si está disponible
  const imageHtml = item.image
    ? `<img src="${item.image}" alt="${item.animal}" style="display: block; margin: 0 auto; width: 200px; height: 200px; object-fit: contain;">`
    : `<div style="font-size: 8rem; margin: 20px 0;">${item.emoji}</div>`

  modalBody.innerHTML = `
        <span class="modal-draw-id">Sorteo #${item.id}</span>
        
        <div class="modal-detail-row">
            <span class="modal-label">Fecha y Hora</span>
            <span class="modal-value">${formatDate(item.date)} - ${item.time}</span>
        </div>

        <div style="margin: 20px 0;">
            ${imageHtml}
        </div>
        
        <h2 class="modal-animal-name">${item.number} - ${item.animal}</h2>
        
        ${item.isComodin ? '<div style="color: var(--color-accent); font-weight: bold; margin-top: 10px; font-size: 1.5rem;">¡COMODÍN!</div>' : ""}
    `

  modal.classList.add("active")
  document.body.style.overflow = "hidden" // Prevenir scroll
}

function closeModal() {
  const modal = document.getElementById("resultModal")
  if (!modal) return

  modal.classList.remove("active")
  document.body.style.overflow = "" // Restaurar scroll
}
