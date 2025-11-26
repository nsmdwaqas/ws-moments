import { TimelineEvent } from './types';

// Aug 1, 2025 as per original code logic
export const BASE_START_DATE = new Date(2025, 7, 1, 0, 0, 0); 

export const EVENTS: TimelineEvent[] = [
  { id: "your-presence", title: "Your Presence", month: 8, day: 8, hour: 14, minute: 0, icon: "❤️", description: "The day everything felt right." },
  { id: "engagement", title: "The Engagement", month: 9, day: 21, hour: 14, minute: 0, icon: "💍", description: "A promise for forever." },
  { id: "first-words", title: "The First Words", month: 10, day: 10, hour: 22, minute: 40, icon: "🗣️", description: "When silence turned into a story." },
  { id: "new-beginning", title: "The New Beginning", month: 1, day: 24, hour: 12, minute: 30, icon: "✨", description: "Start of a beautiful chapter." },
  { id: "first-glimpse", title: "The First Glimpse", month: 8, day: 11, hour: 19, minute: 55, icon: "👀", description: "Seeing you for the first time." },
  { id: "confirmation", title: "The Confirmation", month: 8, day: 14, hour: 20, minute: 30, icon: "✅", description: "Making it official." },
  { id: "unfiltered", title: "The Unfiltered", month: 8, day: 23, hour: 22, minute: 30, icon: "📸", description: "Real, raw, and beautiful." },
  { id: "first-salam", title: "The First Salam", month: 8, day: 25, hour: 13, minute: 0, icon: "🤝", description: "Peace be upon you." },
  { id: "new-year", title: "New Year", month: 1, day: 1, hour: 0, minute: 0, icon: "🎆", description: "Another year together." },
  { id: "waqas-bday", title: "Waqas Birthday", month: 6, day: 23, hour: 17, minute: 30, icon: "🎂", description: "Celebrating you." },
  { id: "safiyya-bday", title: "Safiyya Birthday", month: 2, day: 17, hour: 22, minute: 30, icon: "🎉", description: "Celebrating my love." }
];