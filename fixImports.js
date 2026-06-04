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

      // 1. Fix "use client" order
      if (content.startsWith('import ') && content.includes('"use client";')) {
        content = content.replace(/^([\s\S]*?)"use client";\r?\n/, '"use client";\n$1');
        changed = true;
      }

      // 2. Fix broken import path
      if (content.includes('@/app/student/subjects/[subjectId]/simulations/[id]/SimulationContainer')) {
        content = content.replace(
          '@/app/student/subjects/[subjectId]/simulations/[id]/SimulationContainer',
          '@/app/student/subjects/subject/simulations/item/SimulationContainer'
        );
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app'));
console.log('Done.');
