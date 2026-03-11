# 🚀 AI-Powered Multi-Agent Code Reviewer (Enterprise Edition)

![Architecture](https://img.shields.io/badge/Architecture-RAG%20%2B%20LangGraph-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black)
![Database](https://img.shields.io/badge/Database-Supabase%20%28pgvector%29-3ECF8E)
![AI Models](https://img.shields.io/badge/AI-Cerebras%20%7C%20Gemini-FF6F00)

## 📋 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [System Architecture and Data Flow](#️-system-architecture-and-data-flow)
3. [The LangGraph Agentic Framework](#-the-langgraph-agentic-framework)
4. [Why RAG? (The Enterprise Advantage)](#-why-rag-the-enterprise-advantage)
5. [Technology Stack](#-technology-stack)
6. [Local Development & Setup](#️-local-development--setup)
7. [Security & Compliance](#-security--compliance)
8. [Future Enhancements](#-future-enhancements)
9. [Contributors](#-contributors)
10. [License](#-license)

---

## 📌 Executive Summary
The **AI-Powered Multi-Agent Code Reviewer** is an autonomous, enterprise-grade Continuous Integration (CI) tool designed to intercept GitHub Pull Requests and conduct deep, semantic code reviews. 

Unlike traditional static analysis tools (e.g., SonarQube, ESLint) that rely on rigid regex patterns and syntax trees, this system utilizes a **Retrieval-Augmented Generation (RAG)** pipeline combined with a **LangGraph Multi-Agent Architecture**. This allows the system to enforce private, company-specific architectural guidelines, security policies, and unwritten engineering standards with human-like reasoning.

---

## 🏗️ System Architecture and Data Flow

The system is decoupled into a high-performance Next.js dashboard for engineering leads and a FastAPI backend orchestrating the AI logic.

### 🔄 The PR Lifecycle (How it works)
1. **Event Trigger:** A developer opens a Pull Request on GitHub.
2. **Webhook Ingestion:** GitHub fires a webhook payload containing the PR diff to the FastAPI `/api/webhooks` endpoint.
3. **Semantic Embedding:** The incoming code changes are temporarily vectorized using the `all-MiniLM-L6-v2` embedding model.
4. **Knowledge Retrieval (RAG):** Supabase (`pgvector`) performs a Cosine Similarity Search against the company's internal knowledge base (e.g., `COMPANY_STANDARDS.md`), retrieving only the rules highly relevant to the specific code diff.
5. **Agentic Orchestration:** LangGraph routes the code and the retrieved context through three specialized AI agents.
6. **Synthesis & Action:** The orchestrator compiles the agents' findings into a cohesive, actionable markdown report and automatically posts it as a review comment directly on the GitHub PR.


### 📂 Project Structure
```text
AI-CODE-REVIEWER/
│
├── .gitignore
├── README.md
│
├── backend/                       # ⚙️ FASTAPI BACKEND (The Engine)
│   ├── .env
│   ├── requirements.txt
│   └── app/
│       ├── main.py                # Entry point for the FastAPI server
│       ├── agents/                # The LangGraph AI Brains
│       │   ├── graph.py           # The LangGraph orchestrator connecting the agents
│       │   ├── logic_agent.py
│       │   ├── security_agent.py
│       │   └── style_agent.py
│       ├── api/                   # API Endpoints
│       │   └── webhooks.py        # Receives payload from GitHub when a PR is opened
│       ├── core/                  
│       │   └── config.py          # Environment variables and app configuration
│       ├── db/
│       │   └── supabase.py        # Supabase database connection setup
│       ├── scripts/
│       │   └── sync_repo.py       # Script to embed existing repo files into Supabase
│       └── services/
│           ├── github.py          # Logic for interacting with the GitHub API
│           └── vector_db.py       # Logic for embedding and similarity search (RAG)
│
├── env/                           # Your local Python virtual environment
│
└── frontend/                      # 🎨 NEXT.JS FRONTEND (The User Interface)
    ├── .env.local
    ├── .gitignore
    ├── components.json
    ├── eslint.config.mjs
    ├── middleware.ts              # Protects routes (ensures user is logged in)
    ├── next.config.ts
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── README.md
    │
    ├── app/                       # App Router (Pages & API Routes)
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx               # Landing page (with handleGitHubLogin)
    │   ├── about/
    │   │   └── page.tsx
    │   ├── api/                   # Next.js Backend-for-Frontend APIs
    │   │   ├── health/route.ts
    │   │   ├── repositories/route.ts
    │   │   └── stats/route.ts
    │   ├── auth/callback/
    │   │   └── route.ts           # Handles the OAuth redirect from GitHub
    │   └── dashboard/
    │       ├── layout.tsx
    │       ├── page.tsx
    │       ├── integrations/page.tsx
    │       ├── pr/[id]/page.tsx
    │       └── repositories/
    │           ├── page.tsx
    │           └── [owner]/[repo]/page.tsx
    │
    ├── components/                # Reusable UI elements (Looks like Shadcn UI!)
    │   └── ui/
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── LogoutButton.tsx
    │       └── theme-provider.tsx
    │
    ├── lib/
    │   └── utils.ts               # Utility functions (like Tailwind class merging)
    │
    ├── public/                    # Static assets (SVGs, icons)
    │
    └── utils/supabase/
        └── client.ts              # Supabase client setup for the frontend
```
---

## 🧠 The LangGraph Agentic Framework

Instead of relying on a single, monolithic LLM prompt (which is prone to context loss and hallucinations), this system deploys a network of specialized agents.

### 🛡️ 1. Security & Compliance Agent
Acts as the gatekeeper for data privacy and infrastructure security.
* **Responsibilities:** Scans for hardcoded secrets, PII (Personally Identifiable Information) logging violations, and OWASP Top 10 vulnerabilities (e.g., SQL injection risks, insecure deserialization).
* **Enterprise Value:** Prevents costly data breaches before the code ever reaches the main branch.

### ⚙️ 2. Logic & Performance Agent
Acts as a senior backend engineer reviewing execution flow.
* **Responsibilities:** Detects runtime risks that linters miss, such as unclosed database connections (memory leaks), potential division-by-zero errors, unhandled exceptions, and infinite loops.
* **Enterprise Value:** Ensures system uptime and optimal resource utilization.

### 🎨 3. Style & Architecture Agent
Acts as the guardian of the company's internal style guide.
* **Responsibilities:** Enforces PEP-8 compliance, detects "magic numbers," enforces consistent naming conventions (e.g., `snake_case` vs `camelCase`), and ensures adequate docstrings are present.
* **Enterprise Value:** Keeps the codebase uniform, readable, and highly maintainable, regardless of how many developers contribute.

---

## 🔎 Why RAG? (The Enterprise Advantage)

RAG (Retrieval-Augmented Generation) is the core differentiator of this system. 

* **Solves the Context Window Problem:** We cannot feed a 500-page company engineering manual into an LLM for every single PR. RAG dynamically retrieves only the exact 2-3 rules relevant to the PR, optimizing API costs and response latency.
* **Zero-Code Policy Updates:** If the TL or Security Team updates an engineering standard, they simply edit a Markdown file. The system automatically re-vectors the file into Supabase. The AI learns the new rule instantly—no backend code changes or redeployments required.
* **Eliminates Hallucinations:** The LLM is strictly instructed to base its judgments *only* on the retrieved company context, ensuring reviews are factual and aligned with internal policies.

---

## 💻 Technology Stack

### Frontend (Management Dashboard)
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **UI/Styling:** Tailwind CSS, Shadcn UI
* **Authentication:** Supabase Auth (GitHub OAuth integration)

### Backend (AI & Webhooks)
* **Framework:** FastAPI (Python)
* **AI Orchestration:** LangGraph, LangChain
* **LLM Providers:** Cerebras API, Google Gemini
* **Embeddings Model:** HuggingFace `SentenceTransformers` (`all-MiniLM-L6-v2`)

### Database & Storage
* **Provider:** Supabase
* **Vector Engine:** PostgreSQL with `pgvector` extension

---

## 🛠️ Local Development & Setup

### Prerequisites
* Python 3.10+
* Node.js 18+
* Git
* A Supabase Project (with `pgvector` enabled)

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/AI-CODE-REVIEWER-FOR-GITHUB-PR.git](https://github.com/YOUR_USERNAME/AI-CODE-REVIEWER-FOR-GITHUB-PR.git)
cd AI-CODE-REVIEWER-FOR-GITHUB-PR

```

### 2. Backend Environment Setup

Navigate to the backend directory and set up the virtual environment:

```bash
cd backend
python -m venv env
source env/Scripts/activate  # Windows: .\env\Scripts\activate
pip install -r requirements.txt

```

**Create Environment Variables** Create a `.env` file in the `/backend` directory containing your strict secrets:

```env
SUPABASE_URL="your_supabase_url"
SUPABASE_KEY="your_supabase_service_role_key"
DATABASE_URL="postgresql://postgres:[PASSWORD]@[aws-0-region.pooler.supabase.com:5432/postgres](https://aws-0-region.pooler.supabase.com:5432/postgres)"
CEREBRAS_API_KEY="your_cerebras_key"
GITHUB_TOKEN="your_personal_access_token"

```

**Start the FastAPI Development Server**

```bash
uvicorn app.main:app --reload

```

*The backend will now be listening for webhooks at: `http://localhost:8000*`

### 3. Frontend Environment Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install

```

**Create Frontend Environment Variables** Create a `.env.local` file in the `/frontend` directory:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

```

**Start the Next.js Frontend**

```bash
npm run dev

```

*Access the dashboard at: `http://localhost:3000*`

---

## 🔒 Security & Compliance

### Ephemeral Code Storage

Incoming Pull Request code is vectorized in-memory for similarity search and is never permanently stored in the database.

### Proprietary Data Protection

The LLM prompts explicitly prohibit the AI from using proprietary company logic for external model training.

---

## 🚀 Future Enhancements

### Cloud Deployment

Containerizing the backend with Docker and deploying to AWS ECS or Google Cloud Run, while hosting the frontend on Vercel.

### Webhook Security

Implementing GitHub Webhook Secret validation (HMAC SHA-256) to ensure the FastAPI endpoint only accepts payloads originating directly from GitHub.

### Multi-Platform Support

Expanding CI/CD integration beyond GitHub to support:

* GitLab
* Bitbucket

### Expanded Agent Roster

Introducing a **Testing Agent** to automatically generate unit tests for new Pull Requests using `pytest`.

---

## 🤝 Contributors

**Lead Architect & Developer** - PUSHPANATHAN N

Contributions, issues, and feature requests are welcome!

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

```
