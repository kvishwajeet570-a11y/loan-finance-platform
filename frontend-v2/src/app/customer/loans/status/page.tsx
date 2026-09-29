"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  FileText,
  IndianRupee,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";
import api from "@/lib/api";

type Loan = {
  id: string;
  loanType?: string;
  amount?: number | string;
  status?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
  rejectionReason?: string;
};

export default function LoanStatusPage() {
  const router = useRouter();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("loan_finance_token");
      const rawUser = localStorage.getItem("loan_finance_user");

      if (!token || !rawUser) {
        router.replace("/login");
        return;
      }

      const user = JSON.parse(rawUser);
      const userId = user?.id;

      if (!userId) {
        setError("Customer information not found.");
        return;
      }

      const response = await api.get(`/user/${userId}/loans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;

      const records =
        data?.data?.loans ??
        data?.loans ??
        data?.data ??
        [];

      setLoans(Array.isArray(records) ? records : []);
    } catch (err: any) {
      console.error("LOAN STATUS ERROR:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load your loan status."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const formatAmount = (value: number | string | undefined) => {
    const amount = Number(value || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const normalizedStatus = (status?: string) =>
    String(status || "PENDING").toUpperCase();

  const getStatusInfo = (status?: string) => {
    switch (normalizedStatus(status)) {
      case "APPROVED":
        return {
          title: "Loan Approved",
          description:
            "Congratulations! Your loan application has been approved.",
          icon: CheckCircle2,
          box: "border-emerald-200 bg-emerald-50",
          iconBox: "bg-emerald-100 text-emerald-600",
          text: "text-emerald-700",
        };

      case "DISBURSED":
        return {
          title: "Loan Disbursed",
          description:
            "Your loan has been approved and disbursement has been completed.",
          icon: CheckCircle2,
          box: "border-emerald-200 bg-emerald-50",
          iconBox: "bg-emerald-100 text-emerald-600",
          text: "text-emerald-700",
        };

      case "REJECTED":
        return {
          title: "Loan Rejected",
          description:
            "Your loan application has been rejected.",
          icon: XCircle,
          box: "border-red-200 bg-red-50",
          iconBox: "bg-red-100 text-red-600",
          text: "text-red-700",
        };

      case "UNDER_REVIEW":
        return {
          title: "Under Review",
          description:
            "Your application is currently being reviewed by our team.",
          icon: Clock3,
          box: "border-blue-200 bg-blue-50",
          iconBox: "bg-blue-100 text-blue-600",
          text: "text-blue-700",
        };

      default:
        return {
          title: "Application Pending",
          description:
            "Your loan application has been received and is waiting for processing.",
          icon: Clock3,
          box: "border-amber-200 bg-amber-50",
          iconBox: "bg-amber-100 text-amber-600",
          text: "text-amber-700",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              Customer Panel
            </div>

            <h1 className="text-2xl font-black text-[#06295c]">
              Loan Status
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track the latest status of your loan applications.
            </p>
          </div>

          <button
            type="button"
            onClick={loadStatus}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Status
          </button>
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/customer/loans")}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to My Loans
        </button>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <RefreshCw
              size={30}
              className="mx-auto mb-3 animate-spin text-blue-600"
            />

            <p className="text-sm font-semibold text-slate-500">
              Loading your loan status...
            </p>
          </div>
        ) : loans.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText size={30} />
            </div>

            <h2 className="text-lg font-black text-slate-800">
              No Loan Application Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You have not submitted any loan application yet.
            </p>

            <button
              type="button"
              onClick={() => router.push("/apply")}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Apply for a Loan
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {loans.map((loan) => {
              const info = getStatusInfo(loan.status);
              const StatusIcon = info.icon;

              return (
                <div
                  key={loan.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Status Banner */}
                  <div className={`border-b p-5 ${info.box}`}>
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${info.iconBox}`}
                      >
                        <StatusIcon size={26} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className={`text-lg font-black ${info.text}`}>
                            {info.title}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${info.text}`}
                          >
                            {normalizedStatus(loan.status)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="mb-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Application ID
                      </p>

                      <p className="mt-1 break-all font-black text-slate-800">
                        #{loan.id}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <FileText size={14} />
                          Loan Type
                        </div>

                        <p className="mt-2 text-sm font-black text-slate-800">
                          {loan.loanType || "Personal Loan"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <IndianRupee size={14} />
                          Loan Amount
                        </div>

                        <p className="mt-2 text-sm font-black text-slate-800">
                          {formatAmount(loan.amount)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <CalendarDays size={14} />
                          Applied On
                        </div>

                        <p className="mt-2 text-sm font-black text-slate-800">
                          {formatDate(loan.createdAt)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <RefreshCw size={14} />
                          Last Updated
                        </div>

                        <p className="mt-2 text-sm font-black text-slate-800">
                          {formatDate(loan.updatedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {normalizedStatus(loan.status) === "REJECTED" &&
                      loan.rejectionReason && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                          <p className="text-xs font-black uppercase tracking-wider text-red-500">
                            Rejection Reason
                          </p>

                          <p className="mt-1 text-sm font-semibold text-red-700">
                            {loan.rejectionReason}
                          </p>
                        </div>
                      )}

                    {/* Timeline */}
                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <p className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">
                        Application Progress
                      </p>

                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2 size={17} />
                          </div>

                          <span className="text-xs font-bold text-slate-700">
                            Applied
                          </span>
                        </div>

                        <div className="mx-2 h-px flex-1 bg-slate-200" />

                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              normalizedStatus(loan.status) !== "PENDING"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <Clock3 size={17} />
                          </div>

                          <span className="text-xs font-bold text-slate-700">
                            Processing
                          </span>
                        </div>

                        <div className="mx-2 h-px flex-1 bg-slate-200" />

                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              ["APPROVED", "DISBURSED"].includes(
                                normalizedStatus(loan.status)
                              )
                                ? "bg-emerald-100 text-emerald-600"
                                : normalizedStatus(loan.status) === "REJECTED"
                                ? "bg-red-100 text-red-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {normalizedStatus(loan.status) === "REJECTED" ? (
                              <XCircle size={17} />
                            ) : (
                              <CheckCircle2 size={17} />
                            )}
                          </div>

                          <span className="text-xs font-bold text-slate-700">
                            Decision
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}