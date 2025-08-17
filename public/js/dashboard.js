// Dashboard Management
class DashboardManager {
    constructor() {
        this.stats = {
            totalProfesionales: 0,
            totalPacientes: 0,
            sesionesHoy: 0,
            evaluacionesMes: 0
        };
        this.init();
    }

    init() {
        // Initialize dashboard when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Refresh button (if exists)
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }
    }

    async loadDashboardData() {
        if (!authManager.isAuthenticated) return;

        try {
            // Show loading state
            this.showLoadingState();

            // Load data in parallel
            const [
                professionalsData,
                patientsData,
                upcomingSessionsData,
                sessionStatsData,
                evaluationStatsData
            ] = await Promise.all([
                this.loadProfessionals(),
                this.loadPatients(),
                this.loadUpcomingSessions(),
                this.loadSessionStats(),
                this.loadEvaluationStats()
            ]);

            // Update stats
            this.updateStats({
                totalProfesionales: professionalsData.count || 0,
                totalPacientes: patientsData.count || 0,
                sesionesHoy: this.getTodaySessions(upcomingSessionsData.sesiones || []),
                evaluacionesMes: this.getThisMonthEvaluations(evaluationStatsData)
            });

            // Update dashboard sections
            this.updateUpcomingSessions(upcomingSessionsData.sesiones || []);
            this.updateRecentActivity();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showToast('Error al cargar los datos del dashboard', 'error');
        } finally {
            this.hideLoadingState();
        }
    }

    async loadProfessionals() {
        try {
            return await api.getProfessionals();
        } catch (error) {
            console.error('Error loading professionals:', error);
            return { count: 0, profesionales: [] };
        }
    }

    async loadPatients() {
        try {
            return await api.getPatients();
        } catch (error) {
            console.error('Error loading patients:', error);
            return { count: 0, pacientes: [] };
        }
    }

    async loadUpcomingSessions() {
        try {
            return await api.getUpcomingSessions();
        } catch (error) {
            console.error('Error loading upcoming sessions:', error);
            return { sesiones: [] };
        }
    }

    async loadSessionStats() {
        try {
            return await api.getSessionStats();
        } catch (error) {
            console.error('Error loading session stats:', error);
            return {};
        }
    }

    async loadEvaluationStats() {
        try {
            return await api.getEvaluationStats();
        } catch (error) {
            console.error('Error loading evaluation stats:', error);
            return {};
        }
    }

    getTodaySessions(sessions) {
        const today = new Date().toDateString();
        return sessions.filter(session => {
            const sessionDate = new Date(session.fecha_hora).toDateString();
            return sessionDate === today;
        }).length;
    }

    getThisMonthEvaluations(stats) {
        // This would need to be calculated based on the current month
        // For now, return the total evaluations from stats
        return stats.estadisticas?.total_evaluaciones || 0;
    }

    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats };

        // Update DOM elements
        const elements = {
            totalProfesionales: document.getElementById('totalProfesionales'),
            totalPacientes: document.getElementById('totalPacientes'),
            sesionesHoy: document.getElementById('sesionesHoy'),
            evaluacionesMes: document.getElementById('evaluacionesMes')
        };

        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                this.animateNumber(elements[key], this.stats[key]);
            }
        });
    }

    animateNumber(element, targetValue) {
        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000; // 1 second
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateUpcomingSessions(sessions) {
        const container = document.getElementById('upcomingSessions');
        if (!container) return;

        if (sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <p>No hay sesiones programadas próximamente</p>
                </div>
            `;
            return;
        }

        const sessionsHTML = sessions.slice(0, 5).map(session => {
            const date = new Date(session.fecha_hora);
            const formattedDate = this.formatDate(date);
            const formattedTime = this.formatTime(date);
            
            return `
                <div class="session-item">
                    <div class="session-time">
                        <span class="session-date">${formattedDate}</span>
                        <span class="session-hour">${formattedTime}</span>
                    </div>
                    <div class="session-details">
                        <h4>${session.paciente?.nombre || 'Paciente'} ${session.paciente?.apellido || ''}</h4>
                        <p>con ${session.profesional?.nombre || 'Profesional'} ${session.profesional?.apellido || ''}</p>
                        <span class="session-type">${this.getSessionTypeLabel(session.tipo_sesion)}</span>
                    </div>
                    <div class="session-status">
                        <span class="status-badge ${session.estado}">${this.getStatusLabel(session.estado)}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = sessionsHTML;
    }

    updateRecentActivity() {
        const container = document.getElementById('activityList');
        if (!container) return;

        // Mock recent activity data
        const activities = [
            {
                type: 'session',
                message: 'Nueva sesión programada con María González',
                time: '2 horas',
                icon: 'fas fa-calendar-plus',
                color: 'success'
            },
            {
                type: 'evaluation',
                message: 'Evaluación completada para Juan Pérez',
                time: '4 horas',
                icon: 'fas fa-clipboard-check',
                color: 'info'
            },
            {
                type: 'patient',
                message: 'Nuevo paciente registrado: Sofía Martínez',
                time: '1 día',
                icon: 'fas fa-user-plus',
                color: 'primary'
            }
        ];

        const activitiesHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.color}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="activity-time">hace ${activity.time}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = activitiesHTML;
    }

    showLoadingState() {
        // Add loading class to stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.add('loading');
        });
    }

    hideLoadingState() {
        // Remove loading class from stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.remove('loading');
        });
    }

    formatDate(date) {
        const options = { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
        };
        return date.toLocaleDateString('es-ES', options);
    }

    formatTime(date) {
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getSessionTypeLabel(type) {
        const types = {
            'evaluacion': 'Evaluación',
            'tratamiento': 'Tratamiento',
            'seguimiento': 'Seguimiento',
            'interconsulta': 'Interconsulta'
        };
        return types[type] || type;
    }

    getStatusLabel(status) {
        const statuses = {
            'programada': 'Programada',
            'realizada': 'Realizada',
            'cancelada': 'Cancelada',
            'no_asistio': 'No asistió'
        };
        return statuses[status] || status;
    }
}

