# 🔧 GRC Scanner Troubleshooting Guide

## 🚨 Current Issue: 401 Unauthorized Errors

The application is showing 401 (UNAUTHORIZED) errors, which means there's an authentication problem.

## 🔍 Quick Diagnosis Steps

### 1. Check Backend Server
Make sure your Flask backend is running:
```bash
cd GrcScanner/backend
python app.py
```

You should see output like:
```
* Running on http://127.0.0.1:5000
* Debug mode: on
```

### 2. Test Backend Health
Open your browser and go to: http://localhost:5000/health

You should see:
```json
{
  "status": "healthy",
  "message": "GRC Scanner API is running",
  "version": "1.0.0"
}
```

### 3. Check Frontend Connection
The frontend should be running on: http://localhost:3000

### 4. Authentication Debug
When you access the dashboard, you'll see a debug panel that shows:
- Token status
- Backend connection status
- Authentication status

## 🛠️ Common Solutions

### Solution 1: Fresh Login
1. Go to the login page
2. Clear browser storage (F12 → Application → Local Storage → Clear)
3. Register a new account or login with existing credentials
4. Try accessing the dashboard again

### Solution 2: Backend Database Reset
If you're having database issues:
```bash
cd GrcScanner/backend
python create_and_fix_db.py
```

### Solution 3: CORS Issues
If you see CORS errors, make sure the backend has CORS enabled (it should be already).

### Solution 4: Port Conflicts
- Backend should run on port 5000
- Frontend should run on port 3000
- Make sure no other applications are using these ports

## 🔍 Debug Information

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Check Backend Logs
Look at the terminal where you're running the Flask app for error messages.

### Token Issues
The app uses JWT tokens for authentication. If you see token-related errors:
1. Clear browser storage
2. Login again
3. Check if the token is being stored properly

## 📋 Step-by-Step Restart

1. **Stop both servers** (Ctrl+C in both terminals)

2. **Start backend**:
   ```bash
   cd GrcScanner/backend
   python app.py
   ```

3. **Start frontend** (in new terminal):
   ```bash
   cd GrcScanner/frontend
   npm start
   ```

4. **Clear browser data**:
   - Open http://localhost:3000
   - Press F12
   - Go to Application → Storage → Clear storage
   - Refresh the page

5. **Register/Login**:
   - Create a new account or login
   - Check the debug panel on the dashboard

## 🆘 If Still Not Working

1. **Check the debug panel** on the dashboard for specific error messages
2. **Look at browser console** for JavaScript errors
3. **Check backend terminal** for Python errors
4. **Verify database** exists and has correct schema

## 📞 Common Error Messages

### "Session expired. Please login again"
- Your JWT token has expired
- Solution: Login again

### "Backend is not accessible"
- Flask server is not running
- Solution: Start the backend server

### "Failed to fetch scan history"
- Database or authentication issue
- Solution: Check backend logs and try fresh login

### Network errors
- Port conflicts or server not running
- Solution: Restart both servers on correct ports

---

**The debug panel will help identify the exact issue!** 🔍