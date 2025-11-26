import React from 'react';
import { TimelineEvent } from '../types';
import { getNextOccurrence, getLastOccurrence, getDaysDifference, countOccurrences, getSuffix } from '../services/timeService';
import { Calendar, Clock, History, RotateCw, Hourglass } from 'lucide-react';
import { BASE_START_DATE } from '../constants';

interface TimelineCardProps {
  event: TimelineEvent;
  isActive: boolean;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ event, isActive }) => {
  const now = new Date();
  const nextDate = getNextOccurrence(event, now);
  const lastDate = getLastOccurrence(event, now);
  
  const daysUntil = getDaysDifference(now, nextDate);
  const daysPassed = getDaysDifference(lastDate, now);
  
  // Occurrences since base date (Aug 1, 2025)
  // If the event hasn't happened relative to base yet, it might be 0.
  // We want to show how many times it *has* happened or *will* happen.
  // The logic "appeared once" usually means "since the start of relationship/base date".
  const occurrences = countOccurrences(event, BASE_START_DATE, now);
  
  // If occurrences is 0, it means it hasn't happened since Aug 2025 yet.
  // But maybe we want to show the count including the upcoming one? 
  // Let's stick to "times occurred" as past tense.
  
  return (
    <div 
      className={`
        relative w-[85vw] max-w-[360px] h-[480px] rounded-[40px] p-6 flex flex-col items-center text-center
        transition-all duration-500 ease-out border
        ${isActive 
          ? 'glass-card border-white/60 shadow-[0_20px_50px_rgba(8,112,184,0.12)]' 
          : 'bg-white/30 border-white/20 blur-[1px] opacity-80 scale-95'}
      `}
    >
      {/* Icon Bubble */}
      <div className={`
        w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-lg shadow-rose-500/10
        transition-all duration-500
        ${isActive ? 'bg-gradient-to-br from-white to-rose-50 scale-100' : 'bg-white/50 scale-90 grayscale'}
      `}>
        {event.icon}
      </div>

      <div className="space-y-2 mb-8">
        <h3 className="font-serif text-3xl text-slate-900 leading-tight">
          {event.title}
        </h3>
        <p className="text-slate-500 font-medium">
           {nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-2 gap-3 mt-auto">
        
        {/* Days To Go */}
        <div className="col-span-2 bg-rose-50/50 rounded-2xl p-4 border border-rose-100/50">
           <div className="flex items-center justify-center gap-2 text-rose-400 mb-1">
             <Hourglass size={14} />
             <span className="text-[10px] uppercase tracking-widest font-bold">Countdown</span>
           </div>
           <div className="text-2xl font-bold text-slate-800">
             {daysUntil} <span className="text-sm font-medium text-slate-500">Days to go</span>
           </div>
        </div>

        {/* Days Passed */}
        <div className="bg-white/40 rounded-2xl p-4 border border-white/50 flex flex-col justify-between">
           <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-2">
             <History size={14} />
             <span className="text-[10px] uppercase tracking-wider font-semibold">Passed</span>
           </div>
           <div className="text-lg font-bold text-slate-700 leading-none">
             {daysPassed}
             <span className="block text-[10px] font-medium text-slate-400 mt-1">days ago</span>
           </div>
        </div>

        {/* Occurrence Count */}
        <div className="bg-white/40 rounded-2xl p-4 border border-white/50 flex flex-col justify-between">
           <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-2">
             <RotateCw size={14} />
             <span className="text-[10px] uppercase tracking-wider font-semibold">Occurred</span>
           </div>
           <div className="text-lg font-bold text-slate-700 leading-none">
             {occurrences}<span className="text-xs align-top">{getSuffix(occurrences)}</span>
             <span className="block text-[10px] font-medium text-slate-400 mt-1">time</span>
           </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
         <Clock size={12} />
         <span>{String(event.hour).padStart(2,'0')}:{String(event.minute).padStart(2,'0')}</span>
      </div>
    </div>
  );
};