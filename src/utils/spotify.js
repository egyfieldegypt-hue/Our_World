// Extracts a Spotify track id from the many URL shapes users paste:
//   https://open.spotify.com/track/<id>?si=...
//   https://open.spotify.com/intl-ar/track/<id>
//   https://share.spotify.com/track/<id>
//   https://open.spotify.com/track/<id>/?si=...&context=...
//   https://spotify.link/xxxx (short link — needs expanding, return null)
export function spotifyTrackId(url) {
  if (!url || typeof url !== 'string') return null;
  const text = url.trim();
  const direct = text.match(/(?:open|share)\.spotify\.com\/(?:embed\/)?(?:[a-z0-9-]+\/)*track\/([A-Za-z0-9]{22})/i);
  if (direct) return direct[1];

  try {
    const parsed = new URL(text);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const trackIndex = parts.indexOf('track');
    const id = trackIndex >= 0 ? parts[trackIndex + 1] : null;
    return /^[A-Za-z0-9]{22}$/.test(id || '') ? id : null;
  } catch {
    return null;
  }
}

export function spotifyEmbedUrl(url) {
  const id = spotifyTrackId(url);
  return id ? `https://open.spotify.com/embed/track/${id}?utm_source=generator` : null;
}
