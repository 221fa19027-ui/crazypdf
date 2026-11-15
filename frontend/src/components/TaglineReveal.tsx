import React, { useEffect, useRef, useState } from 'react';

interface TaglineRevealProps {
  text?: string;
  subtext?: string;
}

export const TaglineReveal: React.FC<TaglineRevealProps> = ({
  text = 'All your documents are automatically shredded within sixty minutes. Zero permanent storage, zero data tracking, and zero subscription traps.',
  subtext = 'Built from the ground up on modern cryptographic principles and C-accelerated document processing engines.',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWordsCount, setActiveWordsCount] = useState<number>(0);
  const words = text.split(' ');

  useEffect(() => {
    // If user prefers reduced motion, show all words immediately
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setActiveWordsCount(words.length);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress between entering viewport (bottom) and center of viewport
      const startTrigger = windowHeight * 0.85;
      const endTrigger = windowHeight * 0.35;

      if (rect.top > startTrigger) {
        setActiveWordsCount(0);
      } else if (rect.top < endTrigger) {
        setActiveWordsCount(words.length);
      } else {
        const progress = Math.max(0, Math.min(1, (startTrigger - rect.top) / (startTrigger - endTrigger)));
        const count = Math.round(progress * words.length);
        setActiveWordsCount(count);
      }
    };

    let animationFrameId: number;
    const throttledScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [words.length]);

  return (
    <section ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-electric-400">
          Our Core Promise
        </p>

        <h2
          className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.25]"
          style={{ textWrap: 'balance' }}
        >
          {words.map((word, idx) => (
            <span
              key={idx}
              className={`tagline-word mr-2.5 sm:mr-3 ${idx < activeWordsCount ? 'active' : ''}`}
            >
              {word}
            </span>
          ))}
        </h2>

        {subtext && (
          <p
            className="pt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            style={{ textWrap: 'pretty' }}
          >
            {subtext}
          </p>
        )}
      </div>
    </section>
  );
};
