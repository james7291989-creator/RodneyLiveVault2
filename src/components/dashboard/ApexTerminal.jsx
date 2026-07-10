import SubscriptionGate from './SubscriptionGate';
import ZeroCostMap from './ZeroCostMap';
import React from 'react';
import { supabase } from '../../supabaseClient';
'use client'

/* =============================================================================
 * RODNEY & SONS  ::  APEX TERMINAL  ::  v2.0  ::  Unified Master Terminal
 * -----------------------------------------------------------------------------
 * 5 Views   :: Asset Vault | Live Board | SV-1500 Core | Digital Escrow | War Room
 * Pattern   :: Single-file client component, useState view router, shared assets
 * Backend   :: Ghost-piped to http://localhost:8000/api/* (catch -> simulate)
 * Theme     :: St. Louis Domination Dark Mode (#050505 / #0A0A0A / #00E5FF)
 * ============================================================================= */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Crosshair, LayoutDashboard, Vault, Trello, FileSignature, Cpu, Settings, LogOut,
  Search, ChevronDown, MoreHorizontal, ShieldAlert, ShieldCheck, Eye, Zap, FileText,
  ArrowUpRight, Building2, Activity, Filter, MapPin, Loader2, X, CheckCircle2,
  TrendingUp, DollarSign, Flame, ArrowRight, Terminal, Brain, Gauge, Sparkles,
  Hammer, Wind, Wrench, ShieldQuestion, Printer, Download, Clock, BarChart3, Crown,
} from 'lucide-react'

// ============================================================================
//  GLOBAL HELPERS
// ============================================================================
const fmt = (n) =>
  '$' + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fmtCompact = (n) => {
  const v = Number(n ?? 0)
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M'
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K'
  return '$' + v
}
const uid = () => 'AV-' + Math.floor(Math.random() * 90000 + 10000)

const PIPELINE = ['Raw Lead', 'Underwriting', 'Contract Sent', 'In Escrow', 'Closed']

const STATUS_STYLES = {
  'Raw Lead':      'bg-slate-500/10 text-slate-300 border-slate-500/30 shadow-[0_0_12px_-4px_rgba(148,163,184,0.5)]',
  'Underwriting':  'bg-purple-500/10 text-purple-300 border-purple-500/40 shadow-[0_0_12px_-4px_rgba(168,85,247,0.6)]',
  'Contract Sent': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_-4px_rgba(0,229,255,0.6)]',
  'In Escrow':     'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-[0_0_12px_-4px_rgba(245,158,11,0.6)]',
  'Closed':        'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_-4px_rgba(16,185,129,0.6)]',
}
const STATUS_DOT = {
  'Raw Lead':'bg-slate-400','Underwriting':'bg-purple-400','Contract Sent':'bg-cyan-400',
  'In Escrow':'bg-amber-400','Closed':'bg-emerald-400',
}
const STATUS_BORDER = {
  'Raw Lead':'border-t-slate-500/60','Underwriting':'border-t-purple-500/60','Contract Sent':'border-t-cyan-500/60',
  'In Escrow':'border-t-amber-500/60','Closed':'border-t-emerald-500/60',
}


const WEEKLY_FLOW = [
  { d:'MON', leads:0, contracts:0, closed:0 },
  { d:'TUE', leads:0, contracts:0, closed:0 },
  { d:'WED', leads:0, contracts:0, closed:0 },
  { d:'THU', leads:0, contracts:0, closed:0 },
  { d:'FRI', leads:0, contracts:0, closed:0 },
  { d:'SAT', leads:0, contracts:0, closed:0 },
  { d:'SUN', leads:0, contracts:0, closed:0 },
]

const SKIP_TRACE = {}

const DEFAULT_TRACE = (name, address) => ({
  type:'Natural Person', formed:'—', registeredAgent:'—',
  principal:name, address:address || 'Unknown — last seen public record',
  phones: ["/// COMING SOON ///"],
  emails: ["/// COMING SOON ///"],
  relatedEntities:[], confidence:72 + Math.floor(Math.random()*18),
})


// ============================================================================
//  BUY BOX SETTINGS MODAL (Hoisted - Outside Components)
// ============================================================================
function BuyBoxSettingsModal({ onClose, toast }) {
  const [saving, React_setSaving] = React.useState(false);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-md border border-cyan-500/30 bg-[#070707] p-6">
        <h2 className="font-mono text-lg font-bold text-gray-100 mb-6">AUTONOMOUS <span className="text-cyan-400">BUY BOX</span></h2>
        <div className="flex justify-end gap-3 border-t border-gray-800 pt-4">
          <button onClick={onClose} className="px-4 py-2 font-mono text-xs tracking-wider text-gray-500 hover:text-white">CANCEL</button>
          <button onClick={() => { React_setSaving(true); setTimeout(() => { toast('SNIPER ARMED', 'Engine engaged.'); onClose(); }, 1000); }} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 px-5 py-2 font-mono text-xs font-bold tracking-[0.1em]">
            {saving ? "UPDATING..." : "ENGAGE SNIPER"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
//  TOAST SYSTEM (lightweight)
// ============================================================================
const ToastStack = ({ toasts, onClose }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex w-80 flex-col gap-2">
    {toasts.map(t => (
      <div key={t.id} className="group pointer-events-auto flex items-start gap-3 overflow-hidden rounded-md border border-emerald-500/40 bg-[#0A1410] p-3 shadow-[0_0_30px_-8px_rgba(16,185,129,0.6)] animate-[slideIn_.25s_ease-out]">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] tracking-[0.2em] text-emerald-400">{t.title}</div>
          <div className="mt-0.5 truncate text-xs text-gray-300">{t.body}</div>
        </div>
        <button onClick={()=>onClose(t.id)} className="text-gray-500 hover:text-gray-200"><X className="h-3.5 w-3.5"/></button>
      </div>
    ))}
    <style jsx="true">{`
      @keyframes slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
    `}</style>
  </div>
)

// ============================================================================
//  SIDEBAR
// ============================================================================
const NAV_ITEMS = [
  { key:'war',      label:'War Room',      icon:LayoutDashboard },
  { key:'vault',   label:'Asset Vault',    icon:Vault },
  { key:'board',   label:'Live Board',     icon:Trello },
  { key:'escrow',  label:'Digital Escrow', icon:FileSignature },
  { key:'core',    label:'SV-1500 Core',   icon:Cpu },
]

const Sidebar = ({ active, onNav, assets }) => {
  const pipelineValue = assets.reduce((s,a)=>s+(a.arv||0),0)
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[250px] flex-col border-r border-gray-800 bg-[#0A0A0A]">
      <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-md border border-cyan-400/40 bg-[#0F1417]">
          <Crosshair className="h-4 w-4 text-cyan-400" strokeWidth={2.4}/>
          <span className="absolute inset-0 rounded-md shadow-[0_0_18px_-4px_rgba(0,229,255,0.55)]"/>
        </div>
        <div className="leading-tight">
          <div className="font-mono text-[10px] tracking-[0.32em] text-cyan-400">R&amp;S</div>
          <div className="text-[13px] font-semibold tracking-[0.18em] text-gray-100">RODNEY &amp; SONS</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="px-3 pb-3 font-mono text-[10px] tracking-[0.3em] text-gray-600">/// NAVIGATION</div>
        <ul className="space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <li key={item.key}>
                <button
                  onClick={()=>onNav(item.key)}
                  className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${isActive?'bg-cyan-400/[0.07] text-cyan-300':'text-gray-400 hover:bg-white/[0.03] hover:text-gray-100'}`}
                >
                  {isActive && <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>}
                  <Icon className={`h-4 w-4 ${isActive?'text-cyan-400':'text-gray-500 group-hover:text-gray-200'}`} strokeWidth={1.8}/>
                  <span className="tracking-wide text-left">{item.label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 rounded-md border border-gray-800 bg-[#0E0E0E] p-3">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-gray-500">
            <Activity className="h-3 w-3 text-emerald-400"/>SYS STATUS
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">Quantum Link</span>
            <span className="flex items-center gap-1.5 font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]"/>ONLINE
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Pipeline</span>
            <span className="font-mono text-cyan-300">{fmtCompact(pipelineValue)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Latency</span>
            <span className="font-mono text-gray-200">14ms</span>
          </div>
        </div>
      </nav>

      <div className="border-t border-gray-800 p-3">
        <div className="rounded-md border border-gray-800 bg-[#0E0E0E] p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-amber-600 font-mono text-xs font-bold text-black">CEO</div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0E0E0E] bg-emerald-400"/>
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-gray-100">CEO</div>
              <div className="truncate font-mono text-[10px] tracking-wider text-amber-400">GOD MODE ACTIVE</div>
            </div>
          </div>
          <button onClick={async () => { try { await supabase.auth.signOut(); localStorage.clear(); } catch(e) {} window.location.reload(); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs font-medium tracking-wide text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300">
              <LogOut className="h-3.5 w-3.5"/>TERMINATE SESSION
            </button>
        </div>
      </div>
    </aside>
  )
}

// ============================================================================
//  ATOMIC UI
// ============================================================================
const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[status]??STATUS_STYLES['Raw Lead']}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]??'bg-slate-400'}`}/>{status}
  </span>
)

const FlagPill = ({ delinquent, years }) =>
  delinquent ? (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-500/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-red-400 shadow-[0_0_10px_-4px_rgba(239,68,68,0.7)]">
      <ShieldAlert className="h-3 w-3"/>TAX DELQ{years?` · ${years}Y`:''}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-700/60 bg-gray-700/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-500">
      <ShieldCheck className="h-3 w-3"/>CLEAR
    </span>
  )

const HeatBar = ({ value=0 }) => {
  const v = Math.max(0, Math.min(100, value))
  const tier = v>=80?'text-cyan-300':v>=60?'text-cyan-400':'text-gray-400'
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500/70 to-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.7)]" style={{width:v+'%'}}/>
      </div>
      <span className={`font-mono text-[11px] tabular-nums ${tier}`}>{String(v).padStart(2,'0')}</span>
    </div>
  )
}

