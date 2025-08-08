#!/usr/bin/env python3
"""
Quick start script for local development
"""
import os
import subprocess
import sys
import time
from threading import Thread

def run_backend():
    """Start the Flask backend"""
    print("🔧 Starting Flask backend...")
    backend_dir = os.path.join(os.getcwd(), "backend")
    try:
        subprocess.run([sys.executable, "app.py"], cwd=backend_dir, check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend stopped")
    except Exception as e:
        print(f"❌ Backend error: {e}")

def run_frontend():
    """Start the React frontend"""
    print("⚛️ Starting React frontend...")
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    try:
        # Use shell=True on Windows to find npm
        if sys.platform.startswith('win'):
            subprocess.run(["npm", "start"], cwd=frontend_dir, shell=True, check=True)
        else:
            subprocess.run(["npm", "start"], cwd=frontend_dir, check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend stopped")
    except Exception as e:
        print(f"❌ Frontend error: {e}")
        print("💡 Try running manually: cd frontend && npm start")

def main():
    print("🛡️ GRC Scanner - Development Server")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists("backend") or not os.path.exists("frontend"):
        print("❌ Please run this script from the GrcScanner root directory")
        sys.exit(1)
    
    print("🚀 Starting development servers...")
    print("📍 Backend will run on: http://localhost:5000")
    print("📍 Frontend will run on: http://localhost:3000")
    print("\n⚠️ Press Ctrl+C to stop both servers")
    print("=" * 40)
    
    # Start backend in a separate thread
    backend_thread = Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Give backend time to start
    time.sleep(3)
    
    # Start frontend (this will block)
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down development servers...")
        print("✅ Development session ended")

if __name__ == "__main__":
    main()