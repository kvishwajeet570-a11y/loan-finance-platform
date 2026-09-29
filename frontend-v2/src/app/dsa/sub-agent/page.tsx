"use client";

import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import Link from "next/link";
import DsaShell from "@/components/dsa/DsaShell";
import {
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Filter,
  Mail,
  MapPin,
  MoreVertical,
  Network,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserPlus,
  UserRoundPlus,
  UserX,
  Users,
  UsersRound,
  XCircle,
} from "lucide-react";
type SubAgent = {
  id: string;
  name?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  status?: string;
  createdAt?: string;
  totalLeads?: number;
  disbursed?: number;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getName(agent: SubAgent) {
  return agent.fullName || agent.name || "Unnamed Sub Agent";
}

function getStatus(agent: SubAgent) {
  return String(agent.status || "PENDING").toUpperCase();
}

export default function MySubAgentPage() {
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [city, setCity] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let cancelled = false;

    async function loadSubAgents() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("loan_finance_token") || "";
        const rawUser = localStorage.getItem("loan_finance_user") || "";
        let user: any = null;

        try {
          user = rawUser ? JSON.parse(rawUser) : null;
        } catch {
          user = null;
        }

        const userId =
          user?.id ||
          user?.userId ||
          user?.dsaId ||
          "";

        const candidates = [
          userId ? `${API}/sub-agent/dsa/${encodeURIComponent(userId)}` : "",
        ].filter(Boolean);

        let result: any = null;
        let lastStatus = 0;

        for (const url of candidates) {
          try {
            const response = await fetch(url, {
              headers: {
                Accept: "application/json",
                ...(token
                  ? { Authorization: `Bearer ${token}` }
                  : {}),
              },
              cache: "no-store",
            });

            lastStatus = response.status;

            const text = await response.text();
            let json: any = {};

            try {
              json = text ? JSON.parse(text) : {};
            } catch {
              continue;
            }

            if (response.ok) {
              result = json;
              break;
            }
          } catch {
            continue;
          }
        }

        if (!result) {
          if (!cancelled) {
            setAgents([]);
            setError(
              lastStatus === 404
                ? ""
                : "Unable to load Sub Agents right now."
            );
          }
          return;
        }

        const rows =
          Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
              ? result.data
              : Array.isArray(result?.subAgents)
                ? result.subAgents
                : Array.isArray(result?.data?.subAgents)
                  ? result.data.subAgents
                  : [];

        if (!cancelled) {
          setAgents(rows);
        }
      } catch (err) {
        console.error("[MY SUB AGENTS] LOAD ERROR:", err);
        if (!cancelled) {
          setAgents([]);
          setError("Unable to load Sub Agents right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSubAgents();

    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => {
    const values = agents
      .map((agent) => agent.city)
      .filter(Boolean) as string[];

    return Array.from(new Set(values)).sort();
  }, [agents]);

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return agents.filter((agent) => {
      const matchesSearch =
        !query ||
        getName(agent).toLowerCase().includes(query) ||
        String(agent.phone || "").toLowerCase().includes(query) ||
        String(agent.email || "").toLowerCase().includes(query) ||
        String(agent.id || "").toLowerCase().includes(query);

      const matchesStatus =
        status === "ALL" || getStatus(agent) === status;

      const matchesCity =
        city === "ALL" ||
        String(agent.city || "").toLowerCase() ===
          city.toLowerCase();

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [agents, search, status, city]);

  const stats = useMemo(() => {
    const total = agents.length;
    const active = agents.filter(
      (a) => getStatus(a) === "ACTIVE"
    ).length;
    const pending = agents.filter(
      (a) => getStatus(a) === "PENDING"
    ).length;
    const blocked = agents.filter(
      (a) =>
        getStatus(a) === "BLOCKED" ||
        getStatus(a) === "INACTIVE"
    ).length;

    const totalLeads = agents.reduce(
      (sum, a) => sum + Number(a.totalLeads || 0),
      0
    );

    const totalDisbursed = agents.reduce(
      (sum, a) => sum + Number(a.disbursed || 0),
      0
    );

    return {
      total,
      active,
      pending,
      blocked,
      totalLeads,
      totalDisbursed,
    };
  }, [agents]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAgents.length / pageSize)
  );

  const visibleAgents = filteredAgents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, status, city, dateRange]);

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setCity("ALL");
    setDateRange("ALL");
    setPage(1);
  }

  return (
    <DsaShell>
      <div className="min-h-full w-full min-w-0 max-w-full space-y-6 overflow-x-hidden pb-8 lg:px-1">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[26px] border border-violet-100 bg-gradient-to-r from-[#f8f7ff] via-[#f0edff] to-[#e8ddff] shadow-[0_12px_40px_rgba(76,29,149,0.12)]">

          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="absolute right-[30%] -top-20 h-64 w-64 rounded-full bg-purple-300/25 blur-3xl" />

          <div className="relative z-10 flex min-w-0 min-h-[205px] flex-col justify-between gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-6 2xl:px-8">

            {/* LEFT HERO CONTENT */}
            <div className="min-w-0 flex-1 max-w-full lg:max-w-[46%] 2xl:max-w-[50%]">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-md">
                <Sparkles size={13} />
                Sub Agent Management
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111044] sm:text-4xl lg:text-[43px]">
                My Sub Agents
              </h1>

              <p className="mt-2 max-w-[610px] text-sm font-medium leading-6 text-slate-600 sm:text-[15px]">
                Manage your Sub Agent network, monitor their performance,
                track leads and grow your loan business together.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/dsa/sub-agent/add"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-violet-700 shadow-md ring-1 ring-violet-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <UserPlus size={15} />
                  Add New Sub Agent
                </Link>

                <Link
                  href="/dsa/sub-agent/leads"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/70 px-4 py-2.5 text-xs font-black text-violet-700 shadow-sm ring-1 ring-violet-200 transition hover:bg-violet-600 hover:text-white"
                >
                  <FileText size={15} />
                  Sub Agent Leads
                </Link>
              </div>
            </div>

            {/* AI / NETWORK VISUAL */}
            <div className="relative hidden h-[170px] w-[300px] shrink-0 2xl:block">

              {/* glowing AI core */}
              <div className="absolute left-[46%] top-1/2 z-20 flex h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-700 shadow-[0_18px_45px_rgba(79,70,229,0.35)] ring-8 ring-white/50">
                <Sparkles className="h-10 w-10 text-white" />
              </div>

              {/* connection lines */}
              <div className="absolute left-[24%] top-[39%] h-px w-[92px] rotate-[12deg] bg-violet-300" />
              <div className="absolute right-[27%] top-[36%] h-px w-[100px] -rotate-[13deg] bg-violet-300" />
              <div className="absolute left-[27%] bottom-[31%] h-px w-[90px] -rotate-[18deg] bg-violet-300" />
              <div className="absolute right-[29%] bottom-[30%] h-px w-[95px] rotate-[18deg] bg-violet-300" />

              {/* Team Growth card */}
              <div className="absolute left-0 top-2 w-[118px] rounded-2xl border border-white bg-white/90 p-3 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
                    Team Growth
                  </span>
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                </div>
                <div className="mt-2 flex h-7 items-end gap-1">
                  <span className="h-2 w-2 rounded-sm bg-violet-200" />
                  <span className="h-4 w-2 rounded-sm bg-violet-300" />
                  <span className="h-5 w-2 rounded-sm bg-violet-400" />
                  <span className="h-7 w-2 rounded-sm bg-violet-600" />
                  <TrendingUp className="ml-1 h-5 w-5 text-emerald-500" />
                </div>
              </div>

              {/* More Leads card */}
              <div className="absolute bottom-1 left-6 w-[108px] rounded-2xl border border-white bg-white/90 p-3 shadow-xl backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                  <UsersRound className="h-5 w-5 text-blue-600" />
                </div>
                <p className="mt-1 text-[9px] font-black text-slate-700">
                  More Leads
                </p>
              </div>

              {/* AI growth badge */}
              <div className="absolute left-[39%] top-2 z-30 rounded-full bg-emerald-500 px-3 py-1.5 text-[9px] font-black text-white shadow-lg">
                +200% Growth
              </div>

              {/* Higher Commission card */}
              <div className="absolute right-0 top-1 w-[128px] rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-3 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-wider">
                    Higher Commission
                  </span>
                  <span className="text-lg font-black">₹</span>
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="h-3 w-2 rounded-sm bg-white/40" />
                  <span className="h-5 w-2 rounded-sm bg-white/60" />
                  <span className="h-7 w-2 rounded-sm bg-white" />
                  <TrendingUp className="ml-1 h-5 w-5 text-emerald-300" />
                </div>
              </div>

              {/* Stronger Network card */}
              <div className="absolute bottom-0 right-0 w-[125px] rounded-2xl border border-violet-200 bg-white/90 p-3 shadow-xl backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100">
                    <Network className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-400">
                      Stronger
                    </p>
                    <p className="text-[10px] font-black text-slate-700">
                      Network
                    </p>
                  </div>
                </div>
              </div>

              {/* small floating AI symbols */}
              <div className="absolute left-[42%] bottom-0 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-lg ring-1 ring-violet-100">
                <UserPlus className="h-4 w-4 text-violet-600" />
              </div>

              <div className="absolute right-[28%] bottom-[42%] flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-lg ring-1 ring-violet-100">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
              </div>

            </div>

            {/* RIGHT CTA BANNER */}
            <div className="relative z-30 hidden w-[230px] shrink-0 overflow-hidden rounded-[20px] 2xl:block bg-gradient-to-br from-[#6332df] via-[#6d2de0] to-[#4b1fc5] p-5 text-white shadow-[0_16px_35px_rgba(91,33,182,0.28)] xl:block">

              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black">
                      Grow Your Network
                    </h2>
                    <p className="mt-1.5 text-xs font-medium leading-5 text-violet-100">
                      Add sub agents, track their leads and increase your loan business.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                    <UsersRound className="h-6 w-6 text-white" />
                  </div>
                </div>

                <Link
                  href="/dsa/sub-agent/add"
                  className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  <Plus className="h-4 w-4" />
                  Add New Sub Agent
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* KPI CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {[
            {
              title: "Total Sub Agents",
              value: stats.total,
              icon: Users,
              box: "bg-blue-50",
              iconBg: "bg-blue-100 text-blue-600",
              text: "text-blue-700",
            },
            {
              title: "Active Sub Agents",
              value: stats.active,
              icon: ShieldCheck,
              box: "bg-emerald-50",
              iconBg: "bg-emerald-100 text-emerald-600",
              text: "text-emerald-700",
            },
            {
              title: "Pending Approval",
              value: stats.pending,
              icon: Clock3,
              box: "bg-amber-50",
              iconBg: "bg-amber-100 text-amber-600",
              text: "text-amber-700",
            },
            {
              title: "Blocked Sub Agents",
              value: stats.blocked,
              icon: UserX,
              box: "bg-rose-50",
              iconBg: "bg-rose-100 text-rose-600",
              text: "text-rose-700",
            },
            {
              title: "Total Leads",
              value: stats.totalLeads,
              icon: FileText,
              box: "bg-indigo-50",
              iconBg: "bg-indigo-100 text-indigo-600",
              text: "text-indigo-700",
            },
            {
              title: "Total Disbursed",
              value: stats.totalDisbursed,
              icon: TrendingUp,
              box: "bg-violet-50",
              iconBg: "bg-violet-100 text-violet-600",
              text: "text-violet-700",
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`rounded-[22px] border border-slate-200 ${card.box} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                      {card.title}
                    </p>
                    <p className={`mt-2 text-3xl font-black ${card.text}`}>
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <Link
            href="/dsa/sub-agent"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200"
          >
            <Users size={17} />
            My Sub Agents
          </Link>

          <Link
            href="/dsa/sub-agent/add"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-slate-600 hover:bg-violet-50 hover:text-violet-700"
          >
            <UserPlus size={17} />
            Add New Sub Agent
          </Link>

          <Link
            href="/dsa/sub-agent/leads"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-slate-600 hover:bg-violet-50 hover:text-violet-700"
          >
            <FileText size={17} />
            Sub Agent Leads
          </Link>
        </div>

        {/* MAIN TABLE */}
        <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">

          {/* TABLE HEADER */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">
                  Team Directory
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Sub Agent Network
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Search, filter and manage all Sub Agents under your DSA account.
                </p>
              </div>

              <Link
                href="/dsa/sub-agent/add"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 hover:from-violet-700 hover:to-indigo-700"
              >
                <UserPlus size={17} />
                Add New Sub Agent
              </Link>
            </div>

            {/* FILTERS */}
            <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(260px,1.5fr)_180px_180px_180px_auto]">

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, mobile or email..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              >
                <option value="ALL">All Cities</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">This Week</option>
                <option value="MONTH">This Month</option>
              </select>

              <button
                onClick={resetFilters}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
                  <th className="w-12 px-4 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 accent-violet-600"
                    />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    #
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Sub Agent
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Contact Info
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Location
                  </th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Total Leads
                  </th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Disbursed
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Conversion
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Joined On
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      {Array.from({ length: 11 }).map((__, cell) => (
                        <td key={cell} className="px-4 py-5">
                          <div className="h-5 animate-pulse rounded-lg bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : visibleAgents.length ? (
                  visibleAgents.map((agent, index) => {
                    const total = Number(agent.totalLeads || 0);
                    const disbursed = Number(agent.disbursed || 0);
                    const conversion =
                      total > 0
                        ? Math.round((disbursed / total) * 100)
                        : 0;

                    const agentStatus = getStatus(agent);

                    return (
                      <tr
                        key={agent.id}
                        className="border-b border-slate-100 transition hover:bg-violet-50/30"
                      >
                        <td className="px-4 py-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 accent-violet-600"
                          />
                        </td>

                        <td className="px-4 py-5 text-sm font-black text-slate-400">
                          {(page - 1) * pageSize + index + 1}
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white shadow-md">
                              {getName(agent)
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-slate-900">
                                {getName(agent)}
                              </p>
                              <p className="mt-1 truncate text-[10px] font-bold text-slate-400">
                                ID: {agent.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          <div className="space-y-1.5">
                            {agent.phone && (
                              <p className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <Phone size={13} className="text-violet-500" />
                                {agent.phone}
                              </p>
                            )}
                            {agent.email && (
                              <p className="flex max-w-[190px] items-center gap-2 truncate text-xs font-medium text-slate-500">
                                <Mail size={13} className="text-slate-400" />
                                {agent.email}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          <div>
                            <p className="flex items-center gap-2 text-sm font-black text-slate-800">
                              <MapPin size={14} className="text-violet-500" />
                              {agent.city || "—"}
                            </p>
                            <p className="ml-5 text-[10px] font-bold text-slate-400">
                              {agent.state || "—"}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-5 text-center">
                          <span className="inline-flex min-w-[48px] justify-center rounded-xl bg-blue-50 px-3 py-2 text-sm font-black text-blue-700">
                            {total}
                          </span>
                        </td>

                        <td className="px-4 py-5 text-center">
                          <span className="inline-flex min-w-[48px] justify-center rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">
                            {disbursed}
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <div className="w-24">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-700">
                                {conversion}%
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                                style={{
                                  width: `${Math.min(
                                    conversion,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black ${
                              agentStatus === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
                                : agentStatus === "BLOCKED"
                                  ? "bg-rose-50 text-rose-700"
                                  : agentStatus === "PENDING"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current" />
                            {agentStatus}
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <p className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <CalendarDays size={14} className="text-slate-400" />
                            {formatDate(agent.createdAt)}
                          </p>
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex items-center gap-1.5">
                            <button
                              title="View"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              title="Edit"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              title="Performance"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            >
                              <BarChart3 size={16} />
                            </button>

                            <button
                              title="More"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-20 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                        <UserRoundPlus size={30} />
                      </div>

                      <h3 className="mt-5 text-xl font-black text-slate-800">
                        No Sub Agents Found
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-400">
                        {search || status !== "ALL" || city !== "ALL"
                          ? "Try changing your search or filters."
                          : "You have not added any Sub Agent yet. Add your first Sub Agent to start building your network."}
                      </p>

                      {!search && status === "ALL" && city === "ALL" && (
                        <Link
                          href="/dsa/sub-agent/add"
                          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg"
                        >
                          <UserPlus size={17} />
                          Add New Sub Agent
                        </Link>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Showing{" "}
              <span className="font-black text-slate-800">
                {filteredAgents.length
                  ? (page - 1) * pageSize + 1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="font-black text-slate-800">
                {Math.min(page * pageSize, filteredAgents.length)}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-800">
                {filteredAgents.length}
              </span>{" "}
              Sub Agents
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i + 1
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-black ${
                    page === p
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-violet-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800">
            {error}
          </div>
        )}
      </div>
    </DsaShell>
  );
}














