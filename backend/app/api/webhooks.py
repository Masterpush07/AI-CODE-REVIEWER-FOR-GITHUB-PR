from fastapi import APIRouter, Request, BackgroundTasks

# Import our retriever and commenter from Step 2 & 4
from app.services.github import get_pr_diff, post_pr_comment

# Import our AI Brain from Step 3
from app.agents.graph import ai_reviewer_app

router = APIRouter()

# ---------------------------------------------------------
# The Heavy Lifting Engine
# This runs in the background so GitHub doesn't time out
# ---------------------------------------------------------
def process_pr_review(repo_name: str, pr_number: int):
    # 1. Go to GitHub and get the code changes
    diffs = get_pr_diff(repo_name, pr_number)
    
    if not diffs:
        print("No code changes to review.")
        return

    # 2. Setup the "Box" (State) for LangGraph
    initial_state = {
        "repo_name": repo_name,
        "pr_number": pr_number,
        "code_diffs": diffs,
        "review_comments": ""
    }

    # 3. Run the AI Brain!
    print("🧠 Running AI logic...")
    # .invoke() tells LangGraph to push our box through the assembly line
    final_state = ai_reviewer_app.invoke(initial_state) 
    
    # Extract the final answer from the box
    ai_review = final_state["review_comments"]

    # 4. Format the comment to look pretty and post it back to GitHub
    formatted_comment = f"### 🤖 AI Code Review\n\n{ai_review}"
    post_pr_comment(repo_name, pr_number, formatted_comment)


# ---------------------------------------------------------
# The Catcher (Listening for GitHub)
# ---------------------------------------------------------
@router.post("/webhooks/github")
async def receive_github_webhook(request: Request, background_tasks: BackgroundTasks):
    event_type = request.headers.get("X-GitHub-Event")
    
    # We only care about PRs
    if event_type != "pull_request":
        return {"message": f"Ignored event: {event_type}"}

    payload = await request.json()
    action = payload.get("action")

    # If new code was opened or pushed...
    if action in ["opened", "synchronize"]:
        pr_number = payload["pull_request"]["number"]
        repo_name = payload["repository"]["full_name"]
        
        print(f"🚨 ALERT: New code ready for review in {repo_name} (PR #{pr_number})")
        
        # Send the heavy lifting to the background task!
        background_tasks.add_task(process_pr_review, repo_name, pr_number)
        
        # Immediately tell GitHub "We got it!" (Status 200 OK)
        return {"status": "success", "message": f"AI Review started in background for PR #{pr_number}"}
    
    return {"message": f"Ignored PR action: {action}"}