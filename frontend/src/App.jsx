import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  BrainCircuit, 
  Layers, 
  FileText, 
  UserCheck, 
  Search,
  PlusCircle,
  X,
  Target
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState("");
  const [dealData, setDealData] = useState(null);
  const [memories, setMemories] = useState([]);
  const [memoryQuery, setMemoryQuery] = useState("");
  const [briefing, setBriefing] = useState(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  
  // Copilot Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: "agent", text: "I've indexed all past calls for this deal. Ask me about past objections, competitor mentions, or pricing limits." }
  ]);
  const [copilotInput, setCopilotInput] = useState("");
  const [askingCopilot, setAskingCopilot] = useState(false);

  // New Interaction Modal
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newTranscript, setNewTranscript] = useState("");
  const [newMeetingType, setNewMeetingType] = useState("Discovery Call");

  // Load all deals on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/deals`)
      .then(res => res.json())
      .then(data => {
        setDeals(data);
        if (data.length > 0) {
          setSelectedDealId(data[0].deal_id);
        }
      })
      .catch(err => console.error("Error loading deals:", err));
  }, []);

  // Fetch full details of selected deal & its Hindsight memories
  useEffect(() => {
    if (!selectedDealId) return;

    fetch(`${API_BASE}/api/deals/${selectedDealId}`)
      .then(res => res.json())
      .then(data => {
        setDealData(data);
      })
      .catch(err => console.error("Error loading deal data:", err));

    fetchMemories(selectedDealId, "");
  }, [selectedDealId]);

  const fetchMemories = (dealId, query) => {
    const url = `${API_BASE}/api/deals/${dealId}/memories${query ? `?query=${encodeURIComponent(query)}` : ''}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMemories(data.memories || []);
      })
      .catch(err => console.error("Error fetching memories:", err));
  };

  const handleGenerateBriefing = async () => {
    if (!selectedDealId) return;
    setLoadingBriefing(true);
    setIsBriefingOpen(true);

    try {
      const res = await fetch(`${API_BASE}/api/deals/${selectedDealId}/briefing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upcoming_agenda: "Final contract review & closing negotiation" })
      });
      const data = await res.json();
      setBriefing(data);
    } catch (err) {
      console.error("Error generating briefing:", err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const handleSendCopilot = async (e) => {
    e.preventDefault();
    if (!copilotInput.trim() || askingCopilot) return;

    const query = copilotInput.trim();
    setChatMessages(prev => [...prev, { sender: "user", text: query }]);
    setCopilotInput("");
    setAskingCopilot(true);

    try {
      const res = await fetch(`${API_BASE}/api/deals/${selectedDealId}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: "agent", text: data.answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: "agent", text: "Unable to recall memory right now." }]);
    } finally {
      setAskingCopilot(false);
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    try {
      const payload = {
        title: newTitle,
        date: new Date().toISOString().split('T')[0],
        type: newMeetingType,
        summary: newSummary,
        transcript: newTranscript,
        tags: ["New-Call", "Live-Retain"]
      };

      const res = await fetch(`${API_BASE}/api/deals/${selectedDealId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      await res.json();

      // Refresh deal & memories
      const refreshed = await fetch(`${API_BASE}/api/deals/${selectedDealId}`).then(r => r.json());
      setDealData(refreshed);
      fetchMemories(selectedDealId, "");

      setIsAddInteractionOpen(false);
      setNewTitle("");
      setNewSummary("");
      setNewTranscript("");
    } catch (err) {
      console.error("Error retaining new interaction:", err);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar: Pipeline & Active Deals */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-badge">
            <span className="brand-icon">D</span>
            <span>DealMind</span>
          </div>
          <div className="brand-tagline">Hindsight Memory Copilot</div>
        </div>

        <div className="sidebar-section-title">Active Deals ({deals.length})</div>
        <ul className="deals-nav-list">
          {deals.map(d => (
            <li 
              key={d.deal_id} 
              className={`deal-nav-item ${selectedDealId === d.deal_id ? 'active' : ''}`}
              onClick={() => setSelectedDealId(d.deal_id)}
            >
              <div className="deal-nav-name">
                <span>{d.company}</span>
                <span style={{ fontSize: '11px', color: '#0f766e', fontWeight: 600 }}>{d.deal_size}</span>
              </div>
              <div className="deal-nav-meta">
                <span>{d.stage}</span>
                <span>{d.interactions_count} calls</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="engine-pill">
            <div className="status-dot"></div>
            <span>Hindsight Engine: Online</span>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="main-viewport">
        {dealData && (
          <>
            {/* Top Bar with Context and Actions */}
            <header className="top-bar">
              <div className="deal-header-info">
                <h1 className="deal-title">{dealData.company}</h1>
                <span className="deal-stage-badge">{dealData.stage}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{dealData.industry}</span>
              </div>

              <div className="top-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsAddInteractionOpen(true)}
                >
                  <PlusCircle size={15} />
                  <span>Log Meeting Note</span>
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={handleGenerateBriefing}
                >
                  <Target size={15} />
                  <span>Pre-Call Briefing Battlecard</span>
                </button>
              </div>
            </header>

            {/* Content Body: Timeline + Memory Inspector */}
            <div className="content-body">
              {/* Left Column: Timeline of Meetings & Real Transcripts */}
              <section className="timeline-section">
                <div className="section-headline-bar">
                  <div>
                    <h2 className="section-title">Chronological Deal Lifecyle</h2>
                    <span className="section-subtext">Retained into Hindsight graph for multi-call recall</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Deal Value: {dealData.deal_size}
                  </div>
                </div>

                <div className="timeline-list">
                  {dealData.interactions.map((interaction, idx) => (
                    <div key={interaction.interaction_id || idx} className="timeline-item">
                      <div className="timeline-node"></div>
                      <div className="interaction-card">
                        <div className="interaction-header">
                          <span className="interaction-title">{interaction.title}</span>
                          <span className="interaction-date">{interaction.date} • {interaction.type}</span>
                        </div>
                        <p className="interaction-summary">{interaction.summary}</p>
                        
                        {interaction.transcript && (
                          <div className="transcript-quote-box">
                            {interaction.transcript}
                          </div>
                        )}

                        <div className="tags-row">
                          {interaction.tags.map(t => (
                            <span key={t} className="tag-badge">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Right Column: Live Hindsight Memory Inspector & Sales Copilot */}
              <aside className="sidebar-right">
                {/* Panel 1: Live Memory Inspector */}
                <div className="panel-card">
                  <div className="panel-header">
                    <span className="panel-title">
                      <BrainCircuit size={16} />
                      Hindsight Memory Inspector
                    </span>
                    <span className="badge-count">{memories.length} Memories</span>
                  </div>

                  <form 
                    className="memory-search-bar" 
                    onSubmit={(e) => { e.preventDefault(); fetchMemories(selectedDealId, memoryQuery); }}
                  >
                    <input 
                      type="text" 
                      className="memory-search-input" 
                      placeholder="Recall objections, pricing, SOC2..."
                      value={memoryQuery}
                      onChange={(e) => setMemoryQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary" style={{ padding: '6px 10px' }}>
                      <Search size={14} />
                    </button>
                  </form>

                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {memories.map(m => (
                      <div key={m.id} className="recalled-memory-item">
                        <div className="memory-item-header">
                          <span>{m.title || "Memory Unit"}</span>
                          <span className="memory-score">Match: {Math.round((m.score || 0.9) * 100)}%</span>
                        </div>
                        <p className="memory-content-text">{m.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 2: Deal Copilot Chat */}
                <div className="panel-card">
                  <div className="panel-header">
                    <span className="panel-title">
                      <Layers size={16} />
                      Rep Copilot
                    </span>
                  </div>

                  <div className="copilot-messages">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`chat-bubble ${msg.sender}`}>
                        {msg.text}
                      </div>
                    ))}
                    {askingCopilot && (
                      <div className="chat-bubble agent" style={{ color: 'var(--text-tertiary)' }}>
                        Recalling context from Hindsight...
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendCopilot} className="copilot-input-row">
                    <input 
                      type="text" 
                      className="memory-search-input" 
                      placeholder="e.g. What was their pricing objection?"
                      value={copilotInput}
                      onChange={(e) => setCopilotInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px' }}>
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      {/* Pre-Call Briefing Battlecard Modal */}
      {isBriefingOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Pre-Call Executive Battlecard</h2>
                <span style={{ fontSize: '12.5px', color: 'var(--text-tertiary)' }}>
                  Synthesized across {briefing?.recalled_memories_count || 3} historical interactions via Hindsight
                </span>
              </div>
              <button 
                onClick={() => setIsBriefingOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {loadingBriefing ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Recalling facts, calculating stakeholder stances, and synthesizing talking points...
              </div>
            ) : briefing && (
              <div>
                <div className="briefing-exec-summary">
                  <strong>Executive Stance:</strong> {briefing.executive_summary}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className="briefing-block-title">Critical Objections & Tested Counters</div>
                  {briefing.critical_objections_to_watch?.map((obj, i) => (
                    <div key={i} className="objection-card">
                      <div className="objection-title">⚠️ {obj.objection}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                        Source: {obj.source_call}
                      </div>
                      <div className="objection-counter">
                        <strong>Counter-strategy:</strong> {obj.winning_counter}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className="briefing-block-title">Stakeholder Psychology</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {briefing.stakeholder_psychology?.map((s, i) => (
                      <div key={i} style={{ border: '1px solid var(--border-light)', padding: '10px', borderRadius: '6px', background: 'var(--bg-page)' }}>
                        <div style={{ fontWeight: 600, fontSize: '12.5px' }}>{s.name} ({s.role})</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{s.strategy}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {briefing.competitor_traps && briefing.competitor_traps.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div className="briefing-block-title">Competitor Traps Mentioned in Past Calls</div>
                    {briefing.competitor_traps.map((comp, i) => (
                      <div key={i} style={{ fontSize: '12.5px', color: 'var(--text-secondary)', background: 'var(--bg-page)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                        <strong>{comp.competitor}:</strong> {comp.talking_point}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '6px', borderLeft: '4px solid var(--text-main)' }}>
                  <div style={{ fontSize: '11.5px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>
                    Recommended Next Step
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                    {briefing.recommended_ask}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log New Call / Ingest Interaction Modal */}
      {isAddInteractionOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Log Sales Call / Retain into Hindsight</h2>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Information entered will be retained into the deal's persistent memory bank.
                </span>
              </div>
              <button 
                onClick={() => setIsAddInteractionOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddInteraction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Meeting Title</label>
                <input 
                  type="text" 
                  className="memory-search-input" 
                  style={{ width: '100%' }}
                  placeholder="e.g. Legal & Infosec Clarification Call" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Meeting Type</label>
                <select 
                  className="memory-search-input"
                  style={{ width: '100%' }}
                  value={newMeetingType}
                  onChange={(e) => setNewMeetingType(e.target.value)}
                >
                  <option value="Discovery Call">Discovery Call</option>
                  <option value="Technical Review">Technical Review</option>
                  <option value="Commercial Negotiation">Commercial Negotiation</option>
                  <option value="Security & Compliance">Security & Compliance</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Executive Summary & Key Takeaways</label>
                <textarea 
                  className="memory-search-input" 
                  style={{ width: '100%', minHeight: '80px' }}
                  placeholder="Summarize key decisions, objections raised, and customer sentiment..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Verbatim Quotes / Transcript Snippets</label>
                <textarea 
                  className="memory-search-input" 
                  style={{ width: '100%', minHeight: '80px', fontFamily: 'monospace', fontSize: '11.5px' }}
                  placeholder="Paste quotes: 'Sarah: We cannot exceed 150k this quarter...'"
                  value={newTranscript}
                  onChange={(e) => setNewTranscript(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddInteractionOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Retain to Memory Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
