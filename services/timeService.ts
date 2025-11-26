import { TimelineEvent, TimeParts } from '../types';

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const getSuffix = (n: number) => {
  if (n % 10 === 1 && n % 100 !== 11) return "st";
  if (n % 10 === 2 && n % 100 !== 12) return "nd";
  if (n % 10 === 3 && n % 100 !== 13) return "rd";
  return "th";
};

export const getNextOccurrence = (ev: TimelineEvent, from: Date): Date => {
  let y = from.getFullYear();
  // Month is 0-indexed in JS Date
  let d = new Date(y, ev.month - 1, ev.day, ev.hour || 0, ev.minute || 0, 0);
  if (d <= from) {
    y++;
    d = new Date(y, ev.month - 1, ev.day, ev.hour || 0, ev.minute || 0, 0);
  }
  return d;
};

export const getLastOccurrence = (ev: TimelineEvent, from: Date): Date => {
  let y = from.getFullYear();
  let d = new Date(y, ev.month - 1, ev.day, ev.hour || 0, ev.minute || 0, 0);
  
  // If the event for this year hasn't happened yet, the last one was last year
  if (d > from) {
    y--;
    d = new Date(y, ev.month - 1, ev.day, ev.hour || 0, ev.minute || 0, 0);
  }
  return d;
};

export const getDaysDifference = (a: Date, b: Date): number => {
  const oneDay = 1000 * 60 * 60 * 24;
  // Use absolute difference
  const diffInTime = Math.abs(b.getTime() - a.getTime());
  return Math.floor(diffInTime / oneDay);
};

export const countOccurrences = (ev: TimelineEvent, base: Date, now: Date): number => {
  let c = 0;
  let y = base.getFullYear();
  // Safety break to prevent infinite loops if dates are wild
  let safety = 0;
  while (safety < 1000) {
    const d = new Date(y, ev.month - 1, ev.day, ev.hour || 0, ev.minute || 0, 0);
    if (d > now) break;
    if (d >= base) c++;
    y++;
    safety++;
  }
  return c;
};

export const calculateTimeParts = (target: Date, now: Date): TimeParts => {
  let diff = target.getTime() - now.getTime();
  if (diff < 0) diff = 0;

  const s = Math.floor(diff / 1000);
  const secMon = 30 * 24 * 60 * 60; // Approximation
  const secDay = 24 * 60 * 60;

  const months = Math.floor(s / secMon);
  let rem = s - months * secMon;
  const days = Math.floor(rem / secDay);
  rem -= days * secDay;
  const hours = Math.floor(rem/3600);
  rem -= hours * 3600;
  const minutes = Math.floor(rem/60);
  const seconds = rem - minutes * 60;

  return { months, days, hours, minutes, seconds };
};

export const getUpcomingEvent = (events: TimelineEvent[], now: Date) => {
  let bestEvent: TimelineEvent | null = null;
  let bestDate: Date | null = null;

  for (const ev of events) {
    const d = getNextOccurrence(ev, now);
    if (!bestDate || d < bestDate) {
      bestDate = d;
      bestEvent = ev;
    }
  }
  return { upcomingEvent: bestEvent, upcomingDate: bestDate };
};