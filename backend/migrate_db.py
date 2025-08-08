#!/usr/bin/env python3
"""
Simple database migration script to add new columns to ScanHistory table
"""

import sqlite3
import os

def migrate_database():
    # Try multiple possible database locations
    possible_paths = [
        'grc_scanner.db',
        'instance/grc_scanner.db',
        '../instance/grc_scanner.db'
    ]
    
    db_path = None
    for path in possible_paths:
        if os.path.exists(path):
            db_path = path
            break
    
    if not db_path:
        print("Database doesn't exist yet. It will be created when you run the app.")
        return
    
    print(f"Found database at: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(scan_history)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add progress column if it doesn't exist
        if 'progress' not in columns:
            cursor.execute('ALTER TABLE scan_history ADD COLUMN progress VARCHAR(100)')
            print("Added 'progress' column to scan_history table")
        
        # Add scan_results column if it doesn't exist
        if 'scan_results' not in columns:
            cursor.execute('ALTER TABLE scan_history ADD COLUMN scan_results TEXT')
            print("Added 'scan_results' column to scan_history table")
        
        conn.commit()
        print("Database migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    
    finally:
        conn.close()

if __name__ == '__main__':
    migrate_database()