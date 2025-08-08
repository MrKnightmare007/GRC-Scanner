# 🚀 Deployment Checklist

## Pre-Deployment Preparation

### ✅ Code Preparation
- [ ] All code committed and pushed to GitHub
- [ ] Environment variables configured
- [ ] Production dependencies installed
- [ ] Database migrations ready
- [ ] CORS settings configured

### ✅ Security
- [ ] Secret keys generated (use `python generate_secrets.py`)
- [ ] No sensitive data in code
- [ ] .env files in .gitignore
- [ ] JWT secrets are strong (32+ characters)

## GitHub Setup

### ✅ Repository
- [ ] GitHub repository created
- [ ] Repository is public (required for free hosting)
- [ ] README.md updated with your info
- [ ] .gitignore configured properly

### ✅ Commands to Run
```bash
cd GrcScanner
git init
git add .
git commit -m "Initial commit: GRC Scanner application"
git remote add origin https://github.com/YOUR_USERNAME/grc-scanner.git
git branch -M main
git push -u origin main
```

## Backend Deployment (Railway)

### ✅ Railway Setup
- [ ] Railway account created
- [ ] New project created from GitHub repo
- [ ] Backend folder selected as root directory

### ✅ Environment Variables in Railway
```
SECRET_KEY=your-generated-secret-key
JWT_SECRET_KEY=your-generated-jwt-secret
FLASK_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### ✅ Database
- [ ] PostgreSQL database added to Railway project
- [ ] DATABASE_URL automatically configured
- [ ] Database tables will be created on first run

### ✅ Deployment Files
- [ ] `requirements.txt` - Python dependencies
- [ ] `Procfile` - Gunicorn web server
- [ ] `runtime.txt` - Python version
- [ ] `railway.json` - Railway configuration

## Frontend Deployment (Vercel)

### ✅ Vercel Setup
- [ ] Vercel account created
- [ ] New project imported from GitHub
- [ ] Root directory set to `frontend`

### ✅ Environment Variables in Vercel
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### ✅ Build Configuration
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`
- [ ] Install command: `npm install`

## Post-Deployment

### ✅ Testing
- [ ] Frontend loads without errors
- [ ] Backend API responds (check /health endpoint)
- [ ] User registration works
- [ ] User login works
- [ ] Security scanning works
- [ ] PDF download works
- [ ] CORS is properly configured

### ✅ Final Configuration
- [ ] Update FRONTEND_URL in Railway with actual Vercel URL
- [ ] Test cross-origin requests
- [ ] Verify all features work in production

## Troubleshooting

### Common Issues:

**CORS Errors:**
- Check FRONTEND_URL matches Vercel URL exactly
- No trailing slashes in URLs
- Both HTTP and HTTPS protocols match

**Database Connection:**
- Verify PostgreSQL is running in Railway
- Check DATABASE_URL is set
- Tables are created automatically

**Build Failures:**
- Check all dependencies in requirements.txt
- Verify Python version compatibility
- Check for missing environment variables

**API Connection:**
- Verify REACT_APP_API_URL is correct
- Check backend is deployed and running
- Test API endpoints directly

## URLs to Update

After deployment, update these in your documentation:

- **Frontend URL**: `https://your-app-name.vercel.app`
- **Backend URL**: `https://your-app-name.railway.app`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/grc-scanner`

## Success Criteria

Your deployment is successful when:
- ✅ Users can register and login
- ✅ Security scans complete successfully
- ✅ PDF reports download properly
- ✅ All animations and UI work correctly
- ✅ No console errors in browser
- ✅ Backend logs show no critical errors

## Next Steps

After successful deployment:
1. Share your live application URL
2. Add screenshots to README.md
3. Consider custom domain setup
4. Monitor usage and performance
5. Plan for scaling if needed

---

**🎉 Congratulations! Your GRC Scanner is now live!**