// Behavioral Analysis Engine for Smart Insights

// Variety Engine: Multiple message variations for each insight type
const messageVariations = {
  'critical-threshold-21': [
    "You've hit the 21-day mark on {habit}! Psychologists say this is where it starts becoming automatic. Keep pushing!",
    "21 days strong with {habit}! Research shows habits become automatic around this point. You're almost there!",
    "Congratulations! {habit} has reached the 21-day milestone. This is when your brain starts wiring it as automatic.",
  ],
  'automation-point-66': [
    "{habit} is now officially part of your DNA (66 days). You don't even need to try anymore.",
    "Incredible! {habit} has reached 66 days. At this point, it's deeply ingrained in your neural pathways.",
    "66 days of {habit}? That's not just a habit anymore—it's who you are. Well done!",
  ],
  'fragile-start': [
    "The first 3 days are the hardest. Great job starting {habit}.",
    "Starting is the hardest part. You've made it past day 1 with {habit}—keep going!",
    "Day 1-3 are where most people quit. You didn't. {habit} is off to a strong start!",
  ],
  'golden-hour': [
    "You are most productive around {hour}. Try to schedule your hardest task ({hardestHabit}) then.",
    "Your peak performance hour is {hour}. That's when you should tackle {hardestHabit}.",
    "Data shows you're most active at {hour}. Use this 'golden hour' for {hardestHabit}.",
  ],
  'monday-blues': [
    "Mondays seem tough for you ({mondayRate}% vs {avgRate}% average). Try setting a 'Minimum Viable Goal' next Monday just to show up.",
    "Your Monday completion rate is {mondayRate}%, which is {diff}% lower than your average. Can you make Monday your comeback day?",
    "Mondays are your challenge day. Let's flip the script: make next Monday your strongest day!",
  ],
  'weekend-warrior': [
    "You crush it on weekends! ({weekendRate}% vs {weekdayRate}% weekdays). Can you bring a bit of that Saturday energy to your Tuesday?",
    "Weekends are your superpower ({weekendRate}% completion). What if you applied that same energy to weekdays?",
    "Your weekend performance ({weekendRate}%) is impressive! Try channeling that momentum into weekdays.",
  ],
  'domino-effect': [
    "Nice stack! You've linked {habitA} with {habitB}. This is a powerful 'Habit Stacking' technique.",
    "Smart move! You always do {habitB} right after {habitA}. This habit chain is working perfectly.",
    "I noticed you stack {habitA} → {habitB}. This 'domino effect' makes both habits easier to maintain.",
  ],
  'lonely-habit': [
    "{habit} is feeling lonely (only {rate}% done this month). What's the smallest step you can take today?",
    "{habit} needs attention—only {rate}% completion this month. Can you give it 5 minutes today?",
    "Let's revive {habit}! It's at {rate}% this month. What's one tiny action you can do right now?",
  ],
  'streak-protection': [
    "You are on fire with {habit}! 🔥 The hardest part is over. Protect this {streak}-day streak at all costs today.",
    "{streak} days strong! Don't break the chain with {habit}. You've come too far to stop now.",
    "Incredible {streak}-day streak with {habit}! One more day and you'll hit a new milestone.",
  ],
  'morning-struggle': [
    "You seem to struggle with consistency. Try doing just ONE habit ({habit}) immediately after waking up to build momentum.",
    "Most of your completions happen after 10 AM. Try starting {habit} right when you wake up—it changes everything.",
    "Early morning momentum is powerful. Can you do {habit} before 9 AM tomorrow?",
  ],
  'weekend-slump': [
    "Your weekends are tricky for '{habit}'. Try reducing your target on Saturdays to just 5 minutes to keep the streak alive.",
    "Weekend completion for {habit} is lower. Make it easier on weekends—just show up for 5 minutes.",
    "Saturdays and Sundays are your challenge with {habit}. Set a micro-goal: just 5 minutes.",
  ],
  'afternoon-energy': [
    "You are an afternoon warrior! Schedule your hardest habit '{habit}' for 3 PM when your energy peaks.",
    "Your peak energy hits around 3 PM. That's the perfect time for {habit}.",
    "Afternoon is when you shine. Use 3 PM for {habit}—you'll crush it!",
  ],
  'perfect-day': [
    "Amazing! You've completed all {count} habits today! This is what consistency looks like.",
    "Perfect day! All {count} habits checked. You're unstoppable! ✨",
    "100% completion today with all {count} habits! This is the blueprint for success.",
  ],
  'neglect-alert': [
    "Missed '{habit}' for 3 days? Don't quit. Just do a 'micro-version' of it today to reset.",
    "{habit} hasn't been done in 3 days. Don't let perfectionism stop you—just do the smallest version today.",
    "3 days without {habit}? No worries. Do just 2 minutes today to get back on track.",
  ],
};

