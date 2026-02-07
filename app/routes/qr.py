from fastapi import APIRouter, HTTPException, status
from app.database import insert_row, select_rows, update_row, delete_row

router = APIRouter(
    prefix="/qr",
    tags=["QR Codes"]
    # NO dependencies=[Depends(get_current_user)] here
)

TABLE = "qr"

# ---------------------------
# CREATE QR
# ---------------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_qr_endpoint(data: dict):
    """
    Create a new QR code.
    """
    # ----------------------------------------------------
    # FIX: Remove 'qr_id' from the payload if it exists.
    # This forces the database to auto-generate a unique ID,
    # preventing the "duplicate key value violates unique constraint" error.
    # ----------------------------------------------------
    if "qr_id" in data:
        del data["qr_id"]

    result = insert_row(TABLE, data)
    
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create QR")
        
    return result[0]

# ---------------------------
# GET QR BY FACTORY
# ---------------------------
@router.get("/factory/{factory_code}")
def get_qr_by_factory(factory_code: str):
    """
    Get all QR codes for a specific factory
    """
    results = select_rows(TABLE, {"factory_code": factory_code})
    return results or []

# ---------------------------
# GET QR BY ID
# ---------------------------
@router.get("/{qr_id}")
def get_qr_by_id(qr_id: int):
    """
    Get a single QR by ID
    """
    rows = select_rows(TABLE, {"qr_id": qr_id})
    if not rows:
        raise HTTPException(status_code=404, detail="QR not found")
    return rows[0]

# ---------------------------
# UPDATE QR
# ---------------------------
@router.put("/{qr_id}")
def update_qr_endpoint(qr_id: int, data: dict):
    """
    Update a QR code
    """
    # Ensure we don't try to update the ID itself during an update
    if "qr_id" in data:
        del data["qr_id"]

    updated = update_row(
        TABLE,
        row_id=qr_id,
        data=data,
        id_column="qr_id"
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="QR not found or update failed")
        
    return updated[0]

# ---------------------------
# DELETE QR
# ---------------------------
@router.delete("/{qr_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_qr_endpoint(qr_id: int):
    """
    Delete a QR code
    """
    success = delete_row(
        TABLE,
        row_id=qr_id,
        id_column="qr_id"
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="QR not found")
        
    return {"message": "Deleted successfully"}