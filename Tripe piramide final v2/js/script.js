/**
 * TRIPLE PIRÁMIDE DE ORO - JAVASCRIPT PRINCIPAL
 * Este archivo gestiona toda la interactividad del frontend, desde la navegación
 * hasta la lógica del juego y la integración con el backend.
 * 
 * Versión: 1.1.0 (Optimizado)
 * Autor: MiniMax Agent
 * Fecha: Diciembre 2025
 */

// ===== CONFIGURACIÓN GLOBAL DE LA APLICACIÓN =====
const CONFIG = {
    // Datos de contacto para ventas vía WhatsApp
    WHATSAPP_NUMBER: '584126500144', // Reemplazar con el número real de atención al cliente
    WHATSAPP_MESSAGE_TEMPLATE: `¡Hola! Me interesa comprar un ticket de Triple Pirámide de Oro.
    
Datos del cliente:
- Nombre: {nombre}
- Teléfono: {telefono}
- Tipo de jugada: {tipoJugada}
- Números: {numeros}
- Monto: Bs. {monto}

¡Espero su respuesta!`,

    // Horarios oficiales de los sorteos (Zona horaria Venezuela)
    SORTEO_SCHEDULE: [
        { time: '11:45', label: 'Matutino' },
        { time: '15:45', label: 'Vespertino' },
        { time: '18:45', label: 'Nocturno' }
    ],

    // Parámetros de interfaz y rendimiento
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,

    // Endpoints de comunicación con el backend (Rails)
    API_ENDPOINTS: {
        results: '/api/results',
        stats: '/api/stats',
        winners: '/api/winners',
        tickets: '/api/tickets'
    }
};

