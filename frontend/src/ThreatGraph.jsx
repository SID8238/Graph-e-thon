import React from 'react';
import { Activity } from 'lucide-react';

export default function ThreatGraph({ history }) {
  const data = history || [];

  return (
    <div className="relative flex flex-col p-4 rounded-lg border w-full h-full overflow-hidden"
      style={{ borderColor: '#22c55e44', background: '#052e1688' }}>
      
      <div className="flex items-center gap-2 mb-2 z-10">
        <Activity size={16} color="#22c55e" className="opacity-80" />
        <div className="text-xs font-mono text-green-400/80 tracking-widest">THREAT HISTORY</div>
      </div>

      <div className="relative flex items-end justify-between flex-1 gap-[2px] sm:gap-1 w-full mt-2 h-full z-10">
        {data.length === 0 ? (
          <div className="w-full text-center text-xs font-mono text-green-400/40 my-auto animate-pulse">AWAITING SENSOR DATA...</div>
        ) : (
          data.map((point, index) => {
            const val = point.value || 0;
            const color = val > 65 ? '#ef4444' : val > 35 ? '#f59e0b' : '#22c55e';
            return (
              <div
                key={index}
                className="flex-1 rounded-t border-t transition-all duration-500 ease-out"
                style={{
                  height: `${Math.max(2, val)}%`,
                  background: `linear-gradient(0deg, ${color}22, ${color}88)`,
                  borderColor: color,
                  boxShadow: `0 -4px 12px ${color}44`
                }}
              />
            );
          })
        )}
      </div>

      {/* Grid lines overlay layout */}
      <div className="absolute inset-x-4 bottom-4 top-14 pointer-events-none border-b border-l border-green-500/20 z-0">
        <div className="absolute w-full border-t border-green-500/10 top-1/3" />
        <div className="absolute w-full border-t border-green-500/10 top-2/3" />
        <div className="absolute h-full border-l border-green-500/10 left-1/4" />
        <div className="absolute h-full border-l border-green-500/10 left-2/4" />
        <div className="absolute h-full border-l border-green-500/10 left-3/4" />
      </div>
    </div>
  );
}
