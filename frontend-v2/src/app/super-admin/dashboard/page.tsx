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

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#071426] via-[#0b2342] to-[#123d72] p-6 text-white shadow-[0_25px_70px_rgba(7,20,38,0.18)] sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-blue-200">
              <ShieldCheck size={13} />
              Central Control Center
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Super Admin Dashboard
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor users, loans, DSA partners, transactions and the
              complete India Loan Finance ecosystem from one central
              control panel.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-black">
              Dashboard data unavailable
            </div>
            <div className="mt-1 text-xs font-semibold">{error}</div>
          </div>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* MAIN STATS */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              System Overview
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              Live totals from the central database
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={formatNumber(data?.users || 0)}
            subtitle="Registered platform users"
            icon={Users}
          />

          <StatCard
            title="Total Loans"
            value={formatNumber(data?.loans || 0)}
            subtitle="All loan applications"
            icon={WalletCards}
          />

          <StatCard
            title="DSA Partners"
            value={formatNumber(data?.dsa || 0)}
            subtitle="Active DSA ecosystem"
            icon={BriefcaseBusiness}
          />

          <StatCard
            title="Partners"
            value={formatNumber(data?.partners || 0)}
            subtitle="Registered business partners"
            icon={Building2}
          />

          <StatCard
            title="Transactions"
            value={formatNumber(data?.transactions || 0)}
            subtitle="Total recorded transactions"
            icon={Activity}
          />

          <StatCard
            title="Commissions"
            value={formatNumber(data?.commissions || 0)}
            subtitle="Commission records"
            icon={TrendingUp}
          />

          <StatCard
            title="Transaction Volume"
            value={formatCurrency(data?.transactionVolume || 0)}
            subtitle="Total transaction amount"
            icon={IndianRupee}
          />

          <StatCard
            title="Approved Loans"
            value={formatNumber(loanCounts.approved)}
            subtitle="Currently approved"
            icon={CheckCircle2}
          />
        </div>
      </section>

      {/* LOAN PIPELINE */}
      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Loan Pipeline
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              Application status distribution
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "/super-admin/loans"}
            className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700"
          >
            Manage Loans
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <Clock3 size={20} className="text-amber-600" />
            <div className="mt-4 text-2xl font-black text-slate-900">
              {formatNumber(loanCounts.pending)}
            </div>
            <div className="mt-1 text-xs font-bold text-amber-700">
              Pending
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div className="mt-4 text-2xl font-black text-slate-900">
              {formatNumber(loanCounts.approved)}
            </div>
            <div className="mt-1 text-xs font-bold text-emerald-700">
              Approved
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <XCircle size={20} className="text-red-600" />
            <div className="mt-4 text-2xl font-black text-slate-900">
              {formatNumber(loanCounts.rejected)}
            </div>
            <div className="mt-1 text-xs font-bold text-red-700">
              Rejected
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <BarChart3 size={20} className="text-blue-600" />
            <div className="mt-4 text-2xl font-black text-slate-900">
              {formatNumber(loanCounts.disbursed)}
            </div>
            <div className="mt-1 text-xs font-bold text-blue-700">
              Disbursed
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CONTROL */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900">
            Central Controls
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            Quick access to major Super Admin modules
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Manage Roles",
              description: "Create and manage system roles",
              href: "/super-admin/roles",
              icon: ShieldCheck,
            },
            {
              title: "Permissions",
              description: "Control role and user permissions",
              href: "/super-admin/permissions",
              icon: ShieldCheck,
            },
            {
              title: "Users",
              description: "Manage platform users",
              href: "/super-admin/users",
              icon: Users,
            },
            {
              title: "Loans",
              description: "Approve, reject and disburse loans",
              href: "/super-admin/loans",
              icon: WalletCards,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => (window.location.href = item.href)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={20} />
                </div>

                <div className="mt-4 text-sm font-black text-slate-900">
                  {item.title}
                </div>

                <div className="mt-1 text-xs font-semibold leading-5 text-slate-400">
                  {item.description}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
