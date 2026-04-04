import React from 'react';

export function ThreatLevel({ level }) {
  // 0: LOW, 1: ELEVATED, 2: HIGH
  const isHigh = level === 2;
  const isElev = level === 1;
  const text = isHigh ? "CRITICAL" : isElev ? "ELEVATED" : "SECURE";
  const color = isHigh ? "text-orange-500" : isElev ? "text-amber-400" : "text-cyan-400";
  const bg = isHigh ? "bg-orange-500" : isElev ? "bg-amber-400" : "bg-cyan-400";
  const shadow = isHigh ? "shadow-[0_0_30px_#f97316]" : isElev ? "shadow-[0_0_20px_#fbbf24]" : "shadow-[0_0_20px_#22d3ee]";

  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl h-full flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="text-xs font-semibold tracking-widest text-slate-400 mb-6 uppercase">System Threat Level</div>
      <div className="flex-1 flex flex-col justify-center items-center text-center pb-4">
        <div className={`relative flex items-center justify-center w-32 h-32 rounded-full mb-6 ${isHigh ? 'animate-pulse' : ''}`}>
           <div className={`absolute inset-0 rounded-full border-4 ${isHigh ? 'border-orange-500/20' : isElev ? 'border-amber-400/20' : 'border-cyan-400/20'} animate-ping opacity-20`} />
           <div className={`w-28 h-28 rounded-full flex items-center justify-center ${shadow} border border-white/20`} style={{ background: `radial-gradient(circle, ${isHigh ? '#c2410cf0' : isElev ? '#d97706f0' : '#0891b2f0'}, transparent)`}}>
              <div className={`text-3xl font-black ${isHigh ? 'text-white' : 'text-slate-50'}`}>{isHigh ? '!!!' : isElev ? '!' : 'OK'}</div>
           </div>
        </div>
        <div className={`text-2xl font-black tracking-widest ${color}`}>{text}</div>
        <div className="text-xs text-slate-400 mt-2 font-medium tracking-wide">
          {isHigh ? "IMMEDIATE ACTION REQ" : isElev ? "MONITORING ACTIVITY" : "ALL SYSTEMS NOMINAL"}
        </div>
      </div>
    </div>
  );
}
