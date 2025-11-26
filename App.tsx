import React, { useState, useEffect, useRef } from 'react';
import { Background } from './components/Background';
import { CountdownGrid } from './components/CountdownGrid';
import { TimelineCard } from './components/TimelineCard';
import { EVENTS, BASE_START_DATE } from './constants';
import { getUpcomingEvent, calculateTimeParts, countOccurrences, getSuffix } from './services/timeService';
import { TimelineEvent, TimeParts } from './types';
import { Heart, Music, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [upcoming, setUpcoming] = useState<{ upcomingEvent: TimelineEvent | null, upcomingDate: Date | null }>({ upcomingEvent: null, upcomingDate: null });
  const [timeParts, setTimeParts] = useState<TimeParts>({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const currentNow = new Date();
      setNow(currentNow);
      
      const next = getUpcomingEvent(EVENTS, currentNow);
      setUpcoming(next);
      
      if (next.upcomingDate) {
        setTimeParts(calculateTimeParts(next.upcomingDate, currentNow));
      }
    }, 1000);

    // Initial calculation
    const initialNow = new Date();
    const next = getUpcomingEvent(EVENTS, initialNow);
    setUpcoming(next);
    if(next.upcomingDate) setTimeParts(calculateTimeParts(next.upcomingDate, initialNow));

    return () => clearInterval(timer);
  }, []);

  // Sync active index with scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.offsetWidth; // Viewport width
      const cardWidth = 300; // Approx card width + gap
      // Simple logic to find center element
      const center = scrollLeft + (width / 2);
      const index = Math.floor(center / cardWidth); 
      // This is a rough approximation, for better snapping we rely on CSS snap-x
      // but to highlight the state we need to know roughly where we are.
      // A better way for React state:
      const cardElements = scrollContainerRef.current.children;
      let minDiff = Infinity;
      let bestIndex = 0;
      
      for(let i=0; i<cardElements.length; i++) {
        const card = cardElements[i] as HTMLElement;
        const rect = card.getBoundingClientRect();
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const diff = Math.abs((rect.left + rect.width/2) - (containerRect.left + containerRect.width/2));
        if(diff < minDiff) {
          minDiff = diff;
          bestIndex = i;
        }
      }
      if(bestIndex !== activeIndex) setActiveIndex(bestIndex);
    }
  };

  const occurrenceCount = upcoming.upcomingEvent 
    ? countOccurrences(upcoming.upcomingEvent, BASE_START_DATE, now) + 1
    : 0;

  return (
    <div className="relative min-h-screen text-slate-800 font-sans selection:bg-rose-200">
      <Background />

      <main className="relative z-10 max-w-2xl mx-auto flex flex-col min-h-screen pb-10">
        
        {/* Header / Branding */}
        <header className="pt-8 px-6 flex justify-between items-center">
           <div className="flex flex-col">
             <span className="font-serif italic text-2xl text-rose-500">Waqas & Safiyya</span>
             <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">Forever since 2025</span>
           </div>
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors"
           >
             {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
           </button>
        </header>

        {/* Hero Section */}
        <section className="mt-10 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/50 mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-600">Up Next</span>
            </div>

            <AnimatePresence mode="wait">
              {upcoming.upcomingEvent ? (
                <motion.div
                  key={upcoming.upcomingEvent.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl sm:text-5xl font-serif text-slate-900 leading-tight mb-2">
                    {upcoming.upcomingEvent.title}
                  </h1>
                  <p className="text-slate-500 text-lg sm:text-xl font-light">
                    {upcoming.upcomingDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </motion.div>
              ) : (
                <div className="h-32 flex items-center justify-center">Loading...</div>
              )}
            </AnimatePresence>

            <CountdownGrid parts={timeParts} />

            <div className="mt-8 text-sm text-slate-500 bg-white/30 inline-block px-4 py-2 rounded-xl backdrop-blur-sm border border-white/40">
               This will be the <span className="font-bold text-rose-500">{occurrenceCount}{getSuffix(occurrenceCount)}</span> time since our journey began.
            </div>
          </motion.div>
        </section>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Timeline Section */}
        <section className="mt-12 mb-6">
          <div className="px-6 mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-serif text-slate-800">Our Memories</h2>
              <p className="text-xs uppercase tracking-widest text-slate-500 mt-1">Swipe to explore</p>
            </div>
            <div className="hidden sm:flex gap-1">
               {EVENTS.map((_, idx) => (
                 <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-rose-400' : 'w-1.5 bg-gray-300'}`} />
               ))}
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-8 pt-4 no-scrollbar items-center"
            style={{ scrollBehavior: 'smooth' }}
          >
            {EVENTS.map((ev, index) => (
              <TimelineCard 
                key={ev.id} 
                event={ev} 
                isActive={index === activeIndex} 
                onClick={() => {
                  setActiveIndex(index);
                  const el = scrollContainerRef.current?.children[index] as HTMLElement;
                  el?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }}
              />
            ))}
            {/* Padding element for right side scroll */}
            <div className="w-2 flex-shrink-0" />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pb-6 opacity-60">
           <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
             <span>Made with</span>
             <Heart size={10} className="fill-rose-400 text-rose-400" />
             <span>for Safiyya</span>
           </div>
        </footer>

      </main>

      {/* Decorative floating audio player mock */}
      {isPlaying && (
         <div className="fixed bottom-6 right-6 z-50">
            <div className="glass-card p-3 rounded-full animate-bounce">
              <Music className="text-rose-500" size={20} />
            </div>
         </div>
      )}
    </div>
  );
};

export default App;