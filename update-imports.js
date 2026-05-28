const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace absolute imports
  content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+["']@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route["'];?/g, 'import { authOptions } from "@/lib/auth";');
  
  // Replace relative imports
  content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+["'](\.\.\/)*auth\/\[\.\.\.nextauth\]\/route["'];?/g, 'import { authOptions } from "@/lib/auth";');

  // Replace any other variants
  content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+["'].*?\/api\/auth\/\[\.\.\.nextauth\]\/route["'];?/g, 'import { authOptions } from "@/lib/auth";');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
