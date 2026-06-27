// Google Apps Script (Code.gs)
// Deploy this as a Web App: Execute as "Me", Access: "Anyone"

const SPREADSHEET_ID = "ADD_YOUR_OWN_SHEET_HERE"; // Replace with your Spreadsheet ID

let __ssCache = null;
function getSpreadsheet() {
  if (!__ssCache) {
    __ssCache = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return __ssCache;
}

let __sheetDataCache = {};
function invalidateCache(sheetName) {
  delete __sheetDataCache[sheetName];
  try {
    CacheService.getScriptCache().remove("sheet_" + sheetName);
  } catch (e) { }
}

// ==========================================
// DATABASE INITIALIZATION SYSTEM
// ==========================================
function setupDatabase() {
  const ss = getSpreadsheet();

  const schemas = {
    "Subjects": ["id", "name", "description", "resources", "createdAt"],
    "Modules": ["id", "subjectId", "moduleNo", "title", "hours", "co", "description", "createdAt"],
    "Subtopics": ["id", "moduleId", "subtopicNo", "title", "learningOutcome", "type", "content", "mediaUrl", "simulationData", "order", "createdAt"],
    "Quizzes": ["id", "subjectId", "moduleId", "subtopicId", "title", "timeLimit", "totalMarks", "documentUrl", "totalQuestionsToAsk", "questions"],
    "FlashcardDecks": ["id", "subjectId", "moduleId", "subtopicId", "title", "cards"],
    "Simulations": ["id", "subjectId", "moduleId", "subtopicId", "title", "description", "difficulty", "estimatedTime", "learningOutcome", "frontendUrl"],
    "MindMaps": ["id", "subjectId", "moduleId", "title", "imageUrl", "downloadUrl", "createdAt"],
    "Resources": ["id", "subjectId", "title", "type", "link", "detail"]
  };

  for (const [sheetName, headers] of Object.entries(schemas)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      Logger.log(`Created sheet: ${sheetName}`);
    } else {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
        Logger.log(`Added headers to empty sheet: ${sheetName}`);
      } else {
        // ENHANCEMENT: Automatically append any missing columns to existing sheets
        let existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        let missingHeaders = headers.filter(h => !existingHeaders.includes(h));

        if (missingHeaders.length > 0) {
          let startCol = existingHeaders.length + 1;
          sheet.getRange(1, startCol, 1, missingHeaders.length).setValues([missingHeaders]);
          sheet.getRange(1, startCol, 1, missingHeaders.length).setFontWeight("bold");
          Logger.log(`Appended missing headers to ${sheetName}: ${missingHeaders.join(', ')}`);
        }
      }
    }
  }
  Logger.log("Database Setup Complete!");
}


// ==========================================
// CORE HELPERS
// ==========================================
function getSheetData(sheetName) {
  if (__sheetDataCache[sheetName]) {
    return __sheetDataCache[sheetName];
  }

  try {
    const cached = CacheService.getScriptCache().get("sheet_" + sheetName);
    if (cached) {
      const parsed = JSON.parse(cached);
      __sheetDataCache[sheetName] = parsed;
      return parsed;
    }
  } catch (e) { }

  const sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      try {
        if (row[index] && typeof row[index] === 'string' && (row[index].startsWith('[') || row[index].startsWith('{'))) {
          obj[header] = JSON.parse(row[index]);
        } else {
          obj[header] = row[index];
        }
      } catch (e) {
        obj[header] = row[index];
      }
    });
    return obj;
  });

  __sheetDataCache[sheetName] = result;

  try {
    const str = JSON.stringify(result);
    if (str.length < 100000) {
      CacheService.getScriptCache().put("sheet_" + sheetName, str, 21600); // 6 hours
    }
  } catch (e) { }

  return result;
}

function writeRow(sheetName, dataObj) {
  invalidateCache(sheetName);
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return null;
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = headers.map(header => {
    let val = dataObj[header] !== undefined ? dataObj[header] : "";
    if (typeof val === 'object') val = JSON.stringify(val);
    return val;
  });
  sheet.appendRow(newRow);
  return dataObj;
}

