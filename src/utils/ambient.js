// ------------------------------------------------------------------
// BAYNA ambient engine — a tiny generative soundbed so the soundtrack
// section lives even before real audio files are added.
// Once a song has `audioUrl`, MusicPlayer uses a real <audio> element
// instead (see src/components/MusicPlayer.jsx).
// ------------------------------------------------------------------

let ctx = null;
let master = null;
let activeNodes = [];

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function startAmbient(chord) {
  const ac = ensureCtx();
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume();

  activeNodes.forEach((n) => {
    try {
      n.disconnect();
    } catch {
      /* noop */
    }
  });
  activeNodes = [];

  master = ac.createGain();
  master.gain.setValueAtTime(0, ac.currentTime);
  master.gain.linearRampToValueAtTime(0.17, ac.currentTime + 3);
  master.connect(ac.destination);
  activeNodes.push(master);

  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 850;
  filter.Q.value = 0.7;
  master.connect(filter);
  filter.connect(ac.destination);
  activeNodes.push(filter);

  chord.forEach((f) => {
    const o1 = ac.createOscillator();
    o1.type = 'sine';
    o1.frequency.value = f;
    const o2 = ac.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = f * 1.004;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.5, ac.currentTime + 3.5);
    o1.connect(g);
    o2.connect(g);
    g.connect(master);
    o1.start();
    o2.start();
    activeNodes.push(o1, o2, g);
  });

  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 320;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();
  activeNodes.push(lfo, lfoGain);
}

export function stopAmbient() {
  if (!ctx || !master) return;
  try {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
  } catch {
    /* noop */
  }
  const doomed = activeNodes;
  activeNodes = [];
  window.setTimeout(() => {
    doomed.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* noop */
      }
    });
    try {
      ctx?.close();
    } catch {
      /* noop */
    }
    ctx = null;
    master = null;
  }, 500);
}

export function pauseAmbient() {
  try {
    ctx?.suspend();
  } catch {
    /* noop */
  }
}

export function resumeAmbient() {
  try {
    ctx?.resume();
  } catch {
    /* noop */
  }
}