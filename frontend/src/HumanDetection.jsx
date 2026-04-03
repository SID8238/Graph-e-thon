import React, { useEffect, useState } from 'react';
import { Scan, User } from 'lucide-react';

export default function HumanDetection({ detected }) {
  const [scanPulse, setScanPulse] = useState(false);

  useEffect(() => {
    const pulse = setInterval(() => setScanPulse((p) => !p), 1500);
    return () => clearInterval(pulse);
  }, []);

  const color = detected ? '#ef4444' : '#22c55e'; // red vs green
  const bg = detected ? '#450a0a' : '#052e16';

  return (
    <div className="relative flex flex-col items-center p-4 rounded-lg border w-full h-full overflow-hidden"
      style={{ borderColor: `${color}44`, background: `${bg}88` }}>
      
      {/* Background sweep animation layer if wanted */}
      <div className={`absolute inset-0 opacity-10 transition-colors duration-500`} style={{ background: `linear-gradient(180deg, transparent, ${color}, transparent)` }} />

      <div className="z-10 flex flex-col items-center justify-center w-full h-full gap-4 pt-2">
        <div className="text-xs font-mono tracking-widest self-start w-full text-left" style={{ color: `${color}88` }}>
          HUMAN DETECTION
        </div>

        <div className="relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 transition-all duration-500"
          style={{
            borderColor: color,
            boxShadow: `0 0 24px ${color}44`,
            background: `${color}11`
          }}>
          {/* Scanner animation layer */}
          <div className={`absolute inset-0 rounded-full border-2 border-dashed transition-transform duration-[1500ms] ${scanPulse ? 'scale-125 opacity-0' : 'scale-50 opacity-100'}`} style={{ borderColor: color }} />
          
          {detected ? <User size={36} color={color} className="animate-pulse drop-shadow-md" /> : <Scan size={36} color={color} className="drop-shadow-md" />}
        </div>

        <div className="mt-2 text-center z-10">
          <div className="font-mono text-xl md:text-2xl tracking-widest transition-colors duration-500" style={{ color, textShadow: `0 0 12px ${color}` }}>
            {detected ? 'DETECTED' : 'CLEAR'}
          </div>
          <div className="font-mono text-[10px] mt-1 opacity-70 transition-colors duration-500" style={{ color }}>
            {detected ? '⚠ SYSTEM ACQUIRED TARGET' : 'SCANNING PERIMETER...'}
          </div>
        </div>
      </div>
    </div>
  );
}
