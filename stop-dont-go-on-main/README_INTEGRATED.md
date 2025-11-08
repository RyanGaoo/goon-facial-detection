# Advanced Facial Recognition & Alert System

A comprehensive monitoring system that combines facial recognition, emotion detection, clapping detection, and automated email alerts. Built with React (frontend) and Flask (backend).

## Features

### 🎯 Core Features
- **Real-time Facial Recognition**: Identifies registered people in the video feed
- **Emotion Detection**: Analyzes and displays emotional states (fear, happy, sad, etc.)
- **Clapping Detection**: Detects clapping sounds and rhythmic patterns using Web Audio API
- **Smart Alarm System**: Triggers visual alarm when fear emotion + rhythmic clapping detected simultaneously
- **Email Alerts**: Automatically sends screenshot alerts when alarm triggers
- **Live Status Dashboard**: Real-time display of all detection systems
- **Face Management**: Add/remove people from the recognition database

### 🎨 UI Features
- Face bounding boxes with name and emotion labels
- Color-coded detection (green for normal, red for fear)
- Flashing red alarm overlay when threat detected
- Live status indicators for all systems
- Beautiful modern dark theme interface

## Architecture

### Frontend (React + Vite)
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **EmailJS** for email alerts
- **Custom Hooks** for clapping and face detection
- **Web Audio API** for real-time audio analysis

### Backend (Flask + DeepFace)
- **Flask** REST API server
- **DeepFace** for facial recognition and emotion analysis
- **OpenCV** for image processing
- **VGG-Face** model for face embeddings

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Webcam and microphone access

### Backend Setup

1. Navigate to the project root directory:
```bash
cd "/Users/ryan/Desktop/Projects/goon bot/sw"
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask backend:
```bash
python app.py
```

The backend will start on `http://localhost:5001`

### Frontend Setup

1. Navigate to the React app directory:
```bash
cd stop-dont-go-on-main
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or next available port)

## Usage

### Adding People to Recognition Database

1. Open the application in your browser
2. Position a person in front of the camera
3. Use the "Add Person" feature (if available in UI) or use the backend endpoint:

```bash
curl -X POST http://localhost:5001/api/add_person \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "image": "data:image/jpeg;base64,..."}'
```

### Setting Up Email Alerts

1. Add email recipients in the "Email Recipients" section
2. Click "Add Email" for each recipient
3. Emails will be sent automatically when the alarm triggers
4. Manual screenshot emails can be sent using the "Send Screenshot Email" button

### How the Alarm Works

The alarm triggers when **BOTH** conditions are met:
1. **Fear Emotion Detected**: The system detects fear in at least one face
2. **Rhythmic Clapping Detected**: The microphone picks up rhythmic clapping patterns

When triggered:
- 🚨 Screen flashes red
- 📧 Screenshot emails sent to all recipients
- 📊 Status dashboard shows "ALARM ACTIVE"

## Configuration

### Backend Configuration (`app.py`)
```python
PEOPLE_DB_PATH = "people_database"  # Face database directory
PEOPLE_LIST_FILE = "people_list.json"  # Registered people metadata
CONFIDENCE_THRESHOLD = 0.4  # Face recognition confidence threshold
```

### Frontend Configuration
- **Backend URL**: Edit `hooks/useFaceDetection.ts` to change API endpoint
- **Analysis Interval**: Edit `App.tsx` (default: 500ms between analyses)
- **Email Service**: Configure EmailJS credentials in `App.tsx`

### Clapping Detection Parameters
Edit `hooks/useClappingDetection.ts`:
```typescript
const CLAP_THRESHOLD = 200;  // Volume threshold
const RHYTHMIC_WINDOW = 3000;  // Time window (ms)
const RHYTHMIC_MIN_CLAPS = 4;  // Minimum claps for rhythm
const RHYTHMIC_MAX_VARIANCE = 200;  // Max timing variance (ms)
```

## API Endpoints

### `GET /api/people`
Get list of registered people

### `POST /api/add_person`
Add a new person to the database
```json
{
  "name": "John Doe",
  "image": "data:image/jpeg;base64,..."
}
```

### `POST /api/analyze_frame`
Analyze a frame for faces and emotions
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

### `DELETE /api/delete_person/<person_id>`
Remove a person from the database

## Troubleshooting

### Backend Issues
- **Models not loading**: First run downloads DeepFace models (~100MB), be patient
- **Face not recognized**: Ensure good lighting and face is clearly visible
- **CORS errors**: Backend has CORS enabled for localhost

### Frontend Issues
- **Camera not working**: Check browser permissions (must allow camera access)
- **Microphone not working**: Check browser permissions (must allow microphone access)
- **Backend disconnected**: Ensure Flask server is running on port 5001
- **Face boxes not aligned**: Browser window resize may affect scaling, refresh page

### Performance Tips
- Reduce analysis interval if CPU usage is high (edit `App.tsx`)
- Ensure good lighting for better face detection
- Close other applications using camera/microphone

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- EmailJS
- Web Audio API

### Backend
- Python 3.8+
- Flask
- DeepFace
- OpenCV
- NumPy
- VGG-Face Model

## Security Notes

⚠️ **Important Security Considerations:**
- Face embeddings are stored in `people_list.json` (contains biometric data)
- Do not commit sensitive data to public repositories
- Use HTTPS in production
- Secure email credentials properly
- Consider encrypting face embeddings

## License

This project combines multiple technologies. Ensure compliance with:
- DeepFace license (MIT)
- VGG-Face model usage terms
- EmailJS terms of service

## Credits

- **DeepFace**: Face recognition and emotion detection
- **React & Vite**: Frontend framework
- **EmailJS**: Email service integration
- **Tailwind CSS**: Styling framework

## Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Future Enhancements

- [ ] Add person management UI in React
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced alarm configuration
- [ ] Recording/playback of alarm events
- [ ] Integration with home automation systems
- [ ] Face mask detection
- [ ] Age and gender statistics

## Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console for errors
- Check Flask server logs for backend issues
- Ensure all dependencies are properly installed

---

**Note**: This system is for educational and monitoring purposes. Ensure compliance with privacy laws and regulations in your jurisdiction when deploying facial recognition systems.
