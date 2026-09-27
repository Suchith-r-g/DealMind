"""
Deal Intelligence Agent - FastAPI Backend Application
Serves:
- Deal listing & details
- Memory ingestion (Hindsight retain)
- Memory query (Hindsight recall)
- Battlecard Briefing generator
- Live Rep Copilot Chat
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load local environment if provided
load_dotenv()

from dataset import INITIAL_DEALS
from engine import DealIntelligenceEngine

app = FastAPI(
    title="Deal Intelligence Agent (Powered by Hindsight)",
    description="Persistent B2B deal memory, objection tracking, and pre-call battlecard generation.",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = DealIntelligenceEngine()
deals_db: Dict[str, Dict[str, Any]] = {d["deal_id"]: d for d in INITIAL_DEALS}

# Initialize Hindsight memory with default interactions
@app.on_event("startup")
async def seed_memory():
    print("[INIT] Seeding initial interactions into Hindsight memory banks...")
    for deal_id, deal in deals_db.items():
        for interaction in deal.get("interactions", []):
            engine.retain_interaction(deal_id, interaction)
    print("[INIT] Memory initialized successfully.")

# Models
class RetainInteractionRequest(BaseModel):
    title: str
    date: str
    type: str
    summary: str
    transcript: str
    tags: List[str] = []

class BriefingRequest(BaseModel):
    upcoming_agenda: str = "Closing negotiation on pricing and deployment SLA"

class CopilotQueryRequest(BaseModel):
    question: str

class SettingsUpdateRequest(BaseModel):
    hindsight_api_key: Optional[str] = None
    hindsight_base_url: Optional[str] = None
    groq_api_key: Optional[str] = None
    groq_model: Optional[str] = None

@app.get("/api/deals")
def list_deals():
    return [
        {
            "deal_id": d["deal_id"],
            "company": d["company"],
            "industry": d["industry"],
            "deal_size": d["deal_size"],
            "stage": d["stage"],
            "health_score": d["health_score"],
            "interactions_count": len(d.get("interactions", [])),
            "stakeholders_count": len(d.get("stakeholders", []))
        }
        for d in deals_db.values()
    ]

@app.get("/api/deals/{deal_id}")
def get_deal(deal_id: str):
    if deal_id not in deals_db:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deals_db[deal_id]

@app.post("/api/deals/{deal_id}/interactions")
def add_interaction(deal_id: str, req: RetainInteractionRequest):
    if deal_id not in deals_db:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    interaction = req.dict()
    interaction["interaction_id"] = f"call-{len(deals_db[deal_id]['interactions']) + 1}"
    
    # Store in deal history
    deals_db[deal_id]["interactions"].append(interaction)
    
    # Retain in Hindsight
    retained_mem = engine.retain_interaction(deal_id, interaction)
    
    return {
        "status": "success",
        "interaction": interaction,
        "memory_retained": retained_mem
    }

@app.get("/api/deals/{deal_id}/memories")
def inspect_memories(deal_id: str, query: str = ""):
    if deal_id not in deals_db:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    search_q = query if query else "objections concerns competitor pricing security"
    recalled = engine.recall_memories(deal_id, search_q)
    return {
        "deal_id": deal_id,
        "query": search_q,
        "memories": recalled
    }

@app.post("/api/deals/{deal_id}/briefing")
async def generate_deal_briefing(deal_id: str, req: BriefingRequest):
    if deal_id not in deals_db:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    deal = deals_db[deal_id]
    briefing = await engine.generate_briefing(deal, req.upcoming_agenda)
    return briefing

@app.post("/api/deals/{deal_id}/copilot")
async def chat_with_copilot(deal_id: str, req: CopilotQueryRequest):
    if deal_id not in deals_db:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    deal = deals_db[deal_id]
    result = await engine.answer_sales_copilot(deal, req.question)
    return result

@app.get("/api/system/status")
def system_status():
    return {
        "hindsight_connected": engine.hindsight_client is not None,
        "hindsight_base_url": engine.hindsight_base_url,
        "has_hindsight_key": bool(engine.hindsight_api_key),
        "has_groq_key": bool(engine.groq_api_key),
        "groq_model": engine.groq_model,
        "active_banks_count": len(engine._local_memory_bank)
    }

@app.post("/api/system/settings")
def update_settings(req: SettingsUpdateRequest):
    if req.hindsight_api_key is not None:
        engine.hindsight_api_key = req.hindsight_api_key
    if req.hindsight_base_url is not None:
        engine.hindsight_base_url = req.hindsight_base_url
    if req.groq_api_key is not None:
        engine.groq_api_key = req.groq_api_key
    if req.groq_model is not None:
        engine.groq_model = req.groq_model
        
    return {
        "status": "updated",
        "has_hindsight_key": bool(engine.hindsight_api_key),
        "has_groq_key": bool(engine.groq_api_key)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
