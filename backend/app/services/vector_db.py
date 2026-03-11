import os
import psycopg2
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer
from app.core.config import settings

# Initialize Supabase (for saving data)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Load the HuggingFace model
print("📥 Loading Local AI Embedding Model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Model Ready!")

def get_embedding(text: str):
    """Turns a piece of code into a 384-dimensional math vector."""
    embedding = model.encode(text)
    return embedding.tolist()

def store_code_snippet(repo_name: str, file_path: str, content: str):
    """Saves a file's content and its AI 'meaning' into Supabase."""
    try:
        embedding = get_embedding(content)
        data = {
            "repo_name": repo_name,
            "file_path": file_path,
            "content": content,
            "embedding": embedding
        }
        response = supabase.table("code_embeddings").insert(data).execute()
        print(f"✅ Successfully saved {file_path}")
        return response
    except Exception as e:
        print(f"❌ DATABASE ERROR on {file_path}: {e}")
        raise e 

def search_related_code(repo_name: str, query_text: str):
    """
    Searches Supabase using a DIRECT Postgres connection, bypassing Cloudflare SSL!
    """
    query_embedding = get_embedding(query_text)
    
    # Connect directly to the Postgres database port
    conn = psycopg2.connect(settings.DATABASE_URL)
    cursor = conn.cursor()

    try:
        # pgvector expects the vector as a string format: '[0.1, 0.2, ...]'
        embedding_str = str(query_embedding)

        # We write the raw SQL query. <=> is the pgvector math symbol for "Cosine Distance"
        query = """
            SELECT id, file_path, content, 1 - (embedding <=> %s::vector) as similarity
            FROM code_embeddings
            WHERE 1 - (embedding <=> %s::vector) > 0.5
            ORDER BY similarity DESC
            LIMIT 3;
        """
        
        cursor.execute(query, (embedding_str, embedding_str))
        rows = cursor.fetchall()
        
        # Format the database rows into a clean list of dictionaries
        results = []
        for row in rows:
            results.append({
                "id": row[0],
                "file_path": row[1],
                "content": row[2],
                "similarity": row[3]
            })
            
        return results
        
    finally:
        # Always close the connection to prevent memory leaks
        cursor.close()
        conn.close()