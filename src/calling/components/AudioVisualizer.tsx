import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface AudioVisualizerProps {
  label: string;
  level: number; // 0 to 100
  isMuted?: boolean;
  isLocal?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  label,
  level,
  isMuted = false,
  isLocal = false
}) => {
  const bars = [0.4, 0.7, 1.0, 0.8, 0.9, 0.6, 0.5, 0.3];

  return (
    <div className="bg-[#fffcf7] border border-[#e8dfcf] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLocal ? (
            isMuted ? (
              <MicOff className="w-4 h-4 text-rose-600" />
            ) : (
              <Mic className="w-4 h-4 text-emerald-700" />
            )
          ) : (
            <Volume2 className="w-4 h-4 text-[#720e1e]" />
          )}
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            {label}
          </span>
        </div>

        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
          isMuted
            ? 'bg-rose-100 text-rose-800 border border-rose-200'
            : level > 12
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {isMuted ? 'Muted' : level > 12 ? 'Speaking' : 'Listening'}
        </span>
      </div>

      {/* Voice Waveform Bars */}
      <div className="h-10 flex items-center justify-center gap-1.5 px-2 bg-[#f6eee3] rounded-xl border border-[#e8dfcf]">
        {bars.map((weight, i) => {
          const heightPercent = isMuted ? 8 : Math.max(12, Math.min(100, (level * weight * 1.4)));
          return (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-75 ${
                isMuted
                  ? 'bg-rose-300'
                  : level > 12
                  ? isLocal ? 'bg-emerald-600' : 'bg-[#720e1e]'
                  : 'bg-[#d8cbb7]'
              }`}
              style={{ height: `${heightPercent}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};
