// 功能實驗室主控制器
const FeatureLab = {
    features: {},
    
    init() {
        this.registerAllFeatures();
        this.syncFeatureBadges();
        this.updateStats();
    },
    
    registerAllFeatures() {
        // 註冊所有功能
        this.features = {
            'ai-interview': {
                name: 'AI 面試模擬器',
                description: '模擬真實技術面試，AI扮演面試官提問，評估你的回答並給出專業反饋',
                status: 'ready',
                launch: () => this.launchAIInterview()
            },
            'voice-assistant': {
                name: '語音對話助理',
                description: '使用Web Speech API，訪客可以直接對麥克風說話，AI用語音回答',
                status: 'ready',
                launch: () => this.launchVoiceAssistant()
            },
            'gesture-control': {
                name: '手勢辨識控制',
                description: '使用TensorFlow.js偵測手勢，揮手切換頁面，比讚觸發動畫',
                status: 'ready',
                launch: () => this.launchGestureControl()
            },
            'ctf-system': {
                name: 'CTF 關卡系統',
                description: '5關遞進難度的CTF挑戰，從Base64解碼到SQL注入概念',
                status: 'ready',
                launch: () => this.launchCTF()
            },
            'digital-footprint': {
                name: '數位足跡展示',
                description: '顯示訪客的瀏覽器指紋：IP、系統、螢幕、時區等資訊',
                status: 'ready',
                launch: () => this.launchDigitalFootprint()
            },
            'rpg-card': {
                name: 'RPG 角色卡',
                description: '將技能包裝成RPG遊戲角色，有等級、屬性、技能樹',
                status: 'ready',
                launch: () => this.launchRPGCard()
            },
            'treasure-hunt': {
                name: '網站尋寶遊戲',
                description: '在網站各處藏10個隱藏物件，找到全部解鎖獎勵',
                status: 'ready',
                launch: () => this.launchTreasureHunt()
            },
            'github-3d': {
                name: 'GitHub 3D 貢獻圖',
                description: '將GitHub綠色方格升級成3D立體柱狀圖',
                status: 'ready',
                launch: () => this.launchGitHub3D()
            },
            'visitor-globe': {
                name: '全球訪客地圖',
                description: '3D地球儀顯示訪客來源，光點連線動畫',
                status: 'ready',
                launch: () => this.launchVisitorGlobe()
            },
            'webgl-shader': {
                name: 'WebGL 著色器背景',
                description: '使用GLSL Shader創造流體模擬、星系漩渦等效果',
                status: 'ready',
                launch: () => this.launchWebGLShader()
            },
            'weather-theme': {
                name: '動態天氣主題',
                description: '根據訪客所在地天氣改變網站背景效果',
                status: 'ready',
                launch: () => this.launchWeatherTheme()
            },
            'music-visualizer': {
                name: '音樂視覺化',
                description: '音樂節拍即時轉換成視覺動畫',
                status: 'ready',
                launch: () => this.launchMusicVisualizer()
            },
            'code-editor': {
                name: '程式碼編輯器',
                description: '嵌入式HTML/CSS/JS編輯器，即時預覽結果',
                status: 'ready',
                launch: () => this.launchCodeEditor()
            },
            'password-strength': {
                name: '密碼強度測試器',
                description: '即時分析密碼強度，估算破解時間',
                status: 'ready',
                launch: () => this.launchPasswordStrength()
            },
            'code-puzzle': {
                name: '程式碼解謎遊戲',
                description: '找出程式碼中的Bug才能解鎖內容',
                status: 'ready',
                launch: () => this.launchCodePuzzle()
            },
            'api-tester': {
                name: 'API 測試工具',
                description: '測試任何API端點並查看回應',
                status: 'ready',
                launch: () => this.launchAPITester()
            },
            'regex-tester': {
                name: '正則表達式測試器',
                description: '測試正則表達式並高亮匹配結果',
                status: 'ready',
                launch: () => this.launchRegexTester()
            },
            'json-formatter': {
                name: 'JSON 格式化工具',
                description: '美化和語法高亮JSON資料',
                status: 'ready',
                launch: () => this.launchJSONFormatter()
            },
            'timezone-converter': {
                name: '時區轉換工具',
                description: '轉換不同時區的時間',
                status: 'ready',
                launch: () => this.launchTimezoneConverter()
            },
            'breakout-game': {
                name: '打磚塊遊戲',
                description: '用技能名稱當磚塊的打磚塊遊戲',
                status: 'ready',
                launch: () => this.launchBreakoutGame()
            },
            'honeypot': {
                name: '蜜罐系統',
                description: '偵測並記錄可疑的訪問行為',
                status: 'ready',
                launch: () => this.launchHoneypot()
            },
            'fake-bsod': {
                name: '假藍屏彩蛋',
                description: '偽裝成系統錯誤的有趣彩蛋',
                status: 'ready',
                launch: () => this.launchFakeBSOD()
            },
            'mouse-art': {
                name: '滑鼠軌跡藝術',
                description: '記錄滑鼠移動並生成藝術圖案',
                status: 'ready',
                launch: () => this.launchMouseArt()
            },
            'xray-mode': {
                name: 'X光透視模式',
                description: '顯示網站的HTML結構和CSS盒模型',
                status: 'ready',
                launch: () => this.launchXRayMode()
            },
            'voice-synthesis': {
                name: '語音合成介紹',
                description: '用語音朗讀個人介紹',
                status: 'ready',
                launch: () => this.launchVoiceSynthesis()
            },
            'pwa-offline': {
                name: 'PWA 離線模式',
                description: '將網站安裝到桌面，支援離線訪問',
                status: 'ready',
                launch: () => this.launchPWA()
            },
            'haptic-feedback': {
                name: '震動反饋',
                description: '手機訪客的觸覺反饋',
                status: 'ready',
                launch: () => this.launchHapticFeedback()
            },
            'recommendation-wall': {
                name: '推薦信牆',
                description: '專業的推薦信展示系統',
                status: 'ready',
                launch: () => this.launchRecommendationWall()
            },
            'base64-converter': {
                name: 'Base64 編碼解碼器',
                description: '快速進行 Base64 編碼和解碼轉換',
                status: 'ready',
                launch: () => openFeaturePage('base64-converter.html')
            },
            'markdown-preview': {
                name: 'Markdown 編輯器',
                description: '即時預覽的 Markdown 編輯器',
                status: 'ready',
                launch: () => openFeaturePage('markdown-preview.html')
            },
            'color-picker': {
                name: '調色盤工具',
                description: 'HEX/RGB 顏色轉換和調色盤',
                status: 'ready',
                launch: () => openFeaturePage('color-picker.html')
            },
            'qrcode-generator': {
                name: 'QR Code 生成器',
                description: '生成任何文字或網址的 QR Code',
                status: 'ready',
                launch: () => openFeaturePage('qrcode-generator.html')
            },
            'unit-converter': {
                name: '單位轉換器',
                description: '長度、重量、溫度、資料大小轉換',
                status: 'ready',
                launch: () => openFeaturePage('unit-converter.html')
            },
            'hash-calculator': {
                name: '雜湊值計算器',
                description: '計算 MD5、SHA-1、SHA-256 雜湊值',
                status: 'ready',
                launch: () => openFeaturePage('hash-calculator.html')
            }
        };

        const plannedFeatures = {
            'ai-navigation': { name: 'AI 智能導覽', description: 'AI 根據訪客行為推薦最適合的內容路徑', status: 'ready' },
            'emotion-analysis': { name: '情緒分析儀表板', description: '分析互動訊息中的情緒趨勢並視覺化', status: 'ready' },
            'auto-summary': { name: 'AI 自動摘要', description: '將頁面內容轉換為快速摘要與重點清單', status: 'ready' },
            'face-interaction': { name: '人臉互動系統', description: '透過鏡頭偵測訪客表情並給予互動回饋', status: 'ready' },
            'code-review': { name: '程式碼智能審查', description: '自動檢查程式碼品質並提供改善建議', status: 'ready' },
            'encrypted-message': { name: '加密留言板', description: '提供端對端加密留言與安全分享機制', status: 'ready' },
            'packet-visualization': { name: '封包視覺化', description: '將請求流量與資料交換轉為互動圖表', status: 'ready' },
            'skill-battle': { name: '技能對戰模擬', description: '用互動對戰方式呈現技能樹與等級成長', status: 'ready' },
            'multiplayer-canvas': { name: '多人協作畫布', description: '多人即時繪圖與訊息同步互動', status: 'ready' },
            'time-capsule': { name: '時間膠囊', description: '記錄里程碑並在指定時間解鎖回顧內容', status: 'ready' },
            'learning-heatmap': { name: '學習熱力圖', description: '追蹤學習主題投入時間與進度熱點', status: 'ready' },
            'skill-growth': { name: '技能成長曲線', description: '以圖表呈現技能成熟度與成長速度', status: 'ready' },
            'usage-heatmap': { name: '網站使用熱力圖', description: '可視化訪客互動區域與點擊分布', status: 'ready' },
            'wakatime-dashboard': { name: 'WakaTime 儀表板', description: '整合開發時間分布與語言統計', status: 'ready' },
            'live-chat': { name: '即時聊天室', description: '訪客與管理者的即時訊息互動模組', status: 'ready' },
            'business-card': { name: '電子商務名片', description: '可互動的商品化名片與服務入口', status: 'ready' },
            'code-collab': { name: '程式碼共編', description: '線上多人共同編輯與即時預覽環境', status: 'ready' },
            'version-museum': { name: '網站版本博物館', description: '展示不同版本的演進與設計差異', status: 'ready' },
            'ar-card': { name: 'AR 名片', description: '結合擴增實境的互動式個人名片', status: 'ready' },
            'eye-tracking': { name: '眼動追蹤', description: '偵測視線焦點並優化使用者體驗', status: 'ready' },
            'quantum-art': { name: '量子亂數藝術', description: '利用亂數種子產生生成式視覺作品', status: 'ready' },
            'digital-twin': { name: '數位雙生', description: '建立個人技術能力與職涯的動態映射', status: 'ready' },
            'push-notification': { name: '推播通知', description: '訂閱站內通知並即時接收更新', status: 'ready' },
            'premium-content': { name: '付費內容解鎖', description: '分級內容權限與訂閱解鎖流程', status: 'ready' },
            'booking-system': { name: '預約系統', description: '提供會議或諮詢時段預約流程', status: 'ready' },
            'dynamic-pricing': { name: '動態定價名片', description: '依服務組合動態計算估價與方案', status: 'ready' }
        };

        Object.entries(plannedFeatures).forEach(([id, feature]) => {
            this.features[id] = {
                ...feature,
                launch: () => openFeaturePage(`${id}.html`)
            };
        });
    },

    syncFeatureBadges() {
        const items = document.querySelectorAll('.feature-item');
        items.forEach((item) => {
            const onclick = item.getAttribute('onclick') || '';
            const match = onclick.match(/openFeature\('([^']+)'\)/);
            if (!match) return;

            const featureId = match[1];
            const feature = this.features[featureId];
            if (!feature) return;

            const badge = item.querySelector('.feature-badge');
            if (!badge) return;

            badge.classList.remove('badge-ready', 'badge-beta', 'badge-coming');
            if (feature.status === 'ready') {
                badge.classList.add('badge-ready');
                badge.textContent = '已就緒';
            } else if (feature.status === 'beta') {
                badge.classList.add('badge-beta');
                badge.textContent = '測試中';
            } else {
                badge.classList.add('badge-coming');
                badge.textContent = '開發中';
            }
        });
    },
    
    updateStats() {
        const ready = Object.values(this.features).filter(f => f.status === 'ready').length;
        const beta = Object.values(this.features).filter(f => f.status === 'beta').length;
        const total = Object.keys(this.features).length;
        
        document.getElementById('ready-count').textContent = ready;
        document.getElementById('beta-count').textContent = beta;
        document.getElementById('total-count').textContent = total;
    }
};

