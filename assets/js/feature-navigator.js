
/**
 * feature-navigator.js
 * 動態功能導航和搜索系統
 * 
 * 公開 API:
 *  - searchFeatures(query): 搜索功能
 *  - filterByCategory(category): 按分類篩選  
 *  - navigateTo(featureId): 導航到功能頁面
 *  - loadMoreFeatures(): 加載更多功能卡片
 *  - getRecommendations(userTags): 基於標籤的推薦
 */

// 全局功能清單
const FEATURE_MANIFEST = {
  "version": "1.0.0",
  "lastUpdated": "2026-03-31",
  "features": [
    {
      "id": "ai-interview",
      "name": "AI 面試模擬器",
      "filename": "ai-interview.html",
      "category": "工具",
      "description": "AI驅動的面試模擬練習，提供即時反饋",
      "tags": [
        "AI",
        "工具",
        "面試"
      ],
      "featured": true,
      "emoji": "🤖"
    },
    {
      "id": "ai-navigation",
      "name": "AI 智能導覽",
      "filename": "ai-navigation.html",
      "category": "導覽",
      "description": "智能功能推薦和導覽系統",
      "tags": [
        "AI",
        "導覽",
        "推薦"
      ],
      "featured": true,
      "emoji": "🧭"
    },
    {
      "id": "api-tester",
      "name": "API 測試工具",
      "filename": "api-tester.html",
      "category": "開發工具",
      "description": "完整的 REST API 測試和除錯工具",
      "tags": [
        "開發工具",
        "API",
        "測試"
      ],
      "featured": false,
      "emoji": "🔌"
    },
    {
      "id": "ar-card",
      "name": "AR 名片",
      "filename": "ar-card.html",
      "category": "創意",
      "description": "AR 擴增實境名片體驗",
      "tags": [
        "AR",
        "創意",
        "XR"
      ],
      "featured": true,
      "emoji": "🎫"
    },
    {
      "id": "auto-summary",
      "name": "自動摘要生成",
      "filename": "auto-summary.html",
      "category": "AI工具",
      "description": "基於 TensorFlow 的文字自動摘要",
      "tags": [
        "AI",
        "NLP",
        "文字"
      ],
      "featured": false,
      "emoji": "📋"
    },
    {
      "id": "base64-converter",
      "name": "Base64 轉換器",
      "filename": "base64-converter.html",
      "category": "工具",
      "description": "文字和圖片 Base64 編碼/解碼",
      "tags": [
        "編碼",
        "工具"
      ],
      "featured": false,
      "emoji": "🔐"
    },
    {
      "id": "booking-system",
      "name": "預約系統",
      "filename": "booking-system.html",
      "category": "商務",
      "description": "互動式預約和排程系統演示",
      "tags": [
        "商務",
        "日程",
        "互動"
      ],
      "featured": false,
      "emoji": "📅"
    },
    {
      "id": "breakout-game",
      "name": "打磚塊遊戲",
      "filename": "breakout-game.html",
      "category": "遊戲",
      "description": "經典打磚塊遊戲，展示 Canvas 動畫",
      "tags": [
        "遊戲",
        "Canvas",
        "娛樂"
      ],
      "featured": false,
      "emoji": "🎮"
    },
    {
      "id": "business-card",
      "name": "電子商務名片",
      "filename": "business-card.html",
      "category": "創意",
      "description": "動態互動式商務名片展示",
      "tags": [
        "創意",
        "商務",
        "卡片"
      ],
      "featured": false,
      "emoji": "🏢"
    },
    {
      "id": "code-collab",
      "name": "程式碼協作編輯器",
      "filename": "code-collab.html",
      "category": "開發工具",
      "description": "即時協作代碼編輯和執行",
      "tags": [
        "開發工具",
        "協作",
        "編輯器"
      ],
      "featured": false,
      "emoji": "👥"
    },
    {
      "id": "code-editor",
      "name": "網頁程式碼編輯器",
      "filename": "code-editor.html",
      "category": "開發工具",
      "description": "功能完整的 HTML/CSS/JS 線上編輯和預覽",
      "tags": [
        "開發工具",
        "編輯器",
        "預覽"
      ],
      "featured": true,
      "emoji": "📝"
    },
    {
      "id": "code-puzzle",
      "name": "程式碼謎題",
      "filename": "code-puzzle.html",
      "category": "學習",
      "description": "互動式程式碼學習和解謎遊戲",
      "tags": [
        "學習",
        "遊戲",
        "編程"
      ],
      "featured": false,
      "emoji": "🧩"
    },
    {
      "id": "code-review",
      "name": "程式碼智能審查",
      "filename": "code-review.html",
      "category": "開發工具",
      "description": "AI 驅動的程式碼品質分析和建議",
      "tags": [
        "AI",
        "開發工具",
        "程式碼"
      ],
      "featured": false,
      "emoji": "🔍"
    },
    {
      "id": "color-picker",
      "name": "調色盤工具",
      "filename": "color-picker.html",
      "category": "設計工具",
      "description": "高級色彩選擇器和調色盤生成器",
      "tags": [
        "設計",
        "工具",
        "顏色"
      ],
      "featured": false,
      "emoji": "🎨"
    },
    {
      "id": "contribution-3d",
      "name": "貢獻 3D 視覺化",
      "filename": "contribution-3d.html",
      "category": "數據可視化",
      "description": "GitHub 貢獻的 3D 互動視覺化",
      "tags": [
        "3D",
        "可視化",
        "GitHub"
      ],
      "featured": false,
      "emoji": "📊"
    },
    {
      "id": "ctf-challenges",
      "name": "CTF 挑戰賽",
      "filename": "ctf-challenges.html",
      "category": "安全",
      "description": "資訊安全 CTF 挑戰演練",
      "tags": [
        "安全",
        "遊戲",
        "學習"
      ],
      "featured": false,
      "emoji": "🛡️"
    },
    {
      "id": "digital-footprint",
      "name": "數位足跡分析",
      "filename": "digital-footprint.html",
      "category": "隱私",
      "description": "分析和展示個人網路足跡",
      "tags": [
        "隱私",
        "分析",
        "工具"
      ],
      "featured": false,
      "emoji": "👣"
    },
    {
      "id": "digital-twin",
      "name": "數位雙生",
      "filename": "digital-twin.html",
      "category": "IoT",
      "description": "虛擬和現實映射的互動體驗",
      "tags": [
        "IoT",
        "3D",
        "模擬"
      ],
      "featured": false,
      "emoji": "👥"
    },
    {
      "id": "dynamic-pricing",
      "name": "動態定價名片",
      "filename": "dynamic-pricing.html",
      "category": "商務",
      "description": "實時定價算法和數據展示",
      "tags": [
        "商務",
        "數據",
        "演算法"
      ],
      "featured": false,
      "emoji": "💰"
    },
    {
      "id": "emotion-analysis",
      "name": "情緒分析儀表板",
      "filename": "emotion-analysis.html",
      "category": "AI工具",
      "description": "文字情感分析和情緒檢測",
      "tags": [
        "AI",
        "NLP",
        "分析"
      ],
      "featured": false,
      "emoji": "😊"
    },
    {
      "id": "encrypted-message",
      "name": "加密訊息",
      "filename": "encrypted-message.html",
      "category": "安全",
      "description": "端對端加密訊息傳遞",
      "tags": [
        "安全",
        "加密",
        "通訊"
      ],
      "featured": false,
      "emoji": "🔒"
    },
    {
      "id": "eye-tracking",
      "name": "眼動追蹤",
      "filename": "eye-tracking.html",
      "category": "AI工具",
      "description": "基於網路攝像頭的眼動追蹤器",
      "tags": [
        "AI",
        "視覺",
        "追蹤"
      ],
      "featured": false,
      "emoji": "👁️"
    },
    {
      "id": "face-interaction",
      "name": "臉部互動",
      "filename": "face-interaction.html",
      "category": "AI工具",
      "description": "人臉識別和表情驅動的互動",
      "tags": [
        "AI",
        "視覺",
        "互動"
      ],
      "featured": false,
      "emoji": "😄"
    },
    {
      "id": "fake-bsod",
      "name": "虛假 BSOD",
      "filename": "fake-bsod.html",
      "category": "娛樂",
      "description": "好玩的 Windows 藍屏死亡模擬器",
      "tags": [
        "娛樂",
        "惡作劇"
      ],
      "featured": false,
      "emoji": "💀"
    },
    {
      "id": "gesture-control",
      "name": "手勢控制",
      "filename": "gesture-control.html",
      "category": "AI工具",
      "description": "手部動作識別和手勢控制",
      "tags": [
        "AI",
        "視覺",
        "互動"
      ],
      "featured": false,
      "emoji": "🤚"
    },
    {
      "id": "haptic-feedback",
      "name": "觸覺反饋",
      "filename": "haptic-feedback.html",
      "category": "硬體",
      "description": "展示設備振動和觸覺反饋能力",
      "tags": [
        "硬體",
        "API",
        "體驗"
      ],
      "featured": false,
      "emoji": "📳"
    },
    {
      "id": "hash-calculator",
      "name": "雜湊計算器",
      "filename": "hash-calculator.html",
      "category": "開發工具",
      "description": "支援多種演算法的檔案和文字雜湊",
      "tags": [
        "開發工具",
        "加密",
        "工具"
      ],
      "featured": false,
      "emoji": "🔢"
    },
    {
      "id": "honeypot",
      "name": "蜜罐陷阱",
      "filename": "honeypot.html",
      "category": "安全",
      "description": "機器人檢測和安全演示",
      "tags": [
        "安全",
        "防禦"
      ],
      "featured": false,
      "emoji": "🍯"
    },
    {
      "id": "innovation-suite",
      "name": "進階功能套件",
      "filename": "innovation-suite.html",
      "category": "功能",
      "description": "多項新穎創新功能集合",
      "tags": [
        "創新",
        "套件"
      ],
      "featured": true,
      "emoji": "⚡"
    },
    {
      "id": "json-formatter",
      "name": "JSON 格式化工具",
      "filename": "json-formatter.html",
      "category": "開發工具",
      "description": "JSON 驗證、格式化和視覺化",
      "tags": [
        "開發工具",
        "JSON",
        "工具"
      ],
      "featured": false,
      "emoji": "📋"
    },
    {
      "id": "learning-heatmap",
      "name": "學習熱力圖",
      "filename": "learning-heatmap.html",
      "category": "學習",
      "description": "追蹤學習進度的互動熱力圖",
      "tags": [
        "學習",
        "數據",
        "可視化"
      ],
      "featured": false,
      "emoji": "🔥"
    },
    {
      "id": "live-chat",
      "name": "即時聊天",
      "filename": "live-chat.html",
      "category": "通訊",
      "description": "實時聊天和訊息系統演示",
      "tags": [
        "通訊",
        "即時",
        "互動"
      ],
      "featured": false,
      "emoji": "💬"
    },
    {
      "id": "markdown-preview",
      "name": "Markdown 編輯器",
      "filename": "markdown-preview.html",
      "category": "開發工具",
      "description": "即時 Markdown 編輯和預覽",
      "tags": [
        "開發工具",
        "編輯器",
        "Markdown"
      ],
      "featured": false,
      "emoji": "📝"
    },
    {
      "id": "mouse-art",
      "name": "滑鼠繪畫",
      "filename": "mouse-art.html",
      "category": "創意",
      "description": "用滑鼠自由繪畫的互動畫布",
      "tags": [
        "創意",
        "Canvas",
        "藝術"
      ],
      "featured": false,
      "emoji": "🖌️"
    },
    {
      "id": "multiplayer-canvas",
      "name": "多人協作畫布",
      "filename": "multiplayer-canvas.html",
      "category": "協作",
      "description": "即時多人繪畫和協作",
      "tags": [
        "協作",
        "Canvas",
        "即時"
      ],
      "featured": false,
      "emoji": "👥"
    },
    {
      "id": "music-visualizer",
      "name": "音樂視覺化器",
      "filename": "music-visualizer.html",
      "category": "多媒體",
      "description": "基於音訊的實時視覺效果",
      "tags": [
        "多媒體",
        "音樂",
        "視覺化"
      ],
      "featured": true,
      "emoji": "🎵"
    },
    {
      "id": "packet-visualization",
      "name": "網路封包視覺化",
      "filename": "packet-visualization.html",
      "category": "網路",
      "description": "網路流量和封包分析可視化",
      "tags": [
        "網路",
        "分析",
        "可視化"
      ],
      "featured": false,
      "emoji": "📡"
    },
    {
      "id": "password-strength",
      "name": "密碼強度檢查",
      "filename": "password-strength.html",
      "category": "安全",
      "description": "實時密碼安全強度評估",
      "tags": [
        "安全",
        "工具",
        "檢查"
      ],
      "featured": false,
      "emoji": "🔐"
    },
    {
      "id": "premium-content",
      "name": "付費內容解鎖",
      "filename": "premium-content.html",
      "category": "商務",
      "description": "訂閱和付費內容管理系統演示",
      "tags": [
        "商務",
        "支付"
      ],
      "featured": false,
      "emoji": "💎"
    },
    {
      "id": "push-notification",
      "name": "推播通知",
      "filename": "push-notification.html",
      "category": "功能",
      "description": "Web Push API 推播通知演示",
      "tags": [
        "功能",
        "通知"
      ],
      "featured": false,
      "emoji": "🔔"
    },
    {
      "id": "pwa-info",
      "name": "PWA 資訊",
      "filename": "pwa-info.html",
      "category": "進階",
      "description": "PWA 功能檢測和相關資訊",
      "tags": [
        "進階",
        "PWA"
      ],
      "featured": false,
      "emoji": "📱"
    },
    {
      "id": "qrcode-generator",
      "name": "二維碼生成器",
      "filename": "qrcode-generator.html",
      "category": "工具",
      "description": "快速二維碼生成和自訂義",
      "tags": [
        "工具",
        "二維碼"
      ],
      "featured": false,
      "emoji": "📲"
    },
    {
      "id": "quantum-art",
      "name": "量子藝術",
      "filename": "quantum-art.html",
      "category": "藝術",
      "description": "量子算法驅動的生成藝術",
      "tags": [
        "藝術",
        "量子",
        "生成"
      ],
      "featured": false,
      "emoji": "🌌"
    },
    {
      "id": "recommendation-wall",
      "name": "推薦信牆",
      "filename": "recommendation-wall.html",
      "category": "社交",
      "description": "互動式推薦信和讚美牆",
      "tags": [
        "社交",
        "互動"
      ],
      "featured": false,
      "emoji": "👍"
    },
    {
      "id": "regex-tester",
      "name": "正規表達式測試器",
      "filename": "regex-tester.html",
      "category": "開發工具",
      "description": "互動式正規表達式測試和學習",
      "tags": [
        "開發工具",
        "Regex",
        "工具"
      ],
      "featured": false,
      "emoji": "🔤"
    },
    {
      "id": "rpg-card",
      "name": "RPG 角色卡",
      "filename": "rpg-card.html",
      "category": "遊戲",
      "description": "可互動的 RPG 角色卡生成器",
      "tags": [
        "遊戲",
        "RPG",
        "卡片"
      ],
      "featured": false,
      "emoji": "🎮"
    },
    {
      "id": "shader-art",
      "name": "WebGL 著色器藝術",
      "filename": "shader-art.html",
      "category": "藝術",
      "description": "實時 WebGL 著色器藝術和視覺化",
      "tags": [
        "藝術",
        "WebGL",
        "3D"
      ],
      "featured": true,
      "emoji": "✨"
    },
    {
      "id": "skill-battle",
      "name": "技能對戰模擬",
      "filename": "skill-battle.html",
      "category": "遊戲",
      "description": "技能和經驗值系統的互動遊戲",
      "tags": [
        "遊戲",
        "互動",
        "RPG"
      ],
      "featured": false,
      "emoji": "⚔️"
    },
    {
      "id": "skill-growth",
      "name": "技能成長追蹤",
      "filename": "skill-growth.html",
      "category": "學習",
      "description": "個人技能進度和成長可視化",
      "tags": [
        "學習",
        "成長",
        "追蹤"
      ],
      "featured": false,
      "emoji": "📈"
    },
    {
      "id": "time-capsule",
      "name": "時間膠囊",
      "filename": "time-capsule.html",
      "category": "創意",
      "description": "保存和回顧時刻的互動時間膠囊",
      "tags": [
        "創意",
        "時間",
        "互動"
      ],
      "featured": false,
      "emoji": "⏰"
    },
    {
      "id": "timezone-converter",
      "name": "時區轉換器",
      "filename": "timezone-converter.html",
      "category": "工具",
      "description": "全球時區轉換和會議時間查找",
      "tags": [
        "工具",
        "時間"
      ],
      "featured": false,
      "emoji": "🌍"
    },
    {
      "id": "treasure-hunt",
      "name": "寶藏獵人",
      "filename": "treasure-hunt.html",
      "category": "遊戲",
      "description": "地理位置和謎題驅動的狩獵遊戲",
      "tags": [
        "遊戲",
        "地圖",
        "互動"
      ],
      "featured": false,
      "emoji": "🗺️"
    },
    {
      "id": "unit-converter",
      "name": "單位轉換器",
      "filename": "unit-converter.html",
      "category": "工具",
      "description": "全面的單位換算工具",
      "tags": [
        "工具",
        "計算"
      ],
      "featured": false,
      "emoji": "📏"
    },
    {
      "id": "usage-heatmap",
      "name": "網站使用熱力圖",
      "filename": "usage-heatmap.html",
      "category": "分析",
      "description": "網站使用模式的熱力圖分析",
      "tags": [
        "分析",
        "可視化"
      ],
      "featured": false,
      "emoji": "🔥"
    },
    {
      "id": "version-museum",
      "name": "版本博物館",
      "filename": "version-museum.html",
      "category": "文檔",
      "description": "網站版本演進歷史展示",
      "tags": [
        "文檔",
        "歷史"
      ],
      "featured": false,
      "emoji": "🏛️"
    },
    {
      "id": "visitor-map",
      "name": "訪客地圖",
      "filename": "visitor-map.html",
      "category": "分析",
      "description": "訪客地理位置的互動地圖",
      "tags": [
        "分析",
        "地圖"
      ],
      "featured": false,
      "emoji": "🗺️"
    },
    {
      "id": "voice-assistant",
      "name": "語音助手",
      "filename": "voice-assistant.html",
      "category": "AI工具",
      "description": "語音識別和語音命令助手",
      "tags": [
        "AI",
        "語音"
      ],
      "featured": false,
      "emoji": "🎤"
    },
    {
      "id": "voice-synthesis",
      "name": "語音合成",
      "filename": "voice-synthesis.html",
      "category": "多媒體",
      "description": "文字到語音的合成和播放",
      "tags": [
        "多媒體",
        "語音"
      ],
      "featured": false,
      "emoji": "🔊"
    },
    {
      "id": "wakatime-dashboard",
      "name": "WakaTime 儀表板",
      "filename": "wakatime-dashboard.html",
      "category": "分析",
      "description": "WakaTime 編碼活動數據可視化",
      "tags": [
        "分析",
        "生產力"
      ],
      "featured": false,
      "emoji": "⏱️"
    },
    {
      "id": "weather-theme",
      "name": "天氣主題切換",
      "filename": "weather-theme.html",
      "category": "功能",
      "description": "基於天氣的動態主題切換",
      "tags": [
        "功能",
        "主題"
      ],
      "featured": false,
      "emoji": "🌤️"
    },
    {
      "id": "xray-mode",
      "name": "X 光透視模式",
      "filename": "xray-mode.html",
      "category": "創意",
      "description": "網頁元素的 X 光透視視圖",
      "tags": [
        "創意",
        "視覺化"
      ],
      "featured": false,
      "emoji": "🦴"
    },
    {
      "id": "feature-analytics",
      "name": "功能分析儀表板",
      "filename": "feature-analytics.html",
      "category": "分析",
      "description": "實時追蹤功能使用統計和熱門排行",
      "tags": [
        "分析",
        "統計",
        "儀表板"
      ],
      "featured": true,
      "emoji": "📊"
    },
    {
      "id": "ai-recommendation-engine",
      "name": "AI 智能推薦引擎",
      "filename": "ai-recommendation-engine.html",
      "category": "AI工具",
      "description": "根據技能和興趣提供個性化功能推薦",
      "tags": [
        "AI",
        "推薦",
        "個性化"
      ],
      "featured": true,
      "emoji": "🤖"
    },
    {
      "id": "interactive-tutorials",
      "name": "互動教程中心",
      "filename": "interactive-tutorials.html",
      "category": "學習",
      "description": "分步驟學習如何使用高級功能",
      "tags": [
        "學習",
        "教程",
        "指引"
      ],
      "featured": true,
      "emoji": "📚"
    }
  ],
  "categories": {
    "工具": {
      "count": 5,
      "emoji": "🛠️"
    },
    "AI工具": {
      "count": 7,
      "emoji": "🤖"
    },
    "開發工具": {
      "count": 8,
      "emoji": "⚙️"
    },
    "設計工具": {
      "count": 1,
      "emoji": "🎨"
    },
    "創意": {
      "count": 5,
      "emoji": "✨"
    },
    "遊戲": {
      "count": 4,
      "emoji": "🎮"
    },
    "學習": {
      "count": 4,
      "emoji": "📚"
    },
    "商務": {
      "count": 3,
      "emoji": "💼"
    },
    "安全": {
      "count": 4,
      "emoji": "🔒"
    },
    "隱私": {
      "count": 1,
      "emoji": "👁️"
    },
    "分析": {
      "count": 4,
      "emoji": "📊"
    },
    "數據可視化": {
      "count": 1,
      "emoji": "📈"
    },
    "多媒體": {
      "count": 2,
      "emoji": "🎬"
    },
    "通訊": {
      "count": 1,
      "emoji": "💬"
    },
    "協作": {
      "count": 1,
      "emoji": "👥"
    },
    "網路": {
      "count": 1,
      "emoji": "📡"
    },
    "IoT": {
      "count": 1,
      "emoji": "🌐"
    },
    "進階": {
      "count": 1,
      "emoji": "🚀"
    },
    "娛樂": {
      "count": 1,
      "emoji": "🎉"
    },
    "功能": {
      "count": 3,
      "emoji": "⚡"
    },
    "導覽": {
      "count": 1,
      "emoji": "🧭"
    },
    "硬體": {
      "count": 1,
      "emoji": "⚙️"
    },
    "社交": {
      "count": 1,
      "emoji": "👍"
    },
    "藝術": {
      "count": 2,
      "emoji": "🎭"
    },
    "文檔": {
      "count": 1,
      "emoji": "📖"
    }
  }
};

