import React from 'react';
import { TimeParts } from '../types';
import { pad2 } from '../services/timeService';

interface CountdownGridProps {
  parts: TimeParts;
}

const TimeTile: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl glass-panel shadow-sm border border-white/50 min-w-[65px] flex-1">
    <span className="text-2xl sm:text-3xl font-display font-semibold text-gray-800 tracking-tight">
      {pad2(value)}
    </span>
    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-medium mt-1">
      {label}
    </span>
  </div>
);

export const CountdownGrid: React.FC<CountdownGridProps> = ({ parts }) => {
  return (
    <div className="flex gap-2 w-full max-w-md mx-auto mt-6 px-1">
      <TimeTile value={parts.months} label="Mos" />
      <TimeTile value={parts.days} label="Days" />
      <TimeTile value={parts.hours} label="Hrs" />
      <TimeTile value={parts.minutes} label="Min" />
      <TimeTile value={parts.seconds} label="Sec" />
    </div>
  );
};