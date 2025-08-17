// Main Application Logic
class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.isMobile = window.innerWidth <= 768;
        this.sidebarCollapsed = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupResponsive();
        this.initializeTooltips();
        
        // Check authentication status on load
        if (authManager.isAuthenticated) {
            authManager.showDashboard();
        } else {
            authManager.showLogin();
        }
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileSidebar();
            });
        }

        // Modal close handlers
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('modal');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupResponsive() {
        this.handleResize();
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            // Reset sidebar state when switching between mobile/desktop
            const sidebar = document.querySelector('.sidebar');
            if (this.isMobile) {
                sidebar.classList.remove('show');
            } else {
                sidebar.classList.remove('show');
            }
        }
    }

    navigateTo(page) {
        if (!authManager.requireAuth()) return;

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            if (p.id !== 'loginPage') {
                p.style.display = 'none';
            }
        });

        // Show target page
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = page;
            
            // Update active menu item
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-page="${page}"]`).classList.add('active');
            
            // Update page title
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = this.getPageTitle(page);
            }
            
            // Load page-specific data
            this.loadPageData(page);
            
            // Close mobile sidebar if open
            if (this.isMobile) {
                this.closeMobileSidebar();
            }
        }
    }

    getPageTitle(page) {
        const titles = {
            'dashboard': 'Dashboard',
            'profesionales': 'Profesionales',
            'pacientes': 'Pacientes',
            'sesiones': 'Sesiones',
            'evaluaciones': 'Evaluaciones',
            'estadisticas': 'Estadísticas'
        };
        return titles[page] || 'Dashboard';
    }

    async loadPageData(page) {
        try {
            switch (page) {
                case 'dashboard':
                    if (window.dashboardManager) {
                        await window.dashboardManager.loadDashboardData();
                    }
                    break;
                case 'profesionales':
                    await this.loadProfessionalsPage();
                    break;
                case 'pacientes':
                    await this.loadPatientsPage();
                    break;
                case 'sesiones':
                    await this.loadSessionsPage();
                    break;
                case 'evaluaciones':
                    await this.loadEvaluationsPage();
                    break;
                case 'estadisticas':
                    await this.loadStatisticsPage();
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${page} page:`, error);
            showToast(`Error al cargar la página de ${this.getPageTitle(page)}`, 'error');
        }
    }

    async loadProfessionalsPage() {
        if (!authManager.requirePermission('read', 'profesionales')) return;
        
        try {
            const response = await api.getProfessionals();
            this.renderProfessionalsTable(response.profesionales || []);
        } catch (error) {
            console.error('Error loading professionals:', error);
            showToast('Error al cargar los profesionales', 'error');
        }
    }

    async loadPatientsPage() {
        if (!authManager.requirePermission('read', 'pacientes')) return;
        
        try {
            const response = await api.getPatients();
            this.renderPatientsTable(response.pacientes || []);
        } catch (error) {
            console.error('Error loading patients:', error);
            showToast('Error al cargar los pacientes', 'error');
        }
    }

    async loadSessionsPage() {
        if (!authManager.requirePermission('read', 'sesiones')) return;
        
        try {
            const response = await api.getSessions();
            this.renderSessionsCalendar(response.sesiones || []);
        } catch (error) {
            console.error('Error loading sessions:', error);
            showToast('Error al cargar las sesiones', 'error');
        }
    }

    async loadEvaluationsPage() {
        if (!authManager.requirePermission('read', 'evaluaciones')) return;
        
        try {
            const response = await api.getEvaluations();
            this.renderEvaluationsTable(response.evaluaciones || []);
        } catch (error) {
            console.error('Error loading evaluations:', error);
            showToast('Error al cargar las evaluaciones', 'error');
        }
    }

    async loadStatisticsPage() {
        // Statistics page implementation
        console.log('Loading statistics page...');
    }

    renderProfessionalsTable(professionals) {
        const container = document.getElementById('profesionalesTable');
        if (!container) return;

        if (professionals.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-user-md"></i><p>No hay profesionales registrados</p></div>';
            return;
        }

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Matrícula</th>
                        <th>Experiencia</th>
                        <th>Tarifa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${professionals.map(prof => `
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <div class="user-avatar">
                                        <i class="fas fa-user-md"></i>
                                    </div>
                                    <div>
                                        <strong>${prof.usuario.nombre} ${prof.usuario.apellido}</strong>
                                        <small>${prof.usuario.email}</small>
                                    </div>
                                </div>
                            </td>
                            <td><span class="badge specialty-${prof.especialidad}">${this.getSpecialtyLabel(prof.especialidad)}</span></td>
                            <td>${prof.matricula}</td>
                            <td>${prof.anos_experiencia} años</td>
                            <td>$${prof.tarifa_sesion ? prof.tarifa_sesion.toLocaleString() : 'N/A'}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="app.viewProfessional(${prof.id})" title="Ver detalles">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" onclick="app.editProfessional(${prof.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    renderPatientsTable(patients) {
        const container = document.getElementById('pacientesTable');
        if (!container) return;

        if (patients.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>No hay pacientes registrados</p></div>';
            return;
        }

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Obra Social</th>
                        <th>Motivo de Consulta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${patients.map(patient => `
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <div class="user-avatar">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <strong>${patient.usuario.nombre} ${patient.usuario.apellido}</strong>
                                        <small>${patient.usuario.email}</small>
                                    </div>
                                </div>
                            </td>
                            <td>${patient.edad} años</td>
                            <td>${patient.obra_social || 'N/A'}</td>
                            <td class="text-truncate" title="${patient.motivo_consulta}">
                                ${patient.motivo_consulta.substring(0, 50)}${patient.motivo_consulta.length > 50 ? '...' : ''}
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="app.viewPatient(${patient.id})" title="Ver detalles">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" onclick="app.editPatient(${patient.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon" onclick="app.viewPatientHistory(${patient.id})" title="Ver historial">
                                        <i class="fas fa-history"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    renderSessionsCalendar(sessions) {
        const container = document.getElementById('sesionesCalendar');
        if (!container) return;

        // Simple list view for now (calendar implementation would be more complex)
        if (sessions.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-alt"></i><p>No hay sesiones programadas</p></div>';
            return;
        }

        const sessionsHTML = sessions.map(session => {
            const date = new Date(session.fecha_hora);
            return `
                <div class="session-card">
                    <div class="session-header">
                        <h4>${session.paciente?.nombre || 'Paciente'} ${session.paciente?.apellido || ''}</h4>
                        <span class="status-badge ${session.estado}">${this.getStatusLabel(session.estado)}</span>
                    </div>
                    <div class="session-details">
                        <p><i class="fas fa-user-md"></i> ${session.profesional?.nombre || 'Profesional'} ${session.profesional?.apellido || ''}</p>
                        <p><i class="fas fa-calendar"></i> ${date.toLocaleDateString('es-ES')}</p>
                        <p><i class="fas fa-clock"></i> ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><i class="fas fa-tag"></i> ${this.getSessionTypeLabel(session.tipo_sesion)}</p>
                    </div>
                    <div class="session-actions">
                        <button class="btn-icon" onclick="app.viewSession(${session.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="app.editSession(${session.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="sessions-grid">${sessionsHTML}</div>`;
    }

    renderEvaluationsTable(evaluations) {
        const container = document.getElementById('evaluacionesTable');
        if (!container) return;

        if (evaluations.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No hay evaluaciones registradas</p></div>';
            return;
        }

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Paciente</th>
                        <th>Profesional</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Áreas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${evaluations.map(evaluation => `
                        <tr>
                            <td>${evaluation.paciente?.nombre || 'N/A'} ${evaluation.paciente?.apellido || ''}</td>
                            <td>${evaluation.profesional?.nombre || 'N/A'} ${evaluation.profesional?.apellido || ''}</td>
                            <td><span class="badge type-${evaluation.tipo_evaluacion}">${this.getEvaluationTypeLabel(evaluation.tipo_evaluacion)}</span></td>
                            <td>${new Date(evaluation.fecha_evaluacion).toLocaleDateString('es-ES')}</td>
                            <td class="text-truncate">${evaluation.area_evaluada}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="app.viewEvaluation(${evaluation.id})" title="Ver detalles">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" onclick="app.editEvaluation(${evaluation.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    // Utility methods
    getSpecialtyLabel(specialty) {
        const specialties = {
            'psicologo': 'Psicólogo',
            'psicopedagogo': 'Psicopedagogo',
            'ambos': 'Psicólogo/Psicopedagogo'
        };
        return specialties[specialty] || specialty;
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

    getSessionTypeLabel(type) {
        const types = {
            'evaluacion': 'Evaluación',
            'tratamiento': 'Tratamiento',
            'seguimiento': 'Seguimiento',
            'interconsulta': 'Interconsulta'
        };
        return types[type] || type;
    }

    getEvaluationTypeLabel(type) {
        const types = {
            'inicial': 'Inicial',
            'seguimiento': 'Seguimiento',
            'final': 'Final',
            'neuropsicologica': 'Neuropsicológica',
            'psicopedagogica': 'Psicopedagógica'
        };
        return types[type] || type;
    }

    // Sidebar methods
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (this.sidebarCollapsed) {
            sidebar.style.width = 'var(--sidebar-collapsed-width)';
            mainContent.style.marginLeft = 'var(--sidebar-collapsed-width)';
        } else {
            sidebar.style.width = 'var(--sidebar-width)';
            mainContent.style.marginLeft = 'var(--sidebar-width)';
        }
    }

    toggleMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show');
    }

    closeMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('show');
    }

    // Modal methods
    showModal(title, content) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('show');
    }

    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Escape key closes modal
        if (e.key === 'Escape') {
            this.closeModal();
        }
        
        // Ctrl/Cmd + K for search (future implementation)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Implement search functionality
        }
    }

    initializeTooltips() {
        // Simple tooltip implementation
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', function() {
                // Tooltip implementation would go here
            });
        });
    }

    // Placeholder methods for CRUD operations
    viewProfessional(id) { console.log('View professional:', id); }
    editProfessional(id) { console.log('Edit professional:', id); }
    viewPatient(id) { console.log('View patient:', id); }
    editPatient(id) { console.log('Edit patient:', id); }
    viewPatientHistory(id) { console.log('View patient history:', id); }
    viewSession(id) { console.log('View session:', id); }
    editSession(id) { console.log('Edit session:', id); }
    viewEvaluation(id) { console.log('View evaluation:', id); }
    editEvaluation(id) { console.log('Edit evaluation:', id); }
}

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Add slideOut animation
const toastStyles = `
    @keyframes slideOut {
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .data-table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .data-table th,
    .data-table td {
        padding: var(--spacing-md);
        text-align: left;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .data-table th {
        background-color: var(--gray-50);
        font-weight: 600;
        color: var(--gray-700);
        font-size: 0.875rem;
    }
    
    .data-table tr:hover {
        background-color: var(--gray-50);
    }
    
    .user-cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }
    
    .user-avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white);
        font-size: 0.875rem;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
    
    .user-cell div:last-child {
        display: flex;
        flex-direction: column;
    }
    
    .user-cell small {
        color: var(--gray-500);
        font-size: 0.75rem;
    }
    
    .badge {
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }
    
    .badge.specialty-psicologo { 
        background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); 
        color: var(--white); 
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
    .badge.specialty-psicopedagogo { 
        background: linear-gradient(135deg, var(--secondary-color), var(--secondary-light)); 
        color: var(--white); 
        box-shadow: 0 4px 12px rgba(6, 214, 160, 0.3);
    }
    .badge.specialty-ambos { 
        background: linear-gradient(135deg, var(--success-color), #34d399); 
        color: var(--white); 
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .action-buttons {
        display: flex;
        gap: var(--spacing-xs);
    }
    
    .btn-icon {
        background: none;
        border: 1px solid var(--gray-300);
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        cursor: pointer;
        color: var(--gray-600);
        transition: all var(--transition-fast);
    }
    
    .btn-icon:hover {
        background-color: var(--gray-100);
        border-color: var(--gray-400);
        color: var(--gray-900);
    }
    
    .text-truncate {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .sessions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-lg);
    }
    
    .session-card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: var(--spacing-lg);
        transition: all var(--transition-fast);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }
    
    .session-card:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        transform: translateY(-4px);
    }
    
    .session-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-md);
    }
    
    .session-header h4 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .session-details p {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);
        font-size: 0.875rem;
        color: var(--gray-600);
    }
    
    .session-details i {
        width: 16px;
        color: var(--gray-400);
    }
    
    .session-actions {
        display: flex;
        gap: var(--spacing-xs);
        margin-top: var(--spacing-md);
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--gray-200);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Initialize app
window.app = new App();