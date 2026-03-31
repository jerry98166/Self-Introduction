(function () {
    'use strict';

    const RATE_LIMIT_MS = 15000;
    const BLOCKED_SCHEMES = ['javascript:', 'vbscript:', 'file:'];
    const ALLOWED_IFRAME_HOSTS = new Set([]);

    function isBlockedUrl(rawValue) {
        if (!rawValue) return false;
        const value = String(rawValue).trim().toLowerCase();
        if (!value) return false;

        // Allow in-page anchors and common safe protocols.
        if (value.startsWith('#') || value.startsWith('/') || value.startsWith('./') || value.startsWith('../')) {
            return false;
        }

        return BLOCKED_SCHEMES.some((scheme) => value.startsWith(scheme));
    }

    function sanitizeUrlAttributes(root) {
        const scope = root || document;
        const nodes = scope.querySelectorAll('a[href], form[action], iframe[src], script[src]');

        nodes.forEach((node) => {
            const attr = node.hasAttribute('href')
                ? 'href'
                : node.hasAttribute('action')
                    ? 'action'
                    : 'src';
            const raw = node.getAttribute(attr);

            if (isBlockedUrl(raw)) {
                node.removeAttribute(attr);
                if (node.tagName === 'A') {
                    node.setAttribute('href', '#');
                }
            }
        });
    }

    function hardenExternalLinks(root) {
        const scope = root || document;
        const links = scope.querySelectorAll('a[target="_blank"]');

        links.forEach((link) => {
            const rel = (link.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
            const set = new Set(rel);
            set.add('noopener');
            set.add('noreferrer');
            link.setAttribute('rel', Array.from(set).join(' '));
        });
    }

    function hardenForms() {
        const forms = document.querySelectorAll('form');

        forms.forEach((form, formIndex) => {
            const formId = form.id || `form-${formIndex}`;
            const honeypotName = 'company_website';
            const existingHoneypot = form.querySelector(`input[name="${honeypotName}"]`);

            if (!existingHoneypot) {
                const trap = document.createElement('input');
                trap.type = 'text';
                trap.name = honeypotName;
                trap.tabIndex = -1;
                trap.autocomplete = 'off';
                trap.setAttribute('aria-hidden', 'true');
                trap.style.position = 'absolute';
                trap.style.left = '-9999px';
                trap.style.opacity = '0';
                form.appendChild(trap);
            }

            const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
            textInputs.forEach((input) => {
                if (!input.hasAttribute('maxlength')) {
                    if (input.tagName === 'TEXTAREA') {
                        input.setAttribute('maxlength', '2000');
                    } else if (input.type === 'email') {
                        input.setAttribute('maxlength', '254');
                    } else {
                        input.setAttribute('maxlength', '200');
                    }
                }
            });

            if (form.dataset.securityBound === 'true') return;
            form.dataset.securityBound = 'true';

            form.addEventListener('submit', (event) => {
                const honeypot = form.querySelector(`input[name="${honeypotName}"]`);
                if (honeypot && honeypot.value.trim() !== '') {
                    event.preventDefault();
                    return;
                }

                const key = `last-submit:${formId}`;
                const now = Date.now();
                const last = Number(sessionStorage.getItem(key) || '0');
                if (last && now - last < RATE_LIMIT_MS) {
                    event.preventDefault();
                    return;
                }

                sessionStorage.setItem(key, String(now));
            });
        });
    }

    function protectFromFraming() {
        if (window.top === window.self) return;

        try {
            const referrer = document.referrer ? new URL(document.referrer) : null;
            if (referrer && referrer.origin === window.location.origin) {
                return;
            }

            if (referrer && ALLOWED_IFRAME_HOSTS.has(referrer.hostname)) {
                return;
            }

            document.documentElement.style.display = 'none';
            window.top.location = window.self.location.href;
        } catch (error) {
            // If cross-origin frame access is blocked, hide content as a safe fallback.
            document.documentElement.style.display = 'none';
        }
    }

    function observeDynamicNodes() {
        if (!('MutationObserver' in window)) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;
                    sanitizeUrlAttributes(node);
                    hardenExternalLinks(node);
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        protectFromFraming();
        sanitizeUrlAttributes(document);
        hardenExternalLinks(document);
        hardenForms();
        observeDynamicNodes();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
