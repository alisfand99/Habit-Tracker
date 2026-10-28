import { useState, useEffect, useCallback } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const useHaptics = () => {
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(() => {
    const saved = localStorage.getItem('hapticsEnabled');
    return saved !== null ? saved === 'true' : true; // Default: enabled
  });

  const [isSupported, setIsSupported] = useState(true); // Capacitor Haptics is supported on mobile

  useEffect(() => {
    localStorage.setItem('hapticsEnabled', isHapticsEnabled.toString());
  }, [isHapticsEnabled]);

  const vibrateLight = useCallback(async () => {
    if (!isHapticsEnabled || !isSupported) return;

    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Silently fail if haptics is not available
      console.debug('Haptics light vibration failed:', error);
    }
  }, [isHapticsEnabled, isSupported]);

  const vibrateMedium = useCallback(async () => {
    if (!isHapticsEnabled || !isSupported) return;

    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.debug('Haptics medium vibration failed:', error);
    }
  }, [isHapticsEnabled, isSupported]);

  const vibrateSuccess = useCallback(async () => {
    if (!isHapticsEnabled || !isSupported) return;

    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.debug('Haptics success vibration failed:', error);
    }
  }, [isHapticsEnabled, isSupported]);

  const vibrateError = useCallback(async () => {
    if (!isHapticsEnabled || !isSupported) return;

    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.debug('Haptics error vibration failed:', error);
    }
  }, [isHapticsEnabled, isSupported]);

  // Legacy methods for backward compatibility
  const lightVibrate = vibrateLight;
  const successVibrate = vibrateSuccess;

  return {
    isHapticsEnabled,
    setIsHapticsEnabled,
    isSupported,
    lightVibrate,
    successVibrate,
    vibrateLight,
    vibrateMedium,
    vibrateSuccess,
    vibrateError,
  };
};

export default useHaptics;
