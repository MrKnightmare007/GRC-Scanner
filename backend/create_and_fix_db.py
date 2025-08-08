#!/usr/bin/env python3
"""
Create database with original schema, then add missing columns
"""

import sqlite3
import os

def create_and_fix_database():
    """Create database and add all necessary columns"""
    
    db_path = 'grc_scanner.db'
    
    # Remove existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")
    
    # Create new database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create user table
        cursor.execute('''
            CREATE TABLE user (
                id INTEGER PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                password_hash VARCHAR(120) NOT NULL
            )
        ''')
        print("Created 'user' table")
        
        # Create scan_history table with all columns
        cursor.execute('''
            CREATE TABLE scan_history (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                url VARCHAR(200) NOT NULL,
                scan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                report_path VARCHAR(200),
                status VARCHAR(50) DEFAULT 'Pending' NOT NULL,
                progress VARCHAR(100),
                scan_results TEXT,
                FOREIGN KEY (user_id) REFERENCES user (id)
            )
        ''')
        print("Created 'scan_history' table with all columns")
        
        conn.commit()
        print(f"Database created successfully at: {os.path.abspath(db_path)}")
        
        # Verify the table structure
        cursor.execute("PRAGMA table_info(scan_history)")
        columns = cursor.fetchall()
        print("Scan history table columns:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
            
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    create_and_fix_database()