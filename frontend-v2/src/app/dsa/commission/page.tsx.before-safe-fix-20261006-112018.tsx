"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type Commission = {
  id: string;
  amount?: number;
  commissionAmount?: number;
  status?: string;
  source?: string;
  createdAt?: string;
  loanId?: string;
  partnerId?: string;
  customerName?: string;
  customer?: {
    name?: string;
    fullName?: string;
  };
  loanType?: string;
  loanAmount?: number;
  disbursementAmount?: number;
  commissionRate?: number;
  payoutDate?: string;
};

export default function CommissionPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loanFilter, setLoanFilter] = useState("ALL");

  useEffect(() => {
    const loadCommissions = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const userId =
          localStorage.getItem("userId") ||
          localStorage.getItem("user_id");

        const endpoint = userId
          ? `${API_URL}/commission/user/${userId}`
          : `${API_URL}/commission`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`Commission API returned ${response.status}`);
        }

        const result = await response.json();

        const data =
          Array.isArray(result)
            ? result
            : Array.isArray(result?.commissions)
            ? result.commissions
            : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.data?.commissions)
            ? result.data.commissions
            : [];

        setCommissions(data);
      } catch (err) {
        console.error("Commission API error:", err);
        setError("Unable to load real commission data.");
        setCommissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadCommissions();
  }, []);

  const getAmount = (item: Commission) =>
    Number(item.commissionAmount ?? item.amount ?? 0);

  const totalCommission = useMemo(
    () => commissions.reduce((sum, item) => sum + getAmount(item), 0),
    [commissions]
  );

  const approvedCommission = useMemo(
    () =>
      commissions
        .filter(
          (item) => String(item.status).toUpperCase() === "APPROVED"
        )
        .reduce((sum, item) => sum + getAmount(item), 0),
    [commissions]
  );

  const pendingCommission = useMemo(
    () =>
      commissions
        .filter(
          (item) => String(item.status).toUpperCase() === "PENDING"
        )
        .reduce((sum, item) => sum + getAmount(item), 0),
    [commissions]
  );

  const paidCommission = useMemo(
    () =>
      commissions
        .filter((item) => String(item.status).toUpperCase() === "PAID")
        .reduce((sum, item) => sum + getAmount(item), 0),
    [commissions]
  );

  const loanTypes = useMemo(() => {
    const map: Record<string, number> = {};

    commissions.forEach((item) => {
      const type = item.loanType || item.source || "Other";
      map[type] = (map[type] || 0) + getAmount(item);
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [commissions]);

  const filteredCommissions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return commissions.filter((item) => {
      const status = String(item.status || "PENDING").toUpperCase();
      const loanType = item.loanType || item.source || "Other";

      const customer =
        item.customerName ||
        item.customer?.name ||
        item.customer?.fullName ||
        "";

      const matchesSearch =
        !q ||
        customer.toLowerCase().includes(q) ||
        String(item.loanId || "").toLowerCase().includes(q) ||
        loanType.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const matchesLoan =
        loanFilter === "ALL" || loanType === loanFilter;

      return matchesSearch && matchesStatus && matchesLoan;
    });
  }, [commissions, search, statusFilter, loanFilter]);

  const money = (value: number) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const date = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] p-4 md:p-6">


