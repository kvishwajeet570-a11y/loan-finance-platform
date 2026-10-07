"use client";

import { useMemo, useState } from "react";

type Loan = {
 id: string;
 company: string;
 initials: string;
 product: string;
 category: string;
 amount: string;
 minAmount: number;
 maxAmount: number;
 rate: string;
 tenure: string;
 processing: string;
 eligibility: string[];
 documents: string[];
 benefits: string[];
 charges: string[];
 badge?: string;
 source: string;
 verified: string;
};

const loans: Loan[] = [
 {
 id: "tata-personal",
 company: "Tata Capital",
 initials: "TC",
 product: "Personal Loan",
 category: "Personal Loan",
 amount: "â‚¹75,000 â€“ â‚¹35 Lakh",
 minAmount: 75000,
 maxAmount: 3500000,
 rate: "10.99% â€“ 33% p.a.",
 tenure: "1 â€“ 6 Years",
 processing: "Up to 5% + GST",
 eligibility: [
 "Age 21â€“58 years for salaried applicants",
 "Minimum monthly income â‚¹20,000",
 "Minimum 1 year at current job",
 "725+ CIBIL preferred",
 "Indian resident"
 ],
 documents: [
 "PAN Card",
 "Identity / Address Proof",
 "Last 2 months salary slips",
 "Last 3 months bank statements",
 "Employment proof"
 ],
 benefits: [
 "Digital application process",
 "Flexible repayment tenure",
 "Reducing-balance interest",
 "Personalised rate after credit assessment"
 ],
 charges: [
 "Processing fee up to 5% + GST",
 "Documentation charges up to â‚¹1,999",
 "Bounce charge â‚¹600 per instrument",
 "Foreclosure charges depend on facility and timing"
 ],
 badge: "POPULAR",
 source: "https://www.tatacapital.com/personal-loan/rates-and-charges.html",
 verified: "Official Tata Capital public terms"
 },

 {
 id: "tata-small",
 company: "Tata Capital",
 initials: "TC",
 product: "Small Personal Loan",
 category: "Small Ticket",
 amount: "Small-ticket personal loan",
 minAmount: 50000,
 maxAmount: 500000,
 rate: "10.99% â€“ 33% p.a.",
 tenure: "Flexible",
 processing: "Up to 5% + GST",
 eligibility: [
 "Minimum salary â‚¹20,000/month",
 "Age generally 21â€“58 years",
 "At least 1 year of employment",
 "Credit and repayment profile assessed"
 ],
 documents: [
 "Photo ID",
 "Address proof",
 "Recent bank statements",
 "Salary / income proof",
 "Employment certificate"
 ],
 benefits: [
 "Designed for smaller borrowing needs",
 "Digital application",
 "Minimal paperwork",
 "Flexible repayment"
 ],
 charges: [
 "Processing fee up to 5% + GST",
 "Penal charges may apply on overdue amounts",
 "Other statutory charges as applicable"
 ],
 badge: "SMALL TICKET",
 source: "https://www.tatacapital.com/personal-loan/small-personal-loan.html",
 verified: "Official Tata Capital public terms"
 },

 {
 id: "tata-salaried",
 company: "Tata Capital",
 initials: "TC",
 product: "Salaried Personal Loan",
 category: "Salaried",
 amount: "Up to â‚¹35 Lakh",
 minAmount: 75000,
 maxAmount: 3500000,
 rate: "10.99% â€“ 33% p.a.",
 tenure: "Up to 6 Years",
 processing: "Up to 5% + GST",
 eligibility: [
 "Salaried applicant",
 "Age 21â€“58 years",
 "Minimum monthly income â‚¹20,000",
 "Minimum 1 year at current job",
 "725+ CIBIL preferred"
 ],
 documents: [
 "PAN Card",
 "Address proof",
 "Salary slips",
 "Bank statements",
 "Employment proof"
 ],
 benefits: [
 "Salary-based eligibility assessment",
 "Digital process",
 "Flexible tenure",
 "Personalised loan pricing"
 ],
 charges: [
 "Processing fee up to 5% + GST",
 "Part-prepayment rules apply",
 "Foreclosure charges depend on timing"
 ],
 badge: "SALARIED",
 source: "https://www.tatacapital.com/personal-loan/personal-loan-for-salaried.html",
 verified: "Official Tata Capital public terms"
 },

 {
 id: "bajaj-personal",
 company: "Bajaj Finance",
 initials: "BF",
 product: "Personal Loan",
 category: "Personal Loan",
 amount: "â‚¹40,000 â€“ â‚¹55 Lakh",
 minAmount: 40000,
 maxAmount: 5500000,
 rate: "10% â€“ 30.5% p.a.",
 tenure: "12 â€“ 108 Months",
 processing: "Up to 4.13% inclusive of applicable taxes",
 eligibility: [
 "Eligibility depends on credit profile",
 "Income and existing obligations considered",
 "Repayment tenure affects pricing",
 "Final offer subject to lender assessment"
 ],
 documents: [
 "PAN Card",
 "KYC / identity proof",
 "Salary slips",
 "Bank statements",
 "Employment documents where applicable"
 ],
 benefits: [
 "Loan amounts up to â‚¹55 lakh",
 "Digital application",
 "Multiple repayment options",
 "Personalised eligibility"
 ],
 charges: [
 "Processing fee up to 4.13%",
 "Bounce charges â‚¹700â€“â‚¹1,200",
 "Full prepayment charges up to 4.72%",
 "Stamp duty as applicable"
 ],
 badge: "HIGH LIMIT",
 source: "https://www.bajajfinserv.in/personal-loan",
 verified: "Official Bajaj Finance public terms"
 },

 {
 id: "bajaj-salaried",
 company: "Bajaj Finance",
 initials: "BF",
 product: "Salaried Personal Loan",
 category: "Salaried",
 amount: "â‚¹40,000 â€“ â‚¹55 Lakh",
 minAmount: 40000,
 maxAmount: 5500000,
 rate: "10% â€“ 30.5% p.a.",
 tenure: "12 â€“ 108 Months",
 processing: "Up to 4.13%",
 eligibility: [
 "Salaried applicants",
 "Income and credit profile evaluated",
 "Existing EMIs considered",
 "Final amount depends on eligibility"
 ],
 documents: [
 "PAN Card",
 "KYC documents",
 "Last 3 months salary slips",
 "Last 3 months bank statements",
 "Employee ID where applicable"
 ],
 benefits: [
 "Large loan range",
 "Online eligibility journey",
 "Flexible tenure",
 "Fast digital processing for eligible applicants"
 ],
 charges: [
 "Processing fee up to 4.13%",
 "Bounce charges â‚¹700â€“â‚¹1,200",
 "Foreclosure charges up to 4.72%"
 ],
 badge: "SALARIED",
 source: "https://www.bajajfinserv.in/personal-loan-for-salaried-employees",
 verified: "Official Bajaj Finance public terms"
 },

 {
 id: "bajaj-emergency",
 company: "Bajaj Finance",
 initials: "BF",
 product: "Emergency Personal Loan",
 category: "Emergency",
 amount: "Up to â‚¹55 Lakh",
 minAmount: 40000,
 maxAmount: 5500000,
 rate: "10% â€“ 30.5% p.a.",
 tenure: "12 â€“ 108 Months",
 processing: "Up to 4.13%",
 eligibility: [
 "Credit profile assessment",
 "Income and repayment capacity considered",
 "Existing debt obligations considered"
 ],
 documents: [
 "PAN Card",
 "KYC documents",
 "Income proof",
 "Bank statements"
 ],
 benefits: [
 "Digital eligibility check",
 "Large available loan range",
 "Flexible repayment period"
 ],
 charges: [
 "Processing fee up to 4.13%",
 "Foreclosure charges up to 4.72%",
 "Bounce charges â‚¹700â€“â‚¹1,200"
 ],
 badge: "EMERGENCY",
 source: "https://www.bajajfinserv.in/emergency-loan",
 verified: "Official Bajaj Finance public terms"
 },

 {
 id: "aditya-personal",
 company: "Aditya Birla Capital",
 initials: "AB",
 product: "Personal Loan",
 category: "Personal Loan",
 amount: "â‚¹25,000 â€“ â‚¹5 Lakh",
 minAmount: 25000,
 maxAmount: 500000,
 rate: "10% â€“ 28% p.a.",
 tenure: "12 â€“ 36 Months",
 processing: "Up to 4% of sanctioned amount",
 eligibility: [
 "Age generally 23â€“60 years",
 "Salaried and self-employed profiles supported",
 "Minimum income varies by location/profile",
 "Credit profile evaluated"
 ],
 documents: [
 "PAN Card",
 "KYC documents",
 "Address proof",
 "Income proof",
 "Bank statements"
 ],
 benefits: [
 "Small-ticket loan availability",
 "Digital application",
 "Flexible repayment options",
 "Personalised options"
 ],
 charges: [
 "Processing fee up to 4%",
 "Penal charge 3% p.m. on overdue amount",
 "Mandate cancellation â‚¹450",
 "Other statutory charges as applicable"
 ],
 badge: "DIGITAL",
 source: "https://www.adityabirlacapital.com/loans/personal-finance/personal-loan",
 verified: "Official Aditya Birla Capital public terms"
 },

 {
 id: "aditya-flexi",
 company: "Aditya Birla Capital",
 initials: "AB",
 product: "Flexi Personal Loan",
 category: "Flexi",
 amount: "Personalised limit",
 minAmount: 100000,
 maxAmount: 2100000,
 rate: "Published flexi pricing varies by product/profile",
 tenure: "Up to 7 Years",
 processing: "Up to 2.5% / product dependent",
 eligibility: [
 "Salaried / eligible self-employed profiles",
 "Credit assessment required",
 "Income and existing obligations considered"
 ],
 documents: [
 "KYC documents",
 "Address proof",
 "Income proof",
 "Bank statements"
 ],
 benefits: [
 "Withdraw funds as needed",
 "Interest charged on utilised amount",
 "No collateral for eligible facility",
 "Flexible usage"
 ],
 charges: [
 "Charges vary by facility",
 "Non-utilised facility charge may apply",
 "Other applicable taxes and statutory charges"
 ],
 badge: "FLEXI",
 source: "https://www.adityabirlacapital.com/loans/personal-finance",
 verified: "Official Aditya Birla Capital public terms"
 },

 {
 id: "hero-personal",
 company: "Hero FinCorp",
 initials: "HF",
 product: "Personal Loan",
 category: "Personal Loan",
 amount: "â‚¹50,000 â€“ â‚¹7 Lakh",
 minAmount: 50000,
 maxAmount: 700000,
 rate: "Starting from 18% p.a.",
 tenure: "12 â€“ 36 Months",
 processing: "Minimum 2.5% + GST",
 eligibility: [
 "Income and credit profile evaluated",
 "Existing EMI obligations considered",
 "Final rate depends on applicant profile",
 "Collateral-free personal loan"
 ],
 documents: [
 "PAN Card",
 "Digital KYC",
 "Income information",
 "Banking information"
 ],
 benefits: [
 "Digital application",
 "Collateral-free",
 "Loan amount up to â‚¹7 lakh",
 "Flexible 12â€“36 month tenure"
 ],
 charges: [
 "Processing fee minimum 2.5% + GST",
 "Prepayment charges not applicable",
 "Foreclosure up to 5% + GST",
 "EMI bounce â‚¹350"
 ],
 badge: "DIGITAL",
 source: "https://www.herofincorp.com/personal-loans",
 verified: "Official Hero FinCorp public terms"
 },

 {
 id: "hero-mobile",
 company: "Hero FinCorp",
 initials: "HF",
 product: "Consumer Durable / Mobile Loan",
 category: "Consumer Durable",
 amount: "Product and profile dependent",
 minAmount: 5000,
 maxAmount: 500000,
 rate: "Starting from 18% p.a.",
 tenure: "Product dependent",
 processing: "Starting from 2.5% + GST",
 eligibility: [
 "Applicant profile assessment",
 "Digital KYC verification",
 "Income / repayment capacity assessment"
 ],
 documents: [
 "PAN Card",
 "Digital KYC",
 "Income information where applicable"
 ],
 benefits: [
 "Digital application",
 "Consumer durable financing",
 "Paperless process",
 "Transparent charges before acceptance"
 ],
 charges: [
 "Processing fee from 2.5% + GST",
 "Prepayment charges not applicable",
 "Foreclosure up to 5% + GST",
 "Bounce charge â‚¹350"
 ],
 badge: "CONSUMER",
 source: "https://www.herofincorp.com/personal-loans/consumer-durable-loan",
 verified: "Official Hero FinCorp public terms"
 },

 {
 id: "shriram-personal",
 company: "Shriram Finance",
 initials: "SF",
 product: "Personal Loan",
 category: "Personal Loan",
 amount: "Profile dependent",
 minAmount: 10000,
 maxAmount: 5000000,
 rate: "Starting from 11% p.a.",
 tenure: "12 â€“ 60 Months",
 processing: "Up to 5%",
 eligibility: [
 "Credit profile evaluated",
 "Income and repayment capacity considered",
 "Loan tenure affects pricing",
 "Final terms communicated during application"
 ],
 documents: [
 "KYC documents",
 "Income proof",
 "Bank statements",
 "Address proof"
 ],
 benefits: [
 "12â€“60 month repayment options",
 "Online application",
 "Wide branch network",
 "Personalised assessment"
 ],
 charges: [
 "Processing fee up to 5%",
 "Foreclosure capped at 4% of outstanding principal",
 "Foreclosure not permitted within first 12 months",
 "Additional transfer charge may apply"
 ],
 badge: "FLEXIBLE",
 source: "https://www.shriramfinance.in/personal-loan/interest-rate-charges",
 verified: "Official Shriram Finance public terms"
 }
];

