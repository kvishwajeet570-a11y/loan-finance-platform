"use client";
import { IndiaSvgMap } from "vardhan-maps/react";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, Users, BriefcaseBusiness, FileText,
  CreditCard, IndianRupee, Database, Server,
  RefreshCw, ShieldCheck, Clock3, AlertTriangle,
  CheckCircle2, XCircle, Wifi, Zap, ArrowUpRight
} from "lucide-react";
import api from "@/lib/api";

type AnyData = Record<string, any>;
const INDIA_ACTIVITY_POINTS: Record<string, { x: number; y: number }> = {
  "bihar": { x: 67, y: 47 },
  "jharkhand": { x: 65, y: 54 },
  "uttar pradesh": { x: 59, y: 42 },
  "delhi": { x: 54, y: 39 },
  "maharashtra": { x: 43, y: 68 },
  "karnataka": { x: 48, y: 81 },
  "tamil nadu": { x: 55, y: 90 },
  "west bengal": { x: 74, y: 53 },
  "rajasthan": { x: 37, y: 48 },
  "gujarat": { x: 29, y: 57 },
  "madhya pradesh": { x: 49, y: 57 },
  "punjab": { x: 45, y: 32 },
  "haryana": { x: 51, y: 37 },
  "assam": { x: 86, y: 46 },
  "kerala": { x: 49, y: 91 },
  "odisha": { x: 68, y: 65 },
  "chhattisgarh": { x: 59, y: 63 },
  "telangana": { x: 57, y: 75 },
  "goa": { x: 39, y: 76 },
  "uttarakhand": { x: 62, y: 32 },
  "himachal pradesh": { x: 57, y: 27 },
  "sikkim": { x: 78, y: 43 }
};

function unwrap(response: any): AnyData {
  return response?.data?.data ?? response?.data ?? {};
}

function numberValue(value: any): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Not Available";
  return new Intl.NumberFormat("en-IN").format(value);
}

function moneyValue(value: any): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Not Available";
  return "₹" + new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2
  }).format(value);
}

function dateValue(value: any): string {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString("en-IN");
}

function statusInfo(value: any) {
  const text = String(value ?? "").toLowerCase();
  if (["online", "healthy", "connected", "ok", "success", "up"].includes(text)) {
    return { label: "Online", color: "text-emerald-700 bg-emerald-50", icon: CheckCircle2 };
  }
  if (["offline", "unhealthy", "disconnected", "error", "down", "failed"].includes(text)) {
    return { label: "Offline", color: "text-red-700 bg-red-50", icon: XCircle };
  }
  return { label: value ? String(value) : "Not Available", color: "text-amber-700 bg-amber-50", icon: AlertTriangle };
}

