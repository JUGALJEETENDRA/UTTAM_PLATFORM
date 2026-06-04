const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDir(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      if (content.includes('useParams()')) {
        // Replace `const params = useParams();` -> `const searchParams = useSearchParams();`
        content = content.replace(/const\s+params\s*=\s*useParams\(\);/g, 'const searchParams = useSearchParams();');
        // Replace `params.subjectId` -> `searchParams.get('subjectId')`
        content = content.replace(/params\.([a-zA-Z0-9_]+)\s*as\s*string/g, 'searchParams.get(\'$1\') || \'\'');
        content = content.replace(/params\.([a-zA-Z0-9_]+)/g, 'searchParams.get(\'$1\')');
        // Replace import
        content = content.replace(/useParams/g, 'useSearchParams');
        
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed useParams in:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app'));
console.log('Done.');
