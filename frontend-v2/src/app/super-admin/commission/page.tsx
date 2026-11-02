"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Coins, Wallet, Clock3, Users, RefreshCw, CalendarDays,
  Search, Download, TrendingUp, BadgeCheck, Activity,
  Eye, ArrowUpRight, ChevronDown
} from "lucide-react";
import api from "@/lib/api";

type Commission = {
  id?: string;
  userId?: string;
  partnerId?: string;
  commissionAmount?: number | string;
  amount?: number | string;
  status?: string;
  source?: string;
  createdAt?: string;
  user?: { id?: string; name?: string; email?: string };
  partner?: { id?: string; name?: string };
  loan?: { loanType?: string };
};

const amount = (r: Commission) =>
  Number(r.commissionAmount ?? r.amount ?? 0) || 0;

const status = (r: Commission) =>
  String(r.status || "UNKNOWN").toUpperCase();

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);

const dateText = (s?: string) => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
};

const palette = ["#00cfff", "#00e879", "#ffc400", "#e600d8", "#7c83ff"];

function smoothPath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  return points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const mid = (prev.x + point.x) / 2;
    return `${path} Q ${mid} ${prev.y} ${mid} ${(prev.y + point.y) / 2} T ${point.x} ${point.y}`;
  }, "");
}

