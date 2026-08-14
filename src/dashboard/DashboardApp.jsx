import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { supabase } from '../lib/supabase';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Login, { SESSION_KEY, restoreSession } from './Login';
import { Btn, Field, TextArea, TextInput, inputCls } from './fields';
import { AdminsManager, ChaptersManager, LettersManager, MemoryManager, SongsManager } from './managers';

const TABS = ['memories', 'songs', 'letters', 'chapters', 'settings', 'texts', 'admins'];

function SettingsManager() {
  const { t } = useLanguage();
  const { config, refresh } = useData();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      const start = new Date(config.start_date);
      const pad = (n) => String(n).padStart(2, '0');
      setForm({
        start_date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(start.getHours())}:${pad(start.getMinutes())}`,
        names_ar: config.names_ar || '',
        names_en: config.names_en || '',
        story_count: config.story_count ?? 6,
      });
    }
  }, [config]);

  async function save() {
    if (!supabase) return;
    const startDate = form.start_date ? new Date(form.start_date).toISOString() : null;
    const res = await supabase.from('site_config').upsert(
      { id: 1, start_date: startDate, names_ar: form.names_ar, names_en: form.names_en, story_count: form.story_count },
      { onConflict: 'id' },
    );
    if (res.error) {
      window.alert(res.error.message);
      return;
    }
    await refresh();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Field label={t('dashboard.settings.startDate')}>
        <input type="datetime-local" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputCls} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label={t('dashboard.settings.namesAr')} value={form.names_ar} onChange={(v) => setForm({ ...form, names_ar: v })} />
        <TextInput label={t('dashboard.settings.namesEn')} value={form.names_en} onChange={(v) => setForm({ ...form, names_en: v })} />
      </div>
      <div className="w-full sm:max-w-[12rem]">
        <TextInput label={t('dashboard.settings.storyCount')} type="number" value={form.story_count} onChange={(v) => setForm({ ...form, story_count: Number(v) || 0 })} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Btn variant="gold" onClick={save} className="w-full sm:w-auto">
          {t('dashboard.settings.save')}
        </Btn>
        {saved && <span className="text-sm text-gold">✓ {t('dashboard.actions.saved')}</span>}
      </div>
    </div>
  );
}

function TextsManager() {
  const { t, refreshTexts } = useLanguage();
  const [ar, setAr] = useState('{}');
  const [en, setEn] = useState('{}');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('site_config')
      .select('text_ar,text_en')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAr(JSON.stringify(data.text_ar || {}, null, 2));
          setEn(JSON.stringify(data.text_en || {}, null, 2));
        }
      });
  }, []);

  async function save() {
    let arJson;
    let enJson;
    try {
      arJson = JSON.parse(ar || '{}');
      enJson = JSON.parse(en || '{}');
    } catch {
      setError(t('dashboard.texts.parseError'));
      return;
    }
    setError('');
    if (!supabase) return;
    const res = await supabase.from('site_config').upsert({ id: 1, text_ar: arJson, text_en: enJson }, { onConflict: 'id' });
    if (res.error) {
      window.alert(res.error.message);
      return;
    }
    await refreshTexts();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  async function reset() {
    setAr('{}');
    setEn('{}');
    if (!supabase) return;
    await supabase.from('site_config').upsert({ id: 1, text_ar: {}, text_en: {} }, { onConflict: 'id' });
    await refreshTexts();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <p className="text-sm text-cream/45">{t('dashboard.texts.hint')}</p>
      <div className="grid gap-3 lg:grid-cols-2">
        <TextArea label={t('dashboard.texts.ar')} rows={16} value={ar} onChange={setAr} className="h-full" />
        <TextArea label={t('dashboard.texts.en')} rows={16} value={en} onChange={setEn} className="h-full" />
      </div>
      {error && <p className="text-sm text-rose">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Btn variant="gold" onClick={save} className="w-full sm:w-auto">
          {t('dashboard.texts.save')}
        </Btn>
        <Btn onClick={reset} className="w-full sm:w-auto">{t('dashboard.texts.reset')}</Btn>
        {saved && <span className="text-sm text-gold">✓ {t('dashboard.actions.saved')}</span>}
      </div>
    </div>
  );
}

const MANAGERS = {
  memories: MemoryManager,
  songs: SongsManager,
  letters: LettersManager,
  chapters: ChaptersManager,
  settings: SettingsManager,
  texts: TextsManager,
  admins: AdminsManager,
};

export default function DashboardApp() {
  const { t } = useLanguage();
  const [authed, setAuthed] = useState(() => restoreSession());
  const [tab, setTab] = useState('memories');

  if (!supabase) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-ink">
        <p className="text-cream/50">Env variables missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)</p>
      </div>
    );
  }

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const Active = MANAGERS[tab];
  const tabCls = (active) =>
    `min-h-11 shrink-0 snap-start rounded-full px-4 py-2 text-sm font-bold transition-colors ${
      active ? 'bg-gold/15 text-gold' : 'text-cream/55 hover:text-cream'
    }`;

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/بينّا.svg"
              alt="بينّا"
              draggable={false}
              className="h-10 w-auto shrink-0 drop-shadow-[0_2px_10px_rgba(196,162,103,0.25)] sm:h-11"
            />
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-black sm:text-lg">{t('dashboard.title')}</h1>
              <p className="hidden truncate text-xs text-cream/40 sm:block">{t('dashboard.welcome')}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" />
            <a href="#home" className="hidden rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-cream/60 transition-colors hover:border-gold/50 hover:text-gold md:block">
              {t('dashboard.backToSite')}
            </a>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setAuthed(false);
              }}
              className="min-h-10 rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-cream/60 transition-colors hover:border-rose/50 hover:text-rose sm:px-4"
            >
              {t('dashboard.signOut')}
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-6xl overflow-x-auto px-3 pb-3 sm:px-4" aria-label={t('dashboard.title')}>
          <div className="flex snap-x gap-1.5 pb-1">
            {TABS.map((key) => (
              <button key={key} type="button" onClick={() => setTab(key)} className={tabCls(tab === key)}>
                {t(`dashboard.tabs.${key}`)}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8">
        <Active />
      </main>
    </div>
  );
}
