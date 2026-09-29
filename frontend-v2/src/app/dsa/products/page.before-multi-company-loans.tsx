"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  IndianRupee,
  Percent,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

type Loan = {
  id: string;
  company: string;
  initials: string;
  category: string;
  name: string;
  amount: string;
  minAmount: number;
  maxAmount: number;
  rate: number;
  maxRate: number;
  tenure: string;
  tenureMonths: number;
  processing: string;
  badge?: string;
  featured?: boolean;
};

const loans: Loan[] = [
  {
    id: "bajaj-personal",
    company: "Bajaj Finance",
    initials: "BF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "₹40,000 – ₹55 Lakh",
    minAmount: 40000,
    maxAmount: 5500000,
    rate: 10.99,
    maxRate: 30,
    tenure: "12 – 96 Months",
    tenureMonths: 96,
    processing: "Up to 3.93%",
    badge: "Popular",
    featured: true,
  },
  {
    id: "bajaj-business",
    company: "Bajaj Finance",
    initials: "BF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹80 Lakh",
    minAmount: 100000,
    maxAmount: 8000000,
    rate: 14,
    maxRate: 30,
    tenure: "12 – 96 Months",
    tenureMonths: 96,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "tata-personal",
    company: "Tata Capital",
    initials: "TC",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹35 Lakh",
    minAmount: 75000,
    maxAmount: 3500000,
    rate: 10.99,
    maxRate: 29.99,
    tenure: "12 – 72 Months",
    tenureMonths: 72,
    processing: "As applicable",
    badge: "Fast",
  },
  {
    id: "tata-business",
    company: "Tata Capital",
    initials: "TC",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹75 Lakh",
    minAmount: 100000,
    maxAmount: 7500000,
    rate: 12,
    maxRate: 30,
    tenure: "12 – 72 Months",
    tenureMonths: 60,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "poonawalla-personal",
    company: "Poonawalla Fincorp",
    initials: "PF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹50 Lakh",
    minAmount: 50000,
    maxAmount: 5000000,
    rate: 11.99,
    maxRate: 36,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Featured",
    featured: true,
  },
  {
    id: "poonawalla-business",
    company: "Poonawalla Fincorp",
    initials: "PF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹75 Lakh",
    minAmount: 100000,
    maxAmount: 7500000,
    rate: 13,
    maxRate: 30,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "aditya-personal",
    company: "Aditya Birla Capital",
    initials: "AB",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹50 Lakh",
    minAmount: 50000,
    maxAmount: 5000000,
    rate: 10.99,
    maxRate: 30,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Popular",
  },
  {
    id: "aditya-business",
    company: "Aditya Birla Capital",
    initials: "AB",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹75 Lakh",
    minAmount: 100000,
    maxAmount: 7500000,
    rate: 13,
    maxRate: 30,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "shriram-personal",
    company: "Shriram Finance",
    initials: "SF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹10 Lakh",
    minAmount: 50000,
    maxAmount: 1000000,
    rate: 12,
    maxRate: 30,
    tenure: "12 – 60 Months",
    tenureMonths: 60,
    processing: "As applicable",
    badge: "Flexible",
  },
  {
    id: "shriram-business",
    company: "Shriram Finance",
    initials: "SF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹50 Lakh",
    minAmount: 100000,
    maxAmount: 5000000,
    rate: 13,
    maxRate: 30,
    tenure: "12 – 60 Months",
    tenureMonths: 60,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "hero-personal",
    company: "Hero FinCorp",
    initials: "HF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹5 Lakh",
    minAmount: 50000,
    maxAmount: 500000,
    rate: 14,
    maxRate: 30,
    tenure: "12 – 60 Months",
    tenureMonths: 60,
    processing: "As applicable",
    badge: "Quick",
  },
  {
    id: "hero-business",
    company: "Hero FinCorp",
    initials: "HF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹40 Lakh",
    minAmount: 100000,
    maxAmount: 4000000,
    rate: 14,
    maxRate: 30,
    tenure: "12 – 60 Months",
    tenureMonths: 60,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "muthoot-personal",
    company: "Muthoot Finance",
    initials: "MF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹15 Lakh",
    minAmount: 50000,
    maxAmount: 1500000,
    rate: 12,
    maxRate: 30,
    tenure: "12 – 60 Months",
    tenureMonths: 60,
    processing: "As applicable",
    badge: "Flexible",
  },
  {
    id: "mahindra-personal",
    company: "Mahindra Finance",
    initials: "MH",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹15 Lakh",
    minAmount: 50000,
    maxAmount: 1500000,
    rate: 12,
    maxRate: 30,
    tenure: "12 – 60 Months",
    tenureMonths: 60,
    processing: "As applicable",
  },
  {
    id: "mahindra-vehicle",
    company: "Mahindra Finance",
    initials: "MH",
    category: "Vehicle Loan",
    name: "New Vehicle Loan",
    amount: "Vehicle value based",
    minAmount: 100000,
    maxAmount: 5000000,
    rate: 9,
    maxRate: 25,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Vehicle",
  },
  {
    id: "lt-business",
    company: "L&T Finance",
    initials: "LT",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹50 Lakh",
    minAmount: 100000,
    maxAmount: 5000000,
    rate: 13,
    maxRate: 30,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "cholamandalam-business",
    company: "Cholamandalam Finance",
    initials: "CF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹50 Lakh",
    minAmount: 100000,
    maxAmount: 5000000,
    rate: 13,
    maxRate: 30,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Business",
  },
  {
    id: "cholamandalam-vehicle",
    company: "Cholamandalam Finance",
    initials: "CF",
    category: "Vehicle Loan",
    name: "Commercial Vehicle Loan",
    amount: "Profile & vehicle based",
    minAmount: 100000,
    maxAmount: 5000000,
    rate: 10,
    maxRate: 25,
    tenure: "12 – 84 Months",
    tenureMonths: 84,
    processing: "As applicable",
    badge: "Vehicle",
  },
  {
    id: "home-tata",
    company: "Tata Capital",
    initials: "TC",
    category: "Home Loan",
    name: "Home Loan",
    amount: "Property value based",
    minAmount: 500000,
    maxAmount: 10000000,
    rate: 8,
    maxRate: 15,
    tenure: "Up to 30 Years",
    tenureMonths: 360,
    processing: "As applicable",
    badge: "Home",
  },
  {
    id: "lap-aditya",
    company: "Aditya Birla Capital",
    initials: "AB",
    category: "Loan Against Property",
    name: "Loan Against Property",
    amount: "Property value based",
    minAmount: 500000,
    maxAmount: 10000000,
    rate: 10,
    maxRate: 20,
    tenure: "Up to 15 Years",
    tenureMonths: 180,
    processing: "As applicable",
    badge: "Secured",
  },
];