function money(value: number) {
 return new Intl.NumberFormat("en-IN", {
 style: "currency",
 currency: "INR",
 maximumFractionDigits: 0
 }).format(value);
}

function calculateEMI(principal: number, annualRate: number, months: number) {
 const r = annualRate / 12 / 100;
 if (!r) return principal / months;
 return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

export default function ProductsPage() {
 const [search, setSearch] = useState("");
 const [company, setCompany] = useState("All");
 const [category, setCategory] = useState("All");
 const [sort, setSort] = useState("featured");
 const [expanded, setExpanded] = useState<string | null>(null);
 const [amount, setAmount] = useState(200000);
 const [months, setMonths] = useState(24);

 const companies = ["All", ...Array.from(new Set(loans.map(x => x.company)))];
 const categories = ["All", ...Array.from(new Set(loans.map(x => x.category)))];

 const filtered = useMemo(() => {
 let data = loans.filter(item => {
 const matchesSearch =
 !search ||
 `${item.company} ${item.product} ${item.category}`
 .toLowerCase()
 .includes(search.toLowerCase());

 const matchesCompany = company === "All" || item.company === company;
 const matchesCategory = category === "All" || item.category === category;

 return matchesSearch && matchesCompany && matchesCategory;
 });

 if (sort === "amount-high") {
 data = [...data].sort((a, b) => b.maxAmount - a.maxAmount);
 }

 if (sort === "amount-low") {
 data = [...data].sort((a, b) => a.maxAmount - b.maxAmount);
 }

 if (sort === "rate") {
 data = [...data].sort((a, b) => {
 const ar = parseFloat(a.rate.replace(/[^0-9.]/g, "")) || 999;
 const br = parseFloat(b.rate.replace(/[^0-9.]/g, "")) || 999;
 return ar - br;
 });
 }

 return data;
 }, [search, company, category, sort]);

 return (
 <main className="min-h-screen bg-[#f5f8fc] text-[#101828]">
 <style jsx global>{`
 * { box-sizing: border-box; }
 body { margin: 0; background: #f5f8fc; }
 .premium-card {
 transition: all .25s ease;
 }
 .premium-card:hover {
 transform: translateY(-3px);
 box-shadow: 0 18px 45px rgba(30, 64, 175, .12);
 }
 .gradient-text {
 background: linear-gradient(90deg,#111827,#2563eb,#4f46e5);
 -webkit-background-clip:text;
 background-clip:text;
 color:transparent;
 }
 `}</style>

 {/* TOP BAR */}
 <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
 <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
 <div>
 <div className="text-[11px] font-bold uppercase tracking-[.25em] text-blue-600">
 Loan Marketplace
 </div>
 <div className="text-xl font-black tracking-tight">
 India Loan Finance
 </div>
 </div>

 <div className="hidden rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 md:block">
 â— Public lender terms verified
 </div>
 </div>
 </header>

 {/* HERO */}
 <section className="mx-auto max-w-7xl px-5 pb-8 pt-12">
 <div className="rounded-[30px] bg-gradient-to-br from-[#071a52] via-[#173caa] to-[#4f46e5] p-8 text-white shadow-2xl md:p-12">
 <div className="max-w-4xl">
 <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide backdrop-blur">
 VERIFIED PUBLIC OFFER DATA
 </div>

 <h1 className="text-4xl font-black leading-tight md:text-6xl">
 Explore Loan Offers
 <br />
 <span className="text-cyan-300">from Multiple Lenders</span>
 </h1>

 <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
 Compare publicly published lender terms, eligibility,
 charges and repayment options before checking your
 personalised eligibility.
 </p>

 <div className="mt-8 grid gap-3 sm:grid-cols-3">
 <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
 <div className="text-2xl font-black">{new Set(loans.map(x => x.company)).size}</div>
 <div className="text-xs text-blue-100">Lenders</div>
 </div>

 <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
 <div className="text-2xl font-black">{loans.length}+</div>
 <div className="text-xs text-blue-100">Loan Offers</div>
 </div>

 <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
 <div className="text-2xl font-black">Live-ready</div>
 <div className="text-xs text-blue-100">API Architecture</div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* FILTERS */}
 <section className="mx-auto max-w-7xl px-5 pb-8">
 <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
 <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
 <input
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search lender, loan or category..."
 className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500"
 />

 <select
 value={company}
 onChange={e => setCompany(e.target.value)}
 className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none"
 >
 {companies.map(x => <option key={x}>{x}</option>)}
 </select>

 <select
 value={category}
 onChange={e => setCategory(e.target.value)}
 className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none"
 >
 {categories.map(x => <option key={x}>{x}</option>)}
 </select>

 <select
 value={sort}
 onChange={e => setSort(e.target.value)}
 className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none"
 >
 <option value="featured">Featured</option>
 <option value="rate">Lowest published rate</option>
 <option value="amount-high">Highest amount</option>
 <option value="amount-low">Lowest amount</option>
 </select>
 </div>
 </div>
 </section>

 {/* RESULTS */}
 <section className="mx-auto max-w-7xl px-5 pb-16">
 <div className="mb-5 flex items-end justify-between">
 <div>
 <div className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">
 Available Offers
 </div>
 <h2 className="mt-1 text-2xl font-black md:text-3xl">
 {filtered.length} offers available
 </h2>
 </div>

 <div className="hidden text-right text-xs text-slate-500 md:block">
 Public terms â‰  guaranteed approval
 </div>
 </div>

 <div className="space-y-5">
 {filtered.map((loan) => {
 const isOpen = expanded === loan.id;

 const estimatedRate = parseFloat(
 loan.rate.replace(/[^0-9.]/g, "")
 ) || 18;

 const emi = calculateEMI(
 amount,
 estimatedRate,
 months
 );

 return (
 <article
 key={loan.id}
 className="premium-card overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
 >
 {/* MAIN OFFER */}
 <div className="p-5 md:p-7">
 <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
 <div className="flex min-w-[270px] items-center gap-4">
 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-black text-blue-700 ring-1 ring-blue-100">
 {loan.initials}
 </div>

 <div>
 <h3 className="text-lg font-black">
 {loan.company}
 </h3>
 <p className="mt-1 text-sm font-semibold text-slate-500">
 {loan.product}
 </p>

 <div className="mt-2 flex flex-wrap gap-2">
 <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
 PUBLIC TERMS
 </span>

 {loan.badge && (
 <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
 {loan.badge}
 </span>
 )}
 </div>
 </div>
 </div>

 <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
 <div className="rounded-2xl bg-slate-50 p-4">
 <div className="text-[10px] font-bold uppercase text-slate-400">
 Loan Amount
 </div>
 <div className="mt-2 text-sm font-black">
 {loan.amount}
 </div>
 </div>

 <div className="rounded-2xl bg-slate-50 p-4">
 <div className="text-[10px] font-bold uppercase text-slate-400">
 Interest
 </div>
 <div className="mt-2 text-sm font-black text-blue-700">
 {loan.rate}
 </div>
 </div>

 <div className="rounded-2xl bg-slate-50 p-4">
 <div className="text-[10px] font-bold uppercase text-slate-400">
 Tenure
 </div>
 <div className="mt-2 text-sm font-black">
 {loan.tenure}
 </div>
 </div>

 <div className="rounded-2xl bg-slate-50 p-4">
 <div className="text-[10px] font-bold uppercase text-slate-400">
 Processing
 </div>
 <div className="mt-2 text-sm font-black">
 {loan.processing}
 </div>
 </div>
 </div>

 <div className="flex gap-2 lg:flex-col">
 <button
 onClick={() =>
 setExpanded(isOpen ? null : loan.id)
 }
 className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 lg:min-w-[150px]"
 >
 {isOpen ? "Hide Offer" : "Detailed Offer â†“"}
 </button>

 <button
 type="button"
 onClick={() => {
 const params = new URLSearchParams({
 company: loan.company,
 product: loan.product,
 offer: loan.id,
 });

 window.location.href =
 `/dsa/apply-loan?${params.toString()}`;
 }}
 className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-center text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
 >
 Apply Now â†’
 </button>
 </div>
 </div>
 </div>

 {/* DETAILED OFFER */}
 {isOpen && (
 <div className="border-t border-slate-200 bg-[#f8fafc] p-5 md:p-8">
 <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
 <div>
 <div className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">
 Detailed Offer â†“
 </div>
 <h4 className="mt-1 text-2xl font-black">
 {loan.company} Â· {loan.product}
 </h4>
 <p className="mt-1 text-xs text-slate-500">
 {loan.verified} Â· Public/indicative terms
 </p>
 </div>

 <a
 href={loan.source}
 target="_blank"
 rel="noreferrer"
 className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-center text-xs font-bold text-blue-700"
 >
 View Official Terms â†—
 </a>
 </div>

 <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
 {/* LEFT */}
 <div className="space-y-5">
 <div className="grid gap-3 sm:grid-cols-3">
 <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
 <div className="text-xs text-slate-400">Loan Amount</div>
 <div className="mt-2 font-black">{loan.amount}</div>
 </div>

 <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
 <div className="text-xs text-slate-400">Interest Rate</div>
 <div className="mt-2 font-black text-blue-700">
 {loan.rate}
 </div>
 </div>

 <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
 <div className="text-xs text-slate-400">Processing Fee</div>
 <div className="mt-2 font-black">
 {loan.processing}
 </div>
 </div>
 </div>

 <div className="grid gap-5 md:grid-cols-2">
 <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
 <h5 className="font-black">Eligibility</h5>

 <ul className="mt-4 space-y-3">
 {loan.eligibility.map((item, i) => (
 <li
 key={i}
 className="flex gap-2 text-sm text-slate-600"
 >
 <span className="font-bold text-emerald-600">
 âœ“
 </span>
 {item}
 </li>
 ))}
 </ul>
 </div>

 <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
 <h5 className="font-black">Documents</h5>

 <ul className="mt-4 space-y-3">
 {loan.documents.map((item, i) => (
 <li
 key={i}
 className="flex gap-2 text-sm text-slate-600"
 >
 <span className="font-bold text-blue-600">
 âœ“
 </span>
 {item}
 </li>
 ))}
 </ul>
 </div>
 </div>

 <div className="grid gap-5 md:grid-cols-2">
 <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
 <h5 className="font-black">Product Benefits</h5>

 <ul className="mt-4 space-y-3">
 {loan.benefits.map((item, i) => (
 <li
 key={i}
 className="flex gap-2 text-sm text-slate-600"
 >
 <span className="font-bold text-emerald-600">
 âœ“
 </span>
 {item}
 </li>
 ))}
 </ul>
 </div>

 <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
 <h5 className="font-black">Important Charges</h5>

 <ul className="mt-4 space-y-3">
 {loan.charges.map((item, i) => (
 <li
 key={i}
 className="flex gap-2 text-sm text-slate-600"
 >
 <span className="font-bold text-orange-500">
 â€¢
 </span>
 {item}
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>

 {/* RIGHT EMI */}
 <aside className="h-fit rounded-3xl bg-[#071a52] p-6 text-white shadow-xl">
 <div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
 EMI Estimator
 </div>

 <h5 className="mt-2 text-2xl font-black">
 Plan your repayment
 </h5>

 <div className="mt-7">
 <div className="mb-2 flex justify-between text-xs text-blue-100">
 <span>Loan Amount</span>
 <strong>{money(amount)}</strong>
 </div>

 <input
 type="range"
 min="25000"
 max={Math.max(loan.maxAmount, 500000)}
 step="5000"
 value={Math.min(amount, loan.maxAmount)}
 onChange={e =>
 setAmount(Number(e.target.value))
 }
 className="w-full"
 />
 </div>

 <div className="mt-7">
 <div className="mb-2 flex justify-between text-xs text-blue-100">
 <span>Tenure</span>
 <strong>{months} months</strong>
 </div>

 <input
 type="range"
 min="12"
 max="84"
 step="12"
 value={months}
 onChange={e =>
 setMonths(Number(e.target.value))
 }
 className="w-full"
 />
 </div>

 <div className="mt-8 rounded-2xl bg-white/10 p-5">
 <div className="text-xs text-blue-100">
 Indicative EMI
 </div>

 <div className="mt-1 text-4xl font-black">
 {money(emi)}
 </div>

 <div className="mt-2 text-[11px] leading-5 text-blue-100">
 Estimated using the first published rate shown
 for this offer. Your actual EMI depends on the
 sanctioned rate, amount and tenure.
 </div>
 </div>

 <a
 href={`/dsa/apply-loan?company=${encodeURIComponent(
 loan.company
 )}&product=${encodeURIComponent(loan.product)}&offer=${loan.id}`}
 className="mt-5 block rounded-xl bg-white px-5 py-4 text-center text-sm font-black text-blue-800"
 >
 Check My Eligibility â†’
 </a>
 </aside>
 </div>

 <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
 <strong>Important:</strong> The figures shown here are
 publicly published / indicative lender terms. They are
 not a guaranteed approval, sanctioned amount, rate or
 personalised pre-approved offer. Final terms are decided
 by the respective lender after eligibility and credit
 assessment.
 </div>
 </div>
 )}
 </article>
 );
 })}
 </div>

 {filtered.length === 0 && (
 <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
 <div className="text-4xl">âŒ•</div>
 <h3 className="mt-4 text-xl font-black">
 No offers found
 </h3>
 <p className="mt-2 text-sm text-slate-500">
 Try another lender, category or search term.
 </p>
 </div>
 )}
 </section>

 {/* FOOTER NOTICE */}
 <footer className="border-t border-slate-200 bg-white">
 <div className="mx-auto max-w-7xl px-5 py-8 text-center text-xs leading-6 text-slate-500">
 India Loan Finance is displaying publicly available lender/product
 information for comparison and application assistance. Final
 eligibility, pricing, charges, approval and disbursal are subject
 to the respective lender's policies and sanction terms.
 </div>
 </footer>
 </main>
 );
}




