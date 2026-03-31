/**
 * 性能優化模組
 * 包含圖片延遲加載、資源優化等功能
 */

const perfDebounce = window.debounce || ((fn, delay = 300) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
});

const perfPrefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// 智能資源加載
// ========================================

class ResourceOptimizer {
    constructor() {
        this.loadedImages = new Set();
        this.pendingResources = [];
    }

    // 圖片延遲加載
    initLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackLazyLoading();
            return;
        }

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src && !this.loadedImages.has(img)) {
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 加載圖片
    loadImage(img) {
        if (this.loadedImages.has(img)) return;

        const src = img.dataset.src;
        const newImg = new Image();

        newImg.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            this.loadedImages.add(img);
            img.classList.add('loaded');
        };

        newImg.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
        };

        newImg.src = src;
    }

    // 備用延遲加載（無 IntersectionObserver）
    fallbackLazyLoading() {
        const onScroll = perfDebounce(() => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                if (!this.loadedImages.has(img)) {
                    const rect = img.getBoundingClientRect();
                    if (rect.top < window.innerHeight + 100) {
                        this.loadImage(img);
                    }
                }
            });
        }, 200);

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Web Font 最適化加載
    initFontLoading() {
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1em Poppins'),
                document.fonts.load('500 1em Poppins'),
                document.fonts.load('600 1em Poppins'),
                document.fonts.load('700 1em Poppins'),
                document.fonts.load('400 1em Noto Sans TC'),
                document.fonts.load('500 1em Noto Sans TC'),
                document.fonts.load('700 1em Noto Sans TC')
            ]).then(() => {
                document.body.classList.add('fonts-loaded');
            }).catch(() => {
                // 字體加載失敗使用系統字體
                document.body.classList.add('fonts-fallback');
            });
        }
    }

    // 連接預熱 (Preconnect / DNS Prefetch)
    initResourceHints() {
        const links = [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: true },
            { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
            { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
        ];

        links.forEach(linkConfig => {
            const existingLink = document.querySelector(`link[rel="${linkConfig.rel}"][href="${linkConfig.href}"]`);
            if (existingLink) return;

            const link = document.createElement('link');
            link.rel = linkConfig.rel;
            link.href = linkConfig.href;
            if (linkConfig.crossOrigin) {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }
}

// ========================================
// 帧速率監測
// ========================================

class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.isRunning = false;
        this.rafId = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        const measure = () => {
            if (!this.isRunning) return;

            if (document.hidden) {
                this.lastTime = performance.now();
                this.frameCount = 0;
                this.rafId = requestAnimationFrame(measure);
                return;
            }

            const now = performance.now();
            const delta = now - this.lastTime;

            if (delta >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / delta);
                
                // 根據FPS調整動畫品質
                if (this.fps < 30) {
                    document.body.classList.add('low-performance');
                } else if (this.fps > 50) {
                    document.body.classList.remove('low-performance');
                }

                this.frameCount = 0;
                this.lastTime = now;
            }

            this.frameCount++;
            this.rafId = requestAnimationFrame(measure);
        };

        this.rafId = requestAnimationFrame(measure);
    }

    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    disableAnimations() {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-base', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }
}

// ========================================
// 記憶優化
// ========================================

class MemoryOptimizer {
    static cleanup() {
        // 清除未使用的DOM節點
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.removeUnusedElements();
            });
        } else {
            setTimeout(() => {
                this.removeUnusedElements();
            }, 1000);
        }
    }

    static removeUnusedElements() {
        // 移除隱藏的裝飾元素
        document.querySelectorAll('[data-cleanup]').forEach(el => {
            if (!el.offsetParent) {
                el.remove();
            }
        });
    }

    static optimizeStorage() {
        // 清除過期的本地存儲
        const cacheTime = 24 * 60 * 60 * 1000; // 24小時
        const now = Date.now();

        for (let key in localStorage) {
            if (key.startsWith('cache-')) {
                try {
                    const data = JSON.parse(localStorage[key]);
                    if (data.timestamp && now - data.timestamp > cacheTime) {
                        localStorage.removeItem(key);
                    }
                } catch(e) {
                    localStorage.removeItem(key);
                }
            }
        }
    }
}

// ========================================
// 網路狀態監測
// ========================================

class NetworkMonitor {
    static init() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const type = connection.effectiveType;

            if (type === '2g' || type === '3g' || type.includes('slow')) {
                document.body.classList.add('slow-network');
                this.enableLowBandwidthMode();
            }

            connection.addEventListener('change', () => {
                const newType = connection.effectiveType;
                if (newType === '2g' || newType === '3g') {
                    document.body.classList.add('slow-network');
                    this.enableLowBandwidthMode();
                } else {
                    document.body.classList.remove('slow-network');
                }
            });
        }
    }

    static enableLowBandwidthMode() {
        // 禁用自動播放
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            video.autoplay = false;
        });

        // 關閉動畫
        document.documentElement.style.setProperty('--transition-base', '0.1s');
    }
}

// ========================================
// 初始化
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // 初始化資源優化器
    const optimizer = new ResourceOptimizer();
    optimizer.initLazyLoading();
    optimizer.initFontLoading();
    optimizer.initResourceHints();

    // 初始化性能監測
    const monitor = new PerformanceMonitor();
    if (!perfPrefersReducedMotion) {
        monitor.start();
    }

    // 初始化記憶優化
    MemoryOptimizer.cleanup();
    MemoryOptimizer.optimizeStorage();

    // 初始化網路監測
    NetworkMonitor.init();
});

// 在頁面卸載前清理
window.addEventListener('beforeunload', () => {
    MemoryOptimizer.cleanup();
});

// 導出供其他腳本使用
window.ResourceOptimizer = ResourceOptimizer;
window.PerformanceMonitor = PerformanceMonitor;
window.MemoryOptimizer = MemoryOptimizer;
window.NetworkMonitor = NetworkMonitor;
