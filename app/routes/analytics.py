from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.services.security_analytics_service import (
    generate_report_download,
    update_all_scan_statuses
)
from app.schemas.report import ReportDownloadPayload

router = APIRouter()


@router.post("/report/download")
def download_report(payload: ReportDownloadPayload):
    try:
        file_path, file_name = generate_report_download(payload)

        return FileResponse(
            path=file_path,
            filename=file_name,
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
