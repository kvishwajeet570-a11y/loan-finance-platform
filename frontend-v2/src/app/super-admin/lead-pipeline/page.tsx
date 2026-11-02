"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, RefreshCw, Users, Phone, Mail, MapPin,
  CalendarDays, IndianRupee, ArrowUpRight, Clock3,
  CheckCircle2, AlertCircle, Filter, Layers
} from "lucide-react";
import api from "@/lib/api";

type Lead = {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  productType?: string;
  source?: string;
  status: string;
  priority?: string;
  loanAmount?: number | null;
  assignedTo?: string | null;
  createdAt: string;
};

const stages = [
  { key: "NEW", label: "New Leads", color: "blue", accent: "border-blue-400", dot: "bg-blue-400" },
  { key: "CONTACTED", label: "Contacted", color: "amber", accent: "border-amber-400", dot: "bg-amber-400" },
  { key: "FOLLOW_UP", label: "Follow Up", color: "violet", accent: "border-violet-400", dot: "bg-violet-400" },
  { key: "CONVERTED", label: "Converted", color: "cyan", accent: "border-cyan-400", dot: "bg-cyan-400" },
  { key: "APPROVED", label: "Approved", color: "emerald", accent: "border-emerald-400", dot: "bg-emerald-400" },
  { key: "DISBURSED", label: "Disbursed", color: "green", accent: "border-green-400", dot: "bg-green-400" },
  { key: "REJECTED", label: "Rejected", color: "rose", accent: "border-rose-400", dot: "bg-rose-400" },
];

const stageStyles: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  CONTACTED: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  FOLLOW_UP: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  CONVERTED: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  DISBURSED: "bg-green-500/10 text-green-300 border-green-500/20",
  REJECTED: "bg-rose-500/10 text-rose-300 border-rose-500/20",
};

const pretty = (value?: string | null) =>
  value ? value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : "—";

const money = (value?: number | null) =>
  value == null ? "—" : "₹" + Number(value).toLocaleString("en-IN");

