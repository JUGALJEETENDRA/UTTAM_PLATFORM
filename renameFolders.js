const fs = require('fs');
const path = require('path');

// 1. Rename Folders
function renameFoldersRecursively(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      renameFoldersRecursively(fullPath); // rename children first
      
      let newName = entry.name;
      if (entry.name === '[subjectId]') newName = 'subject';
      else if (entry.name === '[id]') newName = 'item';
      else if (entry.name === '[attemptId]') newName = 'attempt';
      else if (entry.name === '[subtopicId]') newName = 'subtopic';
      
      if (newName !== entry.name) {
        const newPath = path.join(dir, newName);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed ${fullPath} to ${newPath}`);
      }
    }
  }
}

const appDir = path.join(__dirname, 'src/app');
renameFoldersRecursively(appDir);
console.log('Finished renaming folders.');