// 狀態管理
let navState = {
  currentCategory: 'all',
  searchQuery: '',
  displayedCount: 12,
  maxInitialDisplay: 12
};

/**
 * 搜索功能 - 支援名稱、描述、標籤匹配
 */
function searchFeatures(query) {
  const searchInput = document.getElementById('feature-search');
  const clearBtn = document.getElementById('clear-search-btn');
  const grid = document.getElementById('features-grid');
  
  if (!grid) return; // Lab 頁面才有網格
  
  navState.searchQuery = query.toLowerCase();
  clearBtn.style.display = query ? 'inline-block' : 'none';
  
  const filtered = FEATURE_MANIFEST.features.filter(f => {
    const matchName = f.name.toLowerCase().includes(navState.searchQuery);
    const matchDesc = f.description.toLowerCase().includes(navState.searchQuery);
    const matchTags = f.tags.some(t => t.toLowerCase().includes(navState.searchQuery));
    const matchCategory = f.category.toLowerCase().includes(navState.searchQuery);
    
    return (matchName || matchDesc || matchTags || matchCategory) &&
           (navState.currentCategory === 'all' || f.category === navState.currentCategory);
  });
  
  renderFeatureCards(filtered, grid);
  
  // 記錄搜索分析
  if (query) {
    logSearchAnalytics(query, filtered.length);
  }
}

