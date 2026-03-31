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

function checkSecurityScriptInjection(htmlFiles) {
    const missing = [];
    const duplicated = [];

    for (const htmlPath of htmlFiles) {
        const content = read(htmlPath);
        const rel = path.relative(root, htmlPath);
        const matches = content.match(/security-hardening\.js/g) || [];

        if (matches.length === 0) {
            missing.push(rel);
        } else if (matches.length > 1) {
            duplicated.push({ file: rel, count: matches.length });
        }
    }

    return { missing, duplicated };
}

function checkDangerousProtocols(htmlFiles) {
    const findings = [];

    for (const htmlPath of htmlFiles) {
        const rel = path.relative(root, htmlPath);
        const lines = read(htmlPath).split(/\r?\n/);

        lines.forEach((line, idx) => {
            if (/(href|src)\s*=\s*"\s*javascript:/i.test(line) || /(href|src)\s*=\s*'\s*javascript:/i.test(line)) {
                findings.push({ file: rel, line: idx + 1 });
            }
        });
    }

    return findings;
}

function checkIndexCsp() {
    const indexPath = path.join(root, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return { exists: false, missingDirectives: [] };
    }

    const content = read(indexPath);
    const metaMatch = content.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"\s*\/?>/i);
    if (!metaMatch) {
        return {
            exists: true,
            hasCsp: false,
            missingDirectives: ['meta Content-Security-Policy']
        };
    }

    const csp = metaMatch[1];
    const required = [
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
    ];

    const missingDirectives = required.filter((directive) => !csp.includes(directive));

    return {
        exists: true,
        hasCsp: true,
        missingDirectives
    };
}

function main() {
    const htmlFiles = walk(root, (p) => p.endsWith('.html'));

    const scriptCheck = checkSecurityScriptInjection(htmlFiles);
    const protocolCheck = checkDangerousProtocols(htmlFiles);
    const cspCheck = checkIndexCsp();

    console.log('=== Security Smoke Test ===');
    console.log(`HTML files scanned: ${htmlFiles.length}`);
    console.log(`Pages missing security-hardening.js: ${scriptCheck.missing.length}`);
    console.log(`Pages with duplicate security-hardening.js: ${scriptCheck.duplicated.length}`);
    console.log(`Dangerous javascript: href/src findings: ${protocolCheck.length}`);

    if (!cspCheck.exists) {
        console.log('index.html not found.');
    } else if (!cspCheck.hasCsp) {
        console.log('index.html CSP meta: MISSING');
    } else {
        console.log(`index.html CSP required directives missing: ${cspCheck.missingDirectives.length}`);
    }

    if (scriptCheck.missing.length > 0) {
        console.log('\nMissing security-hardening.js (top 20):');
        scriptCheck.missing.slice(0, 20).forEach((file) => console.log(`- ${file}`));
    }

    if (scriptCheck.duplicated.length > 0) {
        console.log('\nDuplicate security-hardening.js (top 20):');
        scriptCheck.duplicated.slice(0, 20).forEach((item) => {
            console.log(`- ${item.file} (${item.count} references)`);
        });
    }

    if (protocolCheck.length > 0) {
        console.log('\nDangerous javascript: protocol findings (top 20):');
        protocolCheck.slice(0, 20).forEach((item) => {
            console.log(`- ${item.file}:${item.line}`);
        });
    }

    if (cspCheck.exists && cspCheck.hasCsp && cspCheck.missingDirectives.length > 0) {
        console.log('\nMissing required CSP directives in index.html:');
        cspCheck.missingDirectives.forEach((item) => console.log(`- ${item}`));
    }

    const hasError =
        scriptCheck.missing.length > 0 ||
        scriptCheck.duplicated.length > 0 ||
        protocolCheck.length > 0 ||
        !cspCheck.exists ||
        !cspCheck.hasCsp ||
        cspCheck.missingDirectives.length > 0;

    if (hasError) {
        console.log('\nResult: FAILED');
        process.exitCode = 1;
        return;
    }

    console.log('\nResult: PASSED');
}

main();
