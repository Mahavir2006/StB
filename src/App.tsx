import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginScreen } from './auth/LoginScreen';

// Lazy-load heavy modules — only the auth screen is in the initial bundle
const ParticleIntro = lazy(() =>
  import('./modules/intro/ParticleIntro').then(m => ({ default: m.ParticleIntro }))
);
const Dashboard = lazy(() =>
  import('./shell/Dashboard').then(m => ({ default: m.Dashboard }))
);

function AppContent() {
  const { isAuthenticated, hasSeenIntro, setHasSeenIntro } = useAuth();

  if (!isAuthenticated) return <LoginScreen />;

  if (!hasSeenIntro) {
    return (
      <Suspense fallback={null}>
        <ParticleIntro onFinished={() => setHasSeenIntro(true)} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
