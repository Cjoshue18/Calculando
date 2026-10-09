const fs = require('fs');
const path = require('path');

const forbiddenPatterns = [
  { name: 'personal surname (correa)', regex: /correa/i },
  { name: 'personal contact email', regex: /contacto@/i },
  { name: 'personal github profile', regex: /github\.com\/cjoshue/i },
  { name: 'personal phone/yape number', regex: /9\d{8}/ },
  { name: 'author real name attribution', regex: /(?:desarrollado por|creado por|hecho por)\s+joshue/i },
];
let leaks = 0;

function checkDir(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && !['node_modules', '.git', 'dist'].includes(f.name)) {
      checkDir(full);
    } else if (f.isFile() && /\.(tsx?|json|html|md|css|js)$/.test(f.name)) {
      const content = fs.readFileSync(full, 'utf8');
      forbiddenPatterns.forEach(({ name, regex }) => {
        if (regex.test(content)) {
          console.error(`LEAK FOUND (${name}) in: ${full}`);
          leaks++;
        }
      });
    }
  }
}

checkDir(path.resolve(__dirname, '../src'));
checkDir(path.resolve(__dirname, '../public'));
checkDir(path.resolve(__dirname, '../scripts'));

if (leaks === 0) {
  console.log('✓ Privacy check PASSED: 0 leaks found.');
} else {
  console.error(`✗ Privacy check FAILED: ${leaks} leaks detected.`);
  process.exit(1);
}
