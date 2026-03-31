#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoredDirs = new Set(['.git', 'node_modules', 'docs/archive']);

function walk(dir, matcher, out = []) {
    for (const name of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, name);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const rel = path.relative(root, fullPath).replace(/\\/g, '/');
            if (!ignoredDirs.has(rel) && !ignoredDirs.has(name)) {
                walk(fullPath, matcher, out);
            }
            continue;
        }

        if (matcher(fullPath, stat)) {
            out.push({ filePath: fullPath, size: stat.size });
        }
    }
    return out;
}

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function countRegex(files, regex) {
    let total = 0;
    for (const file of files) {
        const content = read(file.filePath);
        const matches = content.match(regex);
        total += matches ? matches.length : 0;
    }
    return total;
}

function getLargest(files, take = 8) {
    return [...files]
        .sort((a, b) => b.size - a.size)
        .slice(0, take)
        .map((item) => ({
            file: path.relative(root, item.filePath).replace(/\\/g, '/'),
            size: item.size
        }));
}

function buildMarkdownReport(result) {
    const lines = [];
    lines.push('# SCALE READINESS REPORT');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');
    lines.push('## Summary');
    lines.push('');
    lines.push(`- Score: ${result.score}/100`);
    lines.push(`- Critical issues: ${result.critical.length}`);
    lines.push(`- Warnings: ${result.warnings.length}`);
    lines.push('');
    lines.push('## Project Metrics');
    lines.push('');
    lines.push(`- HTML files: ${result.metrics.htmlCount}`);
    lines.push(`- CSS files: ${result.metrics.cssCount}`);
    lines.push(`- JS files: ${result.metrics.jsCount}`);
    lines.push(`- Image files: ${result.metrics.imageCount}`);
    lines.push(`- docs files: ${result.metrics.docsCount}`);
    lines.push(`- Feature pages: ${result.metrics.featurePageCount}`);
    lines.push(`- Inline onclick handlers: ${result.metrics.inlineOnclickCount}`);
    lines.push(`- CSS !important count: ${result.metrics.importantCount}`);
    lines.push('');

    lines.push('## Largest Files');
    lines.push('');
    result.largestFiles.forEach((item) => {
        lines.push(`- ${item.file}: ${formatBytes(item.size)}`);
    });
    lines.push('');

    lines.push('## Critical Issues');
    lines.push('');
    if (result.critical.length === 0) {
        lines.push('- None');
    } else {
        result.critical.forEach((item) => lines.push(`- ${item}`));
    }
    lines.push('');

    lines.push('## Warnings');
    lines.push('');
    if (result.warnings.length === 0) {
        lines.push('- None');
    } else {
        result.warnings.forEach((item) => lines.push(`- ${item}`));
    }
    lines.push('');

    lines.push('## Recommended Next Actions');
    lines.push('');
    if (result.recommendations.length === 0) {
        lines.push('- Keep current architecture, continue monitoring per release.');
    } else {
        result.recommendations.forEach((item) => lines.push(`- ${item}`));
    }
    lines.push('');

    return `${lines.join('\n')}\n`;
}

function main() {
    const htmlFiles = walk(root, (p) => p.endsWith('.html'));
    const cssFiles = walk(root, (p) => p.endsWith('.css'));
    const jsFiles = walk(root, (p) => p.endsWith('.js'));
    const imageFiles = walk(root, (p) => /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(p));
    const docsFiles = walk(root, (p) => p.endsWith('.md'));

    const warnings = [];
    const critical = [];
    const recommendations = [];

    const inlineOnclickCount = countRegex(htmlFiles, /\sonclick\s*=\s*"/gi);
    const importantCount = countRegex(cssFiles, /!important/g);

    const stylesPath = path.join(root, 'assets', 'css', 'styles.css');
    const stylesSize = fs.existsSync(stylesPath) ? fs.statSync(stylesPath).size : 0;

    if (stylesSize > 1_200_000) {
        critical.push(`assets/css/styles.css is too large (${formatBytes(stylesSize)}).`);
    } else if (stylesSize > 800_000) {
        warnings.push(`assets/css/styles.css is large (${formatBytes(stylesSize)}).`);
        recommendations.push('Split styles.css into critical and deferred bundles.');
    }

    const hugeHtml = htmlFiles.filter((f) => f.size > 1_000_000);
    if (hugeHtml.length > 0) {
        critical.push(`Found ${hugeHtml.length} HTML file(s) over 1 MB.`);
    }

    if (inlineOnclickCount > 80) {
        warnings.push(`Inline onclick handlers are high (${inlineOnclickCount}).`);
        recommendations.push('Migrate inline handlers to addEventListener for maintainability and CSP tightening.');
    }

    if (importantCount > 450) {
        warnings.push(`!important usage is high (${importantCount}).`);
        recommendations.push('Refactor style specificity to reduce !important usage.');
    }

    const featurePageCount = htmlFiles.filter((f) => path.relative(root, f.filePath).startsWith('features/')).length;
    if (featurePageCount >= 60) {
        recommendations.push('Introduce feature manifest + auto-generated navigation to manage growth beyond 60 feature pages.');
    }

    const metrics = {
        htmlCount: htmlFiles.length,
        cssCount: cssFiles.length,
        jsCount: jsFiles.length,
        imageCount: imageFiles.length,
        docsCount: docsFiles.length,
        featurePageCount,
        inlineOnclickCount,
        importantCount
    };

    const score = Math.max(0, 100 - critical.length * 25 - warnings.length * 8);

    const result = {
        score,
        metrics,
        largestFiles: getLargest([...htmlFiles, ...cssFiles, ...jsFiles], 10),
        warnings,
        critical,
        recommendations
    };

    const reportPath = path.join(root, 'docs', 'reports', 'SCALE-READINESS-REPORT.md');
    fs.writeFileSync(reportPath, buildMarkdownReport(result));

    console.log('=== Scale Readiness Check ===');
    console.log(`Score: ${result.score}/100`);
    console.log(`Critical: ${result.critical.length}`);
    console.log(`Warnings: ${result.warnings.length}`);
    console.log(`Report: ${path.relative(root, reportPath).replace(/\\/g, '/')}`);

    if (result.critical.length > 0) {
        console.log('\nCritical issues:');
        result.critical.forEach((item) => console.log(`- ${item}`));
        process.exitCode = 1;
        console.log('\nResult: FAILED');
        return;
    }

    if (result.warnings.length > 0) {
        console.log('\nWarnings:');
        result.warnings.forEach((item) => console.log(`- ${item}`));
    }

    console.log('\nResult: PASSED');
}

main();
