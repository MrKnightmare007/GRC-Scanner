from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import datetime
import os
import requests
import nmap
import json
from urllib.parse import urlparse
from fpdf import FPDF
from flask_cors import CORS
from enhanced_pdf_generator import generate_enhanced_pdf_report
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# CORS Configuration for production
CORS(app, 
     origins=['*'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=False)

# Database Configuration
database_url = os.getenv('DATABASE_URL')
if database_url:
    # Production database (PostgreSQL)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Development database (SQLite)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grc_scanner.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Security Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-change-in-production')

jwt = JWTManager(app)
db = SQLAlchemy(app)



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ScanHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    url = db.Column(db.String(200), nullable=False)
    scan_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    report_path = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(50), default='Pending', nullable=False)
    progress = db.Column(db.String(100), nullable=True)
    scan_results = db.Column(db.Text, nullable=True)  # Store JSON results

def check_security_headers(url, scan_id):
    headers_to_check = {
        'Strict-Transport-Security': 'HSTS',
        'X-Frame-Options': 'Clickjacking Protection',
        'X-Content-Type-Options': 'MIME Sniffing Protection',
        'Content-Security-Policy': 'CSP',
        'Referrer-Policy': 'Referrer Policy'
    }
    
    try:
        # Update progress
        scan_entry = ScanHistory.query.get(scan_id)
        if scan_entry:
            scan_entry.progress = "Checking Headers"
            db.session.commit()
            
        response = requests.get(url, timeout=10)
        present_headers = response.headers
        
        report = {"Security Headers": []}
        for header, description in headers_to_check.items():
            if header in present_headers:
                report["Security Headers"].append(f"[+] {description} ({header}): Present")
            else:
                report["Security Headers"].append(f"[-] {description} ({header}): Missing")
        return report, response

    except requests.exceptions.RequestException as e:
        return {"Error": f"Could not connect to {url}. Error: {e}"}, None

def check_owasp_top_10(response, scan_id):
    report = {"OWASP Top 10": []}
    
    if 'Set-Cookie' in response.headers:
        cookies = response.headers['Set-Cookie']
        if 'secure' not in cookies.lower():
            report["OWASP Top 10"].append("[-] Insecure Cookies: 'secure' flag not set.")
        if 'httponly' not in cookies.lower():
            report["OWASP Top 10"].append("[-] Insecure Cookies: 'HttpOnly' flag not set.")
    
    if 'Server' in response.headers:
        report["OWASP Top 10"].append(f"[-] Server Software Disclosure: {response.headers['Server']}")
        
    return report

def port_scan(url, scan_id):
    report = {"Port Scan": []}
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname
        
        # Update progress
        scan_entry = ScanHistory.query.get(scan_id)
        if scan_entry:
            scan_entry.progress = "Scanning open ports - 1/447"
            db.session.commit()
        
        # Try to initialize nmap scanner with different paths
        nm = None
        nmap_paths = [
            None,  # Default system path
            "/usr/bin/nmap",  # Linux
            "/usr/local/bin/nmap",  # macOS/Linux
            "C:/Program Files (x86)/Nmap/nmap.exe",  # Windows
        ]
        
        for nmap_path in nmap_paths:
            try:
                if nmap_path:
                    nm = nmap.PortScanner(nmap_search_path=(nmap_path,))
                else:
                    nm = nmap.PortScanner()
                break
            except:
                continue
        
        if nm:
            # Scanning fewer ports for a quicker test
            nm.scan(hostname, '80,443,22,21,25,53,110,143,993,995')
            
            for host in nm.all_hosts():
                for proto in nm[host].all_protocols():
                    lport = nm[host][proto].keys()
                    for port in lport:
                        state = nm[host][proto][port]['state']
                        if state == 'open':
                            report["Port Scan"].append(f"[+] Open port: {port}/{proto}")
                        else:
                            report["Port Scan"].append(f"[-] Port {port}/{proto}: {state}")
        else:
            # Fallback: Basic connectivity test
            import socket
            common_ports = [80, 443, 22, 21, 25, 53]
            for port in common_ports:
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(3)
                    result = sock.connect_ex((hostname, port))
                    if result == 0:
                        report["Port Scan"].append(f"[+] Open port: {port}/tcp")
                    sock.close()
                except:
                    pass
            
            if not any("[+]" in item for item in report["Port Scan"]):
                report["Port Scan"].append("[-] No open ports detected (limited scan)")
                
    except Exception as e:
        report["Port Scan"].append(f"[-] Port scan error: {e}")
    return report

