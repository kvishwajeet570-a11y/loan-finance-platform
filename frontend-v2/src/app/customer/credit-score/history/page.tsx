"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type ScoreRecord = {
  id?: string;
  score?: number;
  createdAt?: string;
  monthlyIncome?: number;
  existingEMI?: number;
  loanDefaults?: number;
  creditCardUtilization?: number;
  creditHistoryYears?: number;
};

type HistoryResponse = {
  success?: boolean;
  total?: number;
  data?: ScoreRecord[];
  message?: string;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function CreditHistoryPage() {
  const [records, setRecords] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshed, setRefreshed] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("loan_finance_token");
      if (!token) throw new Error("Please log in to view your credit history.");

      const response = await fetch(`${API_BASE}/credit-score/my-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const result: HistoryResponse = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || `Request failed (${response.status}).`);
      }

      const rows = Array.isArray(result.data) ? result.data : [];
      setRecords(
        [...rows].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
      );
      setRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const latest = records[0];
  const previous = records[1];
  const change =
    typeof latest?.score === "number" &&
    typeof previous?.score === "number"
      ? latest.score - previous.score
      : null;

  const date = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const score = latest?.score;
  const progress = Math.max(
    0,
    Math.min(100, (((score ?? 300) - 300) / 600) * 100)
  );

  return (
    <main className="min-h-screen bg-[#f2f6fc] px-4 py-6 text-[#142343] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Customer Portal <span className="text-slate-300">/</span> Credit Score
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#142343]">
              Credit History
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View your saved credit score records and previous checks.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => void loadHistory()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50"
            >
              ↻ {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link
              href="/customer/credit-score"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
              ▥ Check Score
            </Link>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold">Unable to load credit history</p>
            <p className="mt-1">{error}</p>
            <button
              className="mt-2 font-semibold underline"
              onClick={() => void loadHistory()}
            >
              Try again
            </button>
          </div>
        )}

        <section className="grid gap-5 lg:grid-cols-[1.05fr_1.95fr]">

          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm">
            <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-slate-700">Latest Credit Score</p>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                ● Latest record
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div
                className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#f59e0b ${progress}%, #e3eaf5 ${progress}% 100%)`,
                }}
              >
                <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-4xl font-extrabold tracking-tight text-[#142343]">
                    {loading ? "—" : score ?? "—"}
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Score
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="text-blue-600">▦</span> Last checked
                </p>
                <p className="mt-2 text-sm font-bold text-[#142343]">
                  {latest ? date(latest.createdAt) : "No saved record"}
                </p>
                <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                  Score indicator uses a 300–900 visual scale.
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-blue-100 pt-4">
              <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
                <span>Score scale</span>
                <span>300–900</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>300</span><span>600</span><span>900</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-6 shadow-sm">
              <div className="absolute right-4 top-4 text-5xl font-black text-violet-100">▤</div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-700">
                ▤
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-500">Total History Records</p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-[#142343]">
                {loading ? "—" : records.length}
              </p>
              <p className="mt-3 text-xs text-slate-500">Records saved for your account</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
              <div className="absolute right-4 top-4 text-5xl font-black text-emerald-100">↗</div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-700">
                ↗
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-500">Change vs Previous Record</p>
              <p className={`mt-2 text-4xl font-extrabold tracking-tight ${
                change === null ? "text-slate-400" :
                change > 0 ? "text-emerald-700" :
                change < 0 ? "text-rose-600" : "text-[#142343]"
              }`}>
                {loading ? "—" : change === null ? "—" : `${change > 0 ? "+" : ""}${change}`}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {change === null ? "Two records needed for comparison" : "Points since previous record"}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm sm:col-span-2">
              <div className="flex items-center gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                  ▣
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#142343]">Latest Record Details</h2>
                  <p className="mt-1 text-xs text-slate-500">Financial information from your saved record.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="flex items-center gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-700">₹</span>
                  <div>
                    <p className="text-xs text-slate-500">Monthly Income</p>
                    <p className="mt-1 text-lg font-bold text-[#142343]">
                      {typeof latest?.monthlyIncome === "number" ? `₹${latest.monthlyIncome.toLocaleString("en-IN")}` : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg text-violet-700">▰</span>
                  <div>
                    <p className="text-xs text-slate-500">Existing EMI</p>
                    <p className="mt-1 text-lg font-bold text-[#142343]">
                      {typeof latest?.existingEMI === "number" ? `₹${latest.existingEMI.toLocaleString("en-IN")}` : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-lg text-rose-700">!</span>
                  <div>
                    <p className="text-xs text-slate-500">Loan Defaults</p>
                    <p className="mt-1 text-lg font-bold text-[#142343]">
                      {latest?.loanDefaults ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-white to-blue-50/70 px-5 py-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-sm">
                ▤
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#142343]">Score History Records</h2>
                <p className="mt-1 text-sm text-slate-500">A chronological view of your saved score checks.</p>
              </div>
            </div>
            <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              {loading ? "Loading..." : `${records.length} record${records.length === 1 ? "" : "s"}`}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3 p-6">
              <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-12 animate-pulse rounded-lg bg-slate-50" />
            </div>
          ) : records.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">◷</div>
              <h3 className="mt-4 font-bold text-slate-800">No history records found</h3>
              <p className="mt-2 text-sm text-slate-500">No saved records were returned for this account.</p>
              <Link href="/customer/credit-score" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
                Go to Credit Score
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-[#f2f6fd] text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-bold">No.</th>
                    <th className="px-5 py-4 font-bold">Credit Score</th>
                    <th className="px-5 py-4 font-bold">Date Checked</th>
                    <th className="px-5 py-4 font-bold">Monthly Income</th>
                    <th className="px-5 py-4 font-bold">Existing EMI</th>
                    <th className="px-5 py-4 font-bold">Defaults</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((record, index) => (
                    <tr key={record.id || `${record.createdAt}-${index}`} className="transition-colors hover:bg-blue-50/60">
                      <td className="px-5 py-4 text-slate-400">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 font-extrabold text-amber-700">
                          {record.score ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">{date(record.createdAt)}</td>
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {typeof record.monthlyIncome === "number" ? `₹${record.monthlyIncome.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {typeof record.existingEMI === "number" ? `₹${record.existingEMI.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex min-w-8 justify-center rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                          {record.loanDefaults ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 text-xs text-slate-400 sm:flex-row">
            <span>India Loan Finance · Customer Credit History</span>
            <span>{refreshed ? `Last refreshed ${refreshed}` : "History data"}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
