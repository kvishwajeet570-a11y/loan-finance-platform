"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";
import {
  ArrowRight, BadgeCheck, Building2, BriefcaseBusiness, CarFront,
  CheckCircle2, CreditCard, ExternalLink, House, Landmark, LocateFixed,
  MapPin, MapPinned, RefreshCw, Search, ShieldCheck, SlidersHorizontal
} from "lucide-react";

type ServiceRecord = {
  lenderName: string;
  productType: string | null;
  status: string | null;
  sourceSheet: string;
  branchName: string | null;
  branchAddress: string | null;
};

type PinDetails = {
  pincode: string;
  postOfficeName: string | null;
  district: string | null;
  state: string | null;
  region?: string | null;
  division?: string | null;
  circle?: string | null;
  deliveryStatus?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  serviceability: ServiceRecord[];
  serviceabilityCount: number;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const categories = [
  { name: "All records", code: "ALL", Icon: Landmark },
  { name: "Personal Loan", code: "PL", Icon: BadgeCheck },
  { name: "Business Loan", code: "BL", Icon: BriefcaseBusiness },
  { name: "Home Loan", code: "HL", Icon: House },
  { name: "Loan Against Property", code: "LAP", Icon: Building2 },
  { name: "Car Loan", code: "CL", Icon: CarFront },
  { name: "Credit Card", code: "CC", Icon: CreditCard },
];

function categoryMatches(product: string | null, code: string) {
  if (code === "ALL") return true;
  const value = (product || "").toLowerCase();
  const aliases: Record<string, string[]> = {
    PL: ["personal loan", "pl"],
    BL: ["business loan", "bl"],
    HL: ["home loan", "hl"],
    LAP: ["loan against property", "lap"],
    CL: ["car loan", "vehicle loan", "cl"],
    CC: ["credit card", "cc"],
  };
  return (aliases[code] || []).some((item) => value.includes(item));
}

function lenderLogoDomain(name: string): string | null {
  const value = name.trim().toLowerCase();

  const brands: Array<[string[], string]> = [
    [["state bank of india", "sbi"], "sbi.co.in"],
    [["hdfc"], "hdfcbank.com"],
    [["icici"], "icicibank.com"],
    [["axis bank", "axis"], "axisbank.com"],
    [["kotak"], "kotak.com"],
    [["idfc first", "idfc"], "idfcfirstbank.com"],
    [["indusind"], "indusind.com"],
    [["yes bank"], "yesbank.in"],
    [["bajaj"], "bajajfinserv.in"],
    [["tata capital"], "tatacapital.com"],
    [["lendingkart"], "lendingkart.com"],
    [["flexiloan"], "flexiloans.com"],
    [["incred"], "incred.com"],
    [["smartcoin"], "smartcoin.co.in"],
    [["pnb"], "pnbindia.in"],
    [["bank of baroda"], "bankofbaroda.in"],
    [["union bank"], "unionbankofindia.co.in"],
    [["canara bank"], "canarabank.com"],
    [["federal bank"], "federalbank.co.in"],
    [[" au small finance", "au small finance", "aubank"], "aubank.in"]
  ];

  const match = brands.find(([aliases]) =>
    aliases.some((alias) => value.includes(alias))
  );

  return match?.[1] ?? null;
}
function statusClass(status: string | null) {
  const value = (status || "").trim().toLowerCase();

  if (["not live", "not serviceable", "not doable", "inactive", "unserviceable", "rejected"].some((x) => value.includes(x))) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (["live", "serviceable", "operational", "doable", "active"].some((x) => value.includes(x))) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}


// Use a real local logo only when the lender name matches that bank.
function getLenderLogo(name: string): string | null {
  const value = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (/\b/.test("")) { return null; }

  if (value.includes("statebankofindia") || value === "sbi") return "/lender-logos/sbi.svg";
  if (value.includes("hdfc")) return "/lender-logos/hdfc.svg";
  if (value.includes("icici")) return "/lender-logos/icici.svg";
  if (value.includes("axis")) return "/lender-logos/axis.svg";
  if (value.includes("kotak")) return "/lender-logos/kotak.svg";

  return null;
}
export default function PinCodePage() {
  const [query, setQuery] = useState("");
  const [details, setDetails] = useState<PinDetails | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [locationMessage, setLocationMessage] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function search(term = query) {
    const pin = term.trim();
    if (!/^\d{6}$/.test(pin)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }
    setLoading(true);
    setError("");
    setLocationMessage("");
    setActiveTab("ALL");
    try {
      const response = await fetch(`${API_BASE}/pincode/${encodeURIComponent(pin)}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || "No matching PIN code was found.");
      }
      const raw = (Array.isArray(payload.data) ? payload.data[0] : payload.data) as Partial<PinDetails> | undefined;
      if (!raw) throw new Error("No matching PIN code was found.");
      const serviceability = Array.isArray(raw.serviceability) ? raw.serviceability : [];
      setDetails({
        pincode: String(raw.pincode ?? pin),
        postOfficeName: raw.postOfficeName ?? null,
        district: raw.district ?? null,
        state: raw.state ?? null,
        region: raw.region ?? null,
        division: raw.division ?? null,
        circle: raw.circle ?? null,
        deliveryStatus: raw.deliveryStatus ?? null,
        latitude: raw.latitude ?? null,
        longitude: raw.longitude ?? null,
        serviceability,
        serviceabilityCount: Number(raw.serviceabilityCount ?? serviceability.length),
      });
      setQuery(pin);
      setRecent((old) => [pin, ...old.filter((item) => item !== pin)].slice(0, 5));
      setTableSearch("");
      setStatusFilter("ALL");
    } catch (err) {
      setDetails(null);
      setError(err instanceof Error ? err.message : "Could not fetch results. Check the backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void search("515001");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void search();
  }

  function useMyLocation() {
    setError("");
    setLocationMessage("");
    if (!navigator.geolocation) {
      setLocationMessage("Location access is not supported by this browser.");
      return;
    }
    setLocationMessage("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error("Location lookup failed");
          const result = await response.json();
          const pin = String(result.address?.postcode || "").replace(/\D/g, "").slice(0, 6);
          if (pin.length === 6) {
            setQuery(pin);
            setLocationMessage(`Detected PIN code: ${pin}`);
            await search(pin);
          } else {
            setLocationMessage("A 6-digit PIN code was not available for this location. Please enter it manually.");
          }
        } catch {
          setLocationMessage("Could not look up the location. Please search manually.");
        }
      },
      () => setLocationMessage("Location permission was denied or unavailable."),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  const records = details?.serviceability ?? [];
  const lenderCount = new Set(records.map((record) => record.lenderName.trim().toLowerCase())).size;
  const counts = useMemo(
    () => Object.fromEntries(categories.map((category) => [
      category.code,
      category.code === "ALL" ? records.length : records.filter((record) => categoryMatches(record.productType, category.code)).length,
    ])),
    [records]
  );
  const uniqueStatuses = Array.from(new Set(records.map((record) => record.status).filter((x): x is string => Boolean(x))));
  const filtered = records.filter((record) => {
    const q = tableSearch.trim().toLowerCase();
    const matchesText = !q || [record.lenderName, record.productType, record.status, record.sourceSheet, record.branchName, record.branchAddress]
      .some((value) => String(value ?? "").toLowerCase().includes(q));
    return categoryMatches(record.productType, activeTab) && matchesText &&
      (statusFilter === "ALL" || (record.status || "").toLowerCase() === statusFilter.toLowerCase());
  });

  const hasCoordinates = Boolean(details && details.latitude != null && details.longitude != null &&
    Number.isFinite(Number(details.latitude)) && Number.isFinite(Number(details.longitude)));
  const mapQuery = hasCoordinates
    ? `${Number(details!.latitude)},${Number(details!.longitude)}`
    : `${details?.postOfficeName || ""}, ${details?.district || ""}, ${details?.state || ""}, ${details?.pincode || ""}, India`;
  const mapUrl = details ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : "";

  return (
    <DsaShell>
      <main className="min-w-0 space-y-7 pb-12 text-slate-900">
                        <section className="relative isolate overflow-hidden rounded-[30px] border border-blue-100/40 bg-[#061331] shadow-[0_24px_70px_rgba(7,58,145,0.20)]">
          <div className="absolute inset-0">
            <img
              src="/images/dsa/pin-code-banner.png"
              alt="PIN Code location coverage background"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#041638]/95 via-[#062b68]/80 to-[#061331]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041638]/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 flex min-h-[330px] items-center px-5 py-7 sm:min-h-[390px] sm:px-8 sm:py-9 lg:min-h-[430px] lg:px-10">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-blue-950/50 px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-cyan-100 backdrop-blur-md sm:text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.9)]" />
                DSA FinCorp · Partner Workspace
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
                PIN Code
                <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  Serviceability
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-blue-50 sm:text-base sm:leading-7">
                Explore location records and lender coverage from your connected database.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-blue-950/55 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur-md">
                  <MapPinned size={17} className="text-cyan-300" />
                  PIN master lookup
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-blue-950/55 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur-md">
                  <ShieldCheck size={17} className="text-emerald-300" />
                  Database-backed records
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-blue-950/55 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur-md">
                  <Building2 size={17} className="text-cyan-300" />
                  Lender record details
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-blue-100 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2">
                  <MapPin size={15} className="text-cyan-300" />
                  Current PIN: {details?.pincode || "Not searched"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2">
                  <Building2 size={15} className="text-emerald-300" />
                  {details ? `${lenderCount} lenders found` : "Wide lender coverage"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid min-w-0 grid-cols-1 items-start gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.9fr)]">
          <section className="rounded-[24px] border border-blue-100/80 bg-gradient-to-br from-white via-white to-sky-50/80 p-5 shadow-[0_12px_40px_rgba(15,45,95,0.07)] sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20"><Search size={20} /></span>
              <div><h2 className="text-lg font-extrabold sm:text-xl">Search your PIN code</h2><p className="mt-1 text-sm leading-5 text-slate-500">Enter a six-digit PIN to load its location and lender records.</p></div>
            </div>
            <form onSubmit={submit} className="mt-5 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
              <div className="relative min-w-0"><MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" /><input value={query} onChange={(event) => setQuery(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" aria-label="Enter six-digit PIN code" className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 shadow-sm text-sm font-semibold tracking-wide outline-none transition placeholder:font-normal placeholder:tracking-normal focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" /></div>
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-5 py-4 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">{loading && <RefreshCw size={15} className="animate-spin" />}{loading ? "Searching..." : "Check Serviceability"}<ArrowRight size={16} /></button>
              <button type="button" onClick={useMyLocation} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50"><LocateFixed size={16} /> My Location</button>
            </form>
            {recent.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-slate-500">Recent searches:</span>{recent.map((pin) => <button key={pin} onClick={() => { setQuery(pin); void search(pin); }} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm hover:shadow-sm">{pin}</button>)}</div>}
            {locationMessage && <p role="status" className="mt-3 text-xs text-blue-700">{locationMessage}</p>}
            {error && <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,45,95,0.06)] transition-shadow duration-200 hover:shadow-[0_12px_36px_rgba(15,45,95,0.10)] sm:p-6">
            <div className="flex items-center justify-between gap-2"><div><h2 className="font-extrabold">Product categories</h2><p className="mt-1 text-xs text-slate-500">Counts based on this PIN's records</p></div><span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700">{details ? records.length : "â€”"} records</span></div>
            <div className="mt-4 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3">
              {categories.slice(1).map(({ name, code, Icon }) => <button key={code} onClick={() => setActiveTab(code)} className={`rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${activeTab === code ? "border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 ring-2 ring-blue-100 shadow-sm" : "border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm hover:shadow-sm/60"}`}><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 text-blue-700 ring-1 ring-blue-100"><Icon size={20} /></span><span className="mt-2 block text-xs font-bold leading-4 text-slate-700">{name}</span><span className="mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-slate-100">{details ? counts[code] : "â€”"} records</span></button>)}
            </div>
          </section>
        </div>

        <section className="grid min-w-0 grid-cols-1 items-stretch gap-4 2xl:grid-cols-2">
          <div className="overflow-hidden rounded-[24px] border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/80 p-5 shadow-[0_12px_40px_rgba(15,45,95,0.06)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800"><CheckCircle2 size={15} className="text-emerald-600" />{details ? "Database match" : "Location details"}</span>{details && <span className="rounded-lg border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{records.length} serviceability records</span>}</div>
            {details ? <><div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="h-1.5 bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-400" /><div className="flex items-start gap-3 p-4 sm:p-5"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"><MapPin size={23} /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">PIN code details</p><p className="mt-1 font-mono text-3xl font-black tracking-tight sm:text-4xl">{details.pincode}</p><h3 className="mt-1 text-base font-bold text-slate-800">{details.postOfficeName || "Post office not provided"}</h3><p className="mt-1 text-xs text-slate-500">{[details.district, details.state].filter(Boolean).join(", ") || "District/state not provided"}</p></div></div></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{[["State", details.state], ["District", details.district], ["Post office", details.postOfficeName], ["Region", details.region], ["Delivery status", details.deliveryStatus]].filter((row) => Boolean(row[1])).map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div>)}</div></> : <div className="flex min-h-56 flex-col items-center justify-center py-9 text-center"><MapPin size={34} className="text-emerald-600" /><h3 className="mt-4 font-extrabold">Search for a location</h3><p className="mt-2 text-sm text-slate-500">Location and lender records will appear after a successful search.</p></div>}
            <p className="mt-4 text-[11px] leading-5 text-slate-500">Location information is displayed from the connected PIN master database.</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,45,95,0.06)] transition-shadow duration-200 hover:shadow-[0_12px_36px_rgba(15,45,95,0.10)] sm:p-6"><div className="flex items-center justify-between gap-2"><div><h2 className="font-extrabold">Location map</h2><p className="mt-1 text-xs text-slate-500">Postal location preview</p></div><span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">India</span></div><div className="mt-4 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-sky-50 to-blue-100">{details ? <><iframe title="PIN code location map" className="h-60 w-full border-0 sm:h-64" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} /><div className="flex items-center justify-between gap-3 bg-white px-3 py-3"><div className="min-w-0"><p className="truncate text-xs font-bold">{details.postOfficeName || details.pincode}</p><p className="truncate text-[11px] text-slate-500">{[details.district, details.state].filter(Boolean).join(", ")}</p></div><a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Open Maps <ExternalLink size={13} /></a></div></> : <div className="flex min-h-64 flex-col items-center justify-center p-5 text-center"><MapPinned size={34} className="text-blue-600" /><p className="mt-3 font-extrabold">Map preview</p><p className="mt-1 text-xs text-slate-500">Search a PIN code to load its location.</p></div>}</div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/50 p-4"><p className="text-[11px] text-slate-500">Lender records</p><p className="mt-1 text-xl font-black">{details ? records.length : "â€”"}</p></div><div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/50 p-4"><p className="text-[11px] text-slate-500">Unique lenders</p><p className="mt-1 text-xl font-black">{details ? lenderCount : "â€”"}</p></div></div></div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-blue-50/70 px-5 py-5 sm:px-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Building2 size={18} /></span><h2 className="text-lg font-extrabold sm:text-xl">Lender serviceability</h2></div><p className="mt-2 text-xs text-slate-500">Records and statuses are displayed as returned by the backend.</p></div><span className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-blue-700">{details ? `${filtered.length} records` : "Awaiting search"}</span></div></div>
          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3 sm:flex-wrap sm:px-5">{categories.map(({ name, code, Icon }) => <button key={code} onClick={() => setActiveTab(code)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${activeTab === code ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20" : "border-slate-200 bg-white text-slate-600 transition-all duration-200 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm hover:shadow-sm"}`}><Icon size={14} />{name}<span className={`rounded-md px-1.5 py-0.5 text-[10px] ${activeTab === code ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>{details ? counts[code] : "â€”"}</span></button>)}</div>
          <div className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 md:grid-cols-[minmax(0,1fr)_220px] sm:px-5"><label className="relative block"><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={tableSearch} onChange={(event) => setTableSearch(event.target.value)} placeholder="Filter lender, product, status or source..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" /></label><label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><SlidersHorizontal size={15} className="shrink-0 text-slate-500" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full bg-transparent py-3 text-xs text-slate-700 outline-none"><option value="ALL">All statuses</option>{uniqueStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></div>
          <div className="max-w-full overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead><tr className="bg-slate-50/90 text-[11px] uppercase tracking-[0.12em] text-slate-500"><th className="px-5 py-3.5 font-bold">#</th><th className="px-5 py-3.5 font-bold">Lender / source</th><th className="px-5 py-3.5 font-bold">Product type</th><th className="px-5 py-3.5 font-bold">Source status</th><th className="px-5 py-3.5 font-bold">Source sheet</th></tr></thead><tbody>{!details ? <tr><td colSpan={5} className="px-5 py-14 text-center"><Search size={24} className="mx-auto text-blue-500" /><p className="mt-3 font-bold">{loading ? "Loading records..." : "Search a PIN code to begin"}</p></td></tr> : filtered.length ? filtered.map((record, index) => <tr key={`${record.lenderName}-${record.sourceSheet}-${record.productType}-${index}`} className="border-t border-slate-100 transition-colors duration-200 hover:bg-blue-50/70"><td className="px-5 py-4 text-xs text-slate-400">{index + 1}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-blue-700 shadow-sm">
                      <Building2 size={20} />
                      {lenderLogoDomain(record.lenderName) && <img
                        src={`https://www.google.com/s2/favicons?domain=${lenderLogoDomain(record.lenderName)}&sz=128`}
                        alt={`${record.lenderName} logo`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full bg-white object-contain p-1.5"
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      />}
                    </span><div><p className="font-bold text-slate-800">{record.lenderName}</p>{record.branchName && <p className="mt-0.5 text-[11px] text-slate-500">{record.branchName}</p>}{record.branchAddress && <p className="mt-0.5 text-[11px] text-slate-500">{record.branchAddress}</p>}</div></div></td><td className="px-5 py-4"><span className="inline-flex rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">{record.productType || "Not specified"}</span></td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusClass(record.status)}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{record.status || "Status not provided"}</span></td><td className="px-5 py-4 text-xs text-slate-500">{record.sourceSheet || "Not provided"}</td></tr>) : <tr><td colSpan={5} className="px-5 py-12 text-center"><p className="font-bold text-slate-700">No records match these filters</p><p className="mt-1 text-xs text-slate-500">Try All records, clear the search field or choose another status.</p></td></tr>}</tbody></table></div>
          <div className="flex flex-wrap items-start gap-3 border-t border-amber-100 bg-amber-50/70 px-5 py-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-black text-amber-800">i</span><div><p className="text-xs font-extrabold text-amber-900">Verify lender terms before advising customers</p><p className="mt-1 max-w-4xl text-xs leading-5 text-amber-800">A source status is not a loan approval or eligibility guarantee. Rates, fees, loan limits and application links are not shown because the current API does not provide those fields.</p></div></div>
        </section>
      </main>
    </DsaShell>
  );
}





