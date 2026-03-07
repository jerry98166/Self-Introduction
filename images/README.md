# 圖片資料夾

請將您的圖片放在這個資料夾中：

## 建議的圖片

1. **personal-photo.jpg** - 您的個人照片（建議尺寸：400x400px）
2. **about-photo.jpg** - 關於我區域的照片（建議尺寸：400x400px）
3. **project-1.jpg** - 專案 1 的截圖（建議尺寸：800x500px）
4. **project-2.jpg** - 專案 2 的截圖（建議尺寸：800x500px）
5. **project-3.jpg** - 專案 3 的截圖（建議尺寸：800x500px）
6. ...更多專案圖片

## 圖片優化建議

- 使用 JPG 格式處理照片
- 使用 PNG 格式處理需要透明背景的圖片
- 使用 WebP 格式可以獲得更好的壓縮率
- 建議使用 TinyPNG (https://tinypng.com/) 或 Squoosh (https://squoosh.app/) 壓縮圖片

## 如何替換圖片佔位符

在 index.html 中，找到：

```html
<div class="image-placeholder">
    <i class="fas fa-user"></i>
</div>
```

替換為：

```html
<img src="images/your-image.jpg" alt="描述">
```

記得為所有圖片添加適當的 alt 屬性，這對 SEO 和無障礙性很重要！
