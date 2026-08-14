// ============================================================
// BAYNA | بينّا — memories
// Categories: dates | trips | random | favorites
// Add "favorites" to categories to include it in the favorites filter.
// Images live in public/images/memories/ (edit the art with real photos later).
// ============================================================

export const memories = [
  {
    id: 'first-date',
    section: 'timeline',
    date: '2025-03-12',
    title: { ar: 'البداية', en: 'The Beginning' },
    description: {
      ar: 'اليوم اللي مكنتش أعرف إنه هيغير حاجات كتير.',
      en: 'The day I didn\'t know would change so much.',
    },
    location: { ar: 'القاهرة', en: 'Cairo' },
    image: '/images/memories/01.svg',
    categories: ['dates', 'favorites'],
    aspect: '4/5',
  },
  {
    id: 'nile-walk',
    section: 'timeline',
    date: '2025-04-02',
    title: { ar: 'مشوار النيل', en: 'The Nile Walk' },
    description: {
      ar: 'ضحكنا على حاجات تافهة، واتصورنا نُص الكورنيش.',
      en: 'We laughed at silly things and took photos by the riverside.',
    },
    location: { ar: 'كورنيش النيل', en: 'Nile Corniche' },
    image: '/images/memories/02.svg',
    categories: ['dates'],
    aspect: '1/1',
  },
  {
    id: 'alexandria',
    section: 'timeline',
    date: '2025-05-16',
    title: { ar: 'إسكندرية', en: 'Alexandria' },
    description: {
      ar: 'أول سفرية لينا، أول بحر يشوفنا سوا، وأجمل شمس غروب.',
      en: 'Our first trip, our first sea, the most beautiful sunset.',
    },
    location: { ar: 'الإسكندرية', en: 'Alexandria' },
    image: '/images/memories/03.svg',
    categories: ['trips', 'favorites'],
    aspect: '3/4',
  },
  {
    id: 'rainy-night',
    section: 'timeline',
    date: '2025-06-21',
    title: { ar: 'ليلة مطر', en: 'Rainy Night' },
    description: {
      ar: 'المطر نزل فجأة، وعدينا الشارع متمسكين في بعض.',
      en: 'Rain fell from nowhere, and we crossed the street holding on to each other.',
    },
    location: { ar: 'وسط البلد', en: 'Downtown' },
    image: '/images/memories/04.svg',
    categories: ['random'],
    aspect: '4/5',
  },
  {
    id: 'orman-picnic',
    section: 'timeline',
    date: '2025-07-30',
    title: { ar: 'أول بيك نيك', en: 'Our First Picnic' },
    description: {
      ar: 'سندوتشات بسيطة، وضحك لحد ما الشمس غربت.',
      en: 'Simple sandwiches and laughter until the sun went down.',
    },
    location: { ar: 'حديقة الأورمان', en: 'Orman Garden' },
    image: '/images/memories/05.svg',
    categories: ['dates'],
    aspect: '1/1',
  },
  {
    id: 'giza-sunset',
    section: 'timeline',
    date: '2025-08-27',
    title: { ar: 'الهرم وقت الغروب', en: 'The Pyramid at Sunset' },
    description: {
      ar: 'الهرم كان واقف، والوقت وقف معاه.',
      en: 'The pyramid stood still — and so did time.',
    },
    location: { ar: 'الجيزة', en: 'Giza' },
    image: '/images/memories/06.svg',
    categories: ['trips'],
    aspect: '3/4',
  },
  {
    id: 'first-i-love-you',
    section: 'wall',
    date: '2025-09-19',
    title: { ar: 'أول (بحبك)', en: 'The First "I Love You"' },
    description: {
      ar: 'ثلاث كلمات غيَّرت كل حاجة من بعدها.',
      en: 'Three words that changed everything after.',
    },
    location: { ar: 'بيتنا', en: 'Home' },
    image: '/images/memories/07.svg',
    categories: ['random', 'favorites'],
    aspect: '4/5',
  },
  {
    id: 'night-drive',
    section: 'wall',
    date: '2025-10-24',
    title: { ar: 'سهرة بالليل', en: 'Late Night Drive' },
    description: {
      ar: 'الراديو شغال، وإحنا ماشيين من غير وجهة.',
      en: 'Radio on, no destination, and nowhere else to be.',
    },
    location: { ar: 'طريق الصحراوي', en: 'The Desert Road' },
    image: '/images/memories/08.svg',
    categories: ['random'],
    aspect: '1/1',
  },
  {
    id: 'our-anniversary',
    section: 'wall',
    date: '2026-03-12',
    title: { ar: 'سنة وعدّت', en: 'One Year In' },
    description: {
      ar: 'سنة كاملة... ولسه حاسسها أول يوم.',
      en: 'A whole year... and it still feels like day one.',
    },
    location: { ar: 'مكاننا', en: 'Our Place' },
    image: '/images/memories/09.svg',
    categories: ['dates', 'favorites'],
    aspect: '4/5',
  },
];

export const CATEGORY_KEYS = ['all', 'dates', 'trips', 'random', 'favorites'];