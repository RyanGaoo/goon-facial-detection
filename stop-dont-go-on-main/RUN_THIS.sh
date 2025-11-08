#!/bin/bash

# Quick test script - Run this to see if clapping detection works!

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        🎤 CLAPPING DETECTION - QUICK TEST 🎤             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ INTEGRATION COMPLETE!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📦 What was integrated:${NC}"
echo "  ✓ Facial recognition (identify people)"
echo "  ✓ Emotion detection (fear, happy, sad, etc.)"
echo "  ✓ Clapping detection (with visual feedback) ⭐ IMPROVED"
echo "  ✓ Rhythmic pattern detection"
echo "  ✓ Smart alarm (fear + rhythmic clapping)"
echo "  ✓ Email alerts"
echo "  ✓ Audio Monitor widget ⭐ NEW"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎯 THE NEW FEATURE: AUDIO MONITOR WIDGET${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Location:${NC} Top-right corner of the screen"
echo ""
echo -e "${YELLOW}Shows:${NC}"
echo "  • Live audio level bar (green/yellow/red)"
echo "  • Threshold line at 120 (red)"
echo "  • Clap counter (number of claps)"
echo "  • 👏 Yellow indicator when clap detected"
echo "  • 🎵 Orange indicator when rhythm detected"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 HOW TO TEST (RIGHT NOW!)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Step 1:${NC} Start Flask backend (if not running)"
echo "  cd /Users/ryan/Desktop/Projects/goon\ bot/sw"
echo "  python3 app.py"
echo ""

echo -e "${YELLOW}Step 2:${NC} Start React frontend"
echo "  cd /Users/ryan/Desktop/Projects/goon\ bot/sw/stop-dont-go-on-main"
echo "  npm run dev"
echo ""

echo -e "${YELLOW}Step 3:${NC} Open browser to http://localhost:5173"
echo ""

echo -e "${YELLOW}Step 4:${NC} Allow microphone when browser asks ⚠️ CRITICAL!"
echo ""

echo -e "${YELLOW}Step 5:${NC} Look for Audio Monitor widget (top-right corner)"
echo ""

echo -e "${YELLOW}Step 6:${NC} TEST CLAPPING:"
echo "  1. Make noise → Audio bar should move"
echo "  2. Clap once → See 👏 and counter increase"
echo "  3. Clap 3 times rhythmically → See 🎵 indicator"
echo "  4. Open console (F12) → See clap logs"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎯 WHAT YOU'LL SEE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "In the Audio Monitor widget:"
echo "┌────────────────────┐"
echo "│ 🎤 AUDIO MONITOR   │"
echo "│ ▓▓▓▓░░░░░░░  145  │ ← Audio bar spikes"
echo "│ 0    120    200   │ ← Threshold line"
echo "│ claps: 3           │ ← Counter increases"
echo "│ 🟡 👏 clap!        │ ← Single clap"
echo "│ 🟠 🎵 rhythmic!    │ ← Rhythm detected!"
echo "└────────────────────┘"
echo ""

echo "In the Console (F12):"
echo "  👏 CLAP! Level: 145, Max: 178"
echo "  Clap count: 1/3"
echo "  👏 CLAP! Level: 156, Max: 189"
echo "  Clap count: 2/3"
echo "  👏 CLAP! Level: 134, Max: 167"
echo "  Clap count: 3/3"
echo "  🎵 RHYTHMIC CLAPPING DETECTED!"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🐛 TROUBLESHOOTING${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${RED}Problem:${NC} Audio bar not moving"
echo -e "${GREEN}Fix:${NC} Check microphone permissions in browser settings"
echo ""

echo -e "${RED}Problem:${NC} Bar moves but claps not detected"
echo -e "${GREEN}Fix:${NC} Clap louder! Audio level must exceed 120 (red line)"
echo ""

echo -e "${RED}Problem:${NC} Claps detected but no rhythm"
echo -e "${GREEN}Fix:${NC} Clap more consistently (~500ms intervals)"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📚 DOCUMENTATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "Read these files for more details:"
echo "  • CLAPPING_FIXED_README.md - Quick guide ⭐"
echo "  • CLAPPING_FIX.md - Detailed improvements"
echo "  • VISUAL_GUIDE.md - Visual diagrams"
echo "  • START_HERE.md - Complete setup"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ READY TO TEST!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Press Enter to start the React frontend now...${NC}"
read -r

echo ""
echo -e "${GREEN}Starting React dev server...${NC}"
echo -e "${YELLOW}(Make sure Flask backend is running on port 5001!)${NC}"
echo ""

cd "/Users/ryan/Desktop/Projects/goon bot/sw/stop-dont-go-on-main"
npm run dev
