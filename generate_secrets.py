#!/usr/bin/env python3
"""
Generate secure secret keys for production deployment
"""
import secrets

def generate_secret_keys():
    """Generate secure secret keys for Flask and JWT"""
    print("🔐 Generating secure secret keys for production...")
    print()
    
    secret_key = secrets.token_urlsafe(32)
    jwt_secret = secrets.token_urlsafe(32)
    
    print("Add these to your Railway environment variables:")
    print("=" * 50)
    print(f"SECRET_KEY={secret_key}")
    print(f"JWT_SECRET_KEY={jwt_secret}")
    print("=" * 50)
    print()
    
    print("💡 Tips:")
    print("1. Copy these keys to Railway dashboard → Variables")
    print("2. Never commit these keys to GitHub")
    print("3. Generate new keys if compromised")
    print()
    
    return secret_key, jwt_secret

if __name__ == "__main__":
    generate_secret_keys()