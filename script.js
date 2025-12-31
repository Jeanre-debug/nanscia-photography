/* ================================
   LUMINA BY NANSCIA - STUNNING SCRIPTS
   Jaw-Dropping Photography Portfolio
   ================================ */

// LocalStorage keys
const STORAGE_KEYS = {
    PHOTOS: 'lumina_photos',
    CATEGORIES: 'lumina_categories'
};

// Helper functions to load from localStorage
function getPhotosFromStorage() {
    try {
        const photosJSON = localStorage.getItem(STORAGE_KEYS.PHOTOS);
        if (!photosJSON) return [];

        const photos = JSON.parse(photosJSON);
        return photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error loading photos:', error);
        return [];
    }
}

function getCategoriesFromStorage() {
    try {
        const categoriesJSON = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (!categoriesJSON) return [
            { id: 'portrait', name: 'Portrait' },
            { id: 'wedding', name: 'Wedding' },
            { id: 'nature', name: 'Nature' },
            { id: 'lifestyle', name: 'Lifestyle' }
        ];
        return JSON.parse(categoriesJSON);
    } catch (error) {
        return [
            { id: 'portrait', name: 'Portrait' },
            { id: 'wedding', name: 'Wedding' },
            { id: 'nature', name: 'Nature' },
            { id: 'lifestyle', name: 'Lifestyle' }
        ];
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initParticles();
    initNavigation();
    initHeroAnimations();
    loadPortfolioPhotos();
    initScrollAnimations();
    initPortfolioFilter();
    initTestimonialSlider();
    initCounterAnimation();
    initContactForm();
    initSmoothScroll();
    initBackToTop();
    initMagneticButtons();
});

/* ================================
   STUNNING LOADER
   ================================ */
function initLoader() {
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 2800);
    });
}

/* ================================
   CUSTOM CURSOR - MAGNETIC EFFECT
   ================================ */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    // Check for touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, input, textarea, select, .service-card');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // Click animation
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
    });
}

/* ================================
   FLOATING PARTICLES
   ================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (15 + Math.random() * 20) + 's';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.opacity = 0.1 + Math.random() * 0.3;
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

/* ================================
   NAVIGATION
   ================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add background on scroll
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show nav on scroll direction
        if (currentScroll > lastScroll && currentScroll > 300) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ================================
   HERO ANIMATIONS
   ================================ */
function initHeroAnimations() {
    // Counter animation for hero stats
    const heroStats = document.querySelectorAll('.hero-stat .stat-num');

    setTimeout(() => {
        heroStats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            animateCounter(stat, target, 2000);
        });
    }, 3500);

    // Parallax on mouse move
    const heroVisual = document.querySelector('.hero-visual');
    const shapes = document.querySelectorAll('.shape');

    if (heroVisual) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 50;
            const y = (e.clientY - window.innerHeight / 2) / 50;

            heroVisual.style.transform = `translate(${x}px, ${y}px)`;

            shapes.forEach((shape, index) => {
                const factor = (index + 1) * 0.5;
                shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }
}

function animateCounter(element, target, duration) {
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

/* ================================
   LOAD PORTFOLIO PHOTOS FROM LOCALSTORAGE
   ================================ */
async function loadPortfolioPhotos() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;

    try {
        const photos = getPhotosFromStorage();

        if (photos.length === 0) {
            initScrollAnimations();
            return;
        }

        portfolioGrid.innerHTML = '';

        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = `portfolio-item ${photo.size === 'tall' ? 'tall' : ''} ${photo.size === 'wide' ? 'wide' : ''} reveal-item`;
            item.dataset.category = photo.category;

            const imageUrl = photo.imageUrl;
            const number = String(index + 1).padStart(2, '0');

            item.innerHTML = `
                <div class="portfolio-image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;">
                    <div class="portfolio-overlay">
                        <div class="overlay-content">
                            <span class="portfolio-category">${capitalizeFirst(photo.category)}</span>
                            <h3 class="portfolio-title">${photo.title}</h3>
                            <p class="portfolio-desc">Click to view full image</p>
                            <button class="portfolio-btn view-photo-btn" data-url="${imageUrl}" data-title="${photo.title}">
                                <span>View Project</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="portfolio-number">${number}</div>
                </div>
            `;

            portfolioGrid.appendChild(item);
        });

        // Add click handlers for view buttons
        document.querySelectorAll('.view-photo-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openLightbox(btn.dataset.url, btn.dataset.title);
            });
        });

        // Update filter buttons
        updateFilterButtons(photos);

        // Re-initialize animations
        initScrollAnimations();
        initPortfolioFilter();

    } catch (error) {
        console.log('Error loading photos:', error);
        initScrollAnimations();
    }
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateFilterButtons(photos) {
    const filtersContainer = document.querySelector('.portfolio-filters');
    if (!filtersContainer) return;

    const photoCategories = [...new Set(photos.map(p => p.category))];
    const allCategories = getCategoriesFromStorage();

    filtersContainer.innerHTML = '<button class="filter-btn active" data-filter="all"><span>All Works</span></button>';

    allCategories.forEach(cat => {
        if (photoCategories.includes(cat.id)) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.filter = cat.id;
            btn.innerHTML = `<span>${cat.name}</span>`;
            filtersContainer.appendChild(btn);
        }
    });
}