const StatCard = ({ label, value, accent='text-white', sub, icon:Icon }) => (
  <div className="rounded-md border border-gray-800 bg-[#0E0E0E] px-5 py-4">
    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-gray-500">
      <span>{label}</span>{Icon && <Icon className="h-3.5 w-3.5 text-gray-600"/>}
    </div>
    <div className={`mt-1.5 font-mono text-2xl font-semibold tracking-tight ${accent}`}>{value}</div>
    {sub && <div className="mt-0.5 text-[11px] text-gray-500">{sub}</div>}
  </div>
)

// ============================================================================
//  UNMASK LLC MODAL
// ============================================================================
  // AUTO-ROUTING ENGINE INJECTED
  const handleSV1500Scan = async (asset, setAssets, toast) => {
    try {
      toast(`>>> INITIATING SV-1500 UPLINK: ${asset.address}...`);
      const aiResponse = await fetch((process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api/v1/analyze/quantum", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer LOCAL_TESTING" },
        body: JSON.stringify({ address: asset.address })
      });
      const aiData = await aiResponse.json();
      
      if (aiResponse.ok) {
        setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, status: 'Underwriting', arv: aiData.estimated_arv, mao: aiData.mao } : a));
        toast(`[SV-1500 SUCCESS] MAO Calculated: ${aiData.mao.toLocaleString()}. Routed to Underwriting.`);
      } else { toast(`[SV-1500 WARN] ${aiData.error}`); }
    } catch (e) { toast("[SV-1500 ERROR] Python Engine Offline."); }
  };

  const handleContractForge = async (asset, setAssets, toast) => {
    try {
      toast(`>>> FORGING ENVELOPE: ${asset.address}...`);
      const forgeResponse = await fetch((process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api/fire_contract", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer LOCAL_TESTING" },
        body: JSON.stringify({ 
           address: asset.address, 
           agent_name: asset.owner || "CURRENT OWNER", 
           mailing_address: asset.address, 
           mao: asset.mao || 0 
        })
      });
      const forgeData = await forgeResponse.json();
      
      if (forgeResponse.ok) {
        setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, status: 'Contract Sent' } : a));
        toast(`[CONTRACT ARMED] Payload Generated. Routed to Contract Sent.`);
      } else { toast(`[FORGE WARN] ${forgeData.error}`); }
    } catch (e) { toast("[FORGE ERROR] Python Engine Offline."); }
  };

