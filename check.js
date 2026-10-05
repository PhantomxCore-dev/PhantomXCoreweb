const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
console.log('Has base64 img:', h.includes('data:image/jpeg;base64'));
console.log('Has old ref (avatar.jpg):', h.includes('src="avatar.jpg"'));
console.log('HTML size (KB):', Math.round(h.length / 1024));
