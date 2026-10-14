import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  getActiveSubscription,
  subscribeUserToPush,
  unsubscribeUserFromPush,
  sendTestNotification,
} from '../../Utils/pushNotifications';

export default function PushNotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const isSupp = isPushNotificationSupported();
    setSupported(isSupp);

    if (isSupp) {
      setPermission(getNotificationPermission());
      getActiveSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    }
  }, []);

  const handleToggle = async () => {
    const token = localStorage.getItem('Token');
    setLoading(true);
    setStatusMessage(null);

    try {
      if (isSubscribed) {
        await unsubscribeUserFromPush(token);
        setIsSubscribed(false);
        setStatusMessage({ type: 'success', text: 'Push notifications disabled.' });
      } else {
        await subscribeUserToPush(token);
        setIsSubscribed(true);
        setPermission('granted');
        setStatusMessage({
          type: 'success',
          text: 'Push notifications enabled for order updates!',
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update notification settings.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    const token = localStorage.getItem('Token');
    if (!token) return;
    setLoading(true);
    setStatusMessage(null);

    try {
      await sendTestNotification(token);
      setStatusMessage({
        type: 'success',
        text: 'Test notification sent! Check your notification panel.',
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send test notification.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!supported) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-5">
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <BellOff size={18} />
          <span>Push notifications are not supported on this browser or platform.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isSubscribed ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
            <Bell size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              Push Notifications
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Receive updates when your order is placed, dispatched, or delivered
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading || permission === 'denied'}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
            isSubscribed
              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Processing...' : isSubscribed ? 'Disable' : 'Enable'}
        </button>
      </div>

      {permission === 'denied' && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
          <AlertCircle size={16} className="shrink-0" />
          <span>Notifications are blocked in your browser settings. Please allow notifications for this site to receive order alerts.</span>
        </div>
      )}

      {statusMessage && (
        <div
          className={`mt-3 p-3 rounded-xl flex items-center gap-2 text-xs ${
            statusMessage.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <AlertCircle size={16} className="shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {isSubscribed && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-500">Test your push subscription:</span>
          <button
            onClick={handleTest}
            disabled={loading}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
          >
            <Send size={13} />
            Send Test Alert
          </button>
        </div>
      )}
    </div>
  );
}
