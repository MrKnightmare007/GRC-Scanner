# ⚡ Quick Deployment Guide

## 🎯 What You Need
- GitHub account
- Railway account (free)
- Vercel account (free)

## 🚀 Step-by-Step Commands

### 1️⃣ Generate Secret Keys
```bash
cd GrcScanner
python generate_secrets.py
```
**📝 Copy the generated keys - you'll need them for Railway!**

### 2️⃣ Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: GRC Scanner application"
git remote add origin https://github.com/YOUR_USERNAME/grc-scanner.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy Backend (Railway)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `grc-scanner` repository
5. Choose `backend` as root directory
6. Add these environment variables in Railway:
   ```
   SECRET_KEY=your-generated-secret-key
   JWT_SECRET_KEY=your-generated-jwt-secret
   FLASK_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
7. Add PostgreSQL database: "New" → "Database" → "PostgreSQL"
8. Deploy! 🚀

### 4️⃣ Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project" → Import your `grc-scanner` repo
4. Set Root Directory to `frontend`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy! 🚀

### 5️⃣ Connect Frontend to Backend
1. Copy your Vercel URL (e.g., `https://grc-scanner-abc123.vercel.app`)
2. Go back to Railway → Variables
3. Update `FRONTEND_URL` with your actual Vercel URL
4. Redeploy backend

### 6️⃣ Test Your App
- Visit your Vercel URL
- Register a new account
- Try scanning a website
- Download a PDF report

## 🎉 You're Live!

Your GRC Scanner is now deployed on:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app

## 🔧 Local Development

To run locally:
```bash
python start_dev.py
```

## 📚 Need Help?

- Check `DEPLOYMENT_CHECKLIST.md` for detailed steps
- Check `DEPLOYMENT.md` for troubleshooting
- Check Railway/Vercel logs for errors

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Monitoring**: Check Railway dashboard for backend health
3. **Updates**: Push to GitHub → auto-deploys to Railway/Vercel
4. **Scaling**: Both platforms auto-scale with usage

---

**🛡️ Your cybersecurity scanner is now protecting the web!**