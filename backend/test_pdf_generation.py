#!/usr/bin/env python3
"""
Test script to generate a sample PDF report
"""

import os
from enhanced_pdf_generator import generate_enhanced_pdf_report

def test_pdf_generation():
    """Generate a test PDF report"""
    
    # Sample data
    scan_id = 999
    url = "https://example.com"
    
    security_headers_report = {
        "Security Headers": [
            "[+] Clickjacking Protection (X-Frame-Options): Present",
            "[-] HSTS (Strict-Transport-Security): Missing",
            "[-] MIME Sniffing Protection (X-Content-Type-Options): Missing",
            "[+] CSP (Content-Security-Policy): Present",
            "[-] Referrer Policy (Referrer-Policy): Missing"
        ]
    }
    
    owasp_report = {
        "OWASP Top 10": [
            "[-] Insecure Cookies: 'secure' flag not set.",
            "[-] Insecure Cookies: 'HttpOnly' flag not set.",
            "[-] Server Software Disclosure: Apache/2.4.41"
        ]
    }
    
    port_scan_report = {
        "Port Scan": [
            "[+] Open port: 80/tcp",
            "[+] Open port: 443/tcp",
            "[+] Open port: 22/tcp"
        ]
    }
    
    # Ensure reports directory exists
    if not os.path.exists('reports'):
        os.makedirs('reports')
    
    try:
        report_path = generate_enhanced_pdf_report(
            scan_id, url, security_headers_report, owasp_report, port_scan_report
        )
        print(f"✅ Enhanced PDF report generated successfully: {report_path}")
        print(f"📄 File size: {os.path.getsize(report_path)} bytes")
        return True
    except Exception as e:
        print(f"❌ PDF generation failed: {e}")
        return False

if __name__ == '__main__':
    print("🛡️ Testing Enhanced PDF Generation...")
    success = test_pdf_generation()
    if success:
        print("🎉 Test completed successfully!")
    else:
        print("💥 Test failed!")