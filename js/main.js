/**
 * ATLAS Design - Main JavaScript
 * Common scripts for all website pages
 */

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initProjectsFilter();
    initFurnitureFilter();
});

/**
 * Load header from partial file
 */
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = data;
                // Set active link
                setActiveNavLink();
                // Re-init header functions
                initHeaderScroll();
                initMobileMenu();
            }
        })
        .catch(error => console.error('Error loading header:', error));
}

/**
 * Load footer from partial file
 */
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading footer:', error));
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');

    if (!mobileMenuBtn || !navUl) return;

    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);

        navUl.style.display = isExpanded ? 'none' : 'flex';
        navUl.style.flexDirection = 'column';
        navUl.style.position = 'absolute';
        navUl.style.top = '100%';
        navUl.style.left = '0';
        navUl.style.right = '0';
        navUl.style.background = 'white';
        navUl.style.padding = '1rem';
        navUl.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    });
}

/**
 * Scroll animations for fade-in elements
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Projects filter functionality
 */
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Switch active class
            filterButtons.forEach(btn => {
                btn.classList.remove('btn-gold');
                btn.classList.add('btn');
            });
            button.classList.remove('btn');
            button.classList.add('btn-gold');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Furniture filter functionality
 */
function initFurnitureFilter() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const furnitureCards = document.querySelectorAll('.furniture-card');

    if (!filterButtons.length || !furnitureCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('btn-gold');
                btn.classList.add('btn');
            });
            button.classList.remove('btn');
            button.classList.add('btn-gold');

            const filter = button.getAttribute('data-filter');

            furnitureCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Load project data and render project detail page
 */
function initProjectDetailPage() {
    const projectDetailContainer = document.querySelector('.project-detail');
    if (!projectDetailContainer) return;

    // Get project ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        console.error('No project ID specified');
        return;
    }

    // Load project data from JSON
    fetch('js/projects-data.json')
        .then(response => response.json())
        .then(data => {
            const project = data.projects.find(p => p.id === projectId);
            if (!project) {
                console.error('Project not found:', projectId);
                return;
            }
            renderProjectDetail(project);
        })
        .catch(error => console.error('Error loading project data:', error));
}

/**
 * Render project detail page with slider
 */
function renderProjectDetail(project) {
    // Load images from project folder
    loadProjectImages(project.folder)
        .then(images => {
            const projectSlider = document.querySelector('.project-slider');
            const projectInfo = document.querySelector('.project-detail-info');
            const projectDescription = document.querySelector('.project-detail-description');
            const projectFeaturesSection = document.querySelector('.project-detail-section');

            if (projectSlider) {
                projectSlider.innerHTML = `
                    <div class="slider-main-wrapper">
                        <div class="slider-container" id="slider-container">
                            ${images.map((img, index) => `
                                <img src="${img}" alt="${project.name} - Image ${index + 1}" class="${index === 0 ? 'active' : ''}" data-index="${index}" loading="${index === 0 ? 'eager' : 'lazy'}">
                            `).join('')}
                            <button class="slider-btn prev" onclick="slideProject(-1)">&#10094;</button>
                            <button class="slider-btn next" onclick="slideProject(1)">&#10095;</button>
                        </div>
                    </div>
                    <div class="slider-thumbnails" id="slider-thumbnails">
                        <!-- Thumbnails rendered by updateThumbnails() -->
                    </div>
                `;
            }

            if (projectInfo) {
                projectInfo.innerHTML = `
                    <span class="section-label">${project.categoryLabel}</span>
                    <h2>${project.name}</h2>
                    <div class="project-meta">
                        <p>
                            <span>Area:</span>
                            <span>${project.area}</span>
                        </p>
                        <p>
                            <span>Location:</span>
                            <span>${project.location}</span>
                        </p>
                        <p>
                            <span>Year:</span>
                            <span>${project.year}</span>
                        </p>
                        <p>
                            <span>Category:</span>
                            <span>${project.categoryLabel}</span>
                        </p>
                    </div>
                    <a href="contact.html" class="btn btn-gold btn-full">Discuss a Similar Project</a>
                `;
            }

            if (projectDescription) {
                projectDescription.innerHTML = `
                    <h3>About the Project</h3>
                    <p>${project.description}</p>
                `;
            }

            // Render features if available
            if (projectFeaturesSection && project.features) {
                projectFeaturesSection.style.display = 'block';
                projectFeaturesSection.innerHTML = `
                    <h3>Project Features</h3>
                    <div class="project-features">
                        <div class="project-feature">
                            <h4>Color Palette</h4>
                            <p>${project.features.colorPalette || '—'}</p>
                        </div>
                        <div class="project-feature">
                            <h4>Lighting</h4>
                            <p>${project.features.lighting || '—'}</p>
                        </div>
                        <div class="project-feature">
                            <h4>Materials</h4>
                            <p>${project.features.materials || '—'}</p>
                        </div>
                    </div>
                `;
            } else if (projectFeaturesSection) {
                projectFeaturesSection.style.display = 'none';
            }

            // Initialize slider state
            window.currentSlide = 0;
            window.allImages = images;

            updateThumbnails();
        })
        .catch(error => console.error('Error loading images:', error));
}

