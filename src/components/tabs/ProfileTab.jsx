import React, { useEffect, useState } from 'react';
import { User, Phone, TrendingUp, ShieldCheck, Award, Star } from 'lucide-react';
import { fetchProfile } from '../../services/api';

const ProfileTab = () => {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfile().then(data => {
      if (data) setProfileData(data);
    });
  }, []);
  
  const userInfo = {
    name: tgUser?.first_name || 'Fermer (Test)',
    lastName: tgUser?.last_name || '',
    username: tgUser?.username ? `@${tgUser.username}` : '',
    phone: '+998 90 123 45 67',
    xp: profileData?.xp || 0,
    level: profileData?.level || 'Boshlovchi',
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
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <Star size={60} className="absolute -right-4 -bottom-4 opacity-20" />
          <Award size={24} className="mb-2 opacity-80" />
          <p className="text-yellow-100 text-xs mb-1">Tajriba bali (XP)</p>
          <p className="text-2xl font-bold">{userInfo.xp} <span className="text-sm font-normal">XP</span></p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <ShieldCheck size={60} className="absolute -right-4 -bottom-4 opacity-20" />
          <TrendingUp size={24} className="mb-2 opacity-80" />
          <p className="text-blue-100 text-xs mb-1">Daraja (Level)</p>
          <p className="text-xl font-bold">{userInfo.level}</p>
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
