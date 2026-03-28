# 📝 個人自我介紹網站

一個功能豐富、現代化的個人自我介紹網站，展示您的技能、經驗和作品集。

## 🎉 最新更新 - 進階功能

### 🚀 新增 6 大進階功能

1. **🤖 AI 聊天機器人** - 訪客可以問你問題，由 AI 代替你回答
2. **💻 互動式終端機** - 訪客輸入指令探索你的網站（駭客風格）
3. **🎨 3D 動畫效果** - 使用 Three.js 創造視覺效果
4. **📝 訪客留言板** - 讓訪客留下印象和想法
5. **🟢 即時在線狀態** - 顯示你現在是否在線
6. **📊 後台管理系統** - 完整的後台可以查看所有數據

## ✨ 主要功能

### 🎨 視覺特效
- **3D 背景動畫** - Three.js 渲染的旋轉幾何體 ⭐ 新功能
- **粒子背景動畫** - 動態的粒子系統創造科技感
- **深色/淺色模式** - 可切換的主題，保護眼睛
- **平滑滾動** - 流暢的頁面滾動體驗
- **懸停動畫** - 豐富的互動效果
- **響應式設計** - 完美適配所有裝置

### 🤖 互動功能 ⭐ 新增

#### AI 聊天機器人
- 智能問答系統
- 快速問題按鈕
- 對話記錄保存
- 紫色漸層設計

#### 互動終端機
- 駭客風格介面
- 10+ 可用指令
- 即時指令執行
- 指令記錄追蹤

#### 訪客留言板
- 訪客可留言互動
- 即時顯示留言
- LocalStorage 保存
- 後台可管理

#### 在線狀態顯示
- 即時狀態更新
- 呼吸動畫效果
- 自動狀態切換
- 中英文支援

#### 後台管理系統
- 統計儀表板
- 留言管理
- AI 對話記錄
- 終端機記錄
- 安全登入系統

### 📱 功能區域

1. **Hero 區域**
   - 打字動畫效果
   - 個人介紹
   - 社群媒體連結
   - 快速聯絡按鈕
   - 訪客計數器
   - 實時時鐘

2. **關於我**
   - 個人簡介
   - 統計數字動畫
   - 核心能力展示

3. **技能專長**
   - 分類技能展示（前端、後端、工具）
   - 動畫進度條
   - 技術圖標牆
   - 技能雷達圖

4. **工作經歷**
   - 時間軸視覺化
   - 詳細的工作描述
   - 技術標籤

5. **作品集**
   - 專案展示
   - 分類過濾功能
   - 懸停預覽效果
   - 3D 卡片效果

6. **學歷背景**
   - 教育經歷
   - 專業證照
   - 成就展示

7. **打字遊戲** ⭐
   - 互動式打字練習
   - WPM 統計
   - 遊戲記錄

8. **訪客留言板** ⭐ 新功能
   - 訪客留言功能
   - 即時顯示
   - 後台管理

9. **聯絡表單**
   - 表單驗證
   - 送出動畫
   - 聯絡資訊
   - 社交分享按鈕

10. **成就徽章系統** ⭐
    - 互動成就解鎖
    - 多種徽章類型
    - 進度追蹤

## 🚀 快速開始

### 方法 1：直接開啟 HTML 檔案
1. 下載所有檔案
2. 直接用瀏覽器開啟 `index.html`
3. 瀏覽網站並測試所有功能

### 方法 2：使用本地伺服器（建議）
```bash
# 使用 Python（如果已安裝）
python -m http.server 8000

# 使用 Node.js http-server
npx http-server

# 使用 VS Code Live Server 擴充功能
# 右鍵點擊 index.html -> Open with Live Server
```

然後在瀏覽器中訪問 `http://localhost:8000`

### 訪問後台管理系統 ⭐ 新功能
1. 用瀏覽器開啟 `admin.html`
2. 輸入帳號：`admin`
3. 輸入密碼：`admin123`
4. 查看所有訪客互動數據

## 📁 檔案結構

```
Self-Introduction/
├── index.html              # 主要 HTML 檔案
├── admin.html              # 後台管理系統 ⭐ 新增
├── styles.css              # 所有樣式
├── script.js               # 互動功能
├── images/                 # 圖片資料夾
│   └── (放置您的照片和專案圖片)
├── README.md               # 說明文件（本檔案）
├── 新功能說明.md            # 原有新功能說明
├── 進階功能使用說明.md      # 進階功能詳細說明 ⭐ 新增
├── 快速開始.md             # 快速開始指南 ⭐ 新增
└── readme.txt              # 原始筆記
```

## 🎨 自訂指南

### 更改個人資訊

在 `index.html` 中找到以下區域並修改：

```html
<!-- 姓名 -->
<h1 class="hero-title">
    你好，我是 <span class="highlight">您的名字</span>
</h1>

<!-- 職稱 -->
在 script.js 中修改：
const texts = [
    '您的職稱1',
    '您的職稱2',
    '您的職稱3',
    // ...
];

<!-- 社群媒體連結 -->
<a href="您的GitHub網址" class="social-link">
    <i class="fab fa-github"></i>
</a>
```

