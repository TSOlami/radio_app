import { useEffect, useRef, useCallback } from 'react';

interface AudioSessionConfig {
  category: 'playback' | 'record' | 'playAndRecord' | 'ambient' | 'multiRoute';
  mode: 'default' | 'voiceChat' | 'videoChat' | 'gameChat' | 'videoRecording' | 'measurement' | 'moviePlayback' | 'spokenAudio';
  routeSharingPolicy: 'default' | 'longFormAudio' | 'independent' | 'longFormVideo';
  interruptionPolicy: 'default' | 'duckOthers' | 'mixWithOthers';
}

export function useAudioSession() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isActive = useRef(false);

  // Initialize audio session
  const initializeAudioSession = useCallback(async (config?: Partial<AudioSessionConfig>) => {
    try {
      // Create audio context if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Set up audio session (iOS Safari)
      if ('mediaSession' in navigator) {
        (navigator as any).mediaSession.setActionHandler('play', () => {
          audioContextRef.current?.resume();
        });
        
        (navigator as any).mediaSession.setActionHandler('pause', () => {
          // Don't pause, keep audio active
        });
      }

      // Configure audio session for background playback
      if ('setAudioSession' in navigator) {
        await (navigator as any).setAudioSession({
          category: config?.category || 'playAndRecord',
          mode: config?.mode || 'voiceChat',
          routeSharingPolicy: config?.routeSharingPolicy || 'default',
          interruptionPolicy: config?.interruptionPolicy || 'duckOthers'
        });
      }

      isActive.current = true;
      console.log('Audio session initialized for background playback');
    } catch (error) {
      console.error('Failed to initialize audio session:', error);
    }
  }, []);

  // Create silent audio element to keep audio session active
  const createSilentAudio = useCallback(() => {
    if (!audioElementRef.current) {
      audioElementRef.current = document.createElement('audio');
      audioElementRef.current.loop = true;
      audioElementRef.current.muted = true;
      audioElementRef.current.volume = 0;
      
      // Create silent audio buffer
      if (audioContextRef.current) {
        const buffer = audioContextRef.current.createBuffer(1, 44100, 44100);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
      
      // Start silent audio playback
      audioElementRef.current.play().catch(console.error);
    }
  }, []);

  // Start background audio session
  const startBackgroundAudio = useCallback(async () => {
    if (isActive.current) return;

    await initializeAudioSession({
      category: 'playAndRecord',
      mode: 'voiceChat',
      interruptionPolicy: 'duckOthers'
    });

    createSilentAudio();
    
    // Set up media session metadata
    if ('mediaSession' in navigator) {
      (navigator as any).mediaSession.metadata = new (window as any).MediaMetadata({
        title: 'Afrimeet Call',
        artist: 'Active Call',
        album: 'Video Conference',
        artwork: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    }

    console.log('Background audio session started');
  }, [initializeAudioSession, createSilentAudio]);

  // Stop background audio session
  const stopBackgroundAudio = useCallback(() => {
    if (!isActive.current) return;

    // Stop silent audio
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clear media session
    if ('mediaSession' in navigator) {
      (navigator as any).mediaSession.metadata = null;
    }

    isActive.current = false;
    console.log('Background audio session stopped');
  }, []);

  // Handle page visibility changes
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      // App is backgrounded - ensure audio session is active
      if (!isActive.current) {
        startBackgroundAudio();
      }
    }
  }, [startBackgroundAudio]);

  // Handle audio context state changes
  const handleAudioContextStateChange = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      console.log('Audio context suspended, attempting to resume...');
      audioContextRef.current.resume();
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopBackgroundAudio();
    };
  }, [handleVisibilityChange, stopBackgroundAudio]);

  // Monitor audio context state
  useEffect(() => {
    if (audioContextRef.current) {
      audioContextRef.current.addEventListener('statechange', handleAudioContextStateChange);
      
      return () => {
        audioContextRef.current?.removeEventListener('statechange', handleAudioContextStateChange);
      };
    }
  }, [handleAudioContextStateChange]);

  // Handle user interaction to start audio context
  const handleUserInteraction = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Set up user interaction listeners
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [handleUserInteraction]);

  return {
    isActive: isActive.current,
    startBackgroundAudio,
    stopBackgroundAudio,
    initializeAudioSession
  };
}