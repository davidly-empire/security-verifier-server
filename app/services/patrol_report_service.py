from datetime import datetime
from app.database import supabase


async def generate_patrol_report(factory_code: str, report_date: str):
    """
    Generate patrol report.
    Uses '*' to select all columns to avoid 'column does not exist' errors.
    """

    try:
        # Select ALL columns (*) to avoid guessing column names
        response = (
            supabase.table("scanning_details")
            .select("*") 
            .eq("factory_code", factory_code)
            .gte("scan_time", f"{report_date}T00:00:00")
            .lte("scan_time", f"{report_date}T23:59:59")
            .order("scan_time", desc=False) # Only order by scan_time
            .execute()
        )

        rows = response.data

    except Exception as e:
        print(f"Database Error: {e}")
        raise e

    if not rows:
        return None

    rounds_map = {}
    
    # Use default factory info since we can't link tables reliably
    factory_name = f"Factory {factory_code}"
    factory_address = "Address Unknown"

    for row in rows:
        # Dynamically get round_id or use a default if missing
        round_id = row.get("round_id", "Unassigned")
        
        # Dynamically get data with fallbacks
        # We try common names for ID: employee_id, emp_id, guard_id, id
        emp_id = (
            row.get("employee_id") or 
            row.get("emp_id") or 
            row.get("guard_id") or 
            row.get("id", "Unknown")
        )
        
        emp_name = row.get("guard_name", "Unknown")
        location = row.get("qr_name", row.get("location", "Unknown"))
        
        # Handle lat/lon with multiple possible names (lat, latitude) and (lon, log, longitude)
        lat = row.get("lat") or row.get("latitude", "0.0")
        lon = row.get("lon") or row.get("log") or row.get("longitude", "0.0")

        if round_id not in rounds_map:
            rounds_map[round_id] = {
                "start_time": row.get("scan_time"),
                "end_time": row.get("scan_time"),
                "records": []
            }

        rounds_map[round_id]["records"].append({
            "employee_name": emp_name,
            "employee_id": str(emp_id), # Ensure it's a string
            "patrol_time": row.get("scan_time"),
            "location": location,
            "latitude": lat,
            "longitude": lon
        })

        rounds_map[round_id]["end_time"] = row.get("scan_time")

    # Convert map to list
    rounds = []
    for idx, data in enumerate(rounds_map.values(), start=1):
        rounds.append({
            "s_no": idx,
            "date": report_date,
            "start_time": data["start_time"],
            "end_time": data["end_time"],
            "table": data["records"]
        })

    return {
        "factory_name": factory_name,
        "factory_address": factory_address,
        "report_date": report_date,
        "generated_by": "System",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "rounds": rounds
    }