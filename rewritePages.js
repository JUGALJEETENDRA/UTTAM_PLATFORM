const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDir(fullPath);
    } else if (file.name === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');

      if (content.includes('ClientPage')) {
        let newContent = `import { Suspense } from "react";\nimport ClientPage from './ClientPage';\n\nexport default function Page(props: any) {\n  return (\n    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>\n      <ClientPage {...props} />\n    </Suspense>\n  );\n}`;
        
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Rewrote page.tsx in:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app/faculty/subjects/subject'));
processDir(path.join(__dirname, 'src/app/student/subjects/subject'));
console.log('Finished rewriting page.tsx files.');
