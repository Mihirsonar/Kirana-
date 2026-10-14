import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

/**
 * Convert a base64 string to a Uint8Array for VAPID applicationServerKey
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the browser supports Push Notifications and Service Workers
 */
export function isPushNotificationSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission() {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Check if user currently has an active push subscription
 */
export async function getActiveSubscription() {
  if (!isPushNotificationSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (err) {
    console.error('Error checking active subscription:', err);
    return null;
  }
}

/**
 * Subscribe user to Push Notifications
 * @param {string} token - User's JWT token
 */
export async function subscribeUserToPush(token) {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported by this browser.');
  }

  // 1. Request Notification permission from user
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  // 2. Fetch VAPID public key from backend
  const { data: keyData } = await axios.get(`${BACKEND_URL}/api/notifications/vapid-public-key`);
  const vapidPublicKey = keyData.publicKey;

  if (!vapidPublicKey) {
    throw new Error('VAPID public key not found on server.');
  }

  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  // 3. Get SW registration and subscribe
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey,
    });
  }

  // 4. Send subscription to backend
  if (token) {
    await axios.post(
      `${BACKEND_URL}/api/notifications/subscribe`,
      { subscription },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  return subscription;
}

/**
 * Unsubscribe user from Push Notifications
 * @param {string} token - User's JWT token
 */
export async function unsubscribeUserFromPush(token) {
  if (!isPushNotificationSupported()) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();

    if (token) {
      try {
        await axios.post(
          `${BACKEND_URL}/api/notifications/unsubscribe`,
          { endpoint },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.warn('Failed to remove subscription from backend:', err);
      }
    }
  }

  return true;
}

/**
 * Trigger a test push notification from backend
 * @param {string} token - User's JWT token
 */
export async function sendTestNotification(token) {
  if (!token) throw new Error('Authentication required');
  const response = await axios.post(
    `${BACKEND_URL}/api/notifications/test`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
