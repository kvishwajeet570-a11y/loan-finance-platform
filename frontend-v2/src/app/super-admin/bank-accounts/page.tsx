"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Landmark, Plus, Search, RefreshCw, Download, Eye, Pencil,
  Trash2, Star, ShieldCheck, Clock3, X, ChevronLeft, ChevronRight,
  CheckCircle2, AlertCircle, Building2, CreditCard, Filter
} from "lucide-react";
import api from "@/lib/api";

type Bank = {
  id: string;
  userId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string | null;
  isPrimary?: boolean;
  verificationStatus?: string;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: { id?: string; name?: string; email?: string; phoneNo?: string };
};

type BankForm = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  isPrimary: boolean;
};

const emptyForm: BankForm = {
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
  isPrimary: false
};

const maskAccount = (value?: string) => {
  if (!value) return "—";
  return value.length <= 4 ? value : `•••• •••• ${value.slice(-4)}`;
};

const statusClass = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "VERIFIED": return "border-emerald-400/60 bg-emerald-500/15 text-emerald-300";
    case "PENDING": return "border-amber-400/60 bg-amber-500/15 text-amber-300";
    case "REJECTED": return "border-rose-400/60 bg-rose-500/15 text-rose-300";
    default: return "border-slate-400/40 bg-slate-500/15 text-slate-300";
  }
};

