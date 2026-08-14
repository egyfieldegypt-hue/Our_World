import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { formatCount } from '../utils/format';
import SectionHeading from './shared/SectionHeading';

function getDiff(start) {
  const startMs = new Date(start).getTime();
  const now = Date.now();
  const diff = Number.isFinite(startMs) ? Math.max(0, now - startMs) : 0;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export default function Counter() {
  const { t, lang } = useLanguage();
  const { config } = useData();
  const reduce = useReducedMotion();
  const start = config.start_date || new Date().toISOString();
  const [time, setTime] = useState(() => getDiff(start));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setTime(getDiff(start)), 1000);
    return () => window.clearInterval(id);
  }, [start]);

  const units = [
    { key: 'days', value: time.days, pad: false },
    { key: 'hours', value: time.hours, pad: true },
    { key: 'minutes', value: time.minutes, pad: true },
    { key: 'seconds', value: time.seconds, pad: true },
  ];

  return (
    <section id="counter" className="relative px-6 py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_50%,rgba(90,38,52,0.22),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading eyebrow="counter.eyebrow" title="counter.title" subtitle={null} />

        <div
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4"
          role="timer"
          aria-label={t('aria.counterLabel')}
        >
          {units.map((unit, i) => (
            <motion.div
              key={unit.key}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-4 py-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-60"
                style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(201,168,106,0.14), transparent 75%)' }}
              />
              <span className="relative font-display text-4xl font-black tabular-nums text-cream sm:text-5xl">
                {mounted ? formatCount(unit.value, lang, { pad: unit.pad }) : null}
              </span>
              <span className="relative text-sm font-semibold text-gold/85">{t(`counter.units.${unit.key}`)}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 text-center font-display text-xl font-semibold text-rose/85"
        >
          {t('counter.still')}
        </motion.p>
      </div>
    </section>
  );
}