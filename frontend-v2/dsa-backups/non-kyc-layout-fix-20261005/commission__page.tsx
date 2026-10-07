"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  IndianRupee,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Commission = {
  id: string;
  amount?: number;
  commissionAmount?: number;
  loanAmount?: number;
  source?: string | null;
  status?: string | null;
  createdAt?: string;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  loan?: {
    id?: string;
    applicationNo?: string;
    loanType?: string;
    loanAmount?: number;
  } | null;
};

type User = {
  id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function getStatus(status?: string | null) {
  const value = String(status || "PENDING").toUpperCase();

  if (value === "APPROVED") {
    return {
      label: "Approved",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    };
  }

  if (value === "PAID") {
    return {
      label: "Paid",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Wallet,
    };
  }

  if (value === "REJECTED") {
    return {
      label: "Rejected",
      className: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    };
  }

  return {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  };
}

export default function DsaCommissionPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadCommissions = useCallback(async () => {
    try {
      setError("");

      const rawUser = localStorage.getItem("loan_finance_user");
      const token = localStorage.getItem("loan_finance_token");

      if (!rawUser) {
        throw new Error("Logged-in user information not found.");
      }

      const user: User = JSON.parse(rawUser);
      const userId = user.id || user.userId;

      if (!userId) {
        throw new Error("User ID not found.");
      }

      const response = await fetch(
        `${API}/commission/user/${encodeURIComponent(userId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          credentials: "include",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            `Unable to load commission (${response.status})`
        );
      }

      const data = result?.data ?? result;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.commissions)
        ? data.commissions
        : [];

      setCommissions(list);
    } catch (err) {
      setCommissions([]);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load commission data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCommissions();
  }, [loadCommissions]);

  const stats = useMemo(() => {
    return commissions.reduce(
      (acc, item) => {
        const amount = Number(item.commissionAmount ?? item.amount ?? 0);
        const status = String(item.status || "PENDING").toUpperCase();

        acc.total += amount;

        if (status === "PENDING") acc.pending += amount;
        if (status === "APPROVED") acc.approved += amount;
        if (status === "PAID") acc.paid += amount;
        if (status === "REJECTED") acc.rejected += amount;

        return acc;
      },
      {
        total: 0,
        pending: 0,
        approved: 0,
        paid: 0,
        rejected: 0,
      }
    );
  }, [commissions]);

  const filteredCommissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return commissions.filter((item) => {
      const status = String(item.status || "PENDING").toUpperCase();

      if (statusFilter !== "ALL" && status !== statusFilter) {
        return false;
      }

      if (!query) return true;

      const searchable = [
        item.id,
        item.source,
        item.loan?.id,
        item.loan?.applicationNo,
        item.loan?.loanType,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [commissions, search, statusFilter]);

  const cards = [
    {
      title: "Total Commission",
      value: stats.total,
      icon: IndianRupee,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Pending Commission",
      value: stats.pending,
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "Approved Commission",
      value: stats.approved,
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Paid Commission",
      value: stats.paid,
      icon: Wallet,
      iconClass: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Commission
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500 md:text-base">
              Your real commission earnings and commission history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              loadCommissions();
            }}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="font-semibold">Commission data could not be loaded.</div>
            <div className="mt-1">{error}</div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {loading ? "—" : money(card.value)}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-3 ${card.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Commission History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing commission records linked to your account.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search commission..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:bg-white sm:w-64"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PAID">Paid</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading commission data...
            </div>
          ) : filteredCommissions.length === 0 ? (
            <div className="p-12 text-center">
              <Wallet className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-semibold text-slate-700">
                No commission records found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Commission records will appear here when available.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3">Commission ID</th>
                      <th className="px-5 py-3">Loan</th>
                      <th className="px-5 py-3">Loan Amount</th>
                      <th className="px-5 py-3">Commission</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCommissions.map((item) => {
                      const badge = getStatus(item.status);
                      const StatusIcon = badge.icon;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <div className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                              {item.id}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="text-sm font-medium text-slate-800">
                              {item.loan?.applicationNo ||
                                item.loan?.id ||
                                item.source ||
                                "Loan"}
                            </div>

                            {item.loan?.loanType && (
                              <div className="mt-1 text-xs text-slate-500">
                                {item.loan.loanType}
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {money(
                              Number(
                                item.loanAmount ??
                                  item.loan?.loanAmount ??
                                  0
                              )
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold text-slate-900">
                            {money(
                              Number(
                                item.commissionAmount ??
                                  item.amount ??
                                  0
                              )
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {badge.label}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <CalendarDays className="h-4 w-4 text-slate-400" />
                              {item.createdAt
                                ? new Date(
                                    item.createdAt
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {filteredCommissions.map((item) => {
                  const badge = getStatus(item.status);
                  const StatusIcon = badge.icon;

                  return (
                    <div key={item.id} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {item.loan?.applicationNo ||
                              item.loan?.id ||
                              item.source ||
                              "Loan"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {item.id}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${badge.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {badge.label}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] text-slate-500">
                            Loan Amount
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {money(
                              Number(
                                item.loanAmount ??
                                  item.loan?.loanAmount ??
                                  0
                              )
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] text-slate-500">
                            Commission
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {money(
                              Number(
                                item.commissionAmount ??
                                  item.amount ??
                                  0
                              )
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