function updateRow(sheetName, idField, idValue, updateData) {
  invalidateCache(sheetName);
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(idField);

  const rowIndex = data.findIndex((row, i) => i > 0 && row[idIndex] === idValue);
  if (rowIndex === -1) return null;

  const existingRow = data[rowIndex];
  const updatedRow = existingRow.map((val, index) => {
    const header = headers[index];
    if (updateData[header] !== undefined) {
      let newVal = updateData[header];
      if (typeof newVal === 'object') newVal = JSON.stringify(newVal);
      return newVal;
    }
    return val;
  });

  sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([updatedRow]);
  return updateData;
}

function deleteRow(sheetName, idField, idValue) {
  invalidateCache(sheetName);
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return false;
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(idField);

  const rowIndex = data.findIndex((row, i) => i > 0 && row[idIndex] === idValue);
  if (rowIndex === -1) return false;

  sheet.deleteRow(rowIndex + 1);
  return true;
}

// Google Visualization API Query Extension
function executeSheetQuery(sheetName, queryStr) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found");

  const sheetId = sheet.getSheetId();
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&headers=1&gid=${sheetId}&tq=${encodeURIComponent(queryStr)}`;
  const token = ScriptApp.getOAuthToken();

  const response = UrlFetchApp.fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true
  });

  const text = response.getContentText();
  try {
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
    if (match) {
      return JSON.parse(match[1]).table;
    }
  } catch (e) { }
  return { error: "Failed to parse query response", raw: text };
}

// ==========================================
// HTTP HANDLERS
// ==========================================
function doPost(e) { return handleRequest(e, true); }
function doGet(e) { return handleRequest(e, false); }

function handleRequest(e, isPost) {
  try {
    const action = e.parameter.action;
    let payload = {};
    if (isPost && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }

    let result = null;

    switch (action) {
      // --- Student Endpoints ---
      case "getSubjects":
        result = getSheetData("Subjects");
        break;
      case "getStudentDashboard":
        result = handleGetStudentDashboard(payload);
        break;

      // --- Faculty Endpoints ---
      case "getFacultyDashboard":
        result = handleGetFacultyDashboard(payload);
        break;
      case "createSubject":
        result = writeRow("Subjects", {
          id: generateId(),
          name: payload.name,
          description: payload.description,
          resources: JSON.stringify([]),
          createdAt: new Date().toISOString()
        });
        break;
      case "deleteSubject":
        result = { success: deleteRow("Subjects", "id", payload.subjectId) };
        break;
      case "updateSubject":
        result = { success: updateRow("Subjects", "id", payload.subjectId, {
          name: payload.name,
          description: payload.description
        }) !== null };
        break;
      case "setupDatabase":
        setupDatabase();
        result = { success: true, message: "Database initialized successfully" };
        break;

      case "triggerDeploy":
        result = handleTriggerDeploy(payload);
        break;

      // --- Individual Pages Endpoints ---
      case "getModules":
        result = handleGetModules(payload);
        break;
      case "getModule":
        result = handleGetModule(payload);
        break;
      case "saveModule":
        result = handleSaveModule(payload);
        break;
      case "deleteModule":
        result = handleDeleteModule(payload);
        break;
      case "updateSubtopicLinks":
        result = handleUpdateSubtopicLinks(payload);
        break;

      // --- Mind Maps Endpoints ---
      case "getMindMaps":
        result = handleGetMindMaps(payload);
        break;
      case "saveMindMap":
        result = handleSaveMindMap(payload);
        break;
      case "deleteMindMap":
        result = handleDeleteMindMap(payload);
        break;

      // --- Resources Endpoints ---
      case "getResources":
        result = handleGetResources(payload);
        break;
      case "saveResource":
        result = handleSaveResource(payload);
        break;
      case "deleteResource":
        result = handleDeleteResource(payload);
        break;

      // --- Quizzes, Flashcards, Simulations ---
      case "getQuizzes":
        result = handleGetQuizzes(payload);
        break;
      case "getQuiz":
        result = handleGetQuiz(payload);
        break;
      case "saveQuiz":
        result = handleSaveQuiz(payload);
        break;
      case "deleteQuiz":
        result = handleDeleteQuiz(payload);
        break;
      case "getFlashcardDecks":
        result = handleGetFlashcardDecks(payload);
        break;
      case "getFlashcardDeck":
        result = handleGetFlashcardDeck(payload);
        break;
      case "saveFlashcardDeck":
        result = handleSaveFlashcardDeck(payload);
        break;
      case "deleteFlashcardDeck":
        result = handleDeleteFlashcardDeck(payload);
        break;
      case "getSimulations":
        result = handleGetSimulations(payload);
        break;
      case "getSimulation":
        result = handleGetSimulation(payload);
        break;
      case "saveSimulation":
        result = handleSaveSimulation(payload);
        break;
      case "deleteSimulation":
        result = handleDeleteSimulation(payload);
        break;
      default:
        result = { error: "Unknown action: " + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString(), stack: err.stack }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// ACTION LOGIC
// ==========================================

function handleGetStudentDashboard(payload) {
  const subject = getSheetData("Subjects").find(s => s.id === payload.subjectId) || { name: "Sample Subject" };
  const subjectModules = getSheetData("Modules").filter(m => m.subjectId === payload.subjectId) || [];

  const allSubtopicsData = getSheetData("Subtopics");
  subjectModules.forEach(mod => {
    mod.subtopics = allSubtopicsData.filter(s => s.moduleId === mod.id);
  });

  const allQuizzes = getSheetData("Quizzes").filter(q => q.subjectId === payload.subjectId) || [];
  allQuizzes.forEach(q => {
    q.module = subjectModules.find(m => m.id === q.moduleId);
    if (typeof q.questions === 'string') {
      try { q.questions = JSON.parse(q.questions); } catch (e) { q.questions = []; }
    }
  });

  const flashcardDecks = getSheetData("FlashcardDecks").filter(d => d.subjectId === payload.subjectId) || [];
  flashcardDecks.forEach(d => {
    d.module = subjectModules.find(m => m.id === d.moduleId);
    if (typeof d.cards === 'string') {
      try { d.cards = JSON.parse(d.cards); } catch (e) { d.cards = []; }
    }
  });

  const mindmaps = getSheetData("MindMaps").filter(m => m.subjectId === payload.subjectId) || [];
  const subjectResources = getSheetData("Resources").filter(r => r.subjectId === payload.subjectId) || [];

  return {
    subject,
    modules: subjectModules,
    quizzesWithAttempts: allQuizzes,
    flashcardDecks: flashcardDecks,
    mindmaps: mindmaps,
    subjectResources: subjectResources
  };
}

function handleGetFacultyDashboard(payload) {
  const allSubjects = getSheetData("Subjects");
  const allModules = getSheetData("Modules");

  const subjectsWithCounts = allSubjects.map(s => {
    return {
      ...s,
      _count: {
        modules: allModules.filter(m => m.subjectId === s.id).length
      }
    };
  });

  return {
    subjects: subjectsWithCounts,
    totalSubjects: allSubjects.length
  };
}

function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

function handleGetModules(payload) {
  const { subjectId } = payload;
  const modules = getSheetData("Modules").filter(m => m.subjectId === subjectId);
  const subtopics = getSheetData("Subtopics");

  return modules.map(m => {
    m.subtopics = subtopics.filter(s => s.moduleId === m.id).map(st => {
      let simData = {};
      if (typeof st.simulationData === 'string') {
        try { simData = JSON.parse(st.simulationData); } catch (e) { }
      } else if (typeof st.simulationData === 'object' && st.simulationData !== null) {
        simData = st.simulationData;
      }
      return { ...st, ...simData };
    });
    return m;
  }).sort((a, b) => a.moduleNo - b.moduleNo);
}

function handleGetMindMaps(payload) {
  const { subjectId } = payload;
  let mindmaps = getSheetData("MindMaps");
  if (subjectId) {
    mindmaps = mindmaps.filter(m => m.subjectId === subjectId);
  }
  return mindmaps;
}

function handleSaveMindMap(payload) {
  const { id, subjectId, moduleId, title, imageUrl, downloadUrl } = payload;
  const newId = id || generateId();
  const data = {
    id: newId,
    subjectId,
    moduleId: moduleId || "",
    title,
    imageUrl: imageUrl || "",
    downloadUrl: downloadUrl || "",
    createdAt: new Date().toISOString()
  };

  if (id) {
    updateRow("MindMaps", "id", id, data);
  } else {
    writeRow("MindMaps", data);
  }
  return { success: true, id: newId };
}

function handleDeleteMindMap(payload) {
  const { mindMapId } = payload;
  return { success: deleteRow("MindMaps", "id", mindMapId) };
}

// --- NEW RESOURCES FUNCTIONS ---
function handleGetResources(payload) {
  const { subjectId } = payload;
  return getSheetData("Resources").filter(r => r.subjectId === subjectId);
}

function handleSaveResource(payload) {
  const { id, subjectId, title, type, link, detail } = payload;
  const resId = id || generateId();

  // Auto-create the sheet if the user forgot to run setupDatabase
  const ss = getSpreadsheet();
  if (!ss.getSheetByName("Resources")) {
    const sheet = ss.insertSheet("Resources");
    sheet.appendRow(["id", "subjectId", "title", "type", "link", "detail"]);
    sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
  }

  const resData = {
    id: resId,
    subjectId,
    title,
    type,
    link,
    detail: detail || ""
  };

  if (id) {
    updateRow("Resources", "id", id, resData);
  } else {
    writeRow("Resources", resData);
  }
  return { success: true, id: resId };
}

function handleDeleteResource(payload) {
  const { id } = payload;
  return { success: deleteRow("Resources", "id", id) };
}

function handleUpdateSubtopicLinks(payload) {
  const { subtopicId, videoUrl, notesUrl, audioUrl } = payload;
  const allSubtopics = getSheetData("Subtopics");
  const subtopic = allSubtopics.find(s => s.id === subtopicId);

  if (!subtopic) return { error: "Subtopic not found" };

  let simData = {};
  if (typeof subtopic.simulationData === 'string' && subtopic.simulationData.startsWith('{')) {
    try { simData = JSON.parse(subtopic.simulationData); } catch (e) { }
  } else if (typeof subtopic.simulationData === 'object') {
    simData = subtopic.simulationData || {};
  }

  simData.videoUrl = videoUrl;
  simData.notesUrl = notesUrl;
  if (audioUrl !== undefined) {
    simData.audioUrl = audioUrl;
  }
  if (payload.videoLanguages !== undefined) {
    simData.videoLanguages = payload.videoLanguages;
  }
  if (payload.audioLanguages !== undefined) {
    simData.audioLanguages = payload.audioLanguages;
  }

  updateRow("Subtopics", "id", subtopicId, {
    simulationData: JSON.stringify(simData)
  });

  return {
    success: true,
    subtopic: {
      videoUrl,
      notesUrl,
      videoLanguages: simData.videoLanguages || [],
      audioUrl: simData.audioUrl || "",
      audioLanguages: simData.audioLanguages || []
    }
  };
}

function handleGetModule(payload) {
  const { moduleId } = payload;
  const mod = getSheetData("Modules").find(m => m.id === moduleId);
  if (!mod) return { error: "Module not found" };

  mod.subtopics = getSheetData("Subtopics")
    .filter(s => s.moduleId === moduleId)
    .sort((a, b) => a.order - b.order)
    .map(st => {
      let simData = {};
      if (typeof st.simulationData === 'string') {
        try { simData = JSON.parse(st.simulationData); } catch (e) { }
      } else if (typeof st.simulationData === 'object' && st.simulationData !== null) {
        simData = st.simulationData;
      }
      return { ...st, ...simData };
    });
  mod.quizzes = getSheetData("Quizzes").filter(q => q.moduleId === moduleId);
  mod.flashcardDecks = getSheetData("FlashcardDecks").filter(f => f.moduleId === moduleId);
  mod.simulations = getSheetData("Simulations").filter(s => s.moduleId === moduleId);
  mod.mindmaps = getSheetData("MindMaps").filter(m => m.moduleId === moduleId);
  return mod;
}

function handleGetQuizzes(payload) {
  const { subjectId } = payload;
  const quizzes = getSheetData("Quizzes").filter(q => q.subjectId === subjectId);
  const allModules = getSheetData("Modules");
  quizzes.forEach(q => {
    q.module = allModules.find(m => m.id === q.moduleId);
    if (typeof q.questions === 'string') {
      try { q.questions = JSON.parse(q.questions); } catch (e) { q.questions = []; }
    }
  });
  return quizzes;
}

function handleGetQuiz(payload) {
  const { quizId } = payload;
  const quiz = getSheetData("Quizzes").find(q => q.id === quizId);
  if (quiz) {
    quiz.module = getSheetData("Modules").find(m => m.id === quiz.moduleId);
    if (typeof quiz.questions === 'string') {
      try { quiz.questions = JSON.parse(quiz.questions); } catch (e) { quiz.questions = []; }
    }
  }
  return quiz;
}

function handleSaveModule(payload) {
  const { subjectId, moduleId, moduleNo, title, hours, co, subtopics } = payload;
  const newModuleId = moduleId || generateId();
  const description = payload.description || "";

  const moduleData = {
    id: newModuleId,
    subjectId,
    moduleNo,
    title,
    hours,
    co,
    description: description,
    createdAt: new Date().toISOString()
  };

  if (moduleId) {
    updateRow("Modules", "id", moduleId, moduleData);
    const existingSubtopics = getSheetData("Subtopics").filter(s => s.moduleId === moduleId);
    existingSubtopics.forEach(st => deleteRow("Subtopics", "id", st.id));
  } else {
    writeRow("Modules", moduleData);
  }

  if (subtopics && subtopics.length > 0) {
    subtopics.forEach((st, index) => {
      writeRow("Subtopics", {
        id: generateId(),
        moduleId: newModuleId,
        subtopicNo: index + 1,
        title: st.title,
        learningOutcome: st.learningOutcome || "",
        type: st.selectedResourceType || "none",
        content: st.description || "",
        mediaUrl: st.videoUrl || st.notesUrl || st.audioUrl || st.otherUrl || "",
        simulationData: JSON.stringify({
          videoLanguages: st.videoLanguages || [],
          audioLanguages: st.audioLanguages || [],
          videoUrl: st.videoUrl || "",
          notesUrl: st.notesUrl || "",
          notesDownloadUrl: st.notesDownloadUrl || "",
          otherUrl: st.otherUrl || "",
          otherDownloadUrl: st.otherDownloadUrl || "",
          audioUrl: st.audioUrl || "",
          audioDownloadUrl: st.audioDownloadUrl || ""
        }),
        order: index + 1,
        createdAt: new Date().toISOString()
      });
    });
  }

  return { success: true, moduleId: newModuleId };
}

function handleDeleteModule(payload) {
  const { moduleId } = payload;
  if (!moduleId) return { error: "moduleId is required" };

  // Delete from Modules sheet
  const moduleDeleted = deleteRow("Modules", "id", moduleId);

  // Delete associated Subtopics
  const subtopics = getSheetData("Subtopics").filter(s => s.moduleId === moduleId);
  subtopics.forEach(st => deleteRow("Subtopics", "id", st.id));

  // Delete associated Quizzes
  const quizzes = getSheetData("Quizzes").filter(q => q.moduleId === moduleId);
  quizzes.forEach(q => deleteRow("Quizzes", "id", q.id));

  // Delete associated FlashcardDecks
  const decks = getSheetData("FlashcardDecks").filter(d => d.moduleId === moduleId);
  decks.forEach(d => deleteRow("FlashcardDecks", "id", d.id));

  // Delete associated Simulations
  const simulations = getSheetData("Simulations").filter(s => s.moduleId === moduleId);
  simulations.forEach(s => deleteRow("Simulations", "id", s.id));

  // Delete associated MindMaps
  const mindmaps = getSheetData("MindMaps").filter(m => m.moduleId === moduleId);
  mindmaps.forEach(m => deleteRow("MindMaps", "id", m.id));

  return { success: moduleDeleted };
}

function handleSaveQuiz(payload) {
  const { id, subjectId, moduleId, subtopicId, title, timeLimit, totalMarks, documentUrl, totalQuestionsToAsk, questions } = payload;
  const quizId = id || generateId();

  const quizData = {
    id: quizId,
    subjectId,
    moduleId,
    subtopicId: subtopicId || "",
    title,
    timeLimit,
    totalMarks,
    documentUrl: documentUrl || "",
    totalQuestionsToAsk: totalQuestionsToAsk || "",
    questions: JSON.stringify(questions || [])
  };

  if (id) {
    updateRow("Quizzes", "id", id, quizData);
  } else {
    writeRow("Quizzes", quizData);
  }
  return { success: true, quizId: quizId };
}

function handleDeleteQuiz(payload) {
  const { id } = payload;
  return { success: deleteRow("Quizzes", "id", id) };
}

function handleGetFlashcardDecks(payload) {
  const { subjectId } = payload;
  const decks = getSheetData("FlashcardDecks").filter(d => d.subjectId === subjectId);
  const allModules = getSheetData("Modules");
  decks.forEach(d => {
    d.module = allModules.find(m => m.id === d.moduleId);
    if (typeof d.cards === 'string') {
      try { d.cards = JSON.parse(d.cards); } catch (e) { d.cards = []; }
    }
  });
  return decks;
}

function handleGetFlashcardDeck(payload) {
  const { deckId } = payload;
  const deck = getSheetData("FlashcardDecks").find(d => d.id === deckId);
  if (deck) {
    deck.module = getSheetData("Modules").find(m => m.id === deck.moduleId);
    if (typeof deck.cards === 'string') {
      try { deck.cards = JSON.parse(deck.cards); } catch (e) { deck.cards = []; }
    }
  }
  return deck;
}

function handleSaveFlashcardDeck(payload) {
  const { id, subjectId, moduleId, subtopicId, title, cards } = payload;
  const deckId = id || generateId();
  const deckData = {
    id: deckId,
    subjectId,
    moduleId,
    subtopicId: subtopicId || "",
    title,
    cards: JSON.stringify(cards || [])
  };

  if (id) {
    updateRow("FlashcardDecks", "id", id, deckData);
  } else {
    writeRow("FlashcardDecks", deckData);
  }
  return { success: true, deckId: deckId };
}

function handleDeleteFlashcardDeck(payload) {
  const { id } = payload;
  return { success: deleteRow("FlashcardDecks", "id", id) };
}

function handleGetSimulations(payload) {
  const { subjectId } = payload;
  const simulations = getSheetData("Simulations").filter(s => s.subjectId === subjectId);
  const allModules = getSheetData("Modules");
  simulations.forEach(s => {
    s.module = allModules.find(m => m.id === s.moduleId);
  });
  return simulations;
}

function handleGetSimulation(payload) {
  const { simulationId } = payload;
  const sim = getSheetData("Simulations").find(s => s.id === simulationId);
  if (sim) {
    sim.module = getSheetData("Modules").find(m => m.id === sim.moduleId);
  }
  return sim;
}

function handleSaveSimulation(payload) {
  const { id, subjectId, moduleId, subtopicId, title, description, difficulty, estimatedTime, learningOutcome, frontendUrl } = payload;
  const simId = id || generateId();

  const simData = {
    id: simId,
    subjectId,
    moduleId,
    subtopicId: subtopicId || "",
    title,
    description,
    difficulty,
    estimatedTime,
    learningOutcome,
    frontendUrl
  };

  if (id) {
    updateRow("Simulations", "id", id, simData);
  } else {
    writeRow("Simulations", simData);
  }
  return { success: true, simId: simId };
}

function handleDeleteSimulation(payload) {
  const { id } = payload;
  return { success: deleteRow("Simulations", "id", id) };
}

function handleTriggerDeploy(payload) {
  // Use Script Properties to store the GITHUB_PAT securely, or fallback to payload token.
  // We recommend the user adds GITHUB_PAT to their GAS Script Properties.
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_PAT') || payload.token;

  if (!token) {
    return { error: "GitHub token is required to trigger deployment. Please add GITHUB_PAT to Script Properties." };
  }

  const owner = "SourishAshtikar";
  const repo = "PS-3-Pages-Client-Only";
  const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      event_type: "deploy-from-gas"
    }),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      return { success: true, message: "Deployment triggered successfully!" };
    } else {
      return { error: `GitHub API Error: ${code}`, details: response.getContentText() };
    }
  } catch (err) {
    return { error: err.toString() };
  }
}
