import { useState, useEffect, useCallback } from 'react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import type { ChatCustomEvent } from '../custom-type';

export const useChatNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const call = useCall();
  const { user } = useUser();

  useEffect(() => {
    if (!call) return;

    const handleCustomEvent = (event: ChatCustomEvent) => {      
      const payload = event.custom;

      if (payload.type === "chat_message") {
        if (payload.userId !== user?.id) {
          setUnreadCount(prev => prev + 1);
          setHasUnreadMessages(true);
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
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