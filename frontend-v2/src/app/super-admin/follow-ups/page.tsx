"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, ArrowUpRight, CalendarClock, Check,
  CheckCircle2, Clock3, Filter, ListTodo, Loader2, MessageCircle,
  MoreHorizontal, Plus, RefreshCw, Search, Trash2, UserRound,
  X, CalendarDays, Phone, Mail, Video, ChevronDown
} from "lucide-react";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";

import { SiGooglemeet } from "react-icons/si";
import api from "@/lib/api";

type Lead = {
  id: string;
  fullName: string;
  mobileNumber: string;
  productType?: string;
  status?: string;
};

type FollowUp = {
  id: string;
  leadId: string;
  type: string;
  scheduledAt: string;
  remarks?: string | null;
  outcome?: string | null;
  status: string;
  completedAt?: string | null;
  lead?: Lead;
};

type Stats = {
  pending: number;
  completed: number;
  overdue: number;
  dueToday: number;
};

const emptyStats: Stats = {
  pending: 0, completed: 0, overdue: 0, dueToday: 0
};

const typeOptions = [
  { value: "CALL", label: "Phone Call", icon: FaPhoneAlt },
  { value: "WHATSAPP", label: "WhatsApp", icon: FaWhatsapp },
  { value: "EMAIL", label: "Email", icon: FaEnvelope },
  { value: "MEETING", label: "Meeting", icon: SiGooglemeet },
];

const formatDate = (value?: string) => {
  if (!value) return "Ã¢â‚¬â€";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Ã¢â‚¬â€";
  return date.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

const localInputDate = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const extractRows = (response: any): any[] => {
  const d = response?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.leads)) return d.leads;
  return [];
};

