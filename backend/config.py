from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Initialize with empty strings if missing just to prevent crash on import
if not SUPABASE_URL:
    SUPABASE_URL = ""
if not SUPABASE_KEY:
    SUPABASE_KEY = ""

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Warning: Failed to initialize supabase client: {e}")
    supabase = None

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
