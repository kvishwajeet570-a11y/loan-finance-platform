"use client";

import DsaSidebar from "@/components/dsa/DsaSidebar";

const rupee = "₹";

const kpis = [
  {
    title: "Total Leads",
    value: "248",
    growth: "12%",
    icon: "♟",
    iconClass: "from-blue-500 to-cyan-400",
    line: "M5 38 L18 31 L31 35 L44 24 L57 29 L70 18 L83 22 L96 10",
  },
  {
    title: "Total Applications",
    value: "186",
    growth: "18%",
    icon: "▣",
    iconClass: "from-emerald-400 to-teal-500",
    line: "M5 39 L18 34 L31 37 L44 27 L57 30 L70 19 L83 23 L96 9",
  },
  {
    title: "Approved Applications",
    value: "112",
    growth: "24%",
    icon: "✓",
    iconClass: "from-violet-500 to-purple-500",
    line: "M5 41 L18 35 L31 38 L44 28 L57 31 L70 21 L83 24 L96 11",
  },
  {
    title: "Total Commission",
    value: "₹ 2,45,600",
    growth: "20%",
    icon: "◎",
    iconClass: "from-orange-400 to-amber-500",
    line: "M5 40 L18 34 L31 37 L44 26 L57 31 L70 17 L83 22 L96 7",
  },
  {
    title: "Wallet Credit",
    value: "₹ 1,85,400",
    growth: "15%",
    icon: "▣",
    iconClass: "from-cyan-400 to-teal-500",
    line: "M5 40 L18 33 L31 36 L44 27 L57 31 L70 20 L83 24 L96 10",
  },
];

const activities = [
  ["1", "07 Oct 2026, 10:45 AM", "Commission", "Home Loan - Commission Earned", "APP-20261007-001", "₹ 1,500", "Credited", "green"],
  ["2", "07 Oct 2026, 09:30 AM", "Application", "Personal Loan Application", "APP-20261007-002", "-", "Submitted", "blue"],
  ["3", "06 Oct 2026, 04:20 PM", "Lead", "New Lead Added", "LEAD-20261006-015", "-", "Added", "purple"],
  ["4", "06 Oct 2026, 11:15 AM", "Commission", "Car Loan - Commission Earned", "APP-20261006-008", "₹ 2,000", "Credited", "green"],
  ["5", "05 Oct 2026, 02:40 PM", "Application", "Business Loan Application", "APP-20261005-006", "-", "Under Review", "orange"],
];

const products = [
  ["Personal Loan", "₹ 85,000", "42 Applications", "32%", "blue"],
  ["Business Loan", "₹ 62,000", "28 Applications", "21%", "green"],
  ["Home Loan", "₹ 48,500", "16 Applications", "18%", "purple"],
  ["Loan Against Property", "₹ 32,000", "12 Applications", "12%", "orange"],
  ["Car Loan", "₹ 18,500", "8 Applications", "7%", "pink"],
];

const quickReports = [
  ["₹", "Earnings", "Report", "orange", "/dsa/reports/earnings"],
  ["▣", "Commission", "Report", "purple", "/dsa/reports/commission"],
  ["♟", "Lead", "Report", "blue", "/dsa/reports/leads"],
  ["▤", "Application", "Report", "green", "/dsa/reports/applications"],
  ["▣", "Wallet", "Report", "pink", "/dsa/reports/wallet"],
  ["⇄", "Transaction", "Report", "indigo", "/dsa/reports/transactions"],
];

const statusData = [
  ["Approved", "112", "60%", "emerald"],
  ["Under Review", "42", "23%", "blue"],
  ["Rejected", "20", "11%", "orange"],
  ["In Progress", "12", "6%", "purple"],
];

