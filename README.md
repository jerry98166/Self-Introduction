# 🚀 個人作品集網站 | Personal Portfolio Website

一個功能豐富、視覺驚豔的個人作品集網站，展示 **14+ 個進階功能**，包含 AI、3D、WebGL、音訊處理等前沿技術。

## 📋 專案簡介

這是一個現代化的個人作品集網站，不僅展示個人資訊、技能和專案經驗，還整合了多個令人印象深刻的技術功能，適合用於：
- 💼 求職作品集展示
- 🎓 技術能力證明
- 🚀 專案經驗累積
- 📚 學習成果展現

## ✨ 核心功能

### 🏠 主網站功能
- ✅ 響應式設計（支援桌面/平板/手機）
- ✅ 深色/淺色主題切換
- ✅ 中英文雙語切換
- ✅ 3D 背景動畫（Three.js）
- ✅ 打字遊戲
- ✅ 留言板系統
- ✅ 在線狀態顯示
- ✅ 音樂播放器

### 🧪 功能實驗室（14個進階功能）

#### AI & 機器學習
1. 🤖 **AI 面試模擬器** - 智慧面試問答系統
2. 🗣️ **語音對話助理** - Web Speech API 語音互動
3. 🤚 **手勢識別控制** - TensorFlow.js 手勢偵測

#### 資料視覺化
4. 📊 **3D 貢獻圖** - Three.js 3D 資料視覺化
5. 🌍 **全球訪客地圖** - Leaflet.js 地理資料展示

#### 視覺藝術
6. 🎨 **WebGL 著色器藝術** - 8種炫酷著色器效果
7. 🎵 **音樂視覺化** - 6種音訊視覺化模式

#### 安全 & 工具
8. 🔐 **CTF 安全挑戰** - 5關遞進式安全謎題
9. 🔍 **數位足跡追蹤** - 瀏覽器指紋偵測
10. 🧪 **正則測試器** - 即時正則表達式測試
11. 📝 **JSON 格式化工具** - JSON 美化/壓縮
12. 💻 **程式碼編輯器** - 線上 HTML/CSS/JS 編輯器

#### 遊戲化
13. 🎮 **RPG 角色卡** - 技能遊戲化展示
14. 🏴‍☠️ **網站尋寶遊戲** - 互動尋寶挑戰

### ⚙️ 管理後台
- 📊 即時資料統計
- 👥 訪客管理
- 💬 留言審核
- 📈 資料分析

## 📂 專案結構

```
Self-Introduction/
├── index.html              # 主頁面
├── lab.html               # 功能實驗室
├── admin.html             # 管理後台
├── styles.css             # 主樣式表
├── script.js              # 主 JavaScript
├── lab.js                 # 功能實驗室控制器
│
├── features/              # 功能頁面目錄
│   ├── ai-interview.html         # AI 面試模擬器
│   ├── voice-assistant.html      # 語音助理
│   ├── gesture-control.html      # 手勢識別
│   ├── contribution-3d.html      # 3D 貢獻圖
│   ├── visitor-map.html          # 訪客地圖
│   ├── shader-art.html           # 著色器藝術
│   ├── music-visualizer.html     # 音樂視覺化
│   ├── ctf-challenges.html       # CTF 挑戰
│   ├── digital-footprint.html    # 數位足跡
│   ├── regex-tester.html         # 正則測試器
│   ├── json-formatter.html       # JSON 工具
│   ├── code-editor.html          # 程式碼編輯器
│   ├── rpg-card.html            # RPG 角色卡
│   └── treasure-hunt.html        # 尋寶遊戲
│
├── images/                # 圖片資源
│   └── README.md
│
├── docs/                  # 專案文件
│   ├── README.md                 # 專案說明（舊版）
│   ├── 開始使用.md               # 快速上手指南
│   ├── 快速開始指南.md           # 詳細使用教學
│   ├── 功能實驗室文檔.md         # 功能列表說明
│   ├── 功能完成總結報告.md       # 完整技術報告
│   ├── 新增功能報告.md           # 新功能說明
│   └── ...
│
├── css/                   # CSS 檔案（預留）
├── js/                    # JS 檔案（預留）
└── README.md              # 本檔案

```

## 🚀 快速開始

### 1. 下載專案
```bash
git clone <repository-url>
cd Self-Introduction
```

### 2. 啟動網站
有多種方式啟動：

#### 方式 A：直接開啟（推薦）
```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

#### 方式 B：使用 VS Code Live Server
1. 安裝 VS Code 的 Live Server 擴充套件
2. 右鍵 `index.html` → "Open with Live Server"

#### 方式 C：使用 Python 簡易伺服器
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# 然後造訪 http://localhost:8000
```

### 3. 瀏覽功能
1. 主頁：`index.html`
2. 功能實驗室：點擊導覽列的 "🧪 功能實驗室" 或直接造訪 `lab.html`
3. 管理後台：點擊導覽列的 "⚙️ 管理後台" 或直接造訪 `admin.html`

