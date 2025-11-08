import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { useFaceDetection } from '../hooks/useFaceDetection';

/**
 * @interface Person
 * @description Represents a person in the database
 */
interface Person {
  id: string;
  name: string;
  added_date: string;
}

/**
 * @component FaceDatabase
 * @description Manages the face recognition database - add/remove people
 */
const FaceDatabase: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { addPerson, getPeople, deletePerson } = useFaceDetection();

  // Load people list on mount
  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    const peopleList = await getPeople();
    setPeople(peopleList);
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch (error) {
      showMessage('Failed to access camera', 'error');
    }
  };

  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      stopCapture();
      showMessage('Photo captured! Enter a name and click Add Person.', 'success');
    }
  };

  const handleAddPerson = async () => {
    if (!newPersonName.trim()) {
      showMessage('Please enter a name', 'error');
      return;
    }

    if (!capturedImage) {
      showMessage('Please capture a photo first', 'error');
      return;
    }

    const result = await addPerson(newPersonName, capturedImage);
    
    if (result.success) {
      showMessage(`${newPersonName} added successfully!`, 'success');
      setNewPersonName('');
      setCapturedImage(null);
      loadPeople();
    } else {
      showMessage(result.message || 'Failed to add person', 'error');
    }
  };

  const handleDeletePerson = async (personId: string, personName: string) => {
    if (!confirm(`Are you sure you want to delete ${personName}?`)) return;

    const result = await deletePerson(personId);
    
    if (result.success) {
      showMessage(`${personName} deleted successfully`, 'success');
      loadPeople();
    } else {
      showMessage(result.message || 'Failed to delete person', 'error');
    }
  };

  return (
    <div className="w-full max-w-3xl bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-3xl font-bold text-zinc-100 mb-6 lowercase">face database manager</h2>

      {/* Add Person Section */}
      <div className="bg-zinc-700 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-zinc-100 mb-4 lowercase">add new person</h3>
        
        {/* Camera capture */}
        <div className="mb-4">
          {!isCapturing && !capturedImage && (
            <div className="flex justify-center">
              <Button onClick={startCapture}>
                📷 start camera
              </Button>
            </div>
          )}
          
          {isCapturing && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-3 mt-3 justify-center">
                <Button onClick={capturePhoto}>
                  📸 capture photo
                </Button>
                <Button onClick={stopCapture} variant="danger">
                  ❌ cancel
                </Button>
              </div>
            </div>
          )}
          
          {capturedImage && (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-lg"
              />
              <Button
                onClick={() => {
                  setCapturedImage(null);
                  startCapture();
                }}
                className="mt-3"
              >
                🔄 retake photo
              </Button>
            </div>
          )}
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="block text-zinc-300 mb-2 lowercase font-semibold">
            person's name:
          </label>
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddPerson();
            }}
            placeholder="enter name"
            className="w-full p-3 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 text-zinc-100 placeholder-zinc-400 lowercase"
          />
        </div>

        {/* Add button */}
        <Button
          onClick={handleAddPerson}
          disabled={!capturedImage || !newPersonName.trim()}
          className="w-full"
        >
          ➕ add person
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
        }`}>
          {message.text}
        </div>
      )}

      {/* People List */}
      <div>
        <h3 className="text-xl font-bold text-zinc-100 mb-4 lowercase">
          registered people ({people.length})
        </h3>
        
        {people.length === 0 ? (
          <p className="text-zinc-400 text-center py-8 lowercase">no people registered yet</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {people.map((person) => (
              <div
                key={person.id}
                className="bg-zinc-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-zinc-100 font-semibold lowercase">{person.name}</p>
                  <p className="text-zinc-400 text-sm lowercase">
                    added: {new Date(person.added_date).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleDeletePerson(person.id, person.name)}
                  variant="danger"
                  className="px-4 py-2"
                >
                  🗑️ delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceDatabase;
