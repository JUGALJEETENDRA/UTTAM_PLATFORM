export const GAS_WEB_APP_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

declare global {
  interface Window {
    _dataJsonPromise?: Promise<any>;
  }
}

export async function fetchGAS(action: string, payload: Record<string, any> = {}) {
  // If deployed and not on a faculty page, intercept READ requests and use local data.json
  const isDeployed = process.env.NEXT_PUBLIC_IS_DEPLOYED === 'true';
  const isFaculty = typeof window !== 'undefined' && window.location.pathname.includes('/faculty');
  
  if (isDeployed && !isFaculty) {
    if (typeof window !== 'undefined') {
      if (!window._dataJsonPromise) {
        // Fetch the local data.json relative to the base path, with cache busting
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || '0';
        window._dataJsonPromise = fetch(`${basePath}/data.json?v=${buildTime}`).then(res => res.json());
      }
      
      try {
        const dataJson = await window._dataJsonPromise;
        
        if (action === 'getSubjects') return dataJson.getSubjects || [];
        if (action === 'getStudentDashboard') return dataJson.getStudentDashboard[payload.subjectId] || null;
        if (action === 'getModules') return dataJson.getModules[payload.subjectId] || [];
        if (action === 'getModule') return dataJson.getModule[payload.moduleId] || null;
        if (action === 'getQuizzes') return dataJson.getQuizzes[payload.subjectId] || [];
        if (action === 'getQuiz') return dataJson.getQuiz[payload.quizId] || null;
        if (action === 'getSimulations') return dataJson.getSimulations[payload.subjectId] || [];
        if (action === 'getSimulation') return dataJson.getSimulation[payload.simulationId] || null;
        if (action === 'getFlashcardDecks') return dataJson.getFlashcardDecks[payload.subjectId] || [];
        if (action === 'getFlashcardDeck') return dataJson.getFlashcardDeck[payload.deckId] || null;
        if (action === 'getMindMaps') return dataJson.getMindMaps[payload.subjectId] || [];
        if (action === 'getInfographics') return dataJson.getInfographics[payload.subjectId] || [];
        
        // If not a read action or not handled, it will fall through to GAS (though likely fail if offline/static)
      } catch (err) {
        console.error("Failed to load local data.json:", err);
      }
    }
  }

  try {
    const url = new URL(GAS_WEB_APP_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('t', Date.now().toString());

    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
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
    console.error(`Error fetching GAS for action ${action}:`, error);
    throw error;
  }
}
