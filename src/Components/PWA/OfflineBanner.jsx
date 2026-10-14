import React from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, justReconnected } = useOnlineStatus();

  if (isOnline && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm font-medium text-center transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
        !isOnline
          ? 'bg-amber-600 text-white'
          : 'bg-emerald-600 text-white'
      }`}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          <span>
            <strong>You're Offline.</strong> You can browse previously loaded items. Checkout and live transactions are disabled.
          </span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 shrink-0" />
          <span>
            <strong>Back Online!</strong> Your connection has been restored.
          </span>
        </>
      )}
    </div>
  );
}
