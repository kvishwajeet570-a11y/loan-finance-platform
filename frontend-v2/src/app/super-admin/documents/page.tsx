"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  FileText, Search, RefreshCw, CheckCircle2, XCircle,
  Clock, Eye, ChevronLeft, ChevronRight, ShieldCheck,
  FileSearch, Sparkles, UserRound, ArrowUpRight,
  X, CalendarDays, Layers, AlertCircle
} from "lucide-react";

type Doc = {
  id: string;
  documentName?: string;
  documentType?: string;
  fileUrl?: string;
  status?: string;
  rejectionReason?: string | null;
  createdAt?: string;
  user?: {
    name?: string;
    email?: string;
    phoneNo?: string;
  } | null;
};

type Stats = {
  total?: number;
  pending?: number;
  verified?: number;
  rejected?: number;
};

const tabs = [
  { value: "PENDING", label: "Pending", icon: Clock },
  { value: "VERIFIED", label: "Approved", icon: CheckCircle2 },
  { value: "REJECTED", label: "Rejected", icon: XCircle },
  { value: "ALL", label: "All Documents", icon: Layers },
];

export default function DocumentVerificationPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [selected, setSelected] = useState<Doc | null>(null);
  const [error, setError] = useState("");

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("loan_finance_token") || ""}`,
  });

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [list, analytics] = await Promise.all([
        api.get("/document", {
          headers: headers(),
          params: {
            page,
            limit: 10,
            search: query,
            status: status === "ALL" ? "" : status,
          },
        }),
        api.get("/document/analytics", { headers: headers() }),
      ]);

      setDocs(list.data?.documents || []);
      setTotal(list.data?.total || 0);
      setPages(Math.max(1, list.data?.pages || 1));
      setStats(analytics.data?.data || {});
    } catch (err: any) {
      console.error("Document API error:", err);
      setError(
        err?.response?.data?.message ||
        "Documents load nahi hue. Login aur backend API check karein."
      );
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("status");
    if (initial && ["PENDING", "VERIFIED", "REJECTED", "ALL"].includes(initial)) {
      setStatus(initial);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [page, status, query]);

  const verify = async (doc: Doc) => {
    if (!window.confirm("Is document ko approve karna hai?")) return;

    setBusy(doc.id);
    try {
      await api.patch(`/document/${doc.id}/verify`, {}, {
        headers: headers(),
      });

      if (selected?.id === doc.id) setSelected(null);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Approval failed.");
    } finally {
      setBusy("");
    }
  };

  const reject = async (doc: Doc) => {
    const reason = window.prompt("Rejection reason enter karein:");
    if (!reason?.trim()) return;

    setBusy(doc.id);
    try {
      await api.patch(
        `/document/${doc.id}/reject`,
        { reason: reason.trim() },
        { headers: headers() }
      );

      if (selected?.id === doc.id) setSelected(null);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Rejection failed.");
    } finally {
      setBusy("");
    }
  };

  const cards = [
    {
      label: "Total Documents",
      value: stats.total ?? 0,
      Icon: FileText,
      color: "cyan",
      iconBg: "bg-cyan-400/10",
      iconColor: "text-cyan-300",
      border: "border-cyan-400/30",
      glow: "from-cyan-500/15",
    },
    {
      label: "Pending Review",
      value: stats.pending ?? 0,
      Icon: Clock,
      color: "amber",
      iconBg: "bg-amber-400/10",
      iconColor: "text-amber-300",
      border: "border-amber-400/30",
      glow: "from-amber-500/15",
    },
    {
      label: "Approved",
      value: stats.verified ?? 0,
      Icon: CheckCircle2,
      color: "emerald",
      iconBg: "bg-emerald-400/10",
      iconColor: "text-emerald-300",
      border: "border-emerald-400/30",
      glow: "from-emerald-500/15",
    },
    {
      label: "Rejected",
      value: stats.rejected ?? 0,
      Icon: XCircle,
      color: "rose",
      iconBg: "bg-rose-400/10",
      iconColor: "text-rose-300",
      border: "border-rose-400/30",
      glow: "from-rose-500/15",
    },
  ];

  const statusStyle = (value?: string) => {
    if (value === "VERIFIED") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }
    if (value === "REJECTED") {
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";
    }
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  };

  const statusLabel = (value?: string) => {
    if (value === "VERIFIED") return "APPROVED";
    return value || "PENDING";
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030b19] p-3 text-white sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-gradient-to-br from-[#102b58] via-[#081a36] to-[#061020] p-6 shadow-[0_20px_80px_rgba(0,80,200,0.12)] md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute bottom-[-100px] left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />

          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                <ShieldCheck size={14} /> Super Admin Control
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Document <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-amber-300 bg-clip-text text-transparent">Verification</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/70">
                Review, verify and manage customer and DSA documents from one central control workspace.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-blue-100/60">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live database connection
                </span>
                <span className="text-blue-300/40">•</span>
                <span>Secure document management</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => void load()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200/25 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <div className="hidden h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_45px_rgba(0,180,255,0.12)] sm:flex">
                <FileSearch size={42} />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, Icon, iconBg, iconColor, border, glow }) => (
            <div
              key={label}
              className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${glow} to-[#0a1830] p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-blue-900/20`}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.03] blur-2xl transition group-hover:bg-white/[0.07]" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">{label}</p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-white">
                    {value.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Database records
                  </p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} ${iconColor} ring-1 ring-white/10`}>
                  <Icon size={27} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* DOCUMENT WORKSPACE */}
        <section className="overflow-hidden rounded-[26px] border border-blue-300/15 bg-gradient-to-br from-[#0d1b35] to-[#071326] shadow-[0_20px_70px_rgba(0,0,0,0.25)]">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] p-5 md:px-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-cyan-300" />
                <h2 className="text-lg font-extrabold">Document Workspace</h2>
              </div>
              <p className="mt-1 text-xs text-slate-400">Manage verification requests and review document records.</p>
            </div>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              Secure Admin View
            </span>
          </div>

          {/* TABS */}
          <div className="flex flex-wrap gap-2 px-5 pt-5 md:px-6">
            {tabs.map(({ value, label, icon: Icon }) => {
              const count =
                value === "PENDING" ? stats.pending :
                value === "VERIFIED" ? stats.verified :
                value === "REJECTED" ? stats.rejected :
                stats.total;

              const active = status === value;

              return (
                <button
                  key={value}
                  onClick={() => {
                    setStatus(value);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                    active
                      ? "border-cyan-300/60 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_5px_25px_rgba(0,150,255,0.25)]"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-blue-300/30 hover:bg-blue-400/10"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/20" : "bg-white/10"}`}>
                    {count ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH */}
          <form
            className="flex flex-col gap-3 p-5 md:flex-row md:px-6"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(search.trim());
            }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-blue-200/15 bg-[#050e20] px-4 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/10">
              <Search size={18} className="shrink-0 text-cyan-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search document name..."
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
              {search && (
                <button type="button" onClick={() => { setSearch(""); setQuery(""); setPage(1); }}>
                  <X size={16} className="text-slate-500 hover:text-white" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-900/30 transition hover:brightness-110"
            >
              <Search size={16} /> Search
            </button>
          </form>

          {/* ERROR */}
          {error && (
            <div className="mx-5 mb-4 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200 md:mx-6">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Unable to load documents</p>
                <p className="mt-1 text-xs text-rose-200/80">{error}</p>
              </div>
              <button onClick={() => void load()} className="ml-auto text-xs font-bold underline">Retry</button>
            </div>
          )}

          {/* TABLE */}
          <div className="px-5 pb-5 md:px-6">
            <div className="overflow-x-auto rounded-2xl border border-blue-200/10">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gradient-to-r from-[#172e53] to-[#102440] text-[10px] font-black uppercase tracking-[0.13em] text-blue-200/80">
                  <tr>
                    <th className="px-5 py-4">Document</th>
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <RefreshCw size={28} className="mx-auto animate-spin text-cyan-300" />
                        <p className="mt-3 text-sm text-slate-400">Loading real documents...</p>
                      </td>
                    </tr>
                  ) : docs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-300/15 bg-blue-400/10 text-cyan-300">
                          <FileSearch size={38} />
                        </div>
                        <h3 className="mt-5 text-lg font-extrabold text-white">No documents found</h3>
                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-400">
                          No matching records are available for this selection. Try another status or search term.
                        </p>
                        <button
                          onClick={() => void load()}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-300/20"
                        >
                          <RefreshCw size={14} /> Refresh records
                        </button>
                      </td>
                    </tr>
                  ) : docs.map((doc) => (
                    <tr key={doc.id} className="transition hover:bg-blue-400/[0.045]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/10 text-cyan-300">
                            <FileText size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[210px] truncate font-bold text-slate-100">
                              {doc.documentName || "General Document"}
                            </p>
                            <p className="mt-1 max-w-[210px] truncate text-[10px] text-slate-500">
                              ID: {doc.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-400/10 text-indigo-300">
                            <UserRound size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[150px] truncate font-semibold text-slate-200">
                              {doc.user?.name || "Unknown User"}
                            </p>
                            <p className="max-w-[150px] truncate text-[10px] text-slate-500">
                              {doc.user?.email || doc.user?.phoneNo || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300">
                          {doc.documentType || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold ${statusStyle(doc.status)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {statusLabel(doc.status)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-IN") : "—"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Preview document"
                            onClick={() => setSelected(doc)}
                            className="rounded-lg border border-blue-300/15 bg-blue-400/10 p-2.5 text-blue-200 transition hover:bg-blue-400/20"
                          >
                            <Eye size={15} />
                          </button>

                          {doc.status !== "VERIFIED" && (
                            <button
                              title="Approve document"
                              disabled={busy === doc.id}
                              onClick={() => void verify(doc)}
                              className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-2.5 text-emerald-300 transition hover:bg-emerald-400/20 disabled:opacity-40"
                            >
                              {busy === doc.id ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                            </button>
                          )}

                          {doc.status !== "REJECTED" && (
                            <button
                              title="Reject document"
                              disabled={busy === doc.id}
                              onClick={() => void reject(doc)}
                              className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-2.5 text-rose-300 transition hover:bg-rose-400/20 disabled:opacity-40"
                            >
                              <XCircle size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Showing <span className="font-bold text-white">{docs.length}</span> records
                <span className="mx-2 text-slate-600">•</span>
                Total <span className="font-bold text-cyan-300">{total}</span>
                <span className="mx-2 text-slate-600">•</span>
                Page {page} of {pages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  disabled={page >= pages || loading}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-600">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={13} className="text-cyan-400" />
            AIFIN Super Admin • Document Control
          </span>
          <span>Connected to existing document API</span>
        </footer>
      </div>

      {/* DOCUMENT PREVIEW */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020713]/90 p-3 backdrop-blur-md sm:p-6">
          <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-blue-300/20 bg-[#0a1830] shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="truncate font-extrabold text-white">
                  {selected.documentName || "Document Preview"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {selected.documentType || "Document"} • {selected.user?.name || "Unknown User"}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <div className="min-h-[45vh] flex-1 overflow-auto bg-[#030b19]">
              {selected.fileUrl ? (
                <iframe
                  title="Document preview"
                  src={selected.fileUrl}
                  className="h-[70vh] w-full"
                />
              ) : (
                <div className="flex min-h-[45vh] flex-col items-center justify-center p-8 text-center">
                  <FileSearch size={42} className="text-slate-500" />
                  <p className="mt-4 font-bold text-slate-300">Document URL unavailable</p>
                  <p className="mt-1 text-xs text-slate-500">No file URL is saved for this record.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
              {selected.fileUrl ? (
                <a
                  href={selected.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200"
                >
                  Open original document <ArrowUpRight size={14} />
                </a>
              ) : <span />}

              <div className="flex gap-2">
                {selected.status !== "VERIFIED" && (
                  <button
                    disabled={busy === selected.id}
                    onClick={() => void verify(selected)}
                    className="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-40"
                  >
                    Approve
                  </button>
                )}
                {selected.status !== "REJECTED" && (
                  <button
                    disabled={busy === selected.id}
                    onClick={() => void reject(selected)}
                    className="rounded-xl bg-rose-500/15 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/25 disabled:opacity-40"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
