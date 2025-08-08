import requests
import argparse
import nmap
from urllib.parse import urlparse

def check_security_headers(url):
    """
    Checks for the presence of important security headers in a web application.
    """
    headers_to_check = {
        'Strict-Transport-Security': 'HSTS',
        'X-Frame-Options': 'Clickjacking Protection',
        'X-Content-Type-Options': 'MIME Sniffing Protection',
        'Content-Security-Policy': 'CSP',
        'Referrer-Policy': 'Referrer Policy'
    }
    
    try:
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

def check_owasp_top_10(response):
    """
    Performs a basic check for common OWASP Top 10 vulnerabilities.
    """
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

def port_scan(url):
    """
    Performs a basic port scan on the target host.
    """
    report = {"Port Scan": []}
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname
        nm = nmap.PortScanner(nmap_search_path=("C:/Program Files (x86)/Nmap/nmap.exe", ))
        # Scanning fewer ports for a quicker test
        nm.scan(hostname, '80,443')
        
        for host in nm.all_hosts():
            for proto in nm[host].all_protocols():
                lport = nm[host][proto].keys()
                for port in lport:
                    report["Port Scan"].append(f"[+] Open port: {port}/{proto}")
    except Exception as e:
        report["Port Scan"].append(f"[-] Port scan error: {e}")
    return report

def generate_report(url, security_headers_report, owasp_report, port_scan_report):
    """
    Generates a formatted report of the scan results.
    """
    print("\n--- Risk & Compliance Report ---")
    print(f"URL: {url}")
    print("\n--- Security Header Analysis ---")
    for item in security_headers_report["Security Headers"]:
        print(item)
    
    if "OWASP Top 10" in owasp_report:
        print("\n--- OWASP Top 10 Analysis ---")
        for item in owasp_report["OWASP Top 10"]:
            print(item)
            
    if "Port Scan" in port_scan_report:
        print("\n--- Port Scan Analysis ---")
        for item in port_scan_report["Port Scan"]:
            print(item)

def main():
    """
    Main function to run the web security scanner.
    """
    parser = argparse.ArgumentParser(description='Web Application Security Scanner')
    parser.add_argument('url', help='The URL of the web application to scan.')
    args = parser.parse_args()
    
    print(f"Scanning {args.url}...")
    
    print("[1/3] Performing Security Header Analysis...")
    security_headers_report, response = check_security_headers(args.url)
    
    print("[2/3] Performing Port Scan (this may take a moment)...")
    port_scan_report = port_scan(args.url)
    
    if response:
        print("[3/3] Performing OWASP Top 10 Analysis...")
        owasp_report = check_owasp_top_10(response)
        generate_report(args.url, security_headers_report, owasp_report, port_scan_report)
    else:
        print(security_headers_report["Error"])

if __name__ == "__main__":
    main()
