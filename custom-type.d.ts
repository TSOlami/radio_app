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

<<<<<<< HEAD
export interface ChatCustomEvent {
  custom: {
    type?: string;
=======
// Global type for chat custom events
export interface ChatCustomEvent {
  custom: {
    type: string;
>>>>>>> 9911b4d24a774def55b72635fcadb62f08c101e0
    message?: string;
    messageId?: string;
    userId?: string;
    userName?: string;
    userImage?: string;
    timestamp?: string | number | Date;
<<<<<<< HEAD
    // [key?: string]?: string | number | Date | undefined;
=======
    [key: string]: any;
>>>>>>> 9911b4d24a774def55b72635fcadb62f08c101e0
  };
  user?: {
    id?: string;
    name?: string;
    image?: string;
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 9911b4d24a774def55b72635fcadb62f08c101e0
