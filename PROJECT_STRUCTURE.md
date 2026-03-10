# 📁 项目结构说明

本文档详细说明项目的文件组织结构和各文件的作用。

## 🗂️ 目录结构

```
Self-Introduction/
│
├── 📄 核心文件
│   ├── index.html              # 主页面（入口文件）
│   ├── lab.html               # 功能实验室页面
│   ├── admin.html             # 管理后台页面
│   ├── styles.css             # 主样式表
│   ├── script.js              # 主 JavaScript 文件
│   ├── lab.js                 # 功能实验室控制器
│   └── README.md              # 项目说明文档（本文件）
│
├── 📂 features/               # 功能页面目录（14个进阶功能）
│   ├── ai-interview.html          # AI 面试模拟器（25KB）
│   ├── voice-assistant.html       # 语音对话助理（16KB）
│   ├── gesture-control.html       # 手势识别控制（21KB）
│   ├── contribution-3d.html       # 3D 贡献图（23KB）
│   ├── visitor-map.html           # 全球访客地图（21KB）
│   ├── shader-art.html            # WebGL 着色器艺术（28KB）
│   ├── music-visualizer.html      # 音乐视觉化（22KB）
│   ├── ctf-challenges.html        # CTF 安全挑战（19KB）
│   ├── digital-footprint.html     # 数位足迹追踪（20KB）
│   ├── regex-tester.html          # 正则表达式测试器（13KB）
│   ├── json-formatter.html        # JSON 格式化工具（15KB）
│   ├── code-editor.html           # 在线代码编辑器（14KB）
│   ├── rpg-card.html             # RPG 角色卡（17KB）
│   └── treasure-hunt.html         # 网站寻宝游戏（17KB）
│
├── 📂 docs/                   # 文档目录
│   ├── README.md                  # 项目说明（旧版）
│   ├── README-OLD.md              # 旧版备份
│   ├── 開始使用.md                # 快速上手（30秒）
│   ├── 快速開始.md                # 快速开始
│   ├── 快速開始指南.md            # 详细使用教程
│   ├── 功能實驗室文檔.md          # 功能列表说明
│   ├── 功能完成報告.md            # 功能完成报告
│   ├── 功能完成總結報告.md        # 完整技术报告
│   ├── 新功能說明.md              # 新功能说明
│   ├── 新增功能報告.md            # 新增功能详细报告
│   ├── 進階功能使用說明.md        # 进阶功能使用指南
│   └── readme.txt                 # 简单说明
│
├── 📂 images/                 # 图片资源目录
│   ├── README.md                  # 图片说明
│   └── [项目图片...]
│
├── 📂 css/                    # CSS 文件目录（预留）
├── 📂 js/                     # JavaScript 文件目录（预留）
│
└── 📂 .git/                   # Git 版本控制目录

```

---

## 📄 核心文件详解

### index.html (64KB)
**作用**: 网站主页面，展示个人信息和基础功能

**主要内容**:
- 导航栏（含功能实验室、管理后台入口）
- Hero 区域（自我介绍）
- 关于我、技能、经历
- 项目作品集
- 教育背景
- 打字游戏
- 留言板
- 联系方式

**关键代码区块**:
```html
<!-- 导航栏 -->
<nav class="navbar">
  <a href="lab.html" class="nav-lab">🧪 功能实验室</a>
  <a href="admin.html" class="nav-admin">⚙️ 管理后台</a>
</nav>
```

---

### lab.html (25KB)
**作用**: 功能实验室主页，展示所有 54 个功能

**主要内容**:
- 功能分类（10 个类别）
- 功能卡片展示
- 功能搜索和筛选
- 状态统计

**功能分类**:
1. 🤖 AI 能力 (8项)
2. 🔐 网络安全 (6项)
3. 🎮 游戏化 (5项)
4. 📊 数据可视化 (6项)
5. 🌐 社交互动 (5项)
6. 🎨 视觉效果 (6项)
7. 🛠️ 实用工具 (6项)
8. 🔮 实验性 (5项)
9. 📱 PWA 功能 (4项)
10. 💰 商业功能 (3项)

---

### admin.html (22KB)
**作用**: 管理后台系统

**主要功能**:
- 数据统计仪表板
- 访客管理
- 留言审核
- 系统设置
- 数据分析

**关键特性**:
- 实时数据更新
- 图表展示（Chart.js）
- 响应式布局

---

### styles.css (55KB)
**作用**: 主样式表，定义所有视觉效果

**包含内容**:
- CSS 变量定义
- 基础样式重置
- 组件样式（按钮、卡片等）
- 动画效果
- 响应式断点
- 主题切换（深色/浅色）
- 特殊效果（毛玻璃、渐变等）

