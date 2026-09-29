"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Building2,
  Star,
  RefreshCw,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  XCircle,
  CreditCard,
  Landmark,
  ArrowUpRight,
} from "lucide-react";
import api from "@/lib/api";

type BankAccount = {
  id: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  isPrimary?: boolean;
  verificationStatus?: string;
};

function unwrap(payload: any): any {
  if (!payload) return null;
  if (payload.data !== undefined) return payload.data;
  if (payload.accounts !== undefined) return payload.accounts;
  if (payload.bankAccounts !== undefined) return payload.bankAccounts;
  return payload;
}

function maskAccountNumber(accountNumber?: string) {
  if (!accountNumber) return "•••• •••• ••••";
  if (accountNumber.length <= 4) return accountNumber;
  return `•••• •••• ${accountNumber.slice(-4)}`;
}

function statusInfo(status?: string) {
  const value = String(status || "PENDING").toUpperCase();

  if (value === "VERIFIED") {
    return {
      label: "Verified",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      iconClass: "text-emerald-600",
    };
  }

  if (value === "REJECTED") {
    return {
      label: "Rejected",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-100",
      iconClass: "text-red-600",
    };
  }

  return {
    label: "Pending Verification",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-100",
    iconClass: "text-amber-600",
  };
}

export default function MyBankAccountsPage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAccounts = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("loan_finance_token");
      const storedUser = localStorage.getItem("loan_finance_user");

      if (!token || !storedUser) {
        router.replace("/login");
        return;
      }

      let user: any = {};

      try {
        user = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      const userId = user?.id;

      if (!userId) {
        setError("Customer account information not found.");
        return;
      }

      const response = await api.get(`/bank/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const data = unwrap(response.data);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setAccounts(list);
    } catch (err: any) {
      console.error("Bank Accounts Error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load your bank accounts."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const refreshAccounts = async () => {
    setRefreshing(true);
    await loadAccounts();
  };

  const deleteAccount = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bank account?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("loan_finance_token");

      await api.delete(`/bank/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      await loadAccounts();
    } catch (err: any) {
      console.error("Delete Bank Account Error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete bank account."
      );
    }
  };

  const stats = useMemo(() => {
    const verified = accounts.filter(
      (account) =>
        String(account.verificationStatus || "").toUpperCase() ===
        "VERIFIED"
    ).length;

    const primary = accounts.filter(
      (account) => account.isPrimary
    ).length;

    return {
      total: accounts.length,
      verified,
      primary,
    };
  }, [accounts]);

  return (
    <div className="min-h-screen bg-[#f5f8fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                Banking
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-[#071b3a] sm:text-3xl">
              My Bank Accounts
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Securely manage your registered bank accounts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refreshAccounts}
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/customer/bank-accounts/add")
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200"
            >
              <Plus size={17} strokeWidth={2.5} />
              Add Account
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Summary */}
        {!loading && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                    Total Accounts
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.total}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Landmark size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                    Verified
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.verified}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                    Primary Account
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.primary}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Star size={21} fill="currentColor" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <XCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <RefreshCw
                size={24}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-700">
              Loading your bank accounts...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait while we securely fetch your accounts.
            </p>
          </div>

        ) : accounts.length === 0 ? (

          /* Empty */
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 py-10 text-center sm:px-10">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/10" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
                <Building2 size={30} />
              </div>

              <h2 className="relative mt-5 text-xl font-black text-white">
                No Bank Account Added
              </h2>

              <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-blue-100">
                Add a bank account to receive loan disbursements
                and securely manage your banking details.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/customer/bank-accounts/add")
                }
                className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-700 shadow-lg transition hover:-translate-y-0.5"
              >
                <Plus size={17} />
                Add Bank Account
              </button>
            </div>
          </div>

        ) : (

          /* Accounts */
          <div className="space-y-5">
            {accounts.map((account) => {
              const status = statusInfo(
                account.verificationStatus
              );
              const StatusIcon = status.icon;

              return (
                <div
                  key={account.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                >

                  {/* Top accent */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-500" />

                  <div className="p-5 sm:p-6">

                    {/* Account Header */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      <div className="flex min-w-0 gap-4">

                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 ring-1 ring-blue-100">
                          <Building2
                            size={25}
                            strokeWidth={2.2}
                          />

                          {account.isPrimary && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">
                              <Star
                                size={10}
                                fill="currentColor"
                              />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-base font-black text-slate-900 sm:text-lg">
                              {account.bankName || "Bank Account"}
                            </h2>

                            {account.isPrimary && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700">
                                <Star
                                  size={11}
                                  fill="currentColor"
                                />
                                PRIMARY
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm font-medium text-slate-500">
                            {account.accountHolderName ||
                              "Account Holder"}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <CreditCard
                              size={14}
                              className="text-slate-400"
                            />
                            <span className="font-mono text-sm font-bold tracking-[0.12em] text-slate-800">
                              {maskAccountNumber(
                                account.accountNumber
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 lg:justify-end">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-extrabold ${status.className}`}
                        >
                          <StatusIcon
                            size={13}
                            className={status.iconClass}
                          />
                          {status.label}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            deleteAccount(account.id)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          title="Delete account"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">

                      <div className="rounded-2xl bg-slate-50 p-4 transition group-hover:bg-blue-50/40">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                            <ShieldCheck size={15} />
                          </div>

                          <div>
                            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                              IFSC Code
                            </p>
                            <p className="mt-0.5 font-mono text-sm font-black tracking-wide text-slate-800">
                              {account.ifscCode || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 transition group-hover:bg-blue-50/40">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                            <Landmark size={15} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                              Branch
                            </p>
                            <p className="mt-0.5 truncate text-sm font-black text-slate-800">
                              {account.branchName || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Your banking details are securely managed
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        India Loan Finance
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Add another account */}
            <button
              type="button"
              onClick={() =>
                router.push("/customer/bank-accounts/add")
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-4 text-sm font-extrabold text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus size={17} />
              Add Another Bank Account
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
