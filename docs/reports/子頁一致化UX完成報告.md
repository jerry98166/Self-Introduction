# 子頁一致化 UX 完成報告

更新日期：2026-03-28

## 本次完成

- 已在 `pages/` 全部 10 個子頁載入共用腳本 `assets/js/subpage-ux.js`
- 子頁統一提供可及性與互動基礎：
  - Skip link（跳到主要內容）
  - `main` landmark 補齊
  - focus-visible 樣式
  - 手機選單 `aria-expanded` 與 Esc/外部點擊關閉
- 浮動控制統一為右下四鍵堆疊：
  - 語言切換（Language）
  - 主題切換（Theme）
  - 鋼琴音樂（Music）
  - 回到頂部（Back to top）

## 鋼琴音樂功能

- 主站 `assets/js/script.js` 已使用簡單鋼琴旋律（Web Audio）
- 子頁若未載入主站音樂邏輯，`subpage-ux.js` 會啟用 fallback 鋼琴音樂
- 音樂按鈕語意：`aria-label="鋼琴音樂"`、`aria-pressed`

## 快捷鍵（子頁一致）

- `L`：切換語言
- `T`：切換主題
- `M`：切換鋼琴音樂
- `Esc`：關閉手機選單（若已開啟）

## 驗證結果

- `npm run health-check`：`Result: PASSED`
- 安全檢查：Unsafe HTML interpolation findings = 0
- 關鍵 JS 檔案診斷：無錯誤

## 建議後續

- 依同樣模式將 `features/` 內互動頁面分批接入相同浮動控制體驗
- 新增視覺 QA 清單（桌機/手機/深淺色/中英切換）以利回歸測試
