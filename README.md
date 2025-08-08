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

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API**: [https://your-app.railway.app](https://your-app.railway.app)

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
git clone https://github.com/YOUR_USERNAME/grc-scanner.git
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

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions using:
- **Railway** (Backend)
- **Vercel** (Frontend)
- **PostgreSQL** (Database)

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