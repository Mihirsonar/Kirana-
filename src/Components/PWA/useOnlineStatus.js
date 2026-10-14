import { useState, useEffect } from 'react';

/**
 * Custom hook to detect network online/offline status with reconnection notifications
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    let timer;

    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setJustReconnected(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return { isOnline, justReconnected };
}
