"use client";

import { useState } from "react";
import {
  ArrowRight, ArrowLeft, ChevronDown, UserRound, CreditCard,
  Phone, Mail, ShieldCheck, Zap, Headset, Clock3, Check,
  Wallet, BriefcaseBusiness, House, Building2, CarFront,
  GraduationCap, Coins, RefreshCw, Landmark, Factory,
  HeartPulse, PartyPopper, CircleHelp, BadgeCheck, FileText,
  LockKeyhole, Sparkles
} from "lucide-react";

const loans = [
  { name: "Personal Loan", icon: Wallet, color: "text-emerald-600 bg-emerald-100" },
  { name: "Business Loan", icon: BriefcaseBusiness, color: "text-orange-600 bg-orange-100" },
  { name: "Home Loan", icon: House, color: "text-violet-600 bg-violet-100" },
  { name: "Loan Against Property (LAP)", icon: Building2, color: "text-pink-600 bg-pink-100" },
  { name: "Car Loan", icon: CarFront, color: "text-blue-600 bg-blue-100" },
  { name: "Education Loan", icon: GraduationCap, color: "text-amber-600 bg-amber-100" },
  { name: "Gold Loan", icon: Coins, color: "text-orange-600 bg-orange-100" },
  { name: "Vehicle Loan", icon: CarFront, color: "text-cyan-700 bg-cyan-100" },
  { name: "Loan Against Property Balance Transfer", icon: RefreshCw, color: "text-indigo-600 bg-indigo-100" },
  { name: "Home Loan Balance Transfer", icon: RefreshCw, color: "text-purple-600 bg-purple-100" },
  { name: "Personal Loan Balance Transfer", icon: RefreshCw, color: "text-teal-600 bg-teal-100" },
  { name: "Working Capital Loan", icon: Landmark, color: "text-sky-600 bg-sky-100" },
  { name: "Machinery Loan", icon: Factory, color: "text-rose-600 bg-rose-100" },
  { name: "Medical Loan", icon: HeartPulse, color: "text-red-600 bg-red-100" },
  { name: "Wedding Loan", icon: PartyPopper, color: "text-fuchsia-600 bg-fuchsia-100" },
  { name: "Other Loan", icon: CircleHelp, color: "text-slate-600 bg-slate-100" },
];

