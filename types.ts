export interface TimelineEvent {
  id: string;
  title: string;
  month: number; // 1-12
  day: number;
  hour?: number;
  minute?: number;
  icon: string;
  description?: string;
}

export interface TimeParts {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
