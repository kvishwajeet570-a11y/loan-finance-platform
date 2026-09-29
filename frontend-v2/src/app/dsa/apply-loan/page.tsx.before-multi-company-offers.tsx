"use client";

import { useState } from "react";

type Company = {
  name: string;
  short: string;
  category: string;
  website: string;
};

const companies: Company[] = [
  {
    name: "Poonawalla Fincorp",
    short: "P",
    category: "Personal Loan",
    website: "https://poonawallafincorp.com/",
  },
  {
    name: "Bajaj Finance",
    short: "B",
    category: "Personal & Business Loan",
    website: "https://www.bajajfinserv.in/",
  },
  {
    name: "Tata Capital",
    short: "T",
    category: "Personal & Business Loan",
    website: "https://www.tatacapital.com/",
  },
  {
    name: "Aditya Birla Capital",
    short: "AB",
    category: "Personal Loan",
    website: "https://www.adityabirlacapital.com/",
  },
  {
    name: "L&T Finance",
    short: "L&T",
    category: "Personal & Business Loan",
    website: "https://www.ltfinance.com/",
  },
  {
    name: "Cholamandalam Finance",
    short: "C",
    category: "Personal Loan",
    website: "https://www.cholamandalam.com/",
  },
  {
    name: "Hero FinCorp",
    short: "H",
    category: "Personal Loan",
    website: "https://www.herofincorp.com/",
  },
  {
    name: "Muthoot Finance",
    short: "M",
    category: "Personal Loan",
    website: "https://www.muthootfinance.com/",
  },
  {
    name: "Mahindra Finance",
    short: "MF",
    category: "Personal & Vehicle Loan",
    website: "https://www.mahindrafinance.com/",
  },
  {
    name: "Shriram Finance",
    short: "S",
    category: "Personal & Business Loan",
    website: "https://www.shriramfinance.in/",
  },
  {
    name: "Moneyview",
    short: "MV",
    category: "Digital Personal Loan",
    website: "https://moneyview.in/",
  },
  {
    name: "Unity Small Finance Bank",
    short: "U",
    category: "Personal Loan",
    website: "https://unitybank.co.in/",
  },
  {
    name: "PREF",
    short: "P",
    category: "Personal Loan",
    website: "https://pref.in/",
  },
  {
    name: "KreditBee",
    short: "KB",
    category: "Digital Personal Loan",
    website: "https://www.kreditbee.in/",
  },
  {
    name: "Fibe",
    short: "F",
    category: "Digital Personal Loan",
    website: "https://www.fibe.in/",
  },
  {
    name: "CASHe",
    short: "C",
    category: "Digital Personal Loan",
    website: "https://www.cashe.co.in/",
  },
];

export default function ApplyLoanPage() {
  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter((company) =>
    `${company.name} ${company.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-black text-white shadow-lg">
              IL
            </div>

            <div>
              <h1 className="text-lg font-black text-slate-900">
                India Loan Finance
              </h1>
              <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400">
                YOUR GROWTH OUR SUPPORT
              </p>
            </div>
          </div>

          <div className="hidden rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700 sm:block">
            ✓ Secure Application
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-400/10" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black tracking-wider text-white">
              ● LOAN PARTNER NETWORK
            </div>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Choose Your
              <span className="block text-cyan-300">
                Loan Company
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Select a lender from our partner network to continue with the
              applicable loan process.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-9 max-w-2xl">
            <div className="flex items-center rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-xl">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search loan company..."
                className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-blue-200"
              />

              <div className="rounded-xl bg-white px-5 py-3 text-sm font-black text-blue-700">
                {filteredCompanies.length} Companies
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY LIST */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">

        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Available Partners
            </p>

            <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Select a Loan Company
            </h3>
          </div>

          <p className="hidden text-sm font-medium text-slate-500 sm:block">
            {filteredCompanies.length} lenders available
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredCompanies.map((company) => (
            <div
              key={company.name}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-lg font-black text-blue-700">
                    {company.short}
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-black text-green-700">
                    AVAILABLE
                  </span>
                </div>

                <h4 className="mt-5 min-h-[48px] text-lg font-black text-slate-900">
                  {company.name}
                </h4>

                <p className="mt-1 min-h-[20px] text-xs font-medium text-slate-500">
                  {company.category}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      Status
                    </p>
                    <p className="mt-1 text-xs font-black text-green-600">
                      Active
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      Process
                    </p>
                    <p className="mt-1 text-xs font-black text-slate-700">
                      Online
                    </p>
                  </div>
                </div>

                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-800"
                >
                  Apply with {company.name}
                  <span>→</span>
                </a>

              </div>
            </div>
          ))}

        </div>

        {filteredCompanies.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="text-4xl">🔎</div>
            <h4 className="mt-4 text-lg font-black text-slate-900">
              No company found
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Try another company name.
            </p>
          </div>
        )}

        {/* DISCLAIMER */}
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-amber-800">
            Loan eligibility, interest rate, loan amount, tenure, processing
            fee, documents and final approval are subject to the respective
            lender's policies and customer profile.
          </p>
        </div>

      </section>
    </main>
  );
}
