import { useState, useEffect, useCallback } from 'react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

export const useChatNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const call = useCall();
  const { user } = useUser();

  // Listen for incoming chat messages
  useEffect(() => {
    if (!call) return;

    const handleCustomEvent = (event: any) => {
      if (event.type === "chat_message" && event.custom) {
        // Only increment unread count if the message is from another user
        if (event.user.id !== user?.id) {
          setUnreadCount(prev => prev + 1);
          setHasUnreadMessages(true);
        }
      }
    };

    const unsubscribe = call.on("custom", handleCustomEvent);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [call, user?.id]);

  // Reset unread count when chat is opened
  const markAsRead = useCallback(() => {
    setUnreadCount(0);
    setHasUnreadMessages(false);
  }, []);

  // Get current unread count
  const getUnreadCount = useCallback(() => {
    return unreadCount;
  }, [unreadCount]);

  return {
    unreadCount,
    hasUnreadMessages,
    markAsRead,
    getUnreadCount
  };
};