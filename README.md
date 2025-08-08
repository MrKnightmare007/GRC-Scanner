# ���️ GRC Scanner
**Advanced Cybersecurity Scanning Platform**

A comprehensive web application security assessment tool that identifies vulnerabilities, analyzes security headers, and generates detailed compliance reports.

## ✨ Features

- 🔒 **Security Headers Analysis** - Comprehensive HTTP security header checking
- 🐛 **OWASP Top 10 Detection** - Vulnerability identification based on OWASP standards
- 🌐 **Port Scanning** - Network service discovery and analysis
- 📊 **Detailed Reports** - Professional PDF reports with actionable insights
- 🎨 **Modern UI** - Cybersecurity-themed interface with animations
- 🔐 **User Authentication** - Secure JWT-based authentication system

## 🚀 Live Demo

- **Frontend**: [https://grc-scanner.vercel.app](https://grc-scanner.vercel.app)
- **Backend API**: [https://grc-scanner-production.up.railway.app](https://grc-scanner-production.up.railway.app)

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **JWT** - Authentication
- **PostgreSQL** - Production database
- **FPDF** - PDF report generation

### Frontend
- **React** - Modern UI framework
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Beautiful notifications
- **React Icons** - Comprehensive icon library

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (for production)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/MrKnightmare007/GRC-Scanner.git
cd grc-scanner
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Quick Start Commands
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend  
cd frontend
npm start
```

> **Note**: Development helper scripts are available locally but excluded from the repository to keep it clean.

## 🌐 Deployment

### Quick Deployment Steps

1. **Generate Security Keys**
```python
import secrets
print(f"SECRET_KEY={secrets.token_urlsafe(32)}")
print(f"JWT_SECRET_KEY={secrets.token_urlsafe(32)}")
```

2. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: GRC Scanner"
git remote add origin https://github.com/YOUR_USERNAME/grc-scanner.git
git push -u origin main
```

3. **Deploy Backend (Railway)**
- Go to https://railway.app
- Deploy from GitHub repo (select `backend` folder)
- Add environment variables (SECRET_KEY, JWT_SECRET_KEY, FLASK_ENV=production)
- Add PostgreSQL database

4. **Deploy Frontend (Vercel)**
- Go to https://vercel.com
- Import GitHub repo (set root to `frontend`)
- Add environment variable: `REACT_APP_API_URL=https://your-backend.railway.app`

5. **Connect & Test**
- Update `FRONTEND_URL` in Railway with your Vercel URL
- Test all functionality

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Security Dashboard
![Dashboard](screenshots/dashboard.png)

### Scan Results
![Results](screenshots/results.png)

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend (.env.production)**
```env
REACT_APP_API_URL=https://your-backend.railway.app
```

## 📊 Features Overview

### Security Analysis
- HTTP Security Headers (HSTS, CSP, X-Frame-Options, etc.)
- OWASP Top 10 vulnerability detection
- Network port scanning and service identification
- SSL/TLS configuration analysis

### Reporting
- Professional PDF reports with branding
- Color-coded security findings
- Executive summary with security scores
- Actionable recommendations

### User Experience
- Modern cybersecurity-themed UI
- Real-time scan progress tracking
- Animated transitions and feedback
- Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛡️ Security

This tool is designed for authorized security testing only. Users are responsible for ensuring they have proper authorization before scanning any systems.

## 📞 Support

- 📧 Email: support@grcscanner.com
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/grc-scanner/issues)
- 📖 Documentation: [Wiki](https://github.com/YOUR_USERNAME/grc-scanner/wiki)

## 🎯 Roadmap

- [ ] Additional vulnerability scanners
- [ ] Integration with external security APIs
- [ ] Scheduled scanning capabilities
- [ ] Team collaboration features
- [ ] Advanced reporting templates

---

**Made with ❤️ for cybersecurity professionals**