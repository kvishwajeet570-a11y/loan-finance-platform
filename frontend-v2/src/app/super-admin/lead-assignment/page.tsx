"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users, Layers, UserPlus, CheckCircle2, Search, RefreshCw,
  ChevronLeft, ChevronRight, UserRoundPlus, Clock3, Zap,
  Filter, RotateCcw, AlertCircle, Check, X
} from "lucide-react";
import api from "@/lib/api";

type Lead = {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string | null;
  productType: string;
  source: string;
  status: string;
  assignedTo?: string | null;
  createdAt: string;
  priority?: string;
};

type Recipient = {
  id: string;
  name: string;
  email?: string;
  role: string;
  kind: string;
};

const pretty = (v?: string) =>
  (v || "—").replace(/_/g, " ").toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

const extractRows = (response: any): any[] => {
  const d = response?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.users)) return d.users;
  if (Array.isArray(d?.dsas)) return d.dsas;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

const statusColors: Record<string, string> = {
  NEW: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
  CONTACTED: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  FOLLOW_UP: "bg-violet-400/10 text-violet-300 border-violet-400/30",
  CONVERTED: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  APPROVED: "bg-green-400/10 text-green-300 border-green-400/30",
  REJECTED: "bg-rose-400/10 text-rose-300 border-rose-400/30",
};

