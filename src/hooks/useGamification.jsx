import { useMemo } from 'react';
import { analyzeBehavior } from '../utils/insightEngine';

// Tier-based Badge Definitions (20+ badges)
const badgeDefinitions = [
  // === BRONZE TIER (The Starter) ===
  {
    id: 'baby-step',
    title: 'Baby Step',
    icon: '👶',
    tier: 'bronze',
    description: 'Complete first habit ever',
    scienceNote: 'The journey of a thousand miles begins with a single step.',
    color: 'from-orange-400 to-amber-500',
    maxProgress: 1,
  },
  {
    id: 'hat-trick',
    title: 'The Hat-Trick',
    icon: '🎩',
    tier: 'bronze',
    description: '3-day streak',
    scienceNote: 'Small wins release dopamine, fueling further action.',
    color: 'from-orange-400 to-amber-500',
    maxProgress: 3,
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    icon: '⚔️',
    tier: 'bronze',
    description: 'Complete habits on Sat & Sun',
    scienceNote: 'Consistency implies no days off.',
    color: 'from-orange-400 to-amber-500',
    maxProgress: 1,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    icon: '🦉',
    tier: 'bronze',
    description: 'Complete a habit after 10 PM',
    scienceNote: 'Late night focus shows dedication when energy is low.',
    color: 'from-orange-400 to-amber-500',
    maxProgress: 1,
  },
  {
    id: 'clean-slate',
    title: 'Clean Slate',
    icon: '✨',
    tier: 'bronze',
    description: 'Complete all habits in one day',
    scienceNote: 'Closing open loops reduces mental clutter.',
    color: 'from-orange-400 to-amber-500',
    maxProgress: 1,
  },

  // === SILVER TIER (The Builder) ===
  {
    id: 'neural-architect',
    title: 'The Neural Architect',
    icon: '🧠',
    tier: 'silver',
    description: '21-day streak',
    scienceNote: 'Rewiring neural pathways takes ~3 weeks of repetition.',
    color: 'from-slate-400 to-slate-600',
    maxProgress: 21,
  },
  {
    id: 'early-bird',
    title: 'The Early Bird',
    icon: '🌅',
    tier: 'silver',
    description: 'Check-in before 7 AM for 5 days',
    scienceNote: 'Cortisol awakening response peaks in the morning.',
    color: 'from-slate-400 to-slate-600',
    maxProgress: 5,
  },
  {
    id: 'double-down',
    title: 'The Double Down',
    icon: '📊',
    tier: 'silver',
    description: 'Complete habits 14 days in a row',
    scienceNote: 'Two weeks is the "hump" of habit formation.',
    color: 'from-slate-400 to-slate-600',
    maxProgress: 14,
  },
  {
    id: 'phoenix',
    title: 'The Phoenix',
    icon: '🔥',
    tier: 'silver',
    description: 'Miss 1 day, return the next day',
    scienceNote: 'Resilience > Perfection. Never miss twice.',
    color: 'from-slate-400 to-slate-600',
    maxProgress: 1,
  },
  {
    id: 'volume-striker',
    title: 'Volume Striker',
    icon: '📈',
    tier: 'silver',
    description: '50 total completions (all time)',
    scienceNote: 'The Law of Aggregation.',
    color: 'from-slate-400 to-slate-600',
    maxProgress: 50,
  },

  // === GOLD TIER (The Master) ===
  {
    id: 'identity-shifter',
    title: 'Identity Shifter',
    icon: '✨',
    tier: 'gold',
    description: '66-day streak',
    scienceNote: 'The average time for automaticity (UCL Study).',
    color: 'from-yellow-400 to-amber-500',
    maxProgress: 66,
  },
  {
    id: 'centurion',
    title: 'The Centurion',
    icon: '💯',
    tier: 'gold',
    description: '100 total completions',
    scienceNote: 'Triple digits. You are building a lifestyle.',
    color: 'from-yellow-400 to-amber-500',
    maxProgress: 100,
  },
  {
    id: 'monk',
    title: 'The Monk',
    icon: '🧘',
    tier: 'gold',
    description: 'Perfect month (30 days streak)',
    scienceNote: 'Discipline is freedom.',
    color: 'from-yellow-400 to-amber-500',
    maxProgress: 30,
  },
  {
    id: 'frog-eater',
    title: 'Frog Eater',
    icon: '🐸',
    tier: 'gold',
    description: 'Complete a habit before 8 AM for 21 days',
    scienceNote: 'Eat the frog (do the hardest task first).',
    color: 'from-yellow-400 to-amber-500',
    maxProgress: 21,
  },
  {
    id: 'habit-stacker',
    title: 'Habit Stacker',
    icon: '🔗',
    tier: 'gold',
    description: 'Complete 3 habits within 1 hour',
    scienceNote: 'Diderot Effect: One action triggers the next.',
    color: 'from-yellow-400 to-amber-500',
    maxProgress: 1,
  },

  // === DIAMOND TIER (The Legend) ===
  {
    id: 'solar-voyager',
    title: 'Solar Voyager',
    icon: '🌞',
    tier: 'diamond',
    description: '365-day streak',
    scienceNote: 'A full orbit around the sun. You have evolved.',
    color: 'from-cyan-400 to-blue-500',
    maxProgress: 365,
  },
  {
    id: 'grandmaster',
    title: 'Grandmaster',
    icon: '👑',
    tier: 'diamond',
    description: '1000 total completions',
    scienceNote: 'Approaching the 10,000 hour rule of mastery.',
    color: 'from-cyan-400 to-blue-500',
    maxProgress: 1000,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    icon: '⚡',
    tier: 'diamond',
    description: '100-day streak',
    scienceNote: 'You are now in the top 1% of consistency.',
    color: 'from-cyan-400 to-blue-500',
    maxProgress: 100,
  },
  {
    id: 'time-lord',
    title: 'Time Lord',
    icon: '⏰',
    tier: 'diamond',
    description: 'Complete habits at the exact same hour for 10 days',
    scienceNote: 'Temporal cues are the strongest habit triggers.',
    color: 'from-cyan-400 to-blue-500',
    maxProgress: 10,
  },
  {
    id: 'titanium-will',
    title: 'Titanium Will',
    icon: '💎',
    tier: 'diamond',
    description: 'Complete a habit on a Friday night (after 9 PM)',
    scienceNote: 'Willpower is tested most when the world relaxes.',
    color: 'from-cyan-400 to-blue-500',
    maxProgress: 1,
  },
];

