#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

try {
    execSync('git rev-parse --is-inside-work-tree', {
        cwd: root,
        stdio: 'ignore'
    });
} catch {
    console.error('Not inside a git repository; skip hook setup.');
    process.exit(0);
}

try {
    execSync('git config core.hooksPath .githooks', {
        cwd: root,
        stdio: 'inherit'
    });
    console.log('Git hooks path configured to .githooks');
    console.log('Make sure hook files are executable.');
} catch (error) {
    console.error('Failed to configure git hooks path.');
    process.exit(error.status || 1);
}
