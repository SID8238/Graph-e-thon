import React from 'react';
import './GPSMap.css';

export default function GPSMap({ lat, lng, heading = 0, speed = 0 }) {
  const mapUrl = `https://maps.wikimedia.org/osm-intl/14/2813/6513.png`; // Dummy generic map tile
  
  return (
    <div className="w-full h-full relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
       <div className="absolute top-4 left-4 z-20 flex gap-2">
         <div className="bg-black/60 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg">
           <div className="text-[9px] text-slate-400 font-bold tracking-widest mb-0.5">LATITUDE</div>
           <div className="text-sm font-mono text-cyan-400">{lat?.toFixed(5)}°</div>
         </div>
         <div className="bg-black/60 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg">
           <div className="text-[9px] text-slate-400 font-bold tracking-widest mb-0.5">LONGITUDE</div>
           <div className="text-sm font-mono text-cyan-400">{lng?.toFixed(5)}°</div>
         </div>
       </div>

       <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg text-right">
          <div className="text-[9px] text-slate-400 font-bold tracking-widest mb-0.5">VELOCITY</div>
          <div className="text-sm font-mono text-white">{speed?.toFixed(1)} <span className="text-[10px] text-slate-400">m/s</span></div>
       </div>

       {/* Map View */}
       <div className="absolute inset-0 mix-blend-luminosity opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${mapUrl})`, filter: 'invert(1) hue-rotate(180deg)' }} />
       
       {/* Map Grid */}
       <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

       {/* Drone Radar Ping */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24">
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-50" />
          <div className="absolute inset-4 rounded-full border border-cyan-400/50" />
          {/* Drone Blip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] flex items-center justify-center" style={{ transform: `translate(-50%, -50%) rotate(${heading}deg)` }}>
             <div className="w-1 h-2 bg-white rounded-sm mb-2" />
          </div>
       </div>
    </div>
  );
}