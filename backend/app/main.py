from fastapi import FastAPI
from app.api import webhooks

# Initialize the FastAPI application
app = FastAPI(title="AI Code Reviewer API", version="1.0")

# Plug in the webhook router
app.include_router(webhooks.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "AI Code Reviewer Engine is Online"}