// Initialize dashboard manager
window.dashboardManager = new DashboardManager();

// Add CSS for dashboard-specific styles
const dashboardStyles = `
    .empty-state {
        text-align: center;
        padding: var(--spacing-2xl);
        color: var(--gray-500);
    }

    .empty-state i {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
    }

    .session-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--gray-200);
        transition: background-color var(--transition-fast);
    }

    .session-item:hover {
        background-color: var(--gray-50);
    }

    .session-item:last-child {
        border-bottom: none;
    }

    .session-time {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 80px;
    }

    .session-date {
        font-size: 0.75rem;
        color: var(--gray-500);
        text-transform: uppercase;
    }

    .session-hour {
        font-size: 1rem;
        font-weight: 600;
        color: var(--gray-900);
    }

    .session-details {
        flex: 1;
    }

    .session-details h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--gray-900);
        margin-bottom: var(--spacing-xs);
    }

    .session-details p {
        font-size: 0.75rem;
        color: var(--gray-600);
        margin-bottom: var(--spacing-xs);
    }

    .session-type {
        font-size: 0.625rem;
        background-color: var(--gray-100);
        color: var(--gray-700);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        text-transform: uppercase;
        font-weight: 500;
    }

    .status-badge {
        font-size: 0.75rem;
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-badge.programada {
        background-color: var(--info-color);
        color: var(--white);
    }

    .status-badge.realizada {
        background-color: var(--success-color);
        color: var(--white);
    }

    .status-badge.cancelada {
        background-color: var(--error-color);
        color: var(--white);
    }

    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        padding: var(--spacing-md) 0;
        border-bottom: 1px solid var(--gray-200);
    }

    .activity-item:last-child {
        border-bottom: none;
    }

    .activity-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        color: var(--white);
    }

    .activity-icon.success { background-color: var(--success-color); }
    .activity-icon.info { background-color: var(--info-color); }
    .activity-icon.primary { background-color: var(--primary-color); }
    .activity-icon.warning { background-color: var(--warning-color); }

    .activity-content p {
        font-size: 0.875rem;
        color: var(--gray-900);
        margin-bottom: var(--spacing-xs);
    }

    .activity-time {
        font-size: 0.75rem;
        color: var(--gray-500);
    }

    .stat-card.loading {
        opacity: 0.7;
        pointer-events: none;
    }

    .stat-card.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid var(--gray-300);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
`;

// Inject dashboard styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
document.head.appendChild(styleSheet);