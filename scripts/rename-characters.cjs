const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'public/assets');

function renameRecursive(currentDir) {
  if (!fs.existsSync(currentDir)) return;
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      renameRecursive(fullPath);
    } else {
      let newName = file
        .replace(/歩くWikipedia/g, '知の番人')
        .replace(/積み上げの達人/g, '継続の鬼');
      if (newName !== file) {
        fs.renameSync(fullPath, path.join(currentDir, newName));
        console.log(`${file} -> ${newName}`);
      }
    }
  }
}
renameRecursive(dir);
