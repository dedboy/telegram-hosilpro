import React, { useEffect, useState } from 'react';
import DashboardTab from './components/tabs/DashboardTab';
import TasksTab from './components/tabs/TasksTab';
import ReportTab from './components/tabs/ReportTab';
import ProfileTab from './components/tabs/ProfileTab';
import BottomNavigation from './components/BottomNavigation';
import Onboarding from './components/Onboarding';
import { fetchProfile } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand(); // Expand app to full height
    }

    // Check onboarding status
    fetchProfile().then(data => {
      if (data && data.is_onboarded) {
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
    });
  }, []);

  if (isOnboarded === null) {
    return <div className="h-screen flex items-center justify-center bg-tg-bg text-tg-hint">Yuklanmoqda...</div>;
  }

  if (isOnboarded === false) {
    return <Onboarding onComplete={() => setIsOnboarded(true)} />;
  }

  // Simple state-based router
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'tasks':
        return <TasksTab />;
      case 'report':
        return <ReportTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
      <main className="w-full h-full max-w-lg mx-auto relative">
        {renderTab()}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
}

export default App;
