import { useState, useEffect } from 'react';
import { getCalendarMonthName, getCalendarDayNumber, getCalendarDayName } from '../utils/calendar';

const Header = ({ title, calendarType }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = new Date();
  const monthName = getCalendarMonthName(today, calendarType);
  const dayNumber = getCalendarDayNumber(today, calendarType);
  const dayName = getCalendarDayName(today, calendarType);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time with seconds
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 py-3" style={{ paddingTop: `max(12px, env(safe-area-inset-top))` }}>
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200 text-center">{title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">
        {dayName}, {monthName} {dayNumber}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 text-center mt-0.5 font-mono">
        {formatTime(currentTime)}
      </p>
    </header>
  );
};

export default Header;
