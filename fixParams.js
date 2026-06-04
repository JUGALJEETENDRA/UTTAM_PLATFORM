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
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("export default function Page() {") && content.includes("<ClientPage />")) {
        const newContent = content.replace(
          "export default function Page() {\n  return <ClientPage />;\n}",
          "export default function Page({ params }: { params: any }) {\n  return <ClientPage params={params} />;\n}"
        );
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Fixed params passing in:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app'));
console.log('Done.');
