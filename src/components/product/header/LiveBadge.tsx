
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";

interface LiveBadgeProps {
  progress: number;
}

const LiveBadge = ({ progress }: LiveBadgeProps) => {
  const [viewerCount, setViewerCount] = useState(324);
  const [pulsing, setPulsing] = useState(false);

  // Simulate fluctuating viewer count
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 7) - 3;
      setViewerCount(prev => Math.max(1, prev + change));
      setPulsing(true);
      setTimeout(() => setPulsing(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="backdrop-blur-sm h-7 rounded-full px-2.5 flex items-center transition-all duration-700"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${0.1 + (progress * 0.85)})`,
        backdropFilter: `blur(${4 + (progress * 4)}px)`
      }}>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1">
          <div className="relative w-1.5 h-1.5">
            <div className="absolute inset-0 rounded-full bg-orange-500 shadow-lg transition-all duration-700"
              style={{boxShadow: `0 0 ${6 + (progress * 2)}px rgba(249, 115, 22, ${0.5 - (progress * 0.2)})`}}></div>
            <div className={`absolute inset-0 rounded-full bg-orange-500 ${pulsing ? 'animate-ping opacity-60' : 'opacity-0'} transition-all duration-700`}></div>
          </div>
          <span className="text-xs uppercase font-medium tracking-widest transition-all duration-700"
            style={{
              color: progress > 0.5 ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`,
              textShadow: `0 0 ${8 - (progress * 8)}px rgba(0, 0, 0, 0.2)`
            }}>live</span>
        </div>
        <div className="mx-1 h-2.5 w-px transition-all duration-700"
          style={{
            backgroundColor: progress > 0.5 
              ? `rgba(75, 85, 99, ${0.2 + (progress * 0.1)})` 
              : `rgba(255, 255, 255, ${0.2 + (progress * 0.1)})`
          }}></div>
        <div className="flex items-center gap-1">
          <Eye 
            className="w-3 h-3 transition-all duration-700" 
            style={{
              color: progress > 0.5 
                ? `rgba(75, 85, 99, ${0.6 + (progress * 0.3)})` 
                : `rgba(255, 255, 255, ${0.7 - (progress * 0.2)})`
            }} 
            strokeWidth={2} 
          />
          <span className="text-xs font-medium transition-all duration-700"
            style={{
              color: progress > 0.5 
                ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
                : `rgba(255, 255, 255, ${0.8 - (progress * 0.2)})`
            }}>{viewerCount}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveBadge;
