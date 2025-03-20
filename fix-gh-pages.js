const fs = require('fs');
const path = require('path');

const browserPath = path.join(__dirname, 'docs', 'browser');
const docsPath = path.join(__dirname, 'docs');

if (fs.existsSync(browserPath)) {
    fs.readdirSync(browserPath).forEach(file => {
        fs.renameSync(path.join(browserPath, file), path.join(docsPath, file));
    });
    fs.rmdirSync(browserPath, { recursive: true });
    console.log("✅ File spostati correttamente da /docs/browser a /docs/");
} else {
    console.log("❌ La cartella 'docs/browser' non esiste, niente da spostare.");
}

// Creazione del file _redirects per GitHub Pages
const redirectsPath = path.join(docsPath, '_redirects');
fs.writeFileSync(redirectsPath, '/* /index.html 200\n');
console.log("✅ File _redirects creato correttamente!");
