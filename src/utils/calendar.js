import { format } from 'date-fns';
import { format as formatJalali } from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';

// Convert Gregorian date to Islamic (Hijri) date using Intl.DateTimeFormat
const gregorianToHijri = (date) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      calendar: 'islamic'
    });
    
    const parts = formatter.formatToParts(date);
    const year = parseInt(parts.find(p => p.type === 'year').value);
    const month = parseInt(parts.find(p => p.type === 'month').value);
    const day = parseInt(parts.find(p => p.type === 'day').value);
    
    return { year, month, day };
  } catch (error) {
    // Fallback to approximate conversion
    const gregorianYear = date.getFullYear();
    const hijriYear = Math.round((gregorianYear - 622) * 1.0307);
    const hijriMonth = date.getMonth() + 1;
    const hijriDay = date.getDate();
    return { year: hijriYear, month: hijriMonth, day: hijriDay };
  }
};

// Format Islamic date
const formatHijriDate = (date, formatStr) => {
  const hijri = gregorianToHijri(date);
  const monthNames = ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'];
  
  if (formatStr === 'dd' || formatStr === 'd') {
    return hijri.day.toString();
  }
  if (formatStr === 'EEE') {
    const dayNames = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
    const dayOfWeek = date.getDay();
    return dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
  }
  if (formatStr === 'MMM') {
    return monthNames[hijri.month - 1] || '';
  }
  if (formatStr === 'MMMM') {
    return monthNames[hijri.month - 1] || '';
  }
  return `${hijri.day}/${hijri.month}/${hijri.year}`;
};

// Get day name for Islamic calendar
const getHijriDayName = (date) => {
  const dayNames = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
  const dayOfWeek = date.getDay();
  return dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
};

export const getCalendarDate = (date, calendarType) => {
  if (calendarType === 'persian') {
    return formatJalali(date, 'yyyy/MM/dd', { locale: faIR });
  } else if (calendarType === 'hijri') {
    return formatHijriDate(date, 'dd/MM/yyyy');
  }
  return format(date, 'yyyy-MM-dd');
};

export const getCalendarDayName = (date, calendarType) => {
  if (calendarType === 'persian') {
    return formatJalali(date, 'EEE', { locale: faIR });
  } else if (calendarType === 'hijri') {
    return getHijriDayName(date);
  }
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];
};

export const getCalendarDayNumber = (date, calendarType) => {
  if (calendarType === 'persian') {
    return formatJalali(date, 'd', { locale: faIR });
  } else if (calendarType === 'hijri') {
    return formatHijriDate(date, 'd');
  }
  return format(date, 'd');
};

export const getCalendarMonthName = (date, calendarType) => {
  if (calendarType === 'persian') {
    return formatJalali(date, 'MMMM', { locale: faIR });
  } else if (calendarType === 'hijri') {
    return formatHijriDate(date, 'MMMM');
  }
  return format(date, 'MMMM');
};

export const getWeekDates = (calendarType) => {
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

export const isWeekend = (date, calendarType) => {
  const dayOfWeek = date.getDay();
  if (calendarType === 'persian') {
    // Friday is weekend in Persian calendar
    return dayOfWeek === 5;
  } else if (calendarType === 'hijri') {
    // Friday is weekend in Hijri calendar
    return dayOfWeek === 5;
  }
  // Sunday is weekend in Gregorian calendar
  return dayOfWeek === 0;
};

// Holiday helper function - can be extended with actual holiday dates
export const isHoliday = (date, calendarType) => {
  // Example: Add specific holiday dates here
  // For now, we'll use weekends as holidays
  return isWeekend(date, calendarType);
  
  // You can extend this with actual holiday dates:
  // const dateStr = date.toISOString().split('T')[0];
  // const holidays = {
  //   'persian': ['1403/01/01', '1403/01/02', ...], // Nowruz, etc.
  //   'hijri': ['1445/01/01', '1445/10/01', ...], // Muharram, Eid, etc.
  //   'gregorian': ['2024/01/01', '2024/12/25', ...], // New Year, Christmas, etc.
  // };
  // return holidays[calendarType]?.includes(dateStr) || false;
};
