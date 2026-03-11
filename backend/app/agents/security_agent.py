import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("CEREBRAS_API_KEY"), base_url="https://api.cerebras.ai/v1")

def security_node(state):
    print("🕵️ Security Expert scanning for vulnerabilities...")
    diffs = state["code_diffs"]
    if not diffs: return {"security_review": "No code to review."}
    
    code_to_review = "\n".join([f"File: {f['filename']}\nPatch:\n{f['patch']}" for f in diffs])
    
    response = client.chat.completions.create(
        model="llama3.1-8b",
        messages=[
            {"role": "system", "content": "You are a strict Cyber Security Expert. Review the code diff ONLY for security flaws like hardcoded secrets, SQL injection, or bad permissions. If there are no security issues, reply simply with '✅ No security vulnerabilities detected.'"},
            {"role": "user", "content": code_to_review}
        ]
    )
    return {"security_review": response.choices[0].message.content}