from pydantic import BaseModel
from datetime import date


class ReportDownloadPayload(BaseModel):
    factory_code: str
    report_date: date        # YYYY-MM-DD
    downloaded_by: str       # admin user_id
