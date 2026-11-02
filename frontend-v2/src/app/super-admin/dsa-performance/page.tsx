"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Users, UserRound, Handshake, IndianRupee, TrendingUp, FileBarChart2, RefreshCw, Search, Download, BrainCircuit, CheckCircle2, Wallet, Trophy, BarChart3, Filter, FileText, Bot, Target, CircleDollarSign } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

type Row = Record<string, any>;
const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function apiRequest(path: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("loan_finance_token") : null;
  const res = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}
function getRows(v: any, keys: string[] = []): Row[] {
  if (Array.isArray(v)) return v;
  for (const k of keys) { if (Array.isArray(v?.[k])) return v[k]; if (Array.isArray(v?.data?.[k])) return v.data[k]; }
  return Array.isArray(v?.data) ? v.data : [];
}
function name(x: Row) { return x.name || x.fullName || x.partnerName || x.businessName || "Unnamed"; }
function status(x: Row) {
  if (x.isBlocked || ["BLOCKED", "SUSPENDED", "BLACKLISTED"].includes(String(x.status || "").toUpperCase())) return "Blocked";
  if (x.isVerified || ["VERIFIED", "ACTIVE", "APPROVED"].includes(String(x.status || "").toUpperCase())) return "Verified";
  return x.status || "Pending";
}
function money(v: any) {
  const n = Number(v);
  if (v == null || v === "" || !Number.isFinite(n)) return "₹0";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}
function Metric({ title, value, foot, icon: Icon, tone }: any) {
  const tones: Record<string, string> = {
    violet: "border-violet-500/70 from-violet-950 to-[#15142c] text-violet-200",
    blue: "border-blue-500/70 from-blue-950 to-[#101d34] text-blue-200",
    green: "border-emerald-500/70 from-emerald-950 to-[#0b2727] text-emerald-200",
    amber: "border-amber-500/70 from-amber-950 to-[#2a2116] text-amber-200",
    pink: "border-pink-500/70 from-pink-950 to-[#281426] text-pink-200",
  };
  return <div className={`rounded-2xl border bg-gradient-to-br p-4 shadow-xl ${tones[tone]}`}><div className="flex justify-between gap-2"><div><p className="text-xs font-semibold text-slate-200 sm:text-sm break-words">{title}</p><p className="mt-2 text-2xl font-extrabold text-white sm:text-3xl break-words">{value}</p></div><div className="rounded-xl bg-white/10 p-3"><Icon size={23}/></div></div><p className="mt-4 text-[11px] text-slate-300 break-words">{foot}</p></div>;
}
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[#263b59] bg-gradient-to-br from-[#101d30] to-[#0b1422] p-4 shadow-xl ${className}`}>{children}</section>;
}
function EmptyChart({ title, detail }: { title: string; detail: string }) {
  return <div className="mt-4 flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#091321] px-5 text-center"><BarChart3 size={30} className="mb-3 text-slate-500"/><p className="font-semibold text-slate-300 break-words">{title}</p><p className="mt-1 max-w-md text-xs leading-5 text-slate-500 break-words">{detail}</p><span className="mt-3 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase text-amber-300">Waiting for verified API data</span></div>;
}

