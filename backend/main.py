from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date
import os
from dotenv import load_dotenv
from supabase import create_client
from fastapi.security import OAuth2PasswordBearer

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="ScholarPath.ai API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models for request/response
class ScholarshipBase(BaseModel):
    award_name: str
    organization: Optional[str] = None
    level_of_study: Optional[List[str]] = None
    award_type: Optional[str] = None
    purpose: Optional[str] = None
    focus: Optional[str] = None
    qualifications: Optional[str] = None
    criteria: Optional[str] = None
    funds: Optional[str] = None
    deadline: Optional[date] = None
    website: Optional[str] = None

class ScholarshipResponse(ScholarshipBase):
    id: int
    
    class Config:
        orm_mode = True

class SearchFilters(BaseModel):
    level_of_study: Optional[str] = None
    award_type: Optional[str] = None
    min_funds: Optional[str] = None
    max_funds: Optional[str] = None

class SearchRequest(BaseModel):
    search_term: Optional[str] = None
    filters: Optional[SearchFilters] = None

class VectorSearchRequest(BaseModel):
    query: str

class SaveScholarshipRequest(BaseModel):
    scholarship_id: int

@app.get("/")
def read_root():
    return {"message": "Welcome to ScholarPath.ai API"}

@app.get("/scholarships/", response_model=List[Dict[str, Any]])
async def get_scholarships(
    level_of_study: Optional[str] = None,
    award_type: Optional[str] = None,
    search_term: Optional[str] = None
):
    response = supabase.table("scholarships").select("*")
    
    if level_of_study:
        response = response.contains("level_of_study", [level_of_study])
    
    if award_type:
        response = response.eq("award_type", award_type)
    
    if search_term:
        response = response.ilike("award_name", f"%{search_term}%")
    
    data = response.execute()
    return data.get("data", [])

@app.get("/scholarships/{scholarship_id}", response_model=Dict[str, Any])
async def get_scholarship(scholarship_id: int):
    response = supabase.table("scholarships").select("*").eq("id", scholarship_id).execute()
    data = response.get("data", [])
    if not data:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return data[0]

@app.post("/scholarships/search", response_model=List[Dict[str, Any]])
async def search_scholarships(search_request: SearchRequest):
    response = supabase.table("scholarships").select("*")
    
    if search_request.filters:
        filters = search_request.filters.dict()
        for key, value in filters.items():
            if value:
                response = response.eq(key, value)
    
    if search_request.search_term:
        response = response.ilike("award_name", f"%{search_request.search_term}%")
    
    data = response.execute()
    return data.get("data", [])

@app.post("/scholarships/save")
async def save_scholarship(request: SaveScholarshipRequest, token: str = Depends(oauth2_scheme)):
    user_id = "mock-user-id"  # Replace with actual user authentication logic
    response = supabase.table("saved_scholarships").insert({"user_id": user_id, "scholarship_id": request.scholarship_id}).execute()
    return {"message": "Scholarship saved successfully"}

@app.get("/scholarships/saved", response_model=List[Dict[str, Any]])
async def get_saved_scholarships(token: str = Depends(oauth2_scheme)):
    user_id = "mock-user-id"
    response = supabase.table("saved_scholarships").select("*").eq("user_id", user_id).execute()
    return response.get("data", [])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
