"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Coins, Users, Handshake, Network, RefreshCw, Search,
  IndianRupee, CheckCircle2, Clock, XCircle, Download,
  TrendingUp, ClipboardList, ShieldCheck, Eye, Filter
} from "lucide-react";

type Commission = {
  id: string;
  amount?: number;
  commissionAmount?: number;
  loanAmount?: number;
  source?: string | null;
  status?: string;
  createdAt?: string;
  user?: { name?: string; email?: string };
  partner?: { name?: string };
  loan?: { loanType?: string; fullName?: string };
};

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(Number(n || 0));

const amount = (r: Commission) =>
  Number(r.commissionAmount || r.amount || 0);

const statusOf = (r: Commission) =>
  String(r.status || "UNKNOWN").toUpperCase();

const categoryOf = (r: Commission) => {
  const s = String(r.source || "").toLowerCase();
  if (s.includes("referral")) return "Referral";
  if (s.includes("partner")) return "Partner";
  if (s.includes("dsa")) return "DSA";
  return "Loan";
};

function rowsFrom(p: any): Commission[] {
  const options = [
    p?.data?.commissions, p?.data?.items, p?.data?.rows,
    p?.commissions, p?.data, p?.items, p?.rows
  ];
  return options.find(Array.isArray) || [];
}

