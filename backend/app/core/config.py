import os
from dotenv import load_dotenv

# Load the .env file once, right here
load_dotenv()

class Settings:
    # GitHub Settings
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN")
    
    # AI Engine Settings
    CEREBRAS_API_KEY: str = os.getenv("CEREBRAS_API_KEY")
    
    # Database Settings (We will add these next!)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    DATABASE_URL: str = os.getenv("DATABASE_URL")

# Create a single instance to be used everywhere
settings = Settings()