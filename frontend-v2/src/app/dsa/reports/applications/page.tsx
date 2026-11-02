"use client";

import { useEffect, useMemo, useState } from "react";

type Application = {
  id?: string;
  applicationId?: string;
  fullName?: string;
  name?: string;
  customerName?: string;
  phone?: string;
  phoneNo?: string;
  email?: string;
  loanType?: string;
  productType?: string;
  amount?: number | string;
  loanAmount?: number | string;
  status?: string;
  lender?: string;
  bankName?: string;
  createdAt?: string;
  appliedAt?: string;
};

const money = (value: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const dateText = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const statusText = (value?: string) =>
  String(value || "PENDING").replace(/_/g, " ").toLowerCase();

const statusColor = (value?: string) => {
  const s = String(value || "").toUpperCase();
  if (["APPROVED", "DISBURSED", "SANCTIONED", "CONVERTED"].includes(s))
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (["REJECTED", "DECLINED", "CANCELLED"].includes(s))
    return "bg-rose-50 text-rose-700 ring-rose-200";
  if (["UNDER_REVIEW", "IN_REVIEW", "PROCESSING", "IN_PROCESS"].includes(s))
    return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
};

export default function ApplicationReportPage() {
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loanType, setLoanType] = useState("ALL");
  const [lender, setLender] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadApplications = async () => {
    try {
      setError("");
      const base = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      ).replace(/\/$/, "");
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(`${base}/loan`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Applications API returned HTTP ${response.status}`);
      }

      const json = await response.json();
      const data = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.loans)
            ? json.loans
            : Array.isArray(json?.applications)
              ? json.applications
              : null;

      if (!data) throw new Error("API response में applications की list नहीं मिली।");
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Applications load नहीं हुईं।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
    // Initial fetch; refresh button can reload the latest backend data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getName = (r: Application) =>
    r.fullName || r.customerName || r.name || "—";
  const getId = (r: Application) => r.applicationId || r.id || "—";
  const getPhone = (r: Application) => r.phone || r.phoneNo || "—";
  const getType = (r: Application) => r.loanType || r.productType || "Other";
  const getAmount = (r: Application) => r.amount ?? r.loanAmount ?? 0;
  const getDate = (r: Application) => r.createdAt || r.appliedAt || "";
  const getLender = (r: Application) => r.lender || r.bankName || "Not assigned";

  const loanTypes = useMemo(
    () => Array.from(new Set(rows.map(getType))).sort(),
    [rows]
  );
  const lenders = useMemo(
    () => Array.from(new Set(rows.map(getLender))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const searchable = [
        getId(r), getName(r), getPhone(r), r.email || "",
        getType(r), getLender(r), r.status || "",
      ].join(" ").toLowerCase();
      const d = getDate(r) ? new Date(getDate(r)) : null;
      return (
        (!q || searchable.includes(q)) &&
        (status === "ALL" || String(r.status || "PENDING").toUpperCase() === status) &&
        (loanType === "ALL" || getType(r) === loanType) &&
        (lender === "ALL" || getLender(r) === lender) &&
        (!startDate || (!!d && !Number.isNaN(d.getTime()) && d >= new Date(`${startDate}T00:00:00`))) &&
        (!endDate || (!!d && !Number.isNaN(d.getTime()) && d <= new Date(`${endDate}T23:59:59`)))
      );
    });
  }, [rows, search, status, loanType, lender, startDate, endDate]);

  useEffect(() => setPage(1), [search, status, loanType, lender, startDate, endDate, pageSize]);

  const approved = rows.filter((r) =>
    ["APPROVED", "DISBURSED", "SANCTIONED"].includes(String(r.status).toUpperCase())
  ).length;
  const rejected = rows.filter((r) =>
    ["REJECTED", "DECLINED", "CANCELLED"].includes(String(r.status).toUpperCase())
  ).length;
  const inProcess = rows.filter((r) =>
    ["PENDING", "NEW", "PROCESSING", "IN_PROCESS", "UNDER_REVIEW", "IN_REVIEW", "CONTACTED", "FOLLOW_UP"].includes(String(r.status || "PENDING").toUpperCase())
  ).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const statusCounts = [
    { label: "Approved", count: approved, color: "#10b981" },
    { label: "In Process", count: inProcess, color: "#f59e0b" },
    { label: "Under Review", count: rows.filter((r) => ["UNDER_REVIEW", "IN_REVIEW"].includes(String(r.status).toUpperCase())).length, color: "#3b82f6" },
    { label: "Rejected", count: rejected, color: "#f43f5e" },
  ];

  const loanCounts = loanTypes
    .map((name) => ({ name, count: rows.filter((r) => getType(r) === name).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const maxLoanCount = Math.max(1, ...loanCounts.map((x) => x.count));

  const exportCSV = () => {
    const values = [
      ["Application ID", "Customer", "Phone", "Loan Type", "Amount", "Status", "Lender", "Applied On"],
      ...filtered.map((r) => [
        getId(r), getName(r), getPhone(r), getType(r),
        String(getAmount(r)), statusText(r.status), getLender(r), dateText(getDate(r)),
      ]),
    ];
    const csv = values.map((line) =>
      line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "application-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-[1700px] space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-200">
              ▤
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Application Report</h1>
              <p className="mt-1 text-sm text-slate-500">View and manage loan applications submitted through your DSA account.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              {startDate || "All dates"} — {endDate || "Today"}
            </span>
            <button onClick={() => void loadApplications()} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100">
              ↻ Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <span>API error: {error}</span>
            <button onClick={() => void loadApplications()} className="rounded-lg bg-rose-600 px-3 py-2 font-semibold text-white">Retry</button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Applications", count: rows.length, note: "All loan applications", color: "blue", icon: "▦" },
            { label: "Approved", count: approved, note: "Successfully approved", color: "emerald", icon: "✓" },
            { label: "In Process", count: inProcess, note: "Awaiting processing", color: "amber", icon: "◷" },
            { label: "Rejected", count: rejected, note: "Declined applications", color: "rose", icon: "×" },
          ].map((card) => (
            <div key={card.label} className={`rounded-2xl border border-${card.color}-100 bg-white p-5 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{loading ? "…" : card.count}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.note}</p>
                </div>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${card.color}-50 text-2xl font-bold text-${card.color}-600`}>{card.icon}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="⌕ Search ID, name, phone, PAN..." className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 xl:col-span-2" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="ALL">All Status</option>
              {Array.from(new Set(rows.map((r) => String(r.status || "PENDING").toUpperCase()))).sort().map((s) => <option key={s} value={s}>{statusText(s)}</option>)}
            </select>
            <select value={loanType} onChange={(e) => setLoanType(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="ALL">All Loan Types</option>
              {loanTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
            <select value={lender} onChange={(e) => setLender(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="ALL">All Lenders</option>
              {lenders.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => { setSearch(""); setStatus("ALL"); setLoanType("ALL"); setLender("ALL"); setStartDate(""); setEndDate(""); }} className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold hover:bg-slate-50">Reset Filters</button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-500">From <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700" /></label>
            <label className="flex items-center gap-2 text-sm text-slate-500">To <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700" /></label>
            <span className="ml-auto text-sm text-slate-500">{filtered.length} matching applications</span>
            <button onClick={exportCSV} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700">↓ Export CSV</button>
          </div>
        </section>

        <section className="grid items-start gap-5 2xl:grid-cols-[minmax(0,2.2fr)_minmax(300px,.8fr)]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Application Details</h2>
                <p className="mt-1 text-sm text-slate-500">Loan applications received from your backend</p>
              </div>
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">Live API Data</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gradient-to-r from-blue-700 to-cyan-500 text-xs uppercase tracking-wide text-white">
                  <tr>
                    {["#", "Application ID", "Customer Name", "Phone", "Loan Type", "Amount", "Status", "Applied On"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-4 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={8} className="p-12 text-center text-slate-500">Loading applications from API…</td></tr>
                  ) : visibleRows.length === 0 ? (
                    <tr><td colSpan={8} className="p-12 text-center text-slate-500">{error ? "API data load नहीं हुआ। Retry करें।" : "No applications found for these filters."}</td></tr>
                  ) : visibleRows.map((r, i) => (
                    <tr key={getId(r) + "-" + i} className="hover:bg-blue-50/50">
                      <td className="px-4 py-4 text-slate-400">{(page - 1) * pageSize + i + 1}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-700">{getId(r)}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">{getName(r)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{getPhone(r)}</td>
                      <td className="whitespace-nowrap px-4 py-4">{getType(r).replace(/_/g, " ")}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold">{money(getAmount(r))}</td>
                      <td className="px-4 py-4"><span className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${statusColor(r.status)}`}>{statusText(r.status)}</span></td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">{dateText(getDate(r))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
              <p className="text-sm text-slate-500">
                Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} applications
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="mr-1 text-sm text-slate-500">Show</label>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm">
                  {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">‹</button>
                <span className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">›</button>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-extrabold text-slate-900">Application Status Overview</h2>
              <p className="mt-1 text-xs text-slate-500">Total applications by status</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
                <div className="relative h-36 w-36 shrink-0 rounded-full" style={{ background: `conic-gradient(${statusCounts.map((s, i) => { const before = statusCounts.slice(0, i).reduce((a, x) => a + x.count, 0); const total = Math.max(rows.length, 1); return `${s.color} ${before / total * 100}% ${(before + s.count) / total * 100}%`; }).join(", ")})` }}>
                  <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-2xl font-extrabold text-slate-900">{rows.length}</span>
                    <span className="text-xs text-slate-500">Total</span>
                  </div>
                </div>
                <div className="min-w-[130px] flex-1 space-y-3">
                  {statusCounts.map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-2 text-slate-600"><i className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.label}</span>
                      <b className="text-slate-800">{s.count} ({rows.length ? Math.round(s.count / rows.length * 100) : 0}%)</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-extrabold text-slate-900">Loan Type Distribution</h2>
              <p className="mt-1 text-xs text-slate-500">Applications by loan product</p>
              {loanCounts.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">No loan type data available.</p> : (
                <div className="mt-5 flex h-44 items-end justify-around gap-3 border-b border-slate-100 pb-2">
                  {loanCounts.map((x) => (
                    <div key={x.name} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                      <b className="text-xs text-slate-700">{x.count}</b>
                      <div className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400" style={{ height: `${Math.max(8, x.count / maxLoanCount * 100)}%` }} />
                      <span className="w-full truncate text-center text-[10px] text-slate-500" title={x.name}>{x.name.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-extrabold text-slate-900">Top Lenders</h2>
              <p className="mt-1 text-xs text-slate-500">Lenders present in API records</p>
              {rows.every((r) => !r.lender && !r.bankName) ? (
                <p className="py-5 text-sm text-slate-400">Lender details are not available in the API records.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {lenders.filter((x) => x !== "Not assigned").map((name) => {
                    const count = rows.filter((r) => getLender(r) === name).length;
                    return <div key={name}>
                      <div className="mb-1 flex justify-between gap-3 text-xs"><span className="truncate text-slate-600">{name}</span><b>{count}</b></div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${count / Math.max(rows.length, 1) * 100}%` }} /></div>
                    </div>;
                  })}
                </div>
              )}
            </div>
          </aside>
        </section>
        <p className="pb-3 text-center text-xs text-slate-400">Application Report · Values and charts are calculated from the API records returned by your backend.</p>
      </div>
    </main>
  );
}
