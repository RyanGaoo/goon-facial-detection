import { useState, useEffect, useRef } from 'react';

/**
 * @interface ClappingDetection
 * @description Return type for the useClappingDetection hook
 */
export interface ClappingDetection {
  isClapping: boolean;
  isRhythmicClapping: boolean;
  error: string | null;
  audioLevel: number;
  clapCount: number;
}

/**
 * @hook useClappingDetection
 * @description Detects clapping sounds using Web Audio API and determines if clapping is rhythmic
 * @returns {ClappingDetection} Object containing clapping state
 */
export const useClappingDetection = (): ClappingDetection => {
  const [isClapping, setIsClapping] = useState(false);
  const [isRhythmicClapping, setIsRhythmicClapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [clapCount, setClapCount] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const clapTimestampsRef = useRef<number[]>([]);
  const lastClapTimeRef = useRef<number>(0);

  const CLAP_THRESHOLD = 120; // Lowered threshold for better detection
  const CLAP_COOLDOWN = 200; // Minimum ms between claps
  const RHYTHMIC_WINDOW = 4000; // Time window to check for rhythmic clapping (4 seconds)
  const RHYTHMIC_MIN_CLAPS = 3; // Minimum claps to be considered rhythmic (lowered)
  const RHYTHMIC_MAX_VARIANCE = 300; // Max variance in ms between claps to be rhythmic

  useEffect(() => {
    let isMounted = true;

    const startAudioDetection = async () => {
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        mediaStreamRef.current = stream;

        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create analyser node
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048; // Larger FFT for better frequency resolution
        analyser.smoothingTimeConstant = 0.1; // Less smoothing for faster response
        analyserRef.current = analyser;

        // Connect microphone to analyser
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        console.log('🎤 Audio detection initialized');
        console.log(`Sample rate: ${audioContext.sampleRate}Hz, FFT size: ${analyser.fftSize}`);

        // Start analyzing audio
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const timeDataArray = new Uint8Array(analyser.fftSize); // For time domain
        
        const detectClap = () => {
          if (!isMounted || !analyserRef.current) return;

          // Get frequency data
          analyserRef.current.getByteFrequencyData(dataArray);
          // Get time domain data for peak detection
          analyserRef.current.getByteTimeDomainData(timeDataArray);

          // Calculate average volume across broader frequency range (500-8000 Hz)
          const lowFreqBin = Math.floor((500 / audioContext.sampleRate) * analyser.fftSize);
          const highFreqBin = Math.floor((8000 / audioContext.sampleRate) * analyser.fftSize);
          
          let sum = 0;
          let max = 0;
          for (let i = lowFreqBin; i < highFreqBin; i++) {
            sum += dataArray[i];
            max = Math.max(max, dataArray[i]);
          }
          const average = sum / (highFreqBin - lowFreqBin);

          // Update audio level for display
          setAudioLevel(Math.round(average));

          const now = Date.now();

          // Detect clap (high volume spike OR sudden amplitude change)
          const isLoudEnough = average > CLAP_THRESHOLD || max > CLAP_THRESHOLD + 50;
          
          if (isLoudEnough && now - lastClapTimeRef.current > CLAP_COOLDOWN) {
            console.log(`👏 CLAP! Level: ${Math.round(average)}, Max: ${max}`);
            
            setIsClapping(true);
            lastClapTimeRef.current = now;
            clapTimestampsRef.current.push(now);

            // Remove old claps outside the time window
            clapTimestampsRef.current = clapTimestampsRef.current.filter(
              timestamp => now - timestamp < RHYTHMIC_WINDOW
            );

            // Update clap count
            setClapCount(clapTimestampsRef.current.length);

            console.log(`Clap count: ${clapTimestampsRef.current.length}/${RHYTHMIC_MIN_CLAPS}`);

            // Check if clapping is rhythmic
            if (clapTimestampsRef.current.length >= RHYTHMIC_MIN_CLAPS) {
              const intervals: number[] = [];
              for (let i = 1; i < clapTimestampsRef.current.length; i++) {
                intervals.push(clapTimestampsRef.current[i] - clapTimestampsRef.current[i - 1]);
              }

              // Calculate variance of intervals
              const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
              const variance = intervals.reduce((sum, interval) => {
                return sum + Math.pow(interval - avgInterval, 2);
              }, 0) / intervals.length;
              const stdDev = Math.sqrt(variance);

              console.log(`Rhythm check - Avg interval: ${Math.round(avgInterval)}ms, StdDev: ${Math.round(stdDev)}ms`);

              // If variance is low, clapping is rhythmic
              if (stdDev < RHYTHMIC_MAX_VARIANCE) {
                console.log('🎵 RHYTHMIC CLAPPING DETECTED!');
                setIsRhythmicClapping(true);
                
                // Keep rhythmic flag active for 2 seconds
                setTimeout(() => {
                  if (isMounted) {
                    setIsRhythmicClapping(false);
                    console.log('Rhythmic clapping flag cleared');
                  }
                }, 2000);
              } else {
                setIsRhythmicClapping(false);
              }
            }

            // Reset single clap indicator after a short delay
            setTimeout(() => {
              if (isMounted) setIsClapping(false);
            }, 300);
          }

          // Continue analyzing
          animationFrameRef.current = requestAnimationFrame(detectClap);
        };

        detectClap();
      } catch (err) {
        console.error('Error accessing microphone:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to access microphone');
        }
      }
    };

    startAudioDetection();

    // Cleanup
    return () => {
      isMounted = false;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { isClapping, isRhythmicClapping, error, audioLevel, clapCount };
};
