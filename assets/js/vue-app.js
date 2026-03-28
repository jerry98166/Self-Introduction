const { createApp } = Vue;

createApp({
    data() {
        return {
            currentYear: new Date().getFullYear(),
            navLinks: [
                { href: '#home', zh: '首頁', en: 'Home', active: true },
                { href: 'pages/about.html', zh: '關於我', en: 'About' },
                { href: 'pages/skills.html', zh: '技能', en: 'Skills' },
                { href: 'pages/experience.html', zh: '經歷', en: 'Experience' },
                { href: 'pages/projects.html', zh: '作品集', en: 'Projects' },
                { href: 'pages/education.html', zh: '學歷', en: 'Education' },
                { href: 'pages/typing-game.html', zh: '小遊戲', en: 'Typing Game' },
                { href: 'pages/achievements.html', zh: '成就徽章', en: 'Achievements' },
                { href: 'pages/lab.html', zh: '🧪 功能實驗室', en: '🧪 Feature Lab', extraClass: 'nav-lab' },
                { href: 'pages/admin.html', zh: '⚙️ 管理後台', en: '⚙️ Admin Panel', extraClass: 'nav-admin' },
                { href: '#contact', zh: '聯絡我', en: 'Contact' }
            ],
            heroSocialLinks: [
                { href: 'https://github.com/jerry98166', icon: 'fab fa-github', label: 'GitHub', external: true },
                { href: 'https://www.linkedin.com/in/%E5%AD%9F%E9%BA%9F-%E9%AB%98-b88773191/', icon: 'fab fa-linkedin', label: 'LinkedIn', external: true },
                { href: 'https://x.com/Jerry59877', icon: 'fab fa-twitter', label: 'Twitter/X', external: true },
                { href: 'https://www.youtube.com/@%E9%AB%98%E5%AD%9F%E9%BA%9F-u1b', icon: 'fab fa-youtube', label: 'YouTube', external: true },
                { href: 'https://www.instagram.com/jerry98166/', icon: 'fab fa-instagram', label: 'Instagram', external: true },
                { href: 'https://www.facebook.com/allen.jerry.357827', icon: 'fab fa-facebook', label: 'Facebook', external: true },
                { href: 'mailto:11028201@cycu.org.tw', icon: 'fas fa-envelope', label: 'Email', external: false }
            ],
            footerQuickLinks: [
                { href: '#home', text: '首頁' },
                { href: 'pages/about.html', text: '關於我' },
                { href: 'pages/skills.html', text: '技能' },
                { href: 'pages/projects.html', text: '作品集' }
            ]
        };
    }
}).mount('#app');
