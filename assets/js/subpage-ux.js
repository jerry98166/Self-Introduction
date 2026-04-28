(function () {
    const STYLE_ID = 'global-subpage-ux-style';
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
            '.skip-link{position:absolute;left:16px;top:-64px;z-index:4000;background:#0f172a;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;box-shadow:0 8px 20px rgba(0,0,0,.25);transition:top .2s ease;}',
            '.skip-link:focus{top:16px;}',
            'a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:3px solid #f59e0b;outline-offset:2px;}',
            '.subpage-float-btn{position:fixed !important;right:24px !important;width:46px !important;height:46px !important;border:none !important;border-radius:999px !important;color:#fff !important;cursor:pointer !important;display:flex !important;align-items:center !important;justify-content:center !important;box-shadow:0 10px 24px rgba(15,23,42,.3) !important;z-index:2500 !important;}',
            '#back-to-top.subpage-float-btn,.global-back-to-top.subpage-float-btn{bottom:24px !important;background:#6366f1 !important;display:flex !important;}',
            '.subpage-float-btn:hover{filter:brightness(1.08);}',
            '.subpage-float-btn.subpage-hidden{display:none !important;}',
            '@media (max-width:768px){.subpage-float-btn{right:16px !important;}#back-to-top.subpage-float-btn,.global-back-to-top.subpage-float-btn{bottom:16px !important;}}',
            '@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto;}*,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;}}'
        ].join('');

        document.head.appendChild(style);
    }

    function ensureSkipLink() {
        if (document.querySelector('.skip-link')) return;

        const target = document.getElementById('main-content') || ensureMainLandmark();
        if (!target) return;

        const skip = document.createElement('a');
        skip.className = 'skip-link';
        skip.href = '#main-content';
        skip.textContent = '跳到主要內容';

        document.body.insertBefore(skip, document.body.firstChild);
    }

    function ensureMainLandmark() {
        let main = document.querySelector('main');

        if (!main) {
            main = document.querySelector('.container, .privacy-container, .app-container, .main-content, #app, #root');
        }

        if (!main) return null;
        if (!main.id) main.id = 'main-content';
        if (main.tagName.toLowerCase() !== 'main') {
            main.setAttribute('role', 'main');
        }
        return main;
    }

    function ensureBackToTop() {
        let btn = document.getElementById('back-to-top');
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'back-to-top';
            btn.className = 'global-back-to-top';
            btn.setAttribute('aria-label', '回到頂部');
            btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
            document.body.appendChild(btn);
        }

        btn.classList.add('subpage-float-btn');

        if (btn.dataset.backToTopBound !== 'true') {
            btn.dataset.backToTopBound = 'true';
            btn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            window.addEventListener('scroll', function () {
                const shouldHide = window.scrollY <= 260;
                btn.classList.toggle('subpage-hidden', shouldHide);
            }, { passive: true });
        }

        btn.classList.toggle('subpage-hidden', window.scrollY <= 260);
    }

    function initMobileMenuAccessibility() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('nav-menu');
        if (!toggle || !menu) return;

        toggle.setAttribute('aria-controls', 'nav-menu');
        toggle.setAttribute('aria-expanded', menu.classList.contains('active') ? 'true' : 'false');

        const syncExpanded = () => {
            toggle.setAttribute('aria-expanded', menu.classList.contains('active') ? 'true' : 'false');
        };

        toggle.addEventListener('click', () => {
            requestAnimationFrame(syncExpanded);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                syncExpanded();
            }
        });

        document.addEventListener('click', (e) => {
            if (!menu.classList.contains('active')) return;
            if (menu.contains(e.target) || toggle.contains(e.target)) return;
            menu.classList.remove('active');
            toggle.classList.remove('active');
            syncExpanded();
        });
    }

    function ensureThemeToggle() {
        let button = document.getElementById('theme-toggle');
        if (!button) {
            button = document.createElement('button');
            button.type = 'button';
            button.id = 'theme-toggle';
            button.className = 'global-theme-toggle';
            button.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
            document.body.appendChild(button);
        }

        if (!button.querySelector('i')) {
            button.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        }

        button.setAttribute('aria-label', '切換主題');
        button.title = '切換主題';

        const icon = button.querySelector('i');
        const applyTheme = (theme) => {
            document.body.setAttribute('data-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        };

        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        if (button.dataset.themeBound !== 'true') {
            button.dataset.themeBound = 'true';
            button.addEventListener('click', () => {
                const current = document.body.getAttribute('data-theme') || 'light';
                const next = current === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', next);
                applyTheme(next);
            });

            document.addEventListener('keydown', (e) => {
                if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    const targetTag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
                    if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;
                    e.preventDefault();
                    button.click();
                }
            });
        }
    }

    function normalizeAriaLabels() {
        const mapping = {
            'theme-toggle': '切換主題',
            'language-toggle': '切換語言',
            'back-to-top': '回到頂部',
            'mobile-menu-toggle': '切換選單'
        };

        Object.keys(mapping).forEach(function (id) {
            const el = document.getElementById(id);
            if (el && !el.getAttribute('aria-label')) {
                el.setAttribute('aria-label', mapping[id]);
            }
        });
    }

    function init() {
        injectStyles();
        ensureMainLandmark();
        ensureSkipLink();
        ensureBackToTop();
        normalizeAriaLabels();
        initMobileMenuAccessibility();
        ensureThemeToggle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
