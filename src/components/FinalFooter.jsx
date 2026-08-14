import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { SESSION_KEY } from '../dashboard/Login';
import { IconArrowUp, IconHeart } from './shared/icons';

function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  window.location.reload();
}

export default function FinalFooter() {
  const { t, lang, isAr } = useLanguage();
  const { config } = useData();
  const reduce = useReducedMotion();
  const names = { ar: config.names_ar, en: config.names_en };

  const lines = [
    { key: 'final.line1', cls: 'text-cream' },
    { key: 'final.line2', cls: 'text-gradient-gold' },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* final statement */}
      <div className="relative px-6 pb-24 pt-12 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_20%,rgba(90,38,52,0.3),transparent_75%)]"
        />

        <div className="relative mx-auto max-w-3xl">
          {lines.map((line, i) => (
            <motion.h2
              key={line.key}
              initial={reduce ? false : { opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              className={`font-display text-4xl font-black leading-[1.5] sm:text-6xl ${line.cls}`}
            >
              {t(line.key)}
            </motion.h2>
          ))}

          {/* brand seal */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 flex flex-col items-center gap-4"
          >
            <span
              aria-hidden="true"
              className="relative grid size-20 place-items-center rounded-full border border-gold/40 bg-gold/8"
            >
              <span className="absolute inset-2 rounded-full border border-dashed border-gold/30" />
              <motion.span
                animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <IconHeart className="size-7 text-rose" />
              </motion.span>
            </span>
            <p className="font-display text-4xl font-black tracking-wide text-cream">
              {isAr ? 'بينّا' : 'BAYNA'}
            </p>
            <p className="text-sm tracking-[0.3em] uppercase text-gold/80">
              {t('brand.tagline')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* footer bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-cream/45">
            {t('footer.madeFor', { names: names[lang] })}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex items-center gap-5 text-xs text-cream/35">
              <span>{t('brand.full')}</span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden="true" />
              <span>{t('footer.rights')}</span>
            </div>
            <a href="#/dashboard" className="text-xs font-semibold text-cream/45 transition-colors hover:text-gold">
              {t('footer.dashboard')}
            </a>
            <button
              type="button"
              onClick={logout}
              className="text-xs font-semibold text-cream/45 transition-colors hover:text-rose"
            >
              {t('footer.logout')}
            </button>
          </div>

          <a
            href="#home"
            aria-label={t('aria.backToTop')}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-cream/60 transition-colors hover:border-gold/50 hover:text-gold"
          >
            {t('footer.top')}
            <IconArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}