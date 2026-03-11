from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from app.services.vector_db import supabase
# Import our new expert workers
from app.agents.security_agent import security_node
from app.agents.logic_agent import logic_node
from app.agents.style_agent import style_node

# 1. The Upgraded Box (State)
# Now it holds a slot for each expert's report
class GraphState(TypedDict):
    repo_name: str
    pr_number: int
    code_diffs: List[dict]
    security_review: str
    logic_review: str
    style_review: str
    review_comments: str # The final, combined master report

# 2. The Manager Node
# This function takes the 3 separate reports and stitches them into one beautiful comment
def manager_node(state: GraphState):
    print("📋 Manager compiling final report and logging history...")
    
    # 1. Stitch the report together (Existing logic)
    final_report = f"### 🕵️ Security Report\n{state['security_review']}\n\n"
    final_report += f"### 🧠 Logic & Bugs\n{state['logic_review']}\n\n"
    final_report += f"### 🎨 Code Style\n{state['style_review']}"
    
    # 2. Logic to detect if a bug was found for the dashboard stats
    # We check if specific "alarm" words appear in the expert reviews
    full_review_text = (state['security_review'] + state['logic_review']).lower()
    bug_found = any(word in full_review_text for word in ["bug", "critical", "vulnerability", "error", "issue"])

# 3. Save to 'review_history' table
    try:
        history_data = {
            "pr_number": state['pr_number'],
            "repo_name": state['repo_name'],
            "bug_found": bug_found,
            "logic_score": 45 if bug_found else 95, 
            "status": "Completed",
            "report_text": final_report # <--- ADD THIS LINE HERE!
        }
        
        # This sends the data to the new table
        supabase.table("review_history").insert(history_data).execute()
        print(f"📊 Review for PR #{state['pr_number']} logged to history!")
        
    except Exception as e:
        print(f"⚠️ Database logging failed: {e}")
    
    return {"review_comments": final_report}
# 3. The New Assembly Line
workflow = StateGraph(GraphState)

# Add all 4 workers to the factory floor
workflow.add_node("security", security_node)
workflow.add_node("logic", logic_node)
workflow.add_node("style", style_node)
workflow.add_node("manager", manager_node)

# Map out the exact path the code takes
workflow.set_entry_point("security")
workflow.add_edge("security", "logic")
workflow.add_edge("logic", "style")
workflow.add_edge("style", "manager")
workflow.add_edge("manager", END)

# Compile the multi-agent AI!
ai_reviewer_app = workflow.compile()