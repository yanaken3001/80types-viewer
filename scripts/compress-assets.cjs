const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

async function processImages() {
  for (const category of categories) {
    const catPath = path.join(SOURCE_DIR, category);
    const destCatPath = path.join(DEST_DIR, category);
    
    if (!fs.existsSync(destCatPath)) {
      fs.mkdirSync(destCatPath, { recursive: true });
    }

    if (fs.existsSync(catPath)) {
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
      for (const file of files) {
        const srcFile = path.join(catPath, file);
        const webpFile = file.replace(/\.(png|jpg)$/, '.webp');
        const destFile = path.join(destCatPath, webpFile);
        
        console.log(`Processing: ${file}`);
        
        // Convert to WebP and resize if it's too large (max width 1200px)
        await sharp(srcFile)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(destFile);

        // Delete the old PNG/JPG version if it exists in the dest dir
        const oldDestFile = path.join(destCatPath, file);
        if (fs.existsSync(oldDestFile)) {
          fs.unlinkSync(oldDestFile);
        }
        
        // Extract type
        const typeMatch = file.match(/^([A-Z]{2})/);
        const type = typeMatch ? typeMatch[1] : 'Unknown';
        
        allCharacters.push({
          id: `${category}-${file}`,
          filename: file,
          path: `/assets/${encodeURIComponent(category)}/${encodeURIComponent(webpFile)}`,
          type: type,
          category: category
        });
      }
    }
  }

  // Update JSON
  const jsonPath = path.join(__dirname, '../src/data/characters.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allCharacters, null, 2), 'utf-8');

  console.log('All optimized assets completely processed and JSON updated!');
}

processImages().catch(err => {
  console.error(err);
  process.exit(1);
});
