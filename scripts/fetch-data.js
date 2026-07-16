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

async function fetchGAS(action, payload = {}, retries = 3) {
  const url = new URL(GAS_WEB_APP_URL);
  url.searchParams.append('action', action);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify(payload)
      });
      
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
      if (attempt === retries) {
        throw error;
      }
      console.warn(`    Retry ${attempt}/${retries} for action ${action} after error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }
}

async function executeInChunks(tasks, chunkSize = 5) {
  for (let i = 0; i < tasks.length; i += chunkSize) {
    const chunk = tasks.slice(i, i + chunkSize);
    await Promise.all(chunk.map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay between chunks
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
        fetchGAS('getModules', { subjectId: subject.id }),
        fetchGAS('getQuizzes', { subjectId: subject.id }),
        fetchGAS('getSimulations', { subjectId: subject.id }),
        fetchGAS('getMindMaps', { subjectId: subject.id }),
        fetchGAS('getInfographics', { subjectId: subject.id }),
        fetchGAS('getFlashcardDecks', { subjectId: subject.id }).catch(e => {
          console.warn(`  Warning: getFlashcardDecks failed for subject ${subject.id}: ${e.message}`);
          return [];
        })
      ];

      const [
        dashboard,
        modules,
        quizzes,
        simulations,
        mindmaps,
        infographics,
        decks
      ] = await Promise.all(topLevelTasks);
      
      const isPublic = subject.isPublic === "true" || subject.isPublic === true;
      const dataKey = subjectKeys[subject.id];

      const processData = (data) => {
        if (!dataKey || isPublic || !data) return data;
        return encryptObject(data, dataKey);
      };

      db.getStudentDashboard[subject.id] = processData(dashboard);
      db.getModules[subject.id] = processData(modules);
      db.getQuizzes[subject.id] = processData(quizzes);
      db.getSimulations[subject.id] = processData(simulations);
      db.getMindMaps[subject.id] = processData(mindmaps);
      db.getInfographics[subject.id] = processData(infographics);
      db.getFlashcardDecks[subject.id] = processData(decks || []);

      const childTasks = [];
      
      (modules || []).forEach(mod => {
        childTasks.push(async () => {
          const modData = await fetchGAS('getModule', { moduleId: mod.id });
          db.getModule[mod.id] = processData(modData);
        });
      });

      (quizzes || []).forEach(quiz => {
        childTasks.push(async () => {
          const quizData = await fetchGAS('getQuiz', { quizId: quiz.id });
          db.getQuiz[quiz.id] = processData(quizData);
        });
      });

      (simulations || []).forEach(sim => {
        childTasks.push(async () => {
          const simData = await fetchGAS('getSimulation', { simulationId: sim.id });
          db.getSimulation[sim.id] = processData(simData);
        });
      });

      (decks || []).forEach(deck => {
        childTasks.push(async () => {
          try {
            const deckData = await fetchGAS('getFlashcardDeck', { deckId: deck.id });
            db.getFlashcardDeck[deck.id] = processData(deckData);
          } catch (e) {
            console.warn(`  Warning: getFlashcardDeck failed for deck ${deck.id}: ${e.message}`);
          }
        });
      });

      if (childTasks.length > 0) {
        console.log(`  - Fetching ${childTasks.length} child items in parallel chunks...`);
        await executeInChunks(childTasks, 15);
      }
    }

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, 'data.json'), JSON.stringify(db));
    console.log('Successfully wrote public/data.json');

  } catch (error) {
    console.error('Failed to fetch data:', error);
    process.exit(1);
  }
}

main();
