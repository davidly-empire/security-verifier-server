from fastapi import APIRouter, HTTPException, status
from app.database import supabase
from app.schemas.factory import FactoryCreate, FactoryResponse

router = APIRouter(
    prefix="/factories",
    tags=["Factories"]
    # NO dependencies=[Depends(get_current_user)] here
)

# ---------------------------
# CREATE Factory
# ---------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=FactoryResponse)
def create_factory(payload: FactoryCreate):
    """
    Create a new factory
    """
    result = supabase.table("factories").insert({
        "factory_code": payload.factory_code,
        "factory_name": payload.factory_name,
        "location": payload.location,
        "is_active": True
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create factory")

    return result.data[0]

# ---------------------------
# GET ALL Factories
# ---------------------------
@router.get("", response_model=list[FactoryResponse])
def get_factories():
    """
    Get all factories
    """
    result = supabase.table("factories").select("*").execute()
    return result.data or []

# ---------------------------
# GET Minimal Factories (for frontend dropdown)
# ---------------------------
@router.get("/minimal", response_model=list[dict])
def get_factories_minimal():
    """
    Returns only factory_code and factory_name
    """
    result = supabase.table("factories").select("factory_code, factory_name").execute()
    if not result.data:
        return []
    
    return [{"id": f["factory_code"], "name": f["factory_name"]} for f in result.data]

# ---------------------------
# GET Single Factory
# ---------------------------
@router.get("/{factory_code}", response_model=FactoryResponse)
def get_factory(factory_code: str):
    result = supabase.table("factories").select("*").eq("factory_code", factory_code).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Factory not found")
    return result.data[0]

# ---------------------------
# UPDATE Factory
# ---------------------------
@router.put("/{factory_code}", response_model=FactoryResponse)
def update_factory(factory_code: str, payload: FactoryCreate):
    existing = supabase.table("factories").select("*").eq("factory_code", factory_code).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Factory not found")

    result = supabase.table("factories").update({
        "factory_name": payload.factory_name,
        "location": payload.location
    }).eq("factory_code", factory_code).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update factory")

    return result.data[0]

# ---------------------------
# DELETE Factory
# ---------------------------
@router.delete("/{factory_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_factory(factory_code: str):
    existing = supabase.table("factories").select("*").eq("factory_code", factory_code).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Factory not found")
    
    supabase.table("factories").delete().eq("factory_code", factory_code).execute()
    return {"message": "Factory deleted successfully"}