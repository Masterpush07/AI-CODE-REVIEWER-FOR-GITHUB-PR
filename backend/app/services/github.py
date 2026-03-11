import os
from github import Github
from dotenv import load_dotenv

# Load the secret token from the .env file
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# Initialize the GitHub "Messenger"
gh = Github(GITHUB_TOKEN)

def get_pr_diff(repo_name: str, pr_number: int):
    """
    Goes to GitHub, finds the PR, and extracts the exact lines of code that changed.
    """
    try:
        print(f"Fetching code from {repo_name} PR #{pr_number}...")
        repo = gh.get_repo(repo_name)
        pr = repo.get_pull(pr_number)
        
        changed_files = []
        
        # Loop through every file that was altered in this PR
        for file in pr.get_files():
            # We only want files that actually have code changes (patches)
            if file.patch:
                changed_files.append({
                    "filename": file.filename,
                    "status": file.status,      # Was it added, modified, or removed?
                    "patch": file.patch         # The actual code diff!
                })
        
        return changed_files
    
    except Exception as e:
        print(f"❌ Error fetching from GitHub: {e}")
        return None
    
def post_pr_comment(repo_name: str, pr_number: int, comment: str):
    """
    Goes back to GitHub and posts the AI's review as a comment on the Pull Request.
    """
    try:
        print(f"Posting review to {repo_name} PR #{pr_number}...")
        
        # Find the correct repository and pull request
        repo = gh.get_repo(repo_name)
        pr = repo.get_pull(pr_number)
        
        # Create a new comment on the PR
        # (This uses the 'write' permission from your Fine-grained Token!)
        pr.create_issue_comment(comment)
        
        print("✅ Comment posted successfully!")
        return True
    
    except Exception as e:
        print(f"❌ Error posting comment: {e}")
        return False