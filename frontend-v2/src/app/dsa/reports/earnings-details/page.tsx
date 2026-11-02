"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function money(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number)
    ? `₹${number.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
    : "—";
}

function Metric({
  title,
  value,
  detail,
  accent,
}: {
  title: string;
  value: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 h-1.5 w-12 rounded-full ${accent}`} />
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 break-words text-2xl font-black tracking-tight text-[#102347]">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

export default function EarningsDetailsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const token = localStorage.getItem("loan_finance_token");
        if (!token) throw new Error("Login session nahi mila. Dobara login karein.");

        const response = await fetch(`${API_URL}/reports/dsa`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Earnings report load nahi ho saki.");
        }

        if (active) {
          setData(result.data ?? {});
          setError("");
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Earnings report load nahi ho saki.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(() => {
    const trend = Array.isArray(data?.commissionTrend) ? data.commissionTrend : [];
    const now = new Date();

    return trend
      .map((item: any, index: number) => ({
        id: `${item.month ?? "month"}-${index}`,
        month: String(item.month ?? "—"),
        commission: Number(item.commission ?? 0),
        raw: item,
      }))
      .filter((item: any) => {
        if (!Number.isFinite(item.commission)) return false;

        if (period !== "all") {
          const count = Number(period);
          if (Number.isFinite(count) && count > 0) {
            const monthIndex = new Date(now.getFullYear(), now.getMonth() - count + 1, 1);
            const dateMatch = new Date(`${item.month} 1, ${now.getFullYear()}`);
            if (
              Number.isNaN(dateMatch.getTime()) ||
              dateMatch < monthIndex ||
              dateMatch > now
            ) {
              return false;
            }
          }
        }

        return item.month.toLowerCase().includes(search.toLowerCase());
      })
      .reverse();
  }, [data, period, search]);

  const exportCsv = () => {
    const escapeCsv = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      ["Month", "Commission"],
      ...rows.map((row: any) => [row.month, row.commission]),
    ]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dsa-earnings-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const totalTrend = rows.reduce(
    (sum: number, row: any) => sum + (Number(row.commission) || 0),
    0
  );
  const maxCommission = Math.max(1, ...rows.map((row: any) => row.commission));

  return (
    <div className="min-h-screen bg-[#f3f7fd] text-[#102347]">

      <main className="min-w-0 ">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              DSA Reports / Earnings
            </p>
            <h1 className="mt-1 text-xl font-black sm:text-2xl">Earnings & Commission</h1>
            <p className="mt-1 text-sm text-slate-500">
              Your available earnings, wallet and monthly commission overview
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/dsa/reports")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
          >
            ← Back to Reports
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-7">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <p className="mt-4 text-sm font-semibold text-slate-500">Earnings data load ho raha hai...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-white p-6">
              <h2 className="text-lg font-black text-rose-700">Report load nahi hui</h2>
              <p className="mt-2 text-sm text-slate-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#102347] via-blue-800 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-blue-100">EARNINGS OVERVIEW</p>
                    <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                      {money(data?.summary?.totalEarnings)}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                      Total earnings value reported by your DSA dashboard API.
                      This figure is not recalculated from the monthly trend.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <p className="text-xs font-semibold text-blue-100">WALLET BALANCE</p>
                    <p className="mt-2 text-2xl font-black">{money(data?.wallet?.balance)}</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Metric
                  title="Total Earnings"
                  value={money(data?.summary?.totalEarnings)}
                  detail="Reported dashboard total"
                  accent="bg-blue-600"
                />
                <Metric
                  title="Wallet Balance"
                  value={money(data?.wallet?.balance)}
                  detail="Current balance from API"
                  accent="bg-emerald-500"
                />
                <Metric
                  title="Monthly Target"
                  value={money(data?.monthlyTarget ?? data?.targetAmount)}
                  detail="Target configured by the backend"
                  accent="bg-violet-500"
                />
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black">Monthly Commission</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Values supplied by the commission trend API
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700">Visible trend total</p>
                    <p className="mt-1 text-lg font-black text-blue-900">{money(totalTrend)}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {rows.length === 0 ? (
                    <p className="col-span-full rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                      Is filter ke liye commission trend data available nahi hai.
                    </p>
                  ) : (
                    rows.map((row: any) => (
                      <div key={row.id} className="rounded-xl border border-slate-100 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold">{row.month}</p>
                          <p className="text-sm font-black text-emerald-700">
                            {money(row.commission)}
                          </p>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                            style={{
                              width: `${Math.max(0, Math.min(100, (row.commission / maxCommission) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-7">
                  <div>
                    <h2 className="text-lg font-black">Earnings Records</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Monthly commission entries returned by the API
                    </p>
                  </div>
                  <button
                    onClick={exportCsv}
                    disabled={rows.length === 0}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ↓ Export CSV
                  </button>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-[1fr_200px] sm:p-7">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search month..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="all">All available months</option>
                    <option value="3">Last 3 months</option>
                    <option value="6">Last 6 months</option>
                    <option value="12">Last 12 months</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-bold">Period</th>
                        <th className="px-5 py-4 font-bold">Commission</th>
                        <th className="px-5 py-4 font-bold">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row: any) => (
                        <tr key={row.id} className="border-t border-slate-100">
                          <td className="px-5 py-4 font-bold">{row.month}</td>
                          <td className="px-5 py-4 font-black text-emerald-700">
                            {money(row.commission)}
                          </td>
                          <td className="px-5 py-4 text-slate-500">Commission trend API</td>
                        </tr>
                      ))}
                      {rows.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-5 py-10 text-center text-slate-500">
                            No matching earnings records.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-slate-100 px-5 py-4 text-xs leading-5 text-slate-500">
                  Note: The available API provides monthly commission summaries, not necessarily
                  individual transaction-level payout records. No payout dates, lender names,
                  payment references or settlement statuses are fabricated here.
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Showing {rows.length} available monthly entries.</p>
                <button
                  onClick={() => (window.location.href = "/dsa/reports")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
                >
                  Finish · Back to Reports
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

