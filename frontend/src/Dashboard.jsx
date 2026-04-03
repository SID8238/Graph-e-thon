import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { ThreatLevel } from './ThreatLevel';
import HumanDetection from './HumanDetection';
import ThreatGraph from './ThreatGraph';
import GPSMap from './GPSMap';
import { ShieldAlert, Activity, Wifi, BatteryCharging, Cpu, HardDrive, Thermometer, Compass, Navigation, MapPin, Radar } from 'lucide-react';

const ROUTES = [
  { id: 'A', label: 'ROUTE ALPHA', badge: 'CLEAR', desc: 'BASE ➔ CP-1 ➔ OBJ\nClear terrain, minimal exposure', status: 'safe', color: '#22c55e', threat: 12 },
  { id: 'B', label: 'ROUTE BRAVO', badge: 'CAUTION', desc: 'BASE ➔ CP-2 ➔ OBJ\nUrban cover, hostile nearby', status: 'warn', color: '#f59e0b', threat: 34 },
  { id: 'C', label: 'ROUTE CHARLIE', badge: 'DANGER', desc: 'BASE ➔ HST ZONE ➔ OBJ\n⚠ 2 hostiles detected on path', status: 'danger', color: '#ef4444', threat: 71 },
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

  return (
    <div className="relative min-h-screen bg-[#020503] text-green-500 p-4 font-mono z-10 flex flex-col gap-4 overflow-x-hidden">
      
      {/* Figma Replica Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-green-500/20 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert size={28} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-[0.2em] text-green-400">SENTINEL TACTICAL SYSTEM</h1>
            <span className="text-[10px] tracking-[0.1em] text-green-500/60 uppercase">STS-MKIII • UNIT 7 • FIELD OPS</span>
          </div>
        </div>
        
        {/* Center Alert if High */}
        {threatScore > 65 && (
          <div className="hidden lg:flex border border-red-500/40 bg-red-900/20 text-red-500 px-6 py-1.5 animate-pulse tracking-[0.1em] text-[10px] items-center gap-2 mb-2">
            <Activity size={12} strokeWidth={3} /> ACTIVE ALERT: HIGH THREAT DETECTED IN SECTOR 2
          </div>
        )}

        <div className="flex items-center gap-4 text-[10px] tracking-widest text-green-500/80 mb-2">
          <div className="hidden sm:flex items-center gap-[4px]"><BatteryCharging size={12} /> 97%</div>
          <div className="hidden sm:flex items-center gap-[4px]"><Wifi size={12} /> SECURE</div>
          <div className="hidden md:flex items-center gap-[4px]"><Cpu size={12} /> CPU 24%</div>
          <div className="hidden md:flex items-center gap-[4px]"><HardDrive size={12} /> COM-7</div>
          <div className="flex flex-col text-right pl-4 border-l border-green-500/30">
            <span className="text-green-400 font-bold text-sm tracking-widest">{time.toLocaleTimeString()}</span>
            <span className="opacity-60 text-[8px] uppercase">{time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Main Grid strictly representing Figma 4-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        
        {/* ROW 1 */}
        <div className="col-span-1 lg:col-span-2 min-h-[250px] lg:min-h-auto flex">
          <CamView humanDetected={human} />
        </div>
        <div className="col-span-1 lg:col-span-1 h-full">
          <ThreatLevel level={threatScore > 65 ? 2 : threatScore > 35 ? 1 : 0} />
        </div>
        <div className="col-span-1 lg:col-span-1 h-full">
          <HumanDetection detected={human} />
        </div>

        {/* ROWS 2-4 Layout Columns */}

        {/* LEFT COLUMN: Stack of Environment & Routing Data */}
        <div className="col-span-1 flex flex-col gap-4">
          
          {/* Temperature & Humidity */}
          <div className="p-4 rounded-lg border border-green-500/20 bg-[#061008] shadow-[inset_0_0_15px_rgba(0,255,65,0.02)]">
            <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-green-500/60 mb-3">
              <div className="flex items-center gap-2"><Thermometer size={12} className="text-orange-400" /> ENVIRONMENT</div>
              <div>HUM: <span className="text-blue-400 font-bold">{humidity}%</span></div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">{temp}°C</span>
              <span className="text-[10px] text-green-500/50">{(temp * 9/5 + 32).toFixed(1)}°F</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#112015] overflow-hidden">
               <div className="h-full bg-orange-400 shadow-[0_0_8px_#f97316] rounded-full" style={{ width: `${(temp/80)*100}%` }} />
            </div>
            <div className="flex justify-between text-[8px] mt-1.5 text-green-500/40 font-mono">
              <span>20°C</span><span>50°C</span><span>80°C</span>
            </div>
          </div>

          {/* Tilt Sensor */}
          <div className="p-4 rounded-lg border border-green-500/20 bg-[#061008]">
            <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-green-500/60 mb-5">
              <Activity size={12} className="text-blue-400" /> TILT SENSOR
            </div>
            <div className="flex gap-8 mb-4">
              <div>
                <div className="text-[8px] text-green-500/50 mb-1 tracking-widest">PITCH</div>
                <div className="text-lg font-bold text-blue-400 drop-shadow-[0_0_4px_rgba(96,165,250,0.5)]">{pitch > 0 ? '+' : ''}{pitch.toFixed(1)}°</div>
              </div>
              <div>
                <div className="text-[8px] text-green-500/50 mb-1 tracking-widest">ROLL</div>
                <div className="text-lg font-bold text-blue-400 drop-shadow-[0_0_4px_rgba(96,165,250,0.5)]">{roll > 0 ? '+' : ''}{roll.toFixed(1)}°</div>
              </div>
            </div>
            <div className="w-full h-[60px] bg-[#0c1825] rounded border border-blue-500/20 relative overflow-hidden flex items-center justify-center opacity-80 mix-blend-screen">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:100%_20px]" />
               <div className="absolute w-[180%] border-t border-blue-400/60 shadow-[0_0_8px_transparent]" style={{ transform: `translateY(${pitch}px) rotate(${roll}deg)`, boxShadow: '0 0 10px rgba(96,165,250,0.8)' }}>
                  <div className="w-3 h-3 border-2 border-orange-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
            </div>
          </div>

          {/* Proximity / Ultrasonic Radar */}
          <div className="p-4 rounded-lg border border-green-500/20 bg-[#061008]">
            <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-green-500/60 mb-3">
              <Radar size={12} className="text-yellow-400" /> PROXIMITY RADAR
            </div>
            <div className="flex justify-around items-center mb-3">
               <div className="text-center">
                 <div className="text-[8px] text-green-500/50 mb-1 tracking-widest">FRONT DIST</div>
                 <div className="text-xl font-bold text-yellow-400">{frontDist} <span className="text-[10px] opacity-60">cm</span></div>
               </div>
               <div className="text-center">
                 <div className="text-[8px] text-green-500/50 mb-1 tracking-widest">SIDE DIST</div>
                 <div className="text-xl font-bold text-yellow-400">{sideDist} <span className="text-[10px] opacity-60">cm</span></div>
               </div>
            </div>
            <div className="flex items-center justify-between text-[8px] uppercase tracking-widest p-2 rounded bg-black/40 border border-green-500/10">
              <span className="opacity-60">AI AVOIDANCE:</span>
              <span className={obstacle !== "CLEAR" ? "font-bold text-red-400 animate-pulse" : "font-bold text-green-400"}>
                 {obstacle} ➔ {move}
              </span>
            </div>
          </div>

          {/* Magnetic Heading */}
          <div className="p-4 rounded-lg border border-green-500/20 bg-[#061008] flex flex-col justify-between">
             <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-green-500/60 mb-2 uppercase">
               <Compass size={12} className="text-purple-400" /> Magnetic / Heading
             </div>
             <div className="flex justify-between items-end">
               <div>
                  <div className="flex items-baseline gap-2">
                     <div className="text-3xl font-bold text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.5)]">{magHeading}°</div>
                     <span className="text-lg text-purple-400 opacity-60">E</span>
                  </div>
                  <div className="text-[8px] text-green-500/50 mt-1 uppercase">MAG DEC: +{magDec}°</div>
               </div>
               <div className="text-right">
                  {magnetic === 0 ? (
                     <div className="text-[9px] text-red-500 font-bold bg-red-900/20 px-2 py-1 rounded border border-red-500/30 animate-pulse">⚠ METAL DETECTED</div>
                  ) : (
                     <div className="text-[9px] text-green-500/60 font-bold bg-green-900/10 px-2 py-1 rounded border border-green-500/10">NATURAL FLD</div>
                  )}
               </div>
             </div>
          </div>

          {/* Best Routes */}
          <div className="flex flex-col gap-3 p-4 rounded-lg border border-green-500/20 bg-[#061008]">
             <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-green-500/60 uppercase mb-1">
               <Navigation size={12} /> BEST ROUTES
             </div>
             {ROUTES.map((r, i) => (
               <div key={r.id} className="p-3 rounded-md border bg-[#09150c] relative overflow-hidden flex flex-col gap-2 transition-all opacity-60 grayscale" style={{ borderColor: `${r.color}33` }}>
                 <div className="flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                       <span style={{ color: r.color }}><MapPin size={12} fill={`${r.color}33`} /></span>
                       <span className="font-bold text-[10px] tracking-widest text-green-300" style={{ color: r.color }}>{r.label}</span>
                       <span className="text-[7px] px-1.5 rounded uppercase tracking-widest" style={{ background: `${r.color}33`, color: r.color }}>EXT</span>
                    </div>
                 </div>
                 <div className="mt-2 w-full flex items-center justify-between text-[7px] tracking-widest z-10" style={{ color: r.color }}>
                    <span>OVERRIDDEN BY AI NAV</span>
                 </div>
               </div>
             ))}
          </div>

        </div>

        {/* MIDDLE COLUMNS: ThreatGraph and SystemLog */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="h-64 sm:h-80 w-full rounded-lg bg-[#061008] border border-green-500/20 p-4">
             <ThreatGraph history={threatHistory} />
          </div>
          <div className="flex-1 w-full rounded-lg bg-[#061008] border border-green-500/20 p-4 flex flex-col overflow-hidden relative">
             
             <div className="flex justify-between items-center mb-4 z-10 border-b border-green-500/10 pb-2">
                <div className="text-[9px] tracking-[0.2em] text-green-500/60 uppercase">SYSTEM LOG</div>
                <div className="text-[9px] tracking-widest text-green-500/40">{time.toLocaleTimeString()} - LIVE</div>
             </div>
             
             {/* Terminal Text lines */}
             <div className="flex flex-col gap-2 overflow-y-auto font-mono text-[9px] sm:text-[10px] flex-1 z-10 opacity-90">
                {(alerts && alerts.length > 0) ? alerts.map((a, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="opacity-40 min-w-[60px]">{new Date(a.timestamp).toLocaleTimeString()}</span>
                    <span className={`${a.severity==='CRITICAL' ? 'text-red-500' : 'text-blue-400'} min-w-[40px] tracking-widest`}>{a.severity}</span>
                    <span className="text-green-400/80 uppercase">{a.message}</span>
                  </div>
                )) : (
                  <>
                    <div className="flex gap-4 hover:bg-white/5 p-0.5"><span className="opacity-40">10:13:00</span><span className="text-blue-400">INFO</span><span className="text-green-400/80 uppercase">Human detection confidence recalibrated</span></div>
                    <div className="flex gap-4 hover:bg-white/5 p-0.5"><span className="opacity-40">10:12:46</span><span className="text-red-500 shadow-[0_0_4px_#ef4444]">ALERT</span><span className="text-green-400/80 uppercase">Obstacle override - executing move module</span></div>
                    <div className="flex gap-4 hover:bg-white/5 p-0.5"><span className="opacity-40">10:12:00</span><span className="text-blue-400">INFO</span><span className="text-green-400/80 uppercase">Human detection confidence recalibrated</span></div>
                    <div className="flex gap-4 hover:bg-white/5 p-0.5"><span className="opacity-40">10:11:58</span><span className="text-red-500 shadow-[0_0_4px_#ef4444]">ALERT</span><span className="text-green-400/80 uppercase">Threat assessment updated - processing</span></div>
                    <div className="flex gap-4 hover:bg-white/5 p-0.5"><span className="opacity-40">10:10:42</span><span className="text-blue-400">INFO</span><span className="text-green-400/80 uppercase">Route integrity check passed</span></div>
                  </>
                )}
             </div>
             {/* Scanlines layer for terminal */}
             <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(34,197,94,0.5)_2px,rgba(34,197,94,0.5)_4px)]" />
          </div>
        </div>

        {/* RIGHT COLUMN: GPSMap and GPS Stats */}
        <div className="col-span-1 flex flex-col h-[500px] lg:h-auto gap-4">
          <div className="flex-1 rounded-lg">
             <GPSMap lat={lat} lng={lng} heading={heading} speed={speed} />
          </div>
        </div>

      </div>
    </div>
  );
}

