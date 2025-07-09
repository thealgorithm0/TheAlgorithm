// Professional JavaScript for The Algorithm Community Website
// Enhanced functionality with modern ES6+ features

class TheAlgorithmWebsite {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.scrollToTopButton = document.getElementById('scroll-to-top');
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('a[data-scroll]');
        this.fadeElements = document.querySelectorAll('.fade-in');
        
        this.isMenuOpen = false;
        this.lastScrollTop = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupScrollToTop();
        this.setupHeaderEffects();
        this.preloadImages();
        
        console.log('🚀 The Algorithm Community website loaded successfully!');
    }
    
    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('load', this.handlePageLoad.bind(this));
        
        // Mobile menu
        if (this.mobileMenuButton) {
            this.mobileMenuButton.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav-mobile') && !e.target.closest('.mobile-menu-button')) {
                this.closeMobileMenu();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
    }
    
    setupIntersectionObserver() {
        // Intersection Observer for animations
        const animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.fadeElements.forEach(element => {
            animationObserver.observe(element);
        });
        
        // Navigation highlight observer
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.updateActiveNavLink(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-80px 0px -50% 0px'
            }
        );
        
        this.sections.forEach(section => {
            navObserver.observe(section);
        });
    }
    
    setupScrollEffects() {
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.2;
                hero.style.transform = `translateY(${parallax}px)`;
            }, 16));
        }
        
        // Floating animation for hero background
        this.setupFloatingAnimation();
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-scroll');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    this.smoothScrollTo(targetPosition);
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    setupMobileMenu() {
        // Mobile menu links
        const mobileLinks = this.mobileMenu?.querySelectorAll('a[data-scroll]');
        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 300);
            });
        });
    }
    
    setupScrollToTop() {
        if (this.scrollToTopButton) {
            this.scrollToTopButton.addEventListener('click', () => {
                this.smoothScrollTo(0);
            });
        }
    }
    
    setupHeaderEffects() {
        // Add scroll class to header
        const updateHeaderClass = () => {
            if (window.scrollY > 100) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
        };
        
        window.addEventListener('scroll', this.throttle(updateHeaderClass, 16));
        updateHeaderClass(); // Initial call
    }
    
    setupFloatingAnimation() {
        // Create floating particles effect
        const hero = document.querySelector('.hero');
        if (hero) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${Math.random() * 10 + 15}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                hero.appendChild(particle);
            }
        }
    }
    
    preloadImages() {
        // Preload important images
        const images = ['images/algorithm_logo.png', 'images/meeting.jpeg'];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide scroll to top button
        if (this.scrollToTopButton) {
            if (scrollTop > 300) {
                this.scrollToTopButton.classList.add('visible');
            } else {
                this.scrollToTopButton.classList.remove('visible');
            }
        }
        
        // Update last scroll position
        this.lastScrollTop = scrollTop;
    }
    
    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    handlePageLoad() {
        // Add loaded class for additional animations
        document.body.classList.add('loaded');
        
        // Trigger any lazy loading
        this.triggerLazyLoading();
    }
    
    handleKeyNavigation(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.mobileMenu?.classList.add('active');
        this.mobileMenuButton?.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isMenuOpen = true;
        
        // Focus management
        const firstLink = this.mobileMenu?.querySelector('a');
        firstLink?.focus();
    }
    
    closeMobileMenu() {
        this.mobileMenu?.classList.remove('active');
        this.mobileMenuButton?.classList.remove('active');
        document.body.style.overflow = '';
        this.isMenuOpen = false;
    }
    
    updateActiveNavLink(activeId) {
        // Update desktop navigation
        document.querySelectorAll('.nav-desktop a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-scroll') === activeId) {
                link.classList.add('active');
            }
        });
        
        // Update mobile navigation
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-scroll') === activeId) {
                link.classList.add('active');
            }
        });
    }
    
    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 3, 800); // Max 800ms
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuart(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        requestAnimationFrame(animation);
    }
    
    triggerLazyLoading() {
        // Enhanced image loading with intersection observer
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loading');
                    
                    img.addEventListener('load', () => {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    easeInOutQuart(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t + b;
        t -= 2;
        return -c/2 * (t*t*t*t - 2) + b;
    }
}

// Enhanced form handling for contact/feedback
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Add real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearErrors.bind(this));
            });
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        if (this.validateForm(form)) {
            this.submitForm(form);
        }
    }
    
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField({target: input})) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        
        // Remove existing error
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    clearErrors(e) {
        this.clearFieldError(e.target);
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #48bb78;' : 'background: #f56565;'}
        `;
        
        document.body.appendChild(messageElement);
        
        // Animate in
        setTimeout(() => {
            messageElement.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageElement.style.transform = 'translateX(100%)';
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }
    
    init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(this.collectMetrics.bind(this), 1000);
            });
        }
    }
    
    collectMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        this.metrics = {
            pageLoadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint()
        };
        
        console.log('📊 Performance Metrics:', this.metrics);
    }
    
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }
    
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? Math.round(fcp.startTime) : null;
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main website functionality
    window.theAlgorithmSite = new TheAlgorithmWebsite();
    
    // Initialize form handling
    new FormHandler();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Add CSS for enhanced interactions
    const style = document.createElement('style');
    style.textContent = `
        /* Enhanced focus styles */
        .keyboard-navigation *:focus {
            outline: 2px solid #4facfe !important;
            outline-offset: 2px !important;
        }
        
        /* Loading states */
        img.loading {
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }
        
        img.loaded {
            opacity: 1;
        }
        
        /* Form validation styles */
        input.error, textarea.error {
            border-color: #f56565 !important;
            box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1) !important;
        }
        
        .error-message {
            color: #f56565;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        /* Button loading state */
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        /* Floating particles animation */
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
            50% { transform: translateY(-10px) translateX(-5px) rotate(180deg); }
            75% { transform: translateY(-30px) translateX(15px) rotate(270deg); }
        }
        
        /* Page load animation */
        body:not(.loaded) .fade-in {
            opacity: 0;
            transform: translateY(20px);
        }
        
        body.loaded .fade-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
});

// Service Worker registration for PWA features (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
