import { useEffect, useState } from "react";
import { AlertTriangle, Shield } from "lucide-react";

const tiers = [
  { label: "LOW", color: "#22c55e", bg: "#052e16", glow: "#22c55e44", icon: Shield },
  { label: "ELEVATED", color: "#f59e0b", bg: "#451a03", glow: "#f59e0b44", icon: AlertTriangle },
  { label: "HIGH", color: "#ef4444", bg: "#450a0a", glow: "#ef444488", icon: AlertTriangle },
];

export function ThreatLevel({ level = 1 }) {
  const [currentLevel, setCurrentLevel] = useState(Math.max(0, Math.min(tiers.length - 1, level)));
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Update local level based on prop level instead of random
    setCurrentLevel(Math.max(0, Math.min(tiers.length - 1, level)));
  }, [level]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tier = tiers[currentLevel];

  return (
    <div className="relative flex flex-col items-center gap-3 p-4 rounded-lg border h-full w-full"
      style={{ borderColor: `${tier.color}44`, background: `${tier.bg}88` }}>
      <div className="text-xs font-mono text-green-400/60 tracking-widest self-start">THREAT LEVEL</div>

      {/* Big threat display */}
      <div
        className="relative flex flex-col items-center justify-center w-full py-4 rounded-md transition-all duration-500"
        style={{
          background: `${tier.bg}`,
          border: `2px solid ${tier.color}`,
          boxShadow: pulse ? `0 0 24px ${tier.glow}, inset 0 0 24px ${tier.glow}` : `0 0 12px ${tier.glow}`,
        }}
      >
        <tier.icon size={32} color={tier.color} style={{ filter: `drop-shadow(0 0 8px ${tier.color})` }} />
        <div className="font-mono text-2xl mt-2 tracking-widest" style={{ color: tier.color, textShadow: `0 0 12px ${tier.color}` }}>
          {tier.label}
        </div>
        <div className="font-mono text-xs mt-1 opacity-60" style={{ color: tier.color }}>
          LEVEL {currentLevel + 1} / 3
        </div>
      </div>

      {/* Level bars */}
      <div className="flex gap-1.5 w-full">
        {tiers.map((t, i) => (
          <div
            key={t.label}
            className="flex-1 h-3 rounded-sm transition-all duration-300"
            style={{
              background: i <= currentLevel ? t.color : "#1a1a1a",
              boxShadow: i <= currentLevel ? `0 0 6px ${t.color}66` : "none",
            }}
          />
        ))}
      </div>

      {/* Sub labels */}
      <div className="flex gap-1.5 w-full">
        {tiers.map((t, i) => (
          <div key={t.label} className="flex-1 text-center font-mono" style={{ fontSize: "7px", color: i <= currentLevel ? t.color : "#444" }}>
            {t.label.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Advisory text */}
      <div className="w-full text-xs font-mono text-center px-2 py-1.5 rounded border border-dashed mt-auto"
        style={{ color: `${tier.color}cc`, borderColor: `${tier.color}33`, background: `${tier.color}11` }}>
        {currentLevel === 0 && "No significant threat activity"}
        {currentLevel === 1 && "Significant risk — Stay alert"}
        {currentLevel === 2 && "⚠ HIGH RISK — Immediate precautions"}
      </div>
    </div>
  );
}
