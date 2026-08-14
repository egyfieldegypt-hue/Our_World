import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import SectionHeading from './shared/SectionHeading';
import { IconHeart, IconMail } from './shared/icons';

export default function Letters() {
  const { t, lang } = useLanguage();
  const { letters } = useData();
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState(null);

  return (
    <section id="letters" className="relative px-6 py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_32%_at_20%_15%,rgba(37,18,40,0.55),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="letters.eyebrow" title="letters.title" subtitle="letters.subtitle" />

        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid gap-6 sm:grid-cols-2"
        >
          {letters.map((letter, i) => {
            const isOpen = openId === letter.id;

            return (
              <li key={letter.id} className="perspective-card">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: (i % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  animate={{ rotateY: isOpen ? 180 : 0 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative min-h-[300px] transition-[transform] duration-700 [transition-timing-function:cubic-bezier(0.4,0.1,0.2,1)]"
                >
                  {/* FRONT — sealed envelope */}
                  <div
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface via-[#1d1720] to-ink p-7 text-center"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-40"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${letter.accent}26, transparent 60%)` }}
                    />
                    <span
                      aria-hidden="true"
                      className="relative grid size-20 place-items-center rounded-full border"
                      style={{ borderColor: `${letter.accent}66`, background: 'rgba(245,239,230,0.03)' }}
                    >
                      <span className="absolute inset-2 rounded-full border border-dashed" style={{ borderColor: `${letter.accent}44` }} />
                      <IconMail className="size-7" style={{ color: letter.accent }} />
                    </span>
                    <h3 className="relative font-display text-2xl font-bold leading-snug text-cream">
                      {letter.trigger[lang]}
                    </h3>
                    <span
                      className="relative rounded-full px-4 py-1.5 text-sm font-bold"
                      style={{ background: `${letter.accent}1f`, color: letter.accent }}
                    >
                      {t('letters.open')} ✉
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenId(letter.id)}
                      aria-label={`${t('letters.open')} — ${letter.trigger[lang]}`}
                      className="absolute inset-0 cursor-pointer"
                    />
                  </div>

                  {/* BACK — the letter itself */}
                  <div
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    className="absolute inset-0 flex flex-col rounded-3xl border border-gold/25 bg-[#f8f2e7] p-7 text-ink shadow-[0_24px_70px_-24px_rgba(201,168,106,0.35)]"
                  >
                    <div className="flex items-center justify-between gap-3 pb-4">
                      <span className="inline-flex items-center gap-2 font-display text-sm font-bold tracking-wide uppercase">
                        <IconHeart className="size-4" style={{ color: letter.accent }} />
                        {t('letters.forYou')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpenId(null)}
                        aria-label={t('letters.close')}
                        className="rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-bold text-ink/60 transition-colors hover:border-ink/35 hover:text-ink"
                      >
                        {t('letters.close')}
                      </button>
                    </div>
                    <div className="hairline-dark" aria-hidden="true" />

                    <div className="scroll-area flex-1 overflow-y-auto pe-2">
                      <div className="space-y-4 pt-5">
                        {letter.content[lang].map((para, pi) => (
                          <p key={pi} className="leading-[2] text-ink/85">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>

                    <p className="pt-5 text-end font-display text-sm font-bold italic" style={{ color: letter.accent }}>
                      — {t('letters.sig')}
                    </p>

                    {/* wax seal */}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-4 -end-3 grid size-14 -rotate-12 place-items-center rounded-full text-cream/90 shadow-lg"
                      style={{ background: `radial-gradient(circle at 35% 30%, ${letter.accent}, #3d1522)` }}
                    >
                      <IconHeart className="size-5" />
                    </span>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}