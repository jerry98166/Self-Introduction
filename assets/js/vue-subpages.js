const { createApp } = Vue;

(function mountSubpageNav() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || '';

    const navLinks = [
        { href: '../index.html', zh: '首頁', en: 'Home' },
        { href: 'about.html', zh: '關於我', en: 'About' },
        { href: 'skills.html', zh: '技能', en: 'Skills' },
        { href: 'experience.html', zh: '經歷', en: 'Experience' },
        { href: 'projects.html', zh: '作品集', en: 'Projects' },
        { href: 'education.html', zh: '學歷', en: 'Education' },
        { href: 'mini-games.html', zh: '小遊戲', en: 'Mini Games' },
        { href: 'joke-generator.html', zh: '😄 笑話生成器', en: 'Joke Generator' },
        { href: 'lab.html', zh: '🧪 功能實驗室', en: '🧪 Feature Lab', extraClass: 'nav-lab' },
        { href: 'admin.html', zh: '⚙️ 管理後台', en: '⚙️ Admin Panel', extraClass: 'nav-admin' },
        { href: '../index.html#contact', zh: '聯絡我', en: 'Contact' }
    ].map((item) => {
        const hrefFile = item.href.split('#')[0].split('/').pop();
        const isActive = hrefFile && hrefFile === currentFile;
        return { ...item, active: isActive };
    });

    createApp({
        data() {
            return { navLinks };
        },
        template: `
            <ul class="nav-menu" id="nav-menu">
                <li v-for="item in navLinks" :key="item.href">
                    <a
                        :href="item.href"
                        :class="['nav-link', item.extraClass || '', item.active ? 'active' : '']"
                        :data-zh="item.zh"
                        :data-en="item.en"
                    >{{ item.zh }}</a>
                </li>
            </ul>
        `
    }).mount('#nav-menu');
})();
