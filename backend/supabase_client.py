import os
from supabase import create_client, Client
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class SupabaseService:
    def __init__(self):
        self.supabase = supabase
    
    def get_scholarships(self, filters=None, search_term=None):
        """
        Get scholarships with optional filtering and search
        """
        query = self.supabase.table("scholarships").select("*")
        
        # Apply filters if provided
        if filters:
            if filters.get("level_of_study"):
                query = query.eq("level_of_study", filters["level_of_study"])
            if filters.get("award_type"):
                query = query.eq("award_type", filters["award_type"])
            if filters.get("min_funds"):
                query = query.gte("funds", filters["min_funds"])
            if filters.get("max_funds"):
                query = query.lte("funds", filters["max_funds"])
        
        # Execute query
        response = query.execute()
        
        # Filter results by search term if provided
        if search_term and response.data:
            filtered_data = []
            for scholarship in response.data:
                # Search in relevant fields
                searchable_text = f"{scholarship.get('award_name', '')} {scholarship.get('organization', '')} {scholarship.get('purpose', '')} {scholarship.get('focus', '')} {scholarship.get('qualifications', '')} {scholarship.get('criteria', '')}"
                if search_term.lower() in searchable_text.lower():
                    filtered_data.append(scholarship)
            return filtered_data
        
        return response.data if response.data else []
    
    def get_scholarship_by_id(self, scholarship_id):
        """
        Get a single scholarship by ID
        """
        response = self.supabase.table("scholarships").select("*").eq("id", scholarship_id).execute()
        return response.data[0] if response.data else None
    
    def search_scholarships_vector(self, query_text):
        """
        Search scholarships using vector similarity
        """
        try:
            # Generate embedding for the search query
            response = openai.embeddings.create(
                model="text-embedding-ada-002",
                input=query_text
            )
            embedding = response.data[0].embedding
            
            # Call the match_scholarships RPC function
            response = self.supabase.rpc(
                "match_scholarships", 
                {
                    "query_embedding": embedding,
                    "match_threshold": 0.7,
                    "match_count": 10
                }
            ).execute()
            
            return response.data if response.data else []
        except Exception as e:
            print(f"Error in vector search: {e}")
            # Fallback to regular search
            return self.get_scholarships(search_term=query_text)
    
    def save_scholarship(self, user_id, scholarship_id):
        """
        Save a scholarship for a user
        """
        response = self.supabase.table("saved_scholarships").insert({
            "user_id": user_id,
            "scholarship_id": scholarship_id
        }).execute()
        return response.data if response.data else None
    
    def get_saved_scholarships(self, user_id):
        """
        Get all saved scholarships for a user
        """
        response = self.supabase.table("saved_scholarships").select(
            "scholarship_id, scholarships(*)"
        ).eq("user_id", user_id).execute()
        return response.data if response.data else []

# Singleton instance
supabase_service = SupabaseService()