const benefits = [
  { icon: Wallet, title: "Multiple Loan Options", text: "Personal, Business, Home & more", color: "bg-emerald-100 text-emerald-600" },
  { icon: Zap, title: "Simple Process", text: "A clear, guided application", color: "bg-sky-100 text-blue-600" },
  { icon: Clock3, title: "Quick to Get Started", text: "Complete your basic details", color: "bg-pink-100 text-pink-600" },
  { icon: Headset, title: "Expert Assistance", text: "Help when you need it", color: "bg-orange-100 text-orange-600" },
  { icon: ShieldCheck, title: "Privacy Conscious", text: "Handle your details with care", color: "bg-violet-100 text-violet-600" },
];

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [loan, setLoan] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitApplication() {
    if (isSubmitting) return;

    setError("");
    setPreview(false);
    setIsSubmitting(true);

    let applicationCreated = false;

    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
      const token = localStorage.getItem("loan_finance_token");

      if (!token) {
        throw new Error("Apply Loan karne ke liye pehle Customer account mein login karein.");
      }

      const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${apiBase}/loan/customer/start`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          fullName: name.trim(),
          phone: contact.trim(),
          panNo: pan.trim().toUpperCase(),
          loanType: loan,
          source: "website"
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || result.error || `Application submit failed (${response.status})`);
      }

      const data = result.data || {};
      const applicationId = data.applicationId || data.loanId || data.id;

      applicationCreated = true;

      if (!applicationId) {
        throw new Error("Application create ho gayi, lekin response mein application ID nahi mili. DOB update verify karein.");
      }

      const dobResponse = await fetch(`${apiBase}/loan/customer/${encodeURIComponent(applicationId)}/dob`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ dob })
      });

      const dobResult = await dobResponse.json().catch(() => ({}));

      if (!dobResponse.ok || dobResult.success === false) {
        throw new Error("Application create ho gayi hai, lekin DOB save confirm nahi hua. Backend response check karein.");
      }

      setPreview(true);
    } catch (err) {
      setError(
        applicationCreated
          ? (err instanceof Error ? err.message : "Application create hui; DOB update verify nahi hua.")
          : (err instanceof Error ? err.message : "Submission failed. Backend aur API connection check karein.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  function nextStep() {
    setError("");
    setPreview(false);

    if (step === 1) {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        return;
      }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.trim().toUpperCase())) {
        setError("Please enter a valid 10-character PAN number.");
        return;
      }
      if (!loan) {
        setError("Please select a loan type from the dropdown.");
        return;
      }
      if (!/^[6-9]\d{9}$/.test(contact)) {
        setError("Enter a valid 10-digit Indian mobile number.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      const value = contact.replace(/\s/g, "");
      if (!/^[6-9]\d{9}$/.test(value)) {
        setError("Enter a valid 10-digit Indian mobile number.");
        return;
      }
      if (!dob) {
        setError("Please select your date of birth.");
        return;
      }
      setStep(3);
      return;
    }

    void submitApplication();
  }

  const selectedLoan = loans.find((item) => item.name === loan);
  const SelectedIcon = selectedLoan?.icon;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8ff] text-[#111b43]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-blue-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <a href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Landmark size={23} />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight sm:text-xl">
                DSA <span className="text-blue-600">FinCorp</span>
              </div>
              <div className="text-[10px] font-medium tracking-wide text-slate-500 sm:text-xs">
                Your Financial Growth Partner
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 xl:flex">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="#loan-form" className="flex items-center gap-1 hover:text-blue-600">
              Loans <ChevronDown size={15} />
            </a>
            <a href="#why-us" className="hover:text-blue-600">Why Us</a>
            <a href="#loan-form" className="hover:text-blue-600">Apply</a>
          </nav>

          <a
            href="#loan-form"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 sm:px-5 sm:text-sm"
          >
            Apply Now <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1500px] items-start gap-7 px-4 py-7 sm:px-7 sm:py-9 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8 lg:px-10 xl:grid-cols-[0.78fr_1.18fr_0.72fr]">
        <section className="relative flex min-w-0 flex-col pt-2 lg:pt-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-bold text-blue-600 shadow-sm">
            <Sparkles size={15} className="text-orange-500" />
            Quick · Simple · Secure
          </div>

          <h1 className="mt-6 text-[42px] font-extrabold leading-[1.06] tracking-[-2px] sm:text-5xl xl:text-[58px]">
            Apply for
            <br />
            Your Loan
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              In Just a Few
              <br />
              Minutes
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            Tell us a few basic details and take the first step towards your
            financial goals. It’s simple and straightforward.
          </p>

          <div className="mt-6 space-y-4">
            {[
              { icon: Zap, title: "Fast Application", text: "A guided step-by-step process", color: "bg-emerald-100 text-emerald-600" },
              { icon: ShieldCheck, title: "Privacy Conscious", text: "Share only accurate information", color: "bg-rose-100 text-rose-600" },
              { icon: Headset, title: "Expert Support", text: "Help when you need it", color: "bg-violet-100 text-violet-600" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                  <item.icon size={23} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111b43]">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-8 hidden min-h-[205px] items-end justify-center overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-sky-100 via-white to-violet-100 p-5 md:flex">
            <div className="absolute -left-8 -top-12 h-40 w-40 rounded-full bg-cyan-200/60" />
            <div className="absolute -right-4 top-4 h-28 w-28 rounded-full bg-purple-200/60" />
            <div className="absolute bottom-5 left-5 right-5 h-5 rounded-full bg-blue-200/50 blur-sm" />
            <div className="relative flex w-full items-end justify-center gap-3">
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-3xl border border-white bg-white/90 text-blue-600 shadow-lg shadow-blue-900/10">
                <House size={45} strokeWidth={1.5} />
                <span className="mt-2 text-[10px] font-bold text-slate-600">HOME</span>
              </div>
              <div className="flex h-36 w-32 flex-col items-center justify-center rounded-3xl border border-white bg-white/95 text-violet-600 shadow-xl shadow-violet-900/10">
                <Coins size={47} strokeWidth={1.5} />
                <span className="mt-2 text-xs font-extrabold text-slate-700">₹ Finance</span>
                <span className="mt-1 text-[10px] text-slate-500">Plan your goals</span>
              </div>
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-3xl border border-white bg-white/90 text-emerald-600 shadow-lg shadow-emerald-900/10">
                <CarFront size={43} strokeWidth={1.5} />
                <span className="mt-2 text-[10px] font-bold text-slate-600">VEHICLE</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="loan-form"
          className="min-w-0 rounded-[26px] border border-white bg-white/95 p-5 shadow-[0_20px_70px_-30px_rgba(65,94,190,0.32)] backdrop-blur-xl sm:p-7 lg:p-8"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                <FileText size={14} /> Loan Application
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {step === 1 ? "Tell Us About Your Loan" : step === 2 ? "Your Contact Details" : "Review Your Details"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step === 1
                  ? "Choose a loan and enter your basic details."
                  : step === 2
                  ? "Add your date of birth to continue."
                  : "Review your details before submitting your application."}
              </p>
            </div>
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:flex">
              <LockKeyhole size={21} />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-indigo-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-400 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-slate-500">
              Step {step} of 3
            </span>
          </div>

          <form className="mt-6" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            {step === 1 && (
              <div className="space-y-5">
                <label className="block text-sm font-bold text-[#111b43]">
                  Full Name <span className="text-rose-500">*</span>
                  <div className="relative mt-2">
                    <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={19} />
                    <input
                      className={fieldClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name (as per PAN)"
                      autoComplete="name"
                      maxLength={100}
                    />
                  </div>
                </label>

                <label className="block text-sm font-bold text-[#111b43]">
                  PAN Number <span className="text-rose-500">*</span>
                  <div className="relative mt-2">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={19} />
                    <input
                      className={fieldClass}
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                      placeholder="ABCDE1234F"
                      autoComplete="off"
                      maxLength={10}
                    />
                  </div>
                </label>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#111b43]">
                    Select Loan Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      aria-expanded={menuOpen}
                      onClick={() => setMenuOpen(!menuOpen)}
                      className={`flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3.5 text-left text-sm transition focus:outline-none focus:ring-4 focus:ring-indigo-100 ${
                        menuOpen ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selectedLoan?.color || "bg-indigo-50 text-indigo-600"}`}>
                        {SelectedIcon ? <SelectedIcon size={18} /> : <Wallet size={18} />}
                      </span>
                      <span className={`flex-1 ${loan ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                        {loan || "Choose your loan type"}
                      </span>
                      <ChevronDown size={19} className={`text-slate-600 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {menuOpen && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-indigo-100 bg-white p-1.5 shadow-[0_16px_45px_-15px_rgba(40,55,130,0.35)]">
                        {loans.map((item) => {
                          const Icon = item.icon;
                          const active = loan === item.name;
                          return (
                            <button
                              type="button"
                              key={item.name}
                              onClick={() => { setLoan(item.name); setMenuOpen(false); setError(""); }}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                                active ? "bg-indigo-50 text-indigo-800" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                                <Icon size={17} />
                              </span>
                              <span className="flex-1 text-xs font-semibold leading-5 sm:text-sm">{item.name}</span>
                              {active && <Check size={17} className="text-indigo-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">
                    Tap the arrow to explore all available loan categories.
                  </p>
                </div>

                <label className="block text-sm font-bold text-[#111b43]">
                  Mobile Number <span className="text-rose-500">*</span>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={19} />
                    <input
                      type="tel"
                      inputMode="numeric"
                      className={fieldClass}
                      value={contact}
                      onChange={(e) => setContact(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter your 10-digit mobile number"
                      autoComplete="tel-national"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs font-normal text-slate-500">
                    Enter your Indian mobile number starting with 6, 7, 8 or 9.
                  </p>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">


                <label className="block text-sm font-bold text-[#111b43]">
                  Date of Birth <span className="text-rose-500">*</span>
                  <input
                    type="date"
                    className={`${fieldClass} mt-2 pl-4`}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </label>

                <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-xs leading-6 text-sky-800">
                  <ShieldCheck size={17} className="mb-1 inline mr-2" />
                  Your date of birth will be sent to the application server when you submit.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                {[
                  ["Full name", name],
                  ["PAN number", pan.toUpperCase()],
                  ["Loan type", loan],
                  ["Contact", contact],
                  ["Date of birth", dob],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="text-xs font-medium text-slate-500">{label}</span>
                    <span className="max-w-[65%] break-words text-right text-sm font-bold text-slate-800">{value}</span>
                  </div>
                ))}
                <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  Please verify your details before submitting your application.
                </p>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs font-medium leading-5 text-rose-700">
                {error}
              </p>
            )}

            {preview && (
              <div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                <div className="flex items-center gap-2 font-bold"><BadgeCheck size={18} /> Application submitted</div>
                <p className="mt-1 text-xs">The server accepted the application request. Keep the application reference returned by the server.</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => { setStep(step - 1); setError(""); setPreview(false); }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={17} /> Back
                </button>
              )}
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                {isSubmitting ? "Submitting..." : step === 3 ? "Submit Application" : "Continue"}
                {isSubmitting ? null : step === 3 ? <Check size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-slate-500">
              <ShieldCheck size={15} className="shrink-0 text-emerald-600" />
              Secure application submission
            </p>
          </form>
        </section>

        <aside id="why-us" className="space-y-5 lg:col-span-2 xl:col-span-1">
          <div className="overflow-hidden rounded-[25px] border border-white bg-gradient-to-br from-violet-100 via-white to-sky-100 p-6 text-center shadow-[0_15px_45px_-30px_rgba(67,56,202,0.4)] sm:p-7">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl shadow-violet-500/25">
              <FileText size={49} strokeWidth={1.4} />
              <span className="absolute ml-14 mt-14 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                <Check size={18} />
              </span>
            </div>
            <h3 className="mt-5 text-xl font-extrabold leading-snug tracking-tight">
              One Application,
              <br /> Multiple Loan Options
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">
              Choose a loan category that matches your needs.
            </p>
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-1.5 w-5 rounded-full bg-blue-600" />
              <span className="h-1.5 w-3 rounded-full bg-indigo-200" />
              <span className="h-1.5 w-3 rounded-full bg-indigo-200" />
            </div>
          </div>

          <div className="rounded-[25px] border border-white bg-white/90 p-6 shadow-[0_15px_45px_-35px_rgba(30,50,100,0.35)] sm:p-7">
            <h3 className="text-xl font-extrabold tracking-tight">Why Apply With Us?</h3>
            <div className="mt-6 space-y-5">
              {benefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3.5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111b43]">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <footer className="relative z-10 border-t border-blue-100 bg-white/80 px-5 py-5 text-center text-xs leading-5 text-slate-500">
        © DSA FinCorp · Loan eligibility, approval and terms depend on lender criteria and verification.
      </footer>
    </main>
  );
}





