#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"