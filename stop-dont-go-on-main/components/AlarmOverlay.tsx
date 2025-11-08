import React, { useEffect, useState } from 'react';

/**
 * @interface AlarmOverlayProps
 * @description Props for the AlarmOverlay component
 */
interface AlarmOverlayProps {
  isActive: boolean;
}

/**
 * @component AlarmOverlay
 * @description Red flashing overlay that appears when fear + rhythmic clapping detected
 */
const AlarmOverlay: React.FC<AlarmOverlayProps> = ({ isActive }) => {
  const [flashState, setFlashState] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setFlashState(false);
      return;
    }

    // Flash every 300ms
    const interval = setInterval(() => {
      setFlashState(prev => !prev);
    }, 300);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Red flashing overlay */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-100 z-50 ${
          flashState ? 'opacity-70' : 'opacity-0'
        }`}
        style={{ backgroundColor: '#ef4444' }}
      />
      
      {/* Alarm text */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-2xl border-4 border-white animate-pulse">
          <p className="text-4xl font-extrabold uppercase">⚠️ ALARM TRIGGERED ⚠️</p>
          <p className="text-xl mt-2 lowercase">fear + rhythmic clapping detected</p>
        </div>
      </div>
    </>
  );
};

export default AlarmOverlay;
