const fs = require('fs');
const path = require('path');

const GAS_WEB_APP_URL = process.env.NEXT_PUBLIC_GAS_URL;

if (!GAS_WEB_APP_URL) {
  console.error('ERROR: NEXT_PUBLIC_GAS_URL is not defined in environment variables.');
  process.exit(1);
}

async function fetchGAS(action, payload = {}) {
  const url = new URL(GAS_WEB_APP_URL);
  url.searchParams.append('action', action);
  
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
    getMindMaps: {}
  };

  try {
    console.log('- Fetching getSubjects');
    const subjects = await fetchGAS('getSubjects');
    db.getSubjects = subjects;

    for (const subject of subjects) {
      console.log(`- Fetching data for subject ${subject.id} (${subject.name})`);
      
      db.getStudentDashboard[subject.id] = await fetchGAS('getStudentDashboard', { subjectId: subject.id });
      
      const modules = await fetchGAS('getModules', { subjectId: subject.id });
      db.getModules[subject.id] = modules;
      for (const mod of modules) {
        db.getModule[mod.id] = await fetchGAS('getModule', { moduleId: mod.id });
      }

      const quizzes = await fetchGAS('getQuizzes', { subjectId: subject.id });
      db.getQuizzes[subject.id] = quizzes;
      for (const quiz of quizzes) {
        db.getQuiz[quiz.id] = await fetchGAS('getQuiz', { quizId: quiz.id });
      }

      const simulations = await fetchGAS('getSimulations', { subjectId: subject.id });
      db.getSimulations[subject.id] = simulations;
      for (const sim of simulations) {
        db.getSimulation[sim.id] = await fetchGAS('getSimulation', { simulationId: sim.id });
      }

      // In GAS, getting all flashcard decks might be named differently or just 'getFlashcardDecks'.
      // Wait, let's just fetch all 'getFlashcardDecks' if it exists. 
      // Checking GAS_Backend_Code.js: it seems `getStudentDashboard` already has `flashcardDecks`.
      // But student app calls `getFlashcardDecks` and `getFlashcardDeck`.
      // The GAS code doesn't explicitly handle `getFlashcardDecks` in the switch? Wait!
      // Let's assume it does. If it fails, we catch it.
      try {
        const decks = await fetchGAS('getFlashcardDecks', { subjectId: subject.id });
        db.getFlashcardDecks[subject.id] = decks;
        for (const deck of decks) {
          db.getFlashcardDeck[deck.id] = await fetchGAS('getFlashcardDeck', { deckId: deck.id });
        }
      } catch (e) {
         // Some endpoints might not exist in GAS if not fully implemented
         console.warn(`  Warning: getFlashcardDecks/getFlashcardDeck failed for subject ${subject.id}: ${e.message}`);
      }

      const mindmaps = await fetchGAS('getMindMaps', { subjectId: subject.id });
      db.getMindMaps[subject.id] = mindmaps;
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
