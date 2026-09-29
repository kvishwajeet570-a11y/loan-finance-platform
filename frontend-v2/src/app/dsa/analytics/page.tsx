"use client";

import { useEffect, useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Trend = {
  month?: string;
  applications?: number;
  approved?: number;
  pending?: number;
  rejected?: number;
  loanAmount?: number;
};

type CommissionTrend = {
  month?: string;
  commission?: number;
};

type Product = {
  name?: string;
  value?: number;
  amount?: number;
};

type Data = {
  summary?: {
    totalLeads?: number;
    approvedLoans?: number;
    pendingLoans?: number;
    rejectedLoans?: number;
    totalEarnings?: number;
    pendingCommission?: number;
    totalLoanAmount?: number;
    approvedLoanAmount?: number;
    approvalRate?: number;
    totalCustomers?: number;
  };
  monthlyTrend?: Trend[];
  commissionTrend?: CommissionTrend[];
  loanProducts?: Product[];
  performance?: {
    currentMonthApplications?: number;
    previousMonthApplications?: number;
    monthlyGrowth?: number | null;
  };
  transactions?: {
    totalAmount?: number;
    totalCommission?: number;
    totalCashback?: number;
  };
};

const num = (v: any) => Number(v || 0).toLocaleString("en-IN");

const money = (v: any) =>
  `₹${Number(v || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

export default function AnalyticsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("Monthly");

  useEffect(() => {
    const token = localStorage.getItem("loan_finance_token");
    const raw = localStorage.getItem("loan_finance_user");

    if (!token || !raw) {
      setError("DSA login session not found.");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(raw);

      fetch(`${API}/dsa/dashboard/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (r) => {
          const j = await r.json().catch(() => null);
          if (!r.ok) throw new Error(j?.message || "Analytics API failed");
          return j;
        })
        .then((j) => setData(j?.data || j))
        .catch((e) => setError(e.message || "Failed to load analytics"))
        .finally(() => setLoading(false));
    } catch {
      setError("Invalid DSA session.");
      setLoading(false);
    }
  }, []);

  const s = data?.summary || {};
  const trend = data?.monthlyTrend || [];
  const commissions = data?.commissionTrend || [];
  const products = data?.loanProducts || [];
  const perf = data?.performance || {};
  const tx = data?.transactions || {};

  const maxApps = Math.max(1, ...trend.map(x => Number(x.applications || 0)));
  const maxCommission = Math.max(
    1,
    ...commissions.map(x => Number(x.commission || 0))
  );

  const productTotal = products.reduce(
    (a, x) => a + Number(x.value || 0),
    0
  );

  const topProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => Number(b.value || 0) - Number(a.value || 0))
        .slice(0, 5),
    [products]
  );

  if (loading) {
    return (
      <DsaShell>
        <div className="min-h-screen bg-[#f5f8fc] p-6">
          <div className="mx-auto max-w-[1850px] animate-pulse">
            <div className="h-24 rounded-3xl bg-slate-200" />
            <div className="mt-6 grid grid-cols-2 gap-5 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-3xl bg-white" />
              ))}
            </div>
            <div className="mt-5 h-[420px] rounded-3xl bg-white" />
          </div>
        </div>
      </DsaShell>
    );
  }

  if (error) {
    return (
      <DsaShell>
        <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc] p-6">
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">
            <div className="text-4xl">!</div>
            <h2 className="mt-4 text-3xl font-black text-slate-900">
              Analytics unavailable
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              onClick={() => location.reload()}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </DsaShell>
    );
  }

  return (
    <DsaShell>
      <div className="min-h-screen bg-[#f5f8fc] p-5 md:p-8 xl:p-10">
        <div className="mx-auto max-w-[1850px]">

          {/* HEADER */}
          <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-violet-700">
                <span>✦</span>
                Live Business Analytics
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Performance Analytics
              </h1>

              <p className="mt-1 text-base font-medium text-slate-500">
                Real-time business performance based on your DSA applications,
                loans, commissions and transactions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                Current Month
              </div>
              <div className="mt-1 text-lg font-black text-slate-900">
                {num(perf.currentMonthApplications)} Applications
              </div>
            </div>
          </header>

          {/* KPI */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white shadow-xl shadow-blue-100">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl">
                  ▣
                </span>
                <span className="text-xs font-black">LIVE</span>
              </div>
              <div className="mt-5 text-4xl font-black">
                {num(s.totalLeads)}
              </div>
              <div className="text-sm font-semibold text-blue-100">
                Total Applications
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-600">
                  ✓
                </span>
                <span className="text-xs font-black text-emerald-600">
                  {Number(s.approvalRate || 0).toFixed(1)}%
                </span>
              </div>
              <div className="mt-5 text-4xl font-black text-slate-950">
                {num(s.approvedLoans)}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Approved Loans
              </div>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-600">
                  ◷
                </span>
                <span className="text-xs font-black text-amber-600">
                  PENDING
                </span>
              </div>
              <div className="mt-5 text-4xl font-black text-slate-950">
                {num(s.pendingLoans)}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Pending Applications
              </div>
            </div>

            <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600">
                  ×
                </span>
                <span className="text-xs font-black text-red-600">
                  REVIEW
                </span>
              </div>
              <div className="mt-5 text-4xl font-black text-slate-950">
                {num(s.rejectedLoans)}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Rejected Applications
              </div>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-xl text-violet-600">
                  ₹
                </span>
                <span className="text-xs font-black text-violet-600">
                  LOAN VALUE
                </span>
              </div>
              <div className="mt-5 text-3xl font-black text-slate-950">
                {money(s.totalLoanAmount)}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Total Loan Amount
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-xl text-orange-600">
                  ₹
                </span>
                <span className="text-xs font-black text-orange-600">
                  EARNINGS
                </span>
              </div>
              <div className="mt-5 text-3xl font-black text-slate-950">
                {money(s.totalEarnings)}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Total Commission
              </div>
            </div>

          </section>

          {/* SMALL KPI */}
          <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Total Customers
              </span>
              <div className="mt-1 text-3xl font-black text-slate-950">
                {num(s.totalCustomers)}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Unique customers handled
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Monthly Growth
              </span>
              <div className="mt-1 text-3xl font-black text-emerald-600">
                {perf.monthlyGrowth == null
                  ? "—"
                  : `${Number(perf.monthlyGrowth).toFixed(1)}%`}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Compared with previous month
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Current Month
              </span>
              <div className="mt-1 text-3xl font-black text-slate-950">
                {num(perf.currentMonthApplications)}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Applications
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Previous Month
              </span>
              <div className="mt-1 text-3xl font-black text-slate-950">
                {num(perf.previousMonthApplications)}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Applications
              </span>
            </div>
          </section>

          {/* MAIN CHARTS */}
          <section className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">

            {/* APPLICATION TREND */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-blue-600">▥</span>
                    <h2 className="text-2xl font-black text-slate-950">
                      Loan Application Trend
                    </h2>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    Actual application activity from assigned leads
                  </p>
                </div>

                <div className="flex rounded-xl bg-slate-100 p-1">
                  {["Monthly", "Quarterly", "Yearly"].map(x => (
                    <button
                      key={x}
                      onClick={() => setPeriod(x)}
                      className={`rounded-lg px-3 py-2 text-xs font-black transition ${
                        period === x
                          ? "bg-blue-600 text-white shadow"
                          : "text-slate-500"
                      }`}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-blue-600" />
                  Applications
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-emerald-500" />
                  Approved
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-red-500" />
                  Rejected
                </span>
              </div>

              <div className="mt-5 flex h-[390px] items-end gap-2 overflow-x-auto border-b border-slate-100 pb-1">
                {trend.length === 0 ? (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                    No application data available yet.
                  </div>
                ) : (
                  trend.map((x, i) => {
                    const a = Number(x.applications || 0);
                    const ap = Number(x.approved || 0);
                    const pe = Number(x.pending || 0);
                    const re = Number(x.rejected || 0);

                    return (
                      <div
                        key={`${x.month}-${i}`}
                        className="flex min-w-[58px] flex-1 flex-col items-center justify-end"
                      >
                        <div className="mb-2 text-xs font-black text-slate-500">
                          {a}
                        </div>

                        <div className="flex h-[300px] w-full max-w-[52px] items-end gap-1">
                          <div
                            className="flex-1 rounded-t-md bg-blue-600"
                            style={{
                              height: `${Math.max(
                                a ? 3 : 1,
                                (a / maxApps) * 100
                              )}%`,
                            }}
                          />
                          <div
                            className="flex-1 rounded-t-md bg-emerald-500"
                            style={{
                              height: `${Math.max(
                                ap ? 3 : 1,
                                (ap / maxApps) * 100
                              )}%`,
                            }}
                          />
                          <div
                            className="flex-1 rounded-t-md bg-amber-400"
                            style={{
                              height: `${Math.max(
                                pe ? 3 : 1,
                                (pe / maxApps) * 100
                              )}%`,
                            }}
                          />
                          <div
                            className="flex-1 rounded-t-md bg-red-500"
                            style={{
                              height: `${Math.max(
                                re ? 3 : 1,
                                (re / maxApps) * 100
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="mt-3 text-xs font-black text-slate-400">
                          {x.month || "—"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COMMISSION */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-emerald-500">⌁</span>
                    <h2 className="text-2xl font-black text-slate-950">
                      Commission Performance
                    </h2>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    Approved commission generated month by month
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                  LIVE
                </span>
              </div>

              <div className="mt-8 flex h-[350px] items-end gap-2 border-b border-slate-100">
                {commissions.length === 0 ? (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                    No commission data available yet.
                  </div>
                ) : (
                  commissions.map((x, i) => {
                    const value = Number(x.commission || 0);

                    return (
                      <div
                        key={`${x.month}-${i}`}
                        className="flex min-w-[45px] flex-1 flex-col items-center justify-end"
                      >
                        <div className="mb-2 text-[8px] font-black text-slate-500">
                          {money(value)}
                        </div>

                        <div
                          className="w-full max-w-[34px] rounded-t-xl bg-gradient-to-t from-emerald-600 to-green-300"
                          style={{
                            height: `${Math.max(
                              value ? 5 : 1,
                              (value / maxCommission) * 100
                            )}%`,
                          }}
                        />

                        <div className="mt-3 text-[8px] font-black text-slate-400">
                          {x.month || "—"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* LOWER ANALYTICS */}
          <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr]">

            {/* PRODUCT */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl text-violet-600">◉</span>
                <h2 className="text-2xl font-black text-slate-950">
                  Product Distribution
                </h2>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-400">
                Loan products based on actual applications
              </p>

              {products.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center text-sm font-bold text-slate-400">
                  No product data available yet.
                </div>
              ) : (
                <div className="mt-7 space-y-5">
                  {products.slice(0, 6).map((x, i) => {
                    const value = Number(x.value || 0);
                    const percent =
                      productTotal > 0
                        ? (value / productTotal) * 100
                        : 0;

                    return (
                      <div key={`${x.name}-${i}`}>
                        <div className="mb-2 flex justify-between gap-3">
                          <span className="truncate text-xs font-black text-slate-700">
                            {x.name || "Unknown Product"}
                          </span>
                          <span className="text-xs font-black text-slate-400">
                            {percent.toFixed(1)}%
                          </span>
                        </div>

                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STATUS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl text-violet-600">◔</span>
                <h2 className="text-2xl font-black text-slate-950">
                  Application Status
                </h2>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-400">
                Current status distribution
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-emerald-50 p-5 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-xl text-white">
                    ✓
                  </div>
                  <div className="mt-3 text-3xl font-black text-emerald-900">
                    {num(s.approvedLoans)}
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    Approved
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 p-5 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-xl text-white">
                    ◷
                  </div>
                  <div className="mt-3 text-3xl font-black text-amber-900">
                    {num(s.pendingLoans)}
                  </div>
                  <div className="text-xs font-bold text-amber-700">
                    Pending
                  </div>
                </div>

                <div className="rounded-2xl bg-red-50 p-5 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-xl text-white">
                    ×
                  </div>
                  <div className="mt-3 text-3xl font-black text-red-900">
                    {num(s.rejectedLoans)}
                  </div>
                  <div className="text-xs font-bold text-red-700">
                    Rejected
                  </div>
                </div>

                <div className="rounded-2xl bg-violet-50 p-5 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-violet-500 text-xl text-white">
                    ₹
                  </div>
                  <div className="mt-3 text-lg font-black text-violet-900">
                    {money(s.approvedLoanAmount)}
                  </div>
                  <div className="text-xs font-bold text-violet-700">
                    Approved Value
                  </div>
                </div>
              </div>
            </div>

            {/* TOP PRODUCTS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl text-blue-600">★</span>
                <h2 className="text-2xl font-black text-slate-950">
                  Top Products
                </h2>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-400">
                Based on actual application volume
              </p>

              <div className="mt-6 space-y-5">
                {topProducts.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm font-bold text-slate-400">
                    No product data available yet.
                  </div>
                ) : (
                  topProducts.map((x, i) => {
                    const value = Number(x.value || 0);
                    const max = Number(topProducts[0]?.value || 1);
                    const width = Math.min(100, (value / max) * 100);

                    return (
                      <div key={`${x.name}-${i}`}>
                        <div className="mb-2 flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-600">
                            {i + 1}
                          </span>
                          <span className="flex-1 truncate text-xs font-black text-slate-700">
                            {x.name || "Unknown Product"}
                          </span>
                          <span className="text-xs font-black text-slate-500">
                            {num(value)}
                          </span>
                        </div>

                        <div className="ml-10 h-2.5 rounded-full bg-slate-100">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* FINANCIAL OVERVIEW */}
          <section className="mt-5 rounded-3xl bg-gradient-to-br from-[#071b3b] via-[#0b2850] to-[#092e43] p-6 text-white shadow-xl md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  Financial Activity
                </div>
                <h2 className="mt-1 text-3xl font-black">
                  Financial Overview
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Transaction summary and earnings from your backend data.
                </p>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
                ● Real API Data
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-bold text-slate-400">
                  Transaction Volume
                </div>
                <div className="mt-2 text-3xl font-black">
                  {money(tx.totalAmount)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-bold text-slate-400">
                  Transaction Commission
                </div>
                <div className="mt-2 text-3xl font-black text-emerald-300">
                  {money(tx.totalCommission)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-bold text-slate-400">
                  Cashback Earned
                </div>
                <div className="mt-2 text-3xl font-black text-cyan-300">
                  {money(tx.totalCashback)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-bold text-slate-400">
                  Pending Commission
                </div>
                <div className="mt-2 text-3xl font-black text-amber-300">
                  {money(s.pendingCommission)}
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM */}
          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Business Snapshot
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Your current backend performance
                  </p>
                </div>
                <span className="text-3xl">🚀</span>
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-5">
                <div className="text-xs font-black text-blue-700">
                  Keep Growing!
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-600">
                  {perf.monthlyGrowth == null
                    ? "Keep adding applications to build your performance history."
                    : `Your application activity changed ${Number(
                        perf.monthlyGrowth
                      ).toFixed(1)}% compared with the previous month.`}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl text-blue-600">◈</span>
                <h2 className="text-2xl font-black text-slate-950">
                  Key Performance
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">
                    Approval Rate
                  </div>
                  <div className="mt-1 text-2xl font-black text-slate-900">
                    {Number(s.approvalRate || 0).toFixed(1)}%
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">
                    Approved Value
                  </div>
                  <div className="mt-1 text-2xl font-black text-slate-900">
                    {money(s.approvedLoanAmount)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">
                    Total Earnings
                  </div>
                  <div className="mt-1 text-2xl font-black text-emerald-600">
                    {money(s.totalEarnings)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">
                    Pending Earnings
                  </div>
                  <div className="mt-1 text-2xl font-black text-amber-600">
                    {money(s.pendingCommission)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-7 text-center text-[10px] font-semibold text-slate-400">
            DSA FinCorp • Analytics calculated from live backend data
          </footer>
        </div>
      </div>
    </DsaShell>
  );
}

