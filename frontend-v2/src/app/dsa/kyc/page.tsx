"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  FileImage,
  FileText,
  HelpCircle,
  Info,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  UploadCloud,
  User,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

type FileMap = {
  pan: File | null;
  aadhaar: File | null;
  bank: File | null;
  agreement: File | null;
};

type FormData = {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  pan: string;
  city: string;
  state: string;
  pincode: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
};

const initialForm: FormData = {
  fullName: "",
  dob: "",
  gender: "",
  mobile: "",
  email: "",
  pan: "",
  city: "",
  state: "",
  pincode: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  accountHolder: "",
};

function SectionHeader({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-md shadow-blue-100">
          {icon}
        </div>

        <div>
          <h2 className="text-[17px] font-black leading-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      {badge}
    </div>
  );
}

function Field({
  label,
  required,
  icon,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-black text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-[12px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  required,
  icon,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-black text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500">
          {icon}
        </span>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9.5 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-9 text-[12px] font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </label>
  );
}

function UploadBox({
  title,
  subtitle,
  accent,
  file,
  required,
  onFile,
}: {
  title: string;
  subtitle: string;
  accent: "blue" | "red" | "green" | "purple";
  file: File | null;
  required?: boolean;
  onFile: (file: File | null) => void;
}) {
  const inputId = `upload-${title.replace(/\s+/g, "-").toLowerCase()}`;

  const accentClasses = {
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50/30",
      text: "text-blue-700",
      icon: "bg-blue-100 text-blue-700",
    },
    red: {
      border: "border-red-200",
      bg: "bg-red-50/30",
      text: "text-red-700",
      icon: "bg-red-100 text-red-600",
    },
    green: {
      border: "border-emerald-200",
      bg: "bg-emerald-50/30",
      text: "text-emerald-700",
      icon: "bg-emerald-100 text-emerald-700",
    },
    purple: {
      border: "border-purple-200",
      bg: "bg-purple-50/30",
      text: "text-purple-700",
      icon: "bg-purple-100 text-purple-700",
    },
  }[accent];

  return (
    <div
      className={`rounded-xl border ${accentClasses.border} ${accentClasses.bg} p-2.5`}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className={`rounded-lg p-1.5 ${accentClasses.icon}`}>
          <FileText size={17} />
        </div>

        <div className="min-w-0">
          <div className="truncate text-[13px] font-black text-slate-900">
            {title} {required && <span className="text-red-500">*</span>}
          </div>
          <div className={`text-[10px] font-semibold ${accentClasses.text}`}>
            {subtitle}
          </div>
        </div>
      </div>

      <input
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />

      <label
        htmlFor={inputId}
        className={`flex min-h-[66px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed ${accentClasses.border} bg-white/80 px-2 text-center transition hover:bg-white`}
      >
        {file ? (
          <>
            <Check size={21} className="mb-1 text-emerald-500" />
            <span className="max-w-full truncate text-[10px] font-black text-emerald-700">
              {file.name}
            </span>
            <span className="mt-0.5 text-[9px] text-slate-400">
              Click to replace
            </span>
          </>
        ) : (
          <>
            <UploadCloud size={21} className="mb-1 text-blue-600" />
            <span className="text-[10px] font-black text-blue-700">
              Click to upload or drag & drop
            </span>
            <span className="mt-0.5 text-[9px] text-slate-500">
              PDF, JPG, PNG (Max 5MB)
            </span>
          </>
        )}
      </label>
    </div>
  );
}

