import React from 'react';
import { motion } from 'framer-motion';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Top Left Blob - Soft Pink */}
      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"
      />
      
      {/* Bottom Right Blob - Peach/Warm */}
      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-50"
      />

      {/* Center Animated Accent - Stronger Pink */}
      <motion.div 
        animate={{ 
          y: [0, -60, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-[60px] opacity-30"
      />

      {/* Noise Texture Overlay for grain effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
};