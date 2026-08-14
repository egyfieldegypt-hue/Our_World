// Generates the cinematic placeholder artwork used across the site.
// Run:  npm run assets
// Swap any generated .svg under public/images with real photos later.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * palette: [from, to, glowA, glowB, accent]
 */
function art({ w, h, palette, seed, stars = 0.6, moon = true }) {
  const r = rng(seed);
  const [from, to, glowA, glowB, accent] = palette;
  const count = Math.round((w * h) / 9000 * stars);
  const dots = [];
  const glows = [];
  for (let i = 0; i < count; i++) {
    dots.push({ x: r() * w, y: r() * h, s: (r() * 1.9 + 0.4).toFixed(1), o: (r() * 0.45 + 0.1).toFixed(2) });
  }
  for (let i = 0; i < 3; i++) {
    glows.push({
      cx: (r() * w).toFixed(0),
      cy: (r() * h).toFixed(0),
      rad: Math.round(w * (0.32 + r() * 0.28)),
      color: i === 0 ? glowA : i === 1 ? glowB : accent,
      o: (i === 2 ? 0.1 : 0.16 + r() * 0.08).toFixed(2),
    });
  }
  const rings = [];
  if (moon) {
    const cx = w * (0.2 + r() * 0.6);
    const cy = h * (0.18 + r() * 0.2);
    rings.push(
      { cx: cx.toFixed(0), cy: cy.toFixed(0), r: (Math.min(w, h) * 0.11).toFixed(0), o: 0.16 },
      { cx: cx.toFixed(0), cy: cy.toFixed(0), r: (Math.min(w, h) * 0.16).toFixed(0), o: 0.09 },
      { cx: cx.toFixed(0), cy: cy.toFixed(0), r: (Math.min(w, h) * 0.05).toFixed(0), o: 0.12 },
    );
  }
  const horizonLine = h * (0.66 + r() * 0.12);
  const horizon = `M0 ${horizonLine.toFixed(0)} C ${(w * 0.2).toFixed(0)} ${(horizonLine - h * 0.14).toFixed(0)}, ${(w * 0.4).toFixed(0)} ${(horizonLine + h * 0.1).toFixed(0)}, ${(w * 0.55).toFixed(0)} ${(horizonLine - h * 0.05).toFixed(0)} S ${(w * 0.85).toFixed(0)} ${(horizonLine + h * 0.09).toFixed(0)}, ${w} ${(horizonLine - h * 0.02).toFixed(0)} L ${w} ${h} L 0 ${h} Z`;
  const horizon2 = `
  M0 ${(horizonLine + h * 0.22).toFixed(0)}
  C ${(w * 0.25).toFixed(0)} ${(horizonLine + h * 0.05).toFixed(0)}, ${(w * 0.55).toFixed(0)} ${(horizonLine + h * 0.3).toFixed(0)}, ${w} ${(horizonLine + h * 0.14).toFixed(0)}
  L ${w} ${h} L 0 ${h} Z`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.42" r="0.9">
      <stop offset="0.45" stop-color="#0D0B10" stop-opacity="0"/>
      <stop offset="1" stop-color="#0D0B10" stop-opacity="0.72"/>
    </radialGradient>
    <filter id="blur" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="${Math.round(w / 18)}"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${glows.map((g) => `<circle cx="${g.cx}" cy="${g.cy}" r="${g.rad}" fill="${g.color}" opacity="${g.o}" filter="url(#blur)"/>`).join('')}
  ${rings.map((rg) => `<circle cx="${rg.cx}" cy="${rg.cy}" r="${rg.r}" fill="none" stroke="${accent}" stroke-opacity="${rg.o}" stroke-width="1" opacity="${rg.o}"/>`).join('')}
  <path d="${horizon}" fill="#0D0B10" opacity="0.42"/>
  <path d="${horizon2}" fill="#0D0B10" opacity="0.3"/>
  ${dots.map((d) => `<circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${d.s}" fill="#F5EFE6" opacity="${d.o}"/>`).join('')}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.9"/>
</svg>`;
}

const P = {
  rose: ['#2b1420', '#0D0B10', '#D98C9A', '#5A2634', '#C9A86A'],
  gold: ['#2c2113', '#0D0B10', '#C9A86A', '#5A2634', '#D98C9A'],
  burgundy: ['#33101c', '#0D0B10', '#8a3a4f', '#C9A86A', '#D98C9A'],
  indigo: ['#161d33', '#0D0B10', '#3d4d7a', '#D98C9A', '#C9A86A'],
  plum: ['#251228', '#0D0B10', '#8a4a68', '#5A2634', '#D98C9A'],
  sage: ['#15251d', '#0D0B10', '#5f8a76', '#C9A86A', '#D98C9A'],
  dusk: ['#2a1a2c', '#0D0B10', '#C9A86A', '#7a3b52', '#D98C9A'],
};

const files = [
  { name: 'hero.svg', w: 1600, h: 1000, p: P.dusk, seed: 11, stars: 0.5 },
  { name: 'memories/01.svg', w: 900, h: 1200, p: P.rose, seed: 101 },
  { name: 'memories/02.svg', w: 900, h: 900, p: P.indigo, seed: 102 },
  { name: 'memories/03.svg', w: 900, h: 1200, p: P.plum, seed: 103 },
  { name: 'memories/04.svg', w: 900, h: 1200, p: P.gold, seed: 104 },
  { name: 'memories/05.svg', w: 900, h: 900, p: P.sage, seed: 105 },
  { name: 'memories/06.svg', w: 900, h: 1200, p: P.burgundy, seed: 106 },
  { name: 'memories/07.svg', w: 900, h: 1200, p: P.dusk, seed: 107 },
  { name: 'memories/08.svg', w: 900, h: 900, p: P.indigo, seed: 108 },
  { name: 'memories/09.svg', w: 900, h: 1200, p: P.rose, seed: 109 },
  { name: 'places/01.svg', w: 800, h: 800, p: P.rose, seed: 201, stars: 0.45 },
  { name: 'places/02.svg', w: 800, h: 800, p: P.gold, seed: 202, stars: 0.45 },
  { name: 'places/03.svg', w: 800, h: 800, p: P.indigo, seed: 203, stars: 0.45 },
  { name: 'places/04.svg', w: 800, h: 800, p: P.plum, seed: 204, stars: 0.45 },
  { name: 'chapters/01.svg', w: 1400, h: 900, p: P.rose, seed: 301 },
  { name: 'chapters/02.svg', w: 1400, h: 900, p: P.indigo, seed: 302 },
  { name: 'chapters/03.svg', w: 1400, h: 900, p: P.gold, seed: 303 },
  { name: 'chapters/04.svg', w: 1400, h: 900, p: P.dusk, seed: 304 },
];

for (const f of files) {
  const target = join(root, f.name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, art({ w: f.w, h: f.h, palette: f.p, seed: f.seed, stars: f.stars ?? 0.6 }));
  console.log('wrote', f.name);
}
console.log('done —', files.length, 'files');