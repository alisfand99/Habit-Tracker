import { Calendar, Grid3x3, BarChart3, Settings, Flame, Trophy, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useSoundEffects from '../hooks/useSoundEffects';
import useHaptics from '../hooks/useHaptics';
import AchievementsModal from './AchievementsModal';
import FocusOverlay from './FocusOverlay';
import HabitManagerModal from './HabitManagerModal';

const BottomNavigation = ({ 
  activeTab, 
  onTabChange, 
  darkMode, 
  habits = [], 
  toggleHabit, 
  onAddClick,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  updateNotificationSettings
}) => {
  const { playClick } = useSoundEffects();
  const { lightVibrate } = useHaptics();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isFocusOverlayOpen, setIsFocusOverlayOpen] = useState(false);
  const [isHabitManagerOpen, setIsHabitManagerOpen] = useState(false);

  const handleTabChange = (tabId) => {
    playClick();
    lightVibrate();
    onTabChange(tabId);
  };
  const tabs = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'weekly', label: 'Weekly', icon: Grid3x3 },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-t safe-area-inset-bottom z-50`}>
      <div className="flex justify-around items-center h-16 relative">
        {/* تب‌های سمت چپ */}
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}
              aria-label={tab.label}
            >
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Icon className="w-6 h-6 mb-1" />
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
        
        {/* Radial Menu - Center Button */}
        <div className="relative flex items-center justify-center w-12 h-12 mx-2">
          {/* Satellite Buttons */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                />
                
                {/* Button 1: Top Center - Achievements */}
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    closed: {
                      scale: 0,
                      opacity: 0,
                      y: 0,
                      x: 0,
                    },
                    open: {
                      scale: 1,
                      opacity: 1,
                      y: -80,
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.1,
                      },
                    },
                  }}
                  className="absolute flex flex-col items-center z-50"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsAchievementsModalOpen(true);
                      playClick();
                      lightVibrate();
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg flex items-center justify-center"
                    aria-label="Achievements"
                  >
                    <Trophy className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsAchievementsModalOpen(true);
                      playClick();
                      lightVibrate();
                    }}
                    className="mt-1 text-[10px] text-white font-medium drop-shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    Awards
                  </motion.button>
                </motion.div>

                {/* Button 2: Top Left - Manage Habits */}
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    closed: {
                      scale: 0,
                      opacity: 0,
                      y: 0,
                      x: 0,
                    },
                    open: {
                      scale: 1,
                      opacity: 1,
                      y: -60,
                      x: -60,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.05,
                      },
                    },
                  }}
                  className="absolute flex flex-col items-center z-50"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsHabitManagerOpen(true);
                      playClick();
                      lightVibrate();
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg flex items-center justify-center"
                    aria-label="Manage Habits"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsHabitManagerOpen(true);
                      playClick();
                      lightVibrate();
                    }}
                    className="mt-1 text-[10px] text-white font-medium drop-shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    Manage
                  </motion.button>
                </motion.div>

                {/* Button 3: Top Right - Focus Timer */}
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    closed: {
                      scale: 0,
                      opacity: 0,
                      y: 0,
                      x: 0,
                    },
                    open: {
                      scale: 1,
                      opacity: 1,
                      y: -60,
                      x: 60,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.15,
                      },
                    },
                  }}
                  className="absolute flex flex-col items-center z-50"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsFocusOverlayOpen(true);
                      playClick();
                      lightVibrate();
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-red-600 shadow-lg flex items-center justify-center"
                    aria-label="Focus Timer"
                  >
                    <Clock className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsFocusOverlayOpen(true);
                      playClick();
                      lightVibrate();
                    }}
                    className="mt-1 text-[10px] text-white font-medium drop-shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    Focus
                  </motion.button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Center Button */}
          <motion.button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              playClick();
              lightVibrate();
            }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 shadow-xl flex items-center justify-center z-50 transition-all"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Flame className="w-6 h-6 text-white" />
            </motion.div>
          </motion.button>
        </div>
        
        {/* تب‌های سمت راست */}
        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}
              aria-label={tab.label}
            >
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Icon className="w-6 h-6 mb-1" />
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        habits={habits}
        darkMode={darkMode}
      />

      {/* Focus Overlay */}
      <FocusOverlay
        isOpen={isFocusOverlayOpen}
        onClose={() => setIsFocusOverlayOpen(false)}
        habits={habits}
        toggleHabit={toggleHabit}
        darkMode={darkMode}
      />

      {/* Habit Manager Modal */}
      <HabitManagerModal
        isOpen={isHabitManagerOpen}
        onClose={() => setIsHabitManagerOpen(false)}
        habits={habits}
        onAdd={onAddHabit}
        onUpdate={onUpdateHabit}
        onDelete={onDeleteHabit}
        updateNotificationSettings={updateNotificationSettings}
        darkMode={darkMode}
      />
    </nav>
  );
};

export default BottomNavigation;