const categories = [
  "All",
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Vehicle Loan",
  "Loan Against Property",
];

const companies = [
  "All Companies",
  ...Array.from(new Set(loans.map((loan) => loan.company))),
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [company, setCompany] = useState("All Companies");
  const [maxRate, setMaxRate] = useState("Any");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<Loan | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);

  const filteredLoans = useMemo(() => {
    let result = loans.filter((loan) => {
      const text = `${loan.company} ${loan.name} ${loan.category}`.toLowerCase();

      const searchMatch = text.includes(search.toLowerCase());
      const categoryMatch =
        category === "All" || loan.category === category;
      const companyMatch =
        company === "All Companies" || loan.company === company;
      const rateMatch =
        maxRate === "Any" ||
        loan.rate <= Number(maxRate);

      return searchMatch && categoryMatch && companyMatch && rateMatch;
    });

    if (sort === "rate") result.sort((a, b) => a.rate - b.rate);
    if (sort === "amount") result.sort((a, b) => b.maxAmount - a.maxAmount);
    if (sort === "tenure") result.sort((a, b) => b.tenureMonths - a.tenureMonths);
    if (sort === "company")
      result.sort((a, b) => a.company.localeCompare(b.company));

    return result;
  }, [search, category, company, maxRate, sort]);

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-900">

      {/* PREMIUM HERO */}
      <section className="relative overflow-hidden bg-[#07142f]">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">

          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-blue-200">
            <span>DSA</span>
            <span>/</span>
            <span>Loan Marketplace</span>
            <span>/</span>
            <span className="text-white">Products</span>
          </div>

          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
              <Sparkles size={14} />
              Premium Lending Marketplace
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the right
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                loan product
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Compare multiple lenders and multiple loan products from one
              professional marketplace.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 max-w-4xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">
              <Search className="ml-3 shrink-0 text-slate-400" size={22} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, personal loan, business loan..."
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-semibold outline-none"
              />
              <button
                onClick={() => setMobileFilters(true)}
                className="rounded-xl bg-slate-100 p-3 lg:hidden"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["20+", "Loan Products"],
              ["10+", "Lenders"],
              ["6", "Categories"],
              ["24×7", "Digital Access"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
              >
                <p className="text-xl font-black text-white">{value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* FILTER BAR */}
        <div className="mb-7 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 text-sm font-black">
              <Filter size={17} />
              Filters
            </div>

            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none"
            >
              {companies.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="Any">Any Rate</option>
              <option value="10">Up to 10%</option>
              <option value="12">Up to 12%</option>
              <option value="15">Up to 15%</option>
              <option value="20">Up to 20%</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="rate">Lowest Rate</option>
              <option value="amount">Highest Amount</option>
              <option value="tenure">Longest Tenure</option>
              <option value="company">Company A–Z</option>
            </select>

            <div className="ml-auto text-xs font-bold text-slate-400">
              {filteredLoans.length} products found
            </div>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className="mb-7 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                  category === item
                    ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
              Marketplace
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Available loan products
            </h2>
          </div>

          <span className="hidden text-sm font-bold text-slate-400 sm:block">
            {filteredLoans.length} matches
          </span>
        </div>

        {/* PRODUCT GRID */}
        {filteredLoans.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredLoans.map((loan) => (
              <article
                key={loan.id}
                className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {loan.featured && (
                  <div className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                    Featured
                  </div>
                )}

                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-sm font-black text-white shadow-lg">
                        {loan.initials}
                      </div>

                      <div>
                        <h3 className="font-black text-slate-950">
                          {loan.company}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-slate-400">
                          {loan.category}
                        </p>
                      </div>
                    </div>

                    {loan.badge && (
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                        {loan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xl font-black tracking-tight">
                      {loan.name}
                    </h4>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <IndianRupee size={16} className="text-blue-600" />
                        <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Loan Amount
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-900">
                          {loan.amount}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <Percent size={16} className="text-emerald-600" />
                        <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Starting Rate
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-900">
                          {loan.rate}% p.a.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <Clock3 size={16} className="text-violet-600" />
                        <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Tenure
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-900">
                          {loan.tenure}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <ShieldCheck size={16} className="text-orange-500" />
                        <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Processing
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-900">
                          {loan.processing}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => setSelected(loan)}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      View Details
                    </button>

                    <Link
                      href={`/dsa/apply-loan?company=${encodeURIComponent(
                        loan.company
                      )}&product=${encodeURIComponent(loan.name)}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-xs font-black text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                    >
                      Apply Now
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <Search className="mx-auto text-slate-300" size={40} />
            <h3 className="mt-4 text-xl font-black">No products found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another company, category or search keyword.
            </p>
          </div>
        )}

        {/* TRUST STRIP */}
        <section className="mt-10 overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-7 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-200">
                <ShieldCheck size={15} />
                Transparent marketplace
              </div>
              <h3 className="mt-2 text-2xl font-black">
                Compare products before referring a customer
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Product availability, eligibility, pricing, documentation and
                final approval are determined by the applicable lender.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <Building2 size={22} />
              <div>
                <p className="text-lg font-black">{companies.length - 1}+</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  Lender Brands
                </p>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
          Rates, loan amounts, tenure, fees, eligibility and approval are
          indicative and subject to applicable lender policies and customer
          profile. This marketplace does not guarantee loan approval.
        </p>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setMobileFilters(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                  Filters
                </p>
                <h3 className="text-xl font-black">Refine products</h3>
              </div>

              <button
                onClick={() => setMobileFilters(false)}
                className="rounded-xl bg-slate-100 p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold"
              >
                {companies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold"
              >
                <option value="Any">Any Rate</option>
                <option value="10">Up to 10%</option>
                <option value="12">Up to 12%</option>
                <option value="15">Up to 15%</option>
                <option value="20">Up to 20%</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold"
              >
                <option value="featured">Featured</option>
                <option value="rate">Lowest Rate</option>
                <option value="amount">Highest Amount</option>
                <option value="tenure">Longest Tenure</option>
                <option value="company">Company A–Z</option>
              </select>

              <button
                onClick={() => setMobileFilters(false)}
                className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-black text-white"
              >
                Show {filteredLoans.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-sm font-black text-white">
                  {selected.initials}
                </div>

                <div>
                  <h3 className="font-black">{selected.company}</h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {selected.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-slate-100 p-2"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                  Loan Product
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {selected.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">
                    Loan Amount
                  </p>
                  <p className="mt-1 font-black">{selected.amount}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">
                    Interest
                  </p>
                  <p className="mt-1 font-black">
                    {selected.rate}% onwards
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">
                    Tenure
                  </p>
                  <p className="mt-1 font-black">{selected.tenure}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">
                    Processing Fee
                  </p>
                  <p className="mt-1 font-black">{selected.processing}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-800">
                Final rate, eligibility, sanctioned amount, fees,
                documentation and approval depend on the applicable lender
                policy and customer profile.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-black"
                >
                  Close
                </button>

                <Link
                  href={`/dsa/apply-loan?company=${encodeURIComponent(
                    selected.company
                  )}&product=${encodeURIComponent(selected.name)}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-black text-white"
                >
                  Apply Now
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



