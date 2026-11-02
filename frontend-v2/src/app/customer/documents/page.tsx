"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText, Upload, Search, ShieldCheck, Clock3, XCircle,
  Eye, Download, RefreshCw, FolderOpen, FileImage, File,
  ChevronRight, AlertCircle, CheckCircle2, ArrowLeft,
} from "lucide-react";
import api from "@/lib/api";

type DocumentItem = {
  id: string;
  documentName?: string;
  documentType?: string;
  fileName?: string;
  fileType?: string;
  originalName?: string;
  fileUrl?: string;
  status?: string;
  createdAt?: string;
  fileSize?: number;
  category?: string;
  rejectionReason?: string;
};

const statusStyles: Record<string, string> = {
  VERIFIED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};

function statusOf(value?: string) {
  const status = String(value || "PENDING").toUpperCase();
  if (["VERIFIED", "APPROVED", "ACCEPTED"].includes(status)) return "VERIFIED";
  if (["REJECTED", "DECLINED"].includes(status)) return "REJECTED";
  return "PENDING";
}

function dateLabel(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      });
}

function formatSize(size?: number) {
  if (!size || size <= 0) return "—";
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function unwrapDocuments(payload: any): DocumentItem[] {
  const candidates = [
    payload?.data?.documents,
    payload?.documents,
    payload?.data,
    payload,
  ];
  return candidates.find(Array.isArray) || [];
}

export default function CustomerDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDocuments() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("loan_finance_token");
      const storedUser = localStorage.getItem("loan_finance_user");

      if (!token || !storedUser) {
        router.replace("/login");
        return;
      }

      let user: any;
      try {
        user = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      const userId = user?.id || user?.userId;
      if (!userId) {
        setError("Your account information could not be verified. Please sign in again.");
        return;
      }

      // Existing endpoint. It reads the Document model, not the Upload model.
      const response = await api.get(
        `/user/${encodeURIComponent(String(userId))}/documents`
      );
      setDocuments(unwrapDocuments(response.data));
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError("Your session could not be verified. Please sign in again.");
      } else {
        setError("Documents could not be loaded. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDocuments();
  }, []);

  const categories = useMemo(() => {
    const values = documents
      .map((doc) => doc.documentType || doc.category || "Other")
      .filter(Boolean);
    return ["All", ...Array.from(new Set(values))];
  }, [documents]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return documents.filter((doc) => {
      const name = doc.documentName || doc.originalName || doc.fileName || "Document";
      const type = doc.documentType || doc.category || "Other";
      const matchesSearch = !query || `${name} ${type}`.toLowerCase().includes(query);
      const matchesCategory = category === "All" || type === category;
      const matchesStatus = statusFilter === "All" || statusOf(doc.status) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [documents, search, category, statusFilter]);

  const verified = documents.filter((doc) => statusOf(doc.status) === "VERIFIED").length;
  const pending = documents.filter((doc) => statusOf(doc.status) === "PENDING").length;
  const rejected = documents.filter((doc) => statusOf(doc.status) === "REJECTED").length;

  async function openFile(doc: DocumentItem, action: "preview" | "download") {
    let previewWindow: Window | null = null;

    if (action === "preview") {
      previewWindow = window.open("about:blank", "_blank");
      if (!previewWindow) {
        setError("Preview popup blocked. Please allow popups and try again.");
        return;
      }
    }

    try {
      setError("");

      const response = await api.get(
        `/upload/${encodeURIComponent(doc.id)}/${action}`,
        { responseType: "blob" }
      );

      const blobUrl = URL.createObjectURL(response.data);

      if (action === "preview") {
        if (previewWindow) {
          previewWindow.location.href = blobUrl;
          window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } else {
          URL.revokeObjectURL(blobUrl);
        }
      } else {
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download =
          doc.originalName || doc.fileName || doc.documentName || "document";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      }
    } catch (err: any) {
      if (previewWindow && !previewWindow.closed) {
        previewWindow.close();
      }

      const status = err?.response?.status;
      if (status === 401) {
        setError("Your session expired. Please sign in again.");
      } else if (status === 403) {
        setError("You are not authorized to access this document.");
      } else if (status === 404) {
        setError("This document or its file could not be found.");
      } else {
        setError("Could not open this document. Please try again.");
      }
    }
  }

  const stats = [
    { label: "Total documents", value: documents.length, note: "Records returned by the API", icon: FileText, tone: "blue" },
    { label: "Verified", value: verified, note: "Approved documents", icon: CheckCircle2, tone: "green" },
    { label: "Pending review", value: pending, note: "Awaiting verification", icon: Clock3, tone: "amber" },
    { label: "Rejected", value: rejected, note: "May need attention", icon: XCircle, tone: "rose" },
  ];

  return (
    <main className="min-h-screen bg-slate-50/80 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-7">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/customer/dashboard" className="transition hover:text-blue-700">
            Dashboard
          </Link>
          <ChevronRight size={15} />
          <span className="font-semibold text-slate-800">My Documents</span>
        </div>

        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <FolderOpen size={26} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                My Documents
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              View and manage your loan-related documents in one place.
            </p>
          </div>

          <Link
            href="/customer/kyc"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Upload size={18} />
            Upload / Manage KYC
          </Link>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon, tone }) => {
            const tones: Record<string, string> = {
              blue: "bg-blue-50 text-blue-700 ring-blue-100",
              green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
              amber: "bg-amber-50 text-amber-700 ring-amber-100",
              rose: "bg-rose-50 text-rose-700 ring-rose-100",
            };
            return (
              <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                      {loading ? "—" : value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{note}</p>
                  </div>
                  <div className={`rounded-xl p-3 ring-1 ${tones[tone]}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-white p-4 text-blue-700 shadow-sm ring-1 ring-blue-100">
              <ShieldCheck size={28} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">Keep your documents up to date</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Submit KYC documents through the existing customer KYC workflow. Verification status appears here when the API returns it.
              </p>
            </div>
            <Link href="/customer/kyc" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
              Go to KYC <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Document library</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search and filter documents returned for your account.
                </p>
              </div>
              <button
                onClick={() => void loadDocuments()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_200px_180px]">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by document name or type..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                <option value="All">All statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="m-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <div className="flex-1">{error}</div>
              <button onClick={() => setError("")} className="font-semibold underline">Dismiss</button>
            </div>
          )}

          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText size={30} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {documents.length === 0 ? "No documents found" : "No matching documents"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {documents.length === 0
                  ? "The current API returned no records. Uploaded files may be stored in a separate Upload table that still needs to be connected."
                  : "Try changing your search or filters to see other documents."}
              </p>
              {documents.length === 0 && (
                <Link href="/customer/kyc" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  <Upload size={17} /> Go to KYC
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Document</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Uploaded</th>
                      <th className="px-5 py-4 font-semibold">Size</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((doc) => {
                      const name = doc.documentName || doc.originalName || doc.fileName || "Document";
                      const status = statusOf(doc.status);
                      const type = doc.documentType || doc.category || "Other";
                      return (
                        <tr key={doc.id} className="transition hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                                {String(doc.fileType || "").includes("image") ? <FileImage size={20} /> : <File size={20} />}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{name}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{doc.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{type}</td>
                          <td className="px-5 py-4 text-slate-600">{dateLabel(doc.createdAt)}</td>
                          <td className="px-5 py-4 text-slate-600">{formatSize(doc.fileSize)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusStyles[status]}`}>
                              {status === "VERIFIED" ? "Verified" : status === "REJECTED" ? "Rejected" : "Pending"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openFile(doc, "preview")} title="Preview disabled until backend access control is verified" className="rounded-lg border border-slate-200 p-2 text-slate-400" aria-label={`Preview ${name}`}>
                                <Eye size={16} />
                              </button>
                              <button onClick={() => openFile(doc, "download")} title="Download disabled until backend access control is verified" className="rounded-lg border border-slate-200 p-2 text-slate-400" aria-label={`Download ${name}`}>
                                <Download size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {filtered.map((doc) => {
                  const name = doc.documentName || doc.originalName || doc.fileName || "Document";
                  const status = statusOf(doc.status);
                  return (
                    <article key={doc.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-700"><FileText size={21} /></div>
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-semibold text-slate-900">{name}</p>
                          <p className="mt-1 text-xs text-slate-500">{doc.documentType || doc.category || "Other"} · {dateLabel(doc.createdAt)}</p>
                          <span className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusStyles[status]}`}>
                            {status === "VERIFIED" ? "Verified" : status === "REJECTED" ? "Rejected" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                        <button onClick={() => openFile(doc, "preview")} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-400">
                          <Eye size={16} /> Preview
                        </button>
                        <button onClick={() => openFile(doc, "download")} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-400">
                          <Download size={16} /> Download
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
            <span>Showing {loading ? "—" : filtered.length} of {loading ? "—" : documents.length} records</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Private document access requires server-side authorization</span>
          </div>
        </section>

        <div className="flex items-center justify-between gap-3 pb-4">
          <Link href="/customer/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700">
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <span className="text-xs text-slate-400">Customer Portal</span>
        </div>
      </div>
    </main>
  );
}

