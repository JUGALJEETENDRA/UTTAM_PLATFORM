const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx') {
      if (fullPath.match(/\[.*?\]/)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('"use client"') || content.includes("'use client'")) {
            const clientPath = path.join(dir, 'ClientPage.tsx');
            // Check if already split
            if (!fs.existsSync(clientPath)) {
              fs.renameSync(fullPath, clientPath);
              
              const paramsMatches = fullPath.match(/\[(.*?)\]/g);
              let paramsObj = {};
              if (paramsMatches) {
                  paramsMatches.forEach(p => {
                      let key = p.replace('[', '').replace(']', '');
                      paramsObj[key] = 'default';
                  });
              }
              
              const serverContent = `
import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [${JSON.stringify(paramsObj)}];
}

export default function Page() {
  return <ClientPage />;
}
              `.trim();
              
              fs.writeFileSync(fullPath, serverContent, 'utf8');
              console.log('Split:', fullPath);
            }
        }
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app'));
console.log('Done.');
