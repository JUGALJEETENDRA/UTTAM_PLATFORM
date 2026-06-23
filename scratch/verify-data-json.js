const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data.json');
if (!fs.existsSync(dataPath)) {
  console.error('public/data.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const pythonSubjectId = "id_hdzqxse2n";

const dashboardData = data.getStudentDashboard[pythonSubjectId];
if (dashboardData) {
  console.log('Dashboard data exists for Python.');
  console.log('Subject name:', dashboardData.subject?.name);
  console.log('Modules list on dashboard count:', dashboardData.modules?.length || 0);
  if (dashboardData.modules) {
    dashboardData.modules.forEach(m => {
      console.log(` - Module: ${m.title} (No: ${m.moduleNo}, ID: ${m.id})`);
    });
  }
} else {
  console.log('Dashboard data is missing for Python in public/data.json');
}
