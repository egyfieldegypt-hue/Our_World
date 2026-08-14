import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { storageUrl } from '../lib/supabase';
import SectionHeading from './shared/SectionHeading';
import { IconChevronRight } from './shared/icons';

const ORDINALS = ['one', 'two', 'three', 'four'];

export default function MovieChapters() {
  const { t, lang, isAr } = useLanguage();
  const { chapters } = useData();
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section id="movie" className="relative px-6 py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_32%_at_80%_12%,rgba(43,20,32,0.5),transparent_70%)]"
      />

      <div ref={ref} className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="movie.eyebrow" title="movie.title" subtitle="movie.subtitle" />

        <div className="mt-20 flex flex-col gap-24 sm:gap-32">
          {chapters.map((chapter, i) => {
            const flipSide = i % 2 === 1;
            return (
              <div
                key={chapter.id}
                className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                {/* ghost number */}
                <span
                  aria-hidden="true"
                  className="ghost-number pointer-events-none absolute -top-14 font-display text-[7rem] font-black leading-none sm:text-[10rem] lg:-top-20"
                  style={{ insetInlineStart: flipSide ? 0 : undefined, insetInlineEnd: flipSide ? undefined : 0 }}
                >
                  {chapter.number}
                </span>

                {/* image */}
                <motion.div
                  style={reduce ? undefined : { y }}
                  className={`relative ${flipSide ? 'lg:order-2' : ''}`}
                >
                  <div className="overflow-hidden rounded-3xl border border-white/8 bg-black/55 shadow-[0_26px_80px_-28px_rgba(0,0,0,0.9)]">
                    <motion.div
                      initial={reduce ? false : { opacity: 0, scale: 1.12 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img
                        src={storageUrl(chapter.image)}
                        alt={t('aria.chapterImage', { title: chapter.title[lang] })}
                        loading="lazy"
                        className="h-auto max-h-[72vh] w-full object-contain"
                      />
                    </motion.div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_70%_20%,rgba(201,168,106,0.08),transparent_50%)]"
                  />
                </motion.div>

                {/* text */}
                <div className={flipSide ? 'lg:order-1' : ''}>
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/8 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-gold">
                      {t('movie.chapter', { n: isAr ? ORDINALS[i] : chapter.number })}
                    </p>
                    <h3 className="mt-5 font-display text-3xl font-bold text-cream sm:text-4xl">
                      {chapter.title[lang]}
                    </h3>
                    <p className="mt-4 max-w-md leading-relaxed text-cream/60">
                      {chapter.description[lang]}
                    </p>

                    {i < chapters.length - 1 && (
                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cream/35">
                        {t('movie.nextChapter')}
                        <IconChevronRight className="arrow-forward size-4" />
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
