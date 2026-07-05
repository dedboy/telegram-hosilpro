import React, { useEffect, useState } from 'react';
import { fetchReports, submitReport } from '../../services/api';
import { AlertTriangle, Send, History } from 'lucide-react';

const ReportTab = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    crop: '',
    description: ''
  });

  useEffect(() => {
    fetchReports().then(data => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.crop || !formData.description) return;
    
    setSubmitting(true);
    submitReport(formData).then(() => {
      setSubmitting(false);
      setFormData({ crop: '', description: '' });
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert("Muammo muvaffaqiyatli yuborildi. Tez orada mutaxassislarimiz bog'lanishadi!");
      } else {
        alert("Muammo yuborildi!");
      }
      
      // Refresh reports mock
      setReports([{ id: Date.now(), crop: formData.crop, description: formData.description, status: 'Kutish jarayonida' }, ...reports]);
    });
  };

  if (loading) {
    return <div className="p-4 flex justify-center items-center h-full text-tg-hint">Yuklanmoqda...</div>;
  }

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <header className="mb-4">
        <h1 className="text-2xl font-bold mb-1">Muammo va SOS</h1>
        <p className="text-tg-hint text-sm">Mutaxassislardan yordam so'rash</p>
      </header>

      {/* Report Form */}
      <div className="bg-tg-secondary-bg rounded-2xl p-5 border border-gray-100/10">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-red-500">
          <AlertTriangle size={20} className="mr-2" />
          Yangi Muammo Xabar Qilish
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-tg-hint">Ekin turi</label>
            <select 
              className="w-full bg-tg-bg border-none rounded-xl p-3 focus:ring-2 focus:ring-tg-button outline-none"
              value={formData.crop}
              onChange={(e) => setFormData({...formData, crop: e.target.value})}
              required
            >
              <option value="" disabled>Tanlang...</option>
              <option value="Pomidor">Pomidor</option>
              <option value="Bodring">Bodring</option>
              <option value="Boshqa">Boshqa</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-tg-hint">Muammo ta'rifi</label>
            <textarea 
              className="w-full bg-tg-bg border-none rounded-xl p-3 focus:ring-2 focus:ring-tg-button outline-none min-h-[100px] resize-none"
              placeholder="Masalan: Barglar sarg'aymoqda..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-tg-hint"><span className="font-semibold">Rasm yuklash</span></p>
                </div>
                <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-red-500 text-white rounded-xl py-3.5 font-medium flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            {submitting ? 'Yuborilmoqda...' : (
              <>
                <Send size={18} className="mr-2" />
                Xabar yuborish
              </>
            )}
          </button>
        </form>
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <History size={18} className="mr-2" />
          Avvalgi Murojaatlar
        </h2>
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="bg-tg-secondary-bg rounded-xl p-4 border border-gray-100/10">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{report.crop}</span>
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                  report.status === 'Yechim berildi' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-tg-hint">{report.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportTab;
