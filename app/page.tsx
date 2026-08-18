"use client";

import { useMemo, useState } from "react";

type MatchStatus = "Unmatched" | "Partial match" | "Matched";
type ReconItem = { paymentId:string; settlementId:string; counterparty:string; source:string; expected:number; settled:number; age:string; status:MatchStatus };

const navItems = [
  { label:"Overview", glyph:"⌂" }, { label:"Exceptions", glyph:"!", count:128 },
  { label:"Reconciliation", glyph:"⇄", count:24 }, { label:"Assignments", glyph:"✓", count:17 }, { label:"Reports", glyph:"▥" },
];

const queue: ReconItem[] = [
  { paymentId:"PAY-849201", settlementId:"STL-72984", counterparty:"Northstar Retail", source:"Stripe", expected:18450, settled:18000, age:"2h 14m", status:"Partial match" },
  { paymentId:"PAY-849174", settlementId:"—", counterparty:"Apex Health", source:"Adyen", expected:12780, settled:0, age:"4h 08m", status:"Unmatched" },
  { paymentId:"PAY-849108", settlementId:"STL-72941", counterparty:"Metro Transit", source:"JPMorgan", expected:9420.5, settled:9420.5, age:"5h 31m", status:"Matched" },
  { paymentId:"PAY-849066", settlementId:"STL-72907", counterparty:"Greenway Foods", source:"Stripe", expected:8205, settled:8105, age:"7h 46m", status:"Partial match" },
  { paymentId:"PAY-848997", settlementId:"—", counterparty:"Summit Wireless", source:"Checkout.com", expected:6740.25, settled:0, age:"9h 12m", status:"Unmatched" },
  { paymentId:"PAY-848921", settlementId:"STL-72862", counterparty:"Harbor Logistics", source:"Adyen", expected:5280, settled:5280, age:"11h 03m", status:"Matched" },
];

const trend = ["06","07","08","09","10","11","12"];
const systems = [
  { name:"Stripe", detail:"14,280 records", percent:100, value:"$1.82M", state:"Balanced" },
  { name:"Adyen", detail:"8,416 records", percent:99.2, value:"$946K", state:"Review" },
  { name:"JPMorgan", detail:"3,842 records", percent:100, value:"$612K", state:"Balanced" },
  { name:"Checkout.com", detail:"2,109 records", percent:97.8, value:"$284K", state:"Review" },
];
const money = (value:number) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(value);

function Nav({ active, onSelect }:{ active:string; onSelect:(label:string)=>void }) {
  return <nav className="nav-stack" aria-label="Workspace">{navItems.map((item) => <button key={item.label} className={active===item.label?"active":""} type="button" onClick={()=>onSelect(item.label)}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span>{item.count?<b>{item.count}</b>:null}</button>)}</nav>;
}

