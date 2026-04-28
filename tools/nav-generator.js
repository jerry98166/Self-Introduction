#!/usr/bin/env node
/**
 * 導航生成器工具
 * 根據 feature-manifest.json 自動生成功能導航和索引
 * 用途：
 *  - 替換 inline onclick handlers
 *  - 生成 lab 索引區塊（搜索、分類、篩選）
 *  - 支援智能推薦和分析
 */

const fs = require('fs');
const path = require('path');

// =========== 配置 ===========
const MANIFEST_PATH = path.join(__dirname, '../assets/images/icons/feature-manifest.json');
const LAB_TEMPLATE_PATH = path.join(__dirname, '../pages/lab.html');
const OUTPUT_NAV_SNIPPET = path.join(__dirname, '../temp/nav-snippet.html');
const OUTPUT_FEATURE_DB = path.join(__dirname, '../assets/js/feature-navigator.js');

// =========== 主要類別 ===========
class FeatureNavigator {
  constructor() {
    this.manifest = this._loadManifest();
    this._initCategories();
  }

  _loadManifest() {
    try {
      const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('❌ 無法讀取 feature-manifest.json:', err.message);
      process.exit(1);
    }
  }

  _initCategories() {
    // 根據特性統計各分類的數量
    const categoryCounts = {};
    this.manifest.features.forEach(f => {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    });
    
    this.manifest.categories = Object.entries(categoryCounts).reduce((acc, [cat, count]) => {
      acc[cat] = { count, emoji: this.manifest.categories[cat]?.emoji || '📂' };
      return acc;
    }, this.manifest.categories);
  }

  /**
   * 生成導航 HTML 片段
   * 包含：分類選擇、搜索框、特色推薦、完整網格
   */
  generateNavigationHTML() {
    const categories = Object.entries(this.manifest.categories)
      .map(([name, meta]) => ({
        name,
        emoji: meta.emoji,
        count: meta.count || this.manifest.features.filter(f => f.category === name).length
      }))
      .sort((a, b) => b.count - a.count);

    const featured = this.manifest.features.filter(f => f.featured);
    const allFeatures = this.manifest.features;

    // 分類按鈕
    const categoryButtons = categories
      .map(cat => 
        `<button class="filter-btn" data-category="${this._sanitize(cat.name)}">
          ${cat.emoji} ${cat.name} <span class="count">${cat.count}</span>
        </button>`
      )
      .join('\n');

    // 特色推薦卡片
    const featuredCards = featured
      .map((f, idx) =>
        `<div class="feature-card featured" data-id="${f.id}" onclick="navigateTo('${f.id}')">
          <div class="feature-icon">${f.emoji}</div>
          <h3>${f.name}</h3>
          <p class="description">${f.description}</p>
          <div class="feature-meta">
            <span class="category">${f.category}</span>
          </div>
        </div>`
      )
      .join('\n');

    // 完整特性網格（初始只顯示部分）
    const featureGrid = allFeatures
      .map(f =>
        `<div class="feature-card" data-id="${f.id}" data-category="${this._sanitize(f.category)}" 
              data-tags="${f.tags.join(' ')}" onclick="navigateTo('${f.id}')">
          <div class="feature-icon">${f.emoji}</div>
          <h4>${f.name}</h4>
          <p class="description">${f.description}</p>
          <div class="feature-meta">
            <span class="category">${f.category}</span>
            ${f.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>`
      )
      .join('\n');

    return `
<!-- ========== 智能導航面板 ========== -->
<div id="feature-navigator" class="feature-navigator-panel">
  <!-- 搜索欄 -->
  <div class="nav-search-bar">
    <input type="text" id="feature-search" class="search-input" 
           placeholder="🔍 搜尋功能名稱、標籤或說明..." 
           onkeyup="searchFeatures(this.value)">
    <button class="clear-search-btn" id="clear-search-btn" onclick="clearSearch()" style="display:none;">✕</button>
  </div>

  <!-- 篩選選項 -->
  <div class="nav-filters">
    <div class="filter-section">
      <h5>📂 依分類篩選</h5>
      <div class="filter-buttons">
        <button class="filter-btn active" data-category="all">全部</button>
        ${categoryButtons}
      </div>
    </div>
  </div>

  <!-- 特色推薦區 -->
  <div class="featured-section">
    <h3>⭐ 精選推薦</h3>
    <div class="featured-grid">
      ${featuredCards}
    </div>
  </div>

  <!-- 功能網格 -->
  <div class="features-section">
    <h3>📚 完整功能列表</h3>
    <div class="features-grid" id="features-grid">
      ${featureGrid}
    </div>
  </div>

  <!-- 加載更多 -->
  <div class="load-more">
    <button id="load-more-btn" class="load-more-btn" onclick="loadMoreFeatures()">
      載入更多功能 ↓
    </button>
  </div>
</div>

<!-- 統計信息 -->
<div class="feature-stats">
  <div class="stat">
    <span class="stat-number">${allFeatures.length}</span>
    <span class="stat-label">總功能數</span>
  </div>
  <div class="stat">
    <span class="stat-number">${Object.keys(this.manifest.categories).length}</span>
    <span class="stat-label">分類</span>
  </div>
  <div class="stat">
    <span class="stat-number">${featured.length}</span>
    <span class="stat-label">精選推薦</span>
  </div>
</div>
    `;
  }

