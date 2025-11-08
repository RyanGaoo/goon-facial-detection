#!/bin/bash

# Installation and Testing Script for Integrated Facial Recognition System
# This script helps verify that everything is properly set up

echo "🔍 Integrated Facial Recognition System - Installation Check"
echo "=============================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 is installed"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 is NOT installed"
        ((FAILED++))
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 is MISSING"
        ((FAILED++))
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 is MISSING"
        ((FAILED++))
        return 1
    fi
}

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📦 Checking Prerequisites..."
echo "----------------------------"
check_command python3 "Python 3"
check_command node "Node.js"
check_command npm "npm"
check_command pip3 "pip3"
echo ""

echo "📂 Checking Backend Files..."
echo "----------------------------"
cd "$PROJECT_ROOT"
check_file "app.py" "Flask backend (app.py)"
check_file "requirements.txt" "Python requirements"
check_file "people_list.json" "People database file"
check_directory "people_database" "Face images directory"
check_directory "deepface-master" "DeepFace library"
check_directory "templates" "Templates directory"
echo ""

echo "📂 Checking Frontend Files..."
echo "----------------------------"
cd "$SCRIPT_DIR"
check_file "package.json" "Package configuration"
check_file "App.tsx" "Main app file"
check_directory "components" "Components directory"
check_directory "hooks" "Hooks directory"
check_file "components/CameraFeed.tsx" "CameraFeed component"
check_file "components/FaceOverlay.tsx" "FaceOverlay component"
check_file "components/AlarmOverlay.tsx" "AlarmOverlay component"
check_file "components/StatusIndicator.tsx" "StatusIndicator component"
check_file "components/FaceDatabase.tsx" "FaceDatabase component"
check_file "hooks/useFaceDetection.ts" "Face detection hook"
check_file "hooks/useClappingDetection.ts" "Clapping detection hook"
echo ""

echo "🔧 Checking Dependencies..."
echo "----------------------------"

# Check Python dependencies
cd "$PROJECT_ROOT"
if python3 -c "import flask" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Flask is installed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Flask is NOT installed (run: pip3 install -r requirements.txt)"
    ((FAILED++))
fi

if python3 -c "import cv2" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} OpenCV is installed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} OpenCV is NOT installed (run: pip3 install -r requirements.txt)"
    ((FAILED++))
fi

if python3 -c "import deepface" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} DeepFace is installed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} DeepFace is NOT installed (run: pip3 install -r requirements.txt)"
    ((FAILED++))
fi

# Check Node dependencies
cd "$SCRIPT_DIR"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Node modules are installed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Node modules are NOT installed (run: npm install)"
    ((FAILED++))
fi

echo ""
echo "🌐 Checking Network Ports..."
echo "----------------------------"

# Check if port 5001 is available
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC}  Port 5001 is already in use (Flask backend)"
    echo "   This is OK if the backend is already running"
else
    echo -e "${GREEN}✓${NC} Port 5001 is available (Flask backend)"
    ((PASSED++))
fi

# Check if port 5173 is available
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC}  Port 5173 is already in use (React frontend)"
    echo "   This is OK if the frontend is already running"
else
    echo -e "${GREEN}✓${NC} Port 5173 is available (React frontend)"
    ((PASSED++))
fi

echo ""
echo "=============================================================="
echo "📊 Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}"
echo "=============================================================="
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! You're ready to start the system.${NC}"
    echo ""
    echo "To start the system, run:"
    echo "  ./start_system.sh"
    echo ""
    echo "Or manually:"
    echo "  Terminal 1: cd \"$PROJECT_ROOT\" && python3 app.py"
    echo "  Terminal 2: cd \"$SCRIPT_DIR\" && npm run dev"
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    if python3 -c "import flask" 2>/dev/null; then
        :
    else
        echo "To install Python dependencies:"
        echo "  cd \"$PROJECT_ROOT\" && pip3 install -r requirements.txt"
        echo ""
    fi
    if [ -d "$SCRIPT_DIR/node_modules" ]; then
        :
    else
        echo "To install Node dependencies:"
        echo "  cd \"$SCRIPT_DIR\" && npm install"
        echo ""
    fi
fi

echo ""
echo "📖 Documentation:"
echo "  - Quick Start: QUICKSTART.md"
echo "  - Full Docs: README_INTEGRATED.md"
echo "  - Integration Summary: INTEGRATION_SUMMARY.md"
echo ""
