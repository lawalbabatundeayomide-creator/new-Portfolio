/**
 * Lawal Babatunde Portfolio Script - Fixed & Merged
 */

// --- 1. CONFIGURATION & SELECTORS ---
const words = ["Full-Stack Developer", "Web Designer", "Freelancer"];
const typeTarget = document.querySelector('.typewriter');
const slides = document.querySelectorAll('.slide');
const header = document.querySelector('.header');
const scrollTopBtn = document.getElementById('scroll-top');
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');

let wordIdx = 0, charIdx = 0, isDeleting = false;
let slideIndex = 0;

// --- 2. TYPEWRITER EFFECT ---
function typeEffect() {
    if (!typeTarget) return;
    const currentWord = words[wordIdx];
    
    typeTarget.textContent = isDeleting 
        ? currentWord.substring(0, charIdx--) 
        : currentWord.substring(0, charIdx++);

    let speed = isDeleting ? 100 : 200;
    
    if (!isDeleting && charIdx > currentWord.length) {
        isDeleting = true; speed = 1500; // Pause at end
    } else if (isDeleting && charIdx < 0) {
        isDeleting = false; 
        wordIdx = (wordIdx + 1) % words.length; 
        charIdx = 0;
    }
    setTimeout(typeEffect, speed);
}

// --- 3. BACKGROUND SLIDER ---
function showSlides() {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].classList.add('active');
    setTimeout(showSlides, 5000);
}

// --- 4. SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.15 });

// --- 5. INITIALIZATION & EVENTS ---
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    showSlides();
    document.querySelectorAll('.hidden').forEach(el => revealObserver.observe(el));

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('bx-menu');
            icon.classList.toggle('bx-x');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if(icon) {
                icon.classList.add('bx-menu');
                icon.classList.remove('bx-x');
            }
        });
    });
});

// --- 6. GLOBAL SCROLL HANDLER ---
window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('sticky', window.scrollY > 100);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('active', window.scrollY > 500);

    if (navbar && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if(icon) {
            icon.classList.add('bx-menu');
            icon.classList.remove('bx-x');
        }
    }
});

// --- 7. FIXED FORM HANDLING (Merged Version) ---
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const submitBtn = document.getElementById('submit-btn');
        const plane = document.getElementById('plane');
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');

        // UI State: Loading
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        if (submitBtn) {
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
        }

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("https://formspree.io/f/xnjjqbqr", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Trigger Animation
                if (plane) plane.classList.add('plane-animate');

                // Success Toast
                if (toastMsg) toastMsg.innerText = 'Message sent successfully!';
                if (toast) {
                    toast.classList.add('show', 'success');
                    toast.classList.remove('error');
                }
                
                contactForm.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            // Error Toast
            if (toastMsg) toastMsg.innerText = 'Oops! Something went wrong.';
            if (toast) {
                toast.classList.add('show', 'error');
                toast.classList.remove('success');
            }
        } finally {
            // Reset Button
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }

            // Clean up UI after 3 seconds
            setTimeout(() => {
                if (toast) toast.classList.remove('show');
                if (plane) plane.classList.remove('plane-animate');
            }, 3000);
        }
    });
}