import React, { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { CountdownGrid } from './components/CountdownGrid';
import { TimelineCard } from './components/TimelineCard';
import { EVENTS, BASE_START_DATE } from './constants';
import { getUpcomingEvent, calculateTimeParts, countOccurrences, getSuffix } from './services/timeService';
import { TimelineEvent, TimeParts } from './types';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// Infinite Carousel Logic Helpers
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [upcoming, setUpcoming] = useState<{ upcomingEvent: TimelineEvent | null, upcomingDate: Date | null }>({ upcomingEvent: null, upcomingDate: null });
  const [timeParts, setTimeParts] = useState<TimeParts>({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Carousel State
  const [page, setPage] = useState(0);

  // Initialize and Timer
  useEffect(() => {
    // Find initial upcoming event to set the carousel index
    const initialNow = new Date();
    const next = getUpcomingEvent(EVENTS, initialNow);
    setUpcoming(next);
    if(next.upcomingDate) setTimeParts(calculateTimeParts(next.upcomingDate, initialNow));

    if (next.upcomingEvent) {
      const idx = EVENTS.findIndex(e => e.id === next.upcomingEvent?.id);
      if (idx !== -1) setPage(idx);
    }

    const timer = setInterval(() => {
      const currentNow = new Date();
      setNow(currentNow);
      
      const nextUpdate = getUpcomingEvent(EVENTS, currentNow);
      setUpcoming(nextUpdate);
      
      if (nextUpdate.upcomingDate) {
        setTimeParts(calculateTimeParts(nextUpdate.upcomingDate, currentNow));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const occurrenceCount = upcoming.upcomingEvent 
    ? countOccurrences(upcoming.upcomingEvent, BASE_START_DATE, now) + 1
    : 0;

  // Carousel Render Logic
  const eventIndex = wrap(0, EVENTS.length, page);
  
  // Drag handling
  const x = useMotionValue(0);
  const inputRange = [-200, 0, 200];
  const opacityOutputRange = [0.5, 1, 0.5];
  const scaleOutputRange = [0.8, 1, 0.8];
  
  const opacity = useTransform(x, inputRange, opacityOutputRange);
  const scale = useTransform(x, inputRange, scaleOutputRange);

  const paginate = (newDirection: number) => {
    setPage(page + newDirection);
  };

  return (
    <div className="relative min-h-screen text-slate-800 font-sans selection:bg-rose-200 overflow-x-hidden">
      <Background />

      <main className="relative z-10 w-full flex flex-col min-h-screen pb-6">
        
        {/* Header */}
        <header className="pt-8 px-6 flex justify-center items-center max-w-2xl mx-auto w-full text-center">
           <div className="flex flex-col">
             <span className="font-serif italic text-2xl text-rose-500">Waqas & Safiyya</span>
             <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">Forever since 2025</span>
           </div>
        </header>

        {/* Hero Section */}
        <section className="mt-8 px-6 text-center max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/50 mb-6 backdrop-blur-md shadow-sm">
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

            <div className="mt-8 text-sm text-slate-500 bg-white/30 inline-block px-4 py-2 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm">
               This will be the <span className="font-bold text-rose-500">{occurrenceCount}{getSuffix(occurrenceCount)}</span> time since our journey began.
            </div>
          </motion.div>
        </section>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Infinite Carousel Section */}
        <section className="mt-10 mb-8 w-full overflow-hidden">
          <div className="px-6 mb-6 flex items-end justify-between max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-serif text-slate-800">Our Memories</h2>
              <p className="text-xs uppercase tracking-widest text-slate-500 mt-1">Swipe for infinity</p>
            </div>
          </div>

          <div className="relative h-[500px] w-full flex items-center justify-center overflow-visible">
             {/* Center Card (Active) */}
             <motion.div
                className="absolute z-20 cursor-grab active:cursor-grabbing touch-pan-y"
                style={{ x, opacity, scale }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -100 || offset.x < -100) {
                    paginate(1);
                  } else if (swipe > 100 || offset.x > 100) {
                    paginate(-1);
                  }
                }}
             >
                <TimelineCard event={EVENTS[eventIndex]} isActive={true} />
             </motion.div>

             {/* Background Cards (Previews) */}
             <div className="absolute z-10 opacity-40 scale-90 -translate-x-[340px] hidden sm:block pointer-events-none transition-all duration-500">
               <TimelineCard event={EVENTS[wrap(0, EVENTS.length, page - 1)]} isActive={false} />
             </div>
             <div className="absolute z-10 opacity-40 scale-90 translate-x-[340px] hidden sm:block pointer-events-none transition-all duration-500">
               <TimelineCard event={EVENTS[wrap(0, EVENTS.length, page + 1)]} isActive={false} />
             </div>
             
             {/* Mobile Hint Arrows */}
             <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none sm:hidden z-0 opacity-20">
               <ChevronLeft size={32} />
               <ChevronRight size={32} />
             </div>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-2">
            {EVENTS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === eventIndex ? 'w-6 bg-rose-400' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
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
    </div>
  );
};

export default App;