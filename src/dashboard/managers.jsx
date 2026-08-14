import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { storageUrl } from '../lib/supabase';
import { Btn, AudioField, ColorField, Field, ImageField, Modal, TextArea, TextInput } from './fields';
import { supabase } from '../lib/supabase';
import { hashAdminPassword, makeSalt } from './auth';
import { IconArrowDown, IconArrowUp } from '../components/shared/icons';

const CATS = ['dates', 'trips', 'random', 'favorites'];
const ASPECTS = ['4/5', '1/1', '3/4', '16/10', '16/11', '4/3'];

async function run(fn) {
  try {
    await fn();
    return true;
  } catch (err) {
    window.alert(err?.message || String(err));
    return false;
  }
}

function LangFields({ item, set, keys }) {
  const { t } = useLanguage();
  return (
    <>
      {keys.map((k) => (
        <div key={k} className="grid gap-3 sm:grid-cols-2">
          <TextInput label={t(`dashboard.common.${k}Ar`)} value={item[k].ar} onChange={(v) => set({ ...item, [k]: { ...item[k], ar: v } })} />
          <TextInput label={t(`dashboard.common.${k}En`)} value={item[k].en} onChange={(v) => set({ ...item, [k]: { ...item[k], en: v } })} />
        </div>
      ))}
    </>
  );
}

function LangTextAreas({ value, onChange, keyBase, rows = 6 }) {
  const { t } = useLanguage();
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <TextArea label={t(`dashboard.common.${keyBase}Ar`)} rows={rows} value={value.ar.join('\n\n')} onChange={(v) => onChange({ ...value, ar: v.split(/\n\s*\n/).filter(Boolean) })} />
      <TextArea label={t(`dashboard.common.${keyBase}En`)} rows={rows} value={value.en.join('\n\n')} onChange={(v) => onChange({ ...value, en: v.split(/\n\s*\n/).filter(Boolean) })} />
    </div>
  );
}

const dbItems = (items) => items.filter((x) => !x._fb);

