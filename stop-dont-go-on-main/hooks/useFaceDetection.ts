import { useState, useCallback } from 'react';
import { FaceData } from '../components/FaceOverlay';

const BACKEND_URL = 'http://localhost:5001'; // Flask backend URL

/**
 * @interface FaceDetectionResult
 * @description Result from face detection analysis
 */
export interface FaceDetectionResult {
  faces: FaceData[];
  hasFear: boolean;
}

/**
 * @hook useFaceDetection
 * @description Hook to analyze video frames for face detection, recognition, and emotion
 */
export const useFaceDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * @function analyzeFrame
   * @description Sends a video frame to the backend for analysis
   * @param {HTMLVideoElement} videoElement - The video element to capture the frame from
   * @returns {Promise<FaceDetectionResult>} Analysis results
   */
  const analyzeFrame = useCallback(async (videoElement: HTMLVideoElement): Promise<FaceDetectionResult> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Create canvas to capture the current frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Send to backend for analysis
      const response = await fetch(`${BACKEND_URL}/api/analyze_frame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Analysis failed');
      }

      const faces: FaceData[] = data.faces || [];
      const hasFear = faces.some((face: FaceData) => face.dominant_emotion === 'fear');

      return { faces, hasFear };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during analysis';
      setError(errorMessage);
      console.error('Face detection error:', err);
      return { faces: [], hasFear: false };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * @function addPerson
   * @description Adds a new person to the face recognition database
   * @param {string} name - Person's name
   * @param {string} imageData - Base64 encoded image
   * @returns {Promise<{ success: boolean; message: string }>}
   */
  const addPerson = useCallback(async (name: string, imageData: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/add_person`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image: imageData }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error adding person';
      return { success: false, message: errorMessage };
    }
  }, []);

  /**
   * @function getPeople
   * @description Gets list of registered people from the database
   * @returns {Promise<Array<{ id: string; name: string; added_date: string }>>}
   */
  const getPeople = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/people`);
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching people:', err);
      return [];
    }
  }, []);

  /**
   * @function deletePerson
   * @description Deletes a person from the database
   * @param {string} personId - The ID of the person to delete
   * @returns {Promise<{ success: boolean; message: string }>}
   */
  const deletePerson = useCallback(async (personId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/delete_person/${personId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error deleting person';
      return { success: false, message: errorMessage };
    }
  }, []);

  return {
    analyzeFrame,
    addPerson,
    getPeople,
    deletePerson,
    isAnalyzing,
    error,
  };
};
