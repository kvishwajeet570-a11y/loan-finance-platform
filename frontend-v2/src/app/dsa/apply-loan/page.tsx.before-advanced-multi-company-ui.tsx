"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LoanOffer = {
  company: string;
  logo: string;
  type: string;
  category: string;
  amount: string;
  rate: string;
  fee: string;
  tenure: string;
  badge?: string;
  tags: string[];
};

const offers: LoanOffer[] = [
  {
    company: "Poonawalla Fincorp",
    logo: "P",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "11.8% p.a.",
    fee: "1% - 1.2% + GST",
    tenure: "3 Years",
    badge: "HIGH DISBURSEMENT",
    tags: ["Quick Approval", "Minimal Documents", "Fast Process"],
  },
  {
    company: "Aditya Birla Capital",
    logo: "AB",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.25% p.a.",
    fee: "1.2% - 1.4% + GST",
    tenure: "4 Years",
    badge: "POPULAR",
    tags: ["Flexible Tenure", "Easy Process", "Quick Approval"],
  },
  {
    company: "Bajaj Finance",
    logo: "B",
    type: "Personal & Business Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.99% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "3 Years",
    badge: "RECOMMENDED",
    tags: ["Quick Processing", "Minimal Documents", "Trusted Brand"],
  },
  {
    company: "Tata Capital",
    logo: "T",
    type: "Personal & Business Loan",
    category: "Business Loan",
    amount: "₹10,00,000",
    rate: "12.5% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "4 Years",
    badge: "TRUSTED",
    tags: ["Easy Approval", "Flexible Tenure", "Low Interest"],
  },
  {
    company: "Hero FinCorp",
    logo: "H",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.4% p.a.",
    fee: "1.2% - 1.5% + GST",
    tenure: "2 Years",
    badge: "FAST",
    tags: ["Minimal Documents", "Instant Disbursement", "Easy Process"],
  },
  {
    company: "Muthoot Finance",
    logo: "M",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "13% p.a.",
    fee: "1.2% - 1.5% + GST",
    tenure: "5 Years",
    badge: "TRUSTED",
    tags: ["Trusted Brand", "Flexible Tenure", "High Disbursement"],
  },
  {
    company: "Shriram Finance",
    logo: "S",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "5 Years",
    badge: "POPULAR",
    tags: ["High Disbursement", "Low Interest", "Easy Process"],
  },
  {
    company: "Mahindra Finance",
    logo: "MF",
    type: "Business Loan",
    category: "Business Loan",
    amount: "₹15,00,000",
    rate: "12.5% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "4 Years",
    badge: "FLEXIBLE",
    tags: ["Flexible Tenure", "Minimal Documents", "Quick Approval"],
  },
  {
    company: "L&T Finance",
    logo: "L&T",
    type: "Personal & Business Loan",
    category: "Business Loan",
    amount: "₹10,00,000",
    rate: "12.5% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "4 Years",
    badge: "RELIABLE",
    tags: ["Trusted Partner", "Quick Processing", "Easy Approval"],
  },
  {
    company: "Cholamandalam Finance",
    logo: "C",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.5% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "5 Years",
    badge: "GREAT VALUE",
    tags: ["Fast Approval", "Low Interest", "Minimal Documents"],
  },
  {
    company: "Fibe",
    logo: "F",
    type: "Instant Personal Loan",
    category: "Instant Loan",
    amount: "₹5,00,000",
    rate: "12.33% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "2 Years",
    badge: "INSTANT",
    tags: ["Instant Approval", "Digital Process", "Quick Disbursement"],
  },
  {
    company: "Moneyview",
    logo: "MV",
    type: "Instant Personal Loan",
    category: "Instant Loan",
    amount: "₹5,00,000",
    rate: "12.33% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "2 Years",
    badge: "FAST",
    tags: ["Digital KYC", "Quick Approval", "Easy Process"],
  },
  {
    company: "Unity Small Finance Bank",
    logo: "U",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹5,00,000",
    rate: "13% p.a.",
    fee: "1.3% - 1.5% + GST",
    tenure: "5 Years",
    badge: "BANK",
    tags: ["Bank Loan", "Flexible Tenure", "Online Process"],
  },
  {
    company: "Bharat Loan",
    logo: "BL",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹1,00,000",
    rate: "12% p.a.",
    fee: "1.2% + GST",
    tenure: "5 Years",
    badge: "POPULAR",
    tags: ["Easy Process", "Quick Approval", "Minimal Documents"],
  },
  {
    company: "SmartCoin",
    logo: "SC",
    type: "Instant Personal Loan",
    category: "Instant Loan",
    amount: "₹1,00,000",
    rate: "12% p.a.",
    fee: "1.2% + GST",
    tenure: "5 Years",
    badge: "INSTANT",
    tags: ["Fast Approval", "Digital Process", "Quick Disbursement"],
  },
  {
    company: "PayRupik",
    logo: "PR",
    type: "Personal Loan",
    category: "Personal Loan",
    amount: "₹30,00,000",
    rate: "11% p.a.",
    fee: "1% - 1.5% + GST",
    tenure: "7 Years",
    badge: "HIGH LIMIT",
    tags: ["High Loan Amount", "Flexible Tenure", "Quick Process"],
  },
];

