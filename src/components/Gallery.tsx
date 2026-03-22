import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import type { Character } from '../types';

interface GalleryProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
}

export function Gallery({ characters, onSelectCharacter }: GalleryProps) {
  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <ImageIcon size={48} className="mb-4 opacity-50" />
        <p>このカテゴリには画像がありません</p>
      </div>
    );
  }

  // P, I, A, D の順番でソート
  const typeOrder: Record<string, number> = { 'P': 0, 'I': 1, 'A': 2, 'D': 3 };
  
  const sortedCharacters = [...characters].sort((a, b) => {
    const aFirst = a.type.charAt(0).toUpperCase();
    const bFirst = b.type.charAt(0).toUpperCase();
    const aOrder = typeOrder[aFirst] ?? 99;
    const bOrder = typeOrder[bFirst] ?? 99;
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    // 最初の文字が同じ場合はアルファベット順
    return a.type.localeCompare(b.type);
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8">
      {sortedCharacters.map((char, index) => (
        <motion.div
          key={char.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="group relative cursor-pointer flex flex-col glass-panel rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] transition-all duration-300"
          onClick={() => onSelectCharacter(char)}
        >
          <div className="overflow-hidden bg-slate-800/20 flex items-center justify-center">
            <img 
              src={char.path} 
              alt={char.filename}
              className="w-full h-auto object-contain filter group-hover:brightness-110 transition-all duration-500 will-change-transform"
              loading="lazy"
            />
          </div>
          <div className="p-4 border-t border-white/5 bg-slate-900/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                {char.type}
              </span>
            </div>
            <h4 className="text-sm font-medium text-slate-200 truncate" title={char.filename}>
              {char.filename.replace(/—|（.*）|\.png|\.jpg/g, '').trim()}
            </h4>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