/**
 * Load images from project folder
 * New structure: img/projects/project/{folder}/{1.webp, 2.webp, ...} or {1.jpg, 2.jpg, ...}
 */
async function loadProjectImages(folderPath) {
    const maxImages = 150;
    const images = [];

    // Try numbered images (1.webp, 2.webp, etc.) - WebP first, then JPG, JPEG, PNG
    for (let i = 1; i <= maxImages; i++) {
        for (const ext of ['.webp', '.jpg', '.jpeg', '.png']) {
            const imgPath = `${folderPath}/${i}${ext}`;
            if (await imageExists(imgPath)) {
                images.push(imgPath);
                break;
            }
        }
    }

    return images;
}

/**
 * Check if image exists
 */
async function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

/**
 * Slide project images
 */
function slideProject(direction) {
    const container = document.getElementById('slider-container');
    if (!container) return;

    const images = container.querySelectorAll('img');
    if (images.length === 0) return;

    // Remove active class from current
    images[window.currentSlide].classList.remove('active');

    // Calculate new slide
    window.currentSlide += direction;
    if (window.currentSlide < 0) window.currentSlide = images.length - 1;
    if (window.currentSlide >= images.length) window.currentSlide = 0;

    // Add active class to new
    images[window.currentSlide].classList.add('active');
    
    // Preload next and previous images
    preloadAdjacentImages();

    updateThumbnails();
}

/**
 * Preload adjacent images for smoother navigation
 */
function preloadAdjacentImages() {
    const container = document.getElementById('slider-container');
    if (!container || !window.allImages) return;

    const images = container.querySelectorAll('img');
    const total = images.length;
    
    // Preload next image
    const nextIdx = (window.currentSlide + 1) % total;
    const nextImg = images[nextIdx];
    if (nextImg && !nextImg.src) {
        nextImg.src = window.allImages[nextIdx];
    }
    
    // Preload previous image
    const prevIdx = (window.currentSlide - 1 + total) % total;
    const prevImg = images[prevIdx];
    if (prevImg && !prevImg.src) {
        prevImg.src = window.allImages[prevIdx];
    }
}

/**
 * Go to specific slide
 */
function goToSlide(index) {
    const container = document.getElementById('slider-container');
    if (!container) return;

    const images = container.querySelectorAll('img');
    if (images.length === 0) return;

    // Remove active class from current
    images[window.currentSlide].classList.remove('active');

    // Set new slide
    window.currentSlide = index;

    // Add active class to new
    images[window.currentSlide].classList.add('active');

    updateThumbnails();
}

/**
 * Update thumbnails - show 5 with active in center (2 prev + active + 2 next)
 */
function updateThumbnails() {
    const thumbnailsContainer = document.getElementById('slider-thumbnails');
    if (!thumbnailsContainer || !window.allImages) return;

    const totalImages = window.allImages.length;
    const currentSlide = window.currentSlide;

    // Calculate start index to show 5 thumbnails with active in center
    let startIndex = currentSlide - 2;

    // Handle edge cases
    if (startIndex < 0) startIndex = 0;
    if (startIndex + 5 > totalImages) startIndex = Math.max(0, totalImages - 5);

    // Generate thumbnails HTML
    let thumbnailsHTML = '';
    for (let i = startIndex; i < startIndex + 5 && i < totalImages; i++) {
        const img = window.allImages[i];
        const isActive = i === currentSlide ? 'active' : '';
        thumbnailsHTML += `
            <img src="${img}"
                 alt="Thumbnail ${i + 1}"
                 class="${isActive}"
                 data-index="${i}"
                 onclick="goToSlide(${i})">
        `;
    }

    thumbnailsContainer.innerHTML = thumbnailsHTML;
}

// Initialize project detail page on load
document.addEventListener('DOMContentLoaded', function() {
    initProjectDetailPage();
});
