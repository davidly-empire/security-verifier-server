# app/main.py

from fastapi import FastAPI

from app.routes.report import router as report_router


app = FastAPI(title="Security Verifier API")


app.include_router(report_router)


@app.get("/")
def root():
    return {"status": "API running"}
