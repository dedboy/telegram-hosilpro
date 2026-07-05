import React, { useEffect, useState } from 'react';
import DashboardTab from './components/tabs/DashboardTab';
import TasksTab from './components/tabs/TasksTab';
import ReportTab from './components/tabs/ReportTab';
import ProfileTab from './components/tabs/ProfileTab';
import BottomNavigation from './components/BottomNavigation';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand(); // Expand app to full height
      
      // We can enable a back button logic if we ever implement nested views
      // But for bottom nav tabs, usually we don't need the native back button
    }
  }, []);

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
