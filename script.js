document.addEventListener("DOMContentLoaded", () => {

    // Custom Cursor Logic
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // Smooth Scrolling & Reveal
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .hero-title, .project-card, .comp-category, .exp-item').forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(30px)';
        sec.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(sec);
    });

    /* =========================================
       LIGHTBOX GALLERY LOGIC
       ========================================= */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const counter = document.querySelector('.slides-counter');

    let currentImages = [];
    let currentIndex = 0;

    // --- Helper Functions (Hoisted) ---
    function updateLightboxImage() {
        if (!currentImages || currentImages.length === 0) return;
        lightboxImg.src = currentImages[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }

    function showPrev() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    }

    function showNext() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // --- Event Listeners ---

    // Open Lightbox
    document.querySelectorAll('.project-card, .profile-image-container').forEach(card => {
        card.addEventListener('click', () => {
            const rawData = card.getAttribute('data-images');
            if (rawData) {
                try {
                    currentImages = JSON.parse(rawData);
                    if (currentImages && currentImages.length > 0) {
                        currentIndex = 0;
                        updateLightboxImage(); // Safe to call now
                        lightbox.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                } catch (e) {
                    console.error("Error parsing image data", e);
                }
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Close on click outside
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
    }
});
