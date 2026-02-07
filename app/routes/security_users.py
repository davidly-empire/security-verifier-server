from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List
from app.database import supabase  # your Supabase client
import bcrypt

# -----------------------------
# Schemas
# -----------------------------
class SecurityUserBase(BaseModel):
    security_id: str = Field(..., description="Unique Security ID")
    security_name: str = Field(..., description="Name of the security user")
    factory: str = Field(..., description="Factory ID or Name")

class SecurityUserCreate(SecurityUserBase):
    security_password: str = Field(..., description="Password (will be hashed)")

class SecurityUserUpdate(BaseModel):
    security_name: Optional[str] = None
    security_password: Optional[str] = None
    factory: Optional[str] = None

class SecurityUserResponse(SecurityUserBase):
    security_password: str  # hashed password
    created_at: Optional[str] = None

# -----------------------------
# Router
# -----------------------------
router = APIRouter(
    prefix="/security-users",
    tags=["Security Users"]
)

# -----------------------------
# Utility: hash password
# -----------------------------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# -----------------------------
# GET all security users
# -----------------------------
@router.get("", response_model=List[SecurityUserResponse])
def get_security_users():
    result = supabase.table("security_users").select("*").execute()
    return result.data

# -----------------------------
# GET single security user
# -----------------------------
@router.get("/{security_id}", response_model=SecurityUserResponse)
def get_security_user(security_id: str):
    result = supabase.table("security_users").select("*").eq("security_id", security_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Security user not found")
    return result.data[0]

# -----------------------------
# CREATE security user
# -----------------------------
@router.post("", status_code=status.HTTP_201_CREATED, response_model=SecurityUserResponse)
def create_security_user(payload: SecurityUserCreate):
    # Check if user already exists
    existing = supabase.table("security_users").select("*").eq("security_id", payload.security_id).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Security ID already exists")

    # Hash password
    hashed_password = hash_password(payload.security_password)

    # Insert
    data = {
        "security_id": payload.security_id,
        "security_name": payload.security_name,
        "security_password": hashed_password,
        "factory": payload.factory
    }
    result = supabase.table("security_users").insert(data).execute()
    return result.data[0]

# -----------------------------
# UPDATE security user
# -----------------------------
@router.put("/{security_id}", response_model=SecurityUserResponse)
def update_security_user(security_id: str, payload: SecurityUserUpdate):
    # Check if exists
    existing = supabase.table("security_users").select("*").eq("security_id", security_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Security user not found")

    update_data = payload.dict(exclude_unset=True)
    if "security_password" in update_data:
        update_data["security_password"] = hash_password(update_data["security_password"])

    result = supabase.table("security_users").update(update_data).eq("security_id", security_id).execute()
    return result.data[0]

# -----------------------------
# DELETE security user
# -----------------------------
@router.delete("/{security_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_security_user(security_id: str):
    existing = supabase.table("security_users").select("*").eq("security_id", security_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Security user not found")
    
    supabase.table("security_users").delete().eq("security_id", security_id).execute()
    return
