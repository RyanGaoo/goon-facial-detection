#!/bin/bash

# Facial Recognition App Launcher
echo "🎭 Starting Facial Recognition App..."

# Navigate to app directory
cd "$(dirname "$0")"

# Activate virtual environment and start the app
source .venv/bin/activate
python app.py
