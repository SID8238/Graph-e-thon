import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

export default function HumanDetection({ detected }) {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl h-full flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
      
      <div className="text-xs font-semibold tracking-widest text-slate-400 mb-6 z-10">AI VISION</div>
      
      <div className="flex-1 flex flex-col justify-center items-center z-10">
        <div className={`w-24 h-24 rounded-md flex items-center justify-center mb-6 transition-all duration-500 ease-in-out border ${detected ? 'bg-orange-500/20 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.3)]' : 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]'}`}>
          {detected ? <User size={48} className="text-orange-400 animate-pulse" /> : <ShieldCheck size={48} className="text-cyan-400" />}
        </div>
        
        <div className={`text-xl font-bold tracking-widest ${detected ? 'text-orange-400' : 'text-cyan-400'}`}>
          {detected ? 'HUMAN DETECTED' : 'AREA CLEAR'}
        </div>
      </div>

      {/* Decorative backdrop */}
      {detected && (
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