export default function BankAccountsPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [analytics, setAnalytics] = useState({
    totalAccounts: 0,
    verifiedAccounts: 0,
    pendingAccounts: 0,
    rejectedAccounts: 0,
    primaryAccounts: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const limit = 10;

  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<Bank | null>(null);
  const [form, setForm] = useState<BankForm>(emptyForm);

  const load = useCallback(async (nextPage = page) => {
    setLoading(true);
    setError("");

    try {
      const params: Record<string, string | number> = {
        page: nextPage,
        limit
      };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;

      const [listResult, analyticsResult] = await Promise.all([
        api.get("/bank", { params }),
        api.get("/bank/analytics")
      ]);

      const list = listResult.data || {};
      const listData = list.accounts || list.data || list.data?.accounts || [];

      setBanks(Array.isArray(listData) ? listData : []);
      setTotal(Number(list.total ?? listData.length ?? 0));
      setPages(Math.max(1, Number(list.totalPages ?? 1)));
      setPage(Number(list.page ?? nextPage));

      const stats = analyticsResult.data?.data || analyticsResult.data || {};
      setAnalytics({
        totalAccounts: Number(stats.totalAccounts || 0),
        verifiedAccounts: Number(stats.verifiedAccounts || 0),
        pendingAccounts: Number(stats.pendingAccounts || 0),
        rejectedAccounts: Number(stats.rejectedAccounts || 0),
        primaryAccounts: Number(stats.primaryAccounts || 0)
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Bank accounts load nahi ho paye.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    load(1);
  }, [search, status]);

  useEffect(() => {
    load(1);
  }, []);

  const openAdd = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("add");
    setError("");
    setNotice("");
  };

  const openEdit = (bank: Bank) => {
    setSelected(bank);
    setForm({
      accountHolderName: bank.accountHolderName || "",
      bankName: bank.bankName || "",
      accountNumber: bank.accountNumber || "",
      ifscCode: bank.ifscCode || "",
      branchName: bank.branchName || "",
      isPrimary: Boolean(bank.isPrimary)
    });
    setModal("edit");
    setError("");
    setNotice("");
  };

  const saveBank = async () => {
    setError("");
    setNotice("");

    if (!form.accountHolderName.trim() || !form.bankName.trim() ||
        !form.accountNumber.trim() || !form.ifscCode.trim()) {
      setError("Account holder, bank name, account number and IFSC are required.");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.ifscCode.trim())) {
      setError("Please enter a valid IFSC code.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        accountHolderName: form.accountHolderName.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim().toUpperCase(),
        branchName: form.branchName.trim() || undefined,
        isPrimary: form.isPrimary
      };

      if (modal === "edit" && selected) {
        await api.put(`/bank/${selected.id}`, payload);
        setNotice("Bank account updated successfully.");
      } else {
        await api.post("/bank", payload);
        setNotice("Bank account added successfully.");
      }

      setModal(null);
      await load(1);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Unable to save bank account.");
    } finally {
      setSaving(false);
    }
  };

  const verifyBank = async (bank: Bank) => {
    if (!window.confirm(`Verify bank account for ${bank.accountHolderName}?`)) return;
    setError("");
    setNotice("");
    try {
      await api.patch(`/bank/${bank.id}/verify`);
      setNotice("Bank account verified successfully.");
      await load(page);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Verification failed.");
    }
  };

  const setPrimary = async (bank: Bank) => {
    if (!window.confirm(`Set ${bank.bankName} as primary account for ${bank.accountHolderName}?`)) return;
    setError("");
    setNotice("");
    try {
      await api.patch(`/bank/${bank.id}/set-primary`, { userId: bank.userId });
      setNotice("Primary bank account updated.");
      await load(page);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Unable to set primary account.");
    }
  };

  const deleteBank = async (bank: Bank) => {
    if (!window.confirm(`Delete bank account ${maskAccount(bank.accountNumber)} for ${bank.accountHolderName}? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await api.delete(`/bank/${bank.id}`);
      setNotice("Bank account deleted.");
      await load(page);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Unable to delete bank account.");
    }
  };

  const exportCSV = () => {
    const header = [
      "Bank Name", "Account Holder", "Account Number",
      "IFSC", "Branch", "User", "Verification Status", "Primary"
    ];
    const rows = banks.map(b => [
      b.bankName, b.accountHolderName, b.accountNumber,
      b.ifscCode, b.branchName || "", b.user?.name || "",
      b.verificationStatus || "", b.isPrimary ? "Yes" : "No"
    ]);

    const csv = [header, ...rows].map(row =>
      row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AIFIN-Bank-Accounts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Total Accounts", value: analytics.totalAccounts, icon: Landmark, color: "cyan" },
    { label: "Verified Accounts", value: analytics.verifiedAccounts, icon: ShieldCheck, color: "green" },
    { label: "Pending Accounts", value: analytics.pendingAccounts, icon: Clock3, color: "amber" },
    { label: "Rejected Accounts", value: analytics.rejectedAccounts, icon: AlertCircle, color: "red" }
  ];

  const cardColors: Record<string, string> = {
    cyan: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
    green: "border-emerald-400 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-400 bg-amber-500/10 text-amber-300",
    red: "border-rose-400 bg-rose-500/10 text-rose-300"
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_15%_10%,_rgba(0,190,255,0.18),_transparent_32%),radial-gradient(ellipse_at_85%_15%,_rgba(105,0,255,0.16),_transparent_35%),linear-gradient(135deg,#020817,#061a36_55%,#020817)] px-4 pb-8 pt-5 text-white sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* Compact heading - no large banner */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/60 bg-gradient-to-br from-cyan-400/25 to-blue-700/30 text-cyan-200 shadow-[0_0_28px_rgba(0,190,255,0.3)]">
              <Landmark size={30} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Financial Management</p>
              <h1 className="text-3xl font-black tracking-tight drop-shadow-[0_0_18px_rgba(0,170,255,0.35)] sm:text-4xl">
                Bank <span className="text-yellow-400">Accounts</span>
              </h1>
              <p className="mt-1 text-sm text-slate-300">Manage customer and partner bank accounts, verification and primary account details.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => load(page)} disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-[#10284a] px-4 py-3 text-sm font-extrabold hover:border-cyan-300 disabled:opacity-50">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 px-5 py-3 text-sm font-extrabold shadow-[0_0_28px_rgba(0,160,255,0.38)] transition hover:scale-[1.02] hover:brightness-125">
              <Plus size={18} /> Add Bank Account
            </button>
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        {notice && <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</div>}

        {/* KPI cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label} className={`rounded-2xl border-2 ${cardColors[c.color]} bg-gradient-to-br from-[#102747]/95 to-[#091a32]/95 p-5 shadow-[0_0_30px_rgba(0,150,255,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(0,190,255,0.38)] backdrop-blur-xl`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{c.label}</p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3"><Icon size={25} /></div>
                </div>
                <p className="mt-3 text-3xl font-black text-white">{loading ? "..." : c.value.toLocaleString("en-IN")}</p>
                <p className="mt-2 text-xs text-slate-400">Live backend analytics</p>
              </div>
            );
          })}
        </section>

        {/* Default account summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-400/50 bg-gradient-to-r from-[#24134b]/80 via-[#10284a]/90 to-[#07182f] p-4 shadow-[0_0_24px_rgba(140,70,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/20 p-3 text-purple-300"><Star size={23} /></div>
            <div>
              <p className="text-xs text-slate-400">Primary Accounts</p>
              <p className="text-xl font-black text-white">{analytics.primaryAccounts}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Number of accounts currently marked as primary.</p>
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-cyan-400/50 bg-gradient-to-br from-[#0b2b4e]/95 to-[#07182f]/95 p-5 shadow-[0_0_28px_rgba(0,150,255,0.18)]">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-cyan-300"><Filter size={18} /> Filter & Search</h2>
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto_auto]">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Search bank / holder / IFSC</label>
              <div className="flex items-center gap-2 rounded-xl border border-blue-300/40 bg-[#071a34] px-3 focus-within:border-cyan-400">
                <Search size={17} className="text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && load(1)}
                  placeholder="Search bank name, holder or IFSC..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Verification Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full rounded-xl border border-blue-300/40 bg-[#071a34] px-3 py-3 text-sm outline-none">
                <option value="">All Status</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <button onClick={() => load(1)}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold shadow-[0_0_20px_rgba(0,150,255,0.3)] hover:brightness-110">
              <Search size={17} /> Search
            </button>
            <button onClick={() => { setSearch(""); setStatus(""); setPage(1); }}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-slate-400/40 bg-[#142947] px-5 py-3 text-sm font-bold hover:bg-slate-700">
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </section>

        {/* Bank account table */}
        <section className="overflow-hidden rounded-2xl border border-cyan-300/70 bg-gradient-to-br from-[#102e52] via-[#091f3b] to-[#041329] shadow-[0_0_38px_rgba(0,160,255,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-300/20 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><Building2 size={22} className="text-cyan-300" /> Bank Account List</h2>
            <button onClick={exportCSV} disabled={!banks.length}
              className="flex items-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40">
              <Download size={15} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="bg-gradient-to-r from-[#07518a] via-[#123e70] to-[#28165b] text-xs uppercase tracking-widest text-cyan-100">
                <tr>
                  {["#", "Bank Details", "Account Details", "Account Holder / User", "IFSC / Branch", "Verification", "Primary", "Added On", "Actions"].map(h =>
                    <th key={h} className="px-4 py-4 font-bold">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200/15">
                {banks.map((b, i) => (
                  <tr key={b.id} className="transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400/[0.12] hover:to-blue-500/[0.08]">
                    <td className="px-4 py-5 text-slate-300">{(page - 1) * limit + i + 1}</td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-700/20 text-cyan-200"><Landmark size={22} /></div>
                        <div><p className="font-extrabold text-white">{b.bankName}</p><p className="mt-1 text-xs text-slate-400">Bank account</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <p className="font-bold tracking-wider text-white">{maskAccount(b.accountNumber)}</p>
                      <p className="mt-1 text-xs text-slate-400">Account number protected</p>
                    </td>
                    <td className="px-4 py-5">
                      <p className="font-bold text-white">{b.accountHolderName}</p>
                      <p className="mt-1 text-xs text-slate-400">{b.user?.name || "—"}</p>
                      <p className="text-xs text-slate-500">{b.user?.email || ""}</p>
                    </td>
                    <td className="px-4 py-5">
                      <p className="font-bold text-cyan-200">{b.ifscCode}</p>
                      <p className="mt-1 text-xs text-slate-400">{b.branchName || "Branch not provided"}</p>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`rounded-full border px-3 py-1.5 text-xs font-extrabold ${statusClass(b.verificationStatus)}`}>{b.verificationStatus || "UNKNOWN"}</span>
                    </td>
                    <td className="px-4 py-5">
                      {b.isPrimary
                        ? <span className="inline-flex items-center gap-1 text-amber-300"><Star size={18} fill="currentColor" /> Primary</span>
                        : <button onClick={() => setPrimary(b)} className="rounded-lg border border-purple-400/50 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20">Set Primary</button>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-xs text-slate-300">{b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <button title="View" onClick={() => { setSelected(b); setModal("view"); }}
                          className="rounded-lg border border-cyan-400/60 bg-cyan-500/10 p-2 text-cyan-200 hover:bg-cyan-500/25"><Eye size={16} /></button>
                        <button title="Edit" onClick={() => openEdit(b)}
                          className="rounded-lg border border-blue-400/60 bg-blue-500/10 p-2 text-blue-200 hover:bg-blue-500/25"><Pencil size={16} /></button>
                        {b.verificationStatus !== "VERIFIED" && (
                          <button title="Verify" onClick={() => verifyBank(b)}
                            className="rounded-lg border border-emerald-400/60 bg-emerald-500/10 p-2 text-emerald-200 hover:bg-emerald-500/25"><CheckCircle2 size={16} /></button>
                        )}
                        <button title="Delete" onClick={() => deleteBank(b)}
                          className="rounded-lg border border-rose-400/60 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/25"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && banks.length === 0 && <tr><td colSpan={9} className="px-4 py-14 text-center text-slate-400">No bank accounts found.</td></tr>}
                {loading && <tr><td colSpan={9} className="px-4 py-14 text-center text-cyan-300">Loading real bank account records...</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-300/20 px-5 py-4">
            <p className="text-sm text-slate-300">Showing {total ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of <strong className="text-white">{total}</strong> accounts</p>
            <div className="flex items-center gap-2">
              <button onClick={() => load(page - 1)} disabled={page <= 1 || loading}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold disabled:opacity-30"><ChevronLeft size={15} /> Previous</button>
              <span className="rounded-lg border border-cyan-400 bg-blue-600 px-4 py-2 text-sm font-extrabold">{page}</span>
              <span className="text-xs text-slate-400">of {pages}</span>
              <button onClick={() => load(page + 1)} disabled={page >= pages || loading}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold disabled:opacity-30">Next <ChevronRight size={15} /></button>
            </div>
          </div>
        </section>
      </div>

      {/* Add / Edit / View modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="w-full max-w-2xl rounded-2xl border border-cyan-300/70 bg-gradient-to-br from-[#10345c] to-[#06152c] p-6 shadow-[0_0_45px_rgba(0,150,255,0.3)]" onClick={e => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">AIFIN · Bank Management</p>
                <h3 className="mt-1 text-xl font-extrabold">{modal === "add" ? "Add Bank Account" : modal === "edit" ? "Edit Bank Account" : "Bank Account Details"}</h3>
              </div>
              <button onClick={() => setModal(null)} className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10"><X size={20} /></button>
            </div>

            {modal === "view" && selected ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Bank Name", selected.bankName],
                  ["Account Holder", selected.accountHolderName],
                  ["Account Number", selected.accountNumber],
                  ["IFSC Code", selected.ifscCode],
                  ["Branch", selected.branchName || "—"],
                  ["Account Owner", selected.user?.name || "—"],
                  ["Owner Email", selected.user?.email || "—"],
                  ["Verification", selected.verificationStatus || "—"],
                  ["Primary Account", selected.isPrimary ? "Yes" : "No"],
                  ["Created", selected.createdAt ? new Date(selected.createdAt).toLocaleString("en-IN") : "—"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-blue-300/20 bg-[#071a34] p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-all text-sm font-bold text-white">{value}</p>
                  </div>
                ))}
                {selected.rejectionReason && <div className="col-span-full rounded-xl border border-rose-400/30 bg-rose-500/10 p-3"><p className="text-xs text-rose-300">Rejection Reason</p><p className="mt-1 text-sm text-white">{selected.rejectionReason}</p></div>}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Bank Name", "bankName", "e.g. State Bank of India"],
                    ["Account Holder Name", "accountHolderName", "Full account holder name"],
                    ["Account Number", "accountNumber", "Enter account number"],
                    ["IFSC Code", "ifscCode", "e.g. SBIN0001234"],
                    ["Branch Name", "branchName", "Branch name (optional)"]
                  ].map(([label, key, placeholder]) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">{label}{key !== "branchName" && <span className="text-rose-400"> *</span>}</label>
                      <input value={form[key as keyof BankForm] as string}
                        onChange={e => setForm(prev => ({ ...prev, [key]: key === "ifscCode" ? e.target.value.toUpperCase() : e.target.value }))}
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-blue-300/40 bg-[#071a34] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400" />
                    </div>
                  ))}
                </div>
                <label className="mt-4 flex items-center gap-3 rounded-xl border border-purple-400/30 bg-purple-500/10 p-3 text-sm text-slate-200">
                  <input type="checkbox" checked={form.isPrimary} onChange={e => setForm(prev => ({ ...prev, isPrimary: e.target.checked }))} className="h-4 w-4 accent-purple-500" />
                  Set as primary bank account for this account owner
                </label>
                <p className="mt-3 text-xs text-amber-300">New bank accounts are created under the currently logged-in admin account by the existing backend API.</p>
                {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
                <button onClick={saveBank} disabled={saving}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 py-3 text-sm font-extrabold shadow-[0_0_28px_rgba(0,150,255,0.3)] hover:brightness-110 disabled:opacity-50">
                  <Plus size={18} /> {saving ? "Saving..." : modal === "edit" ? "Save Changes" : "Add Bank Account"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

