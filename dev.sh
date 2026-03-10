#!/bin/bash

echo "🚀 Starting Lucas Portfolio Pro Dev Environment..."

echo "🛑 Cleaning up port 5173..."
fuser -k 5173/tcp 2>/dev/null

sleep 1

echo "⚡ Starting Vite Frontend..."
cd frontend
npm run dev

echo "🛑 Development environment stopped."