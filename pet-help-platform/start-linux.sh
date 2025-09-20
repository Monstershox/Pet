#!/bin/bash

echo "Starting Pet Help Platform on Linux..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.8 or higher${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher${NC}"
    exit 1
fi

echo -e "${GREEN}Starting Backend...${NC}"

# Start backend in new terminal
gnome-terminal -- bash -c "cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cp .env.example .env 2>/dev/null || true && python main.py; exec bash" 2>/dev/null || \
xterm -e "cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cp .env.example .env 2>/dev/null || true && python main.py; bash" 2>/dev/null || \
konsole -e "cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cp .env.example .env 2>/dev/null || true && python main.py; bash" 2>/dev/null &

echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
sleep 5

echo -e "${GREEN}Starting Frontend...${NC}"

# Start frontend in new terminal
gnome-terminal -- bash -c "cd frontend && npm install && npm run dev; exec bash" 2>/dev/null || \
xterm -e "cd frontend && npm install && npm run dev; bash" 2>/dev/null || \
konsole -e "cd frontend && npm install && npm run dev; bash" 2>/dev/null &

echo -e "${GREEN}✓ Pet Help Platform is starting!${NC}"
echo -e "${YELLOW}Frontend will be available at: http://localhost:3000${NC}"
echo -e "${YELLOW}Backend API will be available at: http://localhost:8000${NC}"
echo ""
echo "Press Ctrl+C in each terminal window to stop the servers"