#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoredDirs = new Set(['.git', 'node_modules']);

function walk(dir, matcher, out = []) {
    for (const name of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, name);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!ignoredDirs.has(name)) walk(fullPath, matcher, out);
        } else if (matcher(fullPath)) {
            out.push(fullPath);
        }
    }
    return out;
}

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function checkHtmlRefs() {
    const htmlFiles = walk(root, (p) => p.endsWith('.html'));
    const missing = [];

    for (const htmlPath of htmlFiles) {
        const content = read(htmlPath);
        // Ignore Vue-style bindings such as :href="item.href".
        const regex = /(^|[^:@\w-])(href|src)="([^"]+)"/gm;
        let match;

        while ((match = regex.exec(content))) {
            const ref = match[3].trim();
            if (!ref) continue;
            if (
                ref.startsWith('http://') ||
                ref.startsWith('https://') ||
                ref.startsWith('//') ||
                ref.startsWith('#') ||
                ref.startsWith('mailto:') ||
                ref.startsWith('tel:') ||
                ref.startsWith('data:') ||
                ref.startsWith('javascript:')
            ) {
                continue;
            }

            const clean = ref.split('?')[0].split('#')[0];
            if (!clean) continue;

            const targetPath = clean.startsWith('/')
                ? path.join(root, clean.slice(1))
                : path.resolve(path.dirname(htmlPath), clean);

            if (!fs.existsSync(targetPath)) {
                missing.push({
                    file: path.relative(root, htmlPath),
                    ref,
                    missing: path.relative(root, targetPath)
                });
            }
        }
    }

    return { htmlFilesCount: htmlFiles.length, missing };
}

function checkFeatureRegistry() {
    const labHtmlPath = path.join(root, 'pages', 'lab.html');
    const labJsPath = path.join(root, 'assets', 'js', 'lab.js');

    if (!fs.existsSync(labHtmlPath) || !fs.existsSync(labJsPath)) {
        return {
            unmatchedIds: [],
            missingInLabIds: [],
            totalLabFeatureItems: 0,
            totalRegistryFeatures: 0
        };
    }

    const labHtml = read(labHtmlPath);
    const labJs = read(labJsPath);

    const htmlIds = new Set();
    const jsIds = new Set();

    const htmlRegex = /openFeature\('([a-z0-9-]+)'\)/g;
    let htmlMatch;
    while ((htmlMatch = htmlRegex.exec(labHtml))) {
        htmlIds.add(htmlMatch[1]);
    }

    const jsRegex = /'([a-z0-9-]+)'\s*:\s*\{/g;
    let jsMatch;
    while ((jsMatch = jsRegex.exec(labJs))) {
        jsIds.add(jsMatch[1]);
    }

    const unmatchedIds = [...htmlIds].filter((id) => !jsIds.has(id));
    const missingInLabIds = [...jsIds].filter((id) => !htmlIds.has(id));

    return {
        unmatchedIds,
        missingInLabIds,
        totalLabFeatureItems: htmlIds.size,
        totalRegistryFeatures: jsIds.size
    };
}

function checkFeaturePageTargets() {
    const labJsPath = path.join(root, 'assets', 'js', 'lab.js');
    if (!fs.existsSync(labJsPath)) {
        return { referenced: 0, missingPages: [] };
    }

    const labJs = read(labJsPath);
    const regex = /openFeaturePage\('([^']+\.html)'\)/g;
    const referenced = new Set();
    const missingPages = [];
    let m;

    while ((m = regex.exec(labJs))) {
        referenced.add(m[1]);
    }

    for (const page of referenced) {
        const targetPath = path.join(root, 'features', page);
        if (!fs.existsSync(targetPath)) {
            missingPages.push(page);
        }
    }

    return { referenced: referenced.size, missingPages };
}

function checkUnsafeHtmlInterpolation() {
    const codeFiles = walk(root, (p) => p.endsWith('.js') || p.endsWith('.html'));
    const findings = [];

    for (const filePath of codeFiles) {
        const rel = path.relative(root, filePath);
        if (rel.startsWith('tools/')) continue;

        const content = read(filePath);
        const lines = content.split(/\r?\n/);

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            if (/innerHTML\s*=\s*`[^`]*\$\{/.test(line)) {
                findings.push({ file: rel, line: lineNum, type: 'innerHTML interpolation' });
            }
            if (/outerHTML\s*=\s*`[^`]*\$\{/.test(line)) {
                findings.push({ file: rel, line: lineNum, type: 'outerHTML interpolation' });
            }
            if (/insertAdjacentHTML\s*\([^)]*`[^`]*\$\{/.test(line)) {
                findings.push({ file: rel, line: lineNum, type: 'insertAdjacentHTML interpolation' });
            }
        });
    }

    return findings;
}

function main() {
    const htmlResult = checkHtmlRefs();
    const featureResult = checkFeatureRegistry();
    const featurePageResult = checkFeaturePageTargets();
    const unsafeHtmlFindings = checkUnsafeHtmlInterpolation();

    console.log('=== Project Health Check ===');
    console.log(`HTML files scanned: ${htmlResult.htmlFilesCount}`);
    console.log(`Missing local refs: ${htmlResult.missing.length}`);

    if (htmlResult.missing.length > 0) {
        console.log('\nMissing refs detail:');
        for (const item of htmlResult.missing) {
            console.log(`- ${item.file} -> ${item.ref} (missing: ${item.missing})`);
        }
    }

    console.log('\nFeature lab consistency:');
    console.log(`- Feature items in pages/lab.html: ${featureResult.totalLabFeatureItems}`);
    console.log(`- Feature keys in assets/js/lab.js: ${featureResult.totalRegistryFeatures}`);
    console.log(`- Unmatched feature IDs: ${featureResult.unmatchedIds.length}`);
    console.log(`- Registry IDs missing in lab page: ${featureResult.missingInLabIds.length}`);
    console.log(`- Feature pages referenced in lab.js: ${featurePageResult.referenced}`);
    console.log(`- Missing referenced feature pages: ${featurePageResult.missingPages.length}`);
    console.log(`\nSecurity checks:`);
    console.log(`- Unsafe HTML interpolation findings: ${unsafeHtmlFindings.length}`);

    if (featureResult.unmatchedIds.length > 0) {
        for (const id of featureResult.unmatchedIds) {
            console.log(`  - ${id}`);
        }
    }

    if (featureResult.missingInLabIds.length > 0) {
        console.log('  Missing in pages/lab.html:');
        for (const id of featureResult.missingInLabIds) {
            console.log(`  - ${id}`);
        }
    }

    if (featurePageResult.missingPages.length > 0) {
        console.log('  Missing feature page files:');
        for (const page of featurePageResult.missingPages) {
            console.log(`  - features/${page}`);
        }
    }

    if (unsafeHtmlFindings.length > 0) {
        console.log('  Unsafe interpolation detail (top 20):');
        for (const item of unsafeHtmlFindings.slice(0, 20)) {
            console.log(`  - ${item.file}:${item.line} (${item.type})`);
        }
        if (unsafeHtmlFindings.length > 20) {
            console.log(`  ... and ${unsafeHtmlFindings.length - 20} more`);
        }
    }

    const hasError =
        htmlResult.missing.length > 0 ||
        featureResult.unmatchedIds.length > 0 ||
        featureResult.missingInLabIds.length > 0 ||
        featurePageResult.missingPages.length > 0 ||
        unsafeHtmlFindings.length > 0;
    if (hasError) {
        process.exitCode = 1;
        console.log('\nResult: FAILED');
        return;
    }

    console.log('\nResult: PASSED');
}

main();
