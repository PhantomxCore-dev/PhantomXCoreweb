// copy_and_embed.js
const fs   = require('fs');
const path = require('path');

const src = 'C:\\Users\\firegamer\\.gemini\\antigravity\\brain\\4db2f3f3-8b17-45f1-92b7-1a73b2d27f09\\.user_uploaded\\media_1791105403343.jpg';
const dst = path.join(__dirname, 'avatar.jpg');

// Copy image
fs.copyFileSync(src, dst);
console.log('Copied image to', dst);

// Embed in HTML
const b64     = fs.readFileSync(dst).toString('base64');
const dataUrl = 'data:image/jpeg;base64,' + b64;
console.log('Base64 length:', b64.length);

let html = fs.readFileSync('index.html', 'utf8');

// Replace any existing avatar reference (relative OR already embedded)
// Replace src="avatar.jpg"
html = html.split('src="avatar.jpg"').join('src="' + dataUrl + '"');

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated — image is now embedded. File is fully self-contained!');
