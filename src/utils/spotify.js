// Extracts a Spotify track id from the many URL shapes users paste:
//   https://open.spotify.com/track/<id>?si=...
//   https://open.spotify.com/intl-ar/track/<id>
//   https://share.spotify.com/track/<id>
//   https://open.spotify.com/track/<id>/?si=...&context=...
//   https://spotify.link/xxxx (short link — needs expanding, return null)
export function spotifyTrackId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/open\.spotify\.com\/(?:[a-z0-9-]+\/)*track\/([A-Za-z0-9]{22})/);
  return match ? match[1] : null;
}

export function spotifyEmbedUrl(url) {
  const id = spotifyTrackId(url);
  return id ? `https://open.spotify.com/embed/track/${id}` : null;
}