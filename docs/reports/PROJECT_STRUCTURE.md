# 專案結構（2026-03-28）

本文件說明目前專案的正式目錄規劃，包含頁面、功能、資產、文件與檢查工具。

## 根目錄

- `index.html`：網站首頁
- `pages/`：主站子頁面（about、skills、projects、lab、admin 等）
- `features/`：功能實驗室各獨立功能頁
- `assets/`：共用 CSS/JS 資產
- `projects/`：獨立專案展示頁
- `images/`：圖片資源
- `docs/`：文件區（已完成分層歸檔）
- `tools/`：開發檢查與維護腳本
- `README.md`：對外總說明

## docs/ 文件分層

- `docs/guides/`：操作指南與教學文件
- `docs/reports/`：功能完成、修復、優化報告
- `docs/archive/legacy/`：舊版與歷史文件
- `docs/README.md`：文件索引

## assets/ 規劃

- `assets/css/styles.css`：全站共用樣式
- `assets/js/script.js`：主站核心互動邏輯
- `assets/js/lab.js`：功能實驗室列表、啟動與狀態管理
- `assets/js/vue-app.js`、`assets/js/vue-subpages.js`：Vue 增強模組

## features/ 規劃

- 每個功能使用獨立 HTML 檔案，維持可單頁運作
- `features/innovation-suite.html` 為進階功能共用基底
- 功能頁命名採 kebab-case，與 `assets/js/lab.js` 的 feature id 對應

## 安全與品質規範

- 所有使用者可輸入內容不得直接拼接 `innerHTML`
- Markdown 預覽需經 HTML sanitize 後再渲染
- 每次調整後執行：

```bash
npm run health-check
```

- 健康檢查需維持 `Result: PASSED`

## 歸檔原則

- 新增教學文件：放 `docs/guides/`
- 新增成果報告：放 `docs/reports/`
- 歷史/廢棄文件：移至 `docs/archive/legacy/`
- 若文件路徑變更，需同步更新 `README.md` 與 `docs/README.md`