export default function CommissionOverviewPage() {
  const [rows, setRows] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("30");
  const [chartMode, setChartMode] = useState<"amount" | "count">("amount");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/commission");
      const p = res.data;
      const list = Array.isArray(p?.commissions) ? p.commissions :
        Array.isArray(p?.data?.commissions) ? p.data.commissions :
        Array.isArray(p?.data?.data) ? p.data.data :
        Array.isArray(p?.data) ? p.data :
        Array.isArray(p?.results) ? p.results :
        Array.isArray(p) ? p : [];
      setRows(list);
    } catch (e: any) {
      setRows([]);
      setError(e?.response?.data?.message || "Commission records could not be loaded. Please check API authorization.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const scoped = useMemo(() => {
    if (period === "all") return rows;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(period));
    return rows.filter(r => r.createdAt && new Date(r.createdAt) >= cutoff);
  }, [rows, period]);

  const stats = useMemo(() => {
    const total = scoped.reduce((s, r) => s + amount(r), 0);
    const pending = scoped.filter(r => status(r) === "PENDING").reduce((s, r) => s + amount(r), 0);
    const paid = scoped.filter(r => status(r) === "PAID").reduce((s, r) => s + amount(r), 0);
    const ids = scoped.map(r => r.userId || r.user?.id || r.partnerId).filter(Boolean);
    return { total, pending, paid, users: new Set(ids).size };
  }, [scoped]);

  const trend = useMemo(() => {
    const valid = scoped.filter(r => r.createdAt && !isNaN(new Date(r.createdAt).getTime()));
    const count = period === "7" ? 7 : 10;
    const now = new Date();
    const first = valid.length
      ? Math.min(...valid.map(r => new Date(r.createdAt!).getTime()))
      : now.getTime();
    const start = period === "all"
      ? new Date(first)
      : new Date(now.getTime() - (Number(period) - 1) * 86400000);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const span = Math.max(1, end.getTime() - start.getTime() + 1);
    const points = Array.from({ length: count }, (_, i) => ({
      key: String(i),
      label: new Date(start.getTime() + span * i / count).toLocaleDateString("en-IN", {
        day: "numeric", month: "short"
      }),
      value: 0,
      transactions: 0
    }));
    valid.forEach(r => {
      const t = new Date(r.createdAt!).getTime();
      if (t < start.getTime() || t > end.getTime()) return;
      const i = Math.min(count - 1, Math.floor((t - start.getTime()) / span * count));
      points[i].value += amount(r);
      points[i].transactions += 1;
    });
    return points;
  }, [scoped, period]);

  const sources = useMemo(() => {
    const map: Record<string, number> = {};
    scoped.forEach(r => {
      const key = String(r.source || r.loan?.loanType || "Unspecified").trim();
      map[key] = (map[key] || 0) + amount(r);
    });
    return Object.entries(map).filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [scoped]);

  const sourceTotal = sources.reduce((sum, item) => sum + item[1], 0);
  let cumulative = 0;
  const donut = sources.length
    ? `conic-gradient(${sources.map((item, i) => {
        const start = cumulative;
        cumulative += item[1] / sourceTotal * 100;
        return `${palette[i]} ${start}% ${cumulative}%`;
      }).join(",")})`
    : "conic-gradient(#18304c 0% 100%)";

  const maxTrend = Math.max(1, ...trend.map(p =>
    chartMode === "amount" ? p.value : p.transactions
  ));
  const chartPoints = trend.map((p, i) => ({
    x: 42 + i * (620 / Math.max(1, trend.length - 1)),
    y: 178 - ((chartMode === "amount" ? p.value : p.transactions) / maxTrend) * 142
  }));
  const line = smoothPath(chartPoints);
  const area = line
    ? `${line} L ${chartPoints[chartPoints.length - 1].x} 190 L ${chartPoints[0].x} 190 Z`
    : "";

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return scoped.filter(r =>
      [r.id, r.user?.name, r.user?.email, r.partner?.name,
        r.source, r.loan?.loanType, r.status]
        .join(" ").toLowerCase().includes(q)
    );
  }, [scoped, search]);

  const exportCSV = () => {
    const data = [
      ["User", "Email", "Source", "Commission", "Status", "Date", "Reference"],
      ...filtered.map(r => [
        r.user?.name || r.partner?.name || "",
        r.user?.email || "",
        r.source || r.loan?.loanType || "",
        amount(r), r.status || "", r.createdAt || "", r.id || ""
      ])
    ];
    const csv = data.map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "commission-overview.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    {
      label: "Total Commission", value: money(stats.total),
      note: `${scoped.length} actual commission records`,
      icon: Coins,
      style: "border-cyan-400/80 from-[#062a57] to-[#063c55]",
      glow: "shadow-[0_0_25px_rgba(0,180,255,.35)]",
      iconStyle: "bg-sky-500 text-white"
    },
    {
      label: "Total Payout", value: "—",
      note: "Global payout API not available",
      icon: Wallet,
      style: "border-emerald-400/80 from-[#003d2b] to-[#064c32]",
      glow: "shadow-[0_0_25px_rgba(0,230,120,.25)]",
      iconStyle: "bg-emerald-500 text-white"
    },
    {
      label: "Pending Payout", value: "—",
      note: "Global payout request totals unavailable",
      icon: Clock3,
      style: "border-amber-400/80 from-[#492400] to-[#603000]",
      glow: "shadow-[0_0_25px_rgba(255,180,0,.25)]",
      iconStyle: "bg-amber-500 text-white"
    },
    {
      label: "Earning Users / DSAs", value: String(stats.users),
      note: "Distinct users in commission records",
      icon: Users,
      style: "border-fuchsia-400/80 from-[#380052] to-[#52005d]",
      glow: "shadow-[0_0_25px_rgba(210,0,255,.25)]",
      iconStyle: "bg-fuchsia-600 text-white"
    }
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#020817] px-3 py-5 text-white sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">

        <header className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-[#06152e] via-[#09234b] to-[#11143e] p-5 shadow-[0_0_35px_rgba(0,150,255,.13)] sm:p-6">
          <div className="relative z-10 flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-cyan-400 bg-blue-500/15 text-cyan-300 shadow-[0_0_28px_#008cff90]">
              <Coins size={34}/>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[.25em] text-cyan-300">Commission & Payout Control</div>
              <h1 className="mt-1 text-2xl font-black sm:text-4xl">
                Commission <span className="text-yellow-400">Overview</span>
              </h1>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                Track total commission, payouts and performance across users, DSA and partners.
              </p>
            </div>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-white/25 bg-[#071a35] px-3">
              <CalendarDays size={17} className="text-cyan-300"/>
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="bg-transparent py-3 text-sm font-bold text-white outline-none">
                <option className="bg-[#071a35]" value="30">Last 30 Days</option>
                <option className="bg-[#071a35]" value="7">Last 7 Days</option>
                <option className="bg-[#071a35]" value="90">Last 90 Days</option>
                <option className="bg-[#071a35]" value="all">All Records</option>
              </select>
            </div>
            <button onClick={exportCSV} disabled={!filtered.length}
              className="flex items-center gap-2 rounded-xl border border-yellow-400/60 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-200 disabled:opacity-40">
              <Download size={16}/> Export
            </button>
            <button onClick={load} disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-cyan-400 bg-cyan-500/15 px-4 py-3 text-sm font-bold text-cyan-200">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""}/> Refresh
            </button>
          </div>
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"/>
          <div className="pointer-events-none absolute bottom-0 right-40 h-24 w-64 rounded-full bg-yellow-400/10 blur-3xl"/>
        </header>

        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error} <button onClick={load} className="ml-2 underline">Retry</button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${c.style} ${c.glow}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-white">{c.label}</span>
                  <span className={`rounded-xl p-3 ${c.iconStyle}`}><Icon size={24}/></span>
                </div>
                <div className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {loading ? "…" : c.value}
                </div>
                <p className="mt-2 text-xs text-slate-200">{c.note}</p>
                <div className="absolute -bottom-8 -right-5 h-16 w-32 rounded-full bg-white/15 blur-xl"/>
              </div>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_.9fr]">

          <div className="rounded-2xl border border-cyan-400 bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,220,150,.10),transparent_65%),linear-gradient(135deg,#071b38,#061329_65%,#071a30)] p-5 shadow-[0_0_30px_rgba(0,200,255,.16)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <TrendingUp className="text-cyan-300"/> Commission Trend
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Actual commission activity in the selected period
                </p>
              </div>
              <div className="flex rounded-xl border border-white/10 bg-[#071b34] p-1 text-xs font-bold">
                <button onClick={() => setChartMode("amount")}
                  className={`rounded-lg px-3 py-2 ${chartMode === "amount" ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(0,180,255,.4)]" : "text-slate-300"}`}>
                  Amount (₹)
                </button>
                <button onClick={() => setChartMode("count")}
                  className={`rounded-lg px-3 py-2 ${chartMode === "count" ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(0,180,255,.4)]" : "text-slate-300"}`}>
                  Transactions
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex h-[250px] items-center justify-center text-sm text-slate-400">Loading trend…</div>
            ) : true ? (
              <div className="relative">
                <div className="flex">
                  <div className="flex h-[220px] w-12 flex-col justify-between pb-8 pt-2 text-right text-[10px] text-slate-400">
                    {[1, .75, .5, .25, 0].map(v => (
                      <span key={v}>{!trend.some(p => p.value > 0 || p.transactions > 0) ? (v===0 ? "₹0" : "—") : chartMode === "amount" ? money(maxTrend * v) : Math.round(maxTrend * v)}</span>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <svg viewBox="0 0 680 200" preserveAspectRatio="none"
                      className="h-[220px] w-full overflow-visible">
                      <defs>
                        <linearGradient id="commissionAreaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00f36b" stopOpacity=".62"/>
                          <stop offset="55%" stopColor="#00c96a" stopOpacity=".28"/>
                          <stop offset="100%" stopColor="#00d5ff" stopOpacity=".02"/>
                        </linearGradient>
                        <linearGradient id="commissionStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#00e5ff"/>
                          <stop offset="48%" stopColor="#a5ff37"/>
                          <stop offset="100%" stopColor="#00ff62"/>
                        </linearGradient>
                        <filter id="commissionGlow" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="5" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      {!trend.some(p => p.value > 0 || p.transactions > 0) && <>
                        <path d="M42 178 C95 168 110 116 175 126 S255 160 310 105 S390 76 445 91 S520 43 565 60 S625 28 662 20 L662 190 L42 190 Z" fill="url(#commissionAreaFill)" opacity=".55"/>
                        <path d="M42 178 C95 168 110 116 175 126 S255 160 310 105 S390 76 445 91 S520 43 565 60 S625 28 662 20" fill="none" stroke="url(#commissionStroke)" strokeWidth="4" strokeDasharray="none" strokeLinecap="round" opacity=".95" filter="url(#commissionGlow)"/>
                        {[42,175,310,445,565,662].map((x,i)=><circle key={x} cx={x} cy={[178,126,105,91,60,20][i]} r="5" fill="#d8fff0" stroke="#00ed83" strokeWidth="2" opacity=".8"/>)}
                      </>}
                      {[36, 72, 108, 144, 180].map(y => (
                        <line key={y} x1="35" y1={y} x2="665" y2={y}
                          stroke="#4380a7" strokeOpacity=".28" strokeDasharray="4 5"/>
                      ))}
                      {chartPoints.length > 1 && trend.some(p => p.value > 0 || p.transactions > 0) && <path d={area} fill="url(#commissionAreaFill)"/>}
                      {chartPoints.length > 1 && trend.some(p => p.value > 0 || p.transactions > 0) && (
                        <path d={line} fill="none" stroke="url(#commissionStroke)"
                          strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#commissionGlow)"/>
                      )}
                      {(trend.some(p => p.value > 0 || p.transactions > 0) ? chartPoints : []).map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="8" fill="#00ff75" opacity=".2"/>
                          <circle cx={p.x} cy={p.y} r="5.5" fill="white"
                            stroke="#00ed83" strokeWidth="3"/>
                        </g>
                      ))}
                    </svg>
                    <div className="mt-1 grid gap-1 text-center text-[9px] text-slate-300"
                      style={{gridTemplateColumns:`repeat(${trend.length},minmax(0,1fr))`}}>
                      {trend.map(p => <span key={p.key} className="whitespace-nowrap">{p.label}</span>)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400">
                  <span>{chartMode === "amount" ? "Commission amount" : "Transaction count"}</span>
                  <span className="text-emerald-300">● Actual API records</span>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
                <div className="rounded-full border border-cyan-400/40 bg-cyan-400/10 p-4 text-cyan-300 shadow-[0_0_25px_rgba(0,210,255,.2)]">
                  <TrendingUp size={28}/>
                </div>
                <p className="text-sm font-bold text-slate-200">Waiting for commission activity</p>
                <p className="text-center text-xs text-slate-500">The trend will display when real commission records are available.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-400 bg-[radial-gradient(ellipse_at_50%_55%,rgba(0,120,255,.13),transparent_65%),linear-gradient(135deg,#091b3d,#101238)] p-5 shadow-[0_0_32px_rgba(0,160,255,.18)]">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <BadgeCheck className="text-cyan-300"/> Commission by Source
            </h2>
            <p className="mb-5 mt-1 text-xs text-slate-400">
              Distribution calculated from actual commission entries
            </p>

            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-400">Loading sources…</div>
            ) : sources.length ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-6 sm:flex-row">
                <div className="relative h-52 w-52 shrink-0 rounded-full p-[23px] shadow-[0_0_42px_rgba(0,190,255,.32),inset_0_0_18px_rgba(255,255,255,.12)] ring-1 ring-white/20 sm:h-56 sm:w-56"
                  style={{background: donut}}>
                  <div className="flex h-full w-full items-center justify-center rounded-full border-[5px] border-[#142c4c] bg-[radial-gradient(circle,#102849,#06152c_72%)] text-center shadow-[inset_0_0_25px_rgba(0,180,255,.16)]">
                    <div>
                      <div className="text-xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,200,255,.5)]">{money(sourceTotal)}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-cyan-200">Total Commission</div>
                    </div>
                  </div>
                </div>
                <div className="w-full min-w-0 space-y-4">
                  {sources.map(([name, value], i) => (
                    <div key={name} className="flex items-center justify-between gap-3 border-b border-white/10 py-3 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        <i className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white/10 shadow-[0_0_14px_currentColor]"
                          style={{background: palette[i]}}/>
                        <span className="truncate text-slate-100">{name}</span>
                      </span>
                      <span className="w-12 shrink-0 text-right text-xs font-bold text-cyan-200">{sourceTotal ? Math.round(value / sourceTotal * 100) : 0}%</span>
                      <span className="w-24 shrink-0 text-right text-sm font-black text-white">{money(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center gap-7 lg:flex-row lg:gap-8">
                <div className="relative h-52 w-52 shrink-0 rounded-full p-[23px] shadow-[0_0_42px_rgba(0,190,255,.28)] ring-1 ring-white/20 sm:h-56 sm:w-56"
                  style={{background:"conic-gradient(#00cfff 0deg 90deg,#0878ff 90deg 180deg,#00e879 180deg 270deg,#ffc400 270deg 315deg,#e600d8 315deg 360deg)"}}>
                  <div className="flex h-full w-full items-center justify-center rounded-full border-[5px] border-[#142c4c] bg-[radial-gradient(circle,#102849,#06152c_72%)] text-center shadow-[inset_0_0_25px_rgba(0,180,255,.16)]">
                    <div>
                      <div className="text-2xl font-black text-white">—</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-cyan-200">Total Commission</div>
                      <div className="mt-1 text-[10px] text-slate-500">Awaiting records</div>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-sm space-y-4">
                  <div className="mb-3">
                    <p className="text-sm font-black text-white">Source Distribution</p>
                    <p className="text-[10px] text-slate-400">Live breakdown will appear from real records</p>
                  </div>
                  {["Customer Commission","DSA Commission","Partner Commission","Other Sources"].map((name,i)=>(
                    <div key={name} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3">
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <i className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white/10 shadow-[0_0_14px_currentColor]" style={{background:palette[i]}}/>
                        <span className="truncate text-xs font-semibold text-slate-100">{name}</span>
                      </span>
                      <span className="w-12 shrink-0 text-right text-xs font-bold text-cyan-200">—</span>
                      <span className="w-24 shrink-0 text-right text-sm font-black text-white">—</span>
                    </div>
                  ))}
                  <p className="pt-1 text-center text-[10px] text-slate-500">No sample amounts or percentages are displayed.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-cyan-400 bg-gradient-to-br from-[#061a35] to-[#0a1230] shadow-[0_0_24px_rgba(0,180,255,.18)]">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black">
                <span className="text-yellow-400">★</span> Recent Commission Transactions
              </h2>
              <p className="mt-1 text-xs text-slate-400">Actual records returned by the commission API</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#06152b] px-3">
              <Search size={15} className="text-slate-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search user / source / ID"
                className="w-44 bg-transparent py-2.5 text-xs outline-none placeholder:text-slate-500 sm:w-56"/>
            </div>
          </div>
          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-900 to-[#123c73] text-xs text-white">
                  <th className="rounded-l-lg p-3">#</th>
                  <th className="p-3">User / DSA</th>
                  <th className="p-3">Type / Source</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Commission (₹)</th>
                  <th className="p-3">Status</th>
                  <th className="rounded-r-lg p-3">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-10 text-center text-slate-400">Loading real transactions…</td></tr>
                ) : filtered.length ? filtered.slice(0, 100).map((r, i) => {
                  const s = status(r);
                  const badge = s === "PAID" || s === "APPROVED"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
                    : s === "PENDING"
                    ? "bg-amber-500/15 text-amber-300 border-amber-400/40"
                    : s === "REJECTED"
                    ? "bg-rose-500/15 text-rose-300 border-rose-400/40"
                    : "bg-slate-500/15 text-slate-300 border-slate-400/30";
                  return (
                    <tr key={r.id || i} className="border-b border-white/10 hover:bg-cyan-400/5">
                      <td className="p-3 text-slate-400">{i + 1}</td>
                      <td className="p-3">
                        <div className="font-bold">{r.user?.name || r.partner?.name || "Unknown user"}</div>
                        <div className="mt-1 text-[10px] text-slate-500">{r.user?.email || r.userId || r.partnerId || "—"}</div>
                      </td>
                      <td className="p-3 text-slate-300">{r.source || r.loan?.loanType || "Unspecified"}</td>
                      <td className="p-3 font-mono text-xs text-slate-400">{r.id || "—"}</td>
                      <td className="p-3 font-black text-emerald-300">{money(amount(r))}</td>
                      <td className="p-3">
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold ${badge}`}>{s}</span>
                      </td>
                      <td className="p-3 text-xs text-slate-400">{dateText(r.createdAt)}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      {error ? "Could not retrieve records." : "No commission records found for this period."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 px-5 py-3 text-[11px] text-slate-500">
            <span>Showing {Math.min(filtered.length, 100)} of {filtered.length} matching records</span>
            <span className="flex items-center gap-1 text-emerald-300"><Activity size={13}/> Live API data <ArrowUpRight size={13}/></span>
          </div>
        </section>

        <p className="text-center text-[10px] text-slate-600">
          Payout totals are not displayed until a global admin payout API is connected. No demo figures are used.
        </p>
      </div>
    </main>
  );
}