def generate_pdf_report(scan_id, url, security_headers_report, owasp_report, port_scan_report):
    """Fallback PDF generator with basic styling"""
    from datetime import datetime
    
    pdf = FPDF()
    pdf.add_page()
    
    # Define colors (RGB values)
    cyber_green = (0, 255, 65)
    electric_blue = (0, 102, 255)
    neon_pink = (255, 0, 102)
    dark_bg = (10, 10, 10)
    light_gray = (176, 176, 176)
    white = (255, 255, 255)
    red = (255, 0, 0)
    orange = (255, 170, 0)
    
    # Header Section with Branding
    pdf.set_fill_color(*dark_bg)
    pdf.rect(0, 0, 210, 40, 'F')
    
    # Title - Remove emoji for compatibility
    pdf.set_text_color(*cyber_green)
    pdf.set_font("Arial", 'B', 24)
    pdf.set_xy(20, 10)
    pdf.cell(0, 10, "GRC SCANNER", ln=True, align='L')
    
    pdf.set_font("Arial", 'B', 16)
    pdf.set_xy(20, 25)
    pdf.cell(0, 10, "SECURITY ASSESSMENT REPORT", ln=True, align='L')
    
    # Report Info Box
    pdf.set_fill_color(26, 26, 26)
    pdf.rect(15, 50, 180, 30, 'F')
    
    pdf.set_text_color(*white)
    pdf.set_font("Arial", 'B', 12)
    pdf.set_xy(20, 55)
    pdf.cell(0, 8, f"Target URL: {url}", ln=True, align='L')
    
    pdf.set_font("Arial", '', 10)
    pdf.set_xy(20, 65)
    pdf.cell(0, 6, f"Scan ID: {scan_id}", ln=True, align='L')
    pdf.set_xy(20, 72)
    pdf.cell(0, 6, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}", ln=True, align='L')
    
    # Current Y position
    y_pos = 90
    
    # Security Headers Section
    pdf.set_xy(15, y_pos)
    pdf.set_fill_color(*cyber_green)
    pdf.set_text_color(*dark_bg)
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(180, 10, "[SECURITY] HEADERS ANALYSIS", ln=True, align='L', fill=True)
    y_pos += 15
    
    if "Security Headers" in security_headers_report:
        for item in security_headers_report["Security Headers"]:
            pdf.set_xy(20, y_pos)
            
            # Color code based on status
            if "[+]" in item:
                pdf.set_text_color(*cyber_green)
                status_icon = "[+]"
            else:
                pdf.set_text_color(*red)
                status_icon = "[-]"
            
            pdf.set_font("Arial", '', 10)
            # Clean the item text
            clean_item = item.replace("[+]", "").replace("[-]", "").strip()
            pdf.cell(0, 8, f"{status_icon} {clean_item}", ln=True, align='L')
            y_pos += 8
    
    y_pos += 10
    
    # OWASP Top 10 Section
    if "OWASP Top 10" in owasp_report and owasp_report["OWASP Top 10"]:
        pdf.set_xy(15, y_pos)
        pdf.set_fill_color(*orange)
        pdf.set_text_color(*dark_bg)
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(180, 10, "[OWASP] TOP 10 ANALYSIS", ln=True, align='L', fill=True)
        y_pos += 15
        
        for item in owasp_report["OWASP Top 10"]:
            pdf.set_xy(20, y_pos)
            pdf.set_text_color(*orange)
            pdf.set_font("Arial", '', 10)
            # Clean the item text
            clean_item = item.replace("[-]", "").strip()
            pdf.cell(0, 8, f"[!] {clean_item}", ln=True, align='L')
            y_pos += 8
        
        y_pos += 10
    
    # Port Scan Section
    if "Port Scan" in port_scan_report and port_scan_report["Port Scan"]:
        pdf.set_xy(15, y_pos)
        pdf.set_fill_color(*electric_blue)
        pdf.set_text_color(*white)
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(180, 10, "[NETWORK] PORT SCAN ANALYSIS", ln=True, align='L', fill=True)
        y_pos += 15
        
        for item in port_scan_report["Port Scan"]:
            pdf.set_xy(20, y_pos)
            
            # Color code based on status
            if "[+]" in item:
                pdf.set_text_color(*cyber_green)
                status_icon = "[+]"
            else:
                pdf.set_text_color(*red)
                status_icon = "[-]"
            
            pdf.set_font("Arial", '', 10)
            # Clean the item text
            clean_item = item.replace("[+]", "").replace("[-]", "").strip()
            pdf.cell(0, 8, f"{status_icon} {clean_item}", ln=True, align='L')
            y_pos += 8
    
    # Summary Section
    y_pos += 15
    pdf.set_xy(15, y_pos)
    pdf.set_fill_color(*neon_pink)
    pdf.set_text_color(*white)
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(180, 10, "[SUMMARY] SECURITY ASSESSMENT", ln=True, align='L', fill=True)
    y_pos += 15
    
    # Calculate summary stats
    total_headers = len(security_headers_report.get("Security Headers", []))
    secure_headers = len([item for item in security_headers_report.get("Security Headers", []) if "[+]" in item])
    
    total_owasp = len(owasp_report.get("OWASP Top 10", []))
    total_ports = len([item for item in port_scan_report.get("Port Scan", []) if "[+]" in item])
    
    pdf.set_text_color(*white)
    pdf.set_font("Arial", '', 11)
    
    pdf.set_xy(20, y_pos)
    pdf.cell(0, 8, f"Security Headers: {secure_headers}/{total_headers} implemented", ln=True, align='L')
    y_pos += 8
    
    pdf.set_xy(20, y_pos)
    pdf.cell(0, 8, f"OWASP Vulnerabilities: {total_owasp} issues found", ln=True, align='L')
    y_pos += 8
    
    pdf.set_xy(20, y_pos)
    pdf.cell(0, 8, f"Open Ports: {total_ports} ports accessible", ln=True, align='L')
    y_pos += 8
    
    # Security Score
    security_score = max(0, 100 - (total_owasp * 10) - ((total_headers - secure_headers) * 5))
    
    pdf.set_xy(20, y_pos + 5)
    pdf.set_font("Arial", 'B', 12)
    if security_score >= 80:
        pdf.set_text_color(*cyber_green)
        score_status = "EXCELLENT"
    elif security_score >= 60:
        pdf.set_text_color(*orange)
        score_status = "GOOD"
    else:
        pdf.set_text_color(*red)
        score_status = "NEEDS IMPROVEMENT"
    
    pdf.cell(0, 10, f"Overall Security Score: {security_score}/100 ({score_status})", ln=True, align='L')
    
    # Footer
    pdf.set_xy(15, 280)
    pdf.set_fill_color(*dark_bg)
    pdf.rect(15, 280, 180, 15, 'F')
    
    pdf.set_text_color(*cyber_green)
    pdf.set_font("Arial", '', 8)
    pdf.set_xy(20, 285)
    pdf.cell(0, 5, "Generated by GRC Scanner - Advanced Cybersecurity Assessment Platform", ln=True, align='L')
    pdf.set_xy(20, 290)
    pdf.cell(0, 5, f"Report ID: {scan_id} | For more information, visit our security dashboard", ln=True, align='L')
    
    report_path = f"reports/{scan_id}_{urlparse(url).hostname}_security_report.pdf"
    pdf.output(report_path)
    return report_path

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or not 'username' in data or not 'password' in data:
            return jsonify({'message': 'Missing username or password'}), 400

        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'User already exists'}), 400

        new_user = User(username=data['username'])
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'message': 'Missing username or password'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token)

