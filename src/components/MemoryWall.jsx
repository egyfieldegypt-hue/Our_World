import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { CATEGORY_KEYS } from '../data/memories';
import { formatDate } from '../utils/format';
import SectionHeading from './shared/SectionHeading';
import ImageReveal from './shared/ImageReveal';
import MemoryLightbox from './MemoryLightbox';
import { IconHeart, IconSpark } from './shared/icons';

export default function MemoryWall() {
  const { t, lang } = useLanguage();
  const { memories } = useData();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [activeIndex, setActiveIndex] = useState(null);

  const visible = useMemo(
    () => {
      const onlyWall = memories.filter((m) => m.section !== 'timeline');
      return filter === 'all'
        ? onlyWall
        : onlyWall.filter((m) => m.categories.includes(filter));
    },
    [filter, memories],
  );

  return (
    <section id="memories" className="relative px-6 py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_30%_at_85%_20%,rgba(43,20,32,0.5),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading eyebrow="wall.eyebrow" title="wall.title" subtitle="wall.subtitle" />

        {/* filters */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-12 flex flex-wrap justify-center gap-2.5"
          role="group"
          aria-label={t('aria.filter')}
        >
          {CATEGORY_KEYS.map((key) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={isActive}
                className={`relative rounded-full border px-5 py-2 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'border-gold/60 bg-gold/15 text-gold'
                    : 'border-white/10 bg-white/[0.03] text-cream/60 hover:border-white/25 hover:text-cream'
                }`}
              >
                {t(`wall.filters.${key}`)}
              </button>
            );
          })}
        </motion.div>

        {/* masonry */}
        {visible.length > 0 ? (
          <motion.div
            layout
            className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3"
          >
            {visible.map((m, idx) => (
              <motion.button
                key={m.id}
                layout
                type="button"
                onClick={() => setActiveIndex(memories.indexOf(m))}
                aria-label={`${t('wall.open')} — ${m.title[lang]}`}
                initial={reduce ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.75, delay: (idx % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/5 text-start focus-visible:outline-gold"
              >
                <div className="relative">
                  <ImageReveal src={m.image} alt={m.title[lang]} ratio={m.aspect} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <div>
                      <p className="text-xs font-semibold text-rose/90">
                        {formatDate(m.date, lang)}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-cream">
                        {m.title[lang]}
                      </h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 translate-y-2 place-items-center rounded-full border border-gold/40 bg-ink/60 text-gold opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <IconSpark className="size-4" />
                    </span>
                  </div>

                  {m.categories.includes('favorites') && (
                    <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-burgundy/85 px-3 py-1 text-[11px] font-bold text-cream/95 backdrop-blur-sm">
                      <IconHeart className="size-3 text-rose" />
                      {t('wall.favorite')}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <p className="mt-16 text-center text-cream/50">{t('wall.empty')}</p>
        )}
      </div>

      <MemoryLightbox
        memories={memories}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onMove={setActiveIndex}
      />
    </section>
  );
}