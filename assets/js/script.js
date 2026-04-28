// ========================================
// 性能優化工具函數
// ========================================

// 防抖函數 - 延遲執行
const debounce = (fn, delay = 300) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

// 節流函數 - 限制執行頻率
const throttle = (fn, delay = 300) => {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
};

const externalScriptCache = new Map();

function loadExternalScript(src, globalName) {
    if (globalName && typeof window[globalName] !== 'undefined') {
        return Promise.resolve(window[globalName]);
    }

    if (externalScriptCache.has(src)) {
        return externalScriptCache.get(src);
    }

    const loader = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);

        if (existing) {
            if (globalName && typeof window[globalName] !== 'undefined') {
                resolve(window[globalName]);
                return;
            }

            existing.addEventListener('load', () => resolve(window[globalName]), { once: true });
            existing.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve(window[globalName]);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });

    externalScriptCache.set(src, loader);
    return loader;
}

// 延遲加載圖片
const lazyLoadImages = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// 性能監測
const performanceMonitor = {
    mark: (name) => {
        if ('performance' in window) {
            performance.mark(name);
        }
    },
    measure: (name, startMark, endMark) => {
        if ('performance' in window && 'measure' in performance) {
            try {
                performance.measure(name, startMark, endMark);
            } catch(e) {}
        }
    }
};

function runWhenIdle(task, timeout = 1200) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(task, { timeout });
        return;
    }
    setTimeout(task, Math.min(timeout, 600));
}

// ========================================
// 全域變數與初始化
// ========================================
let particles = [];
const particleCount = window.innerWidth < 768 ? 24 : 50;
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSaveDataMode = !!(navigator.connection && navigator.connection.saveData);

const globalKeydownHandlers = [];
let isGlobalKeydownBound = false;

const REMOTE_TRANSLATION_CONSENT_KEY = 'allow-remote-translation';
const MAX_REMOTE_TRANSLATION_ITEMS = 80;

function isTypingTarget(target) {
    const targetTag = (target && target.tagName) ? target.tagName.toLowerCase() : '';
    return targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select' || target?.isContentEditable;
}

function registerGlobalShortcut(handler) {
    globalKeydownHandlers.push(handler);
}

function bindGlobalKeydownListener() {
    if (isGlobalKeydownBound) return;
    isGlobalKeydownBound = true;

    document.addEventListener('keydown', (e) => {
        for (const handler of globalKeydownHandlers) {
            const handled = handler(e);
            if (handled) {
                break;
            }
        }
    });
}

function isRemoteTranslationEnabled() {
    return localStorage.getItem(REMOTE_TRANSLATION_CONSENT_KEY) === 'true';
}

function updateActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length === 0) return;

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

// 優化滾動事件 - 使用節流
const onScroll = throttle(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    updateActiveLink();
}, 100);

bindGlobalKeydownListener();

// ========================================
// 立即移除 Preloader（避免卡住）
// ========================================
function removePreloaderNow() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    const hide = () => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    };
    
    // 立即隱藏（添加短暫延遲以顯示載入動畫）
    setTimeout(hide, 800);
}

// 在 DOM 內容載入後立即處理 preloader
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removePreloaderNow);
} else {
    removePreloaderNow();
}

// 強制移除保護（3秒後，防止永久卡住）
setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        preloader.style.display = 'none';
    }
}, 3000);

// ========================================
// DOM 載入完成後執行
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const safeInit = (fn) => { try { fn(); } catch(e) { console.warn(fn.name + ' failed:', e); } };

    // 首屏必要功能
    safeInit(initAnalyticsTracking);
    safeInit(initNavigation);
    safeInit(initThemeToggle);
    safeInit(initBackToTop);
    safeInit(initContactForm);
    safeInit(initLanguageToggle);
    safeInit(initVisitorCounter);
    safeInit(initLiveClock);

    // 次要互動放到下一個 frame，縮短首屏主執行緒占用
    requestAnimationFrame(() => {
        safeInit(initTypingAnimation);
        safeInit(initScrollAnimations);
        safeInit(initProjectFilters);
        safeInit(initStatCounters);
        safeInit(initSkillBars);
        safeInit(initScrollProgress);
        safeInit(initCursorFollower);
        safeInit(initSkillsRadarChart);
        safeInit(initTypingGame);
        safeInit(initSocialShare);
        safeInit(initAchievements);
        safeInit(initOnlineStatus);
    });

    // 高成本功能使用 idle 啟動
    runWhenIdle(() => safeInit(initParticles), 900);
    runWhenIdle(() => safeInit(init3DCardEffect), 1200);
    runWhenIdle(() => safeInit(initThreeJS), 1500);
    runWhenIdle(() => safeInit(initChatbot), 1500);
    runWhenIdle(() => safeInit(initTerminal), 1500);
});

