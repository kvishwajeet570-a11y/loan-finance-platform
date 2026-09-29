"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  Building2,
  BriefcaseBusiness,
  Home,
  Car,
  Bike,
  Landmark,
  Coins,
  Stethoscope,
  GraduationCap,
  X,
  CheckCircle2,
} from "lucide-react";

type LoanProduct = {
  id: string;
  company: string;
  logo: string;
  category: string;
  name: string;
  amount: string;
  rate: string;
  tenure: string;
  processing: string;
  tags: string[];
  featured?: boolean;
};

const products: LoanProduct[] = [
  {
    id: "axis-personal",
    company: "Axis Finance",
    logo: "AX",
    category: "Personal Loan",
    name: "Digital Personal Loan",
    amount: "Up to ₹40 Lakh",
    rate: "From 11.25% p.a.",
    tenure: "12–84 Months",
    processing: "Up to 2%",
    tags: ["Unsecured", "Digital", "Fast Processing"],
    featured: true,
  },
  {
    id: "axis-business",
    company: "Axis Finance",
    logo: "AX",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹1 Crore",
    rate: "From 12% p.a.",
    tenure: "12–84 Months",
    processing: "As applicable",
    tags: ["Business", "Unsecured", "Flexible"],
  },
  {
    id: "axis-home",
    company: "Axis Finance",
    logo: "AX",
    category: "Home Loan",
    name: "Home Loan",
    amount: "Up to ₹5 Crore",
    rate: "Competitive",
    tenure: "Up to 30 Years",
    processing: "As applicable",
    tags: ["Home", "Long Tenure", "Top-up"],
  },
  {
    id: "axis-lap",
    company: "Axis Finance",
    logo: "AX",
    category: "Loan Against Property",
    name: "Loan Against Property",
    amount: "Up to ₹10 Crore",
    rate: "Competitive",
    tenure: "Up to 20 Years",
    processing: "As applicable",
    tags: ["Secured", "Property", "Business"],
  },

  {
    id: "lt-personal",
    company: "L&T Finance",
    logo: "L&T",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹30 Lakh",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Digital", "Personal", "Quick"],
    featured: true,
  },
  {
    id: "lt-home",
    company: "L&T Finance",
    logo: "L&T",
    category: "Home Loan",
    name: "Home Loan",
    amount: "Up to ₹10 Crore",
    rate: "As per profile",
    tenure: "Up to 30 Years",
    processing: "As applicable",
    tags: ["Home", "High Amount", "Quick"],
  },
  {
    id: "lt-lap",
    company: "L&T Finance",
    logo: "L&T",
    category: "Loan Against Property",
    name: "LAP",
    amount: "Up to ₹7.5 Crore",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Property", "Business", "Top-up"],
  },
  {
    id: "lt-two-wheeler",
    company: "L&T Finance",
    logo: "L&T",
    category: "Two Wheeler Loan",
    name: "Two Wheeler Finance",
    amount: "As per vehicle",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Bike", "Vehicle", "Fast"],
  },
  {
    id: "lt-doctor",
    company: "L&T Finance",
    logo: "L&T",
    category: "Professional Loan",
    name: "Doctor Loan",
    amount: "Up to ₹1 Crore",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Doctor", "Professional", "Business"],
  },
  {
    id: "lt-micro",
    company: "L&T Finance",
    logo: "L&T",
    category: "Micro Loan",
    name: "Micro Enterprise Loan",
    amount: "As per eligibility",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Micro", "Business", "Entrepreneur"],
  },

  {
    id: "shriram-personal",
    company: "Shriram Finance",
    logo: "SF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "As per eligibility",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Personal", "Digital", "Flexible"],
  },
  {
    id: "shriram-car",
    company: "Shriram Finance",
    logo: "SF",
    category: "Car Loan",
    name: "Car Finance",
    amount: "As per vehicle",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Car", "Vehicle", "Finance"],
  },
  {
    id: "shriram-bike",
    company: "Shriram Finance",
    logo: "SF",
    category: "Two Wheeler Loan",
    name: "Two Wheeler Loan",
    amount: "As per vehicle",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Bike", "Vehicle", "Quick"],
  },
  {
    id: "shriram-gold",
    company: "Shriram Finance",
    logo: "SF",
    category: "Gold Loan",
    name: "Gold Loan",
    amount: "As per gold value",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Gold", "Secured", "Flexible"],
  },
  {
    id: "shriram-business",
    company: "Shriram Finance",
    logo: "SF",
    category: "Business Loan",
    name: "Small Business Loan",
    amount: "As per eligibility",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["MSME", "Business", "Flexible"],
  },

  {
    id: "tata-personal",
    company: "Tata Capital",
    logo: "TC",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹35 Lakh",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Personal", "Digital", "Flexible"],
  },
  {
    id: "tata-business",
    company: "Tata Capital",
    logo: "TC",
    category: "Business Loan",
    name: "Business Loan",
    amount: "As per eligibility",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["MSME", "Business", "Growth"],
  },
  {
    id: "tata-home",
    company: "Tata Capital",
    logo: "TC",
    category: "Home Loan",
    name: "Home Loan",
    amount: "As per eligibility",
    rate: "As per profile",
    tenure: "Up to 30 Years",
    processing: "As applicable",
    tags: ["Home", "Property", "Long Tenure"],
  },

  {
    id: "poonawalla-personal",
    company: "Poonawalla Fincorp",
    logo: "PF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹50 Lakh",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Personal", "Digital", "Fast"],
    featured: true,
  },
  {
    id: "poonawalla-business",
    company: "Poonawalla Fincorp",
    logo: "PF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹75 Lakh",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Business", "MSME", "Growth"],
  },

  {
    id: "bajaj-personal",
    company: "Bajaj Finance",
    logo: "BF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "Up to ₹55 Lakh",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Personal", "Digital", "Fast"],
  },
  {
    id: "bajaj-business",
    company: "Bajaj Finance",
    logo: "BF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "Up to ₹80 Lakh",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Business", "MSME", "Growth"],
  },

  {
    id: "hero-personal",
    company: "Hero FinCorp",
    logo: "HF",
    category: "Personal Loan",
    name: "Personal Loan",
    amount: "As per eligibility",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Personal", "Flexible", "Quick"],
  },
  {
    id: "hero-two-wheeler",
    company: "Hero FinCorp",
    logo: "HF",
    category: "Two Wheeler Loan",
    name: "Two Wheeler Loan",
    amount: "As per vehicle",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Bike", "Vehicle", "Fast"],
  },

  {
    id: "muthoot-gold",
    company: "Muthoot Finance",
    logo: "MF",
    category: "Gold Loan",
    name: "Gold Loan",
    amount: "As per gold value",
    rate: "As per scheme",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Gold", "Secured", "Flexible"],
  },
  {
    id: "muthoot-business",
    company: "Muthoot Finance",
    logo: "MF",
    category: "Business Loan",
    name: "Business Loan",
    amount: "As per eligibility",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Business", "MSME", "Flexible"],
  },

  {
    id: "mahindra-car",
    company: "Mahindra Finance",
    logo: "M",
    category: "Car Loan",
    name: "Car Finance",
    amount: "As per vehicle",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Car", "Vehicle", "Finance"],
  },
  {
    id: "mahindra-tractor",
    company: "Mahindra Finance",
    logo: "M",
    category: "Tractor Loan",
    name: "Tractor Finance",
    amount: "As per vehicle",
    rate: "As per profile",
    tenure: "Flexible",
    processing: "As applicable",
    tags: ["Tractor", "Agri", "Rural"],
  },
];

