"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LoanOffer = {
  company: string;
  short: string;
  loanType: string;
  amount: string;
  rate: string;
  fee: string;
  tenure: string;
  category: string;
  featured?: boolean;
  website?: string;
};

const offers: LoanOffer[] = [
  {
    company: "Poonawalla Fincorp",
    short: "P",
    loanType: "Personal Loan",
    amount: "₹5,00,000",
    rate: "11.8%",
    fee: "1% to 1.2% + GST",
    tenure: "3 Years",
    category: "Personal",
    featured: true,
  },
  {
    company: "Aditya Birla Capital",
    short: "AB",
    loanType: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.25%",
    fee: "1.2% to 1.4% + GST",
    tenure: "4 Years",
    category: "Personal",
    featured: true,
  },
  {
    company: "Bajaj Finance",
    short: "B",
    loanType: "Personal & Business Loan",
    amount: "₹15,00,000",
    rate: "11%",
    fee: "Up to 2% + GST",
    tenure: "5 Years",
    category: "Personal",
    featured: true,
  },
  {
    company: "Tata Capital",
    short: "T",
    loanType: "Personal & Business Loan",
    amount: "₹20,00,000",
    rate: "10.99%",
    fee: "Up to 2% + GST",
    tenure: "6 Years",
    category: "Business",
  },
  {
    company: "L&T Finance",
    short: "L&T",
    loanType: "Personal Loan",
    amount: "₹10,00,000",
    rate: "12%",
    fee: "1% to 2% + GST",
    tenure: "5 Years",
    category: "Personal",
  },
  {
    company: "Cholamandalam Finance",
    short: "C",
    loanType: "Personal Loan",
    amount: "₹10,00,000",
    rate: "12.5%",
    fee: "1.5% + GST",
    tenure: "5 Years",
    category: "Personal",
  },
  {
    company: "Hero FinCorp",
    short: "H",
    loanType: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.4%",
    fee: "1.2% to 1.5% + GST",
    tenure: "2 Years",
    category: "Personal",
  },
  {
    company: "Muthoot Finance",
    short: "M",
    loanType: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.5%",
    fee: "1.5% + GST",
    tenure: "5 Years",
    category: "Personal",
  },
  {
    company: "Mahindra Finance",
    short: "MF",
    loanType: "Vehicle Loan",
    amount: "₹25,00,000",
    rate: "10.5%",
    fee: "As applicable + GST",
    tenure: "7 Years",
    category: "Vehicle",
  },
  {
    company: "Shriram Finance",
    short: "S",
    loanType: "Business Loan",
    amount: "₹30,00,000",
    rate: "11.5%",
    fee: "As applicable + GST",
    tenure: "7 Years",
    category: "Business",
  },
  {
    company: "Bharat Loan",
    short: "BL",
    loanType: "Personal Loan",
    amount: "₹1,00,000",
    rate: "12%",
    fee: "1.2% + GST",
    tenure: "60 Months",
    category: "Personal",
  },
  {
    company: "SmartCoin",
    short: "SC",
    loanType: "Instant Personal Loan",
    amount: "₹1,00,000",
    rate: "12%",
    fee: "1.2% + GST",
    tenure: "60 Months",
    category: "Instant",
  },
  {
    company: "PayRupik",
    short: "PR",
    loanType: "Personal Loan",
    amount: "₹30,00,000",
    rate: "11%",
    fee: "1% to 1.5% + GST",
    tenure: "7 Years",
    category: "Personal",
  },
  {
    company: "Fibe",
    short: "F",
    loanType: "Instant Personal Loan",
    amount: "₹5,00,000",
    rate: "12.5%",
    fee: "As applicable + GST",
    tenure: "5 Years",
    category: "Instant",
  },
];

export default function AdvancedLoanOffers() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        offer.company.toLowerCase().includes(search.toLowerCase()) ||
        offer.loanType.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || offer.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const applyLoan = (offer: LoanOffer) => {
    router.push(
      `/dsa/apply-loan?company=${encodeURIComponent(
        offer.company
      )}&lender=${encodeURIComponent(
        offer.company
      )}&loanType=${encodeURIComponent(offer.loanType)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#101828]">
      <style jsx>{`
        .offer-card {
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .offer-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
          border-color: rgba(37, 99, 235, 0.25);
        }

        .apply-btn {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
        }
      `}</style>

      {/* TOP BRAND BAR */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">
              Loan Partners
            </div>
            <div className="text-lg font-black text-slate-900">
              India Loan Finance
            </div>
          </div>

          <div className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 md:block">
            Multiple loan partners available
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-[1180px] px-5 pb-7 pt-12">
        <div className="text-center">
          <div className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-blue-600">
            Available Loan Offers
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Find the Right{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Loan Partner
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Compare multiple loan companies, loan types, rates, processing fees
            and tenures in one place.
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company or loan type..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {["All", "Personal", "Business", "Vehicle", "Instant"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-xl px-5 py-3 text-sm font-bold transition ${
                      category === item
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <main className="mx-auto max-w-[1180px] space-y-5 px-5 pb-20">
        {filteredOffers.map((offer) => {
          const isExpanded = expanded === offer.company;

          return (
            <article
              key={`${offer.company}-${offer.loanType}`}
              className="offer-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.05)]"
            >
              {/* MAIN HORIZONTAL HEADER */}
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                  {/* COMPANY */}
                  <div className="flex min-w-[275px] flex-1 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-black text-blue-700 shadow-sm">
                      {offer.short}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900">
                          {offer.company}
                        </h2>

                        {offer.featured && (
                          <span className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm">
                            ⚡ Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {offer.loanType}
                      </p>
                    </div>
                  </div>

                  {/* BADGE */}
                  <div className="flex justify-start xl:justify-center">
                    <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-blue-200">
                      ⚡ High Disbursement
                    </div>
                  </div>

                  {/* APPLY */}
                  <div className="xl:min-w-[150px]">
                    <button
                      onClick={() => applyLoan(offer)}
                      className="apply-btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-200"
                    >
                      Apply Now
                      <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="my-5 h-px bg-slate-100" />

                {/* DETAILS */}
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Loan Amount
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      upto {offer.amount}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Interest Rate
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      Starting from {offer.rate}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Processing Fee
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {offer.fee}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Tenure
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {offer.tenure}
                    </div>
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm italic text-slate-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 not-italic">
                      ✓
                    </span>
                    Quick eligibility check with simple details
                  </div>

                  <button
                    onClick={() =>
                      setExpanded(isExpanded ? null : offer.company)
                    }
                    className="font-bold text-blue-600 transition hover:text-indigo-700"
                  >
                    {isExpanded ? "Hide Details ↑" : "Detailed Offers ↓"}
                  </button>
                </div>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div className="mt-4 grid gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-4">
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        Loan Category
                      </div>
                      <div className="mt-1 font-black text-slate-800">
                        {offer.category} Loan
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        Application Process
                      </div>
                      <div className="mt-1 font-black text-emerald-600">
                        Online
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        Partner Status
                      </div>
                      <div className="mt-1 font-black text-emerald-600">
                        ● Available
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {filteredOffers.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="text-4xl">🔎</div>
            <h3 className="mt-4 text-xl font-black">No loan partner found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another company or loan category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