function CamView({ humanDetected }) {
  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg border border-green-500/30 bg-[#020502] overflow-hidden shadow-[inset_0_0_80px_rgba(5,30,10,0.4)] flex items-center justify-center p-4">
      {/* Figma Specific Text Overlays */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 opacity-90">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse drop-shadow-[0_0_4px_#ef4444]" />
        <span className="text-[9px] text-green-400 tracking-widest font-bold">CAM-01 • REC</span>
      </div>
      <div className="absolute top-4 right-4 z-20 text-[9px] text-green-400 tracking-widest opacity-80">
        ZOOM: 2.4x | FOV: 110°
      </div>
      <div className="absolute bottom-4 right-4 z-20 text-[9px] text-green-400 opacity-60">
        10:12:43 AM
      </div>
      <div className="absolute bottom-4 left-4 z-20 text-[9px] text-green-400 tracking-widest opacity-80">
        3 TARGET(S) DETECTED
      </div>

      {/* Internal Grid and Horizon Line mapping to the screenshot */}
      <div className="absolute inset-0 border-[0.5px] border-green-500/10 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-full border-t border-green-500/40 drop-shadow-[0_0_4px_#22c55e] opacity-70 pointer-events-none" />
      <div className="absolute inset-0 z-10 opacity-[0.03] bg-[linear-gradient(rgba(34,197,94,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Crosshair Center */}
      <div className="absolute z-10 pointer-events-none flex items-center justify-center">
         <div className="w-[40px] h-[40px] border border-green-500/40 relative">
            <div className="absolute top-1/2 left-[-10px] w-[60px] h-[1px] bg-green-500/40"/>
            <div className="absolute left-1/2 top-[-10px] w-[1px] h-[60px] bg-green-500/40"/>
         </div>
      </div>

      {/* Target Boxes replicating the image explicitly */}
      <div className="relative w-full h-[80%] opacity-90 max-w-2xl bg-[url('https://images.unsplash.com/photo-1555448248-2571daf6344b?auto=format&fit=crop&q=80&w=1000&blend=000000&blend-mode=overlay')] bg-center bg-cover border border-green-500/10 mix-blend-screen grayscale contrast-150">
        {/* HOSTILE */}
        <div className="absolute top-[20%] left-[5%] w-[12%] h-[20%] border border-red-500 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)] flex justify-center cursor-crosshair">
           <div className="absolute -top-[18px] text-[8px] bg-red-900/60 text-red-400 px-1 border border-red-500/40 whitespace-nowrap drop-shadow-[0_0_4px_#ef4444]">HOSTILE 97.2%</div>
        </div>
        
        {/* UNKNOWN */}
        <div className="absolute top-[30%] left-[55%] w-[10%] h-[15%] border border-yellow-500 flex justify-center shadow-[inset_0_0_10px_rgba(234,179,8,0.2)]">
           <div className="absolute -top-[18px] text-[8px] bg-yellow-900/60 text-yellow-400 px-1 border border-yellow-500/40 whitespace-nowrap">UNKNOWN 88.5%</div>
        </div>

        {/* CIVILIAN */}
        <div className="absolute top-[45%] right-[10%] w-[8%] h-[12%] border border-green-500 shadow-[inset_0_0_10px_rgba(34,197,94,0.2)] flex justify-center">
           <div className="absolute -top-[18px] text-[8px] bg-green-900/60 text-green-400 px-1 border border-green-500/40 whitespace-nowrap">CIVILIAN 79.1%</div>
        </div>
      </div>
    </div>
  );
}