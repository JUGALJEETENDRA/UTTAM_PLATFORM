const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/app/api/faculty/quiz-upload/route.ts",
  "src/app/api/faculty/topics/route.ts",
  "src/app/api/faculty/upload/route.ts",
  "src/app/api/faculty/subjects/route.ts",
  "src/app/api/student/progress/route.ts",
  "src/app/api/faculty/subjects/[id]/route.ts",
  "src/app/api/faculty/modules/route.ts",
  "src/app/api/faculty/material/route.ts",
  "src/app/api/faculty/invite/route.ts",
  "src/app/(app)/layout.tsx",
  "src/app/(app)/subject/[subjectId]/page.tsx",
  "src/app/(app)/subject/[subjectId]/module/[moduleId]/page.tsx",
  "src/app/(app)/subject/[subjectId]/module/[moduleId]/topic/[topicId]/page.tsx"
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/import \{ authOptions \} from "[^"]+";/, 'import { authOptions } from "@/lib/auth";');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
