#!/bin/bash

# Start script for the integrated facial recognition system
# This script starts both the Flask backend and React frontend

echo "🚀 Starting Integrated Facial Recognition & Alert System"
echo "========================================================="

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python3 found: $(python3 --version)${NC}"
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo ""

# Start Flask backend in background
echo -e "${YELLOW}📡 Starting Flask backend server...${NC}"
cd "$PROJECT_ROOT"

# Check if Python dependencies are installed
if ! python3 -c "import flask" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Flask dependencies not found. Installing...${NC}"
    pip3 install -r requirements.txt
fi

# Start Flask server in background
python3 app.py > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo -e "${GREEN}  Backend running at: http://localhost:5001${NC}"
echo -e "${GREEN}  Logs: $PROJECT_ROOT/backend.log${NC}"
echo ""

# Wait a moment for backend to start
sleep 2

# Start React frontend
echo -e "${YELLOW}🎨 Starting React frontend server...${NC}"
cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Node dependencies not found. Installing...${NC}"
    npm install
fi

# Start Vite dev server
echo -e "${GREEN}✓ Starting frontend...${NC}"
echo ""
echo -e "${GREEN}=========================================================${NC}"
echo -e "${GREEN}🎉 System is starting up!${NC}"
echo -e "${GREEN}=========================================================${NC}"
echo -e "${GREEN}Backend:  http://localhost:5001${NC}"
echo -e "${GREEN}Frontend: http://localhost:5173 (will open automatically)${NC}"
echo ""
echo -e "${YELLOW}⚠️  To stop the system, press Ctrl+C${NC}"
echo -e "${YELLOW}⚠️  Backend logs: $PROJECT_ROOT/backend.log${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down system...${NC}"
    kill $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Backend stopped${NC}"
    echo -e "${GREEN}✓ Frontend stopped${NC}"
    echo -e "${GREEN}Goodbye! 👋${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

# Start frontend (this will block)
npm run dev

# If npm run dev exits, cleanup
cleanup
