"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  IndianRupee,
  RefreshCw,
  Search,
} from "lucide-react";
import api from "@/lib/api";

type Loan = {
  id: string;
  loanType?: string;
  amount?: number | string;
  status?: string;
  fullName?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function CustomerLoansPage() {
  const router = useRouter();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadLoans = async () => {
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

      const response = await api.get(
        `/user/${userId}/loans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;

      const records =
        data?.data?.loans ??
        data?.loans ??
        data?.data ??
        [];

      setLoans(Array.isArray(records) ? records : []);
    } catch (err: any) {
      console.error("CUSTOMER LOANS ERROR:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load your loans."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    const text = [
      loan.id,
      loan.loanType,
      loan.status,
      loan.fullName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

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

  const statusClass = (status?: string) => {
    switch (String(status || "").toUpperCase()) {
      case "APPROVED":
      case "DISBURSED":
        return "bg-emerald-50 text-emerald-700";

      case "REJECTED":
        return "bg-red-50 text-red-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      case "UNDER_REVIEW":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              Customer Panel
            </div>

            <h1 className="text-2xl font-black text-[#06295c]">
              My Loans
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View your actual loan applications and their current status.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadLoans}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/apply"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700"
            >
              Apply Loan
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
          <Search size={17} className="text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search loan ID, loan type or status..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

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
              size={28}
              className="mx-auto mb-3 animate-spin text-blue-600"
            />

            <p className="text-sm font-semibold text-slate-500">
              Loading your real loan data...
            </p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CreditCard size={30} />
            </div>

            <h2 className="text-lg font-black text-slate-800">
              No loan applications found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              There are currently no loan records available for your
              customer account.
            </p>

            <Link
              href="/apply"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Apply for a Loan
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-black text-[#06295c]">
                Loan Applications
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredLoans.length} record
                {filteredLoans.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                    <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Loan
                    </th>

                    <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Type
                    </th>

                    <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Applied
                    </th>

                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">
                          #{loan.id}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {loan.loanType || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-sm font-black text-slate-800">
                          <IndianRupee size={14} />
                          {formatAmount(loan.amount).replace("₹", "")}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${statusClass(
                            loan.status
                          )}`}
                        >
                          {loan.status || "UNKNOWN"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(loan.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/customer/loans/${loan.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                        >
                          Details
                          <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredLoans.map((loan) => (
                <div key={loan.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-slate-800">
                        #{loan.id}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {loan.loanType || "Loan"}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(
                        loan.status
                      )}`}
                    >
                      {loan.status || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase text-slate-400">
                        Amount
                      </div>

                      <div className="mt-1 text-lg font-black text-slate-800">
                        {formatAmount(loan.amount)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-semibold uppercase text-slate-400">
                        Applied
                      </div>

                      <div className="mt-1 text-xs font-bold text-slate-600">
                        {formatDate(loan.createdAt)}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/customer/loans/${loan.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700"
                  >
                    View Loan Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
