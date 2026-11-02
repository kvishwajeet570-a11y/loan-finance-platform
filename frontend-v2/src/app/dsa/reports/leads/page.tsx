"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id?: string;
  leadId?: string;
  fullName?: string;
  customerName?: string;
  name?: string;
  phone?: string;
  phoneNo?: string;
  loanType?: string;
  loanAmount?: number | string;
  amount?: number | string;
  status?: string;
  source?: string;
  createdAt?: string;
};

function getRows(v: unknown): Lead[] {
  if (Array.isArray(v)) return v as Lead[];
  if (!v || typeof v !== "object") return [];
  const o = v as Record<string, unknown>;
  for (const k of ["data", "leads", "results", "items"]) {
    const x = o[k];
    if (Array.isArray(x)) return x as Lead[];
    if (x && typeof x === "object") {
      const nested = getRows(x);
      if (nested.length) return nested;
    }
  }
  return [];
}

export default function Page() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loanType, setLoanType] = useState("all");
  const [source, setSource] = useState("all");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in to view leads.");
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

        const url = `${base}/lead`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Leads API returned HTTP ${res.status}`);
        const json: unknown = await res.json();
        if (active) setRows(getRows(json).map((r: any) => ({
          ...r,
          phone: r.phone ?? r.phoneNo ?? r.mobileNumber,
          loanType: r.loanType ?? r.productType,
          status: String(r.status ?? "").toUpperCase() === "DISBURSED"
            ? "converted"
            : String(r.status ?? "").toLowerCase(),
          source: String(r.source ?? "").toLowerCase()
        })));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Unable to load leads.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => rows.filter(r => {
    const text = [r.id, r.leadId, r.fullName, r.customerName, r.name, r.phone, r.phoneNo, r.loanType, r.status, r.source].join(" ").toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (status === "all" || (r.status || "").toLowerCase() === status) &&
      (loanType === "all" || (r.loanType || "").toLowerCase() === loanType) &&
      (source === "all" || (r.source || "").toLowerCase() === source);
  }), [rows, search, status, loanType, source]);

  const normalized = (r: Lead) => (r.status || "").toLowerCase();
  const converted = rows.filter(r => ["converted", "approved", "success", "completed"].includes(normalized(r))).length;
  const pending = rows.filter(r => ["pending", "in progress", "processing"].includes(normalized(r))).length;
  const rejected = rows.filter(r => ["rejected", "failed", "declined"].includes(normalized(r))).length;
  const money = (v?: number | string) => v == null || v === "" || !Number.isFinite(Number(v)) ? "—" : Number(v).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  const uniqueTypes = Array.from(new Set(rows.map(r => r.loanType).filter((v): v is string => Boolean(v))));
  const uniqueSources = Array.from(new Set(rows.map(r => r.source).filter((v): v is string => Boolean(v))));
  const sourceCounts = uniqueSources.map(s => ({ name: s, count: rows.filter(r => r.source === s).length }));
  const maxSource = Math.max(1, ...sourceCounts.map(x => x.count));
  const sourceColors = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#06b6d4"];
  const sourceTotal = sourceCounts.reduce((n, x) => n + x.count, 0);
  let sourceAngle = 0;
  const donutStops = sourceCounts.map((x, i) => {
    const start = sourceAngle;
    sourceAngle += sourceTotal ? x.count / sourceTotal * 360 : 0;
    return `${sourceColors[i % sourceColors.length]} ${start}deg ${sourceAngle}deg`;
  }).join(", ");

  const trendMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 5 + i);
    return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString("en-IN", { month: "short" }) };
  });
  const trendSeries = [
    { name: "Total", color: "#2563eb", values: trendMonths.map(m => rows.filter(r => { const d = new Date(r.createdAt || ""); return !Number.isNaN(d.getTime()) && d.getFullYear() === m.year && d.getMonth() === m.month; }).length) },
    { name: "Converted", color: "#10b981", values: trendMonths.map(m => rows.filter(r => { const d = new Date(r.createdAt || ""); return !Number.isNaN(d.getTime()) && d.getFullYear() === m.year && d.getMonth() === m.month && ["converted", "approved", "success", "completed"].includes((r.status || "").toLowerCase()); }).length) },
    { name: "Pending", color: "#f59e0b", values: trendMonths.map(m => rows.filter(r => { const d = new Date(r.createdAt || ""); return !Number.isNaN(d.getTime()) && d.getFullYear() === m.year && d.getMonth() === m.month && ["pending", "in progress", "processing"].includes((r.status || "").toLowerCase()); }).length) },
    { name: "Rejected", color: "#f43f5e", values: trendMonths.map(m => rows.filter(r => { const d = new Date(r.createdAt || ""); return !Number.isNaN(d.getTime()) && d.getFullYear() === m.year && d.getMonth() === m.month && ["rejected", "failed", "declined"].includes((r.status || "").toLowerCase()); }).length) },
  ];
  const trendMax = Math.max(4, ...trendSeries.flatMap(x => x.values));
  const chartX = (i: number) => 42 + i * 96;
  const chartY = (v: number) => 150 - v / trendMax * 120;
  const linePath = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"} ${chartX(i)} ${chartY(v)}`).join(" ");

  function exportCSV() {
    if (!filtered.length) return alert("No lead records available to export.");
    const header = ["Lead ID", "Customer", "Phone", "Loan Type", "Amount", "Status", "Source", "Created At"];
    const data = filtered.map(r => [r.leadId || r.id || "", r.customerName || r.fullName || r.name || "", r.phone || r.phoneNo || "", r.loanType || "", r.loanAmount ?? r.amount ?? "", r.status || "", r.source || "", r.createdAt || ""]);
    const csv = [header, ...data].map(row => row.map(v => '"' + String(v ?? "").replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "lead-report.csv"; a.click(); URL.revokeObjectURL(url);
  }

  const cards = [
    { title: "Total Leads", value: rows.length, icon: "♟", color: "blue", note: "All recorded leads" },
    { title: "Converted Leads", value: converted, icon: "✓", color: "green", note: "Successfully converted" },
    { title: "Pending Leads", value: pending, icon: "◷", color: "amber", note: "In progress" },
    { title: "Rejected Leads", value: rejected, icon: "×", color: "rose", note: "Rejected or declined" },
  ];
  const styles: Record<string, string> = {
    blue: "border-blue-100 from-blue-50 to-white text-blue-600",
    green: "border-emerald-100 from-emerald-50 to-white text-emerald-600",
    amber: "border-amber-100 from-amber-50 to-white text-amber-600",
    rose: "border-rose-100 from-rose-50 to-white text-rose-600",
  };

  return (
    <main className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-white p-3 text-slate-900 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <header className="relative isolate overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-white via-[#eaf5ff] to-[#c5e7ff] px-5 py-7 shadow-sm sm:px-8">
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl"/>
    <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-blue-200/50 blur-3xl"/>
    <svg viewBox="0 0 700 220" preserveAspectRatio="xMidYMid slice" className="absolute right-0 top-0 h-full w-[65%] opacity-80" fill="none">
      <path d="M0 190 C150 100 180 210 320 85 S540 15 700 65 L700 220 L0 220Z" fill="#bfdbfe" opacity=".55"/>
      <path d="M100 220 C210 115 260 160 365 65 S560 30 700 0" stroke="#93c5fd" strokeWidth="3" opacity=".6"/>
      <path d="M230 220 C320 145 355 170 430 90 S590 65 700 30" stroke="#dbeafe" strokeWidth="12" opacity=".8"/>
    </svg>
  </div>
  <div className="relative flex flex-wrap items-center justify-between gap-5">
    <div className="max-w-2xl">
      <p className="text-xs font-extrabold tracking-[.22em] text-blue-700">DSA FINCORP / REPORTS</p>
      <div className="mt-3 flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-100/80">
<svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="AI Assistant">
<path d="M24 5 27.5 16.5 39 20 27.5 23.5 24 35 20.5 23.5 9 20 20.5 16.5 24 5Z" fill="white" fillOpacity=".18"/>
<path d="M37 29 39 35 45 37 39 39 37 45 35 39 29 37 35 35 37 29Z"/>
<path d="M10 30 11.5 34.5 16 36 11.5 37.5 10 42 8.5 37.5 4 36 8.5 34.5 10 30Z"/>
<circle cx="24" cy="20" r="3" fill="white"/>
</svg>
</span>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Lead Report</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Track your leads, application status and conversion performance.</p>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 230 160" className="hidden h-32 w-48 sm:block" aria-hidden="true">
        <circle cx="115" cy="80" r="68" fill="#dbeafe" opacity=".65"/>
        <path d="M42 27 Q115 12 188 27 L158 65 Q115 83 72 65Z" fill="#60a5fa"/>
        <path d="M72 65 Q115 83 158 65 L145 91 Q115 104 85 91Z" fill="#2563eb"/>
        <path d="M85 91 Q115 104 145 91 L132 115 L98 115Z" fill="#1d4ed8"/>
        <path d="M98 115 L132 115 L126 132 L104 132Z" fill="#0ea5e9"/>
        <circle cx="75" cy="23" r="15" fill="#10b981"/><circle cx="115" cy="12" r="15" fill="#3b82f6"/><circle cx="155" cy="23" r="15" fill="#f59e0b"/>
        <path d="M67 21 a8 8 0 1 1 16 0 a8 8 0 1 1 -16 0 M107 10 a8 8 0 1 1 16 0 a8 8 0 1 1 -16 0 M147 21 a8 8 0 1 1 16 0 a8 8 0 1 1 -16 0" fill="#fff"/>
        <rect x="163" y="71" width="43" height="57" rx="7" fill="#fff" stroke="#60a5fa" strokeWidth="3" transform="rotate(7 163 71)"/>
        <rect x="171" y="83" width="26" height="4" rx="2" fill="#60a5fa" transform="rotate(7 171 83)"/>
        <rect x="170" y="94" width="27" height="4" rx="2" fill="#bfdbfe" transform="rotate(7 170 94)"/>
        <rect x="169" y="105" width="22" height="4" rx="2" fill="#bfdbfe" transform="rotate(7 169 105)"/>
      </svg>
      <div className="rounded-2xl border border-white bg-white/90 px-4 py-3 text-sm font-bold text-blue-900 shadow-sm backdrop-blur">
        <span className="mr-2 text-blue-600">◷</span>
        {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
      </div>
    </div>
  </div>
</header>

        <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {cards.map(c=><article key={c.title} className={`rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${styles[c.color]}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-600">{c.title}</p><p className="mt-3 text-3xl font-black text-slate-950">{c.value}</p></div><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-inner ${c.color === "blue" ? "bg-blue-100 text-blue-600" : c.color === "green" ? "bg-emerald-100 text-emerald-600" : c.color === "amber" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"}`}>
<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
{c.color === "blue" ? <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><path d="M16 5a3 3 0 0 1 0 6M19 20v-2a5 5 0 0 0-3-4.6"/></> : c.color === "green" ? <path d="m5 12 4 4L19 6"/> : c.color === "amber" ? <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></> : <><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></>}
</svg>
</span></div><p className="mt-3 text-xs text-slate-500">{c.note}</p></article>)}
        </section>

        <section className="flex flex-col gap-2 rounded-2xl border border-blue-100 bg-white/90 p-3 shadow-sm lg:flex-row lg:items-center">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="⌕  Search by Lead ID, Customer Name, Phone..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="all">All Status</option><option value="converted">Converted</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="rejected">Rejected</option></select>
          <select value={loanType} onChange={e=>setLoanType(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="all">All Loan Types</option>{uniqueTypes.map(v=><option key={v} value={v.toLowerCase()}>{v}</option>)}</select>
          <select value={source} onChange={e=>setSource(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="all">All Sources</option>{uniqueSources.map(v=><option key={v} value={v.toLowerCase()}>{v}</option>)}</select>
          <button onClick={exportCSV} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700">↓ Export CSV</button>
        </section>

        {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

        <section className="grid items-start gap-4 2xl:grid-cols-[minmax(0,2.2fr)_minmax(300px,.8fr)]">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="flex items-center justify-between p-4 sm:p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">▣</span><div><h2 className="font-extrabold">Lead Details</h2><p className="mt-1 text-xs text-slate-500">{filtered.length} matching leads</p></div></div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white"><tr>{["Lead ID","Customer Name","Phone","Loan Type","Amount","Status","Created At"].map(h=><th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wide">{h}</th>)}</tr></thead><tbody>
              {loading?<tr><td colSpan={7} className="p-12 text-center text-slate-500">Loading leads…</td></tr>:filtered.length===0?<tr><td colSpan={7} className="p-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">♟</span><p className="mt-3 font-bold">{error?"Lead data unavailable":"No leads found"}</p><p className="mt-1 text-xs text-slate-500">{error||"Try changing your search or filters."}</p></td></tr>:filtered.map((r,i)=>{const s=(r.status||"unknown").toLowerCase();const good=["converted","approved","success","completed"].includes(s);return <tr key={r.id||r.leadId||i} className="border-t border-slate-100 transition hover:bg-blue-50/60"><td className="px-4 py-3 font-bold">{r.leadId||r.id||"—"}</td><td className="px-4 py-4">{r.customerName||r.fullName||r.name||"—"}</td><td className="whitespace-nowrap px-4 py-3 text-slate-600">{r.phone||r.phoneNo||"—"}</td><td className="px-4 py-4">{r.loanType||"—"}</td><td className="whitespace-nowrap px-4 py-3 font-bold">{money(r.loanAmount??r.amount)}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${good?"bg-emerald-100 text-emerald-700":["pending","processing","in progress"].includes(s)?"bg-amber-100 text-amber-700":"bg-rose-100 text-rose-700"}`}>{r.status||"Unknown"}</span></td><td className="whitespace-nowrap px-4 py-3 text-slate-600">{r.createdAt&&!Number.isNaN(Date.parse(r.createdAt))?new Date(r.createdAt).toLocaleString("en-IN"):"—"}</td></tr>})}
            </tbody></table></div><footer className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">Showing {filtered.length} of {rows.length} leads</footer>
          </div>

          <aside className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <div><h2 className="font-extrabold">Lead Source Overview</h2><p className="mt-1 text-xs text-slate-500">Real source distribution from API records</p></div>
    <span className="rounded-xl bg-blue-50 p-2 text-xl text-blue-700">◉</span>
  </div>
  {sourceTotal === 0 ? <p className="py-12 text-center text-sm text-slate-500">No source data available</p> : <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
    <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${donutStops})` }}>
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner"><strong className="text-2xl">{sourceTotal}</strong><span className="text-[10px] text-slate-500">Total Leads</span></div>
    </div>
    <div className="min-w-32 flex-1 space-y-3">
      {sourceCounts.map((x, i) => <div key={x.name} className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: sourceColors[i % sourceColors.length] }} />{x.name}</span><strong>{x.count} ({Math.round(x.count / sourceTotal * 100)}%)</strong></div>)}
    </div>
  </div>}
</aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"><h2 className="font-extrabold">Conversion Funnel</h2><p className="mt-1 text-xs text-slate-500">Lead status breakdown from API data</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[{label:"Total Leads",value:rows.length,color:"from-blue-600 to-cyan-500"},{label:"Converted",value:converted,color:"from-violet-600 to-indigo-500"},{label:"In Progress",value:pending,color:"from-amber-500 to-orange-400"},{label:"Rejected",value:rejected,color:"from-rose-500 to-pink-500"}].map(x=><div key={x.label} className={`rounded-xl bg-gradient-to-br ${x.color} p-3 text-white`}><p className="text-xs opacity-90">{x.label}</p><p className="mt-2 text-2xl font-black">{x.value}</p></div>)}</div></article>
          <article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between gap-3"><div><h2 className="font-extrabold">Lead Status Trend</h2><p className="mt-1 text-xs text-slate-500">Monthly counts based on lead creation date</p></div><span className="rounded-xl bg-blue-50 p-2 text-xl text-blue-700">↗</span></div>
  {rows.some(r => r.createdAt && !Number.isNaN(Date.parse(r.createdAt))) ? <>
    <div className="mt-4 overflow-x-auto">
      <svg viewBox="0 0 540 190" className="w-full min-w-[420px]" role="img" aria-label="Monthly lead status line chart">
        {[0, 1, 2, 3].map(i => <g key={i}><line x1="42" y1={30 + i * 40} x2="522" y2={30 + i * 40} stroke="#e2e8f0" strokeDasharray="4 4"/><text x="32" y={34 + i * 40} fontSize="10" textAnchor="end" fill="#64748b">{Math.round(trendMax * (3-i) / 3)}</text></g>)}
        {trendSeries.map(series => <g key={series.name}><path d={linePath(series.values)} fill="none" stroke={series.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>{series.values.map((v, i) => <circle key={i} cx={chartX(i)} cy={chartY(v)} r="3.5" fill={series.color}><title>{series.name}: {v}</title></circle>)}</g>)}
        {trendMonths.map((m, i) => <text key={m.label + i} x={chartX(i)} y="174" fontSize="10" textAnchor="middle" fill="#64748b">{m.label}</text>)}
      </svg>
    </div>
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{trendSeries.map(x => <span key={x.name} className="flex items-center gap-2 text-xs text-slate-600"><i className="h-2.5 w-2.5 rounded-full" style={{ background: x.color }}/>{x.name}</span>)}</div>
  </> : <p className="py-12 text-center text-sm text-slate-500">Monthly trend needs valid createdAt dates from the API.</p>}
  <p className="mt-3 text-xs text-slate-400">Only actual records and dates returned by the API are plotted.</p>
</article>
        </section>
      </div>
    </main>
  );
}







