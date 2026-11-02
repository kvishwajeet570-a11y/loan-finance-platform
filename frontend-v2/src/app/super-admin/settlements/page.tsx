"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

type Payout = {
  id?: string | number;
  _id?: string;
  fullName?: string;
  name?: string;
  dsaName?: string;
  amount?: number | string;
  status?: string;
  isApproved?: boolean;
  isTestData?: boolean;
  remark?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
  utr?: string;
  transactionId?: string;
  referenceId?: string;
};

type SettlementStatus =
  | "AWAITING"
  | "PROCESSING"
  | "SETTLED"
  | "FAILED"
  | "ON_HOLD";

function getStatus(item: Payout): SettlementStatus {
  const status = String(item.status || "").toUpperCase();

  if (["SUCCESS", "PAID", "COMPLETED", "SETTLED"].includes(status))
    return "SETTLED";
  if (["PROCESSING", "IN_PROGRESS"].includes(status))
    return "PROCESSING";
  if (["FAILED", "FAILURE", "REJECTED", "CANCELLED", "CANCELED"].includes(status))
    return "FAILED";
  if (["ON_HOLD", "HOLD"].includes(status))
    return "ON_HOLD";

  return "AWAITING";
}

const statusLabels: Record<SettlementStatus, string> = {
  AWAITING: "Awaiting Settlement",
  PROCESSING: "Processing",
  SETTLED: "Settled",
  FAILED: "Failed",
  ON_HOLD: "On Hold",
};

const statusStyles: Record<SettlementStatus, string> = {
  AWAITING: "bg-gradient-to-r from-yellow-500/25 to-amber-400/10 text-yellow-200 border-yellow-400/60 shadow-[0_0_12px_rgba(255,190,0,0.18)]",
  PROCESSING: "bg-gradient-to-r from-blue-600/30 to-cyan-400/10 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(0,180,255,0.2)]",
  SETTLED: "bg-gradient-to-r from-emerald-500/25 to-green-400/10 text-green-200 border-green-400/60 shadow-[0_0_12px_rgba(0,255,130,0.2)]",
  FAILED: "bg-gradient-to-r from-pink-600/25 to-red-500/10 text-pink-200 border-pink-400/60 shadow-[0_0_12px_rgba(255,50,120,0.2)]",
  ON_HOLD: "bg-gradient-to-r from-purple-600/25 to-violet-500/10 text-purple-200 border-purple-400/60",
};

