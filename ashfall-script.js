/**
 * ASHFALL STUDIO - PIXEL PERFECT CLONE
 * Complete JavaScript Recreation
 */

// =============================================================================
// 1. GLOBAL STATE & CONFIGURATION
// =============================================================================

const state = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    hasHover: window.matchMedia('(hover: hover)').matches,
    scrollY: 0,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
};

// =============================================================================
// 2. SMOOTH SCROLL IMPLEMENTATION
// =============================================================================

class SmoothScroll {
    constructor() {
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.ease = 0.075;
        this.isScrolling = false;
        this.rafId = null;

        this.init();
    }

    init() {
        // Set initial scroll position
        this.scrollY = window.pageYOffset;
        this.targetScrollY = this.scrollY;

        // Bind events
        window.addEventListener('scroll', () => {
            this.targetScrollY = window.pageYOffset;
        });

        // Start RAF loop
        this.update();
    }

    update() {
        // Smooth scroll interpolation
        const diff = this.targetScrollY - this.scrollY;
        const delta = Math.abs(diff);

        if (delta > 0.1) {
            this.scrollY += diff * this.ease;
            this.isScrolling = true;
        } else {
            this.scrollY = this.targetScrollY;
            this.isScrolling = false;
        }

        // Update global state
        state.scrollY = this.scrollY;

        // Continue loop
        this.rafId = requestAnimationFrame(() => this.update());
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// Initialize smooth scroll (only on desktop with hover support)
let smoothScroll = null;
if (state.hasHover && state.isDesktop) {
    smoothScroll = new SmoothScroll();
}

// =============================================================================
// 3. CUSTOM CURSOR
// =============================================================================

class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        if (!this.cursor) return;

        this.cursorLabel = this.cursor.querySelector('.cursor__label');
        this.init();
    }

    init() {
        // Only show on devices with hover support
        if (!state.hasHover) return;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
        });

        // Animate cursor
        this.animate();
    }

    animate() {
        // Smooth cursor follow
        state.targetX += (state.mouseX - state.targetX) * 0.15;
        state.targetY += (state.mouseY - state.targetY) * 0.15;

        // Apply transform
        if (this.cursor) {
            this.cursor.style.transform = `translate(${state.targetX}px, ${state.targetY}px)`;
        }

        requestAnimationFrame(() => this.animate());
    }

    setLabel(text) {
        if (this.cursorLabel) {
            this.cursorLabel.textContent = text;
        }
    }

    clearLabel() {
        this.setLabel('');
    }
}

const customCursor = new CustomCursor();

// =============================================================================
// 4. MOBILE NAVIGATION
// =============================================================================

class MobileNav {
    constructor() {
        this.nav = document.getElementById('nav');
        this.toggle = document.getElementById('nav-toggle');
        this.isOpen = false;

        this.init();
    }

    init() {
        if (!this.toggle || !this.nav) return;

        // Toggle button click
        this.toggle.addEventListener('click', () => {
            this.toggleNav();
        });

        // Close on link click
        const links = this.nav.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    this.toggleNav();
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleNav();
            }
        });
    }

    toggleNav() {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.nav.classList.add('nav--open');
            this.toggle.classList.add('nav-toggle--open');
            document.body.style.overflow = 'hidden';
        } else {
            this.nav.classList.remove('nav--open');
            this.toggle.classList.remove('nav-toggle--open');
            document.body.style.overflow = '';
        }
    }
}

const mobileNav = new MobileNav();

// =============================================================================
// 5. SCROLL-TRIGGERED ANIMATIONS
// =============================================================================

class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }

    init() {
        // Create intersection observer
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, options);

        // Observe elements with animations
        this.observeElements();
    }

    observeElements() {
        // Text animations
        const textElements = document.querySelectorAll('.anim-line, .anim-fade-line, .anim-char');
        textElements.forEach(el => {
            const parent = el.closest('section, .border, .btn, .reel, .nav-toggle, .header-contact-btn, .nav-contact-btn__svg');
            if (parent && !parent.classList.contains('is-visible')) {
                this.observer.observe(parent);
            }
        });

        // Project cards
        const projectCards = document.querySelectorAll('.work-item');
        projectCards.forEach(el => this.observer.observe(el));

        // Borders
        const borders = document.querySelectorAll('.border');
        borders.forEach(el => this.observer.observe(el));

        // Buttons
        const buttons = document.querySelectorAll('.btn, .reel');
        buttons.forEach(el => this.observer.observe(el));

        // Header elements
        const headerElements = document.querySelectorAll('.header-contact-btn, .nav-toggle');
        headerElements.forEach(el => this.observer.observe(el));

        // Hero scroll indicator
        const heroScroll = document.querySelector('.home-hero__scroll');
        if (heroScroll) {
            this.observer.observe(heroScroll);
        }

        // Work item links - trigger clip-path animation
        const workLinks = document.querySelectorAll('.work-item__link');
        workLinks.forEach(el => {
            this.observer.observe(el);
        });
    }
}

const scrollAnimations = new ScrollAnimations();

// =============================================================================
// 6. SERVICES SCROLL EFFECT
// =============================================================================