**关键变量**:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
  --bg-color: #fff;
  /* ... 更多变量 */
}
```

---

### script.js (56KB)
**作用**: 主 JavaScript 文件，控制网站核心功能

**主要模块**:
1. **初始化系统** - 页面加载和设置
2. **导航控制** - 平滑滚动、活动链接更新
3. **主题切换** - 深色/浅色模式
4. **语言切换** - 中英文切换
5. **3D 背景** - Three.js 渲染
6. **打字游戏** - 游戏逻辑
7. **留言板** - CRUD 操作
8. **表单验证** - 联系表单处理
9. **动画效果** - 滚动动画、粒子效果

**重要函数**:
```javascript
// 导航初始化（✅ 已修复外部链接问题）
function initNavigation() { ... }

// 主题切换
function toggleTheme() { ... }

// 语言切换
function toggleLanguage() { ... }
```

---

### lab.js (13KB)
**作用**: 功能实验室控制器

**主要功能**:
- 功能注册系统
- 功能启动器
- 模态窗口管理
- 搜索和筛选

**核心对象**:
```javascript
const FeatureLab = {
  features: {},          // 功能注册表
  init() { ... },        // 初始化
  registerAllFeatures() { ... },  // 注册所有功能
  openFeature(id) { ... }  // 打开功能
};
```

---

## 📂 features/ 目录详解

### 功能页面命名规范
- 使用短横线分隔（kebab-case）
- 文件名与功能 ID 对应
- 都是独立的 HTML 文件

### 各功能文件说明

#### 1. ai-interview.html (25KB)
- **技术**: 问答系统、智能评分
- **特色**: 4种职位、3种难度、STAR法则评估
- **依赖**: 无外部依赖

#### 2. voice-assistant.html (16KB)
- **技术**: Web Speech API
- **特色**: 多语言支持、语音合成、对话历史
- **依赖**: 浏览器 SpeechRecognition API

#### 3. gesture-control.html (21KB)
- **技术**: TensorFlow.js HandPose
- **特色**: 6种手势识别、实时物体控制
- **依赖**: TensorFlow.js（CDN）

#### 4. contribution-3d.html (23KB)
- **技术**: Three.js 3D 渲染
- **特色**: 52周数据、多视角、实时统计
- **依赖**: Three.js r128（CDN）

#### 5. visitor-map.html (21KB)
- **技术**: Leaflet.js 地图
- **特色**: 15国数据点、实时追踪、排行榜
- **依赖**: Leaflet 1.9.4（CDN）

#### 6. shader-art.html (28KB)
- **技术**: WebGL 2.0 + GLSL
- **特色**: 8种着色器效果、60 FPS、实时参数调整
- **依赖**: 原生 WebGL

#### 7. music-visualizer.html (22KB)
- **技术**: Web Audio API + Canvas
- **特色**: 6种可视化模式、FFT分析、粒子效果
- **依赖**: 原生 API

#### 8. ctf-challenges.html (19KB)
- **技术**: 加密算法、正则表达式
- **特色**: 5关递进、提示系统、排行榜
- **依赖**: 无

#### 9. digital-footprint.html (20KB)
- **技术**: 浏览器指纹识别
- **特色**: IP检测、系统信息、隐私提示
- **依赖**: IP API（外部服务）

#### 10. regex-tester.html (13KB)
- **技术**: 正则表达式引擎
- **特色**: 实时匹配、语法高亮、快速模式
- **依赖**: 无

#### 11. json-formatter.html (15KB)
- **技术**: JSON 解析和美化
- **特色**: 语法高亮、压缩/美化、验证
- **依赖**: 无

#### 12. code-editor.html (14KB)
- **技术**: 实时代码执行
- **特色**: HTML/CSS/JS 三面板、实时预览
- **依赖**: 无

#### 13. rpg-card.html (17KB)
- **技术**: 游戏化设计
- **特色**: 4项属性、技能树、成就系统
- **依赖**: 无

#### 14. treasure-hunt.html (17KB)
- **技术**: 游戏逻辑、本地存储
- **特色**: 10个宝藏、线索系统、进度保存
- **依赖**: LocalStorage

---

## 📂 docs/ 目录详解

### 文档分类

#### 📘 快速入门
- **開始使用.md** (3.4KB) - 最简单的上手指南，30秒快速体验
- **快速開始.md** (3.9KB) - 基础使用说明
- **快速開始指南.md** (7.1KB) - 详细教程，包含所有功能介绍

#### 📗 功能文档
- **功能實驗室文檔.md** (10KB) - 所有54个功能的完整列表
- **新增功能報告.md** (8.5KB) - 最新6个功能的详细说明
- **進階功能使用說明.md** (6KB) - 进阶功能使用技巧

#### 📕 技术报告
- **功能完成報告.md** (3.9KB) - 功能完成情况总结
- **功能完成總結報告.md** (13KB) - 完整的技术实现报告
- **新功能說明.md** (3.9KB) - 新功能技术说明

#### 📙 其他
- **README.md** (6.8KB) - 项目总览（旧版，已移到 docs）
- **README-OLD.md** (12KB) - 更早版本的备份
- **readme.txt** (9B) - 简单说明文本

### 推荐阅读顺序
1. 根目录 `README.md` - 了解项目全貌
2. `docs/開始使用.md` - 快速上手
3. `docs/功能實驗室文檔.md` - 探索所有功能
4. `docs/功能完成總結報告.md` - 深入技术细节

---

## 📂 images/ 目录

存放项目所需的图片资源：
- 个人头像
- 项目截图
- 图标素材
- 背景图片

**注意**: 图片应优化大小，建议使用 WebP 格式以提高性能。

---

## 📂 css/ 和 js/ 目录（预留）

这两个目录目前为空，预留用于未来的模块化重构：

### css/ 可能的用途
```
css/
├── base.css          # 基础样式
├── components.css    # 组件样式
├── layout.css        # 布局样式
└── animations.css    # 动画效果
```

### js/ 可能的用途
```
js/
├── utils.js          # 工具函数
├── api.js            # API 调用
├── animations.js     # 动画控制
└── components.js     # 组件逻辑
```

---

## 📊 文件大小统计

### 核心文件
| 文件 | 大小 | 说明 |
|-----|------|-----|
| index.html | 64KB | 主页面 |
| lab.html | 25KB | 功能实验室 |
| admin.html | 22KB | 管理后台 |
| styles.css | 55KB | 主样式 |
| script.js | 56KB | 主脚本 |
| lab.js | 13KB | 功能控制器 |
| **总计** | **235KB** | 核心代码 |

### 功能页面
| 功能类别 | 文件数 | 总大小 |
|---------|-------|--------|
| features/ | 14个 | ~270KB |
| docs/ | 12个 | ~75KB |
| **总计** | **26个** | **~345KB** |

### 项目总计
- **HTML 文件**: 17个
- **CSS 文件**: 1个（主样式）
- **JS 文件**: 2个（不含功能页面内嵌）
- **文档文件**: 12个
- **总代码量**: ~600KB（不含库和资源）

---

## 🔍 文件依赖关系

```
index.html
├── styles.css
├── script.js
└── 外部库
    ├── Font Awesome 6.4.0
    ├── Google Fonts
    ├── Three.js r128
    └── Chart.js