// ===== UTILIDADES PREMIUM =====
const Utils = {
    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para eventos de scroll
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Formatear fecha en español
    formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    },

    // Formatear hora
    formatTime(hour, minute) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    },

    // Formatear número con separadores
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    },

    // Validar email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar teléfono venezolano
    isValidPhone(phone) {
        const re = /^\+?58[0-9]{10}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Local storage con error handling
    storage: {
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.warn('Error reading from localStorage:', error);
                return null;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.warn('Error writing to localStorage:', error);
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn('Error removing from localStorage:', error);
            }
        }
    },

    // Detectar dispositivo móvil
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Scroll suave a elemento
    scrollToElement(elementId, offset = 100) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Mostrar/ocultar elementos con animación
    toggleVisibility(element, show = true) {
        if (show) {
            element.style.display = 'block';
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 10);
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
        }
    },

    // Crear notificaciones toast
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Estilos dinámicos para el toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            max-width: 400px;
        `;

        document.body.appendChild(toast);

        // Animación de entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remove después del tiempo especificado
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, duration);

        return toast;
    }
};

// ===== GESTOR DE NAVEGACIÓN =====
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.ticking = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Scroll del navbar
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));

        // Menú móvil
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Cerrar menú móvil al hacer click en un enlace
        if (this.navMenu) {
            this.navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }

        // Cerrar menú móvil al redimensionar ventana solo si es escritorio real
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) { // Increased threshold to avoid mobile address bar triggers
                this.closeMobileMenu();
            }
        });
    }

    handleScroll() {
        if (this.ticking) return;

        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            this.ticking = false;
        });

        this.ticking = true;
    }

    toggleMobileMenu() {
        const isActive = this.mobileMenuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');

        // Prevenir scroll del body cuando el menú está abierto
        if (isActive) {
            document.body.style.overflow = 'hidden';
            // Fix for iOS safari bottom bar growing/shrinking
            if (Utils.isMobile()) {
                document.documentElement.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.mobileMenuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
}

// ===== GESTOR DE COUNTDOWN =====
class CountdownManager {
    constructor() {
        this.timer = document.getElementById('countdown-timer');
        this.remainingTime = { hours: 0, minutes: 0, seconds: 0 };
        this.intervalId = null;
        this.init();
    }

    init() {
        if (this.timer) {
            this.startCountdown();
        }
    }

    getNextDrawTime() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const todayDraws = [
            { time: 11 * 60 + 45, label: '11:45' },
            { time: 15 * 60 + 45, label: '15:45' },
            { time: 18 * 60 + 45, label: '18:45' }
        ];

        // Buscar el próximo sorteo
        for (const draw of todayDraws) {
            if (currentTime < draw.time) {
                return this.calculateRemainingTime(draw.time);
            }
        }

        // Si no hay más sorteos hoy, usar el primero de mañana
        return this.calculateRemainingTime(todayDraws[0].time + 24 * 60);
    }

    calculateRemainingTime(targetTime) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        let timeDiff = targetTime - currentTime;

        if (timeDiff < 0) {
            timeDiff += 24 * 60; // Agregar 24 horas
        }

        const hours = Math.floor(timeDiff / 60);
        const minutes = timeDiff % 60;
        const seconds = 59; // Empezar desde 59 para el efecto

        return { hours, minutes, seconds };
    }

    startCountdown() {
        this.updateDisplay();

        this.intervalId = setInterval(() => {
            this.remainingTime.seconds--;

            if (this.remainingTime.seconds < 0) {
                this.remainingTime.seconds = 59;
                this.remainingTime.minutes--;

                if (this.remainingTime.minutes < 0) {
                    this.remainingTime.minutes = 59;
                    this.remainingTime.hours--;

                    if (this.remainingTime.hours < 0) {
                        // Nuevo sorteo, recalcular
                        this.remainingTime = this.getNextDrawTime();
                    }
                }
            }

            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (hoursEl) hoursEl.textContent = this.remainingTime.hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = this.remainingTime.minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = this.remainingTime.seconds.toString().padStart(2, '0');

        // Animación en los segundos
        if (secondsEl) {
            secondsEl.style.transform = 'scale(1.1)';
            setTimeout(() => {
                secondsEl.style.transform = 'scale(1)';
            }, 100);
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// ===== GESTOR DE MODAL DE COMPRA =====
class ModalManager {
    constructor() {
        // Redundancia eliminada (línea duplicada removida)
        this.modal = document.getElementById('ticket-modal');
        this.openBtns = document.querySelectorAll('#comprar-ticket-btn, .nav-cta');
        this.closeBtn = document.getElementById('modal-close');
        this.form = document.getElementById('ticket-form');
        this.init();
    }

    init() {
        if (this.modal) {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Abrir modal
        if (this.openBtns) {
            this.openBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                });
            });
        }

        // Cerrar modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Cerrar al hacer click fuera
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Enviar formulario
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animación de entrada
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';

        // Limpiar formulario
        if (this.form) {
            this.form.reset();
        }
    }

    handleFormSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validar datos
        if (!this.validateForm(data)) {
            return;
        }

        // Mostrar loading
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Simular envío (en producción, aquí se enviaría al servidor)
        setTimeout(() => {
            this.sendToWhatsApp(data);
            this.closeModal();

            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            Utils.showToast('¡Redirigiendo a WhatsApp...', 'success');
        }, 1500);
    }

    validateForm(data) {
        if (!data.nombre || data.nombre.trim().length < 2) {
            Utils.showToast('Por favor, ingresa tu nombre completo', 'error');
            return false;
        }

        if (!data.telefono || !Utils.isValidPhone(data.telefono)) {
            Utils.showToast('Por favor, ingresa un teléfono válido', 'error');
            return false;
        }

        if (!data['tipo-jugada']) {
            Utils.showToast('Por favor, selecciona el tipo de jugada', 'error');
            return false;
        }

        if (!data.monto || parseFloat(data.monto) < 1) {
            Utils.showToast('El monto mínimo es Bs. 1', 'error');
            return false;
        }

        return true;
    }

    sendToWhatsApp(data) {
        const message = CONFIG.WHATSAPP_MESSAGE_TEMPLATE
            .replace('{nombre}', data.nombre)
            .replace('{telefono}', data.telefono)
            .replace('{tipoJugada}', this.getJugadaLabel(data['tipo-jugada']))
            .replace('{numeros}', data.numeros || 'Sin especificar')
            .replace('{monto}', data.monto);

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
    }

    getJugadaLabel(value) {
        const labels = {
            'triple': 'Triple Pirámide de Oro (x600)',
            'terminal': 'Terminal Pirámide de Oro (x60)',
            'zodiacal': 'Zodiacal Pirámide de Oro (x6000)'
        };
        return labels[value] || value;
    }
}

// ===== GESTOR DE CARRUSEL =====
class CarouselManager {
    constructor() {
        this.carousel = document.getElementById('promo-carousel');
        this.prevBtn = document.getElementById('prev-promo');
        this.nextBtn = document.getElementById('next-promo');
        this.slides = [];
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        if (this.carousel) {
            this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
            this.bindEvents();
            this.startAutoPlay();
        }
    }

    bindEvents() {
        // Navegación manual
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.stopAutoPlay();
                this.startAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.stopAutoPlay();
                this.startAutoPlay();
            });
        }

        // Pausar auto-play al hover
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (this.carousel.getBoundingClientRect().top < window.innerHeight) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
    }

    updateCarousel() {
        if (this.slides.length === 0) return;

        const translateX = -this.currentSlide * 100;
        this.carousel.style.transform = `translateX(${translateX}%)`;

        // Actualizar indicadores activos
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Actualizar botones de navegación
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.slides.length - 1;
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateCarousel();
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ===== GESTOR DE FAQ =====
class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    this.toggleFAQItem(item);
                });
            }
        });
    }

    toggleFAQItem(item) {
        const isActive = item.classList.contains('active');

        // Cerrar todos los otros items
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle del item actual
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }
}

// ===== GESTOR DE COOKIES =====
class CookieManager {
    constructor() {
        this.cookieBanner = document.getElementById('cookie-banner');
        this.acceptBtn = document.getElementById('accept-cookies');
        this.init();
    }

    init() {
        this.checkCookieConsent();
        this.bindEvents();
    }

    bindEvents() {
        if (this.acceptBtn) {
            this.acceptBtn.addEventListener('click', () => {
                this.acceptCookies();
            });
        }
    }

    checkCookieConsent() {
        const consent = Utils.storage.get('cookieConsent');
        if (!consent) {
            setTimeout(() => {
                this.showCookieBanner();
            }, 2000);
        }
    }

    showCookieBanner() {
        if (this.cookieBanner) {
            this.cookieBanner.classList.add('show');
        }
    }

    hideCookieBanner() {
        if (this.cookieBanner) {
            this.cookieBanner.classList.remove('show');
        }
    }

    acceptCookies() {
        Utils.storage.set('cookieConsent', {
            accepted: true,
            date: new Date().toISOString()
        });
        this.hideCookieBanner();
        Utils.showToast('¡Gracias por aceptar las cookies!', 'success', 3000);
    }
}

// ===== GESTOR DE RESULTADOS =====
class ResultsManager {
    constructor() {
        this.init();
    }

    init() {
        if (document.getElementById('today-results-body')) {
            this.loadTodayResults();
        }
    }

    async loadTodayResults() {
        try {
            const tbody = document.getElementById('today-results-body');
            if (!tbody) return;

            // Obtener resultados de la API (que usará el mock data en modo demo)
            const results = await API.getTodayResults();

            tbody.innerHTML = '';

            if (results && results.length > 0) {
                results.forEach((result, index) => {
                    setTimeout(() => {
                        const row = this.createResultRow(result);
                        tbody.appendChild(row);
                    }, index * 200);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="no-results">No hay resultados disponibles por ahora.</td></tr>';
            }
        } catch (error) {
            console.error('Error cargando resultados:', error);
            const tbody = document.getElementById('today-results-body');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="6" class="error-message">Error al cargar los resultados.</td></tr>';
            }
        }
    }

    createResultRow(result) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="time-badge">${result.horario}</span></td>
            <td><span class="number-badge triple">${result.triple_a}</span></td>
            <td><span class="number-badge terminal">${result.terminal_a}</span></td>
            <td><span class="number-badge triple">${result.triple_b}</span></td>
            <td><span class="number-badge terminal">${result.terminal_b}</span></td>
            <td><span class="zodiac-badge">${result.zodiacal}</span></td>
        `;
        return row;
    }
}