@app.route('/scan', methods=['POST'])
@jwt_required()
def scan():
    data = request.get_json()
    if not data or not 'url' in data:
        return jsonify({'message': 'Missing URL'}), 400

    url = data['url']
    user_id = get_jwt_identity()
    
    new_scan = ScanHistory(user_id=user_id, url=url, status='Pending', progress='Initializing scan...')
    db.session.add(new_scan)
    db.session.commit()

    try:
        # Update status to Scanning
        new_scan.status = 'Scanning'
        new_scan.progress = 'Starting security scan...'
        db.session.commit()

        security_headers_report, response = check_security_headers(url, new_scan.id)
        
        if response:
            # Update progress for OWASP analysis
            new_scan.progress = 'Analyzing OWASP vulnerabilities...'
            db.session.commit()

            owasp_report = check_owasp_top_10(response, new_scan.id)
            port_scan_report = port_scan(url, new_scan.id)
            
            # Update status to Generating Report
            new_scan.status = 'Generating Report'
            new_scan.progress = 'Generating PDF report...'
            db.session.commit()

            # Generate enhanced PDF report
            try:
                report_path = generate_enhanced_pdf_report(new_scan.id, url, security_headers_report, owasp_report, port_scan_report)
            except Exception as pdf_error:
                print(f"Enhanced PDF generation failed, falling back to basic: {pdf_error}")
                report_path = generate_pdf_report(new_scan.id, url, security_headers_report, owasp_report, port_scan_report)
            new_scan.report_path = report_path
            
            # Store scan results as JSON
            scan_results = {
                'security_headers': security_headers_report,
                'owasp_analysis': owasp_report,
                'port_scan': port_scan_report
            }
            new_scan.scan_results = json.dumps(scan_results)
            
            # Update status to Completed
            new_scan.status = 'Completed'
            new_scan.progress = 'Scan completed successfully'
            db.session.commit()
            
            return jsonify({
                'report_id': new_scan.id, 
                'report_path': report_path, 
                'status': new_scan.status,
                'scan_results': scan_results
            }), 200
        else:
            new_scan.status = 'Failed'
            new_scan.progress = 'Failed to connect to target URL'
            db.session.commit()
            return jsonify(security_headers_report), 400
    except Exception as e:
        new_scan.status = 'Failed'
        new_scan.progress = f'Scan failed: {str(e)}'
        db.session.commit()
        return jsonify({'message': f'Scan failed: {str(e)}'}), 500

