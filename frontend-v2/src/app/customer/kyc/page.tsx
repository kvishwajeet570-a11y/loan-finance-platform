"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg">
    {children}
  </span>
);

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("loan_finance_token") || "";
}

function currentUser(): any {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("loan_finance_user") || "null");
  } catch {
    return null;
  }
}

function dateText(v: any) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function panMask(v: any) {
  const s = String(v || "");
  if (!s) return "—";
  if (s.length < 6) return s;
  return s.slice(0, 2) + "****" + s.slice(-2);
}

function KycVisual({type}:{type:"pan"|"aadhaar"|"address"|"bank"|"support"}) {
  const data:any = {
    pan:{bg:"from-blue-50 to-indigo-100",icon:"▣",title:"PAN",sub:"Identity Card"},
    aadhaar:{bg:"from-orange-50 to-red-50",icon:"▤",title:"AADHAAR",sub:"UIDAI Identity"},
    address:{bg:"from-blue-50 to-cyan-50",icon:"⌂",title:"ADDRESS",sub:"Proof Document"},
    bank:{bg:"from-indigo-50 to-blue-100",icon:"▥",title:"BANK",sub:"Secure Verification"},
    support:{bg:"from-blue-50 to-violet-100",icon:"♧",title:"SUPPORT",sub:"We're Here to Help"}
  };

  const d=data[type];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${d.bg} p-4`}>
      <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/90 shadow-sm">
          <div className="text-3xl font-bold text-blue-600">{d.icon}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{d.sub}</div>
          <div className="mt-1 text-base font-extrabold text-[#102a56]">{d.title}</div>
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span>●</span> Secure & Verified
          </div>
        </div>
      </div>
    </div>
  );
}
function PremiumKycVisual({type}:{type:"pan"|"aadhaar"|"address"|"bank"|"support"}) {
  const d:any = {
    pan:{
      title:"PAN CARD",
      sub:"Government Identity",
      icon:"▣",
      bg:"from-blue-100 via-white to-indigo-100",
      accent:"text-blue-600"
    },
    aadhaar:{
      title:"AADHAAR",
      sub:"UIDAI Identity",
      icon:"✦",
      bg:"from-orange-100 via-white to-red-50",
      accent:"text-orange-600"
    },
    address:{
      title:"ADDRESS PROOF",
      sub:"Secure Document Upload",
      icon:"☁",
      bg:"from-cyan-100 via-white to-blue-100",
      accent:"text-cyan-600"
    },
    bank:{
      title:"BANK VERIFICATION",
      sub:"Secure Banking",
      icon:"▥",
      bg:"from-indigo-100 via-white to-blue-100",
      accent:"text-indigo-600"
    },
    support:{
      title:"KYC SUPPORT",
      sub:"We're Here to Help",
      icon:"♧",
      bg:"from-violet-100 via-white to-blue-100",
      accent:"text-violet-600"
    }
  };

  const x=d[type];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white bg-gradient-to-br ${x.bg} p-4 shadow-inner`}>
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/70 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-200/20 blur-xl" />

      <div className="relative flex min-h-[92px] items-center gap-4">
        <div className="relative flex h-[76px] w-[105px] shrink-0 items-center justify-center rounded-xl border border-white bg-white/90 shadow-lg">
          <div className={`text-4xl font-black ${x.accent}`}>{x.icon}</div>

          <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white shadow-md">
            ✓
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {x.sub}
          </div>

          <div className="mt-1 text-sm font-extrabold tracking-wide text-[#102a56]">
            {x.title}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-700">
              Secure Verification
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
function UltraKycVisual({type}:{type:"pan"|"aadhaar"|"address"|"bank"|"support"}) {
  const d:any = {
    pan:{title:"PAN",label:"Identity Verified",icon:"▣",orb:"from-blue-500/30 to-indigo-500/10"},
    aadhaar:{title:"AADHAAR",label:"UIDAI Verified",icon:"✦",orb:"from-orange-400/30 to-red-400/10"},
    address:{title:"ADDRESS",label:"Proof Required",icon:"⌂",orb:"from-cyan-400/30 to-blue-500/10"},
    bank:{title:"BANK",label:"Secure Linking",icon:"▥",orb:"from-indigo-500/30 to-blue-500/10"},
    support:{title:"SUPPORT",label:"24×7 Assistance",icon:"♧",orb:"from-violet-500/30 to-blue-500/10"}
  };

  const x=d[type];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-blue-100/80 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute -right-7 -top-7 h-24 w-24 rounded-full bg-gradient-to-br ${x.orb} blur-xl`} />
      <div className="absolute bottom-0 left-0 h-16 w-20 rounded-full bg-blue-50/70 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="relative flex h-[78px] w-[105px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white bg-gradient-to-br from-slate-50 to-blue-50 shadow-md">
          <div className={`absolute h-12 w-12 rounded-full bg-gradient-to-br ${x.orb} blur-md`} />
          <div className="relative text-4xl font-black text-blue-600 drop-shadow-sm">
            {x.icon}
          </div>

          <div className="absolute bottom-1 right-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[8px] font-bold text-blue-600 shadow-sm">
            SECURE
          </div>
        </div>

        <div className="relative flex-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            DIGITAL KYC
          </div>

          <div className="mt-1 text-sm font-extrabold text-[#102a56]">
            {x.title}
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
              ✓
            </span>
            <span className="text-[10px] font-semibold text-emerald-700">
              {x.label}
            </span>
          </div>

          <div className="mt-2 h-1 w-20 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
function UltraUI({type}:{type:"pan"|"aadhaar"|"address"|"bank"|"support"}) {
  const d:any={
    pan:{title:"PAN CARD",sub:"Identity Document",icon:"▣",tone:"blue",percent:"98%"},
    aadhaar:{title:"AADHAAR",sub:"UIDAI Identity",icon:"✦",tone:"orange",percent:"96%"},
    address:{title:"ADDRESS PROOF",sub:"Residential Document",icon:"⌂",tone:"cyan",percent:"72%"},
    bank:{title:"BANK ACCOUNT",sub:"Financial Verification",icon:"▥",tone:"indigo",percent:"64%"},
    support:{title:"KYC ASSIST",sub:"Smart Support",icon:"♧",tone:"violet",percent:"24×7"}
  };

  const x=d[type];

  const tones:any={
    blue:["from-blue-600 to-indigo-600","bg-blue-50","text-blue-600"],
    orange:["from-orange-500 to-red-500","bg-orange-50","text-orange-600"],
    cyan:["from-cyan-500 to-blue-600","bg-cyan-50","text-cyan-600"],
    indigo:["from-indigo-600 to-violet-600","bg-indigo-50","text-indigo-600"],
    violet:["from-violet-600 to-fuchsia-600","bg-violet-50","text-violet-600"]
  };

  const t=tones[x.tone];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${t[0]} opacity-[0.08] blur-xl`} />
      <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-blue-100/40 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <div className={`relative flex h-[82px] w-[108px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${t[0]} shadow-lg`}>
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20 blur-md" />
          <div className="relative text-4xl font-black text-white drop-shadow-lg">
            {x.icon}
          </div>
          <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/20 px-1.5 py-0.5 text-[7px] font-bold tracking-widest text-white">
            VERIFIED
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {x.sub}
          </div>

          <div className="mt-1 text-[15px] font-extrabold tracking-wide text-[#102a56]">
            {x.title}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${t[0]} text-[10px] font-black text-white shadow-sm`}>
              ✓
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              Securely Processed
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full bg-gradient-to-r ${t[0]}`} style={{width:x.percent.includes("%")?x.percent:"70%"}} />
            </div>
            <span className="text-[9px] font-bold text-slate-400">{x.percent}</span>
          </div>
        </div>

        <div className={`hidden h-10 w-10 items-center justify-center rounded-xl ${t[1]} ${t[2]} text-lg shadow-inner sm:flex`}>
          →
        </div>
      </div>
    </div>
  );
}
function RealDocumentCard({type}:{type:"pan"|"aadhaar"|"address"|"bank"|"support"}) {
  const data:any={
    pan:{title:"INCOME TAX DEPARTMENT",name:"PAN CARD",number:"ABCDE1234F",kind:"Permanent Account Number",mark:"भारत सरकार",cls:"from-slate-50 to-blue-100"},
    aadhaar:{title:"UNIQUE IDENTIFICATION AUTHORITY",name:"AADHAAR",number:"Not uploaded",kind:"Government Identity",mark:"भारत सरकार",cls:"from-orange-50 to-amber-100"},
    address:{title:"ADDRESS PROOF",name:"RESIDENTIAL DOCUMENT",number:"DOCUMENT • VERIFIED",kind:"Proof of Address",mark:"✓",cls:"from-blue-50 to-cyan-100"},
    bank:{title:"BANK ACCOUNT",name:"ACCOUNT VERIFICATION",number:"XXXX XXXX 7821",kind:"Secure Banking",mark:"₹",cls:"from-indigo-50 to-blue-100"},
    support:{title:"DIGITAL KYC",name:"VERIFICATION CENTER",number:"SECURE SUPPORT",kind:"Customer Assistance",mark:"✓",cls:"from-violet-50 to-blue-100"}
  };

  const d=data[type];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`relative min-h-[108px] overflow-hidden rounded-lg bg-gradient-to-br ${d.cls} border border-white shadow-inner`}>
        <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" />

        <div className="relative flex h-full min-h-[108px] items-center gap-3 p-3">
          <div className="flex h-[72px] w-[88px] shrink-0 flex-col items-center justify-center rounded-md border border-slate-200 bg-white shadow-md">
            <div className="text-[8px] font-bold text-slate-400">{d.mark}</div>
            <div className="mt-1 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
            <div className="mt-1 text-[6px] font-bold text-slate-400">GOVT. ID</div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400">
              {d.title}
            </div>
            <div className="mt-1 text-[11px] font-extrabold text-[#102a56]">
              {d.name}
            </div>
            <div className="mt-1 font-mono text-[10px] font-bold tracking-wider text-slate-600">
              {d.number}
            </div>
            <div className="mt-1 text-[8px] text-slate-500">{d.kind}</div>
          </div>

          <div className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow-md">
            ✓
          </div>
        </div>
      </div>
    </div>
  );
}
function PremiumKycPanel({type}:{type:"pan"|"aadhaar"|"address"|"bank"|"support"}) {
  const d:any={
    pan:{title:"PAN Verification",label:"Identity Document",icon:"▣",gradient:"from-blue-600 via-indigo-600 to-violet-600",light:"bg-blue-50",text:"text-blue-700"},
    aadhaar:{title:"Aadhaar Verification",label:"Government Identity",icon:"✦",gradient:"from-orange-500 via-red-500 to-rose-600",light:"bg-orange-50",text:"text-orange-700"},
    address:{title:"Address Verification",label:"Residential Proof",icon:"⌂",gradient:"from-cyan-500 via-blue-600 to-indigo-600",light:"bg-cyan-50",text:"text-cyan-700"},
    bank:{title:"Bank Verification",label:"Financial Verification",icon:"▥",gradient:"from-indigo-600 via-blue-600 to-cyan-600",light:"bg-indigo-50",text:"text-indigo-700"},
    support:{title:"KYC Assistance",label:"Dedicated Support",icon:"♧",gradient:"from-violet-600 via-indigo-600 to-blue-600",light:"bg-violet-50",text:"text-violet-700"}
  };

  const x=d[type];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,.12)]">
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${x.gradient} opacity-[.07] blur-2xl`} />
      <div className="relative flex items-center gap-4">
        <div className={`relative flex h-[92px] w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${x.gradient} shadow-lg`}>
          <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" />
          <div className="absolute bottom-0 left-0 h-10 w-16 rounded-full bg-white/10 blur-lg" />
          <span className="relative text-4xl font-black text-white drop-shadow-lg">{x.icon}</span>
          <span className="absolute bottom-2 left-2 rounded-md bg-black/20 px-2 py-0.5 text-[7px] font-bold tracking-widest text-white backdrop-blur">
            SECURE
          </span>
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-lg">
            ✓
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold uppercase tracking-[.18em] text-slate-400">
            {x.label}
          </div>
          <h3 className="mt-1 text-[15px] font-extrabold text-[#102a56]">{x.title}</h3>

          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full ${x.light} ${x.text} px-2.5 py-1 text-[9px] font-bold`}>
              ● Verification Active
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full w-[86%] rounded-full bg-gradient-to-r ${x.gradient}`} />
            </div>
            <span className="text-[9px] font-bold text-slate-400">86%</span>
          </div>
        </div>

        <button className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white sm:flex">
          →
        </button>
      </div>
    </div>
  );
}
export default function MyKYCPage() {
  const user = currentUser();

  const [kyc, setKyc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploadingDocument, setUploadingDocument] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({});

  async function uploadKYCDocument(documentType: string, file: File) {
    try {
      setError("");
      setMessage("");
      setUploadingDocument(documentType);

      const authToken = localStorage.getItem("loan_finance_token");
      const currentUserId = user?.id || user?.userId;

      if (!authToken || !currentUserId) {
        window.location.href = "/login";
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", String(currentUserId));
      formData.append("uploadedBy", String(currentUserId));
      formData.append("documentType", documentType);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/upload/kyc`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
          body: formData,
        }
      );

      const json = await res.json();

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("loan_finance_token");
        window.location.href = "/login";
        return;
      }

      if (!res.ok || json.success === false) {
        throw new Error(json.message || `Failed to upload ${documentType}`);
      }

      const upload =
        json?.data?.upload ||
        json?.data ||
        json?.upload ||
        json;

      setUploadedDocuments((prev) => ({
        ...prev,
        [documentType]: upload,
      }));

      setMessage(`${documentType} uploaded successfully.`);
    } catch (e: any) {
      setError(e?.message || `Failed to upload ${documentType}`);
    } finally {
      setUploadingDocument("");
    }
  }

  function KycUploadBox({
    documentType,
    title,
    accept = ".jpg,.jpeg,.png,.pdf",
  }: {
    documentType: string;
    title: string;
    accept?: string;
  }) {
    const uploaded = uploadedDocuments[documentType];
    const isUploading = uploadingDocument === documentType;

    return (
      <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-[#102a56]">{title}</div>
            <div className="mt-1 text-xs text-slate-500">
              {uploaded
                ? uploaded.originalName || uploaded.fileName || "Document uploaded"
                : "JPG, PNG or PDF"}
            </div>
          </div>

          <label className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-white ${
            isUploading
              ? "pointer-events-none bg-slate-400"
              : "bg-[#155eef] hover:bg-[#0f4dcc]"
          }`}>
            {isUploading ? "Uploading..." : uploaded ? "Replace" : "Upload"}

            <input
              type="file"
              accept={accept}
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadKYCDocument(documentType, file);
                }
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>

        {uploaded && (
          <div className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            ✓ Uploaded
          </div>
        )}
      </div>
    );
  }

  const [form, setForm] = useState<any>({
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  async function loadKYC() {
    try {
      setLoading(true);
      setError("");

      const uid = user?.id || user?.userId;
      if (!uid) throw new Error("User session not found.");

      const res = await fetch(`${API}/kyc/user/${uid}`, {
        headers: { Authorization: `Bearer ${token()}` },
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Unable to load KYC.");
      }

      const d = json.data;
      setKyc(d);

      if (d) {
        setForm({
          fullName: d.fullName || "",
          dob: d.dob ? String(d.dob).slice(0, 10) : "",
          gender: d.gender || "",
          mobile: d.mobile || user?.mobile || "",
          email: d.email || user?.email || "",
          panNumber: d.panNumber || "",
          address: d.address || "",
          city: d.city || "",
          state: d.state || "",
          pincode: d.pincode || "",
        });
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load KYC.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKYC();
  }, []);

  const change = (name: string, value: string) =>
    setForm((p: any) => ({ ...p, [name]: value }));

  async function saveKYC() {
    if (!kyc?.id) {
      setError("KYC record not found.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API}/kyc/${kyc.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName,
          panNumber: form.panNumber,
          dob: form.dob,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Failed to save KYC.");
      }

      setKyc(json.data || { ...kyc, ...form });
      setEditing(false);
      setMessage("Personal details updated successfully.");
    } catch (e: any) {
      setError(e?.message || "Failed to save KYC.");
    } finally {
      setSaving(false);
    }
  }

  async function submitKYC() {
    const missing: string[] = [];

    if (!form.fullName?.trim()) missing.push("Full Name");
    if (!form.dob?.trim()) missing.push("Date of Birth");
    if (!form.mobile?.trim()) missing.push("Mobile Number");
    if (!form.email?.trim()) missing.push("Email Address");
    if (!form.gender?.trim()) missing.push("Gender");
    if (!form.panNumber?.trim()) missing.push("PAN Number");
    if (!form.city?.trim()) missing.push("City");
    if (!form.state?.trim()) missing.push("State");
    if (!form.pincode?.trim()) missing.push("Pincode");

    if (!uploadedDocuments["PAN"]) missing.push("PAN Card");
    if (!uploadedDocuments["AADHAAR"]) missing.push("Aadhaar Card");
    if (!uploadedDocuments["ADDRESS_PROOF"]) missing.push("Address Proof");
    if (!uploadedDocuments["BANK_STATEMENT"]) missing.push("Bank Statement");

    if (missing.length > 0) {
      setError(`Please complete: ${missing.join(", ")}`);
      return;
    }

    const uid = user?.id || user?.userId;

    if (!uid) {
      setError("User session not found. Please login again.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        userId: String(uid),
        fullName: form.fullName,
        panNumber: form.panNumber,
        dob: form.dob,
        address: form.address || "",
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      const res = kyc?.id
        ? await fetch(`${API}/kyc/${kyc.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token()}`,
            },
            credentials: "include",
            body: JSON.stringify({
              ...payload,
              status: "PENDING",
            }),
          })
        : await fetch(`${API}/kyc/submit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token()}`,
            },
            credentials: "include",
            body: JSON.stringify(payload),
          });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Failed to submit KYC.");
      }

      const savedKyc = json.data;

      setKyc(savedKyc);
      setEditing(false);
      setMessage("KYC submitted successfully for verification.");
    } catch (e: any) {
      setError(e?.message || "Failed to submit KYC.");
    } finally {
      setSaving(false);
    }
  }
  const status = String(kyc?.status || "PENDING").toUpperCase();
  const kycProgress = (() => {
  const personalComplete = Boolean(
    form.fullName?.trim() &&
    form.dob?.trim() &&
    form.gender?.trim() &&
    form.mobile?.trim() &&
    form.email?.trim()
  );

  const identityComplete = Boolean(
    uploadedDocuments["PAN"] &&
    uploadedDocuments["AADHAAR"]
  );

  const addressComplete = Boolean(
    uploadedDocuments["ADDRESS_PROOF"]
  );

  const bankComplete = Boolean(
    uploadedDocuments["BANK_STATEMENT"]
  );

  const completed = [
    personalComplete,
    identityComplete,
    addressComplete,
    bankComplete,
  ].filter(Boolean).length;

  return Math.round((completed / 4) * 100);
})();
  const verified = status === "VERIFIED" || status === "APPROVED";

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f5f8fd]">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <div className="text-sm font-semibold text-slate-600">Loading KYC...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8fd] pb-28">
      <div className="mx-auto max-w-[1450px] px-5 py-4">

        {/* BANNER — DO NOT CHANGE */}
        <section className="relative mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-sm">
          <div className="relative aspect-[4/1] min-h-[190px] w-full overflow-hidden">
            <img
              src="/images/kyc/kyc-ai-banner.png"
              alt="KYC Security and Verification"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        <div className="absolute inset-0 pointer-events-none">
  <div className="absolute left-8 top-[34%] -translate-y-1/2">
    <div className="mb-2 inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#102a56] shadow-sm">
      🛡 SECURE • FAST • TRUSTED
    </div>
    <h1 className="text-3xl font-extrabold leading-tight text-[#102a56]">
      Your Identity, <span className="text-blue-600">Our Priority</span>
    </h1>
    <p className="mt-2 text-sm font-medium leading-5 text-slate-600">
      Complete your KYC to unlock seamless loan services
      <br />
      and a better financial future.
    </p>
  </div>

  <div className="absolute right-7 top-[36%] -translate-y-1/2 space-y-2 text-sm font-semibold text-[#102a56]">
    <div>🟢 Your Data is Secure</div>
    <div>🟢 Faster Approvals</div>
    <div>🟢 100% Digital Process</div>
    <div>🟢 Trusted by Thousands</div>
  </div>
</div><div className="absolute inset-0 pointer-events-none">
  <div className="absolute left-8 top-[34%] -translate-y-1/2">
    <div className="mb-2 inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#102a56] shadow-sm">
      🛡 SECURE • FAST • TRUSTED
    </div>
    <h1 className="text-3xl font-extrabold leading-tight text-[#102a56]">
      Your Identity, <span className="text-blue-600">Our Priority</span>
    </h1>
    <p className="mt-2 text-sm font-medium leading-5 text-slate-600">
      Complete your KYC to unlock seamless loan services
      <br />
      and a better financial future.
    </p>
  </div>

  <div className="absolute right-7 top-[36%] -translate-y-1/2 space-y-2 text-sm font-semibold text-[#102a56]">
    <div>🟢 Your Data is Secure</div>
    <div>🟢 Faster Approvals</div>
    <div>🟢 100% Digital Process</div>
    <div>🟢 Trusted by Thousands</div>
  </div>
</div></section>

        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {/* CUSTOMER SUMMARY */}
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white shadow-sm px-7 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {(form.fullName || user?.name || "C").charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-[#102a56]">
                    {form.fullName || user?.name || "Customer"}
                  </h1>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    ● KYC {verified ? "Verified" : "In Progress"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Customer ID: {user?.customerId || user?.id || "—"}
                  <span className="mx-3">|</span>
                  Registered on: {dateText(kyc?.createdAt)}
                </p>
              </div>
            </div>

            <div className="w-[300px]">
              <div className="mb-2 flex justify-between">
                <span className="text-base font-bold text-[#102a56]">KYC Completion</span>
                <span className="text-base font-bold text-[#102a56]">
                    `${kycProgress}%`
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                    style={{ width: `${kycProgress}%` }}
                />
              </div>
            </div>

            <div className="hidden xl:block text-xs leading-5 text-slate-600">
              <b className="text-blue-600">ⓘ</b>
              <span className="ml-2">Complete your KYC to<br />enjoy all our services</span>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white shadow-sm px-8 py-5 shadow-sm">
          <div className="relative grid grid-cols-5 gap-2">
            <div className="absolute left-[5%] right-[5%] top-4 h-0.5 bg-slate-200" />

            {(() => {
              const personalComplete = Boolean(
                form.fullName?.trim() &&
                form.dob?.trim() &&
                form.mobile?.trim() &&
                form.email?.trim()
              );

              const personalStarted = Boolean(
                form.fullName?.trim() ||
                form.dob?.trim() ||
                form.mobile?.trim() ||
                form.email?.trim()
              );

              const identityComplete = Boolean(
                form.panNumber?.trim()
              );

              const identityStarted = Boolean(
                form.panNumber?.trim()
              );

              const addressComplete = Boolean(
                form.address?.trim() &&
                form.city?.trim() &&
                form.state?.trim() &&
                form.pincode?.trim()
              );

              const addressStarted = Boolean(
                form.address?.trim() ||
                form.city?.trim() ||
                form.state?.trim() ||
                form.pincode?.trim()
              );

              const bankComplete =
                String(kyc?.bankVerificationStatus || "").toUpperCase() === "VERIFIED";

              const bankStarted =
                bankComplete ||
                Boolean(
                  String(kyc?.bankVerificationStatus || "").trim()
                );

              const reviewComplete = verified || kycProgress >= 100;

              const personalState = personalComplete
                ? "done"
                : personalStarted
                  ? "active"
                  : "pending";

              const identityState = identityComplete
                ? "done"
                : identityStarted || personalComplete
                  ? "active"
                  : "pending";

              const addressState = addressComplete
                ? "done"
                : addressStarted || identityComplete
                  ? "active"
                  : "pending";

              const bankState = bankComplete
                ? "done"
                : bankStarted || addressComplete
                  ? "active"
                  : "pending";

              const reviewState = reviewComplete
                ? "done"
                : bankComplete
                  ? "active"
                  : "pending";

              const steps = [
                [
                  "1",
                  "Personal Details",
                  personalComplete ? "Completed" : personalStarted ? "In Progress" : "Pending",
                  personalState,
                ],
                [
                  "2",
                  "Identity Verification",
                  identityComplete ? "Completed" : identityStarted || personalComplete ? "In Progress" : "Pending",
                  identityState,
                ],
                [
                  "3",
                  "Address Verification",
                  addressComplete ? "Completed" : addressStarted || identityComplete ? "In Progress" : "Pending",
                  addressState,
                ],
                [
                  "4",
                  "Bank Verification",
                  bankComplete ? "Completed" : bankStarted || addressComplete ? "In Progress" : "Pending",
                  bankState,
                ],
                [
                  "5",
                  "Review & Submit",
                  reviewComplete ? "Completed" : bankComplete ? "In Progress" : "Pending",
                  reviewState,
                ],
              ];

              return steps.map(([n, title, sub, state]) => (
              <div key={n} className="relative z-10 text-left">
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    state === "done"
                      ? "bg-emerald-500 text-white"
                      : state === "active"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-300 text-white"
                  }`}
                >
                  {n}
                </div>
                <div className="text-xs font-bold text-[#102a56]">{title}</div>
                <div
                  className={`mt-1 text-xs ${
                    state === "done"
                      ? "text-emerald-600"
                      : state === "active"
                      ? "text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  {sub}
                </div>
              </div>
              ));
            })()}
          </div>
        </section>

        {/* ROW 1 */}
        <div className="mb-3 grid gap-3 lg:grid-cols-2">

          {/* PERSONAL */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon>👤</Icon>
                <h2 className="text-lg font-bold text-[#102a56]">Personal Information</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                {form.fullName?.trim() && form.dob?.trim() && form.mobile?.trim() && form.email?.trim() && form.gender?.trim() ? "● Completed" : "● In Progress"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              {[
                ["Full Name", "fullName"],
                ["Date of Birth", "dob"],
                ["Gender", "gender"],
                ["Mobile Number", "mobile"],
                ["Email Address", "email"],
                ["City", "city"],
                ["State", "state"],
                ["Pincode", "pincode"],
              ].map(([label, key]) => (
                <div key={key}>
                  <div className="mb-1 text-xs text-slate-500">{label}</div>
                  {editing ? (
                    key === "gender" ? (
                      <select
                        value={form[key]}
                        onChange={(e) => change(key, e.target.value)}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-[#102a56] outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        type={key === "dob" ? "date" : "text"}
                        value={form[key]}
                        onChange={(e) => change(key, e.target.value)}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-[#102a56] outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    )
                  ) : (
                    <div className="text-sm font-semibold text-[#102a56]">
                      {key === "dob" ? dateText(form[key]) : form[key] || "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setEditing(!editing)}
                className="rounded-lg border border-blue-200 bg-white px-5 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50"
              >
                ✎ {editing ? "Cancel" : "Edit"}
              </button>
            </div>
          </section>

          {/* IDENTITY */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon>♙</Icon>
                <h2 className="text-lg font-bold text-[#102a56]">Identity Verification</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                ● {verified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 min-h-[112px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="w-full px-1"><div className="text-[5px] font-bold text-slate-500">INCOME TAX DEPARTMENT</div><div className="mt-1 h-1 bg-blue-100"></div><div className="mt-1 text-[5px] font-bold text-slate-700">PAN CARD</div><div className="text-[5px] text-slate-500">GOVT. OF INDIA</div></div></div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">PAN Card</div>
                    <div className="text-base font-bold text-[#102a56]">
                      {uploadedDocuments["PAN"]?.originalName || panMask(form.panNumber)}
                    </div>
                  </div>
                  <span className="ml-auto text-lg text-emerald-600">✓</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 min-h-[112px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="w-full px-1"><div className="text-[5px] font-bold text-slate-600">आधार • UIDAI</div><div className="mt-1 h-1 bg-gradient-to-r from-orange-300 via-white to-green-300"></div><div className="mt-1 text-[5px] font-bold text-slate-700">GOVERNMENT OF INDIA</div><div className="text-[5px] font-bold text-slate-500">AADHAAR</div></div></div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">Aadhaar Card</div>
                    <div className="text-base font-bold text-[#102a56]">{uploadedDocuments["AADHAAR"]?.originalName || "Not uploaded"}</div>
                  </div>
                  <span className="ml-auto text-lg text-emerald-600">✓</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                PAN Number
              </label>
              <input
                type="text"
                value={form.panNumber}
                onChange={(e) =>
                  change("panNumber", e.target.value.toUpperCase())
                }
                placeholder="Enter PAN Number"
                maxLength={10}
                className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold uppercase text-[#102a56] outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <KycUploadBox documentType="PAN" title="PAN Card" accept=".jpg,.jpeg,.png,.pdf" />
              <KycUploadBox documentType="AADHAAR" title="Aadhaar Card" accept=".jpg,.jpeg,.png,.pdf" />
            </div>
            <div className="mt-5 flex justify-end">
              <button className="rounded-lg border border-blue-200 px-5 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50">
                View Details
              </button>
            </div>
          </section>
        </div>

        {/* ROW 2 */}
        <div className="mb-3 grid gap-3 lg:grid-cols-2">

          {/* ADDRESS */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Icon>●</Icon>
              <h2 className="text-lg font-bold text-[#102a56]">Address Information</h2>
            </div>

            <div className="grid grid-cols-[1fr_255px] gap-5">
              <div>
                <div className="mb-2 text-xs text-slate-500">Current Address</div>
                <div className="text-sm font-semibold leading-6 text-[#102a56]">
                  {form.address || "Address not provided"}
                  {form.city ? `, ${form.city}` : ""}
                  {form.state ? `, ${form.state}` : ""}
                  {form.pincode ? ` - ${form.pincode}` : ""}
                </div>
              </div>

              <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-5 text-center">
                <div className="mt-2 text-lg font-extrabold text-[#102a56]">
                  Upload Address Proof
                </div>
                <div className="text-xs text-slate-500">
                  (Aadhaar / Voter ID / Utility Bill)
                </div>
                <div className="mt-3">
                  <KycUploadBox
                    documentType="ADDRESS_PROOF"
                    title="Upload Address Proof"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="rounded-lg border border-blue-200 px-5 py-2 text-sm font-bold text-blue-600">
                ✎ Edit
              </button>
            </div>
          </section>

          {/* BANK */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PremiumKycPanel type="bank" />
                <h2 className="text-lg font-bold text-[#102a56]">Bank Verification</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
{uploadedDocuments["BANK_STATEMENT"] ? "● Uploaded" : "● Pending"}
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Link your bank account for faster loan disbursal
              <br />and verification.
            </p>

            <div className="mt-7 flex justify-end">
              <div className="mt-5">
                <KycUploadBox
                  documentType="BANK_STATEMENT"
                  title="Upload Bank Statement"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* FIXED ACTION BAR — SCREENSHOT STYLE */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-blue-100 bg-white/95 px-5 py-3 shadow-[0_-5px_25px_rgba(15,23,42,.08)] backdrop-blur">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between">
          <div className="hidden text-sm text-slate-600 md:block">
            🛡 Your information is encrypted and secure.
          </div>

          <div className="ml-auto flex gap-3">
            <button
              onClick={saveKYC}
              disabled={saving || !kyc?.id}
              className="rounded-lg border border-blue-200 bg-white px-8 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={submitKYC}
              disabled={saving || verified || kycProgress < 100}
              className="min-w-[245px] rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {verified ? "KYC Verified ✓" : saving ? "Submitting..." : "Submit KYC  →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

































































