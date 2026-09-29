"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Loan = {
  id: string;
  fullName?: string;
  email?: string | null;
  phone?: string;
  panNo?: string | null;
  loanType?: string;
  amount?: number;
  interestRate?: number | null;
  tenureMonths?: number | null;
  monthlyEMI?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  purpose?: string | null;
};

export default function LoanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLoan = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        const response = await api.get(`/loan/${id}`, {
          withCredentials: true,
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        const data = response.data?.data ?? response.data;

        setLoan(data);
      } catch (err: any) {
        console.error("Loan details error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load loan application details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadLoan();
    }
  }, [id]);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return value;
    }
  };

  const formatAmount = (value?: number | null) => {
    if (!value || value <= 0) return "Not Set";

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const status = String(loan?.status || "PENDING").toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-slate-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">⚠️</div>

          <h1 className="text-xl font-bold text-slate-900">
            Unable to Load Application
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            {error || "Loan application not found."}
          </p>

          <Link
            href="/customer/loans"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ← Back to My Loans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/customer/loans"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to My Loans
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-7 text-white sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Loan Application
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {loan.loanType || "Personal Loan"}
                </h1>

                <p className="mt-2 text-sm text-blue-100">
                  Application ID: {loan.id}
                </p>
              </div>

              <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                {status}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <section>
              <h2 className="text-lg font-bold text-slate-900">
                Customer Information
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Info label="Customer Name" value={loan.fullName || "—"} />
                <Info label="Mobile Number" value={loan.phone || "—"} />
                <Info label="PAN Number" value={loan.panNo || "—"} />
                <Info label="Email" value={loan.email || "—"} />
              </div>
            </section>

            <div className="my-8 border-t border-slate-200" />

            <section>
              <h2 className="text-lg font-bold text-slate-900">
                Loan Information
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Loan Type"
                  value={loan.loanType || "Personal Loan"}
                />

                <Info
                  label="Loan Amount"
                  value={formatAmount(loan.amount)}
                  highlight
                />

                <Info
                  label="Interest Rate"
                  value={
                    loan.interestRate != null
                      ? `${loan.interestRate}%`
                      : "Not Set"
                  }
                />

                <Info
                  label="Tenure"
                  value={
                    loan.tenureMonths
                      ? `${loan.tenureMonths} months`
                      : "Not Set"
                  }
                />

                <Info
                  label="Monthly EMI"
                  value={formatAmount(loan.monthlyEMI)}
                  highlight
                />

                <Info
                  label="Status"
                  value={status}
                />
              </div>
            </section>

            <div className="my-8 border-t border-slate-200" />

            <section>
              <h2 className="text-lg font-bold text-slate-900">
                Application Timeline
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Info
                  label="Applied On"
                  value={formatDate(loan.createdAt)}
                />

                <Info
                  label="Last Updated"
                  value={formatDate(loan.updatedAt)}
                />

                <Info
                  label="Approved On"
                  value={formatDate(loan.approvedAt)}
                />
              </div>
            </section>

            {loan.purpose && (
              <>
                <div className="my-8 border-t border-slate-200" />

                <section>
                  <h2 className="text-lg font-bold text-slate-900">
                    Purpose
                  </h2>

                  <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    {loan.purpose}
                  </p>
                </section>
              </>
            )}

            {loan.rejectionReason && (
              <>
                <div className="my-8 border-t border-slate-200" />

                <section>
                  <h2 className="text-lg font-bold text-red-700">
                    Rejection Reason
                  </h2>

                  <p className="mt-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    {loan.rejectionReason}
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm font-semibold ${
          highlight ? "text-blue-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}