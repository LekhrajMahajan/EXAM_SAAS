const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');

const ignoreDirs = ['node_modules', 'dist', 'build', '.git', '.vscode', 'public'];

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                walkDir(fullPath, callback);
            }
        } else {
            callback(fullPath);
        }
    }
}

const suspiciousFiles = [];

const tempKeywords = ['check', 'debug', 'dummy', 'temp', 'test_query', 'fix-', 'scratch', 'diagnose', 'reevaluate'];
const tempExtensions = ['.log', '.diff', '.zip', '.csv', '.xlsx', '.txt'];
const specificFiles = ['safe_refactor_v2.cjs', 'fix_manager.js', 'backend_full_analysis_report.md', 'backend_full_analysis_report.html'];

walkDir(rootDir, (filePath) => {
    const fileName = path.basename(filePath).toLowerCase();
    const stats = fs.statSync(filePath);
    let reason = '';

    if (stats.size === 0) {
        reason = 'Empty/Blank File (0 bytes)';
    } else if (tempExtensions.some(ext => fileName.endsWith(ext))) {
        reason = 'Temporary Extension (' + path.extname(fileName) + ')';
    } else if (specificFiles.includes(fileName)) {
        reason = 'Known throwaway script/report';
    } else if (tempKeywords.some(kw => fileName.includes(kw))) {
        if (!fileName.includes('.test.') && !fileName.includes('.spec.')) {
            reason = 'Test/Check script';
        }
    }

    if (reason) {
        suspiciousFiles.push({ file: filePath, reason: reason });
    }
});

let markdown = `# Unused, Blank, or Temporary Files Report\n\n`;
markdown += `Based on a comprehensive scan of the frontend and backend folders, here is the list of files that appear to be completely empty, temporary logs, or one-off test/fix scripts that are no longer used.\n\n`;

const groups = {
    'Root Folder': suspiciousFiles.filter(f => path.dirname(f.file) === rootDir),
    'Backend': suspiciousFiles.filter(f => path.dirname(f.file).startsWith(path.join(rootDir, 'backend'))),
    'Frontend': suspiciousFiles.filter(f => path.dirname(f.file).startsWith(path.join(rootDir, 'frontend'))),
};

for (const [groupName, files] of Object.entries(groups)) {
    if (files.length === 0) continue;
    markdown += `### ${groupName}\n\n`;
    files.forEach(f => {
        // Create a relative path for display
        const relPath = path.relative(rootDir, f.file).replace(/\\/g, '/');
        markdown += `- \`[${f.reason}]\` [${relPath}](file:///${f.file.replace(/\\/g, '/')})\n`;
    });
    markdown += `\n`;
}

markdown += `\n**Note**: Please double-check the files before deleting them to ensure they aren't needed for active debugging.`;

const outPath = path.join(rootDir, 'backend/scripts/find_unused_files_report.md');
fs.writeFileSync(outPath, markdown);
console.log('Report generated at:', outPath);
