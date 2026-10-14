import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const location = useLocation();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates periodically (every 1 hour)
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('PWA Service Worker registration error:', error);
    },
  });

  // Avoid forced reloads or update interruptions during checkout, payment processing, or address selection
  const sensitivePaths = ['/payment', '/address', '/order-success'];
  const isSensitiveRoute = sensitivePaths.some((path) =>
    location.pathname.toLowerCase().startsWith(path)
  );

  if (!needRefresh || isSensitiveRoute) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-50 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700/80">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                Update Available
              </h4>
              <button
                onClick={() => setNeedRefresh(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              A new version of Kirana+ is available.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => updateServiceWorker(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
              >
                Update Now
              </button>
              <button
                onClick={() => setNeedRefresh(false)}
                className="text-xs font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
