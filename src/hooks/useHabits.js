import { useState, useEffect } from 'react';

const HABITS_STORAGE_KEY = 'habit-tracker-habits-v1';
const SETTINGS_STORAGE_KEY = 'habit-tracker-settings-v1';

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const getDefaultSettings = () => ({
  calendarType: 'gregorian',
  darkMode: false,
  habitOrder: [],
});

const calculateStreak = (completionDates) => {
  if (!completionDates || completionDates.length === 0) return 0;

  const sortedDates = [...completionDates].sort((a, b) => new Date(b) - new Date(a));
  const today = getTodayDate();
  let streak = 0;
  let currentDate = new Date(today);

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    const diffTime = currentDate - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const newHabitId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const readHabitsFromStorage = () => {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((h) => ({
      id: h.id,
      name: h.name,
      category: h.category || 'General',
      emoji: h.emoji || '✨',
      completionDates: Array.isArray(h.completionDates) ? h.completionDates : [],
      completionLogs:
        h.completionLogs && typeof h.completionLogs === 'object' ? h.completionLogs : {},
      notificationSettings: h.notificationSettings ?? null,
      createdAt: h.createdAt || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
};

const readSettingsFromStorage = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return getDefaultSettings();
    const parsed = JSON.parse(raw);
    return { ...getDefaultSettings(), ...parsed };
  } catch {
    return getDefaultSettings();
  }
};

const persistHabits = (habits) => {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits to local storage:', e);
  }
};

const persistSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to local storage:', e);
  }
};