export default function CommissionRulesPage() {
  const [tab, setTab] = useState<"records" | "workflow">("records");
  const [workflow, setWorkflow] = useState<"PENDING" | "APPROVED" | "PAID" | "REJECTED">("PENDING");
  const [records, setRecords] = useState<Commission[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState("");
  const [selected, setSelected] = useState<Commission | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
      const token = localStorage.getItem("loan_finance_token") || localStorage.getItem("token") || "";
      if (!token) throw new Error("Login session नहीं मिला। कृपया login करें।");

      const response = await fetch(`${base}/commission`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store"
      });

      if (!response.ok) throw new Error(`Commission API returned HTTP ${response.status}`);

      const payload = await response.json();
      setRecords(rowsFrom(payload));
      setUpdated(new Date().toLocaleString("en-IN"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load commission records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const pending = records.filter(r => statusOf(r) === "PENDING");
  const approved = records.filter(r => statusOf(r) === "APPROVED");
  const paid = records.filter(r => statusOf(r) === "PAID");
  const rejected = records.filter(r => statusOf(r) === "REJECTED");

  const totalAmount = records.reduce((s, r) => s + amount(r), 0);
  const pendingAmount = pending.reduce((s, r) => s + amount(r), 0);
  const approvedAmount = approved.reduce((s, r) => s + amount(r), 0);
  const paidAmount = paid.reduce((s, r) => s + amount(r), 0);

  const sourceGroups = [
    { label: "Loan Commission", key: "Loan", icon: Coins },
    { label: "DSA Commission", key: "DSA", icon: Users },
    { label: "Partner Commission", key: "Partner", icon: Handshake },
    { label: "Referral Commission", key: "Referral", icon: Network }
  ];

  const filtered = useMemo(() => {
    let list = records.filter(r => {
      const text = [
        r.id, r.source, r.status, r.user?.name,
        r.user?.email, r.partner?.name, r.loan?.loanType
      ].join(" ").toLowerCase();

      return text.includes(search.toLowerCase()) &&
        (category === "ALL" || categoryOf(r) === category) &&
        (status === "ALL" || statusOf(r) === status);
    });

    if (tab === "workflow") {
      list = list.filter(r => statusOf(r) === workflow);
    }

    list.sort((a, b) => {
      if (sort === "HIGHEST") return amount(b) - amount(a);
      if (sort === "LOWEST") return amount(a) - amount(b);
      if (sort === "OLDEST") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return list;
  }, [records, search, category, status, sort, tab, workflow]);

  const trend = useMemo(() => {
    const months: { label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const total = records.filter(r => {
        if (!r.createdAt) return false;
        const x = new Date(r.createdAt);
        return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth();
      }).reduce((s, r) => s + amount(r), 0);
      months.push({ label: d.toLocaleString("en-IN", { month: "short" }), total });
    }
    return months;
  }, [records]);

  const maxTrend = Math.max(1, ...trend.map(x => x.total));

  const exportCSV = () => {
    const header = ["ID", "Source", "User", "Loan Amount", "Commission", "Status", "Created At"];
    const data = filtered.map(r => [
      r.id, r.source || "", r.user?.name || r.partner?.name || "",
      r.loanAmount || 0, amount(r), statusOf(r), r.createdAt || ""
    ]);
    const csv = [header, ...data].map(row =>
      row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "aifin-commission-records.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: "Total Commission", value: money(totalAmount), count: records.length, icon: Coins, color: "cyan" },
    { label: "Pending", value: money(pendingAmount), count: pending.length, icon: Clock, color: "amber" },
    { label: "Approved", value: money(approvedAmount), count: approved.length, icon: CheckCircle2, color: "green" },
    { label: "Paid", value: money(paidAmount), count: paid.length, icon: ShieldCheck, color: "blue" }
  ];

  const listTabs = [
    { key: "PENDING" as const, label: "Build Requests", count: pending.length, icon: ClipboardList },
    { key: "APPROVED" as const, label: "Approved", count: approved.length, icon: CheckCircle2 },
    { key: "PAID" as const, label: "Paid", count: paid.length, icon: ShieldCheck },
    { key: "REJECTED" as const, label: "Rejected", count: rejected.length, icon: XCircle }
  ];

  return (
    <main className="min-h-screen bg-[#050b18] p-4 text-white sm:p-6 xl:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">

        <header className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-[#123b70] via-[#101f40] to-[#11152e] p-7 shadow-2xl sm:p-10">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"/>
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[.25em] text-cyan-300">AIFIN • Super Admin Control</p>
              <h1 className="text-4xl font-black sm:text-5xl">
                Commission <span className="text-amber-300">Management</span>
              </h1>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Manage live commission records and their approval workflow in one place.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs">
                <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-emerald-300">● Live API</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-300">{records.length} records loaded</span>
                {updated && <span className="px-2 py-2 text-slate-400">Updated {updated}</span>}
              </div>
            </div>
            <button onClick={loadData} disabled={loading} className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 font-bold shadow-lg hover:brightness-110 disabled:opacity-50">
              <RefreshCw size={19} className={loading ? "animate-spin" : ""}/> Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-red-200">
            <p className="font-bold">Live API Error</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        <nav className="flex flex-wrap gap-3 border-b border-white/10 pb-3">
          <button onClick={() => setTab("records")} className={`rounded-xl border px-6 py-4 font-bold ${tab === "records" ? "border-cyan-400 bg-cyan-400/15 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,.12)]" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>
            <span className="flex items-center gap-2"><Coins size={18}/> Commission Records</span>
          </button>
          <button onClick={() => {setTab("workflow");setWorkflow("PENDING");}} className={`rounded-xl border px-6 py-4 font-bold ${tab === "workflow" ? "border-cyan-400 bg-cyan-400/15 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,.12)]" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>
            <span className="flex items-center gap-2"><ClipboardList size={18}/> Build Request &amp; Build Approval</span>
          </button>
        </nav>

        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {kpis.map(k => {
            const Icon = k.icon;
            const tone = k.color === "amber" ? "text-amber-300 bg-amber-400/10 border-amber-300/20" :
              k.color === "green" ? "text-emerald-300 bg-emerald-400/10 border-emerald-300/20" :
              k.color === "blue" ? "text-blue-300 bg-blue-400/10 border-blue-300/20" :
              "text-cyan-300 bg-cyan-400/10 border-cyan-300/20";
            return (
              <article key={k.label} className="rounded-[22px] border border-white/10 bg-gradient-to-br from-[#14243d] to-[#0d1729] p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-400">{k.label}</span>
                  <span className={`rounded-xl border p-3 ${tone}`}><Icon size={23}/></span>
                </div>
                <p className="mt-5 break-words text-3xl font-black">{k.value}</p>
                <p className="mt-2 text-sm text-slate-500">{k.count} database records</p>
              </article>
            );
          })}
        </section>

        {tab === "records" && (
          <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[24px] border border-white/10 bg-[#101b2e] p-6">
              <h2 className="text-xl font-black">Commission Trend</h2>
              <p className="mt-1 text-sm text-slate-500">Six-month totals calculated from actual loaded records</p>
              <div className="mt-6 flex h-56 items-end gap-4 sm:gap-7">
                {trend.map(m => (
                  <div key={m.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-[10px] text-slate-400">{money(m.total)}</span>
                    <div className="flex h-40 w-full items-end rounded-t-lg bg-white/[.04]">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-700 to-cyan-300" style={{height: `${m.total ? Math.max(5,m.total/maxTrend*100) : 0}%`}}/>
                    </div>
                    <span className="text-xs text-slate-400">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#101b2e] p-6">
              <h2 className="text-xl font-black">Commission by Category</h2>
              <p className="mt-1 text-sm text-slate-500">Based on actual source labels</p>
              <div className="mt-6 space-y-6">
                {sourceGroups.map(g => {
                  const count = records.filter(r => categoryOf(r) === g.key).length;
                  const pct = records.length ? count / records.length * 100 : 0;
                  const Icon = g.icon;
                  return <div key={g.key}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-300"><Icon size={17}/>{g.label}</span>
                      <b className="text-cyan-300">{count}</b>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{width:`${pct}%`}}/>
                    </div>
                  </div>;
                })}
              </div>
            </div>
          </section>
        )}

        <section className="rounded-[24px] border border-white/10 bg-[#101b2e] p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">
                {tab === "records" ? "All Commission Records" : "Build Request & Approval Queue"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {tab === "records" ? "Live records from your existing Commission API" : "Pending records are requests awaiting approval; other tabs show their recorded outcomes."}
              </p>
            </div>
            <button onClick={exportCSV} disabled={!filtered.length} className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300 hover:bg-emerald-400/20 disabled:opacity-40">
              <Download size={17}/> Export CSV
            </button>
          </div>

          {tab === "workflow" && (
            <div className="mb-5 flex flex-wrap gap-2">
              {listTabs.map(t => {
                const Icon = t.icon;
                return <button key={t.key} onClick={() => setWorkflow(t.key)} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${workflow === t.key ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>
                  <Icon size={17}/>{t.label}<span className="rounded-full bg-white/10 px-2 py-0.5">{t.count}</span>
                </button>;
              })}
            </div>
          )}

          <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_auto]">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080f20] px-4">
              <Search size={18} className="text-slate-500"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search commission ID, user, source..." className="w-full bg-transparent py-4 text-sm outline-none"/>
            </div>
            {tab === "records" && <select value={category} onChange={e=>setCategory(e.target.value)} className="rounded-xl border border-white/10 bg-[#080f20] px-4 py-3 text-sm text-slate-300">
              <option value="ALL">All Categories</option><option value="Loan">Loan</option><option value="DSA">DSA</option><option value="Partner">Partner</option><option value="Referral">Referral</option>
            </select>}
            {tab === "records" && <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-white/10 bg-[#080f20] px-4 py-3 text-sm text-slate-300">
              <option value="ALL">All Statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="PAID">Paid</option><option value="REJECTED">Rejected</option>
            </select>}
            <select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-xl border border-white/10 bg-[#080f20] px-4 py-3 text-sm text-slate-300">
              <option value="NEWEST">Newest First</option><option value="OLDEST">Oldest First</option><option value="HIGHEST">Highest Amount</option><option value="LOWEST">Lowest Amount</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[#192d4b] text-xs uppercase text-slate-300">
                <tr>
                  <th className="px-5 py-5">Commission ID</th><th className="px-5 py-5">Source</th><th className="px-5 py-5">User / Partner</th><th className="px-5 py-5">Loan Amount</th><th className="px-5 py-5">Commission</th><th className="px-5 py-5">Status</th><th className="px-5 py-5">Date</th><th className="px-5 py-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const s = statusOf(r);
                  const tone = s === "APPROVED" || s === "PAID" ? "bg-emerald-400/10 text-emerald-300" : s === "REJECTED" ? "bg-red-400/10 text-red-300" : "bg-amber-400/10 text-amber-300";
                  return <tr key={r.id} className="border-t border-white/[.06] hover:bg-cyan-400/[.035]">
                    <td className="px-5 py-5 font-mono text-xs text-cyan-300">{r.id}</td>
                    <td className="px-5 py-5 text-slate-200">{r.source || r.loan?.loanType || "—"}</td>
                    <td className="px-5 py-5 text-slate-300">{r.partner?.name || r.user?.name || r.user?.email || "—"}</td>
                    <td className="px-5 py-5">{money(r.loanAmount || 0)}</td>
                    <td className="px-5 py-5 font-black text-emerald-300">{money(amount(r))}</td>
                    <td className="px-5 py-5"><span className={`rounded-full px-3 py-2 text-xs font-bold ${tone}`}>{s}</span></td>
                    <td className="px-5 py-5 text-xs text-slate-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-5 py-5"><button onClick={()=>setSelected(r)} title="View details" className="rounded-lg border border-cyan-400/20 p-2 text-cyan-300 hover:bg-cyan-400/10"><Eye size={17}/></button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>

          {!loading && !filtered.length && <div className="py-16 text-center text-slate-400"><Coins size={40} className="mx-auto mb-3 text-cyan-300"/><p className="font-bold">No matching records</p><p className="mt-1 text-sm">No real database records match the selected filters.</p></div>}
          {loading && <div className="py-12 text-center text-cyan-300"><RefreshCw className="mx-auto animate-spin"/><p className="mt-3">Loading database records...</p></div>}
          <p className="mt-4 text-sm text-slate-500">Showing {filtered.length} matching database records</p>
        </section>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={()=>setSelected(null)}>
            <div className="w-full max-w-xl rounded-2xl border border-cyan-400/30 bg-[#101b2e] p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Commission Details</h3>
                <button onClick={()=>setSelected(null)} className="rounded-lg border border-white/10 px-3 py-2 text-slate-300">Close</button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-500">Commission ID</p><p className="mt-1 break-all text-cyan-300">{selected.id}</p></div>
                <div><p className="text-slate-500">Status</p><p className="mt-1 font-bold">{statusOf(selected)}</p></div>
                <div><p className="text-slate-500">Source</p><p className="mt-1">{selected.source || "—"}</p></div>
                <div><p className="text-slate-500">Commission Amount</p><p className="mt-1 font-bold text-emerald-300">{money(amount(selected))}</p></div>
                <div><p className="text-slate-500">Loan Amount</p><p className="mt-1">{money(selected.loanAmount || 0)}</p></div>
                <div><p className="text-slate-500">User / Partner</p><p className="mt-1">{selected.partner?.name || selected.user?.name || selected.user?.email || "—"}</p></div>
              </div>
              <p className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs text-amber-200">
                This view is read-only. Approval or payout actions must use the authorized backend workflow.
              </p>
            </div>
          </div>
        )}

        <footer className="pb-4 text-center text-xs text-slate-600">
          AIFIN Super Admin • Live Commission API • Read-only workflow view
        </footer>
      </div>
    </main>
  );
}
