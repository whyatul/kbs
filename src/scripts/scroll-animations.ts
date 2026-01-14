// Scroll Animation Controller using Motion One
import { animate, stagger, spring } from 'motion';

class ScrollAnimationController {
    private observer: IntersectionObserver;
    private animatedElements: Set<Element> = new Set();

    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        this.init();
    }

    private init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupObservers());
        } else {
            this.setupObservers();
        }
    }

    private setupObservers() {
        // Observe all elements with scroll animation classes
        const animatableElements = document.querySelectorAll('[data-animate]');
        animatableElements.forEach((el) => {
            // Content is visible by default - no opacity hiding
            this.observer.observe(el);
        });

        // Setup parallax elements
        this.setupParallax();

        // Setup stagger animations for grids
        this.setupStaggerObservers();
    }

    private handleIntersection(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                this.animatedElements.add(entry.target);
                this.animateElement(entry.target as HTMLElement);
            }
        });
    }

    private animateElement(element: HTMLElement) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay || '0') / 1000; // Convert to seconds
        const duration = 0.3; // Minimal 300ms duration

        // Define minimal animation configurations
        const animations: Record<string, any> = {
            'fade-up': () => animate(element, 
                { transform: ['translateY(20px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'fade-down': () => animate(element,
                { transform: ['translateY(-20px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'fade-left': () => animate(element,
                { transform: ['translateX(20px)', 'translateX(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'fade-right': () => animate(element,
                { transform: ['translateX(-20px)', 'translateX(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'zoom-in': () => animate(element,
                { transform: ['scale(0.95)', 'scale(1)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'zoom-out': () => animate(element,
                { transform: ['scale(1.05)', 'scale(1)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'flip-up': () => animate(element,
                { transform: ['translateY(10px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'rotate-in': () => animate(element,
                { transform: ['scale(0.98)', 'scale(1)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'blur-in': () => animate(element,
                { transform: ['translateY(10px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'slide-reveal': () => animate(element,
                { transform: ['translateY(15px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'bounce-in': () => animate(element,
                { transform: ['translateY(15px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'skew-in': () => animate(element,
                { transform: ['translateY(10px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            )
        };

        const animFunc = animations[animationType || 'fade-up'];
        if (animFunc) {
            animFunc();
        }
        // Content is already visible, no fallback needed
    }

    private setupStaggerObservers() {
        const staggerContainers = document.querySelectorAll('[data-stagger]');

        const staggerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animatedElements.add(entry.target);
                        this.animateStaggerChildren(entry.target as HTMLElement);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
        );

        staggerContainers.forEach((container) => {
            staggerObserver.observe(container);
        });
    }

    private animateStaggerChildren(container: HTMLElement) {
        const children = Array.from(container.querySelectorAll('[data-stagger-item]'));
        const staggerDelayMs = 30; // Minimal 30ms stagger
        const animationType = container.dataset.stagger || 'fade-up';

        // Content is visible by default - no opacity hiding

        const baseConfig: Record<string, any> = {
            'fade-up': {
                transform: ['translateY(10px)', 'translateY(0px)']
            },
            'fade-down': {
                transform: ['translateY(-10px)', 'translateY(0px)']
            },
            'zoom-in': {
                transform: ['scale(0.98)', 'scale(1)']
            },
            'slide-left': {
                transform: ['translateX(10px)', 'translateX(0px)']
            },
            'slide-right': {
                transform: ['translateX(-10px)', 'translateX(0px)']
            },
            'rotate-stagger': {
                transform: ['translateY(10px)', 'translateY(0px)']
            },
            'cascade': {
                transform: ['translateY(10px)', 'translateY(0px)']
            }
        };

        const config = baseConfig[animationType] || baseConfig['fade-up'];
        
        animate(
            children,
            config,
            {
                duration: 0.2,
                delay: stagger(staggerDelayMs / 1000),
                easing: 'ease-out'
            }
        );
    }

    private setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach((el) => {
                const element = el as HTMLElement;
                const speed = parseFloat(element.dataset.parallax || '0.5');
                const direction = element.dataset.parallaxDirection || 'up';
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const scrollProgress = scrollY - elementTop + window.innerHeight;

                if (scrollProgress > 0 && scrollProgress < window.innerHeight + rect.height) {
                    let translateY = scrollProgress * speed * 0.1;

                    if (direction === 'down') {
                        translateY = -translateY;
                    }

                    element.style.transform = `translateY(${translateY}px)`;
                }
            });
        };

        // Throttle scroll handler for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// Image Card Hover Animation - Minimal
function setupCardAnimations() {
    // Card hover animations disabled to prevent first-hover background animation
    return;
}

// Floating Animation - Minimal
function setupFloatingElements() {
    const floatingElements = document.querySelectorAll('[data-float]');

    floatingElements.forEach((el) => {
        const element = el as HTMLElement;
        const amplitude = 10; // Minimal 10px movement
        const duration = 3; // 3 seconds

        animate(
            element,
            { transform: [`translateY(-${amplitude}px)`, `translateY(${amplitude}px)`] },
            {
                duration,
                direction: 'alternate',
                easing: 'ease-in-out',
                repeat: Infinity
            }
        );
    });
}

// Counter Animation - Simplified
function setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    const endValue = element.dataset.counter || '0';
                    const duration = 0.8; // Fast 800ms duration

                    // Check if it's a number
                    if (!isNaN(parseFloat(endValue))) {
                        const isFloat = endValue.includes('.');
                        const numericEnd = parseFloat(endValue);

                        animate(
                            (progress) => {
                                const currentValue = progress * numericEnd;
                                element.textContent = isFloat
                                    ? currentValue.toFixed(1)
                                    : Math.round(currentValue).toString();
                            },
                            { duration, easing: 'ease-out' }
                        );
                    }

                    counterObserver.unobserve(element);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
}

// Text Reveal - Disabled for performance (content already visible)
function setupTextRevealAnimations() {
    // Text is visible by default - no complex animations
    return;
}

// SVG Line Drawing - Disabled for performance
function setupLineDrawAnimations() {
    // SVGs are visible by default - no complex animations
    return;
}

// Magnetic Effect - Minimal movement
function setupMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach((el) => {
        const element = el as HTMLElement;
        const strength = 0.1; // Very minimal strength

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            animate(
                element,
                { transform: `translate(${x * strength}px, ${y * strength}px)` },
                { duration: 0.15, easing: 'ease-out' }
            );
        });

        element.addEventListener('mouseleave', () => {
            animate(
                element,
                { transform: 'translate(0px, 0px)' },
                { duration: 0.25, easing: 'ease-out' }
            );
        });
    });
}

// Initialize all animations
export function initScrollAnimations() {
    new ScrollAnimationController();
    setupCardAnimations();
    setupFloatingElements();
    setupCounterAnimations();
    setupTextRevealAnimations();
    setupLineDrawAnimations();
    setupMagneticEffect();
}

// Auto-initialize
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
}
