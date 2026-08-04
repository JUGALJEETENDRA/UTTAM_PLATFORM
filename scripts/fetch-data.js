const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const GAS_WEB_APP_URL = process.env.NEXT_PUBLIC_GAS_URL;

if (!GAS_WEB_APP_URL) {
  console.error('ERROR: NEXT_PUBLIC_GAS_URL is not defined in environment variables.');
  process.exit(1);
}

function encryptObject(obj, keyHex) {
  if (!obj) return obj;
  try {
    const text = JSON.stringify(obj);
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(keyHex, 'hex'); // 32 bytes from SHA-256 hex
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return {
      encrypted: true,
      data: encrypted,
      iv: iv.toString('base64')
    };
  } catch (err) {
    console.error("Encryption failed", err);
    return obj;
  }
}

async function fetchGAS(action, payload = {}, retries = 5) {
  const url = new URL(GAS_WEB_APP_URL);
  url.searchParams.append('action', action);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Invalid response from server: ${text.substring(0, 100)}...`);
      }
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (attempt === retries) {
        throw error;
      }
      const isTimeout = error.name === 'AbortError';
      const errMsg = isTimeout ? 'Request timed out (15s)' : error.message;
      console.warn(`    Retry ${attempt}/${retries} for action ${action} after error: ${errMsg}`);
      await new Promise(resolve => setTimeout(resolve, 3000 * attempt)); // Increased backoff to 3s, 6s, 9s, 12s, 15s
    }
  }
}

async function main() {
  console.log('Fetching data from GAS to build static data.json...');
  
  const db = {
    getSubjects: [],
    getStudentDashboard: {},
    getModules: {},
    getModule: {},
    getQuizzes: {},
    getQuiz: {},
    getSimulations: {},
    getSimulation: {},
    getFlashcardDecks: {},
    getFlashcardDeck: {},
    getMindMaps: {},
    getInfographics: {}
  };

  try {
    console.log('- Fetching getSubjects');
    const subjects = await fetchGAS('getSubjects');
    db.getSubjects = subjects;

    console.log('- Fetching Encryption Keys');
    const subjectKeys = await fetchGAS('getEncryptionKeys');

    for (const subject of subjects) {
      console.log(`- Fetching data for subject ${subject.id} (${subject.name})`);
      
      const topLevelTasks = [
        fetchGAS('getStudentDashboard', { subjectId: subject.id }),
        fetchGAS('getSimulations', { subjectId: subject.id }).catch(e => {
          console.warn(`  Warning: getSimulations failed for subject ${subject.id}: ${e.message}`);
          return [];
        })
      ];

      const [
        dashboard,
        simulations
      ] = await Promise.all(topLevelTasks);
      
      const isPublic = subject.isPublic === "true" || subject.isPublic === true;
      const dataKey = subjectKeys[subject.id];

      const processData = (data) => {
        if (!dataKey || isPublic || !data) return data;
        return encryptObject(data, dataKey);
      };

      const dashboardModules = dashboard.modules || [];
      const dashboardQuizzes = dashboard.quizzesWithAttempts || [];
      const dashboardDecks = dashboard.flashcardDecks || [];
      const sims = simulations || [];

      // 1. Populate top level subject arrays
      db.getStudentDashboard[subject.id] = processData(dashboard);
      db.getModules[subject.id] = processData(dashboardModules);
      db.getQuizzes[subject.id] = processData(dashboardQuizzes);
      db.getSimulations[subject.id] = processData(sims);
      db.getMindMaps[subject.id] = processData(dashboard.mindmaps || []);
      db.getInfographics[subject.id] = processData(dashboard.infographics || []);
      db.getFlashcardDecks[subject.id] = processData(dashboardDecks);

      // 2. Reconstruct individual modules in-memory (including nested child lookups)
      dashboardModules.forEach(mod => {
        const modData = {
          ...mod,
          quizzes: dashboardQuizzes.filter(q => q.moduleId === mod.id),
          flashcardDecks: dashboardDecks.filter(f => f.moduleId === mod.id),
          simulations: sims.filter(s => s.moduleId === mod.id),
          mindmaps: (dashboard.mindmaps || []).filter(m => m.moduleId === mod.id),
          infographics: (dashboard.infographics || []).filter(i => i.moduleId === mod.id)
        };
        db.getModule[mod.id] = processData(modData);
      });

      // 3. Reconstruct individual quizzes in-memory
      dashboardQuizzes.forEach(quiz => {
        const quizData = {
          ...quiz,
          module: dashboardModules.find(m => m.id === quiz.moduleId)
        };
        db.getQuiz[quiz.id] = processData(quizData);
      });

      // 4. Reconstruct individual simulations in-memory
      sims.forEach(sim => {
        const simData = {
          ...sim,
          module: dashboardModules.find(m => m.id === sim.moduleId)
        };
        db.getSimulation[sim.id] = processData(simData);
      });

      // 5. Reconstruct individual flashcard decks in-memory
      dashboardDecks.forEach(deck => {
        const deckData = {
          ...deck,
          module: dashboardModules.find(m => m.id === deck.moduleId)
        };
        db.getFlashcardDeck[deck.id] = processData(deckData);
      });
    }

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, 'data.json'), JSON.stringify(db));
    console.log('Successfully wrote public/data.json');

    // Write a lightweight subjects.json containing only getSubjects data
    const subjectsDb = {
      getSubjects: db.getSubjects
    };
    fs.writeFileSync(path.join(publicDir, 'subjects.json'), JSON.stringify(subjectsDb));
    console.log('Successfully wrote public/subjects.json');

  } catch (error) {
    console.error('Failed to fetch data:', error);
    process.exit(1);
  }
}

main();
