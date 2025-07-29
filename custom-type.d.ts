interface CustomIconsProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

interface MeetingTypesProps {
  id: number;
  label: string;
  icon: any;
  bgColor: string;
  description: string;
  type: string;
  route: string;
}
interface ScheduleMeetingProps {
  date: Date;
  description: string;
}

// Global type for chat custom events
export interface ChatCustomEvent {
  custom: {
    type: string;
    message?: string;
    messageId?: string;
    userId?: string;
    userName?: string;
    userImage?: string;
    timestamp?: string | number | Date;
    [key: string]: any;
  };
  user?: {
    id?: string;
    name?: string;
    image?: string;
  };
}
