import { useLanguage } from '../hooks/useLanguage';

/**
 * Minimal, elegant bilingual switcher — «العربية | EN»
 * Active pill slides logically (respects RTL/LTR via inset-inline utilities).
 */
export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, t } = useLanguage();
  const isAr = lang === 'ar';

  const baseBtn =
    'relative z-10 flex-1 cursor-pointer rounded-full px-3 py-1.5 text-sm font-bold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-gold/70';
  const active = 'text-cream';
  const idle = 'text-cream/50 hover:text-cream/80';

  return (
    <div
      className={`relative flex w-[8.6rem] items-center rounded-full border border-white/10 bg-white/[0.04] p-1 ${className}`}
      role="group"
      aria-label={t('aria.switchLanguage')}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 w-1/2 rounded-full bg-gold/15 transition-[inset-inline-start] duration-500 ease-out ${
          isAr ? 'start-1' : 'start-1/2'
        }`}
      />

      <button
        type="button"
        onClick={() => setLang('ar')}
        aria-pressed={isAr}
        aria-label={t('aria.languageArabic')}
        className={`${baseBtn} ${isAr ? active : idle}`}
      >
        العربية
      </button>

      <span aria-hidden="true" className="relative z-10 text-cream/25 text-xs">
        |
      </span>

      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={!isAr}
        aria-label={t('aria.languageEnglish')}
        className={`${baseBtn} ${!isAr ? active : idle}`}
      >
        EN
      </button>
    </div>
  );
}