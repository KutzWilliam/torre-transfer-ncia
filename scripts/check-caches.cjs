const fs = require('fs');
const path = require('path');
const os = require('os');

function getDirSize(dir, maxDepth = 2, currentDepth = 0) {
  let size = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      try {
        const fullPath = path.join(dir, entry.name);
        if (entry.isFile()) {
          size += fs.statSync(fullPath).size;
        } else if (entry.isDirectory() && currentDepth < maxDepth) {
          size += getDirSize(fullPath, maxDepth, currentDepth + 1);
        }
      } catch (e) {}
    }
  } catch (e) {}
  return size;
}

const tempDir = os.tmpdir();
const npmCache = path.join(os.homedir(), 'AppData', 'Local', 'npm-cache');
const yarnCache = path.join(os.homedir(), 'AppData', 'Local', 'Yarn', 'Cache');
const nextCache = path.join(__dirname, '..', '.next', 'cache');

console.log('Tamanhos estimados de caches e temporários:');
console.log('TEMP Windows:', (getDirSize(tempDir, 1) / (1024*1024)).toFixed(1), 'MB');
console.log('NPM Cache:', (getDirSize(npmCache, 2) / (1024*1024)).toFixed(1), 'MB');
console.log('.next/cache:', (getDirSize(nextCache, 3) / (1024*1024)).toFixed(1), 'MB');