const dateLabel = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function LeadPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const first = await api.get("/lead", {
        params: { page: 1, limit: 100 }
      });

      const result = first.data;
      if (!result?.success || !Array.isArray(result.data)) {
        throw new Error(result?.message || "Invalid leads response");
      }

      const pages = Math.max(1, Number(result.totalPages ?? 1));
      let allLeads: Lead[] = result.data;

      if (pages > 1) {
        const remaining = await Promise.all(
          Array.from({ length: pages - 1 }, (_, index) =>
            api.get("/lead", {
              params: { page: index + 2, limit: 100 }
            })
          )
        );

        for (const response of remaining) {
          if (Array.isArray(response.data?.data)) {
            allLeads = allLeads.concat(response.data.data);
          }
        }
      }

      setLeads(allLeads);
    } catch (err: any) {
      setLeads([]);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load leads. Please check server and permissions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return leads;

    return leads.filter(lead =>
      [
        lead.fullName,
        lead.mobileNumber,
        lead.email,
        lead.city,
        lead.productType,
        lead.source,
        lead.status
      ].some(value => String(value ?? "").toLowerCase().includes(query))
    );
  }, [leads, search]);

  const updateStatus = async (lead: Lead, nextStatus: string) => {
    if (!nextStatus || nextStatus === lead.status || updatingId) return;

    setUpdatingId(lead.id);
    setNotice("");
    try {
      await api.patch(`/lead/${lead.id}/status`, { status: nextStatus });
      setLeads(current =>
        current.map(item =>
          item.id === lead.id ? { ...item, status: nextStatus } : item
        )
      );
      setNotice(`${lead.fullName}: moved to ${pretty(nextStatus)}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Status update failed. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalValue = filteredLeads.reduce(
    (sum, lead) => sum + Number(lead.loanAmount || 0), 0
  );

  return (
    <main className="min-h-screen bg-[#080f1e] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#142b50] via-[#10213d] to-[#101827] p-6 shadow-2xl sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-300">
                <Layers size={17} />
                LEAD MANAGEMENT / PIPELINE
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Lead Pipeline
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Track every lead, monitor progress and manage your conversion journey.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadLeads}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <div className="rounded-xl border border-blue-300/20 bg-blue-400/10 px-5 py-3">
                <p className="text-xs text-blue-200">Total Leads</p>
                <p className="mt-1 text-2xl font-bold">{leads.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#111d30] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Leads</span>
              <Users className="text-blue-400" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">{leads.length}</p>
            <p className="mt-1 text-xs text-slate-500">All loaded records</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111d30] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Active Pipeline</span>
              <Clock3 className="text-violet-400" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {leads.filter(l => ["NEW", "CONTACTED", "FOLLOW_UP"].includes(l.status)).length}
            </p>
            <p className="mt-1 text-xs text-slate-500">New, contacted and follow-up</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111d30] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Successful Leads</span>
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {leads.filter(l => ["CONVERTED", "APPROVED", "DISBURSED"].includes(l.status)).length}
            </p>
            <p className="mt-1 text-xs text-slate-500">Converted, approved and disbursed</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111d30] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Loan Value</span>
              <IndianRupee className="text-amber-400" size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold">{money(totalValue)}</p>
            <p className="mt-1 text-xs text-slate-500">Value of filtered leads</p>
          </div>
        </section>

        {notice && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={17} />
            {notice}
            <button onClick={() => setNotice("")} className="ml-auto text-emerald-200">Dismiss</button>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto">Dismiss</button>
          </div>
        )}

        <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111d30] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Pipeline Board</h2>
            <p className="mt-1 text-xs text-slate-500">Search and update lead stages from each card.</p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, phone, city, product..."
              className="w-full rounded-xl border border-white/10 bg-[#0b1526] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50"
            />
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-white/10 bg-[#111d30]">
            <div className="text-center">
              <RefreshCw className="mx-auto animate-spin text-blue-400" size={28} />
              <p className="mt-3 text-sm text-slate-400">Loading real leads...</p>
            </div>
          </div>
        ) : error && leads.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#111d30] p-10 text-center text-slate-400">
            No lead records could be loaded.
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-5">
            {stages.map(stage => {
              const items = filteredLeads.filter(lead => lead.status === stage.key);

              return (
                <section
                  key={stage.key}
                  className="w-[290px] min-w-[290px] overflow-hidden rounded-2xl border border-white/10 bg-[#101b2d] sm:w-[310px] sm:min-w-[310px]"
                >
                  <div className={`border-t-2 ${stage.accent} border-b border-b-white/10 bg-white/[0.025] p-4`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${stage.dot}`} />
                        <h3 className="text-sm font-bold">{stage.label}</h3>
                      </div>
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
                        {items.length}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {items.length === 1 ? "1 lead" : `${items.length} leads`}
                    </p>
                  </div>

                  <div className="max-h-[680px] min-h-[180px] space-y-3 overflow-y-auto p-3">
                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 px-3 py-8 text-center">
                        <Users className="mx-auto text-slate-600" size={23} />
                        <p className="mt-2 text-xs text-slate-500">No leads in this stage</p>
                      </div>
                    ) : items.map(lead => (
                      <article
                        key={lead.id}
                        className="group rounded-xl border border-white/10 bg-[#17243a] p-4 transition hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-[#1a2a43]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-bold text-white">{lead.fullName || "Unnamed Lead"}</h4>
                            <p className="mt-1 text-[11px] text-slate-500">ID: {lead.id.slice(-8)}</p>
                          </div>
                          {lead.priority && (
                            <span className="shrink-0 rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold text-amber-300">
                              {pretty(lead.priority)}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 space-y-2 text-xs text-slate-400">
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="shrink-0 text-blue-400" />
                            <span>{lead.mobileNumber || "No phone"}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={13} className="shrink-0 text-violet-400" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          )}
                          {(lead.city || lead.state) && (
                            <div className="flex items-center gap-2">
                              <MapPin size={13} className="shrink-0 text-rose-400" />
                              <span className="truncate">{[lead.city, lead.state].filter(Boolean).join(", ")}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <CalendarDays size={13} className="shrink-0 text-amber-400" />
                            <span>{dateLabel(lead.createdAt)}</span>
                          </div>
                        </div>

                        <div className="mt-4 rounded-lg border border-white/5 bg-[#0d1728] p-3">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Loan Amount</p>
                          <p className="mt-1 text-base font-bold text-emerald-300">{money(lead.loanAmount)}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {lead.productType && (
                              <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] text-blue-300">
                                {pretty(lead.productType)}
                              </span>
                            )}
                            {lead.source && (
                              <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400">
                                {pretty(lead.source)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Update Lead Stage
                          </label>
                          <select
                            value={lead.status}
                            disabled={updatingId === lead.id || !!updatingId}
                            onChange={e => updateStatus(lead, e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2.5 text-xs font-semibold outline-none transition disabled:opacity-50 ${stageStyles[lead.status] || "border-white/10 bg-[#0d1728] text-slate-300"}`}
                          >
                            {stages.map(option => (
                              <option key={option.key} value={option.key} className="bg-[#111d30] text-white">
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {updatingId === lead.id && (
                            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-300">
                              <RefreshCw size={12} className="animate-spin" /> Updating status...
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {!loading && (
          <p className="text-center text-xs text-slate-500">
            Showing {filteredLeads.length} of {leads.length} loaded leads
          </p>
        )}
      </div>
    </main>
  );
}
