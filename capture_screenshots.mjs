import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('screenshots');

// Ensure directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  // Standard laptop viewport
  await page.setViewport({ width: 1440, height: 900 });

  // Helper to wait for data to load
  const waitAndSnap = async (name) => {
    // Wait for spinners/skeletons to disappear (naive approach: just wait 4 seconds to be safe)
    await new Promise(r => setTimeout(r, 4500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, name) });
  };

  try {
    console.log('Capturing Home Page (home.png)...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await waitAndSnap('home.png');

    // Get the first subject ID
    const subjectLink = await page.waitForSelector("a[href^='/student/subjects/subject?subjectId=']", { timeout: 15000 }).catch(() => null);
    if (!subjectLink) {
      console.log('No subject found on home page. Exiting.');
      await browser.close();
      return;
    }
    
    const href = await page.evaluate(el => el.getAttribute('href'), subjectLink);
    const urlParams = new URL(href, 'http://localhost:3000').searchParams;
    const subjectId = urlParams.get('subjectId');
    console.log('Found Subject ID:', subjectId);

    console.log('Capturing Student Dashboard (subject_dashboard.png)...');
    await page.goto(`http://localhost:3000/student/subjects/subject?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    await waitAndSnap('subject_dashboard.png');

    console.log('Capturing Quiz List (quiz.png)...');
    await page.goto(`http://localhost:3000/student/subjects/subject/quizzes?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    await waitAndSnap('quiz.png');

    // Click into the first quiz
    console.log('Capturing Quiz Internal (quiz_internal.png)...');
    const quizLink = await page.waitForSelector("a[href^='/student/subjects/subject/quizzes/attempt?']", { timeout: 10000 }).catch(() => null);
    if (quizLink) {
      await quizLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null);
      await waitAndSnap('quiz_internal.png');
    }

    console.log('Capturing Flashcards List (flashcard.png)...');
    await page.goto(`http://localhost:3000/student/subjects/subject/flashcards?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    await waitAndSnap('flashcard.png');

    // Click into the first flashcard
    console.log('Capturing Flashcard Internal (flashcard_internal.png)...');
    const flashcardLink = await page.waitForSelector("a[href^='/student/subjects/subject/flashcards/deck?']", { timeout: 10000 }).catch(() => null);
    if (flashcardLink) {
      await flashcardLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null);
      await waitAndSnap('flashcard_internal.png');
    }

    console.log('Capturing Simulation (simulation.png)...');
    await page.goto(`http://localhost:3000/student/subjects/subject/simulations?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    const simLink = await page.waitForSelector("a[href^='/student/subjects/subject/simulations/item?']", { timeout: 10000 }).catch(() => null);
    if (simLink) {
      await simLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null);
    }
    await waitAndSnap('simulation.png');

    console.log('Capturing Infographics (infographics.png)...');
    await page.goto(`http://localhost:3000/student/subjects/subject/infographics?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    const infoLink = await page.waitForSelector("a[href^='/student/subjects/subject/infographics/item?']", { timeout: 10000 }).catch(() => null);
    if (infoLink) {
      await infoLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null);
    }
    await waitAndSnap('infographics.png');

    console.log('Capturing Mind Maps (mindmaps.png)...');
    await page.goto(`http://localhost:3000/student/subjects/subject/mindmaps?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    const mmLink = await page.waitForSelector("a[href^='/student/subjects/subject/mindmaps/item?']", { timeout: 10000 }).catch(() => null);
    if (mmLink) {
      await mmLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null);
    }
    await waitAndSnap('mindmaps.png');

    // ---------------------------------------------
    // Faculty Screenshots
    // ---------------------------------------------
    console.log('Logging in as Faculty...');
    await page.goto('http://localhost:3000/faculty/login', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.setItem('faculty_session', 'authenticated');
    });
    // Hard reload the dashboard
    console.log('Capturing Faculty Dashboard (faculty_dashboard.png)...');
    await page.goto(`http://localhost:3000/faculty/dashboard`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => {
      return !document.body.innerText.toLowerCase().includes('checking authentication');
    }, { timeout: 10000 }).catch(() => null);
    await waitAndSnap('faculty_dashboard.png');

    console.log('Capturing Faculty Flashcards (faculty_flashcard.png)...');
    await page.goto(`http://localhost:3000/faculty/subjects/subject/flashcards?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    await waitAndSnap('faculty_flashcard.png');

    console.log('Capturing Faculty Quiz Creation (quiz_creation.png)...');
    await page.goto(`http://localhost:3000/faculty/subjects/subject/quizzes?subjectId=${subjectId}`, { waitUntil: 'networkidle2' });
    await waitAndSnap('quiz_creation.png');

  } catch (error) {
    console.error('Error during capture:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

capture();
