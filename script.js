// ========================================
// 全域變數與初始化
// ========================================
let particles = [];
const particleCount = 50;

// ========================================
// DOM 載入完成後執行
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initParticles();
    initNavigation();
    initThemeToggle();
    initBackToTop();
    initTypingAnimation();
    initScrollAnimations();
    initProjectFilters();
    initContactForm();
    initStatCounters();
    initSkillBars();
    
    // 新功能初始化
    initPreloader();
    initScrollProgress();
    initCursorFollower();
    initLanguageToggle();
    initMusicPlayer();
    initPrintResume();
    initVisitorCounter();
    initLiveClock();
    initSkillsRadarChart();
    initTypingGame();
    initSocialShare();
    initAchievements();
    init3DCardEffect();
});

// ========================================
// 粒子背景動畫
// ========================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 創建粒子
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 動畫循環
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // 連接附近的粒子
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 150})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    animate();
    
    // 視窗大小改變時調整畫布
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// 導航欄功能
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // 滾動時改變導航欄樣式
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 更新活動連結
        updateActiveLink();
    });
    
    // 平滑滾動
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // 關閉手機選單
            navMenu.classList.remove('active');
        });
    });
    
    // 手機選單切換
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
    
    // 更新活動連結
    function updateActiveLink() {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ========================================
// 主題切換功能
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // 檢查本地儲存的主題設定
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// ========================================
// 回到頂部按鈕
// ========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
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

// ========================================
// 打字動畫效果
// ========================================
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    const texts = [
        '全端工程師',
        '前端開發者',
        'UI/UX 設計師',
        '問題解決者',
        '終身學習者'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // 暫停時間
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// ========================================
// 滾動動畫
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 觀察所有需要動畫的元素
    const animatedElements = document.querySelectorAll(
        '.about-content, .skill-category, .timeline-item, .project-card, .education-card, .contact-content'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// 專案過濾器
// ========================================
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // 更新活動按鈕
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 過濾專案卡片
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
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

// ========================================
// 聯絡表單
// ========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 驗證表單
        if (validateForm()) {
            // 模擬發送表單
            const submitBtn = form.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            
            btnText.textContent = '發送中...';
            submitBtn.disabled = true;
            
            // 模擬 API 請求
            setTimeout(() => {
                formMessage.textContent = '訊息發送成功！我會盡快回覆您。';
                formMessage.className = 'form-message success';
                form.reset();
                
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                
                // 3秒後隱藏訊息
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 3000);
            }, 1500);
        }
    });
    
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // 清除之前的錯誤訊息
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
        
        // 驗證姓名
        if (name.value.trim() === '') {
            showError(name, '請輸入您的姓名');
            isValid = false;
        }
        
        // 驗證 Email
        if (email.value.trim() === '') {
            showError(email, '請輸入您的 Email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, '請輸入有效的 Email 地址');
            isValid = false;
        }
        
        // 驗證主題
        if (subject.value.trim() === '') {
            showError(subject, '請輸入主題');
            isValid = false;
        }
        
        // 驗證訊息
        if (message.value.trim() === '') {
            showError(message, '請輸入訊息內容');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, '訊息內容至少需要 10 個字元');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = message;
        input.style.borderColor = '#ef4444';
        
        // 監聽輸入以清除錯誤
        input.addEventListener('input', () => {
            errorMessage.textContent = '';
            input.style.borderColor = '';
        }, { once: true });
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// ========================================
// 統計數字動畫
// ========================================
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });
    
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}

// ========================================
// 技能條動畫
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                skillBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 100);
                });
            }
        });
    }, { threshold: 0.3 });
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// ========================================
// 電子報訂閱
// ========================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            alert('感謝您的訂閱！');
            newsletterForm.reset();
        }
    });
}

// ========================================
// 平滑滾動 Polyfill（針對舊版瀏覽器）
// ========================================
if (!('scrollBehavior' in document.documentElement.style)) {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// 滑鼠游標特效（可選）
// ========================================
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // 點擊可互動元素時的效果
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// ========================================
// 視差滾動效果
// ========================================
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image, .about-image');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 初始化視差效果（可選）
// initParallaxEffect();

// ========================================
// 載入動畫
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // 隱藏載入畫面（如果有的話）
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
});

// ========================================
// 效能優化：節流函數
// ========================================
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// ========================================
// 效能優化：防抖函數
// ========================================
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ========================================
// 列印友善提示
// ========================================
console.log('%c👋 歡迎來到我的網站！', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%c如果你對這個網站的程式碼感興趣，歡迎與我聯繫！', 'font-size: 14px; color: #6b7280;');
console.log('%c📧 example@email.com', 'font-size: 14px; color: #6366f1;');

// ========================================
// 追蹤使用者互動（Google Analytics 等）
// ========================================
function trackEvent(category, action, label) {
    // 如果使用 Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // 開發環境下顯示追蹤事件
    if (window.location.hostname === 'localhost') {
        console.log('Track Event:', category, action, label);
    }
}

// 追蹤按鈕點擊
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('Button', 'Click', this.textContent.trim());
    });
});