export default function Home() {
  const [active,setActive] = useState("Reconciliation");
  const [menuOpen,setMenuOpen] = useState(false);
  const [period,setPeriod] = useState("Today, Aug 12");
  const [source,setSource] = useState("All sources");
  const [status,setStatus] = useState("All statuses");
  const [query,setQuery] = useState("");
  const [selected,setSelected] = useState<ReconItem|null>(null);
  const [toast,setToast] = useState("");
  const visibleRows = useMemo(() => { const term=query.toLowerCase().trim(); return queue.filter(row => (!term || Object.values(row).some(value=>String(value).toLowerCase().includes(term))) && (source==="All sources"||row.source===source) && (status==="All statuses"||row.status===status)); },[query,source,status]);
  const notify=(message:string)=>{ setToast(message); window.setTimeout(()=>setToast(""),2600); };
  const reset=()=>{ setSource("All sources");setStatus("All statuses");setQuery(""); };

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen?"open":""}`}>
      <div className="brand"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span><div><strong>ClearFlow</strong><span>Payment operations</span></div><button className="close-nav" type="button" onClick={()=>setMenuOpen(false)} aria-label="Close navigation">×</button></div>
      <p className="nav-label">Workspace</p><Nav active={active} onSelect={(label)=>{setActive(label);setMenuOpen(false)}}/>
      <p className="nav-label manage-label">Manage</p><nav className="nav-stack" aria-label="Manage"><button type="button"><span className="nav-glyph">⚙</span><span>Settings</span></button><button type="button"><span className="nav-glyph">◇</span><span>Admin</span></button></nav>
      <div className="side-spacer"/><div className="close-card"><span className="pulse-dot"/><div><strong>Books close in 3 days</strong><span>August close · 82% complete</span></div><button type="button" onClick={()=>notify("Close checklist opened")}>→</button></div>
      <div className="profile"><span className="avatar">MC</span><div><strong>Maya Chen</strong><span>Operations lead</span></div><button type="button" aria-label="Profile options">•••</button></div>
    </aside>
    {menuOpen?<button className="mobile-scrim" type="button" aria-label="Close navigation" onClick={()=>setMenuOpen(false)}/>:null}
    <main>
      <header className="topbar"><button className="menu-button" type="button" onClick={()=>setMenuOpen(true)}>Menu</button><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search payment, settlement or counterparty" aria-label="Search reconciliation records"/><kbd>⌘ K</kbd></label><div className="top-actions"><button className="icon-button" type="button" aria-label="Notifications">♢<i/></button><button className="primary-button" type="button" onClick={()=>notify("Reconciliation run started")}><span>↻</span> Run reconciliation</button></div></header>
      <div className="dashboard">
        <section className="page-title"><div><p className="breadcrumb">Operations <span>/</span> Reconciliation</p><h1>Reconciliation dashboard</h1><p>Monitor settlement accuracy and resolve breaks before close.</p></div><div className="title-actions"><span className="last-sync"><i/> Last synced 2 min ago</span><label><span className="sr-only">Reporting period</span><select value={period} onChange={e=>setPeriod(e.target.value)}><option>Today, Aug 12</option><option>Yesterday, Aug 11</option><option>Last 7 days</option><option>August 2026</option></select></label><button type="button" onClick={()=>notify("Report exported")}><span>⇩</span> Export</button></div></section>
        <section className="kpi-grid" aria-label="Reconciliation summary">
          <article><div className="kpi-head"><span>Total processed</span><i className="kpi-icon indigo">▣</i></div><strong>$3.68M</strong><p><em className="good">↑ 8.4%</em> vs. previous day</p></article>
          <article><div className="kpi-head"><span>Auto-match rate</span><i className="kpi-icon green">✓</i></div><strong>98.6%</strong><p><em className="good">↑ 0.7%</em> above 98% target</p></article>
          <article><div className="kpi-head"><span>Unmatched value</span><i className="kpi-icon coral">!</i></div><strong>$48,920</strong><p><em className="bad">↑ 12.1%</em> across 24 items</p></article>
          <article><div className="kpi-head"><span>Net variance</span><i className="kpi-icon gold">±</i></div><strong>$1,284</strong><p><em className="good">↓ 18.2%</em> within tolerance</p></article>
        </section>
        <section className="insight-grid">
          <article className="panel trend-panel"><div className="panel-title"><div><h2>Match rate trend</h2><p>Daily automated match performance</p></div><span className="target-label"><i/> Target 98%</span></div><div className="line-chart" role="img" aria-label="Match rate rose from 96.8 percent to 98.6 percent over seven days"><div className="axis-labels"><span>100%</span><span>98%</span><span>96%</span><span>94%</span></div><div className="plot"><i className="grid g1"/><i className="grid g2"/><i className="grid g3"/><i className="grid g4"/><i className="target-line"/><svg viewBox="0 0 700 170" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5267df" stopOpacity=".22"/><stop offset="1" stopColor="#5267df" stopOpacity="0"/></linearGradient></defs><path className="area" d="M4,97 L119,75 L234,94 L349,53 L464,43 L579,64 L696,34 L696,170 L4,170 Z"/><path className="line" d="M4,97 L119,75 L234,94 L349,53 L464,43 L579,64 L696,34"/>{[97,75,94,53,43,64,34].map((cy,index)=><circle key={cy+index} cx={4+index*115.3} cy={cy} r={index===6?5:3.5}/>)}</svg><div className="x-labels">{trend.map(day=><span key={day}>{day}</span>)}</div><div className="chart-tip"><strong>98.6%</strong><span>Aug 12</span></div></div></div><div className="chart-footer"><div><span>7-day average</span><strong>97.7%</strong></div><div><span>Best day</span><strong>98.6%</strong></div><div><span>Manual matches</span><strong>386</strong></div></div></article>
          <article className="panel status-panel"><div className="panel-title"><div><h2>Settlement status</h2><p>29,406 records processed</p></div><button type="button" aria-label="Settlement options">•••</button></div><div className="donut-row"><div className="donut" role="img" aria-label="28,996 matched records out of 29,406"><div><strong>29.4K</strong><span>Total records</span></div></div><div className="donut-legend"><div><span><i className="matched"/>Matched</span><strong>28,996</strong><em>98.6%</em></div><div><span><i className="partial"/>Partial match</span><strong>386</strong><em>1.3%</em></div><div><span><i className="unmatched"/>Unmatched</span><strong>24</strong><em>0.1%</em></div></div></div><button className="panel-link" type="button" onClick={()=>setStatus("Unmatched")}>Review unmatched items <span>→</span></button></article>
        </section>
        <section className="panel systems-panel"><div className="panel-title"><div><h2>Source system reconciliation</h2><p>Settlement coverage by payment rail</p></div><button className="subtle-button" type="button" onClick={()=>notify("Source detail opened")}>View details</button></div><div className="systems-grid">{systems.map(system=><div className="system" key={system.name}><div className="system-top"><span className={`system-logo ${system.name.toLowerCase().replace(".com","")}`}>{system.name[0]}</span><div><strong>{system.name}</strong><span>{system.detail}</span></div><em className={system.state==="Balanced"?"balanced":"review"}>{system.state==="Balanced"?"✓ ":"• "}{system.state}</em></div><div className="system-values"><span>Matched <strong>{system.percent}%</strong></span><span>Settled <strong>{system.value}</strong></span></div><i className="progress"><b style={{width:`${system.percent}%`}}/></i></div>)}</div></section>
        <section className="panel queue-panel"><div className="panel-title queue-title"><div><div className="title-line"><h2>Reconciliation queue</h2><span className="count-badge">24 open</span></div><p>Items requiring review or manual matching</p></div><div className="queue-actions"><label><span className="sr-only">Source system</span><select value={source} onChange={e=>setSource(e.target.value)}><option>All sources</option><option>Stripe</option><option>Adyen</option><option>JPMorgan</option><option>Checkout.com</option></select></label><label><span className="sr-only">Match status</span><select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option><option>Unmatched</option><option>Partial match</option><option>Matched</option></select></label><button type="button" onClick={reset}>Reset</button></div></div><div className="table-wrap"><table><thead><tr><th>Payment</th><th>Settlement</th><th>Counterparty</th><th>Source</th><th className="right">Expected</th><th className="right">Settled</th><th className="right">Variance</th><th>Status</th><th>Age</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{visibleRows.length?visibleRows.map(row=>{const variance=row.expected-row.settled;return <tr key={row.paymentId}><td><strong className="link-text">{row.paymentId}</strong></td><td><span className={row.settlementId==="—"?"muted":""}>{row.settlementId}</span></td><td><strong className="counterparty">{row.counterparty}</strong></td><td><span className="source-tag"><i>{row.source[0]}</i>{row.source}</span></td><td className="right mono">{money(row.expected)}</td><td className="right mono">{money(row.settled)}</td><td className={`right mono ${variance?"variance":"zero"}`}>{variance?money(variance):"$0.00"}</td><td><span className={`status-pill ${row.status.toLowerCase().replace(" ","-")}`}><i/>{row.status}</span></td><td className="age">{row.age}</td><td><button className="row-button" type="button" onClick={()=>setSelected(row)} aria-label={`Open ${row.paymentId}`}>→</button></td></tr>}):<tr><td className="empty" colSpan={10}>No reconciliation items match these filters. <button type="button" onClick={reset}>Clear filters</button></td></tr>}</tbody></table></div><div className="table-footer"><span>Showing {visibleRows.length} of 24 open items</span><div><button type="button" disabled>←</button><button className="current" type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">→</button></div></div></section>
      </div>
    </main>
    {toast?<div className="toast" role="status"><span>✓</span>{toast}</div>:null}
    {selected?<div className="drawer-layer"><button className="drawer-backdrop" type="button" onClick={()=>setSelected(null)} aria-label="Close reconciliation detail"/><aside className="drawer"><button className="drawer-close" type="button" onClick={()=>setSelected(null)} aria-label="Close">×</button><p className="breadcrumb">Reconciliation item</p><h2>{selected.paymentId}</h2><p className="drawer-party">{selected.counterparty}</p><span className={`status-pill ${selected.status.toLowerCase().replace(" ","-")}`}><i/>{selected.status}</span><dl><div><dt>Expected amount</dt><dd>{money(selected.expected)}</dd></div><div><dt>Settled amount</dt><dd>{money(selected.settled)}</dd></div><div><dt>Variance</dt><dd className="variance">{money(selected.expected-selected.settled)}</dd></div><div><dt>Settlement ID</dt><dd>{selected.settlementId}</dd></div><div><dt>Source</dt><dd>{selected.source}</dd></div><div><dt>Age</dt><dd>{selected.age}</dd></div></dl><label>Resolution note<textarea placeholder="Add context for this reconciliation…"/></label><button className="primary-button drawer-primary" type="button" onClick={()=>{setSelected(null);notify("Item assigned for review")}}>Assign for review</button></aside></div>:null}
  </div>;
}
