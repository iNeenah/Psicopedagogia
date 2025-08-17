// API Configuration and Helper Functions
class API {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('authToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Remove authentication token
    removeToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Get headers with authentication
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Authentication methods
    async login(email, password) {
        const response = await this.post('/auth/login', { email, password });
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async logout() {
        this.removeToken();
        return { success: true };
    }

    async getProfile() {
        return this.get('/auth/profile');
    }

    async changePassword(currentPassword, newPassword) {
        return this.post('/auth/change-password', { currentPassword, newPassword });
    }

    // Users methods
    async getUsers(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/usuarios?${params}`);
    }

    async getUserById(id) {
        return this.get(`/usuarios/${id}`);
    }

    async updateUser(id, data) {
        return this.put(`/usuarios/${id}`, data);
    }

    async deactivateUser(id) {
        return this.delete(`/usuarios/${id}`);
    }

    async searchUsers(query, rol = '') {
        const params = new URLSearchParams({ q: query });
        if (rol) params.append('rol', rol);
        return this.get(`/usuarios/search?${params}`);
    }

    // Professionals methods
    async getProfessionals(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/profesionales?${params}`);
    }

    async getProfessionalById(id) {
        return this.get(`/profesionales/${id}`);
    }

    async createProfessional(data) {
        return this.post('/profesionales', data);
    }

    async updateProfessional(id, data) {
        return this.put(`/profesionales/${id}`, data);
    }

    async deactivateProfessional(id) {
        return this.delete(`/profesionales/${id}`);
    }

    async getProfessionalStats(id) {
        return this.get(`/profesionales/${id}/estadisticas`);
    }

    async getProfessionalSchedule(id) {
        return this.get(`/profesionales/${id}/horarios`);
    }

    // Patients methods
    async getPatients(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/pacientes?${params}`);
    }

    async getPatientById(id) {
        return this.get(`/pacientes/${id}`);
    }

    async createPatient(data) {
        return this.post('/pacientes', data);
    }

    async updatePatient(id, data) {
        return this.put(`/pacientes/${id}`, data);
    }

    async deactivatePatient(id) {
        return this.delete(`/pacientes/${id}`);
    }

    async getPatientHistory(id) {
        return this.get(`/pacientes/${id}/historial`);
    }

    async getPatientStats(id) {
        return this.get(`/pacientes/${id}/estadisticas`);
    }

    // Sessions methods
    async getSessions(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/sesiones?${params}`);
    }

    async getSessionById(id) {
        return this.get(`/sesiones/${id}`);
    }

    async createSession(data) {
        return this.post('/sesiones', data);
    }

    async updateSession(id, data) {
        return this.put(`/sesiones/${id}`, data);
    }

    async deleteSession(id) {
        return this.delete(`/sesiones/${id}`);
    }

    async getUpcomingSessions() {
        return this.get('/sesiones/proximas');
    }

    async checkAvailability(professionalId, dateTime, duration = 50) {
        const params = new URLSearchParams({
            profesional_id: professionalId,
            fecha_hora: dateTime,
            duracion_minutos: duration
        });
        return this.get(`/sesiones/disponibilidad?${params}`);
    }

    async getSessionStats(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/sesiones/estadisticas?${params}`);
    }

    // Evaluations methods
    async getEvaluations(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/evaluaciones?${params}`);
    }

    async getEvaluationById(id) {
        return this.get(`/evaluaciones/${id}`);
    }

    async createEvaluation(data) {
        return this.post('/evaluaciones', data);
    }

    async updateEvaluation(id, data) {
        return this.put(`/evaluaciones/${id}`, data);
    }

    async deleteEvaluation(id) {
        return this.delete(`/evaluaciones/${id}`);
    }

    async getEvaluationsByPatient(patientId) {
        return this.get(`/evaluaciones/paciente/${patientId}`);
    }

    async getEvaluationsByProfessional(professionalId) {
        return this.get(`/evaluaciones/profesional/${professionalId}`);
    }

    async getEvaluationStats(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.get(`/evaluaciones/estadisticas?${params}`);
    }
}

// Create global API instance
window.api = new API();