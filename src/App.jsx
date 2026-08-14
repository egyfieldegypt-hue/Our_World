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

export default function App() {
  const { t, isAr } = useLanguage();
  const isDash = useDashboardRoute();
  const [authed, setAuthed] = useState(() => restoreSession());

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