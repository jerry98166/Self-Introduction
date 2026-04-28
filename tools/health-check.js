#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoredDirs = new Set(['.git', 'node_modules', 'temp', 'docs']);

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
    const manifestPath = path.join(root, 'assets', 'images', 'icons', 'feature-manifest.json');

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

    // Check if using dynamic navigation (feature-navigator.js)
    const useDynamicNav = labHtml.includes('feature-navigator.js') &&
        labHtml.includes('navigator-container');

    // If using dynamic navigation, validate manifest instead
    if (useDynamicNav && fs.existsSync(manifestPath)) {
        const manifestJson = JSON.parse(read(manifestPath));
        const totalFeatures = manifestJson.features ? manifestJson.features.length : 0;
        return {
            unmatchedIds: [],
            missingInLabIds: [],
            totalLabFeatureItems: totalFeatures,
            totalRegistryFeatures: totalFeatures,
            dynamicNavigation: true
        };
    }

    // Fallback to old hard-coded detection
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

function checkSecurityHardeningInclude() {
    const htmlFiles = walk(root, (p) => p.endsWith('.html'));
    const missing = [];

    for (const htmlPath of htmlFiles) {
        const content = read(htmlPath);
        if (!content.includes('security-hardening.js')) {
            missing.push(path.relative(root, htmlPath));
        }
    }

    return {
        scanned: htmlFiles.length,
        missing
    };
}

function checkDangerousProtocols() {
    const htmlFiles = walk(root, (p) => p.endsWith('.html'));
    const findings = [];

    for (const htmlPath of htmlFiles) {
        const rel = path.relative(root, htmlPath);
        const content = read(htmlPath);
        const lines = content.split(/\r?\n/);

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            if (/(href|src)\s*=\s*"\s*javascript:/i.test(line) || /(href|src)\s*=\s*'\s*javascript:/i.test(line)) {
                findings.push({ file: rel, line: lineNum, type: 'javascript protocol in href/src' });
            }
        });
    }

    return findings;
}

function checkCspStrength() {
    const indexPath = path.join(root, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return {
            exists: false,
            hasCsp: false,
            disallowedTokens: [],
            missingDirectives: []
        };
    }

    const content = read(indexPath);
    const metaMatch = content.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"\s*\/?>/i);
    if (!metaMatch) {
        return {
            exists: true,
            hasCsp: false,
            disallowedTokens: [],
            missingDirectives: ["meta Content-Security-Policy"]
        };
    }

    const csp = metaMatch[1];
    const required = [
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
    ];
    const disallowed = ["'unsafe-inline'", "'unsafe-eval'"];
    const scriptSrcDirective = (csp
        .split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith('script-src ')) || '');

    return {
        exists: true,
        hasCsp: true,
        disallowedTokens: disallowed.filter((token) => scriptSrcDirective.includes(token)),
        missingDirectives: required.filter((directive) => !csp.includes(directive))
    };
}