  /**
   * 生成功能導航 JavaScript 模組
   * 提供搜索、篩選、推薦邏輯
   */
  generateNavigatorJS() {
    const manifest = JSON.stringify(this.manifest, null, 2);
    
    return `
/**
 * feature-navigator.js
 * 動態功能導航和搜索系統
 * 
 * 公開 API:
 *  - searchFeatures(query): 搜索功能
 *  - filterByCategory(category): 按分類篩選  
 *  - navigateTo(featureId): 導航到功能頁面
 *  - loadMoreFeatures(): 加載更多功能卡片
 *  - getRecommendations(userTags): 基於標籤的推薦
 */

// 全局功能清單
const FEATURE_MANIFEST = ${manifest};

// 狀態管理
let navState = {
  currentCategory: 'all',
  searchQuery: '',
  displayedCount: 12,
  maxInitialDisplay: 12
};

/**
 * 搜索功能 - 支援名稱、描述、標籤匹配
 */
function searchFeatures(query) {
  const searchInput = document.getElementById('feature-search');
  const clearBtn = document.getElementById('clear-search-btn');
  const grid = document.getElementById('features-grid');
  
  if (!grid) return; // Lab 頁面才有網格
  
  navState.searchQuery = query.toLowerCase();
  clearBtn.style.display = query ? 'inline-block' : 'none';
  
  const filtered = FEATURE_MANIFEST.features.filter(f => {
    const matchName = f.name.toLowerCase().includes(navState.searchQuery);
    const matchDesc = f.description.toLowerCase().includes(navState.searchQuery);
    const matchTags = f.tags.some(t => t.toLowerCase().includes(navState.searchQuery));
    const matchCategory = f.category.toLowerCase().includes(navState.searchQuery);
    
    return (matchName || matchDesc || matchTags || matchCategory) &&
           (navState.currentCategory === 'all' || f.category === navState.currentCategory);
  });
  
  renderFeatureCards(filtered, grid);
  
  // 記錄搜索分析
  if (query) {
    logSearchAnalytics(query, filtered.length);
  }
}

/**
 * 按分類篩選
 */
function filterByCategory(categoryName) {
  navState.currentCategory = categoryName;
  navState.searchQuery = ''; // 重置搜索
  
  const searchInput = document.getElementById('feature-search');
  if (searchInput) {
    searchInput.value = '';
    document.getElementById('clear-search-btn').style.display = 'none';
  }
  
  // 更新按鈕狀態
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', 
      btn.dataset.category === (categoryName === 'all' ? 'all' : categoryName) ||
      (btn.textContent.includes('全部') && categoryName === 'all')
    );
  });
  
  const filtered = categoryName === 'all' 
    ? FEATURE_MANIFEST.features
    : FEATURE_MANIFEST.features.filter(f => f.category === categoryName);
  
  const grid = document.getElementById('features-grid');
  if (grid) {
    renderFeatureCards(filtered, grid);
  }
}

/**
 * 渲染功能卡片到 DOM
 */
function renderFeatureCards(features, containerElement) {
  const displayed = features.slice(0, navState.displayedCount);
  
  containerElement.innerHTML = displayed.map(f =>
    \`<div class="feature-card" data-id="\${f.id}" data-category="\${f.category}" 
          onclick="navigateTo('\${f.id}')" role="button" tabindex="0">
      <div class="feature-icon">\${f.emoji}</div>
      <h4>\${f.name}</h4>
      <p class="description">\${f.description}</p>
      <div class="feature-meta">
        <span class="category">\${f.category}</span>
        \${f.tags.map(t => \`<span class="tag">\${t}</span>\`).join('')}
      </div>
    </div>\`
  ).join('');
  
  // 顯示/隱藏「加載更多」按鈕
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = features.length > navState.displayedCount ? 'block' : 'none';
  }
}

/**
 * 加載更多功能卡片
 */
function loadMoreFeatures() {
  navState.displayedCount += 12;
  
  const filtered = navState.currentCategory === 'all'
    ? FEATURE_MANIFEST.features
    : FEATURE_MANIFEST.features.filter(f => f.category === navState.currentCategory);
  
  const grid = document.getElementById('features-grid');
  if (grid) {
    renderFeatureCards(filtered, grid);
  }
}

/**
 * 導航到功能頁面 - 替換 inline onclick handlers
 */
function navigateTo(featureId) {
  const feature = FEATURE_MANIFEST.features.find(f => f.id === featureId);
  if (!feature) {
    console.warn('❌ 找不到功能:', featureId);
    return;
  }
  
  // 記錄導航分析
  logNavigationAnalytics(featureId, feature.name);
  
  // 導航到功能頁面
  const featurePath = \`features/\${feature.filename}\`;
  window.location.href = featurePath;
}

/**
 * 清空搜索框
 */
function clearSearch() {
  const searchInput = document.getElementById('feature-search');
  if (searchInput) {
    searchInput.value = '';
    searchFeatures('');
  }
}

/**
 * 智能推薦 - 基於使用者互動標籤
 */
function getRecommendations(userSelectedTags = []) {
  if (userSelectedTags.length === 0) {
    // 預設推薦：特色功能
    return FEATURE_MANIFEST.features.filter(f => f.featured);
  }
  
  return FEATURE_MANIFEST.features
    .map(f => ({
      feature: f,
      score: f.tags.filter(t => userSelectedTags.includes(t)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.feature);
}

/**
 * 分析：記錄搜索事件
 */
function logSearchAnalytics(query, resultCount) {
  if (typeof gtag === 'undefined') return;
  
  gtag('event', 'feature_search', {
    'search_term': query,
    'result_count': resultCount
  });
}

/**
 * 分析：記錄導航事件
 */
function logNavigationAnalytics(featureId, featureName) {
  if (typeof gtag === 'undefined') return;
  
  gtag('event', 'feature_visit', {
    'feature_id': featureId,
    'feature_name': featureName
  });
}

/**
 * 初始化導航系統
 * 附加事件監聽器、綁定篩選按鈕
 */
function initNavigator() {
  // 綁定分類篩選按鈕
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category === 'all' ? 'all' : this.dataset.category;
      // 重新對應回原始分類名稱
      const categoryMap = {};
      FEATURE_MANIFEST.features.forEach(f => {
        categoryMap[f.category.toLowerCase().replace(/\\s+/g, '-')] = f.category;
      });
      const actualCategory = this.textContent.includes('全部') 
        ? 'all' 
        : Array.from(this.parentElement.children)
            .find(btn => btn.classList.contains('active'))?.textContent || 'all';
      
      if (this.textContent.includes('全部')) {
        filterByCategory('all');
      } else {
        // 提取分類名稱
        const catName = this.textContent.replace(/\\s*\\d+\\s*/, '').trim();
        filterByCategory(catName);
      }
    });
  });
  
  // 綁定搜索框回車鍵
  const searchInput = document.getElementById('feature-search');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }
  
  console.log('✅ 功能導航系統已初始化');
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', initNavigator);

// 暴露到全局作用域
window.FeatureNavigator = {
  searchFeatures,
  filterByCategory,
  navigateTo,
  loadMoreFeatures,
  getRecommendations,
  logSearchAnalytics,
  logNavigationAnalytics,
  initNavigator,
  getManifest: () => FEATURE_MANIFEST,
  getState: () => navState
};
    `;
  }

