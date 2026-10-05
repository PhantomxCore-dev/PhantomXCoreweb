const fs = require('fs');
const b64 = fs.readFileSync('avatar.jpg').toString('base64');
const dataUrl = 'data:image/jpeg;base64,' + b64;
fs.writeFileSync('avatar_b64.txt', dataUrl);
console.log('done, length=' + dataUrl.length);
