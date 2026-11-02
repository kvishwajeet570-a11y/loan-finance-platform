"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
  columns: string[];
};

export default function ReportDetailPage({ title, description, columns }: Props) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Connect real API data here later. Do not use fake financial figures.
  const records: string[][] = [];

  function exportCSV() {
    const csv = [columns, ...records]
      .map(row => row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { title: "Total Records", value: "—", icon: "₹", color: "blue" },
    { title: "Approved", value: "—", icon: "✓", color: "green" },
    { title: "Pending", value: "—", icon: "◷", color: "amber" },
    { title: "Rejected", value: "—", icon: "×", color: "rose" },
  ];

  const cardStyle: Record<string, string> = {
    blue: "border-blue-200 bg-gradient-to-br from-sky-50 to-blue-100/70 text-blue-700",
    green: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100/70 text-emerald-700",
    amber: "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100/70 text-amber-700",
    rose: "border-rose-200 bg-gradient-to-br from-rose-50 to-pink-100/70 text-rose-700",
  };

  const visibleRecords = records.filter(row => {
    const matchesSearch = row.join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" ||
      row.some(cell => cell.toLowerCase() === status.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="relative min-h-full overflow-x-hidden bg-gradient-to-br from-white via-sky-50 to-blue-100/70 p-3 text-slate-900 sm:p-4">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-full space-y-4">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
            DSA FINCORP / REPORTS
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{description}</p>
        </header>

        <section className="rounded-xl border border-blue-100 bg-white/95 p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm font-semibold text-slate-700">
              From Date
              <input type="date" value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              To Date
              <input type="date" value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Status
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500">
                <option>All</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
                <option>Paid</option>
              </select>
            </label>
            <button onClick={() => setSearch("")}
              className="self-end rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700">
              Search Report
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(card => (
            <article key={card.title}
              className={`relative overflow-hidden rounded-xl border p-3 shadow-sm transition hover:shadow-md sm:p-4 ${cardStyle[card.color]}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/80 text-2xl font-bold shadow-sm">
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{card.title}</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
                    {card.value}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">Awaiting live report data</div>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-xl border border-blue-100 bg-white/95 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Monthly Report Details</h2>
              <p className="mt-1 text-sm text-slate-500">Summary and records for this report</p>
            </div>
            <button onClick={exportCSV}
              className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-50">
              ↓ Export CSV
            </button>
          </div>

          <div className="border-b border-slate-100 p-4">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-gradient-to-r from-blue-50 to-sky-100/80 text-slate-700">
                <tr>{columns.map(col =>
                  <th key={col} className="px-5 py-4 font-bold">{col}</th>
                )}</tr>
              </thead>
              <tbody>
                {visibleRecords.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-5 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-500">▤</div>
                      <p className="mt-3 font-semibold text-slate-800">No report data available</p>
                      <p className="mt-1 text-sm text-slate-500">Real records will appear here when connected to the backend.</p>
                    </td>
                  </tr>
                ) : visibleRecords.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 transition hover:bg-blue-50/50">
                    {row.map((cell, j) => <td key={j} className="whitespace-nowrap px-5 py-4">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">
            {visibleRecords.length} records
          </div>
        </section>
      </div>
    </main>
  );
}

