/**
 * ux-enhancement.js
 * 
 * UX 優化模組，包含：
 * - 智能歡迎提示
 * - 功能發現指南
 * - 加載優化
 * - 使用者互動追蹤
 */

(function() {
    'use strict';
    
    // =========== 配置 ===========
    const UX_CONFIG = {
        welcomeMessageDelay: 2000,
        tooltipDuration: 5000,
        storageKey: 'ux-state',
        features: {
            welcomeMessage: true,
            featureDiscoveryGuide: true,
            loadingOptimization: true,
            analyticsTracking: true
        }
    };
    
    // =========== 歡迎消息 ===========
    function initWelcomeMessage() {
        if (!UX_CONFIG.features.welcomeMessage) return;
        
        const state = getUXState();
        if (state.welcomeShown) return; // 已顯示過，不再顯示
        
        setTimeout(() => {
            showWelcomeToast(
                '👋 歡迎來訪！',
                '探索 64+ 項創新功能 →',
                'lab.html'
            );
            
            setUXState({ welcomeShown: true });
        }, UX_CONFIG.welcomeMessageDelay);
    }
    
    // =========== 功能發現指南 ===========
    function initFeatureDiscoveryGuide() {
        if (!UX_CONFIG.features.featureDiscoveryGuide) return;
        
        // 檢查是否首次訪問
        const state = getUXState();
        if (state.guideDismissed) return;
        
        // 添加功能發現按鈕到頁面
        addFeatureGuideButton();
    }
    
    function addFeatureGuideButton() {
        const button = document.createElement('button');
        button.id = 'feature-guide-btn';
        button.className = 'feature-guide-btn';
        button.title = '新用戶指南 - 發現功能';
        button.innerHTML = '🎯 功能導覽';
        button.styles = `
            position: fixed;
            bottom: 150px;
            right: 20px;
            padding: 0.75rem 1rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            z-index: 999;
            font-weight: 600;
            font-size: 0.9rem;
            animation: pulse 2s infinite;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s;
        `;
        
        button.addEventListener('click', () => {
            showFeatureGuideModal();
            setUXState({ guideDismissed: true });
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(button);
    }
    
    function showFeatureGuideModal() {
        const modal = document.createElement('div');
        modal.id = 'feature-guide-modal';
        modal.className = 'feature-guide-modal';
        modal.innerHTML = `
            <div class="feature-guide-content">
                <button class="guide-close-btn">✕</button>
                <h2>🎯 功能導覽</h2>
                <p>讓我們一起探索您可以訪問的所有令人驚艷的功能！</p>
                
                <div class="guide-steps">
                    <div class="guide-step">
                        <div class="step-icon">📚</div>
                        <h3>功能實驗室</h3>
                        <p>訪問 60+ 項創新功能的完整目錄</p>
                    </div>
                    
                    <div class="guide-step">
                        <div class="step-icon">🤖</div>
                        <h3>AI 智能推薦</h3>
                        <p>根據您的技能獲得個性化的功能推薦</p>
                    </div>
                    
                    <div class="guide-step">
                        <div class="step-icon">📊</div>
                        <h3>功能分析</h3>
                        <p>查看熱門功能和使用統計</p>
                    </div>
                </div>
                
                <div class="guide-actions">
                    <button class="btn-secondary" onclick="this.closest('.feature-guide-modal').remove()">稍後再看</button>
                    <a href="pages/lab.html" class="btn-primary">開始探索 →</a>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .feature-guide-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(4px);
            }
            
            .feature-guide-content {
                background: white;
                border-radius: 20px;
                padding: 3rem 2rem;
                max-width: 600px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                position: relative;
                animation: slideUp 0.4s ease;
            }
            
            .feature-guide-content h2 {
                color: #667eea;
                margin-bottom: 1rem;
                font-size: 1.8rem;
            }
            
            .feature-guide-content > p {
                color: #6b7280;
                margin-bottom: 2rem;
                font-size: 1.05rem;
            }
            
            .guide-close-btn {
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #d1d5db;
                transition: all 0.3s;
            }
            
            .guide-close-btn:hover {
                color: #ef4444;
                transform: rotate(90deg);
            }
            
            .guide-steps {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .guide-step {
                text-align: center;
                padding: 1.5rem;
                background: #f9fafb;
                border-radius: 12px;
                border: 2px solid #e5e7eb;
                transition: all 0.3s;
            }
            
            .guide-step:hover {
                border-color: #667eea;
                background: #f0f4ff;
                transform: translateY(-5px);
            }
            
            .step-icon {
                font-size: 2.5rem;
                margin-bottom: 0.75rem;
            }
            
            .guide-step h3 {
                color: #1f2937;
                font-size: 0.95rem;
                margin-bottom: 0.5rem;
            }
            
            .guide-step p {
                font-size: 0.85rem;
                color: #6b7280;
            }
            
            .guide-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            .btn-secondary, .btn-primary {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                text-decoration: none;
                display: inline-block;
            }
            
            .btn-secondary {
                background: #e5e7eb;
                color: #333;
            }
            
            .btn-secondary:hover {
                background: #d1d5db;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 600px) {
                .feature-guide-content {
                    padding: 2rem 1.5rem;
                }
                
                .guide-steps {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // 綁定關閉按鈕
        modal.querySelector('.guide-close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        // 點擊背景也可關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // =========== 加載優化 ===========
    function initLoadingOptimization() {
        if (!UX_CONFIG.features.loadingOptimization) return;
        
        // 隱藏加載器
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.pointerEvents = 'none';
                    preloader.style.transition = 'opacity 0.5s ease';
                }, 300);
            }
        });
        
        // 優化首屏加載
        optimizeFirstPaint();
    }
    
    function optimizeFirstPaint() {
        // 延遲載入非關鍵資源
        const links = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
        links.forEach(link => {
            link.addEventListener('load', function() {
                this.media = 'all';
            });
        });
    }
    
    // =========== 分析追蹤 ===========
    function initAnalyticsTracking() {
        if (!UX_CONFIG.features.analyticsTracking) return;
        
        // 追蹤首次互動
        document.addEventListener('click', trackFirstInteraction, { once: true });
        
        // 追蹤功能訪問
        trackFeatureVisits();
    }
    
    function trackFirstInteraction() {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'first_interaction', {
            'engagement_time_msec': 100
        });
    }
    
    function trackFeatureVisits() {
        const links = document.querySelectorAll('a[href*="features/"]');
        links.forEach(link => {
            link.addEventListener('click', function() {
                const featureName = this.href.split('/').pop().replace('.html', '');
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'feature_discovery', {
                        'feature_name': featureName
                    });
                }
            });
        });
    }
    
    // =========== 工具函數 ===========
    function showWelcomeToast(title, message, link) {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.innerHTML = `
            <div class="toast-icon">👋</div>
            <div class="toast-content">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
            <a href="${link}" class="toast-action">→</a>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .welcome-toast {
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                z-index: 1000;
                animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .toast-icon {
                font-size: 2rem;
            }
            
            .toast-content h3 {
                margin: 0;
                color: #1f2937;
                font-size: 1rem;
            }
            
            .toast-content p {
                margin: 0.25rem 0 0;
                color: #6b7280;
                font-size: 0.9rem;
            }
            
            .toast-action {
                margin-left: auto;
                font-size: 1.5rem;
                text-decoration: none;
                color: #667eea;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .toast-action:hover {
                transform: scale(1.2) translateX(5px);
                color: #764ba2;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 640px) {
                .welcome-toast {
                    left: 1rem;
                    right: 1rem;
                    bottom: 1rem;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        // 自動移除
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => toast.remove(), 500);
        }, UX_CONFIG.tooltipDuration);
    }
    
    function getUXState() {
        try {
            const stored = localStorage.getItem(UX_CONFIG.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            return {};
        }
    }
    
    function setUXState(updates) {
        try {
            const current = getUXState();
            localStorage.setItem(UX_CONFIG.storageKey, JSON.stringify({ ...current, ...updates }));
        } catch (e) {
            console.warn('無法保存 UX 狀態');
        }
    }
    
    // =========== 初始化 ===========
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initWelcomeMessage();
                initFeatureDiscoveryGuide();
                initLoadingOptimization();
                initAnalyticsTracking();
            });
        } else {
            initWelcomeMessage();
            initFeatureDiscoveryGuide();
            initLoadingOptimization();
            initAnalyticsTracking();
        }
    }
    
    // 啟動模組
    init();
    
    // 暴露到全局
    window.UXEnhancement = {
        getConfig: () => UX_CONFIG,
        getState: getUXState,
        setState: setUXState
    };
})();
