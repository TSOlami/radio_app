import { ActionIcon, Box, Menu } from "@mantine/core";
import {
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
  CallControls,
  CallStatsButton,
  useCallStateHooks,
  CallingState,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import classes from "../app/(root)/meeting/meeting.module.css";
import { LuLayoutList } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./meeting/EndCallButton";
import ChatPanel from "./meeting/ChatPanel";
import InitialLoader from "./Loader";

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
      <Box className="relative flex size-full items-center justify-center">
        <Box className={`flex size-full items-center ${showChat ? 'max-w-[680px]' : 'max-w-[1000px]'}`}>
          <CallLayout />
        </Box>
        {showParticipants && (
          <Box className="h-screen ml-5">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </Box>
        )}
        {showChat && (
          <Box className="h-screen">
            <ChatPanel onClose={() => setShowChat(false)} />
          </Box>
        )}
      </Box>
      <Box className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-3">
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
        <CallStatsButton />
        {!isPersonalRoom && <EndCallButton />}
      </Box>
    </Box>
  );
};

export default MeetingRoom;
