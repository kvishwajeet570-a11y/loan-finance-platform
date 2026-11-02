"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle, ArrowUpRight, Building2, CalendarDays, Check, CheckCircle2,
  Clock3, Download, Eye, FileCheck2, Filter, Mail, MapPin, Phone,
  RefreshCw, Search, ShieldCheck, Users, X, XCircle
} from "lucide-react";

type Partner = {
  id: string;
  name?: string;
  companyName?: string;
  businessName?: string;
  partnerName?: string;
  contactPerson?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNo?: string;
  mobile?: string;
  partnerType?: string;
  businessType?: string;
  city?: string;
  state?: string;
  address?: string;
  status?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt?: string;
  partnerCode?: string;
  gstNumber?: string;
  panNumber?: string;
  website?: string;
  products?: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "loan_finance_token";

function unwrap(payload: any): Partner[] {
  const root = payload?.data ?? payload;
  const rows = Array.isArray(root) ? root : root?.partners ?? root?.items ?? root?.records ?? root?.data ?? [];
  return Array.isArray(rows) ? rows : [];
}
function partnerName(p: Partner) {
  return p.companyName || p.businessName || p.partnerName || p.name || p.contactPerson || p.fullName || "Unnamed Partner";
}
function statusOf(p: Partner) {
  if (p.isBlocked) return "BLOCKED";
  if (p.isVerified) return "APPROVED";
  return String(p.status || "PENDING").toUpperCase();
}
function dateOf(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PartnerApprovalsPage() {
  const [rows, setRows] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Partner | null>(null);

  const request = useCallback(async (path: string, init: RequestInit = {}) => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers || {})
      }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body?.success === false) {
      throw new Error(body?.message || `Request failed (${response.status})`);
    }
    return body;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const body = await request("/super-admin/partners");
      setRows(unwrap(body));
    } catch (e: any) {
      setError(e?.message || "Partner applications could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => { void load(); }, [load]);

  const counts = useMemo(() => {
    const result = { total: rows.length, pending: 0, approved: 0, rejected: 0, blocked: 0 };
    rows.forEach((p) => {
      const s = statusOf(p);
      if (s === "APPROVED" || s === "ACTIVE" || s === "VERIFIED") result.approved++;
      else if (s === "REJECTED") result.rejected++;
      else if (s === "BLOCKED" || s === "BLACKLISTED") result.blocked++;
      else result.pending++;
    });
    return result;
  }, [rows]);

  const filtered = useMemo(() => rows.filter((p) => {
    const s = statusOf(p);
    const matchesFilter = filter === "ALL" ||
      (filter === "PENDING" ? !["APPROVED", "ACTIVE", "VERIFIED", "REJECTED", "BLOCKED", "BLACKLISTED"].includes(s) :
       filter === "APPROVED" ? ["APPROVED", "ACTIVE", "VERIFIED"].includes(s) :
       filter === "REJECTED" ? s === "REJECTED" : ["BLOCKED", "BLACKLISTED"].includes(s));
    const haystack = [partnerName(p), p.contactPerson, p.email, p.phone, p.phoneNo, p.partnerCode, p.city, p.state].join(" ").toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase().trim());
  }), [rows, filter, query]);

  const approve = async (partner: Partner) => {
    if (!window.confirm(`Approve ${partnerName(partner)}?`)) return;
    setBusyId(partner.id);
    setError("");
    setNotice("");
    try {
      await request(`/super-admin/partners/${encodeURIComponent(partner.id)}/verify`, { method: "PATCH" });
      setNotice(`${partnerName(partner)} approved successfully.`);
      setSelected(null);
      await load();
    } catch (e: any) {
      setError(e?.message || "Approval failed.");
    } finally {
      setBusyId("");
    }
  };

  const exportCsv = () => {
    const header = ["Partner ID", "Business", "Contact Person", "Email", "Phone", "Type", "City", "State", "Status", "Applied Date"];
    const lines = filtered.map(p => [p.id, partnerName(p), p.contactPerson || p.fullName || "", p.email || "", p.phone || p.phoneNo || p.mobile || "", p.partnerType || p.businessType || "", p.city || "", p.state || "", statusOf(p), p.createdAt || ""].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    const csv = [header.join(","), ...lines].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.download = "partner-approvals.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const statusClass = (s: string) => {
    if (["APPROVED", "ACTIVE", "VERIFIED"].includes(s)) return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    if (s === "REJECTED") return "border-rose-400/20 bg-rose-400/10 text-rose-300";
    if (["BLOCKED", "BLACKLISTED"].includes(s)) return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  };

  return (
    <main className="partner-approval-page min-h-screen space-y-6 p-4 text-slate-100 sm:p-6 lg:p-8">
      <style jsx global>{`
        .partner-approval-page {
          background: radial-gradient(ellipse at 8% 0%,rgba(16,185,129,.13),transparent 34%),
            radial-gradient(ellipse at 94% 8%,rgba(20,184,166,.10),transparent 30%),#071713;
        }
        .partner-approval-page .approval-panel {
          border:1px solid rgba(110,231,183,.13);background:linear-gradient(145deg,rgba(15,38,32,.94),rgba(8,25,23,.94));
          box-shadow:0 18px 55px rgba(0,0,0,.16);
        }
        .partner-approval-page .approval-row:hover { background:rgba(16,185,129,.07); }
        .partner-approval-page input:focus,.partner-approval-page select:focus {
          outline:none;border-color:rgba(52,211,153,.65);box-shadow:0 0 0 3px rgba(16,185,129,.12);
        }
      `}</style>

      <section className="relative isolate overflow-hidden rounded-[28px] border border-emerald-300/20 bg-gradient-to-br from-[#104b3c] via-[#10352e] to-[#0b1c1b] p-6 shadow-2xl shadow-emerald-950/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl"/>
        <div className="pointer-events-none absolute bottom-[-100px] left-[35%] h-64 w-64 rounded-full bg-teal-400/10 blur-3xl"/>
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-200/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-100">
              <ShieldCheck size={14}/> Partner onboarding control
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Partner Approvals</h1>
            <p className="mt-3 text-sm leading-6 text-emerald-50/75">Review business partner applications, validate submitted information and control activation of your partner network.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-emerald-50">
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Application review</span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Business verification</span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Approval tracking</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15 disabled:opacity-50">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""}/> Refresh
            </button>
            <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-extrabold text-emerald-950 transition hover:bg-emerald-200">
              <Download size={16}/> Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label:"Total Applications", value:counts.total, icon:Users, tone:"text-teal-200", glow:"bg-teal-400/10" },
          { label:"Pending Review", value:counts.pending, icon:Clock3, tone:"text-amber-200", glow:"bg-amber-400/10" },
          { label:"Approved", value:counts.approved, icon:CheckCircle2, tone:"text-emerald-200", glow:"bg-emerald-400/10" },
          { label:"Rejected", value:counts.rejected, icon:XCircle, tone:"text-rose-200", glow:"bg-rose-400/10" },
          { label:"Blocked", value:counts.blocked, icon:ShieldCheck, tone:"text-slate-200", glow:"bg-slate-400/10" }
        ].map((card) => {
          const Icon = card.icon;
          return <div key={card.label} className="approval-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{card.label}</span>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.glow} ${card.tone}`}><Icon size={19}/></span>
            </div>
            <p className="mt-3 text-3xl font-black text-white">{card.value}</p>
          </div>;
        })}
      </section>

      {notice && <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"><CheckCircle2 size={17}/>{notice}</div>}
      {error && <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"><AlertCircle size={17}/>{error}</div>}

      <section className="approval-panel overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-4 border-b border-white/[.07] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Application workspace</p>
            <h2 className="mt-1 text-xl font-extrabold text-white">Business Partner Review Queue</h2>
            <p className="mt-1 text-xs text-slate-400">Open an application to inspect its available profile information.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email, phone..." className="w-full rounded-xl border border-white/10 bg-[#071a17] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 sm:w-72"/>
            </div>
            <div className="relative">
              <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
              <select value={filter} onChange={e=>setFilter(e.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-[#071a17] py-2.5 pl-9 pr-8 text-sm text-white sm:w-44">
                <option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[.025] text-[10px] uppercase tracking-[.14em] text-slate-500">
              <tr><th className="px-5 py-4">Business / Partner</th><th className="px-5 py-4">Contact</th><th className="px-5 py-4">Business Type</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Applied</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Review</th></tr>
            </thead>
            <tbody className="divide-y divide-white/[.06]">
              {loading ? <tr><td colSpan={7} className="px-5 py-14 text-center text-slate-400"><RefreshCw size={20} className="mx-auto mb-3 animate-spin"/>Loading partner applications...</td></tr> :
               filtered.length === 0 ? <tr><td colSpan={7} className="px-5 py-14 text-center text-slate-400"><Building2 size={25} className="mx-auto mb-3 opacity-50"/>No partner applications found.</td></tr> :
               filtered.map(p => {
                 const s = statusOf(p);
                 return <tr key={p.id} className="approval-row transition">
                   <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/10 text-emerald-200"><Building2 size={18}/></div><div><p className="font-bold text-white">{partnerName(p)}</p><p className="mt-1 text-[11px] text-slate-500">{p.partnerCode || p.id}</p></div></div></td>
                   <td className="px-5 py-4"><p className="text-slate-200">{p.contactPerson || p.fullName || "—"}</p><p className="mt-1 text-xs text-slate-500">{p.email || "—"}</p><p className="mt-1 text-xs text-slate-500">{p.phone || p.phoneNo || p.mobile || "—"}</p></td>
                   <td className="px-5 py-4 text-slate-300">{p.partnerType || p.businessType || "—"}</td>
                   <td className="px-5 py-4 text-slate-400">{[p.city,p.state].filter(Boolean).join(", ") || "—"}</td>
                   <td className="px-5 py-4 text-slate-400">{dateOf(p.createdAt)}</td>
                   <td className="px-5 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass(s)}`}>{s.replaceAll("_"," ")}</span></td>
                   <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={()=>setSelected(p)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"><Eye size={14}/> Review</button>{!["APPROVED","ACTIVE","VERIFIED","REJECTED","BLOCKED","BLACKLISTED"].includes(s) && <button onClick={()=>void approve(p)} disabled={busyId===p.id} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400 px-3 py-2 text-xs font-extrabold text-emerald-950 hover:bg-emerald-300 disabled:opacity-50"><Check size={14}/>{busyId===p.id?"Approving":"Approve"}</button>}</div></td>
                 </tr>;
               })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/[.07] px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Showing {filtered.length} of {rows.length} applications</span><span>Approval actions are recorded by the connected Super Admin API.</span></div>
      </section>

      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={()=>setSelected(null)}>
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-emerald-300/20 bg-[#0b1c19] shadow-2xl" onClick={e=>e.stopPropagation()}>
          <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-300">Application details</p><h3 className="mt-2 text-xl font-black text-white">{partnerName(selected)}</h3><p className="mt-1 text-xs text-slate-500">Partner ID: {selected.partnerCode || selected.id}</p></div><button onClick={()=>setSelected(null)} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10"><X size={18}/></button></div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
            {[
              ["Contact Person",selected.contactPerson || selected.fullName],
              ["Email",selected.email],
              ["Phone",selected.phone || selected.phoneNo || selected.mobile],
              ["Business Type",selected.partnerType || selected.businessType],
              ["City",selected.city],["State",selected.state],
              ["PAN Number",selected.panNumber],["GST Number",selected.gstNumber],
              ["Website",selected.website],["Applied On",dateOf(selected.createdAt)]
            ].map(([label,value])=><div key={label} className="rounded-xl border border-white/[.08] bg-white/[.03] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-100">{value || "Not provided"}</p></div>)}
            <div className="rounded-xl border border-white/[.08] bg-white/[.03] p-3 sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Business Address</p><p className="mt-1 text-sm text-slate-100">{selected.address || "Not provided"}</p></div>
            <div className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-3 sm:col-span-2"><div className="flex items-center gap-2 text-amber-200"><FileCheck2 size={16}/><p className="text-xs font-bold">Document verification</p></div><p className="mt-2 text-xs leading-5 text-slate-400">The current partner API response does not expose document file links or a document-verification endpoint. Do not treat PAN/GST numbers as verified documents.</p></div>
          </div>
          <div className="flex flex-col-reverse justify-between gap-3 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:p-6">
            <span className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-bold ${statusClass(statusOf(selected))}`}>{statusOf(selected)}</span>
            {!["APPROVED","ACTIVE","VERIFIED","REJECTED","BLOCKED","BLACKLISTED"].includes(statusOf(selected)) && <button onClick={()=>void approve(selected)} disabled={busyId===selected.id} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-extrabold text-emerald-950 hover:bg-emerald-300 disabled:opacity-50"><CheckCircle2 size={17}/>{busyId===selected.id?"Approving...":"Approve Partner"}</button>}
          </div>
        </div>
      </div>}
    </main>
  );
}