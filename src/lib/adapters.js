// Maps Supabase rows <-> the domain shapes used by the site components.

export const rowToMemory = (r) => ({
  id: r.id,
  date: r.date,
  title: { ar: r.title_ar, en: r.title_en },
  description: { ar: r.description_ar, en: r.description_en },
  location: { ar: r.location_ar, en: r.location_en },
  image: r.image,
  categories: r.categories || [],
  aspect: r.aspect || '4/5',
  section: r.section || 'both',
});

export const memoryToRow = (m) => ({
  sort: m.sort ?? 0,
  date: m.date,
  title_ar: m.title?.ar ?? '',
  title_en: m.title?.en ?? '',
  description_ar: m.description?.ar ?? '',
  description_en: m.description?.en ?? '',
  location_ar: m.location?.ar ?? '',
  location_en: m.location?.en ?? '',
  image: m.image ?? '',
  categories: m.categories ?? [],
  aspect: m.aspect ?? '4/5',
  section: m.section ?? 'both',
});

export const rowToSong = (r) => ({
  id: r.id,
  title: { ar: r.title_ar, en: r.title_en },
  artist: { ar: r.artist_ar, en: r.artist_en },
  audioUrl: r.audio_url || '',
  spotifyUrl: r.spotify_url || '',
  isDefault: Boolean(r.is_default),
  accent: r.accent || '#D98C9A',
  chord: Array.isArray(r.chord) ? r.chord.map(Number).filter((n) => !Number.isNaN(n)) : [],
});

export const songToRow = (s) => ({
  sort: s.sort ?? 0,
  title_ar: s.title?.ar ?? '',
  title_en: s.title?.en ?? '',
  artist_ar: s.artist?.ar ?? '',
  artist_en: s.artist?.en ?? '',
  audio_url: s.audioUrl ?? '',
  spotify_url: s.spotifyUrl ?? '',
  is_default: s.isDefault ?? false,
  accent: s.accent ?? '#D98C9A',
  chord: s.chord ?? [],
});

export const rowToLetter = (r) => ({
  id: r.id,
  trigger: { ar: r.trigger_ar, en: r.trigger_en },
  content: { ar: r.content_ar || [], en: r.content_en || [] },
  accent: r.accent || '#D98C9A',
});

export const letterToRow = (l) => ({
  sort: l.sort ?? 0,
  trigger_ar: l.trigger?.ar ?? '',
  trigger_en: l.trigger?.en ?? '',
  content_ar: l.content?.ar ?? [],
  content_en: l.content?.en ?? [],
  accent: l.accent ?? '#D98C9A',
});

export const rowToChapter = (r) => ({
  id: r.id,
  number: r.number,
  title: { ar: r.title_ar, en: r.title_en },
  description: { ar: r.description_ar, en: r.description_en },
  image: r.image,
});

export const chapterToRow = (c) => ({
  sort: c.sort ?? 0,
  number: c.number ?? '01',
  title_ar: c.title?.ar ?? '',
  title_en: c.title?.en ?? '',
  description_ar: c.description?.ar ?? '',
  description_en: c.description?.en ?? '',
  image: c.image ?? '',
});