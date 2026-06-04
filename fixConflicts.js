const fs = require('fs');
const path = require('path');

function resolveMergeConflicts(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const conflictRegex = /<<<<<<< Updated upstream\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> Stashed changes\r?\n?/g;
  
  let newContent = content.replace(conflictRegex, '$1');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Resolved merge conflicts in:', filePath);
  } else {
    console.log('No conflicts found in:', filePath);
  }
}

resolveMergeConflicts(path.join(__dirname, 'src/app/faculty/dashboard/page.tsx'));
resolveMergeConflicts(path.join(__dirname, 'src/app/page.tsx'));
resolveMergeConflicts(path.join(__dirname, 'src/lib/auth.ts'));
