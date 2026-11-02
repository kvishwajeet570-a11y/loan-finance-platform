"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Activity, Server, Database, Cpu, HardDrive, Network,
  MemoryStick, Clock, RefreshCw, Download, ShieldCheck,
  Zap, Gauge, CircleCheck, CircleAlert, Monitor
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";

type Metric = Record<string, any>;

function unwrap(r: any): Metric {
  return r?.data?.data ?? r?.data ?? {};
}

function formatBytes(value: number) {
  if (!Number.isFinite(value)) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let n = value;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(1)} ${units[i]}`;
}

function formatUptime(seconds: number) {
  if (!Number.isFinite(seconds)) return "—";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function SystemHealthPage() {
  const [server, setServer] = useState<Metric>({});
  const [database, setDatabase] = useState<Metric>({});
  const [history, setHistory] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState("Not checked");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/super-admin/health/server"),
        api.get("/super-admin/health/database")
      ]);

      if (results[0].status === "fulfilled") {
        const data = unwrap(results[0].value);
        setServer(data);
        setHistory((old) => [
          ...old,
          {
            time: new Date().toLocaleTimeString(),
            rss: Number(data?.memory?.rss ?? 0) / 1024 / 1024,
            heap: Number(data?.memory?.heapUsed ?? 0) / 1024 / 1024
          }
        ].slice(-24));
      } else {
        setError("Server health endpoint could not be reached.");
      }

      if (results[1].status === "fulfilled") {
        setDatabase(unwrap(results[1].value));
      } else {
        setDatabase({ status: "DOWN" });
      }

      setLastChecked(new Date().toLocaleString());
    } catch {
      setError("Unable to refresh system health.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 30000);
    return () => clearInterval(timer);
  }, [refresh]);

  const memory = server?.memory ?? {};
  const serverUp = String(server?.status ?? "").toUpperCase() === "UP";
  const dbUp =
    String(database?.status ?? "").toUpperCase() === "UP" ||
    String(database?.database ?? "").toUpperCase() === "CONNECTED";

  const exportReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Server Status", server?.status ?? "Unavailable"],
      ["Database Status", database?.status ?? "Unavailable"],
      ["Database Connection", database?.database ?? "Unavailable"],
      ["Process RSS", formatBytes(Number(memory?.rss))],
      ["Heap Used", formatBytes(Number(memory?.heapUsed))],
      ["Uptime", formatUptime(Number(server?.uptime ?? 0))],
      ["Environment", server?.environment ?? "—"],
      ["Node Version", server?.nodeVersion ?? "—"],
      ["Last Checked", lastChecked]
    ];
    const csv = rows.map((row) => row.map((v) =>
      `"${String(v).replace(/"/g, '""')}"`
    ).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "system-health-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    {
      title: "SERVER STATUS",
      value: serverUp ? "Operational" : loading ? "Checking..." : "Unavailable",
      detail: server?.environment ?? "Runtime environment",
      icon: Server,
      color: "cyan",
      good: serverUp
    },
    {
      title: "DATABASE",
      value: dbUp ? "Connected" : loading ? "Checking..." : "Unavailable",
      detail: database?.responseTime
        ? `Response ${database.responseTime}`
        : "Database connectivity",
      icon: Database,
      color: "emerald",
      good: dbUp
    },
    {
      title: "PROCESS MEMORY",
      value: formatBytes(Number(memory?.rss)),
      detail: "Node.js RSS memory",
      icon: MemoryStick,
      color: "violet",
      good: true
    },
    {
      title: "SERVER UPTIME",
      value: formatUptime(Number(server?.uptime)),
      detail: "Process running duration",
      icon: Clock,
      color: "amber",
      good: true
    }
  ];

  const colorMap: Record<string, string> = {
    cyan: "text-teal-300 bg-[#15383a] border-[#345b61]",
    emerald: "text-[#8dc9ad] bg-[#183b32] border-emerald-400/20",
    violet: "text-[#a9bdc9] bg-violet-400/10 border-violet-400/20",
    amber: "text-[#d9b779] bg-amber-400/10 border-amber-400/20"
  };

  return (
    <div className="min-h-screen space-y-7 bg-[#0b111b] p-4 text-[#e5edf5] sm:p-6 lg:p-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-slate-500/[0.04] blur-[120px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-500/[0.035] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-slate-400/[0.025] blur-[110px]" />
      </div>

      <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
            <Activity size={15} /> Infrastructure / Control Center
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            System <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Health</span>
          </h1>
          <p className="mt-2 text-sm text-[#9aabba]">
            Real-time application server and database monitoring
          </p>
          <p className="mt-2 text-xs text-[#8292a5]">Last checked: {lastChecked}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => void refresh()} className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-[#15383a] px-4 py-3 text-sm font-bold text-[#9ed4ca] transition hover:border-[#5d9c91] hover:bg-cyan-400/20">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={exportReport} className="flex items-center gap-2 rounded-xl bg-[#176b66] px-4 py-3 text-sm font-bold shadow-sm transition hover:bg-[#208078]">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="relative rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
          {error}
        </div>
      )}

      <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="group relative overflow-hidden rounded-2xl border border-[#263447] bg-[#111b29] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition duration-200 hover:border-[#456477] hover:bg-[#142131]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-400/[0.025] blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div className={`rounded-xl border p-3 ${colorMap[card.color]}`}>
                  <Icon size={21} />
                </div>
                {card.good
                  ? <CircleCheck size={18} className="text-emerald-400" />
                  : <CircleAlert size={18} className="text-amber-400" />}
              </div>
              <p className="relative mt-5 text-[11px] font-bold tracking-[0.18em] text-[#8292a5]">{card.title}</p>
              <h2 className="relative mt-2 break-words text-2xl font-black tracking-tight text-[#edf3f8]">{card.value}</h2>
              <p className="relative mt-2 text-xs text-[#9aabba]">{card.detail}</p>
              <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-[#263447]">
                <div className={`h-full w-2/3 rounded-full ${card.good ? "bg-[#398c83]" : "bg-amber-400"}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative grid gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-[#263447] bg-[#111b29] p-5 shadow-xl xl:col-span-2 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Gauge className="text-teal-300" size={19} />
                <h2 className="text-lg font-bold">Memory Performance</h2>
              </div>
              <p className="mt-1 text-xs text-[#8292a5]">Node.js process memory • Last 24 samples</p>
            </div>
            <span className="rounded-lg border border-[#345b61] bg-[#15383a] px-3 py-1.5 text-xs font-bold text-[#9ed4ca]">LIVE MONITOR</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-5">
            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">
              <p className="text-xs text-[#9aabba]">RSS Memory</p>
              <p className="mt-1 text-xl font-black text-teal-300">{formatBytes(Number(memory?.rss))}</p>
            </div>
            <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.05] p-4">
              <p className="text-xs text-[#9aabba]">Heap Used</p>
              <p className="mt-1 text-xl font-black text-[#a9bdc9]">{formatBytes(Number(memory?.heapUsed))}</p>
            </div>
          </div>

          <div className="h-[270px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="rssGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="heapGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff12" strokeDasharray="4 5" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#101a30", border: "1px solid #334155", borderRadius: 12, color: "#fff" }} />
                  <Area type="monotone" dataKey="rss" name="RSS (MB)" stroke="#22d3ee" strokeWidth={2.5} fill="url(#rssGradient)" />
                  <Area type="monotone" dataKey="heap" name="Heap (MB)" stroke="#a78bfa" strokeWidth={2.5} fill="url(#heapGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#8292a5]">Waiting for memory samples...</div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#263447] bg-[#111b29] p-5 shadow-xl sm:p-6">
          <div className="flex items-center gap-2">
            <Database size={19} className="text-[#8dc9ad]" />
            <h2 className="text-lg font-bold">Database Monitor</h2>
          </div>
          <p className="mt-1 text-xs text-[#8292a5]">Live connectivity probe</p>

          <div className="my-7 rounded-2xl border border-[#294b42] bg-[#10231f] p-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-[#183b32]">
              <Database size={29} className="text-[#8dc9ad]" />
            </div>
            <p className="mt-4 text-2xl font-black">{dbUp ? "Connected" : "Unavailable"}</p>
            <p className="mt-1 text-xs text-[#9aabba]">Database connection status</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#183b32] px-3 py-1.5 text-xs font-bold text-[#8dc9ad]">
              <span className={`h-2 w-2 rounded-full ${dbUp ? "animate-pulse bg-emerald-400" : "bg-amber-400"}`} />
              {dbUp ? "Connection Active" : "Connection Not Confirmed"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm text-[#9aabba]">Response Time</span>
              <strong className="text-sm text-[#edf3f8]">{database?.responseTime ?? "—"}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm text-[#9aabba]">Database</span>
              <strong className="text-sm text-[#edf3f8]">{database?.database ?? "—"}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#9aabba]">Probe Status</span>
              <strong className={dbUp ? "text-sm text-[#8dc9ad]" : "text-sm text-[#d9b779]"}>{dbUp ? "Healthy" : "Unknown"}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="relative rounded-2xl border border-[#263447] bg-[#111b29] p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Monitor size={19} className="text-[#a9bdc9]" />
          <h2 className="text-lg font-bold">Infrastructure Overview</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { name: "CPU Utilization", icon: Cpu, value: "Not Connected", desc: "Host telemetry required" },
            { name: "Disk Usage", icon: HardDrive, value: "Not Connected", desc: "Host telemetry required" },
            { name: "Network Traffic", icon: Network, value: "Not Connected", desc: "Host telemetry required" },
            { name: "Security Monitor", icon: ShieldCheck, value: "API Protected", desc: "Authentication required" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex items-center gap-3 rounded-xl border border-[#263447] bg-[#0d1724] p-4 transition hover:border-violet-400/25 hover:bg-violet-400/[0.04]">
                <div className="rounded-xl bg-[#263444] p-3 text-[#a9bdc9]"><Icon size={20} /></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#d8e2eb]">{item.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[#d9b779]">{item.value}</p>
                  <p className="mt-1 text-[10px] text-[#8292a5]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative rounded-2xl border border-[#263447] bg-[#111b29] p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Zap size={19} className="text-[#d9b779]" />
          <h2 className="text-lg font-bold">Runtime & Infrastructure Details</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Platform", server?.platform],
            ["Node.js Version", server?.nodeVersion],
            ["Environment", server?.environment],
            ["Process Uptime", formatUptime(Number(server?.uptime))],
            ["Heap Total", formatBytes(Number(memory?.heapTotal))],
            ["External Memory", formatBytes(Number(memory?.external))]
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-[#263447] bg-[#0d1724] p-4">
              <p className="text-xs font-medium text-[#8292a5]">{label}</p>
              <p className="mt-2 break-all text-sm font-bold text-[#d8e2eb]">{value || "—"}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#263d43] bg-[#101e26] px-4 py-3 text-xs text-[#9aabba]">
        <span className="flex items-center gap-2"><Activity size={14} className="text-teal-300" /> Auto refresh interval: 30 seconds</span>
        <span>Metrics shown are limited to connected backend telemetry.</span>
      </div>
    </div>
  );
}