/* ================================
   LIGHTBOX
   ================================ */
function openLightbox(imageUrl, title) {
    let lightbox = document.getElementById('lightbox');

    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
            }
            .lightbox.active {
                opacity: 1;
                visibility: visible;
            }
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                transform: scale(0.9);
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .lightbox.active .lightbox-content {
                transform: scale(1);
            }
            .lightbox-image {
                max-width: 100%;
                max-height: 85vh;
                object-fit: contain;
                border-radius: 0;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            }
            .lightbox-close {
                position: absolute;
                top: -50px;
                right: 0;
                background: none;
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                font-size: 1.5rem;
                width: 50px;
                height: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .lightbox-close:hover {
                background: #d4af37;
                border-color: #d4af37;
                transform: rotate(90deg);
            }
            .lightbox-caption {
                text-align: center;
                color: white;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.5rem;
                margin-top: 20px;
                font-style: italic;
                letter-spacing: 0.05em;
            }
        `;
        document.head.appendChild(style);

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    lightbox.querySelector('.lightbox-image').src = imageUrl;
    lightbox.querySelector('.lightbox-caption').textContent = title;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ================================
   SCROLL ANIMATIONS
   ================================ */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* ================================
   PORTFOLIO FILTER
   ================================ */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach((item, index) => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ================================
   TESTIMONIAL SLIDER
   ================================ */
function initTestimonialSlider() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('testimonial-dots');
    const testimonials = document.querySelectorAll('.testimonial');

    if (!track || testimonials.length === 0) return;

    let currentIndex = 0;
    const totalSlides = testimonials.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.testimonial-dots .dot');

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    let autoPlay = setInterval(nextSlide, 6000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 6000);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });
}

/* ================================
   COUNTER ANIMATION
   ================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target, 2000);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

/* ================================
   CONTACT FORM
   ================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderBottomColor = '#e74c3c';
            } else {
                input.style.borderBottomColor = '';
            }
        });

        const emailInput = form.querySelector('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.style.borderBottomColor = '#e74c3c';
        }

        if (isValid) {
            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.classList.add('loading');

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.style.background = '#27ae60';

                setTimeout(() => {
                    form.reset();
                    submitBtn.style.background = '';
                }, 2000);
            }, 2000);

            console.log('Form submitted:', data);
        }
    });
}

/* ================================
   SMOOTH SCROLL
   ================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ================================
   BACK TO TOP
   ================================ */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ================================
   MAGNETIC BUTTONS
   ================================ */
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

/* ================================
   PARALLAX EFFECTS
   ================================ */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero gradients parallax
    const heroGradient1 = document.querySelector('.hero-gradient-1');
    const heroGradient2 = document.querySelector('.hero-gradient-2');

    if (heroGradient1) {
        heroGradient1.style.transform = `translate(${scrolled * 0.02}px, ${scrolled * 0.05}px)`;
    }
    if (heroGradient2) {
        heroGradient2.style.transform = `translate(${-scrolled * 0.02}px, ${scrolled * 0.03}px)`;
    }
});

/* ================================
   KEYBOARD NAVIGATION
   ================================ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        const navToggle = document.getElementById('nav-toggle');

        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeLightbox();
    }
});