function ListShell({ items, onAdd, onEdit, onDelete, onMoveUp, onMoveDown, renderRow, empty }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Btn variant="gold" onClick={onAdd} className="w-full justify-center sm:w-auto">
          + {t('dashboard.actions.add')}
        </Btn>
      </div>
      {items.length === 0 ? (
        <p className="py-10 text-center text-cream/40">{empty}</p>
      ) : (
        items.map((it, i) => (
          <div key={it.id} className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <span className="w-8 shrink-0 text-center text-sm font-bold tabular-nums text-gold/60">{i + 1}</span>
              {renderRow(it)}
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:ms-auto sm:flex-nowrap">
              {onMoveUp && onMoveDown && (
                <div className="flex rounded-full border border-white/10">
                  <button
                    type="button"
                    onClick={() => onMoveUp(it, i)}
                    disabled={i === 0}
                    aria-label={t('dashboard.actions.moveUp')}
                    className="grid size-10 place-items-center rounded-full text-cream/40 transition-colors hover:text-gold disabled:opacity-25 sm:size-8"
                  >
                    <IconArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveDown(it, i)}
                    disabled={i === items.length - 1}
                    aria-label={t('dashboard.actions.moveDown')}
                    className="grid size-10 place-items-center rounded-full text-cream/40 transition-colors hover:text-gold disabled:opacity-25 sm:size-8"
                  >
                    <IconArrowDown className="size-3.5" />
                  </button>
                </div>
              )}
              {onEdit && (
                <button type="button" onClick={() => onEdit(it)} className="min-h-10 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-cream/70 transition-colors hover:border-gold/50 hover:text-gold">
                  {t('dashboard.actions.edit')}
                </button>
              )}
              <button type="button" onClick={() => window.confirm(t('dashboard.actions.confirmDelete')) && onDelete(it.id)} className="min-h-10 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-cream/50 transition-colors hover:border-rose/50 hover:text-rose">
                {t('dashboard.actions.delete')}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function EditorModal({ open, title, onClose, onSave, saving, children }) {
  const { t } = useLanguage();
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">{children}</div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Btn onClick={onClose} className="w-full sm:w-auto">{t('dashboard.actions.cancel')}</Btn>
        <Btn variant="gold" onClick={onSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? '…' : t('dashboard.actions.save')}
        </Btn>
      </div>
    </Modal>
  );
}

const emptyMemory = () => ({ sort: 0, date: '', title: { ar: '', en: '' }, description: { ar: '', en: '' }, location: { ar: '', en: '' }, image: '', categories: ['dates'], aspect: '4/5', section: 'both' });

export function MemoryManager() {
  const { t } = useLanguage();
  const { memories, crud } = useData();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({ ...emptyMemory(), sort: dbItems(memories).length });
  }

  async function save() {
    setSaving(true);
    const okk = await run(() => crud.memories.save(editing));
    setSaving(false);
    if (okk) setEditing(null);
  }

  return (
    <>
      <ListShell
        items={dbItems(memories)}
        onAdd={openNew}
        onEdit={setEditing}
        onDelete={(id) => run(() => crud.memories.remove(id))}
        empty={t('dashboard.empty')}
        renderRow={(m) => (
          <>
            <img src={storageUrl(m.image)} alt="" className="hidden h-12 w-12 shrink-0 rounded-lg border border-white/10 object-cover sm:block" />
            <div className="min-w-0">
              <p className="truncate font-display font-bold text-cream">{m.title.ar || m.title.en || '—'}</p>
              <p className="truncate text-xs text-cream/45">{m.date} · {m.location.ar || m.location.en}</p>
            </div>
          </>
        )}
      />
      <EditorModal open={!!editing} title={t('dashboard.tabs.memories')} onClose={() => setEditing(null)} onSave={save} saving={saving}>
        {editing && (
          <>
            <LangFields item={editing} set={setEditing} keys={['title', 'description', 'location']} />
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput label={t('dashboard.common.date')} type="date" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} />
              <Field label={t('dashboard.common.sort')}>
                <input type="number" value={editing.sort} onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) || 0 })} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-cream outline-none focus:border-gold/50" />
              </Field>
              <Field label={t('dashboard.common.aspect')}>
                <select value={editing.aspect} onChange={(e) => setEditing({ ...editing, aspect: e.target.value })} className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-cream outline-none focus:border-gold/50">
                  {ASPECTS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label={t('dashboard.common.section')}>
              <select value={editing.section} onChange={(e) => setEditing({ ...editing, section: e.target.value })} className="w-full rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-cream outline-none focus:border-gold/50">
                <option value="both">{t('dashboard.common.sectionOptions.both')}</option>
                <option value="timeline">{t('dashboard.common.sectionOptions.timeline')}</option>
                <option value="wall">{t('dashboard.common.sectionOptions.wall')}</option>
              </select>
            </Field>
            <Field label={t('dashboard.common.categories')}>
              <div className="flex flex-wrap gap-2">
                {CATS.map((c) => {
                  const on = editing.categories.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditing({ ...editing, categories: on ? editing.categories.filter((x) => x !== c) : [...editing.categories, c] })}
                      className={`min-h-10 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${on ? 'border-gold/60 bg-gold/15 text-gold' : 'border-white/12 text-cream/50 hover:text-cream'}`}
                    >
                      {t(`wall.filters.${c}`)}
                    </button>
                  );
                })}
              </div>
            </Field>
            <ImageField label={t('dashboard.common.image')} value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
          </>
        )}
      </EditorModal>
    </>
  );
}

const emptySong = () => ({ sort: 0, title: { ar: '', en: '' }, artist: { ar: '', en: '' }, audioUrl: '', spotifyUrl: '', isDefault: false, accent: '#D98C9A', chord: [] });