export default function LeadAssignmentPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [remarks, setRemarks] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [product, setProduct] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pageSize = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [leadRes, analyticsRes, dsaRes, userRes] = await Promise.all([
        api.get("/lead", { params: { page: 1, limit: 100 } }),
        api.get("/lead/analytics"),
        api.get("/dsa", { params: { page: 1, limit: 100 } }),
        api.get("/user", { params: { page: 1, limit: 100 } }),
      ]);

      const leadRows = extractRows(leadRes);
      setLeads(leadRows);
      setTotal(Number(leadRes.data?.total ?? leadRows.length));

      const a = analyticsRes.data?.data || analyticsRes.data || {};
      setAnalytics(a);

      const dsaRows = extractRows(dsaRes);
      const userRows = extractRows(userRes);

      const dsaOptions: Recipient[] = dsaRows
        .filter((d: any) => d.id)
        .map((d: any) => ({
          id: String(d.userId || d.user?.id || d.id),
          name: String(d.name || d.fullName || d.user?.name || d.businessName || "DSA Partner"),
          email: d.email || d.user?.email || "",
          role: "DSA",
          kind: "DSA",
        }));

      const userOptions: Recipient[] = userRows
        .filter((u: any) => u.id && !u.isBlocked)
        .filter((u: any) => !["CUSTOMER", "DSA"].includes(String(u.role || "").toUpperCase()))
        .map((u: any) => ({
          id: String(u.id),
          name: String(u.name || u.fullName || "Employee"),
          email: u.email || "",
          role: String(u.role || "EMPLOYEE"),
          kind: "EMPLOYEE",
        }));

      const unique = new Map<string, Recipient>();
      [...dsaOptions, ...userOptions].forEach(r => unique.set(r.id, r));
      setRecipients(Array.from(unique.values()));
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Unable to load assignment data. Check API permissions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const unassigned = useMemo(
    () => leads.filter(l => !l.assignedTo),
    [leads]
  );

  const assigned = useMemo(
    () => leads.filter(l => !!l.assignedTo),
    [leads]
  );

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        l.fullName?.toLowerCase().includes(q) ||
        l.mobileNumber?.includes(q) ||
        l.id?.toLowerCase().includes(q);

      const matchesStatus = !status || l.status === status;
      const matchesProduct = !product || l.productType === product;

      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [leads, search, status, product]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const assignLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !selectedRecipient) {
      setError("Please select a lead and an assignee.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.patch(`/lead/${selectedLead}/assign`, {
        assignedTo: selectedRecipient,
      });

      setSuccess("Lead assigned successfully.");
      setSelectedLead("");
      setSelectedRecipient("");
      setRemarks("");
      await loadData();
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        "Assignment failed. Please verify the selected DSA or user."
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedRecipientData = recipients.find(r => r.id === selectedRecipient);

  const stats = [
    {
      label: "Total Leads",
      value: analytics.totalLeads ?? total,
      icon: Users,
      color: "cyan",
      border: "border-cyan-400/40",
      bg: "from-cyan-500/15 to-blue-500/5",
      text: "text-cyan-300",
    },
    {
      label: "Unassigned",
      value: unassigned.length,
      icon: Layers,
      color: "purple",
      border: "border-fuchsia-400/40",
      bg: "from-fuchsia-500/15 to-purple-500/5",
      text: "text-fuchsia-300",
    },
    {
      label: "Assigned",
      value: assigned.length,
      icon: UserPlus,
      color: "orange",
      border: "border-amber-400/40",
      bg: "from-amber-500/15 to-orange-500/5",
      text: "text-amber-300",
    },
    {
      label: "Converted",
      value: analytics.convertedLeads ?? 0,
      icon: CheckCircle2,
      color: "green",
      border: "border-emerald-400/40",
      bg: "from-emerald-500/15 to-green-500/5",
      text: "text-emerald-300",
    },
  ];

  return (
    <div className="min-h-screen bg-[#061326] p-4 text-slate-100 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-[1700px] space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Central Control / Lead & CRM
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                Loan Assignment
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Assign leads to DSA partners and employees.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              disabled
              title="Assignment history API is not available yet"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-500"
            >
              <Clock3 size={17} /> Assignment History
            </button>
            <button
              disabled
              title="Bulk assignment API is not available yet"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-500"
            >
              <Users size={17} /> Bulk Assignment
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, border, bg, text: accent }) => (
            <div
              key={label}
              className={`rounded-2xl border ${border} bg-gradient-to-br ${bg} p-5 shadow-lg shadow-black/20`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${accent}`}>{label}</p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {Number(value).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className={`rounded-2xl border ${border} bg-slate-950/50 p-3 ${accent}`}>
                  <Icon size={25} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto">
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <Check size={18} /> {success}
          </div>
        )}

        <div className="grid items-start gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">

          <form
            onSubmit={assignLead}
            className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#102a46] to-[#0b1b30] shadow-xl shadow-cyan-950/20"
          >
            <div className="border-b border-cyan-500/20 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                  <UserRoundPlus size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-cyan-200">
                    Assign Loan / Leads
                  </h2>
                  <p className="text-xs text-slate-400">
                    Single lead assignment
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-cyan-200">
                  Assignment Type
                </label>
                <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-2 text-cyan-300">
                    <span className="h-3 w-3 rounded-full border-4 border-cyan-400 bg-white" />
                    Single Lead
                  </span>
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-3 w-3 rounded-full border border-slate-600" />
                    Bulk (coming soon)
                  </span>
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-3 w-3 rounded-full border border-slate-600" />
                    Auto (coming soon)
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Select Lead <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={selectedLead}
                  onChange={e => setSelectedLead(e.target.value)}
                  className="w-full rounded-xl border border-slate-600 bg-[#0a1b30] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="">Choose a lead to assign / reassign</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} · {l.mobileNumber}{l.assignedTo ? " · Currently assigned" : " · Unassigned"}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  {leads.length} leads available for assignment · {unassigned.length} currently unassigned
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Assign To <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={selectedRecipient}
                  onChange={e => setSelectedRecipient(e.target.value)}
                  className="w-full rounded-xl border border-slate-600 bg-[#0a1b30] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="">Select DSA / Employee</option>
                  {recipients.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} · {r.kind}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  {recipients.length} recipients returned by the API
                </p>
              </div>

              {selectedRecipientData && (
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3">
                  <p className="text-xs font-semibold text-violet-300">
                    SELECTED RECIPIENT
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {selectedRecipientData.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedRecipientData.role} {selectedRecipientData.email ? `· ${selectedRecipientData.email}` : ""}
                  </p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-600 bg-[#0a1b30] px-3 py-3 text-sm text-white outline-none focus:border-amber-400"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Priority is currently a form-only field; the assignment API does not accept it.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Optional assignment note..."
                  className="w-full resize-none rounded-xl border border-slate-600 bg-[#0a1b30] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Notes are not saved by the current assignment API.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving || loading || !selectedLead || !selectedRecipient}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-4 py-3 font-bold text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Zap size={18} />
                  {saving ? "Assigning..." : "Assign Lead"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLead("");
                    setSelectedRecipient("");
                    setPriority("MEDIUM");
                    setRemarks("");
                    setError("");
                    setSuccess("");
                  }}
                  className="rounded-xl border border-slate-600 px-4 text-slate-300 hover:bg-slate-800"
                  title="Reset"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </form>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0c1d32] shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                  <Users size={23} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-cyan-200">
                    Available Leads
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live records from CRM database
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                {filtered.length} Records
              </span>
            </div>

            <div className="grid gap-3 border-b border-slate-700 p-4 md:grid-cols-2 xl:grid-cols-[minmax(180px,1.5fr)_1fr_1fr_auto]">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search name, mobile, lead ID..."
                  className="w-full rounded-xl border border-slate-600 bg-[#071629] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>

              <select
                value={product}
                onChange={e => { setProduct(e.target.value); setPage(1); }}
                className="rounded-xl border border-slate-600 bg-[#071629] px-3 py-3 text-sm text-slate-200 outline-none"
              >
                <option value="">All Loan Types</option>
                {[...new Set(leads.map(l => l.productType))].filter(Boolean).map(p => (
                  <option key={p} value={p}>{pretty(p)}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={e => { setStatus(e.target.value); setPage(1); }}
                className="rounded-xl border border-slate-600 bg-[#071629] px-3 py-3 text-sm text-slate-200 outline-none"
              >
                <option value="">All Status</option>
                {[...new Set(leads.map(l => l.status))].filter(Boolean).map(s => (
                  <option key={s} value={s}>{pretty(s)}</option>
                ))}
              </select>

              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 py-3 text-sm font-semibold text-cyan-300 hover:bg-slate-800 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#102942] text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <tr>
                    <th className="px-4 py-4">Lead ID</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Mobile</th>
                    <th className="px-4 py-4">Loan Type</th>
                    <th className="px-4 py-4">Source</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-cyan-300">
                        <RefreshCw className="mx-auto mb-3 animate-spin" size={25} />
                        Loading live records...
                      </td>
                    </tr>
                  ) : pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                        <Filter className="mx-auto mb-3 text-slate-600" size={30} />
                        No matching leads found.
                      </td>
                    </tr>
                  ) : pageRows.map(l => (
                    <tr key={l.id} className="transition hover:bg-cyan-400/[0.04]">
                      <td className="whitespace-nowrap px-4 py-4 font-bold text-cyan-300">
                        {l.id.length > 12 ? `LD-${l.id.slice(-7).toUpperCase()}` : l.id}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-white">{l.fullName}</p>
                        <p className="mt-1 text-xs text-violet-300">{l.email || "No email"}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-cyan-200">
                        {l.mobileNumber}
                      </td>
                      <td className="px-4 py-4 text-amber-200">{pretty(l.productType)}</td>
                      <td className="px-4 py-4 text-fuchsia-300">{pretty(l.source)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-emerald-300">
                        {new Date(l.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[l.status] || "border-slate-600 bg-slate-800 text-slate-300"}`}>
                          {pretty(l.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            setSelectedLead(l.id);
                            setSelectedRecipient("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400/20"
                        >
                          <UserPlus size={14} /> {l.assignedTo ? "Reassign" : "Assign"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-700 px-5 py-4">
              <p className="text-xs text-slate-400">
                Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} loaded leads
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Page {page} / {totalPages}
                </span>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-lg border border-slate-700 p-2 text-cyan-300 disabled:opacity-30"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-lg border border-slate-700 p-2 text-cyan-300 disabled:opacity-30"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-xs leading-6 text-slate-400">
          <span className="font-bold text-violet-300">Backend capability note:</span>
          Single assignment uses the existing lead assignment endpoint.
          Bulk assignment, automatic distribution, assignment history, priority and remarks
          require additional backend support before they can be activated.
        </div>
      </div>
    </div>
  );
}

