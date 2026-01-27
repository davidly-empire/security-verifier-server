from pydantic import BaseModel
from typing import List
from datetime import datetime

class PatrolRow(BaseModel):
    employee_name: str
    employee_id: str
    patrol_time: datetime
    location: str
    latitude: str
    longitude: str

class PatrolRound(BaseModel):
    s_no: int
    date: str
    start_time: datetime
    end_time: datetime
    table: List[PatrolRow]

class PatrolReportResponse(BaseModel):
    factory_name: str
    factory_address: str
    report_date: str
    generated_by: str
    generated_at: datetime
    rounds: List[PatrolRound]
