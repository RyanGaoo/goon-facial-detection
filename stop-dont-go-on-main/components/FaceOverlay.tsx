import React from 'react';

/**
 * @interface FaceData
 * @description Face detection and recognition data from the backend
 */
export interface FaceData {
  name: string;
  region: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  emotion: {
    [key: string]: number;
  };
  dominant_emotion: string;
  age: number;
  gender: string;
  confidence?: number;
}

/**
 * @interface FaceOverlayProps
 * @description Props for the FaceOverlay component
 */
interface FaceOverlayProps {
  faces: FaceData[];
  videoWidth: number;
  videoHeight: number;
  containerWidth: number;
  containerHeight: number;
}

/**
 * @component FaceOverlay
 * @description Renders face detection boxes and labels over the video feed
 */
const FaceOverlay: React.FC<FaceOverlayProps> = ({ 
  faces, 
  videoWidth, 
  videoHeight, 
  containerWidth, 
  containerHeight 
}) => {
  // Calculate scaling factor for face boxes
  const scaleX = containerWidth / videoWidth;
  const scaleY = containerHeight / videoHeight;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {faces.map((face, index) => {
        const { x, y, w, h } = face.region;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledW = w * scaleX;
        const scaledH = h * scaleY;

        // Color based on emotion
        const isFear = face.dominant_emotion === 'fear';
        const boxColor = isFear ? '#ef4444' : '#10b981'; // red for fear, green otherwise
        const boxOpacity = isFear ? 0.9 : 0.7;

        return (
          <g key={index}>
            {/* Face box */}
            <rect
              x={scaledX}
              y={scaledY}
              width={scaledW}
              height={scaledH}
              fill="none"
              stroke={boxColor}
              strokeWidth="3"
              opacity={boxOpacity}
              rx="4"
            />
            
            {/* Label background */}
            <rect
              x={scaledX}
              y={scaledY - 30}
              width={scaledW}
              height="28"
              fill={boxColor}
              opacity="0.9"
              rx="4"
            />
            
            {/* Name and emotion text */}
            <text
              x={scaledX + scaledW / 2}
              y={scaledY - 10}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              className="lowercase"
            >
              {face.name} - {face.dominant_emotion}
              {face.confidence && ` (${(face.confidence * 100).toFixed(0)}%)`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default FaceOverlay;
