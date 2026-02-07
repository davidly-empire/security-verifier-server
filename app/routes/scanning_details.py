from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime

# Import the specific helpers from your updated database.py
# Do NOT import get_db or Session as we are using Supabase directly
from app.database import (
    create_scan_log, 
    get_all_scan_logs, 
    get_scan_logs_by_factory, 
    get_scan_logs_by_guard,
    delete_scan_log,
    SCANNING_TABLE
)

# We still use Schemas for validation
from app.schemas.scanning_details import ScanCreate, ScanResponse

router = APIRouter(
    prefix="/scans",
    tags=["Scanning Details"]
)

# Helper to convert raw DB dict to Response Schema
def to_scan_response(data: dict) -> ScanResponse:
    """Ensures data matches the Pydantic model structure"""
    if data is None:
        return None
    return ScanResponse(**data)

@router.post("/", response_model=ScanResponse, status_code=201)
def create_scan(scan: ScanCreate):
    """
    Create a new scanning log entry.
    """
    try:
        # Convert Pydantic model to dict for insertion
        scan_data = scan.dict()
        
        # Add timestamp if not present (optional, depending on DB default)
        if "created_at" not in scan_data:
            scan_data["created_at"] = datetime.utcnow().isoformat()

        # Call the Supabase helper
        result = create_scan_log(scan_data)
        
        if result and len(result) > 0:
            return to_scan_response(result[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to create scan log")
            
    except Exception as e:
        print(f"Error creating scan: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ScanResponse])
def read_scans(
    factory_code: Optional[str] = None,
    guard_name: Optional[str] = None
):
    """
    Retrieve scanning logs. 
    Optional filters: ?factory_code=X or ?guard_name=Y
    """
    try:
        if factory_code:
            data = get_scan_logs_by_factory(factory_code)
        elif guard_name:
            data = get_scan_logs_by_guard(guard_name)
        else:
            data = get_all_scan_logs()
            
        # Convert list of dicts to list of Pydantic models
        return [to_scan_response(item) for item in data]
        
    except Exception as e:
        print(f"Error fetching scans: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{scan_id}", status_code=204)
def delete_scan(scan_id: int):
    """
    Delete a scanning log by ID.
    """
    try:
        # Call the Supabase delete helper
        result = delete_scan_log(scan_id)
        
        if result is None:
            # Supabase delete usually returns empty list on success
            # If your helper returns None only on failure, handle accordingly
            raise HTTPException(status_code=404, detail="Scan log not found or delete failed")
            
        return None # FastAPI returns 204 No Content if we return None
            
    except Exception as e:
        print(f"Error deleting scan: {e}")
        raise HTTPException(status_code=500, detail=str(e))