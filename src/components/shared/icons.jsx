const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconPlay = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPause = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <rect x="7" y="5" width="3.4" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="13.6" y="5" width="3.4" height="14" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconNext = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M5 6v12l8-6z" fill="currentColor" stroke="none" />
    <rect x="15.5" y="6" width="2.6" height="12" rx="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPrev = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M19 6v12l-8-6z" fill="currentColor" stroke="none" />
    <rect x="5.9" y="6" width="2.6" height="12" rx="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconChevronRight = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M9.5 5.5 16 12 9.5 18.5" />
  </svg>
);

export const IconClose = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconMenu = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconPin = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconHeart = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M12 20.3 4.4 13a4.9 4.9 0 0 1 0-7 4.9 4.9 0 0 1 7 0l.6.6.6-.6a4.9 4.9 0 0 1 7 0 4.9 4.9 0 0 1 0 7z" />
  </svg>
);

export const IconArrowUp = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const IconArrowDown = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const IconMail = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 6 7.5-6" />
  </svg>
);

export const IconSpark = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

export const IconQuote = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M9.5 7C7 8.5 5.5 10.8 5.5 13.4 5.5 15.6 6.8 17 8.6 17c1.5 0 2.6-1 2.6-2.5 0-1.4-1-2.4-2.4-2.4-.3 0-.6.1-.8.2.4-1.4 1.6-3 3.2-4zM19.5 7c-2.5 1.5-4 3.8-4 6.4 0 2.2 1.3 3.6 3.1 3.6 1.5 0 2.6-1 2.6-2.5 0-1.4-1-2.4-2.4-2.4-.3 0-.6.1-.8.2.4-1.4 1.6-3 3.2-4z" />
  </svg>
);

export const IconMoon = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
  </svg>
);