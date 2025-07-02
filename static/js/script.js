if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

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
function showProducts(category) {
    document.getElementById('categories').style.display = 'none';
    document.getElementById(`${category}-products`).style.display = 'block';
    window.scrollTo({ top: document.getElementById('productsContainer').offsetTop - 100, behavior: 'smooth' });
}

function hideProducts() {
    document.querySelectorAll('.product-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('categories').style.display = 'block';
    window.scrollTo({ top: document.getElementById('categories').offsetTop - 100, behavior: 'smooth' });
}
function openOrderModal(product) {
    const modal = document.getElementById('orderModal');
    document.getElementById('modalProduct').value = product;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function openVideoModal(videoName) {
    const modal = document.getElementById('videoModal');
    const videoTitle = document.getElementById('videoModalTitle');
    const videoPlayer = document.getElementById('tutorialVideo');
    
    videoTitle.textContent = `فيديو تعليمي: ${videoName}`;
    
    // Set video source based on the selected tutorial
    if (videoName === 'مقروط') {
        videoPlayer.src = 'makrout-tutorial.mp4';
    } else if (videoName === 'بقلوّة') {
        videoPlayer.src = 'baklawa-tutorial.mp4';
    } else if (videoName === 'غريبة') {
        videoPlayer.src = 'ghriba-tutorial.mp4';
    }
    
    modal.style.display = 'block';
}

function closeVideoModal() {
    const videoPlayer = document.getElementById('tutorialVideo');
    videoPlayer.pause();
    document.getElementById('videoModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    
    const videoModal = document.getElementById('videoModal');
    if (event.target == videoModal) {
        closeVideoModal();
    }
}

function submitModalOrder(e) {
    e.preventDefault();
    const name = document.getElementById('modalName').value;
    const phone = document.getElementById('modalPhone').value;
    const product = document.getElementById('modalProduct').value;
    const quantity = document.getElementById('modalQuantity').value;
    const date = document.getElementById('modalDate').value;
    const notes = document.getElementById('modalNotes').value;
    
    // Calculate loyalty points (10 points per 1000 DZD)
    const pointsToAdd = Math.floor(parseInt(quantity) * 10);

    addLoyaltyPoints(pointsToAdd);
    
    const message = `طلب جديد من ${name}%0A%0Aرقم الهاتف: ${phone}%0Aنوع الحلويات: ${product}%0Aالكمية: ${quantity}%0Aتاريخ التوصيل: ${date}%0Aملاحظات: ${notes || 'لا يوجد'}`;
    window.open(`https://wa.me/213781648033?text=${message}`, '_blank');
    
    e.target.reset();
    closeModal();
}

// Loyalty Program Functions
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
    document.getElementById('loyaltyPoints').textContent = `${points} نقطة`;
    
    const progress = Math.min(100, (points % 100));
    document.getElementById('loyaltyProgress').style.width = `${progress}%`;
}

function checkLoyaltyPoints() {
    const points = getLoyaltyPoints();
    const discount = Math.floor(points / 100) * 10;
    
    if (discount > 0) {
        alert(`لديك ${points} نقطة مؤهلة لخصم ${discount}% على طلبك القادم!`);
    } else {
        const pointsNeeded = 100 - (points % 100);
        alert(`لديك ${points} نقطة. تحتاج ${pointsNeeded} نقطة إضافية للحصول على خصم 10%`);
    }
}

// Initialize loyalty display
updateLoyaltyDisplay();

let draggedItem = null;
let totalPrice = 0;

document.querySelectorAll('.builder-item').forEach(item => {
    item.addEventListener('dragstart', function() {
        draggedItem = this;
        setTimeout(() => {
            this.style.opacity = '0.4';
        }, 0);
    });
    
    item.addEventListener('dragend', function() {
        setTimeout(() => {
            this.style.opacity = '1';
            draggedItem = null;
        }, 0);
    });
});

document.getElementById('builderPreview').addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.backgroundColor = 'rgba(212, 163, 115, 0.2)';
});

document.getElementById('builderPreview').addEventListener('dragleave', function() {
    this.style.backgroundColor = '';
});

document.getElementById('builderPreview').addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '';
    
    if (draggedItem) {
        const itemName = draggedItem.textContent;
        const itemPrice = parseInt(draggedItem.getAttribute('data-price'));
        
        const newItem = document.createElement('div');
        newItem.className = 'builder-preview-item';
        newItem.innerHTML = `
            ${itemName}
            <span class="remove-item" onclick="removeBuilderItem(this, ${itemPrice})">×</span>
        `;
        
        this.appendChild(newItem);
        totalPrice += itemPrice;
        updateBuilderTotal();
    }
});

function removeBuilderItem(element, price) {
    element.parentElement.remove();
    totalPrice -= price;
    updateBuilderTotal();
}

function updateBuilderTotal() {
    document.getElementById('builderTotal').textContent = totalPrice;
}

function submitBuilderOrder() {
    if (totalPrice === 0) {
        alert('الرجاء إضافة عناصر إلى طلبك أولاً');
        return;
    }
    
    const items = [];
    document.querySelectorAll('.builder-preview-item').forEach(item => {
        items.push(item.textContent.trim().replace('×', ''));
    });
    
    openOrderModal(items.join('، '));
}