export default function KycPage() {
  const [form, setForm] = useState<FormData>(initialForm);

  const [files, setFiles] = useState<FileMap>({
    pan: null,
    aadhaar: null,
    bank: null,
    agreement: null,
  });

  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const updateField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const completion = useMemo(() => {
    const values = Object.values(form);
    const filledFields = values.filter((value) => value.trim() !== "").length;

    const uploaded = Object.values(files).filter(Boolean).length;

    const total = values.length + 4;

    return Math.round(((filledFields + uploaded) / total) * 100);
  }, [form, files]);

  const submitKyc = () => {
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const saveDraft = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f7faff] text-slate-900">
      {/* =========================================================
          TOP NAVIGATION
      ========================================================= */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="flex h-[62px] items-center gap-4 px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setMobileMenu((value) => !value)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {mobileMenu ? <X size={23} /> : <Menu size={23} />}
          </button>

          <button
            type="button"
            className="hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:block"
          >
            <Menu size={23} />
          </button>

          <div className="relative hidden max-w-[650px] flex-1 md:block">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              placeholder="Search customers, applications, documents..."
              className="h-10 w-full rounded-full bg-[#eef3fb] pl-11 pr-4 text-[13px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100"
            >
              <Bell size={22} />
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                3
              </span>
            </button>

            <button
              type="button"
              className="hidden rounded-full p-2 text-slate-700 hover:bg-slate-100 sm:block"
            >
              <Sparkles size={21} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <UserRound size={25} className="text-slate-500" />
              </div>

              <div className="hidden leading-tight md:block">
                <div className="text-[13px] font-black text-slate-900">
                  Prakash Kumar
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  DSA Partner
                </div>
              </div>

              <ChevronDown size={17} className="hidden text-slate-600 md:block" />
            </div>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                placeholder="Search customers, applications, documents..."
                className="h-10 w-full rounded-xl bg-slate-100 pl-10 pr-3 text-sm outline-none"
              />
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-[1700px] px-3 py-3 sm:px-4 lg:px-6">
        {/* =========================================================
            HERO + APPROVAL CARD
        ========================================================= */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section
            className="relative min-h-[230px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
            style={{
              backgroundImage:
                'url("/images/kyc/kyc-banner-final.png")',
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/65 to-transparent" />

            <div className="relative z-10 flex h-full min-h-[230px] flex-col justify-center px-6 py-7 sm:px-8 lg:max-w-[58%]">
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-blue-300 bg-blue-50/90 px-3 py-1.5 text-[11px] font-black text-slate-800">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white">
                  <ShieldCheck size={13} />
                </span>
                KYC VERIFICATION
              </div>

              <h1 className="text-[32px] font-black leading-[0.98] tracking-tight text-[#101b55] sm:text-[40px]">
                Complete <span className="text-blue-600">KYC</span>
                <br />
                Unlock All Loan Products
              </h1>

              <p className="mt-3 max-w-[590px] text-[13px] font-medium leading-relaxed text-slate-600">
                Verify customer details securely and get faster loan approvals
                across 50+ banks & NBFC partners.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "100% Secure",
                  "Quick Verification",
                  "PAN Based KYC",
                  "All Financial Products",
                  "Trusted by 10,000+ DSAs",
                ].map((item, index) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/90 px-2.5 py-1.5 text-[10px] font-black text-slate-700 shadow-sm"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check size={10} strokeWidth={4} />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-[#f8f5ff] to-[#eef5ff] p-5 shadow-sm">
            <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-purple-200/30 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <h2 className="max-w-[230px] text-[24px] font-black leading-tight text-[#21145d]">
                  Faster Approvals
                  <br />
                  <span className="text-[#101b55]">with Verified KYC</span>
                </h2>

                <div className="text-4xl">🚀</div>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  "Higher Loan Approval Chances",
                  "Faster Disbursal",
                  "Access to Multiple Lenders",
                  "All Financial Products",
                  "Dedicated DSA Support",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[12px] font-semibold text-slate-700"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-400 text-[#064e3b]">
                      <Check size={13} strokeWidth={4} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 right-0 text-3xl text-amber-400">
                ✦
              </div>
            </div>
          </section>
        </div>

        {/* =========================================================
            STEPPER
        ========================================================= */}
        <section className="mt-3 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[
              {
                number: 1,
                title: "Personal Details",
                subtitle: "Enter customer information",
                active: true,
              },
              {
                number: 2,
                title: "Bank Details",
                subtitle: "Add bank account information",
              },
              {
                number: 3,
                title: "Document Upload",
                subtitle: "Upload required documents",
              },
              {
                number: 4,
                title: "Review & Submit",
                subtitle: "Verify and complete KYC",
              },
            ].map((step, index) => (
              <div
                key={step.number}
                className="relative flex items-center gap-3 px-5 py-3"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[18px] font-black ${
                    step.active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step.number}
                </div>

                <div className="min-w-0">
                  <div
                    className={`text-[14px] font-black ${
                      step.active ? "text-blue-600" : "text-slate-600"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    {step.subtitle}
                  </div>
                </div>

                {index < 3 && (
                  <ChevronRight
                    size={24}
                    className={`ml-auto hidden sm:block ${
                      step.active ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            MAIN GRID
        ========================================================= */}
        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_285px]">
          {/* LEFT CONTENT */}
          <div className="space-y-3">
            {/* CUSTOMER INFORMATION */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader
                icon={<User size={23} />}
                title="Customer Information"
                subtitle="Enter customer basic details for KYC verification."
                badge={
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-[11px] font-black text-purple-700"
                  >
                    <Sparkles size={14} />
                    Auto Fill from PAN
                  </button>
                }
              />

              <div className="grid grid-cols-1 gap-x-4 gap-y-3 p-5 md:grid-cols-2 xl:grid-cols-4">
                <Field
                  label="Full Name"
                  required
                  icon={<UserRound size={16} />}
                  value={form.fullName}
                  placeholder="Enter full name"
                  onChange={(value) => updateField("fullName", value)}
                />

                <Field
                  label="Date of Birth"
                  required
                  icon={<CalendarDays size={16} />}
                  value={form.dob}
                  placeholder="DD/MM/YYYY"
                  type="date"
                  onChange={(value) => updateField("dob", value)}
                />

                <SelectField
                  label="Gender"
                  required
                  icon={<User size={16} />}
                  value={form.gender}
                  placeholder="Select gender"
                  options={["Male", "Female", "Other"]}
                  onChange={(value) => updateField("gender", value)}
                />

                <Field
                  label="Mobile Number"
                  required
                  icon={<Phone size={16} />}
                  value={form.mobile}
                  placeholder="Enter mobile number"
                  type="tel"
                  onChange={(value) => updateField("mobile", value)}
                />

                <Field
                  label="Email ID"
                  icon={<Mail size={16} />}
                  value={form.email}
                  placeholder="Enter email address"
                  type="email"
                  onChange={(value) => updateField("email", value)}
                />

                <Field
                  label="PAN Number"
                  required
                  icon={<WalletCards size={16} />}
                  value={form.pan}
                  placeholder="Enter PAN number (e.g. ABCDE1234F)"
                  onChange={(value) => updateField("pan", value.toUpperCase())}
                />

                <Field
                  label="City"
                  icon={<MapPin size={16} />}
                  value={form.city}
                  placeholder="Enter city"
                  onChange={(value) => updateField("city", value)}
                />

                <SelectField
                  label="State"
                  icon={<MapPin size={16} />}
                  value={form.state}
                  placeholder="Select state"
                  options={[
                    "Bihar",
                    "Delhi",
                    "Jharkhand",
                    "Maharashtra",
                    "Uttar Pradesh",
                    "West Bengal",
                  ]}
                  onChange={(value) => updateField("state", value)}
                />

                <Field
                  label="Pincode"
                  icon={<MapPin size={16} />}
                  value={form.pincode}
                  placeholder="Enter pincode"
                  onChange={(value) => updateField("pincode", value)}
                />
              </div>
            </section>

            {/* BANK DETAILS */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader
                icon={<Landmark size={23} />}
                title="Bank Account Details"
                subtitle="Enter customer's bank information for loan disbursal."
                badge={
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700">
                    <LockKeyhole size={13} />
                    Your bank details are 100% secure
                  </div>
                }
              />

              <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
                <SelectField
                  label="Bank Name"
                  required
                  icon={<Landmark size={16} />}
                  value={form.bankName}
                  placeholder="Select bank"
                  options={[
                    "State Bank of India",
                    "HDFC Bank",
                    "ICICI Bank",
                    "Axis Bank",
                    "Punjab National Bank",
                    "Bank of Baroda",
                  ]}
                  onChange={(value) => updateField("bankName", value)}
                />

                <Field
                  label="Account Number"
                  required
                  icon={<WalletCards size={16} />}
                  value={form.accountNumber}
                  placeholder="Enter account number"
                  onChange={(value) => updateField("accountNumber", value)}
                />

                <Field
                  label="IFSC Code"
                  required
                  icon={<WalletCards size={16} />}
                  value={form.ifsc}
                  placeholder="Enter IFSC code (e.g. SBIN001234)"
                  onChange={(value) => updateField("ifsc", value.toUpperCase())}
                />

                <Field
                  label="Account Holder Name"
                  required
                  icon={<UserRound size={16} />}
                  value={form.accountHolder}
                  placeholder="Enter account holder name"
                  onChange={(value) => updateField("accountHolder", value)}
                />
              </div>
            </section>

            {/* DOCUMENT UPLOAD */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <SectionHeader
                icon={<FileText size={23} />}
                title="Upload Documents"
                subtitle="Upload clear and valid documents. Supported formats: PDF, JPG, PNG (Max 5MB each)."
                badge={
                  <div className="hidden items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-[10px] font-black text-blue-700 md:flex">
                    <ShieldCheck size={14} />
                    All documents are encrypted and securely stored
                  </div>
                }
              />

              <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
                <UploadBox
                  title="PAN Card"
                  subtitle="Front Side"
                  required
                  accent="blue"
                  file={files.pan}
                  onFile={(file) =>
                    setFiles((prev) => ({
                      ...prev,
                      pan: file,
                    }))
                  }
                />

                <UploadBox
                  title="Aadhaar Card"
                  subtitle="Front / Back Side"
                  required
                  accent="red"
                  file={files.aadhaar}
                  onFile={(file) =>
                    setFiles((prev) => ({
                      ...prev,
                      aadhaar: file,
                    }))
                  }
                />

                <UploadBox
                  title="Bank Passbook"
                  subtitle="First Page / Cancelled Cheque"
                  required
                  accent="green"
                  file={files.bank}
                  onFile={(file) =>
                    setFiles((prev) => ({
                      ...prev,
                      bank: file,
                    }))
                  }
                />

                <UploadBox
                  title="Agreement"
                  subtitle="Signed Document"
                  required
                  accent="purple"
                  file={files.agreement}
                  onFile={(file) =>
                    setFiles((prev) => ({
                      ...prev,
                      agreement: file,
                    }))
                  }
                />
              </div>

              <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5">
                <Info
                  className="mt-0.5 shrink-0 text-blue-600"
                  size={18}
                />

                <div>
                  <div className="text-[11px] font-black text-slate-800">
                    Important Note
                  </div>
                  <div className="text-[10px] leading-relaxed text-slate-500">
                    Please ensure all information and upload clear documents
                    before submission. Incorrect information may delay the loan
                    approval process.
                  </div>
                </div>
              </div>
            </section>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col justify-end gap-2 sm:flex-row">
              <button
                type="button"
                onClick={saveDraft}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                <WalletCards size={18} />
                {saved ? "Saved as Draft ✓" : "Save as Draft"}
              </button>

              <button
                type="button"
                onClick={submitKyc}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]"
              >
                <Send size={18} />
                {submitted ? "KYC Submitted ✓" : "Review & Submit KYC"}
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* =======================================================
              RIGHT SIDEBAR
          ======================================================= */}
          <aside className="space-y-3">
            {/* BENEFITS */}
            <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white px-4 py-3">
                <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Trophy size={19} />
                </div>

                <h3 className="font-black text-slate-900">
                  KYC Benefits
                </h3>
              </div>

              <div className="space-y-2.5 p-4">
                {[
                  "Higher Loan Approval Chances",
                  "Faster Disbursal",
                  "Access to Multiple Lenders",
                  "All Financial Products",
                  "Lower Interest Rates",
                  "Dedicated DSA Support",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[11px] font-semibold text-slate-700"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-emerald-950">
                      <Check size={12} strokeWidth={4} />
                    </span>
                    {item}
                  </div>
                ))}

                <div className="flex justify-end text-amber-500">
                  <Trophy size={50} />
                </div>
              </div>
            </section>

            {/* KYC PROGRESS */}
            <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-blue-100 px-4 py-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <FileCheck2 size={19} />
                </div>

                <h3 className="font-black text-slate-900">
                  KYC Progress
                </h3>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[10px] border-slate-200">
                  <div className="text-xl font-black text-slate-900">
                    {completion}%
                  </div>

                  <div
                    className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-blue-500 border-r-blue-500"
                    style={{
                      transform: `rotate(${completion * 3.6 - 45}deg)`,
                    }}
                  />
                </div>

                <div className="space-y-2 text-[11px] font-medium text-slate-600">
                  {[
                    ["Personal Details", completion > 10],
                    ["Bank Details", completion > 35],
                    ["Document Upload", completion > 65],
                    ["Review & Submit", completion >= 100],
                  ].map(([label, active]) => (
                    <div key={String(label)} className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full border-2 ${
                          active
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-400 bg-white"
                        }`}
                      />
                      <span>{String(label)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SUPPORTED FILES */}
            <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <FileImage size={19} />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Supported File Formats
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    PDF, JPG, PNG
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="rounded-xl bg-white p-3 text-center text-[10px] font-semibold text-slate-500 shadow-sm">
                  Maximum 5MB each
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { name: "PDF", icon: "📕" },
                    { name: "JPG", icon: "🖼️" },
                    { name: "PNG", icon: "🖼️" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border border-slate-100 bg-white py-3 text-center shadow-sm"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="mt-1 text-[10px] font-black text-slate-700">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* NEED HELP */}
            <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
                    <HelpCircle size={19} />
                  </div>

                  <h3 className="text-[16px] font-black text-[#21145d]">
                    Need Help?
                  </h3>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                  Contact our support team for any assistance.
                </p>

                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:scale-[1.01]"
                >
                  Contact Support
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="absolute bottom-0 right-3 text-5xl">
                👩🏻‍💼
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
