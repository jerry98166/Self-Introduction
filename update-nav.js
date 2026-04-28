const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove floating buttons from body
    const themeRegex = /<!-- 深色\/淺色模式切換按鈕 -->\s*<button id="theme-toggle" class="theme-toggle"([^>]*)>[\s\S]*?<\/button>\s*/g;
    const langRegex = /<!-- 語言切換按鈕 -->\s*<button id="language-toggle" class="language-toggle"([^>]*)>[\s\S]*?<\/button>\s*/g;
    
    // Also handle English variants if they exist
    const themeRegexEn = /<button id="theme-toggle" class="theme-toggle"([^>]*)>[\s\S]*?<\/button>\s*/g;
    const langRegexEn = /<button id="language-toggle" class="language-toggle"([^>]*)>[\s\S]*?<\/button>\s*/g;

    let themeBtnHTML = '<button id="theme-toggle" class="nav-theme-btn" aria-label="切換主題" title="切換深淺色"><i class="fas fa-moon"></i></button>';
    let langBtnHTML = '<button id="language-toggle" class="nav-lang-btn" aria-label="切換語言" title="切換語言"><span class="lang-text">EN</span></button>';

    if (content.includes('id="theme-toggle"')) {
        content = content.replace(themeRegex, '');
        // If still there, do a broader replace
        if (content.includes('id="theme-toggle"')) {
           content = content.replace(themeRegexEn, '');
        }
        changed = true;
    }
    if (content.includes('id="language-toggle"')) {
        content = content.replace(langRegex, '');
        // If still there, do a broader replace
        if (content.includes('id="language-toggle"')) {
           content = content.replace(langRegexEn, '');
        }
        changed = true;
    }

    // 2. Add nav-actions container to the end of nav-wrapper
    if (changed && content.includes('class="nav-wrapper"')) {
        const navWrapperCloseRegex = /<\/ul>\s*<\/div>\s*<\/div>\s*<\/nav>/;
        const newActions = `</ul>\n                <div class="nav-actions">\n                    ${themeBtnHTML}\n                    ${langBtnHTML}\n                </div>\n            </div>\n        </div>\n    </nav>`;
        content = content.replace(navWrapperCloseRegex, newActions);
        
        // Also fix the case for the dynamically loaded pages if they have standard layout
        if (!content.includes('class="nav-actions"')) {
            // fallback
             content = content.replace(/<\/ul>\s*<\/div>/, `</ul>\n                <div class="nav-actions">\n                    ${themeBtnHTML}\n                    ${langBtnHTML}\n                </div>\n            </div>`);
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                walk(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    });
}

walk(process.cwd());
