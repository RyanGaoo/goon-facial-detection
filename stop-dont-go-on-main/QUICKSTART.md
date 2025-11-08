# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

#### Backend (Flask/Python)
```bash
cd "/Users/ryan/Desktop/Projects/goon bot/sw"
pip3 install -r requirements.txt
```

#### Frontend (React/Node)
```bash
cd "/Users/ryan/Desktop/Projects/goon bot/sw/stop-dont-go-on-main"
npm install
```

### Step 2: Start the System

#### Option A: Using the Start Script (Recommended)
```bash
cd "/Users/ryan/Desktop/Projects/goon bot/sw/stop-dont-go-on-main"
./start_system.sh
```

#### Option B: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd "/Users/ryan/Desktop/Projects/goon bot/sw"
python3 app.py
```

**Terminal 2 - Frontend:**
```bash
cd "/Users/ryan/Desktop/Projects/goon bot/sw/stop-dont-go-on-main"
npm run dev
```

### Step 3: Open in Browser

1. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)
2. **Allow camera and microphone access** when prompted
3. Wait for the backend to connect (green indicator in status dashboard)

## ✅ First Time Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`pip3 install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Camera connected and working
- [ ] Microphone connected and working
- [ ] Browser allows camera/microphone access

## 🎯 Quick Feature Test

### Test 1: Camera Feed
- You should see yourself in the video feed
- Green status indicator for "backend: connected"

### Test 2: Face Detection
1. Add a person to the database:
   - Take a clear photo of your face
   - Use the Flask API or add via backend
2. Face should appear with green box and your name

### Test 3: Emotion Detection
- Make different facial expressions
- Watch the emotion label change (happy, sad, neutral, etc.)

### Test 4: Clapping Detection
1. Clap your hands near the microphone
2. "Clapping: yes" should appear in status
3. Clap rhythmically (4+ claps at regular intervals)
4. "Rhythmic: yes" should appear

### Test 5: Alarm System
1. Make a "fear" facial expression (wide eyes, open mouth)
2. Clap rhythmically while maintaining the expression
3. Screen should flash red
4. "ALARM: 🚨 active" should appear

### Test 6: Email Alerts
1. Add an email address in the "Email Recipients" section
2. Click "Send Screenshot Email"
3. Check your email for the screenshot

## 🐛 Common Issues & Solutions

### Camera Not Working
- **Error**: "permission denied"
- **Solution**: Allow camera access in browser settings
- **Chrome**: chrome://settings/content/camera
- **Safari**: Safari > Settings > Websites > Camera

### Microphone Not Working
- **Error**: "Failed to access microphone"
- **Solution**: Allow microphone access in browser settings
- **Note**: Some browsers block microphone on localhost, use http://127.0.0.1:5173

### Backend Disconnected
- **Error**: "backend: disconnected" (red indicator)
- **Solution**: 
  1. Check if Flask server is running: `curl http://localhost:5001/api/people`
  2. Restart backend: `python3 app.py`
  3. Check `backend.log` for errors

### Face Not Recognized
- **Issue**: "Unknown" label on faces
- **Solution**:
  1. Ensure face is well-lit
  2. Face the camera directly
  3. Add person to database with clear photo
  4. Lower `CONFIDENCE_THRESHOLD` in `app.py` (default: 0.4)

### Alarm Not Triggering
- **Issue**: Fear + clapping not triggering alarm
- **Solution**:
  1. Check "Fear detected: yes" in status
  2. Check "Rhythmic: yes" in status
  3. Adjust clapping threshold in `hooks/useClappingDetection.ts`
  4. Make more exaggerated fear expression

### Face Boxes Misaligned
- **Issue**: Boxes don't line up with faces
- **Solution**: Refresh the page after resizing window

## 📧 Email Setup

### EmailJS Configuration
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Update credentials in `App.tsx`:
```typescript
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';
```

### Email Template Variables
Your EmailJS template can use these variables:
- `{{to_email}}` - Recipient email
- `{{screenshot}}` - Base64 image
- `{{subject}}` - Email subject
- `{{message}}` - Email message

## 🔧 Performance Tuning

### Reduce CPU Usage
Edit `App.tsx` and change analysis interval:
```typescript
// Analyze every 1000ms instead of 500ms
analysisIntervalRef.current = window.setInterval(startAnalysis, 1000);
```

### Adjust Face Recognition Sensitivity
Edit `app.py`:
```python
CONFIDENCE_THRESHOLD = 0.3  # Lower = more sensitive (0.0-1.0)
```

### Adjust Clapping Sensitivity
Edit `hooks/useClappingDetection.ts`:
```typescript
const CLAP_THRESHOLD = 150;  // Lower = more sensitive
```

## 📁 Project Structure
```
sw/
├── app.py                    # Flask backend
├── requirements.txt          # Python dependencies
├── people_database/          # Face images
├── people_list.json         # Face embeddings
├── deepface-master/         # DeepFace library
└── stop-dont-go-on-main/    # React frontend
    ├── App.tsx              # Main app
    ├── components/          # UI components
    │   ├── CameraFeed.tsx
    │   ├── FaceOverlay.tsx
    │   ├── AlarmOverlay.tsx
    │   └── StatusIndicator.tsx
    ├── hooks/               # Custom hooks
    │   ├── useFaceDetection.ts
    │   └── useClappingDetection.ts
    └── package.json         # Node dependencies
```

## 🎓 Next Steps

1. **Add More People**: Build your face recognition database
2. **Customize Alarm**: Adjust sensitivity and timing
3. **Configure Emails**: Set up EmailJS for alerts
4. **Tune Performance**: Adjust intervals and thresholds
5. **Explore Features**: Try different emotions and clapping patterns

## 💡 Tips

- **Good Lighting**: Face detection works best in well-lit environments
- **Direct Facing**: Face the camera directly for best recognition
- **Clear Audio**: Clapping works best with clear microphone input
- **Browser Choice**: Chrome and Edge work best for media APIs
- **HTTPS Note**: Production deployment should use HTTPS

## 📚 Additional Resources

- [DeepFace Documentation](https://github.com/serengil/deepface)
- [React Documentation](https://react.dev/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 🆘 Getting Help

If you encounter issues:
1. Check browser console (F12) for errors
2. Check `backend.log` for Flask errors
3. Review this guide's troubleshooting section
4. Ensure all dependencies are installed
5. Try restarting both frontend and backend

---

**Happy Monitoring! 🎉**
