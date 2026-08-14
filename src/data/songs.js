// ============================================================
// BAYNA | بينّا — soundtrack
//
// To use REAL audio files:
//   1. Put the .mp3 files inside public/songs/ (e.g. public/songs/song-1.mp3)
//   2. Set audioUrl below, e.g.  audioUrl: '/songs/song-1.mp3'
// Until then, the player gently performs each song's chord as a
// soft ambient tone so the experience still feels alive.
//
// chord = list of frequencies (Hz) used for the ambient rendering.
// ============================================================

export const songs = [
  {
    id: 'song-1',
    title: { ar: 'أول لحن', en: 'The First Melody' },
    artist: { ar: 'اللي ضحكنا عليه أول مقابلة', en: 'The one we joked about on our first date' },
    audioUrl: '',
    chord: [110, 164.81, 220, 261.63, 329.63],
    accent: '#D98C9A',
  },
  {
    id: 'song-2',
    title: { ar: 'أغنية المشوار', en: 'The Walk Song' },
    artist: { ar: 'اللي كنا بنسمعها على طول النيل', en: 'The one we played along the Nile' },
    audioUrl: '',
    chord: [87.31, 130.81, 174.61, 220, 261.63],
    accent: '#C9A86A',
  },
  {
    id: 'song-3',
    title: { ar: 'لحن القهوة', en: 'The Coffee Tune' },
    artist: { ar: 'بتاعة طاولتنا في وسط البلد', en: 'The one from our table downtown' },
    audioUrl: '',
    chord: [130.81, 196, 261.63, 293.66, 329.63],
    accent: '#8a5566',
  },
  {
    id: 'song-4',
    title: { ar: 'أغنية البحر', en: 'The Sea Song' },
    artist: { ar: 'إسكندرية، أول سفرية', en: 'Alexandria, our first trip' },
    audioUrl: '',
    chord: [146.83, 220, 293.66, 349.23, 440],
    accent: '#6f8f9f',
  },
  {
    id: 'song-5',
    title: { ar: 'أغنيتنا', en: 'Our Song' },
    artist: { ar: 'اللي أول "بحبك" اتفاجئ بيها', en: 'The one that played when we first said it' },
    audioUrl: '',
    chord: [82.41, 123.47, 164.81, 196, 246.94],
    accent: '#D98C9A',
  },
];