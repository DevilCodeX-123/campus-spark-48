import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface SeatCountdownProps {
  expiresAt: string;
  onExpire: () => void;
}

const SeatCountdown: React.FC<SeatCountdownProps> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    const target = new Date(expiresAt).getTime();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      
      setTimeLeft(diff);
      
      if (diff <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-200 p-4 animate-in fade-in slide-in-from-top-2">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <Clock className="h-6 w-6 text-orange-600" />
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-orange-200"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={113.1}
            strokeDashoffset={113.1 * (1 - timeLeft / 90)}
            className="text-orange-600 transition-all duration-1000 ease-linear"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-orange-900">Seat held for {timeLeft}s</p>
        <p className="text-xs text-orange-700">Complete your registration before the timer runs out!</p>
      </div>
    </div>
  );
};

export default SeatCountdown;
