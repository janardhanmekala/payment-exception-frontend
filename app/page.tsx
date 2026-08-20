"use client";

import { useMemo, useState } from "react";

type Range = "7 days" | "30 days" | "90 days";
type Report = { title: string; description: string; format: string; updated: string; accent: string };

const navItems = [["Overview", "⌂"], ["Exceptions", "!", "128"], ["Reconciliation", "⇄", "24"], ["Assignments", "✓", "17"], ["Reports", "▥"]];
const ranges: Record<Range, { volume: string; exposure: string; resolution: string; sla: string; delta: number[]; labels: string[] }> = {
  "7 days": { volume: "316", exposure: "$642K", resolution: "2h 02m", sla: "95.1%", delta: [28, 35, 31, 48, 42, 54, 46], labels: ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"] },
  "30 days": { volume: "1,284", exposure: "$2.4M", resolution: "2h 14m", sla: "94.2%", delta: [26, 34, 31, 43, 38, 52, 48, 61, 55, 67, 59, 73], labels: ["Jul 21", "", "", "Jul 28", "", "", "Aug 4", "", "", "Aug 11", "", "Aug 19"] },
  "90 days": { volume: "3,917", exposure: "$7.1M", resolution: "2h 31m", sla: "92.8%", delta: [39, 32, 44, 41, 53, 48, 61, 56, 67, 62, 74, 69], labels: ["May 22", "", "", "Jun 12", "", "", "Jul 3", "", "", "Jul 24", "", "Aug 19"] },
};
const reasons = [
  { name: "Amount mismatch", value: 36, count: 462, color: "#5867d8" },
  { name: "Missing reference", value: 24, count: 308, color: "#32a37b" },
  { name: "Duplicate payment", value: 18, count: 231, color: "#e5a13b" },
  { name: "Fee discrepancy", value: 13, count: 167, color: "#de6c67" },
  { name: "Other", value: 9, count: 116, color: "#a9b1c1" },
];
const processors = [
  { name: "Stripe", initials: "ST", volume: "4,218", rate: "0.72%", exceptions: 304, trend: "−8.2%", tone: "good" },
  { name: "Adyen", initials: "AD", volume: "3,106", rate: "0.94%", exceptions: 292, trend: "+3.1%", tone: "bad" },
  { name: "JPMorgan", initials: "JP", volume: "2,844", rate: "0.58%", exceptions: 165, trend: "−12.4%", tone: "good" },
  { name: "Checkout.com", initials: "CO", volume: "1,923", rate: "0.81%", exceptions: 156, trend: "−1.7%", tone: "good" },
];
const reports: Report[] = [
  { title: "Monthly exception summary", description: "Volumes, causes, exposure and resolution performance", format: "PDF", updated: "Updated Aug 19", accent: "violet" },
  { title: "Processor reconciliation", description: "Settlement accuracy and variance by processor", format: "XLSX", updated: "Updated Aug 18", accent: "mint" },
  { title: "SLA performance", description: "Response and resolution compliance by team", format: "CSV", updated: "Updated Aug 19", accent: "amber" },
];

function Sparkline({ values }: { values: number[] }) {
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${80 - v}`).join(" ");
  return <svg className="sparkline" viewBox="0 0 100 60" preserveAspectRatio="none" aria-label="Exception volume trend"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5867d8" stopOpacity=".26"/><stop offset="1" stopColor="#5867d8" stopOpacity="0"/></linearGradient></defs><polygon points={`0,60 ${points} 100,60`} fill="url(#area)"/><polyline points={points} fill="none" stroke="#5867d8" strokeWidth="2.2" vectorEffect="non-scaling-stroke"/><circle cx="100" cy={80-values.at(-1)!} r="2.8" fill="#fff" stroke="#5867d8" strokeWidth="1.8" vectorEffect="non-scaling-stroke"/></svg>;
}

export default function ReportsDashboard() {
  const [range, setRange] = useState<Range>("30 days");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [reasonMode, setReasonMode] = useState<"Volume" | "Exposure">("Volume");
  const data = ranges[range];
  const visibleReports = useMemo(() => reports.filter(report => report.title.toLowerCase().includes(query.toLowerCase())), [query]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2400); };

  return <div className="app-shell reports-app">
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="brand"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span><div><strong>ClearFlow</strong><span>Payment operations</span></div><button type="button" className="close-nav" onClick={() => setMenuOpen(false)} aria-label="Close navigation">×</button></div>
      <p className="nav-label">Workspace</p><nav className="nav-stack" aria-label="Workspace navigation">{navItems.map(([label, icon, count]) => <button key={label} type="button" className={label === "Reports" ? "active" : ""} onClick={() => setMenuOpen(false)}><span className="nav-glyph">{icon}</span><span>{label}</span>{count && <b>{count}</b>}</button>)}</nav>
      <p className="nav-label manage-label">Manage</p><nav className="nav-stack" aria-label="Manage"><button type="button"><span className="nav-glyph">⚙</span><span>Settings</span></button><button type="button"><span className="nav-glyph">◇</span><span>Admin</span></button></nav>
      <div className="side-spacer"/><div className="close-card"><span className="pulse-dot"/><div><strong>Books close in 3 days</strong><span>August close · 82% complete</span></div><button type="button" onClick={() => notify("Close checklist opened")}>→</button></div><div className="profile"><span className="avatar lilac">MC</span><div><strong>Maya Chen</strong><span>Operations lead</span></div><button type="button" aria-label="Profile options">•••</button></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}/>} 
    <main><header className="topbar"><button className="menu-button" type="button" onClick={() => setMenuOpen(true)}>Menu</button><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search reports" aria-label="Search reports"/><kbd>⌘ K</kbd></label><div className="top-actions"><button className="icon-button" type="button" aria-label="Notifications">♢<i/></button><button className="primary-button" type="button" onClick={() => notify("Report export started")}><span>⇩</span> Export report</button></div></header>
      <div className="dashboard reports-dashboard">
        <section className="reports-title"><div><p className="eyebrow">OPERATIONS / REPORTS</p><h1>Reports</h1><p>Monitor exception trends, settlement health, and team performance.</p></div><div className="report-controls"><button type="button" className="secondary-button" onClick={() => notify("Filters opened")}>☷ &nbsp;Filters</button><div className="range-control" aria-label="Date range">{(["7 days", "30 days", "90 days"] as Range[]).map(item => <button type="button" key={item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>)}</div></div></section>

        <section className="report-kpis" aria-label="Report summary">
          <article><div><span>Exception volume</span><em className="up">↑ 6.8%</em></div><strong>{data.volume}</strong><small>vs. previous period</small><i className="micro-bars">{[24,42,31,55,47,66,58,72].map((h,i)=><b key={i} style={{height:`${h}%`}}/>)}</i></article>
          <article><div><span>Total exposure</span><em className="down">↓ 12.3%</em></div><strong>{data.exposure}</strong><small>across open exceptions</small><span className="kpi-symbol exposure">$</span></article>
          <article><div><span>Avg. resolution time</span><em className="down">↓ 18 min</em></div><strong>{data.resolution}</strong><small>target: under 3 hours</small><span className="kpi-symbol clock">◷</span></article>
          <article><div><span>SLA compliance</span><em className="up">↑ 1.4%</em></div><strong>{data.sla}</strong><small>1,210 of 1,284 within SLA</small><i className="kpi-progress"><b style={{width:data.sla}}/></i></article>
        </section>

        <section className="report-grid">
          <article className="panel trend-panel"><div className="panel-heading report-heading"><div><h2>Exception volume</h2><p>Created vs. resolved over time</p></div><div className="legend"><span><i className="created"/>Created</span><span><i className="resolved"/>Resolved</span><button type="button">•••</button></div></div><div className="chart-wrap"><div className="y-axis"><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div><div className="line-chart"><span className="chart-summary"><strong>46</strong><small>exceptions on Aug 19</small></span><Sparkline values={data.delta}/><div className="x-axis">{data.labels.map((label,i)=><span key={i}>{label}</span>)}</div></div></div><div className="trend-footer"><span><i className="status-dot good"/> 78% resolved within 24 hours</span><button type="button" onClick={() => notify("Trend details opened")}>View trend details →</button></div></article>
          <article className="panel reasons-panel"><div className="panel-heading report-heading"><div><h2>Exceptions by reason</h2><p>Share of total volume</p></div><div className="tiny-toggle"><button className={reasonMode === "Volume" ? "selected" : ""} onClick={() => setReasonMode("Volume")}>Volume</button><button className={reasonMode === "Exposure" ? "selected" : ""} onClick={() => setReasonMode("Exposure")}>Exposure</button></div></div><div className="reason-body"><div className="donut" style={{background:`conic-gradient(${reasons.map((r,i)=>`${r.color} ${reasons.slice(0,i).reduce((s,x)=>s+x.value,0)}% ${reasons.slice(0,i+1).reduce((s,x)=>s+x.value,0)}%`).join(",")})`}}><span><strong>{reasonMode === "Volume" ? "1,284" : "$2.4M"}</strong><small>{reasonMode.toLowerCase()}</small></span></div><div className="reason-list">{reasons.map(reason => <div key={reason.name}><i style={{background:reason.color}}/><span>{reason.name}</span><strong>{reason.value}%</strong><small>{reasonMode === "Volume" ? reason.count : `$${Math.round(reason.count*1.87)}K`}</small></div>)}</div></div></article>
        </section>

        <section className="lower-grid">
          <article className="panel processor-panel"><div className="panel-heading report-heading"><div><h2>Processor performance</h2><p>Exception rate and movement by payment source</p></div><button className="text-button" type="button" onClick={() => notify("Processor report opened")}>View full report →</button></div><div className="processor-table" role="table"><div className="processor-row table-head" role="row"><span>Processor</span><span>Transactions</span><span>Exception rate</span><span>Exceptions</span><span>vs. prior period</span></div>{processors.map((processor,index) => <button type="button" className="processor-row" role="row" key={processor.name} onClick={() => notify(`${processor.name} details opened`)}><span className="processor-name"><i className={`processor-logo logo-${index}`}>{processor.initials}</i><strong>{processor.name}</strong></span><span>{processor.volume}</span><span><b className="rate-bar"><i style={{width:`${parseFloat(processor.rate)*68}%`}}/></b>{processor.rate}</span><span>{processor.exceptions}</span><span><em className={processor.tone}>{processor.trend}</em><b className="row-arrow">›</b></span></button>)}</div></article>
          <article className="panel insights-panel"><div className="panel-heading report-heading"><div><h2>Insights</h2><p>Signals worth your attention</p></div><span className="insight-count">3 new</span></div><div className="insight-list"><button type="button" onClick={() => notify("Insight opened")}><span className="insight-icon warn">↗</span><span><strong>Adyen mismatches are rising</strong><small>Amount mismatches increased 18% this week.</small><em>Review processor details →</em></span></button><button type="button" onClick={() => notify("Insight opened")}><span className="insight-icon success">✓</span><span><strong>Resolution time improved</strong><small>The team is resolving cases 18 minutes faster.</small><em>See team performance →</em></span></button><button type="button" onClick={() => notify("Insight opened")}><span className="insight-icon info">◎</span><span><strong>$184K exposure concentrated</strong><small>Three accounts make up 41% of open exposure.</small><em>View account breakdown →</em></span></button></div></article>
        </section>

        <section className="panel saved-reports"><div className="panel-heading report-heading"><div><h2>Saved reports</h2><p>Ready-to-use exports for your recurring workflows</p></div><button className="secondary-button" type="button" onClick={() => notify("Report builder opened")}>＋ Create custom report</button></div><div className="saved-grid">{visibleReports.map(report => <article key={report.title}><span className={`file-icon ${report.accent}`}>▤<small>{report.format}</small></span><div><h3>{report.title}</h3><p>{report.description}</p><small>{report.updated}</small></div><button type="button" onClick={() => notify(`${report.title} downloaded`)} aria-label={`Download ${report.title}`}>⇩</button></article>)}</div>{!visibleReports.length && <div className="report-empty">No saved reports match “{query}”.</div>}</section>
      </div>
    </main>{toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
  </div>;
}
