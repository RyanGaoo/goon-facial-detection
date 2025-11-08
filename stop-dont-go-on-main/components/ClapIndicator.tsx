import React from 'react';

/**
 * @interface ClapIndicatorProps
 * @description Props for the ClapIndicator component
 */
interface ClapIndicatorProps {
  isClapping: boolean;
  isRhythmicClapping: boolean;
  audioLevel: number;
  clapCount: number;
}

/**
 * @component ClapIndicator
 * @description Visual indicator showing clapping detection status in real-time
 */
const ClapIndicator: React.FC<ClapIndicatorProps> = ({
  isClapping,
  isRhythmicClapping,
  audioLevel,
  clapCount,
}) => {
  return (
    <div className="fixed top-4 right-4 z-40 bg-zinc-900 bg-opacity-95 rounded-lg p-4 shadow-2xl border-2 border-zinc-700">
      <h3 className="text-sm font-bold text-zinc-100 mb-3 uppercase">🎤 Audio Monitor</h3>
      
      {/* Audio Level Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-zinc-400 lowercase">audio level</span>
          <span className="text-xs text-zinc-300 font-mono">{audioLevel}</span>
        </div>
        <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              audioLevel > 120 ? 'bg-red-500' : audioLevel > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, (audioLevel / 200) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>0</span>
          <span className="text-red-400">threshold: 120</span>
          <span>200</span>
        </div>
      </div>

      {/* Clap Count */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-400 lowercase">claps detected</span>
        <span className={`text-lg font-bold font-mono ${clapCount >= 3 ? 'text-orange-400' : 'text-zinc-300'}`}>
          {clapCount}
        </span>
      </div>

      {/* Status Indicators */}
      <div className="space-y-2">
        {/* Single Clap */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
            isClapping ? 'bg-yellow-400 animate-ping' : 'bg-zinc-700'
          }`} />
          <span className={`text-xs lowercase ${isClapping ? 'text-yellow-400 font-bold' : 'text-zinc-500'}`}>
            {isClapping ? '👏 clap!' : 'waiting...'}
          </span>
        </div>

        {/* Rhythmic Clapping */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
            isRhythmicClapping ? 'bg-orange-500 animate-pulse' : 'bg-zinc-700'
          }`} />
          <span className={`text-xs lowercase ${isRhythmicClapping ? 'text-orange-400 font-bold' : 'text-zinc-500'}`}>
            {isRhythmicClapping ? '🎵 rhythmic!' : 'no rhythm'}
          </span>
        </div>
      </div>

      {/* Temporary clap flash */}
      {isClapping && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full shadow-lg animate-bounce font-bold text-xl">
          👏
        </div>
      )}

      {/* Instructions */}
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <p className="text-xs text-zinc-400 lowercase">
          clap 3+ times rhythmically
        </p>
      </div>
    </div>
  );
};

export default ClapIndicator;
