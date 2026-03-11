import os
from openai import OpenAI
from app.core.config import settings
from app.services.vector_db import search_related_code

client = OpenAI(api_key=settings.CEREBRAS_API_KEY, base_url="https://api.cerebras.ai/v1")

def logic_node(state):
    print("🧠 Logic Expert consulting codebase memory...")
    
    repo_name = state["repo_name"]
    diffs = state["code_diffs"]
    
    # 1. Gather the code changes
    code_to_review = "\n".join([f"File: {f['filename']}\nPatch:\n{f['patch']}" for f in diffs])
    
    # 2. RAG FEATURE: Search for related files in the repo
    # We ask the DB: "What other files look like this change?"
    related_files = search_related_code(repo_name, code_to_review)
    
    context = ""
    if related_files:
        context = "\nHere is some context from other files in the repo that might be affected:\n"
        for f in related_files:
            context += f"File: {f['file_path']}\nContent Snippet: {f['content'][:500]}...\n---\n"

    # 3. Ask the AI with the NEW context
    response = client.chat.completions.create(
        model="llama3.1-8b",
        messages=[
            {"role": "system", "content": "You are a Senior Software Engineer. Review the code diff for logic bugs. Use the provided 'Context from other files' to check if these changes will break dependencies elsewhere in the repo."},
            {"role": "user", "content": f"CODE TO REVIEW:\n{code_to_review}\n\n{context}"}
        ]
    )
    
    return {"logic_review": response.choices[0].message.content}