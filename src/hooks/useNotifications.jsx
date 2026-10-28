import { useEffect, useRef } from 'react';

const useNotifications = (habits) => {
  const notificationSentRef = useRef({}); // Track sent notifications to prevent spam
  const intervalRef = useRef(null);

  // Request notification permission
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  };

  // Check if notification should be sent
  const shouldSendNotification = (habit) => {
    const settings = habit.notificationSettings || habit.notification_settings;
    if (!settings || !settings.enabled) {
      return false;
    }

    const { days, times } = settings;
    if (!days || !times || days.length === 0 || times.length === 0) {
      return false;
    }

    // Get current day (0 = Sunday, 6 = Saturday)
    const currentDay = new Date().getDay();
    if (!days.includes(currentDay)) {
      return false;
    }

    // Get current time in HH:MM format
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Check if current time matches any scheduled time
    return times.includes(currentTime);
  };

  // Send notification
  const sendNotification = (habit) => {
    const notificationKey = `${habit.id}-${new Date().toISOString().split('T')[0]}-${new Date().getHours()}:${new Date().getMinutes()}`;

    // Anti-spam: Don't send the same notification twice in the same minute
    if (notificationSentRef.current[notificationKey]) {
      return;
    }

    try {
      const notification = new Notification(habit.name, {
        body: `It's time to ${habit.name}! ${habit.emoji}`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: `habit-${habit.id}`, // Group notifications by habit
        requireInteraction: false,
      });

      // Mark as sent
      notificationSentRef.current[notificationKey] = true;

      // Clean up old entries (keep only last 100)
      const keys = Object.keys(notificationSentRef.current);
      if (keys.length > 100) {
        const oldestKeys = keys.slice(0, keys.length - 100);
        oldestKeys.forEach(key => delete notificationSentRef.current[key]);
      }

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Main check function
  const checkAndSendNotifications = async () => {
    // Check permission first
    const permission = await requestPermission();
    if (permission !== 'granted') {
      return;
    }

    // Check each habit
    habits.forEach(habit => {
      if (shouldSendNotification(habit)) {
        sendNotification(habit);
      }
    });
  };

  // Set up interval to check every minute
  useEffect(() => {
    // Initial check
    checkAndSendNotifications();

    // Set up interval (check every 60 seconds)
    intervalRef.current = setInterval(() => {
      checkAndSendNotifications();
    }, 60000); // 60 seconds

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [habits]);

  // Clean up notification tracking at midnight
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    const timeoutId = setTimeout(() => {
      notificationSentRef.current = {};
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  return {
    requestPermission,
  };
};

export default useNotifications;

