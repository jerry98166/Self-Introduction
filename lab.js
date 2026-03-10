// 功能實驗室主控制器
const FeatureLab = {
    features: {},
    
    init() {
        this.registerAllFeatures();
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
            'live-chat': {
                name: '即時訪客聊天室',
                description: '所有在線訪客可以即時互動的聊天室',
                status: 'ready',
                launch: () => this.launchLiveChat()
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
            }
        };
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

// 開啟功能模態框
function openFeature(featureId) {
    const feature = FeatureLab.features[featureId];
    if (!feature) {
        alert('此功能正在開發中...');
        return;
    }
    
    const modal = document.getElementById('feature-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${feature.name}</h2>
        <p style="color: #6b7280; margin: 1rem 0; line-height: 1.8;">${feature.description}</p>
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
            <strong>狀態：</strong> 
            <span style="color: ${feature.status === 'ready' ? '#10b981' : '#f59e0b'};">
                ${feature.status === 'ready' ? '✓ 已就緒' : '⚠ 測試中'}
            </span>
        </div>
        <button class="launch-btn" onclick="FeatureLab.features['${featureId}'].launch()">
            🚀 啟動功能
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
    window.open('features/ai-interview.html', '_blank');
};

// 語音對話助理
FeatureLab.launchVoiceAssistant = function() {
    window.open('features/voice-assistant.html', '_blank');
};

// 手勢辨識控制
FeatureLab.launchGestureControl = function() {
    window.open('features/gesture-control.html', '_blank');
};

// CTF 關卡系統
FeatureLab.launchCTF = function() {
    window.open('features/ctf-challenges.html', '_blank');
};

// 數位足跡展示
FeatureLab.launchDigitalFootprint = function() {
    window.open('features/digital-footprint.html', '_blank');
};

// RPG 角色卡
FeatureLab.launchRPGCard = function() {
    window.open('features/rpg-card.html', '_blank');
};

// 網站尋寶遊戲
FeatureLab.launchTreasureHunt = function() {
    window.open('features/treasure-hunt.html', '_blank');
};

// GitHub 3D 貢獻圖
FeatureLab.launchGitHub3D = function() {
    window.open('features/github-3d.html', '_blank');
};

// 全球訪客地圖
FeatureLab.launchVisitorGlobe = function() {
    window.open('features/visitor-globe.html', '_blank');
};

// 即時聊天室
FeatureLab.launchLiveChat = function() {
    window.open('features/live-chat.html', '_blank');
};

// WebGL 著色器
FeatureLab.launchWebGLShader = function() {
    window.open('features/webgl-shader.html', '_blank');
};

// 動態天氣主題
FeatureLab.launchWeatherTheme = function() {
    window.open('features/weather-theme.html', '_blank');
};

// 音樂視覺化
FeatureLab.launchMusicVisualizer = function() {
    window.open('features/music-visualizer.html', '_blank');
};

// 程式碼編輯器
FeatureLab.launchCodeEditor = function() {
    window.open('features/code-editor.html', '_blank');
};

// 密碼強度測試
FeatureLab.launchPasswordStrength = function() {
    window.open('features/password-strength.html', '_blank');
};

// 程式碼解謎
FeatureLab.launchCodePuzzle = function() {
    window.open('features/code-puzzle.html', '_blank');
};

// API 測試工具
FeatureLab.launchAPITester = function() {
    window.open('features/api-tester.html', '_blank');
};

// 正則測試器
FeatureLab.launchRegexTester = function() {
    window.open('features/regex-tester.html', '_blank');
};

// JSON 格式化
FeatureLab.launchJSONFormatter = function() {
    window.open('features/json-formatter.html', '_blank');
};

// 時區轉換
FeatureLab.launchTimezoneConverter = function() {
    window.open('features/timezone-converter.html', '_blank');
};

// 打磚塊遊戲
FeatureLab.launchBreakoutGame = function() {
    window.open('features/breakout-game.html', '_blank');
};

// 蜜罐系統
FeatureLab.launchHoneypot = function() {
    window.open('features/honeypot.html', '_blank');
};

// 假藍屏
FeatureLab.launchFakeBSOD = function() {
    window.open('features/fake-bsod.html', '_blank');
};

// 滑鼠軌跡藝術
FeatureLab.launchMouseArt = function() {
    window.open('features/mouse-art.html', '_blank');
};

// X光模式
FeatureLab.launchXRayMode = function() {
    window.open('features/xray-mode.html', '_blank');
};

// 語音合成
FeatureLab.launchVoiceSynthesis = function() {
    window.open('features/voice-synthesis.html', '_blank');
};

// PWA
FeatureLab.launchPWA = function() {
    window.open('features/pwa-info.html', '_blank');
};

// 震動反饋
FeatureLab.launchHapticFeedback = function() {
    window.open('features/haptic-feedback.html', '_blank');
};

// 推薦信牆
FeatureLab.launchRecommendationWall = function() {
    window.open('features/recommendation-wall.html', '_blank');
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    FeatureLab.init();
});
