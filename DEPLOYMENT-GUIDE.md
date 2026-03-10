# 🚀 快速部署指南

## 立即替換的佔位符（必須）

### 1. Google Analytics ID
**位置**: `index.html` 第 77、79 行和 `404.html`  
**替換**: `G-XXXXXXXXXX` → 您的真實 GA4 ID

```bash
# 快速替換（macOS/Linux）
sed -i '' 's/G-XXXXXXXXXX/G-YOUR-REAL-ID/g' index.html 404.html

# 或手動編輯：
# 1. 前往 https://analytics.google.com/
# 2. 創建新屬性
# 3. 獲取追蹤 ID（格式：G-ABC123DEF4）
# 4. 替換 index.html 中的兩處和 404.html 中的一處
```

---

### 2. 網域名稱
**位置**: `index.html`、`sitemap.xml`、`robots.txt`、`privacy.html`  
**替換**: `https://yourwebsite.com` → 您的網域

```bash
# 快速替換所有文件
find . -type f \( -name "*.html" -o -name "*.xml" -o -name "*.txt" \) -exec sed -i '' 's|https://yourwebsite.com|https://您的網域.com|g' {} +
```

---

### 3. 電子郵件
**位置**: `index.html`、`privacy.html`  
**替換**: `your-email@example.com` → 您的電子郵件

```bash
sed -i '' 's/your-email@example.com/您的真實郵箱@gmail.com/g' index.html privacy.html
```

---

### 4. 社群媒體連結
**位置**: `index.html` 約 129-141 行

```html
<!-- 尋找並替換這些 href="#" -->
<a href="https://github.com/您的用戶名" class="social-link" aria-label="GitHub">
<a href="https://linkedin.com/in/您的用戶名" class="social-link" aria-label="LinkedIn">
<a href="https://twitter.com/您的用戶名" class="social-link" aria-label="Twitter">
<a href="mailto:您的郵箱@example.com" class="social-link" aria-label="Email">
```

---

### 5. 結構化資料
**位置**: `index.html` 第 83-100 行（JSON-LD）

```json
{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "您的真實姓名",
    "jobTitle": "您的職稱",
    "url": "https://您的網域.com",
    "image": "https://您的網域.com/images/profile.jpg",
    "sameAs": [
        "https://github.com/您的GitHub",
        "https://linkedin.com/in/您的LinkedIn",
        "https://twitter.com/您的Twitter"
    ],
    "alumniOf": {
        "@type": "Organization",
        "name": "您的大學"
    }
}
```

---

## 🎨 創建網站圖示（5分鐘）

### 方法一：線上工具（推薦）
1. 訪問 https://realfavicongenerator.net/
2. 上傳您的 logo 或 profile 圖片
3. 自訂設定（或使用預設）
4. 下載並解壓到網站根目錄
5. 完成！所有圖示和 manifest 自動生成

### 方法二：手動創建（macOS/Linux）
```bash
# 前提：已安裝 ImageMagick (brew install imagemagick)

# 創建各種尺寸的 favicon
sips -z 16 16 images/profile.jpg --out favicon-16x16.png
sips -z 32 32 images/profile.jpg --out favicon-32x32.png
sips -z 180 180 images/profile.jpg --out apple-touch-icon.png

# 創建 PWA 圖示
for size in 72 96 128 144 152 192 384 512; do
    sips -z $size $size images/profile.jpg --out images/icon-${size}x${size}.png
done

# 創建社群分享圖
sips -z 630 1200 images/profile.jpg --out images/og-image.jpg
sips -z 675 1200 images/profile.jpg --out images/twitter-card.jpg

echo "✅ 所有圖示創建完成！"
```

---

## 🌐 部署選項（選擇一種）

### 選項 1：GitHub Pages（免費、簡單）✨

```bash
# 1. 初始化 Git（如果還沒有）
git init
git add .
git commit -m "Initial commit with optimizations"

# 2. 創建 GitHub repository
# 前往 https://github.com/new

# 3. 連接並推送
git remote add origin https://github.com/您的用戶名/您的repo名.git
git branch -M main
git push -u origin main

# 4. 啟用 GitHub Pages
# 前往 Repository Settings → Pages
# Source: Deploy from a branch
# Branch: main / (root)
# 保存

# 您的網站將在 https://您的用戶名.github.io/repo名/ 上線
```

**優點**: 免費、自動 HTTPS、自動部署  
**缺點**: 不支援 .htaccess（需使用 \_config.yml）

---

### 選項 2：Netlify（推薦）🚀

```bash
# 方法 A：拖放部署（最簡單）
# 1. 前往 https://app.netlify.com/drop
# 2. 將整個專案資料夾拖放到頁面
# 3. 完成！自動獲得 HTTPS 網址

# 方法 B：Git 連接（自動部署）
# 1. 註冊 Netlify
# 2. Connect to Git → 選擇 GitHub repository
# 3. 配置：
#    Build command: (留空)
#    Publish directory: .
# 4. Deploy!

# 自訂網域：
# Site settings → Domain management → Add custom domain
```

