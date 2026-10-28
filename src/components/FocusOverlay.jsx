import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, CheckCircle2, XCircle, Clock } from 'lucide-react';
import useSoundEffects from '../hooks/useSoundEffects';
import useHaptics from '../hooks/useHaptics';

// Completed Notification Component
const CompletedNotification = ({ onTransition, darkMode }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTransition();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onTransition]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-md text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-8xl mb-6"
      >
        ⏰
      </motion.div>
      <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-slate-200' : 'text-white'}`}>
        Time's Up!
      </h2>
      <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-300'} mb-8`}>
        Great focus session! 🎉
      </p>
    </motion.div>
  );
};

const FocusOverlay = ({ isOpen, onClose, habits = [], toggleHabit, darkMode }) => {
  const { playSuccess, playClick } = useSoundEffects();
  const { successVibrate, lightVibrate } = useHaptics();
  
  const [step, setStep] = useState('selection'); // 'selection' | 'timeSelection' | 'timer' | 'completed' | 'confirmation'
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(25); // minutes
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  
  const intervalRef = useRef(null);
  
  const durationOptions = [5, 10, 15, 25, 30, 45, 60]; // minutes

  // Reset state when overlay opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('selection');
      setSelectedHabit(null);
      setSelectedDuration(25);
      setTimeRemaining(25 * 60);
      setIsPaused(false);
      setHasNotified(false);
    } else {
      // Clean up timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    if (step === 'timer' && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished
            setStep('completed');
            playSuccess();
            successVibrate();
            setHasNotified(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [step, isPaused, timeRemaining, playSuccess, successVibrate]);

  const handleHabitSelect = (habit) => {
    setSelectedHabit(habit);
    setStep('timeSelection');
    playClick();
    lightVibrate();
  };

  const handleDurationSelect = (minutes) => {
    setSelectedDuration(minutes);
    setTimeRemaining(minutes * 60);
    setStep('timer');
    playClick();
    lightVibrate();
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    playClick();
    lightVibrate();
  };

  const handleGiveUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onClose();
  };

  const handleConfirmYes = () => {
    if (selectedHabit) {
      toggleHabit(selectedHabit.id);
      playSuccess();
      successVibrate();
    }
    onClose();
  };

  const handleConfirmNo = () => {
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = selectedDuration * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/98 backdrop-blur-sm z-[100]"
            style={{ paddingTop: `env(safe-area-inset-top)` }}
            onClick={step === 'selection' ? handleGiveUp : undefined}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            {/* Step 1: Selection */}
            {step === 'selection' && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl p-6 w-full max-w-md`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Zen Focus Mode
                      </h2>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Select a habit to focus on
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleGiveUp}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors`}
                  >
                    <X className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {habits.length === 0 ? (
                    <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <p>No habits available. Add some habits first!</p>
                    </div>
                  ) : (
                    habits.map((habit) => (
                      <motion.button
                        key={habit.id}
                        onClick={() => handleHabitSelect(habit)}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          darkMode
                            ? 'bg-slate-700/50 border-slate-600 hover:border-orange-500 hover:bg-slate-700'
                            : 'bg-slate-50 border-slate-200 hover:border-orange-500 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{habit.emoji}</span>
                          <div className="text-left flex-1">
                            <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                              {habit.name}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {habit.category}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Time Selection */}
            {step === 'timeSelection' && selectedHabit && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl p-6 w-full max-w-md`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Select Duration
                      </h2>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        How long do you want to focus?
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('selection')}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors`}
                  >
                    <X className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                  </button>
                </div>

                {/* Selected Habit Display */}
                <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} flex items-center gap-3`}>
                  <span className="text-3xl">{selectedHabit.emoji}</span>
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedHabit.name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {selectedHabit.category}
                    </div>
                  </div>
                </div>

                {/* Duration Options */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {durationOptions.map((minutes) => (
                    <motion.button
                      key={minutes}
                      onClick={() => handleDurationSelect(minutes)}
                      whileTap={{ scale: 0.95 }}
                      className={`py-4 rounded-xl font-semibold transition-all ${
                        selectedDuration === minutes
                          ? darkMode
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-orange-500 text-white shadow-lg'
                          : darkMode
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {minutes}m
                    </motion.button>
                  ))}
                </div>

                {/* Custom Duration Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Custom (minutes)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={selectedDuration}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const clampedValue = Math.min(Math.max(value, 1), 120);
                        setSelectedDuration(clampedValue);
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-slate-200'
                          : 'bg-white border-slate-300 text-slate-800'
                      } focus:outline-none focus:border-orange-500`}
                      placeholder="Enter minutes"
                    />
                    <motion.button
                      onClick={() => handleDurationSelect(selectedDuration)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-xl font-semibold ${
                        darkMode
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-orange-500 hover:bg-orange-600'
                      } text-white transition-colors`}
                    >
                      Start
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Timer */}
            {step === 'timer' && selectedHabit && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md flex flex-col items-center"
              >
                {/* Habit Display */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-8 text-center"
                >
                  <div className="text-6xl mb-4">{selectedHabit.emoji}</div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-white'} mb-2`}>
                    {selectedHabit.name}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                    Focus session
                  </p>
                </motion.div>

                {/* Circular Progress */}
                <div className="relative w-64 h-64 mb-8">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke={darkMode ? '#334155' : '#475569'}
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="#f97316"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 120}
                      initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 120 * (1 - progress / 100),
                      }}
                      transition={{ duration: 1, ease: 'linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-5xl font-mono font-bold ${darkMode ? 'text-slate-200' : 'text-white'}`}>
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  {/* Complete Early Button */}
                  <motion.button
                    onClick={() => {
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                      }
                      setStep('confirmation');
                      playClick();
                      lightVibrate();
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 ${
                      darkMode
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-emerald-500 hover:bg-emerald-600'
                    } text-white font-semibold shadow-lg transition-colors`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Done Early! Complete Now
                  </motion.button>

                  {/* Pause/Resume and Give Up */}
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handlePauseResume}
                      whileTap={{ scale: 0.9 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        darkMode
                          ? 'bg-slate-700 hover:bg-slate-600'
                          : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                      } transition-colors`}
                    >
                      {isPaused ? (
                        <Play className={`w-6 h-6 ${darkMode ? 'text-slate-200' : 'text-white'}`} />
                      ) : (
                        <Pause className={`w-6 h-6 ${darkMode ? 'text-slate-200' : 'text-white'}`} />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={handleGiveUp}
                      whileTap={{ scale: 0.9 }}
                      className={`flex-1 h-16 rounded-full flex items-center justify-center gap-2 ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-red-500 hover:bg-red-600'
                      } text-white font-semibold transition-colors`}
                    >
                      <X className="w-5 h-5" />
                      Give Up
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Completed (Brief notification) */}
            {step === 'completed' && selectedHabit && (
              <CompletedNotification 
                onTransition={() => setStep('confirmation')}
                darkMode={darkMode}
              />
            )}

            {/* Step 4: Confirmation */}
            {step === 'confirmation' && selectedHabit && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl p-8 w-full max-w-md`}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedHabit.emoji}</div>
                  <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Focus session done!
                  </h2>
                  <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Did you complete <span className="font-semibold">{selectedHabit.name}</span>?
                  </p>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    onClick={handleConfirmYes}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Yes
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmNo}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                      darkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                    No
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FocusOverlay;

