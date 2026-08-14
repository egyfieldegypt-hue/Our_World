import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import SectionHeading from './shared/SectionHeading';
import MusicPlayer from './MusicPlayer';
import { IconPause, IconPlay } from './shared/icons';

const LOOP_SECONDS = 265; // ambient loop length (real audio uses its own duration)

export default function Soundtrack() {
  const { t, lang } = useLanguage();
  const { songs } = useData();
  const reduce = useReducedMotion();

  const [activeId, setActiveId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playAttempt, setPlayAttempt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [banner, setBanner] = useState(false);
  const userPickedRef = useRef(false);
  const playingRef = useRef(false);
  playingRef.current = playing;

  const activeSong = useMemo(() => songs.find((s) => s.id === activeId) ?? null, [activeId, songs]);
  const activeSongRef = useRef(null);
  activeSongRef.current = activeSong;

  // Keep the welcome song in sync as data loads, unless the visitor picked one.
  useEffect(() => {
    if (userPickedRef.current || songs.length === 0) return;
    const def = songs.find((s) => s.isDefault) ?? songs[0] ?? null;
    if (def && activeId !== def.id) {
      setActiveId(def.id);
      setElapsed(0);
      setPlaying(true);
      setBanner(Boolean(def.spotifyUrl));
      setPlayAttempt((n) => n + 1);
    }
  }, [songs, activeId]);

  useEffect(() => {
    const onFirstGesture = () => {
      if (!activeSongRef.current) return;
      setPlaying(true);
      setPlayAttempt((n) => n + 1);
    };
    const events = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, onFirstGesture, { once: true, passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, onFirstGesture));
  }, [activeId]);

  const toggle = useCallback(() => {
    if (!activeSong) return;
    setPlaying((p) => {
      if (!p) setPlayAttempt((n) => n + 1);
      return !p;
    });
  }, [activeSong]);

  const next = useCallback(() => {
    if (!activeSong || songs.length < 2) return;
    const i = songs.findIndex((s) => s.id === activeSong.id);
    const nxt = songs[(i + 1) % songs.length];
    setActiveId(nxt.id);
    setElapsed(0);
    setPlaying(true);
    setPlayAttempt((n) => n + 1);
  }, [activeSong, songs.length]);

  const prev = useCallback(() => {
    if (!activeSong || songs.length < 2) return;
    const i = songs.findIndex((s) => s.id === activeSong.id);
    const prv = songs[(i - 1 + songs.length) % songs.length];
    setActiveId(prv.id);
    setElapsed(0);
    setPlaying(true);
    setPlayAttempt((n) => n + 1);
  }, [activeSong, songs.length]);

  const close = useCallback(() => {
    setPlaying(false);
    setElapsed(0);
    setBanner(false);
  }, []);

  const seek = useCallback((seconds) => {
    setElapsed(seconds);
  }, []);

  // advancing clock + loop — only for the ambient engine; real audio
  // and Spotify embeds advance themselves
  useEffect(() => {
    if (!activeSong || !playing) return;
    if (activeSong.audioUrl || activeSong.spotifyUrl) return;
    const id = window.setInterval(() => {
      setElapsed((e) => {
        const nxt = e + 0.5;
        if (nxt >= LOOP_SECONDS) {
          window.setTimeout(() => {
            const i = songs.findIndex((s) => s.id === activeSong.id);
            setActiveId(songs[(i + 1) % songs.length].id);
            setElapsed(0);
          }, 0);
          return 0;
        }
        return nxt;
      });
    }, 500);
    return () => window.clearInterval(id);
  }, [activeSong, playing]);

  return (
    <section id="soundtrack" className="relative px-6 py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_100%,rgba(90,38,52,0.28),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading eyebrow="soundtrack.eyebrow" title="soundtrack.title" subtitle="soundtrack.subtitle" />

        <p className="mt-10 text-center text-sm text-cream/40">{t('player.pickFromLibrary')}</p>

        <ul
          role="list"
          aria-label={t('soundtrack.listLabel')}
          className="mt-6 flex flex-col gap-3"
        >
          {songs.map((song, i) => {
            const isActive = song.id === activeId;
            const isPlaying = isActive && playing;
            return (
              <li key={song.id}>
                <button
                  type="button"
                  onClick={() => {
                    userPickedRef.current = true;
                    if (isActive) {
                      toggle();
                      setBanner(true);
                    } else {
                      setActiveId(song.id);
                      setElapsed(0);
                      setPlaying(true);
                      setPlayAttempt((n) => n + 1);
                      setBanner(true);
                    }
                  }}
                  aria-pressed={isActive}
                  aria-label={`${song.title[lang]} — ${song.artist[lang]}`}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-start transition-all duration-300 ${
                    isActive
                      ? 'border-gold/40 bg-gold/[0.07] shadow-[0_10px_40px_-14px_rgba(201,168,106,0.35)]'
                      : 'border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full border text-lg font-bold"
                    style={{
                      borderColor: isActive ? 'rgba(201,168,106,0.5)' : 'rgba(255,255,255,0.12)',
                      color: isActive ? '#C9A86A' : 'rgba(245,239,230,0.4)',
                    }}
                  >
                    {isPlaying ? (
                      <span className="flex h-4 items-end gap-0.5">
                        <span className="eq-bar block h-full w-0.5 rounded-sm bg-gold" style={{ animationDelay: '0ms' }} />
                        <span className="eq-bar block h-full w-0.5 rounded-sm bg-gold" style={{ animationDelay: '260ms' }} />
                        <span className="eq-bar block h-full w-0.5 rounded-sm bg-gold" style={{ animationDelay: '520ms' }} />
                      </span>
                    ) : (
                      <span className="tabular-nums text-base">0{i + 1}</span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg font-bold text-cream">
                      {song.title[lang]}
                    </span>
                    <span className="block truncate text-sm text-cream/50">{song.artist[lang]}</span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                      isActive
                        ? 'bg-gold text-ink'
                        : 'bg-white/5 text-cream/50 group-hover:text-gold group-hover:bg-gold/10'
                    }`}
                  >
                    {isPlaying ? <IconPause className="size-4" /> : <IconPlay className="size-4 translate-x-[1px]" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {activeSong && (
        <MusicPlayer
          song={activeSong}
          playing={playing}
          playAttempt={playAttempt}
          compact={!banner}
          onToggle={toggle}
          onNext={next}
          onPrev={prev}
          onClose={close}
          onPlaybackBlocked={() => setPlaying(false)}
          elapsed={elapsed}
          onSeek={seek}
        />
      )}
    </section>
  );
}
