import React, { useState } from 'react';
import { Leaf, MapPin, Phone, ChevronRight } from 'lucide-react';
import { updateProfile } from '../services/api';

const REGIONS = [
  "Andijon viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Jizzax viloyati",
  "Xorazm viloyati",
  "Namangan viloyati",
  "Navoiy viloyati",
  "Qashqadaryo viloyati",
  "Qoraqalpog'iston Respublikasi",
  "Samarqand viloyati",
  "Sirdaryo viloyati",
  "Surxondaryo viloyati",
  "Toshkent viloyati",
  "Toshkent shahri"
];

const Onboarding = ({ onComplete }) => {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const firstName = tgUser?.first_name || "Hurmatli dehqon";
  
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    setStep(2);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !region) return;
    
    setSaving(true);
    try {
      const res = await updateProfile({ 
        phone_number: phone, 
        region: region,
        is_onboarded: true 
      });
      if (res && res.success) {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
        }
        onComplete();
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen bg-tg-bg text-tg-text flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      {step === 1 && (
        <div className="w-full max-w-sm text-center animate-slide-up relative z-10">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-emerald-400 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/30">
            <Leaf size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">HosilPro'ga Xush Kelibsiz!</h1>
          <p className="text-tg-hint text-lg mb-8">
            Salom, {firstName}! <br />
            Raqamli egizak va Sun'iy Intellekt yordamida ekinlaringiz hosildorligini oshirishga tayyormisiz?
          </p>
          
          <button 
            onClick={handleNext}
            className="w-full bg-tg-button text-tg-button-text py-4 rounded-2xl font-bold text-lg flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-tg-button/30"
          >
            Boshladik <ChevronRight className="ml-2" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-sm animate-slide-up relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">O'zingiz haqingizda</h2>
            <p className="text-tg-hint text-sm">Ma'lumotlaringiz aniqroq maslahat berishimiz uchun kerak.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-tg-hint flex items-center">
                <MapPin size={16} className="mr-1" /> Hududingiz
              </label>
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-tg-secondary-bg border border-gray-100/10 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                required
              >
                <option value="" disabled>Viloyatni tanlang</option>
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-tg-hint flex items-center">
                <Phone size={16} className="mr-1" /> Telefon raqamingiz
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full bg-tg-secondary-bg border border-gray-100/10 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-tg-button text-tg-button-text py-4 rounded-2xl font-bold text-lg mt-8 active:scale-95 transition-transform shadow-lg shadow-tg-button/30 disabled:opacity-70"
            >
              {saving ? 'Saqlanmoqda...' : 'Tasdiqlash'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