// ========================================
// 鍵盤快捷鍵
// ========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 開啟搜尋（如果有搜尋功能）
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('搜尋功能快捷鍵');
    }
    
    // ESC 關閉手機選單
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// ========================================
// 服務工作器註冊（PWA 支援）
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 取消註解以啟用 PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ========================================
// 導出功能（如果需要在其他地方使用）
// ========================================
window.portfolioUtils = {
    throttle,
    debounce,
    trackEvent
};

// ========================================
// 新功能實現
// ========================================

// 加載畫面
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// 滾動進度條
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 鼠標跟隨效果
function initCursorFollower() {
    const cursorFollower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorFollower.style.opacity = '1';
    });
    
    function animateCursor() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // 在可點擊元素上放大
    document.querySelectorAll('a, button, .project-card, .skill-bar').forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
    });
}

// 語言切換功能
let currentLanguage = 'zh';

function initLanguageToggle() {
    const langToggle = document.getElementById('language-toggle');
    const langText = langToggle.querySelector('.lang-text');
    
    langToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        langText.textContent = currentLanguage === 'zh' ? 'EN' : '中';
        updateLanguage();
        unlockAchievement('explorer');
    });
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-zh][data-en]');
    
    elements.forEach(el => {
        const zhText = el.getAttribute('data-zh');
        const enText = el.getAttribute('data-en');
        
        if (currentLanguage === 'zh') {
            el.textContent = zhText;
        } else {
            el.textContent = enText;
        }
    });
}

// 音樂播放器
let isPlaying = false;
let audioContext;
let oscillator;

function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    
    musicToggle.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (isPlaying) {
            stopMusic();
            musicToggle.classList.remove('playing');
        } else {
            playMusic();
            musicToggle.classList.add('playing');
            unlockAchievement('music');
        }
        
        isPlaying = !isPlaying;
    });
}

function playMusic() {
    oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    
    // 播放簡單的旋律
    const notes = [262, 294, 330, 349, 392, 440, 494, 523];
    let noteIndex = 0;
    
    setInterval(() => {
        if (isPlaying && oscillator) {
            oscillator.frequency.value = notes[noteIndex];
            noteIndex = (noteIndex + 1) % notes.length;
        }
    }, 500);
}

function stopMusic() {
    if (oscillator) {
        oscillator.stop();
        oscillator = null;
    }
}

// 列印履歷功能
function initPrintResume() {
    const printBtn = document.getElementById('print-resume');
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
}