**優點**: 免費 SSL、自動部署、CDN、表單處理  
**缺點**: 無（最推薦）

---

### 選項 3：Vercel（極速）⚡

```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 部署
cd /Users/gaomenglin/Desktop/Self-Introduction
vercel

# 按照提示操作：
# - 登入/註冊
# - 設定專案名稱
# - 選擇根目錄
# - 確認部署

# 完成！獲得 https://您的專案.vercel.app
```

**優點**: 極速 CDN、免費 SSL、完美的 Next.js 支援  
**缺點**: 靜態網站有點大材小用

---

### 選項 4：傳統主機（Apache/Nginx）

```bash
# 使用 FTP/SFTP 上傳所有文件到主機
# 確保：
# 1. .htaccess 文件已上傳（Apache）
# 2. SSL 證書已安裝
# 3. 指向正確的目錄

# 測試 .htaccess 是否生效：
curl -I https://您的網域.com
# 應該看到：
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# 等安全標頭
```

---

## ✅ 部署後檢查清單

### 立即測試（5分鐘）

```bash
# 1. 網站可訪問
curl -I https://您的網域.com
# 期望：HTTP/2 200

# 2. robots.txt 可訪問
curl https://您的網域.com/robots.txt
# 期望：看到 User-agent: *

# 3. sitemap.xml 可訪問
curl https://您的網域.com/sitemap.xml
# 期望：看到 XML 內容

# 4. 404 頁面正常
curl -I https://您的網域.com/not-exist
# 期望：看到 404 並顯示自訂頁面
```

### 瀏覽器測試

- [ ] 首頁載入正常
- [ ] 所有圖片顯示（檢查 WebP fallback）
- [ ] 功能實驗室按鈕可點擊
- [ ] 管理後台可訪問
- [ ] 404 頁面正常顯示
- [ ] 隱私政策頁面可看
- [ ] 手機版本正常（DevTools 或真實設備）

---

## 📊 效能測試（15分鐘）

### 1. Google PageSpeed Insights
```bash
# 訪問
https://pagespeed.web.dev/

# 輸入您的網址並測試

# 目標分數：
# 桌機：90+ 分
# 手機：85+ 分

# 如果分數低於目標：
# - 檢查圖片是否真的使用了 WebP
# - 確認 .htaccess 的 Gzip 壓縮生效
# - 檢查是否有阻塞渲染的資源
```

### 2. GTmetrix
```bash
# 訪問
https://gtmetrix.com/

# 測試您的網站

# 目標：
# Performance Grade: A
# Structure Grade: A
# Fully Loaded Time: < 2s
```

### 3. WebPageTest
```bash
# 訪問
https://www.webpagetest.org/

# 選擇地理位置（選擇您的主要用戶所在地）

# 目標：
# First Contentful Paint: < 1.5s
# Largest Contentful Paint: < 2.5s
# Time to Interactive: < 3.5s
```

---

## 🔍 SEO 設定（10分鐘）

### 1. Google Search Console
```bash
# 1. 前往 https://search.google.com/search-console/
# 2. 添加屬性（property）→ 輸入您的網址
# 3. 驗證所有權：
#    - HTML 標籤（推薦）：複製 meta 標籤到 <head>
#    - 或 HTML 文件：上傳驗證文件
# 4. 提交 Sitemap：
#    左側選單：Sitemaps → 輸入 sitemap.xml → 提交
```

### 2. Bing Webmaster Tools（選用）
```bash
# 1. 前往 https://www.bing.com/webmasters/
# 2. 添加網站
# 3. 從 Google Search Console 導入（最快）
# 4. 或手動驗證並提交 sitemap
```

### 3. 測試結構化資料
```bash
# 訪問
https://search.google.com/test/rich-results

# 輸入您的網址
# 應該看到：
# ✅ Person schema detected
# ✅ No errors
```

---

## 📈 Analytics 設定（5分鐘）

### Google Analytics 4

```bash
# 1. 訪問 https://analytics.google.com/
# 2. 創建屬性（Property）
# 3. 設定數據流（Data Stream）→ 網站
# 4. 複製測量 ID（格式：G-XXXXXXXXXX）
# 5. 替換 index.html 和 404.html 中的 ID

# 6. 測試即時追蹤：
# - 在 Analytics 中打開「即時」報表
# - 在另一個瀏覽器視窗打開您的網站
# - 應該在 1-2 秒內看到活躍用戶
```

### 設定目標（Conversions）

```javascript
// 在 script.js 中添加自訂事件追蹤
// 範例：追蹤功能實驗室點擊
document.querySelector('a[href="lab.html"]').addEventListener('click', () => {
    gtag('event', 'lab_visit', {
        'event_category': 'engagement',
        'event_label': 'feature_lab',
        'value': 1
    });
});

// 追蹤專案查看
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        gtag('event', 'project_view', {
            'event_category': 'engagement',
            'event_label': card.dataset.projectName
        });
    });
});
```

