# Supabase client service for database operations
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SupabaseService:
    _client: Client = None
    
    @staticmethod
    def get_client() -> Client:
        """Get singleton Supabase client instance"""
        if SupabaseService._client is None:
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_SERVICE_KEY")
            
            if not url or not key:
                raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables")
            
            SupabaseService._client = create_client(url, key)
        
        return SupabaseService._client
    
    @staticmethod
    def get_anon_client() -> Client:
        """Get Supabase client with anon key (for RLS-protected operations)"""
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_ANON_KEY")
        
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
        
        return create_client(url, key)