export default function LiveMonitoringPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<AnyData | null>(null);
  const [activities, setActivities] = useState<AnyData | null>(null);
  const [server, setServer] = useState<AnyData | null>(null);
  const [database, setDatabase] = useState<AnyData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = useCallback(async (initial = false) => {
    if (initial) setLoading(true);

    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    if (!token) {
      setErrors(["Login token not found. Please sign in again."]);
      setLoading(false);
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const requests = await Promise.allSettled([
      api.get("/super-admin/dashboard", config),
      api.get("/super-admin/live-activities", config),
      api.get("/super-admin/health/server", config),
      api.get("/super-admin/health/database", config)
    ]);

    const labels = [
      "Dashboard API",
      "Live Activities API",
      "Server Health API",
      "Database Health API"
    ];

    const nextErrors: string[] = [];

    requests.forEach((result, index) => {
      if (result.status === "rejected") {
        const status = result.reason?.response?.status;
        nextErrors.push(
          `${labels[index]}: ${status ? `HTTP ${status}` : (result.reason?.message || "Request failed")}`
        );
      }
    });

    if (requests[0].status === "fulfilled") setDashboard(unwrap(requests[0].value));
    if (requests[1].status === "fulfilled") setActivities(unwrap(requests[1].value));
    if (requests[2].status === "fulfilled") setServer(unwrap(requests[2].value));
    if (requests[3].status === "fulfilled") setDatabase(unwrap(requests[3].value));

    setErrors(nextErrors);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = window.setInterval(() => loadData(false), 30000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, loadData]);

  const stats = [
    { label: "Total Users", value: dashboard?.totalUsers ?? dashboard?.users, icon: Users, color: "blue" },
    { label: "Loan Applications", value: dashboard?.totalLoans ?? dashboard?.loans, icon: FileText, color: "violet" },
    { label: "DSA Partners", value: dashboard?.totalDSA ?? dashboard?.totalDsa ?? dashboard?.dsa, icon: BriefcaseBusiness, color: "cyan" },
    { label: "Business Partners", value: dashboard?.totalPartners ?? dashboard?.partners, icon: ShieldCheck, color: "amber" },
    { label: "Payments", value: dashboard?.totalPayments ?? dashboard?.payments, icon: CreditCard, color: "pink" },
    { label: "Revenue", value: dashboard?.totalRevenue, icon: IndianRupee, color: "emerald", money: true }
  ];

  const serverStatus = statusInfo(server?.status ?? server?.server ?? server?.health);
  const databaseStatus = statusInfo(database?.status ?? database?.database ?? database?.health);
  const apiStatus = statusInfo(server?.api ?? server?.apiStatus);

  const transactions = Array.isArray(activities?.transactions) ? activities.transactions : [];
  const loans = Array.isArray(activities?.loans) ? activities.loans : [];
  const users = Array.isArray(activities?.users) ? activities.users : [];

  const activityRows: AnyData[] = [
    ...transactions.map((item: AnyData) => ({ ...item, activityType: "Transaction" })),
    ...loans.map((item: AnyData) => ({ ...item, activityType: "Loan Application" })),
    ...users.map((item: AnyData) => ({ ...item, activityType: "New User" }))
  ].sort((a: AnyData, b: AnyData) =>
    new Date(b.createdAt ?? 0).getTime() -
    new Date(a.createdAt ?? 0).getTime()
  ).slice(0, 15);

  const regionRows = activityRows.reduce(
    (acc: { name: string; count: number }[], item: AnyData) => {
      const location = item.state ?? item.user?.state ?? item.city ?? item.user?.city ?? item.location ?? item.region;
      if (typeof location !== "string" || !location.trim()) return acc;

      const name = location.trim();
      const existing = acc.find(
        (row) => row.name.toLowerCase() === name.toLowerCase()
      );

      if (existing) existing.count += 1;
      else acc.push({ name, count: 1 });

      return acc;
    },
    []
  ).sort((a, b) => b.count - a.count).slice(0, 8);
  const activityTrend = Array.from({ length: 8 }, (_, index) => {
    const start = new Date();
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() - (7 - index));
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const count = activityRows.filter((item: AnyData) => {
      const time = new Date(item.createdAt ?? 0).getTime();
      return Number.isFinite(time) && time >= start.getTime() && time < end.getTime();
    }).length;

    return {
      label: start.toLocaleTimeString("en-IN", { hour: "numeric", hour12: true }),
      count
    };
  });

  const maxActivityCount = Math.max(1, ...activityTrend.map((item) => item.count));
  return (
    <main className="min-h-screen bg-[#050b18] p-3 text-slate-100 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1700px] space-y-6">

        {/* TOP HEADER */}
        <header className="relative overflow-hidden rounded-[26px] border border-cyan-400/15 bg-gradient-to-r from-[#101b35] via-[#11152d] to-[#21123d] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                <Activity size={13} /> AIFIN / Intelligence Center
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Live <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">Monitoring</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Real-time platform activity and system overview
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Monitoring Active
              </div>
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                  autoRefresh
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                Auto Refresh: {autoRefresh ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => loadData(false)}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-black text-[#06111f] shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-60"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock3 size={14} className="text-cyan-300" />
              Last updated:
              <span className="font-bold text-white">
                {lastUpdated ? lastUpdated.toLocaleString("en-IN") : "Waiting for data"}
              </span>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-400">
              Refresh interval: 30 seconds
            </span>
          </div>
        </header>

        {/* API ERRORS */}
        {errors.length > 0 && (
          <section className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle size={18} />
              Some monitoring services could not be reached
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-amber-200/80">
              {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          </section>
        )}

        {/* PLATFORM METRICS */}
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                Platform Analytics
              </div>
              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                Platform Overview
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Actual figures received from Dashboard API
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-400">
              {stats.length} METRICS
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((item, index) => {
              const Icon = item.icon;
              const available = typeof item.value === "number" && Number.isFinite(item.value);
              const accents = [
                "from-blue-500/20 text-blue-300",
                "from-violet-500/20 text-violet-300",
                "from-cyan-500/20 text-cyan-300",
                "from-amber-500/20 text-amber-300",
                "from-pink-500/20 text-pink-300",
                "from-emerald-500/20 text-emerald-300"
              ];
              return (
                <div
                  key={item.label}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${accents[index % accents.length].split(" ")[0]} to-[#101b2e] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30`}
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.03] blur-2xl" />
                  <div className="relative flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-400">{item.label}</span>
                    <span className={`rounded-xl border border-white/10 bg-white/5 p-3 ${accents[index % accents.length].split(" ")[1]}`}>
                      <Icon size={21} />
                    </span>
                  </div>
                  <p className="relative mt-6 break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {loading && !dashboard ? "Loading..." : item.money ? moneyValue(item.value) : numberValue(item.value)}
                  </p>
                  <p className={`relative mt-2 text-[11px] font-semibold ${available ? "text-emerald-400" : "text-amber-400"}`}>
                    {available ? "● Backend data received" : "● Value not supplied by API"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* INDIA GEOGRAPHIC ACTIVITY */}
        <section className="overflow-hidden rounded-[26px] border border-cyan-400/20 bg-gradient-to-br from-[#0c1b32] via-[#10172c] to-[#171333] p-5 shadow-2xl sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                Geographic Intelligence
              </div>
              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                Live Platform Activity
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                India activity visualization · Backend location records
              </p>
            </div>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-bold text-cyan-200">
              {regionRows.length} Locations Found
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/10 bg-[#071426] p-4">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "linear-gradient(rgba(34,211,238,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.12) 1px, transparent 1px)",
                  backgroundSize: "32px 32px"
                }}
              />
              <div className="pointer-events-none absolute h-64 w-64 rounded-full border border-cyan-400/10" />
              <div className="pointer-events-none absolute h-48 w-48 rounded-full border border-violet-400/10" />

              <div className="relative z-10 mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl bg-[#071525]/70 p-3 shadow-[0_0_35px_rgba(0,200,255,0.16)]">
  <div className="relative">
    <div className="pointer-events-none absolute inset-0 z-10">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        {regionRows.length > 1 && regionRows.slice(1).map((region, index) => {
          const from = INDIA_ACTIVITY_POINTS[regionRows[0].name.toLowerCase()];
          const to = INDIA_ACTIVITY_POINTS[region.name.toLowerCase()];
          if (!from || !to) return null;
          const midX = (from.x + to.x) / 2;
          const midY = Math.min(from.y, to.y) - 8;
          return (
            <g key={`route-${region.name}`}>
              <path
                d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="0.35"
                strokeDasharray="1.2 1.2"
                opacity="0.85"
              />
              <path
                d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="0.8"
                opacity="0.16"
              />
            </g>
          );
        })}
      </svg>

      {regionRows.map((region) => {
        const point = INDIA_ACTIVITY_POINTS[region.name.toLowerCase()];
        if (!point) return null;
        return (
          <div
            key={`marker-${region.name}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            title={`${region.name}: ${region.count} real activity records`}
          >
            <span className="absolute -inset-5 animate-pulse rounded-full bg-red-500/10 blur-md" />
            <span className="absolute -inset-3 rounded-full border border-red-400/70 shadow-[0_0_12px_3px_rgba(248,55,75,0.65)]" />
            <span className={`absolute -inset-2 animate-ping rounded-full ${
              region.name.toLowerCase() === "bihar"
                ? "bg-fuchsia-400/35"
                : "bg-amber-400/35"
            }`} />
            <span className={`relative block h-3.5 w-3.5 rounded-full border-2 border-white ${
              region.name.toLowerCase() === "bihar"
                ? "bg-fuchsia-400 shadow-[0_0_10px_4px_rgba(217,70,239,0.9)]"
                : "bg-amber-300 shadow-[0_0_10px_4px_rgba(251,191,36,0.9)]"
            }`} />
            <span className="absolute left-4 top-0 whitespace-nowrap rounded-md border border-cyan-300/20 bg-[#071426]/90 px-2 py-1 text-[9px] font-bold text-cyan-100">
              {region.name} · {region.count}
            </span>
          </div>
        );
      })}
    </div>

    <div className="[&_svg]:!h-auto [&_svg]:!w-full [&_path]:!fill-[#0b3554] [&_path]:!stroke-cyan-300 [&_path]:!stroke-[0.7]">
      <IndiaSvgMap level="state" resolution="low" />
    </div>
  </div>
</div>

              <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-[#071426]/90 px-3 py-2 text-[9px] text-slate-400">
                Geographic illustration · Not GPS tracking
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0a1526] p-4 sm:p-5">
              <h3 className="text-sm font-black text-white">Regional Activity</h3>
              <p className="mt-1 text-[10px] text-slate-500">
                Location-wise records from current backend feed
              </p>

              {regionRows.length > 0 ? (
  <div className="mt-5 space-y-5">
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 to-blue-500/5 p-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-300">Total Records</p>
        <p className="mt-2 text-xl font-black text-white">
          {regionRows.reduce((sum, region) => sum + region.count, 0)}
        </p>
        <p className="mt-1 text-[9px] text-slate-500">Location tagged</p>
      </div>
      <div className="rounded-xl border border-violet-300/15 bg-gradient-to-br from-violet-400/10 to-purple-500/5 p-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-violet-300">Active Regions</p>
        <p className="mt-2 text-xl font-black text-white">{regionRows.length}</p>
        <p className="mt-1 text-[9px] text-slate-500">Regions found</p>
      </div>
      <div className="rounded-xl border border-emerald-300/15 bg-gradient-to-br from-emerald-400/10 to-teal-500/5 p-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Top Region</p>
        <p className="mt-2 truncate text-base font-black text-white">{regionRows[0].name}</p>
        <p className="mt-1 text-[9px] text-slate-500">{regionRows[0].count} records</p>
      </div>
    </div>

    <div className="rounded-xl border border-white/[0.07] bg-[#071426]/80 p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold text-white">Regional Performance</p>
          <p className="mt-1 text-[9px] text-slate-500">Location-wise activity ranking</p>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[9px] font-bold text-cyan-200">
          LIVE FEED
        </span>
      </div>

      <div className="space-y-4">
        {regionRows.map((region, index) => {
          const total = regionRows.reduce((sum, row) => sum + row.count, 0);
          const maxCount = Math.max(1, ...regionRows.map((row) => row.count));
          const percentage = total ? (region.count / total) * 100 : 0;
          const width = (region.count / maxCount) * 100;

          return (
            <div key={region.name} className="group">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-black ${
                    index === 0
                      ? "bg-cyan-300/15 text-cyan-200"
                      : "bg-white/[0.06] text-slate-400"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-xs font-bold text-slate-200">{region.name}</span>
                  {index === 0 && (
                    <span className="rounded border border-amber-300/20 bg-amber-300/10 px-1.5 py-0.5 text-[8px] font-bold text-amber-200">
                      TOP
                    </span>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs font-black text-white">{region.count}</span>
                  <span className="ml-2 text-[9px] text-slate-500">{percentage.toFixed(0)}%</span>
                </div>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full border border-white/[0.04] bg-[#152337]">
                <div
                  className={`relative h-full rounded-full transition-all duration-1000 ${
                    index === 0
                      ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 shadow-[0_0_14px_rgba(34,211,238,0.4)]"
                      : "bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500"
                  }`}
                  style={{ width: `${Math.max(3, width)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-white/[0.07] pt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-300">Activity Distribution</p>
          <p className="text-[9px] text-slate-500">Share by region</p>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
          {regionRows.map((region, index) => {
            const total = regionRows.reduce((sum, row) => sum + row.count, 0);
            const colors = [
              "bg-cyan-400",
              "bg-violet-400",
              "bg-blue-400",
              "bg-emerald-400",
              "bg-amber-400",
              "bg-pink-400"
            ];
            return (
              <div
                key={region.name}
                title={`${region.name}: ${region.count} records`}
                className={`${colors[index % colors.length]} h-full transition-all duration-700`}
                style={{ width: `${total ? (region.count / total) * 100 : 0}%` }}
              />
            );
          })}
        </div>
        <p className="mt-3 text-[9px] leading-4 text-slate-500">
          Based on location-tagged transactions, loan applications and user records currently loaded from the backend.
        </p>
      </div>
    </div>
  </div>
) : (
  <div className="mt-5 flex min-h-[230px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-5 text-center">
    <Activity size={26} className="text-cyan-300" />
    <p className="mt-4 text-sm font-bold text-slate-300">Location data not available</p>
    <p className="mt-2 text-xs leading-5 text-slate-500">
      City, state or region fields are not available in the current activity records.
    </p>
  </div>
)}
            </div>
          </div>
        </section>
        {/* ACTIVITY AND HEALTH */}
        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">

          {/* LIVE ACTIVITY */}
          <div className="rounded-[24px] border border-white/10 bg-[#101a2b] p-5 shadow-xl shadow-black/10 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                  Real-time Feed
                </div>
                <h2 className="mt-1 text-lg font-black text-white">Live Platform Activity</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest records returned by the backend
                </p>
              </div>
              <span className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-cyan-300">
                <Activity size={20} />
              </span>
            </div>

            {activityRows.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-[#0a1423] p-8 text-center text-sm text-slate-500">
                {loading ? "Loading activities..." : "No activity records available."}
              </div>
            ) : (
              <>
              <div className="rounded-2xl border border-cyan-300/10 bg-[#071426] p-4">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-slate-200">Activity Trend</p>
      <p className="mt-1 text-[10px] text-slate-500">Actual records · Last 8 hours</p>
    </div>
    <span className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold text-cyan-200">
      {activityRows.length} loaded
    </span>
  </div>
  <div className="flex h-36 items-end gap-2 border-b border-white/10 pb-2">
    {activityTrend.map((point, index) => (
      <div key={`${point.label}-${index}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
        <span className="text-[9px] font-bold text-cyan-200">{point.count || ""}</span>
        <div className="flex h-[78%] w-full items-end overflow-hidden rounded-t-md bg-white/[0.035]">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-blue-700 via-cyan-400 to-violet-400 shadow-[0_0_12px_rgba(34,211,238,0.28)] transition-all duration-700"
            style={{ height: `${point.count ? Math.max(9, (point.count / maxActivityCount) * 100) : 2}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-[8px] text-slate-500">{point.label}</span>
      </div>
    ))}
  </div>
  <p className="mt-3 text-[9px] text-slate-500">
    Graph uses the activity records currently loaded from the backend; empty hours remain zero.
  </p>
</div>
<div className="max-h-[440px] space-y-2 overflow-auto pr-1">
                {activityRows.map((item, index) => (
                  <div
                    key={`${item.activityType}-${item.id ?? index}`}
                    className="group relative flex items-start gap-3 overflow-hidden rounded-xl border border-cyan-300/[0.10] bg-gradient-to-r from-[#102139] via-[#0b1729] to-[#11152b] p-4 shadow-[0_5px_20px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                  >
                    <div className="rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 p-3 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.12)] transition-all duration-300 group-hover:shadow-[0_0_22px_rgba(34,211,238,0.3)]">
                      <Activity size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-200">{item.activityType}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {item.name || item.fullName || item.description || item.transactionId || item.id || "Record"}
                      </p>
                      <p className="mt-1.5 text-[10px] text-slate-500">
                        {dateValue(item.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold text-cyan-200">
                      {item.status || item.role || item.activityType}
                    </span>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>

          {/* SYSTEM HEALTH */}
          <div className="rounded-[24px] border border-white/10 bg-[#101a2b] p-5 shadow-xl shadow-black/10 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
                  Infrastructure
                </div>
                <h2 className="mt-1 text-lg font-black text-white">System Health</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Status from configured health endpoints
                </p>
              </div>
              <ShieldCheck size={22} className="text-violet-300" />
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: "Backend API", value: apiStatus, icon: Wifi },
                { label: "Server", value: serverStatus, icon: Server },
                { label: "Database", value: databaseStatus, icon: Database }
              ].map((item) => {
                const Icon = item.icon;
                const StatusIcon = item.value.icon;
                const isOnline = item.value.label === "Online";
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#0b1525] p-4 transition hover:border-cyan-300/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-white/[0.06] p-2.5 text-cyan-300">
                        <Icon size={18} />
                      </span>
                      <span className="text-sm font-bold text-slate-200">{item.label}</span>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                      isOnline
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                    }`}>
                      <StatusIcon size={12} />
                      {item.value.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.06] p-3 text-xs leading-5 text-slate-400">
              Disk usage, VPS CPU load and network throughput are not shown because their monitoring data has not been verified in the current API.
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
              <Clock3 size={13} />
              Health checks refresh with the page data
            </div>
          </div>
        </section>

        {/* ACTIVITY COUNTERS */}
        <section>
          <div className="mb-4">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
              Activity Insights
            </div>
            <h2 className="mt-1 text-xl font-black text-white">Platform Activity Summary</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Loan Activity", value: loans.length, note: "Latest loan records returned (maximum 10)", icon: FileText, color: "text-blue-300", border: "hover:border-blue-400/30" },
              { label: "User Activity", value: users.length, note: "Latest user records returned (maximum 10)", icon: Users, color: "text-violet-300", border: "hover:border-violet-400/30" },
              { label: "Transaction Activity", value: transactions.length, note: "Latest transaction records returned (maximum 10)", icon: CreditCard, color: "text-emerald-300", border: "hover:border-emerald-400/30" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-2xl border border-white/10 bg-[#101a2b] p-5 transition ${item.border}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">{item.label}</span>
                    <span className={`rounded-xl bg-white/5 p-2.5 ${item.color}`}>
                      <Icon size={19} />
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-black text-white">{numberValue(item.value)}</p>
                  <p className="mt-2 text-[11px] text-slate-500">{item.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* MONITORING INTELLIGENCE FOOTER */}
        <section className="relative overflow-hidden rounded-[22px] border border-cyan-400/20 bg-gradient-to-r from-[#102449] via-[#111b38] to-[#21143c] p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <Zap size={23} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">AIFIN Monitoring Intelligence</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Monitoring overview based on configured backend data and health checks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              Refresh interval: 30 seconds
            </div>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.08] pt-5 text-[11px] text-slate-500 sm:flex-row">
          <span>AIFIN Super Admin · Live Monitoring</span>
          <span>Data displayed from configured backend endpoints.</span>
        </footer>
      </div>
    </main>
  );
}











