const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../../');
const DEST_DIR = path.join(__dirname, '../public/assets');

const categories = [
  'クリーチャー2D',
  'クリーチャー3D',
  'シアトリズム_GPT',
  'シアトリズム_nanobanana',
  '別パターン'
];

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

let allCharacters = [];

categories.forEach(category => {
  const catPath = path.join(SOURCE_DIR, category);
  const destCatPath = path.join(DEST_DIR, category);
  
  if (!fs.existsSync(destCatPath)) {
    fs.mkdirSync(destCatPath, { recursive: true });
  }

  if (fs.existsSync(catPath)) {
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    files.forEach(file => {
      const srcFile = path.join(catPath, file);
      const destFile = path.join(destCatPath, file);
      
      // Copy file
      fs.copyFileSync(srcFile, destFile);
      
      // Extract type (first 2 letters, assumed alphabetical)
      const typeMatch = file.match(/^([A-Z]{2})/);
      const type = typeMatch ? typeMatch[1] : 'Unknown';
      
      allCharacters.push({
        id: `${category}-${file}`,
        filename: file,
        path: `/assets/${encodeURIComponent(category)}/${encodeURIComponent(file)}`, // For Vite dev/build
        type: type,
        category: category
      });
    });
  }
});

// Write to JSON for the frontend to consume
const jsonPath = path.join(__dirname, '../src/data/characters.json');
if (!fs.existsSync(path.dirname(jsonPath))) {
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
}
fs.writeFileSync(jsonPath, JSON.stringify(allCharacters, null, 2), 'utf-8');

console.log('Assets prepared successfully!');
