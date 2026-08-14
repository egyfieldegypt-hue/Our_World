import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const LOCALES = { ar, en };
const STORAGE_KEY = 'bayna-lang';
const DEFAULT_LANG = 'ar';
const SUPPORTED = ['ar', 'en'];

function deepMerge(base, overrides) {
  if (!overrides || typeof overrides !== 'object') return base;
  const out = { ...base };
  for (const [k, v] of Object.entries(overrides)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object') {
      out[k] = deepMerge(base[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  });
  const [overrides, setOverrides] = useState({ ar: null, en: null });

  const refreshTexts = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase.from('site_config').select('text_ar,text_en').eq('id', 1).maybeSingle();
      if (data) {
        setOverrides({
          ar: data.text_ar && typeof data.text_ar === 'object' ? data.text_ar : null,
          en: data.text_en && typeof data.text_en === 'object' ? data.text_en : null,
        });
      }
    } catch {
      /* tables not ready yet — bundled texts stay */
    }
  }, []);

  useEffect(() => {
    refreshTexts();
  }, [refreshTexts]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode — ignore */
    }
  }, [lang]);

  const dict = useMemo(() => ({ ar: deepMerge(ar, overrides.ar), en: deepMerge(en, overrides.en) }), [overrides]);

  const t = useCallback(
    (key, vars) => {
      let text = resolvePath(dict[lang], key) ?? resolvePath(dict.ar, key) ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.split(`{${k}}`).join(String(v));
        }
      }
      return text;
    },
    [dict, lang],
  );

  const value = useMemo(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      isAr: lang === 'ar',
      setLang,
      t,
      refreshTexts,
    }),
    [lang, t, refreshTexts],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}