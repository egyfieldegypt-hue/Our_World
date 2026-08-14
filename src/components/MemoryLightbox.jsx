import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { formatDate } from '../utils/format';
import { storageUrl } from '../lib/supabase';
import { IconChevronRight, IconClose, IconPin } from './shared/icons';

/**
 * Fullscreen lightbox — direction-aware: arrows and keyboard navigation
 * follow the current RTL/LTR reading direction.
 */
export default function MemoryLightbox({ memories, index, onClose, onMove }) {
  const { t, lang } = useLanguage();
  const closeRef = useRef(null);
  const scrollYRef = useRef(0);

  const current = index != null ? memories[index] : null;
  const total = memories.length;

  const step = (dir) => {
    if (index == null) return;
    onMove((index + dir + total) % total);
  };

  useEffect(() => {
    if (index == null) return;
    scrollYRef.current = window.scrollY;
    const { style } = document.body;
    const previous = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
    };

    style.position = 'fixed';
    style.top = `-${scrollYRef.current}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 50);

    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.left = previous.left;
      style.right = previous.right;
      style.width = previous.width;
      style.overflow = previous.overflow;
      window.scrollTo(0, scrollYRef.current);
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
  }, [index, onClose, step]);

  return (
    <AnimatePresence>
      {current && index != null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={current.title[lang]}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* top bar */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-sm font-semibold tracking-wide text-cream/60" aria-live="polite">
              {t('lightbox.counter', { current: index + 1, total })}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('lightbox.close')}
              className="grid size-11 place-items-center rounded-full border border-white/10 text-cream/80 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <IconClose className="size-5" />
            </button>
          </div>

          {/* stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20">
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t('lightbox.next')}
              className="absolute right-3 z-10 grid size-12 place-items-center rounded-full border border-white/10 bg-ink/50 text-cream/80 backdrop-blur-sm transition-all hover:border-gold/50 hover:text-gold sm:right-6"
            >
              <IconChevronRight className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t('lightbox.prev')}
              className="absolute left-3 z-10 grid size-12 place-items-center rounded-full border border-white/10 bg-ink/50 text-cream/80 backdrop-blur-sm transition-all hover:border-gold/50 hover:text-gold sm:left-6"
            >
              <IconChevronRight className="size-5 rotate-180" />
            </button>

            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-h-full w-full max-w-5xl flex-col items-center gap-5"
              >
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.9)] sm:w-[70%]">
                  <img
                    src={storageUrl(current.image)}
                    alt={current.title[lang]}
                    className="max-h-[62vh] w-full object-cover"
                  />
                </div>

                <figcaption className="max-w-2xl px-2 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="rounded-full border border-rose/30 bg-rose/10 px-3.5 py-1 text-sm font-bold text-rose">
                      {formatDate(current.date, lang)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-cream/50">
                      <IconPin className="size-3.5 text-gold/70" />
                      {current.location[lang]}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-cream sm:text-3xl">
                    {current.title[lang]}
                  </h3>
                  <p className="mt-2 leading-relaxed text-cream/65">{current.description[lang]}</p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
