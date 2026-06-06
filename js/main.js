/* ==================== SITE INTERACTIVITY & LOGIC ==================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==================== MOBILE NAVIGATION TOGGLE ==================== */
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close');

    // Menu Show
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Menu Hide
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close menu when clicking nav link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    /* ==================== STICKY HEADER ==================== */
    const header = document.getElementById('header');
    const scrollHeader = () => {
        if (window.scrollY >= 50) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    };
    window.addEventListener('scroll', scrollHeader);
    scrollHeader(); // Run on load to verify initial position



    /* ==================== INTERSECTION OBSERVER: SCROLL REVEAL ==================== */
    const revealElements = document.querySelectorAll(
        '.about__quote-container, .about__expertise, .skill-card, .experience__card, .project__card, .cert-card, .education__item, .contact__info, .contact__form-wrapper'
    );
    
    // Add default reveal class if not present
    revealElements.forEach((el, index) => {
        if (!el.classList.contains('scroll-reveal-left') && !el.classList.contains('scroll-reveal-right')) {
            el.classList.add('scroll-reveal');
        }
        // Custom stagger delay for grid items
        if (el.classList.contains('skill-card') || el.classList.contains('cert-card')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==================== INTERSECTION OBSERVER: STATS COUNTERS ==================== */
    const statsSection = document.querySelector('.hero__stats');
    const statNumbers = document.querySelectorAll('.stat__number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60fps
            
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target + '+';
                }
            };
            updateCount();
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    startCounters();
                    countersStarted = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    /* ==================== ACTIVE SECTION NAVIGATION HIGHLIGHTER ==================== */
    const sections = document.querySelectorAll('section[id]');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href*=${id}]`);
            
            if (entry.isIntersecting && navLink) {
                document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('active-link'));
                navLink.classList.add('active-link');
            }
        });
    }, {
        threshold: 0.3, // Highlight when 30% of the section is visible
        rootMargin: '-20% 0px -40% 0px'
    });

    sections.forEach(section => navObserver.observe(section));

    /* ==================== PROJECT FILTER WITH ANIMATION ==================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project__card');

    // Make initial active project filter visible
    projectCards.forEach(card => {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const isMatch = filterValue === 'all' || card.classList.contains(filterValue);
                
                if (isMatch) {
                    card.style.display = 'flex';
                    // Stagger animation display
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==================== CONTACT FORM VALIDATION & WEB3FORMS SUBMISSION ==================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isValid = true;
            const nameInput    = document.getElementById('form-name');
            const emailInput   = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            // Regex for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Reset validation states
            document.querySelectorAll('.form__group').forEach(group => {
                group.classList.remove('invalid');
            });

            // Name validation
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Email validation
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Subject validation
            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Message validation
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = document.getElementById('form-submit-btn');
                const originalBtnHTML = submitBtn.innerHTML;

                // Show spinner
                submitBtn.innerHTML = 'Sending Message <i class="bx bx-loader-alt bx-spin"></i>';
                submitBtn.disabled = true;
                formStatus.className = 'form__status text-center';
                formStatus.innerHTML = '';

                try {
                    // WhatsApp Redirect Logic
                    const phone = "919074762136";
                    const messageBody = `Hello Lena, I am ${nameInput.value.trim()}.\n\n` +
                                        `Email: ${emailInput.value.trim()}\n` +
                                        `Subject: ${subjectInput.value.trim()}\n\n` +
                                        `Message:\n${messageInput.value.trim()}`;
                    
                    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageBody)}`;
                    
                    // Open WhatsApp in a new tab
                    window.open(waUrl, '_blank');

                    // Show success
                    formStatus.className = 'form__status text-center show form__status--success';
                    formStatus.innerHTML = '<i class="bx bx-check-circle"></i> Redirecting to WhatsApp...';
                    contactForm.reset();

                } catch (err) {
                    formStatus.className = 'form__status text-center show form__status--error';
                    formStatus.innerHTML = '<i class="bx bx-error-circle"></i> Something went wrong. Please try again.';
                    console.error('Form submission error:', err);
                } finally {
                    // Restore button
                    submitBtn.innerHTML = originalBtnHTML;
                    submitBtn.disabled = false;

                    // Auto-hide status after 6 seconds
                    setTimeout(() => {
                        formStatus.classList.remove('show');
                    }, 6000);
                }
            }
        });

        // Remove error highlight when user starts correcting input
        const inputs = contactForm.querySelectorAll('.form__input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }
});

/* ==================== EMERALD GLASS EXTENSIONS ==================== */

// --- Page Loader ---
const hideLoader = () => {
    const loader = document.getElementById('loader');
    if(loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
};

if (document.readyState === 'complete') {
    hideLoader();
} else {
    window.addEventListener('load', hideLoader);
    // Fallback just in case load is stuck
    setTimeout(hideLoader, 3000); 
}

// --- Back to Top Button ---
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


