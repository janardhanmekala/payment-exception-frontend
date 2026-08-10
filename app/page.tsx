"use client";

import { useMemo, useState } from "react";

type NavItem = { label: string; symbol: string; count?: number };
type ExceptionRow = {
  id: string;
  merchant: string;
  type: string;
  amount: string;
  priority: "Critical" | "High" | "Medium";
  owner: string;
  age: string;
  sla: string;
  status: string;
};

const navItems: NavItem[] = [
  { label: "Home", symbol: "⌂" },
  { label: "Exceptions", symbol: "!", count: 128 },
  { label: "Reconciliation", symbol: "↔", count: 24 },
  { label: "Assignment", symbol: "◎", count: 17 },
  { label: "Reports", symbol: "▥" },
];

const adminItems: NavItem[] = [
  { label: "Settings", symbol: "⚙" },
  { label: "Admin", symbol: "◇" },
];

const queue: ExceptionRow[] = [
  { id: "EXC-28491", merchant: "Northstar Retail", type: "Amount mismatch", amount: "$48,920.00", priority: "Critical", owner: "Maya Chen", age: "3h 14m", sla: "42m", status: "Escalated" },
  { id: "EXC-28478", merchant: "Apex Health", type: "Settlement missing", amount: "$26,440.50", priority: "High", owner: "Unassigned", age: "5h 08m", sla: "1h 12m", status: "New" },
  { id: "EXC-28464", merchant: "Greenway Foods", type: "Duplicate payment", amount: "$12,805.90", priority: "High", owner: "Jon Bell", age: "7h 26m", sla: "2h 34m", status: "In progress" },
  { id: "EXC-28439", merchant: "Metro Transit", type: "Invalid account", amount: "$8,610.00", priority: "Medium", owner: "Priya Nair", age: "11h 02m", sla: "4h 58m", status: "Pending info" },
];

const trendData = [
  { day: "Mon", opened: 38, resolved: 30 },
  { day: "Tue", opened: 46, resolved: 35 },
  { day: "Wed", opened: 32, resolved: 43 },
  { day: "Thu", opened: 58, resolved: 48 },
  { day: "Fri", opened: 44, resolved: 50 },
  { day: "Sat", opened: 25, resolved: 28 },
  { day: "Sun", opened: 40, resolved: 47 },
];

