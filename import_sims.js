const fs = require('fs');

const GAS_URL = "https://script.google.com/macros/s/AKfycbyodojfI8encGL4jkRlwPRAWXakSvpIb9rrvp0rd6g8CARhnusOeRmTdmy_Y5q56oEq9w/exec";
const SUBJECT_ID = "id_mn573l5e5";

async function run() {
    // 1. Fetch HTML and extract simulations
    console.log("Fetching simulations list from GitHub Pages...");
    const html = await fetch('https://jainamdavda1-pixel.github.io/All-Simulations/').then(r => r.text());
    
    // We will extract titles from the <h3> inside the card, and URL from the <a> tag
    const simBlocks = html.split('<div class="simulation-card">').slice(1);
    const sims = [];
    for (let block of simBlocks) {
        const titleMatch = block.match(/<h3>(.*?)<\/h3>/);
        const urlMatch = block.match(/<a href=\"([^\"]+)\"/);
        if (titleMatch && urlMatch) {
            let url = urlMatch[1];
            if (url.startsWith('./')) {
                url = url.substring(2);
            }
            sims.push({
                title: titleMatch[1].trim(),
                url: 'https://jainamdavda1-pixel.github.io/All-Simulations/' + url,
                // Extract module No and subtopic No from the title (e.g., "Simulation 1.1" -> Mod 1, Sub 1.1)
                moduleNo: parseInt(titleMatch[1].match(/(\d+)/)?.[1] || 0),
                subtopicNo: titleMatch[1].replace('Simulation ', '').trim()
            });
        }
    }
    
    console.log(`Found ${sims.length} simulations. Fetching subject modules...`);
    
    // 2. Fetch Modules
    const getModulesData = await fetch(GAS_URL + '?action=getModules&subjectId=' + SUBJECT_ID).then(r=>r.json());
    
    console.log(`Fetched ${getModulesData.length} modules.`);
    
    // 3. Map and Insert
    for (const sim of sims) {
        const mod = getModulesData.find(m => m.moduleNo === sim.moduleNo);
        if (!mod) {
            console.log(`Skipping ${sim.title} - Module ${sim.moduleNo} not found`);
            continue;
        }
        
        let subtopicId = "";
        const sub = mod.subtopics?.find(s => s.subtopicNo == sim.subtopicNo || s.title.includes(sim.subtopicNo));
        if (sub) {
            subtopicId = sub.subtopicNo;
        } else {
            console.log(`Could not find subtopic for ${sim.title}, mapping to entire module.`);
        }
        
        console.log(`Mapping ${sim.title} to Module: ${mod.title}, Subtopic: ${subtopicId}`);
        
        const payload = {
            action: 'saveSimulation',
            subjectId: SUBJECT_ID,
            moduleId: mod.id,
            subtopicId: subtopicId,
            title: sim.title,
            description: "", // Now optional!
            difficulty: "Intermediate",
            estimatedTime: "15 mins",
            frontendUrl: sim.url
        };
        
        const res = await fetch(GAS_URL + '?action=saveSimulation', {
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(r=>r.json());
        
        console.log(`Saved ${sim.title}: ${res.success ? 'Success' : JSON.stringify(res)}`);
    }
    console.log("Done!");
}

run().catch(console.error);
