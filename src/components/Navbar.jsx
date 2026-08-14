import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { IconClose, IconMenu } from './shared/icons';

const NAV_KEYS = [
  { key: 'nav.home', href: '#home' },
  { key: 'nav.story', href: '#story' },
  { key: 'nav.memories', href: '#memories' },
  { key: 'nav.soundtrack', href: '#soundtrack' },
  { key: 'nav.letters', href: '#letters' },
];

export default function Navbar() {
  const { t, isAr } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const brandName = isAr ? 'بداية الحكاية' : 'Story Start';

  const goToSection = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    window.setTimeout(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, 120);
  };

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      >
        <nav
          aria-label={t('aria.menu')}
          className={`mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full py-2 pe-2 ps-5 transition-all duration-500 ${
            scrolled ? 'glass shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)]' : 'border border-transparent'
          }`}
        >
          <a
            href="#home"
            className="group flex items-center gap-2.5 font-display text-lg font-extrabold text-cream"
          >
            <img
              src="/بينّا.svg"
              alt="بينّا"
              draggable={false}
              className="h-9 w-auto drop-shadow-[0_2px_10px_rgba(196,162,103,0.25)] transition-transform duration-500 group-hover:scale-105"
            />
            {brandName}
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_KEYS.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="group relative rounded-full px-3.5 py-1.5 text-sm font-semibold text-cream/70 transition-colors duration-300 hover:text-cream"
              >
                {t(item.key)}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 -bottom-0.5 h-px origin-center scale-x-0 bg-gold/80 transition-transform duration-300 group-hover:scale-x-100"
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#/dashboard"
              className="hidden items-center rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-bold text-gold transition-colors hover:bg-gold/20 sm:flex"
            >
              {t('footer.dashboard')}
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t('aria.menu')}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cream transition-colors hover:border-gold/40 hover:text-gold lg:hidden"
            >
              <IconMenu className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/97 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={t('aria.menu')}
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="flex items-center gap-2.5 font-display text-lg font-extrabold text-cream">
                <img src="/بينّا.svg" alt="بينّا" draggable={false} className="h-8 w-auto" />
                {brandName}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('aria.closeMenu')}
                className="grid size-11 place-items-center rounded-full border border-white/10 text-cream hover:border-gold/40 hover:text-gold"
              >
                <IconClose className="size-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-start justify-center gap-1 px-8">
              {NAV_KEYS.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => goToSection(e, item.href)}
                  initial={{ opacity: 0, x: isAr ? 28 : -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-center gap-3 py-2.5 font-display text-3xl font-bold text-cream/85 transition-colors hover:text-gold"
                >
                  <span className="text-sm font-semibold text-gold/60 group-hover:text-gold" aria-hidden="true">
                    0{i + 1}
                  </span>
                  {t(item.key)}
                </motion.a>
              ))}
            </nav>

            <div className="flex justify-center pb-10">
              <a
                href="#/dashboard"
                className="rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-bold text-gold transition-colors hover:bg-gold/20"
              >
                {t('footer.dashboard')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}