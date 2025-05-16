import StoryAPI from '../data/api';
import CONFIG from '../data/config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isNotificationAvailable() {
  return 'Notification' in window;
}
 
export function isNotificationGranted() {
  return Notification.permission === 'granted';
}
 
export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }
 
  if (isNotificationGranted()) {
    return true;
  }
 
  const status = await Notification.requestPermission();
 
  if (status === 'denied') {
    return false;
  }
 
  if (status === 'default') {
    return false;
  }
 
  return true;
}
 
export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}
 
export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    return;
  }

  console.log('Mulai berlangganan push notification...');

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const failureSubscribeMessage = 'Langganan push notification gagal.';
    const successSubscribeMessage = 'Langganan push notification berhasil.';
    if (!registration) {
      console.error('Service worker registration not found.');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });

    await StoryAPI.subscribePushNotification(subscription.toJSON());
    console.log('Push notification subscription successful.');
    alert(successSubscribeMessage);
  } catch (error) {
    alert(failureSubscribeMessage);
    console.error('Failed to subscribe to push notifications:', error);
  }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
      return;
    }
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await StoryAPI.unsubscribePushNotification({ endpoint });
    if (response.error || response.status === 'fail') {
      alert(failureUnsubscribeMessage);
      console.error('unsubscribe: response:', response);
      return;
    }
    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      alert(failureUnsubscribeMessage);
      await StoryAPI.subscribePushNotification({ endpoint, keys });
      return;
    }
  } catch (error) {
    alert(failureUnsubscribeMessage);
    console.error('unsubscribe: error:', error);
  }
}