export default function DSAPerformancePage() {
  const [dsas, setDsas] = useState<Row[]>([]);
  const [partners, setPartners] = useState<Row[]>([]);
  const [commission, setCommission] = useState<any>(null);
  const [leadAnalytics, setLeadAnalytics] = useState<any>(null);
  const [loanAnalytics, setLoanAnalytics] = useState<any>(null);
  const [monthlyLoans, setMonthlyLoans] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("30 Days");

  const load = useCallback(async () => {
    setLoading(true);
    const issues: string[] = [];
    const results = await Promise.allSettled([apiRequest("/super-admin/dsa"), apiRequest("/super-admin/partners"), apiRequest("/super-admin/commission-dashboard"), apiRequest("/lead/analytics"), apiRequest("/super-admin/analytics/loans"), apiRequest("/analytics/monthly-loans")]);
    if (results[0].status === "fulfilled") setDsas(getRows(results[0].value, ["dsas", "users"])); else { setDsas([]); issues.push("DSA API unavailable"); }
    if (results[1].status === "fulfilled") setPartners(getRows(results[1].value, ["partners"])); else { setPartners([]); issues.push("Partner API unavailable"); }
    if (results[2].status === "fulfilled") setCommission(results[2].value?.data ?? results[2].value); else { setCommission(null); issues.push("Commission API unavailable"); }
    if (results[3].status === "fulfilled") setLeadAnalytics(results[3].value?.data ?? results[3].value); else { setLeadAnalytics(null); issues.push("Lead analytics API unavailable"); }
    if (results[4].status === "fulfilled") setLoanAnalytics(results[4].value?.data ?? results[4].value); else { setLoanAnalytics(null); issues.push("Loan analytics API unavailable"); }
    if (results[5]?.status === "fulfilled") {
      setMonthlyLoans(getRows(results[5].value, ["monthlyLoans", "data"]));
    } else {
      setMonthlyLoans([]);
    }
    setErrors(issues); setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const verified = dsas.filter(x => status(x) === "Verified").length;
  const pending = dsas.filter(x => status(x) === "Pending").length;
  const total = dsas.length + partners.length;
  const loanStatusData = [
    { name: "Approved", value: Number(loanAnalytics?.approved || 0), color: "#10b981" },
    { name: "Pending", value: Number(loanAnalytics?.pending || 0), color: "#3b82f6" },
    { name: "Rejected", value: Number(loanAnalytics?.rejected || 0), color: "#f43f5e" },
    { name: "Disbursed", value: Number(loanAnalytics?.disbursedLoans || 0), color: "#a78bfa" },
  ].filter(item => item.value > 0);
  const commissionValue = commission?.totalCommissionAmount ?? commission?.transactionCommission ?? commission?.totalCommission ?? null;

  const directory = useMemo<Row[]>(() => {
    const combined: Row[] = [];

    dsas.forEach((x: Row) => {
      combined.push({ ...x, _kind: "DSA" });
    });

    partners.forEach((x: Row) => {
      combined.push({ ...x, _kind: "Partner" });
    });

    return combined.filter((x: Row) => {
      const q = search.trim().toLowerCase();

      return !q || [
        name(x),
        x.email,
        x.phone,
        x.phoneNo,
        x._kind,
        x.status,
      ].some(v => String(v || "").toLowerCase().includes(q));
    });
  }, [dsas, partners, search]);

  function exportCSV() {
    const data = [["Name", "Type", "Email", "Phone", "Status"], ...directory.map(x => [name(x), x._kind, x.email || "", x.phoneNo || x.phone || "", status(x)])];
    const csv = data.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "aifin-dsa-partner-directory.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return <main className="min-h-screen bg-[#050c17] p-3 text-white sm:p-5 xl:p-6">
    <div className="mx-auto max-w-[1700px] space-y-5">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="flex min-w-0 items-start gap-3"><div className="rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-600/30 to-violet-600/20 p-3 text-cyan-300"><Activity size={27}/></div><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-400 break-words">Network Intelligence</p><h1 className="mt-1 min-w-0 break-words text-xl font-extrabold leading-tight sm:text-2xl xl:text-[27px]">DSA &amp; Partner Performance &amp; Reports</h1><p className="mt-1 text-xs text-slate-400 sm:text-sm break-words">Track leads, conversions, disbursements, commissions and partner performance.</p></div></div>
        <div className="flex flex-wrap gap-2"><select value={period} onChange={e => setPeriod(e.target.value)} className="rounded-xl border border-slate-700 bg-[#101c2d] px-3 py-2.5 text-sm"><option>Today</option><option>7 Days</option><option>30 Days</option><option>This Quarter</option><option>Custom</option></select><button onClick={() => void load()} className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300"><RefreshCw size={15}/> Refresh</button></div>
      </header>

      {errors.length > 0 && <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">{errors.join("   ")}. Missing metrics are intentionally unavailable.</div>}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric title="Total DSA & Partners" value={loading ? " " : total.toLocaleString("en-IN")} foot={`${dsas.length} DSA   ${partners.length} Partners`} icon={Users} tone="violet"/>
        <Metric title="Total Leads" value={loading ? "" : leadAnalytics?.totalLeads?.toLocaleString("en-IN") ?? ""} foot="All active leads" icon={UserRound} tone="blue"/>
        <Metric title="Approved Loans" value={loading ? "" : loanAnalytics?.approved?.toLocaleString("en-IN") ?? ""} foot="Approved applications" icon={CheckCircle2} tone="green"/>
        <Metric title="Disbursed Amount" value={loading ? "" : money(loanAnalytics?.disbursedAmount)} foot={`${Number(loanAnalytics?.disbursedLoans ?? 0).toLocaleString("en-IN")} disbursed loans`} icon={Wallet} tone="amber"/>
        <Metric title="Commission Earned" value={loading ? " " : money(commissionValue)} foot="Commission dashboard API" icon={IndianRupee} tone="pink"/>
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-5 min-w-0">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-2">
      <div className="rounded-lg border border-violet-400/20 bg-violet-500/10 p-2">
        <TrendingUp className="text-violet-400" size={21}/>
      </div>
      <div className="min-w-0">
        <h2 className="font-bold text-white">Performance Trend</h2>
        <p className="text-[11px] text-slate-400">{period} · Monthly loan performance</p>
      </div>
    </div>
    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold text-cyan-300">
      LIVE ANALYTICS
    </span>
  </div>

  {monthlyLoans.length > 0 && (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <div className="min-w-0 rounded-xl border border-sky-400/20 bg-sky-400/[.07] p-2.5">
        <p className="truncate text-[10px] text-slate-400">Total Loans</p>
        <p className="mt-1 text-lg font-extrabold text-sky-300">
          {Number(monthlyLoans[monthlyLoans.length - 1]?.totalLoans ?? 0).toLocaleString("en-IN")}
        </p>
        <p className="text-[9px] text-slate-500">Latest month</p>
      </div>
      <div className="min-w-0 rounded-xl border border-emerald-400/20 bg-emerald-400/[.07] p-2.5">
        <p className="truncate text-[10px] text-slate-400">Approved</p>
        <p className="mt-1 text-lg font-extrabold text-emerald-300">
          {Number(monthlyLoans[monthlyLoans.length - 1]?.approvedLoans ?? 0).toLocaleString("en-IN")}
        </p>
        <p className="text-[9px] text-slate-500">Latest month</p>
      </div>
      <div className="min-w-0 rounded-xl border border-violet-400/20 bg-violet-400/[.07] p-2.5">
        <p className="truncate text-[10px] text-slate-400">Pending</p>
        <p className="mt-1 text-lg font-extrabold text-violet-300">
          {Number(monthlyLoans[monthlyLoans.length - 1]?.pendingLoans ?? 0).toLocaleString("en-IN")}
        </p>
        <p className="text-[9px] text-slate-500">Latest month</p>
      </div>
    </div>
  )}

  <div className="mt-3 h-[330px] w-full">
    {monthlyLoans.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={monthlyLoans}
          margin={{ top: 16, right: 18, left: -12, bottom: 8 }}
        >
          <CartesianGrid
            stroke="#263b59"
            strokeDasharray="3 6"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickMargin={12}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            width={38}
          />
          <Tooltip
            cursor={{ stroke: "#64748b", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "#101d30",
              border: "1px solid #3b526f",
              borderRadius: 12,
              color: "#fff",
              boxShadow: "0 12px 35px rgba(0,0,0,.4)",
              padding: "12px"
            }}
            labelStyle={{
              color: "#67e8f9",
              fontWeight: 700,
              marginBottom: 6
            }}
            formatter={(value: any) => Number(value ?? 0).toLocaleString("en-IN")}
          />
          <Legend
            verticalAlign="bottom"
            height={38}
            iconType="circle"
            wrapperStyle={{ fontSize: 11, paddingTop: 14 }}
          />
          <Line
            type="monotone"
            dataKey="totalLoans"
            name="Total Loans"
            stroke="#38bdf8"
            strokeWidth={3.5}
            strokeLinecap="round"
            dot={{ r: 4, fill: "#38bdf8", stroke: "#0b1728", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#38bdf8", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="approvedLoans"
            name="Approved"
            stroke="#34d399"
            strokeWidth={3}
            strokeLinecap="round"
            dot={{ r: 4, fill: "#34d399", stroke: "#0b1728", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#34d399", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="pendingLoans"
            name="Pending"
            stroke="#a78bfa"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="6 4"
            dot={{ r: 4, fill: "#a78bfa", stroke: "#0b1728", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#a78bfa", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1400}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <EmptyChart
        title="Monthly trend unavailable"
        detail="Monthly analytics API did not return dated loan records. No sample values are displayed."
      />
    )}
  </div>
</Panel><Panel className="xl:col-span-3"><div className="flex items-center gap-2"><Target className="text-cyan-300" size={21}/><div><h2 className="font-bold">Loan Conversion</h2><p className="text-[11px] text-slate-500 break-words">Lead to disbursement funnel</p></div></div><div className="mt-3 h-[190px] w-full">
          {loanStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
  <Pie data={loanStatusData} dataKey="value" nameKey="name"
    cx="50%" cy="48%" innerRadius={65} outerRadius={94}
    paddingAngle={4} cornerRadius={5} stroke="none"
    animationDuration={1000}>
    {loanStatusData.map((entry) => (
      <Cell key={entry.name} fill={entry.color}/>
    ))}
  </Pie>
  <text x="50%" y="44%" textAnchor="middle"
    fill="#94a3b8" fontSize="11">TOTAL LOANS</text>
  <text x="50%" y="55%" textAnchor="middle"
    fill="#ffffff" fontSize="25" fontWeight="800">
    {loanStatusData.reduce((sum, item) => sum + item.value, 0).toLocaleString("en-IN")}
  </text>
  <Tooltip
    contentStyle={{
      background: "#101d30",
      border: "1px solid #3b526f",
      borderRadius: 12,
      color: "#fff"
    }}
  />
</PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="Loan status data unavailable" detail="No verified loan status counts were returned by the API."/>
          )}
        </div>
          <div className="mt-2 border-t border-white/10 pt-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Breakdown</h3>
              <span className="text-[10px] text-slate-500">
                {loanStatusData.reduce((sum, item) => sum + item.value, 0).toLocaleString("en-IN")} Applications
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {loanStatusData.map((item) => {
                const total = loanStatusData.reduce((sum, row) => sum + row.value, 0);
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={item.name} className="min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-1">
                      <span className="truncate text-[11px] text-slate-300">{item.name}</span>
                      <span className="text-[11px] font-bold text-white">{item.value} <span className="font-normal text-slate-500">({percentage}%)</span></span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
        <Panel className="border-violet-500/50 bg-gradient-to-br from-[#21134b] via-[#15152f] to-[#0b1422] xl:col-span-4"><div className="flex items-center gap-2"><div className="rounded-lg bg-violet-500/20 p-2 text-cyan-300"><Bot size={21}/></div><h2 className="font-bold">AI Insights</h2><span className="ml-auto rounded-full bg-violet-500/20 px-2 py-1 text-[10px] text-violet-200">Data-based</span></div><div className="mt-5 space-y-3 text-sm text-slate-300">
  <div className="rounded-xl border border-white/10 bg-white/[.04] p-3">
    <div className="mb-2 flex items-center gap-2">
      <BrainCircuit size={17} className="text-cyan-300"/>
      <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">Live Business Snapshot</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-[10px] text-slate-500 break-words">Active Leads</p>
        <p className="mt-1 text-xl font-extrabold text-white break-words">{loading ? "" : Number(leadAnalytics?.totalLeads ?? 0).toLocaleString("en-IN")}</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 break-words">Approved Loans</p>
        <p className="mt-1 text-xl font-extrabold text-emerald-300 break-words">{loading ? "" : Number(loanAnalytics?.approved ?? 0).toLocaleString("en-IN")}</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 break-words">Disbursed Loans</p>
        <p className="mt-1 text-xl font-extrabold text-violet-300 break-words">{loading ? "" : Number(loanAnalytics?.disbursedLoans ?? 0).toLocaleString("en-IN")}</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 break-words">Disbursed Amount</p>
        <p className="mt-1 text-lg font-extrabold text-amber-300 break-words">{loading ? "" : money(loanAnalytics?.disbursedAmount)}</p>
      </div>
    </div>
  </div>

  <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[.06] p-3">
    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400"/>
    <div>
      <p className="text-xs font-semibold text-emerald-200 break-words">Loan status reporting</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-400 break-words">
        {loading ? "Loading verified loan records..." :
          `${Number(loanAnalytics?.approved ?? 0)} approved and ${Number(loanAnalytics?.disbursedLoans ?? 0)} disbursed loan records are currently reported.`}
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[.05] p-3">
    <Activity size={18} className="mt-0.5 shrink-0 text-cyan-300"/>
    <div>
      <p className="text-xs font-semibold text-cyan-200 break-words">Network status</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-400 break-words">
        {loading ? "Loading network records..." :
          `${total} DSA and Partner directory records are currently available.`}
      </p>
    </div>
  </div>
</div><p className="mt-5 border-t border-white/10 pt-3 text-[10px] text-slate-500 break-words">Descriptive observations only. No fabricated predictions.</p></Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-7 min-w-0 overflow-hidden border border-cyan-400/20 bg-gradient-to-br from-[#101f35] via-[#0c192b] to-[#091321] shadow-lg shadow-cyan-950/20">
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-2.5"><Trophy className="text-amber-400" size={21}/></div><div className="min-w-0"><h2 className="font-bold">Top Performing Partners</h2><p className="text-[11px] text-slate-500 break-words">Real directory preview   performance metrics await API</p></div></div><div className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-[#071321] px-3 py-2.5 shadow-inner transition focus-within:border-cyan-400/60"><Search size={14} className="text-slate-500"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search DSA / Partner" className="w-36 bg-transparent text-xs text-white outline-none placeholder:text-slate-500 sm:w-44"/></div></div>
          <div className="overflow-x-auto rounded-xl border border-white/[.07]"><table className="w-full min-w-[620px] border-separate border-spacing-0 text-left text-xs"><thead className="bg-white/[.035] text-[10px] uppercase tracking-[.14em] text-slate-400"><tr><th className="p-3">#</th><th className="p-3">Partner / DSA</th><th className="p-3">Leads</th><th className="p-3">Approved</th><th className="p-3">Disbursed</th><th className="p-3">Commission</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-800">
            {loading ? <tr><td colSpan={7} className="p-7 text-center text-slate-400">Loading real records </td></tr> : directory.length === 0 ? <tr><td colSpan={7} className="p-7 text-center text-slate-500">No DSA or Partner records found.</td></tr> : directory.slice(0, 5).map((x, i) => <tr key={`${x._kind}-${x.id || i}`} className="transition-colors duration-200 hover:bg-cyan-400/[.06]"><td className="p-3"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-400/20 bg-gradient-to-br from-amber-400/20 to-orange-500/10 font-extrabold text-amber-300 shadow-sm">{i + 1}</span></td><td className="p-3"><p className="font-semibold text-slate-200 break-words">{name(x)}</p><p className="mt-1 text-[10px] text-slate-500 break-words">{x._kind}</p></td><td className="p-3 text-slate-500"></td><td className="p-3 text-slate-500"></td><td className="p-3 text-slate-500"></td><td className="p-3 text-slate-500"></td><td className="p-3"><span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">{status(x)}</span></td></tr>)}
          </tbody></table></div>
        </Panel>
        <Panel className="xl:col-span-5 min-w-0 overflow-hidden border border-violet-400/20 bg-gradient-to-br from-[#171a35] via-[#101b2d] to-[#091321] shadow-lg shadow-violet-950/20"><div className="mb-5 flex items-center gap-3"><FileText className="text-cyan-300" size={21}/><div><h2 className="font-bold">Reports</h2><p className="text-[11px] text-slate-500 break-words">Export verified records</p></div></div><div className="space-y-3">
          {[{title:"DSA Performance Report",sub:"Registration and account status records",icon:Users,color:"text-violet-300",exportable:true},{title:"Partner Wise Statement",sub:"Partner directory details; financial metrics pending",icon:Handshake,color:"text-blue-300",exportable:true},{title:"Conversion & Funnel Report",sub:"Requires lead and loan reporting API",icon:Filter,color:"text-cyan-300",exportable:false},{title:"Commission Report",sub:"Commission aggregate; detailed rows pending",icon:CircleDollarSign,color:"text-amber-300",exportable:false}].map(item => <div key={item.title} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-[#122139] to-[#0b1728] p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-950/20"><div className="rounded-xl border border-white/10 bg-white/[.06] p-2.5 transition-colors group-hover:bg-cyan-400/10"><item.icon className={item.color} size={20}/></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-200 break-words">{item.title}</p><p className="mt-1 text-[10px] text-slate-500 break-words">{item.sub}</p></div>{item.exportable ? <button onClick={exportCSV} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-[10px] font-bold text-cyan-200 transition-all hover:border-cyan-300/50 hover:bg-cyan-400/20"><Download size={13}/> CSV</button> : <span className="shrink-0 rounded-full border border-amber-400/15 bg-amber-400/[.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-amber-300/80">API pending</span>}</div>)}
        </div></Panel>
      </section>
      <footer className="flex flex-wrap justify-between gap-2 border-t border-slate-800 pt-3 text-[10px] text-slate-600"><span>AIFIN   DSA & Partner Analytics</span><span>Selected period: {period}   Date filtering awaits backend support</span></footer>
    </div>
  </main>;
}