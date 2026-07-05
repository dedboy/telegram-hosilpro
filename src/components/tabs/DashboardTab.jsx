import React, { useEffect, useState } from 'react';
import { fetchPlots, submitCrop, fetchWeather } from '../../services/api';
import { PlusCircle, Droplets, Map, Sprout, X } from 'lucide-react';
const COMMON_CROPS = [
  { id: 'pomidor', name: 'Pomidor', icon: '🍅' },
  { id: 'bodring', name: 'Bodring', icon: '🥒' },
  { id: 'goza', name: 'G\'o\'za', icon: '🌿' },
  { id: 'bugdoy', name: 'Bug\'doy', icon: '🌾' },
  { id: 'olma', name: 'Olma', icon: '🍎' },
  { id: 'kartoshka', name: 'Kartoshka', icon: '🥔' },
];

const getWeatherStyle = (code) => {
  if (code === undefined || code === null) return { bg: 'from-blue-500 to-cyan-500', icon: '🌤️' };
  if (code === 0) return { bg: 'from-orange-400 to-yellow-400', icon: '☀️' };
  if (code <= 3) return { bg: 'from-blue-400 to-cyan-400', icon: '⛅' };
  if (code <= 48) return { bg: 'from-gray-400 to-gray-500', icon: '🌫️' };
  if (code <= 67 || (code >= 80 && code <= 82)) return { bg: 'from-indigo-500 to-blue-600', icon: '🌧️' };
  if (code <= 77 || (code >= 85 && code <= 86)) return { bg: 'from-blue-200 to-gray-300', icon: '❄️' };
  if (code >= 95) return { bg: 'from-purple-600 to-gray-800', icon: '⛈️' };
  return { bg: 'from-blue-500 to-cyan-500', icon: '🌤️' };
};

