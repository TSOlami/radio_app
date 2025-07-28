"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  ScrollArea,
  TextInput,
  ActionIcon,
  Text,
  Group,
  Stack,
  Avatar,
  Paper,
  CloseButton,
  Notification,
  Overlay,
  Button,
} from "@mantine/core";
import { IoSend } from "react-icons/io5";
import { useCall, useCallStateHooks, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  message: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onClose: () => void;
}

const ChatPanel = ({ onClose }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const { user } = useUser();
  const client = useStreamVideoClient();
  const call = useCall();
  const { useCallCustomData } = useCallStateHooks();
  const customData = useCallCustomData();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  // Get participants from the call
  const participants = call?.state.participants || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Check connection status
  useEffect(() => {
    if (call) {
      setConnectionStatus(`Connected to call: ${call.id}`);
      console.log("Call connection status:", call.state);
    } else {
      setConnectionStatus("Not connected to call");
    }
  }, [call]);

  // Listen for custom events (chat messages)
  useEffect(() => {
    if (!call) {
      console.log("No call available for chat");
      return;
    }

    console.log("Setting up chat event listener for call:", call.id);

    const handleCustomEvent = (event: any) => {
      console.log("Received custom event:", event);
      
      if (event.type === "chat_message" && event.custom) {
        const chatMessage: ChatMessage = {
          id: event.custom.messageId || crypto.randomUUID(),
          userId: event.user.id,
          userName: event.user.name || event.user.id,
          userImage: event.user.image,
          message: event.custom.message,
          timestamp: new Date(event.created_at || Date.now()),
        };
        
        console.log("Processing chat message:", chatMessage);
        
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(msg => msg.id === chatMessage.id);
          if (exists) {
            console.log("Message already exists, skipping:", chatMessage.id);
            return prev;
          }
          console.log("Adding new message to chat");
          return [...prev, chatMessage];
        });
      }
    };

    // Subscribe to custom events
    const unsubscribe = call.on("custom", handleCustomEvent);

    return () => {
      if (unsubscribe) {
        console.log("Cleaning up chat event listener");
        unsubscribe();
      }
    };
  }, [call]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !call || !user || isLoading) {
      console.log("Cannot send message:", { 
        hasMessage: !!newMessage.trim(), 
        hasCall: !!call, 
        hasUser: !!user, 
        isLoading 
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const messageId = crypto.randomUUID();
      const messageText = newMessage.trim();
      
      console.log("Sending message:", { messageId, messageText, callId: call.id });
      
      // Send custom event to all participants
      await call.sendCustomEvent({
        type: "chat_message",
        custom: {
          messageId,
          message: messageText,
        },
      });

      console.log("Message sent successfully");

      // Add message to local state immediately for better UX
      const chatMessage: ChatMessage = {
        id: messageId,
        userId: user.id,
        userName: user.username || user.firstName || user.id,
        userImage: user.imageUrl,
        message: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, chatMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!call || !user) {
      setError("Not connected to call or user not available");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const messageId = crypto.randomUUID();
      const testMessage = `Test message from ${user.username || user.firstName} at ${new Date().toLocaleTimeString()}`;
      
      console.log("Sending test message:", { messageId, testMessage, callId: call.id });
      
      await call.sendCustomEvent({
        type: "chat_message",
        custom: {
          messageId,
          message: testMessage,
        },
      });

      console.log("Test message sent successfully");

      const chatMessage: ChatMessage = {
        id: messageId,
        userId: user.id,
        userName: user.username || user.firstName || user.id,
        userImage: user.imageUrl,
        message: testMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, chatMessage]);
    } catch (error) {
      console.error("Failed to send test message:", error);
      setError("Failed to send test message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-35 z-[999]" onClick={onClose} />
      
      <Box 
        className="chat-panel"
        bg="dark_colors.0" 
        style={{ borderColor: 'var(--dark_3)' }}
      >
        <Group 
          justify="space-between" 
          p="md" 
          bg="dark_colors.2"
          className="border-b border-solid"
          style={{ borderColor: 'var(--dark_3)' }}
        >
          <Text
            fz={18}
            fw={600}
            c="light_colors.0"
            ff="Nunito_sans_semibold"
          >
            Chat ({participants.length} participants)
          </Text>
          <CloseButton
            onClick={onClose}
            size="md"
            c="light_colors.1"
            variant="transparent"
          />
        </Group>

        {/* Connection status */}
        <Box p="xs" bg="dark_colors.1" className="border-b border-solid" style={{ borderColor: 'var(--dark_3)' }}>
          <Text fz={12} c="light_colors.2" ff="Nunito_sans_regular">
            {connectionStatus}
          </Text>
        </Box>

        {error && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setError(null)}
            className="mx-4 mt-4"
          >
            {error}
          </Notification>
        )}

        {/* Test button for debugging */}
        <Box p="xs" bg="dark_colors.1" className="border-b border-solid" style={{ borderColor: 'var(--dark_3)' }}>
          <Button
            size="xs"
            variant="outline"
            onClick={sendTestMessage}
            disabled={isLoading || !call}
            fullWidth
            styles={{
              root: {
                borderColor: 'var(--other_2)',
                color: 'var(--other_2)',
                '&:hover': {
                  backgroundColor: 'var(--other_2)',
                  color: 'var(--light_0)',
                },
              },
            }}
          >
            Send Test Message
          </Button>
        </Box>

        <ScrollArea
          flex={1}
          p="md"
          viewportRef={viewport}
          bg="dark_colors.1"
          className="min-h-0"
        >
          <Stack gap="sm">
            {messages.length === 0 ? (
              <Text
                c="light_colors.2"
                ta="center"
                mt="xl"
                ff="Nunito_sans_regular"
              >
                No messages yet. Start the conversation!
              </Text>
            ) : (
              messages.map((message) => (
                <Paper
                  key={message.id}
                  p="sm"
                  bg={message.userId === user?.id ? "other_colors.2" : "dark_colors.3"}
                  className={`${
                    message.userId === user?.id
                      ? "ml-auto rounded-xl rounded-br-sm"
                      : "mr-auto rounded-xl rounded-bl-sm"
                  } max-w-[85%]`}
                >
                  <Group gap="xs" align="flex-start">
                    {message.userId !== user?.id && (
                      <Avatar
                        src={message.userImage}
                        size="sm"
                        color="dark_colors.3"
                      >
                        {message.userName.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    <Box flex={1} className="min-w-0">
                      {message.userId !== user?.id && (
                        <Text
                          fz={12}
                          c="light_colors.1"
                          ff="Nunito_sans_medium"
                          fw={500}
                          mb={2}
                          className="truncate"
                        >
                          {message.userName}
                        </Text>
                      )}
                      <Text
                        fz={14}
                        c="light_colors.0"
                        ff="Nunito_sans_regular"
                        className="break-words"
                      >
                        {message.message}
                      </Text>
                      <Text
                        fz={11}
                        c="light_colors.2"
                        ff="Nunito_sans_regular"
                        mt={2}
                      >
                        {formatTime(message.timestamp)}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              ))
            )}
          </Stack>
        </ScrollArea>

        <Box 
          p="md" 
          bg="dark_colors.0"
          className="border-t border-solid"
          style={{ borderColor: 'var(--dark_3)' }}
        >
          <Group gap="xs">
            <TextInput
              flex={1}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              size="md"
              disabled={isLoading}
              styles={{
                input: {
                  backgroundColor: 'var(--dark_3)',
                  border: '1px solid var(--dark_3)',
                  borderRadius: '8px',
                  color: 'var(--light_0)',
                  fontFamily: 'Nunito_sans_regular',
                  '&:focus': {
                    borderColor: 'var(--other_2)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                },
              }}
              maxLength={500}
            />
            <ActionIcon
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="lg"
              variant="filled"
              bg="other_colors.2"
              color="light_colors.0"
              className="rounded-lg"
              loading={isLoading}
              styles={{
                root: {
                  '&:disabled': {
                    backgroundColor: 'var(--dark_3)',
                    color: 'var(--light_2)',
                  },
                },
              }}
            >
              <IoSend size={18} />
            </ActionIcon>
          </Group>
        </Box>
      </Box>
    </>
  );
};

export default ChatPanel;