/**
 * 按分類篩選
 */
function filterByCategory(categoryName) {
  navState.currentCategory = categoryName;
  navState.searchQuery = ''; // 重置搜索
  
  const searchInput = document.getElementById('feature-search');
  if (searchInput) {
    searchInput.value = '';
    document.getElementById('clear-search-btn').style.display = 'none';
  }
  
  // 更新按鈕狀態
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', 
      btn.dataset.category === (categoryName === 'all' ? 'all' : categoryName) ||
      (btn.textContent.includes('全部') && categoryName === 'all')
    );
  });
  
  const filtered = categoryName === 'all' 
    ? FEATURE_MANIFEST.features
    : FEATURE_MANIFEST.features.filter(f => f.category === categoryName);
  
  const grid = document.getElementById('features-grid');
  if (grid) {
    renderFeatureCards(filtered, grid);
  }
}

/**
 * 渲染功能卡片到 DOM
 */
function renderFeatureCards(features, containerElement) {
  const displayed = features.slice(0, navState.displayedCount);
  
  containerElement.innerHTML = displayed.map(f =>
    `<div class="feature-card" data-id="${f.id}" data-category="${f.category}" 
          onclick="navigateTo('${f.id}')" role="button" tabindex="0">
      <div class="feature-icon">${f.emoji}</div>
      <h4>${f.name}</h4>
      <p class="description">${f.description}</p>
      <div class="feature-meta">
        <span class="category">${f.category}</span>
        ${f.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>`
  ).join('');
  
  // 顯示/隱藏「加載更多」按鈕
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = features.length > navState.displayedCount ? 'block' : 'none';
  }
}