  /**
   * 生成導航樣式
   */
  generateNavigatorCSS() {
    return `
/* ========== 功能導航器樣式 ========== */

.feature-navigator-panel {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* 搜索欄 */
.nav-search-bar {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  background-color: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background-color: #fff;
}

.clear-search-btn {
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
}

.clear-search-btn:hover {
  background: #e5e7eb;
}

/* 篩選區 */
.nav-filters {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border-left: 4px solid #6366f1;
}

.filter-section h5 {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #6366f1;
  background: #f0f4ff;
}

.filter-btn.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.filter-btn .count {
  font-size: 0.8rem;
  opacity: 0.7;
}

.filter-btn.active .count {
  opacity: 1;
}

/* 特色區 */
.featured-section {
  margin: 3rem 0;
}

.featured-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* 特性卡片 */
.feature-card {
  padding: 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-card:hover {
  border-color: #6366f1;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
  transform: translateY(-4px);
}

.feature-card.featured {
  border-left: 5px solid #fbbf24;
  background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
}

.feature-icon {
  font-size: 2rem;
  line-height: 1;
}

.feature-card h3,
.feature-card h4 {
  margin: 0;
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.feature-card .description {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.feature-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.feature-meta .category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.feature-meta .tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 0.25rem;
  font-size: 0.7rem;
}

/* 特性網格 */
.features-section {
  margin: 3rem 0;
}

.features-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 加載更多 */
.load-more {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.load-more-btn {
  padding: 0.75rem 2rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover {
  background: #4f46e5;
  transform: scale(1.05);
}

/* 統計信息 */
.feature-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 3rem 0;
  padding: 2rem;
  background: #f3f4f6;
  border-radius: 0.75rem;
  text-align: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #6366f1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .filter-buttons {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .search-input {
    font-size: 16px; /* 避免 iOS 自動縮放 */
  }
}
    `;
  }

