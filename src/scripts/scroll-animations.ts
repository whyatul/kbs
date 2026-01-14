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
            // Set initial state
            (el as HTMLElement).style.opacity = '0';
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
        const duration = parseInt(element.dataset.duration || '800') / 1000;

        // Define animation configurations
        const animations: Record<string, any> = {
            'fade-up': () => animate(element, 
                { opacity: [0, 1], transform: ['translateY(60px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'fade-down': () => animate(element,
                { opacity: [0, 1], transform: ['translateY(-60px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'fade-left': () => animate(element,
                { opacity: [0, 1], transform: ['translateX(60px)', 'translateX(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'fade-right': () => animate(element,
                { opacity: [0, 1], transform: ['translateX(-60px)', 'translateX(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'zoom-in': () => animate(element,
                { opacity: [0, 1], transform: ['scale(0.8)', 'scale(1)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'zoom-out': () => animate(element,
                { opacity: [0, 1], transform: ['scale(1.1)', 'scale(1)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'flip-up': () => animate(element,
                { opacity: [0, 1], transform: ['perspective(1000px) rotateX(90deg) translateY(40px)', 'perspective(1000px) rotateX(0deg) translateY(0px)'] },
                { duration: duration + 0.2, delay, easing: 'ease-out' }
            ),
            'rotate-in': () => animate(element,
                { opacity: [0, 1], transform: ['rotate(-10deg) scale(0.9)', 'rotate(0deg) scale(1)'] },
                { duration, delay, easing: spring({ stiffness: 300, damping: 20 }) }
            ),
            'blur-in': () => animate(element,
                { opacity: [0, 1], filter: ['blur(10px)', 'blur(0px)'], transform: ['translateY(30px)', 'translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            ),
            'slide-reveal': () => animate(element,
                { opacity: [0, 1], transform: ['translateY(100px)', 'translateY(0px)'] },
                { duration: duration + 0.2, delay, easing: 'ease-out' }
            ),
            'bounce-in': () => animate(element,
                { opacity: [0, 1], transform: ['translateY(80px) scale(0.85)', 'translateY(0px) scale(1)'] },
                { duration: duration + 0.4, delay, easing: spring({ stiffness: 200, damping: 15 }) }
            ),
            'skew-in': () => animate(element,
                { opacity: [0, 1], transform: ['skewY(6deg) translateY(40px)', 'skewY(0deg) translateY(0px)'] },
                { duration, delay, easing: 'ease-out' }
            )
        };

        const animFunc = animations[animationType || 'fade-up'];
        if (animFunc) {
            animFunc();
        } else {
            // Fallback: Show element without animation
            element.style.opacity = '1';
            element.style.transform = 'none';
        }
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
        const staggerDelayMs = parseInt(container.dataset.staggerDelay || '100');
        const animationType = container.dataset.stagger || 'fade-up';

        children.forEach((child) => {
            (child as HTMLElement).style.opacity = '0';
        });

        const baseConfig: Record<string, any> = {
            'fade-up': {
                opacity: [0, 1],
                transform: ['translateY(50px)', 'translateY(0px)']
            },
            'fade-down': {
                opacity: [0, 1],
                transform: ['translateY(-50px)', 'translateY(0px)']
            },
            'zoom-in': {
                opacity: [0, 1],
                transform: ['scale(0.8)', 'scale(1)']
            },
            'slide-left': {
                opacity: [0, 1],
                transform: ['translateX(60px)', 'translateX(0px)']
            },
            'slide-right': {
                opacity: [0, 1],
                transform: ['translateX(-60px)', 'translateX(0px)']
            },
            'rotate-stagger': {
                opacity: [0, 1],
                transform: ['rotate(-15deg) translateY(40px)', 'rotate(0deg) translateY(0px)']
            },
            'cascade': {
                opacity: [0, 1],
                transform: ['translateY(80px) translateX(-30px) rotate(-5deg)', 'translateY(0px) translateX(0px) rotate(0deg)']
            }
        };

        const config = baseConfig[animationType] || baseConfig['fade-up'];
        
        animate(
            children,
            config,
            {
                duration: 0.8,
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

// Image Card Hover Animation with Motion One
function setupCardAnimations() {
    const cards = document.querySelectorAll('.anime-card');

    cards.forEach((card) => {
        const cardEl = card as HTMLElement;
        const image = cardEl.querySelector('.anime-card-image');
        const content = cardEl.querySelector('.anime-card-content');
        const overlay = cardEl.querySelector('.anime-card-overlay');

        cardEl.addEventListener('mouseenter', () => {
            if (image) {
                animate(image, { transform: 'scale(1.1)' }, { duration: 0.6, easing: 'ease-out' });
            }

            if (overlay) {
                animate(overlay, { opacity: [0.3, 0.7] }, { duration: 0.4, easing: 'ease-out' });
            }

            if (content) {
                animate(
                    content,
                    { transform: ['translateY(-10px)', 'translateY(0px)'], opacity: [0.8, 1] },
                    { duration: 0.4, easing: 'ease-out' }
                );
            }
        });

        cardEl.addEventListener('mouseleave', () => {
            if (image) {
                animate(image, { transform: 'scale(1)' }, { duration: 0.6, easing: 'ease-out' });
            }

            if (overlay) {
                animate(overlay, { opacity: 0.3 }, { duration: 0.4, easing: 'ease-out' });
            }
        });
    });
}

// Floating Animation for decorative elements
function setupFloatingElements() {
    const floatingElements = document.querySelectorAll('[data-float]');

    floatingElements.forEach((el, index) => {
        const element = el as HTMLElement;
        const amplitude = parseFloat(element.dataset.floatAmplitude || '20');
        const duration = (parseInt(element.dataset.floatDuration || '3000') + (index * 200)) / 1000;

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

// Counter Animation for Stats
function setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    const endValue = element.dataset.counter || '0';
                    const duration = parseInt(element.dataset.counterDuration || '2000') / 1000;

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

// Text Reveal Animation
function setupTextRevealAnimations() {
    const textElements = document.querySelectorAll('[data-text-reveal]');

    const textObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    const text = element.textContent || '';
                    const type = element.dataset.textReveal || 'words';

                    if (type === 'chars') {
                        // Split into characters
                        element.innerHTML = text.split('').map((char) =>
                            `<span class="char-reveal" style="display:inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
                        ).join('');

                        const chars = element.querySelectorAll('.char-reveal');
                        animate(
                            chars,
                            { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0px)'] },
                            { duration: 0.6, delay: stagger(0.03), easing: 'ease-out' }
                        );
                    } else {
                        // Split into words
                        element.innerHTML = text.split(' ').map((word) =>
                            `<span class="word-reveal" style="display:inline-block; margin-right: 0.25em;">${word}</span>`
                        ).join('');

                        const words = element.querySelectorAll('.word-reveal');
                        animate(
                            words,
                            { 
                                opacity: [0, 1], 
                                transform: ['perspective(1000px) rotateX(90deg) translateY(40px)', 'perspective(1000px) rotateX(0deg) translateY(0px)']
                            },
                            { duration: 0.8, delay: stagger(0.08), easing: 'ease-out' }
                        );
                    }

                    textObserver.unobserve(element);
                }
            });
        },
        { threshold: 0.3 }
    );

    textElements.forEach((el) => {
        (el as HTMLElement).style.opacity = '0';
        textObserver.observe(el);
    });

    // Make text visible after animation starts
    setTimeout(() => {
        textElements.forEach((el) => {
            (el as HTMLElement).style.opacity = '1';
        });
    }, 100);
}

// Line Drawing Animation for SVGs
function setupLineDrawAnimations() {
    const svgElements = document.querySelectorAll('[data-line-draw]');

    const lineObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const svg = entry.target as SVGElement;
                    const paths = svg.querySelectorAll('path, line, circle, rect, polygon');

                    const pathArray = Array.from(paths).map((path) => {
                        if (path instanceof SVGGeometryElement) {
                            const length = path.getTotalLength();
                            (path as SVGElement).style.strokeDasharray = length.toString();
                            (path as SVGElement).style.strokeDashoffset = length.toString();
                            return { element: path, length };
                        }
                        return null;
                    }).filter(Boolean);

                    pathArray.forEach((item, index) => {
                        if (item) {
                            setTimeout(() => {
                                animate(
                                    item.element,
                                    { strokeDashoffset: [item.length, 0] },
                                    { duration: 1.5, easing: 'ease-in-out' }
                                );
                            }, index * 100);
                        }
                    });

                    lineObserver.unobserve(svg);
                }
            });
        },
        { threshold: 0.5 }
    );

    svgElements.forEach((svg) => lineObserver.observe(svg));
}

// Magnetic Effect for Interactive Elements
function setupMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach((el) => {
        const element = el as HTMLElement;
        const strength = parseFloat(element.dataset.magnetic || '0.3');

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            animate(
                element,
                { transform: `translate(${x * strength}px, ${y * strength}px)` },
                { duration: 0.2, easing: 'ease-out' }
            );
        });

        element.addEventListener('mouseleave', () => {
            animate(
                element,
                { transform: 'translate(0px, 0px)' },
                { duration: 0.4, easing: spring({ stiffness: 300, damping: 20 }) }
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
