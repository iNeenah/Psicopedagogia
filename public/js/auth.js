// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    async init() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                await this.validateToken();
            } catch (error) {
                console.error('Token validation failed:', error);
                this.logout();
            }
        }
        this.updateUI();
    }

    async validateToken() {
        try {
            const response = await api.getProfile();
            this.currentUser = response.user;
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    async login(email, password) {
        try {
            showLoading(true);
            const response = await api.login(email, password);
            
            this.currentUser = response.user;
            this.isAuthenticated = true;
            
            this.updateUI();
            this.showDashboard();
            
            showToast('¡Bienvenido! Has iniciado sesión correctamente.', 'success');
            
            return response;
        } catch (error) {
            showToast(error.message || 'Error al iniciar sesión', 'error');
            throw error;
        } finally {
            showLoading(false);
        }
    }

    logout() {
        api.removeToken();
        this.currentUser = null;
        this.isAuthenticated = false;
        this.updateUI();
        this.showLogin();
        showToast('Has cerrado sesión correctamente.', 'info');
    }

    updateUI() {
        const userInfo = document.getElementById('userInfo');
        const userName = userInfo.querySelector('.user-name');
        const userRole = userInfo.querySelector('.user-role');
        
        if (this.isAuthenticated && this.currentUser) {
            userName.textContent = `${this.currentUser.nombre} ${this.currentUser.apellido}`;
            userRole.textContent = this.getRoleDisplayName(this.currentUser.rol);
        } else {
            userName.textContent = 'Invitado';
            userRole.textContent = 'No autenticado';
        }
    }

    getRoleDisplayName(role) {
        const roles = {
            'profesional': 'Profesional',
            'paciente': 'Paciente'
        };
        return roles[role] || role;
    }

    showLogin() {
        document.getElementById('loginPage').style.display = 'block';
        document.getElementById('dashboardPage').style.display = 'none';
        document.getElementById('profesionalesPage').style.display = 'none';
        document.getElementById('pacientesPage').style.display = 'none';
        document.getElementById('sesionesPage').style.display = 'none';
        document.getElementById('evaluacionesPage').style.display = 'none';
        document.getElementById('estadisticasPage').style.display = 'none';
        
        // Hide sidebar and main content structure for login
        document.querySelector('.sidebar').style.display = 'none';
        document.querySelector('.main-content').style.marginLeft = '0';
        document.querySelector('.header').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'block';
        
        // Show sidebar and main content structure
        document.querySelector('.sidebar').style.display = 'flex';
        document.querySelector('.main-content').style.marginLeft = 'var(--sidebar-width)';
        document.querySelector('.header').style.display = 'flex';
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-page="dashboard"]').classList.add('active');
        
        // Update page title
        document.getElementById('pageTitle').textContent = 'Dashboard';
        
        // Load dashboard data
        if (window.dashboardManager) {
            window.dashboardManager.loadDashboardData();
        }
    }

    hasPermission(action, resource) {
        if (!this.isAuthenticated) return false;
        
        const role = this.currentUser.rol;
        
        // Define permissions based on role
        const permissions = {
            'profesional': {
                'read': ['usuarios', 'profesionales', 'pacientes', 'sesiones', 'evaluaciones'],
                'create': ['pacientes', 'sesiones', 'evaluaciones'],
                'update': ['profesionales', 'pacientes', 'sesiones', 'evaluaciones'],
                'delete': ['sesiones', 'evaluaciones']
            },
            'paciente': {
                'read': ['pacientes', 'sesiones', 'evaluaciones'],
                'create': [],
                'update': ['pacientes'],
                'delete': []
            }
        };
        
        return permissions[role] && 
               permissions[role][action] && 
               permissions[role][action].includes(resource);
    }

    requireAuth() {
        if (!this.isAuthenticated) {
            this.showLogin();
            showToast('Debes iniciar sesión para acceder a esta página.', 'warning');
            return false;
        }
        return true;
    }

    requirePermission(action, resource) {
        if (!this.requireAuth()) return false;
        
        if (!this.hasPermission(action, resource)) {
            showToast('No tienes permisos para realizar esta acción.', 'error');
            return false;
        }
        
        return true;
    }
}

// Initialize auth manager
window.authManager = new AuthManager();

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    
    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Demo account selection
    document.querySelectorAll('.demo-account').forEach(account => {
        account.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const password = this.getAttribute('data-password');
            
            emailInput.value = email;
            passwordInput.value = password;
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            if (!email || !password) {
                showToast('Por favor, completa todos los campos.', 'warning');
                return;
            }
            
            try {
                await authManager.login(email, password);
            } catch (error) {
                console.error('Login error:', error);
            }
        });
    }
    
    // Logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            authManager.logout();
        });
    }
});

// Loading state management
function showLoading(show) {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    
    if (show) {
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
    } else {
        loginBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
    }
}