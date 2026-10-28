import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import TodayTab from './components/TodayTab';
import WeeklyLogTab from './components/WeeklyLogTab';
import StatsTab from './components/StatsTab';
import SettingsTab from './components/SettingsTab';
import AddHabitForm from './components/AddHabitForm';
import { useHabits } from './hooks/useHabits';
import useNotifications from './hooks/useNotifications';
import { getWeekDates } from './utils/calendar';

function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const {
    habits,
    settings,
    addHabit,
    toggleHabit,
    deleteHabit,
    isCompletedToday,
    getStreak,
    isHabitCompletedOnDate,
    toggleHabitOnDate,
    updateHabit,
    updateNotificationSettings,
    updateSettings,
    moveHabit,
    getBestDay,
    getTotalCompletions,
    getDateRange,
    getCompletionsInRange,
    getHabitCompletionRate,
    getOverallCompletionRate,
    getConsistencyScore,
    getHabitColor,
  } = useHabits();

  // Initialize notification system
  useNotifications(habits);

  const pageTitles = {
    today: 'Today',
    weekly: 'Weekly Log',
    stats: 'Statistics',
    settings: 'Settings',
  };

  const handleAddClick = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  const handleAdd = (habitData) => {
    addHabit(habitData);
  };

  const handleUpdate = (habitId, habitData) => {
    updateHabit(habitId, habitData);
  };

  const handleCalendarChange = (calendarType) => {
    updateSettings({ calendarType });
  };

  const handleDarkModeToggle = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const handleMoveHabit = (habitId, direction) => {
    moveHabit(habitId, direction);
  };

  const handleDelete = (habitId) => {
    deleteHabit(habitId);
  };

  const renderTab = () => {
    const tabVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

    switch (activeTab) {
      case 'today':
        return (
          <motion.div
            key="today"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <TodayTab
              habits={habits}
              isCompletedToday={isCompletedToday}
              toggleHabit={toggleHabit}
              onAddClick={handleAddClick}
              onEdit={handleEdit}
              darkMode={settings.darkMode}
              getStreak={getStreak}
            />
          </motion.div>
        );
      case 'weekly':
        return (
          <motion.div
            key="weekly"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <WeeklyLogTab
              habits={habits}
              getWeekDates={() => getWeekDates(settings.calendarType)}
              isHabitCompletedOnDate={isHabitCompletedOnDate}
              toggleHabitOnDate={toggleHabitOnDate}
              calendarType={settings.calendarType}
              darkMode={settings.darkMode}
            />
          </motion.div>
        );
      case 'stats':
        return (
          <motion.div
            key="stats"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <StatsTab
              habits={habits}
              getStreak={getStreak}
              isCompletedToday={isCompletedToday}
              getWeekDates={() => getWeekDates(settings.calendarType)}
              isHabitCompletedOnDate={isHabitCompletedOnDate}
              darkMode={settings.darkMode}
              getBestDay={getBestDay}
              getTotalCompletions={getTotalCompletions}
              getHabitCompletionRate={getHabitCompletionRate}
              getOverallCompletionRate={getOverallCompletionRate}
              getConsistencyScore={getConsistencyScore}
              getHabitColor={getHabitColor}
              getCompletionsInRange={getCompletionsInRange}
              getDateRange={getDateRange}
            />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            key="settings"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <SettingsTab
              calendarType={settings.calendarType}
              onCalendarChange={handleCalendarChange}
              darkMode={settings.darkMode}
              onDarkModeToggle={handleDarkModeToggle}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50'} pb-20 transition-colors`}>
      <Header title={pageTitles[activeTab]} calendarType={settings.calendarType} />
      <main className="pt-2">
        <AnimatePresence mode="wait">
          {renderTab()}
        </AnimatePresence>
      </main>
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={settings.darkMode}
        habits={habits}
        toggleHabit={toggleHabit}
        onAddClick={handleAddClick}
        onAddHabit={handleAdd}
        onUpdateHabit={handleUpdate}
        onDeleteHabit={handleDelete}
        updateNotificationSettings={updateNotificationSettings}
      />
      <AddHabitForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editingHabit={editingHabit}
        darkMode={settings.darkMode}
      />
    </div>
  );
}

export default App;