lab.html
├── lab.js
└── 外部库
    ├── Font Awesome
    ├── TensorFlow.js
    ├── HandPose Model
    └── Three.js

admin.html
└── 外部库
    ├── Font Awesome
    └── Chart.js

features/*.html
└── 各自独立，部分依赖外部库
    ├── Leaflet.js (visitor-map.html)
    └── TensorFlow.js (gesture-control.html)
```

---

## 📝 开发规范

### 文件命名
- HTML: 使用短横线分隔 `kebab-case.html`
- CSS: 使用短横线分隔 `style-name.css`
- JS: 使用驼峰命名 `scriptName.js`
- 图片: 使用短横线分隔 `image-name.png`

### 代码组织
- 每个功能页面独立完整，包含 HTML/CSS/JS
- 公共样式和脚本提取到核心文件
- 注释清晰，便于维护

### 版本控制
- 使用 Git 管理版本
- 重要更新创建标签（Tag）
- 定期备份文档

---

## 🔄 更新记录

### 2026-03-10
- ✅ 重新整理项目结构
- ✅ 将所有文档移至 `docs/` 目录
- ✅ 创建详细的项目结构说明
- ✅ 修复导航按钮跳转问题

### 2026-03-09
- ✅ 完成所有 14 个进阶功能
- ✅ 创建功能实验室系统
- ✅ 建立管理后台

---

## 💡 维护建议

### 添加新功能
1. 在 `features/` 创建新 HTML 文件
2. 在 `lab.js` 注册功能
3. 更新文档 `docs/功能實驗室文檔.md`

### 更新样式
1. 优先修改 CSS 变量（`:root`）
2. 保持响应式设计
3. 测试深色/浅色模式

### 优化性能
1. 压缩图片和资源
2. 使用 CDN 加载库
3. 启用浏览器缓存
4. 代码分割和懒加载

---

**文档版本**: v2.0  
**最后更新**: 2026-03-10  
**维护者**: 高孟麟