const statusStyle: Record<string, string> = {
  PENDING: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  COMPLETED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  CANCELLED: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

const typeStyle: Record<string, string> = {
  CALL: "bg-cyan-400/10 text-cyan-300",
  WHATSAPP: "bg-emerald-400/10 text-emerald-300",
  EMAIL: "bg-violet-400/10 text-violet-300",
  MEETING: "bg-fuchsia-400/10 text-fuchsia-300",
};

export default function FollowUpsPage() {
  const [items, setItems] = useState<FollowUp[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<FollowUp | null>(null);
  const [leadId, setLeadId] = useState("");
  const [type, setType] = useState("CALL");
  const [scheduledAt, setScheduledAt] = useState(localInputDate(new Date(Date.now() + 60 * 60 * 1000)));
  const [remarks, setRemarks] = useState("");
  const [outcome, setOutcome] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = {};
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (due) params.due = due;

      const response = await api.get("/super-admin/follow-ups", { params });
      const payload = response.data || {};
      setItems(Array.isArray(payload.data) ? payload.data : []);
      setStats({ ...emptyStats, ...(payload.stats || {}) });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Follow-ups load nahi ho paaye. Backend API check karein.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, due]);

  const loadLeads = useCallback(async () => {
    try {
      const response = await api.get("/lead", { params: { page: 1, limit: 200 } });
      setLeads(extractRows(response).filter((lead: any) => lead.id && !lead.isDeleted));
    } catch {
      setLeads([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { void loadData(); }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const openCreate = () => {
    setSelected(null);
    setLeadId("");
    setType("CALL");
    setScheduledAt(localInputDate(new Date(Date.now() + 60 * 60 * 1000)));
    setRemarks("");
    setOutcome("");
    setShowModal(true);
  };

  const openEdit = (item: FollowUp) => {
    setSelected(item);
    setLeadId(item.leadId);
    setType(item.type);
    setScheduledAt(localInputDate(new Date(item.scheduledAt)));
    setRemarks(item.remarks || "");
    setOutcome(item.outcome || "");
    setShowModal(true);
  };

  const saveFollowUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected && !leadId) {
      setError("Please select a lead.");
      return;
    }
    if (!scheduledAt) {
      setError("Please select follow-up date and time.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        leadId,
        type,
        scheduledAt: new Date(scheduledAt).toISOString(),
        remarks,
        outcome,
      };

      if (selected) {
        await api.patch(`/super-admin/follow-ups/${selected.id}`, payload);
        setNotice("Follow-up updated successfully.");
      } else {
        await api.post("/super-admin/follow-ups", payload);
        setNotice("New follow-up scheduled successfully.");
      }

      setShowModal(false);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Follow-up save nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  const completeFollowUp = async (item: FollowUp) => {
    const result = window.prompt("Completion outcome / notes (optional):", item.outcome || "");
    if (result === null) return;

    try {
      await api.patch(`/super-admin/follow-ups/${item.id}`, {
        status: "COMPLETED",
        outcome: result,
      });
      setNotice("Follow-up marked as completed.");
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not complete follow-up.");
    }
  };

  const deleteFollowUp = async (item: FollowUp) => {
    if (!window.confirm(`Delete follow-up for ${item.lead?.fullName || "this lead"}?`)) return;
    try {
      await api.delete(`/super-admin/follow-ups/${item.id}`);
      setNotice("Follow-up deleted.");
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not delete follow-up.");
    }
  };

  const visibleCount = useMemo(() => items.length, [items]);

  const kpis = [
    { label: "Due Today", value: stats.dueToday, icon: CalendarClock, color: "cyan", note: "Scheduled for today" },
    { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "rose", note: "Needs attention" },
    { label: "Pending", value: stats.pending, icon: Clock3, color: "amber", note: "Open follow-ups" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "emerald", note: "Successfully closed" },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-[#080d19] p-4 text-white sm:p-6 lg:p-8">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-[#14213b] via-[#111a31] to-[#21143b] p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-wider text-cyan-200">
              <Activity size={14} /> CRM MANAGEMENT
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Follow-Up Center</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Manage lead callbacks, reminders and customer communication from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { void loadData(); }} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-950/40 transition hover:brightness-110">
              <Plus size={17} /> New Follow-Up
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          <span className="flex items-center gap-2"><CheckCircle2 size={17} /> {notice}</span>
          <button onClick={() => setNotice("")}><X size={16} /></button>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          <span className="flex items-center gap-2"><AlertCircle size={17} /> {error}</span>
          <button onClick={() => setError("")}><X size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          const colors: Record<string, string> = {
            cyan: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
            rose: "text-rose-300 bg-rose-400/10 border-rose-400/20",
            amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
            emerald: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
          };
          return (
            <div key={item.label} className="rounded-2xl border border-white/[0.07] bg-[#101827] p-5 transition hover:-translate-y-0.5 hover:border-white/15">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                </div>
                <div className={`rounded-xl border p-3 ${colors[item.color]}`}><Icon size={21} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101827]">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold"><ListTodo size={19} className="text-cyan-300" /> Follow-Up Schedule</h2>
            <p className="mt-1 text-xs text-slate-500">{visibleCount} records shown Ã‚Â· Live database records</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lead name or mobile..." className="w-full rounded-xl border border-white/10 bg-[#0b1220] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50" />
            </div>
            <select value={due} onChange={e => { setDue(e.target.value); setStatus(""); }} className="rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-400/50">
              <option value="">All dates</option>
              <option value="today">Due Today</option>
              <option value="overdue">Overdue</option>
            </select>
            <select value={status} onChange={e => { setStatus(e.target.value); setDue(""); }} className="rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-400/50">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin text-cyan-300" size={28} />
            <p className="text-sm">Loading follow-ups...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4 text-cyan-300"><CalendarDays size={30} /></div>
            <h3 className="text-base font-semibold text-slate-200">No follow-ups found</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">No records match the current filters. Create a follow-up for an existing lead to get started.</p>
            <button onClick={openCreate} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-400"><Plus size={16} /> Schedule Follow-Up</button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-white/[0.025] text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Lead Details</th>
                    <th className="px-5 py-4 font-semibold">Follow-Up Type</th>
                    <th className="px-5 py-4 font-semibold">Scheduled At</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Remarks</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {items.map(item => {
                    const overdue = item.status === "PENDING" && new Date(item.scheduledAt) < new Date();
                    const TypeIcon = typeOptions.find(t => t.value === item.type)?.icon || Phone;
                    return (
                      <tr key={item.id} className="transition hover:bg-white/[0.025]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-sm font-bold text-cyan-200">{(item.lead?.fullName || "L").slice(0, 1).toUpperCase()}</div>
                            <div>
                              <p className="font-semibold text-slate-100">{item.lead?.fullName || "Lead unavailable"}</p>
                              <p className="mt-1 text-xs text-slate-500">{item.lead?.mobileNumber || "Ã¢â‚¬â€"} Ã‚Â· {item.lead?.productType || "Ã¢â‚¬â€"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${typeStyle[item.type] || "bg-slate-500/10 text-slate-300"}`}><TypeIcon size={13} /> {item.type}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`text-sm font-medium ${overdue ? "text-rose-300" : "text-slate-200"}`}>{formatDate(item.scheduledAt)}</p>
                          {overdue && <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-rose-400">Overdue</p>}
                        </td>
                        <td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyle[item.status] || statusStyle.PENDING}`}>{item.status}</span></td>
                        <td className="max-w-48 px-5 py-4 text-xs text-slate-400"><p className="line-clamp-2">{item.remarks || "No remarks added"}</p></td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {item.status === "PENDING" && <button title="Mark completed" onClick={() => void completeFollowUp(item)} className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-300 hover:bg-emerald-400/20"><Check size={15} /></button>}
                            <button title="Edit / Reschedule" onClick={() => openEdit(item)} className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300 hover:bg-cyan-400/20"><CalendarClock size={15} /></button>
                            <button title="Delete" onClick={() => void deleteFollowUp(item)} className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-2 text-rose-300 hover:bg-rose-400/20"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 p-4 md:hidden">
              {items.map(item => {
                const overdue = item.status === "PENDING" && new Date(item.scheduledAt) < new Date();
                return (
                  <article key={item.id} className="rounded-xl border border-white/[0.08] bg-[#0b1220] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{item.lead?.fullName || "Lead unavailable"}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.lead?.mobileNumber || "Ã¢â‚¬â€"} Ã‚Â· {item.lead?.productType || "Ã¢â‚¬â€"}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${statusStyle[item.status] || statusStyle.PENDING}`}>{item.status}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`rounded-lg px-2 py-1 ${typeStyle[item.type] || "bg-slate-500/10 text-slate-300"}`}>{item.type}</span>
                      <span className={overdue ? "text-rose-300" : "text-slate-400"}>{formatDate(item.scheduledAt)}</span>
                    </div>
                    {item.remarks && <p className="mt-3 text-xs text-slate-400">{item.remarks}</p>}
                    <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-3">
                      {item.status === "PENDING" && <button onClick={() => void completeFollowUp(item)} className="flex-1 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">Complete</button>}
                      <button onClick={() => openEdit(item)} className="flex-1 rounded-lg bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300">Reschedule</button>
                      <button onClick={() => void deleteFollowUp(item)} className="rounded-lg bg-rose-400/10 px-3 py-2 text-rose-300"><Trash2 size={15} /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-md sm:p-6">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/50 bg-white shadow-[0_25px_100px_rgba(0,0,0,0.45)]">

            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-6 text-white sm:px-8">
              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg">
                    <CalendarDays size={29} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold sm:text-2xl">
                      {selected ? "Update Follow-Up" : "Schedule New Follow-Up"}
                    </h2>
                    <p className="mt-1 text-sm text-blue-100">
                      Manage customer communication and reminders
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-xl bg-white/15 p-2.5 transition hover:bg-white/25">
                  <X size={21} />
                </button>
              </div>
            </div>

            <form onSubmit={saveFollowUp} className="space-y-6 p-5 sm:p-8">

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                  <UserRound size={17} className="text-blue-600" />
                  Select Customer / Lead <span className="text-rose-500">*</span>
                </label>
                <select required value={leadId} disabled={!!selected}
                  onChange={e => setLeadId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60">
                  <option value="">Choose an existing lead</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.fullName} Ã‚Â· {lead.mobileNumber} Ã‚Â· {lead.productType || "Loan"}
                    </option>
                  ))}
                </select>
                {leadId && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {(leads.find(l => l.id === leadId)?.fullName || "L").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {leads.find(l => l.id === leadId)?.fullName || "Selected Lead"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {leads.find(l => l.id === leadId)?.mobileNumber || ""}
                      </p>
                    </div>
                    <CheckCircle2 className="ml-auto text-emerald-500" size={20} />
                  </div>
                )}
                {leads.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">Lead list could not be loaded. Check the Lead API.</p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Choose Follow-Up Method <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {typeOptions.map(option => {
                    const Icon = option.icon;
                    const active = type === option.value;
                    const styles: Record<string, string> = {
                      CALL: active ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-100" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50",
                      WHATSAPP: active ? "border-green-500 bg-green-50 text-green-700 ring-4 ring-green-100" : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:bg-green-50",
                      EMAIL: active ? "border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-100" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50",
                      MEETING: active ? "border-violet-500 bg-violet-50 text-violet-700 ring-4 ring-violet-100" : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                    };
                    const iconColors: Record<string, string> = {
                      CALL: "text-emerald-600",
                      WHATSAPP: "text-green-600",
                      EMAIL: "text-blue-600",
                      MEETING: "text-violet-600"
                    };
                    return (
                      <button type="button" key={option.value}
                        onClick={() => setType(option.value)}
                        className={`relative flex min-h-[108px] flex-col items-center justify-center gap-3 rounded-2xl border-2 p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles[option.value]}`}>
                        <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ${iconColors[option.value]}`}>
                          {option.value === "MEETING" ? (
                            <svg viewBox="0 0 48 40" width="32" height="29" aria-label="Meeting video icon">
                              <rect x="3" y="5" width="27" height="30" rx="7" fill="#00897B" />
                              <path d="M30 14 L44 6 Q47 5 47 9 L47 31 Q47 35 44 33 L30 26 Z" fill="#34A853" />
                              <path d="M3 12 Q3 5 10 5 H23 L12 18 H3 Z" fill="#4285F4" />
                              <path d="M3 28 L15 16 H30 V28 H17 L10 35 Q3 35 3 28 Z" fill="#EA4335" />
                              <path d="M17 28 H30 V35 H10 Z" fill="#FBBC04" />
                            </svg>
                          ) : (
                            <Icon size={30} />
                          )}
                        </span>
                        <span className="text-xs font-extrabold sm:text-sm">{option.label}</span>
                        {active && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check size={12} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                  <CalendarDays size={17} className="text-indigo-600" />
                  Date & Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input required type="datetime-local" value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" />
                </div>
                <p className="mt-2 text-xs text-slate-500">Select the date and time when you want to contact this lead.</p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                  <ListTodo size={17} className="text-violet-600" />
                  Remarks / Reminder Notes
                </label>
                <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)}
                  placeholder="Write call agenda, customer requirements or reminder details..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100" />
              </div>

              {selected && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <CheckCircle2 size={17} className="text-emerald-600" />
                    Outcome / Notes
                  </label>
                  <textarea rows={2} value={outcome} onChange={e => setOutcome(e.target.value)}
                    placeholder="Record customer response or follow-up outcome..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100">
                  Cancel
                </button>
                <button disabled={saving || (!selected && leads.length === 0)} type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? <Loader2 className="animate-spin" size={17} /> : <CheckCircle2 size={17} />}
                  {saving ? "Saving..." : selected ? "Save Changes" : "Create Follow-Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