/**
 * 加載更多功能卡片
 */
function loadMoreFeatures() {
  navState.displayedCount += 12;
  
  const filtered = navState.currentCategory === 'all'
    ? FEATURE_MANIFEST.features
    : FEATURE_MANIFEST.features.filter(f => f.category === navState.currentCategory);
  
  const grid = document.getElementById('features-grid');
  if (grid) {
    renderFeatureCards(filtered, grid);
  }
}

/**
 * 導航到功能頁面 - 替換 inline onclick handlers
 */
function navigateTo(featureId) {
  const feature = FEATURE_MANIFEST.features.find(f => f.id === featureId);
  if (!feature) {
    console.warn('❌ 找不到功能:', featureId);
    return;
  }
  
  // 記錄導航分析
  logNavigationAnalytics(featureId, feature.name);
  
  // 導航到功能頁面
  const featurePath = `features/${feature.filename}`;
  window.location.href = featurePath;
}

/**
 * 清空搜索框
 */
function clearSearch() {
  const searchInput = document.getElementById('feature-search');
  if (searchInput) {
    searchInput.value = '';
    searchFeatures('');
  }
}

/**
 * 智能推薦 - 基於使用者互動標籤
 */
function getRecommendations(userSelectedTags = []) {
  if (userSelectedTags.length === 0) {
    // 預設推薦：特色功能
    return FEATURE_MANIFEST.features.filter(f => f.featured);
  }
  
  return FEATURE_MANIFEST.features
    .map(f => ({
      feature: f,
      score: f.tags.filter(t => userSelectedTags.includes(t)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.feature);
}

/**
 * 分析：記錄搜索事件
 */
function logSearchAnalytics(query, resultCount) {
  if (typeof gtag === 'undefined') return;
  
  gtag('event', 'feature_search', {
    'search_term': query,
    'result_count': resultCount
  });
}

/**
 * 分析：記錄導航事件
 */
function logNavigationAnalytics(featureId, featureName) {
  if (typeof gtag === 'undefined') return;
  
  gtag('event', 'feature_visit', {
    'feature_id': featureId,
    'feature_name': featureName
  });
}

/**
 * 初始化導航系統
 * 附加事件監聽器、綁定篩選按鈕
 */
function initNavigator() {
  // 綁定分類篩選按鈕
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category === 'all' ? 'all' : this.dataset.category;
      // 重新對應回原始分類名稱
      const categoryMap = {};
      FEATURE_MANIFEST.features.forEach(f => {
        categoryMap[f.category.toLowerCase().replace(/\s+/g, '-')] = f.category;
      });
      const actualCategory = this.textContent.includes('全部') 
        ? 'all' 
        : Array.from(this.parentElement.children)
            .find(btn => btn.classList.contains('active'))?.textContent || 'all';
      
      if (this.textContent.includes('全部')) {
        filterByCategory('all');
      } else {
        // 提取分類名稱
        const catName = this.textContent.replace(/\s*\d+\s*/, '').trim();
        filterByCategory(catName);
      }
    });
  });
  
  // 綁定搜索框回車鍵
  const searchInput = document.getElementById('feature-search');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }
  
  console.log('✅ 功能導航系統已初始化');
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', initNavigator);

// 暴露到全局作用域
window.FeatureNavigator = {
  searchFeatures,
  filterByCategory,
  navigateTo,
  loadMoreFeatures,
  getRecommendations,
  logSearchAnalytics,
  logNavigationAnalytics,
  initNavigator,
  getManifest: () => FEATURE_MANIFEST,
  getState: () => navState
};
    