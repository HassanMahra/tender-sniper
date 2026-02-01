import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent / "tenders.db"

def init_db():
    """Initialize the SQLite database with the tenders table."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tenders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            full_text TEXT,
            analysis_json TEXT,
            source TEXT,
            published_at TEXT,
            link TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Simple migration: try adding column if it doesn't exist
    try:
        c.execute("ALTER TABLE tenders ADD COLUMN full_text TEXT")
    except sqlite3.OperationalError:
        # Column likely already exists
        pass

    try:
        c.execute("ALTER TABLE tenders ADD COLUMN status TEXT DEFAULT 'new'")
    except sqlite3.OperationalError:
        pass
        
    conn.commit()
    conn.close()

def tender_exists(link: str) -> bool:
    """Check if a tender with the given link already exists."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT 1 FROM tenders WHERE link = ?", (link,))
    exists = c.fetchone() is not None
    conn.close()
    return exists

def insert_tender(title: str, description: str, analysis_data: dict, source: str, published_at: str, link: str, full_text: str = "", status: str = "new"):
    """Insert a new tender into the database."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Convert analysis dict to JSON string
    analysis_json = json.dumps(analysis_data, ensure_ascii=False)
    
    try:
        c.execute('''
            INSERT INTO tenders (title, description, full_text, analysis_json, source, published_at, link, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (title, description, full_text, analysis_json, source, published_at, link, status))
        conn.commit()
        # print(f"💾 Saved to DB: {title[:30]}...")
    except sqlite3.IntegrityError:
        print(f"⚠️  Tender already exists (duplicate link): {link}")
    except Exception as e:
        print(f"❌ Database error: {e}")
    finally:
        conn.close()

def update_status(tender_id: int, status: str) -> bool:
    """Update the status of a tender."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        c.execute("UPDATE tenders SET status = ? WHERE id = ?", (status, tender_id))
        conn.commit()
        updated = c.rowcount > 0
        return updated
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False
    finally:
        conn.close()
