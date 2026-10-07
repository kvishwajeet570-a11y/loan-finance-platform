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
    `Ã¢â€šÂ¹${Number(value || 0).toLocaleString("en-IN")}`;

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


<div className="mx-auto max-w-[1500px] space-y-5">

        {/* HERO */}
        <section className="w-full overflow-hidden rounded-[28px] border border-blue-200/50 bg-white shadow-[0_18px_55px_rgba(15,78,180,0.16)]">
  <div className="w-full aspect-[2.65/1] overflow-hidden">
      <img
        src="/images/commission-banner.png"
        alt="Commission Earnings"
        className="block h-full w-full object-cover object-center"
      />
    </div>
</section>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            Ã¢Å¡Â  {error}
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
                  Ã¢â€ â€” Live Total
                </span>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 text-2xl">Ã¢â€šÂ¹</div>
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
                  Ã¢Å“â€œ Approved
                </span>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-2xl text-emerald-600">
                Ã¢Å“â€œ
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
                  Ã¢â€”Â· Pending
                </span>
              </div>
              <div className="rounded-2xl bg-orange-50 p-4 text-2xl text-orange-500">
                Ã¢â€”Â·
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
                  Transfer to Wallet Ã¢â€ â€™
                </button>
              </div>
              <div className="rounded-2xl bg-purple-50 p-4 text-2xl">
                Ã¢â€”Ë†
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
                Last 6 Months Ã¢â€“Â¾
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
                Ã¢â€šÂ¹
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
                Ã¢Å“â€œ
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
                Ã¢â€”Â·
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
              API: Connected Ã¢â‚¬Â¢ Database data only
            </span>
          </div>

        </section>

      </div>
    </main>
  );
}










