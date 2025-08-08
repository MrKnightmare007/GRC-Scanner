#!/bin/bash
# Production build script for frontend

echo "🏗️ Building GRC Scanner Frontend for Production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed! Files are in the 'build' directory."
echo "🚀 Ready for deployment to Vercel!"