// Helper: Calculate streak for a habit
const calculateStreak = (completionDates) => {
  if (!completionDates || completionDates.length === 0) return 0;
  const sortedDates = [...completionDates].sort((a, b) => new Date(b) - new Date(a));
  const today = new Date().toISOString().split('T')[0];
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

// Helper: Get count of unique days completed before a certain hour
const getEarlyMorningCompletions = (completionLogs, beforeHour = 7) => {
  if (!completionLogs || typeof completionLogs !== 'object') return 0;
  const uniqueDays = new Set();
  Object.values(completionLogs).forEach(timestamp => {
    if (!timestamp) return;
    const date = new Date(timestamp);
    const hour = date.getHours();
    if (hour < beforeHour) {
      const dateStr = date.toISOString().split('T')[0];
      uniqueDays.add(dateStr);
    }
  });
  return uniqueDays.size;
};

// Helper: Get count of unique days completed after 10 PM
const getNightOwlCompletions = (completionLogs) => {
  if (!completionLogs || typeof completionLogs !== 'object') return 0;
  const uniqueDays = new Set();
  Object.values(completionLogs).forEach(timestamp => {
    if (!timestamp) return;
    const date = new Date(timestamp);
    const hour = date.getHours();
    if (hour >= 22) { // 10 PM
      const dateStr = date.toISOString().split('T')[0];
      uniqueDays.add(dateStr);
    }
  });
  return uniqueDays.size;
};

// Helper: Get count of unique days completed in a time range
const getTimeOfDayCount = (completionLogs, startHour, endHour) => {
  if (!completionLogs || typeof completionLogs !== 'object') return 0;
  const uniqueDays = new Set();
  Object.values(completionLogs).forEach(timestamp => {
    if (!timestamp) return;
    const date = new Date(timestamp);
    const hour = date.getHours();
    if (hour >= startHour && hour < endHour) {
      const dateStr = date.toISOString().split('T')[0];
      uniqueDays.add(dateStr);
    }
  });
  return uniqueDays.size;
};

// Helper: Check consecutive days with all habits completed
const getConsecutivePerfectDays = (habits, maxDays = 30) => {
  if (!habits || habits.length === 0) return 0;
  
  const today = new Date();
  let consecutiveDays = 0;
  
  for (let i = 0; i < maxDays; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const allCompleted = habits.every(habit => 
      habit.completionDates && habit.completionDates.includes(dateStr)
    );
    
    if (allCompleted) {
      consecutiveDays++;
    } else {
      break;
    }
  }
  
  return consecutiveDays;
};

// Helper: Check Phoenix badge (missed yesterday, completed today)
const checkPhoenix = (habits) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  return habits.some(habit => {
    const completedToday = habit.completionDates && habit.completionDates.includes(today);
    const missedYesterday = !habit.completionDates || !habit.completionDates.includes(yesterdayStr);
    return completedToday && missedYesterday;
  });
};