<<<<<<< HEAD
### 4. 功能健康检查（推荐）
每次修改后，建议运行一次健康检查脚本，自动验证：
- HTML 本地链接/资源是否存在
- 功能实验室条目是否与功能注册表一致

```bash
node tools/health-check.js
```

或使用 npm script：

```bash
npm run health-check
```

输出 `Result: PASSED` 代表目前核心链接与功能映射正常。

## 🛠️ 技术栈
=======
## 🛠️ 技術棧
>>>>>>> d60f12a13065b187ab168a3d9d65ae039f4176f6

### 前端框架
- **HTML5** - 語義化標記
- **CSS3** - 現代樣式（Grid, Flexbox, Animations）
- **JavaScript (ES6+)** - 原生 JavaScript，無框架依賴

### 核心函式庫
- **Three.js** r128 - 3D 圖形渲染
- **TensorFlow.js** - 機器學習（手勢識別）
- **Leaflet.js** - 地圖視覺化
- **Chart.js** - 資料圖表

### Web API
- **Web Speech API** - 語音識別與合成
- **Web Audio API** - 音訊處理與分析
- **MediaDevices API** - 攝影機存取
- **WebGL 2.0** - 高效能圖形渲染
- **Canvas API** - 2D 繪圖
- **LocalStorage API** - 用戶端儲存

### 開發工具
- **Font Awesome 6.4.0** - 圖示庫
- **Google Fonts** - 網頁字型

## 🌐 瀏覽器相容性

| 瀏覽器 | 最低版本 | 推薦版本 | 功能支援 |
|--------|---------|---------|---------|
| Chrome | 90+ | 最新版 | ✅ 完整支援 |
| Firefox | 88+ | 最新版 | ✅ 完整支援 |
| Edge | 90+ | 最新版 | ✅ 完整支援 |
| Safari | 14+ | 最新版 | ⚠️ 部分功能受限* |

*Safari 對某些 Web API（如 Web Speech API）的支援有限。

### 必需功能
- ✅ WebGL 2.0 支援
- ✅ ES6+ JavaScript
- ✅ CSS Grid & Flexbox
- ✅ Canvas API

## 📖 詳細文件

專案文件位於 `docs/` 目錄：

- **[開始使用.md](docs/開始使用.md)** - 30秒快速上手
- **[快速開始指南.md](docs/快速開始指南.md)** - 詳細使用教學
- **[功能實驗室文檔.md](docs/功能實驗室文檔.md)** - 所有功能列表
- **[功能完成總結報告.md](docs/功能完成總結報告.md)** - 完整技術報告
- **[新增功能報告.md](docs/新增功能報告.md)** - 最新功能說明

## 🎯 效能指標

- **載入速度**: < 2 秒
- **渲染 FPS**: 55-60 FPS (Chrome)
- **記憶體使用**: ~80-120 MB
- **PageSpeed Score**: 85+ (行動端), 95+ (桌面)

## 🔧 自訂配置

### 修改個人資訊
編輯 `index.html`，搜尋以下關鍵字並替換：
- 姓名：搜尋 "高孟麟"
- 職位：搜尋 "全端工程師"
- 聯絡方式：在 `#contact` 區塊修改

### 修改配色方案
編輯 `styles.css`，修改 CSS 變數：
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... 更多變數 */
}
```

### 新增功能
1. 在 `features/` 目錄建立新的 HTML 檔案
2. 在 `lab.js` 的 `registerAllFeatures()` 中註冊功能
3. 在 `lab.html` 中新增功能卡片

## 🐛 問題排查

### 問題 1: 功能實驗室/管理後台按鈕無法點擊
**解決**: ✅ 已修復！更新 `script.js` 中的導覽函式，允許外部連結跳轉。

### 問題 2: 某些功能在 Safari 無法使用
**原因**: Safari 對某些 Web API 支援有限  
**解決**: 使用 Chrome/Firefox 以獲得最佳體驗

### 問題 3: 3D 效果卡頓
**原因**: 硬體加速未啟用或裝置效能較低  
**解決**: 啟用瀏覽器硬體加速，或降低效果品質

## 📝 更新日誌

### v2.0 (2026-03-10)
- ✅ 新增 6 個進階功能（手勢識別、3D貢獻圖等）
- ✅ 修復導覽按鈕跳轉問題
- ✅ 重新整理專案檔案結構
- ✅ 完善專案文件

### v1.0 (2026-03-09)
- ✅ 完成基礎網站功能
- ✅ 實作 8 個核心進階功能
- ✅ 建立功能實驗室和管理後台

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！

## 📄 授權

MIT License - 自由使用和修改

## 👨‍💻 作者

**高孟麟**
<<<<<<< HEAD
- 网站: [Portfolio](https://your-website.com)
- Email: 11028201@cycu.org.tw
=======
- 網站: [Portfolio](https://your-website.com)
- Email: your-email@example.com
>>>>>>> d60f12a13065b187ab168a3d9d65ae039f4176f6
- GitHub: [@yourusername](https://github.com/yourusername)

---

**⭐ 如果這個專案對你有幫助，請給一個 Star！**

Made with ❤️ and ☕ | 2026
