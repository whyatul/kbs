import anime from 'animejs';

// Scroll Animation Controller using Anime.js
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
        const delay = parseInt(element.dataset.delay || '0');
        const duration = parseInt(element.dataset.duration || '800');

        const animations: Record<string, anime.AnimeParams> = {
            'fade-up': {
                targets: element,
                opacity: [0, 1],
                translateY: [60, 0],
                duration,
                delay,
                easing: 'easeOutExpo'
            },
            'fade-down': {
                targets: element,
                opacity: [0, 1],
                translateY: [-60, 0],
                duration,
                delay,
                easing: 'easeOutExpo'
            },
            'fade-left': {
                targets: element,
                opacity: [0, 1],
                translateX: [60, 0],
                duration,
                delay,
                easing: 'easeOutExpo'
            },
            'fade-right': {
                targets: element,
                opacity: [0, 1],
                translateX: [-60, 0],
                duration,
                delay,
                easing: 'easeOutExpo'
            },
            'zoom-in': {
                targets: element,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration,
                delay,
                easing: 'easeOutExpo'
            },
            'zoom-out': {
                targets: element,
                opacity: [0, 1],
                scale: [1.1, 1],
                duration,
                delay,
                easing: 'easeOutExpo'
            },
            'flip-up': {
                targets: element,
                opacity: [0, 1],
                rotateX: [90, 0],
                translateY: [40, 0],
                duration: duration + 200,
                delay,
                easing: 'easeOutExpo'
            },
            'rotate-in': {
                targets: element,
                opacity: [0, 1],
                rotate: [-10, 0],
                scale: [0.9, 1],
                duration,
                delay,
                easing: 'easeOutElastic(1, 0.5)'
            },
            'blur-in': {
                targets: element,
                opacity: [0, 1],
                filter: ['blur(10px)', 'blur(0px)'],
                translateY: [30, 0],
                duration,
                delay,
                easing: 'easeOutExpo'
            },
            'slide-reveal': {
                targets: element,
                opacity: [0, 1],
                translateY: [100, 0],
                duration: duration + 200,
                delay,
                easing: 'easeOutQuart'
            },
            'bounce-in': {
                targets: element,
                opacity: [0, 1],
                translateY: [80, 0],
                scale: [0.85, 1],
                duration: duration + 400,
                delay,
                easing: 'easeOutElastic(1, 0.6)'
            },
            'skew-in': {
                targets: element,
                opacity: [0, 1],
                skewY: [6, 0],
                translateY: [40, 0],
                duration,
                delay,
                easing: 'easeOutQuart'
            }
        };

        const animConfig = animations[animationType || 'fade-up'];
        if (animConfig) {
            anime(animConfig);
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
        const children = container.querySelectorAll('[data-stagger-item]');
        const staggerDelay = parseInt(container.dataset.staggerDelay || '100');
        const animationType = container.dataset.stagger || 'fade-up';

        children.forEach((child) => {
            (child as HTMLElement).style.opacity = '0';
        });

        const baseConfig: Record<string, anime.AnimeParams> = {
            'fade-up': {
                opacity: [0, 1],
                translateY: [50, 0],
                easing: 'easeOutExpo'
            },
            'fade-down': {
                opacity: [0, 1],
                translateY: [-50, 0],
                easing: 'easeOutExpo'
            },
            'zoom-in': {
                opacity: [0, 1],
                scale: [0.8, 1],
                easing: 'easeOutExpo'
            },
            'slide-left': {
                opacity: [0, 1],
                translateX: [60, 0],
                easing: 'easeOutExpo'
            },
            'slide-right': {
                opacity: [0, 1],
                translateX: [-60, 0],
                easing: 'easeOutExpo'
            },
            'rotate-stagger': {
                opacity: [0, 1],
                rotate: [-15, 0],
                translateY: [40, 0],
                easing: 'easeOutElastic(1, 0.5)'
            },
            'cascade': {
                opacity: [0, 1],
                translateY: [80, 0],
                translateX: [-30, 0],
                rotate: [-5, 0],
                easing: 'easeOutQuart'
            }
        };

        anime({
            targets: children,
            ...baseConfig[animationType],
            duration: 800,
            delay: anime.stagger(staggerDelay)
        });
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

// Image Card Hover Animation with Anime.js
function setupCardAnimations() {
    const cards = document.querySelectorAll('.anime-card');

    cards.forEach((card) => {
        const cardEl = card as HTMLElement;
        const image = cardEl.querySelector('.anime-card-image');
        const content = cardEl.querySelector('.anime-card-content');
        const overlay = cardEl.querySelector('.anime-card-overlay');

        cardEl.addEventListener('mouseenter', () => {
            if (image) {
                anime({
                    targets: image,
                    scale: 1.1,
                    duration: 600,
                    easing: 'easeOutQuart'
                });
            }

            if (overlay) {
                anime({
                    targets: overlay,
                    opacity: [0.3, 0.7],
                    duration: 400,
                    easing: 'easeOutQuart'
                });
            }

            if (content) {
                anime({
                    targets: content,
                    translateY: [-10, 0],
                    opacity: [0.8, 1],
                    duration: 400,
                    easing: 'easeOutQuart'
                });
            }
        });

        cardEl.addEventListener('mouseleave', () => {
            if (image) {
                anime({
                    targets: image,
                    scale: 1,
                    duration: 600,
                    easing: 'easeOutQuart'
                });
            }

            if (overlay) {
                anime({
                    targets: overlay,
                    opacity: 0.3,
                    duration: 400,
                    easing: 'easeOutQuart'
                });
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
        const duration = parseInt(element.dataset.floatDuration || '3000');

        anime({
            targets: element,
            translateY: [-amplitude, amplitude],
            duration: duration + (index * 200),
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true
        });
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
                    const duration = parseInt(element.dataset.counterDuration || '2000');

                    // Check if it's a number
                    if (!isNaN(parseFloat(endValue))) {
                        const obj = { value: 0 };
                        const isFloat = endValue.includes('.');

                        anime({
                            targets: obj,
                            value: parseFloat(endValue),
                            duration,
                            easing: 'easeOutExpo',
                            round: isFloat ? 10 : 1,
                            update: () => {
                                element.textContent = isFloat
                                    ? obj.value.toFixed(1)
                                    : Math.round(obj.value).toString();
                            }
                        });
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

                        anime({
                            targets: element.querySelectorAll('.char-reveal'),
                            opacity: [0, 1],
                            translateY: [30, 0],
                            duration: 600,
                            delay: anime.stagger(30),
                            easing: 'easeOutExpo'
                        });
                    } else {
                        // Split into words
                        element.innerHTML = text.split(' ').map((word) =>
                            `<span class="word-reveal" style="display:inline-block; margin-right: 0.25em;">${word}</span>`
                        ).join('');

                        anime({
                            targets: element.querySelectorAll('.word-reveal'),
                            opacity: [0, 1],
                            translateY: [40, 0],
                            rotateX: [90, 0],
                            duration: 800,
                            delay: anime.stagger(80),
                            easing: 'easeOutExpo'
                        });
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

                    paths.forEach((path) => {
                        if (path instanceof SVGGeometryElement) {
                            const length = path.getTotalLength();
                            (path as SVGElement).style.strokeDasharray = length.toString();
                            (path as SVGElement).style.strokeDashoffset = length.toString();
                        }
                    });

                    anime({
                        targets: paths,
                        strokeDashoffset: [anime.setDashoffset, 0],
                        duration: 1500,
                        delay: anime.stagger(100),
                        easing: 'easeInOutQuart'
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

            anime({
                targets: element,
                translateX: x * strength,
                translateY: y * strength,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });

        element.addEventListener('mouseleave', () => {
            anime({
                targets: element,
                translateX: 0,
                translateY: 0,
                duration: 400,
                easing: 'easeOutElastic(1, 0.5)'
            });
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
