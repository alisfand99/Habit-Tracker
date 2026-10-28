import { Moon, Sun, Calendar, HardDrive, Volume2, Vibrate } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import useSoundEffects from '../hooks/useSoundEffects';
import useHaptics from '../hooks/useHaptics';

const SettingsTab = ({
  calendarType,
  onCalendarChange,
  darkMode,
  onDarkModeToggle,
}) => {
  const { isSoundEnabled, setIsSoundEnabled, playClick } = useSoundEffects();
  const { isHapticsEnabled, setIsHapticsEnabled, isSupported: isHapticsSupported, lightVibrate } = useHaptics();

  const handleSoundToggle = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled) {
      playClick();
    }
  };

  const handleHapticsToggle = () => {
    setIsHapticsEnabled(!isHapticsEnabled);
    if (!isHapticsEnabled && isHapticsSupported) {
      lightVibrate();
    }
  };
  return (
    <div className="pb-20 px-4" style={{ paddingTop: `max(20px, env(safe-area-inset-top))` }}>
      {/* Settings Section */}
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Settings</h3>
        
        {/* Calendar System */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Calendar System</h4>
          </div>
          <div className="flex gap-2">
            {['gregorian', 'persian', 'hijri'].map((type) => (
              <button
                key={type}
                onClick={() => onCalendarChange(type)}
                className={clsx(
                  "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  calendarType === type
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                )}
              >
                {type === 'gregorian' ? 'Gregorian' : type === 'persian' ? 'Persian' : 'Hijri'}
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Dark Mode</h4>
            </div>
            <button
              onClick={onDarkModeToggle}
              className={clsx(
                "relative w-14 h-8 rounded-full transition-colors",
                darkMode ? "bg-indigo-600" : "bg-slate-300"
              )}
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: darkMode ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* Sound Effects Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Sound Effects</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Play sounds on interactions</p>
              </div>
            </div>
            <button
              onClick={handleSoundToggle}
              className={clsx(
                "relative w-14 h-8 rounded-full transition-colors",
                isSoundEnabled ? "bg-indigo-600" : "bg-slate-300"
              )}
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isSoundEnabled ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* Haptic Feedback Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vibrate className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Haptic Feedback</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isHapticsSupported ? 'Vibrate on interactions' : 'Not supported on this device'}
                </p>
              </div>
            </div>
            <button
              onClick={handleHapticsToggle}
              disabled={!isHapticsSupported}
              className={clsx(
                "relative w-14 h-8 rounded-full transition-colors",
                isHapticsEnabled && isHapticsSupported ? "bg-indigo-600" : "bg-slate-300",
                !isHapticsSupported && "opacity-50 cursor-not-allowed"
              )}
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isHapticsEnabled && isHapticsSupported ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

      </div>

      {/* Local data */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Data</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <HardDrive className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Stored on this device</h4>
          </div>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Habits and settings are saved in your browser (local storage). Clearing site data or using another browser will not show this data.
          </p>
        </div>
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
      >
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="mb-1">Habit Tracker</p>
          <p>Version 2.0.0</p>
        </div>
      </motion.div>

    </div>
  );
};

export default SettingsTab;
