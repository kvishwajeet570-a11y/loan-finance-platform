"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  FileText,
  Download,
  CalendarDays,
  ArrowUpRight,
  Wallet,
  Target,
  Clock3,
  Search,
  RefreshCw,
  ChevronDown,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  CircleDashed,
  ShieldCheck,
} from "lucide-react";

const metrics = [
  { label: "Total Applications", value: "—", note: "Live data not connected", icon: FileText, color: "blue" },
  { label: "Approved Loans", value: "—", note: "Live data not connected", icon: CheckCircle2, color: "green" },
  { label: "Disbursed Amount", value: "—", note: "Live data not connected", icon: IndianRupee, color: "violet" },
  { label: "Commission Earned", value: "—", note: "Live data not connected", icon: Wallet, color: "amber" },
];

const statusRows = [
  { label: "Approved", color: "bg-emerald-500" },
  { label: "Pending", color: "bg-amber-400" },
  { label: "Rejected", color: "bg-rose-500" },
  { label: "Disbursed", color: "bg-blue-500" },
];

const shortcuts = [
  { label: "Application Report", desc: "Review application performance", icon: FileText },
  { label: "Commission Report", desc: "Review your commission earnings", icon: IndianRupee },
  { label: "Disbursement Report", desc: "Track successful disbursements", icon: TrendingUp },
  { label: "Monthly Performance", desc: "Review month-wise progress", icon: ChartNoAxesCombined },
];

export default function DsaReportsPage() {
  const [period, setPeriod] = useState("This Month");
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen bg-[#f5f7fb] p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#071a38] via-[#102e5b] to-[#145b69] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-[-100px] right-[25%] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-cyan-100">
                <ShieldCheck size={15} /> DSA PERFORMANCE CENTER
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Reports <span className="text-cyan-300">&amp; Analytics</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
                Your business performance, application pipeline and earnings in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                  <ChartNoAxesCombined size={17} className="text-cyan-300" />
                  <span>Performance overview</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                  <Target size={17} className="text-emerald-300" />
                  <span>Business insights</span>
                </div>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm lg:max-w-[300px]">
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <CalendarDays size={17} /> Reporting period
              </div>
              <div className="relative mt-3">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/15 bg-[#102e5b] px-4 py-3 pr-10 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Last 3 Months</option>
                  <option>This Year</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-3 text-xs leading-5 text-blue-100/65">
                Selected period: {period}. Metrics will populate when live report data is connected.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            const tone: Record<string, string> = {
              blue: "bg-blue-50 text-blue-700 ring-blue-100",
              green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
              violet: "bg-violet-50 text-violet-700 ring-violet-100",
              amber: "bg-amber-50 text-amber-700 ring-amber-100",
            };
            return (
              <article key={item.label} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{item.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ring-1 ${tone[item.color]}`}>
                    <Icon size={22} />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <CircleDashed size={14} /> {item.note}
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Performance Overview</h2>
                <p className="mt-1 text-sm text-slate-500">Application and disbursement trends</p>
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">{period}</span>
            </div>
            <div className="mt-6 flex min-h-[235px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center">
              <div className="rounded-2xl bg-white p-4 text-blue-600 shadow-sm">
                <BarChart3 size={30} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-700">Your performance chart will appear here</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Connect the reports API to display real monthly application, approval and disbursement data. No sample figures are being shown.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Applications", "Track submitted cases"],
                ["Approvals", "Monitor lender decisions"],
                ["Disbursements", "Measure completed loans"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Application Status</h2>
                <p className="mt-1 text-sm text-slate-500">Current pipeline distribution</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><BriefcaseBusiness size={20} /></div>
            </div>
            <div className="mt-6 flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
              <div>
                <CircleDashed size={27} className="mx-auto text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">No status data loaded</p>
                <p className="mt-1 text-xs text-slate-400">Awaiting live application data</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {statusRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                    <span className="text-sm text-slate-600">{row.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-400">—</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Quick Reports</h2>
                <p className="mt-1 text-sm text-slate-500">Choose a report to review</p>
              </div>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw size={15} /> Reset search
              </button>
            </div>
            <div className="relative mt-5">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
            <div className="mt-4 space-y-3">
              {shortcuts.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-700"><Icon size={20} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button type="button" disabled title="Live report export is not connected yet" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400">
                      <Download size={14} /> Export
                    </button>
                  </div>
                );
              })}
              {shortcuts.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">No matching reports found.</p>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900">Earnings &amp; Targets</h2>
            <p className="mt-1 text-sm text-slate-500">Commission and business goals</p>
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#0b2144] to-[#164b70] p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Commission earnings</span>
                <IndianRupee size={19} className="text-cyan-300" />
              </div>
              <p className="mt-4 text-3xl font-black">—</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-blue-100/70">
                <Clock3 size={14} /> Waiting for commission data
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Target size={21} /></div>
                <div>
                  <p className="font-semibold text-slate-800">Monthly target</p>
                  <p className="mt-1 text-xs text-slate-500">Target progress will be shown here</p>
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-0 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>Progress unavailable</span><span>—</span>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-amber-900">
              <ArrowUpRight size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs leading-5">Live earnings, targets and exports require the corresponding backend report endpoints.</p>
            </div>
          </article>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-4 text-xs text-slate-400 sm:flex-row">
          <span>DSA Reports &amp; Analytics</span>
          <span>Live data only · No sample business figures</span>
        </footer>
      </div>
    </main>
  );
}
