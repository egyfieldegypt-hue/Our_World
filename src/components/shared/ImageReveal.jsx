import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { storageUrl } from '../../lib/supabase';

/**
 * Cinematic image with a soft mask reveal and graceful SVG-art fallback
 * if a real photo is later added but fails to load.
 */
export default function ImageReveal({ src, alt = '', ratio, className = '', eager = false, fit = 'cover' }) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  const ratioCls =
    ratio === 'auto'
      ? ''
      : ratio === '4/3'
      ? 'aspect-[4/3]'
      : ratio === '16/11'
        ? 'aspect-[16/11]'
        : ratio === '16/10'
          ? 'aspect-[16/10]'
          : ratio === '1/1'
            ? 'aspect-square'
            : ratio === '3/4'
              ? 'aspect-[3/4]'
              : 'aspect-[4/5]';

  const fallbackGradient =
    'bg-[linear-gradient(135deg,#2b1420_0%,#0D0B10_45%,#33101c_100%)]';

  return (
    <motion.div
      initial={
        reduce
          ? false
          : { opacity: 0, scale: 1.06, clipPath: 'inset(0% 4% 0% 4%)' }
      }
      whileInView={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden ${ratioCls} ${fit === 'contain' ? fallbackGradient : ''} ${className}`}
      role="img"
      aria-label={alt || undefined}
    >
      {!failed ? (
        <img
          src={storageUrl(src)}
          alt={alt || ''}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className={`transition-transform duration-700 ease-out ${
            ratio === 'auto'
              ? 'block h-auto w-full'
              : 'absolute inset-0 h-full w-full'
          } ${
            fit === 'contain'
              ? 'object-contain'
              : 'object-cover group-hover:scale-105'
          }`}
        />
      ) : (
        <div className={`${ratio === 'auto' ? 'min-h-64' : 'absolute inset-0'} ${fallbackGradient}`} aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(217,140,154,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(201,168,106,0.12),transparent_50%)]" />
        </div>
      )}
    </motion.div>
  );
}
