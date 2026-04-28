const fs = require("fs");
const path = require("path");

const projectsHtmlPath = path.join(process.cwd(), "pages/projects.html");
let originalContent = fs.readFileSync(projectsHtmlPath, "utf8");

const filterMatch = originalContent.match(/<div class="filter-section">([\s\S]*?)<\/div>\s*<!-- Projects Container -->/);
const gridMatch = originalContent.match(/<div class="projects-grid" id="projects-grid">([\s\S]*?)<\/div>\s*<!-- Empty State -->/);
const emptyStateMatch = originalContent.match(/<div class="empty-state" id="empty-state" style="display: none;">([\s\S]*?)<\/div>/);
const scriptMatch = originalContent.match(/<script>([\s\S]*?)<\/script>\s*<script defer src="\.\.\/assets\/js\/script\.js">/);

const filterHtml = filterMatch ? filterMatch[1] : "";
let gridHtml = gridMatch ? gridMatch[1] : "";

// Add glass-card hover-glow to existing project-cards, without duplicating it
gridHtml = gridHtml.replace(/class="project-card([^"]*)"/g, (match, p1) => {
    if(!p1.includes("glass-card")) {
        return `class="project-card glass-card hover-glow${p1}"`;
    }
    return match;
});

const emptyStateHtml = emptyStateMatch ? emptyStateMatch[1] : "";
const scriptJs = scriptMatch ? scriptMatch[1] : "";

const cssToKeep = `
    <style>
        /* Filter Section */
        .filter-section {
            margin-bottom: 3rem;
            position: relative;
            z-index: 10;
        }

        .filter-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
            flex-wrap: wrap;
            background: var(--bg-primary);
            padding: 1.5rem;
            border-radius: 20px;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }

        .filter-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 0.6rem 1.2rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 50px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            color: var(--text-primary);
        }

        .filter-btn:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }

        .filter-btn.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }

        .search-box {
            display: flex;
            align-items: center;
            background: var(--bg-secondary);
            border-radius: 50px;
            padding: 0.6rem 1.5rem;
            min-width: 250px;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }
        
        .search-box:focus-within {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-box input {
            border: none;
            background: none;
            outline: none;
            flex: 1;
            font-size: 1rem;
            color: var(--text-primary);
            margin-left: 0.8rem;
        }

        .search-box i {
            color: var(--text-secondary);
        }

        /* Projects Grid */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2.5rem;
        }

        /* Project Card */
        .project-card {
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .project-card:nth-child(1) { animation-delay: 0.1s; }
        .project-card:nth-child(2) { animation-delay: 0.2s; }
        .project-card:nth-child(3) { animation-delay: 0.3s; }
        .project-card:nth-child(4) { animation-delay: 0.4s; }
        .project-card:nth-child(5) { animation-delay: 0.5s; }
        .project-card:nth-child(6) { animation-delay: 0.6s; }
        .project-card:nth-child(7) { animation-delay: 0.7s; }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .project-card:hover {
            transform: translateY(-12px);
            box-shadow: var(--shadow-lg);
            border-color: rgba(99, 102, 241, 0.3);
        }

        /* Featured Project */
        .project-card-featured {
            border: 2px solid rgba(99, 102, 241, 0.5);
        }

        .project-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffd700 0%, #f59e0b 100%);
            color: #000;
            padding: 6px 14px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            font-weight: 700;
            z-index: 10;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }

        .project-image {
            position: relative;
            width: 100%;
            aspect-ratio: 16/10;
            overflow: hidden;
        }

        .project-image .image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: white;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-card:hover .image-placeholder {
            transform: scale(1.1);
        }

        .project-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(5px);
        }

        .project-card:hover .project-overlay {
            opacity: 1;
        }

        .project-link {
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            font-size: 1.2rem;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-link:hover {
            transform: scale(1.15);
            background: var(--primary-color);
            color: white;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
        }

        .project-info {
            padding: 1.8rem;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.8rem;
        }

        .project-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 0;
            color: var(--text-primary);
        }

        .status-badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .status-active { background: #10b981; color: white; }
        .status-completed { background: #3b82f6; color: white; }
        .status-development { background: #f59e0b; color: white; }

        .project-description {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
            font-size: 0.95rem;
            flex: 1;
        }

        .project-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.8rem;
            margin-bottom: 1.5rem;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 6px 10px;
            background: var(--bg-secondary);
            border-radius: 8px;
            font-size: 0.85rem;
            color: var(--text-primary);
        }

        .feature-item i { color: var(--primary-color); }

        .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
            margin-bottom: 1.5rem;
        }

        .tag {
            padding: 4px 12px;
            background: var(--bg-secondary);
            color: var(--text-secondary);
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            border: 1px solid var(--border-color);
        }

        .project-stats {
            display: flex;
            gap: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
            margin-top: auto;
        }

        .project-stats .stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .project-stats .stat i { color: var(--primary-color); }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
            background: var(--bg-primary);
            border-radius: 20px;
            border: 1px dashed var(--border-color);
        }

        .empty-state i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        @media (max-width: 768px) {
            .filter-container { flex-direction: column; align-items: stretch; }
            .search-box { min-width: auto; width: 100%; }
        }
    </style>
`;

const newContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>作品集 - 高孟麟 | 全端工程師</title>
    <meta name="description" content="展示高孟麟的專案作品、技術創新與實踐經驗。">
    <link rel="icon" type="image/svg+xml" href="../assets/images/icons/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/images/icons/favicon-32x32.png">
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet"></noscript>
    ${cssToKeep}
</head>
<body>
    <div id="preloader" class="preloader">
        <div class="preloader-content">
            <div class="loader"></div>
            <p class="loading-text">載入中...</p>
        </div>
    </div>

    <div id="scroll-progress" class="scroll-progress"></div>
    <div id="cursor-follower" class="cursor-follower"></div>
    <canvas id="particles-canvas"></canvas>
    <div id="three-container"></div>

    <button id="theme-toggle" class="theme-toggle"><i class="fas fa-moon"></i></button>
    <button id="language-toggle" class="language-toggle"><span class="lang-text">EN</span></button>
    <button id="back-to-top" class="back-to-top"><i class="fas fa-arrow-up"></i></button>
    <button id="chatbot-toggle" class="chatbot-toggle"><i class="fas fa-robot"></i></button>
    <button id="terminal-toggle" class="terminal-toggle"><i class="fas fa-terminal"></i></button>

    <nav class="navbar" id="navbar">
        <div class="container">
            <div class="nav-wrapper">
                <a href="../index.html" class="logo">
                    <span class="logo-text">My Portfolio</span>
                </a>
                <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <span></span><span></span><span></span>
                </button>
                <ul class="nav-menu" id="nav-menu">
                    <!-- Vue dynamically injects navigation here -->
                </ul>
            </div>
        </div>
    </nav>

    <section class="section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-zh="作品集" data-en="Projects">作品集</h2>
                <div class="section-divider"></div>
                <p class="section-description" data-zh="探索我的專案作品 · 技術創新 · 實踐經驗" data-en="Explore my projects, innovations, and experience">探索我的專案作品 · 技術創新 · 實踐經驗</p>
            </div>
            
            <div class="filter-section">
                ${filterHtml}
            </div>

            <div class="projects-grid" id="projects-grid">
                ${gridHtml}
            </div>

            <div class="empty-state" id="empty-state" style="display: none;">
                ${emptyStateHtml}
            </div>
        </div>
    </section>

    <!-- Chatbot and Terminal -->
    <div id="chatbot-panel" class="chatbot-panel">
        <div class="chatbot-header">
            <div class="chatbot-title"><i class="fas fa-robot"></i><span>AI 助手</span></div>
            <div class="chatbot-actions">
                <button class="chatbot-minimize"><i class="fas fa-minus"></i></button>
                <button class="chatbot-close"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="chatbot-body">
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="chat-message bot-message">
                    <div class="message-avatar"><i class="fas fa-robot"></i></div>
                    <div class="message-content"><p>您好！我是 AI 助手。</p></div>
                </div>
            </div>
        </div>
        <div class="chatbot-footer">
            <input type="text" id="chatbot-input" placeholder="輸入問題...">
            <button id="chatbot-send" class="btn-send"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>

    <div id="terminal-panel" class="terminal-panel">
        <div class="terminal-header">
            <div class="terminal-title"><i class="fas fa-terminal"></i><span>Terminal v1.0.0</span></div>
            <div class="terminal-actions">
                <button class="terminal-minimize"><i class="fas fa-minus"></i></button>
                <button class="terminal-close"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="terminal-body" id="terminal-body">
            <div class="terminal-output">
                <div class="terminal-line">Welcome to Portfolio Terminal v1.0.0</div>
                <div class="terminal-line">Type 'help' for available commands.</div>
            </div>
        </div>
        <div class="terminal-footer">
            <span class="terminal-prompt">visitor@portfolio:~$</span>
            <input type="text" id="terminal-input" class="terminal-input" autofocus>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2026 高孟麟. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script defer src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
    <script defer src="../assets/js/vue-subpages.js"></script>
    <script defer src="../assets/js/script.js"></script>
    <script>
        ${scriptJs}
    </script>
    <script defer src="../assets/js/subpage-ux.js"></script>
    <script defer src="../assets/js/security-hardening.js"></script>
</body>
</html>
`;

fs.writeFileSync(projectsHtmlPath, newContent, "utf8");
console.log("Successfully rewrote projects.html with consistent styling!");
