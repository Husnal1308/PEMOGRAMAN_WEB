/**
 * Michelle Beauty Care - Redesign
 * JavaScript untuk interaktivitas
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MOBILE MENU TOGGLE ==========
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }
    
    // ========== SMOOTH SCROLL ==========
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#' && targetId !== '') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    if (navLinks && navLinks.classList.contains('show')) {
                        navLinks.classList.remove('show');
                    }
                }
            }
        });
    });
    
        // ========== LIGHTBOX FUNCTION DENGAN TOMBOL CLOSE ==========
    function openLightbox(imgSrc) {
        // Buat lightbox element
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            cursor: pointer;
        `;
        
        // Tombol Close (X)
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            font-weight: bold;
            color: white;
            cursor: pointer;
            z-index: 2001;
            font-family: Arial, sans-serif;
            padding: 5px;
            transition: 0.3s;
        `;
        closeBtn.onmouseover = function() {
            this.style.color = '#b58383';
        };
        closeBtn.onmouseout = function() {
            this.style.color = 'white';
        };
        closeBtn.onclick = function() {
            lightbox.remove();
        };
        
        // Gambar
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
        `;
        
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(img);
        document.body.appendChild(lightbox);
        
        // Klik di luar gambar juga bisa menutup
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });
        
        // Tombol ESC untuk menutup
        function handleEsc(e) {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        }
        document.addEventListener('keydown', handleEsc);
    }
    
    // Attach lightbox ke elemen galeri
    function attachLightboxEvents() {
        const galeriItems = document.querySelectorAll('.galeri-item');
        galeriItems.forEach(item => {
            // Hapus listener lama untuk mencegah duplikat
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });
        
        // Re-query setelah clone
        document.querySelectorAll('.galeri-item').forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    openLightbox(img.src);
                }
            });
        });
    }
    
    // ========== SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.service-card, .testi-card, .galeri-item');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealThreshold = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealThreshold) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    checkReveal();
    window.addEventListener('scroll', checkReveal);
    
    // ========== TAHUN OTOMATIS DI FOOTER ==========
    const copyrightText = document.querySelector('.copyright p');
    if (copyrightText) {
        const currentYear = new Date().getFullYear();
        copyrightText.innerHTML = copyrightText.innerHTML.replace('2026', currentYear);
    }
    
        // ========== SERVICES SLIDER (ARROW KANAN KIRI + AUTO SLIDE) ==========
    const servicesTrack = document.getElementById('servicesTrack');
    const prevServiceBtn = document.getElementById('prevService');
    const nextServiceBtn = document.getElementById('nextService');
    const serviceDots = document.getElementById('serviceDots');
    
    if (servicesTrack && prevServiceBtn && nextServiceBtn) {
        let currentIndex = 0;
        let autoSlideInterval; // Untuk auto slide
        
        function getCardWidth() {
            const card = servicesTrack.querySelector('.service-card');
            if (!card) return 340;
            const style = window.getComputedStyle(servicesTrack);
            const gap = parseFloat(style.gap) || 30;
            return card.offsetWidth + gap;
        }
        
        function getVisibleCards() {
            const container = document.querySelector('.services-slider-container');
            if (!container) return 3;
            const containerWidth = container.offsetWidth;
            const card = servicesTrack.querySelector('.service-card');
            if (!card) return 3;
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(window.getComputedStyle(servicesTrack).gap) || 30;
            return Math.floor((containerWidth + gap) / (cardWidth + gap));
        }
        
        function getMaxIndex() {
            const totalCards = servicesTrack.querySelectorAll('.service-card').length;
            return Math.max(0, totalCards - getVisibleCards());
        }
        
        function updateServiceSlider() {
            const cardWidth = getCardWidth();
            servicesTrack.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
            
            const dots = document.querySelectorAll('.dot-service');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
            
            const maxIndex = getMaxIndex();
            prevServiceBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevServiceBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            nextServiceBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
            nextServiceBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
        }
        
        function nextService() {
            const maxIndex = getMaxIndex();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateServiceSlider();
            } else {
                // Jika sudah di akhir, kembali ke awal (loop)
                currentIndex = 0;
                updateServiceSlider();
            }
        }
        
        function prevService() {
            if (currentIndex > 0) {
                currentIndex--;
                updateServiceSlider();
            }
        }
        
        // ========== AUTO SLIDE ==========
        function startAutoSlide() {
            autoSlideInterval = setInterval(function() {
                nextService();
            }, 1000); // 1000ms = 1 detik (ganti angka ini untuk mengatur kecepatan)
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }
        
        function createDots() {
            if (!serviceDots) return;
            const maxIndex = getMaxIndex();
            serviceDots.innerHTML = '';
            
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot-service');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', function() {
                    currentIndex = i;
                    updateServiceSlider();
                    resetAutoSlide(); // Reset auto slide saat dot diklik
                });
                serviceDots.appendChild(dot);
            }
        }
        
        // Event listener dengan reset auto slide
        prevServiceBtn.addEventListener('click', function() {
            prevService();
            resetAutoSlide();
        });
        
        nextServiceBtn.addEventListener('click', function() {
            nextService();
            resetAutoSlide();
        });
        
        // Pause auto slide saat mouse hover di slider container
        const sliderContainer = document.querySelector('.services-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Touch/swipe support untuk mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        servicesTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        servicesTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextService();
                } else {
                    prevService();
                }
                resetAutoSlide();
            }
        }, {passive: true});
        
        window.addEventListener('resize', function() {
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            createDots();
            updateServiceSlider();
        });
        
        createDots();
        updateServiceSlider();
        
        // Mulai auto slide
        startAutoSlide();
    }
    
    // ========== GALERI LOAD MORE (FIXED) ==========
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const galeriGrid = document.getElementById('galeriGrid');
    
    const allGalleryImages = [
        { src: 'assets/images/klinik-michell.jpg', alt: 'Klinik' },
        { src: 'assets/images/tempat-facial.jpg', alt: 'Ruangan' },
        { src: 'assets/images/pico-second.png', alt: 'kegiatan-1' },
        { src: 'assets/images/slime-shape.png', alt: 'kegiatan-2' },
        { src: 'assets/images/hair-removal.png', alt: 'kegiatan-3' },
        { src: 'assets/images/botox-treatment.png', alt: 'Kegiatan-4' },
        { src: 'assets/images/injeksi-whitening.png', alt: 'Kegiatan-5' },
        { src: 'assets/images/m-build-treatment.png', alt: 'Kegiatan-6' }
    ];
    
    if (galeriGrid && loadMoreBtn) {
        let isExpanded = false;
        const initialCount = 4;
        
        function displayImages(count) {
            const imagesToShow = allGalleryImages.slice(0, count);
            galeriGrid.innerHTML = '';
            
            imagesToShow.forEach(image => {
                const galeriItem = document.createElement('div');
                galeriItem.classList.add('galeri-item');
                galeriItem.innerHTML = `
                    <img src="${image.src}" alt="${image.alt}">
                    <div class="galeri-overlay"><i class="fas fa-search-plus"></i></div>
                `;
                galeriGrid.appendChild(galeriItem);
            });
            
            attachLightboxEvents();
        }
        
        loadMoreBtn.addEventListener('click', function() {
            if (!isExpanded) {
                displayImages(allGalleryImages.length);
                loadMoreBtn.textContent = 'Sembunyikan';
                isExpanded = true;
            } else {
                displayImages(initialCount);
                loadMoreBtn.textContent = 'Lihat Semua Galeri';
                isExpanded = false;
            }
        });
        
        displayImages(initialCount);
    }
    
    // ========== ANIMASI KLIK CARD LAYANAN & TESTIMONI (MEMBESAR) ==========
    
    // Fungsi untuk animasi klik pada card layanan
    const serviceCards = document.querySelectorAll('.service-card');
    const testiCards = document.querySelectorAll('.testi-card');
    
    function addClickAnimation(card) {
        card.addEventListener('click', function(e) {
            // Jangan trigger jika klik pada tombol panah atau dot
            if (e.target.closest('.service-arrow')) return;
            if (e.target.closest('.dot-service')) return;
            if (e.target.closest('.service-dots')) return;
            
            // Tambah class animasi
            this.classList.add('card-clicked');
            
            // Hapus class setelah animasi selesai
            setTimeout(() => {
                this.classList.remove('card-clicked');
            }, 300);
        });
    }
    
    // Terapkan animasi ke semua card layanan
    serviceCards.forEach(card => {
        addClickAnimation(card);
    });
    
    // Terapkan animasi ke semua card testimoni
    testiCards.forEach(card => {
        addClickAnimation(card);
    });
    
    // CSS untuk animasi (pastikan sudah ada di style.css)
    // Jika belum ada, tambahkan:
    const style = document.createElement('style');
    style.textContent = `
        .service-card.card-clicked,
        .testi-card.card-clicked {
            transform: scale(1.05) !important;
            box-shadow: 0 25px 40px rgba(0,0,0,0.15) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
    `;
    document.head.appendChild(style);
    
});

