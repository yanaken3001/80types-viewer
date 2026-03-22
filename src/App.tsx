import { useState, useMemo } from 'react';
import characterData from './data/characters.json';
import type { Character } from './types';
import { Gallery } from './components/Gallery';
import { Compare } from './components/Compare';
import { ImageModal } from './components/ImageModal';
import { LayoutGrid, ArrowLeftRight } from 'lucide-react';

export default function App() {
  const characters = characterData as Character[];
  const categories = useMemo(() => Array.from(new Set(characters.map(c => c.category))), [characters]);
  
  const [viewMode, setViewMode] = useState<'gallery' | 'compare'>('gallery');
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  const galleryChars = useMemo(() => {
    return characters.filter(c => c.category === activeCategory);
  }, [characters, activeCategory]);

  // Modal navigation
  const activeCharList = viewMode === 'gallery' ? galleryChars : characters.filter(c => c.type === selectedChar?.type);
  
  const handleNext = () => {
    if (!selectedChar) return;
    const idx = activeCharList.findIndex(c => c.id === selectedChar.id);
    if (idx < activeCharList.length - 1) setSelectedChar(activeCharList[idx + 1]);
  };

  const handlePrev = () => {
    if (!selectedChar) return;
    const idx = activeCharList.findIndex(c => c.id === selectedChar.id);
    if (idx > 0) setSelectedChar(activeCharList[idx - 1]);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans">
      {/* Cool Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[30%] w-[80%] h-[80%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute -bottom-[40%] left-[10%] w-[60%] h-[60%] rounded-full bg-violet-900/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <header className="sticky top-0 z-40 glass-panel border-b-0 border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutGrid className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            80Types Viewer
          </h1>
        </div>

        <div className="flex p-1 bg-slate-900/50 rounded-lg glass-panel">
          <button 
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'gallery' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid size={16} />
            Gallery
          </button>
          <button 
            onClick={() => setViewMode('compare')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'compare' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowLeftRight size={16} />
            Compare
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-8 xl:p-12">
        {viewMode === 'gallery' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-8 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    activeCategory === cat 
                      ? 'bg-white text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                      : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <Gallery 
              characters={galleryChars} 
              onSelectCharacter={setSelectedChar} 
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Compare 
              characters={characters} 
              onSelectCharacter={setSelectedChar} 
            />
          </div>
        )}
      </main>

      <ImageModal 
        character={selectedChar} 
        onClose={() => setSelectedChar(null)} 
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
