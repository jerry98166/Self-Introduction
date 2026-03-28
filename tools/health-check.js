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

    return {
        unmatchedIds,
        totalLabFeatureItems: htmlIds.size,
        totalRegistryFeatures: jsIds.size
    };
}

function main() {
    const htmlResult = checkHtmlRefs();
    const featureResult = checkFeatureRegistry();

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

    if (featureResult.unmatchedIds.length > 0) {
        for (const id of featureResult.unmatchedIds) {
            console.log(`  - ${id}`);
        }
    }

    const hasError = htmlResult.missing.length > 0 || featureResult.unmatchedIds.length > 0;
    if (hasError) {
        process.exitCode = 1;
        console.log('\nResult: FAILED');
        return;
    }

    console.log('\nResult: PASSED');
}

main();