### 更改主題顏色

在 `styles.css` 的 `:root` 區域修改：

```css
:root {
    --primary-color: #6366f1;    /* 主要顏色 */
    --secondary-color: #f59e0b;  /* 次要顏色 */
    --accent-color: #ec4899;     /* 強調色 */
}
```

### 添加個人照片

1. 將照片放入 `images/` 資料夾
2. 在 HTML 中替換圖片佔位符：

```html
<!-- 替換 -->
<div class="image-placeholder">
    <i class="fas fa-user"></i>
</div>

<!-- 為 -->
<img src="images/your-photo.jpg" alt="個人照片">
```

### 修改技能和經歷

在 `index.html` 中找到對應區域：

```html
<!-- 技能 -->
<div class="skill-bar">
    <div class="skill-info">
        <span class="skill-name">技能名稱</span>
        <span class="skill-percentage">熟練度%</span>
    </div>
    <div class="skill-progress">
        <div class="skill-progress-bar" data-progress="熟練度數字"></div>
    </div>
</div>

<!-- 工作經歷 -->
<div class="timeline-item">
    <!-- 修改日期、職稱、公司、描述 -->
</div>
```

### 添加專案

複製現有的 `.project-card` 區塊並修改：

```html
<div class="project-card" data-category="分類">
    <div class="project-image">
        <!-- 添加專案圖片或保持佔位符 -->
    </div>
    <div class="project-info">
        <h3 class="project-title">專案名稱</h3>
        <p class="project-description">專案描述</p>
        <div class="project-tags">
            <span class="tag">技術1</span>
            <span class="tag">技術2</span>
        </div>
    </div>
</div>
```

## 🔧 進階自訂

### 修改動畫速度

在 `styles.css` 中：

```css
:root {
    --transition-fast: 0.2s ease;   /* 快速動畫 */
    --transition-base: 0.3s ease;   /* 基礎動畫 */
    --transition-slow: 0.5s ease;   /* 慢速動畫 */
}
```

### 調整粒子數量

在 `script.js` 中：

```javascript
const particleCount = 50;  // 增加或減少粒子數量
```

### 修改打字動畫文字

在 `script.js` 中：

```javascript
const texts = [
    '文字1',
    '文字2',
    '文字3',
    // 添加更多...
];
```

## 📱 響應式設計

網站已針對以下裝置優化：
- 📱 手機（< 480px）
- 📱 平板（< 768px）
- 💻 筆電（< 1024px）
- 🖥️ 桌機（> 1024px）

## 🌐 瀏覽器支援

- ✅ Chrome（最新版）推薦
- ✅ Firefox（最新版）
- ✅ Safari（最新版）
- ✅ Edge（最新版）
- ⚠️ IE11（部分功能可能不支援）

## 💻 技術棧

### 前端技術
- **HTML5** - 語義化標記
- **CSS3** - 現代樣式和動畫
- **JavaScript (ES6+)** - 互動功能
- **Three.js** - 3D 圖形渲染 ⭐ 新增
- **Chart.js** - 數據視覺化
- **Font Awesome** - 圖標庫
- **Google Fonts** - 網頁字體

### 核心功能技術
- **Canvas API** - 粒子動畫
- **LocalStorage API** - 數據持久化
- **WebGL** - 3D 渲染
- **Intersection Observer** - 滾動動畫
- **CSS Grid & Flexbox** - 響應式佈局
- **CSS Variables** - 主題切換

### 新增功能技術 ⭐
- **Three.js r128** - 3D 幾何體動畫
- **AI 聊天邏輯** - 關鍵字匹配系統
- **終端機模擬** - 指令解析器
- **後台管理系統** - 登入驗證與數據管理
- **即時狀態系統** - 定時器更新

## 🎯 SEO 優化建議

1. 修改 `<title>` 標籤
2. 更新 `<meta name="description">` 內容
3. 添加 Open Graph 標籤（社群媒體分享）
4. 創建 `sitemap.xml`
5. 添加 `robots.txt`

## 📦 部署選項

### GitHub Pages（免費）
1. 將檔案上傳到 GitHub repository
2. 在 Settings → Pages 中啟用
3. 選擇 main branch
4. 網站將發布在 `https://用戶名.github.io/repository名稱`

### Netlify（免費）
1. 註冊 Netlify
2. 連結 GitHub repository 或直接拖曳資料夾
3. 自動部署

### Vercel（免費）
1. 註冊 Vercel
2. 導入 GitHub repository
3. 自動部署

## 🛠️ 常見問題

### Q: 圖片沒有顯示？
A: 確保圖片路徑正確，並放在 `images/` 資料夾中

### Q: 動畫不流暢？
A: 可能是粒子數量太多，減少 `particleCount` 的值

### Q: 在手機上選單無法點擊？
A: 確認已包含所有 JavaScript 檔案

### Q: 主題切換不工作？
A: 檢查瀏覽器的 localStorage 是否被阻擋

### Q: 3D 背景沒有顯示？ ⭐ 新增
A: 確認 Three.js 庫已正確載入，檢查瀏覽器控制台錯誤

