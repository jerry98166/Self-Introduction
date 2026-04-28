const fs = require("fs");
const path = require("path");
const cssPath = path.join(process.cwd(), "assets/css/styles.css");
let content = fs.readFileSync(cssPath, "utf8");

content = content.replace(/\.nav-wrapper \{[\s\S]*?padding: 1rem 0;\n\}/, 
`.nav-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    padding: 1rem 0;
    gap: 1rem;
}`);

content = content.replace(/\.nav-menu \{[\s\S]*?justify-content: center;\n\}/,
`.nav-menu {
    display: flex;
    gap: 1.2rem;
    align-items: center;
    margin: 0;
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    max-width: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 2px;
}
.nav-menu::-webkit-scrollbar {
    display: none;
}`);

content = content.replace(/\.logo \{/, `.logo {\n    flex-shrink: 0;`);
content = content.replace(/\.nav-actions \{/, `.nav-actions {\n    flex-shrink: 0;`);

fs.writeFileSync(cssPath, content, "utf8");
console.log("Updated CSS for horizontal scrolling");