// ========================================
// 粒子背景動畫
// ========================================
function initParticles() {
    if (prefersReducedMotion || isSaveDataMode) {
        return;
    }

    const canvas = document.getElementById('particles-canvas');
    
    // 如果 canvas 不存在，直接返回
    if (!canvas) {
        console.warn('Particles canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let isPageVisible = !document.hidden;
    const maxDistance = 150;
    const maxDistanceSq = maxDistance * maxDistance;

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
        if (!isPageVisible) {
            requestAnimationFrame(animate);
            return;
        }

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
                const distanceSq = dx * dx + dy * dy;

                if (distanceSq < maxDistanceSq) {
                    const distance = Math.sqrt(distanceSq);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / maxDistance})`;
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
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
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

    if (!navbar || !navMenu) return;

    const closeMobileMenu = () => {
        navMenu.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
    };

    const openMobileMenu = () => {
        navMenu.classList.add('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.add('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.classList.add('menu-open');
    };
    
    // 滾動時改變導航欄樣式
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // 平滑滾動
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // 只對內部錨點連結（以 # 開頭）進行平滑滾動
            // 讓外部連結（如 lab.html、admin.html）正常跳轉
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            
            // 關閉手機選單
            closeMobileMenu();
        });
    });
    
    // 手機選單切換
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-controls', 'nav-menu');
        mobileMenuToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            closeMobileMenu();
        }
    });

    registerGlobalShortcut((e) => {
        if (e.key !== 'Escape') return false;
        closeMobileMenu();
        return true;
    });

    updateActiveLink();
}

// ========================================
// 主題切換功能
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // 防止重複初始化
    if (themeToggle.dataset.themeBound === 'true') return;

    const body = document.body;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    themeToggle.dataset.themeBound = 'true';
    
    // 檢查本地儲存的主題設定
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
    });

    registerGlobalShortcut((e) => {
        if (!(e.key === 't' || e.key === 'T') || e.ctrlKey || e.metaKey || e.altKey) return false;
        if (isTypingTarget(e.target)) return false;
        e.preventDefault();
        themeToggle.click();
        return true;
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
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, { passive: true });
    
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
    if (!typingText) return;

    if (prefersReducedMotion) {
        typingText.textContent = '全端工程師';
        return;
    }

    const textsByLanguage = {
        zh: ['全端工程師', '前端開發者', 'UI/UX 設計師', '問題解決者', '終身學習者'],
        en: ['Full-Stack Engineer', 'Frontend Developer', 'UI/UX Designer', 'Problem Solver', 'Lifelong Learner']
    };
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    function type() {
        const texts = textsByLanguage[currentLanguage] || textsByLanguage.zh;
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
    if (prefersReducedMotion) {
        return;
    }

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
    if (!form) return;

    const formMessage = document.querySelector('.form-message');
    if (!formMessage) return;
    
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

        const hasSuspiciousContent = (value) => {
            const text = String(value || '').toLowerCase();
            return /<\s*script|javascript:|data:text\/html|on\w+\s*=/.test(text);
        };
        
        // 清除之前的錯誤訊息
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
        
        // 驗證姓名
        if (name.value.trim() === '') {
            showError(name, '請輸入您的姓名');
            isValid = false;
        } else if (hasSuspiciousContent(name.value)) {
            showError(name, '姓名格式不正確');
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
        } else if (hasSuspiciousContent(subject.value)) {
            showError(subject, '主題包含不允許字元');
            isValid = false;
        }
        
        // 驗證訊息
        if (message.value.trim() === '') {
            showError(message, '請輸入訊息內容');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, '訊息內容至少需要 10 個字元');
            isValid = false;
        } else if (hasSuspiciousContent(message.value)) {
            showError(message, '訊息內容包含不允許字元');
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

function initAnalyticsTracking() {
    const gaMeta = document.querySelector('meta[name="ga-measurement-id"]');
    if (!gaMeta) return;

    const measurementId = (gaMeta.getAttribute('content') || '').trim();
    const isValidMeasurementId = /^G-[A-Z0-9]+$/.test(measurementId) && measurementId !== 'G-XXXXXXXXXX';
    if (!isValidMeasurementId) {
        console.warn('GA measurement ID is missing or placeholder. Analytics disabled.');
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };

    loadExternalScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`)
        .then(() => {
            window.gtag('js', new Date());
            window.gtag('config', measurementId, {
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
            });
        })
        .catch((error) => {
            console.warn('Failed to load Google Analytics:', error);
        });
}

