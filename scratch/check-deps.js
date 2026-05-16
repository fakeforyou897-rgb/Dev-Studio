
import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = new Set([
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {}),
  'node', 'path', 'fs', 'crypto', 'http', 'https', 'os', 'url', 'querystring', 'stream', 'buffer', 'util', 'events', 'zlib', 'child_process'
]);

// Special cases for sub-packages or aliases
const aliasMap = {
  '@tanstack/router-plugin/vite': '@tanstack/router-plugin',
  'eslint-plugin-prettier/recommended': 'eslint-plugin-prettier',
  'framer-motion': 'framer-motion', // checking if exists
};

const missing = new Set();
const files = [];

function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        getFiles(fullPath);
      }
    } else if (entry.name.match(/\.(ts|tsx|js|jsx)$/)) {
      files.push(fullPath);
    }
  }
}

getFiles('.');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let pkg = match[1];
    if (pkg.startsWith('.') || pkg.startsWith('@/')) continue;
    
    // Extract base package name
    let basePkg = pkg;
    if (pkg.startsWith('@')) {
      basePkg = pkg.split('/').slice(0, 2).join('/');
    } else {
      basePkg = pkg.split('/')[0];
    }

    if (aliasMap[basePkg]) basePkg = aliasMap[basePkg];
    if (aliasMap[pkg]) basePkg = aliasMap[pkg];

    if (!deps.has(basePkg)) {
      missing.add(basePkg);
    }
  }
});

console.log('Missing packages:', Array.from(missing));
