import { useState, useEffect } from "react";
import { getTrades, createTrade } from './services/tradeService';
//import { getTrades, createTrade, updateTrade, deleteTrade } from './services/tradeService';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { isAuthenticated, signout } from './services/authService';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #04060f;
    --surface: #090d1a;
    --surface2: #0f1525;
    --surface3: #161d2e;
    --border: rgba(255,255,255,0.05);
    --border2: rgba(255,255,255,0.1);
    --accent: #00e5a0;
    --accent-dim: rgba(0,229,160,0.1);
    --accent-glow: rgba(0,229,160,0.25);
    --blue: #3b82f6;
    --blue-dim: rgba(59,130,246,0.12);
    --red: #f43f5e;
    --red-dim: rgba(244,63,94,0.12);
    --gold: #f59e0b;
    --text: #dde1ef;
    --text2: #8892a8;
    --muted: #3d4660;
    --font: 'Syne', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 2px; }
  input, select, textarea {
    background: var(--surface3); border: 1px solid var(--border2); color: var(--text);
    font-family: var(--mono); font-size: 13px; border-radius: 6px; padding: 8px 12px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  input::placeholder, textarea::placeholder { color: var(--muted); }
  select option { background: var(--surface2); }
  label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text2); display: block; margin-bottom: 6px; }
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: var(--mono); letter-spacing: 0.05em; text-transform: uppercase; }
  .badge-long { background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(0,229,160,0.2); }
  .badge-short { background: var(--red-dim); color: var(--red); border: 1px solid rgba(244,63,94,0.2); }
  .badge-open { background: var(--blue-dim); color: var(--blue); border: 1px solid rgba(59,130,246,0.2); }
  .badge-closed { background: rgba(255,255,255,0.04); color: var(--text2); border: 1px solid var(--border2); }
`;


const fmt = (n, d=2) => n==null ? "—" : (n>0?"+":"")+Number(n).toFixed(d);
const fmtPnl = (n) => n==null ? "—" : `${n>0?"+":"-"}$${Math.abs(n).toLocaleString()}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—";

function Nav({ tab, setTab, onLogout }) {
  return (
    <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, borderBottom:"1px solid var(--border)", background:"rgba(4,6,15,0.95)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:100 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:"#000" }}>T</div>
        <span style={{ fontWeight:800, fontSize:18, letterSpacing:"-0.02em" }}>TradeEdge</span>
        <span style={{ fontSize:11, color:"var(--muted)", fontFamily:"var(--mono)", marginLeft:4 }}>v1.0</span>
      </div>
      <div style={{ display:"flex", gap:4 }}>
        {[["journal","📋 Journal"],["calculator","🧮 Calculator"]].map(([key,label]) => (
          <button key={key} onClick={()=>setTab(key)} style={{ background:tab===key?"var(--accent-dim)":"transparent", border:tab===key?"1px solid rgba(0,229,160,0.3)":"1px solid transparent", color:tab===key?"var(--accent)":"var(--text2)", padding:"7px 18px", borderRadius:8, cursor:"pointer", fontFamily:"var(--font)", fontWeight:600, fontSize:13, transition:"all 0.2s" }}>{label}</button>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg, var(--accent), var(--blue))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#000" }}>JD</div>
        <div>
          <div style={{ fontSize:12, fontWeight:700 }}>John Doe</div>
          <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"var(--mono)" }}>Pro Plan</div>
        </div>
        <button onClick={onLogout} style={{ marginLeft:"20px", padding:"6px 14px", background:"var(--red-dim)", border:"1px solid rgba(244,63,94,0.2)", color:"var(--red)", borderRadius:6, cursor:"pointer", fontFamily:"var(--mono)", fontSize:11, fontWeight:600 }}>Logout</button>
      </div>
    </nav>
  );
}