// 訪客計數器
function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count');
    let count = localStorage.getItem('visitorCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    
    animateCounter(counterEl, 0, count, 2000);
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// 實時時鐘
function initLiveClock() {
    const clockEl = document.getElementById('clock-time');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 技能雷達圖
function initSkillsRadarChart() {
    const ctx = document.getElementById('skillsRadarChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['前端開發', '後端開發', 'UI/UX設計', '資料庫', '雲端服務', '專案管理'],
            datasets: [{
                label: '技能評估',
                data: [95, 85, 75, 80, 70, 85],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 打字速度測試遊戲
function initTypingGame() {
    const textDisplay = document.getElementById('text-display');
    const textInput = document.getElementById('text-input');
    const startBtn = document.getElementById('start-game-btn');
    const resetBtn = document.getElementById('reset-game-btn');
    const timeEl = document.getElementById('game-time');
    const wpmEl = document.getElementById('game-wpm');
    const accuracyEl = document.getElementById('game-accuracy');
    const errorsEl = document.getElementById('game-errors');
    const resultsDiv = document.getElementById('game-results');
    
    const texts = [
        'The quick brown fox jumps over the lazy dog.',
        'Programming is the art of telling another human what one wants the computer to do.',
        'Code is like humor. When you have to explain it, it is bad.',
        'First solve the problem. Then write the code.',
        'Experience is the name everyone gives to their mistakes.'
    ];
    
    let currentText = '';
    let timeLeft = 60;
    let timer;
    let isGameActive = false;
    let correctChars = 0;
    let totalChars = 0;
    let errors = 0;
    
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    textInput.addEventListener('input', handleInput);
    
    function startGame() {
        isGameActive = true;
        timeLeft = 60;
        correctChars = 0;
        totalChars = 0;
        errors = 0;
        
        currentText = texts[Math.floor(Math.random() * texts.length)];
        textDisplay.innerHTML = currentText;
        textInput.value = '';
        textInput.disabled = false;
        textInput.focus();
        resultsDiv.style.display = 'none';
        
        timer = setInterval(updateTimer, 1000);
    }
    
    function updateTimer() {
        timeLeft--;
        timeEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }
    
    function handleInput(e) {
        if (!isGameActive) return;
        
        const typedText = textInput.value;
        totalChars = typedText.length;
        
        let displayHTML = '';
        correctChars = 0;
        
        for (let i = 0; i < currentText.length; i++) {
            if (i < typedText.length) {
                if (typedText[i] === currentText[i]) {
                    displayHTML += `<span class="correct">${currentText[i]}</span>`;
                    correctChars++;
                } else {
                    displayHTML += `<span class="incorrect">${currentText[i]}</span>`;
                }
            } else if (i === typedText.length) {
                displayHTML += `<span class="current">${currentText[i]}</span>`;
            } else {
                displayHTML += currentText[i];
            }
        }
        
        textDisplay.innerHTML = displayHTML;
        
        errors = totalChars - correctChars;
        errorsEl.textContent = errors;
        
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        accuracyEl.textContent = accuracy + '%';
        
        const timeElapsed = 60 - timeLeft;
        const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / (timeElapsed / 60)) : 0;
        wpmEl.textContent = wpm;
        
        if (typedText === currentText) {
            endGame();
        }
    }
    
    function endGame() {
        isGameActive = false;
        clearInterval(timer);
        textInput.disabled = true;
        
        const finalWpm = wpmEl.textContent;
        const finalAccuracy = accuracyEl.textContent;
        const finalErrors = errorsEl.textContent;
        
        document.getElementById('final-wpm').textContent = finalWpm;
        document.getElementById('final-accuracy').textContent = finalAccuracy;
        document.getElementById('final-errors').textContent = finalErrors;
        
        resultsDiv.style.display = 'block';
        
        if (parseInt(finalWpm) >= 50) {
            unlockAchievement('typist');
        }
    }
    
    function resetGame() {
        clearInterval(timer);
        isGameActive = false;
        textInput.disabled = true;
        textInput.value = '';
        textDisplay.innerHTML = '';
        timeEl.textContent = '60';
        wpmEl.textContent = '0';
        accuracyEl.textContent = '100%';
        errorsEl.textContent = '0';
        resultsDiv.style.display = 'none';
    }
}

// 社交分享功能
function initSocialShare() {
    // 分享函數已在HTML中內聯定義
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    unlockAchievement('social');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('查看這個很棒的個人網站！');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    unlockAchievement('social');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    unlockAchievement('social');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('查看這個很棒的個人網站！');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    unlockAchievement('social');
}

function copyPageLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('連結已複製到剪貼簿！');
        unlockAchievement('social');
    });
}

// 成就系統
const achievements = {
    visitor: false,
    explorer: false,
    reader: false,
    typist: false,
    social: false,
    contact: false,
    theme: false,
    music: false
};

function initAchievements() {
    // 從localStorage載入成就
    const saved = localStorage.getItem('achievements');
    if (saved) {
        Object.assign(achievements, JSON.parse(saved));
        updateAchievementDisplay();
    }
    
    // 解鎖訪客成就
    unlockAchievement('visitor');
    
    // 追蹤瀏覽的區塊
    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
    const visited = new Set();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visited.add(entry.target.id);
                if (visited.size === sections.length) {
                    unlockAchievement('explorer');
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
    
    // 追蹤停留時間
    setTimeout(() => {
        unlockAchievement('reader');
    }, 5 * 60 * 1000); // 5分鐘
    
    // 追蹤主題切換
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        unlockAchievement('theme');
    });
    
    // 追蹤聯絡表單
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            unlockAchievement('contact');
        });
    }
}

function unlockAchievement(key) {
    if (!achievements[key]) {
        achievements[key] = true;
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        const badge = document.querySelector(`[data-achievement="${key}"]`);
        if (badge) {
            badge.classList.remove('locked');
            badge.classList.add('unlocked');
            
            const status = badge.querySelector('.badge-status');
            status.classList.add('unlocked');
            status.innerHTML = '<i class="fas fa-check-circle"></i><span data-zh="已解鎖" data-en="Unlocked">已解鎖</span>';
            
            showAchievementNotification(badge.querySelector('.badge-title').textContent);
        }
    }
}

function updateAchievementDisplay() {
    Object.keys(achievements).forEach(key => {
        if (achievements[key]) {
            const badge = document.querySelector(`[data-achievement="${key}"]`);
            if (badge) {
                badge.classList.remove('locked');
                badge.classList.add('unlocked');
                
                const status = badge.querySelector('.badge-status');
                status.classList.add('unlocked');
                status.innerHTML = '<i class="fas fa-check-circle"></i><span data-zh="已解鎖" data-en="Unlocked">已解鎖</span>';
            }
        }
    });
}

function showAchievementNotification(title) {
    // 創建通知
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <i class="fas fa-trophy" style="font-size: 2rem;"></i>
            <div>
                <div style="font-weight: 600;">成就解鎖！</div>
                <div style="font-size: 0.9rem;">${title}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 添加動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 3D卡片傾斜效果
function init3DCardEffect() {
    const cards = document.querySelectorAll('.project-card, .education-card, .achievement-badge');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}