const categories = [
  "All Loans",
  "Instant Loan",
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Vehicle Loan",
  "Credit Card",
];

export default function ApplyLoanPage() {
  const router = useRouter();

  const [category, setCategory] = useState("All Loans");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recommended");
  const [compare, setCompare] = useState<string[]>([]);

  const filteredOffers = useMemo(() => {
    let data = offers.filter((item) => {
      const matchesCategory =
        category === "All Loans" || item.category === category;

      const matchesSearch =
        item.company.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "Loan Amount") {
      data = [...data].sort(
        (a, b) =>
          Number(b.amount.replace(/[₹,]/g, "")) -
          Number(a.amount.replace(/[₹,]/g, ""))
      );
    }

    if (sort === "Company") {
      data = [...data].sort((a, b) =>
        a.company.localeCompare(b.company)
      );
    }

    return data;
  }, [category, search, sort]);

  const applyNow = (company: string, loanType: string) => {
    router.push(
      `/dsa/apply-loan?company=${encodeURIComponent(
        company
      )}&loan=${encodeURIComponent(loanType)}`
    );
  };

  const toggleCompare = (company: string) => {
    setCompare((current) =>
      current.includes(company)
        ? current.filter((x) => x !== company)
        : [...current, company]
    );
  };

  return (
    <main className="min-h-screen bg-[#f6f9ff] text-[#101828]">

      {/* TOP BRAND BAR */}
      <div className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <div className="text-[12px] font-bold tracking-[0.25em] text-blue-600">
              LOAN PARTNERS
            </div>
            <div className="mt-1 text-xl font-black">
              India Loan Finance
            </div>
            <div className="text-xs text-gray-500">
              Compare multiple loan partners in one place
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              ✓ Multiple Loan Partners
            </div>
            <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              ✓ Easy Application
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#eff7ff] via-white to-[#eef2ff]">
        <div className="mx-auto max-w-[1450px] px-5 py-10 lg:px-8 lg:py-14">

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-blue-200 bg-white px-5 py-2 text-xs font-black tracking-[0.18em] text-blue-600 shadow-sm">
              AVAILABLE LOAN OFFERS
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Find the Right{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Loan Offer
              </span>{" "}
              for You
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Compare multiple companies, loan amounts, interest rates,
              processing fees and repayment tenures from one simple dashboard.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-xl md:flex-row">
            <div className="flex flex-1 items-center rounded-xl bg-gray-50 px-4">
              <span className="mr-3 text-xl">⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lender or loan type..."
                className="w-full bg-transparent py-3 text-sm font-medium outline-none"
              />
            </div>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Loans");
              }}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              View All Offers
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1450px] gap-2 overflow-x-auto px-5 py-4 lg:px-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-xl px-5 py-3 text-sm font-bold transition ${
                category === item
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[1450px] px-5 py-8 lg:px-8">

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-black tracking-[0.18em] text-blue-600">
              LOAN MARKETPLACE
            </div>

            <h2 className="mt-1 text-2xl font-black md:text-3xl">
              {filteredOffers.length} Loan Offers Available
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Compare lenders and select the loan according to your requirement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {compare.length > 0 && (
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                {compare.length} Selected
              </div>
            )}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none"
            >
              <option>Recommended</option>
              <option>Loan Amount</option>
              <option>Company</option>
            </select>
          </div>
        </div>

        {/* OFFER LIST */}
        <div className="space-y-5">

          {filteredOffers.map((offer) => (
            <article
              key={offer.company}
              className="group overflow-hidden rounded-2xl border border-[#dfe7f3] bg-white shadow-[0_8px_30px_rgba(31,56,100,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,0.13)]"
            >

              {/* CARD HEADER */}
              <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center">

                {/* COMPANY */}
                <div className="flex min-w-[300px] flex-1 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 text-xl font-black text-blue-700 shadow-sm">
                    {offer.logo}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#101828]">
                      {offer.company}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {offer.type}
                    </p>

                    {offer.badge && (
                      <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black tracking-wide text-blue-700">
                        ⚡ {offer.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* OFFER TAGS */}
                <div className="flex flex-1 flex-wrap gap-2">
                  {offer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>

                {/* ACTION */}
                <div className="flex items-center gap-3 lg:flex-col">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-gray-500">
                    <input
                      type="checkbox"
                      checked={compare.includes(offer.company)}
                      onChange={() => toggleCompare(offer.company)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    Compare
                  </label>

                  <button
                    onClick={() => applyNow(offer.company, offer.type)}
                    className="min-w-[145px] rounded-xl bg-gradient-to-r from-[#08a9f5] to-[#3034d9] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>

              {/* DETAILS */}
              <div className="border-t border-gray-100 bg-[#fbfdff] px-6 py-5">

                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Loan Amount
                    </div>
                    <div className="mt-1 text-sm font-black">
                      upto {offer.amount}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Interest Rate
                    </div>
                    <div className="mt-1 text-sm font-black">
                      Starting from {offer.rate}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Processing Fee
                    </div>
                    <div className="mt-1 text-sm font-black">
                      {offer.fee}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Tenure
                    </div>
                    <div className="mt-1 text-sm font-black">
                      {offer.tenure}
                    </div>
                  </div>

                </div>

                <div className="mt-5 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 md:flex-row md:items-center">
                  <p className="text-sm italic text-gray-500">
                    View your loan eligibility quickly — just a few simple
                    fields required!
                  </p>

                  <button
                    onClick={() => applyNow(offer.company, offer.type)}
                    className="text-sm font-black text-blue-600 hover:text-indigo-600"
                  >
                    Detailed Offers ↓
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredOffers.length === 0 && (
            <div className="rounded-3xl border border-dashed border-blue-200 bg-white py-20 text-center">
              <div className="text-5xl">🔎</div>
              <h3 className="mt-4 text-xl font-black">
                No loan offers found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try another lender name or loan category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Loans");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1450px] px-5 pb-10 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-7 text-white shadow-2xl md:p-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>
              <div className="text-sm font-black tracking-[0.18em] text-blue-100">
                INDIA LOAN FINANCE
              </div>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Find Your Suitable Loan Offer Today!
              </h2>

              <p className="mt-2 text-sm text-blue-100">
                Compare multiple lenders and choose the loan according to
                your requirement.
              </p>
            </div>

            <button
              onClick={() => {
                setCategory("All Loans");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-2xl bg-white px-8 py-4 font-black text-blue-700 shadow-xl transition hover:scale-105"
            >
              Explore All Loans →
            </button>

          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-[1450px] grid-cols-2 gap-5 px-5 py-7 md:grid-cols-4 lg:px-8">

          <div className="text-center">
            <div className="text-2xl">🛡️</div>
            <div className="mt-2 text-sm font-black">Secure Process</div>
            <div className="text-xs text-gray-500">Your data is protected</div>
          </div>

          <div className="text-center">
            <div className="text-2xl">🏦</div>
            <div className="mt-2 text-sm font-black">Multiple Lenders</div>
            <div className="text-xs text-gray-500">Compare available offers</div>
          </div>

          <div className="text-center">
            <div className="text-2xl">⚡</div>
            <div className="mt-2 text-sm font-black">Quick Process</div>
            <div className="text-xs text-gray-500">Simple online application</div>
          </div>

          <div className="text-center">
            <div className="text-2xl">📄</div>
            <div className="mt-2 text-sm font-black">Easy Application</div>
            <div className="text-xs text-gray-500">Minimal required details</div>
          </div>

        </div>
      </section>

    </main>
  );
}
