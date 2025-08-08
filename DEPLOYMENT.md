# GRC Scanner Deployment Guide
## 🚀 Free Hosting Deployment Guide

### 📋 Prerequisites
- GitHub account
- Railway account (for backend)
- Vercel account (for frontend)

### 🔧 What We've Prepared
✅ Production-ready backend with environment variables
✅ PostgreSQL database support
✅ CORS configuration for production
✅ Gunicorn WSGI server
✅ Environment-based API URLs
✅ Deployment configuration files

---

## 📦 Step 1: GitHub Setup

### 1.1 Initialize Git Repository
```bash
cd GrcScanner
git init
git add .
git commit -m "Initial commit: GRC Scanner application"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `grc-scanner`
3. Description: `Advanced cybersecurity scanning platform`
4. Make it Public (required for free hosting)
5. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/grc-scanner.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Backend Deployment (Railway)

### 2.1 Setup Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `grc-scanner` repository
6. Select the `backend` folder

### 2.2 Configure Environment Variables
In Railway dashboard, go to Variables tab and add:
```
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
JWT_SECRET_KEY=your-jwt-secret-key-here-also-long-and-random
FLASK_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### 2.3 Add PostgreSQL Database
1. In Railway, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically set DATABASE_URL

### 2.4 Deploy
- Railway will automatically deploy your backend
- Note your backend URL: `https://your-app-name.railway.app`

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Setup Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your `grc-scanner` repository
5. Set Root Directory to `frontend`

### 3.2 Configure Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### 3.3 Deploy
- Vercel will automatically build and deploy
- Your frontend URL: `https://your-app-name.vercel.app`

---

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update Backend CORS
Go back to Railway and update the FRONTEND_URL variable:
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

### 4.2 Test the Connection
1. Visit your Vercel URL
2. Try registering a new account
3. Test the scanning functionality

---

## 🛠️ Step 5: Post-Deployment Setup

### 5.1 Custom Domain (Optional)
- **Vercel**: Settings → Domains → Add your domain
- **Railway**: Settings → Domains → Add your domain

### 5.2 Environment Security
- Generate strong secret keys (32+ characters)
- Never commit .env files to GitHub
- Use Railway/Vercel environment variables

### 5.3 Database Migration
Your PostgreSQL database will be empty initially. The app will create tables automatically on first run.

---

## 🔍 Troubleshooting

### Common Issues:

**CORS Errors:**
- Check FRONTEND_URL in Railway matches your Vercel URL exactly
- Ensure no trailing slashes

**Database Errors:**
- Verify DATABASE_URL is set in Railway
- Check PostgreSQL service is running

**Build Errors:**
- Check all dependencies in requirements.txt
- Verify Python version in runtime.txt

**API Connection Errors:**
- Verify REACT_APP_API_URL in Vercel
- Check backend is deployed and running

---

## 📊 Monitoring

### Railway (Backend):
- View logs in Railway dashboard
- Monitor resource usage
- Check deployment status

### Vercel (Frontend):
- View build logs
- Monitor function executions
- Check deployment status

---

## 💰 Free Tier Limits

### Railway:
- $5/month credit (usually enough for small apps)
- 500 hours/month execution time
- 1GB RAM, 1 vCPU

### Vercel:
- 100GB bandwidth/month
- 6,000 build minutes/month
- Unlimited static deployments

---

## 🎯 Quick Commands Summary

```bash
# GitHub setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/grc-scanner.git
git push -u origin main

# Generate secret keys (run in terminal)
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Railway backend deployed with PostgreSQL
- [ ] Environment variables configured in Railway
- [ ] Vercel frontend deployed
- [ ] REACT_APP_API_URL configured in Vercel
- [ ] FRONTEND_URL updated in Railway
- [ ] Test registration and login
- [ ] Test scanning functionality
- [ ] Test PDF download

**Your GRC Scanner is now live! 🎉**