import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { ThreatLevel } from './ThreatLevel';
import HumanDetection from './HumanDetection';
import ThreatGraph from './ThreatGraph';
import GPSMap from './GPSMap';
import { ShieldAlert, Activity, Wifi, BatteryCharging, Cpu, HardDrive, Thermometer, Compass, Navigation, MapPin, Radar, Wind } from 'lucide-react';

const ROUTES = [
  { id: 'A', label: 'ROUTE ALPHA', badge: 'CLEAR', desc: 'BASE ➔ CP-1 ➔ OBJ\nClear terrain', status: 'safe', color: '#38bdf8', threat: 12 },
  { id: 'B', label: 'ROUTE BRAVO', badge: 'CAUTION', desc: 'BASE ➔ CP-2 ➔ OBJ\nHostile nearby', status: 'warn', color: '#fbbf24', threat: 34 },
];

export default function Dashboard({ sensorData, threatHistory, alerts, connected }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const sd = sensorData || {};
  const human = sd.humanDetected || false;
  const temp = sd.temperature || 40.5;
  const humidity = sd.humidity || 50;
  const pitch = sd.pitch || 0.0;
  const roll = sd.roll || -21.8;
  const magHeading = sd.magneticHeading || 108;
  const magnetic = sd.magnetic !== undefined ? sd.magnetic : 1; 
  const frontDist = sd.frontDist || 150;
  const sideDist = sd.sideDist || 150;
  const obstacle = sd.obstacle || "CLEAR";
  const move = sd.move || "FORWARD";
  const magDec = sd.magDeclination || 2.3;
  const lat = sd.latitude || 34.09670;
  const lng = sd.longitude || -118.19156;
  const speed = sd.speed || 3.8;
  const heading = sd.heading || 52;
  const threatScore = sd.threatScore || 86;
  const secLevel = sd.security_level || "SAFE";
  const bHash = sd.blockchain_hash ? sd.blockchain_hash.substring(0, 16) + '...' : "SYS_WAIT";

  const glassPanel = "p-6 rounded-xl border border-white/5 bg-[#0b1221] shadow-2xl flex flex-col relative overflow-hidden group";

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 p-4 lg:p-6 font-sans z-10 flex flex-col gap-6 overflow-x-hidden">
      
      {/* Subtle Background Glows */}
      <div className="fixed top-0 left-[20%] w-[40%] h-[40%] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-[10%] w-[30%] h-[50%] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 gap-4 z-10">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0b1221] rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-center">
               <ShieldAlert size={28} className="text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-[0.2em] text-cyan-400 drop-shadow-lg">SPECTR</h1>
              <span className="text-[10px] tracking-[0.3em] text-slate-500 uppercase font-black">TACTICAL OPS</span>
            </div>
          </div>
          
          {threatScore > 65 && (
            <div className="flex lg:hidden border border-red-500/50 bg-red-500/20 text-red-500 px-3 py-1.5 rounded animate-pulse text-[10px] items-center gap-1">
              <Activity size={12} strokeWidth={3} /> ALERT
            </div>
          )}
        </div>
        
        {threatScore > 65 && (
          <div className="hidden lg:flex border border-red-500/50 bg-red-500/20 text-red-500 px-6 py-2 rounded-lg animate-pulse tracking-widest text-xs font-black items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Activity size={16} strokeWidth={3} /> CRITICAL INCIDENT DETECTED
          </div>
        )}

        <div className="flex flex-col items-end gap-2 text-right">
           <div className="flex items-center justify-end gap-5 text-xs font-medium text-slate-400">
             <div className="hidden sm:flex items-center gap-2 border border-white/5 rounded px-3 py-1 bg-[#0b1221] shadow-inner">
                <span className="opacity-60 text-[9px] tracking-widest font-black uppercase">CRYPTO:</span>
                <span className={`tracking-widest ${secLevel === "GHOST" ? "text-purple-400 font-bold" : secLevel === "ALERT" ? "text-amber-500 font-bold" : "text-cyan-500 font-bold"}`}>
                   {secLevel}
                </span>
             </div>
             <div className="flex flex-col pl-5 border-l border-white/10">
               <span className="text-white font-black text-base tracking-widest">{time.toLocaleTimeString()}</span>
               <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">{time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
             </div>
           </div>
           
           <div className="text-[9px] font-mono tracking-widest text-slate-500 bg-[#0b1221] px-2 py-1 rounded border border-white/5 opacity-80">
              HASH: <span className="text-cyan-500 font-bold">{bHash}</span>
           </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="flex flex-col gap-6 flex-1 z-10 relative">

        {/* ======================= ROW 1: COMPACT TACTICAL METRICS ======================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Climate */}
          <div className={glassPanel}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-slate-500 mb-4 z-10">
              <Thermometer size={14} className="text-amber-500" /> CLIMATE SENSORS
            </div>
            <div className="flex items-center justify-between z-10">
              <div>
                 <div className="text-[9px] text-slate-600 font-bold tracking-widest mb-0.5">TEMP</div>
                 <div className="text-4xl font-black text-amber-500 drop-shadow-md">{temp}°</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="text-right">
                 <div className="text-[9px] text-slate-600 font-bold tracking-widest mb-0.5">HUMIDITY</div>
                 <div className="text-2xl font-black text-cyan-400 drop-shadow-md">{humidity}%</div>
              </div>
            </div>
            <div className="w-full h-1 rounded-full bg-slate-900 overflow-hidden mt-4">
               <div className="h-full bg-amber-500" style={{ width: `${(temp/80)*100}%` }} />
            </div>
          </div>

          {/* Kinematics */}
          <div className={glassPanel}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-slate-500 mb-4 z-10">
              <Activity size={14} className="text-blue-500" /> KINEMATICS
            </div>
            <div className="flex items-center justify-between z-10 px-2 lg:px-4">
              <div className="text-center">
                 <div className="text-[9px] text-slate-600 font-bold tracking-widest mb-0.5">PITCH</div>
                 <div className="text-3xl font-black text-blue-400">{pitch > 0 ? '+' : ''}{pitch.toFixed(1)}°</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="text-center">
                 <div className="text-[9px] text-slate-600 font-bold tracking-widest mb-0.5">ROLL</div>
                 <div className="text-3xl font-black text-cyan-400">{roll > 0 ? '+' : ''}{roll.toFixed(1)}°</div>
              </div>
            </div>
          </div>

          {/* Radar */}
          <div className={glassPanel}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-slate-500 mb-4 z-10">
              <Radar size={14} className="text-purple-500" /> AVOIDANCE RADAR
            </div>
            <div className="flex items-center justify-between z-10 px-2">
              <div className="text-center">
                 <div className="text-[9px] text-slate-600 font-bold tracking-widest mb-0.5">FRONT</div>
                 <div className="text-2xl font-black text-purple-400">{frontDist} <span className="text-[10px] text-slate-500">cm</span></div>
              </div>
              <div className="text-center">
                 <div className="text-[9px] text-slate-600 font-bold tracking-widest mb-0.5">SIDE</div>
                 <div className="text-2xl font-black text-purple-500">{sideDist} <span className="text-[10px] text-slate-500">cm</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[8px] text-slate-600 font-bold tracking-widest">OVERRIDE</span>
              <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded ${obstacle !== 'CLEAR' ? 'text-amber-500 bg-amber-500/10' : 'text-cyan-500 bg-cyan-500/10'}`}>
                {obstacle}
              </span>
            </div>
          </div>

          {/* Com / Nav */}
          <div className={glassPanel}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-slate-500 mb-4 z-10">
              <Compass size={14} className="text-emerald-500" /> COM / NAV
            </div>
            <div className="flex items-center justify-between z-10 mb-2">
              <div className="flex items-baseline gap-2">
                 <div className="text-3xl font-black text-emerald-400">{magHeading}°</div>
                 <span className="text-xs font-bold text-emerald-700">E</span>
              </div>
              <div>
                {magnetic === 0 ? (
                  <div className="text-[9px] text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-500/20 font-black tracking-widest animate-pulse">METAL</div>
                ) : (
                  <div className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-black tracking-widest">NATURAL</div>
                )}
              </div>
            </div>
            
            {/* Tiny quick routes list */}
            <div className="flex flex-col gap-1 mt-auto">
               {ROUTES.map(r => (
                  <div key={r.id} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded border border-white/5">
                    <span className="text-[8px] tracking-widest font-black text-slate-400">{r.label}</span>
                    <span className="text-[7px] tracking-widest font-black" style={{color: r.color}}>{r.badge}</span>
                  </div>
               ))}
            </div>
          </div>

        </div>

        {/* ======================= ROW 2: CRITICAL VIEW & AI ALERTS ======================= */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 align-stretch">
            <div className="xl:col-span-2 h-[350px] md:h-[450px] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#060b14]">
                <CamView humanDetected={human} />
            </div>
            <div className="xl:col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                <ThreatLevel level={threatScore > 65 ? 2 : threatScore > 35 ? 1 : 0} />
                <HumanDetection detected={human} />
            </div>
        </div>

        {/* ======================= ROW 3: ANALYTICS & LOGGING ======================= */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto">
             <div className={`xl:col-span-2 ${glassPanel} h-[300px]`}>
                  <ThreatGraph history={threatHistory} />
             </div>
             <div className={`xl:col-span-1 ${glassPanel} p-0 h-[300px]`}>
                 <div className="bg-[#0b1221] border-b border-white/10 p-4">
                    <div className="text-[10px] font-black tracking-[0.3em] text-slate-300 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> SYSTEM COMMAND LOG
                    </div>
                 </div>
                 <div className="flex flex-col gap-1 overflow-y-auto font-mono text-[10px] p-2 flex-1 bg-[#060b14]">
                    {(alerts && alerts.length > 0) ? alerts.map((a, i) => (
                      <div key={i} className="flex gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors items-center border border-transparent hover:border-white/5">
                        <span className="text-slate-600 whitespace-nowrap">{new Date(a.timestamp).toLocaleTimeString()}</span>
                        <span className={`${a.severity==='CRITICAL' ? 'text-amber-500 font-bold bg-amber-500/10 px-1 rounded' : 'text-blue-500 font-bold'} tracking-widest`}>{a.severity}</span>
                        <span className="text-slate-300 truncate">{a.message}</span>
                      </div>
                    )) : (
                      <>
                        <div className="flex gap-3 px-3 py-2 text-slate-500"><span className="text-slate-600">10:13:00</span><span className="text-cyan-500 font-bold">INFO</span><span className="text-slate-400">Routing engine stabilized</span></div>
                        <div className="flex gap-3 px-3 py-2 text-amber-500 bg-amber-500/5 rounded"><span className="text-slate-500">10:12:46</span><span className="text-amber-500 font-bold">CRIT</span><span className="text-amber-300">Obstacle override active</span></div>
                        <div className="flex gap-3 px-3 py-2 text-slate-500"><span className="text-slate-600">10:12:00</span><span className="text-cyan-500 font-bold">INFO</span><span className="text-slate-400">Crypto stream synching...</span></div>
                      </>
                    )}
                 </div>
             </div>
        </div>

        {/* ======================= ROW 4: MAP & NAVIGATION ======================= */}
        <div className="h-[400px] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#060b14]">
             <GPSMap lat={lat} lng={lng} heading={heading} speed={speed} />
        </div>

      </div>
    </div>
  );
}

function CamView({ humanDetected }) {
  return (
    <div className="relative w-full h-full bg-slate-900 flex items-center justify-center p-0">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
        <span className="text-[10px] text-white tracking-widest font-bold">CAM-01 • REC</span>
      </div>
      <div className="absolute top-4 right-4 z-20 text-[10px] text-slate-300 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 tracking-widest font-mono">
        ZOOM: 2.4x | FOV: 110°
      </div>

      <div className="absolute z-10 pointer-events-none flex items-center justify-center">
         <div className="w-[60px] h-[60px] border border-cyan-400/30 rounded-full flex items-center justify-center">
            <div className="w-[10px] h-[10px] bg-cyan-400/50 rounded-full shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute top-[-10px] w-[1px] h-[20px] bg-cyan-400/50" />
            <div className="absolute bottom-[-10px] w-[1px] h-[20px] bg-cyan-400/50" />
            <div className="absolute left-[-10px] h-[1px] w-[20px] bg-cyan-400/50" />
            <div className="absolute right-[-10px] h-[1px] w-[20px] bg-cyan-400/50" />
         </div>
      </div>

      <div className="relative w-full h-full bg-[#030712] overflow-hidden mix-blend-luminosity opacity-80 transition-all duration-500">
        <img 
            src="http://localhost:5001/video_feed" 
            alt="Live Feed Offline" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.background = '#020617'; }}
        />
        {humanDetected && (
          <div className="absolute inset-0 border-4 border-red-500/50 bg-red-500/10 mix-blend-overlay animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
}