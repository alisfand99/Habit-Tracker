import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Clock } from 'lucide-react';

const NotificationConfigDrawer = ({ habit, updateNotificationSettings, darkMode, onClose }) => {
  const [tempSettings, setTempSettings] = useState(() => {
    return habit.notificationSettings || {
      enabled: false,
      days: [],
      times: [],
    };
  });

  const toggleDay = (day) => {
    const days = tempSettings.days || [];
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day].sort((a, b) => a - b);
    setTempSettings({ ...tempSettings, days: newDays });
  };

  const addTime = () => {
    const now = new Date();
    const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const times = tempSettings.times || [];
    if (!times.includes(defaultTime)) {
      setTempSettings({ ...tempSettings, times: [...times, defaultTime].sort() });
    }
  };

  const removeTime = (timeToRemove) => {
    const times = (tempSettings.times || []).filter(t => t !== timeToRemove);
    setTempSettings({ ...tempSettings, times });
  };

  const updateTime = (oldTime, newTime) => {
    const times = (tempSettings.times || []).map(t => t === oldTime ? newTime : t).sort();
    setTempSettings({ ...tempSettings, times });
  };

  const saveSettings = async () => {
    await updateNotificationSettings(habit.id, tempSettings);
    onClose();
  };

  const getDayLabel = (day) => {
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return labels[day];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed bottom-0 left-0 right-0 ${
          darkMode ? 'bg-slate-900' : 'bg-white'
        } rounded-t-3xl shadow-2xl z-50 flex flex-col max-h-[85vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex-shrink-0 flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
        }`} style={{ paddingTop: `max(16px, calc(env(safe-area-inset-top) + 16px))` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{habit.emoji}</span>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {habit.name}
              </h3>
              <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Configure notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            } transition-colors`}
          >
            <X className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          <div className="p-4 space-y-4">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-sm font-semibold mb-0.5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Enable Notifications
                </h4>
                <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Receive reminders for this habit
                </p>
              </div>
              <button
                onClick={() => setTempSettings({ ...tempSettings, enabled: !tempSettings.enabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  tempSettings.enabled
                    ? 'bg-indigo-600'
                    : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                }`}
              >
                <motion.div
                  animate={{ x: tempSettings.enabled ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {tempSettings.enabled && (
              <>
                {/* Day Selector */}
                <div>
                  <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Days
                  </h4>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                      const isSelected = (tempSettings.days || []).includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`flex-1 aspect-square rounded-full text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md scale-105'
                              : darkMode
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {getDayLabel(day)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Times
                    </h4>
                    <button
                      onClick={addTime}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        darkMode
                          ? 'bg-indigo-900 text-indigo-300 hover:bg-indigo-800'
                          : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                      } transition-colors`}
                    >
                      <Plus className="w-3 h-3" />
                      Add Time
                    </button>
                  </div>
                  {(tempSettings.times || []).length === 0 ? (
                    <div className={`text-center py-6 rounded-lg ${
                      darkMode ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      <Clock className={`w-6 h-6 mx-auto mb-1.5 ${
                        darkMode ? 'text-slate-600' : 'text-slate-400'
                      }`} />
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        No times set. Click "Add Time" to add one.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {(tempSettings.times || []).map((time) => (
                        <div
                          key={time}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            darkMode ? 'bg-slate-800' : 'bg-slate-100'
                          }`}
                        >
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => updateTime(time, e.target.value)}
                            className={`flex-1 px-2 py-1.5 rounded border text-sm ${
                              darkMode
                                ? 'bg-slate-900 border-slate-700 text-slate-200'
                                : 'bg-white border-slate-300 text-slate-800'
                            } focus:outline-none focus:border-indigo-500`}
                          />
                          <button
                            onClick={() => removeTime(time)}
                            className={`p-1.5 rounded ${
                              darkMode
                                ? 'hover:bg-slate-700 text-slate-400'
                                : 'hover:bg-slate-200 text-slate-500'
                            } transition-colors`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className={`flex-shrink-0 p-4 border-t ${
          darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
        }`}>
          <button
            onClick={saveSettings}
            disabled={tempSettings.enabled && (!tempSettings.days?.length || !tempSettings.times?.length)}
            className={`w-full py-3 rounded-lg text-sm font-semibold transition-all shadow-lg ${
              tempSettings.enabled && tempSettings.days?.length && tempSettings.times?.length
                ? darkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                : darkMode
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationConfigDrawer;

