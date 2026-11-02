"use client";

import { useEffect, useMemo, useState } from "react";

type Commission = {
  id?: string;
  transactionId?: string;
  applicationId?: string;
  customerName?: string;
  loanType?: string;
  amount?: number | string;
  commissionAmount?: number | string;
  status?: string;
  payoutDate?: string;
  createdAt?: string;
  referenceId?: string;
  partnerName?: string;
};

function getRows(value: unknown): Commission[] {
  if (Array.isArray(value)) return value as Commission[];
  if (!value || typeof value !== "object") return [];
  const obj = value as Record<string, unknown>;
  for (const key of ["data", "commissions", "transactions", "results", "items"]) {
    const v = obj[key];
    if (Array.isArray(v)) return v as Commission[];
    if (v && typeof v === "object") {
      const nested = getRows(v);
      if (nested.length) return nested;
    }
  }
  return [];
}

const amountOf = (r: Commission) =>
  Number(r.commissionAmount ?? r.amount ?? 0) || 0;

export default function Page() {
  const [rows, setRows] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loanType, setLoanType] = useState("all");
  const [period, setPeriod] = useState("6");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in to view commission data.");
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
        const response = await fetch(`${base}/commission`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`Commission API returned HTTP ${response.status}`);
        const json: unknown = await response.json();
        if (active) setRows(getRows(json));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Commission data could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const paid = rows.filter(r => ["paid", "success", "successful", "completed", "approved"].includes((r.status || "").toLowerCase()));
  const pending = rows.filter(r => (r.status || "").toLowerCase() === "pending");
  const rejected = rows.filter(r => ["rejected", "failed", "deducted"].includes((r.status || "").toLowerCase()));
  const total = rows.reduce((sum, r) => sum + amountOf(r), 0);
  const paidTotal = paid.reduce((sum, r) => sum + amountOf(r), 0);
  const pendingTotal = pending.reduce((sum, r) => sum + amountOf(r), 0);
  const rejectedTotal = rejected.reduce((sum, r) => sum + amountOf(r), 0);

  const visible = useMemo(() => rows.filter(r => {
    const text = [r.id, r.transactionId, r.applicationId, r.referenceId, r.customerName, r.loanType, r.status, r.partnerName].join(" ").toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (status === "all" || (r.status || "").toLowerCase() === status) &&
      (loanType === "all" || (r.loanType || "").toLowerCase() === loanType);
  }), [rows, search, status, loanType]);

  const money = (v: number) => v.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

  function exportCSV() {
    if (!visible.length) return alert("No commission records available to export.");
    const header = ["Application ID", "Customer", "Loan Type", "Commission Amount", "Status", "Payout Date"];
    const data = visible.map(r => [r.applicationId || r.transactionId || r.id || "", r.customerName || "", r.loanType || "", amountOf(r), r.status || "", r.payoutDate || r.createdAt || ""]);
    const csv = [header, ...data].map(row => row.map(v => '"' + String(v ?? "").replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "commission-report.csv"; a.click(); URL.revokeObjectURL(url);
  }

  const cards = [
    { label: "Total Commission", value: total, count: rows.length, icon: "₹", tone: "blue", note: "Total recorded commission" },
    { label: "Paid Commission", value: paidTotal, count: paid.length, icon: "✓", tone: "green", note: "Successfully paid" },
    { label: "Pending Commission", value: pendingTotal, count: pending.length, icon: "◷", tone: "amber", note: "Waiting for confirmation" },
    { label: "Rejected / Deducted", value: rejectedTotal, count: rejected.length, icon: "×", tone: "rose", note: "Rejected or deducted" },
  ];

  const tones: Record<string, string> = {
    blue: "border-blue-100 from-blue-50 to-white text-blue-600",
    green: "border-emerald-100 from-emerald-50 to-white text-emerald-600",
    amber: "border-amber-100 from-amber-50 to-white text-amber-600",
    rose: "border-rose-100 from-rose-50 to-white text-rose-600",
  };

  const months = Array.from({ length: Number(period) }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (Number(period) - 1 - i));
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-IN", { month: "short" }), year: d.getFullYear(), month: d.getMonth() };
  });

  const monthly = months.map(m => ({
    ...m,
    value: rows.filter(r => {
      const d = new Date(r.payoutDate || r.createdAt || "");
      return !Number.isNaN(d.getTime()) && d.getFullYear() === m.year && d.getMonth() === m.month;
    }).reduce((sum, r) => sum + amountOf(r), 0),
  }));
  const maxMonth = Math.max(1, ...monthly.map(m => m.value));

  return (
    <main className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-white p-3 text-slate-900 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <header className="relative isolate overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-sky-100 px-5 py-7 shadow-sm sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="pointer-events-none absolute right-44 top-5 -z-10 h-36 w-36 rounded-full bg-cyan-200/40 blur-2xl" />
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold tracking-[.22em] text-blue-700">DSA FINCORP / REPORTS</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl text-white shadow-lg shadow-blue-600/25">🏅</span>
                <div><h1 className="text-2xl font-black tracking-tight sm:text-4xl">Commission Report</h1><p className="mt-2 text-sm text-slate-600 sm:text-base">Track your earned commission, payout status and detailed history.</p></div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-semibold shadow-sm backdrop-blur">
              <span className="text-xl">💳</span><span>Commission Overview</span>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 right-5 hidden items-end gap-2 opacity-60 md:flex">
            <span className="h-8 w-4 rounded-t-lg bg-blue-300" /><span className="h-14 w-4 rounded-t-lg bg-blue-400" /><span className="h-20 w-4 rounded-t-lg bg-blue-500" /><span className="h-12 w-4 rounded-t-lg bg-cyan-400" />
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {cards.map(c => <article key={c.label} className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${tones[c.tone]}`}>
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-600">{c.label}</p><p className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{money(c.value)}</p></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-black shadow-sm">{c.icon}</span></div>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500"><span>{c.count} records</span><span>{c.note}</span></div>
          </article>)}
        </section>

        <section className="flex flex-col gap-2 rounded-2xl border border-blue-100 bg-white/90 p-3 shadow-sm lg:flex-row lg:items-center">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="⌕  Search application, customer or loan..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="all">All Status</option><option value="paid">Paid</option><option value="success">Success</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="deducted">Deducted</option></select>
          <select value={loanType} onChange={e => setLoanType(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="all">All Loan Types</option>{Array.from(new Set(rows.map(r => r.loanType).filter((v): v is string => Boolean(v)))).map(v => <option key={v} value={v.toLowerCase()}>{v}</option>)}</select>
          <button onClick={exportCSV} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700">↓ Export CSV</button>
        </section>

        {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

        <section className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,.8fr)]">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 p-4 sm:p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">▣</span><div><h2 className="font-extrabold">Commission Transactions</h2><p className="mt-1 text-xs text-slate-500">{visible.length} records found</p></div></div></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white"><tr>{["Application ID","Customer","Loan Type","Commission Amount","Status","Payout Date"].map(h=><th key={h} className="px-4 py-4 text-xs font-bold uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody>{loading ? <tr><td colSpan={6} className="p-12 text-center text-slate-500">Loading commission records…</td></tr> : visible.length === 0 ? <tr><td colSpan={6} className="p-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">₹</span><p className="mt-3 font-bold text-slate-800">{error ? "Commission data unavailable" : "No commission records found"}</p><p className="mt-1 text-xs text-slate-500">{error || "Records will appear here when available from the API."}</p></td></tr> : visible.map((r,i)=>{const s=(r.status||"unknown").toLowerCase();const ok=["paid","success","successful","completed","approved"].includes(s);return <tr key={r.id||r.applicationId||i} className="border-t border-slate-100 transition hover:bg-blue-50/60"><td className="px-4 py-4"><p className="max-w-44 break-all font-bold text-slate-800">{r.applicationId||r.transactionId||r.id||"—"}</p><p className="mt-1 text-xs text-slate-400">{r.referenceId||"No reference"}</p></td><td className="px-4 py-4 text-slate-700">{r.customerName||"—"}</td><td className="px-4 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{r.loanType||"—"}</span></td><td className="whitespace-nowrap px-4 py-4 font-extrabold">{money(amountOf(r))}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${ok?"bg-emerald-100 text-emerald-700":s==="pending"?"bg-amber-100 text-amber-700":"bg-rose-100 text-rose-700"}`}>{r.status||"Unknown"}</span></td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{(r.payoutDate||r.createdAt)&&!Number.isNaN(Date.parse(r.payoutDate||r.createdAt||""))?new Date(r.payoutDate||r.createdAt||"").toLocaleString("en-IN"):"—"}</td></tr>})}</tbody>
              </table>
            </div>
            <footer className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">Showing {visible.length} of {rows.length} commission records</footer>
          </div>

          <aside className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><h2 className="font-extrabold">Commission Overview</h2><p className="mt-1 text-xs text-slate-500">Current loaded records</p></div><span className="rounded-xl bg-blue-50 p-2 text-xl text-blue-700">▥</span></div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full" style={{background:`conic-gradient(#10b981 0deg ${total ? paidTotal/total*360 : 0}deg,#f59e0b ${total ? paidTotal/total*360 : 0}deg ${total ? (paidTotal+pendingTotal)/total*360 : 0}deg,#f43f5e ${total ? (paidTotal+pendingTotal)/total*360 : 0}deg 360deg)`}}>
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-center"><strong className="text-lg">{money(total)}</strong><span className="text-[10px] text-slate-500">Total Commission</span></div>
              </div>
              <div className="min-w-36 flex-1 space-y-4 text-sm">
                {[{label:"Paid",value:paidTotal,color:"bg-emerald-500"},{label:"Pending",value:pendingTotal,color:"bg-amber-500"},{label:"Rejected",value:rejectedTotal,color:"bg-rose-500"}].map(x=><div key={x.label} className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-slate-600"><i className={`h-2.5 w-2.5 rounded-full ${x.color}`} />{x.label}</span><strong>{money(x.value)}</strong></div>)}
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">↗</span><div><h2 className="font-extrabold">Monthly Commission Trend</h2><p className="mt-1 text-xs text-slate-500">Commission amounts by transaction date</p></div></div><select value={period} onChange={e=>setPeriod(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="6">Last 6 Months</option><option value="12">Last 12 Months</option></select></div>
          <div className="mt-6 grid h-40 items-end gap-2 border-b border-l border-slate-200 px-3 sm:gap-4" style={{gridTemplateColumns:`repeat(${monthly.length},minmax(0,1fr))`}}>
            {monthly.map(m=><div key={m.key} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-[10px] font-semibold text-slate-500">{m.value ? money(m.value) : ""}</span><div title={`${m.label}: ${money(m.value)}`} className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-blue-700 to-cyan-400 transition-all" style={{height:`${Math.max(m.value ? 8 : 2,m.value/maxMonth*75)}%`}}/><span className="pb-2 text-[10px] text-slate-500">{m.label}</span></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}
