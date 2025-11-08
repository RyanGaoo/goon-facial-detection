#!/bin/bash

# Test script for clapping detection
# This script will help you test if the microphone and clapping detection work

echo "🎤 Clapping Detection Test"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Instructions:${NC}"
echo "1. This test will open the app in your browser"
echo "2. Allow camera and microphone access when prompted"
echo "3. Look for the 'Audio Monitor' widget in the top-right corner"
echo "4. Try clapping near your microphone"
echo "5. Watch the audio level bar - it should spike when you clap"
echo "6. Try clapping 3-4 times rhythmically (like a beat)"
echo "7. The 'rhythmic!' indicator should light up"
echo ""

echo -e "${GREEN}✓ What to look for:${NC}"
echo "  • Audio level bar should show activity"
echo "  • '👏 clap!' should appear when you clap"
echo "  • Claps detected counter should increase"
echo "  • '🎵 rhythmic!' should appear after 3+ rhythmic claps"
echo ""

echo -e "${YELLOW}⚠️  Troubleshooting:${NC}"
echo "  • If audio level stays at 0: Check microphone permissions"
echo "  • If claps not detected: Clap louder or closer to mic"
echo "  • If rhythm not detected: Clap more consistently (every ~500ms)"
echo "  • Threshold is set to 120 (red line on the bar)"
echo ""

read -p "Press Enter to start the app and test clapping detection..."

# Navigate to project directory
cd "/Users/ryan/Desktop/Projects/goon bot/sw/stop-dont-go-on-main"

# Start the dev server
echo ""
echo -e "${GREEN}Starting React dev server...${NC}"
echo -e "${YELLOW}Note: Flask backend must be running on port 5001${NC}"
echo ""

npm run dev
