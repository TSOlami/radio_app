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
