import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { pauseAmbient, resumeAmbient, startAmbient, stopAmbient } from '../utils/ambient';
import { spotifyEmbedUrl } from '../utils/spotify';
import { storageUrl } from '../lib/supabase';
import { IconClose, IconNext, IconPause, IconPlay, IconPrev } from './shared/icons';

/**
 * Player. When `compact` is true only a small mute/unmute button is
 * shown (used for the auto-playing welcome song) — the full banner
 * appears once the user picks a song from the list.
 */
export default function MusicPlayer({
  song,
  playing,
  playAttempt = 0,
  onToggle,
  onNext,
  onPrev,
  onClose,
  onPlaybackBlocked,
  elapsed,
  onSeek,
  compact = false,
}) {
  const { t, lang } = useLanguage();
  const audioRef = useRef(null);
  const [realDuration, setRealDuration] = useState(0);

  const embedUrl = spotifyEmbedUrl(song?.spotifyUrl);
  const usesAudio = Boolean(song?.audioUrl);
  const DURATION = usesAudio && realDuration > 0 ? realDuration : song?.audioUrl ? 240 : 265;

  const cbRef = useRef({ onNext });
  cbRef.current.onNext = onNext;

  const seekToRatio = (clientX, target) => {
    const rect = target.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const nextTime = ratio * DURATION;
    if (usesAudio && audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
    onSeek(nextTime);
  };

  // real audio element path
  useEffect(() => {
    if (!usesAudio) return;
    setRealDuration(0);
    onSeek(0);
    const audio = new Audio(storageUrl(song.audioUrl));
    audio.preload = 'metadata';
    const handleEnded = () => cbRef.current.onNext();
    const handleDurationChange = () => {
      if (Number.isFinite(audio.duration)) setRealDuration(audio.duration);
    };
    const handleTimeUpdate = () => onSeek(audio.currentTime);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current = audio;

    if (playing) {
      audio.play().catch(() => onPlaybackBlocked?.());
    }

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [song?.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!usesAudio || !audio) return;
    if (playing) audio.play().catch(() => onPlaybackBlocked?.());
    else audio.pause();
  }, [usesAudio, playing, playAttempt]);

  // ambient engine path
  useEffect(() => {
    if (!song || usesAudio || embedUrl) return;
    if (playing) startAmbient(song.chord);
    else pauseAmbient();
  }, [song, playing, embedUrl, playAttempt]);

  // cleanup when switching/closing
  useEffect(() => {
    return () => {
      stopAmbient();
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
        } catch {
          /* noop */
        }
        audioRef.current = null;
      }
    };
  }, [song?.id]);

  const pct = DURATION > 0 ? Math.min(100, (elapsed / DURATION) * 100) : 0;

  if (!song) return null;

  if (compact) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? t('player.pause') : t('player.play')}
        title={playing ? t('player.pause') : t('player.play')}
        className="fixed bottom-4 end-4 z-40 grid size-12 place-items-center rounded-full bg-gold text-ink shadow-[0_0_24px_rgba(201,168,106,0.4)] transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {playing ? <IconPause className="size-5" /> : <IconPlay className="size-5 translate-x-[1px]" />}
      </button>
    );
  }

  const trackInfo = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span
        aria-hidden="true"
        className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl"
        style={{ background: `linear-gradient(135deg, ${song.accent}33, #17131A)` }}
      >
        {playing ? (
          <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
            <span className="eq-bar block h-full w-0.5 rounded-sm bg-gold" style={{ animationDelay: '0ms' }} />
            <span className="eq-bar block h-full w-0.5 rounded-sm bg-gold" style={{ animationDelay: '220ms' }} />
            <span className="eq-bar block h-full w-0.5 rounded-sm bg-gold" style={{ animationDelay: '440ms' }} />
          </span>
        ) : (
          <IconPlay className="size-4 text-gold/70" />
        )}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-bold text-cream sm:text-base">
          {song.title[lang]}
        </p>
        <p className="truncate text-xs text-cream/45">{song.artist[lang]}</p>
      </div>
    </div>
  );

  const controls = (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={onPrev}
        aria-label={t('player.prev')}
        className="grid size-9 place-items-center rounded-full text-cream/60 transition-colors hover:text-gold"
      >
        <IconPrev className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? t('player.pause') : t('player.play')}
        className="grid size-12 place-items-center rounded-full bg-gold text-ink shadow-[0_0_24px_rgba(201,168,106,0.35)] transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {playing ? <IconPause className="size-5" /> : <IconPlay className="size-5 translate-x-[1px]" />}
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label={t('player.next')}
        className="grid size-9 place-items-center rounded-full text-cream/60 transition-colors hover:text-gold"
      >
        <IconNext className="size-4" />
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
      role="region"
      aria-label={t('player.nowPlaying')}
    >
      <div className="glass w-full max-w-2xl rounded-2xl p-3 shadow-[0_18px_60px_-18px_rgba(0,0,0,0.85)]">
        {embedUrl ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {trackInfo}
            <iframe
              src={embedUrl}
              title={song.title[lang]}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="min-w-0 rounded-xl sm:w-[320px] sm:shrink-0"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label={t('player.close')}
              className="absolute end-2 top-2 grid size-9 shrink-0 place-items-center rounded-full text-cream/50 transition-colors hover:text-rose sm:static"
            >
              <IconClose className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 sm:gap-4">
              {trackInfo}
              {controls}
              <button
                type="button"
                onClick={onClose}
                aria-label={t('player.close')}
                className="grid size-9 shrink-0 place-items-center rounded-full text-cream/50 transition-colors hover:text-rose"
              >
                <IconClose className="size-4" />
              </button>
            </div>
            <div className="mt-2.5">
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                className="block h-3 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  seekToRatio(e.clientX, e.currentTarget);
                }}
                onPointerMove={(e) => {
                  if (e.buttons !== 1) return;
                  seekToRatio(e.clientX, e.currentTarget);
                }}
              >
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-gold via-rose to-gold transition-[width] duration-500 ease-linear"
                  style={{ width: `${pct}%` }}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
