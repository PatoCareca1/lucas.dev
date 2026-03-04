#!/bin/bash

echo "🚀 Starting Lucas Portfolio Pro Dev Environment..."

echo "🛑 Cleaning up ports 8001 and 5173..."
fuser -k 8001/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

# Wait briefly for ports to clear
sleep 1

echo "🐍 Starting Django Backend on port 8001 in background..."
cd backend
source venv/bin/activate
python manage.py runserver 8001 &
BACKEND_PID=$!
cd ..

echo "⚡ Starting Vite Frontend..."
cd frontend
npm run dev

# When Vite stops (Ctrl+C), also kill the backend
kill $BACKEND_PID 2>/dev/null
echo "🛑 Development environment stopped."
