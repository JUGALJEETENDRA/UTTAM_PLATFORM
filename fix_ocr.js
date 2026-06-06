const fs = require('fs');
let text = fs.readFileSync('ocr.txt', 'utf8');
// Fix missing newlines before question numbers that got appended to previous lines.
// Like "some text.  11. A user..."
text = text.replace(/([a-z\.\)\?]\s{2,})(\d+\.\s+[A-Z])/g, '$1\n$2');
// Also fix any answers that missed a newline
text = text.replace(/([a-z\.\)\?]\s{2,})(Answer:\s*[A-D])/g, '$1\n$2');
fs.writeFileSync('ocr_fixed.txt', text);
console.log('Fixed ocr.txt -> ocr_fixed.txt');