const DashboardTab = () => {
  const [plotData, setPlotData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingCrop, setSubmittingCrop] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropArea, setNewCropArea] = useState('');

  const loadPlots = () => {
    setLoading(true);
    fetchPlots().then((data) => {
      setPlotData(data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };

  const loadWeather = () => {
    fetchWeather().then((data) => {
      if (data) setWeatherData(data);
    });
  };

  useEffect(() => {
    loadPlots();
    loadWeather();
  }, []);

  const handleAddCropClick = () => {
    setShowAddModal(true);
  };

  const submitNewCrop = (e) => {
    e.preventDefault();
    if (!newCropName || !newCropArea) return;

    setSubmittingCrop(true);
    submitCrop({ name: newCropName, area: newCropArea }).then(() => {
      setSubmittingCrop(false);
      setShowAddModal(false);
      setNewCropName('');
      setNewCropArea('');
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      }
      
      // Refresh the dashboard data
      loadPlots();
    }).catch(() => {
      setSubmittingCrop(false);
      alert("Xatolik yuz berdi");
    });
  };

  if (loading && !plotData) {
    return <div className="p-4 flex justify-center items-center h-full text-tg-hint">Yuklanmoqda...</div>;
  }

  if (!plotData) {
    return (
      <div className="p-8 flex flex-col justify-center items-center text-center h-full">
        <p className="text-red-500 font-bold mb-2">Ma'lumot yuklanmadi</p>
        <p className="text-sm text-tg-hint">Iltimos, ilovaga Telegram bot orqali kiring. Oddiy brauzerda ishlamaydi.</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Raqamli Klon (Digital Twin)</h1>
        <p className="text-tg-hint text-sm">Sizning virtual ekinzoringiz</p>
      </header>

      {/* Weather Widget */}
      {weatherData && (
        <div className={`bg-gradient-to-r ${getWeatherStyle(weatherData.weathercode).bg} rounded-2xl p-5 shadow-sm text-white flex justify-between items-center mb-6 relative overflow-hidden`}>
          <div className="absolute -right-4 -top-4 opacity-20 text-8xl">
            {getWeatherStyle(weatherData.weathercode).icon}
          </div>
          <div className="relative z-10">
            <p className="text-sm opacity-90 flex items-center">
              <span className="text-xl mr-1">{getWeatherStyle(weatherData.weathercode).icon}</span>
              {weatherData.city} (Bugun)
            </p>
            <h2 className="text-4xl font-bold mt-1">{weatherData.temperature}°C</h2>
          </div>
          <div className="text-right relative z-10 bg-black/20 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-xs opacity-90 mb-1">Shamol tezligi</p>
            <p className="font-semibold text-lg">{weatherData.windspeed} <span className="text-sm font-normal">km/s</span></p>
          </div>
        </div>
      )}

      {/* Plot Stats Card */}
      <div className="bg-tg-secondary-bg rounded-2xl p-4 shadow-sm border border-gray-100/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Map className="mr-2 text-emerald-500" size={20} />
            Umumiy Maydon
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-tg-bg rounded-xl p-3">
            <p className="text-tg-hint text-xs mb-1">Hajmi</p>
            <p className="font-bold text-lg">{plotData.size}</p>
          </div>
          <div className="bg-tg-bg rounded-xl p-3">
            <p className="text-tg-hint text-xs mb-1">Tuproq Turi</p>
            <p className="font-bold text-lg">{plotData.soilType}</p>
          </div>
        </div>
      </div>

      {/* Active Crops */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Faol Ekinlar</h2>
        </div>
        
        <div className="space-y-4">
          {(!plotData.crops || plotData.crops.length === 0) && (
            <div className="text-center p-6 bg-tg-secondary-bg rounded-2xl border border-gray-100/10">
              <p className="text-tg-hint text-sm">Hali ekinlar qo'shilmagan.</p>
            </div>
          )}
          
          {plotData.crops && plotData.crops.map((crop) => (
            <div key={crop.id} className="bg-tg-secondary-bg rounded-2xl p-4 border border-gray-100/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg mr-3 text-emerald-600 dark:text-emerald-400">
                    <Sprout size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{crop.name}</h3>
                    <p className="text-tg-hint text-sm">{crop.area} • {crop.stage}</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              {crop.progress > 0 ? (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-tg-hint">O'sish bosqichi</span>
                    <span className="font-medium">{crop.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${crop.progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-tg-hint mt-2 italic">Yer tayyorlanmoqda...</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Crop Button */}
      <button 
        onClick={handleAddCropClick}
        className="w-full bg-tg-button text-tg-button-text rounded-2xl py-4 font-semibold flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform"
      >
        <PlusCircle className="mr-2" size={20} />
        Yangi ekin qo'shish
      </button>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 pb-8">
          <div className="bg-tg-secondary-bg w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-slide-up">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 bg-tg-bg rounded-full text-tg-hint active:scale-95"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">Yangi Ekin Qo'shish</h2>
            <form onSubmit={submitNewCrop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3 text-tg-hint">Ekin turini tanlang</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {COMMON_CROPS.map(c => (
                    <div 
                      key={c.id}
                      onClick={() => setNewCropName(c.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer border-2 transition-all active:scale-95 ${newCropName === c.name ? 'border-tg-button bg-tg-button/10' : 'border-transparent bg-tg-bg'}`}
                    >
                      <span className="text-3xl mb-1">{c.icon}</span>
                      <span className="text-xs font-medium text-center">{c.name}</span>
                    </div>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full bg-tg-bg border-none rounded-xl p-3 focus:ring-2 focus:ring-tg-button outline-none"
                  required 
                  placeholder="Yoki boshqa ekin nomini yozing..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-tg-hint">Maydoni (Masalan: 2 Sotix)</label>
                <input 
                  type="text" 
                  value={newCropArea}
                  onChange={(e) => setNewCropArea(e.target.value)}
                  className="w-full bg-tg-bg border-none rounded-xl p-3 focus:ring-2 focus:ring-tg-button outline-none"
                  required 
                  placeholder="Maydon hajmini kiriting"
                />
              </div>
              <button 
                type="submit"
                disabled={submittingCrop}
                className="w-full bg-tg-button text-tg-button-text rounded-xl py-3.5 font-bold mt-4 active:scale-[0.98] transition-transform"
              >
                {submittingCrop ? 'Qo\'shilmoqda...' : 'Tasdiqlash va Qo\'shish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTab;
