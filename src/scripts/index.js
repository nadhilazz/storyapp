//font awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

//maps
import 'leaflet/dist/leaflet.css';

// CSS imports
import '../styles/styles.css';
import '../styles/about.css';
import '../styles/home.css';
import '../styles/login.css';
import '../styles/register.css';
import '../styles/story-item.css';
import '../styles/detail.css';
import '../styles/mopTransisi.css';
import '../styles/maps.css';

import App from './pages/app';
import { registerServiceWorker } from './utils';
import { subscribe, getPushSubscription} from './utils/notification-helper';
import { unsubscribe, unsubscribePushNotification } from './utils/notification-helper';
import StoryAPI from './data/api';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  await registerServiceWorker();

  // Add to Homescreen prompt handling
  let deferredPrompt;
  const addToHomeScreenBtn = document.getElementById('btnAddToHomeScreen');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    if (addToHomeScreenBtn) {
      addToHomeScreenBtn.style.display = 'block';
    }
  });

  if (addToHomeScreenBtn) {
    addToHomeScreenBtn.addEventListener('click', async () => {
      // Hide the app provided install promotion
      addToHomeScreenBtn.style.display = 'none';
      // Show the install prompt
      if (deferredPrompt) {
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // Clear the deferredPrompt so it can only be used once.
        deferredPrompt = null;
      }
    });
  }

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  const subscribeButton = document.querySelector('a[href="#/subscribe"]');
  if (subscribeButton) {
    async function updateButtonLabel() {
      const subscription = await getPushSubscription();
      if (subscription) {
        subscribeButton.textContent = 'Unsubscribe';
      } else {
        subscribeButton.textContent = 'Subscribe';
      }
    }

    await updateButtonLabel();

    subscribeButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const subscription = await getPushSubscription();
      if (subscription) {
        // Unsubscribe
        try {
          await unsubscribe();
          subscribeButton.textContent = 'Subscribe';
          console.log('Unsubscribed from push notifications.');
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      } else {
        // Subscribe
        try {
          await subscribe();
          subscribeButton.textContent = 'Unsubscribe';
          console.log('Subscribed to push notifications.');
        } catch (error) {
          console.error('Error subscribing:', error);
        }
      }
    });
  }
});


document.addEventListener('click', (event) => {
  if (event.target.classList.contains('view-more-btn')) {
    const storyId = event.target.getAttribute('id');

    document.body.classList.add('fade-out');

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.hash = `/story/${storyId}`;
      });
    } else {
      window.location.hash = `/story/${storyId}`;
    }

    setTimeout(() => {
      document.body.classList.remove('fade-out');
      document.body.classList.add('fade-in');
    }, 500);
  }
});

document.body.addEventListener('click', (event) => {
  if (event.target && event.target.id === 'back-home-btn') {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.hash = '/';
      });
    } else {
      window.location.hash = '/';
    }
  }
});


