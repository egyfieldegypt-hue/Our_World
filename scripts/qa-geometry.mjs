// Geometry QA: proves the layout truly mirrors between RTL (ar) and LTR (en)
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
  args: ['--no-sandbox', '--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

async function measure() {
  return page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), right: Math.round(r.right), w: Math.round(r.width) };
    };
    const timelineCardLeft = document.querySelector('#story ul li .group')?.getBoundingClientRect().left;
    const timelineCardRight = document.querySelector('#story ul li:nth-child(2) .group')?.getBoundingClientRect().left;
    return {
      brand: box('nav [href="#home"]'),
      switcherPill: box('nav [aria-label="بدّل اللغة"] span') ?? box('nav [aria-label="Switch language"] span'),
      timelineCardLeftX: Math.round(timelineCardLeft),
      timelineCardRightX: Math.round(timelineCardRight),
      storySpine: box('#story .absolute.start-1\\/2'),
      dir: document.documentElement.dir,
      fonts: { cairo: document.fonts.check('700 16px Cairo'), playfair: document.fonts.check('700 16px "Playfair Display"'), inter: document.fonts.check('400 16px Inter') },
    };
  });
}

await page.evaluateOnNewDocument(() => localStorage.setItem('bayna-lang', 'ar'));
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 1200));
console.log('=== ARABIC (RTL) ===');
console.log(JSON.stringify(await measure(), null, 1));

// switch language via the switcher (desktop visible)
const sw = await page.$('button[aria-label="بدّل للإنجليزي"]');
await sw.click();
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate(() => setTimeout(() => window.scrollTo(0, 1500), 0)); // allow whileInView
await new Promise((r) => setTimeout(r, 800));
console.log('=== ENGLISH (LTR) ===');
console.log(JSON.stringify(await measure(), null, 1));
console.log('page errors:', errors.length ? errors : 'none');
await browser.close();