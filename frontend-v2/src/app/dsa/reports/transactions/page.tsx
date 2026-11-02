"use client";

import { useEffect, useMemo, useState } from "react";

type Tx = {
  id?: string; transactionId?: string; referenceId?: string;
  type?: string; category?: string; amount?: number | string;
  status?: string; createdAt?: string; paymentMethod?: string;
  description?: string;
};

function extract(payload: unknown): Tx[] {
  if (Array.isArray(payload)) return payload as Tx[];
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  for (const k of ["data", "transactions", "results", "items"]) {
    const v = obj[k];
    if (Array.isArray(v)) return v as Tx[];
    if (v && typeof v === "object") {
      const nested = extract(v);
      if (nested.length) return nested;
    }
  }
  return [];
}

export default function Page() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Login required to view transactions.");
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
        const res = await fetch(`${base}/transaction`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Transaction API error: ${res.status}`);
        const json: unknown = await res.json();
        if (active) setRows(extract(json));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Could not load data.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => rows.filter(r => {
    const text = [r.id, r.transactionId, r.referenceId, r.type, r.category, r.status, r.description, r.paymentMethod].join(" ").toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (status === "all" || (r.status || "").toLowerCase() === status) &&
      (type === "all" || (r.type || "").toLowerCase() === type);
  }), [rows, search, status, type]);

  const successful = rows.filter(r => ["success","successful","completed","approved"].includes((r.status || "").toLowerCase())).length;
  const pending = rows.filter(r => (r.status || "").toLowerCase() === "pending").length;
  const failed = rows.filter(r => ["failed","rejected"].includes((r.status || "").toLowerCase())).length;

  function exportCSV() {
    if (!visible.length) return alert("No transactions available to export.");
    const head = ["Transaction ID","Reference","Date","Type","Category","Amount","Status","Payment Method"];
    const data = visible.map(r => [r.transactionId || r.id || "",r.referenceId || "",r.createdAt || "",r.type || "",r.category || "",r.amount ?? "",r.status || "",r.paymentMethod || ""]);
    const csv = [head,...data].map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));
    const a = document.createElement("a"); a.href = url; a.download = "quick-transaction-report.csv"; a.click(); URL.revokeObjectURL(url);
  }

  const money = (v?: number | string) => {
    if (v === undefined || v === null || v === "" || !Number.isFinite(Number(v))) return "—";
    return Number(v).toLocaleString("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2});
  };

  return (
    <main className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/70 to-white p-4 text-slate-900 md:p-7">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-700">DSA FINCORP / REPORTS</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Quick Transaction Report</h1>
            <p className="mt-1 text-sm text-slate-500">Transaction activity, payments and status at a glance.</p>
          </div>
          <button onClick={exportCSV} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5">↓ Export CSV</button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {label:"Total Transactions",value:rows.length,icon:"↔",tone:"text-blue-700 bg-blue-100"},
            {label:"Successful",value:successful,icon:"✓",tone:"text-emerald-700 bg-emerald-100"},
            {label:"Pending",value:pending,icon:"◷",tone:"text-amber-700 bg-amber-100"},
            {label:"Failed / Rejected",value:failed,icon:"×",tone:"text-rose-700 bg-rose-100"},
          ].map(c=><article key={c.label} className="rounded-2xl border border-white bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{c.label}</p><span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-black ${c.tone}`}>{c.icon}</span></div><p className="mt-3 text-3xl font-black">{c.value}</p></article>)}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div><h2 className="text-lg font-extrabold">Transaction Activity</h2><p className="mt-1 text-xs text-slate-500">{visible.length} matching records</p></div>
            <div className="flex flex-wrap gap-2">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ID or reference..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:w-56"/>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="all">All statuses</option><option value="success">Success</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="rejected">Rejected</option><option value="refunded">Refunded</option></select>
              <select value={type} onChange={e=>setType(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="all">All types</option><option value="credit">Credit</option><option value="debit">Debit</option></select>
            </div>
          </div>
          {error && <div className="m-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gradient-to-r from-blue-700 to-blue-500 text-white"><tr>{["Transaction / Reference","Date & Time","Type","Category","Amount","Status"].map(h=><th key={h} className="px-5 py-4 text-xs font-bold uppercase tracking-wide">{h}</th>)}</tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="p-12 text-center text-slate-500">Loading transactions…</td></tr> :
                visible.length===0 ? <tr><td colSpan={6} className="p-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">↔</span><p className="mt-3 font-bold">{error?"Transactions could not be loaded":"No transactions found"}</p><p className="mt-1 text-xs text-slate-500">{error?"Check the login session and API configuration.":"Try changing your search or filters."}</p></td></tr> :
                visible.map((r,i)=>{const s=(r.status||"unknown").toLowerCase();const credit=(r.type||"").toLowerCase()==="credit";const good=["success","successful","completed","approved"].includes(s);return <tr key={r.id||r.transactionId||i} className="border-t border-slate-100 transition hover:bg-blue-50/60"><td className="px-5 py-4"><p className="font-bold text-slate-800">{r.transactionId||r.id||"—"}</p><p className="mt-1 text-xs text-slate-400">{r.referenceId||"No reference"}</p></td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{r.createdAt&&!Number.isNaN(Date.parse(r.createdAt))?new Date(r.createdAt).toLocaleString("en-IN"):"—"}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${credit?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-700"}`}>{r.type||"—"}</span></td><td className="px-5 py-4 text-slate-600">{r.category||r.description||"—"}</td><td className="whitespace-nowrap px-5 py-4 font-extrabold">{money(r.amount)}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${good?"bg-emerald-50 text-emerald-700":s==="pending"?"bg-amber-50 text-amber-700":["failed","rejected"].includes(s)?"bg-rose-50 text-rose-700":"bg-slate-100 text-slate-600"}`}>{r.status||"Unknown"}</span></td></tr>})}
              </tbody>
            </table>
          </div>
          <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500"><span>Showing {visible.length} of {rows.length} transactions</span><span>DSA FinCorp · Quick Report</span></footer>
        </section>
      </div>
    </main>
  );
}
