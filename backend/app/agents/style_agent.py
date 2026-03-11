import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("CEREBRAS_API_KEY"), base_url="https://api.cerebras.ai/v1")

def style_node(state):
    print("🎨 Style Expert checking standards...")
    diffs = state["code_diffs"]
    if not diffs: return {"style_review": "No code to review."}
    
    code_to_review = "\n".join([f"File: {f['filename']}\nPatch:\n{f['patch']}" for f in diffs])
    
    response = client.chat.completions.create(
        model="llama3.1-8b",
        messages=[
            {"role": "system", "content": "You are a strict Code Reviewer. Review the code diff ONLY for readability, PEP 8 styling, bad variable names, and missing docstrings. If the code is perfectly clean, reply with '✅ Code is clean and readable.'"},
            {"role": "user", "content": code_to_review}
        ]
    )
    return {"style_review": response.choices[0].message.content}