export interface CustomIconsProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

export interface MeetingTypesProps {
  id: number;
  label: string;
  icon: React.ElementType;
  bgColor: string;
  description: string;
  type: string;
  route: string;
}

export interface ScheduleMeetingProps {
  date: Date;
  description: string;
}

export interface ChatCustomEvent {
  custom: {
    type?: string;
    message?: string;
    messageId?: string;
    userId?: string;
    userName?: string;
    userImage?: string;
    timestamp?: string | number | Date;
  };
  user?: {
    id?: string;
    name?: string;
    image?: string;
  };
}

// Document Picture-in-Picture API types
declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow(): Promise<Window>;
    };
  }
  
  interface Navigator {
    mediaSession?: {
      setActionHandler(
        action: "enterpictureinpicture" | MediaSessionAction,
        handler: (() => void) | null
      ): void;
    };
  }
}