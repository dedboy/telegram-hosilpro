import React from 'react';
import { User, Phone, TrendingUp, ShieldCheck, Award } from 'lucide-react';

const ProfileTab = () => {
  // Use Telegram initDataUnsafe if available, else fallback
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  
  const userInfo = {
    name: tgUser?.first_name || 'Fermer (Test)',
    lastName: tgUser?.last_name || '',
    username: tgUser?.username ? `@${tgUser.username}` : '',
    phone: '+998 90 123 45 67', // Telegram API doesn't expose phone by default unless requested via bot contact sharing
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <header className="mb-6 text-center pt-4">
        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <User size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">{userInfo.name} {userInfo.lastName}</h1>
        <p className="text-tg-hint">{userInfo.username || 'Faol foydalanuvchi'}</p>
      </header>

      <div className="bg-tg-secondary-bg rounded-2xl p-4 border border-gray-100/10 space-y-4">
        <div className="flex items-center p-2">
          <Phone className="text-tg-hint mr-4" size={20} />
          <div>
            <p className="text-xs text-tg-hint">Telefon raqam</p>
            <p className="font-medium">{userInfo.phone}</p>
          </div>
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-700/50 mx-2"></div>
        <div className="flex items-center p-2">
          <ShieldCheck className="text-emerald-500 mr-4" size={20} />
          <div>
            <p className="text-xs text-tg-hint">Holat</p>
            <p className="font-medium">Tasdiqlangan Fermer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white shadow-md">
          <Award size={24} className="mb-2 opacity-80" />
          <p className="text-emerald-100 text-xs mb-1">Hosil samaradorligi</p>
          <p className="text-2xl font-bold">92%</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-md">
          <TrendingUp size={24} className="mb-2 opacity-80" />
          <p className="text-blue-100 text-xs mb-1">Joriy mavsum</p>
          <p className="text-2xl font-bold">A'lo</p>
        </div>
      </div>

      <div className="pt-4 text-center">
        <p className="text-xs text-tg-hint mb-1">Klon uy - AgroTech Digital Twin</p>
        <p className="text-[10px] text-tg-hint/70">v1.0.0</p>
      </div>
    </div>
  );
};

export default ProfileTab;