@app.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    
    scans = ScanHistory.query.filter_by(user_id=user_id).all()
    
    output = []
    for scan in scans:
        scan_data = {}
        scan_data['id'] = scan.id
        scan_data['url'] = scan.url
        scan_data['scan_date'] = scan.scan_date
        scan_data['report_path'] = scan.report_path
        scan_data['status'] = scan.status
        scan_data['progress'] = scan.progress
        
        # Include scan results if available
        if scan.scan_results:
            scan_data['scan_results'] = json.loads(scan.scan_results)
            
        output.append(scan_data)
        
    return jsonify({'scans': output})

@app.route('/scan/status/<int:scan_id>', methods=['GET'])
@jwt_required()
def get_scan_status(scan_id):
    scan_entry = ScanHistory.query.get(scan_id)
    if scan_entry:
        response_data = {
            'id': scan_entry.id, 
            'status': scan_entry.status,
            'progress': scan_entry.progress
        }
        
        # If scan is completed, include results
        if scan_entry.status == 'Completed' and scan_entry.scan_results:
            response_data['scan_results'] = json.loads(scan_entry.scan_results)
            
        return jsonify(response_data), 200
    return jsonify({'message': 'Scan not found'}), 404

@app.route('/report/pdf/<int:scan_id>', methods=['GET'])
def get_pdf_report(scan_id):
    scan_entry = ScanHistory.query.get(scan_id)
    if scan_entry and scan_entry.report_path and os.path.exists(scan_entry.report_path):
        return send_file(scan_entry.report_path, as_attachment=True, download_name=f'scan_report_{scan_id}.pdf')
    return jsonify({'message': 'Report not found'}), 404

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'GRC Scanner API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'register': '/register',
            'login': '/login',
            'scan': '/scan',
            'history': '/history'
        }
    }), 200

@app.route('/debug', methods=['GET'])
def debug():
    return jsonify({
        'database_url_exists': bool(os.getenv('DATABASE_URL')),
        'database_uri': app.config['SQLALCHEMY_DATABASE_URI'][:50] + '...' if len(app.config['SQLALCHEMY_DATABASE_URI']) > 50 else app.config['SQLALCHEMY_DATABASE_URI'],
        'environment': os.getenv('FLASK_ENV', 'not_set')
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        from sqlalchemy import text
        db.session.execute(text('SELECT 1'))
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'message': 'GRC Scanner API is running',
        'version': '1.0.0',
        'database': db_status
    }), 200

# Initialize database and directories
def init_app():
    try:
        with app.app_context():
            # Force table creation
            db.drop_all()  # Remove existing tables
            db.create_all()  # Create fresh tables
            print("Database tables created successfully")
        # Ensure reports directory exists
        if not os.path.exists('reports'):
            os.makedirs('reports')
        print("App initialization completed successfully")
    except Exception as e:
        print(f"App initialization error: {e}")

# Initialize on import
init_app()

if __name__ == '__main__':
    # Run the application
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)