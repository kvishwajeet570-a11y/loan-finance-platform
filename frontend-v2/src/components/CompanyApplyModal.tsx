"use client";

import { useEffect, useState } from "react";

type Company = {
  name: string;
  interestRate: string;
  logo?: string;
};

type Props = {
  company: Company | null;
  open: boolean;
  onClose: () => void;
};

export default function CompanyApplyModal({
  company,
  open,
  onClose,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setFullName("");
    setPhone("");
    setPan("");
    setAccepted(false);
    setError("");
  }, [open, company]);

  useEffect(() => {
    if (!open) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !company) return null;

  const submitApplication = async () => {
    setError("");

    const cleanName = fullName.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanPan = pan.trim().toUpperCase();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPan)) {
      setError("Please enter a valid PAN number.");
      return;
    }

    if (!accepted) {
      setError("Please accept Privacy Policy and Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Backend integration will be connected here.
       * For now this validates the modal form.
       */

      await new Promise((resolve) => setTimeout(resolve, 700));

      alert(
        `Application started for ${company.name}\n\nName: ${cleanName}\nPhone: ${cleanPhone}\nPAN: ${cleanPan}`
      );

      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-[540px] overflow-y-auto rounded-[24px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">

        {/* TOP */}
        <div className="border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-2xl font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            ×
          </button>

          <div className="pr-10">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-xl font-black text-white shadow-lg">
                $
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Loan Partner
                </p>

                <h2 className="text-xl font-black text-slate-900">
                  {company.name}
                </h2>
              </div>

            </div>

            <h3 className="text-2xl font-black leading-tight text-slate-900">
              Apply for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {company.name}
              </span>
            </h3>

            <p className="mt-1 text-base font-bold text-slate-700">
              Interest Rate: {company.interestRate}
            </p>

          </div>
        </div>

        {/* SECURITY BOX */}
        <div className="mx-6 mt-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:mx-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
              🛡️
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Quick & Secure Application
              </p>

              <p className="text-sm text-slate-500">
                Your information is safe and secure with us.
              </p>
            </div>

          </div>

        </div>

        {/* FORM */}
        <div className="px-6 pb-7 pt-5 sm:px-8">

          {/* FULL NAME */}
          <label className="mb-2 block text-sm font-bold text-slate-800">
            Full Name <span className="text-red-500">*</span>
          </label>

          <div className="relative mb-5">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              👤
            </span>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* PHONE */}
          <label className="mb-2 block text-sm font-bold text-slate-800">
            Phone Number <span className="text-red-500">*</span>
          </label>

          <div className="relative mb-5">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              ☎
            </span>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter your 10-digit mobile number"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* PAN */}
          <label className="mb-2 block text-sm font-bold text-slate-800">
            PAN Number <span className="text-red-500">*</span>
          </label>

          <div className="relative mb-5">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              ▣
            </span>

            <input
              type="text"
              maxLength={10}
              value={pan}
              onChange={(e) =>
                setPan(
                  e.target.value
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .slice(0, 10)
                    .toUpperCase()
                )
              }
              placeholder="Enter your PAN number (e.g. ABCDE1234F)"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium uppercase outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* TERMS */}
          <label className="mb-6 flex cursor-pointer items-start gap-3">

            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
            />

            <span className="text-sm leading-6 text-slate-600">
              I accept{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                className="font-semibold text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                target="_blank"
                className="font-semibold text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Terms & Conditions
              </a>
            </span>

          </label>

          {/* APPLY BUTTON */}
          <button
            type="button"
            disabled={loading}
            onClick={submitApplication}
            className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 px-6 py-3.5 text-base font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Apply / Login"}
            {!loading && <span className="text-lg">→</span>}
          </button>

          {/* SECURE TEXT */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <span>🔒</span>
            <span>Your data is encrypted and 100% secure</span>
          </div>

        </div>
      </div>
    </div>
  );
}
