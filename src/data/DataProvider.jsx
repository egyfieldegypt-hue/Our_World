import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  chapterToRow,
  letterToRow,
  memoryToRow,
  rowToChapter,
  rowToLetter,
  rowToMemory,
  rowToSong,
  songToRow,
} from '../lib/adapters';
import { memories as fallbackMemories } from './memories';
import { letters as fallbackLetters } from './letters';
import { chapters as fallbackChapters } from './chapters';
import { NAMES, START_DATE, STORY_COUNT } from './siteConfig';

// An empty table in Supabase shouldn't blank the site — keep the bundled
// content until the owner adds real rows from the dashboard.
// Bundled items are flagged `_fb` so the dashboard can hide them
// (they don't exist in the database and can't be edited/deleted).
const mark = (items) => items.map((x) => ({ ...x, _fb: true }));
const markedFallbacks = {
  memories: mark(fallbackMemories),
  songs: [],
  letters: mark(fallbackLetters),
  chapters: mark(fallbackChapters),
};
const useList = (rows, key) => (rows && rows.length ? rows : markedFallbacks[key]);
const useSongs = (rows) => (rows && rows.length ? rows : []);

const fallbackConfig = {
  start_date: START_DATE,
  names_ar: NAMES.ar,
  names_en: NAMES.en,
  story_count: STORY_COUNT,
};

const DataContext = createContext(null);

let apiBroken = false;

async function fetchList(table) {
  const { data, error } = await supabase.from(table).select('*').order('sort', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

function isMissingTables(err) {
  return Boolean(err && (err.status === 404 || /(PGRST|42P01)/.test(err.code || '')));
}

export function DataProvider({ children }) {
  const [state, setState] = useState({
    memories: markedFallbacks.memories,
    songs: [],
    letters: markedFallbacks.letters,
    chapters: markedFallbacks.chapters,
    config: fallbackConfig,
    loaded: false,
    usingFallback: true,
  });

  const refresh = useCallback(async () => {
    if (apiBroken || !isSupabaseConfigured || !supabase) return;
    try {
      const [memories, songs, letters, chapters, configRows] = await Promise.all([
        fetchList('memories'),
        fetchList('songs'),
        fetchList('letters'),
        fetchList('chapters'),
        supabase.from('site_config').select('*').eq('id', 1).maybeSingle(),
      ]);
      const cfg = configRows?.data ?? null;
      setState({
        memories: useList(memories.map(rowToMemory), 'memories'),
        songs: useSongs(songs.map(rowToSong)),
        letters: useList(letters.map(rowToLetter), 'letters'),
        chapters: useList(chapters.map(rowToChapter), 'chapters'),
        config: cfg
          ? {
              start_date: cfg.start_date,
              names_ar: cfg.names_ar,
              names_en: cfg.names_en,
              story_count: cfg.story_count,
            }
          : fallbackConfig,
        loaded: true,
        usingFallback: false,
      });
    } catch (err) {
      // Tables not created yet (404) or connection issue → keep bundled content.
      if (isMissingTables(err)) apiBroken = true;
      setState((s) => ({ ...s, loaded: true }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ---- CRUD helpers used by the dashboard ----
  const crud = useMemo(() => {
    const make = (table, toRow, mapRow) => ({
      async save(item) {
        const row = toRow(item);
        const res = item.id
          ? await supabase.from(table).update(row).eq('id', item.id)
          : await supabase.from(table).insert(row);
        if (res.error) throw res.error;
        await refresh();
      },
      async remove(id) {
        const res = await supabase.from(table).delete().eq('id', id);
        if (res.error) throw res.error;
        await refresh();
      },
      mapRow,
    });
    return {
      memories: make('memories', memoryToRow, rowToMemory),
      songs: make('songs', songToRow, rowToSong),
      letters: make('letters', letterToRow, rowToLetter),
      chapters: make('chapters', chapterToRow, rowToChapter),
    };
  }, [refresh]);

  const value = useMemo(
    () => ({ ...state, refresh, crud }),
    [state, refresh, crud],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}
