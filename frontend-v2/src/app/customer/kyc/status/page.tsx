"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type KycData = {
  id?: string;
  status?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  address?: string;
  bankAccountNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
  dob?: string;
  mobile?: string;
  email?: string;
  panVerificationStatus?: string;
  aadhaarVerificationStatus?: string;
  addressVerificationStatus?: string;
  bankVerificationStatus?: string;
};

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("loan_finance_token") || "";
}

function getUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("loan_finance_user") || "null");
  } catch {
    return null;
  }
}

function maskPan(value?: string) {
  if (!value) return "Not available";
  return value.length > 4 ? `${value.slice(0, 2)}••••••${value.slice(-1)}` : value;
}

function maskAadhaar(value?: string) {
  if (!value) return "Not available";
  const digits = value.replace(/\D/g, "");
  return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : "Not available";
}

function maskBank(value?: string) {
  if (!value) return "Not available";
  const digits = value.replace(/\D/g, "");
  return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : "Not available";
}

function StatusBadge({ children = "Pending" }: { children?: string }) {
  const verified = children.toUpperCase() === "VERIFIED" || children.toUpperCase() === "APPROVED";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
      verified
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
        : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
    }`}>
      <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${
        verified ? "bg-emerald-500" : "bg-amber-500"
      }`}>
        {verified ? "✓" : "•"}
      </span>
      {children}
    </span>
  );
}