export function AdminsManager() {
  const { t } = useLanguage();
  const [admins, setAdmins] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabase) return;
    const { data, error } = await supabase.from('admins').select('id,username,created_at').order('created_at', { ascending: true });
    if (error) {
      window.alert(error.message);
      return;
    }
    setAdmins(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing({ username: '', password: '' });
  }

  async function save() {
    const username = editing.username.trim().toLowerCase();
    if (!username || !editing.password) return;
    setSaving(true);
    const okk = await run(async () => {
      const salt = makeSalt();
      const password_hash = await hashAdminPassword(username, editing.password, salt);
      const res = await supabase.from('admins').insert({ username, salt, password_hash });
      if (res.error) throw res.error;
      await load();
    });
    setSaving(false);
    if (okk) setEditing(null);
  }

  async function remove(id) {
    if (!window.confirm(t('dashboard.actions.confirmDelete'))) return;
    const okk = await run(async () => {
      const res = await supabase.from('admins').delete().eq('id', id);
      if (res.error) throw res.error;
      await load();
    });
    if (!okk) await load();
  }

  return (
    <>
      <ListShell
        items={admins}
        onAdd={openNew}
        onEdit={null}
        onDelete={remove}
        empty={t('dashboard.empty')}
        renderRow={(admin) => (
          <div className="min-w-0">
            <p className="truncate font-display font-bold text-cream">{admin.username}</p>
            <p className="truncate text-xs text-cream/45" dir="ltr">{admin.created_at ? new Date(admin.created_at).toLocaleString() : ''}</p>
          </div>
        )}
      />
      <EditorModal open={!!editing} title={t('dashboard.tabs.admins')} onClose={() => setEditing(null)} onSave={save} saving={saving}>
        {editing && (
          <>
            <TextInput label={t('dashboard.username')} value={editing.username} onChange={(v) => setEditing({ ...editing, username: v })} />
            <TextInput label={t('dashboard.password')} type="password" value={editing.password} onChange={(v) => setEditing({ ...editing, password: v })} />
          </>
        )}
      </EditorModal>
    </>
  );
}

export function SongsManager() {
  const { t } = useLanguage();
  const { songs, crud, refresh } = useData();
  const [editing, setEditing] = useState(null);
  const [chordText, setChordText] = useState('');
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({ ...emptySong(), sort: dbItems(songs).length });
    setChordText('');
  }
  function openEdit(s) {
    setEditing(s);
    setChordText((s.chord || []).join(','));
  }
  async function save() {
    const chord = chordText.split(',').map((n) => Number(n.trim())).filter((n) => !Number.isNaN(n));
    setSaving(true);
    const okk = await run(async () => {
      if (editing.isDefault && !editing.id) {
        const res = await supabase.from('songs').update({ is_default: false }).neq('is_default', false);
        if (res.error) throw res.error;
      }
      await crud.songs.save({ ...editing, chord });
      if (editing.isDefault && editing.id) {
        const res = await supabase.from('songs').update({ is_default: false }).neq('id', editing.id);
        if (res.error) throw res.error;
        await refresh();
      }
    });
    setSaving(false);
    if (okk) setEditing(null);
  }

  async function move(i, dir) {
    const items = dbItems(songs);
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[i];
    const b = items[j];
    await run(async () => {
      const r1 = await supabase.from('songs').update({ sort: b.sort }).eq('id', a.id);
      if (r1.error) throw r1.error;
      const r2 = await supabase.from('songs').update({ sort: a.sort }).eq('id', b.id);
      if (r2.error) throw r2.error;
      await refresh();
    });
  }

  return (
    <>
      <ListShell
        items={dbItems(songs)}
        onAdd={openNew}
        onEdit={openEdit}
        onDelete={(id) => run(() => crud.songs.remove(id))}
        onMoveUp={(it, i) => move(i, -1)}
        onMoveDown={(it, i) => move(i, 1)}
        empty={t('dashboard.empty')}
        renderRow={(s) => (
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-9 w-9 shrink-0 rounded-lg border border-white/10" style={{ background: s.accent }} />
            <div className="min-w-0">
              <p className="truncate font-display font-bold text-cream">{s.title.ar || s.title.en || '—'}</p>
              <p className="truncate text-xs text-cream/45">{s.artist.ar || s.artist.en}</p>
            </div>
          </div>
        )}
      />
      <EditorModal open={!!editing} title={t('dashboard.tabs.songs')} onClose={() => setEditing(null)} onSave={save} saving={saving}>
        {editing && (
          <>
            <LangFields item={editing} set={setEditing} keys={['title', 'artist']} />
            <div className="grid gap-3 sm:grid-cols-2">
              <AudioField label={t('dashboard.common.audioUrl')} value={editing.audioUrl} onChange={(v) => setEditing({ ...editing, audioUrl: v })} placeholder="https://…/song.mp3" />
              <ColorField label={t('dashboard.common.accent')} value={editing.accent} onChange={(v) => setEditing({ ...editing, accent: v })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label={t('dashboard.common.spotifyUrl')} value={editing.spotifyUrl} onChange={(v) => setEditing({ ...editing, spotifyUrl: v })} />
              <label className="flex items-end gap-2 pb-2.5">
                <input
                  type="checkbox"
                  checked={!!editing.isDefault}
                  onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })}
                  className="size-4 accent-[#C9A86A]"
                />
                <span className="text-xs font-semibold text-cream/55">{t('dashboard.common.isDefault')}</span>
              </label>
            </div>
            <TextInput label={t('dashboard.common.chord')} value={chordText} onChange={setChordText} dir="ltr" />
          </>
        )}
      </EditorModal>
    </>
  );
}

