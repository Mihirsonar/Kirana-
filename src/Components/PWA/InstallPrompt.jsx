import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

const DISMISS_KEY = 'kirana_pwa_install_dismissed';
const DISMISS_COOLDOWN_DAYS = 7;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      return; // Already installed, do not show prompt
    }

    // 2. Check if user dismissed recently
    const dismissedTime = localStorage.getItem(DISMISS_KEY);
    if (dismissedTime) {
      const daysSinceDismiss =
        (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < DISMISS_COOLDOWN_DAYS) {
        return; // In cooldown period
      }
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      isIosDevice &&
      /safari/.test(userAgent) &&
      !/crios|fxios|opios/.test(userAgent);

    if (isIosDevice && isSafari) {
      setIsIOS(true);
      // Give the user a moment to browse before showing the unobtrusive hint
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // 4. Standard beforeinstallprompt listener for Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a short delay so it doesn't immediately intrude
      setTimeout(() => setShowPrompt(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If app gets installed, hide immediately
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            <img
              src="/icons/icon-192x192.png"
              alt="Kirana+ Icon"
              className="w-12 h-12 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                Install Kirana+
              </h4>
              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Install our app for fast, reliable grocery shopping and offline browsing.
            </p>

            {showIOSInstructions ? (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-200 border border-blue-100 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-blue-700 dark:text-blue-400">
                  <Share className="w-3.5 h-3.5" />
                  <span>To install on iOS:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Tap the Share icon in Safari’s toolbar.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top right.</li>
                </ol>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-semibold underline"
                >
                  Got it
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isIOS ? 'How to Install' : 'Install App'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Later
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