// Helper: Check weekend warrior (completed on Sat & Sun in any week)
const checkWeekendWarrior = (habits) => {
  if (!habits || habits.length === 0) return false;
  
  // Check last 8 weeks (to cover weekends)
  const today = new Date();
  for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - (weekOffset * 7));
    const dayOfWeek = checkDate.getDay();
    
    // Find Saturday and Sunday of this week
    const saturday = new Date(checkDate);
    saturday.setDate(checkDate.getDate() - dayOfWeek + 6); // Saturday
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1); // Sunday
    
    const satStr = saturday.toISOString().split('T')[0];
    const sunStr = sunday.toISOString().split('T')[0];
    
    // Check if any habit completed both Saturday and Sunday
    const hasBoth = habits.some(habit => {
      const completedSat = habit.completionDates && habit.completionDates.includes(satStr);
      const completedSun = habit.completionDates && habit.completionDates.includes(sunStr);
      return completedSat && completedSun;
    });
    
    if (hasBoth) return true;
  }
  
  return false;
};

// Helper: Check clean slate (all habits in one day)
const checkCleanSlate = (habits) => {
  if (!habits || habits.length === 0) return false;
  const today = new Date().toISOString().split('T')[0];
  return habits.every(habit => 
    habit.completionDates && habit.completionDates.includes(today)
  );
};

// Helper: Check habit stacker (3 different habits within 1 hour)
const checkHabitStacker = (habits) => {
  if (!habits || habits.length < 3) return false;
  
  // Check last 30 days
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - dayOffset);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    // Get all completions for this day with habit IDs
    const dayCompletions = [];
    habits.forEach((habit, habitIndex) => {
      if (habit.completionLogs && habit.completionLogs[dateStr]) {
        dayCompletions.push({
          habitId: habitIndex,
          timestamp: new Date(habit.completionLogs[dateStr])
        });
      }
    });
    
    if (dayCompletions.length < 3) continue;
    
    // Sort by time
    dayCompletions.sort((a, b) => a.timestamp - b.timestamp);
    
    // Check if any 3 different habits are within 1 hour
    for (let i = 0; i <= dayCompletions.length - 3; i++) {
      const first = dayCompletions[i];
      const third = dayCompletions[i + 2];
      const diffHours = (third.timestamp - first.timestamp) / (1000 * 60 * 60);
      
      // Check if they are different habits
      const uniqueHabits = new Set([
        first.habitId,
        dayCompletions[i + 1].habitId,
        third.habitId
      ]);
      
      if (diffHours <= 1 && uniqueHabits.size === 3) {
        return true;
      }
    }
  }
  
  return false;
};

