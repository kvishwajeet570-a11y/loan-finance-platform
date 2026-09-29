"use client";

import { useEffect, useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";
import {
  Search,
  RefreshCw,
  Eye,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
  CalendarDays,
  Download,
  X,
  Filter,
  MapPin,
} from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

type Lead = {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  loanType?: string;
  amount?: number | string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  panNo?: string;
  purpose?: string;
  assignedTo?: string;
  employmentType?: string;
  companyName?: string;
  monthlyIncome?: number | string;
};

function rupee(value: unknown) {
  const n = Number(value || 0);

  return `${String.fromCharCode(0x20b9)}${n.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  )}`;
}

function dateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cleanStatus(value?: string) {
  return String(value || "PENDING")
    .replaceAll("_", " ")
    .trim();
}

function statusStyle(value?: string) {
  const s = String(value || "").toUpperCase();

  if (
    s.includes("APPROVED") ||
    s.includes("DISBURSED") ||
    s.includes("SUCCESS")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    s.includes("REJECT") ||
    s.includes("CANCEL")
  ) {
    return "border-red-200 bg-red-50 text-red-600";
  }

  if (
    s.includes("QUERY") ||
    s.includes("DOCUMENT")
  ) {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  if (
    s.includes("PROCESS") ||
    s.includes("PENDING")
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function DsaLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiInfo, setApiInfo] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loanType, setLoanType] = useState("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Lead | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  async function loadRealLeads() {
    setLoading(true);
    setError("");
    setApiInfo("");

    try {
      const storedUser =
        localStorage.getItem("loan_finance_user");

      const token =
        localStorage.getItem("loan_finance_token") || "";

      if (!storedUser) {
        throw new Error(
          "DSA login session not found. Please login again."
        );
      }

      let user: any;

      try {
        user = JSON.parse(storedUser);
      } catch {
        throw new Error(
          "Invalid DSA login session."
        );
      }

      if (!user?.id) {
        throw new Error(
          "DSA user ID is missing from the login session."
        );
      }

      const endpoint =
        `${API}/dsa/${encodeURIComponent(user.id)}/loans`;

      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const responseText =
        await response.text();

      let json: any = {};

      try {
        json = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        throw new Error(
          `Backend returned invalid JSON. HTTP ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          json?.message ||
            `Leads API failed. HTTP ${response.status}`
        );
      }

      if (json?.success === false) {
        throw new Error(
          json?.message ||
            "Backend rejected the Leads request."
        );
      }

      /*
       * REAL BACKEND RESPONSE:
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       *
       * Older response shapes are also accepted.
       */
      const rows =
        Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.loans)
          ? json.data.loans
          : Array.isArray(json?.data?.leads)
          ? json.data.leads
          : Array.isArray(json?.loans)
          ? json.loans
          : Array.isArray(json?.leads)
          ? json.leads
          : [];

      const realRows = rows.filter(
        (item: any) =>
          item &&
          typeof item === "object" &&
          item.id
      );

      setLeads(realRows);

      if (realRows.length > 0) {
        setApiInfo(
          `${realRows.length} real lead record${
            realRows.length === 1 ? "" : "s"
          } loaded from backend.`
        );
      } else {
        setApiInfo(
          "API connected successfully, but no loan application is currently assigned to this DSA."
        );
      }

      console.log(
        "[DSA LEADS] Endpoint:",
        endpoint
      );

      console.log(
        "[DSA LEADS] DSA ID:",
        user.id
      );

      console.log(
        "[DSA LEADS] Real records:",
        realRows.length
      );

      console.log(
        "[DSA LEADS] Response:",
        json
      );
    } catch (err: any) {
      console.error(
        "[DSA LEADS] ERROR:",
        err
      );

      setLeads([]);

      setError(
        err?.message ||
          "Unable to load real leads from backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRealLeads();
  }, []);

  async function markDisbursed() {
    if (!selected?.id || statusUpdating) return;

    setStatusUpdating(true);

    try {
      const token = localStorage.getItem("loan_finance_token") || "";

      const response = await fetch(
        `${API}/loan-status-history/${encodeURIComponent(selected.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          body: JSON.stringify({
            status: "DISBURSED",
            remarks: "Marked as disbursed by DSA",
          }),
        }
      );

      const text = await response.text();

      let json: any = {};

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Backend returned invalid JSON. HTTP ${response.status}`
        );
      }

      if (!response.ok || json?.success === false) {
        throw new Error(
          json?.message ||
            `Unable to mark disbursed. HTTP ${response.status}`
        );
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selected.id
            ? {
                ...lead,
                status: "DISBURSED",
                updatedAt: new Date().toISOString(),
              }
            : lead
        )
      );

      setSelected((prev) =>
        prev
          ? {
              ...prev,
              status: "DISBURSED",
              updatedAt: new Date().toISOString(),
            }
          : null
      );

      alert("Loan marked as DISBURSED successfully.");
    } catch (err: any) {
      console.error("[DSA LEADS] MARK DISBURSED ERROR:", err);
      alert(
        err?.message ||
          "Unable to mark loan as disbursed."
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  const loanTypes = useMemo(() => {
    return Array.from(
      new Set(
        leads
          .map((x) => x.loanType)
          .filter(Boolean)
          .map(String)
      )
    ).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const searchMatch =
        !q ||
        [
          lead.id,
          lead.fullName,
          lead.phone,
          lead.email,
          lead.loanType,
          lead.city,
          lead.state,
          lead.panNo,
          lead.companyName,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(q)
          );

      const statusMatch =
        status === "ALL" ||
        String(lead.status || "")
          .toUpperCase()
          .includes(status);

      const loanMatch =
        loanType === "ALL" ||
        String(lead.loanType || "") === loanType;

      return (
        searchMatch &&
        statusMatch &&
        loanMatch
      );
    });
  }, [leads, search, status, loanType]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredLeads.length / pageSize
    )
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const currentLeads =
    filteredLeads.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

  const stats = useMemo(() => {
    const approved = leads.filter((lead) =>
      String(lead.status || "")
        .toUpperCase()
        .includes("APPROVED")
    ).length;

    const rejected = leads.filter((lead) =>
      String(lead.status || "")
        .toUpperCase()
        .includes("REJECT")
    ).length;

    const processed = leads.filter((lead) => {
      const s = String(
        lead.status || ""
      ).toUpperCase();

      return (
        !s.includes("APPROVED") &&
        !s.includes("REJECT") &&
        !s.includes("DISBURSED")
      );
    }).length;

    const totalAmount = leads.reduce(
      (sum, lead) =>
        sum + Number(lead.amount || 0),
      0
    );

    return {
      total: leads.length,
      approved,
      rejected,
      processed,
      totalAmount,
    };
  }, [leads]);

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setLoanType("ALL");
    setPage(1);
  }

  function exportCSV() {
    const columns = [
      "id",
      "fullName",
      "phone",
      "email",
      "loanType",
      "amount",
      "status",
      "city",
      "state",
      "createdAt",
      "updatedAt",
    ];

    const csv = [
      columns.join(","),
      ...filteredLeads.map((lead) =>
        columns
          .map((key) => {
            const value =
              (lead as any)[key] ?? "";

            return `"${String(value).replaceAll(
              '"',
              '""'
            )}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download =
      "dsa-real-leads.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <DsaShell>
      <div className="min-h-screen bg-[#f7f8fc]">

        {/* TOP HEADER */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-4 lg:px-7">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <Users size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600">
                Leads Management
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                My Leads
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Real loan applications assigned to your DSA account.
              </p>
            </div>

            <button
              onClick={loadRealLeads}
              disabled={loading}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <button
              onClick={exportCSV}
              disabled={!filteredLeads.length}
              className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-black text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Export
            </button>

          </div>
        </div>

        <main className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 lg:px-7">

          {/* PREMIUM BANNER */}
          <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#1d1254] via-[#392080] to-[#6628c9] px-7 py-7 text-white shadow-xl">

            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-200">
                DSA FinCorp
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                My Leads
              </h2>

              <p className="mt-1 text-sm font-medium text-violet-100">
                Track, follow up and manage your real loan leads.
              </p>
            </div>

            <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 right-72 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
          </section>

          {/* LIVE STATS */}
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">

            <Stat
              title="Total Leads"
              value={stats.total}
              icon={<Users size={19} />}
              className="text-indigo-600 bg-indigo-50"
            />

            <Stat
              title="In Process"
              value={stats.processed}
              icon={<Clock3 size={19} />}
              className="text-orange-600 bg-orange-50"
            />

            <Stat
              title="Approved"
              value={stats.approved}
              icon={<CheckCircle2 size={19} />}
              className="text-emerald-600 bg-emerald-50"
            />

            <Stat
              title="Rejected"
              value={stats.rejected}
              icon={<XCircle size={19} />}
              className="text-red-600 bg-red-50"
            />

            <Stat
              title="Total Loan Amount"
              value={rupee(stats.totalAmount)}
              icon={<IndianRupee size={19} />}
              className="text-violet-600 bg-violet-50"
              wide
            />

          </section>

          {/* FILTER */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm lg:p-5">

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Filter size={17} />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Lead Filters
                  </h3>

                  <p className="text-[11px] font-medium text-slate-500">
                    Search and filter your live records.
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-bold text-slate-500">
                Showing{" "}
                <span className="text-indigo-600">
                  {filteredLeads.length}
                </span>{" "}
                of {leads.length} records
              </div>

            </div>

            <div className="grid gap-3 lg:grid-cols-[1.7fr_0.75fr_0.9fr_auto]">

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search customer, phone, loan type, city or ID..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="ALL">
                  All Status
                </option>
                <option value="PENDING">
                  Pending
                </option>
                <option value="PROCESS">
                  In Process
                </option>
                <option value="APPROVED">
                  Approved
                </option>
                <option value="REJECTED">
                  Rejected
                </option>
                <option value="DISBURSED">
                  Disbursed
                </option>
              </select>

              <select
                value={loanType}
                onChange={(e) => {
                  setLoanType(e.target.value);
                  setPage(1);
                }}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="ALL">
                  All Loan Types
                </option>

                {loanTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>

              <button
                onClick={resetFilters}
                className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
              >
                Reset
              </button>

            </div>
          </section>

          {/* API STATUS */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <div className="text-sm font-black text-red-700">
                Leads API Error
              </div>

              <div className="mt-1 text-xs font-semibold text-red-600">
                {error}
              </div>
            </div>
          )}

          {/* RECORDS */}
          <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-slate-900">
                  Lead Records
                </h3>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black text-indigo-700">
                  {filteredLeads.length}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                Show

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(
                      Number(e.target.value)
                    );
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-black text-slate-700 outline-none"
                >
                  <option value={10}>
                    10
                  </option>
                  <option value={25}>
                    25
                  </option>
                  <option value={50}>
                    50
                  </option>
                  <option value={100}>
                    100
                  </option>
                </select>

                entries
              </div>

            </div>

            {loading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <RefreshCw
                  size={32}
                  className="animate-spin text-indigo-600"
                />

                <p className="mt-3 text-sm font-black text-slate-600">
                  Loading real leads...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Fetching assigned LoanApplication records.
                </p>
              </div>
            ) : currentLeads.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center px-5 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users size={30} />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-900">
                  No leads found
                </h3>

                <p className="mt-1 max-w-lg text-xs font-medium text-slate-500">
                  {leads.length === 0
                    ? "The API is connected, but there are no LoanApplication records assigned to this DSA."
                    : "No records match the selected filters."}
                </p>

                {(search ||
                  status !== "ALL" ||
                  loanType !== "ALL") && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white"
                  >
                    Clear Filters
                  </button>
                )}

              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto lg:block">

                  <table className="w-full min-w-[1180px]">

                    <thead>
                      <tr className="bg-gradient-to-r from-[#24115d] to-[#43218f] text-left text-[10px] font-black uppercase tracking-wider text-white">

                        <th className="px-4 py-4">
                          #
                        </th>

                        <th className="px-4 py-4">
                          Action
                        </th>

                        <th className="px-4 py-4">
                          Status
                        </th>

                        <th className="px-4 py-4">
                          Date
                        </th>

                        <th className="px-4 py-4">
                          Customer
                        </th>

                        <th className="px-4 py-4">
                          Product
                        </th>

                        <th className="px-4 py-4">
                          Amount
                        </th>

                        <th className="px-4 py-4">
                          Location
                        </th>

                      </tr>
                    </thead>

                    <tbody>
                      {currentLeads.map(
                        (lead, index) => (
                          <tr
                            key={lead.id}
                            className="border-b border-slate-100 hover:bg-indigo-50/40"
                          >

                            <td className="px-4 py-4 text-sm font-black text-slate-500">
                              {(page - 1) *
                                pageSize +
                                index +
                                1}
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex gap-2">

                                <button
                                  onClick={() =>
                                    setSelected(
                                      lead
                                    )
                                  }
                                  className="rounded-full bg-violet-600 px-4 py-2 text-[11px] font-black text-white shadow-sm hover:bg-violet-700"
                                >
                                  View
                                </button>

                                {lead.phone && (
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="rounded-full bg-emerald-500 px-3 py-2 text-[11px] font-black text-white hover:bg-emerald-600"
                                  >
                                    Call
                                  </a>
                                )}

                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black ${statusStyle(
                                  lead.status
                                )}`}
                              >
                                {cleanStatus(
                                  lead.status
                                )}
                              </span>
                            </td>

                            <td className="px-4 py-4">

                              <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                                <CalendarDays
                                  size={14}
                                  className="mt-0.5 shrink-0 text-indigo-500"
                                />

                                <div>
                                  <div>
                                    {dateTime(
                                      lead.updatedAt ||
                                        lead.createdAt
                                    )}
                                  </div>

                                  <div className="mt-1 text-[10px] text-slate-400">
                                    Created:{" "}
                                    {dateTime(
                                      lead.createdAt
                                    )}
                                  </div>
                                </div>
                              </div>

                            </td>

                            <td className="px-4 py-4">

                              <div className="font-black text-slate-900">
                                {lead.fullName ||
                                  "—"}
                              </div>

                              <div className="mt-1 text-[11px] font-semibold text-slate-500">
                                {lead.phone ||
                                  "No phone"}
                              </div>

                            </td>

                            <td className="px-4 py-4">
                              <span className="text-xs font-black text-orange-600">
                                {lead.loanType ||
                                  "—"}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-sm font-black text-slate-800">
                              {rupee(
                                lead.amount
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <MapPin
                                  size={13}
                                  className="text-indigo-500"
                                />

                                {[
                                  lead.city,
                                  lead.state,
                                ]
                                  .filter(Boolean)
                                  .join(
                                    ", "
                                  ) || "—"}
                              </div>
                            </td>

                          </tr>
                        )
                      )}
                    </tbody>

                  </table>
                </div>

                {/* MOBILE */}
                <div className="divide-y divide-slate-100 lg:hidden">

                  {currentLeads.map(
                    (lead, index) => (
                      <div
                        key={lead.id}
                        className="p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <div className="text-[10px] font-bold text-slate-400">
                              #
                              {(page - 1) *
                                pageSize +
                                index +
                                1}
                            </div>

                            <div className="mt-1 text-base font-black text-slate-900">
                              {lead.fullName ||
                                "—"}
                            </div>

                            <div className="mt-1 text-xs font-semibold text-slate-500">
                              {lead.phone ||
                                "No phone"}
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-black ${statusStyle(
                              lead.status
                            )}`}
                          >
                            {cleanStatus(
                              lead.status
                            )}
                          </span>

                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">

                          <Info
                            label="Product"
                            value={
                              lead.loanType
                            }
                          />

                          <Info
                            label="Amount"
                            value={rupee(
                              lead.amount
                            )}
                          />

                          <Info
                            label="Lead Date"
                            value={dateTime(
                              lead.createdAt
                            )}
                          />

                          <Info
                            label="Location"
                            value={
                              [
                                lead.city,
                                lead.state,
                              ]
                                .filter(Boolean)
                                .join(
                                  ", "
                                ) || "—"
                            }
                          />

                        </div>

                        <div className="mt-3 flex gap-2">

                          <button
                            onClick={() =>
                              setSelected(
                                lead
                              )
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-black text-white"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          {lead.phone && (
                            <>
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white"
                              >
                                <Phone size={16} />
                              </a>

                              <a
                                href={`https://wa.me/91${String(
                                  lead.phone
                                ).replace(
                                  /\D/g,
                                  ""
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white"
                              >
                                <MessageCircle
                                  size={17}
                                />
                              </a>
                            </>
                          )}

                        </div>

                      </div>
                    )
                  )}

                </div>
              </>
            )}

            {/* PAGINATION */}
            {!loading &&
              filteredLeads.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="text-[11px] font-semibold text-slate-500">
                    Showing{" "}
                    {(page - 1) *
                      pageSize +
                      1}{" "}
                    to{" "}
                    {Math.min(
                      page * pageSize,
                      filteredLeads.length
                    )}{" "}
                    of{" "}
                    {filteredLeads.length}
                  </div>

                  <div className="flex items-center gap-1">

                    <button
                      disabled={page === 1}
                      onClick={() =>
                        setPage(
                          (p) =>
                            Math.max(
                              1,
                              p - 1
                            )
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={17}
                      />
                    </button>

                    {Array.from(
                      {
                        length: Math.min(
                          totalPages,
                          5
                        ),
                      },
                      (_, i) => i + 1
                    ).map((number) => (
                      <button
                        key={number}
                        onClick={() =>
                          setPage(number)
                        }
                        className={`h-9 min-w-9 rounded-lg px-3 text-xs font-black ${
                          page === number
                            ? "bg-indigo-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {number}
                      </button>
                    ))}

                    <button
                      disabled={
                        page === totalPages
                      }
                      onClick={() =>
                        setPage(
                          (p) =>
                            Math.min(
                              totalPages,
                              p + 1
                            )
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-40"
                    >
                      <ChevronRight
                        size={17}
                      />
                    </button>

                  </div>
                </div>
              )}

          </section>
        </main>

        {/* VIEW MODAL */}
        {selected && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
            onClick={() =>
              setSelected(null)
            }
          >

            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >

              <div className="bg-gradient-to-r from-[#24115d] to-[#6427c7] px-6 py-5 text-white">

                <div className="flex items-center justify-between">

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">
                      Real Lead Details
                    </div>

                    <h3 className="mt-1 text-xl font-black">
                      {selected.fullName ||
                        "Lead"}
                    </h3>
                  </div>

                  <button
                    onClick={() =>
                      setSelected(null)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
                  >
                    <X size={19} />
                  </button>

                </div>

              </div>

              <div className="grid gap-3 p-6 sm:grid-cols-2">

                <Detail
                  label="Customer"
                  value={
                    selected.fullName
                  }
                />

                <Detail
                  label="Phone"
                  value={
                    selected.phone
                  }
                />

                <Detail
                  label="Email"
                  value={
                    selected.email
                  }
                />

                <Detail
                  label="Loan Type"
                  value={
                    selected.loanType
                  }
                />

                <Detail
                  label="Amount"
                  value={rupee(
                    selected.amount
                  )}
                />

                <Detail
                  label="Status"
                  value={cleanStatus(
                    selected.status
                  )}
                />

                <Detail
                  label="City"
                  value={selected.city}
                />

                <Detail
                  label="State"
                  value={selected.state}
                />

                <Detail
                  label="PAN"
                  value={selected.panNo}
                />

                <Detail
                  label="Employment"
                  value={
                    selected.employmentType
                  }
                />

                <Detail
                  label="Company"
                  value={
                    selected.companyName
                  }
                />

                <Detail
                  label="Monthly Income"
                  value={
                    selected.monthlyIncome
                      ? rupee(
                          selected.monthlyIncome
                        )
                      : undefined
                  }
                />

                <Detail
                  label="Created"
                  value={dateTime(
                    selected.createdAt
                  )}
                />

                <Detail
                  label="Updated"
                  value={dateTime(
                    selected.updatedAt
                  )}
                />

              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">

                {String(selected.status || "").toUpperCase() !== "DISBURSED" && (
                  <button
                    type="button"
                    onClick={markDisbursed}
                    disabled={statusUpdating}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-black text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
                  >
                    <CheckCircle2 size={15} />
                    {statusUpdating
                      ? "Updating..."
                      : "Mark Disbursed"}
                  </button>
                )}

                {selected.phone && (
                  <>
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-white"
                    >
                      <Phone size={15} />
                      Call
                    </a>

                    <a
                      href={`https://wa.me/91${String(
                        selected.phone
                      ).replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-xs font-black text-white"
                    >
                      <MessageCircle
                        size={15}
                      />
                      WhatsApp
                    </a>
                  </>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </DsaShell>
  );
}

function Stat({
  title,
  value,
  icon,
  className,
  wide,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
        wide
          ? "col-span-2 lg:col-span-1"
          : ""
      }`}
    >
      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[10px] font-bold text-slate-500">
            {title}
          </div>

          <div className="mt-1 truncate text-xl font-black text-slate-950">
            {value}
          </div>
        </div>

      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="mt-1 truncate text-xs font-bold text-slate-700">
        {value || "—"}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="mt-1 break-words text-sm font-bold text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
}