const emptyLetter = () => ({ sort: 0, trigger: { ar: '', en: '' }, content: { ar: [], en: [] }, accent: '#D98C9A' });

export function LettersManager() {
  const { t } = useLanguage();
  const { letters, crud } = useData();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({ ...emptyLetter(), sort: dbItems(letters).length });
  }
  async function save() {
    setSaving(true);
    const okk = await run(() => crud.letters.save(editing));
    setSaving(false);
    if (okk) setEditing(null);
  }

  return (
    <>
      <ListShell
        items={dbItems(letters)}
        onAdd={openNew}
        onEdit={setEditing}
        onDelete={(id) => run(() => crud.letters.remove(id))}
        empty={t('dashboard.empty')}
        renderRow={(l) => (
          <div className="min-w-0">
            <p className="truncate font-display font-bold text-cream">{l.trigger.ar || l.trigger.en || '—'}</p>
            <p className="text-xs text-cream/45">{l.content.ar.length} فقرة</p>
          </div>
        )}
      />
      <EditorModal open={!!editing} title={t('dashboard.tabs.letters')} onClose={() => setEditing(null)} onSave={save} saving={saving}>
        {editing && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label={t('dashboard.common.triggerAr')} value={editing.trigger.ar} onChange={(v) => setEditing({ ...editing, trigger: { ...editing.trigger, ar: v } })} />
              <TextInput label={t('dashboard.common.triggerEn')} value={editing.trigger.en} onChange={(v) => setEditing({ ...editing, trigger: { ...editing.trigger, en: v } })} />
            </div>
            <LangTextAreas keyBase="content" value={editing.content} onChange={(v) => setEditing({ ...editing, content: v })} rows={7} />
            <ColorField label={t('dashboard.common.accent')} value={editing.accent} onChange={(v) => setEditing({ ...editing, accent: v })} />
          </>
        )}
      </EditorModal>
    </>
  );
}

const emptyChapter = () => ({ sort: 0, number: '0' + (0 + 1), title: { ar: '', en: '' }, description: { ar: '', en: '' }, image: '' });

export function ChaptersManager() {
  const { t } = useLanguage();
  const { chapters, crud } = useData();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    const n = String(dbItems(chapters).length + 1).padStart(2, '0');
    setEditing({ ...emptyChapter(), sort: dbItems(chapters).length, number: n });
  }
  async function save() {
    setSaving(true);
    const okk = await run(() => crud.chapters.save(editing));
    setSaving(false);
    if (okk) setEditing(null);
  }

  return (
    <>
      <ListShell
        items={dbItems(chapters)}
        onAdd={openNew}
        onEdit={setEditing}
        onDelete={(id) => run(() => crud.chapters.remove(id))}
        empty={t('dashboard.empty')}
        renderRow={(c) => (
          <div className="min-w-0">
            <p className="truncate font-display font-bold text-cream">
              <span className="text-gold/60">{c.number}</span> · {c.title.ar || c.title.en || '—'}
            </p>
            <p className="truncate text-xs text-cream/45">{c.description.ar || c.description.en}</p>
          </div>
        )}
      />
      <EditorModal open={!!editing} title={t('dashboard.tabs.chapters')} onClose={() => setEditing(null)} onSave={save} saving={saving}>
        {editing && (
          <>
            <TextInput label={t('dashboard.common.number')} value={editing.number} onChange={(v) => setEditing({ ...editing, number: v })} />
            <LangFields item={editing} set={setEditing} keys={['title', 'description']} />
            <ImageField label={t('dashboard.common.image')} value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
          </>
        )}
      </EditorModal>
    </>
  );
}
