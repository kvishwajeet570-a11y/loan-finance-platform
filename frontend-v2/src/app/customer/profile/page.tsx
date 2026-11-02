"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound, Mail, Phone, CalendarDays, MapPin, ShieldCheck,
  Pencil, Save, X, RefreshCw, LoaderCircle, CheckCircle2,
  AlertCircle, LockKeyhole, ChevronRight, MapPinned, BadgeCheck
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type Profile = {
  id?: string;
  name?: string | null;
  email?: string | null;
  phoneNo?: string | null;
  role?: string | null;
  profileImage?: string | null;
  isVerified?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  dob?: string | null;
};

type FormData = {
  name: string;
  phoneNo: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  phoneNo: "",
  dob: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function dateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : date.toISOString().slice(0, 10);
}

function dateLabel(value?: string | null) {
  if (!value) return "Not added";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
}

function unwrapProfile(payload: any): Profile {
  return payload?.user ?? payload?.data?.user ?? payload?.data ?? {};
}

function initials(name?: string | null) {
  return (name || "Customer")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("loan_finance_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await api.get("/profile/me");
      const user = unwrapProfile(response.data);

      if (!user?.id) {
        throw new Error("Profile data was not returned by the server.");
      }

      setProfile(user);
      setForm({
        name: user.name || "",
        phoneNo: user.phoneNo || "",
        dob: dateInput(user.dob),
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        router.replace("/login");
        return;
      }
      setError(err?.response?.data?.message || err?.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const completion = useMemo(() => {
    if (!profile) return 0;
    const checks = [
      profile.name,
      profile.email,
      profile.phoneNo,
      profile.dob,
      profile.address,
      profile.city,
      profile.state,
      profile.pincode,
      profile.profileImage,
    ];
    return Math.round((checks.filter((value) => Boolean(String(value || "").trim())).length / checks.length) * 100);
  }, [profile]);

  const incompleteFields = useMemo(() => {
    if (!profile) return [];
    return [
      { label: "Full name", value: profile.name },
      { label: "Phone number", value: profile.phoneNo },
      { label: "Date of birth", value: profile.dob },
      { label: "Address", value: profile.address },
      { label: "City", value: profile.city },
      { label: "State", value: profile.state },
      { label: "PIN code", value: profile.pincode },
      { label: "Profile photo", value: profile.profileImage },
    ].filter((item) => !String(item.value || "").trim());
  }, [profile]);
  const updateField = (key: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const savePersonal = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await api.put("/profile/personal-info", {
        name: form.name.trim(),
        phoneNo: form.phoneNo.trim(),
        dob: form.dob || null,
      });
      setEditingPersonal(false);
      setNotice("Personal information updated successfully.");
      await loadProfile();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to update personal information.");
    } finally {
      setSaving(false);
    }
  };

  const saveAddress = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await api.put("/profile/address-info", {
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      });
      setEditingAddress(false);
      setNotice("Address updated successfully.");
      await loadProfile();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to update address.");
    } finally {
      setSaving(false);
    }
  };

  const cancelPersonal = () => {
    setForm((current) => ({
      ...current,
      name: profile?.name || "",
      phoneNo: profile?.phoneNo || "",
      dob: dateInput(profile?.dob),
    }));
    setEditingPersonal(false);
  };

  const cancelAddress = () => {
    setForm((current) => ({
      ...current,
      address: profile?.address || "",
      city: profile?.city || "",
      state: profile?.state || "",
      pincode: profile?.pincode || "",
    }));
    setEditingAddress(false);
  };

  const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-600";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-3xl border border-white/10 bg-white/10 px-8 py-7 text-white shadow-2xl backdrop-blur-xl">
          <LoaderCircle className="mx-auto mb-3 animate-spin text-cyan-400" size={30} />
          <p className="font-semibold">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-5">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
          <AlertCircle className="mb-3 text-red-500" size={30} />
          <h1 className="text-2xl font-black text-slate-900">Profile unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error || "Your profile could not be loaded."}</p>
          <button onClick={() => void loadProfile()} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">Try again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef4fb] px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">DSA FinCorp · Account Center</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">My Profile</h1>
            <p className="mt-2 text-sm text-slate-500">Your personal information and account preferences.</p>
          </div>
          <button onClick={() => void loadProfile()} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"><AlertCircle className="mr-2 inline" size={17} />{error}</div>}
        {notice && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"><CheckCircle2 className="mr-2 inline" size={17} />{notice}</div>}

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#06152f] via-[#103d70] to-[#087eaa] p-6 text-white shadow-2xl shadow-blue-950/20 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_280px] md:items-center">
            <div className="flex min-w-0 items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[28px] border-2 border-white/30 bg-white/15 text-3xl font-black shadow-xl backdrop-blur sm:h-28 sm:w-28">
                {profile.profileImage ? <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" /> : initials(profile.name)}
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-100"><UserRound size={13}/> Customer Account</span>
                <h2 className="mt-3 truncate text-2xl font-black sm:text-3xl">{profile.name || "Customer"}</h2>
                <p className="mt-1 break-all text-sm text-blue-100">{profile.email || "Email not available"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${profile.isVerified ? "bg-emerald-400/20 text-emerald-100" : "bg-amber-400/20 text-amber-100"}`}>
                    <BadgeCheck size={14}/>{profile.isVerified ? "Verified account" : "Verification pending"}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold capitalize text-white">{profile.role || "Customer"}</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-100">Profile completion</span>
                <span className="text-3xl font-black text-cyan-300">{completion}%</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-700" style={{width:`${completion}%`}} />
              </div>
              <p className="mt-3 text-xs leading-5 text-blue-100">Complete your information to keep your account up to date.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-white bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-cyan-700"><UserRound size={18}/><span className="text-xs font-black uppercase tracking-widest">Personal details</span></div>
                  <h3 className="mt-2 text-xl font-black text-slate-900">Personal Information</h3>
                  <p className="mt-1 text-sm text-slate-400">Manage your basic account details.</p>
                </div>
                {!editingPersonal ? (
                  <button onClick={() => {setNotice("");setEditingPersonal(true);}} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"><Pencil size={15}/> Edit details</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={cancelPersonal} disabled={saving} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600"><X size={15}/> Cancel</button>
                    <button onClick={() => void savePersonal()} disabled={saving || !form.name.trim()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? <LoaderCircle className="animate-spin" size={15}/> : <Save size={15}/>} Save</button>
                  </div>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Full name</span><input className={inputClass} value={form.name} disabled={!editingPersonal || saving} onChange={e=>updateField("name",e.target.value)} placeholder="Enter your full name"/></label>
                <label><span className={labelClass}>Email address · Read only</span><input className={inputClass} value={profile.email || ""} disabled readOnly/></label>
                <label><span className={labelClass}>Phone number</span><input className={inputClass} value={form.phoneNo} disabled={!editingPersonal || saving} onChange={e=>updateField("phoneNo",e.target.value)} placeholder="Enter phone number" inputMode="tel"/></label>
                <label><span className={labelClass}>Date of birth</span><input type="date" className={inputClass} value={form.dob} disabled={!editingPersonal || saving} onChange={e=>updateField("dob",e.target.value)}/></label>
              </div>
              <p className="mt-5 text-xs text-slate-400">Email changes require a separate verified email process.</p>
            </section>

            <section className="rounded-[28px] border border-white bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-cyan-700"><MapPinned size={18}/><span className="text-xs font-black uppercase tracking-widest">Contact location</span></div>
                  <h3 className="mt-2 text-xl font-black text-slate-900">Address Information</h3>
                  <p className="mt-1 text-sm text-slate-400">Your registered communication address.</p>
                </div>
                {!editingAddress ? (
                  <button onClick={() => {setNotice("");setEditingAddress(true);}} className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-2.5 text-sm font-bold text-cyan-700 hover:bg-cyan-100"><Pencil size={15}/> Edit address</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={cancelAddress} disabled={saving} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600"><X size={15}/> Cancel</button>
                    <button onClick={() => void saveAddress()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? <LoaderCircle className="animate-spin" size={15}/> : <Save size={15}/>} Save</button>
                  </div>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className={labelClass}>Address</span><textarea rows={3} className={inputClass} value={form.address} disabled={!editingAddress || saving} onChange={e=>updateField("address",e.target.value)} placeholder="House number, street, area"/></label>
                <label><span className={labelClass}>City</span><input className={inputClass} value={form.city} disabled={!editingAddress || saving} onChange={e=>updateField("city",e.target.value)} placeholder="City"/></label>
                <label><span className={labelClass}>State</span><input className={inputClass} value={form.state} disabled={!editingAddress || saving} onChange={e=>updateField("state",e.target.value)} placeholder="State"/></label>
                <label><span className={labelClass}>PIN code</span><input className={inputClass} value={form.pincode} disabled={!editingAddress || saving} onChange={e=>updateField("pincode",e.target.value)} placeholder="6-digit PIN code" inputMode="numeric" maxLength={6}/></label>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-white bg-white p-6 shadow-xl shadow-slate-200/60">
              <h3 className="text-lg font-black text-slate-900">Account Overview</h3>
              <p className="mt-1 text-sm text-slate-400">Your account at a glance.</p>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3"><div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><Mail size={19}/></div><div><p className="text-xs text-slate-400">Email status</p><p className="text-sm font-bold text-slate-800">{profile.isVerified ? "Verified" : "Not verified"}</p></div></div>
                <div className="flex items-center gap-3"><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><CalendarDays size={19}/></div><div><p className="text-xs text-slate-400">Member since</p><p className="text-sm font-bold text-slate-800">{dateLabel(profile.createdAt)}</p></div></div>
                <div className="flex items-center gap-3"><div className="rounded-2xl bg-violet-50 p-3 text-violet-700"><Phone size={19}/></div><div><p className="text-xs text-slate-400">Phone number</p><p className="text-sm font-bold text-slate-800">{profile.phoneNo || "Not added"}</p></div></div>
                <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-50 p-3 text-amber-700"><MapPin size={19}/></div><div><p className="text-xs text-slate-400">Location</p><p className="text-sm font-bold text-slate-800">{[profile.city,profile.state].filter(Boolean).join(", ") || "Not added"}</p></div></div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between gap-2"><h3 className="text-lg font-black text-slate-900">Profile Checklist</h3><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{incompleteFields.length} pending</span></div>
              {incompleteFields.length === 0 ? <p className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 size={18}/> All details completed</p> : <div className="mt-5 space-y-3">{incompleteFields.map(item=><div key={item.label} className="flex items-center gap-2 text-sm text-slate-600"><AlertCircle size={15} className="text-amber-500"/>{item.label} not added</div>)}<button onClick={()=>{setEditingPersonal(true);setEditingAddress(true);setNotice("");}} className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20">Complete Profile</button></div>}
            </section>

            <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#06152f] via-[#103d70] to-[#087eaa] p-6 text-white shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><LockKeyhole size={23}/></div>
              <h3 className="mt-5 text-xl font-black">Account Security</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">Protect your account with a strong password and keep your sign-in credentials secure.</p>
              <Link href="/customer/profile/security" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-blue-800 transition hover:bg-cyan-50">Security settings <ChevronRight size={16}/></Link>
            </section>

            <section className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-6">
              <div className="flex items-center gap-2 text-emerald-700"><ShieldCheck size={19}/><h3 className="font-black">Privacy & Safety</h3></div>
              <p className="mt-3 text-sm leading-6 text-slate-600">Your profile is linked to your signed-in account. Only the authenticated account can update its own details.</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
