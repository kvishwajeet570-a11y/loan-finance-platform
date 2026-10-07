"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
  Star,
  Users,
  ChevronRight,
  MoreVertical,
  Copy,
  SlidersHorizontal,
  X,
} from "lucide-react";
import api from "@/lib/api";

type BankAccount = {
  id: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  verificationStatus?: string;
  isPrimary?: boolean;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
};

function unwrap(payload: any): any {
  if (!payload) return null;
  if (payload.data !== undefined) return payload.data;
  return payload;
}

function getAccounts(payload: any): BankAccount[] {
  const data = unwrap(payload);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.accounts)) return data.accounts;
  if (Array.isArray(data?.banks)) return data.banks;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

function maskAccount(value?: string) {
  const account = String(value || "");

  if (!account) return "•••• ••••";

  if (account.length <= 4) {
    return `•••• ${account}`;
  }

  return `•••• •••• ${account.slice(-4)}`;
}

function statusInfo(status?: string) {
  const value = String(status || "PENDING").toUpperCase();

  if (
    value === "VERIFIED" ||
    value === "APPROVED" ||
    value === "SUCCESS"
  ) {
    return {
      label: "Verified",
      icon: CheckCircle2,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (
    value === "REJECTED" ||
    value === "FAILED"
  ) {
    return {
      label: "Rejected",
      icon: XCircle,
      className:
        "border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    label: "Pending Verification",
    icon: Clock3,
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
  };
}

function bankInitial(bankName?: string) {
  return String(bankName || "B").trim().charAt(0).toUpperCase();
}

function formatDate(date?: string) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SuperAdminBankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verifyingId, setVerifyingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bankFilter, setBankFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const loadAccounts = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("loan_finance_token");

      if (!token) {
        setError("Super Admin session not found.");
        return;
      }

      const response = await api.get(
        `/bank?page=1&limit=100&search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setAccounts(getAccounts(response.data));
    } catch (err: any) {
      console.error("Super Admin Bank Accounts Error:", err);

      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err?.response?.status === 403) {
        setError(
          "You do not have permission to manage bank accounts."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Failed to load bank accounts."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const verifyAccount = async (id: string) => {
    try {
      setVerifyingId(id);
      setError("");
      setMessage("");

      const token = localStorage.getItem("loan_finance_token");

      const response = await api.patch(
        `/bank/${id}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Verification failed."
        );
      }

      setMessage(
        "Bank account verified successfully."
      );

      await loadAccounts();
    } catch (err: any) {
      console.error(
        "Verify Bank Account Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to verify bank account."
      );
    } finally {
      setVerifyingId("");
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadAccounts();
  };

  const banks = useMemo(() => {
    return Array.from(
      new Set(
        accounts
          .map((account) =>
            String(account.bankName || "").trim()
          )
          .filter(Boolean)
      )
    );
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const status = String(
        account.verificationStatus || "PENDING"
      ).toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING" &&
          status === "PENDING") ||
        (statusFilter === "VERIFIED" &&
          (status === "VERIFIED" ||
            status === "APPROVED")) ||
        (statusFilter === "REJECTED" &&
          (status === "REJECTED" ||
            status === "FAILED"));

      const matchesBank =
        bankFilter === "ALL" ||
        account.bankName === bankFilter;

      return matchesStatus && matchesBank;
    });
  }, [accounts, statusFilter, bankFilter]);

  const totalAccounts = accounts.length;

  const pendingCount = accounts.filter(
    (account) =>
      String(
        account.verificationStatus || "PENDING"
      ).toUpperCase() === "PENDING"
  ).length;

  const verifiedCount = accounts.filter(
    (account) => {
      const status = String(
        account.verificationStatus || ""
      ).toUpperCase();

      return (
        status === "VERIFIED" ||
        status === "APPROVED"
      );
    }
  ).length;

  const uniqueCustomers = new Set(
    accounts.map(
      (account) =>
        account.user?.id ||
        account.user?.phone ||
        account.accountHolderName ||
        account.id
    )
  ).size;

  const copyAccount = async (
    id: string,
    accountNumber?: string
  ) => {
    if (!accountNumber) return;

    try {
      await navigator.clipboard.writeText(
        accountNumber
      );

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId("");
      }, 1500);
    } catch {
      setCopiedId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Premium Header */}
        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 p-6 shadow-sm sm:p-8">

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-2xl" />
          <div className="absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-200/20 blur-2xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-200">
                <Building2 size={31} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">
                    Central Control
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-[#071b3a] sm:text-3xl lg:text-4xl">
                  Bank Accounts
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Review and verify customer bank accounts.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-5 py-4 shadow-sm backdrop-blur md:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-xs font-black text-slate-800">
                  Secure Banking
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  Safer Customers • Stronger Ecosystem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <XCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{message}</span>
          </div>
        )}

        {/* Stats */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Building2 size={23} />
              </div>

              <ChevronRight
                size={18}
                className="text-blue-300"
              />
            </div>

            <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Total Accounts
            </p>

            <p className="mt-1 text-2xl font-black text-[#071b3a]">
              {totalAccounts}
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              All customer bank accounts
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Clock3 size={23} />
              </div>

              <ChevronRight
                size={18}
                className="text-amber-300"
              />
            </div>

            <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-amber-600">
              Pending Verification
            </p>

            <p className="mt-1 text-2xl font-black text-[#071b3a]">
              {pendingCount}
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              Awaiting admin review
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <ShieldCheck size={23} />
              </div>

              <ChevronRight
                size={18}
                className="text-emerald-300"
              />
            </div>

            <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-emerald-600">
              Verified Accounts
            </p>

            <p className="mt-1 text-2xl font-black text-[#071b3a]">
              {verifiedCount}
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              Verified & active
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Users size={23} />
              </div>

              <ChevronRight
                size={18}
                className="text-violet-300"
              />
            </div>

            <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-violet-600">
              Unique Customers
            </p>

            <p className="mt-1 text-2xl font-black text-[#071b3a]">
              {uniqueCustomers}
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              Customers with accounts
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row">

            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by bank name, account holder, IFSC, branch..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="h-12 min-w-[160px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="ALL">
                    All Status
                  </option>
                  <option value="PENDING">
                    Pending
                  </option>
                  <option value="VERIFIED">
                    Verified
                  </option>
                  <option value="REJECTED">
                    Rejected
                  </option>
                </select>

                <ChevronRight
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={bankFilter}
                  onChange={(e) =>
                    setBankFilter(e.target.value)
                  }
                  className="h-12 min-w-[160px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="ALL">
                    All Banks
                  </option>

                  {banks.map((bank) => (
                    <option
                      key={bank}
                      value={bank}
                    >
                      {bank}
                    </option>
                  ))}
                </select>

                <ChevronRight
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setBankFilter("ALL");
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <X size={16} />
                Clear
              </button>

              <button
                type="button"
                onClick={refresh}
                disabled={refreshing}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <RefreshCw
                size={25}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-5 text-sm font-black text-slate-700">
              Loading bank accounts...
            </p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Building2
                size={28}
                className="text-slate-400"
              />
            </div>

            <p className="mt-5 text-base font-black text-slate-800">
              No bank accounts found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {filteredAccounts.map((account) => {
              const status = statusInfo(
                account.verificationStatus
              );

              const StatusIcon = status.icon;

              const customerName =
                account.user?.fullName ||
                account.user?.name ||
                "Customer";

              const isPending =
                String(
                  account.verificationStatus ||
                    "PENDING"
                ).toUpperCase() ===
                "PENDING";

              return (
                <div
                  key={account.id}
                  className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70"
                >

                  {/* Accent */}
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-600 to-violet-500" />

                  <div className="p-5 pl-6 sm:p-6 sm:pl-7">

                    {/* Top */}
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 text-xl font-black text-blue-600 shadow-inner">
                          {bankInitial(
                            account.bankName
                          )}
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-black text-[#071b3a] sm:text-xl">
                              {account.bankName ||
                                "Bank Account"}
                            </h2>

                            {account.isPrimary && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-amber-700">
                                <Star
                                  size={10}
                                  fill="currentColor"
                                />
                                Primary
                              </span>
                            )}
                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-slate-500">

                            <span className="inline-flex items-center gap-1.5">
                              <UserRound
                                size={14}
                              />
                              {customerName}
                            </span>

                            {account.user?.phone && (
                              <span className="text-xs text-slate-400">
                                {account.user.phone}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <p className="text-sm font-black tracking-[0.16em] text-slate-800">
                              {maskAccount(
                                account.accountNumber
                              )}
                            </p>

                            {account.accountNumber && (
                              <button
                                type="button"
                                onClick={() =>
                                  copyAccount(
                                    account.id,
                                    account.accountNumber
                                  )
                                }
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                title="Copy account number"
                              >
                                <Copy size={14} />
                              </button>
                            )}

                            {copiedId ===
                              account.id && (
                              <span className="text-[10px] font-bold text-emerald-600">
                                Copied
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        <div className="text-left sm:text-right">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${status.className}`}
                          >
                            <StatusIcon
                              size={14}
                            />
                            {status.label}
                          </span>

                          {account.createdAt && (
                            <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
                              Added{" "}
                              {formatDate(
                                account.createdAt
                              )}
                            </p>
                          )}
                        </div>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() =>
                              verifyAccount(
                                account.id
                              )
                            }
                            disabled={
                              verifyingId ===
                              account.id
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {verifyingId ===
                            account.id ? (
                              <>
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <ShieldCheck
                                  size={17}
                                />
                                Verify Account
                              </>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          className="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 sm:flex"
                        >
                          <MoreVertical
                            size={18}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">

                      <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/40 p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                          Account Holder
                        </p>

                        <p className="mt-1.5 text-sm font-black text-slate-800">
                          {account.accountHolderName ||
                            "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/40 p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                          IFSC Code
                        </p>

                        <p className="mt-1.5 text-sm font-black tracking-wide text-slate-800">
                          {account.ifscCode ||
                            "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/40 p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                          Branch
                        </p>

                        <p className="mt-1.5 text-sm font-black text-slate-800">
                          {account.branchName ||
                            "—"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                        <ShieldCheck
                          size={14}
                          className="text-emerald-500"
                        />
                        Secure banking information
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        Account ID:
                        <span className="font-mono text-slate-500">
                          {account.id.slice(
                            0,
                            10
                          )}
                          ...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-xs font-black text-emerald-800">
                Secure Bank Verification
              </p>

              <p className="text-[10px] font-semibold text-emerald-700/70">
                Only authorized Super Admins can verify accounts.
              </p>
            </div>
          </div>

          <div className="text-[10px] font-bold text-emerald-700">
            Showing {filteredAccounts.length} of{" "}
            {totalAccounts} accounts
          </div>
        </div>
      </div>
    </div>
  );
}
