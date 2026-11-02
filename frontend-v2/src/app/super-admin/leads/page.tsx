"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, Users, UserPlus, CheckCircle2, XCircle, Download,
  RefreshCw, Eye, X, ChevronLeft, ChevronRight, CalendarDays,
  Phone, Mail, MapPin, Filter, Plus, Target, Clock3
} from "lucide-react";
import api from "@/lib/api";

type Lead = {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  productType: string;
  source: string;
  status: string;
  priority?: string;
  loanAmount?: number | null;
  monthlyIncome?: number | null;
  assignedTo?: string | null;
  remarks?: string | null;
  createdAt: string;
};

type Analytics = {
  totalLeads?: number;
  newLeads?: number;
  assignedLeads?: number;
  convertedLeads?: number;
};

const statusStyle: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  CONTACTED: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  FOLLOW_UP: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  CONVERTED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  APPROVED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  DISBURSED: "bg-green-500/10 text-green-300 border-green-500/30",
  REJECTED: "bg-rose-500/10 text-rose-300 border-rose-500/30",
};

const pretty = (value?: string | null) =>
  value ? value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : "—";

const dateText = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
};

export default function AllLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [product, setProduct] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "", mobileNumber: "", email: "",
    productType: "PERSONAL_LOAN", source: "WEBSITE",
    loanAmount: "", city: "", remarks: ""
  });

  const pageSize = 10;

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [listResponse, analyticsResponse] = await Promise.all([
        api.get("/lead", {
          params: { page, limit: pageSize, search: search.trim(), status }
        }),
        api.get("/lead/analytics")
      ]);

      const result = listResponse.data;
      if (!result?.success || !Array.isArray(result.data)) {
        throw new Error(result?.message || "Invalid leads response");
      }

      setLeads(result.data);
      setTotal(Number(result.total ?? result.data.length));
      setTotalPages(Math.max(1, Number(result.totalPages ?? 1)));

      const a = analyticsResponse.data?.data || analyticsResponse.data || {};
      setAnalytics({
        totalLeads: Number(a.totalLeads ?? 0),
        newLeads: Number(a.newLeads ?? 0),
        assignedLeads: Number(a.assignedLeads ?? 0),
        convertedLeads: Number(a.convertedLeads ?? 0)
      });
    } catch (err: any) {
      setLeads([]);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load leads. Check backend server and permissions."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => loadLeads(), 300);
    return () => window.clearTimeout(timer);
  }, [loadLeads]);

  const sources = useMemo(
    () => Array.from(new Set(leads.map(l => l.source).filter(Boolean))),
    [leads]
  );

  const products = useMemo(
    () => Array.from(new Set(leads.map(l => l.productType).filter(Boolean))),
    [leads]
  );

  const visibleLeads = leads.filter(l =>
    (!source || l.source === source) &&
    (!product || l.productType === product)
  );

  const exportCsv = () => {
    const rows = [
      ["Lead ID", "Customer Name", "Mobile", "Email", "Loan Type", "Source", "Status", "Priority", "Assigned To", "Created Date"],
      ...visibleLeads.map(l => [
        l.id, l.fullName, l.mobileNumber, l.email || "",
        l.productType, l.source, l.status, l.priority || "",
        l.assignedTo || "", dateText(l.createdAt)
      ])
    ];
    const csv = rows.map(row =>
      row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-leads-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const createLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/lead", {
        ...form,
        loanAmount: form.loanAmount ? Number(form.loanAmount) : undefined
      });
      setShowCreate(false);
      setForm({
        fullName: "", mobileNumber: "", email: "",
        productType: "PERSONAL_LOAN", source: "WEBSITE",
        loanAmount: "", city: "", remarks: ""
      });
      setPage(1);
      await loadLeads();
    } catch (err: any) {
      window.alert(err?.response?.data?.message || "Unable to create lead.");
    } finally {
      setSaving(false);
    }
  };

  const cards = [
    { label: "Total Leads", value: analytics.totalLeads ?? total, icon: Users, color: "blue" },
    { label: "New Leads", value: analytics.newLeads ?? 0, icon: UserPlus, color: "violet" },
    { label: "Assigned Leads", value: analytics.assignedLeads ?? 0, icon: Target, color: "amber" },
    { label: "Converted Leads", value: analytics.convertedLeads ?? 0, icon: CheckCircle2, color: "green" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-100",
    violet: "bg-violet-500/10 text-violet-600 border-violet-100",
    amber: "bg-amber-500/10 text-amber-600 border-amber-100",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-100"
  };

  return (
    <div className="min-h-screen bg-[#071426] p-4 sm:p-6 lg:p-8 text-slate-100">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 text-sm text-slate-400">
              Super Admin <span className="mx-2">›</span> Lead &amp; CRM <span className="mx-2">›</span>
              <span className="font-semibold text-slate-100">All Leads</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">All Leads</h1>
            <p className="mt-1 text-sm text-slate-400">Manage, track and monitor all customer leads in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              <Plus size={18} /> Add New Lead
            </button>
            <button onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#101f33] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-[#1a2c43]">
              <Download size={17} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border p-5 shadow-sm ${colorMap[color]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-100">{value.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-full bg-[#101f33]/80 p-3"><Icon size={24} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-700 bg-[#101f33] p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_1fr_1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, mobile, email..."
                className="w-full rounded-xl border border-slate-700 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-700 bg-[#101f33] px-3 py-3 text-sm outline-none focus:border-blue-500">
              <option value="">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="CONVERTED">Converted</option>
              <option value="APPROVED">Approved</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select value={source} onChange={e => setSource(e.target.value)}
              className="rounded-xl border border-slate-700 bg-[#101f33] px-3 py-3 text-sm outline-none">
              <option value="">All Sources (this page)</option>
              {sources.map(s => <option key={s} value={s}>{pretty(s)}</option>)}
            </select>
            <select value={product} onChange={e => setProduct(e.target.value)}
              className="rounded-xl border border-slate-700 bg-[#101f33] px-3 py-3 text-sm outline-none">
              <option value="">All Loan Types (this page)</option>
              {products.map(p => <option key={p} value={p}>{pretty(p)}</option>)}
            </select>
            <button onClick={() => { setSearch(""); setStatus(""); setSource(""); setProduct(""); setPage(1); }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-[#1a2c43]">
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            ["", "All Leads"], ["NEW", "New"], ["CONTACTED", "Contacted"],
            ["FOLLOW_UP", "Follow-up"], ["CONVERTED", "Converted"], ["REJECTED", "Rejected"]
          ].map(([value, label]) => (
            <button key={value} onClick={() => { setStatus(value); setPage(1); }}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                status === value ? "bg-blue-600 text-white shadow-sm" : "border border-slate-700 bg-[#101f33] text-slate-300 hover:bg-[#1a2c43]"
              }`}>{label}</button>
          ))}
          <span className="ml-auto text-sm text-slate-400"><Filter size={15} className="mr-1 inline" /> {total.toLocaleString("en-IN")} leads</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#101f33] shadow-xl shadow-black/20">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <h2 className="font-bold text-cyan-300">Lead Records</h2>
              <p className="mt-0.5 text-xs text-slate-400">Live records from your CRM database</p>
            </div>
            <button onClick={loadLeads} className="rounded-lg p-2 text-slate-400 hover:bg-[#243952]" title="Refresh">
              <RefreshCw size={17} />
            </button>
          </div>

          {error && <div className="m-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#071426] text-xs uppercase tracking-wider text-cyan-300 font-bold">
                <tr>
                  <th className="px-5 py-4">Lead ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Loan Type</th>
                  <th className="px-5 py-4">Lead Source</th>
                  <th className="px-5 py-4">Assigned To</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created Date</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan={9} className="px-5 py-16 text-center text-slate-400">
                    <RefreshCw className="mx-auto mb-3 animate-spin" size={24} /> Loading leads...
                  </td></tr>
                ) : visibleLeads.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-16 text-center text-slate-400">
                    <Users className="mx-auto mb-3 text-slate-400" size={32} />
                    <p className="font-semibold text-slate-200">No leads found</p>
                    <p className="mt-1 text-xs">Try changing your search or filters.</p>
                  </td></tr>
                ) : visibleLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-[#1a2c43]/80">
                    <td className="px-5 py-4 font-semibold text-blue-300" title={lead.id}>
                      {lead.id.length > 12 ? `LD-${lead.id.slice(-7).toUpperCase()}` : lead.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{lead.fullName}</div>
                      <div className="mt-0.5 text-xs text-violet-300">{lead.email || "No email"}</div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-cyan-200 font-medium">{lead.mobileNumber}</td>
                    <td className="px-5 py-4 text-amber-200 font-medium">{pretty(lead.productType)}</td>
                    <td className="px-5 py-4 text-fuchsia-300 font-medium">{pretty(lead.source)}</td>
                    <td className="px-5 py-4 text-sky-300">{lead.assignedTo || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[lead.status] || "border-slate-700 bg-[#071426] text-slate-300"}`}>
                        {pretty(lead.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-emerald-300">{dateText(lead.createdAt)}</td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => setSelected(lead)} title="View lead details"
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-500/10 hover:text-blue-300">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total.toLocaleString("en-IN")} leads
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
              <button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)}
                className="rounded-lg border border-slate-700 p-2 disabled:opacity-40"><ChevronLeft size={17} /></button>
              <button disabled={page >= totalPages || loading} onClick={() => setPage(p => p + 1)}
                className="rounded-lg border border-slate-700 p-2 disabled:opacity-40"><ChevronRight size={17} /></button>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#101f33] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div><h2 className="text-lg font-bold text-cyan-300">Lead Details</h2><p className="text-xs text-slate-400">{selected.id}</p></div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-[#243952]"><X size={20} /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {[
                ["Customer Name", selected.fullName],
                ["Mobile Number", selected.mobileNumber],
                ["Email", selected.email],
                ["Loan Type", pretty(selected.productType)],
                ["Lead Source", pretty(selected.source)],
                ["Status", pretty(selected.status)],
                ["Priority", pretty(selected.priority)],
                ["Assigned To", selected.assignedTo],
                ["Loan Amount", selected.loanAmount ? `₹${selected.loanAmount.toLocaleString("en-IN")}` : "—"],
                ["Monthly Income", selected.monthlyIncome ? `₹${selected.monthlyIncome.toLocaleString("en-IN")}` : "—"],
                ["City / State", [selected.city, selected.state].filter(Boolean).join(", ")],
                ["Pincode", selected.pincode],
                ["Created Date", dateText(selected.createdAt)],
                ["Remarks", selected.remarks]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#071426] p-3">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-100">{value || "—"}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end border-t border-slate-800 p-4">
              <button onClick={() => setSelected(null)} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setShowCreate(false)}>
          <form onSubmit={createLead} onClick={e => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-[#101f33] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-cyan-300">Add New Lead</h2><p className="text-sm text-slate-400">Create a customer lead in CRM</p></div>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg p-2 hover:bg-[#243952]"><X size={20} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Customer Name *
                <input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 px-3 py-2.5 font-normal" />
              </label>
              <label className="text-sm font-medium">Mobile Number *
                <input required value={form.mobileNumber} onChange={e => setForm({ ...form, mobileNumber: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 px-3 py-2.5 font-normal" />
              </label>
              <label className="text-sm font-medium">Email
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 px-3 py-2.5 font-normal" />
              </label>
              <label className="text-sm font-medium">Loan Type *
                <select value={form.productType} onChange={e => setForm({ ...form, productType: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#101f33] px-3 py-2.5 font-normal">
                  <option value="PERSONAL_LOAN">Personal Loan</option><option value="BUSINESS_LOAN">Business Loan</option><option value="HOME_LOAN">Home Loan</option><option value="LOAN_AGAINST_PROPERTY">Loan Against Property</option><option value="CAR_LOAN">Car Loan</option><option value="EDUCATION_LOAN">Education Loan</option>
                </select>
              </label>
              <label className="text-sm font-medium">Lead Source *
                <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#101f33] px-3 py-2.5 font-normal">
                  <option value="WEBSITE">Website</option><option value="REFERRAL">Referral</option><option value="GOOGLE_ADS">Google Ads</option><option value="FACEBOOK_ADS">Facebook Ads</option><option value="CAMPAIGN">Campaign</option><option value="WALK_IN">Walk-in</option><option value="OTHER">Other</option>
                </select>
              </label>
              <label className="text-sm font-medium">Loan Amount
                <input type="number" min="0" value={form.loanAmount} onChange={e => setForm({ ...form, loanAmount: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 px-3 py-2.5 font-normal" />
              </label>
              <label className="text-sm font-medium">City
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 px-3 py-2.5 font-normal" />
              </label>
              <label className="text-sm font-medium sm:col-span-2">Remarks
                <textarea rows={3} value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 px-3 py-2.5 font-normal" />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Create Lead"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


