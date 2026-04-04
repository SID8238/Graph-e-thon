import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function ThreatGraph({ history }) {
  const data = history && history.length > 0 
    ? history.map(p => ({ time: p.time, value: p.value || p })) 
    : Array.from({ length: 60 }).map((_, i) => ({ time: new Date(Date.now() - (60 - i) * 1000), value: 0 }));

  return (
    <div className="w-full h-full flex flex-col pt-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-semibold tracking-widest text-slate-400">THREAT ANALYTICS</h3>
        <div className="text-[10px] text-slate-500 font-mono">60s WINDOW</div>
      </div>
      <div className="flex-1 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={false} axisLine={{ stroke: '#ffffff10' }} tickLine={false} />
            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
              labelFormatter={() => 'Score'}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Area type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
