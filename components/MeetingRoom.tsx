import { ActionIcon, Box, Menu, Badge, Button } from "@mantine/core";
import { Transition } from '@mantine/core';
import {
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
  CallControls,
  CallStatsButton,
  useCallStateHooks,
  CallingState,
  useCall,
} from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "../app/(root)/meeting/meeting.module.css";
import { LuLayoutList } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdPictureInPicture } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./meeting/EndCallButton";
import ChatPanel from "./meeting/ChatPanel";
import InitialLoader from "./Loader";
import { useChatNotifications } from "../hooks/useChatNotifications";
import { clearChatMessages } from "../utils/chatUtils";
import { useChatPersistence } from "../hooks/useChatPersistence";
import { usePictureInPicture } from "../hooks/usePictureInPicture";
import type { ChatCustomEvent } from '../custom-type';

type CallLayoutType = "grid" | "speaker-right" | "speaker-left";

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const { useCallCallingState, useRemoteParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const remoteParticipants = useRemoteParticipants();
  const router = useRouter();
  const { unreadCount, hasUnreadMessages, markAsRead } = useChatNotifications();
  const call = useCall();
  const { messages, addMessage, markAsRead: markAsReadFromPersistence } = useChatPersistence(call?.id);
  
  // Picture-in-Picture functionality
  const { pipWindow, handlePictureInPicture, closePictureInPicture, isSupported } = usePictureInPicture();

  useEffect(() => {
    if (!call) return;
    const handleCustomEvent = (event: ChatCustomEvent) => {
      const payload = event.custom;

      if (payload.type === "chat_message") {
        const chatMessage = {
          id: payload.messageId || crypto.randomUUID(),
          message: payload.message || "Unknown Message",
          userId: payload.userId || event.user?.id || "unknown",
          userName: payload.userName || event.user?.name || "Unknown User",
          userImage: payload.userImage || event.user?.image || "",
          timestamp: new Date(payload.timestamp || Date.now()),
        };
        const exists = messages.some((msg) => msg.id === chatMessage.id);
        if (!exists) {
          addMessage(chatMessage);
          if (showChat) {
            markAsRead();
            markAsReadFromPersistence?.();
          }
        }
      }
    };
    const unsubscribe = call.on("custom", handleCustomEvent);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [call, addMessage]);

  useEffect(() => {
  if (showChat && messages.length > 0) {
    markAsRead();
    markAsReadFromPersistence();
  }
}, [showChat, messages, markAsRead, markAsReadFromPersistence]);

  useEffect(() => {
    if (callingState === CallingState.LEFT && call?.id) {
      clearChatMessages(call.id);
    }
  }, [callingState, call?.id]);

  if (callingState !== CallingState.JOINED) return <InitialLoader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition={"right"} />;
      default:
        return <SpeakerLayout participantsBarPosition={"left"} />;
    }
  };

  return (
    <Box className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <Box
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1000,
        }}
        className={classes.action_bg}
      >
        {/* PiP Button - only show if supported */}
        {isSupported && (
          <Button
            onClick={handlePictureInPicture}
            title="Picture-in-Picture"
            size="sm"
            variant="transparent"
            color="white"
            style={{ marginBottom: "0.5rem" }}
          >
            <MdPictureInPicture size={20} />
          </Button>
        )}
      </Box>
      
      <Box className="relative flex size-full items-center justify-center">
        <Box className={`flex size-full items-center justify-center ${showChat ? 'chat-open' : ''}`}>
                    {/* Always render the main call layout */}
          <CallLayout />
          
          {/* PiP window overlay */}
          {pipWindow && createPortal(
            <Box className="h-screen w-full overflow-hidden pt-4 text-white">
              <Box className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-3 pb-4 z-50">
                <CallControls onLeave={() => router.replace("/")} />
                <Button
                  onClick={closePictureInPicture}
                  size="sm"
                  variant="filled"
                  color="red"
                  title="Exit Picture-in-Picture"
                >
                  <IoClose size={16} />
                </Button>
              </Box>
            </Box>,
            pipWindow.document.body,
          )}
          
          {/* Exit PiP button in parent window */}
          {pipWindow && (
            <Box className="fixed top-4 left-4 z-50">
              <Button
                onClick={closePictureInPicture}
                size="lg"
                variant="filled"
                color="red"
                title="Exit Picture-in-Picture"
              >
                <IoClose size={20} />
              </Button>
            </Box>
          )}
        </Box>

        {showParticipants && (
          <Box className="h-screen ml-5 hidden md:block">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </Box>
        )}

        {showChat && (
          <ChatPanel 
            onClose={() => setShowChat(false)} 
            onMarkAsRead={markAsReadFromPersistence}
            messages={messages}
            isOpen={showChat}
          />
        )}
      </Box>

      {!pipWindow && (
        <Box className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-3 pb-4 z-50">
          <CallControls onLeave={() => router.replace("/")} />
          <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
            <Menu.Target>
              <ActionIcon
                title="Layout"
                variant="transparent"
                classNames={{
                  root: classes.action_bg,
                }}
              >
                <LuLayoutList size={20} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown
              classNames={{
                dropdown: classes.menu_dropdown,
              }}
            >
              {["Grid", "Speaker-Left", "Speaker-Right"].map(
                (type: string, index: number) => (
                  <Menu.Item
                    key={index}
                    onClick={() =>
                      setLayout(type.toLowerCase() as CallLayoutType)
                    }
                  >
                    {type}
                  </Menu.Item>
                )
              )}
            </Menu.Dropdown>
          </Menu>
          <ActionIcon
            title="Participants"
            variant="transparent"
            classNames={{
              root: classes.action_bg,
            }}
            onClick={() => setShowParticipants((prev) => !prev)}
          >
            <PiUsersThree size={20} />
          </ActionIcon>
          <Box pos="relative">
            <ActionIcon
              title="Chat"
              variant="transparent"
              classNames={{
                root: classes.action_bg,
              }}
              onClick={() => {
                setShowChat(prev => {
                  const willOpen = !prev;
                  if (willOpen) markAsRead();
                  return willOpen;
                });
              }}
            >
              <IoChatbubbleEllipsesOutline size={20} />
            </ActionIcon>
            <Transition mounted={hasUnreadMessages && unreadCount > 0} transition="pop" duration={200} timingFunction="ease">
              {(styles) => (
                <Badge
                  size="xs"
                  variant="filled"
                  color="red"
                  pos="absolute"
                  top={-8}
                  right={-8}
                  style={{ 
                    minWidth: '18px', 
                    height: '18px', 
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    ...styles
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Transition>
          </Box>
          <CallStatsButton />
          {!isPersonalRoom && <EndCallButton />}
        </Box>
      )}
    </Box>
  );
};

export default MeetingRoom;
