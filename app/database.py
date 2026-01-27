import os
from typing import Generator, Optional
from supabase import create_client, Client

# -----------------------------
# Load Supabase credentials from environment
# -----------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Add this safety check
if not SUPABASE_URL:
    print("WARNING: SUPABASE_URL is not set!")
if not SUPABASE_KEY:
    print("WARNING: SUPABASE_KEY is not set!")

# Only initialize client if we have creds
if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    # If no creds, create a dummy client to prevent crash
    supabase = None 

# =========================================================
# ✅ FIX: Added to solve "ImportError: cannot import name 'get_db'"
# =========================================================
def get_db():
    """
    Dummy dependency for compatibility with SQLAlchemy-style route imports.
    Since this project uses Supabase (a REST client), we don't manage database 
    sessions via dependency injection like SQLAlchemy. 
    
    If your routes are asking for 'db' via Depends(get_db), this function 
    returns None. You should likely update your routes to remove 'Depends(get_db)' 
    and use the helper functions below directly.
    """
    return None
# =========================================================

# -----------------------------
# Helper functions
# -----------------------------

def get_table(table_name: str):
    """
    Return a Supabase table reference
    """
    if not supabase:
        raise RuntimeError("Supabase client not initialized. Check .env file.")
    return supabase.table(table_name)

def insert_row(table_name: str, data: dict):
    """
    Insert a row into a table
    """
    if not supabase:
        raise RuntimeError("Database connection not available.")
    
    try:
        response = supabase.table(table_name).insert(data).execute()
        
        # FIX: Check for errors correctly for Supabase v2.x
        if hasattr(response, 'data') and response.data:
            return response.data
        else:
            # Log error for debugging
            print(f"Supabase Insert Error: {response}")
            return None
    except Exception as e:
        print(f"Database Insert Exception: {e}")
        raise RuntimeError(f"Failed to insert data: {e}")

def select_rows(table_name: str, filters: dict = None):
    """
    Select rows with optional filters
    """
    if not supabase:
        raise RuntimeError("Database connection not available.")
        
    query = supabase.table(table_name).select("*")
    if filters:
        for key, value in filters.items():
            query = query.eq(key, value)
    
    try:
        response = query.execute()
        return response.data if hasattr(response, 'data') else []
    except Exception as e:
        print(f"Database Select Exception: {e}")
        return []

def update_row(table_name: str, row_id: str, data: dict, id_column: str = "id"):
    """
    Update a row by its ID
    """
    if not supabase:
        raise RuntimeError("Database connection not available.")
        
    try:
        response = supabase.table(table_name).update(data).eq(id_column, row_id).execute()
        return response.data if hasattr(response, 'data') else None
    except Exception as e:
        print(f"Database Update Exception: {e}")
        return None

def delete_row(table_name: str, row_id: str, id_column: str = "id"):
    """
    Delete a row by its ID
    """
    if not supabase:
        raise RuntimeError("Database connection not available.")
        
    try:
        response = supabase.table(table_name).delete().eq(id_column, row_id).execute()
        return response.data if hasattr(response, 'data') else None
    except Exception as e:
        print(f"Database Delete Exception: {e}")
        return None


# =========================================================
# ✅ ADDED: Scanning Details specific helpers (NEW CODE ONLY)
# =========================================================

SCANNING_TABLE = "scanning_details"

def create_scan_log(data: dict):
    """
    Insert scan data into scanning_details table
    """
    return insert_row(SCANNING_TABLE, data)

def get_all_scan_logs():
    """
    Fetch all scan logs
    """
    return select_rows(SCANNING_TABLE)

def get_scan_logs_by_factory(factory_code: str):
    """
    Fetch scan logs by factory_code
    """
    return select_rows(
        SCANNING_TABLE,
        filters={"factory_code": factory_code}
    )

def get_scan_logs_by_guard(guard_name: str):
    """
    Fetch scan logs by guard name
    """
    return select_rows(
        SCANNING_TABLE,
        filters={"guard_name": guard_name}
    )

def delete_scan_log(scan_id: int):
    """
    Delete scan log by ID
    """
    return delete_row(SCANNING_TABLE, scan_id)