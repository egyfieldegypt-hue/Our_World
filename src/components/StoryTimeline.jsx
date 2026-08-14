import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { formatDate } from '../utils/format';
import SectionHeading from './shared/SectionHeading';
import ImageReveal from './shared/ImageReveal';
import { IconHeart, IconPin } from './shared/icons';

/**
 * Alternating vertical timeline. Built purely with logical properties
 * (ms-/me-, start-, text-start/end) so it mirrors itself in RTL.
 */
export default function StoryTimeline() {
  const { t, lang } = useLanguage();
  const { memories, config } = useData();
  const reduce = useReducedMotion();
  const items = memories.filter((m) => m.section !== 'wall').slice(0, config.story_count || 6);

  return (
    <section id="story" className="relative px-6 py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_0%,rgba(90,38,52,0.25),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-8xl">
        <SectionHeading eyebrow="story.eyebrow" title="story.title" subtitle="story.subtitle" />

        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* spine — mobile: inline-start rail · desktop: center */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 top-0 start-5 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent rtl:translate-x-1/2 sm:start-1/2"
          />

          <ul className="flex flex-col gap-16 sm:gap-20">
            {items.map((m, i) => {
              const onStart = i % 2 === 0; // inline-start side in LTR = left, in RTL = right
              const dateText = formatDate(m.date, lang);

              return (
                <li
                  key={m.id}
                  className={`relative flex w-full ps-14 text-start sm:w-[calc(50%_-_2.75rem)] sm:ps-0 ${
                    onStart ? 'sm:me-auto sm:text-end' : 'sm:ms-auto'
                  }`}
                >
                  {/* node on the spine */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-6 z-10 grid size-5 -translate-x-1/2 place-items-center rounded-full border border-gold/50 bg-ink rtl:translate-x-1/2 sm:start-auto ${
                      onStart
                        ? 'start-5 sm:end-[-2.75rem] sm:translate-x-1/2 sm:rtl:-translate-x-1/2'
                        : 'start-5 sm:ltr:start-[-2.75rem] sm:rtl:end-[-2.75rem] sm:-translate-x-1/2'
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-gold/90" />
                  </span>

                  <motion.article
                    initial={reduce ? false : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="group w-full"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-rose/30 bg-rose/10 px-3.5 py-1 text-sm font-bold text-rose">
                        {dateText}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-cream/45">
                        <IconPin className="size-3.5 text-gold/70" />
                        {m.location[lang]}
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-white/5 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.8)]">
                      <ImageReveal src={m.image} alt={m.title[lang]} ratio="auto" fit="contain" />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                      />
                      {m.categories.includes('favorites') && (
                        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-burgundy/80 px-3 py-1 text-xs font-bold text-cream/90 backdrop-blur-sm">
                          <IconHeart className="size-3.5 text-rose" />
                          {t('wall.favorite')}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-bold text-cream sm:text-[1.7rem]">
                      {m.title[lang]}
                    </h3>
                    <p className="mt-2 leading-relaxed text-cream/60">{m.description[lang]}</p>
                  </motion.article>
                </li>
              );
            })}
          </ul>

          {/* timeline endcap */}
          <div className="relative mt-20 flex flex-col items-center gap-2 text-sm text-cream/40">
            <span className="hairline w-24" aria-hidden="true" />
            <IconHeart className="size-4 text-rose/70" />
            <span>{t('story.timelineLabel')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
