/**
 * API DE INTEGRACIÓN - TRIPLE PIRÁMIDE DE ORO
 * Este módulo actúa como la capa de comunicación entre el frontend y el backend (Rails).
 * Proporciona métodos simplificados para operaciones CRUD y autenticación.
 * 
 * Versión: 1.1.0 (Optimizado)
 * Autor: MiniMax Agent
 * Fecha: Diciembre 2025
 */

// ===== CONFIGURACIÓN BASE DE LA API =====
const API_CONFIG = {
    /** 
     * URL base del servidor Rails. 
     * @important Cambiar esta URL cuando se despliegue a producción.
     */
    BASE_URL: window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://api.triplepiramidedeoro.com/api',

    // Cabeceras estándar para comunicación JSON
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },

    // Tiempo máximo de espera para peticiones (10 segundos)
    TIMEOUT: 10000,

    // Configuración de reintentos automáticos en caso de fallo de red
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,

    /**
     * MODO DEMO: Si es true, se interceptan las llamadas y se devuelve data mock.
     * Útil para desarrollo de frontend sin depender siempre del backend listo.
     */
    DEMO_MODE: true
};

// ===== CLASE PRINCIPAL DE LA API =====
class TriplePiramideAPI {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    }

    // ===== MÉTODOS UTILITARIOS PRIVADOS =====

    /**
     * Realizar una petición HTTP con manejo de errores y reintentos
     * @param {string} endpoint - Endpoint de la API
     * @param {object} options - Opciones de la petición
     * @param {number} retryCount - Número de reintentos actuales
     */
    async request(endpoint, options = {}, retryCount = 0) {
        // MODO DEMO: Interceptar peticiones y devolver datos de prueba
        if (API_CONFIG.DEMO_MODE) {
            console.log(`🧪 DEMO MODE: Intercepting ${endpoint}`);
            await this.delay(500); // Simular latencia de red
            return this.getMockData(endpoint, options);
        }

        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: { ...this.defaultHeaders },
            ...options
        };

        // Agregar token de autenticación si existe
        const authToken = this.getAuthToken();
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        try {
            console.log(`🔄 API Request: ${config.method} ${url}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new APIError(`HTTP ${response.status}: ${response.statusText}`, response.status);
            }

            const data = await response.json();
            console.log(`✅ API Response: ${url}`, data);
            return data;

        } catch (error) {
            console.error(`❌ API Error: ${url}`, error);

            // Manejo de reintentos
            if (retryCount < API_CONFIG.MAX_RETRIES && this.shouldRetry(error)) {
                console.log(`🔄 Retrying request (${retryCount + 1}/${API_CONFIG.MAX_RETRIES})...`);
                await this.delay(API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount));
                return this.request(endpoint, options, retryCount + 1);
            }

            throw error;
        }
    }

    /**
     * Generar datos de prueba para el modo demo
     */
    getMockData(endpoint, options) {
        // Normalizar endpoint para matching
        const path = endpoint.split('?')[0];

        // 1. Resultados de hoy
        if (path === '/results/today') {
            const today = new Date();
            return [
                {
                    id: '1',
                    fecha: today.toISOString(),
                    horario: '11:45 AM',
                    triple_a: '452',
                    terminal_a: '52',
                    triple_b: '891',
                    terminal_b: '91',
                    zodiacal: 'Aries'
                },
                {
                    id: '2',
                    fecha: today.toISOString(),
                    horario: '03:45 PM',
                    triple_a: '730',
                    terminal_a: '30',
                    triple_b: '124',
                    terminal_b: '24',
                    zodiacal: 'Leo'
                },
                {
                    id: '3',
                    fecha: today.toISOString(),
                    horario: '06:45 PM',
                    triple_a: '---',
                    terminal_a: '--',
                    triple_b: '---',
                    terminal_b: '--',
                    zodiacal: '---'
                }
            ];
        }

        // 2. Historial de resultados (DATA ESTÁTICA PARA DEMO)
        if (path === '/results') {
            // Datos estáticos de muestra (Dama de muestra)
            const STATIC_DATA = [
                { id: '101', fecha: '2023-10-25', horario: '06:45 PM', triple_a: '782', terminal_a: '82', triple_b: '451', terminal_b: '51', zodiacal: 'Escorpio' },
                { id: '102', fecha: '2023-10-25', horario: '03:45 PM', triple_a: '123', terminal_a: '23', triple_b: '987', terminal_b: '87', zodiacal: 'Leo' },
                { id: '103', fecha: '2023-10-25', horario: '11:45 AM', triple_a: '555', terminal_a: '55', triple_b: '001', terminal_b: '01', zodiacal: 'Tauro' },
                { id: '104', fecha: '2023-10-24', horario: '06:45 PM', triple_a: '990', terminal_a: '90', triple_b: '112', terminal_b: '12', zodiacal: 'Acuario' },
                { id: '105', fecha: '2023-10-24', horario: '03:45 PM', triple_a: '345', terminal_a: '45', triple_b: '678', terminal_b: '78', zodiacal: 'Géminis' },
                { id: '106', fecha: '2023-10-24', horario: '11:45 AM', triple_a: '888', terminal_a: '88', triple_b: '222', terminal_b: '22', zodiacal: 'Virgo' },
                { id: '107', fecha: '2023-10-23', horario: '06:45 PM', triple_a: '777', terminal_a: '77', triple_b: '333', terminal_b: '33', zodiacal: 'Libra' },
                { id: '108', fecha: '2023-10-23', horario: '03:45 PM', triple_a: '456', terminal_a: '56', triple_b: '123', terminal_b: '23', zodiacal: 'Sagitario' },
                { id: '109', fecha: '2023-10-23', horario: '11:45 AM', triple_a: '000', terminal_a: '00', triple_b: '999', terminal_b: '99', zodiacal: 'Capricornio' },
                { id: '110', fecha: '2023-10-22', horario: '06:45 PM', triple_a: '111', terminal_a: '11', triple_b: '222', terminal_b: '22', zodiacal: 'Piscis' },
                { id: '111', fecha: '2023-10-22', horario: '03:45 PM', triple_a: '567', terminal_a: '67', triple_b: '890', terminal_b: '90', zodiacal: 'Aries' },
                { id: '112', fecha: '2023-10-22', horario: '11:45 AM', triple_a: '432', terminal_a: '32', triple_b: '765', terminal_b: '65', zodiacal: 'Cáncer' }
            ];

            let results = [...STATIC_DATA];

            // Implementar filtros funcionales en modo demo
            // CORRECCIÓN: Los filtros vienen en el string 'endpoint' (ej: /results?search=78), no en options
            const queryString = endpoint.split('?')[1] || '';
            const queryParams = new URLSearchParams(queryString);

            const filterFecha = queryParams.get('fecha');
            const filterSorteo = queryParams.get('sorteo');
            const filterSearch = queryParams.get('search');

            if (filterFecha) {
                results = results.filter(r => r.fecha.startsWith(filterFecha));
            }

            if (filterSorteo) {
                // Sorteo viene como '11:45', '15:45', etc. Data tiene '11:45 AM', etc.
                // Normalizamos simple
                results = results.filter(r => r.horario.includes(filterSorteo));
            }

            if (filterSearch) {
                const q = filterSearch.toLowerCase();
                results = results.filter(r =>
                    r.triple_a.includes(q) ||
                    r.terminal_a.includes(q) ||
                    r.triple_b.includes(q) ||
                    r.terminal_b.includes(q) ||
                    r.zodiacal.toLowerCase().includes(q)
                );
            }

            // Simular paginación (simple)
            const page = parseInt(queryParams.get('page') || '1');
            const limit = parseInt(queryParams.get('limit') || '20');
            const total = results.length;

            // Slice para paginación
            const start = (page - 1) * limit;
            const paginatedResults = results.slice(start, start + limit);

            // Estructura de respuesta
            paginatedResults.pagination = {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            };
            paginatedResults.total = total;

            return paginatedResults;
        }

        // 3. Estadísticas rápidas
        if (path === '/stats/quick') {
            return {
                todayDraws: 2,
                totalDraws: 1458,
                mostFrequent: '7',
                luckySign: 'Leo'
            };
        }

        // 4. Ganadores recientes
        if (path === '/winners/recent') {
            return [
                { nombre: 'María P.', premio: 5000, tipo: 'Triple A', fecha: new Date().toISOString() },
                { nombre: 'Carlos R.', premio: 1200, tipo: 'Terminal', fecha: new Date().toISOString() },
                { nombre: 'Ana S.', premio: 60000, tipo: 'Zodiacal', fecha: new Date().toISOString() },
                { nombre: 'Pedro M.', premio: 5000, tipo: 'Triple B', fecha: new Date().toISOString() }
            ];
        }

        // 5. Próximo sorteo
        if (path === '/results/next') {
            return {
                nextDraw: '18:45',
                remaining: 3600
            };
        }

        console.warn(`⚠️ Mock data not found for: ${endpoint}`);
        return {};
    }

    /**
     * Determinar si una petición debe reintentarse
     * @param {Error} error - Error recibido
     * @returns {boolean}
     */
    shouldRetry(error) {
        if (error.name === 'AbortError') return false; // Timeout
        if (error instanceof APIError) {
            // Solo reintentar errores de servidor (5xx) o de conexión
            return error.status >= 500 || error.status === 0;
        }
        return false;
    }

    /**
     * Retraso para reintentos
     * @param {number} ms - Milisegundos de retraso
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Obtener token de autenticación del localStorage
     * @returns {string|null}
     */
    getAuthToken() {
        try {
            return localStorage.getItem('authToken');
        } catch (error) {
            console.warn('No se pudo obtener el token de autenticación:', error);
            return null;
        }
    }

    /**
     * Establecer token de autenticación
     * @param {string} token
     */
    setAuthToken(token) {
        try {
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.warn('No se pudo guardar el token de autenticación:', error);
        }
    }

    /**
     * Limpiar token de autenticación
     */
    clearAuthToken() {
        try {
            localStorage.removeItem('authToken');
        } catch (error) {
            console.warn('No se pudo limpiar el token de autenticación:', error);
        }
    }

    // ===== MÉTODOS PÚBLICOS DE LA API =====

    // ===== AUTENTICACIÓN =====

    /**
     * Autenticar usuario
     * @param {object} credentials - { email, password }
     * @returns {Promise<object>}
     */
    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.token) {
            this.setAuthToken(response.token);
        }

        return response;
    }

    /**
     * Registrar nuevo usuario
     * @param {object} userData - Datos del usuario
     * @returns {Promise<object>}
     */
    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Cerrar sesión
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.warn('Error en logout del servidor:', error);
        } finally {
            this.clearAuthToken();
        }
    }

    /**
     * Obtener perfil del usuario actual
     * @returns {Promise<object>}
     */
    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // ===== RESULTADOS Y SORTEO =====

    /**
     * Obtener resultados con filtros opcionales
     * @param {object} filters - Filtros opcionales { page, limit, fecha, sorteo, search }
     * @returns {Promise<object>}
     */
    async getResults(filters = {}) {
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                queryParams.append(key, value);
            }
        });

        const endpoint = `/results${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.request(endpoint);
    }

    /**
     * Obtener resultado específico por ID
     * @param {string|number} resultId
     * @returns {Promise<object>}
     */
    async getResultById(resultId) {
        return await this.request(`/results/${resultId}`);
    }

    /**
     * Obtener resultados de hoy
     * @returns {Promise<array>}
     */
    async getTodayResults() {
        return await this.request('/results/today');
    }

    /**
     * Obtener próximo sorteo
     * @returns {Promise<object>}
     */
    async getNextDraw() {
        return await this.request('/results/next');
    }

    /**
     * Buscar resultados por número
     * @param {string} number
     * @returns {Promise<array>}
     */
    async searchResults(number) {
        return await this.request(`/results/search?number=${encodeURIComponent(number)}`);
    }

    // ===== ESTADÍSTICAS =====

    /**
     * Obtener estadísticas rápidas
     * @returns {Promise<object>}
     */
    async getQuickStats() {
        return await this.request('/stats/quick');
    }

    /**
     * Obtener estadísticas detalladas
     * @param {string} period - 'day', 'week', 'month', 'year'
     * @returns {Promise<object>}
     */
    async getDetailedStats(period = 'month') {
        return await this.request(`/stats/detailed?period=${period}`);
    }

    /**
     * Obtener números más frecuentes
     * @param {number} limit - Límite de resultados
     * @returns {Promise<array>}
     */
    async getMostFrequentNumbers(limit = 10) {
        return await this.request(`/stats/frequent?limit=${limit}`);
    }

    /**
     * Obtener signos zodiacales más afortunados
     * @param {number} limit - Límite de resultados
     * @returns {Promise<array>}
     */
    async getLuckyZodiacSigns(limit = 12) {
        return await this.request(`/stats/lucky-signs?limit=${limit}`);
    }

    // ===== GANADORES =====

    /**
     * Obtener ganadores recientes (últimas 24h)
     * @param {number} limit - Límite de resultados
     * @returns {Promise<array>}
     */
    async getRecentWinners(limit = 10) {
        return await this.request(`/winners/recent?limit=${limit}`);
    }

    /**
     * Obtener historial de ganancias de un usuario
     * @param {string} userId - ID del usuario
     * @param {object} options - Opciones de paginación
     * @returns {Promise<object>}
     */
    async getUserWinnings(userId, options = {}) {
        const queryParams = new URLSearchParams(options);
        return await this.request(`/winners/user/${userId}?${queryParams.toString()}`);
    }

    /**
     * Obtener top ganadores del mes
     * @param {number} limit - Límite de resultados
     * @returns {Promise<array>}
     */
    async getTopWinners(limit = 20) {
        return await this.request(`/winners/top?limit=${limit}`);
    }

    // ===== TICKETS Y APUESTAS =====

    /**
     * Crear nueva apuesta/ticket
     * @param {object} ticketData - Datos del ticket
     * @returns {Promise<object>}
     */
    async createTicket(ticketData) {
        return await this.request('/tickets', {
            method: 'POST',
            body: JSON.stringify({ ticket: ticketData })
        });
    }

    /**
     * Obtener tickets de un usuario
     * @param {object} filters - Filtros opcionales
     * @returns {Promise<object>}
     */
    async getUserTickets(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/tickets/user?${queryParams.toString()}`);
    }

    /**
     * Verificar estado de un ticket
     * @param {string} ticketId - ID del ticket
     * @returns {Promise<object>}
     */
    async checkTicketStatus(ticketId) {
        return await this.request(`/tickets/${ticketId}/status`);
    }

    /**
     * Validar ticket ganador
     * @param {string} ticketId - ID del ticket
     * @returns {Promise<object>}
     */
    async validateWinner(ticketId) {
        return await this.request(`/tickets/${ticketId}/validate`, {
            method: 'POST'
        });
    }

    /**
     * Solicitar pago de premio
     * @param {string} ticketId - ID del ticket ganador
     * @param {object} paymentData - Datos de pago
     * @returns {Promise<object>}
     */
    async requestPayout(ticketId, paymentData) {
        return await this.request(`/tickets/${ticketId}/payout`, {
            method: 'POST',
            body: JSON.stringify({ payment: paymentData })
        });
    }

    // ===== CENTROS DE APUESTA =====

    /**
     * Obtener centros de apuestas
     * @param {object} filters - Filtros geográficos
     * @returns {Promise<array>}
     */
    async getBettingCenters(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.request(`/centers?${queryParams.toString()}`);
    }

    /**
     * Buscar centros cercanos
     * @param {number} latitude - Latitud
     * @param {number} longitude - Longitud
     * @param {number} radius - Radio en kilómetros
     * @returns {Promise<array>}
     */
    async findNearbyCenters(latitude, longitude, radius = 10) {
        return await this.request(`/centers/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    }

    // ===== NOTIFICACIONES =====

    /**
     * Suscribirse a notificaciones push
     * @param {string} endpoint - Endpoint de suscripción
     * @param {object} keys - Claves públicas
     * @returns {Promise<object>}
     */
    async subscribePush(endpoint, keys) {
        return await this.request('/notifications/subscribe', {
            method: 'POST',
            body: JSON.stringify({ endpoint, keys })
        });
    }

    /**
     * Cancelar suscripción a notificaciones
     * @param {string} endpoint - Endpoint de suscripción
     * @returns {Promise<void>}
     */
    async unsubscribePush(endpoint) {
        return await this.request('/notifications/unsubscribe', {
            method: 'POST',
            body: JSON.stringify({ endpoint })
        });
    }

    /**
     * Obtener notificaciones del usuario
     * @param {object} options - Opciones de paginación
     * @returns {Promise<object>}
     */
    async getNotifications(options = {}) {
        const queryParams = new URLSearchParams(options);
        return await this.request(`/notifications?${queryParams.toString()}`);
    }

    // ===== CONFIGURACIÓN =====

    /**
     * Obtener configuración del juego
     * @returns {Promise<object>}
     */
    async getGameConfig() {
        return await this.request('/config');
    }

    /**
     * Obtener horarios de sorteo
     * @returns {Promise<array>}
     */
    async getDrawSchedule() {
        return await this.request('/config/schedule');
    }

    /**
     * Obtener tipos de apuesta disponibles
     * @returns {Promise<array>}
     */
    async getBetTypes() {
        return await this.request('/config/bet-types');
    }

    // ===== SOPORTE Y FEEDBACK =====

    /**
     * Enviar mensaje de soporte
     * @param {object} supportData - Datos del mensaje
     * @returns {Promise<object>}
     */
    async sendSupportMessage(supportData) {
        return await this.request('/support', {
            method: 'POST',
            body: JSON.stringify({ message: supportData })
        });
    }

    /**
     * Reportar bug
     * @param {object} bugReport - Datos del reporte
     * @returns {Promise<object>}
     */
    async reportBug(bugReport) {
        return await this.request('/support/bug-report', {
            method: 'POST',
            body: JSON.stringify({ bug: bugReport })
        });
    }

    // ===== ANALYTICS =====

    /**
     * Enviar evento de analytics
     * @param {string} event - Nombre del evento
     * @param {object} data - Datos del evento
     * @returns {Promise<void>}
     */
    async trackEvent(event, data = {}) {
        try {
            await this.request('/analytics/track', {
                method: 'POST',
                body: JSON.stringify({
                    event,
                    data,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            });
        } catch (error) {
            console.warn('Error enviando analytics:', error);
            // Los errores de analytics no deben interrumpir la experiencia del usuario
        }
    }
}

// ===== CLASE DE ERROR PERSONALIZADA =====
class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'APIError';
        this.status = status;
    }
}

// ===== INSTANCIA GLOBAL DE LA API =====
const API = new TriplePiramideAPI();

// ===== MÉTODOS DE UTILIDAD PARA EL FRONTEND =====

/**
 * Función helper para verificar si el usuario está autenticado
 * @returns {boolean}
 */
API.isAuthenticated = function () {
    return !!this.getAuthToken();
};

/**
 * Función helper para obtener headers de autenticación
 * @returns {object}
 */
API.getAuthHeaders = function () {
    const token = this.getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Función helper para formatear errores de API
 * @param {Error} error
 * @returns {string}
 */
API.formatError = function (error) {
    if (error instanceof APIError) {
        switch (error.status) {
            case 401:
                return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            case 403:
                return 'No tienes permisos para realizar esta acción.';
            case 404:
                return 'Recurso no encontrado.';
            case 422:
                return 'Datos inválidos. Por favor, verifica la información.';
            case 500:
                return 'Error del servidor. Intenta nuevamente en unos minutos.';
            default:
                return error.message || 'Ocurrió un error inesperado.';
        }
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Error de conexión. Verifica tu conexión a internet.';
    }

    return error.message || 'Ocurrió un error inesperado.';
};

/**
 * Función helper para manejar errores de API
 * @param {Error} error
 * @param {Function} showToast - Función para mostrar notificaciones
 */
API.handleError = function (error, showToast) {
    const message = this.formatError(error);

    if (showToast) {
        showToast(message, 'error');
    } else {
        console.error('API Error:', error);
        alert(message); // Fallback básico
    }

    // Log para debugging
    console.group('🔴 API Error Details');
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('Stack:', error.stack);
    console.groupEnd();
};

// ===== EXPORTAR PARA USO GLOBAL =====
if (typeof window !== 'undefined') {
    window.API = API;
    window.APIError = APIError;
}

// ===== EJEMPLOS DE USO =====
// Los siguientes son ejemplos de cómo usar la API desde el frontend:

/*
// Ejemplo 1: Obtener resultados de hoy
API.getTodayResults()
    .then(results => {
        console.log('Resultados de hoy:', results);
        // Renderizar resultados en el DOM
    })
    .catch(error => {
        API.handleError(error, (msg, type) => {
            // Usar tu sistema de notificaciones
            console.log(`${type}: ${msg}`);
        });
    });

// Ejemplo 2: Crear un ticket
API.createTicket({
    tipo: 'triple',
    numeros: '123',
    monto: 1000,
    usuario_id: 1
})
    .then(ticket => {
        console.log('Ticket creado:', ticket);
        // Mostrar confirmación al usuario
    })
    .catch(error => {
        API.handleError(error, showToast);
    });

// Ejemplo 3: Obtener estadísticas
API.getQuickStats()
    .then(stats => {
        document.getElementById('today-draws').textContent = stats.todayDraws;
        document.getElementById('total-draws').textContent = stats.totalDraws;
        // etc.
    });
*/

// ===== NOTAS PARA EL PROGRAMADOR BACKEND =====

/*
INSTRUCCIONES PARA IMPLEMENTAR EN RAILS:

1. Crear controladores API en app/controllers/api/:
   - app/controllers/api/auth_controller.rb
   - app/controllers/api/results_controller.rb
   - app/controllers/api/stats_controller.rb
   - app/controllers/api/tickets_controller.rb
   - etc.

2. Configurar rutas en config/routes.rb:
   namespace :api do
     namespace :v1 do
       post 'auth/login', to: 'auth#login'
       get 'results', to: 'results#index'
       get 'results/today', to: 'results#today'
       # ... más rutas
     end
   end

3. Serializers en app/serializers/:
   - ResultSerializer
   - TicketSerializer
   - UserSerializer
   - etc.

4. Autenticación con JWT o similar
5. Validaciones apropiadas
6. Rate limiting si es necesario
7. Logs para debugging

EJEMPLO DE RESPUESTA:
{
  "success": true,
  "data": {
    "results": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_count": 100
    }
  }
}

EJEMPLO DE ERROR:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": {
      "numeros": ["No puede estar vacío"],
      "monto": ["Debe ser mayor a 0"]
    }
  }
}
*/