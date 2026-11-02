"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, LockKeyhole, ShieldCheck, Eye, EyeOff,
  LoaderCircle, CheckCircle2, AlertCircle
} from "lucide-react";
import api from "@/lib/api";

export default function CustomerProfileSecurityPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (oldPassword === newPassword) {
      setError("Choose a password different from your current password.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("loan_finance_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await api.patch("/profile/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess(response.data?.message || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.replace("/login");
        return;
      }
      setError(err?.response?.data?.message || "Unable to change password. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const fieldClass = "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100";

  return (
    <main className="min-h-screen bg-[#eef4fb] px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <Link href="/customer/profile" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-cyan-700"><ArrowLeft size={17}/> Back to My Profile</Link>

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#06152f] via-[#103d70] to-[#087eaa] p-7 text-white shadow-2xl shadow-blue-950/20 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl"/>
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur"><ShieldCheck size={32} className="text-cyan-200"/></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200">DSA FinCorp · Account protection</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Security Settings</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Manage your password and protect access to your account.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
          <section className="rounded-[30px] border border-white bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-700"><LockKeyhole size={25}/></div>
              <div><h2 className="text-xl font-black text-slate-900">Change Password</h2><p className="mt-1 text-sm text-slate-400">Choose a strong password with at least 8 characters.</p></div>
            </div>

            {error && <div className="mb-5 flex gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="shrink-0"/>{error}</div>}
            {success && <div className="mb-5 flex gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={18} className="shrink-0"/>{success}</div>}

            <form onSubmit={submit} className="space-y-6">
              <label className="block"><span className="text-xs font-black uppercase tracking-widest text-slate-500">Current password</span><span className="relative block"><input required autoComplete="current-password" type={showOld ? "text" : "password"} value={oldPassword} onChange={e=>setOldPassword(e.target.value)} className={fieldClass} placeholder="Enter current password"/><button type="button" onClick={()=>setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700" aria-label="Toggle current password visibility">{showOld ? <EyeOff size={19}/> : <Eye size={19}/>}</button></span></label>

              <label className="block"><span className="text-xs font-black uppercase tracking-widest text-slate-500">New password</span><span className="relative block"><input required minLength={8} autoComplete="new-password" type={showNew ? "text" : "password"} value={newPassword} onChange={e=>setNewPassword(e.target.value)} className={fieldClass} placeholder="Create a new password"/><button type="button" onClick={()=>setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700" aria-label="Toggle new password visibility">{showNew ? <EyeOff size={19}/> : <Eye size={19}/>}</button></span><span className="mt-2 block text-xs text-slate-400">{newPassword.length} / 8 minimum characters</span></label>

              <label className="block"><span className="text-xs font-black uppercase tracking-widest text-slate-500">Confirm new password</span><input required minLength={8} autoComplete="new-password" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className={fieldClass} placeholder="Re-enter new password"/></label>

              <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{saving ? <LoaderCircle size={18} className="animate-spin"/> : <LockKeyhole size={18}/ >}{saving ? "Updating password..." : "Update Password"}</button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] bg-gradient-to-br from-[#06152f] to-[#12618d] p-6 text-white shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><ShieldCheck size={23}/></div>
              <h3 className="mt-5 text-xl font-black">Password Safety</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">Keep your password private. Never share your sign-in credentials with anyone.</p>
              <div className="mt-6 space-y-3 text-sm text-blue-50">
                <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-300"/> Use at least 8 characters</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-300"/> Choose a unique password</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-300"/> Do not share your password</p>
              </div>
            </section>
            <section className="rounded-[28px] border border-cyan-100 bg-white p-6 shadow-lg shadow-slate-200/50">
              <div className="flex items-center gap-2 text-cyan-700"><ShieldCheck size={19}/><h3 className="font-black text-slate-900">Secure Account</h3></div>
              <p className="mt-3 text-sm leading-6 text-slate-500">Password changes are verified by the server using your current password.</p>
              <Link href="/customer/profile" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-cyan-700"><ArrowLeft size={15}/> Return to profile</Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
