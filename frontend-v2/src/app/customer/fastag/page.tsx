"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CarFront, Zap, ShieldCheck, MapPin, Headphones,
  CreditCard, FileText, Gift, ShoppingCart, Settings,
  Wallet, Search, RefreshCw, ChevronRight, ArrowRight,
  CheckCircle2, Clock3, XCircle, LoaderCircle, AlertCircle,
  Plus, Eye, X, CalendarDays
} from "lucide-react";
import api from "@/lib/api";

type Fastag = {
  id: string;
  vehicleNo?: string;
  provider?: string;
  amount?: number;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const money = (n?: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  }).format(Number(n || 0));

const dateText = (s?: string) => {
  if (!s) return "Not available";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "Not available" :
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

function Status({ item }: { item: Fastag }) {
  const s = String(item.status || "PENDING").toUpperCase();
  const active = item.isActive !== false &&
    ["ACTIVE", "SUCCESS", "VERIFIED"].includes(s);
  const failed = ["BLOCKED", "FAILED", "REJECTED"].includes(s);
  const cls = active
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : failed
    ? "border-red-200 bg-red-50 text-red-700"
    : "border-amber-200 bg-amber-50 text-amber-700";
  const Icon = active ? CheckCircle2 : failed ? XCircle : Clock3;
  const label = active ? "Active" : failed ? s : s === "INACTIVE" ? "Inactive" : s;
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${cls}`}><Icon size={13}/>{label}</span>;
}

export default function CustomerFastagPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Fastag[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"list" | "add" | "details">("list");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [provider, setProvider] = useState("ICICI Bank");
  const [amount, setAmount] = useState("0");

  const load = useCallback(async () => {
    setError("");
    try {
      const token = localStorage.getItem("loan_finance_token");
      const stored = localStorage.getItem("loan_finance_user");
      if (!token || !stored) {
        router.replace("/login");
        return;
      }
      let user: any;
      try { user = JSON.parse(stored); } catch {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }
      if (!user?.id) {
        setError("Customer account details are unavailable. Please sign in again.");
        return;
      }

      // This endpoint must return only records owned by the authenticated customer.
      const response = await api.get("/fastag/my");
      const payload = response.data;
      const list = Array.isArray(payload?.data) ? payload.data :
        Array.isArray(payload?.fastags) ? payload.fastags :
        Array.isArray(payload?.data?.items) ? payload.data.items : [];
      setRows(list);
      setSelectedId(current =>
        list.some((item: Fastag) => item.id === current) ? current : (list[0]?.id || "")
      );
    } catch (e: any) {
      if (e?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }
      setError(e?.response?.data?.message || "FASTag service is not connected yet. Please try again after the customer API is enabled.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { void load(); }, [load]);

  const selected = rows.find(x => x.id === selectedId) || null;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(x => !q || [x.vehicleNo, x.provider, x.status]
      .some(v => String(v || "").toLowerCase().includes(q)));
  }, [rows, query]);

  const activeCount = rows.filter(x => x.isActive !== false &&
    ["ACTIVE", "SUCCESS", "VERIFIED"].includes(String(x.status || "ACTIVE").toUpperCase())).length;
  const recordedTotal = rows.reduce((s, x) => s + Number(x.amount || 0), 0);

  const addTag = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const vehicle = vehicleNo.trim().toUpperCase();
    const numericAmount = Number(amount);
    if (!/^[A-Z0-9 -]{5,20}$/.test(vehicle)) {
      setError("Please enter a valid vehicle registration number.");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      setError("Please enter a valid amount.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await api.post("/fastag/my", {
        vehicleNumber: vehicle,
        vehicleType: provider,
        amount: numericAmount
      });
      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Unable to submit FASTag.");
      }
      const created = response.data?.data;
      setNotice("FASTag record submitted.");
      setVehicleNo("");
      await load();
      if (created?.id) {
        setSelectedId(created.id);
        setTab("details");
      } else {
        setTab("list");
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Could not submit FASTag. Check that the customer API is implemented.");
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    { icon: Zap, title: "Instant Activation", desc: "Track activation status from your account", color: "bg-emerald-50 text-emerald-600" },
    { icon: Wallet, title: "Cashless Payments", desc: "Use the issuing provider's supported payment service", color: "bg-violet-50 text-violet-600" },
    { icon: MapPin, title: "Nationwide Coverage", desc: "FASTag acceptance depends on participating toll plazas", color: "bg-sky-50 text-sky-600" },
    { icon: ShieldCheck, title: "Secure & Reliable", desc: "Your account access is protected by sign-in", color: "bg-orange-50 text-orange-600" },
    { icon: FileText, title: "Transaction History", desc: "Open recharge history to review available records", color: "bg-teal-50 text-teal-600" },
    { icon: Headphones, title: "Support", desc: "Reach your support channel when you need help", color: "bg-pink-50 text-pink-600" },
  ];

  const steps = [
    { n: "1", icon: ShoppingCart, title: "Add FASTag", desc: "Submit your vehicle and provider details." },
    { n: "2", icon: Settings, title: "Verify details", desc: "Review the saved FASTag information." },
    { n: "3", icon: CreditCard, title: "Recharge", desc: "Continue to the separate recharge page." },
    { n: "4", icon: CarFront, title: "Travel", desc: "Use a valid issued tag at supported toll plazas." },
  ];

  return (
    <main className="min-h-screen bg-[#f5f8fd] text-[#0a2047]">
      <div className="mx-auto max-w-[1500px]">
        {/* Premium hero banner */}
        <section className="relative isolate overflow-hidden bg-[#061943] px-5 py-9 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <img src="/images/fastag/fastag-hero.png" alt="FASTag toll plaza and vehicle" className="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061943]/95 via-[#063579]/80 to-[#061943]/10" />
          <div className="absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl"/>
          <div className="absolute bottom-0 right-1/4 -z-10 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl"/>
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold tracking-widest text-cyan-100">
                <Zap size={14}/> FASTAG CUSTOMER CENTRE
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
                Drive Smarter<br/>with <span className="bg-gradient-to-r from-cyan-200 to-cyan-400 bg-clip-text text-transparent">FASTag</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-blue-100 sm:text-base">
                Manage your registered FASTags, view saved vehicle details and continue to recharge from one convenient dashboard.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={() => { setError(""); setNotice(""); setTab("add"); document.getElementById("manage-fastag")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-cyan-900/30 transition hover:-translate-y-0.5">
                  Add FASTag <ChevronRight size={17}/>
                </button>
                <button onClick={() => router.push("/customer/recharge/fastag")} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20">
                  Recharge Now <ArrowRight size={16}/>
                </button>
              </div>
            </div>

            {/* Original-style FASTag illustration; no third-party logo is falsely represented. */}
            <div className="relative mx-auto w-full max-w-[540px] py-5">
              <div className="absolute right-2 top-0 z-10 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#061c50]/80 px-4 py-3 shadow-xl backdrop-blur-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600"><Zap size={22}/></span>
                <span><strong className="block text-sm">Breeze Through</strong><small className="text-blue-100">Toll Plazas</small></span>
              </div>
              <div className="relative rotate-[-3deg] overflow-hidden rounded-[26px] border border-white/70 bg-gradient-to-br from-white via-[#f0f7ff] to-[#d8e9ff] p-5 text-[#082653] shadow-2xl shadow-[#001334]/40 sm:p-7">
                <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-300/40 blur-2xl"/>
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-black tracking-tight"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white"><CarFront size={20}/></span> FASTag</div>
                  <span className="rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-700">Vehicle Tag</span>
                </div>
                <div className="relative mt-8">
                  <div className="text-4xl font-black italic tracking-tight sm:text-5xl"><span className="text-orange-500">FAST</span><span className="text-emerald-600">ag</span></div>
                  <p className="mt-1 text-sm font-bold text-slate-600">Faster. Safer. Smarter.</p>
                </div>
                <div className="relative mt-7 flex items-end justify-between gap-4">
                  <div className="grid h-12 w-12 grid-cols-3 gap-1 rounded-lg border border-slate-300 bg-white p-1.5">
                    {Array.from({length:9}).map((_,i)=><span key={i} className={i%3===1?"bg-white":"bg-[#092b5b]"}/>)}
                  </div>
                  <div className="rounded-xl bg-gradient-to-r from-[#ffad35] via-[#4cc79b] to-[#7c68ee] px-4 py-2 text-xs font-black text-white shadow">SMART TOLL PAYMENTS</div>
                </div>
              </div>
              <div className="absolute -bottom-1 right-0 flex items-center gap-2 rounded-full border border-white/20 bg-[#06275f]/90 px-4 py-2.5 text-xs font-bold shadow-lg backdrop-blur">
                <MapPin size={17} className="text-cyan-300"/> Connected journey
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 sm:grid-cols-4">
            <div><p className="text-2xl font-black">{loading ? "—" : rows.length}</p><p className="mt-1 text-xs text-blue-100">Your registered tags</p></div>
            <div><p className="text-2xl font-black">{loading ? "—" : activeCount}</p><p className="mt-1 text-xs text-blue-100">Active in saved records</p></div>
            <div><p className="text-2xl font-black">{loading ? "—" : money(recordedTotal)}</p><p className="mt-1 text-xs text-blue-100">Recorded amount</p></div>
            <div><p className="text-2xl font-black">24/7</p><p className="mt-1 text-xs text-blue-100">Dashboard access*</p></div>
          </div>
          <p className="mt-4 text-[10px] text-blue-100/70">*Dashboard access depends on service availability. Counts come from your saved account records; recorded amount is not a verified wallet balance.</p>
        </section>

        {/* Feature strip */}
        <section className="relative z-10 mx-4 -mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/5 sm:mx-8 sm:grid-cols-3 lg:grid-cols-6 lg:px-5">
          {features.map(f => {
            const Icon = f.icon;
            return <div key={f.title} className="flex items-center gap-3 p-2">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${f.color}`}><Icon size={20}/></span>
              <span className="text-xs font-extrabold leading-4 text-[#102b55]">{f.title}</span>
            </div>;
          })}
        </section>

        {error && <div role="alert" className="mx-4 mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-8"><AlertCircle size={18} className="mt-0.5 shrink-0"/><span className="flex-1">{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><X size={17}/></button></div>}
        {notice && <div role="status" className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 sm:mx-8"><CheckCircle2 size={18}/>{notice}<button className="ml-auto" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16}/></button></div>}

        {/* Features and live customer data */}
        <section className="grid gap-7 px-4 py-10 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:py-14">
          <div className="flex flex-col items-start justify-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Built for your journey</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#0b2145] sm:text-4xl">Why choose<br/><span className="text-blue-600">FASTag?</span></h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">A clean place to view your registered vehicle tags and navigate to the available FASTag services.</p>
            <button onClick={() => { setTab("add"); setError(""); }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-700/20 hover:brightness-105">Get started <ChevronRight size={17}/></button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {features.map(f => {
              const Icon = f.icon;
              return <div key={f.title} className="rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${f.color}`}><Icon size={21}/></span>
                <h3 className="mt-4 text-sm font-extrabold text-[#0b2145]">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{f.desc}</p>
              </div>;
            })}
          </div>
        </section>

        {/* Single consolidated management page */}
        <section id="manage-fastag" className="mx-4 mb-10 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm sm:mx-8">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">Customer dashboard</p><h2 className="mt-2 text-2xl font-black text-[#0b2145]">Your FASTag workspace</h2><p className="mt-1 text-sm text-slate-500">My FASTags, Add FASTag and Details — together.</p></div>
            <button onClick={() => { setRefreshing(true); void load(); }} disabled={loading || refreshing} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 md:self-auto"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""}/> Refresh records</button>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-3 sm:px-6">
            {([{id:"list",label:"My FASTags"},{id:"add",label:"Add FASTag"},{id:"details",label:"FASTag Details"}] as const).map(t =>
              <button key={t.id} onClick={() => {setTab(t.id);setError("");}} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-extrabold ${tab===t.id?"border-blue-700 bg-blue-50/60 text-blue-800":"border-transparent text-slate-500 hover:bg-slate-50"}`}>{t.label}</button>
            )}
          </div>

          <div className="p-4 sm:p-6">
            {tab === "list" && <div>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-extrabold">My registered FASTags</h3><p className="mt-1 text-xs text-slate-500">Only records returned by your authenticated customer API are displayed.</p></div><div className="relative sm:w-72"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search vehicle or provider" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/></div></div>
              {loading ? <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin text-blue-600"/> Loading your records…</div> :
              filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center"><CarFront size={34} className="mx-auto text-blue-400"/><h3 className="mt-3 font-extrabold">{rows.length ? "No matching FASTags" : "No FASTag records available"}</h3><p className="mt-2 text-sm text-slate-500">{rows.length ? "Try a different search." : "Once your authenticated API returns a FASTag record, it will appear here. No demo records are used."}</p>{!rows.length && <button onClick={()=>setTab("add")} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16}/> Add FASTag</button>}</div> :
              <div className="grid gap-4 xl:grid-cols-2">{filtered.map(item=><article key={item.id} className={`rounded-2xl border p-5 transition ${selectedId===item.id?"border-blue-300 bg-blue-50/40":"border-slate-200 hover:shadow-md"}`}><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-900 to-cyan-600 text-white"><CarFront size={25}/></span><div className="min-w-0"><h4 className="break-all font-black">{item.vehicleNo || "Vehicle number unavailable"}</h4><p className="mt-1 truncate text-sm text-slate-500">{item.provider || "Provider unavailable"}</p></div></div><Status item={item}/></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Recorded amount</p><p className="mt-1 font-extrabold">{money(item.amount)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Created on</p><p className="mt-1 font-extrabold">{dateText(item.createdAt)}</p></div></div><div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3"><span className="max-w-[60%] truncate text-xs text-slate-400">ID: {item.id}</span><button onClick={()=>{setSelectedId(item.id);setTab("details");}} className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-700">View details <ChevronRight size={15}/></button></div></article>)}</div>}
            </div>}

            {tab === "add" && <div className="mx-auto max-w-2xl"><h3 className="text-lg font-black">Add a FASTag</h3><p className="mt-1 text-sm text-slate-500">Submit the vehicle details to the customer API.</p><form onSubmit={addTag} className="mt-6 space-y-5"><div><label htmlFor="vehicleNo" className="mb-2 block text-sm font-bold">Vehicle registration number *</label><input id="vehicleNo" required maxLength={20} value={vehicleNo} onChange={e=>setVehicleNo(e.target.value.toUpperCase())} placeholder="e.g. JH10AB1234" className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm uppercase outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/></div><div><label htmlFor="provider" className="mb-2 block text-sm font-bold">Issuing bank/provider *</label><select id="provider" value={provider} onChange={e=>setProvider(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">{["ICICI Bank","HDFC Bank","State Bank of India","Axis Bank","IDFC FIRST Bank","Bank of Baroda","Kotak Mahindra Bank","Other"].map(p=><option key={p}>{p}</option>)}</select></div><div><label htmlFor="amount" className="mb-2 block text-sm font-bold">Initial recorded amount (₹)</label><input id="amount" type="number" min="0" step="0.01" max="1000000" required value={amount} onChange={e=>setAmount(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/><p className="mt-2 text-xs leading-5 text-amber-700">This saves the database amount field only. It does not debit money or recharge the tag.</p></div><div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={()=>setTab("list")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold">Cancel</button><button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-800 disabled:opacity-50">{submitting?<LoaderCircle size={17} className="animate-spin"/>:<Plus size={17}/>} {submitting?"Submitting…":"Submit FASTag"}</button></div></form></div>}

            {tab === "details" && (!selected ? <div className="py-12 text-center"><Eye size={32} className="mx-auto text-slate-400"/><h3 className="mt-3 font-extrabold">No FASTag selected</h3><p className="mt-2 text-sm text-slate-500">Select a real record from My FASTags to see its details.</p><button onClick={()=>setTab(rows.length?"list":"add")} className="mt-4 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white">{rows.length?"View my FASTags":"Add FASTag"}</button></div> : <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><div className="rounded-2xl bg-gradient-to-br from-[#071943] via-[#0c428b] to-cyan-600 p-6 text-white"><div className="flex items-center justify-between"><CarFront size={27}/><Status item={selected}/></div><p className="mt-8 text-xs font-bold uppercase tracking-widest text-cyan-200">Vehicle registration</p><h3 className="mt-2 break-all text-2xl font-black">{selected.vehicleNo || "Not available"}</h3><p className="mt-2 text-sm text-blue-100">{selected.provider || "Provider unavailable"}</p><p className="mt-8 text-xs text-blue-100">Recorded amount</p><p className="mt-1 text-3xl font-black">{money(selected.amount)}</p></div><div className="rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold">Saved FASTag information</h3><div className="mt-3 divide-y divide-slate-100">{[["Record ID",selected.id],["Vehicle number",selected.vehicleNo||"Not available"],["Provider",selected.provider||"Not available"],["Created on",dateText(selected.createdAt)],["Last updated",dateText(selected.updatedAt)]].map(([label,value])=><div key={label} className="flex flex-wrap justify-between gap-3 py-3 text-sm"><span className="text-slate-500">{label}</span><span className="max-w-[65%] break-all text-right font-bold">{value}</span></div>)}</div><div className="mt-4 flex flex-wrap gap-3"><button onClick={()=>setTab("list")} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">Back to list</button><button onClick={()=>router.push("/customer/recharge/fastag")} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white">Go to recharge <ArrowRight size={14} className="ml-1 inline"/></button></div></div></div>)}
          </div>
        </section>

        {/* How it works */}
        <section className="grid items-center gap-7 bg-gradient-to-r from-[#eef6ff] to-white px-4 py-10 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:py-14">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Simple process</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">How it works</h2><p className="mt-2 text-sm text-slate-500">A straightforward flow for managing your FASTag information.</p><div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{steps.map(s=>{const Icon=s.icon;return <div key={s.n} className="flex gap-3 rounded-2xl border border-blue-100 bg-white p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black text-white">{s.n}</span><div><Icon size={18} className="text-blue-700"/><h3 className="mt-2 text-sm font-extrabold">{s.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{s.desc}</p></div></div>})}</div></div>
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#062052] via-[#0754a3] to-[#06b4dc] p-7 text-white sm:p-9"><div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl"/><div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><CarFront size={31}/></div><h3 className="relative mt-6 text-2xl font-black sm:text-3xl">Your journey,<br/>made simpler.</h3><p className="relative mt-3 max-w-sm text-sm leading-6 text-blue-100">Open your FASTag records or continue to the separate recharge experience whenever you are ready.</p><button onClick={()=>router.push("/customer/recharge/fastag")} className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-blue-800 hover:bg-cyan-50">Go to FASTag Recharge <ArrowRight size={16}/></button></div>
        </section>

        <footer className="mx-4 mb-6 mt-6 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-blue-700 to-cyan-500 p-6 text-white sm:mx-8 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15"><Gift size={25}/></span><div><h2 className="text-lg font-black">Ready for a smoother journey?</h2><p className="mt-1 text-sm text-blue-50">Keep your FASTag information organised in one place.</p></div></div>
          <button onClick={()=>{setTab("add");document.getElementById("manage-fastag")?.scrollIntoView({behavior:"smooth"});}} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-blue-800 shadow-lg hover:bg-cyan-50">Add FASTag <ChevronRight size={17}/></button>
        </footer>
        <p className="px-5 pb-6 text-center text-[11px] leading-5 text-slate-400">FASTag issuance, activation, balance and toll acceptance depend on the issuing bank and relevant service provider. This dashboard does not claim a successful payment unless confirmed by the connected service.</p>
      </div>
    </main>
  );
}



