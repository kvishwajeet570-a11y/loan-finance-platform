"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Star,
} from "lucide-react";
import api from "@/lib/api";

export default function AddBankAccountPage() {
  const router = useRouter();

  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const maskedAccount =
    accountNumber.length > 4
      ? `•••• •••• •••• ${accountNumber.slice(-4)}`
      : "•••• •••• ••••";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("loan_finance_token");
    const storedUser = localStorage.getItem("loan_finance_user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    let user: any = {};

    try {
      user = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("loan_finance_token");
      localStorage.removeItem("loan_finance_user");
      router.replace("/login");
      return;
    }

    const userId = user?.id;

    if (!userId) {
      setError("Customer account information not found. Please login again.");
      return;
    }

    if (
      !accountHolderName.trim() ||
      !bankName.trim() ||
      !accountNumber.trim() ||
      !ifscCode.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/bank",
        {
          userId,
          accountHolderName: accountHolderName.trim(),
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim().toUpperCase(),
          branchName: branchName.trim(),
          isPrimary,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setMessage("Bank account added successfully.");

      setAccountHolderName("");
      setBankName("");
      setAccountNumber("");
      setIfscCode("");
      setBranchName("");
      setIsPrimary(false);

      setTimeout(() => {
        router.push("/customer/bank-accounts");
      }, 900);
    } catch (err: any) {
      console.error("Add Bank Account Error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to add bank account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen bg-[#f6f8fc] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/customer/bank-accounts")}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition group-hover:border-blue-200 group-hover:bg-blue-50">
              <ArrowLeft size={16} />
            </span>
            <span className="hidden sm:block">
              Back to Bank Accounts
            </span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
              <LockKeyhole size={12} className="text-emerald-600" />
            </span>
            <span className="text-[11px] font-bold text-slate-600">
              Secure
            </span>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-6">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
            Bank Management
          </p>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Add Bank Account
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Add an account for secure loan disbursement.
          </p>
        </div>

        {/* MAIN */}
        <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">

          {/* LEFT */}
          <div className="space-y-4">

            {/* BANK CARD */}
            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#111827] via-[#174ea6] to-[#312e81] p-6 text-white shadow-xl shadow-blue-900/20">

              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border-[25px] border-white/5" />
              <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-white/5" />

              <div className="relative">

                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Building2 size={21} />
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200">
                      Account
                    </p>
                    <p className="mt-0.5 text-xs font-bold">
                      BANKING
                    </p>
                  </div>
                </div>

                <div className="mt-9">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200">
                    Account Number
                  </p>

                  <p className="mt-2 font-mono text-lg font-bold tracking-[0.12em]">
                    {maskedAccount}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">
                      Holder
                    </p>
                    <p className="mt-1 truncate text-sm font-bold">
                      {accountHolderName || "YOUR NAME"}
                    </p>
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">
                      IFSC
                    </p>
                    <p className="mt-1 truncate text-sm font-bold">
                      {ifscCode || "XXXXXXXXXXX"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="truncate text-xs font-semibold text-blue-100">
                    {bankName || "Your Bank Name"}
                  </p>
                </div>
              </div>
            </div>

            {/* SECURITY */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <ShieldCheck
                    size={19}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Secure information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your banking details are securely submitted for
                    account verification.
                  </p>
                </div>
              </div>
            </div>

            {/* STEPS */}
            <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Account Setup
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check size={14} />
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Enter bank details
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-400">
                    2
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Verification
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.04]">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CreditCard size={19} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Account Details
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Enter your bank information below
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">

              {message && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={18} />
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Account Holder Name
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) =>
                        setAccountHolderName(e.target.value)
                      }
                      placeholder="Enter full name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Bank Name
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Enter bank name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Account Number
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={accountNumber}
                      onChange={(e) =>
                        setAccountNumber(
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      placeholder="Enter account number"
                      className={`${inputClass} font-mono tracking-wide`}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      IFSC Code
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      maxLength={11}
                      value={ifscCode}
                      onChange={(e) =>
                        setIfscCode(e.target.value.toUpperCase())
                      }
                      placeholder="SBIN0001234"
                      className={`${inputClass} font-bold uppercase tracking-wider`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Branch Name
                    <span className="ml-2 normal-case tracking-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Enter branch name"
                    className={inputClass}
                  />
                </div>

                {/* PRIMARY */}
                <button
                  type="button"
                  onClick={() => setIsPrimary(!isPrimary)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
                    isPrimary
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isPrimary
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-400"
                      }`}
                    >
                      <Star
                        size={18}
                        fill={isPrimary ? "currentColor" : "none"}
                      />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">
                        Set as Primary Account
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Use this account as your preferred account.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      isPrimary ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        isPrimary ? "left-6" : "left-1"
                      }`}
                    />
                  </div>
                </button>

                {/* ACTIONS */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/customer/bank-accounts")
                    }
                    className="h-12 rounded-xl border border-slate-300 bg-white px-7 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Saving Account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={17} />
                        Add Bank Account
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
          <LockKeyhole size={13} />
          Secure banking information
        </div>
      </div>
    </div>
  );
}