export const useHabits = () => {
  const [habits, setHabits] = useState(readHabitsFromStorage);
  const [settings, setSettings] = useState(readSettingsFromStorage);
  useEffect(() => {
    persistHabits(habits);
  }, [habits]);

  useEffect(() => {
    persistSettings(settings);
  }, [settings]);

  // Clean up today's date from completionDates when day changes
  useEffect(() => {
    if (habits.length === 0) return;

    const checkAndCleanToday = () => {
      const today = getTodayDate();

      setHabits((prev) => {
        let changed = false;
        const next = prev.map((habit) => {
          const todayIndex = habit.completionDates.indexOf(today);
          if (todayIndex <= -1) return habit;

          let shouldRemove = false;
          if (habit.completionLogs && habit.completionLogs[today]) {
            const logTimestamp = new Date(habit.completionLogs[today]);
            const logDate = logTimestamp.toISOString().split('T')[0];
            if (logDate !== today) shouldRemove = true;
          }

          if (!shouldRemove) return habit;

          changed = true;
          const updatedCompletionDates = habit.completionDates.filter((d) => d !== today);
          const updatedCompletionLogs = { ...habit.completionLogs };
          delete updatedCompletionLogs[today];
          return {
            ...habit,
            completionDates: updatedCompletionDates,
            completionLogs: updatedCompletionLogs,
          };
        });
        return changed ? next : prev;
      });
    };

    let lastCheckedDate = getTodayDate();

    const checkDayChange = () => {
      const currentDate = getTodayDate();
      if (currentDate === lastCheckedDate) return;
      lastCheckedDate = currentDate;
      const today = getTodayDate();

      setHabits((prev) => {
        let changed = false;
        const next = prev.map((habit) => {
          const todayIndex = habit.completionDates.indexOf(today);
          if (todayIndex <= -1) return habit;
          changed = true;
          const updatedCompletionDates = habit.completionDates.filter((d) => d !== today);
          const updatedCompletionLogs = { ...habit.completionLogs };
          delete updatedCompletionLogs[today];
          return {
            ...habit,
            completionDates: updatedCompletionDates,
            completionLogs: updatedCompletionLogs,
          };
        });
        return changed ? next : prev;
      });
    };

    const interval = setInterval(checkDayChange, 60000);
    checkAndCleanToday();

    return () => clearInterval(interval);
  }, [habits]);

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const getOrderedHabits = () => {
    if (settings.habitOrder.length === 0) {
      return habits;
    }
    const ordered = [...habits].sort((a, b) => {
      const indexA = settings.habitOrder.indexOf(a.id);
      const indexB = settings.habitOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    return ordered;
  };

  const addHabit = (habitData) => {
    const createdAt = new Date().toISOString();
    const newHabit = {
      id: newHabitId(),
      name: habitData.name,
      category: habitData.category || 'General',
      emoji: habitData.emoji || '✨',
      completionDates: [],
      completionLogs: {},
      createdAt,
    };

    setHabits((prev) => [...prev, newHabit]);
    if (settings.habitOrder.length > 0) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        habitOrder: [...prevSettings.habitOrder, newHabit.id],
      }));
    }
  };

  const toggleHabit = (habitId) => {
    const today = getTodayDate();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const completionDates = [...habit.completionDates];
    const completionLogs = { ...(habit.completionLogs || {}) };
    const todayIndex = completionDates.indexOf(today);

    if (todayIndex > -1) {
      completionDates.splice(todayIndex, 1);
      delete completionLogs[today];
    } else {
      completionDates.push(today);
      completionLogs[today] = new Date().toISOString();
    }

    setHabits((prev) =>
      prev.map((h) =>
        h.id !== habitId ? h : { ...h, completionDates, completionLogs }
      )
    );
  };

  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    if (settings.habitOrder.includes(habitId)) {
      setSettings((prev) => ({
        ...prev,
        habitOrder: prev.habitOrder.filter((id) => id !== habitId),
      }));
    }
  };

  const isCompletedToday = (habit) => {
    const today = getTodayDate();
    return habit.completionDates.includes(today);
  };

  const getStreak = (habit) => {
    return calculateStreak(habit.completionDates);
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const isHabitCompletedOnDate = (habit, date) => {
    return habit.completionDates.includes(date);
  };

  const toggleHabitOnDate = (habitId, date) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const completionDates = [...habit.completionDates];
    const completionLogs = { ...(habit.completionLogs || {}) };
    const dateIndex = completionDates.indexOf(date);

    if (dateIndex > -1) {
      completionDates.splice(dateIndex, 1);
      delete completionLogs[date];
    } else {
      completionDates.push(date);
      completionLogs[date] = new Date().toISOString();
    }

    setHabits((prev) =>
      prev.map((h) =>
        h.id !== habitId ? h : { ...h, completionDates, completionLogs }
      )
    );
  };

  const updateHabit = (habitId, habitData) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              name: habitData.name,
              category: habitData.category || 'General',
              emoji: habitData.emoji || '✨',
            }
          : h
      )
    );
  };

  const updateNotificationSettings = (habitId, notificationSettings) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, notificationSettings } : h
      )
    );
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const reorderHabits = (habitOrder) => {
    setSettings((prev) => ({ ...prev, habitOrder }));
  };

  const moveHabit = (habitId, direction) => {
    const currentOrder =
      settings.habitOrder.length > 0 ? [...settings.habitOrder] : habits.map((h) => h.id);

    const currentIndex = currentOrder.indexOf(habitId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;

    [currentOrder[currentIndex], currentOrder[newIndex]] = [
      currentOrder[newIndex],
      currentOrder[currentIndex],
    ];

    reorderHabits(currentOrder);
  };

  const getBestDay = () => {
    if (habits.length === 0) return null;

    const dayCompletions = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    const dayCounts = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    habits.forEach((habit) => {
      habit.completionDates.forEach((dateStr) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        dayCompletions[dayOfWeek]++;
        dayCounts[dayOfWeek]++;
      });
    });

    const averages = {};
    Object.keys(dayCompletions).forEach((day) => {
      averages[day] = dayCounts[day] > 0 ? dayCompletions[day] / dayCounts[day] : 0;
    });

    let bestDay = null;
    let bestAverage = 0;
    Object.keys(averages).forEach((day) => {
      if (averages[day] > bestAverage) {
        bestAverage = averages[day];
        bestDay = parseInt(day, 10);
      }
    });

    if (bestDay === null) return null;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      name: dayNames[bestDay],
      average: Math.round(bestAverage * 10) / 10,
      total: dayCompletions[bestDay],
    };
  };

  const getTotalCompletions = () => {
    let total = 0;
    habits.forEach((habit) => {
      total += habit.completionDates.length;
    });
    return total;
  };

  const getDateRange = (period) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let startDate = new Date();

    switch (period) {
      case 'weekly':
        startDate.setDate(today.getDate() - 6);
        break;
      case 'monthly':
        startDate.setDate(today.getDate() - 29);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate.setDate(today.getDate() - 6);
    }

    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate: today };
  };

  const getCompletionsInRange = (habit, startDate, endDate) => {
    if (!habit.completionDates || habit.completionDates.length === 0) {
      return [];
    }

    return habit.completionDates.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= startDate && date <= endDate;
    });
  };

  const getHabitCompletionRate = (habit, period) => {
    const { startDate, endDate } = getDateRange(period);
    const completions = getCompletionsInRange(habit, startDate, endDate);

    let totalDays;
    switch (period) {
      case 'weekly':
        totalDays = 7;
        break;
      case 'monthly':
        totalDays = 30;
        break;
      case 'all': {
        const firstCompletion =
          habit.completionDates.length > 0
            ? new Date(Math.min(...habit.completionDates.map((d) => new Date(d))))
            : new Date(habit.createdAt || Date.now());
        const daysSinceStart = Math.max(
          1,
          Math.ceil((endDate - firstCompletion) / (1000 * 60 * 60 * 24))
        );
        totalDays = daysSinceStart;
        break;
      }
      default:
        totalDays = 7;
    }

    return totalDays > 0 ? Math.round((completions.length / totalDays) * 100) : 0;
  };

  const getOverallCompletionRate = (period) => {
    if (habits.length === 0) return 0;

    const { startDate, endDate } = getDateRange(period);

    let totalCompletions = 0;
    let totalPossible = 0;

    habits.forEach((habit) => {
      const completions = getCompletionsInRange(habit, startDate, endDate);
      totalCompletions += completions.length;

      let daysInPeriod;
      switch (period) {
        case 'weekly':
          daysInPeriod = 7;
          break;
        case 'monthly':
          daysInPeriod = 30;
          break;
        case 'all': {
          const firstCompletion =
            habit.completionDates.length > 0
              ? new Date(Math.min(...habit.completionDates.map((d) => new Date(d))))
              : new Date(habit.createdAt || Date.now());
          daysInPeriod = Math.max(
            1,
            Math.ceil((endDate - firstCompletion) / (1000 * 60 * 60 * 24))
          );
          break;
        }
        default:
          daysInPeriod = 7;
      }

      totalPossible += daysInPeriod;
    });

    return totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
  };

  const getConsistencyScore = (rate) => {
    if (rate >= 80) {
      return { text: 'Excellent', emoji: '🔥', color: 'text-emerald-600 dark:text-emerald-400' };
    }
    if (rate >= 50) {
      return { text: 'Good', emoji: '👍', color: 'text-blue-600 dark:text-blue-400' };
    }
    if (rate >= 30) {
      return { text: 'Fair', emoji: '📈', color: 'text-yellow-600 dark:text-yellow-400' };
    }
    return { text: 'Needs Improvement', emoji: '💪', color: 'text-orange-600 dark:text-orange-400' };
  };

  const getHabitColor = (category) => {
    const colors = {
      Health: 'bg-emerald-500',
      Fitness: 'bg-orange-500',
      Learning: 'bg-blue-500',
      Work: 'bg-slate-500',
      Personal: 'bg-purple-500',
      Social: 'bg-cyan-500',
      General: 'bg-indigo-500',
    };
    return colors[category] || colors.General;
  };

  return {
    habits: getOrderedHabits(),
    settings,
    addHabit,
    toggleHabit,
    deleteHabit,
    isCompletedToday,
    getStreak,
    getWeekDates,
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
  };
};
