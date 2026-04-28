# 專案結構索引

## 📋 項目概覽

**自我介紹 & 功能實驗室** - 一個功能豐富的個人作品集網站，包含 64+ 個交互式功能。

- **更新日期**: 2026-03-31
- **版本**: 1.0.0  
- **功能數量**: 64+
- **優化評分**: 92/100

---

## 📁 目錄結構

### 根目錄文件
```
├── index.html              - 主頁面
├── 404.html                - 404 錯誤頁面
├── robots.txt              - SEO 爬蟲配置
├── sitemap.xml             - 網站地圖
├── site.webmanifest        - PWA 清單
├── package.json            - 項目依賴
├── feature-manifest.json   - 功能清單 (64 個功能)
└── PROJECT-INDEX.md        - 本文件
```

### 🎨 資產目錄 (`assets/`)
```
assets/
├── css/
│   ├── styles.css                  - 全局樣式 (5K+ 行)
│   └── feature-navigator.css       - 導航器樣式
├── js/
│   ├── script.js                   - 主程序 (80K)
│   ├── feature-navigator.js        - 功能導航系統 (29K)
│   ├── lab.js                      - 實驗室頁面 (19K)
│   ├── subpage-ux.js               - 子頁面 UX (15K)
│   ├── ux-enhancement.js           - UX 增強 (15K)
│   ├── performance-optimization.js - 性能優化 (9.5K)
│   ├── security-hardening.js       - 安全加固 (5.6K)
│   ├── vue-app.js                  - Vue 應用 (2.3K)
│   └── vue-subpages.js             - Vue 子頁面 (1.8K)
└── images/
    ├── og-image.jpg                - OG 圖像 (104K)
    ├── twitter-card.jpg            - Twitter 卡片 (104K)
    ├── profile.jpg                 - 個人資料圖片 (104K)
    ├── README.md                   - 圖像說明
    └── originals/                  - 原始資源目錄
```

### 📄 頁面目錄 (`pages/`)
```
pages/
├── index.html              - 主頁面（重定向到根）
├── lab.html                - 功能實驗室主頁
├── admin.html              - 管理後台
│   ├── 導出數據             - JSON 導出
│   ├── 統計分析             - 數據分析面板
│   ├── 全局搜尋             - 跨面板搜尋
│   ├── 信息面板             - 留言面板
│   ├── 聊天記錄             - 聊天日誌
│   └── 終端記錄             - 終端輸出
├── experience.html         - 工作經驗
├── education.html          - 教育背景
├── skills.html             - 技能清單
├── projects.html           - 項目列表
├── achievements.html       - 成就頁面
├── privacy.html            - 隱私政策
├── typing-game.html        - 小遊戲
└── about.html              - 關於頁面
```

### ⚡ 功能目錄 (`features/`)
64+ 個交互式功能，包括：

**AI & 智能**
- AI 面試模擬器 (ai-interview.html)
- AI 智能導覽 (ai-navigation.html)
- AI 推薦引擎 (ai-recommendation-engine.html)
- 情感分析 (emotion-analysis.html)
- 自動摘要生成 (auto-summary.html)

**開發工具**
- API 測試工具 (api-tester.html)
- 代碼編輯器 (code-editor.html)
- 代碼審查 (code-review.html)
- 正則表達式測試 (regex-tester.html)
- JSON 格式化 (json-formatter.html)

**遊戲 & 娛樂**
- 打破遊戲 (breakout-game.html)
- RPG 卡牌 (rpg-card.html)
- CTF 挑戰 (ctf-challenges.html)
- 寶藏獵人 (treasure-hunt.html)
- 技能戰鬥 (skill-battle.html)

**藝術 & 視覺化**
- 著色器藝術 (shader-art.html)
- 量子藝術 (quantum-art.html)
- 鼠標藝術 (mouse-art.html)
- 音樂視覺化 (music-visualizer.html)
- 實時畫布 (multiplayer-canvas.html)

**實用工具**
- 單位轉換器 (unit-converter.html)
- 時區轉換器 (timezone-converter.html)
- 顏色選擇器 (color-picker.html)
- QR 代碼生成 (qrcode-generator.html)
- Hash 計算器 (hash-calculator.html)

