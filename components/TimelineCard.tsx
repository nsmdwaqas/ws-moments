import React from 'react';
import { TimelineEvent } from '../types';
import { getNextOccurrence } from '../services/timeService';
import { Calendar, Clock, Heart } from 'lucide-react';

interface TimelineCardProps {
  event: TimelineEvent;
  isActive: boolean;
  onClick: () => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ event, isActive, onClick }) => {
  const nextDate = getNextOccurrence(event, new Date());
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative flex-shrink-0 w-[260px] sm:w-[300px] p-6 rounded-[32px] 
        transition-all duration-500 ease-out cursor-pointer snap-center
        ${isActive 
          ? 'glass-card scale-100 opacity-100 z-10 shadow-xl border-white/80' 
          : 'glass-panel scale-95 opacity-60 z-0 grayscale-[0.3] hover:opacity-80'}
      `}
    >
      {/* Icon Bubble */}
      <div className={`
        w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm
        transition-colors duration-300
        ${isActive ? 'bg-rose-100 text-rose-500' : 'bg-gray-100 text-gray-400'}
      `}>
        {event.icon}
      </div>

      <div className="space-y-1">
        <h3 className={`font-serif text-xl font-medium transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 font-medium tracking-wide">
           {nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center justify-between text-xs text-gray-500 font-medium uppercase tracking-wider">
        <div className="flex items-center gap-1">
           <Calendar size={12} />
           <span>Annual</span>
        </div>
        {event.hour !== undefined && (
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{String(event.hour).padStart(2,'0')}:{String(event.minute).padStart(2,'0')}</span>
          </div>
        )}
      </div>

      {isActive && (
        <div className="absolute top-4 right-4">
          <Heart className="text-rose-400 fill-rose-400 animate-pulse-slow" size={18} />
        </div>
      )}
    </div>
  );
};