### Q: AI 聊天機器人無法回應？ ⭐ 新增
A: 確認 JavaScript 沒有錯誤，檢查控制台

### Q: 終端機指令不執行？ ⭐ 新增
A: 輸入 `help` 查看可用指令，確認指令拼寫正確

### Q: 後台看不到數據？ ⭐ 新增
A: 先在前台使用各項功能產生資料，再到後台查看

## 🎨 顏色方案建議

### 科技藍（預設）
```css
--primary-color: #6366f1;
--secondary-color: #f59e0b;
```

### 專業紫
```css
--primary-color: #8b5cf6;
--secondary-color: #ec4899;
```

### 清新綠
```css
--primary-color: #10b981;
--secondary-color: #3b82f6;
```

### 活力橙
```css
--primary-color: #f97316;
--secondary-color: #eab308;
```

## 📝 待辦事項清單

自訂網站時的建議步驟：

- [ ] 修改個人資訊（姓名、職稱）
- [ ] 更新社群媒體連結
- [ ] 添加個人照片
- [ ] 修改技能列表
- [ ] 更新工作經歷
- [ ] 添加真實專案
- [ ] 修改學歷資訊
- [ ] 更新聯絡資訊
- [ ] 測試 AI 聊天機器人 ⭐ 新增
- [ ] 測試互動終端機 ⭐ 新增
- [ ] 測試留言板功能 ⭐ 新增
- [ ] 測試後台管理系統 ⭐ 新增
- [ ] 測試表單功能
- [ ] 測試所有連結
- [ ] 在不同裝置上測試
- [ ] 優化圖片大小
- [ ] 部署到線上

## 💡 提示和技巧

1. **定期更新內容** - 保持專案和技能的最新狀態
2. **優化圖片** - 使用壓縮工具減小圖片大小
3. **測試表單** - 連接真實的表單服務（如 Formspree, EmailJS）
4. **添加 Google Analytics** - 追蹤訪客數據
5. **SEO 優化** - 確保所有圖片都有 alt 屬性
6. **整合真實 AI** - 連接 OpenAI API 提供更智能的回覆 ⭐ 新增
7. **後端資料庫** - 使用 Firebase 或 MongoDB 永久保存訪客資料 ⭐ 新增
8. **定期查看後台** - 了解訪客互動情況和反饋 ⭐ 新增

## 📚 文檔參考

- **[快速開始.md](快速開始.md)** - 快速體驗新功能的指南 ⭐ 新增
- **[進階功能使用說明.md](進階功能使用說明.md)** - 詳細的功能說明 ⭐ 新增
- **[新功能說明.md](新功能說明.md)** - 原有新功能說明

## 🚀 未來可能的升級

### 短期目標
- [ ] 整合真實 AI API（OpenAI GPT）
- [ ] 連接後端資料庫（Firebase/Supabase）
- [ ] Email 通知系統
- [ ] 留言驗證碼（reCAPTCHA）

### 長期目標
- [ ] 多語言支援增強
- [ ] 訪客分析儀表板
- [ ] 留言審核系統
- [ ] 檔案上傳功能
- [ ] 即時聊天（WebSocket）
- [ ] PWA 支援（離線訪問）

## 🎯 性能優化建議

1. **圖片優化**
   - 使用 WebP 格式
   - 實施懶加載
   - 添加響應式圖片

2. **代碼優化**
   - 壓縮 CSS 和 JS
   - 移除未使用的代碼
   - 實施代碼分割

3. **載入優化**
   - 使用 CDN
   - 啟用瀏覽器緩存
   - 減少 HTTP 請求

## 🤝 貢獻

如果您有任何改進建議，歡迎提出！

## 📄 授權

此專案供個人使用。您可以自由修改和使用。

## 🌟 特別感謝

- **Three.js** - 3D 圖形庫
- **Chart.js** - 數據視覺化
- **Font Awesome** - 圖標資源

## 📧 聯絡

如有問題，請透過以下方式聯繫：
- Email: 11028201@cycu.org.tw
- GitHub: [您的 GitHub]

---

## 🎉 更新日誌

### v2.0.0 (2026-03-10) ⭐ 重大更新
- ✨ 新增 AI 聊天機器人功能
- ✨ 新增互動式終端機（駭客風格）
- ✨ 新增 Three.js 3D 背景動畫
- ✨ 新增訪客留言板
- ✨ 新增即時在線狀態顯示
- ✨ 新增完整後台管理系統
- 📝 新增詳細使用文檔

### v1.0.0
- 🎨 基礎個人網站功能
- 💫 粒子背景動畫
- 🌓 深色/淺色模式
- 📱 響應式設計
- 🎮 打字遊戲
- 🏆 成就系統

---

**讓你的個人網站與眾不同！** ✨

有任何問題歡迎查閱文檔或提問。祝你使用愉快！🚀
- LinkedIn: [您的 LinkedIn]

---

**祝您建立出色的個人網站！** 🎉

如果覺得這個模板有幫助，歡迎給個星星 ⭐