function NavGroup({ items, active, onSelect }: { items: NavItem[]; active: string; onSelect: (label: string) => void }) {
  return (
    <div className="nav-group">
      {items.map((item) => (
        <button
          className={`nav-item ${active === item.label ? "active" : ""}`}
          key={item.label}
          onClick={() => onSelect(item.label)}
          type="button"
        >
          <span className="nav-symbol" aria-hidden="true">{item.symbol}</span>
          <span>{item.label}</span>
          {item.count ? <span className="nav-count">{item.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState("Home");
  const [period, setPeriod] = useState("Last 7 days");
  const [scope, setScope] = useState("All teams");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredQueue = useMemo(() => {
    const value = query.toLowerCase().trim();
    if (!value) return queue;
    return queue.filter((row) => Object.values(row).some((field) => field.toLowerCase().includes(value)));
  }, [query]);

  const handleNav = (label: string) => {
    setActive(label);
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-copy"><strong>ClearFlow</strong><small>Payment operations</small></span>
          <button className="close-menu" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation">×</button>
        </div>

        <span className="nav-label">Workspace</span>
        <NavGroup items={navItems} active={active} onSelect={handleNav} />
        <span className="nav-label nav-label-secondary">Manage</span>
        <NavGroup items={adminItems} active={active} onSelect={handleNav} />

        <div className="sidebar-spacer" />
        <div className="support-card">
          <span className="support-icon" aria-hidden="true">?</span>
          <div><strong>Operations guide</strong><small>Processes & controls</small></div>
          <button type="button" aria-label="Open operations guide">→</button>
        </div>
        <div className="user-card">
          <span className="avatar">MC</span>
          <div><strong>Maya Chen</strong><small>Operations lead</small></div>
          <button type="button" aria-label="Open user menu">•••</button>
        </div>
      </aside>

      {menuOpen ? <button className="scrim" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation" /> : null}

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">☰</button>
          <div className="global-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search exceptions" placeholder="Search exception ID, merchant, or type" />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="Notifications"><span aria-hidden="true">◉</span><i /></button>
            <button className="new-button" type="button"><span aria-hidden="true">＋</span> New exception</button>
          </div>
        </header>

        <div className="dashboard">
          <section className="page-heading">
            <div>
              <p className="eyebrow">Monday, August 10</p>
              <h1>Good morning, Maya.</h1>
              <p>Here’s what needs your attention across payment operations.</p>
            </div>
            <div className="filters" aria-label="Dashboard filters">
              <label><span>Scope</span><select value={scope} onChange={(event) => setScope(event.target.value)}><option>All teams</option><option>Payments</option><option>Reconciliation</option><option>Risk review</option></select></label>
              <label><span>Period</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option></select></label>
            </div>
          </section>

          <section className="alert-strip" aria-label="Priority alert">
            <span className="alert-symbol" aria-hidden="true">!</span>
            <div><strong>7 critical exceptions require review</strong><span>Combined exposure of $184,260 · Oldest item is 6 hours from SLA breach</span></div>
            <button type="button">Review critical <span aria-hidden="true">→</span></button>
          </section>

          <section className="metrics-grid" aria-label="Key performance indicators">
            <article className="metric-card">
              <div className="metric-top"><span>Open exceptions</span><span className="metric-icon blue" aria-hidden="true">!</span></div>
              <div className="metric-value">128</div>
              <div className="metric-foot"><span className="trend-up">↑ 8.2%</span><span>vs previous period</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>Value at risk</span><span className="metric-icon amber" aria-hidden="true">$</span></div>
              <div className="metric-value">$1.24M</div>
              <div className="metric-foot"><span className="trend-down">↓ 4.6%</span><span>vs previous period</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>SLA compliance</span><span className="metric-icon green" aria-hidden="true">✓</span></div>
              <div className="metric-value">94.8%</div>
              <div className="metric-foot"><span className="trend-good">↑ 2.1%</span><span>above 92% target</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>Avg. resolution</span><span className="metric-icon violet" aria-hidden="true">◷</span></div>
              <div className="metric-value">6h 42m</div>
              <div className="metric-foot"><span className="trend-good">↓ 38m</span><span>faster this period</span></div>
            </article>
          </section>

          <section className="analytics-grid">
            <article className="panel trend-panel">
              <div className="panel-head">
                <div><h2>Exception activity</h2><p>Opened versus resolved · {period.toLowerCase()}</p></div>
                <div className="legend"><span><i className="opened" />Opened</span><span><i className="resolved" />Resolved</span></div>
              </div>
              <div className="chart-area" role="img" aria-label="Bar chart showing opened and resolved exceptions for the last seven days">
                <div className="y-axis"><span>60</span><span>40</span><span>20</span><span>0</span></div>
                <div className="chart-grid-lines"><i /><i /><i /><i /></div>
                <div className="bar-groups">
                  {trendData.map((item) => (
                    <div className="bar-day" key={item.day}>
                      <div className="bars"><span className="bar opened" style={{ height: `${item.opened * 2.55}px` }} title={`${item.opened} opened`} /><span className="bar resolved" style={{ height: `${item.resolved * 2.55}px` }} title={`${item.resolved} resolved`} /></div>
                      <span>{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-summary"><strong>+29</strong><span>Net backlog change</span><em>Resolution rate improved 6.4%</em></div>
            </article>

            <article className="panel sla-panel">
              <div className="panel-head"><div><h2>SLA health</h2><p>Open exceptions by risk state</p></div><button type="button" aria-label="More SLA options">•••</button></div>
              <div className="sla-content">
                <div className="donut" role="img" aria-label="94.8 percent SLA compliance"><div><strong>94.8%</strong><span>compliant</span></div></div>
                <div className="sla-list">
                  <div><span><i className="on-track" />On track</span><strong>96</strong></div>
                  <div><span><i className="at-risk" />At risk</span><strong>18</strong></div>
                  <div><span><i className="breached" />Breached</span><strong>7</strong></div>
                  <div><span><i className="paused" />Paused</span><strong>7</strong></div>
                </div>
              </div>
              <button className="text-action" type="button">View SLA report <span aria-hidden="true">→</span></button>
            </article>
          </section>

          <section className="panel queue-panel">
            <div className="panel-head queue-head">
              <div><h2>Priority work queue</h2><p>Highest-risk exceptions requiring action</p></div>
              <button className="secondary-button" type="button">View all 128 <span aria-hidden="true">→</span></button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Exception</th><th>Type</th><th>Amount</th><th>Priority</th><th>Owner</th><th>Age / SLA</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {filteredQueue.length ? filteredQueue.map((row) => (
                    <tr key={row.id}>
                      <td><strong>{row.id}</strong><span>{row.merchant}</span></td>
                      <td>{row.type}</td><td className="amount">{row.amount}</td>
                      <td><span className={`priority ${row.priority.toLowerCase()}`}>{row.priority}</span></td>
                      <td><span className={`owner ${row.owner === "Unassigned" ? "unassigned" : ""}`}><i>{row.owner === "Unassigned" ? "–" : row.owner.split(" ").map((part) => part[0]).join("")}</i>{row.owner}</span></td>
                      <td><strong className="age">{row.age}</strong><span className="sla-time">{row.sla} remaining</span></td>
                      <td><span className={`status ${row.status.toLowerCase().replace(" ", "-")}`}>{row.status}</span></td>
                      <td><button className="row-action" type="button" aria-label={`Open ${row.id}`}>→</button></td>
                    </tr>
                  )) : <tr><td className="empty-state" colSpan={8}>No exceptions match “{query}”.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bottom-grid">
            <article className="panel workload-panel">
              <div className="panel-head"><div><h2>Team workload</h2><p>Open work by analyst</p></div><button type="button" aria-label="More workload options">•••</button></div>
              {[
                ["MC", "Maya Chen", "31", "78%"], ["JB", "Jon Bell", "27", "68%"], ["PN", "Priya Nair", "24", "60%"], ["AL", "Alex Liu", "19", "48%"],
              ].map(([initials, name, count, width]) => <div className="workload-row" key={name}><span className="avatar mini">{initials}</span><div><div><strong>{name}</strong><span>{count} open</span></div><i><b style={{ width }} /></i></div></div>)}
            </article>
            <article className="panel causes-panel">
              <div className="panel-head"><div><h2>Top root causes</h2><p>Share of open exceptions</p></div><button type="button" aria-label="More root cause options">•••</button></div>
              {[
                ["Amount mismatch", "38", "30%"], ["Settlement missing", "29", "23%"], ["Duplicate payment", "22", "17%"], ["Invalid account", "17", "13%"],
              ].map(([name, count, width], index) => <div className="cause-row" key={name}><span className="cause-rank">0{index + 1}</span><div><div><strong>{name}</strong><span>{count}</span></div><i><b style={{ width }} /></i></div></div>)}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