// 追蹤按鈕點擊
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('Button', 'Click', this.textContent.trim());
    });
});

// ========================================
// 新功能實現
// ========================================

// 滾動進度條
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    
    if (!progressBar) {
        console.warn('Scroll progress bar not found');
        return;
    }
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

// 鼠標跟隨效果
function initCursorFollower() {
    if (prefersReducedMotion) {
        return;
    }

    const cursorFollower = document.getElementById('cursor-follower');
    
    // 如果 cursorFollower 不存在，直接返回
    if (!cursorFollower) {
        console.warn('Cursor follower element not found');
        return;
    }
    
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
let currentLanguage = localStorage.getItem('language') || 'zh';
const translationCache = JSON.parse(localStorage.getItem('translation-cache-v1') || '{}');
const textNodeOriginalMap = new Map();
const attrOriginalMap = new Map();

function saveTranslationCache() {
    localStorage.setItem('translation-cache-v1', JSON.stringify(translationCache));
}

function isTranslatableText(text) {
    if (!text) return false;
    const trimmed = text.trim();
    if (!trimmed) return false;
    // 只翻譯含中文的內容，避免覆蓋既有英文與數字內容
    return /[\u3400-\u9FFF]/.test(trimmed);
}

function parseTranslateResponse(data) {
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
    return data[0]
        .map(item => (Array.isArray(item) ? item[0] : ''))
        .join('')
        .trim();
}

async function translateToEnglish(text) {
    const key = `zh-en:${text}`;
    if (translationCache[key]) return translationCache[key];

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-TW&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Translate API failed: ${response.status}`);

    const data = await response.json();
    const translated = parseTranslateResponse(data) || text;
    translationCache[key] = translated;
    saveTranslationCache();
    return translated;
}

function collectTextNodesForTranslation() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const targets = [];

    while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        if (!parent) continue;
        if (parent.closest('script, style, noscript')) continue;
        if (parent.closest('[data-zh][data-en]')) continue;

        const original = textNodeOriginalMap.get(node) ?? node.textContent;
        if (!textNodeOriginalMap.has(node)) {
            textNodeOriginalMap.set(node, original);
        }

        if (!isTranslatableText(original)) continue;

        const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
        if (!match) continue;

        const [, prefix, core, suffix] = match;
        if (!isTranslatableText(core)) continue;

        targets.push({ node, prefix, core, suffix });
    }

    return targets;
}

function collectAttrTargetsForTranslation() {
    const attrs = ['placeholder', 'title', 'aria-label', 'alt'];
    const elements = document.querySelectorAll('*');
    const targets = [];

    elements.forEach(el => {
        if (el.matches('script, style, noscript')) return;
        if (el.closest('[data-zh][data-en]')) return;

        attrs.forEach(attr => {
            const value = el.getAttribute(attr);
            if (!isTranslatableText(value)) return;

            let attrMap = attrOriginalMap.get(el);
            if (!attrMap) {
                attrMap = new Map();
                attrOriginalMap.set(el, attrMap);
            }

            if (!attrMap.has(attr)) {
                attrMap.set(attr, value);
            }

            targets.push({ el, attr, value: attrMap.get(attr) });
        });
    });

    return targets;
}

async function translatePageToEnglish() {
    const textTargets = collectTextNodesForTranslation();
    const attrTargets = collectAttrTargetsForTranslation();
    const unique = new Set();

    textTargets.forEach(({ core }) => unique.add(core));
    attrTargets.forEach(({ value }) => unique.add(value));
    if (isTranslatableText(document.title)) unique.add(document.title);

    const mapping = {};
    const limitedSources = Array.from(unique).slice(0, MAX_REMOTE_TRANSLATION_ITEMS);
    const tasks = limitedSources.map(async (source) => {
        try {
            mapping[source] = await translateToEnglish(source);
        } catch (error) {
            console.warn('Translation failed:', source, error);
            mapping[source] = source;
        }
    });

    await Promise.all(tasks);

    textTargets.forEach(({ node, prefix, core, suffix }) => {
        node.textContent = `${prefix}${mapping[core] || core}${suffix}`;
    });

    attrTargets.forEach(({ el, attr, value }) => {
        el.setAttribute(attr, mapping[value] || value);
    });

    if (isTranslatableText(document.title)) {
        document.title = mapping[document.title] || document.title;
    }
}

function restoreOriginalLanguageContent() {
    textNodeOriginalMap.forEach((original, node) => {
        if (node && node.parentNode) {
            node.textContent = original;
        }
    });

    attrOriginalMap.forEach((attrMap, el) => {
        if (!el || !el.isConnected) return;
        attrMap.forEach((value, attr) => {
            el.setAttribute(attr, value);
        });
    });
}

function initLanguageToggle() {
    const langToggle = document.getElementById('language-toggle');
    if (!langToggle) return;

    const langText = langToggle.querySelector('.lang-text');
    if (!langText) return;

    langToggle.dataset.languageBound = 'true';
    langToggle.setAttribute('aria-pressed', currentLanguage === 'en' ? 'true' : 'false');
    langToggle.title = '切換語言';

    langText.textContent = currentLanguage === 'zh' ? 'EN' : '中';
    updateLanguage();
    
    langToggle.addEventListener('click', async () => {
        currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        if (currentLanguage === 'en' && !isRemoteTranslationEnabled()) {
            const shouldEnableRemoteTranslation = window.confirm('是否允許使用第三方翻譯服務補翻英文？這可能會傳送部分頁面文字到外部 API。');
            if (shouldEnableRemoteTranslation) {
                localStorage.setItem(REMOTE_TRANSLATION_CONSENT_KEY, 'true');
            }
        }
        localStorage.setItem('language', currentLanguage);
        langText.textContent = currentLanguage === 'zh' ? 'EN' : '中';
        langToggle.setAttribute('aria-pressed', currentLanguage === 'en' ? 'true' : 'false');
        await updateLanguage();
        unlockAchievement('explorer');
    });

    registerGlobalShortcut((e) => {
        if (!(e.key === 'l' || e.key === 'L') || e.ctrlKey || e.metaKey || e.altKey) return false;
        if (isTypingTarget(e.target)) return false;
        e.preventDefault();
        langToggle.click();
        return true;
    });
}

async function updateLanguage() {
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

    if (currentLanguage === 'zh') {
        restoreOriginalLanguageContent();
        return;
    }

    if (!isRemoteTranslationEnabled()) {
        return;
    }

    await translatePageToEnglish();
}

// 音樂播放器
let isPlaying = false;
let audioContext;
let melodyTimer;
let activeVoices = [];
let pianoStep = 0;

// ========== 鋼琴樂譜 ==========
// 樂譜1: 經典旋律（歡迎樂）
const pianoScore = [
    // 第一段
    { notes: [261.63], beat: 0.5 },  // C4
    { notes: [293.66], beat: 0.5 },  // D4
    { notes: [329.63], beat: 1 },    // E4
    { notes: [392.0], beat: 1 },     // G4
    { notes: [392.0], beat: 0.5 },   // G4
    { notes: [329.63], beat: 0.5 },  // E4
    { notes: [293.66], beat: 1 },    // D4
    { notes: [261.63], beat: 1 },    // C4
    // 第二段
    { notes: [220.0], beat: 0.5 },   // A3
    { notes: [246.94], beat: 0.5 },  // B3
    { notes: [261.63], beat: 1 },    // C4
    { notes: [329.63], beat: 1 },    // E4
    { notes: [329.63], beat: 0.5 },  // E4
    { notes: [293.66], beat: 0.5 },  // D4
    { notes: [293.66], beat: 1 },    // D4
    { notes: [261.63], beat: 1 }     // C4
];

// 樂譜2: 寧靜夜晚（Peaceful Night）
const pianoScorePeaceful = [
    { notes: [261.63], beat: 1 },    // C4
    { notes: [196.0], beat: 1 },     // G3
    { notes: [196.0], beat: 0.5 },   // G3
    { notes: [220.0], beat: 0.5 },   // A3
    { notes: [246.94], beat: 1 },    // B3
    { notes: [261.63], beat: 1 },    // C4
    { notes: [329.63], beat: 1 },    // E4
    { notes: [392.0], beat: 1 },     // G4
    { notes: [349.23], beat: 0.5 },  // F4
    { notes: [329.63], beat: 0.5 },  // E4
    { notes: [293.66], beat: 1 },    // D4
    { notes: [261.63], beat: 1 },    // C4
];

// 樂譜3: 歡樂節慶（Festive Joy）
const pianoScoreFestive = [
    // 第一段
    { notes: [392.0, 261.63], beat: 0.5 }, // G4 + C4（和弦）
    { notes: [440.0], beat: 0.5 },          // A4
    { notes: [493.88], beat: 0.5 },         // B4
    { notes: [523.25], beat: 0.5 },         // C5
    { notes: [523.25], beat: 1 },           // C5
    { notes: [493.88], beat: 0.5 },         // B4
    { notes: [440.0], beat: 0.5 },          // A4
    { notes: [392.0], beat: 1 },            // G4
    // 第二段
    { notes: [349.23], beat: 1 },           // F4
    { notes: [329.63], beat: 1 },           // E4
    { notes: [349.23], beat: 0.5 },         // F4
    { notes: [392.0], beat: 0.5 },          // G4
    { notes: [440.0], beat: 1 },            // A4
    { notes: [523.25], beat: 1 }            // C5
];

let currentScoreName = 'welcome';
let pianoScores = {
    welcome: pianoScore,
    peaceful: pianoScorePeaceful,
    festive: pianoScoreFestive
};

const pianoBeatMs = 400;

// 訪客計數器
function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    let count = localStorage.getItem('visitorCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    
    animateCounter(counterEl, 0, count, 2000);
}

function animateCounter(element, start, end, duration) {
    if (!element) return;

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
    if (!clockEl) return;
    
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

    if (ctx.dataset.chartInitialized === 'true') return;

    const renderChart = () => {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

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

        ctx.dataset.chartInitialized = 'true';
    };

    if (typeof Chart === 'undefined') {
        loadExternalScript('https://cdn.jsdelivr.net/npm/chart.js', 'Chart')
            .then(renderChart)
            .catch((error) => {
                console.warn('Failed to lazy-load Chart.js:', error);
            });
        return;
    }

    renderChart();
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

    if (!textDisplay || !textInput || !startBtn || !resetBtn || !timeEl || !wpmEl || !accuracyEl || !errorsEl || !resultsDiv) {
        return;
    }
    
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
    const shareSection = document.querySelector('.social-share-section');
    if (!shareSection) return;

    shareSection.addEventListener('click', (event) => {
        const button = event.target.closest('.share-btn[data-share]');
        if (!button) return;

        const shareTarget = button.getAttribute('data-share');
        if (shareTarget === 'facebook') {
            shareOnFacebook();
        } else if (shareTarget === 'twitter') {
            shareOnTwitter();
        } else if (shareTarget === 'linkedin') {
            shareOnLinkedIn();
        } else if (shareTarget === 'whatsapp') {
            shareOnWhatsApp();
        } else if (shareTarget === 'copy-link') {
            copyPageLink();
        }
    });
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
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            unlockAchievement('theme');
        });
    }
    
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
    const supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    if (!supportsHover || prefersReducedMotion) {
        return;
    }

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

// ========================================
// Three.js 3D 背景動畫
// ========================================
function initThreeJS() {
    if (prefersReducedMotion || isSaveDataMode) {
        return;
    }

    const container = document.getElementById('three-container');

    if (!container) {
        return;
    }

    if (container.dataset.threeInitialized === 'true') {
        return;
    }

    const mountThree = () => {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded');
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // 創建幾何體
        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true
        });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        camera.position.z = 30;

        // 動畫循環
        function animate() {
            requestAnimationFrame(animate);
            torusKnot.rotation.x += 0.01;
            torusKnot.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();

        // 窗口大小調整
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });

        container.dataset.threeInitialized = 'true';
    };

    const loadAndMount = () => {
        if (typeof THREE !== 'undefined') {
            mountThree();
            return;
        }

        loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'THREE')
            .then(mountThree)
            .catch((error) => {
                console.warn('Failed to lazy-load Three.js:', error);
            });
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadAndMount, { timeout: 2000 });
    } else {
        setTimeout(loadAndMount, 300);
    }
}

// ========================================
// AI 聊天機器人功能
// ========================================
function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const panel = document.getElementById('chatbot-panel');
    
    // 添加更好的錯誤處理
    if (!toggle || !panel) {
        console.warn('Chatbot elements not found');
        return;
    }
    
    const closeBtn = panel.querySelector('.chatbot-close');
    const minimizeBtn = panel.querySelector('.chatbot-minimize');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const messagesContainer = document.getElementById('chatbot-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    if (!closeBtn || !minimizeBtn || !input || !sendBtn || !messagesContainer) {
        console.warn('Some chatbot elements are missing');
        return;
    }
    
    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
    });
    
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });
    
    minimizeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    quickQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            input.value = question;
            sendMessage();
        });
    });
    
    function sendMessage() {
        const message = input.value.trim();
        if (!message) return;
        
        // 顯示用戶消息
        addMessage(message, 'user');
        
        // 記錄到後台日誌
        logChatMessage(message, 'user');
        
        input.value = '';
        
        // AI 回覆（模擬）
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessage(response, 'bot');
            logChatMessage(response, 'bot');
        }, 800);
    }
    
    function appendTextWithBreaks(container, text) {
        const parts = String(text).split(/<br\s*\/?>|\n/gi);
        parts.forEach((part, index) => {
            container.appendChild(document.createTextNode(part));
            if (index < parts.length - 1) {
                container.appendChild(document.createElement('br'));
            }
        });
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        const paragraph = document.createElement('p');
        appendTextWithBreaks(paragraph, text);
        content.appendChild(paragraph);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function getAIResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('技能') || msg.includes('skill')) {
            return '我精通前端開發（HTML、CSS、JavaScript、React）、後端開發（Node.js、Python）以及資料庫管理（MySQL、MongoDB）。我也熟悉 Git 版本控制和 DevOps 工具。';
        } else if (msg.includes('經歷') || msg.includes('experience')) {
            return '我有5年以上的開發經驗，曾在多家科技公司工作，參與過大型電商平台、企業管理系統等專案開發。';
        } else if (msg.includes('專案') || msg.includes('project')) {
            return '我完成了超過50個專案，包括電商平台、社交媒體應用、數據分析平台等。您可以查看我的作品集區塊了解更多細節！';
        } else if (msg.includes('聯絡') || msg.includes('contact')) {
            return currentLanguage === 'zh'
                ? '您可以通過以下方式聯絡我：<br>📧 Email: 11028201@cycu.org.tw<br>💼 LinkedIn: linkedin.com/in/孟麟-高-b88773191<br>🐙 GitHub: github.com/jerry98166<br>也歡迎使用頁面下方的聯絡表單！'
                : 'You can contact me via:<br>📧 Email: 11028201@cycu.org.tw<br>💼 LinkedIn: linkedin.com/in/孟麟-高-b88773191<br>🐙 GitHub: github.com/jerry98166<br>You can also use the contact form below.';
        } else if (msg.includes('學歷') || msg.includes('education')) {
            return '我畢業於知名大學計算機科學系，擁有學士學位，並持續學習最新的技術和框架。';
        } else {
            return '感謝您的問題！您可以詢問我關於技能、經歷、專案、學歷或聯絡方式等相關問題。如需更詳細的資訊，歡迎瀏覽網站各個區塊。';
        }
    }
}

// ========================================
// 互動終端機功能
// ========================================
function initTerminal() {
    const toggle = document.getElementById('terminal-toggle');
    const panel = document.getElementById('terminal-panel');
    
    // 添加錯誤處理
    if (!toggle || !panel) {
        console.warn('Terminal elements not found');
        return;
    }
    
    const closeBtn = panel.querySelector('.terminal-close');
    const minimizeBtn = panel.querySelector('.terminal-minimize');
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');
    
    if (!closeBtn || !minimizeBtn || !input || !body) {
        console.warn('Some terminal elements are missing');
        return;
    }
    
    const output = body.querySelector('.terminal-output');
    
    if (!output) {
        console.warn('Terminal output element not found');
        return;
    }
    
    const commands = {
        help: () => `Available commands:
  help       - Show this help message
  about      - Display information about me
  skills     - List my skills
  projects   - Show my projects
  contact    - Get contact information
  experience - View my work experience
  education  - Display my education
  clear      - Clear the terminal
  date       - Show current date and time
  echo       - Print a message`,
        
        about: () => `Name: 高孟麟 (Menglin Gao)
Role: Full-Stack Developer
Experience: 5+ years
Location: Taiwan
Interests: Web Development, AI, Open Source`,
        
        skills: () => `Technical Skills:
• Frontend: HTML, CSS, JavaScript, React, Vue.js
• Backend: Node.js, Python, PHP
• Database: MySQL, MongoDB, PostgreSQL
• Tools: Git, Docker, AWS
• Other: RESTful API, GraphQL, DevOps`,
        
        projects: () => `Recent Projects:
1. E-commerce Platform - Full-stack web application
2. Social Media Dashboard - React-based analytics tool
3. Task Management System - Team collaboration app
4. Portfolio Website - You're looking at it!`,
        
        contact: () => `Contact Information:
    Email: 11028201@cycu.org.tw
    GitHub: github.com/jerry98166
LinkedIn: linkedin.com/in/孟麟-高-b88773191
X (Twitter): x.com/Jerry59877
Instagram: instagram.com/jerry98166
Facebook: facebook.com/allen.jerry.357827`,
        
        experience: () => `Work Experience:
• Senior Developer at Tech Corp (2021-Present)
• Full-Stack Developer at StartUp Inc (2019-2021)
• Junior Developer at Web Agency (2018-2019)`,
        
        education: () => `Education:
• Bachelor of Computer Science
  University of Technology (2014-2018)
• Web Development Bootcamp
  Tech Academy (2017)`,
        
        clear: () => {
            output.innerHTML = '';
            return '';
        },
        
        date: () => new Date().toString(),
        
        echo: (args) => args.join(' ')
    };
    
    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) {
            input.focus();
        }
    });
    
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });
    
    minimizeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                executeCommand(command);
                input.value = '';
            }
        }
    });
    
    function executeCommand(commandStr) {
        // 顯示輸入的命令
        addLine(`visitor@portfolio:~$ ${commandStr}`);
        
        // 記錄到後台日誌
        logTerminalCommand(commandStr);
        
        // 解析命令
        const parts = commandStr.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // 執行命令
        if (commands[cmd]) {
            const result = commands[cmd](args);
            if (result) {
                addLine(result);
            }
        } else {
            addLine(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
        
        addLine('────────────────────────────────────────');
    }
    
    function addLine(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        output.appendChild(line);
        body.scrollTop = body.scrollHeight;
    }
}

// ========================================
// 訪客留言板功能
// ========================================
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const messagesContainer = document.querySelector('.messages-container');
    
    // 添加錯誤處理
    if (!form || !messagesContainer) {
        console.warn('Guestbook elements not found');
        return;
    }
    
    // 從 localStorage 載入留言
    loadMessages();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('guest-name').value.trim();
        const email = document.getElementById('guest-email').value.trim();
        const message = document.getElementById('guest-message').value.trim();
        
        if (name && message) {
            addMessage({
                name: name,
                email: email,
                message: message,
                date: new Date().toISOString()
            });
            
            form.reset();
            
            // 顯示成功提示
            showNotification('留言已成功發送！', 'success');
        }
    });
    
    function addMessage(data) {
        // 保存到 localStorage
        const messages = getMessages();
        messages.unshift(data);
        localStorage.setItem('guestbook_messages', JSON.stringify(messages));
        
        // 顯示留言
        displayMessage(data);
    }
    
    function displayMessage(data) {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        
        const date = new Date(data.date);
        const dateStr = date.toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageCard.innerHTML = `
            <div class="message-header">
                <span class="message-author">${escapeHtml(data.name)}</span>
                <span class="message-date">${dateStr}</span>
            </div>
            <p class="message-text">${escapeHtml(data.message)}</p>
        `;
        
        messagesContainer.insertBefore(messageCard, messagesContainer.firstChild);
    }
    
    function loadMessages() {
        const messages = getMessages();
        messages.forEach(msg => displayMessage(msg));
    }
    
    function getMessages() {
        const stored = localStorage.getItem('guestbook_messages');
        return stored ? JSON.parse(stored) : [];
    }
    
    function showNotification(message, type) {
        // 簡單的通知功能
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========================================
// 在線狀態更新
// ========================================
function initOnlineStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    // 添加錯誤處理
    if (!statusDot || !statusText) {
        console.warn('Online status elements not found');
        return;
    }
    
    // 模擬在線狀態變化
    setInterval(() => {
        const isOnline = Math.random() > 0.1; // 90% 在線機率
        
        if (isOnline) {
            statusDot.style.background = '#10b981';
            statusText.setAttribute('data-zh', '在線');
            statusText.setAttribute('data-en', 'Online');
            statusText.textContent = currentLanguage === 'zh' ? '在線' : 'Online';
        } else {
            statusDot.style.background = '#ef4444';
            statusText.setAttribute('data-zh', '離線');
            statusText.setAttribute('data-en', 'Offline');
            statusText.textContent = currentLanguage === 'zh' ? '離線' : 'Offline';
        }
    }, 30000); // 每30秒更新一次
}

