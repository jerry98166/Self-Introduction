# SCALE UPGRADE ROADMAP

本文件是自我介紹網站的升級規劃，目標是把目前的單體展示站升級為「可持續擴張、可驗證品質、可維運」的作品平台。

## Vision

- 從「可展示」升級到「可持續迭代」
- 從「單次優化」升級到「自動化守門」
- 從「頁面堆疊」升級到「模組化治理」

## Phase 1（已落地）

- 全站健康檢查：`npm run health-check`
- 全站安全煙霧測試：`npm run security-check`
- 一鍵驗證流程：`npm run verify-all`
- 全站安全腳本注入與危險協議檢查
- 前端效能初始化分層（首屏/next frame/idle）

## Phase 2（下一階段）

### 2.1 架構治理
- 建立 `feature-manifest.json`，由單一來源管理功能頁 metadata
- 由腳本自動生成 lab 索引區塊，降低人工遺漏
- 拆分超大 CSS：critical/base/components/feature-overrides

### 2.2 內容治理
- 增加多語內容檔（zh/en）與字串鍵值規範
- 建立圖片資源規範（命名、尺寸、壓縮、格式）
- 建立 feature page 模板（head/meta/security/footer/scripts）

### 2.3 品質治理
- 導入 Lighthouse CI（桌機/行動）
- 設定效能 budget（LCP、CLS、JS/CSS 體積）
- 每次發版自動生成規模化報告

## Phase 3（平台化）

- 把功能頁轉為資料驅動渲染（JSON + 模板）
- 導入觀測：前端錯誤追蹤、RUM 指標
- 建立內容後台（草稿/發布流程）

## KPI（建議）

- 發版前檢查通過率：100%
- 安全基線違規數：0
- 首屏體感速度（主頁）：穩定 <= 2s
- 新功能頁加入時間：<= 30 分鐘（含檢查）

## 執行節奏（建議）

- 每週：執行一次 `npm run verify-all`
- 每次發布：執行 `npm run verify-all && npm run scale-check`
- 每月：檢視 `docs/reports/SCALE-READINESS-REPORT.md`