// ===== GESTOR DE ANIMACIONES =====
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addScrollAnimations();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos que necesitan animación
        document.querySelectorAll('.prize-card, .step, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    addScrollAnimations() {
        // Parallax para partículas del hero
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-particles');

            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        }, 16));
    }
}

// ===== GESTOR DE PERFORMANCE =====
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeAnimations() {
        // Reducir animaciones en dispositivos de bajo rendimiento
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-motion');
        }
    }
}

// ===== GESTOR PRINCIPAL =====
// ===== GESTOR DE ZODIACO =====
class ZodiacManager {
    constructor() {
        this.featuredContainer = document.getElementById('zodiac-featured');
        this.galleryContainer = document.getElementById('zodiac-gallery');
        this.signs = [
            { name: 'Aries', date: '21 Mar - 19 Abr', img: 'images/zodiaco/aries.jpg', emotion: 'Dinero' },
            { name: 'Tauro', date: '20 Abr - 20 May', img: 'images/zodiaco/tauro.jpg', emotion: 'Dinero' },
            { name: 'Géminis', date: '21 May - 20 Jun', img: 'images/zodiaco/geminis.jpg', emotion: 'Dinero' },
            { name: 'Cáncer', date: '21 Jun - 22 Jul', img: 'images/zodiaco/cancer.jpg', emotion: 'Dinero' },
            { name: 'Leo', date: '23 Jul - 22 Ago', img: 'images/zodiaco/leo.jpg', emotion: 'Dinero' },
            { name: 'Virgo', date: '23 Ago - 22 Sep', img: 'images/zodiaco/virgo.jpg', emotion: 'Riqueza' },
            { name: 'Libra', date: '23 Sep - 22 Oct', img: 'images/zodiaco/libra.jpg', emotion: 'Armonía' },
            { name: 'Escorpio', date: '23 Oct - 21 Nov', img: 'images/zodiaco/escorpio.jpg', emotion: 'Poder' },
            { name: 'Sagitario', date: '22 Nov - 21 Dic', img: 'images/zodiaco/sagitario.jpg', emotion: 'Suerte' },
            { name: 'Capricornio', date: '22 Dic - 19 Ene', img: 'images/zodiaco/capricornio.jpg', emotion: 'Dinero' },
            { name: 'Acuario', date: '20 Ene - 18 Feb', img: 'images/zodiaco/acuario.jpg', emotion: 'Innovación' },
            { name: 'Piscis', date: '19 Feb - 20 Mar', img: 'images/zodiaco/picis.jpg', emotion: 'Sueños' }
        ];

        if (this.featuredContainer && this.galleryContainer) {
            this.init();
        }
    }

