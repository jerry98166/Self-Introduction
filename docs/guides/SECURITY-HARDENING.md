# SECURITY HARDENING GUIDE

本文件提供專案目前的資安基線、部署層建議與發版前檢查流程。

## 1. 現有防護（已落地）

- 全站頁面載入 `assets/js/security-hardening.js`
- 首頁已配置 `Content-Security-Policy`、`X-Content-Type-Options`、`Referrer-Policy`
- 聯絡表單已加入可疑 payload 檢查與基本輸入限制
- `tools/health-check.js` 已包含危險協議檢查 (`javascript:`)
- `tools/security-smoke-test.js` 已加入腳本注入完整性與 CSP 關鍵指令檢查

## 2. 一鍵檢查指令

```bash
npm run health-check
npm run security-check
npm run verify-all
```

建議每次改版都執行 `npm run verify-all`。

## 3. 部署層安全標頭建議

如果未來改用有伺服器控制的主機（Nginx / Cloudflare / Netlify），建議在回應標頭加上：

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security`（僅 HTTPS）

### 3.1 Nginx 範例

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none';" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 3.2 Cloudflare 建議

- 啟用 `Always Use HTTPS`
- 啟用 `Automatic HTTPS Rewrites`
- 開啟 `WAF Managed Rules`
- 開啟 `Bot Fight Mode`（若流量型態允許）
- 使用 `Transform Rules` 或 `Workers` 注入安全標頭

### 3.3 Netlify `_headers` 範例

```txt
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none';
```

## 4. 發版前清單

- `npm run verify-all` 必須 `PASSED`
- 不得出現 `javascript:` 於 `href/src`
- 新增頁面必須包含 `security-hardening.js`
- 外部連結 `target="_blank"` 必須包含 `rel="noopener noreferrer"`
- 重要表單欄位必須有前端基本驗證與長度限制

## 5. 風險提醒

- 前端防護可降低風險，但不能取代後端驗證
- 若未來新增 API，請務必在伺服器端做：
  - 輸入驗證與輸出編碼
  - Rate limit
  - 身份驗證與權限控管
  - 稽核日誌與告警
