const fs = require('fs');

async function fetchSims() {
    const html = await fetch('https://jainamdavda1-pixel.github.io/All-Simulations/').then(r => r.text());
    const regex = /<a href=\"([^\"]+)\"[^>]*>([^<]+)<\/a>/g;
    let m;
    let results = [];
    while ((m = regex.exec(html)) !== null) {
        if (!m[1].startsWith('#')) {
            results.push({ url: 'https://jainamdavda1-pixel.github.io/All-Simulations/' + m[1], title: m[2].trim() });
        }
    }
    console.log(JSON.stringify(results, null, 2));
}

fetchSims();
