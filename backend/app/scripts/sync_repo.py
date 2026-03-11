import os
from github import Github
from app.core.config import settings
from app.services.vector_db import store_code_snippet

# Initialize GitHub
gh = Github(settings.GITHUB_TOKEN)

def sync_entire_repo(repo_full_name: str):
    print(f"🚀 Starting full sync for {repo_full_name}...")
    repo = gh.get_repo(repo_full_name)
    
    # Get all files in the repository recursively
    contents = repo.get_contents("")
    while contents:
        file_content = contents.pop(0)
        if file_content.type == "dir":
            contents.extend(repo.get_contents(file_content.path))
        else:
            # We only want to index code files (you can add more extensions here)
            if file_content.path.endswith(('.py', '.js', '.ts', '.html', '.css')):
                print(f"📄 Processing: {file_content.path}")
                try:
                    # Download the file content
                    raw_code = file_content.decoded_content.decode("utf-8")
                    
                    # Store it in our AI Memory (Supabase)
                    store_code_snippet(repo_full_name, file_content.path, raw_code)
                except Exception as e:
                    print(f"⚠️ Could not process {file_content.path}: {e}")

    print(f"✅ Sync Complete! {repo_full_name} is now inside your AI memory.")

if __name__ == "__main__":
    # Change this to YOUR test repo name
    MY_REPO = "Masterpush07/Video-2-Text" 
    sync_entire_repo(MY_REPO)