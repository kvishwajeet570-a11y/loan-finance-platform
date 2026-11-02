"use client";

import api from "@/lib/api";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bot,
  Building2,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Home,
  Landmark,
  MessageCircle,
  Percent,
  RefreshCw,
  Search,
  Scale,
  ShieldCheck,
  Sparkles,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";

type LenderPolicyRecord = {
  id: string;
  lenderName: string;
  productName: string;
  loanType: string;
  overview: string;
  eligibility?: string | null;
  documents?: string | null;
  interestRateInfo?: string | null;
  tenureInfo?: string | null;
  sourceUrl?: string | null;
  verified: boolean;
  effectiveDate?: string | null;
};

const updates = [
  ["HDFC Bank", "Revised interest rates for personal loan", "05 Oct 2026"],
  ["ICICI Bank", "Updated income eligibility criteria", "03 Oct 2026"],
  ["SBI", "New home loan scheme launched", "01 Oct 2026"],
  ["Axis Bank", "Revised processing fees", "28 Sep 2026"],
  ["Kotak Bank", "Updated document requirements", "25 Sep 2026"],
];

const policyMenu = [
  ["Overview", UserRound],
  ["Eligibility Criteria", CheckCircle2],
  ["Interest Rates", Percent],
  ["Processing Fees", FileText],
  ["Required Documents", FileCheck2],
  ["Terms & Conditions", FileText],
  ["Special Features", Sparkles],
  ["FAQs", MessageCircle],
];

