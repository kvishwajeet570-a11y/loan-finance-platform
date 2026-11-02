"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
  XCircle,
} from "lucide-react";
import api from "@/lib/api";

type LoanStat = {
  status: string;
  _count: {
    id: number;
  };
};

type DashboardData = {
  users: number;
  loans: number;
  dsa: number;
  partners: number;
  transactions: number;
  commissions: number;
  transactionVolume: number;
  loanStats: LoanStat[];
};

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  href?: string;
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-70 transition duration-300 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>

          <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </div>

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={22} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("loan_finance_token")
          : null;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await api.get("/super-admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load dashboard."
        );
      }

      setData(response.data.data);
    } catch (err: any) {
      console.error("SUPER ADMIN DASHBOARD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load Super Admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const loanCounts = useMemo(() => {
    const result: Record<string, number> = {};

    for (const item of data?.loanStats || []) {
      result[String(item.status).toUpperCase()] =
        Number(item._count?.id || 0);
    }

    return {
      pending: result.PENDING || 0,
      approved: result.APPROVED || 0,
      rejected: result.REJECTED || 0,
      disbursed: result.DISBURSED || 0,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-[28px] bg-white shadow-sm" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-[24px] bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  const totalPipeline = Math.max(
    loanCounts.pending + loanCounts.approved + loanCounts.rejected + loanCounts.disbursed,
    1
  );

  const pipelineItems = [
    { label: "Pending", value: loanCounts.pending, color: "bg-amber-400", text: "text-amber-300", icon: Clock3 },
    { label: "Approved", value: loanCounts.approved, color: "bg-emerald-400", text: "text-emerald-300", icon: CheckCircle2 },
    { label: "Rejected", value: loanCounts.rejected, color: "bg-rose-400", text: "text-rose-300", icon: XCircle },
    { label: "Disbursed", value: loanCounts.disbursed, color: "bg-cyan-400", text: "text-cyan-300", icon: BarChart3 },
  ];

  const metrics = [
    { title: "Total Users", value: formatNumber(data?.users || 0), subtitle: "Registered platform users", icon: Users, color: "text-cyan-300", glow: "from-cyan-500/20" },
    { title: "Total Loans", value: formatNumber(data?.loans || 0), subtitle: "All loan applications", icon: WalletCards, color: "text-blue-300", glow: "from-blue-500/20" },
    { title: "DSA Partners", value: formatNumber(data?.dsa || 0), subtitle: "DSA ecosystem", icon: BriefcaseBusiness, color: "text-violet-300", glow: "from-violet-500/20" },
    { title: "Partners", value: formatNumber(data?.partners || 0), subtitle: "Registered partners", icon: Building2, color: "text-fuchsia-300", glow: "from-fuchsia-500/20" },
    { title: "Transactions", value: formatNumber(data?.transactions || 0), subtitle: "Recorded transactions", icon: Activity, color: "text-emerald-300", glow: "from-emerald-500/20" },
    { title: "Commissions", value: formatNumber(data?.commissions || 0), subtitle: "Commission records", icon: TrendingUp, color: "text-orange-300", glow: "from-orange-500/20" },
    { title: "Transaction Volume", value: formatCurrency(data?.transactionVolume || 0), subtitle: "Total transaction amount", icon: IndianRupee, color: "text-yellow-300", glow: "from-yellow-500/20" },
    { title: "Approved Loans", value: formatNumber(loanCounts.approved), subtitle: "Currently approved", icon: CheckCircle2, color: "text-teal-300", glow: "from-teal-500/20" },
  ];

  return (
    <div className="min-h-screen space-y-7 rounded-[28px] bg-[#080e1c] p-4 text-white sm:p-6 lg:p-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-[#101d38] via-[#10152d] to-[#241344] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
              <ShieldCheck size={14} />
              AIFIN Intelligence Center
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Super Admin <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">Dashboard</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Your central command center for users, loans, DSA partners,
              transactions and platform operations.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Dashboard
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Central Administration
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-xl border border-cyan-300/30 bg-cyan-400/15 px-5 text-sm font-black text-cyan-100 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-60 lg:self-center"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-black">Dashboard data unavailable</div>
            <div className="mt-1 text-xs">{error}</div>
          </div>
          <button
            type="button"
            onClick={() => loadDashboard(true)}
            className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-black text-white hover:bg-rose-400"
          >
            Try Again
          </button>
        </div>
      )}

      {/* BUSINESS OVERVIEW */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Platform Analytics</div>
            <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">Business Overview</h3>
            <p className="mt-1 text-xs text-slate-400">Live totals returned by the dashboard API</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-slate-300">
            8 KEY METRICS
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${item.glow} to-[#111a2c] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30`}
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.03] blur-2xl transition group-hover:bg-cyan-300/10" />
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{item.title}</span>
                  <div className={`rounded-xl border border-white/10 bg-white/5 p-2.5 ${item.color}`}>
                    <Icon size={19} />
                  </div>
                </div>
                <div className="relative mt-5 break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {item.value}
                </div>
                <div className="relative mt-2 text-[11px] font-medium text-slate-500">
                  {item.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LOAN PIPELINE */}
      <section className="rounded-[26px] border border-white/10 bg-[#101a2b] p-5 shadow-xl shadow-black/10 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Application Intelligence</div>
            <h3 className="mt-1 text-xl font-black text-white">Loan Pipeline Analytics</h3>
            <p className="mt-1 text-xs text-slate-400">Application status distribution from available dashboard data</p>
          </div>
          <button
            type="button"
            onClick={() => (window.location.href = "/super-admin/loans")}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 text-xs font-black text-cyan-200 transition hover:bg-cyan-300/20"
          >
            Manage Loans <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pipelineItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-[#0b1424] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{item.label}</span>
                  <Icon size={19} className={item.text} />
                </div>
                <div className="mt-4 text-3xl font-black text-white">{formatNumber(item.value)}</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${Math.min((item.value / totalPipeline) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-500">
                  {((item.value / totalPipeline) * 100).toFixed(1)}% of counted statuses
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/5">
          {pipelineItems.map((item) => (
            <div
              key={item.label}
              className={`${item.color} transition-all`}
              style={{ width: `${(item.value / totalPipeline) * 100}%` }}
              title={`${item.label}: ${formatNumber(item.value)}`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {pipelineItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* CENTRAL CONTROLS */}
      <section>
        <div className="mb-5">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Administration</div>
          <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">Central Controls</h3>
          <p className="mt-1 text-xs text-slate-400">Quick access to major Super Admin modules</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Manage Roles", description: "Create and manage system roles", href: "/super-admin/roles", icon: ShieldCheck },
            { title: "Permissions", description: "Control role and user permissions", href: "/super-admin/permissions", icon: ShieldCheck },
            { title: "Users", description: "Manage platform users", href: "/super-admin/users", icon: Users },
            { title: "Loans", description: "Manage loan applications", href: "/super-admin/loans", icon: WalletCards },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => (window.location.href = item.href)}
                className="group rounded-2xl border border-white/10 bg-[#101a2b] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-[#14233a]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
                  <Icon size={20} />
                </div>
                <div className="mt-4 text-sm font-black text-white">{item.title}</div>
                <div className="mt-1 text-xs font-medium leading-5 text-slate-400">{item.description}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  Open Module <ArrowUpRight size={13} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
