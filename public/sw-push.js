/**
 * Kirana+ Push Notification Handler
 * Imported into the Workbox Service Worker via importScripts
 */

self.addEventListener('push', (event) => {
  let data = {
    title: 'Kirana+ Notification',
    body: 'You have a new update on Kirana+.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/favicon-32x32.png',
    data: { url: '/myorders' },
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/myorders' },
    actions: [
      {
        action: 'open',
        title: 'View Details',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open at the destination, focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if ('focus' in client) {
          if (client.url.includes(urlToOpen)) {
            return client.focus();
          }
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
