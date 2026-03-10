# 圖片優化指南

## 🚨 當前問題
您的 `images/profile.jpg` 大小為 **2.6MB**，這會嚴重影響網站載入速度！

## ✅ 圖片優化最佳實踐

### 1. 壓縮圖片
**目標大小：**
- 首頁主圖：< 200KB
- 縮圖/頭像：< 100KB
- 背景圖：< 300KB
- 圖標：< 50KB

### 2. 使用現代格式
- **WebP**：比 JPEG/PNG 小 30-50%，現代瀏覽器支援度 95%+
- **AVIF**：比 WebP 更小，但支援度較低（70%+）

### 3. 響應式圖片
使用不同尺寸版本：
- 手機：375px-750px 寬
- 平板：768px-1024px 寬
- 桌機：1920px-3840px 寬

---

## 🛠️ 立即優化您的圖片

### 方法一：線上工具（最簡單）

1. **TinyPNG** - https://tinypng.com
   - 支援 PNG/JPEG
   - 壓縮率高達 70%
   - 完全免費

2. **Squoosh** - https://squoosh.app
   - Google 開發
   - 支援 WebP/AVIF 轉換
   - 可視化比較

3. **Compressor.io** - https://compressor.io
   - 支援多種格式
   - 批量處理

### 方法二：命令列工具（批量處理）

#### 安裝工具（macOS）
```bash
# 安裝 ImageMagick
brew install imagemagick

# 安裝 cwebp（WebP 轉換）
brew install webp

# 安裝 mozjpeg（JPEG 優化）
brew install mozjpeg
```

#### 優化命令

**1. 壓縮 JPEG（保持品質）**
```bash
# 原圖備份
cp images/profile.jpg images/profile-original.jpg

# 壓縮到 85% 品質（幾乎無視覺差異）
magick images/profile.jpg -quality 85 -sampling-factor 4:2:0 -strip images/profile.jpg

# 或使用 mozjpeg（更優秀的壓縮）
cjpeg -quality 85 -progressive images/profile-original.jpg > images/profile.jpg
```

**2. 轉換為 WebP**
```bash
# 轉換為 WebP（品質 80）
cwebp -q 80 images/profile.jpg -o images/profile.webp

# 批量轉換所有 JPG
for file in images/*.jpg; do
    cwebp -q 80 "$file" -o "${file%.jpg}.webp"
done
```

**3. 創建響應式版本**
```bash
# 創建不同尺寸
magick images/profile.jpg -resize 375x images/profile-mobile.jpg
magick images/profile.jpg -resize 768x images/profile-tablet.jpg
magick images/profile.jpg -resize 1920x images/profile-desktop.jpg
```

**4. 批量優化腳本**
創建 `optimize-images.sh`：
```bash
#!/bin/bash
mkdir -p images/optimized

for img in images/*.jpg images/*.png; do
    filename=$(basename "$img")
    name="${filename%.*}"
    ext="${filename##*.}"
    
    # 壓縮 JPEG/PNG
    if [ "$ext" = "jpg" ] || [ "$ext" = "jpeg" ]; then
        magick "$img" -quality 85 -strip "images/optimized/$filename"
    elif [ "$ext" = "png" ]; then
        magick "$img" -quality 90 -strip "images/optimized/$filename"
    fi
    
    # 生成 WebP
    cwebp -q 80 "$img" -o "images/optimized/${name}.webp"
    
    echo "✅ Optimized: $filename"
done

echo "🎉 All images optimized!"
```

執行：
```bash
chmod +x optimize-images.sh
./optimize-images.sh
```

### 方法三：GUI 工具（視覺化）

**macOS：**
- **ImageOptim** - https://imageoptim.com
  - 拖放即可優化
  - 支援批量處理
  - 免費

**Windows：**
- **FileOptimizer** - https://sourceforge.net/projects/nikkhokkho
- **Caesium** - https://saerasoft.com/caesium

---

## 📝 在 HTML 中使用優化後的圖片

### 基本用法（WebP with fallback）
```html
<picture>
    <source srcset="images/profile.webp" type="image/webp">
    <img src="images/profile.jpg" alt="高孟麟的照片" loading="lazy">
</picture>
```

### 響應式圖片
```html
<picture>
    <!-- WebP 版本（手機、平板、桌機） -->
    <source 
        media="(max-width: 767px)" 
        srcset="images/profile-mobile.webp" 
        type="image/webp">
    <source 
        media="(max-width: 1023px)" 
        srcset="images/profile-tablet.webp" 
        type="image/webp">
    <source 
        srcset="images/profile-desktop.webp" 
        type="image/webp">
    
    <!-- JPEG fallback -->
    <source 
        media="(max-width: 767px)" 
        srcset="images/profile-mobile.jpg">
    <source 
        media="(max-width: 1023px)" 
        srcset="images/profile-tablet.jpg">
    
    <img 
        src="images/profile-desktop.jpg" 
        alt="高孟麟的照片" 
        loading="lazy"
        width="800" 
        height="800">
</picture>
```

### 帶有預載入（LCP 優化）
```html
<!-- 在 <head> 中預載重要圖片 -->
<link rel="preload" as="image" href="images/profile.webp" type="image/webp">
<link rel="preload" as="image" href="images/profile.jpg" type="image/jpeg">
```

---

## 🎯 快速行動指南

### 步驟 1：備份原圖
```bash
mkdir -p images/originals
cp images/*.jpg images/originals/
cp images/*.png images/originals/
```

### 步驟 2：優化 profile.jpg
```bash
# 使用 TinyPNG 或執行：
magick images/profile.jpg -quality 85 -resize 800x800 -strip images/profile-optimized.jpg
cwebp -q 80 images/profile-optimized.jpg -o images/profile.webp
```

### 步驟 3：更新 HTML
將 index.html 中的：
```html
<img src="images/profile.jpg" alt="高孟麟">
```

改為：
```html
<picture>
    <source srcset="images/profile.webp" type="image/webp">
    <img src="images/profile-optimized.jpg" alt="高孟麟的照片" loading="lazy" width="800" height="800">
</picture>
```

### 步驟 4：測試
```bash
# 檢查優化前後大小
ls -lh images/originals/profile.jpg
ls -lh images/profile-optimized.jpg
ls -lh images/profile.webp

# 應該看到：
# Original: 2.6MB
# Optimized JPEG: ~150-250KB
# WebP: ~80-150KB
```

---

## 📊 預期效果

| 項目 | 優化前 | 優化後 | 改善 |
|-----|-------|--------|------|
| 圖片大小 | 2.6MB | ~150KB | 🎉 94% ↓ |
| 載入時間 | ~8-10秒 | ~0.5-1秒 | ⚡ 90% ↑ |
| PageSpeed 分數 | 40-50 | 85-95 | 📈 +45 |

---

## 🔗 相關資源

- [Google PageSpeed Insights](https://pagespeed.web.dev/) - 測試網站速度
- [WebP 瀏覽器支援](https://caniuse.com/webp) - 檢查兼容性
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images) - Google 官方指南
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) - MDN 文檔

---

## ⚠️ 注意事項

1. **永遠保留原圖備份**
2. **測試壓縮品質** - 確保視覺效果可接受
3. **檢查瀏覽器支援** - 提供 fallback
4. **添加 width/height** - 避免 layout shift
5. **使用 loading="lazy"** - 延遲載入非關鍵圖片

---

現在就開始優化您的圖片，讓網站速度飛起來！🚀
