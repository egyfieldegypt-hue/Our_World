import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { formatDate } from '../utils/format';

export default function Hero() {
  const { t, lang } = useLanguage();
  const { config } = useData();
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const sinceDate = formatDate((config.start_date || '').split('T')[0], lang);
  const headlineLines = [t('hero.headline1'), t('hero.headline2')];

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* cinematic backdrop */}
      <motion.div style={reduce ? undefined : { y: bgY }} className="absolute inset-0">
        <img
          src="/images/hero.svg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_38%,rgba(201,168,106,0.14),transparent_70%)]" />
      </motion.div>

      {/* content */}
      <motion.div
        style={reduce ? undefined : { y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-32 text-center"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.35em] text-gold"
        >
          <span className="hairline w-10" aria-hidden="true" />
          {t('hero.label')}
          <span className="hairline w-10" aria-hidden="true" />
        </motion.p>

        <h1 className="font-display font-black leading-[1.45] text-cream">
          {headlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-1">
              <motion.span
                initial={reduce ? false : { y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`block text-[clamp(2.1rem,7vw,4.6rem)] ${i === 1 ? 'text-gradient-gold' : ''}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg text-rose/85"
        >
          {t('hero.sub')}
        </motion.p>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="mt-3 text-sm tracking-wide text-cream/45"
        >
          {t('hero.since', { date: sinceDate })}
        </motion.p>

        <motion.a
          href="#story"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduce ? undefined : { scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-gold/35 bg-gold/10 px-8 py-3.5 font-semibold text-gold backdrop-blur-sm transition-colors duration-300 hover:border-gold/60 hover:bg-gold/20"
        >
          {t('hero.cta')}
        </motion.a>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 rtl:translate-x-1/2"
        aria-hidden="true"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-10 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}