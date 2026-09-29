"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Loan = {
  id: string;
  fullName: string;
  phone: string;
  panNo?: string | null;
  loanType: string;
  amount: number;
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const loadLoans = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await api.get("/admin/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data || [];

      setLoans(data);

      const amountMap: Record<string, string> = {};

      data.forEach((loan: Loan) => {
        amountMap[loan.id] =
          loan.amount && loan.amount > 0
            ? String(loan.amount)
            : "";
      });

      setAmounts(amountMap);
    } catch (err: any) {
      console.error("ADMIN LOANS ERROR =>", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load loan applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const updateAmount = async (loanId: string) => {
    try {
      setActionLoading(loanId);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");
      const amount = Number(amounts[loanId]);

      if (!Number.isFinite(amount) || amount <= 0) {
        setError("Please enter a valid loan amount.");
        return;
      }

      await api.patch(
        `/admin/loans/${loanId}/amount`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Loan amount updated successfully.");
      await loadLoans();
    } catch (err: any) {
      console.error("UPDATE AMOUNT ERROR =>", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update loan amount."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const approveLoan = async (loanId: string) => {
    try {
      setActionLoading(loanId);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");
      const amountText = amounts[loanId];

      const amount =
        amountText && amountText.trim() !== ""
          ? Number(amountText)
          : undefined;

      if (
        amount !== undefined &&
        (!Number.isFinite(amount) || amount <= 0)
      ) {
        setError("Please enter a valid loan amount.");
        return;
      }

      await api.patch(
        `/admin/loans/${loanId}/approve`,
        amount !== undefined ? { amount } : {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Loan approved successfully.");
      await loadLoans();
    } catch (err: any) {
      console.error("APPROVE LOAN ERROR =>", err);

      setError(
        err?.response?.data?.message ||
          "Failed to approve loan."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const rejectLoan = async (loanId: string) => {
    try {
      setActionLoading(loanId);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      await api.patch(
        `/admin/loans/${loanId}/reject`,
        {
          rejectionReason:
            reasons[loanId]?.trim() || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Loan rejected successfully.");
      await loadLoans();
    } catch (err: any) {
      console.error("REJECT LOAN ERROR =>", err);

      setError(
        err?.response?.data?.message ||
          "Failed to reject loan."
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">
            Loading Admin Loans...
          </div>
          <div className="text-slate-400 mt-2">
            Please wait
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-blue-400 font-semibold uppercase tracking-wider">
              Admin Panel
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-1">
              Loan Applications
            </h1>

            <p className="text-slate-400 mt-2">
              Review, update amount, approve or reject customer applications.
            </p>
          </div>

          <button
            onClick={loadLoans}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
          >
            Refresh Loans
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {loans.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No loan applications found
            </h2>

            <p className="text-slate-400 mt-2">
              New customer applications will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">

            {loans.map((loan) => {
              const busy = actionLoading === loan.id;

              return (
                <div
                  key={loan.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold">
                          {loan.fullName}
                        </h2>

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold">
                          {loan.status}
                        </span>
                      </div>

                      <p className="text-slate-400 mt-2">
                        Application ID:{" "}
                        <span className="text-slate-200">
                          {loan.id}
                        </span>
                      </p>

                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                        <p>
                          <span className="text-slate-500">
                            Mobile:
                          </span>{" "}
                          {loan.phone}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            PAN:
                          </span>{" "}
                          {loan.panNo || "Not provided"}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            Loan Type:
                          </span>{" "}
                          {loan.loanType}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            Applied:
                          </span>{" "}
                          {new Date(
                            loan.createdAt
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="lg:text-right">
                      <p className="text-sm text-slate-500">
                        Current Amount
                      </p>

                      <p className="text-2xl font-bold text-white">
                        ₹
                        {Number(
                          loan.amount || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 mt-6 pt-6">

                    <div className="grid lg:grid-cols-[1fr_auto] gap-4">

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Loan Amount
                        </label>

                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={amounts[loan.id] || ""}
                          onChange={(e) =>
                            setAmounts((prev) => ({
                              ...prev,
                              [loan.id]:
                                e.target.value,
                            }))
                          }
                          placeholder="Enter approved amount"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          disabled={busy}
                          onClick={() =>
                            updateAmount(loan.id)
                          }
                          className="w-full lg:w-auto px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 font-semibold"
                        >
                          {busy
                            ? "Processing..."
                            : "Update Amount"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Rejection Reason
                      </label>

                      <textarea
                        rows={2}
                        value={reasons[loan.id] || ""}
                        onChange={(e) =>
                          setReasons((prev) => ({
                            ...prev,
                            [loan.id]:
                              e.target.value,
                          }))
                        }
                        placeholder="Optional rejection reason"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-5">

                      <button
                        disabled={
                          busy ||
                          loan.status === "APPROVED"
                        }
                        onClick={() =>
                          approveLoan(loan.id)
                        }
                        className="flex-1 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 font-bold transition"
                      >
                        Approve Loan
                      </button>

                      <button
                        disabled={
                          busy ||
                          loan.status === "REJECTED"
                        }
                        onClick={() =>
                          rejectLoan(loan.id)
                        }
                        className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 font-bold transition"
                      >
                        Reject Loan
                      </button>

                    </div>

                    {loan.rejectionReason && (
                      <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                        <p className="text-xs text-red-400 font-semibold">
                          Rejection Reason
                        </p>

                        <p className="text-sm text-red-200 mt-1">
                          {loan.rejectionReason}
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </main>
  );
}
