# DealMind: AI Deal Intelligence Agent (Powered by Hindsight)

> **Persistent B2B Deal Memory, Objection Tracking & Autonomous Pre-Call Battlecards**  
> Built for the Vectorize Hindsight Hackathon.

---

## 💡 The Problem
In enterprise B2B sales cycles spanning weeks or months, vital deal intelligence is lost across scattered call notes:
- **Objections disappear**: A CFO mentions a $150k budget ceiling in Call 2, and reps walk into Call 4 unprepared.
- **Competitor traps are forgotten**: Competitors (DataDog, Palantir) cited by technical stakeholders get overlooked.
- **Reps waste hours**: Sales reps re-read CRM transcripts before calls, or worse, wing it.

Without a persistent memory system, AI sales copilots are stateless chatbots that offer generic platitudes.

---

## 🧠 Why Hindsight Memory is the Star
**DealMind** uses Vectorize's **Hindsight memory architecture**:
1. **`retain`**: Transcripts, meeting summaries, stakeholder stances, and verbatim quotes are continuously ingested into deal-specific memory banks.
2. **`recall` (4-way retrieval)**: Synthesizes answers using semantic similarity, keyword matching (BM25), entity relationships, and temporal chronology.
3. **`reflect` & Battlecard Synthesis**: Before a rep jumps into a high-stakes call, DealMind synthesizes an **Executive Pre-Call Battlecard** highlighting:
   - Past objections and the exact tested counters that worked.
   - Stakeholder psychology (e.g. CFO vs VP of Engineering).
   - Competitor counter-positioning.
   - Recommended closing commitment.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│               DealMind Modern Frontend                 │
│         (Vite + React • Plus Jakarta Sans UI)          │
│  - Chronological Deal Milestones & Transcripts         │
│  - Live Hindsight Memory Inspector (Search & Recall)   │
│  - Interactive Rep Copilot Chat                        │
│  - 1-Click Pre-Call Executive Battlecard Modal         │
└──────────────────────────┬─────────────────────────────┘
                           │ REST API
┌──────────────────────────▼─────────────────────────────┐
│                 FastAPI Backend Service                │
│  - Memory Orchestrator (engine.py)                     │
│  - Deal Data & Lifecycle Stores                        │
│  - Fallback Resilient Memory Layer                     │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Vectorize Hindsight API │ │   Fast LLM (Groq API)   │
│ - bank_id per deal      │ │ - llama-3.3-70b-versat. │
│ - retain & recall engine│ │ - Structured JSON Cards │
└─────────────────────────┘ └─────────────────────────┘
```

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Start Backend Service
```bash
# In the project root
.\venv\Scripts\Activate.ps1
cd backend
python -m uvicorn main:app --port 8000 --reload
```
The backend will run at `http://127.0.0.1:8000`.

### 3. Start Frontend UI
```bash
cd frontend
npm install
npm run dev
```
Open `http://127.0.0.1:5173` in your browser.

---

## 🔑 Supplying Your Credentials (When Ready)

Create a `.env` file in the `backend/` folder:

```ini
# Hindsight Cloud Credentials (Promo code: MEMHACK99 for $50 free credit)
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key_here

# Groq LLM API Key (Free on console.groq.com)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

> **Note**: DealMind includes a built-in multi-strategy fallback memory and synthesis layer. If credentials are not yet supplied, the system operates deterministically without crashing, guaranteeing smooth demos.

---