function MiniSparkline({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 100 45"
      className="mt-2 h-10 w-full"
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="#102347"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PerformanceChart() {
  return (
    <div className="relative mt-4 h-[250px] overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        {[20, 60, 100, 140, 180, 220].map((y) => (
          <div
            key={y}
            className="absolute left-8 right-2 border-t border-slate-100"
            style={{ top: `${y}px` }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-9 right-2 top-0 flex items-end justify-between px-1">
        {[42, 70, 96, 80, 108, 122, 91, 130, 150, 116, 138, 100].map(
          (height, i) => (
            <div
              key={i}
              className="flex h-full w-[6%] items-end justify-center"
            >
              <div
                className="w-[42%] rounded-t bg-gradient-to-t from-amber-500 to-yellow-300"
                style={{ height: `${height}px` }}
              />
            </div>
          )
        )}
      </div>

      <svg
        viewBox="0 0 760 220"
        className="absolute left-8 right-2 top-0 h-[220px] w-[calc(100%-40px)]"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,174 68,145 136,112 204,130 272,126 340,88 408,100 476,72 544,58 612,82 680,55 760,92"
          fill="none"
          stroke="#1683ff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="0,194 68,175 136,154 204,164 272,145 340,126 408,132 476,105 544,92 612,103 680,90 760,112"
          fill="none"
          stroke="#14b889"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="0,210 68,201 136,190 204,196 272,177 340,158 408,166 476,144 544,130 612,143 680,128 760,151"
          fill="none"
          stroke="#7c4dff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [0,174],
          [68,145],
          [136,112],
          [204,130],
          [272,126],
          [340,88],
          [408,100],
          [476,72],
          [544,58],
          [612,82],
          [680,55],
          [760,92],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="#1683ff" />
        ))}
      </svg>

      <div className="absolute bottom-0 left-8 right-2 flex justify-between text-[9px] font-medium text-slate-400">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
          (m) => <span key={m}>{m}</span>
        )}
      </div>
    </div>
  );
}

