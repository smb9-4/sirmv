import { apiRequest } from './api.js';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushNotificationService = {
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[WebPush] Service Worker is not supported in this browser.');
      return null;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('[WebPush] Service Worker registered with scope:', reg.scope);
      return reg;
    } catch (err) {
      console.warn('[WebPush] Service Worker registration failed:', err);
      return null;
    }
  },

  async requestPermissionAndSubscribe(): Promise<boolean> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('[WebPush] Push Notifications not supported in this browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[WebPush] Notification permission not granted:', permission);
        return false;
      }

      // Fetch VAPID public key from backend
      const { publicKey } = await apiRequest<{ publicKey: string }>('/calls/vapid-public-key');
      if (!publicKey) {
        console.warn('[WebPush] No VAPID public key available.');
        return false;
      }

      const reg = await navigator.serviceWorker.ready;
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      }

      // Send subscription to backend
      await apiRequest('/calls/push-subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription })
      });

      console.log('[WebPush] Push subscription synced successfully with server.');
      return true;
    } catch (err) {
      console.warn('[WebPush] Error setting up push notifications:', err);
      return false;
    }
  }
};

