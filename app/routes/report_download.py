from fastapi import APIRouter, HTTPException, Query
from datetime import datetime

from app.services.patrol_report_service import generate_patrol_report

router = APIRouter(
    prefix="/api/report",
    tags=["Report Download"]
)

@router.get(
    "/patrol",
    summary="Download Patrol Report"
)
async def download_patrol_report(
    factory_code: str = Query(..., example="F001"),
    date: str = Query(..., example="2026-01-22")
):
    report = await generate_patrol_report(
        factory_code=factory_code,
        report_date=date
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="No patrol data found for given date"
        )

    return {
        "factory_name": report["factory_name"],
        "factory_address": report["factory_address"],
        "report_date": date,
        "generated_by": "System",
        "generated_at": datetime.utcnow(),
        "rounds": report["rounds"]
    }