// Helper: Check time lord (same hour for 10 different days)
const checkTimeLord = (habits) => {
  if (!habits || habits.length === 0) return false;
  
  // Track which hours appear on which days
  const hourDayMap = {}; // { hour: Set of dates }
  
  // Check last 30 days
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    habits.forEach(habit => {
      if (habit.completionLogs && habit.completionLogs[dateStr]) {
        const timestamp = new Date(habit.completionLogs[dateStr]);
        const hour = timestamp.getHours();
        
        if (!hourDayMap[hour]) {
          hourDayMap[hour] = new Set();
        }
        hourDayMap[hour].add(dateStr);
      }
    });
  }
  
  // Check if any hour appears on at least 10 different days
  return Object.values(hourDayMap).some(dateSet => dateSet.size >= 10);
};

// Helper: Check titanium will (Friday night after 9 PM - any Friday)
const checkTitaniumWill = (habits) => {
  if (!habits || habits.length === 0) return false;
  
  // Check last 8 weeks (to cover Fridays)
  const today = new Date();
  for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - (weekOffset * 7));
    const dayOfWeek = checkDate.getDay();
    
    // Find Friday of this week
    const friday = new Date(checkDate);
    friday.setDate(checkDate.getDate() - dayOfWeek + 5); // Friday (5)
    
    const fridayStr = friday.toISOString().split('T')[0];
    
    // Check if any habit completed on Friday after 9 PM
    const hasFridayNight = habits.some(habit => {
      if (habit.completionLogs && habit.completionLogs[fridayStr]) {
        const timestamp = new Date(habit.completionLogs[fridayStr]);
        const hour = timestamp.getHours();
        return hour >= 21; // 9 PM
      }
      return false;
    });
    
    if (hasFridayNight) return true;
  }
  
  return false;
};

