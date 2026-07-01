const fs = require('fs');
const path = require('path');

const GAS_WEB_APP_URL = process.env.NEXT_PUBLIC_GAS_URL;

if (!GAS_WEB_APP_URL) {
  console.error('ERROR: NEXT_PUBLIC_GAS_URL is not defined in environment variables.');
  process.exit(1);
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
      
      db.getStudentDashboard[subject.id] = dashboard;
      db.getModules[subject.id] = modules;
      db.getQuizzes[subject.id] = quizzes;
      db.getSimulations[subject.id] = simulations;
      db.getMindMaps[subject.id] = mindmaps;
      db.getInfographics[subject.id] = infographics;
      db.getFlashcardDecks[subject.id] = decks || [];

      const childTasks = [];
      
      (modules || []).forEach(mod => {
        childTasks.push(async () => {
          db.getModule[mod.id] = await fetchGAS('getModule', { moduleId: mod.id });
        });
      });

      (quizzes || []).forEach(quiz => {
        childTasks.push(async () => {
          db.getQuiz[quiz.id] = await fetchGAS('getQuiz', { quizId: quiz.id });
        });
      });

      (simulations || []).forEach(sim => {
        childTasks.push(async () => {
          db.getSimulation[sim.id] = await fetchGAS('getSimulation', { simulationId: sim.id });
        });
      });

      (decks || []).forEach(deck => {
        childTasks.push(async () => {
          try {
            db.getFlashcardDeck[deck.id] = await fetchGAS('getFlashcardDeck', { deckId: deck.id });
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
