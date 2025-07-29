import { ActionIcon, Box, Menu, Badge } from "@mantine/core";
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
import { useState, useEffect, useRef } from "react";
import classes from "../app/(root)/meeting/meeting.module.css";
import { LuLayoutList } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
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
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();
  const { unreadCount, hasUnreadMessages, markAsRead } = useChatNotifications();
  const call = useCall();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, markAsRead: markAsReadFromPersistence } = useChatPersistence(call?.id);

  usePictureInPicture(videoContainerRef);

  useEffect(() => {
    if (!call) return;
    const handleCustomEvent = (event: ChatCustomEvent) => {
      console.log('[Chat Debug] [MeetingRoom] Received custom event', { callId: call.id, event });
      const payload = event.custom;

      if (payload.type === "chat_message") {
        const chatMessage = {
          id: payload.messageId,
          message: payload.message,
          userId: payload.userId || event.user?.id || "unknown",
          userName: payload.userName || event.user?.name || "Unknown User",
          userImage: payload.userImage || event.user?.image || "",
          timestamp: new Date(payload.timestamp),
        };
        console.log('[Chat Debug] [MeetingRoom] Received chat message', chatMessage);
        const exists = messages.some((msg) => msg.id === chatMessage.id);
        if (!exists) {
          addMessage(chatMessage);
        }
      }
    };
    const unsubscribe = call.on("custom", handleCustomEvent);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [call, addMessage]);

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
    <Box ref={videoContainerRef} className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <Box className="relative flex size-full items-center justify-center">
        <Box className={`flex size-full items-center justify-center ${showChat ? 'chat-open' : ''}`}>
          <CallLayout />
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
            addMessage={addMessage}
          />
        )}
      </Box>

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
            onClick={() => setShowChat((prev) => !prev)}
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
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Transition>
        </Box>
        <CallStatsButton />
        {!isPersonalRoom && <EndCallButton />}
      </Box>
    </Box>
  );
};

export default MeetingRoom;
