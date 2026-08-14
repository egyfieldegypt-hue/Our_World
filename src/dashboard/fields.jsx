import { useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { storageUrl, supabase } from '../lib/supabase';

export const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-base text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold/50 sm:py-2.5 sm:text-sm';

export function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-cream/55">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ label, value, onChange, className = '', type = 'text', step }) {
  return (
    <Field label={label} className={className}>
      <input
        type={type}
        step={step}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  );
}

export function TextArea({ label, value, onChange, className = '', rows = 3 }) {
  return (
    <Field label={label} className={className}>
      <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${inputCls} resize-y leading-relaxed`} />
    </Field>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value || '') ? value : '#D98C9A'}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-transparent sm:h-10 sm:w-14"
        />
        <TextInput value={value} onChange={onChange} className="flex-1" />
      </div>
    </Field>
  );
}

export function ImageField({ label, value, onChange }) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const src = storageUrl(value);

  async function handleFile(file) {
    if (!file || !supabase) return;
    setBusy(true);
    try {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('bayna').upload(path, file, { upsert: true });
      if (error) throw error;
      onChange(path);
    } catch (e) {
      window.alert(`${t('dashboard.auth.generic', { message: e.message || e })}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-start gap-3">
        {src ? (
          <img src={src} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-white/10 object-cover" />
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-dashed border-white/15 text-xs text-cream/30">
            SVG
          </span>
        )}
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/memories/01.svg"
            className={inputCls}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy || !supabase}
              className="min-h-10 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-2 text-xs font-bold text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
            >
              {busy ? t('dashboard.common.uploading') : t('dashboard.common.upload')}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="min-h-10 rounded-full border border-white/10 px-3.5 py-2 text-xs font-bold text-cream/50 transition-colors hover:border-rose/50 hover:text-rose"
              >
                {t('dashboard.common.removeImage')}
              </button>
            )}
            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>
    </Field>
  );
}

export function AudioField({ label, value, onChange, placeholder = '' }) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);

  async function handleFile(file) {
    if (!file || !supabase) return;
    setBusy(true);
    try {
      const ext = (file.name.split('.').pop() || 'mp3').toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `audio/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('bayna').upload(path, file, { upsert: true });
      if (error) throw error;
      onChange(path);
    } catch (e) {
      window.alert(`${t('dashboard.auth.generic', { message: e.message || e })}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputCls}
            dir="ltr"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy || !supabase}
              className="min-h-10 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-2 text-xs font-bold text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
            >
              {busy ? t('dashboard.common.uploading') : t('dashboard.common.uploadAudio')}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="min-h-10 rounded-full border border-white/10 px-3.5 py-2 text-xs font-bold text-cream/50 transition-colors hover:border-rose/50 hover:text-rose"
              >
                {t('dashboard.common.removeImage')}
              </button>
            )}
            <input
              ref={ref}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>
    </Field>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/90 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)] sm:max-h-[88vh] sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="font-display text-xl font-bold text-cream">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={title}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 text-cream/60 transition-colors hover:border-gold/50 hover:text-gold sm:size-9"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Btn({ children, onClick, variant = 'ghost', className = '', type = 'button', disabled = false }) {
  const styles = {
    gold: 'border border-gold/50 bg-gold/15 text-gold hover:bg-gold/25',
    ghost: 'border border-white/12 bg-white/[0.04] text-cream hover:border-white/25',
    danger: 'border border-rose/40 bg-rose/10 text-rose hover:bg-rose/20',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 rounded-full px-5 py-2.5 text-sm font-bold transition-colors disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
