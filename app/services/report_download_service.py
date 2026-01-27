from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional, Dict, Any


async def generate_patrol_report(
    db: AsyncSession,
    factory_code: str,
    report_date: str
) -> Optional[Dict[str, Any]]:
    """
    Generate patrol report grouped by rounds for a given factory and date
    """

    query = text("""
        SELECT
            sd.round_id,
            sd.guard_name,
            sd.employee_id,
            sd.qr_name,
            sd.lat,
            sd.log AS longitude,
            sd.scan_time,
            f.factory_name,
            f.factory_address
        FROM scanning_details sd
        JOIN factories f ON f.factory_code = sd.factory_code
        WHERE sd.factory_code = :factory_code
          AND DATE(sd.scan_time) = :report_date
        ORDER BY sd.round_id, sd.scan_time
    """)

    result = await db.execute(
        query,
        {
            "factory_code": factory_code,
            "report_date": report_date
        }
    )

    rows = result.fetchall()
    if not rows:
        return None

    factory_name = rows[0].factory_name
    factory_address = rows[0].factory_address

    rounds_map: Dict[int, Dict[str, Any]] = {}

    for row in rows:
        if row.round_id not in rounds_map:
            rounds_map[row.round_id] = {
                "start_time": row.scan_time,
                "end_time": row.scan_time,
                "records": []
            }

        rounds_map[row.round_id]["records"].append({
            "employee_name": row.guard_name,
            "employee_id": row.employee_id,
            "patrol_time": row.scan_time,
            "location": row.qr_name,
            "latitude": row.lat,
            "longitude": row.longitude
        })

        rounds_map[row.round_id]["end_time"] = row.scan_time

    rounds = []
    for idx, (_, data) in enumerate(rounds_map.items(), start=1):
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
        "rounds": rounds
    }
