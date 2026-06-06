const fs = require('fs');
const pdfParse = require('pdf-parse');

const GAS_URL = "https://script.google.com/macros/s/AKfycbyodojfI8encGL4jkRlwPRAWXakSvpIb9rrvp0rd6g8CARhnusOeRmTdmy_Y5q56oEq9w/exec";
const SUBJECT_ID = "id_mn573l5e5";

async function parsePDF() {
    return require('fs').readFileSync('ocr_fixed.txt', 'utf8');
}

function extractQuizzes(text) {
    const quizzes = {}; // module/subtopic -> array of questions
    
    // Split by newlines and clean up
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let currentModuleNo = null;
    let currentSubtopicNo = null;
    let currentSubtopicTitle = null;
    
    let currentQuestion = null;
    let inQuestionText = false;
    let inOptions = false;
    let inExplanation = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Match Module Header (e.g. "Module 1: Understanding User...")
        const modMatch = line.match(/^Module\s+(\d+):/i);
        if (modMatch) {
            currentModuleNo = parseInt(modMatch[1]);
            continue;
        }
        
        // Match Subtopic Header (e.g. "1.1 Common Problems with Usability")
        const subMatch = line.match(/^(\d+\.\d+)\s+(.*)/);
        if (subMatch && !line.includes('?') && !line.includes('Answer:')) {
            if (currentQuestion && quizzes[currentSubtopicNo]) {
                quizzes[currentSubtopicNo].questions.push(currentQuestion);
                currentQuestion = null;
            }
            currentSubtopicNo = subMatch[1];
            currentSubtopicTitle = subMatch[2];
            
            if (!quizzes[currentSubtopicNo]) {
                quizzes[currentSubtopicNo] = {
                    moduleNo: currentModuleNo,
                    subtopicNo: currentSubtopicNo,
                    title: `Quiz: ${currentSubtopicTitle}`,
                    questions: []
                };
            }
            continue;
        }
        
        // Match Question (e.g. "1. A user is operating...")
        const qMatch = line.match(/^(\d+)\.\s+(.*)/);
        // Ensure it's not a subtopic (subtopics have decimals like 1.1)
        if (qMatch && !line.match(/^\d+\.\d+/) && !line.match(/^[A-D]\)/)) {
            if (currentQuestion && quizzes[currentSubtopicNo]) {
                quizzes[currentSubtopicNo].questions.push(currentQuestion);
            }
            
            currentQuestion = {
                id: `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                text: qMatch[2],
                options: [],
                correctAnswer: 0,
                explanation: ""
            };
            inQuestionText = true;
            inOptions = false;
            inExplanation = false;
            continue;
        }
        
        if (!currentQuestion) continue;
        
        // Match Option (e.g. "A) A Gulf of Execution...")
        const optMatch = line.match(/^([A-D])\)\s*(.*)/i);
        if (optMatch) {
            inQuestionText = false;
            inOptions = true;
            inExplanation = false;
            
            currentQuestion.options.push(optMatch[2]);
            continue;
        }
        
        // Match Answer (e.g. "Answer: B. Mode errors...")
        const ansMatch = line.match(/^Answer:\s*([A-D])\.?\s*(.*)/i);
        if (ansMatch) {
            inQuestionText = false;
            inOptions = false;
            inExplanation = true;
            
            const letter = ansMatch[1].toUpperCase();
            if (letter === 'A') currentQuestion.correctAnswer = 0;
            else if (letter === 'B') currentQuestion.correctAnswer = 1;
            else if (letter === 'C') currentQuestion.correctAnswer = 2;
            else if (letter === 'D') currentQuestion.correctAnswer = 3;
            
            currentQuestion.explanation = ansMatch[2];
            continue;
        }
        
        // Continuation lines
        if (inQuestionText) {
            currentQuestion.text += " " + line;
        } else if (inOptions && currentQuestion.options.length > 0) {
            currentQuestion.options[currentQuestion.options.length - 1] += " " + line;
        } else if (inExplanation) {
            currentQuestion.explanation += " " + line;
        }
    }
    
    // push the very last question
    if (currentQuestion && quizzes[currentSubtopicNo]) {
        quizzes[currentSubtopicNo].questions.push(currentQuestion);
    }
    
    return Object.values(quizzes);
}

async function run() {
    console.log("Parsing PDF...");
    const text = await parsePDF("1 To 5 Module Question.pdf");
    
    const quizzes = extractQuizzes(text);
    console.log(`Extracted ${quizzes.length} subtopic quizzes!`);
    
    console.log(JSON.stringify(quizzes.map(q => ({ title: q.title, qCount: q.questions.length })), null, 2));

    // Fetch Modules and Quizzes from GAS
    console.log("Fetching Modules from GAS...");
    const getModulesData = await fetch(GAS_URL + '?action=getModules&subjectId=' + SUBJECT_ID).then(r=>r.json());
    
    console.log("Fetching Quizzes from GAS...");
    const existingQuizzes = await fetch(GAS_URL + '?action=getQuizzes&subjectId=' + SUBJECT_ID).then(r=>r.json());
    
    // Map and Upload
    for (const quiz of quizzes) {
        if (!quiz.moduleNo) continue;
        
        const mod = getModulesData.find(m => m.moduleNo === quiz.moduleNo);
        if (!mod) continue;
        
        const sub = mod.subtopics?.find(s => s.subtopicNo == quiz.subtopicNo || s.title.includes(quiz.subtopicNo));
        const subtopicId = sub ? sub.id : "";
        
        const existing = existingQuizzes.find(q => q.subtopicId === subtopicId && q.moduleId === mod.id);
        
        console.log(`${existing ? 'Updating' : 'Creating'} Quiz: ${quiz.title} (${quiz.questions.length} questions) -> Module ${mod.title}`);
        
        const payload = {
            subjectId: SUBJECT_ID,
            moduleId: mod.id,
            subtopicId: subtopicId,
            title: quiz.title,
            timeLimit: quiz.questions.length * 2,
            totalMarks: quiz.questions.length,
            documentUrl: "",
            totalQuestionsToAsk: quiz.questions.length,
            questions: quiz.questions
        };
        
        if (existing) {
            payload.id = existing.id;
        }
        
        const res = await fetch(GAS_URL + '?action=saveQuiz', {
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(r=>r.json());
        
        console.log(`Status: ${res.success ? 'Success' : JSON.stringify(res)}`);
    }
    console.log("All done!");
}

run().catch(console.error);
