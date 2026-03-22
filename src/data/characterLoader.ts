import type { Character } from '../types';

// Viteのimport.meta.globを使って、public/assets 以下にある画像ファイルを全て自動で検知します。
// （.png, .jpg, .jpeg, .webp に対応）
const images = import.meta.glob('/public/assets/**/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });

const characters: Character[] = Object.entries(images).map(([filepath, url]) => {
  // filepath: e.g. "/public/assets/クリーチャー2D/AA 歩くWikipedia.png"
  const parts = filepath.split('/');
  const filename = parts.pop() || '';
  const category = parts.pop() || '';
  
  // ファイル名の先頭から2文字(A-Z)を抽出してタイプ判定
  const typeMatch = filename.match(/^([a-zA-Z]{2})/);
  let type = typeMatch ? typeMatch[1].toUpperCase() : 'Unknown';

  return {
    id: `${category}-${filename}`,
    filename,
    path: (url as string), // Viteによって解決されたURL・パスをそのまま利用
    type,
    category
  };
});

export default characters;
