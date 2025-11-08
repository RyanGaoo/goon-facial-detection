# Quick Visual Guide

## 🎯 Where to Look

```
┌─────────────────────────────────────────────────────────────────┐
│ Browser Window                                                   │
│                                                                  │
│  ┌────────────────────────────────────┐  ┌─────────────────┐   │
│  │                                    │  │ 🎤 AUDIO MONITOR│   │
│  │                                    │  │ ▓▓▓▓░░░░░░░░░░░ │   │
│  │                                    │  │ 120 ←threshold  │   │
│  │         VIDEO FEED                 │  │                 │   │
│  │      (your face here)              │  │ Claps: 2        │   │
│  │                                    │  │ 👏 clap!        │   │
│  │         [face box]                 │  │ 🎵 rhythmic     │   │
│  │      Ryan - happy                  │  └─────────────────┘   │
│  │                                    │   ↑                     │
│  └────────────────────────────────────┘   Look here!           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ DETECTION STATUS                                        │    │
│  │ • backend: connected  • faces: 1                       │    │
│  │ • clapping: yes       • rhythmic: yes                  │    │
│  │ • fear detected: yes  • alarm: 🚨 active               │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│               [Send Screenshot Email]                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Audio Monitor Widget Breakdown

```
┌────────────────────────┐
│ 🎤 AUDIO MONITOR       │  ← Header
├────────────────────────┤
│ audio level            │
│ ▓▓▓▓▓▓▓░░░░░░░░░  145 │  ← Live bar (green/yellow/red)
│ 0    |120|      200   │  ← Scale with threshold
├────────────────────────┤
│ claps detected: 3      │  ← Counter
├────────────────────────┤
│ ⚪ waiting...          │  ← Inactive
│ 🟡 👏 clap!            │  ← Single clap (yellow)
│ 🟠 🎵 rhythmic!        │  ← Pattern detected (orange)
├────────────────────────┤
│ clap 3+ times          │  ← Instructions
│ rhythmically           │
└────────────────────────┘
```

## 🎯 What Each Indicator Means

### Audio Level Bar
- **Green (0-80)**: Normal background noise
- **Yellow (80-120)**: Getting louder
- **Red (120+)**: Loud enough to detect as clap

### Claps Detected Counter
- Shows cumulative claps in current sequence
- Resets after 4 seconds of no clapping
- Need 3+ for rhythmic detection

### Status Lights
- **⚪ Gray dot**: Inactive/waiting
- **🟡 Yellow dot + animation**: Single clap detected
- **🟠 Orange dot + animation**: Rhythmic pattern detected

## 🎯 Testing Steps (Visual)

### 1. Start App
```
Terminal → npm run dev → Browser opens
```

### 2. Allow Permissions
```
Browser popup: "Allow microphone?" → Click "Allow"
```

### 3. Find Widget
```
Look top-right corner → See "🎤 AUDIO MONITOR"
```

### 4. Make Noise
```
Talk/hum → Audio bar moves → Green/yellow colors
```

### 5. Single Clap
```
👏 CLAP! → Bar spikes red → Counter: 1 → Yellow light
```

### 6. Rhythmic Claps
```
👏 ... 👏 ... 👏 → Counter: 3 → Orange light → Console log
```

### 7. Trigger Alarm
```
😱 Fear face + 👏👏👏 Rhythm → 🚨 Screen flashes red
```

## 🎯 Console Output (What to Expect)

Open browser console (F12) and you'll see:

```javascript
🎤 Audio detection initialized
Sample rate: 48000Hz, FFT size: 2048

// When you clap:
👏 CLAP! Level: 145, Max: 178
Clap count: 1/3

👏 CLAP! Level: 156, Max: 189  
Clap count: 2/3

👏 CLAP! Level: 134, Max: 167
Clap count: 3/3
Rhythm check - Avg interval: 621ms, StdDev: 45ms
🎵 RHYTHMIC CLAPPING DETECTED!
```

## 🎯 Common Issues (Visual Guide)

### Issue: Audio bar not moving
```
┌──────────────────┐
│ audio level      │
│ ░░░░░░░░░░░░  0  │  ← Stuck at 0
└──────────────────┘

Fix: Check microphone permissions!
```

### Issue: Bar moves but no claps detected
```
┌──────────────────┐
│ ▓▓▓░░░░░░░░  85  │  ← Not reaching 120
└──────────────────┘

Fix: Clap louder! Need to hit red line (120)
```

### Issue: Claps detected but no rhythm
```
Claps: 1 ... 2 ... 3 ... 1 ... 2
      ↑500ms ↑800ms ↑200ms
      
Fix: Too inconsistent! Keep same timing
```

---

## ✅ Success Looks Like This:

```
🎤 AUDIO MONITOR
▓▓▓▓▓▓▓▓▓▓░░░░  156  ← Spiking above threshold
claps detected: 3      ← Counter at 3+
🟠 🎵 rhythmic!        ← Orange light active

DETECTION STATUS
• clapping: yes        ← Checkmark
• rhythmic: yes        ← Checkmark  
• fear detected: yes   ← If making fear face
• alarm: 🚨 active     ← If both conditions met

[Screen flashing red]  ← Alarm triggered!
```

---

**That's it! Just clap 3+ times rhythmically and watch the magic happen!** 🎉
