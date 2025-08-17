// Animation and Visual Effects Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        document.querySelectorAll('.stat-card, .dashboard-section, .content-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Enhanced hover effects
    setupHoverEffects() {
        // Add hover effects to cards
        document.querySelectorAll('.stat-card, .session-card, .content-card').forEach(card => {
            card.classList.add('hover-lift');
        });

        // Add ripple effect to buttons
        document.querySelectorAll('.btn-primary, .login-btn').forEach(button => {
            button.addEventListener('click', this.createRippleEffect);
        });
    }

    // Ripple effect for buttons
    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                .btn-primary, .login-btn {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Loading animations for data
    setupLoadingAnimations() {
        // Stagger animation for stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Stagger animation for menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
            item.classList.add('animate-slide-right');
        });
    }

    // Animate number counting
    animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Smooth page transitions
    transitionToPage(pageId) {
        const currentPage = document.querySelector('.page:not([style*="display: none"])');
        const targetPage = document.getElementById(pageId);

        if (currentPage && targetPage && currentPage !== targetPage) {
            // Fade out current page
            currentPage.style.animation = 'fadeOut 0.3s ease-out forwards';
            
            setTimeout(() => {
                currentPage.style.display = 'none';
                currentPage.style.animation = '';
                
                // Fade in target page
                targetPage.style.display = 'block';
                targetPage.style.animation = 'fadeIn 0.3s ease-out forwards';
                
                setTimeout(() => {
                    targetPage.style.animation = '';
                }, 300);
            }, 300);
        }
    }

    // Loading spinner
    showLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-ring"></div>
            <p>Cargando...</p>
        `;
        
        // Add spinner styles if not exists
        if (!document.querySelector('#spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                .loading-spinner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-2xl);
                    color: var(--gray-500);
                }
                
                .spinner-ring {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--gray-200);
                    border-top: 4px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: var(--spacing-md);
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.innerHTML = '';
        container.appendChild(spinner);
    }

    hideLoadingSpinner(container) {
        const spinner = container.querySelector('.loading-spinner');
        if (spinner) {
            spinner.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => spinner.remove(), 300);
        }
    }

    // Particle background effect for login
    createParticleBackground(container) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        
        container.appendChild(canvas);
        
        const particles = [];
        const particleCount = 50;
        
        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Animate particles
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        resizeCanvas();
        animate();
        
        window.addEventListener('resize', resizeCanvas);
    }
}

// Initialize animation manager
window.animationManager = new AnimationManager();

// Add particle background to login page
document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
        window.animationManager.createParticleBackground(loginContainer);
    }
});