function money(value: unknown) {
  const amount = Number(value || 0);
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function dateText(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-IN");
}

export default function SettlementsPage() {
  const [rows, setRows] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Payout | null>(null);

  const loadSettlements = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/super-admin/payouts");
      const payload = response?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.payouts)
            ? payload.payouts
            : Array.isArray(payload?.data?.payouts)
              ? payload.data.payouts
              : [];

      setRows(list);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load settlement records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettlements();
  }, [loadSettlements]);

  const stats = useMemo(() => {
    const result = {
      total: 0,
      awaiting: 0,
      processing: 0,
      settled: 0,
      failed: 0,
      onHold: 0,
      settledAmount: 0,
    };

    rows.forEach((item) => {
      result.total++;
      const status = getStatus(item);

      if (status === "AWAITING") result.awaiting++;
      if (status === "PROCESSING") result.processing++;
      if (status === "SETTLED") {
        result.settled++;
        result.settledAmount += Number(item.amount || 0);
      }
      if (status === "FAILED") result.failed++;
      if (status === "ON_HOLD") result.onHold++;
    });

    return result;
  }, [rows]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((item) => {
      const status = getStatus(item);
      const matchesFilter = filter === "ALL" || status === filter;
      const searchable = [
        item.id,
        item._id,
        item.fullName,
        item.name,
        item.dsaName,
        item.utr,
        item.transactionId,
        item.referenceId,
        item.status,
      ].join(" ").toLowerCase();

      return matchesFilter && (!term || searchable.includes(term));
    });
  }, [rows, search, filter]);

  function exportCSV() {
    const headers = [
      "Payout ID",
      "Beneficiary",
      "Amount",
      "Original Status",
      "Settlement Status",
      "Reference / UTR",
      "Created At",
      "Test Record",
    ];

    const escapeCSV = (value: unknown) =>
      '"' + String(value ?? "").replace(/"/g, '""') + '"';

    const lines = filteredRows.map((item) => [
      item.id || item._id,
      item.fullName || item.name || item.dsaName,
      item.amount,
      item.status,
      statusLabels[getStatus(item)],
      item.utr || item.transactionId || item.referenceId,
      item.createdAt,
      item.isTestData || String(item.remark || item.remarks || "").startsWith("TEST_PAYOUT_")
        ? "YES"
        : "NO",
    ].map(escapeCSV).join(","));

    const csv = [headers.map(escapeCSV).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `settlements-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { label: "Total Records", value: stats.total, color: "text-white", icon: "layers" },
    { label: "Awaiting Settlement", value: stats.awaiting, color: "text-amber-300", icon: "clock" },
    { label: "Processing", value: stats.processing, color: "text-blue-300", icon: "refresh-cw" },
    { label: "Successfully Settled", value: stats.settled, color: "text-emerald-300", icon: "check-circle" },
    { label: "Failed / On Hold", value: stats.failed + stats.onHold, color: "text-red-300", icon: "x-circle" },
  ];

  return (
    <main className="settlement-premium min-h-screen bg-[radial-gradient(ellipse_at_top_right,rgba(0,105,255,0.16),transparent_38%),radial-gradient(ellipse_at_bottom_left,rgba(0,220,255,0.08),transparent_35%),linear-gradient(135deg,#030b19,#06152b_55%,#07152b)] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Super Admin / Finance
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,180,255,0.25)]">
              Settlement Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track payout approvals, settlement progress and payment confirmations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadSettlements}
              className="rounded-xl border border-[#234365] bg-slate-900 px-4 py-2.5 text-sm font-semibold hover:border-cyan-500"
            >
              ↻ Refresh
            </button>
            <button
              onClick={exportCSV}
              disabled={!filteredRows.length}
              className="rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↓ Export CSV
            </button>
          </div>
        </div>

        <section className="settlement-kpis grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-blue-400/40 bg-[#0b1d36] p-5 shadow-lg"
            >
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white/85">{card.label}</p>
                  <p className={`mt-3 text-3xl font-black ${card.color}`}>
                    {card.value.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-[0_0_22px_rgba(255,255,255,0.16)] backdrop-blur-md">
                  {card.icon === "layers" ? <svg viewBox="0 0 24 24" className="h-8 w-8 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg> : card.icon === "clock" ? <svg viewBox="0 0 24 24" className="h-8 w-8 text-yellow-200" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> : card.icon === "refresh-cw" ? <svg viewBox="0 0 24 24" className="h-8 w-8 text-purple-200" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/></svg> : card.icon === "check-circle" ? <svg viewBox="0 0 24 24" className="h-8 w-8 text-green-200" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg> : <svg viewBox="0 0 24 24" className="h-8 w-8 text-pink-200" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></svg>}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="settlement-overview rounded-2xl border border-blue-400/40 bg-[#0b1d36] p-5">
          <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold">Settlement Overview</h2>
              <p className="mt-1 text-xs text-slate-400">
                Settled amount is calculated only from paid/completed statuses.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-400/60 bg-gradient-to-br from-emerald-500/25 via-green-500/10 to-yellow-400/10 shadow-[0_0_25px_rgba(0,255,140,0.18)] px-4 py-3">
              <p className="text-xs text-emerald-300">Confirmed Settled Amount</p>
              <p className="mt-1 text-xl font-bold text-emerald-200">
                {money(stats.settledAmount)}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(statusLabels) as SettlementStatus[]).map((status) => {
              const count = rows.filter((item) => getStatus(item) === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(filter === status ? "ALL" : status)}
                  className={`rounded-xl border p-4 text-left transition ${
                    filter === status
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-blue-400/40 bg-[#091a32] hover:border-cyan-500"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-white/80">{statusLabels[status]}</p>
                      <p className="mt-2 text-2xl font-black text-white">{count}</p>
                    </div>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white/10 shadow-lg backdrop-blur-md ${
                      status === "AWAITING" ? "border-yellow-300/50 shadow-yellow-400/20" :
                      status === "PROCESSING" ? "border-purple-300/50 shadow-purple-400/20" :
                      status === "SETTLED" ? "border-green-300/50 shadow-green-400/20" :
                      status === "FAILED" ? "border-pink-300/50 shadow-pink-400/20" :
                      "border-cyan-300/50 shadow-cyan-400/20"
                    }`}>
                      {status === "AWAITING" ? (
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
                        </svg>
                      ) : status === "PROCESSING" ? (
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/>
                        </svg>
                      ) : status === "SETTLED" ? (
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-green-300" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>
                        </svg>
                      ) : status === "FAILED" ? (
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-pink-300" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9"/><path d="M10 9v6m4-6v6"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="settlement-records overflow-hidden rounded-2xl border border-blue-400/40 bg-[#0b1d36]">
          <div className="flex flex-col gap-3 border-b border-blue-400/40 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Settlement Records</h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredRows.length} record(s) found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, DSA, UTR..."
                className="min-w-0 rounded-xl border border-[#234365] bg-[radial-gradient(ellipse_at_top,#102e70_0%,#06152b_48%,#020817_100%)] px-4 py-2.5 text-sm outline-none focus:border-cyan-500 sm:w-64"
              />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-xl border border-[#234365] bg-[radial-gradient(ellipse_at_top,#102e70_0%,#06152b_48%,#020817_100%)] px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Statuses</option>
                {(Object.keys(statusLabels) as SettlementStatus[]).map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="m-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading settlement records...</div>
          ) : filteredRows.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg font-semibold text-slate-300">No settlement records found</p>
              <p className="mt-2 text-sm text-slate-500">
                Try changing the search text or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-[#071a33] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Payout / Reference</th>
                    <th className="px-5 py-4">Beneficiary / DSA</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Settlement Status</th>
                    <th className="px-5 py-4">Created At</th>
                    <th className="px-5 py-4">Record Type</th>
                    <th className="px-5 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredRows.map((item, index) => {
                    const status = getStatus(item);
                    const isTest =
                      Boolean(item.isTestData) ||
                      String(item.remark || item.remarks || "").startsWith("TEST_PAYOUT_");

                    return (
                      <tr key={item.id || item._id || index} className="hover:bg-[#15365b] transition-colors duration-200">
                        <td className="px-5 py-4">
                          <p className="font-semibold">{item.id || item._id || "—"}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.utr || item.transactionId || item.referenceId || "No UTR"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p>{item.fullName || item.name || item.dsaName || "—"}</p>
                        </td>
                        <td className="px-5 py-4 font-semibold">{money(item.amount)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                            {statusLabels[status]}
                          </span>
                          <p className="mt-1 text-[11px] text-slate-500">
                            Source: {item.status || "Pending"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-400">
                          {dateText(item.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          {isTest ? (
                            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                              TEST
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Regular</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelected(item)}
                            className="rounded-lg border border-[#234365] px-3 py-1.5 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-300"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-500">
          Important: Approval is not payment confirmation. A record is shown as
          settled only when its source status is SUCCESS, PAID, COMPLETED or SETTLED.
          This page currently reads payout records; it does not initiate bank transfers
          or modify wallet balances.
        </p>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[#234365] bg-[#0b1d36] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Settlement Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {[
                ["Payout ID", selected.id || selected._id || "—"],
                ["Beneficiary", selected.fullName || selected.name || selected.dsaName || "—"],
                ["Amount", money(selected.amount)],
                ["Original Status", selected.status || "—"],
                ["Settlement Status", statusLabels[getStatus(selected)]],
                ["UTR / Reference", selected.utr || selected.transactionId || selected.referenceId || "Not available"],
                ["Created At", dateText(selected.createdAt)],
                ["Updated At", dateText(selected.updatedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-blue-400/40 pb-3 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="max-w-[60%] break-all text-right font-medium">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-950 hover:bg-cyan-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    <style jsx global>{`
  .settlement-premium {
    background:
      radial-gradient(ellipse at 55% -10%, rgba(0, 104, 255, .28), transparent 42%),
      radial-gradient(ellipse at 100% 45%, rgba(0, 220, 255, .08), transparent 35%),
      linear-gradient(145deg, #020817 0%, #061633 55%, #020817 100%) !important;
  }

  .settlement-premium .settlement-kpis > div {
    position: relative;
    overflow: hidden;
    min-height: 112px;
    border-radius: 18px !important;
    transition: all .25s ease;
  }

  .settlement-premium .settlement-kpis > div:nth-child(1) {
    background: linear-gradient(135deg,#064b9e,#0879d7 55%,#06285f) !important;
    border: 1px solid #16baff !important;
    box-shadow: 0 0 22px rgba(0,166,255,.24), inset 0 0 22px rgba(0,190,255,.12);
  }

  .settlement-premium .settlement-kpis > div:nth-child(2) {
    background: linear-gradient(135deg,#805000,#d18b00 55%,#3d2500) !important;
    border: 1px solid #ffc342 !important;
    box-shadow: 0 0 22px rgba(255,177,0,.25), inset 0 0 22px rgba(255,210,60,.12);
  }

  .settlement-premium .settlement-kpis > div:nth-child(3) {
    background: linear-gradient(135deg,#40108d,#7028d8 55%,#200b5b) !important;
    border: 1px solid #b36aff !important;
    box-shadow: 0 0 22px rgba(155,70,255,.28), inset 0 0 22px rgba(190,100,255,.12);
  }

  .settlement-premium .settlement-kpis > div:nth-child(4) {
    background: linear-gradient(135deg,#006b50,#00a878 55%,#004b37) !important;
    border: 1px solid #00ffc0 !important;
    box-shadow: 0 0 22px rgba(0,255,160,.23), inset 0 0 22px rgba(0,255,180,.12);
  }

  .settlement-premium .settlement-kpis > div:nth-child(5) {
    background: linear-gradient(135deg,#78103d,#c51d59 55%,#480d31) !important;
    border: 1px solid #ff5797 !important;
    box-shadow: 0 0 22px rgba(255,50,120,.25), inset 0 0 22px rgba(255,80,140,.12);
  }

  .settlement-premium .settlement-kpis > div:hover {
    transform: translateY(-4px);
    filter: brightness(1.15);
  }

  .settlement-premium .settlement-overview {
    background: linear-gradient(135deg,#103e85,#102b65 55%,#071c43) !important;
    border: 1px solid #389cff !important;
    box-shadow: 0 0 25px rgba(0,120,255,.22), inset 0 0 30px rgba(0,160,255,.09);
  }

  .settlement-premium .settlement-overview button {
    background: linear-gradient(145deg,#102c5e,#071a3d) !important;
    border: 1px solid rgba(91,175,255,.5) !important;
    border-radius: 13px !important;
    transition: all .2s ease;
  }

  .settlement-premium .settlement-overview button:hover {
    border-color: #20dfff !important;
    box-shadow: 0 0 18px rgba(0,200,255,.25);
    transform: translateY(-2px);
  }

  .settlement-premium .settlement-records {
    background: linear-gradient(145deg,#0b2c57,#07172f 75%) !important;
    border: 1px solid #25aaff !important;
    box-shadow: 0 0 26px rgba(0,145,255,.2);
  }

  .settlement-premium .settlement-records thead {
    background: linear-gradient(90deg,#124b91,#102b60,#10204a) !important;
  }

  .settlement-premium .settlement-records tbody tr {
    background: rgba(5,23,48,.75);
    transition: background .2s ease;
  }

  .settlement-premium .settlement-records tbody tr:hover {
    background: rgba(13,69,119,.65) !important;
  }

  .settlement-premium input,
  .settlement-premium select {
    background: #061a39 !important;
    border-color: #3678bd !important;
  }

  .settlement-premium button {
    transition: filter .2s ease, box-shadow .2s ease;
  }

  .settlement-premium .settlement-records button:hover {
    box-shadow: 0 0 14px rgba(0,210,255,.25);
  }
`}</style>
</main>
  );
}







