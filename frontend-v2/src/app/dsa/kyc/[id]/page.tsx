"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  XCircle,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

type KycRecord = {
  id: string;
  userId?: string;
  fullName?: string;
  panNumber?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status?: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  expiryDate?: string | null;
  panVerificationStatus?: string;
  aadhaarVerificationStatus?: string;
  bankVerificationStatus?: string;
  panVerifiedAt?: string | null;
  aadhaarVerifiedAt?: string | null;
  bankVerifiedAt?: string | null;
  verificationUpdatedAt?: string | null;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phoneNo?: string;
  };
};

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusText(status?: string) {
  if (!status) return "UNKNOWN";

  return status
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function StatusBadge({ status }: { status?: string }) {
  const value = statusText(status);

  if (value === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-600">
        <CheckCircle2 size={13} />
        APPROVED
      </span>
    );
  }

  if (value === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-600">
        <XCircle size={13} />
        REJECTED
      </span>
    );
  }

  if (value === "UNDER REVIEW") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-black text-purple-600">
        <RefreshCw size={13} />
        UNDER REVIEW
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black text-orange-600">
      <Clock3 size={13} />
      PENDING
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="mt-2 break-words text-sm font-black text-slate-800">
        {value || "-"}
      </div>
    </div>
  );
}

export default function KycDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params?.id || "");

  const [record, setRecord] = useState<KycRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadRecord = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/kyc", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load KYC records.");
        }

        const json = await response.json();

        const list = Array.isArray(json?.kycs) ? json.kycs : [];

        const found = list.find(
          (item: KycRecord) => String(item.id) === String(id)
        );

        if (!found) {
          throw new Error("KYC record not found.");
        }

        setRecord(found);
      } catch (err) {
        console.error("KYC DETAIL ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load KYC details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] p-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <RefreshCw
            className="mx-auto animate-spin text-blue-600"
            size={30}
          />
          <div className="mt-3 text-sm font-black text-slate-700">
            Loading KYC details...
          </div>
        </div>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <XCircle className="mx-auto text-red-500" size={42} />

          <h1 className="mt-4 text-lg font-black text-slate-800">
            KYC Record Not Found
          </h1>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            {error || "The requested KYC record could not be loaded."}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white hover:bg-blue-700"
          >
            <ArrowLeft size={15} />
            Back to KYC
          </button>
        </div>
      </main>
    );
  }

  const customerName =
    record.fullName ||
    record.user?.name ||
    "Unknown Customer";

  const email = record.user?.email || "-";
  const phone = record.user?.phoneNo || "-";

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Back to KYC
          </button>

          <div className="flex items-center gap-2">
            <StatusBadge status={record.status} />
          </div>
        </div>

        {/* HERO */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#06184f] via-[#0757bf] to-[#00a8ee] p-5 text-white shadow-xl md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-cyan-200">
                <ShieldCheck size={15} />
                KYC Verification Details
              </div>

              <h1 className="text-2xl font-black md:text-3xl">
                {customerName}
              </h1>

              <p className="mt-1 text-xs font-semibold text-blue-100">
                KYC ID: {record.id}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-blue-200">
                Submitted: {formatDate(record.createdAt)}
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <ShieldCheck size={42} />
            </div>

          </div>
        </section>

        {/* BASIC DETAILS */}
        <section className="mt-4">
          <div className="mb-3 text-sm font-black text-slate-800">
            Customer Information
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<User size={15} />}
              label="Customer Name"
              value={customerName}
            />

            <InfoCard
              icon={<Mail size={15} />}
              label="Email"
              value={email}
            />

            <InfoCard
              icon={<Phone size={15} />}
              label="Phone"
              value={phone}
            />

            <InfoCard
              icon={<Calendar size={15} />}
              label="Date of Birth"
              value={record.dob}
            />
          </div>
        </section>

        {/* KYC DETAILS */}
        <section className="mt-5">
          <div className="mb-3 text-sm font-black text-slate-800">
            KYC Information
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<CreditCard size={15} />}
              label="PAN Number"
              value={record.panNumber}
            />

            <InfoCard
              icon={<ShieldCheck size={15} />}
              label="PAN Verification"
              value={record.panVerificationStatus}
            />

            <InfoCard
              icon={<ShieldCheck size={15} />}
              label="Aadhaar Verification"
              value={record.aadhaarVerificationStatus}
            />

            <InfoCard
              icon={<ShieldCheck size={15} />}
              label="Bank Verification"
              value={record.bankVerificationStatus}
            />
          </div>
        </section>

        {/* ADDRESS */}
        <section className="mt-5">
          <div className="mb-3 text-sm font-black text-slate-800">
            Address Information
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<MapPin size={15} />}
              label="Address"
              value={record.address}
            />

            <InfoCard
              icon={<MapPin size={15} />}
              label="City"
              value={record.city}
            />

            <InfoCard
              icon={<MapPin size={15} />}
              label="State"
              value={record.state}
            />

            <InfoCard
              icon={<MapPin size={15} />}
              label="Pincode"
              value={record.pincode}
            />
          </div>
        </section>

        {/* STATUS */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-800">
                Verification Status
              </h2>

              <p className="mt-1 text-[10px] font-semibold text-slate-400">
                Current KYC verification state
              </p>
            </div>

            <StatusBadge status={record.status} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<Calendar size={15} />}
              label="Created At"
              value={formatDate(record.createdAt)}
            />

            <InfoCard
              icon={<RefreshCw size={15} />}
              label="Updated At"
              value={formatDate(record.updatedAt)}
            />

            <InfoCard
              icon={<CheckCircle2 size={15} />}
              label="Approved At"
              value={formatDate(record.approvedAt)}
            />

            <InfoCard
              icon={<Calendar size={15} />}
              label="Expiry Date"
              value={formatDate(record.expiryDate)}
            />
          </div>

          {record.rejectionReason && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="text-[9px] font-black uppercase tracking-wide text-red-500">
                Rejection Reason
              </div>

              <div className="mt-1 text-sm font-bold text-red-700">
                {record.rejectionReason}
              </div>
            </div>
          )}
        </section>

        {/* VERIFICATION TIMELINE */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-slate-800">
            Verification Timeline
          </h2>

          <div className="mt-4 space-y-3">

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-600" size={18} />
                <div>
                  <div className="text-xs font-black text-slate-700">
                    PAN Verification
                  </div>
                  <div className="text-[9px] font-semibold text-slate-400">
                    {formatDate(record.panVerifiedAt)}
                  </div>
                </div>
              </div>

              <span className="text-[9px] font-black text-slate-500">
                {record.panVerificationStatus || "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-purple-600" size={18} />
                <div>
                  <div className="text-xs font-black text-slate-700">
                    Aadhaar Verification
                  </div>
                  <div className="text-[9px] font-semibold text-slate-400">
                    {formatDate(record.aadhaarVerifiedAt)}
                  </div>
                </div>
              </div>

              <span className="text-[9px] font-black text-slate-500">
                {record.aadhaarVerificationStatus || "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" size={18} />
                <div>
                  <div className="text-xs font-black text-slate-700">
                    Bank Verification
                  </div>
                  <div className="text-[9px] font-semibold text-slate-400">
                    {formatDate(record.bankVerifiedAt)}
                  </div>
                </div>
              </div>

              <span className="text-[9px] font-black text-slate-500">
                {record.bankVerificationStatus || "PENDING"}
              </span>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}