import React, { useEffect, useState } from 'react';
import { fetchTasks, submitTaskCompletion } from '../../services/api';
import { CheckCircle, Clock, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const handleComplete = (taskId) => {
    // Show mock camera upload UI before completing
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm("Dalil sifatida rasm yuklaysizmi?", (confirmed) => {
        if (confirmed) {
          processCompletion(taskId);
        }
      });
    } else {
      if(window.confirm("Dalil sifatida rasm yuklaysizmi?")) {
        processCompletion(taskId);
      }
    }
  };

  const processCompletion = (taskId) => {
    setSubmitting(taskId);
    submitTaskCompletion(taskId, null).then((res) => {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
      setSubmitting(null);
      
      // Show confetti!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B']
      });

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
        if (res && res.xp) {
          window.Telegram.WebApp.showAlert(`Tabriklaymiz! +50 XP oldingiz.\nHozirgi darajangiz: ${res.level}`);
        }
      }
    });
  };

  if (loading) {
    return <div className="p-4 flex justify-center items-center h-full text-tg-hint">Yuklanmoqda...</div>;
  }

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <header className="mb-4">
        <h1 className="text-2xl font-bold mb-1">Kunlik Topshiriqlar</h1>
        <p className="text-tg-hint text-sm">Sizning bugungi rejangiz</p>
      </header>

      {/* Pending Tasks */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center text-orange-500">
          <Clock size={18} className="mr-2" /> 
          Bajarilishi kerak ({pendingTasks.length})
        </h2>
        
        {pendingTasks.length === 0 ? (
          <p className="text-tg-hint text-sm">Barcha topshiriqlar bajarilgan!</p>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <div key={task.id} className="bg-tg-secondary-bg rounded-xl p-4 border border-gray-100/10">
                <div className="mb-3">
                  <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md mb-2 inline-block">
                    {task.crop_name || 'Umumiy'}
                  </span>
                  <h3 className="font-medium text-lg leading-tight">{task.task}</h3>
                </div>
                
                <button 
                  onClick={() => handleComplete(task.id)}
                  disabled={submitting === task.id}
                  className="w-full flex items-center justify-center py-2.5 rounded-lg bg-emerald-500 text-white font-medium active:bg-emerald-600 transition-colors"
                >
                  {submitting === task.id ? 'Yuborilmoqda...' : (
                    <>
                      <Camera size={18} className="mr-2" />
                      Bajarildi
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-8 opacity-70">
          <h2 className="text-lg font-bold mb-3 flex items-center text-emerald-500">
            <CheckCircle size={18} className="mr-2" /> 
            Bajarilganlar ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <div key={task.id} className="bg-tg-secondary-bg rounded-xl p-4 border border-gray-100/10 opacity-75">
                <span className="text-xs font-semibold text-tg-hint mb-1 block">
                  {task.crop_name || 'Umumiy'}
                </span>
                <h3 className="font-medium line-through text-tg-hint">{task.task}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTab;
