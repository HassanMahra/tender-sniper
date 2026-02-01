from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import database

app = FastAPI(title="TenderSniper API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StatusUpdate(BaseModel):
    status: str

@app.on_event("startup")
def startup_event():
    database.init_db()

@app.get("/")
def read_root():
    return {"message": "TenderSniper API is running"}

@app.post("/api/tenders/{tender_id}/status")
def update_tender_status(tender_id: int, status_update: StatusUpdate):
    """
    Update the status of a tender.
    Body should be JSON: {"status": "new_status"}
    """
    success = database.update_status(tender_id, status_update.status)
    if not success:
        raise HTTPException(status_code=404, detail="Tender not found")
    return {"id": tender_id, "status": status_update.status, "message": "Status updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