const useGamification = (habits) => {
  // Calculate badge statuses
  const badges = useMemo(() => {
    if (!habits || habits.length === 0) {
      return badgeDefinitions.map(badge => ({
        ...badge,
        isUnlocked: false,
        currentProgress: 0,
        unlockedAt: null,
      }));
    }

    // Calculate total check-ins
    const totalCheckIns = habits.reduce((sum, habit) => {
      return sum + (habit.completionDates?.length || 0);
    }, 0);

    // Find max streak across all habits
    const maxStreak = Math.max(...habits.map(habit => calculateStreak(habit.completionDates)), 0);

    // Check each badge
    const today = new Date(); // Define once for all cases
    return badgeDefinitions.map(badge => {
      let isUnlocked = false;
      let currentProgress = 0;
      let unlockedAt = null;

      switch (badge.id) {
        // BRONZE TIER
        case 'baby-step':
          isUnlocked = totalCheckIns >= 1;
          currentProgress = Math.min(totalCheckIns, badge.maxProgress);
          if (isUnlocked) {
            const allDates = habits.flatMap(h => h.completionDates || []).sort();
            if (allDates.length > 0) {
              unlockedAt = new Date(allDates[0]);
            }
          }
          break;

        case 'hat-trick':
          currentProgress = Math.min(maxStreak, badge.maxProgress);
          isUnlocked = maxStreak >= 3;
          if (isUnlocked) {
            const unlockingHabit = habits.find(h => calculateStreak(h.completionDates) >= 3);
            if (unlockingHabit && unlockingHabit.completionDates) {
              const sortedDates = [...unlockingHabit.completionDates].sort();
              const firstDate = new Date(sortedDates[0]);
              const unlockDate = new Date(firstDate);
              unlockDate.setDate(firstDate.getDate() + 2);
              unlockedAt = unlockDate;
            }
          }
          break;

        case 'weekend-warrior':
          // Count weekends where both Sat & Sun completed
          let weekendCount = 0;
          for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - (weekOffset * 7));
            const dayOfWeek = checkDate.getDay();
            
            const saturday = new Date(checkDate);
            saturday.setDate(checkDate.getDate() - dayOfWeek + 6);
            const sunday = new Date(saturday);
            sunday.setDate(saturday.getDate() + 1);
            
            const satStr = saturday.toISOString().split('T')[0];
            const sunStr = sunday.toISOString().split('T')[0];
            
            const hasBoth = habits.some(habit => {
              const completedSat = habit.completionDates && habit.completionDates.includes(satStr);
              const completedSun = habit.completionDates && habit.completionDates.includes(sunStr);
              return completedSat && completedSun;
            });
            
            if (hasBoth) weekendCount++;
          }
          currentProgress = Math.min(weekendCount, badge.maxProgress);
          isUnlocked = weekendCount >= 1;
          if (isUnlocked) {
            unlockedAt = new Date();
          }
          break;

        case 'night-owl':
          const nightOwlCount = habits.reduce((sum, habit) => {
            return sum + getNightOwlCompletions(habit.completionLogs);
          }, 0);
          isUnlocked = nightOwlCount >= 1;
          currentProgress = Math.min(nightOwlCount, badge.maxProgress);
          if (isUnlocked) {
            // Find first night completion
            const allNightDates = [];
            habits.forEach(habit => {
              if (habit.completionLogs) {
                Object.entries(habit.completionLogs).forEach(([date, timestamp]) => {
                  if (timestamp) {
                    const hour = new Date(timestamp).getHours();
                    if (hour >= 22) {
                      allNightDates.push(new Date(timestamp));
                    }
                  }
                });
              }
            });
            allNightDates.sort((a, b) => a - b);
            if (allNightDates.length > 0) {
              unlockedAt = allNightDates[0];
            }
          }
          break;

        case 'clean-slate':
          isUnlocked = checkCleanSlate(habits);
          currentProgress = isUnlocked ? 1 : 0;
          if (isUnlocked) {
            unlockedAt = new Date();
          }
          break;

        // SILVER TIER
        case 'neural-architect':
          currentProgress = Math.min(maxStreak, badge.maxProgress);
          isUnlocked = maxStreak >= 21;
          if (isUnlocked) {
            const unlockingHabit = habits.find(h => calculateStreak(h.completionDates) >= 21);
            if (unlockingHabit && unlockingHabit.completionDates) {
              const sortedDates = [...unlockingHabit.completionDates].sort();
              const firstDate = new Date(sortedDates[0]);
              const unlockDate = new Date(firstDate);
              unlockDate.setDate(firstDate.getDate() + 20);
              unlockedAt = unlockDate;
            }
          }
          break;

        case 'early-bird':
          // Count unique days (4-7 AM range)
          const earlyDays = new Set();
          habits.forEach(habit => {
            if (habit.completionLogs) {
              Object.values(habit.completionLogs).forEach(timestamp => {
                if (!timestamp) return;
                const date = new Date(timestamp);
                const hour = date.getHours();
                if (hour >= 4 && hour < 7) {
                  const dateStr = date.toISOString().split('T')[0];
                  earlyDays.add(dateStr);
                }
              });
            }
          });
          currentProgress = Math.min(earlyDays.size, badge.maxProgress);
          isUnlocked = earlyDays.size >= 5;
          if (isUnlocked) {
            const sortedDates = Array.from(earlyDays).sort();
            if (sortedDates.length >= 5) {
              unlockedAt = new Date(sortedDates[4] + 'T06:00:00');
            }
          }
          break;

        case 'double-down':
          currentProgress = Math.min(maxStreak, badge.maxProgress);
          isUnlocked = maxStreak >= 14;
          if (isUnlocked) {
            const unlockingHabit = habits.find(h => calculateStreak(h.completionDates) >= 14);
            if (unlockingHabit && unlockingHabit.completionDates) {
              const sortedDates = [...unlockingHabit.completionDates].sort();
              const firstDate = new Date(sortedDates[0]);
              const unlockDate = new Date(firstDate);
              unlockDate.setDate(firstDate.getDate() + 13);
              unlockedAt = unlockDate;
            }
          }
          break;

        case 'phoenix':
          isUnlocked = checkPhoenix(habits);
          currentProgress = isUnlocked ? 1 : 0;
          if (isUnlocked) {
            unlockedAt = new Date();
          }
          break;

        case 'volume-striker':
          currentProgress = Math.min(totalCheckIns, badge.maxProgress);
          isUnlocked = totalCheckIns >= 50;
          if (isUnlocked) {
            const allDates = habits.flatMap(h => h.completionDates || []).sort();
            if (allDates.length >= 50) {
              unlockedAt = new Date(allDates[49]);
            }
          }
          break;

        // GOLD TIER
        case 'identity-shifter':
          currentProgress = Math.min(maxStreak, badge.maxProgress);
          isUnlocked = maxStreak >= 66;
          if (isUnlocked) {
            const unlockingHabit = habits.find(h => calculateStreak(h.completionDates) >= 66);
            if (unlockingHabit && unlockingHabit.completionDates) {
              const sortedDates = [...unlockingHabit.completionDates].sort();
              const firstDate = new Date(sortedDates[0]);
              const unlockDate = new Date(firstDate);
              unlockDate.setDate(firstDate.getDate() + 65);
              unlockedAt = unlockDate;
            }
          }
          break;

        case 'centurion':
          currentProgress = Math.min(totalCheckIns, badge.maxProgress);
          isUnlocked = totalCheckIns >= 100;
          if (isUnlocked) {
            const allDates = habits.flatMap(h => h.completionDates || []).sort();
            if (allDates.length >= 100) {
              unlockedAt = new Date(allDates[99]);
            }
          }
          break;

        case 'monk':
          currentProgress = Math.min(getConsecutivePerfectDays(habits, 30), badge.maxProgress);
          isUnlocked = getConsecutivePerfectDays(habits, 30) >= 30;
          if (isUnlocked) {
            unlockedAt = new Date();
          }
          break;

        case 'frog-eater':
          // Count unique days (4-8 AM range)
          const frogDays = new Set();
          habits.forEach(habit => {
            if (habit.completionLogs) {
              Object.values(habit.completionLogs).forEach(timestamp => {
                if (!timestamp) return;
                const date = new Date(timestamp);
                const hour = date.getHours();
                if (hour >= 4 && hour < 8) {
                  const dateStr = date.toISOString().split('T')[0];
                  frogDays.add(dateStr);
                }
              });
            }
          });
          currentProgress = Math.min(frogDays.size, badge.maxProgress);
          isUnlocked = frogDays.size >= 21;
          if (isUnlocked) {
            const sortedDates = Array.from(frogDays).sort();
            if (sortedDates.length >= 21) {
              unlockedAt = new Date(sortedDates[20] + 'T07:00:00');
            }
          }
          break;

        case 'habit-stacker':
          isUnlocked = checkHabitStacker(habits);
          currentProgress = isUnlocked ? 1 : 0;
          if (isUnlocked) {
            unlockedAt = new Date();
          }
          break;

        // DIAMOND TIER
        case 'solar-voyager':
          currentProgress = Math.min(maxStreak, badge.maxProgress);
          isUnlocked = maxStreak >= 365;
          if (isUnlocked) {
            const unlockingHabit = habits.find(h => calculateStreak(h.completionDates) >= 365);
            if (unlockingHabit && unlockingHabit.completionDates) {
              const sortedDates = [...unlockingHabit.completionDates].sort();
              const firstDate = new Date(sortedDates[0]);
              const unlockDate = new Date(firstDate);
              unlockDate.setDate(firstDate.getDate() + 364);
              unlockedAt = unlockDate;
            }
          }
          break;

        case 'grandmaster':
          currentProgress = Math.min(totalCheckIns, badge.maxProgress);
          isUnlocked = totalCheckIns >= 1000;
          if (isUnlocked) {
            const allDates = habits.flatMap(h => h.completionDates || []).sort();
            if (allDates.length >= 1000) {
              unlockedAt = new Date(allDates[999]);
            }
          }
          break;

        case 'unstoppable':
          currentProgress = Math.min(maxStreak, badge.maxProgress);
          isUnlocked = maxStreak >= 100;
          if (isUnlocked) {
            const unlockingHabit = habits.find(h => calculateStreak(h.completionDates) >= 100);
            if (unlockingHabit && unlockingHabit.completionDates) {
              const sortedDates = [...unlockingHabit.completionDates].sort();
              const firstDate = new Date(sortedDates[0]);
              const unlockDate = new Date(firstDate);
              unlockDate.setDate(firstDate.getDate() + 99);
              unlockedAt = unlockDate;
            }
          }
          break;

        case 'time-lord':
          // Track which hours appear on which days
          const hourDayMap = {};
          for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            
            habits.forEach(habit => {
              if (habit.completionLogs && habit.completionLogs[dateStr]) {
                const timestamp = new Date(habit.completionLogs[dateStr]);
                const hour = timestamp.getHours();
                
                if (!hourDayMap[hour]) {
                  hourDayMap[hour] = new Set();
                }
                hourDayMap[hour].add(dateStr);
              }
            });
          }
          
          // Find the hour with most days
          let maxDays = 0;
          Object.values(hourDayMap).forEach(dateSet => {
            maxDays = Math.max(maxDays, dateSet.size);
          });
          
          currentProgress = Math.min(maxDays, badge.maxProgress);
          isUnlocked = maxDays >= 10;
          if (isUnlocked) {
            unlockedAt = new Date();
          }
          break;

        case 'titanium-will':
          // Count Fridays with night completions
          let fridayNightCount = 0;
          for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - (weekOffset * 7));
            const dayOfWeek = checkDate.getDay();
            
            const friday = new Date(checkDate);
            friday.setDate(checkDate.getDate() - dayOfWeek + 5);
            const fridayStr = friday.toISOString().split('T')[0];
            
            const hasFridayNight = habits.some(habit => {
              if (habit.completionLogs && habit.completionLogs[fridayStr]) {
                const timestamp = new Date(habit.completionLogs[fridayStr]);
                const hour = timestamp.getHours();
                return hour >= 21;
              }
              return false;
            });
            
            if (hasFridayNight) fridayNightCount++;
          }
          currentProgress = Math.min(fridayNightCount, badge.maxProgress);
          isUnlocked = fridayNightCount >= 1;
          if (isUnlocked) {
            unlockedAt = new Date();
          }
          break;

        default:
          break;
      }

      return {
        ...badge,
        isUnlocked,
        currentProgress,
        unlockedAt,
      };
    });
  }, [habits]);

  // Sort badges: Unlocked first, then by tier order
  const sortedBadges = useMemo(() => {
    const tierOrder = { bronze: 1, silver: 2, gold: 3, diamond: 4 };
    return [...badges].sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return b.isUnlocked - a.isUnlocked; // Unlocked first
      }
      return tierOrder[a.tier] - tierOrder[b.tier]; // Then by tier
    });
  }, [badges]);

  // Use the Behavioral Analysis Engine for insights
  const insights = useMemo(() => {
    return analyzeBehavior(habits);
  }, [habits]);

  return {
    badges: sortedBadges,
    insights,
  };
};

export default useGamification;