const UnmaskModal = ({ asset, onClose, ghostFetch }) => {
  const [loading, setLoading] = useState(true)
  const [trace, setTrace] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const data = await ghostFetch('/api/skiptrace', { entity: asset?.owner || "UNKNOWN ENTITY" }, () =>
        SKIP_TRACE[asset?.owner || "UNKNOWN ENTITY"] || DEFAULT_TRACE(asset?.owner || "UNKNOWN ENTITY", asset?.address || "MANUAL INTAKE")
      )
      // mandatory 1.5s reveal
      setTimeout(() => { if (alive) { setTrace(data); setLoading(false) } }, 1500)
    })()
    return () => { alive = false }
  }, [asset, ghostFetch])

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-[fadeIn_.2s_ease]">
      <div className="w-full max-w-2xl overflow-hidden rounded-md border border-cyan-500/30 bg-[#070707] shadow-[0_0_60px_-10px_rgba(0,229,255,0.45)]">
        <div className="flex items-center justify-between border-b border-gray-800 bg-[#0A0A0A] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10">
              <Eye className="h-3.5 w-3.5 text-cyan-300"/>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-cyan-400">/// LLC PIERCER · v3</div>
              <div className="text-sm font-semibold text-gray-100">UNMASKING CORPORATE VEIL</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md border border-transparent p-1.5 text-gray-500 hover:border-gray-800 hover:bg-[#0E0E0E] hover:text-gray-200"><X className="h-4 w-4"/></button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center px-6 py-20">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-400"/>
            <div className="mt-4 font-mono text-[11px] tracking-[0.25em] text-cyan-300">PIERCING VEIL...</div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-gray-600">QUERYING SOS · NETRONLINE · LEXISNEXIS</div>
          </div>
        ) : (
          <div className="px-6 py-5">
            <div className="flex items-center justify-between rounded-md border border-gray-800 bg-[#0C0C0C] px-4 py-3">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-gray-500">TARGET ENTITY</div>
                <div className="text-lg font-semibold text-gray-100">{asset.owner}</div>
                <div className="font-mono text-[10px] tracking-[0.15em] text-cyan-400">{trace.type}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] tracking-[0.22em] text-gray-500">CONFIDENCE</div>
                <div className="font-mono text-3xl font-bold text-emerald-400">{trace.confidence}%</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="REGISTERED AGENT" value={trace.registeredAgent}/>
              <Field label="DATE FORMED"      value={trace.formed}/>
              <Field label="BENEFICIAL OWNER" value={trace.principal} accent/>
              <Field label="MAILING ADDRESS"  value={trace.address}/>
            </div>

            <div className="mt-3">
              <SubscriptionGate requiredTier="SYNDICATE" currentTier={"SYNDICATE"}>
                <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-gray-800 bg-[#0C0C0C] p-3">
                <div className="font-mono text-[10px] tracking-[0.22em] text-gray-500">PHONES</div>
                <div className="mt-1 space-y-1">{trace.phones.map(p=>(
                  <div key={p} className="font-mono text-xs text-gray-200">{p}</div>
                ))}</div>
              </div>
              <div className="rounded-md border border-gray-800 bg-[#0C0C0C] p-3">
                <div className="font-mono text-[10px] tracking-[0.22em] text-gray-500">EMAILS</div>
                <div className="mt-1 space-y-1">{trace.emails.map(e=>(
                  <div key={e} className="font-mono text-xs text-cyan-300">{e}</div>
                ))}</div>
              </div>
                          </div>
            </SubscriptionGate>
          </div>
          {trace.relatedEntities?.length > 0 && (
            <div className="mt-3 rounded-md border border-gray-800 bg-[#0C0C0C] p-3">
              <div className="font-mono text-[10px] tracking-[0.22em] text-gray-500">RELATED ENTITIES</div>
                <div className="mt-2 flex flex-wrap gap-2">{trace.relatedEntities.map(r=>(
                  <span key={r} className="rounded-md border border-purple-500/30 bg-purple-500/5 px-2 py-1 font-mono text-[10px] tracking-wider text-purple-300">{r}</span>
                ))}</div>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-md border border-gray-800 bg-[#0C0C0C] px-4 py-2 font-mono text-xs tracking-[0.15em] text-gray-300 hover:border-gray-700 hover:text-gray-100">CLOSE</button>
              <button className="inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 font-mono text-xs font-semibold tracking-[0.15em] text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.7)]">
                <Download className="h-3.5 w-3.5"/>EXPORT DOSSIER
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx="true">{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
    </div>
  )
}
const Field = ({ label, value, accent }) => (
  <div className="rounded-md border border-gray-800 bg-[#0C0C0C] p-3">
    <div className="font-mono text-[10px] tracking-[0.22em] text-gray-500">{label}</div>
    <div className={`mt-1 text-xs ${accent?'text-cyan-300 font-semibold':'text-gray-200'}`}>{value}</div>
  </div>
)

// ============================================================================
//  VIEW 1 :: ASSET VAULT
// ============================================================================
const AssetVaultView = ({ assets, setAssets, ghostFetch, toast }) => {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [filterOpen, setFilterOpen] = useState(false)
  const [scanInput, setScanInput] = useState('')
  const [scanning, setScanning] = useState(false)
  const [pin, setPin] = useState(null)
  const [unmaskTarget, setUnmaskTarget] = useState(null)
  const [buyBoxOpen, setBuyBoxOpen] = useState(false)

  const filtered = assets.filter(a => {
    const q = query.trim()?.toLowerCase()
    const okQ = !q || a.address?.toLowerCase().includes(q) || a.owner?.toLowerCase().includes(q) || a.id?.toLowerCase().includes(q)
    const okS = statusFilter==='All Statuses' || a.status===statusFilter
    return okQ && okS
  })

  const runScan = async () => {
    if (!scanInput.trim() || scanning) return
    setScanning(true)
    setPin(null)
    const address = scanInput.trim()
    const newAsset = await ghostFetch('/api/scan', { address }, () => {
      const arv = 120000 + Math.floor(Math.random()*220000)
      const rehab = 22000 + Math.floor(Math.random()*60000)
      return {
        id: uid(), address, city:'St. Louis, MO',
        status:'Raw Lead', arv, rehab, mao: Math.round(arv*0.7 - rehab),
        taxDelq: Math.random()>0.55, taxYears: 1+Math.floor(Math.random()*4),
        owner: 'Pending SOS Lookup', entityType:'LLC',
        heat: 35 + Math.floor(Math.random()*55),
        lat: 38.55 + Math.random()*0.25, lng: -90.35 + Math.random()*0.25,
      }
    })
    setTimeout(() => {
      setPin({ x: 20+Math.random()*70, y: 20+Math.random()*60 })
      setAssets(prev => [newAsset, ...prev])
      setScanInput('')
      setScanning(false)
      toast('SV-1500 SCAN COMPLETE', address + ' indexed to vault')
    }, 2000)
  }

  const totals = useMemo(() => ({
    arv: filtered.reduce((s,a)=>s+a.arv,0),
    mao: filtered.reduce((s,a)=>s+a.mao,0),
    delq: filtered.filter(a=>a.taxDelq).length,
  }), [filtered])

  return (
    <div className="px-8 pt-8 pb-16">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-cyan-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>
        SV-1500 QUANTUM CORE CONNECTED
      </div>
      <h1 className="mt-2 text-4xl font-bold tracking-[0.04em] text-white">ASSET <span className="text-cyan-400">VAULT</span></h1>
      <p className="mt-1 max-w-xl text-sm text-gray-500">Live off-market intelligence stream. {filtered.length} target assets indexed across the metro grid.</p>

      {/* BYOD Scan + Map HUD */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-md border border-gray-800 bg-[#0A0A0A] p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] text-gray-500">/// BYOD INTAKE CONSOLE</div>
          <div className="mt-3 flex gap-2">
            <input
              value={scanInput}
              onChange={e=>setScanInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && runScan()}
              placeholder="2310 Russell Blvd, St. Louis, MO..."
              className="h-11 flex-1 rounded-md border border-gray-800 bg-[#0C0C0C] px-3 font-mono text-sm text-gray-100 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            />
            <button
              onClick={runScan}
              disabled={scanning}
              className="inline-flex items-center gap-2 rounded-md border border-cyan-500/50 bg-cyan-500/10 px-5 font-mono text-xs font-bold tracking-[0.18em] text-cyan-300 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_24px_-4px_rgba(0,229,255,0.9)] disabled:opacity-60 relative overflow-hidden"
            >
              {scanning ? <><Loader2 className="h-3.5 w-3.5 animate-spin"/>QUERYING...</> : <><Zap className="h-3.5 w-3.5"/>RUN SV-1500 SCAN</>}
              {!scanning && <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"/>}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat label="INDEXED ARV"      value={fmtCompact(totals.arv)} accent="text-cyan-400"/>
            <MiniStat label="CAPITAL CAP"      value={fmtCompact(totals.mao)}/>
            <MiniStat label="DELQ TARGETS"     value={String(totals.delq).padStart(2,'0')} accent="text-red-400"/>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 font-mono text-[10px] tracking-[0.25em] text-gray-500">
            /// AUTOMATION COMMANDS
          </div>
          <button onClick={()=>setBuyBoxOpen(o=>!o)} className="mt-2 flex h-9 items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-4 font-mono text-xs font-bold tracking-[0.1em] text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.7)]">
            <span className={buyBoxOpen?'text-amber-400':'text-cyan-400'}>{buyBoxOpen?'⚠':'⚡'}</span>
            {buyBoxOpen?'DE-ENGAGE SNIPER':'ENGAGE SNIPER'}
          </button>
          <style jsx="true">{`@keyframes shimmer{100%{transform:translateX(100%)}}`}</style>
        </div>

        {/* SATELLITE UPLINK HUD */}
          <ZeroCostMap address={assets[0]?.address} county={assets[0]?.county} />
      </div>

      {/* Search + filter */}
      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-2xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Query Target Asset, Entity, or Asset ID..." className="h-10 w-full rounded-md border border-gray-800 bg-[#0C0C0C] pl-10 pr-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"/>
        </div>
        <div className="relative">
          <button onClick={()=>setFilterOpen(o=>!o)} className="flex h-10 items-center gap-2 rounded-md border border-gray-800 bg-[#0C0C0C] px-4 font-mono text-xs tracking-[0.15em] text-gray-300 hover:border-cyan-500/40 hover:text-cyan-300">
            <Filter className="h-3.5 w-3.5"/>{statusFilter.toUpperCase()}<ChevronDown className="h-3.5 w-3.5 opacity-60"/>
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-md border border-gray-800 bg-[#0C0C0C] shadow-2xl">
              {['All Statuses', ...PIPELINE].map(s => (
                <button key={s} onClick={()=>{setStatusFilter(s);setFilterOpen(false)}} className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs hover:bg-cyan-400/[0.06] ${statusFilter===s?'text-cyan-300':'text-gray-300'}`}>
                  <span className="font-mono tracking-[0.12em]">{s.toUpperCase()}</span>
                  {statusFilter===s && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,229,255,0.9)]"/>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4 overflow-hidden rounded-md border border-gray-800 bg-[#0A0A0A]">
        <div className="grid grid-cols-[2.2fr_1fr_1fr_1fr_1.3fr_0.9fr_1.2fr_0.4fr] gap-4 border-b border-gray-800 bg-[#0C0C0C] px-6 py-3.5 font-mono text-[10px] tracking-[0.18em] text-gray-500">
          <span>TARGET ASSET</span><span>STATUS</span><span>SV-1500 ARV</span><span>MAO</span>
          <span>DEAL HEAT</span><span>FLAGS</span><span>OWNER</span><span className="text-right">···</span>
        </div>
        <div>
          {filtered.length===0 ? (
            <div className="px-6 py-16 text-center font-mono text-xs tracking-[0.25em] text-gray-600">/// NO ACTIVE ASSETS DETECTED IN VAULT</div>
          ) : filtered.slice(0, 50).map(a => (
            <AssetRow key={a.id} asset={a} onUnmask={()=>setUnmaskTarget(a)} toast={toast}/>
          ))}
        </div>
      </div>

      {unmaskTarget && <UnmaskModal asset={unmaskTarget} onClose={()=>setUnmaskTarget(null)} ghostFetch={ghostFetch}/>}
    </div>
  )
}

const MiniStat = ({ label, value, accent='text-white' }) => (
  <div className="rounded-md border border-gray-800 bg-[#0C0C0C] px-3 py-2">
    <div className="font-mono text-[9px] tracking-[0.2em] text-gray-500">{label}</div>
    <div className={`mt-0.5 font-mono text-sm font-semibold ${accent}`}>{value}</div>
  </div>
)

const AssetRow = ({ asset, onUnmask, toast }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="group relative grid grid-cols-[2.2fr_1fr_1fr_1fr_1.3fr_0.9fr_1.2fr_0.4fr] items-center gap-4 border-b border-gray-800/80 px-6 py-3.5 transition-all hover:bg-cyan-400/[0.025]">
      <span className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-cyan-400 opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-800 bg-[#0E0E0E] text-gray-500 group-hover:border-cyan-500/40 group-hover:text-cyan-400 transition-colors">
          <Building2 className="h-4 w-4" strokeWidth={1.6}/>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-gray-100">{asset.address}</div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-mono text-[10px] tracking-wider text-gray-600">{asset.id}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-gray-700"/>
            <span className="truncate">{asset.city}</span>
          </div>
        </div>
      </div>
      <StatusPill status={asset.status}/>
      <div className="font-mono text-sm font-semibold text-cyan-400">{fmt(asset.arv)}</div>
      <div className="font-mono text-sm font-semibold text-white">{fmt(asset.mao)}</div>
      <HeatBar value={asset.heat}/>
      <FlagPill delinquent={asset.taxDelq} years={asset.taxYears}/>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium text-gray-200">{asset.owner}</div>
        <div className="font-mono text-[10px] tracking-wider text-gray-600">{asset.entityType==='LLC'?'CORP · LLC':'NATURAL PERSON'}</div>
      </div>
      <div className="relative flex justify-end">
        <button onClick={()=>setOpen(o=>!o)} className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-gray-500 hover:border-gray-800 hover:bg-[#0E0E0E] hover:text-cyan-400"><MoreHorizontal className="h-4 w-4"/></button>
        {open && (
          <div className="absolute right-0 top-10 z-20 w-60 overflow-hidden rounded-md border border-gray-800 bg-[#0C0C0C] shadow-2xl">
            <div className="border-b border-gray-800 px-3 py-2 font-mono text-[9px] tracking-[0.3em] text-gray-500">/// ACTION MATRIX</div>
            <ActionItem icon={Eye}          label="UNMASK LLC"        hint="Pierce corporate veil"      onClick={()=>{setOpen(false);onUnmask()}}/>
            <ActionItem icon={Zap}          label="ENGAGE SV-1500"    hint="AI line-item rehab"         onClick={()=>{setOpen(false);toast('SV-1500 ENGAGED','Underwriting '+asset.address)}}/>
            <ActionItem icon={FileText}     label="GENERATE CONTRACT" hint="Auto-draft assignment"      onClick={()=>{setOpen(false);toast('CONTRACT QUEUED','Drafting assignment for '+asset.id)}}/>
            <ActionItem icon={ArrowUpRight} label="PUSH TO LIVE BOARD" hint="Move to escrow kanban"     onClick={()=>{setOpen(false);toast('PUSHED','Asset routed to Live Board')}} last/>
          </div>
        )}
      </div>
      <div className="pointer-events-none col-span-8 -mt-1 flex justify-end gap-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        <QuickBtn icon={Eye}      label="UNMASK LLC"        onClick={onUnmask}/>
        <QuickBtn icon={Zap} label="ENGAGE SV-1500" onClick={()=>{handleSV1500Scan(asset, setAssets, toast)}}/>
        <QuickBtn icon={FileText} label="GENERATE CONTRACT" onClick={()=>{handleContractForge(asset, setAssets, toast)}}/>
      </div>
    </div>
  )
}
const QuickBtn = ({ icon:Icon, label, onClick }) => (
  <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-md border border-gray-800 bg-[#0C0C0C]/95 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-gray-300 backdrop-blur transition-all hover:border-cyan-500/50 hover:bg-cyan-500/[0.08] hover:text-cyan-300 hover:shadow-[0_0_14px_-4px_rgba(0,229,255,0.7)]">
    <Icon className="h-3 w-3"/>{label}
  </button>
)
const ActionItem = ({ icon:Icon, label, hint, last, onClick }) => (
  <button onClick={onClick} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-cyan-400/[0.06] ${last?'':'border-b border-gray-800/80'}`}>
    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-800 bg-[#101010] text-cyan-400"><Icon className="h-3.5 w-3.5"/></div>
    <div className="min-w-0 flex-1">
      <div className="font-mono text-[11px] font-semibold tracking-[0.12em] text-gray-100">{label}</div>
      <div className="text-[10px] text-gray-500">{hint}</div>
    </div>
    <ArrowUpRight className="h-3.5 w-3.5 text-gray-600"/>
  </button>
)


// ============================================================================
//  VIEW 2 :: LIVE BOARD (Kanban)
// ============================================================================
const LiveBoardView = ({ assets, setAssets, ghostFetch, toast }) => {
  const advance = async (asset) => {
    const idx = PIPELINE.indexOf(asset.status)
    if (idx < 0 || idx >= PIPELINE.length-1) return
    const next = PIPELINE[idx+1]
    await ghostFetch('/api/pipeline/advance', { id: asset.id, to: next }, () => true)
    setAssets(prev => prev.map(a => a.id===asset.id ? {...a, status: next} : a))
    toast('STATE ADVANCED', `${asset.address} → ${next}`)
  }

  const byCol = useMemo(() => Object.fromEntries(PIPELINE.map(s => [s, assets.filter(a=>a.status===s)])), [assets])

  return (
    <div className="px-8 pt-8 pb-16">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-cyan-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>
        ESCROW PIPELINE · REAL-TIME
      </div>
      <h1 className="mt-2 text-4xl font-bold tracking-[0.04em] text-white">LIVE <span className="text-cyan-400">BOARD</span></h1>
      <p className="mt-1 max-w-xl text-sm text-gray-500">{assets.length} assets routing through {PIPELINE.length}-stage escrow funnel.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-5">
        {PIPELINE.map(col => (
          <div key={col} className={`rounded-md border border-gray-800 bg-[#0A0A0A] border-t-2 ${STATUS_BORDER[col]}`}>
            <div className="flex items-center justify-between border-b border-gray-800 px-3 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[col]}`}/>
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-gray-300">{col.toUpperCase()}</span>
              </div>
              <span className="font-mono text-[10px] text-gray-500">{byCol[col].length}</span>
            </div>
            <div className="min-h-[160px] space-y-2 p-2">
              {byCol[col].length===0 ? (
                <div className="flex h-32 items-center justify-center font-mono text-[10px] tracking-[0.2em] text-gray-700">EMPTY</div>
              ) : byCol[col].slice(0, 50).map(a => (
                <KanbanCard key={a.id} asset={a} canAdvance={PIPELINE.indexOf(col)<PIPELINE.length-1} onAdvance={()=>advance(a)}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const KanbanCard = ({ asset, canAdvance, onAdvance }) => (
  <div className="group rounded-md border border-gray-800 bg-[#0E0E0E] p-3 transition-all hover:border-cyan-500/40 hover:bg-[#0F1417] hover:shadow-[0_0_18px_-6px_rgba(0,229,255,0.7)]">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="truncate text-xs font-semibold text-gray-100">{asset.address}</div>
        <div className="font-mono text-[9px] tracking-wider text-gray-600">{asset.id} · {asset.city.split(',')[0]}</div>
      </div>
      {asset.taxDelq && <FlagPill delinquent={true} years={asset.taxYears}/>}
    </div>
    <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-gray-800/70 bg-[#0A0A0A] p-2">
      <div><div className="font-mono text-[9px] tracking-wider text-gray-500">ARV</div><div className="font-mono text-xs font-semibold text-cyan-400">{fmt(asset.arv)}</div></div>
      <div><div className="font-mono text-[9px] tracking-wider text-gray-500">MAO</div><div className="font-mono text-xs font-semibold text-white">{fmt(asset.mao)}</div></div>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <HeatBar value={asset.heat}/>
      {canAdvance ? (
        <button onClick={onAdvance} className="inline-flex h-7 items-center gap-1 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 font-mono text-[10px] font-bold tracking-[0.15em] text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_14px_-4px_rgba(0,229,255,0.8)]">
          <ArrowRight className="h-3 w-3"/>ADV
        </button>
      ) : (
        <span className="font-mono text-[9px] tracking-[0.2em] text-emerald-400">✓ TERMINAL</span>
      )}
    </div>
  </div>
)

// ============================================================================
//  VIEW 3 :: SV-1500 CORE (AI Underwriter)
// ============================================================================
const SV1500View = ({ assets, ghostFetch, toast }) => {
  const queue = useMemo(() => assets.filter(a => ['Raw Lead','Underwriting'].includes(a.status)), [assets])
  const [selected, setSelected] = useState(queue[0] || null)
  const [lines, setLines] = useState([])
  const [running, setRunning] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

      const engage = async (asset) => {
      timers.current.forEach(clearTimeout); timers.current = [];
      setSelected(asset); setLines(['>>> INITIATING QUANTUM UPLINK...']); setRunning(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session ? session.access_token : 'DEV_OVERRIDE';
        setLines(prev => [...prev, '>>> NEGOTIATING SECURE HANDSHAKE...', '>>> ANALYZING ASSET: ' + asset.address]);
        const response = await fetch('http://localhost:5000/api/v1/analyze/quantum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ asset: asset })
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        const outputLines = data.analysis ? data.analysis.split('\n') : [JSON.stringify(data, null, 2)];
        setLines(prev => [...prev, ...outputLines, '>>> SV-1500 UNDERWRITING COMPLETE.']);
        toast('SV-1500 COMPLETE', asset.address + ' analyzed');
      } catch (error) {
        setLines(prev => [...prev, '>>> [FATAL UPLINK ERROR]: ' + error.message, '>>> IS FLASK SERVER ONLINE?']);
      } finally {
        setRunning(false);
      }
    }

  return (
    <div className="px-8 pt-8 pb-16">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-cyan-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>
        NEURAL UNDERWRITER · QUANTUM CORE v15
      </div>
      <h1 className="mt-2 text-4xl font-bold tracking-[0.04em] text-white">SV-1500 <span className="text-cyan-400">CORE</span></h1>
      <p className="mt-1 max-w-xl text-sm text-gray-500">{queue.length} assets queued for line-item AI underwriting.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        {/* Queue */}
        <div className="rounded-md border border-gray-800 bg-[#0A0A0A]">
          <div className="border-b border-gray-800 px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-gray-500">/// UNDERWRITING QUEUE</div>
          <div className="max-h-[520px] overflow-y-auto">
            {queue.length===0 ? (
              <div className="px-4 py-10 text-center font-mono text-[10px] tracking-[0.2em] text-gray-700">QUEUE EMPTY</div>
            ) : queue.map(a => (
              <button key={a.id} onClick={()=>engage(a)} className={`group flex w-full items-center gap-3 border-b border-gray-800/80 px-4 py-3 text-left transition-colors ${selected?.id===a.id?'bg-cyan-400/[0.06]':'hover:bg-cyan-400/[0.03]'}`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-md border ${selected?.id===a.id?'border-cyan-500/50 text-cyan-300':'border-gray-800 text-gray-500'} bg-[#0E0E0E]`}>
                  <Brain className="h-4 w-4"/>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-100">{a.address}</div>
                  <div className="font-mono text-[10px] tracking-wider text-gray-600">{a.id} · {a.status}</div>
                </div>
                <HeatBar value={a.heat}/>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="relative overflow-hidden rounded-md border border-cyan-500/30 bg-black shadow-[0_0_60px_-15px_rgba(0,229,255,0.5)]">
          <div className="flex items-center justify-between border-b border-cyan-500/20 bg-[#040809] px-4 py-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-cyan-400"/>
              <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-400">SV-1500 :: AI READOUT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500/60"/>
              <span className="h-2 w-2 rounded-full bg-amber-500/60"/>
              <span className="h-2 w-2 rounded-full bg-emerald-500/60"/>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{backgroundImage:'repeating-linear-gradient(0deg,rgba(0,229,255,0.4) 0,rgba(0,229,255,0.4) 1px,transparent 1px,transparent 3px)'}}/>
          <div className="relative h-[480px] overflow-y-auto p-5 font-mono text-[12px] leading-relaxed text-cyan-300">
            {!selected ? (
              <div className="flex h-full items-center justify-center text-center text-gray-600">
                <div>
                  <Brain className="mx-auto mb-3 h-10 w-10 text-cyan-500/40"/>
                  <div className="font-mono text-[10px] tracking-[0.3em] text-cyan-500/60">/// SELECT AN ASSET TO ENGAGE</div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 border-b border-cyan-500/20 pb-2 font-mono text-[11px] tracking-[0.2em] text-cyan-500/80">
                  ╔══ ASSET {selected.id} :: {selected.address.toUpperCase()} ══╗
                </div>
                {lines.map((l,i)=>(
                  <div key={i} className="animate-[type_.18s_ease]">{l}</div>
                ))}
                {running && <div className="mt-1 inline-block h-3 w-2 animate-pulse bg-cyan-400 align-middle"/>}
              </>
            )}
          </div>
          <style jsx="true">{`@keyframes type{from{opacity:0;transform:translateX(-3px)}to{opacity:1;transform:translateX(0)}}`}</style>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
//  VIEW 4 :: DIGITAL ESCROW (Contract Generator)
// ============================================================================
const DigitalEscrowView = ({ assets, ghostFetch, toast }) => {
  const pool = useMemo(() => assets.filter(a => ['Contract Sent','In Escrow','Underwriting'].includes(a.status)), [assets])
  const [selected, setSelected] = useState(pool[0] || null)
  const [loading, setLoading] = useState(false)
  const [doc, setDoc] = useState(null)

  const exportPDF = async () => {
    if (!doc) return;
    toast("FORGING PDF", "Initializing jsPDF engine...");
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "pt", "letter");
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("ASSIGNMENT OF REAL ESTATE PURCHASE CONTRACT", 300, 60, { align: "center" });
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);
      pdf.text(`Effective Date: ${doc.date}`, 50, 100);
      pdf.text(`Assignor: ${doc.buyer}`, 50, 120);
      pdf.text(`Assignee: ${doc.assignee}`, 50, 140);
      pdf.text(`Property: ${doc.property}`, 50, 160);
      pdf.text(`Purchase Price: $${Number(doc.purchase).toLocaleString()}`, 50, 180);
      pdf.text(`Assignment Fee: $${Number(doc.assignmentFee).toLocaleString()}`, 50, 200);
      pdf.save(doc.number + ".pdf");
      toast("PDF SECURED", "Contract downloaded to your machine.");
    } catch(e) {
      toast("SYSTEM ERROR", "Failed to initialize PDF engine.");
    }
  };

  useEffect(() => {
    if (!selected) return
    setLoading(true); setDoc(null)
    let alive = true
    ;(async () => {
      await ghostFetch('/api/escrow/draft', { id: selected.id }, () => true)
      setTimeout(() => {
        if (!alive) return
        setDoc({
          number: 'ASGN-' + selected.id.replace('AV-','') + '-25',
          date: new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
          buyer: 'Rodney & Sons Acquisitions LLC',
          seller: selected.owner,
          assignee: 'TBD · Buyers List',
          property: selected.address + ', ' + selected.city,
          purchase: selected.mao,
          assignmentFee: Math.round(selected.mao * 0.08),
          closeBy: new Date(Date.now()+1000*60*60*24*21).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
        })
        setLoading(false)
      }, 1400)
    })()
    return () => { alive=false }
  }, [selected, ghostFetch])

  return (
    <div className="px-8 pt-8 pb-16">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-cyan-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>
        ASSIGNMENT CONTRACT FORGE · NOTARY-READY
      </div>
      <h1 className="mt-2 text-4xl font-bold tracking-[0.04em] text-white">DIGITAL <span className="text-cyan-400">ESCROW</span></h1>
      <p className="mt-1 max-w-xl text-sm text-gray-500">{pool.length} assets eligible for assignment drafting.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        <div className="rounded-md border border-gray-800 bg-[#0A0A0A]">
          <div className="border-b border-gray-800 px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-gray-500">/// CONTRACT POOL</div>
          <div className="max-h-[640px] overflow-y-auto">
            {pool.map(a => (
              <button key={a.id} onClick={()=>setSelected(a)} className={`group flex w-full items-center gap-3 border-b border-gray-800/80 px-4 py-3 text-left transition-colors ${selected?.id===a.id?'bg-cyan-400/[0.06]':'hover:bg-cyan-400/[0.03]'}`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-md border ${selected?.id===a.id?'border-cyan-500/50 text-cyan-300':'border-gray-800 text-gray-500'} bg-[#0E0E0E]`}>
                  <FileSignature className="h-4 w-4"/>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-100">{a.address}</div>
                  <div className="font-mono text-[10px] tracking-wider text-gray-600">{a.id} · MAO {fmt(a.mao)}</div>
                </div>
                <StatusPill status={a.status}/>
              </button>
            ))}
          </div>
        </div>

        {/* Document viewer */}
        <div className="overflow-hidden rounded-md border border-gray-800 bg-[#0A0A0A]">
          <div className="flex items-center justify-between border-b border-gray-800 bg-[#0C0C0C] px-4 py-2.5">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-gray-400">
              <FileText className="h-3.5 w-3.5 text-cyan-400"/>
              {doc ? doc.number+'.pdf' : 'DRAFTING...'}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>exportPDF()} disabled={!doc} className="inline-flex h-7 items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 font-mono text-[10px] font-bold tracking-[0.15em] text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                <Printer className="h-3 w-3"/>EXPORT PDF
              </button>
              <button onClick={()=>toast('NOTARY DISPATCHED', doc.number)} className="inline-flex h-7 items-center gap-1.5 rounded-md border border-gray-800 bg-[#0C0C0C] px-3 font-mono text-[10px] tracking-[0.15em] text-gray-300 hover:border-cyan-500/40 hover:text-cyan-300">
                <FileSignature className="h-3 w-3"/>NOTARY
              </button>
            </div>
          </div>

          <div className="bg-[#080808] p-6 min-h-[640px]">
            {loading || !selected || !doc ? (
              <div className="flex h-[600px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-cyan-400"/>
                  <div className="mt-4 font-mono text-[11px] tracking-[0.25em] text-cyan-300">FORGING DOCUMENT...</div>
                  <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-gray-600">INJECTING ASSET · ENTITY · MAO</div>
                </div>
              </div>
            ) : (
              /* Stylized "document" sheet */
              <div className="mx-auto max-w-2xl rounded-sm bg-[#F5F1E8] p-10 font-serif text-gray-900 shadow-[0_0_60px_-15px_rgba(0,229,255,0.3)]">
                <div className="flex items-center justify-between border-b border-gray-400 pb-3 text-[10px] tracking-[0.2em] text-gray-600">
                  <span>RODNEY &amp; SONS · LEGAL DEPT</span><span>{doc.number}</span>
                </div>
                <h2 className="mt-6 text-center text-xl font-bold tracking-[0.15em]">ASSIGNMENT OF REAL ESTATE PURCHASE CONTRACT</h2>
                <p className="mt-6 text-[13px] leading-relaxed">
                  THIS ASSIGNMENT OF REAL ESTATE PURCHASE CONTRACT (this <em>&ldquo;Assignment&rdquo;</em>)
                  is made and entered into effective as of <strong>{doc.date}</strong>, by and between
                  <strong> {doc.buyer}</strong>, a Missouri limited liability company
                  (<em>&ldquo;Assignor&rdquo;</em>), and the party identified below
                  (<em>&ldquo;Assignee&rdquo;</em>).
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4 rounded-sm border border-gray-300 bg-[#EDE7D4] p-4 text-[12px]">
                  <Sealed label="SUBJECT PROPERTY"   value={doc.property}/>
                  <Sealed label="ORIGINAL SELLER"    value={doc.seller}/>
                  <Sealed label="PURCHASE PRICE"     value={fmt(doc.purchase)}/>
                  <Sealed label="ASSIGNMENT FEE"     value={fmt(doc.assignmentFee)}/>
                  <Sealed label="CLOSING DEADLINE"   value={doc.closeBy}/>
                  <Sealed label="ASSIGNEE"           value={doc.assignee}/>
                </div>
                <p className="mt-5 text-[13px] leading-relaxed">
                  <strong>1. Assignment.</strong> Assignor hereby irrevocably transfers, assigns, and
                  conveys to Assignee all of Assignor&apos;s right, title, and interest in and to that
                  certain Real Estate Purchase Contract dated {doc.date} (the <em>&ldquo;Contract&rdquo;</em>)
                  pertaining to the Subject Property described above.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed">
                  <strong>2. Consideration.</strong> In consideration of this Assignment, Assignee shall
                  pay to Assignor the Assignment Fee in immediately available funds at the closing of
                  the underlying transaction.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed">
                  <strong>3. Representations.</strong> Assignor represents that the Contract is in full
                  force and effect and that Assignor has full authority to make this Assignment without
                  the consent of any third party.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-10 text-[12px]">
                  <div>
                    <div className="border-b border-gray-700 pb-1 font-bold">ASSIGNOR</div>
                    <div className="mt-2">By: ____________________________</div>
                    <div className="mt-1 text-gray-600">{doc.buyer}</div>
                    <div className="text-gray-600">Title: Managing Member</div>
                  </div>
                  <div>
                    <div className="border-b border-gray-700 pb-1 font-bold">ASSIGNEE</div>
                    <div className="mt-2">By: ____________________________</div>
                    <div className="mt-1 text-gray-600">{doc.assignee}</div>
                    <div className="text-gray-600">Title: ____________________</div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-400 pt-3 text-center text-[9px] tracking-[0.3em] text-gray-500">
                  AUTO-GENERATED BY SV-1500 CORE · NOTARY READY · {doc.number}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
const Sealed = ({ label, value }) => (
  <div>
    <div className="text-[9px] font-bold tracking-[0.25em] text-gray-500">{label}</div>
    <div className="mt-0.5 text-[13px] font-semibold text-gray-900">{value}</div>
  </div>
)

// ============================================================================
//  VIEW 5 :: WAR ROOM (Executive Dashboard)
// ============================================================================
const WarRoomView = ({ assets }) => {
  const pipeline = assets.filter(a => a.status !== 'Closed').reduce((s,a)=>s+(a.arv||0),0)
  const deployed = assets.filter(a=>['In Escrow','Closed','Contract Sent'].includes(a.status)).reduce((s,a)=>s+(a.mao||0),0)
  const escrows = assets.filter(a=>a.status==='In Escrow').length
  const closed = assets.filter(a=>a.status==='Closed').length
  const delq = assets.filter(a=>a.taxDelq).length
  const avgHeat = Math.round(assets.reduce((s,a)=>s+a.heat,0)/(assets.length||1))
  const maxLeads = Math.max(...WEEKLY_FLOW.map(d=>d.leads))

  return (
    <div className="px-8 pt-8 pb-16">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-cyan-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.9)]"/>
        EXECUTIVE COMMAND · LIVE FEED
      </div>
      <h1 className="mt-2 text-4xl font-bold tracking-[0.04em] text-white">WAR <span className="text-cyan-400">ROOM</span></h1>
      <p className="mt-1 max-w-xl text-sm text-gray-500">Global pipeline telemetry · all systems operational.</p>

      {/* Mega counters */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <MegaCounter label="TOTAL PIPELINE VALUE" value={fmtCompact(pipeline)} icon={TrendingUp} accent="text-cyan-300" glow="rgba(0,229,255,0.5)" sub={`${assets.length} active assets`}/>
        <MegaCounter label="CAPITAL DEPLOYED"     value={fmtCompact(deployed)} icon={DollarSign} accent="text-emerald-300" glow="rgba(16,185,129,0.5)" sub="MAO in flight"/>
        <MegaCounter label="ACTIVE ESCROWS"       value={String(escrows).padStart(2,'0')} icon={Crown} accent="text-amber-300" glow="rgba(245,158,11,0.5)" sub={`${closed} closed YTD`}/>
        <MegaCounter label="AVG DEAL HEAT"        value={String(avgHeat).padStart(2,'0')+'°'} icon={Flame} accent="text-red-300" glow="rgba(239,68,68,0.4)" sub={`${delq} delinquent`}/>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Weekly bar chart */}
        <div className="rounded-md border border-gray-800 bg-[#0A0A0A] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-gray-500">/// WEEKLY DEAL FLOW</div>
              <div className="mt-1 text-sm font-semibold text-gray-200">Lead Ingestion · Contracts · Closes</div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-wider">
              <LegendDot color="bg-cyan-400"     label="LEADS"/>
              <LegendDot color="bg-purple-400"   label="CONTRACTS"/>
              <LegendDot color="bg-emerald-400"  label="CLOSED"/>
            </div>
          </div>
          <div className="mt-6 flex h-56 items-end justify-between gap-3">
            {WEEKLY_FLOW.map(d => (
              <div key={d.d} className="group relative flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-end justify-center gap-1 h-full">
                  <BarSeg h={(d.leads/maxLeads)*100}     cls="bg-gradient-to-t from-cyan-700/60 to-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.6)]" v={d.leads}/>
                  <BarSeg h={(d.contracts/maxLeads)*100} cls="bg-gradient-to-t from-purple-700/60 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" v={d.contracts}/>
                  <BarSeg h={(d.closed/maxLeads)*100}    cls="bg-gradient-to-t from-emerald-700/60 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" v={d.closed}/>
                </div>
                <div className="font-mono text-[10px] tracking-wider text-gray-500">{d.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline distribution */}
        <div className="rounded-md border border-gray-800 bg-[#0A0A0A] p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] text-gray-500">/// PIPELINE DISTRIBUTION</div>
          <div className="mt-4 space-y-3">
            {PIPELINE.map(s => {
              const count = assets.filter(a=>a.status===s).length
              const pct = (count / assets.length) * 100
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-gray-300"><span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}`}/>{s}</span>
                    <span className="font-mono text-gray-400">{count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-800">
                    <div className={`h-full ${STATUS_DOT[s]} shadow-[0_0_10px_rgba(0,229,255,0.5)]`} style={{width:pct+'%'}}/>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 border-t border-gray-800 pt-4">
            <div className="font-mono text-[10px] tracking-[0.25em] text-gray-500">/// TOP HEATSCORE</div>
            <div className="mt-3 space-y-2">
              {[...assets].sort((a,b)=>b.heat-a.heat).slice(0,3).map(a => (
                <div key={a.id} className="flex items-center justify-between gap-3 rounded-md border border-gray-800/80 bg-[#0C0C0C] p-2">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-gray-100">{a.address}</div>
                    <div className="font-mono text-[10px] tracking-wider text-gray-600">{fmt(a.mao)}</div>
                  </div>
                  <span className="font-mono text-sm font-bold text-cyan-300">{a.heat}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity heatmap */}
      <div className="mt-4 rounded-md border border-gray-800 bg-[#0A0A0A] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-gray-500">/// 28-DAY ACTIVITY HEATMAP</div>
            <div className="mt-1 text-sm font-semibold text-gray-200">Ingestion intensity grid</div>
          </div>
          <div className="flex items-center gap-1 font-mono text-[9px] tracking-wider text-gray-500">
            LOW
            {[0.15, 0.35, 0.6, 0.85].map(o => (
              <span key={o} className="h-3 w-3 rounded-sm bg-cyan-400" style={{opacity:o}}/>
            ))}
            HIGH
          </div>
        </div>
        <div className="mt-4 grid grid-cols-28 gap-1.5" style={{gridTemplateColumns:'repeat(28, minmax(0,1fr))'}}>
          {Array.from({length:28}).map((_,i) => {
            const intensity = ((Math.sin(i*1.3)+1)/2)*0.7 + Math.random()*0.3
            return (
              <div key={i} className="aspect-square rounded-sm bg-cyan-400 transition-all hover:scale-125 hover:shadow-[0_0_10px_rgba(0,229,255,0.9)]" style={{opacity: 0.08 + intensity*0.9}} title={`Day ${i+1}`}/>
            )
          })}
        </div>
      </div>
    </div>
  )
}
const BarSeg = ({ h, cls, v }) => (
  <div className="group/seg relative flex flex-1 items-end">
    <div className="w-full rounded-t-sm transition-all duration-500" style={{height:h+'%'}}>
      <div className={`h-full w-full rounded-t-sm ${cls}`}/>
    </div>
    <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-gray-400 opacity-0 group-hover/seg:opacity-100">{v}</span>
  </div>
)
const LegendDot = ({ color, label }) => (
  <span className="flex items-center gap-1.5 text-gray-500"><span className={`h-1.5 w-1.5 rounded-full ${color}`}/>{label}</span>
)
const MegaCounter = ({ label, value, icon:Icon, accent, glow, sub }) => (
  <div className="relative overflow-hidden rounded-md border border-gray-800 bg-[#0A0A0A] p-5">
    <div aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl" style={{background:glow}}/>
    <div className="relative flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-gray-500">
      <span>{label}</span><Icon className="h-3.5 w-3.5 text-gray-600"/>
    </div>
    <div className={`relative mt-2 font-mono text-4xl font-bold tabular-nums tracking-tight ${accent}`}>{value}</div>
    {sub && <div className="relative mt-1 font-mono text-[10px] tracking-wider text-gray-500">{sub}</div>}
  </div>
)

// ============================================================================
//  TOP BAR (shared across all views)
// ============================================================================
const TopBar = ({ view }) => {
  const TITLE = {war:'WAR ROOM',vault:'ASSET VAULT',board:'LIVE BOARD',escrow:'DIGITAL ESCROW',core:'SV-1500 CORE'}
  return (
    <div className="sticky top-0 z-20 border-b border-gray-800 bg-[#050505]/85 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-3.5">
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] tracking-[0.3em] text-gray-500">RODNEY &amp; SONS ///</div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400">{TITLE[view]}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-gray-800 bg-[#0C0C0C] px-3 py-1.5 font-mono text-[10px] tracking-wider text-gray-400">
            <Clock className="h-3 w-3 text-cyan-400"/>
            {new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}
            <span className="text-gray-600">·</span>
            <span className="text-emerald-400">SECURE</span>
          </div>
          <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 font-mono text-[10px] font-semibold tracking-[0.18em] text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.7)]">
            <Sparkles className="h-3 w-3"/>GOD MODE
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
//  ROOT  ::  APEX TERMINAL
// ============================================================================
const ApexTerminal = () => {
  // SESSIONS LISTENER: Real-time Supabase Auth Handshake
  const [session, setSession] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  const [view, setView] = useState('vault')
    const [assets, setAssets] = useState([]);

  React.useEffect(() => {
    const fetchLivePipeline = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('missouri_properties')
        .select('*')
        .eq('user_id', session.user.id); // Strict User Filtering Applied
        
      if (error) console.error('>>> SUPABASE ERROR:', error);
      if (data) {
        // WAR ROOM TELEMETRY: Normalize DB columns to UI props
        const normalizedData = data.map(item => ({
          ...item,
          name: item.address || 'Unknown Address',
          title: item.address,
          location: item.county || 'St. Louis City',
          price: item.arv > 0 ? '$' + item.arv.toLocaleString() : 'Calculate ARV',
          statusBadge: item.deal_status || item.status || 'UNASSIGNED',
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
          heat: item.heat || 0,
          taxDelq: item.tax_delq || false,
          taxYears: item.tax_years || 0,
          owner: item.owner_name || 'Pending SOS Lookup',
          entityType: item.entity_type || 'LLC',
        }));
        setAssets(normalizedData);
      }
    };
    fetchLivePipeline();
    
    // WAR ROOM TELEMETRY: Supabase Realtime Sync
    supabase
      .channel('realtime_vault')
      .on(
        'postgres_changes',
        {
          schema: 'public',
          table: 'missouri_properties',
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          console.log('SUPABASE SYNC', payload);
          fetchLivePipeline();
        }
      )
      .subscribe();
  }, [session]);
  const [toasts, setToasts] = useState([])

  // Ghost-piped fetch: tries localhost:8000 then simulates on catch
  const ghostFetch = async (path, body, simulate) => {
    try {
      const res = await fetch('http://localhost:8000' + path, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('upstream ' + res.status)
      return await res.json()
    } catch (e) {
      // Simulated success path for preview
      return simulate()
    }
  }

  const toast = (title, body) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, title, body }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800)
  }
  const closeToast = (id) => setToasts(t => t.filter(x => x.id !== id))

    if (authLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#050505] text-cyan-500 font-mono text-sm tracking-widest">/// INITIALIZING SECURE UPLINK...</div>;
  }

  // DEV BACKDOOR: CTO Override for local engineering
  if (!session && process.env.NODE_ENV !== 'development') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505]">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-widest">APEX TERMINAL</h1>
        <p className="text-gray-500 font-mono text-xs mb-8">UNAUTHORIZED ACCESS DETECTED</p>
        <button onClick={() => window.location.href = '/login'} className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-mono text-xs tracking-[0.2em] hover:bg-cyan-500/20 rounded shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          AUTHENTICATE SESSION
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 antialiased selection:bg-cyan-400/30 selection:text-white">
      {/* Ambient grid */}
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{backgroundImage:'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
      <div aria-hidden className="pointer-events-none fixed -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[120px]"/>

      <Sidebar active={view} onNav={setView} assets={assets}/>

      <main className="relative ml-[250px] min-h-screen">
        <TopBar view={view}/>
        {view==='war'    && <WarRoomView    assets={assets}/>}
        {view==='vault'  && <AssetVaultView assets={assets} setAssets={setAssets} ghostFetch={ghostFetch} toast={toast}/>}
        {view==='board'  && <LiveBoardView  assets={assets} setAssets={setAssets} ghostFetch={ghostFetch} toast={toast}/>}
        {view==='escrow' && <DigitalEscrowView assets={assets} ghostFetch={ghostFetch} toast={toast}/>}
        {view==='core'   && <SV1500View     assets={assets} ghostFetch={ghostFetch} toast={toast}/>}
      </main>

      <ToastStack toasts={toasts} onClose={closeToast}/>
    </div>
  )
}

export default ApexTerminal





















