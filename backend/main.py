from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import os
from dotenv import load_dotenv
from supabase_client import supabase_service
from fastapi.security import OAuth2PasswordBearer

# Load environment variables
load_dotenv()

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
    level_of_study: Optional[str] = None
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

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to ScholarPath.ai API"}

@app.get("/scholarships/", response_model=List[Dict[str, Any]])
async def get_scholarships(
    level_of_study: Optional[str] = None,
    award_type: Optional[str] = None,
    search_term: Optional[str] = None
):
    filters = {}
    if level_of_study:
        filters["level_of_study"] = level_of_study
    if award_type:
        filters["award_type"] = award_type
    
    scholarships = supabase_service.get_scholarships(filters, search_term)
    return scholarships

@app.get("/scholarships/{scholarship_id}", response_model=Dict[str, Any])
async def get_scholarship(scholarship_id: int):
    scholarship = supabase_service.get_scholarship_by_id(scholarship_id)
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return scholarship

@app.post("/scholarships/search", response_model=List[Dict[str, Any]])
async def search_scholarships(search_request: SearchRequest):
    scholarships = supabase_service.get_scholarships(
        search_request.filters.dict() if search_request.filters else None,
        search_request.search_term
    )
    return scholarships

@app.post("/scholarships/vector-search", response_model=List[Dict[str, Any]])
async def vector_search_scholarships(search_request: VectorSearchRequest):
    scholarships = supabase_service.search_scholarships_vector(search_request.query)
    return scholarships

@app.post("/scholarships/save")
async def save_scholarship(request: SaveScholarshipRequest, token: str = Depends(oauth2_scheme)):
    # In a real implementation, extract user_id from token
    # For MVP, we'll use a mock user_id
    user_id = "mock-user-id"
    
    result = supabase_service.save_scholarship(user_id, request.scholarship_id)
    if not result:
        raise HTTPException(status_code=400, detail="Failed to save scholarship")
    return {"message": "Scholarship saved successfully"}

@app.get("/scholarships/saved", response_model=List[Dict[str, Any]])
async def get_saved_scholarships(token: str = Depends(oauth2_scheme)):
    # In a real implementation, extract user_id from token
    # For MVP, we'll use a mock user_id
    user_id = "mock-user-id"
    
    scholarships = supabase_service.get_saved_scholarships(user_id)
    return scholarships

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
