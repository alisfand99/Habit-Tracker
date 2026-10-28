import { TrendingUp, Flame, Target, Calendar, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const StatsTab = ({ 
  habits, 
  getStreak, 
  isCompletedToday, 
  getWeekDates, 
  isHabitCompletedOnDate, 
  darkMode, 
  getBestDay, 
  getTotalCompletions,
  getHabitCompletionRate,
  getOverallCompletionRate,
  getConsistencyScore,
  getHabitColor,
  getCompletionsInRange,
  getDateRange,
}) => {
  const [timeFilter, setTimeFilter] = useState('weekly'); // 'weekly', 'monthly', 'all'
  
  // Calculate stats based on selected filter
  const overallRate = getOverallCompletionRate(timeFilter);
  const consistencyScore = getConsistencyScore(overallRate);
  
  // Get date range for current filter
  const { startDate, endDate } = getDateRange(timeFilter);
  
  // Calculate total completions in period
  let totalCompletionsInPeriod = 0;
  let totalPossibleInPeriod = 0;
  
  habits.forEach(habit => {
    const completions = getCompletionsInRange(habit, startDate, endDate);
    totalCompletionsInPeriod += completions.length;
    
    let daysInPeriod;
    switch (timeFilter) {
      case 'weekly':
        daysInPeriod = 7;
        break;
      case 'monthly':
        daysInPeriod = 30;
        break;
      case 'all':
        const firstCompletion = habit.completionDates.length > 0 
          ? new Date(Math.min(...habit.completionDates.map(d => new Date(d))))
          : new Date(habit.createdAt || Date.now());
        daysInPeriod = Math.max(1, Math.ceil((endDate - firstCompletion) / (1000 * 60 * 60 * 24)));
        break;
      default:
        daysInPeriod = 7;
    }
    
    totalPossibleInPeriod += daysInPeriod;
  });

  // Calculate longest streak (all time)
  const streaks = habits.map(habit => getStreak(habit));
  const longestStreak = streaks.length > 0 ? Math.max(...streaks) : 0;

  // Get best day (all time)
  const bestDay = getBestDay();
  const totalAllTime = getTotalCompletions();

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-4 pb-20"
      >
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No data yet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center">Add habits to see your statistics</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20 px-4 space-y-4"
      style={{ paddingTop: `max(24px, calc(env(safe-area-inset-top) + 8px))` }}
    >
      {/* Time Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-1 shadow-sm border flex gap-1`}
      >
        {['weekly', 'monthly', 'all'].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeFilter === filter
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm'
                : darkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {filter === 'weekly' ? 'Weekly' : filter === 'monthly' ? 'Monthly' : 'All Time'}
          </button>
        ))}
      </motion.div>

      {/* Consistency Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`${darkMode ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-slate-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-slate-200'} rounded-xl p-5 shadow-sm border`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className={`w-6 h-6 ${consistencyScore.color}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Consistency Score</span>
            </div>
            <div className={`text-3xl font-bold ${consistencyScore.color} mb-1`}>
              {consistencyScore.emoji} {consistencyScore.text}
            </div>
            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {overallRate}% completion rate
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {overallRate}%
            </div>
            <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>
              {totalCompletionsInPeriod} of {totalPossibleInPeriod}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overall Stats Cards - Grid of 3 */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-4 shadow-sm border`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Streak</span>
          </div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{longestStreak}</div>
          <div className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>days</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-4 shadow-sm border`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Best Day</span>
          </div>
          {bestDay ? (
            <>
              <div className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} truncate`}>{bestDay.name}</div>
              <div className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>
                Avg: {bestDay.average}
              </div>
            </>
          ) : (
            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No data</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-4 shadow-sm border`}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total</span>
          </div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{totalAllTime}</div>
          <div className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>all-time</div>
        </motion.div>
      </div>

      {/* Habit Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-4 shadow-sm border`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Habit Performance</h3>
          <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {timeFilter === 'weekly' ? 'Last 7 days' : timeFilter === 'monthly' ? 'Last 30 days' : 'All time'}
          </span>
        </div>
        <div className="space-y-3">
          {habits.map((habit, index) => {
            const rate = getHabitCompletionRate(habit, timeFilter);
            const streak = getStreak(habit);
            const habitColor = getHabitColor(habit.category || 'General');

            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">{habit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium text-sm ${darkMode ? 'text-slate-200' : 'text-slate-800'} truncate`}>{habit.name}</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{rate}%</span>
                  </div>
                  <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full h-2 overflow-hidden`}>
                    <motion.div
                      className={`${habitColor} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${rate}%` }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                    />
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Flame className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {streak} day{streak !== 1 ? 's' : ''} streak
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsTab;
