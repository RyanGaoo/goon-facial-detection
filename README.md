# 🎭 Facial Recognition & Emotion Detection App

A real-time facial recognition and emotion detection web application using DeepFace and Flask.

## Features

- **Live Webcam Feed**: Real-time video streaming from your webcam
- **Face Recognition**: Identify registered people in the camera feed
- **Emotion Detection**: Detect emotions (happy, sad, angry, etc.) in real-time
- **Person Management**: Add new people to the database with photos and names
- **Age & Gender Detection**: Analyze demographic information
- **Modern Web Interface**: Beautiful, responsive UI

## How to Use

### 1. Start the Application

Run the application using one of these methods:

**Option A: Using the launch script**
```bash
./start_app.sh
```

**Option B: Manual start**
```bash
source .venv/bin/activate
python app.py
```

### 2. Access the Web Interface

Open your web browser and go to: `http://localhost:5001`

### 3. Using the App

1. **Start Camera**: Click "📹 Start Camera" to begin webcam feed
2. **Add People**: 
   - Click "📸 Capture Photo" to take a picture
   - Enter the person's name
   - Click "Add Person" to save them to the database
3. **Start Recognition**: Click "🔍 Start Recognition" to begin real-time face detection
4. **View Results**: See detected faces with names, emotions, age, and gender in real-time

## Features Breakdown

### 🎯 Face Recognition
- Uses DeepFace's VGG-Face model for accurate face recognition
- Compares live faces against your registered database
- Shows confidence levels for matches

### 😊 Emotion Detection
- Detects 7 emotions: Happy, Sad, Angry, Fear, Surprise, Disgust, Neutral
- Real-time emotion analysis with confidence scores
- Visual display of dominant emotion

### 👥 Person Database
- Store unlimited people with photos and names
- Easy management interface
- Delete people from database as needed

### 📊 Demographics
- Age estimation
- Gender detection
- Real-time analysis display

## Technical Details

### Dependencies
- **Flask**: Web framework
- **DeepFace**: Face recognition and analysis
- **OpenCV**: Computer vision and webcam handling
- **TensorFlow**: Deep learning backend
- **NumPy**: Numerical computing

### Models Used
- **VGG-Face**: Face recognition
- **Emotion Model**: 7-class emotion detection
- **Age Model**: Age estimation
- **Gender Model**: Gender classification

### File Structure
```
sw/
├── app.py                 # Main Flask application
├── templates/
│   └── index.html        # Web interface
├── people_database/      # Stored face images
├── people_list.json      # Person metadata
├── requirements.txt      # Python dependencies
├── start_app.sh         # Launch script
└── deepface-master/     # DeepFace library
```

## Configuration

You can adjust these settings in `app.py`:

- `CONFIDENCE_THRESHOLD = 0.4`: Face recognition sensitivity (lower = more strict)
- Recognition interval: Currently set to analyze every 2 seconds
- Camera resolution: Default 640x480

## Troubleshooting

### Camera Not Working
- Ensure your webcam is connected and working
- Check browser permissions for camera access
- Try refreshing the page

### Face Recognition Issues
- Ensure good lighting when adding people
- Take clear, front-facing photos
- Adjust the confidence threshold if needed

### Performance Issues
- Recognition runs every 2 seconds to balance accuracy and performance
- For better performance, you can increase the interval in the JavaScript

## Privacy & Security

- All data is stored locally on your machine
- No images or data are sent to external servers
- Delete the `people_database` folder to remove all stored faces

## Browser Support

Works best with modern browsers that support:
- WebRTC (for camera access)
- HTML5 Canvas
- Modern JavaScript features

Tested on: Chrome, Firefox, Safari, Edge

---

**Made with ❤️ using DeepFace and Flask**