function checkDocsExecutablePatterns() {
    const docsRoot = path.join(root, 'docs');
    if (!fs.existsSync(docsRoot)) return [];

    const docsFiles = walk(docsRoot, (p) => p.endsWith('.md') || p.endsWith('.html'));
    const findings = [];

    for (const filePath of docsFiles) {
        const rel = path.relative(root, filePath);
        const lines = read(filePath).split(/\r?\n/);

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            if (/<script\b/i.test(line)) {
                findings.push({ file: rel, line: lineNum, type: 'script tag pattern in docs' });
            }
            if (/\son[a-z]+\s*=\s*['"]/i.test(line)) {
                findings.push({ file: rel, line: lineNum, type: 'inline event handler pattern in docs' });
            }
            if (/(href|src)\s*=\s*['"]\s*javascript:/i.test(line)) {
                findings.push({ file: rel, line: lineNum, type: 'javascript protocol pattern in docs' });
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
    const securityIncludeResult = checkSecurityHardeningInclude();
    const dangerousProtocolFindings = checkDangerousProtocols();
    const cspStrengthResult = checkCspStrength();
    const docsExecutableFindings = checkDocsExecutablePatterns();

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
    if (featureResult.dynamicNavigation) {
        console.log(`- Dynamic Navigation: ✓ ENABLED`);
        console.log(`- Total features in manifest: ${featureResult.totalLabFeatureItems}`);
    } else {
        console.log(`- Feature items in pages/lab.html: ${featureResult.totalLabFeatureItems}`);
        console.log(`- Feature keys in assets/js/lab.js: ${featureResult.totalRegistryFeatures}`);
        console.log(`- Unmatched feature IDs: ${featureResult.unmatchedIds.length}`);
        console.log(`- Registry IDs missing in lab page: ${featureResult.missingInLabIds.length}`);
    }
    console.log(`- Feature pages referenced in lab.js: ${featurePageResult.referenced}`);
    console.log(`- Missing referenced feature pages: ${featurePageResult.missingPages.length}`);
    console.log(`\nSecurity checks:`);
    console.log(`- Unsafe HTML interpolation findings: ${unsafeHtmlFindings.length}`);
    console.log(`- Pages missing security-hardening.js: ${securityIncludeResult.missing.length}`);
    console.log(`- Dangerous javascript: href/src findings: ${dangerousProtocolFindings.length}`);
    console.log(`- index.html CSP missing directives: ${cspStrengthResult.missingDirectives.length}`);
    console.log(`- index.html CSP disallowed tokens: ${cspStrengthResult.disallowedTokens.length}`);
    console.log(`- Docs executable-pattern findings: ${docsExecutableFindings.length}`);

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

    if (securityIncludeResult.missing.length > 0) {
        console.log('  Missing security hardening script in:');
        for (const file of securityIncludeResult.missing.slice(0, 30)) {
            console.log(`  - ${file}`);
        }
        if (securityIncludeResult.missing.length > 30) {
            console.log(`  ... and ${securityIncludeResult.missing.length - 30} more`);
        }
    }

    if (dangerousProtocolFindings.length > 0) {
        console.log('  Dangerous protocol detail (top 20):');
        for (const item of dangerousProtocolFindings.slice(0, 20)) {
            console.log(`  - ${item.file}:${item.line} (${item.type})`);
        }
        if (dangerousProtocolFindings.length > 20) {
            console.log(`  ... and ${dangerousProtocolFindings.length - 20} more`);
        }
    }

    if (cspStrengthResult.missingDirectives.length > 0) {
        console.log('  CSP missing directives:');
        for (const directive of cspStrengthResult.missingDirectives) {
            console.log(`  - ${directive}`);
        }
    }

    if (cspStrengthResult.disallowedTokens.length > 0) {
        console.log('  CSP disallowed tokens present:');
        for (const token of cspStrengthResult.disallowedTokens) {
            console.log(`  - ${token}`);
        }
    }

    if (docsExecutableFindings.length > 0) {
        console.log('  Docs executable patterns detail (top 20):');
        for (const item of docsExecutableFindings.slice(0, 20)) {
            console.log(`  - ${item.file}:${item.line} (${item.type})`);
        }
        if (docsExecutableFindings.length > 20) {
            console.log(`  ... and ${docsExecutableFindings.length - 20} more`);
        }
    }

    const hasError =
        htmlResult.missing.length > 0 ||
        featureResult.unmatchedIds.length > 0 ||
        (!featureResult.dynamicNavigation && featureResult.missingInLabIds.length > 0) ||
        featurePageResult.missingPages.length > 0 ||
        unsafeHtmlFindings.length > 0 ||
        securityIncludeResult.missing.length > 0 ||
        dangerousProtocolFindings.length > 0 ||
        cspStrengthResult.missingDirectives.length > 0 ||
        cspStrengthResult.disallowedTokens.length > 0 ||
        false;
    if (hasError) {
        process.exitCode = 1;
        console.log('\nResult: FAILED');
        return;
    }

    console.log('\nResult: PASSED');
}

main();

htmlResult.missing.length > 0 ||
    featureResult.unmatchedIds.length > 0 ||
    (!featureResult.dynamicNavigation && featureResult.missingInLabIds.length > 0) ||
    featurePageResult.missingPages.length > 0 ||
    unsafeHtmlFindings.length > 0 ||
    securityIncludeResult.missing.length > 0 ||
    dangerousProtocolFindings.length > 0 ||
    cspStrengthResult.missingDirectives.length > 0 ||
    cspStrengthResult.disallowedTokens.length > 0 ||
    false;
if (hasError) {
    process.exitCode = 1;
    console.log('\nResult: FAILED');
    return;
}

console.log('\nResult: PASSED');


main();
