"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import {
  CheckCircle2,
  XCircle,
  IndianRupee,
  RefreshCw,
  Search,
  Banknote,
  Clock3,
} from "lucide-react";

type Loan = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  panNo?: string;
  loanType?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
};

const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("loan_finance_token")
    : null;

export default function SuperAdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const loadLoans = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = getToken();

      const response = await api.get("/super-admin/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data;

      setLoans(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.loans)
            ? data.loans
            : []
      );
    } catch (error: any) {
      console.error("Super Admin Loans Error:", error);
      setMessage(
        error?.response?.data?.message ||
          "Unable to load loan applications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const runAction = async (
    loanId: string,
    action: "amount" | "approve" | "reject" | "disburse"
  ) => {
    try {
      setActionId(loanId);
      setMessage("");

      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (action === "amount") {
        const value = Number(amounts[loanId]);

        if (!Number.isFinite(value) || value <= 0) {
          setMessage("Please enter a valid loan amount.");
          return;
        }

        await api.patch(
          `/super-admin/loans/${loanId}/amount`,
          { amount: value },
          config
        );
      }

      if (action === "approve") {
        const value = Number(amounts[loanId]);

        if (!Number.isFinite(value) || value <= 0) {
          setMessage("Please enter a valid loan amount before approving.");
          return;
        }

        await api.patch(
          `/super-admin/loans/${loanId}/approve`,
          { amount: value },
          config
        );
      }

      if (action === "reject") {
        await api.patch(
          `/super-admin/loans/${loanId}/reject`,
          {},
          config
        );
      }

      if (action === "disburse") {
        await api.patch(
          `/super-admin/loans/${loanId}/disburse`,
          {},
          config
        );
      }

      await loadLoans();
    } catch (error: any) {
      console.error("Loan Action Error:", error);
      setMessage(
        error?.response?.data?.message ||
          "Loan action failed."
      );
    } finally {
      setActionId(null);
    }
  };

  const filteredLoans = loans.filter((loan) => {
    const q = search.toLowerCase().trim();

    if (!q) return true;

    return [
      loan.id,
      loan.fullName,
      loan.phone,
      loan.panNo,
      loan.status,
      loan.loanType,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(q)
      );
  });

  const statusClass = (status?: string) => {
    const value = String(status || "").toUpperCase();

    if (value === "APPROVED")
      return "bg-green-100 text-green-700";

    if (value === "REJECTED")
      return "bg-red-100 text-red-700";

    if (value === "DISBURSED")
      return "bg-blue-100 text-blue-700";

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
                Central Loan Control
              </p>

              <h1 className="text-3xl font-black">
                Loan Applications
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Review, approve, reject and disburse customer loan applications.
              </p>
            </div>

            <button
              onClick={loadLoans}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-900 shadow-lg hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700">
            {message}
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, mobile, PAN, loan ID or status..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <RefreshCw
              className="mx-auto mb-3 animate-spin text-blue-600"
              size={30}
            />
            <p className="font-semibold text-slate-600">
              Loading loan applications...
            </p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <Clock3
              className="mx-auto mb-3 text-slate-400"
              size={36}
            />

            <h2 className="text-xl font-bold text-slate-800">
              No loan applications found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New customer applications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredLoans.map((loan) => {
              const status = String(
                loan.status || "PENDING"
              ).toUpperCase();

              const busy = actionId === loan.id;

              return (
                <div
                  key={loan.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <div className="border-b border-slate-100 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-black text-slate-900">
                            {loan.fullName || "Customer"}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Application ID:{" "}
                          <span className="font-semibold text-slate-700">
                            {loan.id}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-5 py-3">
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Current Amount
                        </p>

                        <p className="text-2xl font-black text-slate-900">
                          ?
                          {Number(loan.amount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Mobile
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {loan.phone || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        PAN
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {loan.panNo || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Loan Type
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {loan.loanType || "Personal Loan"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Applied
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {loan.createdAt
                          ? new Date(
                              loan.createdAt
                            ).toLocaleDateString("en-IN")
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {(status === "PENDING" || status === "APPROVED") && (
                    <div className="border-t border-slate-100 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="flex flex-1">
                          <div className="flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-white px-3 text-slate-500">
                            <IndianRupee size={18} />
                          </div>

                          <input
                            type="number"
                            min="1"
                            value={
                              amounts[loan.id] ??
                              (loan.amount
                                ? String(loan.amount)
                                : "")
                            }
                            onChange={(e) =>
                              setAmounts((prev) => ({
                                ...prev,
                                [loan.id]: e.target.value,
                              }))
                            }
                            placeholder="Enter approved loan amount"
                            className="w-full rounded-r-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                          />
                        </div>

                        <button
                          onClick={() =>
                            runAction(loan.id, "amount")
                          }
                          disabled={busy}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                          <Banknote size={18} />
                          Set Amount
                        </button>

                        <button
                          onClick={() =>
                            runAction(loan.id, "approve")
                          }
                          disabled={busy}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                          <CheckCircle2 size={18} />
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            runAction(loan.id, "reject")
                          }
                          disabled={busy}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {status === "APPROVED" && (
                    <div className="border-t border-green-100 bg-green-50 p-5">
                      <button
                        onClick={() =>
                          runAction(loan.id, "disburse")
                        }
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        <Banknote size={18} />
                        Disburse Loan
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


