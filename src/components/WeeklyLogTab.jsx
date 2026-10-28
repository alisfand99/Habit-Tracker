import { Check } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCalendarDayName, getCalendarDayNumber, isWeekend, isHoliday, getWeekDates } from '../utils/calendar';

const WeeklyLogTab = ({ habits, getWeekDates: getWeekDatesHook, isHabitCompletedOnDate, toggleHabitOnDate, calendarType, darkMode }) => {
  const weekDates = getWeekDatesHook();
  const scrollContainerRef = useRef(null);
  const [showFade, setShowFade] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const hasManyHabits = habits.length > 8;

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current && hasManyHabits) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowFade(scrollLeft + clientWidth < scrollWidth - 10);
      } else {
        setShowFade(false);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      if (hasManyHabits) {
        container.addEventListener('scroll', checkScroll);
        return () => container.removeEventListener('scroll', checkScroll);
      }
    }
  }, [habits, hasManyHabits]);

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-4 pb-20"
      >
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No habits yet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center">Add habits to see your weekly progress</p>
      </motion.div>
    );
  }

  // Calculate column width for habits
  // Always use fixed width of 100px for up to 8 habits, then scroll
  const dayColumnWidth = 80;
  const habitColumnWidth = 100; // Fixed width for all habits

  return (
    <div className="pb-20 relative overflow-hidden" style={{ paddingTop: `max(20px, env(safe-area-inset-top))` }}>
      <div
        ref={scrollContainerRef}
        className={`scroll-smooth-ios ${hasManyHabits ? 'overflow-x-auto overflow-y-hidden' : 'overflow-x-hidden overflow-y-hidden'}`}
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className={hasManyHabits ? 'inline-block' : 'w-full'}>
          <table 
            className={`border-collapse ${darkMode ? 'bg-slate-900' : 'bg-white'} ${hasManyHabits ? '' : 'w-full'}`}
            style={hasManyHabits ? { minWidth: `${dayColumnWidth + (habits.length * habitColumnWidth)}px` } : { tableLayout: 'fixed', width: '100%' }}
          >
            <thead>
              <tr>
                <th 
                  className={`sticky left-0 z-20 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-r px-2 py-1.5 text-left text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'} shadow-sm`}
                  style={{ width: `${dayColumnWidth}px`, minWidth: `${dayColumnWidth}px` }}
                >
                  Day
                </th>
                {habits.map((habit) => (
                  <th
                    key={habit.id}
                    className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-b px-1 py-2 text-center`}
                    style={{ minWidth: `${habitColumnWidth}px`, width: `${habitColumnWidth}px` }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-lg leading-none">{habit.emoji}</span>
                      <div 
                        className={`text-[10px] font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'} truncate max-w-full`}
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {habit.name}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDates.map((date, index) => {
                const dateObj = new Date(date);
                const dayName = getCalendarDayName(dateObj, calendarType);
                const dayNumber = getCalendarDayNumber(dateObj, calendarType);
                const isToday = date === today;
                const isFuture = date > today; // Check if date is in the future
                const isWeekendDay = isWeekend(dateObj, calendarType);
                const isHolidayDay = isHoliday(dateObj, calendarType);

                let rowBgClass = '';
                let dayTextClass = '';
                let dayNameClass = '';
                
                if (isToday) {
                  rowBgClass = darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50';
                  dayTextClass = darkMode ? 'text-indigo-300' : 'text-indigo-700';
                  dayNameClass = darkMode ? 'text-indigo-400' : 'text-indigo-600';
                } else if (isHolidayDay || isWeekendDay) {
                  rowBgClass = darkMode ? 'bg-red-900/30' : 'bg-red-50';
                  dayTextClass = darkMode ? 'text-red-300' : 'text-red-700';
                  dayNameClass = darkMode ? 'text-red-400' : 'text-red-600';
                } else {
                  dayTextClass = darkMode ? 'text-slate-300' : 'text-slate-700';
                  dayNameClass = darkMode ? 'text-slate-400' : 'text-slate-500';
                }

                return (
                  <motion.tr
                    key={date}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'} ${rowBgClass}`}
                    style={{ height: 'auto' }}
                  >
                    <td 
                      className={`sticky left-0 z-20 border-r px-2 py-1.5 text-xs font-medium shadow-sm ${
                        isToday 
                          ? darkMode 
                            ? 'bg-indigo-900/30 border-slate-700' 
                            : 'bg-indigo-50 border-slate-200'
                          : isHolidayDay || isWeekendDay
                            ? darkMode 
                              ? 'bg-red-900/30 border-slate-700' 
                              : 'bg-red-50 border-slate-200'
                            : darkMode 
                              ? 'bg-slate-900 border-slate-700' 
                              : 'bg-white border-slate-200'
                      }`}
                      style={{ width: `${dayColumnWidth}px`, minWidth: `${dayColumnWidth}px`, height: 'auto' }}
                    >
                      <div className="flex flex-col gap-0 leading-none">
                        <span className={`text-[10px] ${dayNameClass} leading-tight`}>{dayName}</span>
                        <span className={`text-xs font-semibold ${dayTextClass} leading-tight`}>{dayNumber}</span>
                      </div>
                    </td>
                    {habits.map((habit) => {
                      const completed = isHabitCompletedOnDate(habit, date);
                      return (
                        <td
                          key={`${habit.id}-${date}`}
                          className="px-1.5 py-1.5 text-center"
                          style={{ height: 'auto', minWidth: `${habitColumnWidth}px`, width: `${habitColumnWidth}px` }}
                        >
                          {isFuture ? (
                            // Future dates: disabled, non-clickable
                            <div className="flex items-center justify-center mx-auto h-8 w-8">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-40 ${
                                darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-slate-100 border-2 border-slate-200'
                              }`}>
                                <span className="text-xs text-slate-400">-</span>
                              </div>
                            </div>
                          ) : (
                            // Past and today: clickable
                            <motion.button
                              onClick={() => toggleHabitOnDate(habit.id, date)}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center justify-center mx-auto h-8 w-8"
                              aria-label={`Toggle ${habit.name} for ${dayName}`}
                            >
                              <motion.div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  completed
                                    ? 'bg-emerald-500 text-white'
                                    : darkMode ? 'bg-slate-700 border-2 border-slate-600' : 'bg-slate-100 border-2 border-slate-300'
                                }`}
                                initial={false}
                                animate={{ scale: completed ? 1 : 1 }}
                              >
                                {completed && <Check className="w-3.5 h-3.5" />}
                              </motion.div>
                            </motion.button>
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showFade && hasManyHabits && (
        <div className={`absolute right-0 top-0 bottom-0 w-20 pointer-events-none z-10 ${
          darkMode 
            ? 'bg-gradient-to-l from-slate-900' 
            : 'bg-gradient-to-l from-white'
        }`} />
      )}
    </div>
  );
};

export default WeeklyLogTab;
