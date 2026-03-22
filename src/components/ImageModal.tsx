import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Character } from '../types';

interface ImageModalProps {
  character: Character | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  nextCharacter?: Character | null;
  prevCharacter?: Character | null;
}

export function ImageModal({ character, onClose, onNext, onPrev, nextCharacter, prevCharacter }: ImageModalProps) {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!character) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [character, onClose, onNext, onPrev]);

  // Preload adjacent images for instant navigation
  useEffect(() => {
    if (!character) return;
    if (nextCharacter) {
      const img = new Image();
      img.src = nextCharacter.path;
    }
    if (prevCharacter) {
      const img = new Image();
      img.src = prevCharacter.path;
    }
  }, [character, nextCharacter, prevCharacter]);

  if (!character) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <X size={24} />
          </button>
        </div>

        {onPrev && (
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/5 text-white hover:bg-white/20 transition-colors backdrop-blur-md z-50"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-5xl max-h-full w-full h-full flex flex-col items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={character.path}
            alt={character.filename}
            decoding="async"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="mt-6 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{character.filename.replace('.png', '')}</h3>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
              {character.category} • タイプ {character.type}
            </div>
          </div>
        </motion.div>

        {onNext && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/5 text-white hover:bg-white/20 transition-colors backdrop-blur-md z-50"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
