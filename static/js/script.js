document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    };
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌓';
    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.body.appendChild(darkModeToggle);
    
    const sections = document.querySelectorAll('section');
    
    function checkVisibility() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('load', checkVisibility);
    
    const logoTexts = ["حلوياتنا", "أطيب حلويات", "بنكهة الأصالة", "لذة لا تقاوم"];
    let currentLogoIndex = 0;
    const dynamicLogo = document.getElementById('dynamicLogo');
    
    function changeLogoText() {
        currentLogoIndex = (currentLogoIndex + 1) % logoTexts.length;
        gsap.to(dynamicLogo, {
            duration: 0.5,
            opacity: 0,
            y: -20,
            onComplete: () => {
                dynamicLogo.textContent = logoTexts[currentLogoIndex];
                gsap.to(dynamicLogo, {
                    duration: 0.5,
                    opacity: 1,
                    y: 0
                });
            }
        });
    }
    
    setInterval(changeLogoText, 3000);
    
    function updateOfferCounter() {
        const now = new Date();
        const endOfWeek = new Date();
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
        endOfWeek.setHours(23, 59, 59, 0);
        
        const diff = endOfWeek - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('offerCounter').textContent = 
            `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    setInterval(updateOfferCounter, 1000);
    updateOfferCounter();
    
    window.showProducts = function(category) {
        document.getElementById('categories').style.display = 'none';
        document.getElementById(`${category}-products`).style.display = 'block';
        window.scrollTo({ top: document.getElementById('productsContainer').offsetTop - 100, behavior: 'smooth' });
    };
    
    window.hideProducts = function() {
        document.querySelectorAll('.product-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('categories').style.display = 'block';
        window.scrollTo({ top: document.getElementById('categories').offsetTop - 100, behavior: 'smooth' });
    };
    
    window.openOrderModal = function(product) {
        const modal = document.getElementById('orderModal');
        document.getElementById('modalProduct').value = product;
        modal.style.display = 'block';
    };
    
    window.closeModal = function() {
        document.getElementById('orderModal').style.display = 'none';
    };
    
    window.submitModalOrder = function(e) {
        e.preventDefault();
        const name = document.getElementById('modalName').value;
        const phone = document.getElementById('modalPhone').value;
        const product = document.getElementById('modalProduct').value;
        const address = document.getElementById('modalAddress').value;
        const quantity = document.getElementById('modalQuantity').value;
        const date = document.getElementById('modalDate').value;
        const notes = document.getElementById('modalNotes').value;
        
        const pointsToAdd = Math.floor(parseInt(quantity) * 10);
        addLoyaltyPoints(pointsToAdd);
        
        const message = `طلب جديد من ${name}%0A%0Aرقم الهاتف: ${phone}%0Aالعنوان: ${address}%0Aنوع الحلويات: ${product}%0Aالكمية: ${quantity}%0Aتاريخ التوصيل: ${date}%0Aملاحظات: ${notes || 'لا يوجد'}`;
        
        window.open(`https://wa.me/213781648033?text=${encodeURIComponent(message)}`, '_blank');
        
        e.target.reset();
        closeModal();
    };
    
    function getLoyaltyPoints() {
        return parseInt(localStorage.getItem('loyaltyPoints')) || 0;
    }
    
    function addLoyaltyPoints(points) {
        const currentPoints = getLoyaltyPoints();
        const newPoints = currentPoints + points;
        localStorage.setItem('loyaltyPoints', newPoints);
        updateLoyaltyDisplay();
    }
    
    function updateLoyaltyDisplay() {
        const points = getLoyaltyPoints();
        if (document.getElementById('loyaltyPoints')) {
            document.getElementById('loyaltyPoints').textContent = `${points} نقطة`;
            
            const progress = Math.min(100, (points % 100));
            if (document.getElementById('loyaltyProgress')) {
                document.getElementById('loyaltyProgress').style.width = `${progress}%`;
            }
        }
    }
    
    window.checkLoyaltyPoints = function() {
        const points = getLoyaltyPoints();
        const discount = Math.floor(points / 100) * 10;
        
        if (discount > 0) {
            alert(`لديك ${points} نقطة مؤهلة لخصم ${discount}% على طلبك القادم!`);
        } else {
            const pointsNeeded = 100 - (points % 100);
            alert(`لديك ${points} نقطة. تحتاج ${pointsNeeded} نقطة إضافية للحصول على خصم 10%`);
        }
    };
    
    updateLoyaltyDisplay();
    
    window.onclick = function(event) {
        const modal = document.getElementById('orderModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('ServiceWorker registration successful');
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.add('loaded');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
    });
    
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('modalDate')) {
        document.getElementById('modalDate').min = today;
    }
});
