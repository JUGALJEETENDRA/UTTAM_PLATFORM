import * as pdfjsLib from 'pdfjs-dist';

// Use jsdelivr CDN for the worker with explicit https
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface ParsedModule {
  moduleNo: string;
  title: string;
  hours: string;
  co: string;
  description: string;
  subtopics: {
    title: string;
    learningOutcome: string;
    description: string;
    videoUrl: string;
    simulationUrl: string;
    notesUrl: string;
    notesDownloadUrl: string;
    quizFileUrl: string;
    quizFileDownloadUrl: string;
    mindMapUrl: string;
    mindMapDownloadUrl: string;
    flashCardsUrl: string;
    flashCardsDownloadUrl: string;
    referenceUrl: string;
    referenceDownloadUrl: string;
    otherUrl: string;
    otherDownloadUrl: string;
    audioUrl: string;
    audioDownloadUrl: string;
    selectedResourceType: string;
  }[];
}

export async function parsePdfToModules(file: File): Promise<ParsedModule[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const allLines: string[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = content.items as any[];
    
    const linesMap = new Map<number, { text: string, x: number }[]>();
    
    for (const item of items) {
      if (!item.str || item.str.trim() === '') continue;
      // Group by Y coordinate (rounding to handle slight variations)
      const y = Math.round(item.transform[5]);
      const x = item.transform[4];
      
      let foundY = y;
      for (const existingY of linesMap.keys()) {
        if (Math.abs(existingY - y) < 4) {
          foundY = existingY;
          break;
        }
      }
      
      if (!linesMap.has(foundY)) {
        linesMap.set(foundY, []);
      }
      linesMap.get(foundY)!.push({ text: item.str, x });
    }
    
    // Sort Y descending (top to bottom)
    const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
    
    for (const y of sortedY) {
      // Sort X ascending (left to right)
      const lineItems = linesMap.get(y)!.sort((a, b) => a.x - b.x);
      const lineText = lineItems.map(item => item.text).join(' ').replace(/\s+/g, ' ').trim();
      if (lineText) {
        allLines.push(lineText);
      }
    }
  }

  // Parse the text
  const modules: ParsedModule[] = [];
  let currentModule: ParsedModule | null = null;
  
  const moduleRegex = /^(\d+)\s+(.+?)\s+(\d+)\s+(CO\d+)$/i;
  const fallbackModuleRegex = /^(\d+)\s+(.*?)(CO\d+)$/i;
  const subtopicRegex = /^(\d+\.\d+)\s*(.*)/;
  
  for (const line of allLines) {
    // 1. Try strict module match: e.g. "1 Understanding User 6 CO1"
    let match = line.match(moduleRegex);
    if (match) {
      currentModule = {
        moduleNo: match[1],
        title: match[2].trim(),
        hours: match[3],
        co: match[4].toUpperCase(),
        description: "",
        subtopics: []
      };
      modules.push(currentModule);
      continue;
    }
    
    // 2. Try fallback module match: missing spaces or different order before CO
    match = line.match(fallbackModuleRegex);
    if (match && !line.match(subtopicRegex)) {
        const textBeforeCO = match[2].trim();
        const hrsMatch = textBeforeCO.match(/(.*?)\s+(\d+)$/);
        let title = textBeforeCO;
        let hours = "0";
        if (hrsMatch) {
            title = hrsMatch[1].trim();
            hours = hrsMatch[2];
        }
        
        currentModule = {
          moduleNo: match[1],
          title: title.replace(/●/g, '').trim(),
          hours: hours,
          co: match[3].toUpperCase(),
          description: "",
          subtopics: []
        };
        modules.push(currentModule);
        continue;
    }
    
    // 3. Try subtopic match: e.g. "1.1 Common problems with usability"
    match = line.match(subtopicRegex);
    if (match && currentModule) {
      let subTitle = match[2].replace(/●/g, '').trim();
      currentModule.subtopics.push({
        title: `${match[1]} ${subTitle}`.trim(),
        learningOutcome: "",
        description: "",
        videoUrl: "",
        simulationUrl: "",
        notesUrl: "",
        notesDownloadUrl: "",
        quizFileUrl: "",
        quizFileDownloadUrl: "",
        mindMapUrl: "",
        mindMapDownloadUrl: "",
        flashCardsUrl: "",
        flashCardsDownloadUrl: "",
        referenceUrl: "",
        referenceDownloadUrl: "",
        otherUrl: "",
        otherDownloadUrl: "",
        audioUrl: "",
        audioDownloadUrl: "",
        selectedResourceType: "none"
      });
      continue;
    }
  }
  
  return modules;
}