**其他功能**
- 密碼強度檢查器 (password-strength.html)
- Base64 轉換器 (base64-converter.html)
- 訪客地圖 (visitor-map.html)
- 天氣主題 (weather-theme.html)
- 聲音合成 (voice-synthesis.html)
- 實時聊天 (live-chat.html)

[完整的 64+ 功能列表見 feature-manifest.json]

### 📚 文檔目錄 (`docs/`)
```
docs/
├── README.md                       - 文檔主頁
├── OPTIMIZATION-REPORT.md          - 優化報告
├── guides/
│   ├── DEPLOYMENT-GUIDE.md         - 部署指南
│   ├── SECURITY-HARDENING.md       - 安全加固指南
│   ├── IMAGE-OPTIMIZATION.md       - 圖像優化指南
│   └── SCALE-UPGRADE-ROADMAP.md    - 規模升級路線圖
└── reports/
    ├── FUNCTION-UPGRADE-REPORT.md  - 功能升級報告
    └── SCALE-READINESS-REPORT.md   - 規模準備報告
```

### 🔧 工具目錄 (`tools/`)
```
tools/
├── nav-generator.js                - 導航生成器
├── health-check.js                 - 健康檢查工具
├── security-smoke-test.js          - 安全檢查工具
├── scale-readiness-check.js        - 規模評估工具
├── fix-features.js                 - 功能修復工具
└── setup-hooks.js                  - Git 鉤子設置
```

### 📦 其他目錄
```
projects/
├── cycu-guide.html                 - CYCU 指南頁面
└── (其他項目文件)

images/originals/
└── (原始圖像資源)
```

---

## 🔍 功能清單數據

所有功能都定義在 `feature-manifest.json` 中：

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-03-31",
  "features": [
    {
      "id": "feature-id",
      "name": "功能名稱",
      "filename": "feature-file.html",
      "category": "分類",
      "description": "功能描述",
      "tags": ["標籤1", "標籤2"],
      "featured": true,
      "emoji": "🎯"
    },
    ...
  ]
}
```

---

## ✅ 驗證狀態

### 最新驗證結果 (2026-03-31)

| 檢查項目 | 狀態 | 詳情 |
|---------|------|------|
| 導航生成 | ✅ PASSED | 64 個功能生成成功 |
| 健康檢查 | ✅ PASSED | 0 個缺失參考、動態導航啟用 |
| 安全檢查 | ✅ PASSED | 0 個安全問題 |
| 規模評估 | ✅ PASSED | 92/100 分 |

### 優化建議
- 257 個 inline onclick 處理器可轉換為事件委託 (+3 分)
- 所有其他指標都達到最佳狀態

---

## 🚀 部署和開發

### 快速開始
```bash
# 安裝依賴
npm install

# 運行性能檢查
npm run verify-all

# 運行特定檢查
npm run health-check
npm run security-check
npm run scale-check
```

### 文件清理日誌 (2026-03-31)
- ✓ 刪除 11 個舊報告檔案
- ✓ 刪除 5 個舊指南檔案    
- ✓ 刪除 temp/ 臨時目錄
- ✓ 刪除 docs/archive/ 存檔目錄
- ✓ 刪除 profile-backup.jpg (2.6MB 備份)

### 當前項目大小
- HTML 文件: 78 個
- 功能頁面: 64 個
- CSS 文件: 2 個 (5K+ 行)
- JavaScript 文件: 9 個 (87K+ 代碼)
- 總檔案數: ~130 個

---

## 📧 Git 信息

**儲存庫**: https://github.com/jerry98166/Self-Introduction  
**分支**: main  
**最後提交**: 準備上傳  

---

## 📝 維護信息

此索引文檔用於快速導航和了解項目結構。  
如有新增功能或修改，請：
1. 更新 `feature-manifest.json`
2. 運行 `npm run verify-all` 驗證
3. 更新本索引文檔
4. 提交更改到 Git

---

**最後更新**: 2026-03-31  
**維護者**: Self-Introduction Team
