import { useEffect, useRef, useCallback } from 'react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

interface BackgroundCallState {
  isActive: boolean;
  callId: string | null;
  participants: number;
  startTime: number | null;
}

export function useBackgroundCall() {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  
  const backgroundState = useRef<BackgroundCallState>({
    isActive: false,
    callId: null,
    participants: 0,
    startTime: null
  });

  const serviceWorkerRef = useRef<ServiceWorker | null>(null);

  // Initialize service worker
  const initializeServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        serviceWorkerRef.current = registration.active;
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        
        console.log('Service Worker registered for background call support');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }, []);

  // Handle messages from service worker
  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    const { type, timestamp } = event.data;
    
    switch (type) {
      case 'MAINTAIN_CALL_CONNECTION':
        maintainCallConnection();
        break;
      case 'CALL_HEARTBEAT':
        sendCallHeartbeat();
        break;
      default:
        console.log('Unknown service worker message:', type);
    }
  }, []);

  // Maintain call connection when app is backgrounded
  const maintainCallConnection = useCallback(() => {
    if (call && callingState === 'joined') {
      // Send a ping to keep the call alive
      call.sendCustomEvent({
        type: 'call_heartbeat',
        data: { timestamp: Date.now() }
      });
      
      console.log('Call connection maintained via background sync');
    }
  }, [call, callingState]);

  // Send call heartbeat
  const sendCallHeartbeat = useCallback(() => {
    if (call && callingState === 'joined') {
      // Send heartbeat to keep connection alive
      call.sendCustomEvent({
        type: 'call_heartbeat',
        data: { timestamp: Date.now() }
      });
    }
  }, [call, callingState]);

  // Start background call monitoring
  const startBackgroundCall = useCallback(() => {
    if (!call || callingState !== 'joined') return;

    backgroundState.current = {
      isActive: true,
      callId: call.id,
      participants: call.participants.size,
      startTime: Date.now()
    };

    // Register background sync
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({
        type: 'REGISTER_BACKGROUND_SYNC'
      });
    }

    // Start call heartbeat
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({
        type: 'START_CALL_HEARTBEAT'
      });
    }

    // Show call notification
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({
        type: 'SHOW_CALL_NOTIFICATION',
        payload: {
          callId: call.id,
          participants: call.participants.size
        }
      });
    }

    console.log('Background call monitoring started');
  }, [call, callingState]);

  // Stop background call monitoring
  const stopBackgroundCall = useCallback(() => {
    backgroundState.current = {
      isActive: false,
      callId: null,
      participants: 0,
      startTime: null
    };

    // Stop call heartbeat
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({
        type: 'STOP_CALL_HEARTBEAT'
      });
    }

    // Hide call notification
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({
        type: 'HIDE_CALL_NOTIFICATION'
      });
    }

    console.log('Background call monitoring stopped');
  }, []);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      // App is backgrounded
      if (call && callingState === 'joined') {
        startBackgroundCall();
      }
    } else {
      // App is foregrounded
      if (backgroundState.current.isActive) {
        stopBackgroundCall();
      }
    }
  }, [call, callingState, startBackgroundCall, stopBackgroundCall]);

  // Handle page unload
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (backgroundState.current.isActive) {
      // Keep the call active when page is unloaded
      event.preventDefault();
      event.returnValue = '';
      
      // Send final heartbeat
      if (call) {
        call.sendCustomEvent({
          type: 'call_background_keepalive',
          data: { timestamp: Date.now() }
        });
      }
    }
  }, [call]);

  // Initialize service worker on mount
  useEffect(() => {
    initializeServiceWorker();
    
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [initializeServiceWorker, handleServiceWorkerMessage]);

  // Monitor call state changes
  useEffect(() => {
    if (callingState === 'joined' && call) {
      // Call is active
      if (document.visibilityState === 'hidden') {
        startBackgroundCall();
      }
    } else if (callingState === 'left' || callingState === 'rejected') {
      // Call ended
      stopBackgroundCall();
    }
  }, [callingState, call, startBackgroundCall, stopBackgroundCall]);

  // Monitor visibility changes
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleVisibilityChange, handleBeforeUnload]);

  // Monitor call participants
  useEffect(() => {
    if (call && backgroundState.current.isActive) {
      const updateParticipants = () => {
        backgroundState.current.participants = call.participants.size;
        
        // Update notification if service worker is available
        if (serviceWorkerRef.current) {
          serviceWorkerRef.current.postMessage({
            type: 'SHOW_CALL_NOTIFICATION',
            payload: {
              callId: call.id,
              participants: call.participants.size
            }
          });
        }
      };

      call.on('participant.joined', updateParticipants);
      call.on('participant.left', updateParticipants);

      return () => {
        call.off('participant.joined', updateParticipants);
        call.off('participant.left', updateParticipants);
      };
    }
  }, [call]);

  return {
    backgroundState: backgroundState.current,
    startBackgroundCall,
    stopBackgroundCall,
    maintainCallConnection
  };
}