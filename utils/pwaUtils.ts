// PWA Utility Functions for Background Call Support

export interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Check if PWA is installed
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Check if running on mobile
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if service worker is supported
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

// Check if background sync is supported
export const isBackgroundSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
};

// Check if push notifications are supported
export const isPushNotificationSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Check if audio session API is supported
export const isAudioSessionSupported = (): boolean => {
  return 'mediaSession' in navigator || 'setAudioSession' in navigator;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported');
  }

  const permission = await Notification.requestPermission();
  return permission;
};

// Check notification permission
export const getNotificationPermission = (): NotificationPermission => {
  if (!isPushNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
};

// Register service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker is not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Get PWA install prompt
export const getPWAInstallPrompt = (): PWAInstallPrompt | null => {
  let deferredPrompt: PWAInstallPrompt | null = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as PWAInstallPrompt;
  });

  return deferredPrompt;
};

// Show PWA install prompt
export const showPWAInstallPrompt = async (): Promise<boolean> => {
  const prompt = getPWAInstallPrompt();
  
  if (!prompt) {
    console.warn('PWA install prompt not available');
    return false;
  }

  try {
    await prompt.prompt();
    const choiceResult = await prompt.userChoice;
    return choiceResult.outcome === 'accepted';
  } catch (error) {
    console.error('Failed to show PWA install prompt:', error);
    return false;
  }
};

// Check if app can run in background
export const canRunInBackground = (): boolean => {
  return isPWAInstalled() && isServiceWorkerSupported();
};

// Get PWA capabilities
export const getPWACapabilities = () => {
  return {
    isInstalled: isPWAInstalled(),
    isMobile: isMobile(),
    serviceWorkerSupported: isServiceWorkerSupported(),
    backgroundSyncSupported: isBackgroundSyncSupported(),
    pushNotificationSupported: isPushNotificationSupported(),
    audioSessionSupported: isAudioSessionSupported(),
    canRunInBackground: canRunInBackground(),
    notificationPermission: getNotificationPermission(),
  };
};

// Initialize PWA features
export const initializePWA = async () => {
  const capabilities = getPWACapabilities();
  
  console.log('PWA Capabilities:', capabilities);

  // Register service worker
  if (capabilities.serviceWorkerSupported) {
    await registerServiceWorker();
  }

  // Request notification permission if needed
  if (capabilities.pushNotificationSupported && capabilities.notificationPermission === 'default') {
    await requestNotificationPermission();
  }

  return capabilities;
};

// Send message to service worker
export const sendMessageToServiceWorker = async (message: any): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    throw new Error('Service Worker is not supported');
  }

  const registration = await navigator.serviceWorker.ready;
  
  if (registration.active) {
    registration.active.postMessage(message);
  } else {
    throw new Error('Service Worker is not active');
  }
};

// Register background sync
export const registerBackgroundSync = async (tag: string): Promise<void> => {
  if (!isBackgroundSyncSupported()) {
    throw new Error('Background sync is not supported');
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register(tag);
};

// Show call notification
export const showCallNotification = async (callData: {
  callId: string;
  participants: number;
}): Promise<void> => {
  if (getNotificationPermission() !== 'granted') {
    throw new Error('Notification permission not granted');
  }

  const notification = new Notification('Afrimeet Call Active', {
    body: `Call in progress - ${callData.participants} participants`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      callId: callData.callId,
      type: 'active_call'
    },
    actions: [
      {
        action: 'return_to_call',
        title: 'Return to Call',
        icon: '/icon-192x192.png'
      },
      {
        action: 'end_call',
        title: 'End Call',
        icon: '/icon-192x192.png'
      }
    ],
    requireInteraction: true,
    silent: false,
    tag: 'active_call'
  });

  return new Promise((resolve) => {
    notification.onclick = () => {
      window.focus();
      resolve();
    };
  });
};

// Hide call notification
export const hideCallNotification = async (): Promise<void> => {
  const notifications = await navigator.serviceWorker.ready.then(registration => 
    registration.getNotifications()
  );
  
  notifications.forEach(notification => {
    if (notification.data && notification.data.type === 'active_call') {
      notification.close();
    }
  });
};