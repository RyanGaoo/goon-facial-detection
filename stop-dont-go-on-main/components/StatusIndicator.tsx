import React from 'react';

/**
 * @interface StatusIndicatorProps
 * @description Props for the StatusIndicator component
 */
interface StatusIndicatorProps {
  isClapping: boolean;
  isRhythmicClapping: boolean;
  hasFear: boolean;
  faceCount: number;
  backendConnected: boolean;
}

/**
 * @component StatusIndicator
 * @description Displays current detection status (clapping, emotion, etc.)
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isClapping,
  isRhythmicClapping,
  hasFear,
  faceCount,
  backendConnected,
}) => {
  return (
    <div className="w-full max-w-3xl bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-zinc-100 mb-4 lowercase">detection status</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Backend status */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-zinc-300 lowercase">
            backend: {backendConnected ? 'connected' : 'disconnected'}
          </span>
        </div>

        {/* Faces detected */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${faceCount > 0 ? 'bg-blue-500' : 'bg-zinc-600'}`} />
          <span className="text-zinc-300 lowercase">
            faces: {faceCount}
          </span>
        </div>

        {/* Clapping status */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isClapping ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-zinc-300 lowercase">
            clapping: {isClapping ? 'yes' : 'no'}
          </span>
        </div>

        {/* Rhythmic clapping */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRhythmicClapping ? 'bg-orange-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-zinc-300 lowercase">
            rhythmic: {isRhythmicClapping ? 'yes' : 'no'}
          </span>
        </div>

        {/* Fear emotion */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${hasFear ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-zinc-300 lowercase">
            fear detected: {hasFear ? 'yes' : 'no'}
          </span>
        </div>

        {/* Alarm trigger condition */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${hasFear && isRhythmicClapping ? 'bg-red-700 animate-pulse' : 'bg-zinc-600'}`} />
          <span className={`font-bold lowercase ${hasFear && isRhythmicClapping ? 'text-red-400' : 'text-zinc-300'}`}>
            alarm: {hasFear && isRhythmicClapping ? '🚨 active' : 'inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
