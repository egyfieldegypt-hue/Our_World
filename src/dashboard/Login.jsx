import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { supabase } from '../lib/supabase';
import { AUTH } from './secret';
import { hashAdminPassword, safeEq } from './auth';
import { Btn, Field, inputCls } from './fields';

export const SESSION_KEY = 'bayna-session';
const SESSION_TTL = 12 * 60 * 60 * 1000;
const MAX_FAILS = 5;
const LOCK_MS = 30 * 1000;

export function restoreSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { at } = JSON.parse(raw);
    return Date.now() - at < SESSION_TTL;
  } catch {
    return false;
  }
}

async function checkBundledAdmin(username, password) {
  const hash = await hashAdminPassword(username, password, AUTH.salt);
  return username.trim().toLowerCase() === AUTH.username.toLowerCase() && safeEq(hash, AUTH.hash);
}

async function checkDatabaseAdmin(username, password) {
  if (!supabase) return false;
  const normalized = username.trim().toLowerCase();
  const { data, error } = await supabase
    .from('admins')
    .select('username,salt,password_hash')
    .eq('username', normalized)
    .maybeSingle();
  if (error) return false;
  if (!data) return false;
  const hash = await hashAdminPassword(normalized, password, data.salt);
  return safeEq(hash, data.password_hash);
}

export default function Login({ onSuccess, title, subtitle, hideBackToSite }) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [fails, setFails] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (Date.now() < lockedUntil) {
      const id = window.setInterval(() => setNow(Date.now()), 500);
      return () => window.clearInterval(id);
    }
  }, [lockedUntil]);

  const lockLeft = Math.ceil((lockedUntil - now) / 1000);

  async function submit(e) {
    e.preventDefault();
    if (Date.now() < lockedUntil) return;
    setBusy(true);
    setError('');
    try {
      const ok = (await checkDatabaseAdmin(username, password)) || (await checkBundledAdmin(username, password));
      if (ok) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ at: Date.now() }));
        setFails(0);
        onSuccess();
      } else {
        const n = fails + 1;
        setFails(n);
        if (n >= MAX_FAILS) {
          setLockedUntil(Date.now() + LOCK_MS);
          setFails(0);
          setError(t('dashboard.auth.locked', { seconds: Math.ceil(LOCK_MS / 1000) }));
        } else {
          setError(t('dashboard.auth.invalid'));
        }
      }
    } catch (err) {
      setError(t('dashboard.auth.generic', { message: err.message }));
    } finally {
      setBusy(false);
      setPassword('');
    }
  }

  const locked = Date.now() < lockedUntil;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink px-4 py-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <img
            src="/بينّا.svg"
            alt="بينّا"
            draggable={false}
            className="mx-auto mb-4 h-16 w-auto drop-shadow-[0_2px_14px_rgba(196,162,103,0.3)]"
          />
          <h1 className="font-display text-3xl font-black text-cream">{title ?? t('dashboard.title')}</h1>
          <p className="mt-1 text-sm text-cream/45">{subtitle ?? t('dashboard.subtitle')}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-surface/70 p-4 sm:p-6">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field label={t('dashboard.username')}>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
                dir="ltr"
              />
            </Field>
            <Field label={t('dashboard.password')}>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                dir="ltr"
              />
            </Field>

            {error && <p className="text-sm text-rose">{error}</p>}
            {locked && lockLeft > 0 && (
              <p className="text-sm text-cream/50" dir="ltr">
                ⏳ {lockLeft}s
              </p>
            )}

            <Btn type="submit" variant="gold" className="w-full py-3" disabled={busy || locked}>
              {busy ? '…' : t('dashboard.signIn')}
            </Btn>
          </form>
        </div>

        {!hideBackToSite && (
          <div className="mt-5 text-center">
            <a href="#home" className="text-sm text-gold/70 transition-colors hover:text-gold">
              ← {t('dashboard.backToSite')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