class ServicesScroll {
    constructor() {
        this.servicesSection = document.querySelector('.services');
        this.sticky = document.getElementById('services-sticky');
        this.serviceItems = document.querySelectorAll('.service-item');
        this.currentIndex = 0;

        if (this.servicesSection && this.serviceItems.length > 0) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            this.update();
        });
    }

    update() {
        if (!this.servicesSection) return;

        const rect = this.servicesSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress through section
        const scrollProgress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - windowHeight)));

        // Calculate which service should be visible
        const targetIndex = Math.min(
            Math.floor(scrollProgress * this.serviceItems.length),
            this.serviceItems.length - 1
        );

        // Update visible service
        if (targetIndex !== this.currentIndex) {
            this.showService(targetIndex);
            this.currentIndex = targetIndex;
        }
    }

    showService(index) {
        this.serviceItems.forEach((item, i) => {
            if (i === index) {
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
            } else if (i < index) {
                item.style.transform = 'translateY(-101%)';
                item.style.opacity = '0';
            } else {
                item.style.transform = 'translateY(101%)';
                item.style.opacity = '0';
            }
        });
    }
}

const servicesScroll = new ServicesScroll();

// =============================================================================
// 7. WEBGL BACKGROUND
// =============================================================================

class WebGLBackground {
    constructor() {
        this.canvas = document.getElementById('webgl-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = state.isMobile ? 30 : 60;
        this.mouseRadius = 150;

        this.init();
    }

    init() {
        // Set canvas size
        this.resize();

        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                originalX: 0,
                originalY: 0
            });
        }

        // Store original positions
        this.particles.forEach(p => {
            p.originalX = p.x;
            p.originalY = p.y;
        });

        // Bind events
        window.addEventListener('resize', () => this.resize());

        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // Clear canvas with slight opacity for trail effect
        this.ctx.fillStyle = 'rgba(255, 254, 251, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            // Move particle
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            const dx = state.mouseX - particle.x;
            const dy = state.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouseRadius) {
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * force * 3;
                particle.y -= Math.sin(angle) * force * 3;
            }

            // Return to original position slowly
            particle.x += (particle.originalX - particle.x) * 0.01;
            particle.y += (particle.originalY - particle.y) * 0.01;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(146, 146, 146, 0.3)';
            this.ctx.fill();
        });

        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(146, 146, 146, ${0.15 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

const webglBackground = new WebGLBackground();

// =============================================================================
// 8. VIEWPORT HEIGHT FIX (MOBILE)
// =============================================================================

function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--inner-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vp-height', `${window.innerHeight}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// =============================================================================
// 9. VIDEO LAZY LOADING
// =============================================================================

class VideoLoader {
    constructor() {
        this.videos = document.querySelectorAll('video');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '200px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;

                    // Load video
                    if (video.src || video.querySelector('source')) {
                        video.load();

                        // Play when loaded
                        video.addEventListener('loadeddata', () => {
                            video.play().catch(e => console.log('Video autoplay prevented:', e));
                            video.closest('.base-video')?.classList.add('base-video--loaded');
                        });
                    }

                    observer.unobserve(video);
                }
            });
        }, options);

        this.videos.forEach(video => observer.observe(video));
    }
}

const videoLoader = new VideoLoader();

// =============================================================================
// 10. IMAGE LAZY LOADING
// =============================================================================

class ImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '100px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    if (img.src) {
                        img.onload = () => {
                            img.classList.add('loaded');
                            img.closest('.base-image')?.classList.add('base-image--loaded');
                        };

                        // Trigger load if already cached
                        if (img.complete) {
                            img.onload();
                        }
                    }

                    observer.unobserve(img);
                }
            });
        }, options);

        this.images.forEach(img => observer.observe(img));
    }
}

const imageLoader = new ImageLoader();

// =============================================================================
// 11. ACTIVE NAVIGATION STATE
// =============================================================================

class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (this.sections.length > 0 && this.navLinks.length > 0) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            this.update();
        });
    }

    update() {
        const scrollPosition = window.pageYOffset + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

const activeNavigation = new ActiveNavigation();

// =============================================================================
// 12. SMOOTH ANCHOR SCROLLING
// =============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed header

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// =============================================================================
// 13. HERO TITLE REVEAL
// =============================================================================

window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.home-hero__title');
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.pointerEvents = 'all';
        }, 500);
    }
});

// =============================================================================
// 14. BUTTON HOVER EFFECTS
// =============================================================================

const buttons = document.querySelectorAll('.btn, .work-item__link, .service-item');

buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        customCursor.setLabel('View');
    });

    btn.addEventListener('mouseleave', () => {
        customCursor.clearLabel();
    });
});

// =============================================================================
// 15. RESIZE HANDLER
// =============================================================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Update state
        state.isMobile = window.innerWidth < 768;
        state.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        state.isDesktop = window.innerWidth >= 1024;
        state.windowHeight = window.innerHeight;
        state.windowWidth = window.innerWidth;

        // Refresh animations if needed
        console.log('Window resized:', state.windowWidth, 'x', state.windowHeight);
    }, 250);
});

// =============================================================================
// 16. HEADER SCROLL EFFECT
// =============================================================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('header--scrolled');
    } else {
        header.classList.add('header--scrolled');
    }

    lastScroll = currentScroll;
});

// =============================================================================
// 17. PRELOADER / PAGE TRANSITION
// =============================================================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.home-hero .anim-line');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
});

// =============================================================================
// 18. CONSOLE GREETING
// =============================================================================

console.log(
    '%c Ashfall Studio Clone ',
    'background: #EAFFB0; color: #212121; font-size: 16px; padding: 10px; font-weight: bold;'
);
console.log(
    '%c Pixel-perfect recreation ',
    'background: #212121; color: #EAFFB0; font-size: 12px; padding: 5px;'
);

// =============================================================================
// 19. PERFORMANCE MONITORING
// =============================================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// =============================================================================
// 20. ERROR HANDLING
// =============================================================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export for debugging
window.ashfall = {
    state,
    smoothScroll,
    customCursor,
    mobileNav,
    scrollAnimations,
    servicesScroll,
    webglBackground
};