function getFeaturesBasePath() {
    return window.location.pathname.includes('/pages/') ? '../features/' : 'features/';
}

function openFeaturePage(fileName) {
    window.open(getFeaturesBasePath() + fileName, '_blank');
}

// 開啟功能模態框
function openFeature(featureId) {
    const feature = FeatureLab.features[featureId];
    if (!feature) {
        alert('此功能正在開發中...');
        return;
    }

    const statusLabel = feature.status === 'ready' ? '✓ 已就緒' : (feature.status === 'beta' ? '⚠ 測試中' : '🚧 開發中');
    const statusColor = feature.status === 'ready' ? '#10b981' : (feature.status === 'beta' ? '#f59e0b' : '#6b7280');
    const actionLabel = feature.status === 'ready' ? '啟動功能' : '查看規劃';
    
    const modal = document.getElementById('feature-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${feature.name}</h2>
        <p style="color: #6b7280; margin: 1rem 0; line-height: 1.8;">${feature.description}</p>
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
            <strong>狀態：</strong> 
            <span style="color: ${statusColor};">
                ${statusLabel}
            </span>
        </div>
        <button class="launch-btn" onclick="FeatureLab.features['${featureId}'].launch()">
            🚀 ${actionLabel}
        </button>
    `;
    
    modal.classList.add('active');
}

// 關閉模態框
function closeModal() {
    document.getElementById('feature-modal').classList.remove('active');
}

// 點擊模態框外部關閉
document.addEventListener('click', (e) => {
    const modal = document.getElementById('feature-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// ========================================
// 功能實現
// ========================================

// AI 面試模擬器
FeatureLab.launchAIInterview = function() {
    openFeaturePage('ai-interview.html');
};

// 語音對話助理
FeatureLab.launchVoiceAssistant = function() {
    openFeaturePage('voice-assistant.html');
};

// 手勢辨識控制
FeatureLab.launchGestureControl = function() {
    openFeaturePage('gesture-control.html');
};

// CTF 關卡系統
FeatureLab.launchCTF = function() {
    openFeaturePage('ctf-challenges.html');
};

// 數位足跡展示
FeatureLab.launchDigitalFootprint = function() {
    openFeaturePage('digital-footprint.html');
};

// RPG 角色卡
FeatureLab.launchRPGCard = function() {
    openFeaturePage('rpg-card.html');
};

// 網站尋寶遊戲
FeatureLab.launchTreasureHunt = function() {
    openFeaturePage('treasure-hunt.html');
};

// GitHub 3D 貢獻圖
FeatureLab.launchGitHub3D = function() {
    openFeaturePage('contribution-3d.html');
};

// 全球訪客地圖
FeatureLab.launchVisitorGlobe = function() {
    openFeaturePage('visitor-map.html');
};


// WebGL 著色器
FeatureLab.launchWebGLShader = function() {
    openFeaturePage('shader-art.html');
};

// 動態天氣主題
FeatureLab.launchWeatherTheme = function() {
    openFeaturePage('weather-theme.html');
};

// 音樂視覺化
FeatureLab.launchMusicVisualizer = function() {
    openFeaturePage('music-visualizer.html');
};

// 程式碼編輯器
FeatureLab.launchCodeEditor = function() {
    openFeaturePage('code-editor.html');
};

// 密碼強度測試
FeatureLab.launchPasswordStrength = function() {
    openFeaturePage('password-strength.html');
};

// 程式碼解謎
FeatureLab.launchCodePuzzle = function() {
    openFeaturePage('code-puzzle.html');
};

// API 測試工具
FeatureLab.launchAPITester = function() {
    openFeaturePage('api-tester.html');
};

// 正則測試器
FeatureLab.launchRegexTester = function() {
    openFeaturePage('regex-tester.html');
};

// JSON 格式化
FeatureLab.launchJSONFormatter = function() {
    openFeaturePage('json-formatter.html');
};

// 時區轉換
FeatureLab.launchTimezoneConverter = function() {
    openFeaturePage('timezone-converter.html');
};

// 打磚塊遊戲
FeatureLab.launchBreakoutGame = function() {
    openFeaturePage('breakout-game.html');
};

// 蜜罐系統
FeatureLab.launchHoneypot = function() {
    openFeaturePage('honeypot.html');
};

// 假藍屏
FeatureLab.launchFakeBSOD = function() {
    openFeaturePage('fake-bsod.html');
};

// 滑鼠軌跡藝術
FeatureLab.launchMouseArt = function() {
    openFeaturePage('mouse-art.html');
};

// X光模式
FeatureLab.launchXRayMode = function() {
    openFeaturePage('xray-mode.html');
};

// 語音合成
FeatureLab.launchVoiceSynthesis = function() {
    openFeaturePage('voice-synthesis.html');
};

// PWA
FeatureLab.launchPWA = function() {
    openFeaturePage('pwa-info.html');
};

// 震動反饋
FeatureLab.launchHapticFeedback = function() {
    openFeaturePage('haptic-feedback.html');
};

// 推薦信牆
FeatureLab.launchRecommendationWall = function() {
    openFeaturePage('recommendation-wall.html');
};

FeatureLab.launchPlannedFeature = function(featureId) {
    openFeaturePage(`${featureId}.html`);
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    FeatureLab.init();
});
