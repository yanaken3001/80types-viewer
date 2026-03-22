import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../types';

interface CompareProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
}

export function Compare({ characters, onSelectCharacter }: CompareProps) {
  // Extract unique types (e.g., 'AA', 'AD'...)
  const types = useMemo(() => {
    return Array.from(new Set(characters.map(c => c.type))).sort();
  }, [characters]);

  const [activeType, setActiveType] = useState<string>(types[0] || '');

  // Filter characters by the active type
  const filteredChars = useMemo(() => {
    return characters.filter(c => c.type === activeType);
  }, [characters, activeType]);

  if (types.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar for Types */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h3 className="text-lg font-semibold text-slate-300 mb-4 px-2">タイプから選ぶ</h3>
          <div className="flex overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-0 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto custom-scrollbar">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`flex-shrink-0 lg:w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                  activeType === t 
                    ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                Type {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Compare Area */}
      <div className="flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
          Compare: <span className="ml-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30">Type {activeType}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredChars.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-slate-900/40 rounded-2xl overflow-hidden glass-panel flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectCharacter(char)}
            >
              <div className="px-4 py-3 border-b border-white/5 bg-slate-800/30 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{char.category}</span>
              </div>
              <div className="bg-slate-950/30 flex items-center justify-center">
                <img 
                  src={char.path} 
                  alt={char.filename}
                  className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 will-change-transform"
                />
              </div>
              <div className="p-4 border-t border-white/5">
                <p className="text-sm text-slate-300 truncate font-medium text-center">
                  {char.filename.replace(/\.png|\.jpg/g, '')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredChars.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            このタイプのキャラクターは見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
