import os
import json
import base64
import cv2
import numpy as np
from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
import uuid
from datetime import datetime
import sys
import threading
import time

# Add deepface to path
sys.path.append('deepface-master')
from deepface import DeepFace

app = Flask(__name__)
CORS(app)

# Configuration
PEOPLE_DB_PATH = "people_database"
PEOPLE_LIST_FILE = "people_list.json"
CONFIDENCE_THRESHOLD = 0.4

# Ensure directories exist
os.makedirs(PEOPLE_DB_PATH, exist_ok=True)

class FaceRecognitionApp:
    def __init__(self):
        self.people_list = self.load_people_list()
        self.camera = None
        self.current_frame = None
        self.is_streaming = False
        self.models_loaded = False
        self._preload_models()
    
    def _preload_models(self):
        """Preload DeepFace models to avoid downloading during first request"""
        try:
            print("Preloading DeepFace models... This may take a moment.")
            # Create a small dummy image to trigger model loading
            import numpy as np
            dummy_img = np.zeros((100, 100, 3), dtype=np.uint8)
            # This will download models if needed
            DeepFace.analyze(
                dummy_img,
                actions=['emotion', 'age', 'gender'],
                enforce_detection=False,
                silent=True
            )
            self.models_loaded = True
            print("✓ Models preloaded successfully!")
        except Exception as e:
            print(f"Model preloading failed (will load on first use): {e}")
        
    def load_people_list(self):
        """Load the list of registered people"""
        if os.path.exists(PEOPLE_LIST_FILE):
            with open(PEOPLE_LIST_FILE, 'r') as f:
                return json.load(f)
        return {}
    
    def save_people_list(self):
        """Save the list of registered people"""
        with open(PEOPLE_LIST_FILE, 'w') as f:
            json.dump(self.people_list, f, indent=2)
    
    def add_person(self, name, image_data):
        """Add a new person to the database"""
        try:
            # Decode base64 image
            image_data = image_data.split(',')[1] if ',' in image_data else image_data
            image_bytes = base64.b64decode(image_data)
            
            # Convert to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return {"success": False, "message": "Invalid image data"}
            
            # Generate unique ID for person
            person_id = str(uuid.uuid4())
            
            # Save image with person's name as filename
            # Sanitize the name to be filesystem-safe
            safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            safe_name = safe_name.replace(' ', '_')
            image_path = os.path.join(PEOPLE_DB_PATH, f"{safe_name}.png")
            
            # If file already exists, append a number
            counter = 1
            while os.path.exists(image_path):
                image_path = os.path.join(PEOPLE_DB_PATH, f"{safe_name}_{counter}.png")
                counter += 1
            
            cv2.imwrite(image_path, img)
            
            # Generate face embedding
            try:
                embedding = DeepFace.represent(img, model_name="VGG-Face", enforce_detection=False)
                if embedding:
                    # Store person info
                    self.people_list[person_id] = {
                        "name": name,
                        "image_path": image_path,
                        "embedding": embedding[0]["embedding"],
                        "added_date": datetime.now().isoformat()
                    }
                    self.save_people_list()
                    return {"success": True, "message": f"Added {name} successfully", "person_id": person_id}
                else:
                    return {"success": False, "message": "Could not detect face in image"}
            except Exception as e:
                return {"success": False, "message": f"Error processing face: {str(e)}"}
                
        except Exception as e:
            return {"success": False, "message": f"Error adding person: {str(e)}"}
    
    def recognize_faces_in_frame(self, frame):
        """Recognize faces and emotions in a frame"""
        try:
            print("Starting face analysis...")
            # Analyze frame for faces, emotions, etc.
            results = DeepFace.analyze(
                frame, 
                actions=['emotion', 'age', 'gender'],
                enforce_detection=False,
                silent=True
            )
            
            print(f"DeepFace analysis complete. Found {len(results) if isinstance(results, list) else 1} face(s)")
            
            # Handle both single face and multiple faces
            if not isinstance(results, list):
                results = [results]
            
            recognized_faces = []
            
            for result in results:
                face_info = {
                    "region": result.get("region", {}),
                    "emotion": result.get("emotion", {}),
                    "dominant_emotion": result.get("dominant_emotion", "unknown"),
                    "age": result.get("age", 0),
                    "gender": result.get("dominant_gender", "unknown"),
                    "name": "Unknown"
                }
                
                print(f"Face detected at region: {face_info['region']}, emotion: {face_info['dominant_emotion']}")
                
                # Try to match with known people
                try:
                    # Extract face region
                    region = result.get("region", {})
                    if region:
                        x, y, w, h = region.get("x", 0), region.get("y", 0), region.get("w", 0), region.get("h", 0)
                        if w > 0 and h > 0:
                            face_crop = frame[y:y+h, x:x+w]
                            
                            # Generate embedding for current face
                            current_embedding = DeepFace.represent(
                                face_crop, 
                                model_name="VGG-Face", 
                                enforce_detection=False
                            )
                            
                            if current_embedding:
                                current_emb = current_embedding[0]["embedding"]
                                
                                # Compare with known people
                                best_match = None
                                best_distance = float('inf')
                                
                                print(f"Comparing with {len(self.people_list)} known people...")
                                for person_id, person_data in self.people_list.items():
                                    stored_emb = person_data["embedding"]
                                    
                                    # Calculate cosine distance
                                    distance = self.cosine_distance(current_emb, stored_emb)
                                    
                                    if distance < best_distance and distance < CONFIDENCE_THRESHOLD:
                                        best_distance = distance
                                        best_match = person_data["name"]
                                
                                if best_match:
                                    face_info["name"] = best_match
                                    face_info["confidence"] = 1 - best_distance
                                    print(f"Match found: {best_match} (confidence: {face_info['confidence']:.2f})")
                                else:
                                    print(f"No match found (best distance: {best_distance:.4f}, threshold: {CONFIDENCE_THRESHOLD})")
                
                except Exception as e:
                    print(f"Error in face recognition: {e}")
                
                recognized_faces.append(face_info)
            
            return recognized_faces
            
        except Exception as e:
            print(f"Error analyzing frame: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def cosine_distance(self, emb1, emb2):
        """Calculate cosine distance between two embeddings"""
        emb1 = np.array(emb1)
        emb2 = np.array(emb2)
        
        dot_product = np.dot(emb1, emb2)
        norm1 = np.linalg.norm(emb1)
        norm2 = np.linalg.norm(emb2)
        
        if norm1 == 0 or norm2 == 0:
            return 1.0
        
        cosine_sim = dot_product / (norm1 * norm2)
        return 1 - cosine_sim

# Initialize the app
face_app = FaceRecognitionApp()

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/people')
def get_people():
    """Get list of registered people"""
    people = []
    for person_id, person_data in face_app.people_list.items():
        people.append({
            "id": person_id,
            "name": person_data["name"],
            "added_date": person_data["added_date"]
        })
    return jsonify(people)

@app.route('/api/add_person', methods=['POST'])
def add_person():
    """Add a new person"""
    data = request.json
    name = data.get('name')
    image_data = data.get('image')
    
    if not name or not image_data:
        return jsonify({"success": False, "message": "Name and image required"})
    
    result = face_app.add_person(name, image_data)
    return jsonify(result)

@app.route('/api/analyze_frame', methods=['POST'])
def analyze_frame():
    """Analyze a frame for face recognition and emotion"""
    try:
        print("\n=== Received analyze_frame request ===")
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            print("ERROR: No image data in request")
            return jsonify({"success": False, "message": "Image data required"})
        
        # Decode base64 image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            print("ERROR: Could not decode image")
            return jsonify({"success": False, "message": "Invalid image data"})
        
        print(f"Image decoded successfully: {frame.shape}")
        
        # Recognize faces
        faces = face_app.recognize_faces_in_frame(frame)
        
        print(f"Returning {len(faces)} face(s)")
        
        return jsonify({
            "success": True,
            "faces": faces
        })
        
    except Exception as e:
        print(f"ERROR in analyze_frame: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)})

@app.route('/api/delete_person/<person_id>', methods=['DELETE'])
def delete_person(person_id):
    """Delete a person from the database"""
    if person_id in face_app.people_list:
        # Remove image file
        image_path = face_app.people_list[person_id].get("image_path")
        if image_path and os.path.exists(image_path):
            os.remove(image_path)
        
        # Remove from list
        del face_app.people_list[person_id]
        face_app.save_people_list()
        
        return jsonify({"success": True, "message": "Person deleted successfully"})
    else:
        return jsonify({"success": False, "message": "Person not found"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
