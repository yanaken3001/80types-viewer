import { useState, useRef, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

/**
 * Optimized image component with:
 * - IntersectionObserver lazy loading (loads 600px before entering viewport)
 * - Async decoding for non-blocking rendering
 * - Fade-in animation on load for perceived speed
 */
export const OptimizedImage = memo(function OptimizedImage({ src, alt, className = '', onLoad }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' } // Start loading 600px before viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {isInView ? (
        <img
          src={src}
          alt={alt}
          decoding="async"
          className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
        />
      ) : (
        // Placeholder to maintain layout space
        <div className="w-full aspect-square" />
      )}
    </div>
  );
});

/**
 * Preload an image into the browser cache
 */
export function preloadImage(src: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  // Avoid duplicates
  if (!document.head.querySelector(`link[href="${CSS.escape(src)}"]`)) {
    document.head.appendChild(link);
  }
}