function BankLogo({
  lender,
  small = false,
}: {
  lender: string;
  small?: boolean;
}) {
  const logos: Record<string, string> = {
    "HDFC Bank": "/lender-logos/hdfc.svg",
    "ICICI Bank": "/lender-logos/icici.svg",
    "State Bank of India": "/lender-logos/sbi.svg",
    "SBI": "/lender-logos/sbi.svg",
    "Axis Bank": "/lender-logos/axis.svg",
    "Kotak Mahindra": "/lender-logos/kotak.svg",
    "Kotak Bank": "/lender-logos/kotak.svg",
    "IndusInd Bank": "/lender-logos/indus.svg",
    "Bajaj Finance": "/lender-logos/bajaj-finance.svg",
    "Tata Capital": "/lender-logos/tata-capital.jpg",
  };

  const logo =
    logos[lender] ||
    "https://cdn.simpleicons.org/bank/2563EB";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-white ${
        small ? "h-9 w-9 p-1" : "h-11 w-11 p-1.5"
      }`}
    >
      <img
        src={logo}
        alt={`${lender} logo`}
        className="h-full w-full object-contain"
        loading="eager"
      />
    </div>
  );
}
const BANK_LOGOS: Record<string, string> = {
  "HDFC Bank": "/lender-logos/hdfc.svg",
  "ICICI Bank": "/lender-logos/icici.svg",
  "State Bank of India": "/lender-logos/sbi.svg",
  "SBI": "/lender-logos/sbi.svg",
  "Axis Bank": "/lender-logos/axis.svg",
  "Kotak Mahindra": "/lender-logos/kotak.svg",
  "Kotak Bank": "/lender-logos/kotak.svg",
  "IndusInd Bank": "/lender-logos/indus.svg",
  "Bajaj Finance": "/lender-logos/bajaj-finance.svg",
  "Tata Capital": "/lender-logos/tata-capital.jpg",
};

const getBankLogo = (name: string) => {
  return BANK_LOGOS[name] || "/lender-logos/hdfc.svg";
};

export default function LenderPolicyPage() {
  const [selectedLender, setSelectedLender] = useState("HDFC Bank");
  const [selectedLoan, setSelectedLoan] = useState("Personal Loan");
  const [policySearch, setPolicySearch] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("All Loan Types");
  const [lenderFilter, setLenderFilter] = useState("All Lenders");
  const [policyTypeFilter, setPolicyTypeFilter] = useState("Overview");
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [selectedPolicySection, setSelectedPolicySection] = useState("Overview");
  const [lenderPolicies, setLenderPolicies] = useState<LenderPolicyRecord[]>([]);
  const [lenderPoliciesLoading, setLenderPoliciesLoading] = useState(true);
  const [lenderPoliciesError, setLenderPoliciesError] = useState("");
  const lenders = Array.from(new Set(lenderPolicies.map((p) => p.lenderName)))
    .map((name) => ({ name }));
  const [savedPolicyKeys, setSavedPolicyKeys] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    api.get("/lender-policy")
      .then((response) => {
        if (!active) return;
        const records = response.data?.data;
        if (!response.data?.success || !Array.isArray(records)) {
          throw new Error("Unexpected lender policy API response.");
        }
        setLenderPolicies(records);
        setLenderPoliciesError("");
        if (records.length > 0) {
          setSelectedLender((current) =>
            records.some((p: LenderPolicyRecord) => p.lenderName === current)
              ? current
              : records[0].lenderName
          );
        }
      })
      .catch((error) => {
        if (!active) return;
        setLenderPoliciesError(
          error?.response?.data?.message ||
          "Lender database se data load nahi hua. Backend/API check karein."
        );
      })
      .finally(() => {
        if (active) setLenderPoliciesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedPolicyRecord = lenderPolicies.find(
    (p) => p.lenderName === selectedLender && p.loanType === selectedLoan
  ) || lenderPolicies.find((p) => p.lenderName === selectedLender);
const filteredLenders = lenders.filter((lender) =>
    lender.name.toLowerCase().includes(policySearch.trim().toLowerCase())
  );

  const getCurrentPolicyKey = () => `${selectedLender}::${selectedLoan}`;

  const savePolicyToPriority = () => {
    const key = getCurrentPolicyKey();
    const next = savedPolicyKeys.includes(key)
      ? savedPolicyKeys.filter((item) => item !== key)
      : [...savedPolicyKeys, key];

    setSavedPolicyKeys(next);
    try {
      localStorage.setItem("dsa-lender-policy-priority", JSON.stringify(next));
    } catch {
      setAssistantAnswer("Priority save nahi ho saka. Browser storage permission check karein.");
    }
  };

  const downloadHighlightedPolicy = () => {
    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char] || char));

    const answer = assistantAnswer.trim() ||
      "No AI answer is available yet. Ask the Policy Assistant first.";

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(selectedLender)} - ${escapeHtml(selectedLoan)} Policy Details</title>
<style>
body{font-family:Arial,sans-serif;max-width:850px;margin:32px auto;padding:0 18px;color:#1e293b;line-height:1.65}
header{background:#eff6ff;border-left:5px solid #2563eb;padding:18px;border-radius:8px}
h1,h2{color:#1d4ed8}
.card{border:1px solid #bfdbfe;background:#f8fbff;border-radius:10px;padding:18px;margin:18px 0;white-space:pre-wrap;overflow-wrap:anywhere}
.notice{background:#fff7ed;border-left:4px solid #f59e0b;padding:14px;border-radius:6px}
small{color:#64748b}
</style>
</head>
<body>
<header>
<h1>${escapeHtml(selectedLender)}</h1>
<strong>${escapeHtml(selectedLoan)} — Policy Details</strong><br>
<small>Section: ${escapeHtml(selectedPolicySection)}</small>
</header>
<div class="card"><h2>AI Assistant Response</h2>${escapeHtml(answer)}</div>
<div class="notice"><strong>Important:</strong> This is AI-generated guidance, not verified official lender policy. Verify eligibility, rates, fees, documents and current terms directly with ${escapeHtml(selectedLender)} before advising customers.</div>
<p><small>Generated on ${new Date().toLocaleDateString("en-IN")}.</small></p>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedLender}-${selectedLoan}-policy-details.html`
      .replace(/[^a-zA-Z0-9._-]/g, "-");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
const downloadPolicySummary = () => {
    const content = [
      "LENDER POLICY SUMMARY",
      `Lender: ${selectedLender}`,
      `Loan type: ${selectedLoan}`,
      `Section: ${selectedPolicySection}`,
      "",
      "This page does not contain verified lender-approved policy data.",
      "Confirm current rates, eligibility, fees and terms directly with the lender."
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedLender.replace(/[^a-z0-9]/gi, "-")}-policy-summary.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const askPolicyAssistant = async (question: string) => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion) {
      setAssistantAnswer("Please enter a question first.");
      return;
    }

    if (assistantLoading) return;

    setAssistantQuestion(cleanQuestion);
    setAssistantLoading(true);
    setAssistantAnswer("");

    try {
      const response = await api.post("/ai/marketing-assistant", {
        question: cleanQuestion,
        loanType: selectedLoan,
      });

      if (response.data?.success && typeof response.data.answer === "string") {
        setAssistantAnswer(response.data.answer);
      } else {
        setAssistantAnswer(
          response.data?.message || "AI returned an unexpected response. Please try again."
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.code === "ECONNABORTED"
          ? "The AI request timed out. Please try again."
          : "Unable to connect to the AI service. Check that the backend is running on port 5000.");

      setAssistantAnswer(message);
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#102044]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 h-[68px] border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-full items-center gap-5 px-5 lg:px-7">

          <button className="rounded-xl p-2 hover:bg-slate-100">
            <div className="space-y-1.5">
              <span className="block h-[2px] w-5 bg-slate-700" />
              <span className="block h-[2px] w-5 bg-slate-700" />
              <span className="block h-[2px] w-5 bg-slate-700" />
            </div>
          </button>

          <div className="relative w-[350px]">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search lenders, policies, documents..."
              className="w-full rounded-full bg-[#f2f5fa] py-2.5 pl-11 pr-4 text-[16px] outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">

            <button className="relative rounded-xl p-2">
              <Bell size={20} />
              <span className="absolute right-0 top-0 rounded-full bg-red-500 px-1.5 text-[15px] font-black text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?img=11"
                className="h-9 w-9 rounded-full object-cover"
                alt=""
              />
              <div className="hidden sm:block">
                <p className="text-[16px] font-black">Pritam Prakash</p>
                <p className="text-[15px] text-slate-500">DSA Partner</p>
              </div>
              <ChevronDown size={14} />
            </div>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-4 lg:px-7">

        {/* BREADCRUMB */}
        <div className="mb-3 flex items-center gap-2 text-[16px]">
          <span>Dashboard</span>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="font-bold">Lender Policy & Terms</span>

          <span className="ml-auto hidden text-slate-500 md:block">
            Wed, 08 Oct 2026 &nbsp; 05:06 PM
          </span>
        </div>

        {/* HERO */}
        <section className="relative h-[198px] overflow-hidden rounded-[14px] bg-gradient-to-r from-[#071b52] via-[#12319b] to-[#087cc7] shadow-lg">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-[28%] top-0 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex h-full items-center px-7 lg:px-8">

            <div className="w-[62%]">

              <h1 className="text-[38px] font-black leading-none text-white">
                Lender{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  Policy & Terms
                </span>
              </h1>

              <p className="mt-3 text-[18px] font-bold text-white">
                Stay Updated • Follow Guidelines • Avoid Rejections
              </p>

              <p className="mt-2 max-w-[650px] text-[15px] leading-5 text-blue-100">
                Access latest lender policies, eligibility criteria, interest
                rates, documents and important terms & conditions at one place.
              </p>

              <div className="mt-4 flex gap-5">
                {[
                  [FileCheck2, "Latest Policies", "bg-emerald-500"],
                  [CheckCircle2, "Eligibility Criteria", "bg-purple-600"],
                  [FileText, "Document Checklist", "bg-blue-500"],
                  [Scale, "Terms & Conditions", "bg-orange-500"],
                ].map(([Icon, text, bg]: any) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-[15px] font-bold text-white"
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-md ${bg}`}
                    >
                      <Icon size={14} />
                    </span>
                    {text}
                  </div>
                ))}
              </div>

            </div>

            {/* HERO GRAPHIC — SINGLE SYMBOL SET */}
            <div className="absolute right-4 top-3 h-full w-[35%]">

              <div className="absolute left-0 top-8 text-white/80">
                <Landmark size={55} strokeWidth={1.5} />
              </div>

              <div className="absolute left-[72px] top-3 h-[140px] w-[105px] rotate-[-5deg] rounded-xl border border-white/30 bg-white p-3 shadow-2xl">

                <p className="text-[15px] font-black text-slate-700">
                  LENDER POLICY
                </p>

                <div className="mt-3 space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span className="h-1.5 flex-1 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>

              </div>

              <div className="absolute left-[135px] top-[47px] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-xl">
                <ShieldCheck size={32} className="text-white" />
              </div>

              <div className="absolute right-0 top-4 space-y-2">

                {[
                  [RefreshCw, "Updated Regularly"],
                  [ShieldCheck, "Verified Information"],
                  [FileText, "Easy to Understand"],
                  [Bot, "AI Policy Assistant"],
                ].map(([Icon, text]: any) => (
                  <div
                    key={text}
                    className="flex w-[142px] items-center gap-2 rounded-lg bg-white px-3 py-2 text-[15px] font-bold text-slate-700 shadow-lg"
                  >
                    <Icon size={14} className="text-blue-600" />
                    {text}
                  </div>
                ))}

              </div>

            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {[
            [Landmark, String(new Set(lenderPolicies.map((p) => p.lenderName)).size), "Lending Partners", "From backend records", "blue"],
            [FileText, String(lenderPolicies.length), "Policy Documents", "Records loaded from backend", "purple"],
            [Percent, "—", "Applications Approved", "Verified approval data unavailable", "green"],
            [Clock3, (() => { const latest = lenderPolicies.reduce((max: number, p: any) => { const raw = p.updatedAt ?? p.updated_at ?? p.lastUpdated ?? p.last_updated ?? p.createdAt ?? p.created_at; const time = raw ? Date.parse(String(raw)) : NaN; return Number.isFinite(time) && time > max ? time : max; }, 0); return latest ? new Date(latest).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"; })(), "Last Updated", "Based on available record dates", "red"],
          ].map(([Icon, value, title, sub, color]: any) => (

            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    color === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : color === "purple"
                      ? "bg-purple-50 text-purple-600"
                      : color === "green"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-[15px] font-bold text-slate-500">
                    {title}
                  </p>
                  <p className="mt-0.5 text-xl font-black">{value}</p>
                  <p className="text-[15px] text-slate-400">{sub}</p>
                </div>

              </div>
            </div>

          ))}

        </section>

        <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_315px]">

          <div className="space-y-3">

            {/* SEARCH */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <h2 className="flex items-center gap-2 text-[15px] font-black">
                <Search className="text-blue-600" size={21} />
                Find Lender Policies
              </h2>

              <p className="ml-7 mt-0.5 text-[15px] text-slate-500">
                Search and filter lender policies, terms and eligibility criteria
              </p>

              <div className="mt-4 grid gap-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">

                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={policySearch}
                    onChange={(e) => setPolicySearch(e.target.value)}
                    placeholder="Search lender name..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-8 pr-3 text-[15px] outline-none"
                  />
                </div>

                <select
                  aria-label="Filter by loan type"
                  value={loanTypeFilter}
                  onChange={(e) => {
                    setLoanTypeFilter(e.target.value);
                    if (e.target.value !== "All Loan Types") {
                      setSelectedLoan(e.target.value);
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[15px] font-semibold text-slate-600 outline-none"
                >
                  <option>All Loan Types</option>
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Business Loan</option>
                  <option>Car Loan</option>
                  <option>Loan Against Property</option>
                  <option>Credit Card</option>
                </select>

                <select
                  aria-label="Select lender"
                  value={lenderFilter}
                  onChange={(e) => {
                    setLenderFilter(e.target.value);
                    if (e.target.value !== "All Lenders") {
                      setSelectedLender(e.target.value);
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[15px] font-semibold text-slate-600 outline-none"
                >
                  <option>All Lenders</option>
                  {lenders.map((lender) => (
                    <option key={lender.name} value={lender.name}>
                      {lender.name}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Navigate to policy section"
                  value={policyTypeFilter}
                  onChange={(e) => {
                    setPolicyTypeFilter(e.target.value);
                    setSelectedPolicySection(e.target.value);
                    document.getElementById("policy-overview")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[15px] font-semibold text-slate-600 outline-none"
                >
                  <option>Overview</option>
                  <option>Eligibility Criteria</option>
                  <option>Interest Rates</option>
                  <option>Processing Fees</option>
                  <option>Required Documents</option>
                  <option>Terms &amp; Conditions</option>
                  <option>Special Features</option>
                  <option>FAQs</option>
                </select>

              </div>
            </section>

            {/* LENDING PARTNERS */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <h2 className="flex items-center gap-2 text-[15px] font-black">
                <Landmark className="text-blue-600" size={20} />
                Our Lending Partners
              </h2>
{lenderPoliciesLoading && (
                <p className="mt-3 text-sm text-slate-500">Loading lender records from database...</p>
              )}
              {!lenderPoliciesLoading && lenderPoliciesError && (
                <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{lenderPoliciesError}</p>
              )}
              {!lenderPoliciesLoading && !lenderPoliciesError && lenders.length === 0 && (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  Database mein abhi lender records nahi hain. Verified policy records add karne ke baad yahan dikhenge.
                </p>
              )}


              <p className="ml-7 text-[15px] text-slate-500">
                Click on any lender to view their complete policy details
              </p>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

                {filteredLenders.map((lender) => (

                  <button
                    key={lender.name}
                    onClick={() => setSelectedLender(lender.name)}
                    className={`min-w-[82px] rounded-lg border p-2.5 transition ${
                      selectedLender === lender.name
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    {/* ONLY ONE BANK SYMBOL */}
                    <BankLogo
                      lender={lender.name}
                    />

                    <p className="mt-2 truncate text-[15px] font-bold">
                      {lender.name}
                    </p>

                  </button>

                ))}

              </div>
            </section>

            {/* LOAN TYPES */}
            <section className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

              <div className="grid grid-cols-3 gap-1 md:grid-cols-6">

                {[
                  [UserRound, "Personal Loan"],
                  [Home, "Home Loan"],
                  [BriefcaseBusiness, "Business Loan"],
                  [Car, "Car Loan"],
                  [FileText, "Loan Against Property"],
                  [CreditCard, "Credit Card"],
                ].map(([Icon, text]: any) => (

                  <button
                    key={text}
                    onClick={() => setSelectedLoan(text)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[15px] font-bold ${
                      selectedLoan === text
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={14} />
                    <span className="hidden lg:inline">{text}</span>
                  </button>

                ))}

              </div>
            </section>

            {/* POLICY */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 p-4">

                <div className="flex flex-wrap items-center gap-3">

                  {/* ONLY ONE HDFC SYMBOL */}
                  <BankLogo
                    lender={selectedLender}
                  />

                  <div>
                    <h2 className="text-[16px] font-black">
                      {selectedLender} · {selectedLoan} Policy
                    </h2>

                    <p className="mt-1 text-[15px] text-slate-500">
                      Complete policy details, eligibility, documents and terms
                      & conditions
                    </p>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[15px] font-bold text-emerald-600">
                      ● Active
                    </span>

                    <span className="text-[15px] text-slate-500">
                      Last Updated: 05 Oct 2026
                    </span>
                  </div>

                </div>
              </div>

              <div className="grid lg:grid-cols-[190px_1fr]">

                {/* MENU */}
                <div className="border-b border-slate-200 p-3 lg:border-b-0 lg:border-r">

                  <div className="space-y-1">

                    {policyMenu.map(([label, Icon]: any, index) => (

                      <button
                        key={label}
                        onClick={() => {
                          setSelectedPolicySection(label);
                          document.getElementById("policy-overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[15px] font-bold ${
                          selectedPolicySection === label
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600"
                        }`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>

                    ))}

                  </div>
                </div>

                {/* POLICY OVERVIEW */}
                <div className="p-4">

                  <h3 className="flex items-center gap-2 text-[16px] font-black">
                    <FileText size={18} className="text-blue-600" />
                    Policy Overview
                  </h3>

                  <p className="mt-2 text-[15px] leading-5 text-slate-600">
                    {selectedLender} {selectedLoan} offers funding options for
                    eligible customers with suitable documentation and
                    applicable lender criteria.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    {[
                      ["₹", "Loan Amount", (() => { const p: any = selectedPolicyRecord; const min = p?.minLoanAmount ?? p?.minimumLoanAmount ?? p?.minAmount; const max = p?.maxLoanAmount ?? p?.maximumLoanAmount ?? p?.maxAmount; return min != null && max != null ? `${min} - ${max}` : "—"; })()],
                      ["◷", "Tenure", "12 - 60 Months"],
                      ["%", "Interest Rate", (() => { const p: any = selectedPolicyRecord; const min = p?.minInterestRate ?? p?.interestRateMin ?? p?.minimumInterestRate; const max = p?.maxInterestRate ?? p?.interestRateMax ?? p?.maximumInterestRate; const rate = p?.interestRate ?? p?.rate; if (min != null && max != null) return `${min}% - ${max}% p.a.`; return rate != null ? `${rate}% p.a.` : "—"; })()],
                      ["◷", "Processing Time", "Within 24 - 48 Hours"],
                    ].map(([symbol, title, value]) => (

                      <div
                        key={title}
                        className="rounded-xl bg-slate-50 p-3"
                      >

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[16px] font-black text-blue-600 shadow-sm">
                            {symbol}
                          </div>

                          <div>
                            <p className="text-[15px] text-slate-500">
                              {title}
                            </p>

                            <p className="text-[15px] font-black">
                              {value}
                            </p>
                          </div>

                        </div>
                      </div>

                    ))}

                  </div>

                  {/* BENEFITS */}
                  <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">

                    <h4 className="flex items-center gap-2 text-[15px] font-black text-emerald-700">
                      <CheckCircle2 size={15} />
                      Key Benefits
                    </h4>

                    <div className="mt-3 grid grid-cols-2 gap-y-2">

                      {[
                        "Minimal documentation",
                        "Flexible repayment options",
                        "No collateral required",
                        "Competitive interest rates",
                        "Quick approval and disbursal",
                        "Prepayment facility available",
                      ].map((item) => (

                        <div
                          key={item}
                          className="flex items-center gap-2 text-[15px] text-slate-600"
                        >
                          <CheckCircle2
                            size={12}
                            className="shrink-0 text-emerald-500"
                          />
                          {item}
                        </div>

                      ))}

                    </div>
                  </div>

                </div>
              </div>

              {/* ACTIONS */}
              <div className="grid gap-2 border-t border-slate-200 p-3 md:grid-cols-3">

                <button onClick={downloadPolicySummary} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-[15px] font-bold text-white">
                  <Download size={14} />
                  Download Policy Summary (TXT)
                </button>

                <button
                  type="button"
                  onClick={savePolicyToPriority}
                  className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 py-3 text-[15px] font-bold text-blue-600"
                >
                  <span aria-hidden="true">{savedPolicyKeys.includes(getCurrentPolicyKey()) ? "★" : "☆"}</span>
                  {savedPolicyKeys.includes(getCurrentPolicyKey()) ? "Saved to Priority" : "Save to Priority"}
                </button>

                <button
                  type="button"
                  onClick={downloadHighlightedPolicy}
                  className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 py-3 text-[15px] font-bold text-blue-600"
                >
                  <Download size={14} />
                  Download Highlighted Details
                </button>

                <button onClick={() => document.getElementById("recent-policy-updates")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 py-3 text-[15px] font-bold text-blue-600">
                  <Clock3 size={14} />
                  View Latest Updates
                </button>

                <button onClick={() => {
                  setAssistantQuestion("Compare " + selectedLoan + " policies across lenders");
                  setAssistantAnswer("A verified comparison is not available because this page is not connected to lender policy data. Check official lender websites for current interest rates, fees, eligibility and terms.");
                  document.getElementById("policy-assistant")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }} className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 py-3 text-[15px] font-bold text-blue-600">
                  <Scale size={14} />
                  Compare with Other Lenders
                </button>

              </div>
            </section>

          </div>

          {/* RIGHT SIDE */}
          <aside className="space-y-3">

            {/* AI POLICY ASSISTANT */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
                  <Bot size={25} />
                </div>

                <div>
                  <h3 className="text-[16px] font-black">
                    AI Policy Assistant
                  </h3>

                  <p className="mt-1 text-[15px] text-slate-500">
                    Get instant answers about lender policies
                  </p>
                </div>

                <span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[15px] font-bold text-emerald-600">
                  ● Online
                </span>

              </div>

              <div className="mt-4 space-y-2">

                {[
                  "What is the eligibility for HDFC personal loan?",
                  "What documents are required for home loan?",
                  "Compare interest rates across lenders",
                  "What is the processing time for business loan?",
                  "Can I apply with low CIBIL score?",
                  "What are the prepayment charges?",
                ].map((question) => (

                  <button
                    key={question}
                    onClick={() => askPolicyAssistant(question)}
                    className="flex w-full items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-left text-[15px] font-semibold text-slate-600"
                  >
                    <MessageCircle
                      size={12}
                      className="shrink-0 text-blue-500"
                    />
                    {question}
                  </button>

                ))}

              </div>

              <div className="mt-3 flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">

                <input
                  value={assistantQuestion}
                  onChange={(e) => setAssistantQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") askPolicyAssistant(assistantQuestion);
                  }}
                  placeholder="Ask about lender policies..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] outline-none"
                />

                <button type="button" onClick={() => askPolicyAssistant(assistantQuestion)} aria-label="Submit policy question" className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                  <ArrowRight size={13} />
                </button>

              </div>

              {assistantAnswer && (
                <div role="status" aria-live="polite" className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-[13px] leading-5 text-slate-700">
                  {assistantAnswer}
                </div>
              )}

            </section>

            {/* RECENT UPDATES */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <h3 className="flex items-center gap-2 text-[16px] font-black">
                  <RefreshCw className="text-blue-600" size={17} />
                  Recent Policy Updates
                </h3>

                <button onClick={() => setShowAllUpdates((current) => !current)} className="text-[15px] font-bold text-blue-600">
                  {showAllUpdates ? "Show Less ↑" : "View All →"}
                </button>

              </div>

              <div className="relative mt-4">

                <div className="absolute bottom-2 left-[14px] top-2 w-px bg-blue-100" />

                <div className="space-y-4">

                  {(showAllUpdates ? updates : updates.slice(0, 3)).map(
                    ([name, text, date], index) => (

                      <div
                        key={name}
                        className="relative flex gap-3"
                      >

                        {/* ONLY ONE UPDATE SYMBOL */}
                        <div className="relative z-10 rounded-full bg-white p-1">
                          <BankLogo
                            lender={
                              name === "SBI"
                                ? "SBI"
                                : name === "Kotak Bank"
                                ? "Kotak Bank"
                                : name
                            }
                            small
                          />
                        </div>

                        <div className="min-w-0 flex-1 pt-1">

                          <div className="flex items-center gap-2">

                            <p className="text-[15px] font-black">
                              {name}
                            </p>

                            {index === 0 && (
                              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-bold text-emerald-600">
                                New
                              </span>
                            )}

                          </div>

                          <p className="mt-0.5 text-[15px] leading-4 text-slate-500">
                            {text}
                          </p>

                          <p className="mt-0.5 text-[7px] text-slate-400">
                            {date}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>
              </div>
            </section>

            {/* COMPLIANCE */}
            <section className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">

              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={20} />
                <h3 className="text-[15px] font-black">
                  Policy Compliance Check
                </h3>
              </div>

              <p className="mt-2 text-[15px] leading-4 text-slate-600">
                Verify lender eligibility, documentation and applicable terms
                before submitting an application.
              </p>

              <button onClick={() => {
                setAssistantQuestion(selectedLoan + " application requirements for " + selectedLender);
                setAssistantAnswer("General checklist only: confirm the lender's current identity and address proof requirements, income proof, bank statements, credit history and application form. Exact documents and eligibility vary by lender and applicant. Verify the official lender policy before applying.");
                document.getElementById("policy-assistant")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-[15px] font-bold text-white">
                Check Application Requirements
                <ArrowRight size={12} />
              </button>

            </section>

          </aside>
        </div>

        <div className="py-5 text-center">
          <p className="text-[15px] text-slate-400">
            Lender policies, rates, eligibility criteria and processing
            timelines may change. Always verify the latest lender-approved
            policy before submitting an application.
          </p>
        </div>

      </main>
    </div>
  );
}














