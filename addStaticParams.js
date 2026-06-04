const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx' || file === 'layout.tsx') {
      // Check if the path contains a dynamic segment e.g. [something]
      if (fullPath.match(/\[.*?\]/)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (!content.includes('generateStaticParams')) {
          content += '\nexport function generateStaticParams() { return []; }\n';
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Updated:', fullPath);
        }
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app'));
console.log('Done.');
