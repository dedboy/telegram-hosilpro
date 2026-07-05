import React from 'react';
import { Home, ClipboardList, AlertTriangle, User } from 'lucide-react';

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Klon Uy' },
    { id: 'tasks', icon: ClipboardList, label: 'Topshiriqlar' },
    { id: 'report', icon: AlertTriangle, label: 'Muammo/SOS' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-tg-secondary-bg border-t border-gray-200/20 safe-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-tg-button' : 'text-tg-hint'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