<div className="mx-auto max-w-[1500px] space-y-5 animate-pulse">
          <div className="h-44 rounded-[28px] bg-white shadow-sm" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((x) => (
              <div key={x} className="h-36 rounded-[24px] bg-white" />
            ))}
          </div>
          <div className="h-[420px] rounded-[28px] bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f7ff] px-3 py-4 text-[#10194d] md:px-6 md:py-6">


  {/* Background Glow */}
  <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-[90px]"></div>
  <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-[100px]"></div>
  <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-blue-400/20 blur-[70px]"></div>

  {/* Decorative Lines */}
  <div className="pointer-events-none absolute inset-0 opacity-20">
    <div className="absolute right-[-40px] top-[45px] h-[2px] w-[420px] rotate-[-18deg] bg-cyan-300"></div>
    <div className="absolute right-[-30px] top-[105px] h-[2px] w-[360px] rotate-[-18deg] bg-blue-300"></div>
    <div className="absolute right-[80px] top-[165px] h-[2px] w-[300px] rotate-[-18deg] bg-violet-300"></div>
  </div>

  <div className="relative z-10 flex min-h-[245px] flex-col justify-between gap-7 px-6 py-7 sm:px-9 sm:py-8 lg:flex-row lg:items-center">

    {/* LEFT CONTENT */}
    <div className="max-w-[700px]">

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-4 py-2 text-[11px] font-extrabold tracking-wide text-cyan-100 shadow-lg backdrop-blur-md">
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"></span>
        DSA COMMISSION
        <span className="text-blue-300">•</span>
        LIVE EARNINGS
      </div>

      <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[52px]">
        Your Commission
        <br className="sm:hidden" />
        <span className="ml-2 bg-gradient-to-r from-cyan-300 via-white to-yellow-300 bg-clip-text text-transparent">
          &amp; Earnings
        </span>
      </h1>

      <p className="mt-4 max-w-[650px] text-sm font-medium leading-6 text-blue-100 sm:text-[15px]">
        Track every loan commission, monitor payouts and discover your
        earning performance with DSA FinCorp.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">

        <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold backdrop-blur-md">
          <span className="text-emerald-300">●</span>
          Real-time Data
        </span>

        <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold backdrop-blur-md">
          <span className="text-cyan-300">◆</span>
          Multiple Lenders
        </span>

        <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold backdrop-blur-md">
          <span className="text-yellow-300">₹</span>
          Transparent Payouts
        </span>

        <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold backdrop-blur-md">
          <span className="text-pink-300">★</span>
          Higher Incentives
        </span>

      </div>

    </div>

    {/* RIGHT EARNINGS PANEL */}
    <div className="relative shrink-0">

      <div className="relative w-full overflow-hidden rounded-[24px] border border-white/20 bg-gradient-to-br from-white/15 to-white/5 p-5 shadow-2xl backdrop-blur-xl sm:w-[310px]">

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-300/20 blur-2xl"></div>

        <div className="relative flex items-start justify-between">

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Your Performance
            </p>

            <p className="mt-2 text-4xl font-black">
              {commissions.length}
            </p>

            <p className="mt-1 text-xs text-blue-200">
              Commission Transactions
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-200/30 bg-gradient-to-br from-yellow-300 to-orange-500 text-2xl shadow-[0_8px_25px_rgba(251,191,36,0.35)]">
            🏆
          </div>

        </div>

        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
            style={{
              width: `${Math.min(Math.max(commissions.length * 5, 5), 100)}%`,
            }}
          />

        </div>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="text-blue-200">
            Keep growing
          </span>

          <span className="font-bold text-emerald-300">
            ↑ Higher Earnings
          </span>
        </div>

      </div>

    </div>

  </div>

  {/* Bottom Glow Strip */}
  <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-yellow-400"></div>

</section>