function StatsBar({ trades }) {
  const closed = trades.filter(t=>t.status==="CLOSED");
  const wins = closed.filter(t=>t.pnl>0);
  const totalPnl = closed.reduce((s,t)=>s+(t.pnl||0),0);
  const winRate = closed.length ? ((wins.length/closed.length)*100).toFixed(0) : 0;
  const avgR = closed.filter(t=>t.rMultiple).reduce((s,t)=>s+t.rMultiple,0)/(closed.filter(t=>t.rMultiple).length||1);
  const stats = [
    { label:"Total P&L", value:fmtPnl(totalPnl), color:totalPnl>=0?"var(--accent)":"var(--red)" },
    { label:"Win Rate", value:`${winRate}%`, color:"var(--text)" },
    { label:"Total Trades", value:trades.length, color:"var(--text)" },
    { label:"Avg R-Multiple", value:fmt(avgR), color:avgR>=0?"var(--accent)":"var(--red)" },
    { label:"Open Trades", value:trades.filter(t=>t.status==="OPEN").length, color:"var(--blue)" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 }}>
      {stats.map(s=>(
        <div key={s.label} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"16px 20px" }}>
          <div style={{ fontSize:11, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{s.label}</div>
          <div style={{ fontSize:22, fontWeight:800, color:s.color, fontFamily:"var(--mono)" }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function TradeRow({ trade, onClick }) {
  const pc = trade.pnl==null?"var(--text2)":trade.pnl>0?"var(--accent)":"var(--red)";
  return (
    <tr onClick={()=>onClick(trade)} style={{ borderBottom:"1px solid var(--border)", cursor:"pointer", transition:"background 0.15s" }}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <td style={{ padding:"14px 16px", fontFamily:"var(--mono)", fontWeight:600, fontSize:13 }}>{trade.pair}</td>
      <td style={{ padding:"14px 8px" }}><span className={`badge badge-${trade.direction.toLowerCase()}`}>{trade.direction}</span></td>
      <td style={{ padding:"14px 8px", fontFamily:"var(--mono)", fontSize:12, color:"var(--text2)" }}>{fmtDate(trade.openedAt)}</td>
      <td style={{ padding:"14px 8px", fontFamily:"var(--mono)", fontSize:12 }}>{trade.entryPrice}</td>
      <td style={{ padding:"14px 8px", fontFamily:"var(--mono)", fontSize:12 }}>{trade.exitPrice??"-"}</td>
      <td style={{ padding:"14px 8px", fontFamily:"var(--mono)", fontSize:12, color:"var(--text2)" }}>{trade.strategy??"-"}</td>
      <td style={{ padding:"14px 8px", fontFamily:"var(--mono)", fontSize:12 }}><span style={{ color:pc, fontWeight:700 }}>{fmtPnl(trade.pnl)}</span></td>
      <td style={{ padding:"14px 8px", fontFamily:"var(--mono)", fontSize:12 }}><span style={{ color:pc }}>{fmt(trade.rMultiple)}R</span></td>
      <td style={{ padding:"14px 8px" }}><span className={`badge badge-${trade.status.toLowerCase()}`}>{trade.status}</span></td>
    </tr>
  );
}

function TradeModal({ trade, onClose }) {
  if (!trade) return null;
  const pc = trade.pnl==null?"var(--text2)":trade.pnl>0?"var(--accent)":"var(--red)";
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:16, padding:32, width:620, maxHeight:"85vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <span style={{ fontFamily:"var(--mono)", fontWeight:800, fontSize:22 }}>{trade.pair}</span>
              <span className={`badge badge-${trade.direction.toLowerCase()}`}>{trade.direction}</span>
              <span className={`badge badge-${trade.status.toLowerCase()}`}>{trade.status}</span>
            </div>
            <div style={{ fontSize:12, color:"var(--text2)", fontFamily:"var(--mono)" }}>{trade.strategy} · {trade.timeframe} · {trade.session}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
          {[["Entry",trade.entryPrice],["Exit",trade.exitPrice??"—"],["Stop Loss",trade.stopLoss??"—"],["Take Profit",trade.takeProfit??"—"],["Position Size",trade.positionSize?`${trade.positionSize} lots`:"—"],["Risk %",trade.riskPercent?`${trade.riskPercent}%`:"—"]].map(([l,v])=>(
            <div key={l} style={{ background:"var(--surface2)", borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{l}</div>
              <div style={{ fontFamily:"var(--mono)", fontWeight:600, fontSize:14 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          <div style={{ background:"var(--surface2)", borderRadius:8, padding:"16px 18px", borderLeft:`3px solid ${pc}` }}>
            <div style={{ fontSize:10, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>P&L</div>
            <div style={{ fontFamily:"var(--mono)", fontWeight:800, fontSize:20, color:pc }}>{fmtPnl(trade.pnl)}</div>
          </div>
          <div style={{ background:"var(--surface2)", borderRadius:8, padding:"16px 18px", borderLeft:`3px solid ${pc}` }}>
            <div style={{ fontSize:10, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>R-Multiple</div>
            <div style={{ fontFamily:"var(--mono)", fontWeight:800, fontSize:20, color:pc }}>{fmt(trade.rMultiple)}R</div>
          </div>
        </div>
        {trade.notes && <div style={{ background:"var(--surface2)", borderRadius:8, padding:"14px 16px", marginBottom:12 }}><div style={{ fontSize:10, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Notes</div><div style={{ fontSize:13, lineHeight:1.6 }}>{trade.notes}</div></div>}
        {trade.mistakes && <div style={{ background:"var(--red-dim)", border:"1px solid rgba(244,63,94,0.2)", borderRadius:8, padding:"14px 16px", marginBottom:16 }}><div style={{ fontSize:10, color:"var(--red)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>⚠ Mistakes</div><div style={{ fontSize:13, lineHeight:1.6 }}>{trade.mistakes}</div></div>}
        <div>
          <div style={{ fontSize:10, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Confidence</div>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            {Array.from({length:10},(_,i)=><div key={i} style={{ width:24, height:8, borderRadius:4, background:i<(trade.confidence||0)?"var(--accent)":"var(--surface3)" }} />)}
            <span style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--text2)", marginLeft:8 }}>{trade.confidence}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddTradeModal({ onClose, onAdd }) {
  const [pair, setPair] = useState("");
  const [direction, setDirection] = useState("LONG");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [positionSize, setPositionSize] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [strategy, setStrategy] = useState("");
  const [timeframe, setTimeframe] = useState("H1");
  const [session, setSession] = useState("London");
  const [marketCondition, setMarketCondition] = useState("Trending");
  const [confidence, setConfidence] = useState(7);
  const [notes, setNotes] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pair || !entryPrice) {
      alert("Please fill in Pair and Entry Price");
      return;
    }
    
    setLoading(true);
    const tradeData = {
      pair,
      direction,
      entryPrice: parseFloat(entryPrice),
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      positionSize: positionSize ? parseFloat(positionSize) : null,
      riskPercent: riskPercent ? parseFloat(riskPercent) : null,
      strategy: strategy || null,
      timeframe,
      session,
      marketCondition,
      confidence,
      notes: notes || null,
      mistakes: mistakes || null,
      openedAt: new Date().toISOString(),
      status: "OPEN"
    };
    
    try {
      await onAdd(tradeData);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:16, padding:32, width:580, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24 }}>
          <h2 style={{ fontWeight:800, fontSize:20, color:"var(--text)" }}>Log New Trade</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Pair</label>
              <input type="text" placeholder="EUR/USD" value={pair} onChange={e=>setPair(e.target.value.toUpperCase())} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Direction</label>
              <select value={direction} onChange={e=>setDirection(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }}>
                <option>LONG</option>
                <option>SHORT</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Entry Price</label>
              <input type="number" placeholder="1.0842" value={entryPrice} onChange={e=>setEntryPrice(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Position Size</label>
              <input type="number" placeholder="0.1" value={positionSize} onChange={e=>setPositionSize(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }} />
            </div>

            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Stop Loss</label>
              <input type="number" placeholder="1.0800" value={stopLoss} onChange={e=>setStopLoss(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Take Profit</label>
              <input type="number" placeholder="1.0950" value={takeProfit} onChange={e=>setTakeProfit(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }} />
            </div>

            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Risk %</label>
              <input type="number" placeholder="1.0" value={riskPercent} onChange={e=>setRiskPercent(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Strategy</label>
              <input type="text" placeholder="Breakout" value={strategy} onChange={e=>setStrategy(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }} />
            </div>

            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Timeframe</label>
              <select value={timeframe} onChange={e=>setTimeframe(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }}>
                {["M1","M5","M15","M30","H1","H4","D1","W1"].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Session</label>
              <select value={session} onChange={e=>setSession(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }}>
                {["Tokyo","London","New York","Sydney","Overlap"].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Market Condition</label>
              <select value={marketCondition} onChange={e=>setMarketCondition(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box" }}>
                {["Trending","Ranging","Volatile","Breakout"].map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Confidence: {confidence}/10</label>
              <input type="range" min={1} max={10} value={confidence} onChange={e=>setConfidence(parseInt(e.target.value))} style={{ width:"100%", accentColor:"var(--accent)" }} />
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Notes</label>
            <textarea rows={3} placeholder="Trade rationale..." value={notes} onChange={e=>setNotes(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box", resize:"vertical" }} />
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", color:"var(--text2)", display:"block", marginBottom:"6px" }}>Mistakes (optional)</label>
            <textarea rows={2} placeholder="What could have been done better?" value={mistakes} onChange={e=>setMistakes(e.target.value)} style={{ width:"100%", padding:"10px", background:"var(--surface3)", border:"1px solid var(--border2)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", fontFamily:"var(--mono)", boxSizing:"border-box", resize:"vertical" }} />
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex:1, padding:"12px", background:"var(--surface2)", border:"1px solid var(--border2)", color:"var(--text2)", borderRadius:8, cursor:loading?"not-allowed":"pointer", fontFamily:"var(--font)", fontWeight:600, opacity:loading?0.5:1 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex:2, padding:"12px", background:"var(--accent)", border:"none", color:"#000", borderRadius:8, cursor:loading?"not-allowed":"pointer", fontFamily:"var(--font)", fontWeight:800, fontSize:14, opacity:loading?0.5:1 }}>{loading?"Saving...":"Log Trade"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JournalTab() {
  const [trades, setTrades] = useState([]);
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState(null);

  // Fetch trades when component mounts
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const data = await getTrades();
        setTrades(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetchh trades:', err);
        setError('Failed to load trades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  // Handle creating a new trade
  const handleAddTrade = async (newTrade) => {
    try {
      const createdTrade = await createTrade(newTrade);
      setTrades(prev => [createdTrade, ...prev]);
      setError(null);
      setAddOpen(false);
    } catch (err) {
      console.error('Failed to create trade:', err);
      alert('Failed to create trade. Please try again.');
    }
  }

  const filtered = filter==="ALL" ? trades : trades.filter(t=>t.status===filter||t.direction===filter);

  return (
    <div>
      {loading && <div style={{ padding:48, textAlign:"center", color:"var(--text2)", fontSize:16 }}>Loading your trades...</div>}
      {error && <div style={{ padding:48, textAlign:"center", color:"var(--red)", fontSize:16 }}>{error}</div>}
      {!loading && !error && <StatsBar trades={trades} />}
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", gap:6 }}>
            {["ALL","OPEN","CLOSED","LONG","SHORT"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:"5px 14px", borderRadius:6, border:"1px solid", borderColor:filter===f?"var(--accent)":"var(--border2)", background:filter===f?"var(--accent-dim)":"transparent", color:filter===f?"var(--accent)":"var(--text2)", fontFamily:"var(--mono)", fontSize:11, fontWeight:600, cursor:"pointer" }}>{f}</button>
            ))}
          </div>
          <button onClick={()=>setAddOpen(true)} style={{ padding:"8px 18px", background:"var(--accent)", border:"none", color:"#000", borderRadius:8, fontFamily:"var(--font)", fontWeight:800, fontSize:13, cursor:"pointer" }}>+ Log Trade</button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)" }}>
                {["Pair","Dir","Date","Entry","Exit","Strategy","P&L","R","Status"].map(h=>(
                  <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t=><TradeRow key={t.id} trade={t} onClick={setSelected} />)}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding:48, textAlign:"center", color:"var(--muted)" }}>No trades found</div>}
        </div>
      </div>
      {selected && <TradeModal trade={selected} onClose={()=>setSelected(null)} />}
      {addOpen && <AddTradeModal onClose={()=>setAddOpen(false)} onAdd={handleAddTrade} />}
    </div>
  );
}

const PIP_VALUES = { "EUR/USD":10,"GBP/USD":10,"USD/JPY":9.1,"USD/CHF":10.9,"AUD/USD":10,"NZD/USD":10,"USD/CAD":7.5,"GBP/JPY":9.1,"EUR/JPY":9.1,"XAU/USD":1,"XAG/USD":50,"Custom":10 };

function CalculatorTab() {
  const [form, setForm] = useState({ balance:10000, riskPct:1, pair:"EUR/USD", entry:"", sl:"", direction:"LONG", pipValue:10 });
  const [result, setResult] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(()=>{ if(form.pair!=="Custom") set("pipValue", PIP_VALUES[form.pair]||10); },[form.pair]);

  const calculate = () => {
    const entry = parseFloat(form.entry), sl = parseFloat(form.sl);
    if (!entry||!sl||!form.balance) return;
    const riskAmt = (form.balance*form.riskPct)/100;
    let pipsDiff;
    if (form.pair.includes("JPY")) pipsDiff = Math.abs(entry-sl)*100;
    else if (!["XAU/USD","XAG/USD"].includes(form.pair)) pipsDiff = Math.abs(entry-sl)*10000;
    else pipsDiff = Math.abs(entry-sl);
    const lots = riskAmt/(pipsDiff*form.pipValue);
    const tp = form.direction==="LONG" ? entry+(entry-sl)*2 : entry-(sl-entry)*2;
    setResult({ lots:lots.toFixed(2), mini:(lots*10).toFixed(1), micro:(lots*100).toFixed(0), units:Math.round(lots*100000).toLocaleString(), riskAmt:riskAmt.toFixed(2), pipsDiff:pipsDiff.toFixed(1), potentialWin:(riskAmt*2).toFixed(2), suggestedTp:tp.toFixed(form.pair.includes("JPY")?2:4) });
  };

  const Card = ({label,value,sub,accent}) => (
    <div style={{ background:"var(--surface2)", borderRadius:10, padding:"16px 18px", borderLeft:accent?`3px solid ${accent}`:"none" }}>
      <div style={{ fontSize:10, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:"var(--mono)", fontWeight:800, fontSize:22, color:accent||"var(--text)" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"var(--muted)", fontFamily:"var(--mono)", marginTop:2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"400px 1fr", gap:24, alignItems:"start" }}>
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:28 }}>
        <h2 style={{ fontWeight:800, fontSize:18, marginBottom:24 }}>Position Size Calculator</h2>
        <div style={{ marginBottom:16 }}><label>Account Balance ($)</label><input type="number" placeholder="10000" value={form.balance} onChange={e=>set("balance",e.target.value)} /></div>
        <div style={{ marginBottom:16 }}>
          <label>Risk Per Trade: <span style={{ color:"var(--accent)", fontFamily:"var(--mono)" }}>{form.riskPct}%</span></label>
          <input type="range" min={0.1} max={5} step={0.1} value={form.riskPct} onChange={e=>set("riskPct",parseFloat(e.target.value))} style={{ padding:0, border:"none", background:"none", accentColor:"var(--accent)", width:"100%" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--muted)", fontFamily:"var(--mono)", marginTop:4 }}><span>0.1%</span><span>2.5%</span><span>5%</span></div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <div><label>Currency Pair</label><select value={form.pair} onChange={e=>set("pair",e.target.value)}>{Object.keys(PIP_VALUES).map(p=><option key={p}>{p}</option>)}</select></div>
          <div><label>Direction</label><select value={form.direction} onChange={e=>set("direction",e.target.value)}><option>LONG</option><option>SHORT</option></select></div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <div><label>Entry Price</label><input type="number" placeholder="1.0842" value={form.entry} onChange={e=>set("entry",e.target.value)} /></div>
          <div><label>Stop Loss</label><input type="number" placeholder="1.0800" value={form.sl} onChange={e=>set("sl",e.target.value)} /></div>
        </div>
        {form.pair==="Custom" && <div style={{ marginBottom:16 }}><label>Pip Value (per std lot)</label><input type="number" value={form.pipValue} onChange={e=>set("pipValue",parseFloat(e.target.value))} /></div>}
        <button onClick={calculate} style={{ width:"100%", padding:"13px", background:"var(--accent)", border:"none", color:"#000", borderRadius:8, fontFamily:"var(--font)", fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:"0 0 24px var(--accent-glow)" }}>Calculate Position Size</button>
      </div>

      <div>
        {result ? (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
              <Card label="Position Size" value={`${result.lots} lots`} sub={`${result.units} units`} accent="var(--accent)" />
              <Card label="Risk Amount" value={`$${result.riskAmt}`} sub={`${form.riskPct}% of account`} accent="var(--red)" />
              <Card label="Potential Win (2R)" value={`$${result.potentialWin}`} sub="Risk/Reward: 1:2" accent="var(--accent)" />
              <Card label="Stop Distance" value={`${result.pipsDiff} pips`} />
            </div>
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:24, marginBottom:16 }}>
              <div style={{ fontWeight:700, marginBottom:16, fontSize:13, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Lot Breakdown</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[["Standard",result.lots,"100,000 units"],["Mini",result.mini,"10,000 units"],["Micro",result.micro,"1,000 units"]].map(([l,v,u])=>(
                  <div key={l} style={{ background:"var(--surface2)", borderRadius:8, padding:"14px 16px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"var(--text2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{l}</div>
                    <div style={{ fontFamily:"var(--mono)", fontWeight:800, fontSize:20 }}>{v}</div>
                    <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"var(--mono)", marginTop:2 }}>{u}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:24 }}>
              <div style={{ fontWeight:700, marginBottom:16, fontSize:13, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Risk Tips</div>
              {[
                { icon:"✓", color:"var(--accent)", text:`Risk ${form.riskPct}% per trade — ${form.riskPct<=2?"within recommended range.":"consider reducing below 2%."}` },
                { icon:"→", color:"var(--blue)", text:`Suggested TP at ${result.suggestedTp} for 2:1 R/R.` },
                { icon:"⚡", color:"var(--gold)", text:`10 losses in a row = $${(parseFloat(result.riskAmt)*10).toFixed(0)} drawdown.` },
              ].map((tip,i)=>(
                <div key={i} style={{ display:"flex", gap:10, padding:"10px 14px", background:"var(--surface2)", borderRadius:8, marginBottom:8 }}>
                  <span style={{ color:tip.color, fontWeight:700 }}>{tip.icon}</span>
                  <span style={{ fontSize:13, color:"var(--text2)", lineHeight:1.5 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:64, textAlign:"center", color:"var(--muted)" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🧮</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:8, color:"var(--text2)" }}>Fill in your trade details</div>
            <div style={{ fontSize:13 }}>Enter account balance, risk %, and stop loss to calculate position size.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("journal");
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    signout();
    setIsLoggedIn(false);
    setTab("journal");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
  };

    return (
    <>
      <style>{globalStyles}</style>
      {!isLoggedIn ? (
        showSignup ? (
          <SignupForm 
            onSignupSuccess={handleSignupSuccess}
            onBackToLogin={() => setShowSignup(false)}
          />
        ) : (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess}
            onShowSignup={() => setShowSignup(true)}
          />
        )
      ) : (
        <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
          <Nav tab={tab} setTab={setTab} onLogout={handleLogout} />
          <main style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>
            {tab==="journal" ? <JournalTab /> : <CalculatorTab />}
          </main>
        </div>
      )}
    </>
  );
}