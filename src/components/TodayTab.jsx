import { Plus, Check, Sparkles, Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useSoundEffects from '../hooks/useSoundEffects';
import useHaptics from '../hooks/useHaptics';

const TodayTab = ({ habits, isCompletedToday, toggleHabit, onAddClick, darkMode, getStreak, onEdit }) => {
  const { playPop, playSuccess } = useSoundEffects();
  const { successVibrate } = useHaptics();
  const [showMenu, setShowMenu] = useState(false);
  const todayHabits = habits.filter(habit => habit);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [completedHabits, setCompletedHabits] = useState(new Set());

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const completedCount = habits.filter(habit => isCompletedToday(habit)).length;
  const totalCount = habits.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  useEffect(() => {
    if (allCompleted) {
      setShowConfetti(true);
      playSuccess();
      successVibrate();
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [allCompleted, playSuccess, successVibrate]);

  const handleCardClick = (habitId) => {
    const wasCompleted = isCompletedToday(habits.find(h => h.id === habitId));
    toggleHabit(habitId);
    
    if (!wasCompleted) {
      // Play sound and vibration when completing a habit
      playPop();
      successVibrate();
      
      setCompletedHabits(prev => new Set([...prev, habitId]));
      setTimeout(() => {
        setCompletedHabits(prev => {
          const newSet = new Set(prev);
          newSet.delete(habitId);
          return newSet;
        });
      }, 2000);
    }
  };

  // Get gradient colors based on habit category
  const getGradientColors = (category) => {
    const gradients = {
      'Health': 'from-emerald-400 via-emerald-500 to-teal-600',
      'Fitness': 'from-orange-400 via-red-500 to-pink-600',
      'Learning': 'from-blue-400 via-indigo-500 to-purple-600',
      'Work': 'from-slate-400 via-slate-500 to-slate-700',
      'Personal': 'from-purple-400 via-pink-500 to-rose-600',
      'Social': 'from-cyan-400 via-blue-500 to-indigo-600',
      'General': 'from-indigo-400 via-purple-500 to-pink-600',
    };
    return gradients[category] || gradients['General'];
  };

  return (
    <div className="pb-20 relative min-h-screen" style={{ paddingTop: `max(20px, env(safe-area-inset-top))` }}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      {todayHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] px-4"
        >
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No habits yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6">Start building your routine!</p>
          <motion.button
            onClick={onAddClick}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium shadow-md min-h-[44px] hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Habit
          </motion.button>
        </motion.div>
      ) : (
        <>
          {totalCount > 0 && (
            <div className="px-4 pt-2 mb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${darkMode ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} rounded-2xl p-3 shadow-xl border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Today's Progress</span>
                  <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {completedCount} / {totalCount}
                  </span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full h-2`}>
                  <motion.div
                    className={`h-2 rounded-full ${
                      allCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {allCompleted && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2`}>
                    🎉 All completed!
                  </motion.p>
                )}
              </motion.div>
            </div>
          )}
          
          {/* Grid Layout - 4 Columns with scroll */}
          <div className="grid grid-cols-4 gap-2 px-3 pt-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            <AnimatePresence>
              {habits.map((habit, index) => {
                const completed = isCompletedToday(habit);
                const isUnlocking = completedHabits.has(habit.id);
                const gradient = getGradientColors(habit.category);
                
                return (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotateY: 0,
                      boxShadow: completed 
                        ? '0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.2)' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      layout: { type: "spring", stiffness: 300, damping: 30 },
                      delay: index * 0.05,
                      duration: 0.3
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ 
                      scale: 1.02,
                      rotateY: completed ? 0 : 5,
                      zIndex: 10
                    }}
                    onClick={() => handleCardClick(habit.id)}
                    className={`relative cursor-pointer select-none aspect-[4/5] rounded-xl p-2 flex flex-col items-center justify-between ${
                      completed
                        ? `bg-gradient-to-br ${gradient}`
                        : darkMode
                          ? 'bg-slate-800/80 backdrop-blur-sm border-2 border-slate-600/50'
                          : 'bg-white/90 backdrop-blur-sm border-2 border-slate-300/50'
                    } transition-all duration-300 overflow-hidden`}
                    style={{
                      perspective: '1000px',
                      transformStyle: 'preserve-3d',
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${completed ? 'Mark as incomplete' : 'Mark as complete'}: ${habit.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(habit.id);
                      }
                    }}
                  >
                    {/* Glow Effect when unlocking */}
                    {isUnlocking && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0.8, 1.3, 1.8],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-emerald-400/40 to-teal-400/40 rounded-xl blur-lg pointer-events-none"
                      />
                    )}

                    {/* Golden Border when completed */}
                    {completed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-xl border border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.4)] pointer-events-none"
                      />
                    )}

                    {/* Emoji - Center, Compact */}
                    <motion.div
                      className="flex-1 flex items-center justify-center"
                      animate={{
                        scale: completed ? [1, 1.2, 1.1] : 1,
                        rotate: completed ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{ 
                        duration: 0.6,
                        delay: completed ? 0.1 : 0
                      }}
                    >
                      <span className="text-3xl">{habit.emoji}</span>
                    </motion.div>

                    {/* Title - Bottom */}
                    <div className="w-full text-center">
                      <h3 className={`font-semibold text-[10px] mb-0.5 truncate px-1 ${
                        completed 
                          ? 'text-white drop-shadow-md' 
                          : darkMode ? 'text-slate-200' : 'text-slate-800'
                      } ${completed ? 'line-through opacity-90' : ''}`}>
                        {habit.name}
                      </h3>
                      <div className="flex items-center justify-center gap-0.5">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                          completed
                            ? 'bg-white/30 text-white backdrop-blur-sm'
                            : darkMode 
                              ? 'bg-slate-700 text-slate-400' 
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          {habit.category}
                        </span>
                        {completed && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 25,
                              delay: 0.2
                            }}
                            className="text-yellow-300"
                          >
                            <Sparkles className="w-3 h-3" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Completion Checkmark - Floating */}
                    {completed && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1.2, 1],
                          opacity: [0, 1, 1],
                          y: [10, -5, 0]
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 20,
                          delay: 0.3
                        }}
                        className="absolute top-1 right-1 w-5 h-5 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                      </motion.div>
                    )}

                    {/* Locked State Indicator */}
                    {!completed && (
                      <motion.div
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-transparent rounded-2xl pointer-events-none"
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Floating Action Button with Menu */}
      <div className="fixed bottom-24 right-4 z-40">
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border mb-3 overflow-hidden`}
            >
              {/* Add New Habit Option */}
              <motion.button
                onClick={() => {
                  setShowMenu(false);
                  onAddClick();
                }}
                whileTap={{ scale: 0.95 }}
                className={`w-full px-6 py-4 flex items-center gap-3 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Add New Habit
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Create a new habit
                  </div>
                </div>
              </motion.button>

              {/* Divider */}
              <div className={`h-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

              {/* Edit Habits Option */}
              {habits.length > 0 && (
                <>
                  <div className={`h-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  <div className="max-h-48 overflow-y-auto">
                    {habits.map((habit, index) => (
                      <motion.button
                        key={habit.id}
                        onClick={() => {
                          setShowMenu(false);
                          onEdit(habit);
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full px-6 py-3 flex items-center gap-3 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="text-xl">{habit.emoji}</span>
                        <div className="text-left flex-1 min-w-0">
                          <div className={`font-medium text-sm ${darkMode ? 'text-slate-200' : 'text-slate-800'} truncate`}>
                            {habit.name}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {habit.category}
                          </div>
                        </div>
                        <Edit className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center min-h-[44px] min-w-[44px] transition-all ${
            showMenu
              ? 'bg-gradient-to-br from-red-600 to-pink-600 dark:from-red-500 dark:to-pink-500'
              : 'bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500'
          } hover:shadow-indigo-500/50`}
          aria-label={showMenu ? "Close menu" : "Open menu"}
        >
          <motion.div
            animate={{ rotate: showMenu ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {showMenu ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Plus className="w-6 h-6 text-white" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Backdrop to close menu */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowMenu(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        />
      )}
    </div>
  );
};

export default TodayTab;