    init() {
        const currentSign = this.getCurrentSign();
        this.renderFeatured(currentSign);
        this.renderGallery(currentSign);
        this.bindHeroIcons();
    }

    bindHeroIcons() {
        // Conectar iconos del Hero con el ZodiacManager
        document.querySelectorAll('.zodiac-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const signName = icon.dataset.sign;
                if (signName && window.API && window.API.updateFeaturedSign) {
                    // Normalizar nombre (primera letra mayúscula para coincidir con la galería)
                    const normalizedSign = signName.charAt(0).toUpperCase() + signName.slice(1);
                    window.API.updateFeaturedSign(normalizedSign);

                    // Scroll suave hasta la sección de zodíaco
                    Utils.scrollToElement('zodiaco');
                }
            });
        });
    }

    /**
     * Determina de forma determinista el signo del zodíaco para el sorteo actual.
     * Esto asegura que todos los usuarios vean el mismo signo para el mismo periodo de sorteo.
     */
    getCurrentSign() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Horarios oficiales de sorteos
        const draws = [
            11 * 60 + 45, // 11:45 AM
            15 * 60 + 45, // 03:45 PM
            18 * 60 + 45  // 06:45 PM
        ];

        // Determinar en qué etapa del día nos encontramos para el signo destacado
        let drawIndex = 0;
        if (currentTime >= draws[0] && currentTime < draws[1]) {
            drawIndex = 1;
        } else if (currentTime >= draws[1] && currentTime < draws[2]) {
            drawIndex = 2;
        } else if (currentTime >= draws[2]) {
            drawIndex = 3;
        }

        // Generar una semilla basada en la fecha y el índice del sorteo
        const dateStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        const seedStr = `${dateStr}-draw-${drawIndex}`;

        // Algoritmo de hash simple (Java String hashCode style)
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
            hash |= 0; // Convertir a entero de 32 bits
        }

        const signIndex = Math.abs(hash) % this.signs.length;
        return this.signs[signIndex];
    }

    generateLuckyNumbers() {
        // Generar 3 números de un solo dígito (0-9)
        const nums = [];
        for (let i = 0; i < 3; i++) {
            nums.push(Math.floor(Math.random() * 10).toString());
        }
        return nums;
    }

    renderFeatured(sign) {
        const luckyNumbers = this.generateLuckyNumbers();

        this.featuredContainer.innerHTML = `
            <div class="mystical-zodiac-container">
                <!-- Aura de fondo -->
                <div class="mystical-aura"></div>
                
                <!-- Imagen Flotante -->
                <div class="mystical-image-wrapper">
                    <img src="${sign.img}" 
                          alt="${sign.name}" 
                          class="mystical-image"
                          loading="lazy">
                </div>

                <!-- Info Mística -->
                <div class="mystical-info">
                    <h2 class="mystical-title">${sign.name}</h2>
                    <p class="mystical-emotion">${sign.emotion || ''}</p>
                    <div class="mystical-numbers-container">
                        ${luckyNumbers.map(num => `
                            <div class="mystical-orb">
                                <span class="orb-number">${num}</span>
                                <div class="orb-glow"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderGallery(currentSign) {
        this.galleryContainer.innerHTML = this.signs.map(sign => `
            <div class="zodiac-thumb ${sign.name === currentSign.name ? 'active' : ''}" 
                 onclick="API.updateFeaturedSign('${sign.name}')"
                 title="${sign.name}">
                <img src="${sign.img}" 
                     alt="${sign.name}"
                     loading="lazy">
            </div>
        `).join('');

        // Expose method to global scope for onclick
        window.API = window.API || {};
        window.API.updateFeaturedSign = (signName) => {
            const sign = this.signs.find(s => s.name === signName);
            if (sign) {
                this.renderFeatured(sign);
                // Update active class
                document.querySelectorAll('.zodiac-thumb').forEach(el => el.classList.remove('active'));
                const activeThumb = Array.from(document.querySelectorAll('.zodiac-thumb')).find(el => el.title === signName);
                if (activeThumb) activeThumb.classList.add('active');
            }
        };
    }
}

