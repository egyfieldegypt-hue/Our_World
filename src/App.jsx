import { lazy, Suspense, useEffect, useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
import { Grain } from './components/shared/Grain';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoryTimeline from './components/StoryTimeline';
import MemoryWall from './components/MemoryWall';
import Soundtrack from './components/Soundtrack';
import Letters from './components/Letters';
import Counter from './components/Counter';
import MovieChapters from './components/MovieChapters';
import FinalFooter from './components/FinalFooter';
import Login, { restoreSession } from './dashboard/Login';
import { IconPlay } from './components/shared/icons';

const DashboardApp = lazy(() => import('./dashboard/DashboardApp.jsx'));

const DASH_HASH = '#/dashboard';

function useDashboardRoute() {
  const [isDash, setIsDash] = useState(() => window.location.hash === DASH_HASH);
  useEffect(() => {
    const onChange = () => setIsDash(window.location.hash === DASH_HASH);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return isDash;
}

function WelcomeGate({ onEnter }) {
  const { isAr } = useLanguage();

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-ink text-cream">
      <Grain />
      <img
        src="/images/hero.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/45 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_42%_at_50%_45%,rgba(201,168,106,0.18),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.35em] text-gold">
          <span className="hairline w-10" aria-hidden="true" />
          BAYNA
          <span className="hairline w-10" aria-hidden="true" />
        </p>
        <h1 className="font-display text-[clamp(2.4rem,8vw,5.2rem)] font-black leading-[1.35] text-gradient-gold">
          {isAr ? 'بينّا' : 'BAYNA'}
        </h1>
        <button
          type="button"
          onClick={onEnter}
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold px-8 py-3.5 text-sm font-black text-ink shadow-[0_0_36px_rgba(201,168,106,0.35)] transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <IconPlay className="size-4 translate-x-[1px]" />
          {isAr ? 'افتح الموقع' : 'Open'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { t, isAr } = useLanguage();
  const isDash = useDashboardRoute();
  const [authed, setAuthed] = useState(() => restoreSession());
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.title = isDash
      ? isAr
        ? 'لوحة التحكم | بينّا'
        : 'Dashboard | BAYNA'
      : isAr
        ? 'بينّا | مكان صغير لحكايتنا'
        : 'BAYNA | A little place for our memories';
  }, [isAr, isDash]);

  if (!authed) {
    return (
      <div className="relative min-h-screen bg-ink text-cream">
        <Grain />
        <Login
          title={t('gate.title')}
          subtitle={t('gate.subtitle')}
          hideBackToSite
          onSuccess={() => setAuthed(true)}
        />
      </div>
    );
  }

  if (isDash) {
    return (
      <div className="relative min-h-screen bg-ink text-cream">
        <Grain />
        <Suspense fallback={<div className="grid min-h-screen place-items-center text-cream/50">…</div>}>
          <DashboardApp />
        </Suspense>
      </div>
    );
  }

  if (!entered) {
    return <WelcomeGate onEnter={() => setEntered(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-ink text-cream">
      <Grain />
      <Navbar />

      <main>
        <Hero />
        <StoryTimeline />
        <MemoryWall />
        <Soundtrack />
        <Letters />
        <Counter />
        <MovieChapters />
      </main>

      <FinalFooter />
    </div>
  );
}
