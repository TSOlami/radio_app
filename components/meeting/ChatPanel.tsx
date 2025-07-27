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
} from "@mantine/core";
import { IoSend } from "react-icons/io5";
import { useCallStateHooks, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import classes from "./chat.module.css";

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
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { useCallCustomData } = useCallStateHooks();
  const customData = useCallCustomData();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Listen for custom events (chat messages)
  useEffect(() => {
    if (!client) return;

    const handleCustomEvent = (event: any) => {
      if (event.type === "chat_message") {
        const chatMessage: ChatMessage = {
          id: event.custom.messageId,
          userId: event.user.id,
          userName: event.user.name || event.user.id,
          userImage: event.user.image,
          message: event.custom.message,
          timestamp: new Date(event.created_at),
        };
        
        setMessages((prev) => [...prev, chatMessage]);
      }
    };

    // Subscribe to custom events
    const unsubscribe = client.on("custom", handleCustomEvent);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [client]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !client || !user) return;

    try {
      const messageId = crypto.randomUUID();
      
      // Send custom event to all participants
      await client.sendCustomEvent({
        type: "chat_message",
        custom: {
          messageId,
          message: newMessage.trim(),
        },
      });

      // Add message to local state immediately for better UX
      const chatMessage: ChatMessage = {
        id: messageId,
        userId: user.id,
        userName: user.username || user.firstName || user.id,
        userImage: user.imageUrl,
        message: newMessage.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, chatMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
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
    <Box className={classes.chatPanel}>
      <Group justify="space-between" p="md" className={classes.chatHeader}>
        <Text
          size="lg"
          fw={600}
          c="light_colors.0"
          ff="Nunito_sans_semibold"
        >
          Chat
        </Text>
        <CloseButton
          onClick={onClose}
          size="md"
          c="light_colors.1"
          variant="transparent"
        />
      </Group>

      <ScrollArea
        flex={1}
        p="md"
        viewportRef={viewport}
        className={classes.messagesArea}
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
                className={
                  message.userId === user?.id
                    ? classes.ownMessage
                    : classes.otherMessage
                }
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
                  <Box flex={1}>
                    {message.userId !== user?.id && (
                      <Text
                        size="xs"
                        c="light_colors.1"
                        ff="Nunito_sans_medium"
                        fw={500}
                        mb={2}
                      >
                        {message.userName}
                      </Text>
                    )}
                    <Text
                      size="sm"
                      c="light_colors.0"
                      ff="Nunito_sans_regular"
                      style={{ wordBreak: "break-word" }}
                    >
                      {message.message}
                    </Text>
                    <Text
                      size="xs"
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

      <Box p="md" className={classes.messageInput}>
        <Group gap="xs">
          <TextInput
            flex={1}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            size="md"
            classNames={{
              input: classes.textInput,
            }}
            maxLength={500}
          />
          <ActionIcon
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            size="lg"
            variant="filled"
            bg="other_colors.2"
            color="light_colors.0"
            className={classes.sendButton}
          >
            <IoSend size={18} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
};

export default ChatPanel;