function DocumentCard({
  type,
  number,
}: {
  type: "pan" | "aadhaar";
  number: string;
}) {
  const pan = type === "pan";
  const title = pan ? "PAN Card" : "Aadhaar Card";
  const available = number !== "Not available";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <StatusBadge>{available ? "Available" : "Pending"}</StatusBadge>
      </div>

      <div className="flex h-36 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="text-center">
          <div className="text-4xl">▤</div>
          <div className="mt-2 text-sm font-bold text-[#102a56]">
            {available ? "Document Details" : "Document Not Available"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {available ? "Information received from your KYC profile" : "No document information available"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">
            {pan ? "PAN Number" : "Aadhaar Number"}
          </div>
          <div className="mt-0.5 text-base font-extrabold tracking-wide text-[#102a56]">
            {number}
          </div>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${available ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
          {available ? "✓" : "•"}
        </div>
      </div>
    </div>
  );
}

export default function KycStatusPage() {
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportMessage, setSupportMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const user = getUser();

        if (!user?.id) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API}/kyc/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          credentials: "include",
        });

        const json = await response.json();

        if (response.ok && json?.data) {
          setKyc(json.data);
        }
      } catch {
        // Keep the status screen usable if the API is temporarily unavailable.
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const user = getUser();
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.firstName ||
    "Vishwajeet Agarwal";

  const verifiedDate = kyc?.updatedAt
    ? new Date(kyc.updatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "15 Sep 2026";

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-4 pb-28 pt-4 md:px-6">
      <div className="mx-auto max-w-[1400px] space-y-4">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="relative min-h-[250px] overflow-hidden">
            <img
              src="/images/kyc/kyc-ai-banner.png"
              alt="KYC Security"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />

            <div className="absolute left-8 top-[34%] max-w-[55%] -translate-y-1/2">
              <div className="mb-3 inline-flex rounded-full bg-white/95 px-4 py-2 text-xs font-bold tracking-wide text-[#102a56] shadow-sm">
                🛡 SECURE • FAST • TRUSTED
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-[#102a56]">
                KYC <span className="text-blue-600">Status</span>
              </h1>

              <p className="mt-2 text-base font-semibold text-slate-600">
                Track your verification progress in real-time.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your trust drives our commitment to a safer and smarter
                financial future.
              </p>
            </div>

            <div className="absolute right-7 top-[28%] space-y-2 text-sm font-bold text-[#102a56]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                Your Data is Secure
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                Faster Approvals
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                100% Digital Process
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                Trusted by Thousands
              </div>
            </div>
          </div>
        </section>

        {/* VERIFIED SUMMARY */}
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
                <span className="text-4xl font-black text-emerald-500">✓</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-extrabold text-emerald-700">
                    KYC Verified
                  </h2>
                  <StatusBadge />
                </div>
                <p className="mt-1 text-base font-medium text-slate-600">
                  Your identity has been successfully verified.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  You can now access all loan services and enjoy a seamless experience.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-6 py-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Verified On
              </div>
              <div className="mt-1 text-lg font-extrabold text-[#102a56]">
                {verifiedDate}
              </div>
              <div className="text-xs text-slate-500">KYC verification completed</div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="mt-7 border-t border-slate-100 pt-7">
            <div className="relative">
              <div className="absolute left-[6%] right-[6%] top-5 h-1 rounded bg-emerald-500" />

              <div className="relative grid grid-cols-5 gap-2">
                {[
                  "Personal Details",
                  "Identity Verification",
                  "Address Verification",
                  "Bank Verification",
                  "Review & Submit",
                ].map((item, index) => (
                  <div key={item} className="text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-extrabold text-white shadow-sm ring-4 ring-emerald-50">
                      ✓
                    </div>
                    <div className="mt-3 text-sm font-bold text-[#102a56]">
                      {index + 1}. {item}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-emerald-600">
                      Completed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER */}
        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-extrabold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-extrabold text-[#102a56]">
                    {displayName}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    ● KYC Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Customer verification profile
                </p>
              </div>
            </div>

            <div className="min-w-[280px]">
              <div className="mb-2 flex justify-between text-sm font-bold text-[#102a56]">
                <span>KYC Completion</span>
                <span>100%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-full rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </section>

        {/* DOCUMENT VERIFICATION */}
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#102a56]">
                📄 Document Verification
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {String(kyc?.status || "PENDING").toUpperCase() === "APPROVED"
                  ? "Your submitted KYC documents have been verified."
                  : "Your submitted KYC documents are being processed."}
              </p>
            </div>

            <StatusBadge>
              {String(kyc?.status || "PENDING").toUpperCase()}
            </StatusBadge>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DocumentCard
              type="pan"
              number={maskPan(kyc?.panNumber)}
            />

            <DocumentCard
              type="aadhaar"
              number={maskAadhaar(kyc?.aadhaarNumber)}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#102a56]">
                    📍 Address Proof
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Residential address verification
                  </div>
                </div>
                <StatusBadge>
                  {String(kyc?.addressVerificationStatus || "PENDING").toUpperCase()}
                </StatusBadge>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#102a56]">
                    🏦 Bank Account
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {maskBank(kyc?.bankAccountNumber)}
                  </div>
                </div>
                <StatusBadge>
                  {String(kyc?.bankVerificationStatus || "PENDING").toUpperCase()}
                </StatusBadge>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS */}
        {/* DETAILS */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#102a56]">
              Verification Summary
            </h2>

            <div className="mt-5 space-y-3">
              {[
                ["Personal Details", kyc?.fullName && kyc?.dob && kyc?.mobile && kyc?.email ? "Completed" : "Pending"],
                ["PAN Verification", String(kyc?.panVerificationStatus || "PENDING").toUpperCase()],
                ["Aadhaar Verification", String(kyc?.aadhaarVerificationStatus || "PENDING").toUpperCase()],
                ["Address Verification", String(kyc?.addressVerificationStatus || "PENDING").toUpperCase()],
                ["Bank Verification", String(kyc?.bankVerificationStatus || "PENDING").toUpperCase()],
              ].map(([label, status]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-slate-600">
                    {label}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    ✓ {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#102a56]">
              KYC Activity
            </h2>

            <div className="mt-5 space-y-4">
              {[
                [kyc?.updatedAt ? new Date(kyc.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—", `KYC status: ${String(kyc?.status || "PENDING").toUpperCase()}`],
                [kyc?.createdAt ? new Date(kyc.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—", "KYC application created"],
              ].map(([date, text], index) => (
                <div key={`${date}-${index}`} className="flex gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  <div>
                    <div className="text-xs font-bold text-slate-400">{date}</div>
                    <div className="text-sm font-semibold text-[#102a56]">{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HELP */}
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#102a56]">
                Need Help?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                If you face any issue with your KYC verification, our support
                team is here to help.
              </p>
              {supportMessage && (
                <p className="mt-2 text-sm font-bold text-emerald-600">
                  {supportMessage}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setSupportMessage("Support request started. Our team will assist you.")
              }
              className="rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
            >
              🎧 Contact Support
            </button>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div className="hidden text-sm font-medium text-slate-500 md:block">
            🛡 Your information is encrypted and secure.
          </div>

          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={() =>
                setSupportMessage("Your KYC status is already fully verified.")
              }
              className="rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50"
            >
              View KYC
            </button>

            <button
              type="button"
              onClick={() =>
                setSupportMessage("KYC verification is already completed ✓")
              }
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
            >
              KYC Verified ✓
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}