class TriplePiramideApp {
    constructor() {
        this.navigation = null;
        this.countdown = null;
        this.modal = null;
        this.carousel = null;
        this.faq = null;
        this.cookies = null;
        this.results = null;
        this.animations = null;
        this.performance = null;

        this.init();
    }

    async init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Inicializar componentes en orden de importancia
            this.navigation = new NavigationManager();
            this.countdown = new CountdownManager();
            this.modal = new ModalManager();
            this.carousel = new CarouselManager();
            this.faq = new FAQManager();
            this.cookies = new CookieManager();
            this.results = new ResultsManager();
            this.zodiac = new ZodiacManager();
            this.animations = new AnimationManager();
            this.performance = new PerformanceManager();

            // Configurar eventos globales
            this.setupGlobalEvents();

            console.log('✅ Triple Pirámide de Oro - Aplicación inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
        }
    }


    setupGlobalEvents() {
        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    Utils.scrollToElement(target.getAttribute('id'));
                }
            });
        });

        // Prevenir que el menú se cierre accidentalmente en móviles
        document.addEventListener('touchstart', (e) => {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !document.getElementById('mobile-menu-toggle').contains(e.target)) {
                    this.navigation.closeMobileMenu();
                }
            }
        });

        // Manejar cambios de orientación en móviles
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 500);
        });
    }

    // Método público para acceder a funcionalidades específicas
    getComponent(name) {
        return this[name];
    }
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
const app = new TriplePiramideApp();

// ===== EVENTOS GLOBALES =====
// Manejar errores JavaScript no capturados
window.addEventListener('error', (e) => {
    console.error('Error no capturado:', e.error);
    // En producción, aquí se enviaría el error a un servicio de monitoreo
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada no manejada:', e.reason);
    // En producción, aquí se enviaría el error a un servicio de monitoreo
});

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TriplePiramideApp,
        Utils,
        CONFIG
    };
}