document.getElementById('greetingText').addEventListener('input', function() {
    document.getElementById('greetingCardPreview').textContent = this.value || 'نص المعايدة سيظهر هنا';
});

function saveGreetingCard() {
    const greetingText = document.getElementById('greetingText').value;
    if (!greetingText) {
        alert('الرجاء إدخال نص المعايدة');
        return;
    }
    
    localStorage.setItem('greetingCard', greetingText);
    alert('تم حفظ بطاقة المعايدة بنجاح! سيتم إرفاقها مع طلبك.');
}
let mediaRecorder;
let recordedChunks = [];

document.getElementById('startRecording').addEventListener('click', async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const videoPreview = document.getElementById('videoPreview');
        videoPreview.innerHTML = '';
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = '100%';
        videoPreview.appendChild(video);
        
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function(e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = function() {
            const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(videoBlob);
            
            videoPreview.innerHTML = '';
            const recordedVideo = document.createElement('video');
            recordedVideo.src = videoUrl;
            recordedVideo.controls = true;
            recordedVideo.style.width = '100%';
            recordedVideo.style.height = '100%';
            videoPreview.appendChild(recordedVideo);
            
            document.getElementById('sendVideo').style.display = 'inline-block';
        };
        
        mediaRecorder.start();
        this.textContent = 'إيقاف التسجيل';
        this.onclick = stopRecording;
    } catch (err) {
        console.error('Error accessing media devices:', err);
        alert('حدث خطأ في الوصول إلى الكاميرا أو الميكروفون. يرجى التحقق من الأذونات.');
    }
});

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById('startRecording').textContent = 'سجّل طلبك صوت أو فيديو 🎥';
    document.getElementById('startRecording').onclick = startRecording;
    
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
}

document.getElementById('sendVideo').addEventListener('click', function() {
    alert('تم حفظ الفيديو بنجاح! سيتصل بكم فريقنا لتأكيد التفاصيل.');
});

const aiResponses = {
    "عرس": "تهانينا على العرس! ننصحك بـ 'سفرة العروس' التي تحتوي على تشكيلة متنوعة من الحلويات التقليدية والعصرية. كما يمكنك اختيار 'كعكة الزفاف' المخصصة بتصميم يناسب ذوقك.",
    "مناسبة": "لدينا تشكيلة واسعة تناسب جميع المناسبات. هل يمكنك تحديد نوع المناسبة؟ (عرس، ميلاد، رمضان، إلخ)",
    "أطفال": "لدينا قسم خاص بحلويات الأطفال يشمل كيك شخصيات كرتونية وكب كيك ملون بأشكال جذابة للأطفال.",
    "رمضان": "في رمضان نقدم تشكيلة خاصة تشمل زلابية، قريوش، ومقروط. جميعها تحضر بمواد طبيعية وتناسب موائد رمضان.",
    "سعر": "أسعارنا تتراوح بين 800 دج للكيلو للحلويات البسيطة وحتى 25000 دج لسفرة العروس الكاملة. يمكنك الاطلاع على الأسعار في صفحة الأصناف.",
    "توصيل": "نقدم خدمة التوصيل مجانًا داخل المدينة للطلبات فوق 15000 دج. كما يمكنك استلام الطلب من محلتنا.",
    "مكونات": "نستخدم فقط المكونات الطبيعية والطازجة في جميع حلوياتنا بدون أي مواد حافظة أو ألوان صناعية."
};

function sendAiMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatBox = document.getElementById('aiChatBox');
    
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);
    
    input.value = '';
    
    chatBox.scrollTop = chatBox.scrollHeight;
    
    setTimeout(() => {
        let response = "شكرًا لسؤالك. يمكنني مساعدتك في اختيار الحلويات المناسبة لأي مناسبة. هل لديك مناسبة معينة في الذهن؟";
        
        for (const keyword in aiResponses) {
            if (message.includes(keyword)) {
                response = aiResponses[keyword];
                break;
            }
        }
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.textContent = response;
        chatBox.appendChild(aiMessage);
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

document.getElementById('aiChatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendAiMessage();
    }
});

const today = new Date().toISOString().split('T')[0];
document.getElementById('modalDate').min = today;

// Auto-scroll carousel
const carousel = document.getElementById('weeklyCarousel');
if (carousel) {
    setInterval(() => {
        carousel.scrollBy({
            left: 320,
            behavior: 'smooth'
        });
        
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 50) {
            setTimeout(() => {
                carousel.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            }, 1000);
        }
    }, 3000);
}
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Add this to your window load event
window.addEventListener('load', () => {
    // Dark mode initialization
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Add dark mode toggle button dynamically
    const darkModeToggle = document.createElement('div');
    darkModeToggle.innerHTML = '<button id="darkModeToggle" class="btn" style="position:fixed;bottom:100px;right:30px;z-index:1000;">🌓</button>';
    document.body.appendChild(darkModeToggle);
    
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});
