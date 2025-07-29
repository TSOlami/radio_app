'use client';

import { Box, Text, Button, Container, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline) {
      router.push('/');
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Container size="sm" py="xl">
      <Stack align="center" spacing="xl">
        <Box textAlign="center">
          <Text size="xl" weight={700} mb="md">
            {isOnline ? 'Connection Restored' : 'You\'re Offline'}
          </Text>
          
          <Text color="dimmed" mb="xl">
            {isOnline 
              ? 'Your connection has been restored. You can now continue with your call.'
              : 'It looks like you\'ve lost your internet connection. Don\'t worry, your call will continue in the background if it was active.'
            }
          </Text>

          <Stack spacing="md">
            <Button 
              onClick={handleRetry}
              size="lg"
              fullWidth
            >
              {isOnline ? 'Continue to App' : 'Retry Connection'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              size="md"
              fullWidth
            >
              Go to Home
            </Button>
          </Stack>
        </Box>

        {!isOnline && (
          <Box textAlign="center">
            <Text size="sm" color="dimmed">
              💡 Tip: If you were in an active call, it may still be running in the background. 
              Check your notification bar for call status.
            </Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}