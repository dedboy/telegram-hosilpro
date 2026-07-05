import React, { useEffect, useState } from 'react';
import { User, Phone, TrendingUp, ShieldCheck, Award, Star, Edit2, X, Clock, MapPin } from 'lucide-react';
import { fetchProfile, updateProfile } from '../../services/api';

const ProfileTab = () => {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editRegion, setEditRegion] = useState('');
  const [saving, setSaving] = useState(false);

  const REGIONS = [
    "Andijon viloyati", "Buxoro viloyati", "Farg'ona viloyati", "Jizzax viloyati",
    "Xorazm viloyati", "Namangan viloyati", "Navoiy viloyati", "Qashqadaryo viloyati",
    "Qoraqalpog'iston Respublikasi", "Samarqand viloyati", "Sirdaryo viloyati",
    "Surxondaryo viloyati", "Toshkent viloyati", "Toshkent shahri"
  ];

  useEffect(() => {
    fetchProfile().then(data => {
      if (data) setProfileData(data);
    });
  }, []);
  
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editPhone || !editRegion) return;
    setSaving(true);
    try {
      const res = await updateProfile({ phone_number: editPhone, region: editRegion });
      if (res && res.success) {
        setProfileData({ ...profileData, phone_number: res.phone_number, region: res.region });
        setIsEditingProfile(false);
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
        }
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };
  
  const userInfo = {
    name: tgUser?.first_name || 'Fermer (Test)',
    lastName: tgUser?.last_name || '',
    username: tgUser?.username ? `@${tgUser.username}` : '',
    phone: profileData?.phone_number || 'Kiritilmagan',
    region: profileData?.region || 'Viloyat tanlanmagan',
    xp: profileData?.xp || 0,
    level: profileData?.level || 'Boshlovchi',
    isVerified: profileData?.is_verified || false,
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
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <Phone className="text-tg-hint mr-4" size={20} />
            <div>
              <p className="text-xs text-tg-hint">Telefon raqam</p>
              <p className="font-medium">{userInfo.phone}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditPhone(profileData?.phone_number || '+998 ');
              setEditRegion(profileData?.region || '');
              setIsEditingProfile(true);
            }} 
            className="p-2 bg-tg-bg rounded-full text-emerald-500 active:scale-95"
          >
            <Edit2 size={16} />
          </button>
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-700/50 mx-2"></div>
        <div className="flex items-center p-2">
          <MapPin className="text-tg-hint mr-4" size={20} />
          <div>
            <p className="text-xs text-tg-hint">Hudud</p>
            <p className="font-medium">{userInfo.region}</p>
          </div>
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-700/50 mx-2"></div>
        <div className="flex items-center p-2">
          {userInfo.isVerified ? (
            <ShieldCheck className="text-emerald-500 mr-4" size={20} />
          ) : (
            <Clock className="text-orange-500 mr-4" size={20} />
          )}
          <div>
            <p className="text-xs text-tg-hint">Holat</p>
            <p className="font-medium">
              {userInfo.isVerified ? 'Tasdiqlangan Fermer' : 'Tasdiqlanmagan (Kutish)'}
            </p>
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

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 pb-8">
          <div className="bg-tg-secondary-bg w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-slide-up">
            <button 
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 p-2 bg-tg-bg rounded-full text-tg-hint active:scale-95"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">Profilni tahrirlash</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-tg-hint">Telefon raqam</label>
                <input 
                  type="text" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-tg-bg border-none rounded-xl p-3 focus:ring-2 focus:ring-tg-button outline-none"
                  required 
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-tg-hint">Hududingiz</label>
                <select 
                  value={editRegion}
                  onChange={(e) => setEditRegion(e.target.value)}
                  className="w-full bg-tg-bg border-none rounded-xl p-3 focus:ring-2 focus:ring-tg-button outline-none appearance-none"
                  required
                >
                  <option value="" disabled>Viloyatni tanlang</option>
                  {REGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                disabled={saving}
                className="w-full bg-tg-button text-tg-button-text rounded-xl py-3.5 font-bold mt-4 active:scale-[0.98] transition-transform"
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