  // 公開方法
  generate() {
    return {
      html: this.generateNavigationHTML(),
      js: this.generateNavigatorJS(),
      css: this.generateNavigatorCSS()
    };
  }

  _sanitize(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
}

// =========== 執行生成 ===========
function main() {
  const navigator = new FeatureNavigator();
  const generated = navigator.generate();

  // 建立 temp 目錄
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // 寫入生成的文件
  fs.writeFileSync(OUTPUT_NAV_SNIPPET, generated.html, 'utf-8');
  fs.writeFileSync(OUTPUT_FEATURE_DB, generated.js, 'utf-8');

  // 導出 CSS 到單獨的文件（可選）
  const cssPath = path.join(__dirname, '../assets/css/feature-navigator.css');
  fs.writeFileSync(cssPath, generated.css, 'utf-8');

  console.log('✅ 導航生成器執行完成');
  console.log('📄 HTML 片段: ' + OUTPUT_NAV_SNIPPET);
  console.log('📜 JavaScript 模組: ' + OUTPUT_FEATURE_DB);
  console.log('🎨 CSS 樣式: ' + cssPath);
  console.log('✨ 共生成 ' + navigator.manifest.features.length + ' 個功能的導航代碼');
}

if (require.main === module) {
  main();
}

module.exports = FeatureNavigator;
