import { useState, useEffect, useCallback } from 'react';

const useSoundEffects = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEffectsEnabled');
    return saved !== null ? saved === 'true' : true; // Default: enabled
  });

  useEffect(() => {
    localStorage.setItem('soundEffectsEnabled', isSoundEnabled.toString());
  }, [isSoundEnabled]);

  // Helper function to resolve sound path
  const getSoundPath = useCallback((soundName) => {
    // In Capacitor Android, assets are served from root
    // Try multiple paths for compatibility
    if (import.meta.env.PROD) {
      // Production: try absolute path first (Capacitor serves from root)
      return `/sounds/${soundName}.mp3`;
    }
    // Development: try relative path first
    return `sounds/${soundName}.mp3`;
  }, []);

  const playSound = useCallback((soundName) => {
    if (!isSoundEnabled) return;

    const tryPlaySound = (pathToTry) => {
      return new Promise((resolve, reject) => {
        try {
          const audio = new Audio(pathToTry);
          audio.volume = 0.5; // Set volume to 50%
          
          // Handle play promise
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
    };

    // Try multiple paths for compatibility across platforms
    const paths = [
      getSoundPath(soundName),
      `/sounds/${soundName}.mp3`,
      `sounds/${soundName}.mp3`,
      `./sounds/${soundName}.mp3`,
      // Android Capacitor path (assets are copied to public folder)
      `/public/sounds/${soundName}.mp3`,
    ];

    // Try each path sequentially
    let currentPathIndex = 0;
    const tryNextPath = () => {
      if (currentPathIndex >= paths.length) {
        console.debug('All sound paths failed for:', soundName);
        return;
      }

      const pathToTry = paths[currentPathIndex];
      console.log('Trying sound path:', pathToTry);
      
      tryPlaySound(pathToTry)
        .then(() => {
          // Success!
        })
        .catch(() => {
          // Try next path
          currentPathIndex++;
          tryNextPath();
        });
    };

    tryNextPath();
  }, [isSoundEnabled, getSoundPath]);

  const playPop = useCallback(() => {
    playSound('pop');
  }, [playSound]);

  const playClick = useCallback(() => {
    playSound('arrow'); // Using 'arrow' as click sound (as per download-sounds.js)
  }, [playSound]);

  const playSuccess = useCallback(() => {
    // Use 'pop' as success sound since 'bonus' download failed
    // You can replace with 'bonus' once the file is available
    playSound('pop');
  }, [playSound]);

  return {
    isSoundEnabled,
    setIsSoundEnabled,
    playPop,
    playClick,
    playSuccess,
  };
};

export default useSoundEffects;