// Helper: Get random message variation
const getRandomMessage = (type, context = {}) => {
  const variations = messageVariations[type] || [];
  if (variations.length === 0) return '';
  
  const message = variations[Math.floor(Math.random() * variations.length)];
  
  // Replace placeholders with context values
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return context[key] || match;
  });
};

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

// Helper: Get day of week name
const getDayName = (dateStr) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateStr).getDay()];
};

// Helper: Calculate completion rate for a date range
const getCompletionRate = (completionDates, startDate, endDate) => {
  if (!completionDates || completionDates.length === 0) return 0;
  const filtered = completionDates.filter(dateStr => {
    const date = new Date(dateStr);
    return date >= startDate && date <= endDate;
  });
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  return totalDays > 0 ? (filtered.length / totalDays) * 100 : 0;
};

// Main Analysis Engine
export const analyzeBehavior = (habits) => {
  if (!habits || habits.length === 0) return [];

  const insights = [];

  habits.forEach(habit => {
    if (!habit.completionDates || habit.completionDates.length === 0) return;

    const streak = calculateStreak(habit.completionDates);
    const today = new Date();
    const habitCreatedAt = habit.createdAt ? new Date(habit.createdAt) : null;
    const daysSinceCreation = habitCreatedAt 
      ? Math.floor((today - habitCreatedAt) / (1000 * 60 * 60 * 24))
      : null;

    // Category A: Momentum & Streaks
    if (streak === 21) {
      insights.push({
        id: `critical-threshold-21-${habit.id}`,
        type: 'celebration',
        category: 'momentum',
        icon: '🎯',
        title: '21-Day Milestone',
        text: getRandomMessage('critical-threshold-21', { habit: habit.name }),
        habitName: habit.name,
        priority: 1,
      });
    }

    if (streak === 66) {
      insights.push({
        id: `automation-point-66-${habit.id}`,
        type: 'celebration',
        category: 'momentum',
        icon: '🧬',
        title: 'Automation Achieved',
        text: getRandomMessage('automation-point-66', { habit: habit.name }),
        habitName: habit.name,
        priority: 1,
      });
    }

    if (daysSinceCreation !== null && daysSinceCreation >= 0 && daysSinceCreation < 3) {
      insights.push({
        id: `fragile-start-${habit.id}`,
        type: 'motivation',
        category: 'momentum',
        icon: '🌱',
        title: 'Starting Strong',
        text: getRandomMessage('fragile-start', { habit: habit.name }),
        habitName: habit.name,
        priority: 2,
      });
    }

    if (streak >= 5 && streak < 21) {
      insights.push({
        id: `streak-protection-${habit.id}`,
        type: 'motivation',
        category: 'momentum',
        icon: '🔥',
        title: 'On Fire!',
        text: getRandomMessage('streak-protection', { habit: habit.name, streak }),
        habitName: habit.name,
        streak,
        priority: 2,
      });
    }

    // Category B: Micro-Patterns (Time & Day)
    if (habit.completionLogs && typeof habit.completionLogs === 'object') {
      const timestamps = Object.values(habit.completionLogs).filter(Boolean);
      
      if (timestamps.length >= 5) {
        // Golden Hour Detection
        const hourCounts = {};
        timestamps.forEach(ts => {
          const hour = new Date(ts).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const mostActiveHour = Object.keys(hourCounts).reduce((a, b) => 
          hourCounts[a] > hourCounts[b] ? a : b
        );

        if (hourCounts[mostActiveHour] > timestamps.length * 0.3) {
          const hour12 = parseInt(mostActiveHour) % 12 || 12;
          const period = parseInt(mostActiveHour) >= 12 ? 'PM' : 'AM';
          
          // Find hardest habit (lowest completion rate) - only if we have multiple habits
          let hardestHabitName = habit.name;
          if (habits.length > 1) {
            const hardestHabit = habits.reduce((lowest, h) => {
              if (!h.completionDates || h.completionDates.length === 0) return lowest;
              const lowestRate = lowest.completionDates?.length || 0;
              const currentRate = h.completionDates?.length || 0;
              return currentRate < lowestRate ? h : lowest;
            }, habits.find(h => h.completionDates && h.completionDates.length > 0) || habits[0]);
            
            if (hardestHabit && hardestHabit.id !== habit.id) {
              hardestHabitName = hardestHabit.name;
            }
          }

          // Only add if we haven't already added a golden hour insight for this hour
          const existingGoldenHour = insights.find(insight => 
            insight.id?.startsWith('golden-hour') && insight.text.includes(`${hour12} ${period}`)
          );

          if (!existingGoldenHour) {
            insights.push({
              id: `golden-hour-${habit.id}-${mostActiveHour}`,
              type: 'advisory',
              category: 'energy',
              icon: '⚡',
              title: 'Golden Hour',
              text: getRandomMessage('golden-hour', { 
                hour: `${hour12} ${period}`, 
                hardestHabit: hardestHabitName 
              }),
              habitName: habit.name,
              priority: 2,
            });
          }
        }

        // Afternoon Energy
        const afternoon = timestamps.filter(ts => {
          const hour = new Date(ts).getHours();
          return hour >= 14 && hour < 17;
        }).length;

        if (afternoon > timestamps.length * 0.4) {
          insights.push({
            id: `afternoon-energy-${habit.id}`,
            type: 'advisory',
            category: 'energy',
            icon: '⚡',
            title: 'Energy Peak',
            text: getRandomMessage('afternoon-energy', { habit: habit.name }),
            habitName: habit.name,
            priority: 3,
          });
        }

        // Morning Struggle
        const lateMorning = timestamps.filter(ts => {
          const hour = new Date(ts).getHours();
          return hour >= 10;
        }).length;

        const totalCompletions = habit.completionDates?.length || 0;
        const completionRate = totalCompletions > 0 ? (totalCompletions / 30) * 100 : 0;

        if (lateMorning > timestamps.length * 0.7 && completionRate < 50) {
          insights.push({
            id: `morning-struggle-${habit.id}`,
            type: 'advisory',
            category: 'energy',
            icon: '🌅',
            title: 'Morning Momentum',
            text: getRandomMessage('morning-struggle', { habit: habit.name }),
            habitName: habit.name,
            priority: 2,
          });
        }
      }
    }

    // Day-of-week analysis
    if (habit.completionDates.length >= 10) {
      const mondayDates = habit.completionDates.filter(dateStr => {
        return new Date(dateStr).getDay() === 1;
      });

      const weekdayDates = habit.completionDates.filter(dateStr => {
        const day = new Date(dateStr).getDay();
        return day !== 0 && day !== 6;
      });

      const weekendDates = habit.completionDates.filter(dateStr => {
        const day = new Date(dateStr).getDay();
        return day === 0 || day === 6;
      });

      const totalCompletions = habit.completionDates.length;
      const mondayRate = mondayDates.length > 0 
        ? (mondayDates.length / (totalCompletions / 7)) * 100 
        : 0;
      const weekdayRate = weekdayDates.length > 0
        ? (weekdayDates.length / (totalCompletions / 7 * 5)) * 100
        : 0;
      const weekendRate = weekendDates.length > 0
        ? (weekendDates.length / (totalCompletions / 7 * 2)) * 100
        : 0;

      // Monday Blues
      if (mondayRate < weekdayRate * 0.8 && weekdayRate > 0) {
        const diff = Math.round(weekdayRate - mondayRate);
        insights.push({
          id: `monday-blues-${habit.id}`,
          type: 'advisory',
          category: 'consistency',
          icon: '📅',
          title: 'Monday Challenge',
          text: getRandomMessage('monday-blues', { 
            habit: habit.name,
            mondayRate: Math.round(mondayRate),
            avgRate: Math.round(weekdayRate),
            diff 
          }),
          habitName: habit.name,
          priority: 2,
        });
      }

      // Weekend Warrior
      if (weekendRate > weekdayRate * 1.2 && weekdayRate > 0) {
        insights.push({
          id: `weekend-warrior-${habit.id}`,
          type: 'advisory',
          category: 'consistency',
          icon: '⚔️',
          title: 'Weekend Strategy',
          text: getRandomMessage('weekend-warrior', { 
            habit: habit.name,
            weekendRate: Math.round(weekendRate),
            weekdayRate: Math.round(weekdayRate)
          }),
          habitName: habit.name,
          priority: 3,
        });
      }

      // Weekend Slump
      if (weekendRate < weekdayRate * 0.7 && weekdayRate > 0) {
        insights.push({
          id: `weekend-slump-${habit.id}`,
          type: 'advisory',
          category: 'consistency',
          icon: '⚔️',
          title: 'Weekend Strategy',
          text: getRandomMessage('weekend-slump', { habit: habit.name }),
          habitName: habit.name,
          priority: 2,
        });
      }
    }

    // Neglect Alert
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    threeDaysAgo.setHours(0, 0, 0, 0);

    const recentCompletions = habit.completionDates.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= threeDaysAgo;
    });

    if (recentCompletions.length === 0 && habit.completionDates.length > 0) {
      insights.push({
        id: `neglect-${habit.id}`,
        type: 'advisory',
        category: 'recovery',
        icon: '💪',
        title: 'Comeback Time',
        text: getRandomMessage('neglect-alert', { habit: habit.name }),
        habitName: habit.name,
        priority: 1,
      });
    }
  });

  // Category C: Habit Interactions
  // Domino Effect: Check if habits are often completed together
  for (let i = 0; i < habits.length; i++) {
    for (let j = i + 1; j < habits.length; j++) {
      const habitA = habits[i];
      const habitB = habits[j];

      if (!habitA.completionLogs || !habitB.completionLogs) continue;

      const habitADates = Object.keys(habitA.completionLogs).filter(Boolean);
      const habitBDates = Object.keys(habitB.completionLogs).filter(Boolean);

      let linkedCount = 0;
      habitADates.forEach(dateStr => {
        if (habitBDates.includes(dateStr)) {
          const timeA = new Date(habitA.completionLogs[dateStr]);
          const timeB = new Date(habitB.completionLogs[dateStr]);
          const diffMinutes = Math.abs(timeA - timeB) / (1000 * 60);
          
          // Check if completed within 10 minutes
          if (diffMinutes <= 10 && timeA < timeB) {
            linkedCount++;
          }
        }
      });

      if (linkedCount >= 3 && habitADates.length >= 5) {
        insights.push({
          id: `domino-effect-${habitA.id}-${habitB.id}`,
          type: 'celebration',
          category: 'interaction',
          icon: '🔗',
          title: 'Habit Stacking',
          text: getRandomMessage('domino-effect', { 
            habitA: habitA.name, 
            habitB: habitB.name 
          }),
          habitName: `${habitA.name} + ${habitB.name}`,
          priority: 2,
        });
        break; // Only show one domino effect per habit
      }
    }
  }

  // Lonely Habit: Find habit with lowest completion rate this month
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const habitRates = habits.map(habit => {
    if (!habit.completionDates || habit.completionDates.length === 0) return null;
    
    const recentCompletions = habit.completionDates.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= thirtyDaysAgo;
    });

    const rate = (recentCompletions.length / 30) * 100;
    return { habit, rate };
  }).filter(Boolean);

  if (habitRates.length > 0) {
    const lonelyHabit = habitRates.reduce((lowest, current) => 
      current.rate < lowest.rate ? current : lowest
    );

    if (lonelyHabit.rate < 30 && habitRates.length > 1) {
      insights.push({
        id: `lonely-habit-${lonelyHabit.habit.id}`,
        type: 'advisory',
        category: 'recovery',
        icon: '💔',
        title: 'Needs Attention',
        text: getRandomMessage('lonely-habit', { 
          habit: lonelyHabit.habit.name, 
          rate: Math.round(lonelyHabit.rate) 
        }),
        habitName: lonelyHabit.habit.name,
        priority: 1,
      });
    }
  }

  // Perfect Day
  const today = new Date().toISOString().split('T')[0];
  const todayCompleted = habits.filter(habit => 
    habit.completionDates && habit.completionDates.includes(today)
  ).length;

  if (todayCompleted === habits.length && habits.length > 0) {
    insights.push({
      id: 'perfect-day',
      type: 'celebration',
      category: 'achievement',
      icon: '✨',
      title: 'Perfect Day!',
      text: getRandomMessage('perfect-day', { count: habits.length }),
      priority: 1,
    });
  }

  // Sort by priority (lower number = higher priority)
  return insights.sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