const categories = [
  "All Products",
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Loan Against Property",
  "Car Loan",
  "Two Wheeler Loan",
  "Gold Loan",
  "Professional Loan",
  "Micro Loan",
  "Tractor Loan",
];

const companies = [
  "All Companies",
  "Axis Finance",
  "L&T Finance",
  "Shriram Finance",
  "Tata Capital",
  "Poonawalla Fincorp",
  "Bajaj Finance",
  "Hero FinCorp",
  "Muthoot Finance",
  "Mahindra Finance",
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [company, setCompany] = useState("All Companies");
  const [sort, setSort] = useState("Recommended");
  const [selected, setSelected] = useState<LoanProduct | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const q = search.toLowerCase().trim();

      const matchesSearch =
        !q ||
        p.company.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory =
        category === "All Products" || p.category === category;

      const matchesCompany =
        company === "All Companies" || p.company === company;

      return matchesSearch && matchesCategory && matchesCompany;
    });

    if (sort === "Company") {
      list = [...list].sort((a, b) => a.company.localeCompare(b.company));
    }

    if (sort === "Product") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [search, category, company, sort]);

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* PREMIUM HEADER */}
      <section className="relative overflow-hidden bg-[#07122e] text-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-8">

          <div className="flex items-center justify-between">
            <Link
              href="/dsa/dashboard"
              className="text-sm font-bold text-blue-200 hover:text-white"
            >
              ← DSA Dashboard
            </Link>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-blue-100">
              LIVE PRODUCT NETWORK
            </div>
          </div>

          <div className="mt-10 max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-200">
              <Zap size={14} />
              Multi-Lender Marketplace
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Find the right loan product
              <span className="block text-cyan-300">
                from multiple lenders
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Compare loan categories, lenders, indicative amounts, tenure
              and product features from one dashboard.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 flex max-w-4xl items-center gap-3 rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">
            <Search className="ml-3 text-slate-400" size={22} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lender, loan type, business loan, gold loan..."
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-semibold text-slate-900 outline-none"
            />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl bg-[#07122e] px-4 py-3 text-sm font-bold text-white"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4 lg:px-8">

          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                  category === item
                    ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

        </div>

        {showFilters && (
          <div className="border-t border-slate-100 bg-slate-50">
            <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-5 py-4 lg:px-8">

              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none"
              >
                {companies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none"
              >
                <option>Recommended</option>
                <option>Company</option>
                <option>Product</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Products");
                  setCompany("All Companies");
                  setSort("Recommended");
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

          <Stat
            icon={<Building2 size={19} />}
            value={`${new Set(products.map((p) => p.company)).size}+`}
            label="Lenders"
          />

          <Stat
            icon={<Coins size={19} />}
            value={`${products.length}+`}
            label="Loan Products"
          />

          <Stat
            icon={<ShieldCheck size={19} />}
            value="Multiple"
            label="Loan Categories"
          />

          <Stat
            icon={<Zap size={19} />}
            value="24×7"
            label="Digital Access"
          />

        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Available Products
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {filtered.length} loan products
            </h2>
          </div>

          <p className="hidden text-xs font-semibold text-slate-500 sm:block">
            Eligibility and final approval depend on lender policy.
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <Search className="mx-auto text-slate-300" size={42} />
            <h3 className="mt-4 text-lg font-black">No products found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another lender, category or search keyword.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filtered.map((product) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                {product.featured && (
                  <div className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                    Featured
                  </div>
                )}

                <div className="p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-500 text-sm font-black text-white shadow-lg">
                      {product.logo}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-blue-600">
                        {product.company}
                      </p>

                      <h3 className="mt-1 text-lg font-black leading-tight text-slate-950">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {product.category}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <Metric
                      label="Loan Amount"
                      value={product.amount}
                    />

                    <Metric
                      label="Interest"
                      value={product.rate}
                    />

                    <Metric
                      label="Tenure"
                      value={product.tenure}
                    />

                    <Metric
                      label="Processing"
                      value={product.processing}
                    />

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() => setSelected(product)}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      View Details
                    </button>

                    <Link
                      href={`/dsa/leads?product=${encodeURIComponent(product.id)}&company=${encodeURIComponent(product.company)}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                    >
                      Apply / Refer
                      <ArrowRight size={16} />
                    </Link>

                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-amber-600" size={20} />

            <div>
              <p className="text-sm font-black text-amber-900">
                Important information
              </p>

              <p className="mt-1 text-xs leading-6 text-amber-800">
                Product information shown here is indicative and should be
                verified against the applicable lender's current terms,
                eligibility criteria, interest rate, fees and documentation
                requirements before customer submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 p-5 backdrop-blur">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-cyan-500 text-xs font-black text-white">
                  {selected.logo}
                </div>

                <div>
                  <p className="text-xs font-bold text-blue-600">
                    {selected.company}
                  </p>

                  <h2 className="font-black text-slate-950">
                    {selected.name}
                  </h2>
                </div>

              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="rounded-2xl bg-slate-950 p-5 text-white">

                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Product Overview
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {selected.name}
                </h3>

                <p className="mt-1 text-sm text-slate-300">
                  {selected.company}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <Metric label="Loan Amount" value={selected.amount} />
                <Metric label="Interest" value={selected.rate} />
                <Metric label="Tenure" value={selected.tenure} />
                <Metric label="Processing Fee" value={selected.processing} />

              </div>

              <div>
                <p className="mb-3 text-sm font-black text-slate-900">
                  Product Highlights
                </p>

                <div className="space-y-2">
                  {selected.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700"
                    >
                      <CheckCircle2 size={17} className="text-green-500" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs leading-6 text-blue-800">
                  Final loan amount, interest rate, tenure, processing fee,
                  eligibility and approval are determined by the applicable
                  lender after assessment of the customer's profile and
                  documents.
                </p>
              </div>

              <Link
                href={`/dsa/leads?product=${encodeURIComponent(selected.id)}&company=${encodeURIComponent(selected.company)}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800"
              >
                Apply / Refer Customer
                <ArrowRight size={18} />
              </Link>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <p className="text-lg font-black text-slate-950">{value}</p>
          <p className="text-[11px] font-bold text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-black leading-5 text-slate-900">
        {value}
      </p>
    </div>
  );
}
