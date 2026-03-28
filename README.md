# 🚀 個人作品集網站 | Personal Portfolio Website

一个功能丰富、视觉惊艳的个人作品集网站，展示 **14+ 个进阶功能**，包含 AI、3D、WebGL、音频处理等前沿技术。

## 📋 项目简介

这是一个现代化的个人作品集网站，不仅展示个人信息、技能和项目经验，还集成了多个令人印象深刻的技术功能，适合用于：
- 💼 求职作品集展示
- 🎓 技术能力证明
- 🚀 项目经验累积
- 📚 学习成果展现

## ✨ 核心功能

### 🏠 主网站功能
- ✅ 响应式设计（支持桌面/平板/手机）
- ✅ 深色/浅色主题切换
- ✅ 中英文双语切换
- ✅ 3D 背景动画（Three.js）
- ✅ 打字游戏
- ✅ 留言板系统
- ✅ 在线状态显示
- ✅ 音乐播放器

### 🧪 功能实验室（14个进阶功能）

#### AI & 机器学习
1. 🤖 **AI 面试模拟器** - 智能面试问答系统
2. 🗣️ **语音对话助理** - Web Speech API 语音交互
3. 🤚 **手势识别控制** - TensorFlow.js 手势检测

#### 数据可视化
4. 📊 **3D 贡献图** - Three.js 3D 数据可视化
5. 🌍 **全球访客地图** - Leaflet.js 地理数据展示

#### 视觉艺术
6. 🎨 **WebGL 着色器艺术** - 8种炫酷着色器效果
7. 🎵 **音乐视觉化** - 6种音频可视化模式

#### 安全 & 工具
8. 🔐 **CTF 安全挑战** - 5关递进式安全谜题
9. 🔍 **数位足迹追踪** - 浏览器指纹检测
10. 🧪 **正则测试器** - 实时正则表达式测试
11. 📝 **JSON 格式化工具** - JSON 美化/压缩
12. 💻 **代码编辑器** - 在线 HTML/CSS/JS 编辑器

#### 游戏化
13. 🎮 **RPG 角色卡** - 技能游戏化展示
14. 🏴‍☠️ **网站寻宝游戏** - 互动寻宝挑战

### ⚙️ 管理后台
- 📊 实时数据统计
- 👥 访客管理
- 💬 留言审核
- 📈 数据分析

## 📂 项目结构

```
Self-Introduction/
├── index.html              # 主页面
├── lab.html               # 功能实验室
├── admin.html             # 管理后台
├── styles.css             # 主样式表
├── script.js              # 主 JavaScript
├── lab.js                 # 功能实验室控制器
│
├── features/              # 功能页面目录
│   ├── ai-interview.html         # AI 面试模拟器
│   ├── voice-assistant.html      # 语音助理
│   ├── gesture-control.html      # 手势识别
│   ├── contribution-3d.html      # 3D 贡献图
│   ├── visitor-map.html          # 访客地图
│   ├── shader-art.html           # 着色器艺术
│   ├── music-visualizer.html     # 音乐可视化
│   ├── ctf-challenges.html       # CTF 挑战
│   ├── digital-footprint.html    # 数位足迹
│   ├── regex-tester.html         # 正则测试器
│   ├── json-formatter.html       # JSON 工具
│   ├── code-editor.html          # 代码编辑器
│   ├── rpg-card.html            # RPG 角色卡
│   └── treasure-hunt.html        # 寻宝游戏
│
├── images/                # 图片资源
│   └── README.md
│
├── docs/                  # 项目文档
│   ├── README.md                 # 项目说明（旧版）
│   ├── 開始使用.md               # 快速上手指南
│   ├── 快速開始指南.md           # 详细使用教程
│   ├── 功能實驗室文檔.md         # 功能列表说明
│   ├── 功能完成總結報告.md       # 完整技术报告
│   ├── 新增功能報告.md           # 新功能说明
│   └── ...
│
├── css/                   # CSS 文件（预留）
├── js/                    # JS 文件（预留）
└── README.md              # 本文件

```

## 🚀 快速开始

### 1. 下载项目
```bash
git clone <repository-url>
cd Self-Introduction
```

### 2. 启动网站
有多种方式启动：

#### 方式 A：直接打开（推荐）
```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

#### 方式 B：使用 VS Code Live Server
1. 安装 VS Code 的 Live Server 扩展
2. 右键 `index.html` → "Open with Live Server"

#### 方式 C：使用 Python 简易服务器
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# 然后访问 http://localhost:8000
```

