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
      
      const count = (content.match(/useSearchParams/g) || []).length;
      if (count > 0) {
         // If there are multiple import statements for useSearchParams...
         // Let's just remove the first standalone import if there is another one.
         const lines = content.split('\n');
         let importLines = [];
         let changed = false;
         
         for (let i = 0; i < lines.length; i++) {
           if (lines[i].includes('import') && lines[i].includes('useSearchParams')) {
             importLines.push(i);
           }
         }

         if (importLines.length > 1) {
            // Keep the last one, delete the previous ones
            for (let i = 0; i < importLines.length - 1; i++) {
               const lineIdx = importLines[i];
               // If the line is purely `import { useSearchParams } from "next/navigation";`, delete it
               if (lines[lineIdx].trim() === 'import { useSearchParams } from "next/navigation";') {
                  lines[lineIdx] = '';
                  changed = true;
               } else {
                  // If it's mixed, just remove useSearchParams from it
                  lines[lineIdx] = lines[lineIdx].replace('useSearchParams,', '').replace(', useSearchParams', '');
                  if (lines[lineIdx].includes('{  }')) {
                     lines[lineIdx] = '';
                  }
                  changed = true;
               }
            }
         }

         if (changed) {
            fs.writeFileSync(fullPath, lines.filter(l => l !== '').join('\n'), 'utf8');
            console.log('Fixed duplicate import in:', fullPath);
         }
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app'));
console.log('Done.');