<div className="mx-auto max-w-[1500px] space-y-5">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#07164f] via-[#123ea7] to-[#0879e8] p-6 text-white shadow-[0_20px_60px_rgba(30,82,180,.22)] md:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-[-100px] right-[25%] h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
                ✦ DSA COMMISSION
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                LIVE DATA
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Your Commission &{" "}
                <span className="text-cyan-300">Earnings</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-blue-100 md:text-base">
                Track your earnings, payouts, loan-wise performance and
                commission transactions in real time.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Real-time Tracking",
                  "Transparent Payouts",
                  "Secure & Reliable",
                  "Higher Earnings",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden min-w-[250px] rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur md:block">
              <div className="text-sm text-blue-100">Your Performance</div>
              <div className="mt-2 text-3xl font-black">
                {commissions.length}
              </div>
              <div className="mt-1 text-sm text-cyan-200">
                Commission Transactions
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-300 to-emerald-400" />
              </div>
              <div className="mt-2 text-xs text-blue-200">
                Keep growing your loan portfolio
              </div>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            ⚠ {error}
          </div>
        )}

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="group rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Commission
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {money(totalCommission)}
                </h2>
                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                  ↗ Live Total
                </span>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 text-2xl">₹</div>
            </div>
          </div>

          <div className="group rounded-[24px] border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Approved Commission
                </p>
                <h2 className="mt-2 text-3xl font-black text-emerald-600">
                  {money(approvedCommission)}
                </h2>
                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                  ✓ Approved
                </span>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-2xl text-emerald-600">
                ✓
              </div>
            </div>
          </div>

          <div className="group rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Pending Commission
                </p>
                <h2 className="mt-2 text-3xl font-black text-orange-500">
                  {money(pendingCommission)}
                </h2>
                <span className="mt-3 inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                  ◷ Pending
                </span>
              </div>
              <div className="rounded-2xl bg-orange-50 p-4 text-2xl text-orange-500">
                ◷
              </div>
            </div>
          </div>

          <div className="group rounded-[24px] border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Available for Payout
                </p>
                <h2 className="mt-2 text-3xl font-black text-purple-600">
                  {money(paidCommission)}
                </h2>
                <button className="mt-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
                  Transfer to Wallet →
                </button>
              </div>
              <div className="rounded-2xl bg-purple-50 p-4 text-2xl">
                ◈
              </div>
            </div>
          </div>

        </section>

        {/* ANALYTICS */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">

          <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black">
                  Monthly Commission Earnings
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Live commission distribution from backend records
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">
                Last 6 Months ▾
              </div>
            </div>

            <div className="mt-8 flex h-[270px] items-end gap-2 overflow-hidden px-2">
              {Array.from({ length: 12 }).map((_, index) => {
                const values =
                  commissions.length > 0
                    ? commissions.slice(
                        Math.max(0, commissions.length - 12)
                      )
                    : [];

                const value = values[index]
                  ? getAmount(values[index])
                  : 0;

                const max = Math.max(
                  ...values.map(getAmount),
                  totalCommission / 3,
                  1
                );

                const height =
                  value > 0
                    ? Math.max(10, (value / max) * 190)
                    : 8;

                return (
                  <div
                    key={index}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="mb-2 text-center text-[9px] font-bold text-slate-400">
                      {value ? money(value) : ""}
                    </div>
                    <div
                      className="rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 shadow-lg transition hover:from-purple-600 hover:to-blue-400"
                      style={{ height: `${height}px` }}
                    />
                    <div className="mt-2 text-center text-[10px] font-semibold text-slate-400">
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][index]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-purple-100 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-black">
              Commission by Loan Type
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Distribution based on available commission records
            </p>

            <div className="mt-7 flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#1677ff_0_35%,#00c48c_35%_57%,#ffb21d_57%_72%,#ff5b7f_72%_84%,#8b5cf6_84%_94%,#94a3b8_94%_100%)] shadow-inner">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-lg font-black">
                    {money(totalCommission)}
                  </span>
                  <span className="text-xs text-slate-500">Total</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                {loanTypes.length === 0 ? (
                  <div className="text-sm text-slate-400">
                    No loan-type data available.
                  </div>
                ) : (
                  loanTypes.map(([type, amount], index) => (
                    <div
                      key={type}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            [
                              "bg-blue-500",
                              "bg-emerald-500",
                              "bg-yellow-400",
                              "bg-pink-500",
                              "bg-purple-500",
                              "bg-slate-400",
                            ][index]
                          }`}
                        />
                        <span className="font-semibold">{type}</span>
                      </div>
                      <span className="font-black">
                        {money(amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </section>

        {/* PAYOUT STRIP */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-[22px] border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-2xl">
                ₹
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Total Transactions
                </p>
                <p className="text-2xl font-black">
                  {commissions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-50 p-4 text-2xl">
                ✓
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Paid Commission
                </p>
                <p className="text-2xl font-black">
                  {money(paidCommission)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-orange-50 p-4 text-2xl">
                ◷
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Pending Payout
                </p>
                <p className="text-2xl font-black">
                  {money(pendingCommission)}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* TRANSACTIONS */}
        <section className="rounded-[28px] border border-blue-100 bg-white p-4 shadow-sm md:p-6">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Commission Transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View your real commission details, payout status and transaction history.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, loan..."
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={loanFilter}
                onChange={(e) => setLoanFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none"
              >
                <option value="ALL">All Loan Types</option>
                {loanTypes.map(([type]) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="bg-[#f5f8ff] text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-4">#</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Loan Type</th>
                  <th className="px-4 py-4">Loan ID</th>
                  <th className="px-4 py-4">Commission</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-16 text-center text-sm text-slate-400"
                    >
                      No real commission records found.
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((item, index) => {
                    const status = String(
                      item.status || "PENDING"
                    ).toUpperCase();

                    const customer =
                      item.customerName ||
                      item.customer?.name ||
                      item.customer?.fullName ||
                      "-";

                    const loanType =
                      item.loanType || item.source || "Other";

                    const statusClass =
                      status === "PAID"
                        ? "bg-blue-50 text-blue-700"
                        : status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : status === "REJECTED"
                        ? "bg-red-50 text-red-700"
                        : "bg-orange-50 text-orange-700";

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 transition hover:bg-blue-50/40"
                      >
                        <td className="px-4 py-4 font-bold text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-bold text-[#10194d]">
                            {customer}
                          </div>
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          {loanType}
                        </td>

                        <td className="px-4 py-4 font-mono text-xs text-slate-500">
                          {item.loanId || "-"}
                        </td>

                        <td className="px-4 py-4 font-black">
                          {money(getAmount(item))}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-slate-500">
                          {date(item.createdAt)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row">
            <span>
              Showing {filteredCommissions.length} of {commissions.length} real records
            </span>
            <span>
              API: Connected • Database data only
            </span>
          </div>

        </section>

      </div>
    </main>
  );
}