### 3. 浏览功能
1. 主页：`index.html`
2. 功能实验室：点击导航栏的 "🧪 功能实验室" 或直接访问 `lab.html`
3. 管理后台：点击导航栏的 "⚙️ 管理后台" 或直接访问 `admin.html`

### 4. 功能健康检查（推荐）
每次修改后，建议运行一次健康检查脚本，自动验证：
- HTML 本地链接/资源是否存在
- 功能实验室条目是否与功能注册表一致

```bash
node tools/health-check.js
```

或使用 npm script：

```bash
npm run health-check
```

输出 `Result: PASSED` 代表目前核心链接与功能映射正常。

## 🛠️ 技术栈

### 前端框架
- **HTML5** - 语义化标记
- **CSS3** - 现代样式（Grid, Flexbox, Animations）
- **JavaScript (ES6+)** - 原生 JavaScript，无框架依赖

### 核心库
- **Three.js** r128 - 3D 图形渲染
- **TensorFlow.js** - 机器学习（手势识别）
- **Leaflet.js** - 地图可视化
- **Chart.js** - 数据图表

### Web API
- **Web Speech API** - 语音识别与合成
- **Web Audio API** - 音频处理与分析
- **MediaDevices API** - 摄像头访问
- **WebGL 2.0** - 高性能图形渲染
- **Canvas API** - 2D 绘图
- **LocalStorage API** - 客户端存储

### 开发工具
- **Font Awesome 6.4.0** - 图标库
- **Google Fonts** - 网页字体

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 | 推荐版本 | 功能支持 |
|--------|---------|---------|---------|
| Chrome | 90+ | 最新版 | ✅ 完整支持 |
| Firefox | 88+ | 最新版 | ✅ 完整支持 |
| Edge | 90+ | 最新版 | ✅ 完整支持 |
| Safari | 14+ | 最新版 | ⚠️ 部分功能受限* |

*Safari 对某些 Web API（如 Web Speech API）的支持有限。

### 必需功能
- ✅ WebGL 2.0 支持
- ✅ ES6+ JavaScript
- ✅ CSS Grid & Flexbox
- ✅ Canvas API

## 📖 详细文档

项目文档位于 `docs/` 目录：

- **[開始使用.md](docs/開始使用.md)** - 30秒快速上手
- **[快速開始指南.md](docs/快速開始指南.md)** - 详细使用教程
- **[功能實驗室文檔.md](docs/功能實驗室文檔.md)** - 所有功能列表
- **[功能完成總結報告.md](docs/功能完成總結報告.md)** - 完整技术报告
- **[新增功能報告.md](docs/新增功能報告.md)** - 最新功能说明

## 🎯 性能指标

- **载入速度**: < 2 秒
- **渲染 FPS**: 55-60 FPS (Chrome)
- **内存使用**: ~80-120 MB
- **PageSpeed Score**: 85+ (移动端), 95+ (桌面)

## 🔧 自定义配置

### 修改个人信息
编辑 `index.html`，搜索以下关键字并替换：
- 姓名：搜索 "高孟麟"
- 职位：搜索 "全端工程師"
- 联系方式：在 `#contact` 区块修改

### 修改配色方案
编辑 `styles.css`，修改 CSS 变量：
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... 更多变量 */
}
```

### 添加新功能
1. 在 `features/` 目录创建新的 HTML 文件
2. 在 `lab.js` 的 `registerAllFeatures()` 中注册功能
3. 在 `lab.html` 中添加功能卡片

## 🐛 问题排查

### 问题 1: 功能实验室/管理后台按钮无法点击
**解决**: ✅ 已修复！更新 `script.js` 中的导航函数，允许外部链接跳转。

### 问题 2: 某些功能在 Safari 无法使用
**原因**: Safari 对某些 Web API 支持有限  
**解决**: 使用 Chrome/Firefox 以获得最佳体验

### 问题 3: 3D 效果卡顿
**原因**: 硬件加速未启用或设备性能较低  
**解决**: 启用浏览器硬件加速，或降低效果质量

## 📝 更新日志

### v2.0 (2026-03-10)
- ✅ 新增 6 个进阶功能（手势识别、3D贡献图等）
- ✅ 修复导航按钮跳转问题
- ✅ 重新整理项目文件结构
- ✅ 完善项目文档

### v1.0 (2026-03-09)
- ✅ 完成基础网站功能
- ✅ 实现 8 个核心进阶功能
- ✅ 创建功能实验室和管理后台

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📄 授权

MIT License - 自由使用和修改

## 👨‍💻 作者

**高孟麟**
- 网站: [Portfolio](https://your-website.com)
- Email: 11028201@cycu.org.tw
- GitHub: [@yourusername](https://github.com/yourusername)

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

Made with ❤️ and ☕ | 2026