---

## 🔒 SSL 設定（如自架主機）

### Let's Encrypt（免費）

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-apache

# CentOS/RHEL
sudo yum install certbot python3-certbot-apache

# 取得證書
sudo certbot --apache -d yourwebsite.com -d www.yourwebsite.com

# 測試自動續約
sudo certbot renew --dry-run

# 設定自動續約（每月1日凌晨3點）
sudo crontab -e
# 添加：
0 3 1 * * /usr/bin/certbot renew --quiet
```

### Cloudflare（最簡單、免費）

```bash
# 1. 註冊 Cloudflare（https://cloudflare.com）
# 2. 添加網站
# 3. 更改 DNS nameservers（在您的網域註冊商）
# 4. 等待 DNS 傳播（5分鐘-48小時）
# 5. 在 Cloudflare 面板：
#    SSL/TLS → 選擇「Full」或「Full (strict)」
#    SSL/TLS → Edge Certificates → Always Use HTTPS: ON
```

---

## 🎯 最終優化（選用）

### 啟用 Brotli 壓縮（優於 Gzip）

**Nginx 配置：**
```nginx
# 在 nginx.conf 或 site config
brotli on;
brotli_comp_level 6;
brotli_types text/html text/css text/javascript application/javascript application/json;
```

**Apache（需安裝模組）：**
```apache
<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/javascript application/javascript
    BrotliCompressionQuality 6
</IfModule>
```

---

### 設定 CDN（Cloudflare）

```bash
# 1. 已在上面設定 SSL 時完成 DNS
# 2. 額外設定：

# Speed → Optimization
☑️ Auto Minify: JavaScript, CSS, HTML
☑️ Brotli
☑️ Rocket Loader
☑️ HTTP/2 to Origin

# Caching → Configuration
- Caching Level: Standard
- Browser Cache TTL: 1 year

# Speed → Page Rules（可選）
- *.jpg, *.png, *.webp → Cache Level: Cache Everything
- *.css, *.js → Cache Level: Cache Everything
```

---

## 🐛 常見問題排除

### 問題 1：圖片不顯示
```bash
# 檢查文件路徑
ls -la images/

# 確認權限
chmod 644 images/*.jpg images/*.webp

# 檢查 .htaccess 是否阻擋
# 確認沒有：Deny from all
```

### 問題 2：.htaccess 不生效
```bash
# 檢查是否使用 Apache
httpd -v
# 或
apache2 -v

# 確認 mod_rewrite 啟用
sudo a2enmod rewrite
sudo systemctl restart apache2

# 檢查 AllowOverride
# 在 Apache 配置中應該是：
<Directory /var/www/html>
    AllowOverride All
</Directory>
```

### 問題 3：HTTPS 證書錯誤
```bash
# 測試證書有效性
openssl s_client -connect yourwebsite.com:443

# 強制更新 Let's Encrypt
sudo certbot renew --force-renewal

# 檢查證書到期時間
sudo certbot certificates
```

### 問題 4：Google Analytics 沒有數據
```javascript
// 1. 檢查 gtag.js 是否載入
// 在瀏覽器 Console 執行：
typeof gtag
// 應該返回 "function"

// 2. 測試發送事件
gtag('event', 'test_event', {
    'event_category': 'test',
    'event_label': 'manual_test'
});
// 然後查看 Network 標籤，應該看到請求發送到 google-analytics.com

// 3. 確認 ID 正確
// 查看 HTML 源代碼，確認不是 G-XXXXXXXXXX
```

---

## 📅 持續維護計劃

### 每天
- [ ] 檢查網站可訪問性
- [ ] 查看 Google Analytics 即時報表

### 每週
- [ ] 查看 Analytics 報表（訪客、熱門頁面）
- [ ] 檢查 Search Console（索引狀態、錯誤）
- [ ] 備份數據庫（如有）

### 每月
- [ ] 更新內容（部落格、專案）
- [ ] 檢查並修復 404 錯誤
- [ ] PageSpeed 測試
- [ ] 安全掃描

### 每季
- [ ] 更新依賴庫（CDN 版本）
- [ ] 檢查 SSL 證書有效期
- [ ] 競品分析
- [ ] A/B 測試實驗

---

## 🎉 完成！

您的網站現在已經：
- ✅ 完全優化並準備好上線
- ✅ SEO 友善
- ✅ 安全可靠
- ✅ 極速載入
- ✅ 無障礙友善
- ✅ 具備完整分析

### 最後步驟
1. 🔗 替換所有佔位符
2. 🎨 生成網站圖示
3. 🌐 選擇並部署到主機
4. 📊 設定 Analytics 和 Search Console
5. 🚀 分享您的作品！

---

**需要幫助？**
- 查看 [docs/網站全面優化報告.md](docs/網站全面優化報告.md)
- 參考 [IMAGE-OPTIMIZATION.md](IMAGE-OPTIMIZATION.md)

**祝您部署順利！** 🎊
