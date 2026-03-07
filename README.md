# 📝 個人自我介紹網站

一個功能豐富、現代化的個人自我介紹網站，展示您的技能、經驗和作品集。

## ✨ 主要功能

### 🎨 視覺特效
- **粒子背景動畫** - 動態的粒子系統創造科技感
- **深色/淺色模式** - 可切換的主題，保護眼睛
- **平滑滾動** - 流暢的頁面滾動體驗
- **懸停動畫** - 豐富的互動效果
- **響應式設計** - 完美適配所有裝置

### 📱 功能區域

1. **Hero 區域**
   - 打字動畫效果
   - 個人介紹
   - 社群媒體連結
   - 快速聯絡按鈕

2. **關於我**
   - 個人簡介
   - 統計數字動畫
   - 核心能力展示

3. **技能專長**
   - 分類技能展示（前端、後端、工具）
   - 動畫進度條
   - 技術圖標牆

4. **工作經歷**
   - 時間軸視覺化
   - 詳細的工作描述
   - 技術標籤

5. **作品集**
   - 專案展示
   - 分類過濾功能
   - 懸停預覽效果

6. **學歷背景**
   - 教育經歷
   - 專業證照
   - 成就展示

7. **聯絡表單**
   - 表單驗證
   - 送出動畫
   - 聯絡資訊

## 🚀 快速開始

### 方法 1：直接開啟 HTML 檔案
1. 下載所有檔案
2. 直接用瀏覽器開啟 `index.html`

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

## 📁 檔案結構

```
Self-Introduction/
├── index.html          # 主要 HTML 檔案
├── styles.css          # 所有樣式
├── script.js           # 互動功能
├── images/             # 圖片資料夾
│   └── (放置您的照片和專案圖片)
├── README.md           # 說明文件（本檔案）
└── readme.txt          # 原始筆記
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

- ✅ Chrome（最新版）
- ✅ Firefox（最新版）
- ✅ Safari（最新版）
- ✅ Edge（最新版）
- ⚠️ IE11（部分功能可能不支援）

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

## 🤝 貢獻

如果您有任何改進建議，歡迎提出！

## 📄 授權

此專案供個人使用。您可以自由修改和使用。

## 📧 聯絡

如有問題，請透過以下方式聯繫：
- Email: example@email.com
- GitHub: [您的 GitHub]
- LinkedIn: [您的 LinkedIn]

---

**祝您建立出色的個人網站！** 🎉

如果覺得這個模板有幫助，歡迎給個星星 ⭐
