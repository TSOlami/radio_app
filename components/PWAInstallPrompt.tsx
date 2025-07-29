'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Text, Stack, ActionIcon, CloseButton } from '@mantine/core';
import { IconDownload, IconX } from '@tabler/icons-react';
import { isPWAInstalled, showPWAInstallPrompt, getPWACapabilities } from '../utils/pwaUtils';

interface PWAInstallPromptProps {
  onClose?: () => void;
  showOnMobile?: boolean;
}

export default function PWAInstallPrompt({ onClose, showOnMobile = true }: PWAInstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [capabilities, setCapabilities] = useState<any>(null);

  useEffect(() => {
    const checkPWAStatus = () => {
      const caps = getPWACapabilities();
      setCapabilities(caps);
      
      // Show prompt if PWA is not installed and conditions are met
      const shouldShow = !caps.isInstalled && 
                        caps.serviceWorkerSupported && 
                        (showOnMobile ? caps.isMobile : true);
      
      setShowPrompt(shouldShow);
    };

    checkPWAStatus();

    // Listen for PWA installation events
    const handleAppInstalled = () => {
      setShowPrompt(false);
      onClose?.();
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showOnMobile, onClose]);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const success = await showPWAInstallPrompt();
      if (success) {
        setShowPrompt(false);
        onClose?.();
      }
    } catch (error) {
      console.error('Failed to install PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    onClose?.();
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: '400px',
        width: '90%',
      }}
    >
      <Box
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Stack spacing="sm">
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Text size="lg" weight={600} color="white" mb={4}>
                Install Afrimeet
              </Text>
              <Text size="sm" color="rgba(255, 255, 255, 0.9)" mb={12}>
                Install the app for better call experience and background support
              </Text>
            </Box>
            <CloseButton
              size="sm"
              variant="subtle"
              color="white"
              onClick={handleClose}
              style={{ color: 'white' }}
            />
          </Box>

          <Stack spacing="xs">
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              />
              <Text size="xs" color="rgba(255, 255, 255, 0.8)">
                Keep calls active in background
              </Text>
            </Box>
            
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              />
              <Text size="xs" color="rgba(255, 255, 255, 0.8)">
                Receive call notifications
              </Text>
            </Box>
            
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              />
              <Text size="xs" color="rgba(255, 255, 255, 0.8)">
                Faster app access
              </Text>
            </Box>
          </Stack>

          <Button
            onClick={handleInstall}
            loading={isInstalling}
            leftIcon={<IconDownload size={16} />}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
            }}
            fullWidth
          >
            {isInstalling ? 'Installing...' : 'Install App'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}