function EarningsChart() {
  const bars = [
    [48, 34],
    [65, 45],
    [91, 70],
    [58, 42],
    [96, 70],
    [80, 60],
    [112, 82],
    [145, 108],
    [171, 130],
    [142, 101],
    [126, 94],
    [110, 84],
  ];

  return (
    <div className="relative mt-4 h-[250px]">
      <div className="absolute inset-0">
        {[25, 70, 115, 160, 205].map((y) => (
          <div
            key={y}
            className="absolute left-8 right-2 border-t border-slate-100"
            style={{ top: `${y}px` }}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-9 right-2 flex h-[205px] items-end justify-between gap-1">
        {bars.map(([a, b], i) => (
          <div
            key={i}
            className="flex h-full flex-1 items-end justify-center gap-1"
          >
            <div
              className="w-[42%] rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400"
              style={{ height: `${a}px` }}
            />
            <div
              className="w-[42%] rounded-t-md bg-gradient-to-t from-emerald-500 to-teal-300"
              style={{ height: `${b}px` }}
            />
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 760 205"
        className="absolute left-9 right-2 top-0 h-[205px] w-[calc(100%-44px)]"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,168 70,148 140,156 210,126 280,141 350,112 420,124 490,88 560,98 630,68 700,52 760,66"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="absolute bottom-0 left-9 right-2 flex justify-between text-[9px] text-slate-400">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
          (m) => <span key={m}>{m}</span>
        )}
      </div>
    </div>
  );
}

function StatusDonut() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative grid h-[150px] w-[150px] place-items-center rounded-full"
        style={{
          background:
            "conic-gradient(#14b889 0 60%, #1683ff 60% 83%, #f59e0b 83% 94%, #7c4dff 94% 100%)",
        }}
      >
        <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-white text-center shadow-inner">
          <div>
            <p className="text-2xl font-black text-[#102347]">186</p>
            <p className="text-[9px] text-slate-400">Total</p>
          </div>
        </div>
      </div>

      <div className="mt-5 w-full space-y-3">
        {statusData.map(([label, value, percent, color]) => (
          <div key={label} className="flex items-center text-[10px]">
            <span
              className={`mr-2 h-2.5 w-2.5 rounded-full ${
                color === "emerald"
                  ? "bg-emerald-500"
                  : color === "blue"
                    ? "bg-blue-500"
                    : color === "orange"
                      ? "bg-orange-500"
                      : "bg-violet-500"
              }`}
            />
            <span className="font-semibold text-slate-600">{label}</span>
            <span className="ml-auto font-black text-slate-700">{value}</span>
            <span className="ml-2 w-8 text-right text-slate-400">{percent}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DsaReportsPage() {
  return (
    <div className="min-h-screen bg-[#f3f7fd] text-[#102347]">
      <DsaSidebar />

      <div className="lg:pl-[278px]">
        <header className="sticky top-0 z-30 flex h-[62px] items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
          <div className="flex min-w-0 flex-1 items-center">
            <div className="hidden h-9 max-w-[390px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 md:flex">
              <span className="text-slate-400">⌕</span>
              <span className="truncate text-[10px] text-slate-400">
                Search by application no., customer name, mobile no...
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden h-9 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-700 shadow-sm sm:block">
              ▣ &nbsp; 01 Oct 2026 - 07 Oct 2026⌄
            </button>

            <button className="h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-[10px] font-black text-white shadow-lg shadow-blue-500/20">
              ⇩ Export Report
            </button>

            <button className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-sm">
              ♧
              <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[8px] font-black text-white">
                3
              </span>
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">
                DS
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-black">DSA Demo</p>
                <p className="text-[9px] text-slate-500">DSA Partner</p>
              </div>
              <span className="text-xs">⌄</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1550px] px-3 py-3 sm:px-5 lg:px-6">

          {/* ================= PREMIUM HERO ================= */}
          <section className="relative min-h-[260px] overflow-hidden rounded-[24px] border border-blue-400/40 bg-gradient-to-br from-[#031d55] via-[#082d70] to-[#101b58] px-7 py-6 text-white shadow-[0_20px_60px_rgba(23,102,255,.25)]">

            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute right-20 bottom-[-100px] h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="absolute right-0 top-0 h-full w-[65%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,.12),transparent_55%)]" />

            {/* skyline */}
            <div className="absolute bottom-0 right-[27%] hidden h-[145px] items-end gap-1 opacity-90 lg:flex">
              {[70, 110, 88, 135, 98, 150, 118, 92, 125, 78].map((h, i) => (
                <div
                  key={i}
                  className="relative w-6 rounded-t-md bg-gradient-to-t from-[#061941] to-blue-500/80"
                  style={{ height: `${h}px` }}
                >
                  <div className="absolute left-1/2 top-3 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_8px_#22d3ee]" />
                </div>
              ))}
            </div>

            {/* growth arrow */}
            <svg
              viewBox="0 0 500 240"
              className="absolute right-[17%] top-2 hidden h-[230px] w-[430px] lg:block"
            >
              <defs>
                <linearGradient id="heroGrowth" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="60%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#fde047" />
                </linearGradient>
              </defs>
              <path
                d="M20 200 C120 185 125 150 205 160 C285 170 285 80 440 25"
                fill="none"
                stroke="url(#heroGrowth)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M394 24 L446 24 L442 75"
                fill="none"
                stroke="#fde047"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* coins */}
            <div className="absolute bottom-6 right-[22%] hidden items-end gap-1 lg:flex">
              <div className="grid h-10 w-10 place-items-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-100 to-amber-500 text-lg font-black text-amber-900 shadow-[0_0_25px_rgba(251,191,36,.55)]">
                ₹
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-100 to-orange-500 text-xl font-black text-amber-900 shadow-[0_0_30px_rgba(251,191,36,.55)]">
                ₹
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-100 to-amber-500 text-sm font-black text-amber-900">
                ₹
              </div>
            </div>

            {/* left hero content */}
            <div className="relative z-10 max-w-[590px]">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-[1.5px] text-cyan-200">
                <span className="text-lg">▥</span>
                DSA FinCorp
              </div>

              <h1 className="text-4xl font-black leading-[.95] tracking-tight sm:text-5xl">
                Your Growth
                <br />
                <span className="text-yellow-300">Our Priority</span>
              </h1>

              <p className="mt-3 text-sm font-black text-white">
                Track • Analyze • Earn More
              </p>

              <p className="mt-2 max-w-[520px] text-[11px] leading-5 text-blue-100">
                Complete Insights of Leads, Applications, Approvals, Earnings & Wallet —
                all in one place for DSA Partners.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  ["♟", "More Leads"],
                  ["↗", "Higher Conversions"],
                  ["₹", "Bigger Commissions"],
                  ["ϟ", "Faster Payouts"],
                ].map(([icon, label]) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[9px] font-black backdrop-blur"
                  >
                    {icon} &nbsp;{label}
                  </span>
                ))}
              </div>
            </div>

            {/* right feature panel */}
            <div className="absolute right-4 top-5 z-20 hidden w-[255px] rounded-2xl border border-blue-300/30 bg-[#062453]/85 p-4 shadow-2xl backdrop-blur lg:block">
              <p className="text-xs font-black">Unlock Your Earning Potential</p>

              <div className="mt-3 space-y-2.5">
                {[
                  "Real-time Performance Tracking",
                  "Detailed Commission Reports",
                  "Application Status Analytics",
                  "Wallet & Transaction Reports",
                  "Export & Share Reports",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[9px] font-semibold text-blue-50">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-cyan-400 text-[10px] font-black text-white">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* performer badge */}
            <div className="absolute right-3 top-3 z-30 hidden h-[118px] w-[118px] rotate-3 flex-col items-center justify-center rounded-full border-4 border-yellow-300 bg-gradient-to-br from-[#071d48] to-[#123d80] text-center shadow-[0_0_35px_rgba(250,204,21,.45)] xl:flex">
              <span className="text-3xl">🏆</span>
              <span className="text-[9px] font-black uppercase tracking-[2px] text-yellow-200">
                DSA
              </span>
              <span className="text-[10px] font-black text-white">
                TOP PERFORMER
              </span>
            </div>
          </section>

          {/* ================= KPI ================= */}
          <section className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
            {kpis.map((kpi) => (
              <div
                key={kpi.title}
                className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${kpi.iconClass} text-lg font-black text-white shadow-lg`}
                  >
                    {kpi.icon}
                  </div>

                  <span className="text-[10px] font-black text-emerald-500">
                    ↑ {kpi.growth}
                  </span>
                </div>

                <p className="mt-3 text-[10px] font-semibold text-slate-500">
                  {kpi.title}
                </p>

                <p className="mt-1 text-xl font-black tracking-tight">
                  {kpi.value}
                </p>

                <p className="text-[8px] text-slate-400">
                  vs. previous period
                </p>

                <MiniSparkline path={kpi.line} />
              </div>
            ))}
          </section>

          {/* ================= ANALYTICS ================= */}
          <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.45fr_1.05fr_.72fr]">

            {/* PERFORMANCE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-black">
                    <span className="text-blue-600">▥</span>
                    Performance Overview
                  </h2>
                  <p className="text-[9px] text-slate-400">
                    Leads, Applications & Approvals Trend
                  </p>
                </div>

                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-[9px] font-bold">
                  Monthly⌄
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-[9px] font-semibold">
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />Leads</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />Applications</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />Approved</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />Commission</span>
              </div>

              <PerformanceChart />
            </div>

            {/* EARNINGS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-black">
                    <span className="text-violet-600">♙</span>
                    Earnings & Wallet Overview
                  </h2>
                  <p className="text-[9px] text-slate-400">
                    Monthly earnings and wallet credit
                  </p>
                </div>

                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-[9px] font-bold">
                  Monthly⌄
                </button>
              </div>

              <div className="mt-3 flex gap-4 text-[9px] font-semibold">
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />Commission Earned</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />Wallet Credit</span>
              </div>

              <EarningsChart />
            </div>

            {/* STATUS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-black">
                  Application Status
                </h2>

                <button className="rounded-lg border border-slate-200 px-2.5 py-2 text-[8px] font-bold">
                  This Month⌄
                </button>
              </div>

              <div className="mt-5">
                <StatusDonut />
              </div>
            </div>
          </section>

          {/* ================= ACTIVITY + QUICK ================= */}
          <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_285px]">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h2 className="text-base font-black">
                    ▣ &nbsp;Recent Activity
                  </h2>
                  <p className="text-[9px] text-slate-400">
                    Latest activities across leads, applications, commissions and wallet
                  </p>
                </div>

                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-[9px] font-bold">
                  View All →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Date & Time</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Description</th>
                      <th className="px-3 py-2">Application No.</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activities.map((row) => (
                      <tr key={row[0]} className="border-t border-slate-100 text-[9px]">
                        <td className="px-3 py-2.5 font-bold">{row[0]}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{row[1]}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-lg px-2 py-1 font-black ${
                              row[7] === "green"
                                ? "bg-emerald-50 text-emerald-600"
                                : row[7] === "blue"
                                  ? "bg-blue-50 text-blue-600"
                                  : row[7] === "purple"
                                    ? "bg-violet-50 text-violet-600"
                                    : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {row[2]}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-semibold whitespace-nowrap">{row[3]}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-slate-500">{row[4]}</td>
                        <td className="px-3 py-2.5 font-black text-emerald-600">{row[5]}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-lg px-2 py-1 font-black ${
                              row[7] === "green"
                                ? "bg-emerald-50 text-emerald-600"
                                : row[7] === "blue"
                                  ? "bg-blue-50 text-blue-600"
                                  : row[7] === "purple"
                                    ? "bg-violet-50 text-violet-600"
                                    : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {row[6]}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <button className="rounded-lg border border-blue-300 px-3 py-1 text-[9px] font-bold text-blue-600">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QUICK REPORTS */}
            <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,35,71,.08)]">

              {/* premium header */}
              <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-[#f8fbff] via-white to-[#f1f5ff] px-4 py-4">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
                <div className="absolute -bottom-10 right-20 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm text-white shadow-lg shadow-blue-500/20">
                        ▣
                      </div>

                      <div>
                        <h2 className="text-[15px] font-black tracking-tight text-[#102347]">
                          Quick Reports
                        </h2>
                        <p className="text-[8px] font-medium text-slate-400">
                          Generate detailed reports instantly
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[7px] font-black uppercase tracking-wider text-blue-600">
                    6 Reports
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3">

                {[
                  {
                    icon: "₹",
                    title: "Earnings",
                    sub: "Report",
                    desc: "Commission & income",
                    amount: "₹2.45L",
                    color: "orange",
                    href: "/dsa/reports/earnings",
                  },
                  {
                    icon: "▣",
                    title: "Commission",
                    sub: "Report",
                    desc: "Commission breakdown",
                    amount: "₹2.45L",
                    color: "purple",
                    href: "/dsa/reports/commission",
                  },
                  {
                    icon: "♟",
                    title: "Lead",
                    sub: "Report",
                    desc: "Lead performance",
                    amount: "248 Leads",
                    color: "blue",
                    href: "/dsa/reports/leads",
                  },
                  {
                    icon: "▤",
                    title: "Application",
                    sub: "Report",
                    desc: "Application analytics",
                    amount: "186 Apps",
                    color: "green",
                    href: "/dsa/reports/applications",
                  },
                  {
                    icon: "▣",
                    title: "Wallet",
                    sub: "Report",
                    desc: "Wallet activity",
                    amount: "₹1.85L",
                    color: "pink",
                    href: "/dsa/reports/wallet",
                  },
                  {
                    icon: "⇄",
                    title: "Transaction",
                    sub: "Report",
                    desc: "Credit & debit",
                    amount: "Live Data",
                    color: "indigo",
                    href: "/dsa/reports/transactions",
                  },
                ].map((report) => (
                  <button
                    key={report.title}
                    onClick={() => (window.location.href = report.href)}
                    className={`group relative overflow-hidden rounded-[16px] border p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      report.color === "orange"
                        ? "border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50"
                        : report.color === "purple"
                          ? "border-purple-100 bg-gradient-to-br from-purple-50 via-white to-violet-50"
                          : report.color === "blue"
                            ? "border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50"
                            : report.color === "green"
                              ? "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50"
                              : report.color === "pink"
                                ? "border-pink-100 bg-gradient-to-br from-pink-50 via-white to-rose-50"
                                : "border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50"
                    }`}
                  >

                    <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/70 blur-xl" />

                    <div className="relative flex items-start justify-between">
                      <div
                        className={`grid h-10 w-10 place-items-center rounded-[13px] text-sm font-black text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                          report.color === "orange"
                            ? "bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-500/20"
                            : report.color === "purple"
                              ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-500/20"
                              : report.color === "blue"
                                ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/20"
                                : report.color === "green"
                                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/20"
                                  : report.color === "pink"
                                    ? "bg-gradient-to-br from-pink-500 to-rose-500 shadow-pink-500/20"
                                    : "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/20"
                        }`}
                      >
                        {report.icon}
                      </div>

                      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-[11px] font-black text-blue-600 shadow-sm transition-all group-hover:translate-x-1">
                        →
                      </span>
                    </div>

                    <div className="relative mt-3">
                      <p className="text-[10px] font-black leading-4 text-[#102347]">
                        {report.title}
                        <br />
                        {report.sub}
                      </p>

                      <p className="mt-1 text-[7px] font-medium text-slate-400">
                        {report.desc}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[8px] font-black text-slate-600">
                          {report.amount}
                        </span>

                        <span className="text-[7px] font-bold text-blue-500">
                          View →
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}

              </div>

              <div className="mx-3 mb-3 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-[8px] font-black text-slate-600">
                    Need a custom report?
                  </p>
                  <p className="text-[7px] text-slate-400">
                    Export your DSA performance data
                  </p>
                </div>

                <button className="rounded-lg bg-[#102347] px-3 py-1.5 text-[7px] font-black text-white shadow-md">
                  Export →
                </button>
              </div>

            </div>
          </section>

          {/* ================= PRODUCTS + TARGET ================= */}
          <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_285px]">

            <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,35,71,.08)]">

              {/* TOP PRODUCTS HEADER */}
              <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-white via-blue-50/40 to-white px-4 py-4">

                <div className="absolute right-0 top-0 h-28 w-64 bg-gradient-to-l from-blue-100/60 via-indigo-50/30 to-transparent blur-xl" />

                <div className="relative flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 text-xl shadow-lg shadow-orange-500/20">
                      🏆
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-[16px] font-black tracking-tight text-[#102347]">
                          Top Performing Loan Products
                        </h2>

                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-black text-emerald-600">
                          TOP 5
                        </span>
                      </div>

                      <p className="mt-0.5 text-[8px] font-medium text-slate-400">
                        Product-wise application, earning & commission performance
                      </p>
                    </div>

                  </div>

                  <button className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-[8px] font-black text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 sm:block">
                    View Details →
                  </button>

                </div>
              </div>


              {/* PRODUCT CARDS */}
              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">

                {[
                  {
                    rank: "01",
                    icon: "●",
                    name: "Personal Loan",
                    amount: "₹ 85,000",
                    apps: "42 Applications",
                    percent: "32%",
                    commission: "₹18,500",
                    trend: "+18%",
                    color: "blue",
                  },
                  {
                    rank: "02",
                    icon: "▣",
                    name: "Business Loan",
                    amount: "₹ 62,000",
                    apps: "28 Applications",
                    percent: "21%",
                    commission: "₹14,200",
                    trend: "+15%",
                    color: "green",
                  },
                  {
                    rank: "03",
                    icon: "◆",
                    name: "Home Loan",
                    amount: "₹ 48,500",
                    apps: "16 Applications",
                    percent: "18%",
                    commission: "₹11,800",
                    trend: "+12%",
                    color: "purple",
                  },
                  {
                    rank: "04",
                    icon: "▥",
                    name: "Loan Against Property",
                    amount: "₹ 32,000",
                    apps: "12 Applications",
                    percent: "12%",
                    commission: "₹8,400",
                    trend: "+9%",
                    color: "orange",
                  },
                  {
                    rank: "05",
                    icon: "▣",
                    name: "Car Loan",
                    amount: "₹ 18,500",
                    apps: "8 Applications",
                    percent: "7%",
                    commission: "₹5,600",
                    trend: "+7%",
                    color: "pink",
                  },
                ].map((product) => (

                  <div
                    key={product.name}
                    className={`group relative overflow-hidden rounded-[18px] border bg-white p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                      product.color === "blue"
                        ? "border-blue-100 hover:border-blue-300"
                        : product.color === "green"
                          ? "border-emerald-100 hover:border-emerald-300"
                          : product.color === "purple"
                            ? "border-violet-100 hover:border-violet-300"
                            : product.color === "orange"
                              ? "border-orange-100 hover:border-orange-300"
                              : "border-pink-100 hover:border-pink-300"
                    }`}
                  >

                    {/* Glow */}
                    <div
                      className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
                        product.color === "blue"
                          ? "bg-blue-100/70"
                          : product.color === "green"
                            ? "bg-emerald-100/70"
                            : product.color === "purple"
                              ? "bg-violet-100/70"
                              : product.color === "orange"
                                ? "bg-orange-100/70"
                                : "bg-pink-100/70"
                      }`}
                    />


                    {/* Rank + Trend */}
                    <div className="relative flex items-center justify-between">

                      <span
                        className={`rounded-full px-2 py-1 text-[7px] font-black ${
                          product.color === "blue"
                            ? "bg-blue-50 text-blue-600"
                            : product.color === "green"
                              ? "bg-emerald-50 text-emerald-600"
                              : product.color === "purple"
                                ? "bg-violet-50 text-violet-600"
                                : product.color === "orange"
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-pink-50 text-pink-600"
                        }`}
                      >
                        RANK #{product.rank}
                      </span>

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-black text-emerald-600">
                        ↑ {product.trend}
                      </span>

                    </div>


                    {/* Icon */}
                    <div
                      className={`relative mt-3 grid h-11 w-11 place-items-center rounded-[13px] text-sm font-black text-white shadow-lg ${
                        product.color === "blue"
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/20"
                          : product.color === "green"
                            ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/20"
                            : product.color === "purple"
                              ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/20"
                              : product.color === "orange"
                                ? "bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-500/20"
                                : "bg-gradient-to-br from-pink-500 to-rose-500 shadow-pink-500/20"
                      }`}
                    >
                      {product.icon}
                    </div>


                    {/* Product Info */}
                    <div className="relative mt-3">

                      <p className="min-h-[30px] text-[9px] font-black leading-4 text-[#102347]">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[18px] font-black tracking-tight text-[#102347]">
                        {product.amount}
                      </p>

                      <div className="mt-1 flex items-center justify-between">

                        <span className="text-[7px] font-semibold text-slate-400">
                          {product.apps}
                        </span>

                        <span className="text-[8px] font-black text-[#102347]">
                          {product.percent}
                        </span>

                      </div>


                      {/* Progress */}
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            product.color === "blue"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                              : product.color === "green"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                : product.color === "purple"
                                  ? "bg-gradient-to-r from-violet-500 to-purple-400"
                                  : product.color === "orange"
                                    ? "bg-gradient-to-r from-orange-500 to-amber-400"
                                    : "bg-gradient-to-r from-pink-500 to-rose-400"
                          }`}
                          style={{ width: product.percent }}
                        />

                      </div>


                      {/* Commission */}
                      <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-2">

                        <div>
                          <p className="text-[6px] font-bold uppercase tracking-wider text-slate-400">
                            Commission Earned
                          </p>

                          <p className="mt-0.5 text-[10px] font-black text-emerald-600">
                            {product.commission}
                          </p>
                        </div>

                        <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-50 text-[11px] font-black text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                          →
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>


              {/* PERFORMANCE SUMMARY */}
              <div className="mx-4 mb-4 flex flex-col gap-3 rounded-[16px] border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 p-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-base shadow-sm">
                    🏆
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-[#102347]">
                      Your strongest product: Personal Loan
                    </p>

                    <p className="mt-0.5 text-[7px] text-slate-400">
                      42 applications • 32% contribution • ₹18,500 commission
                    </p>
                  </div>

                </div>

                <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-[8px] font-black text-white shadow-lg shadow-blue-500/20">
                  Analyze Products →
                </button>

              </div>

            </div>
            {/* MONTHLY TARGET */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black">Monthly Target</h2>
                <span className="text-[8px] text-slate-400">
                  Today: 07 Oct 2026
                </span>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div
                  className="relative grid h-[100px] w-[100px] shrink-0 place-items-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#14b889 0 68%, #e8eef5 68% 100%)",
                  }}
                >
                  <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-white">
                    <span className="text-xl font-black">68%</span>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-semibold text-slate-500">
                    Commission Earned
                  </p>
                  <p className="mt-1 text-xl font-black">
                    ₹ 2,45,600
                  </p>
                  <p className="mt-1 text-[9px] text-slate-400">
                    Target: ₹ 3,60,000
                  </p>

                  <div className="mt-3 h-2 w-[120px] overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                  </div>
                </div>
              </div>

              <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-[10px] font-black text-white shadow-lg shadow-blue-500/20">
                View Target Details →
              </button>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-4 border-t border-slate-200 py-4 text-center text-[9px] text-slate-400">
            DSA FinCorp • Reports & Analytics • Secure • Transparent • Professional DSA Management
          </footer>
        </main>
      </div>
    </div>
  );
}