// ========================================
// 後台日誌記錄功能
// ========================================
function logChatMessage(message, type) {
    const log = JSON.parse(localStorage.getItem('chatbot_log') || '[]');
    log.push({
        message: message,
        type: type,
        time: new Date().toISOString()
    });
    localStorage.setItem('chatbot_log', JSON.stringify(log));
}

function logTerminalCommand(command) {
    const log = JSON.parse(localStorage.getItem('terminal_log') || '[]');
    log.push({
        command: command,
        time: new Date().toISOString(),
        ip: '127.0.0.1' // 模擬IP
    });
    localStorage.setItem('terminal_log', JSON.stringify(log));
}


// ========================================
// 滾動漸顯動畫 (Scroll Reveal for Rich UI)
// ========================================
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.5, 0, 0, 1)';
        card.style.transitionDelay = `${(index % 5) * 0.1}s`;
        observer.observe(card);
    });

    // 動態添加 revealed 類別的樣式
    const style = document.createElement('style');
    style.textContent = `
        .glass-card.revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// 確保在頁面加載完成後執行
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initScrollReveal, 500); 
});


// ========================================
// 3D 懸停傾斜特效 (3D Tilt Effect for Glass Cards)
// ========================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // 鼠標在卡片內的 X 座標
            const y = e.clientY - rect.top;  // 鼠標在卡片內的 Y 座標
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // 最大傾斜 5 度
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initTiltEffect, 500); 
});
