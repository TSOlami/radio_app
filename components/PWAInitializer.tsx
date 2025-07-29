'use client';

import { useEffect, useState } from 'react';
import { initializePWA, getPWACapabilities } from '../utils/pwaUtils';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function PWAInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [capabilities, setCapabilities] = useState<any>(null);

  useEffect(() => {
    const initPWA = async () => {
      try {
        const caps = await initializePWA();
        setCapabilities(caps);
        setIsInitialized(true);
        
        console.log('PWA initialized successfully:', caps);
      } catch (error) {
        console.error('Failed to initialize PWA:', error);
        setIsInitialized(true);
      }
    };

    // Initialize PWA after a short delay to ensure DOM is ready
    const timer = setTimeout(initPWA, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until PWA is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <>
      {/* PWA Install Prompt - only show if not installed and on mobile */}
      <PWAInstallPrompt showOnMobile={true} />
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && capabilities && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px'
        }}>
          <div><strong>PWA Status:</strong></div>
          <div>Installed: {capabilities.isInstalled ? 'Yes' : 'No'}</div>
          <div>Mobile: {capabilities.isMobile ? 'Yes' : 'No'}</div>
          <div>Service Worker: {capabilities.serviceWorkerSupported ? 'Yes' : 'No'}</div>
          <div>Background Sync: {capabilities.backgroundSyncSupported ? 'Yes' : 'No'}</div>
          <div>Push Notifications: {capabilities.pushNotificationSupported ? 'Yes' : 'No'}</div>
          <div>Audio Session: {capabilities.audioSessionSupported ? 'Yes' : 'No'}</div>
          <div>Notifications: {capabilities.notificationPermission}</div>
        </div>
      )}
    </>
  );
}