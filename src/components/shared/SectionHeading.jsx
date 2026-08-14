import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Centered section heading: eyebrow — title — subtitle.
 * All text comes from the translation system via the `key` props.
 */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const alignCls =
    align === 'center' ? 'items-center text-center' : 'items-start text-start';

  return (
    <div className={`flex flex-col gap-4 ${alignCls}`}>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 text-gold/90 text-sm font-semibold tracking-widest uppercase"
      >
        <span className="hairline w-8" aria-hidden="true" />
        {t(eyebrow)}
        <span className="hairline w-8" aria-hidden="true" />
      </motion.p>

      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-[1.35] sm:leading-[1.3]"
      >
        {t(title)}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl text-rose/80 text-lg leading-relaxed"
        >
          {t(subtitle)}
        </motion.p>
      )}
    </div>
  );
}