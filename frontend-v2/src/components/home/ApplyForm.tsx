"use client";

import {
  CheckCircle2,
  Loader2,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";

interface ApplyFormData {
  fullName: string;
  panNo: string;
  mobileNumber: string;
}

const initialForm: ApplyFormData = {
  fullName: "",
  panNo: "",
  mobileNumber: "",
};

export default function ApplyForm() {
  const [form, setForm] = useState<ApplyFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "panNo") {
      setForm((previous) => ({
        ...previous,
        panNo: value
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 10),
      }));
      return;
    }

    if (name === "mobileNumber") {
      setForm((previous) => ({
        ...previous,
        mobileNumber: value
          .replace(/\D/g, "")
          .slice(0, 10),
      }));
      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    const fullName = form.fullName.trim();
    const panNo = form.panNo.trim().toUpperCase();
    const mobileNumber = form.mobileNumber.trim();

    if (fullName.length < 3) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNo)) {
      setError("Please enter a valid PAN number.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      /*
       * PUBLIC APPLY FORM
       *
       * Only these 3 user-entered fields are collected:
       * fullName
       * panNo
       * mobileNumber
       *
       * Existing backend Lead API stores this information
       * in the database Lead table.
       */

      const payload = {
        fullName,
        mobileNumber,
        panNo,
        productType: "PERSONAL_LOAN",
        source: "WEBSITE",
        priority: "HIGH",
        remarks: "Home Page Apply Loan Form",
      };

      const response = await api.post(
        "/lead",
        payload,
        {
          withCredentials: false,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Application could not be submitted."
        );
      }

      setSuccess(
        "Application submitted successfully. Our team will contact you shortly."
      );

      setForm(initialForm);

    } catch (err: any) {
      console.error("Apply Loan Form Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit your application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="apply-now"
      className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 py-14 sm:py-16"
    >

      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_430px]">

          {/* LEFT */}
          <div className="text-white">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Quick & Secure Application
            </div>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Apply for a Loan
              <span className="block text-cyan-300">
                in Just a Few Steps
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Enter your basic details and our loan assistance team
              will contact you shortly.
            </p>

          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-white/20 bg-white p-5 shadow-2xl sm:p-7">

            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-950">
                Apply Now
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Just 3 details required
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME */}
              <div>

                <label
                  htmlFor="apply-full-name"
                  className="mb-1.5 block text-xs font-bold text-slate-700"
                >
                  Full Name *
                </label>

                <div className="relative">

                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="apply-full-name"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                  />

                </div>
              </div>

              {/* PAN */}
              <div>

                <label
                  htmlFor="apply-pan"
                  className="mb-1.5 block text-xs font-bold text-slate-700"
                >
                  PAN Card Number *
                </label>

                <input
                  id="apply-pan"
                  type="text"
                  name="panNo"
                  value={form.panNo}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  autoComplete="off"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold uppercase tracking-wider text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                />

              </div>

              {/* MOBILE */}
              <div>

                <label
                  htmlFor="apply-mobile"
                  className="mb-1.5 block text-xs font-bold text-slate-700"
                >
                  Mobile Number *
                </label>

                <div className="relative">

                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="apply-mobile"
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                  />

                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-700">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="flex gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold leading-5 text-green-700">

                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{success}</span>

                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Apply Now"
                )}

              </button>

              <p className="text-center text-[10px] font-medium leading-4 text-slate-400">
                Your information is securely submitted for loan assistance.
              </p>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
