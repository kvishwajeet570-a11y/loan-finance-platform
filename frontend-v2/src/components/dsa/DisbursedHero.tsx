"use client";

export default function DisbursedHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-r from-[#15105f] via-[#3520a0] to-[#7228df] px-7 py-8 text-white shadow-2xl sm:px-9 lg:min-h-[190px] lg:px-10">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-[42%] -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-20 -bottom-40 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />

      {/* Decorative SVG waves */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
      >
        <path
          d="M0 180 C180 40 330 230 520 100 S850 30 1200 150"
          fill="none"
          stroke="url(#wave)"
          strokeWidth="70"
        />
        <defs>
          <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="0.5" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 max-w-3xl">

        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] font-black tracking-[0.3em] text-cyan-200">
            DSA FINCORP
          </span>

          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-black tracking-wider backdrop-blur">
            REAL-TIME
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[44px]">
          Disbursed{" "}
          <span className="text-yellow-300">
            Leads
          </span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
          Track all successfully disbursed loan applications and your earnings.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold backdrop-blur">
            ⚡ Real-time updates
          </span>

          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold backdrop-blur">
            ₹ Track your earnings
          </span>

          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold backdrop-blur">
            ✓ Customer history
          </span>
        </div>
      </div>

      {/* AI generated finance illustration — pure SVG */}
      <div className="pointer-events-none absolute right-3 top-1/2 hidden h-44 w-80 -translate-y-1/2 lg:block">

        <div className="absolute right-8 top-4 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="absolute right-10 top-2 h-36 w-36 rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md" />

        {/* Money bag */}
        <svg
          className="absolute right-16 top-1 h-40 w-32 drop-shadow-2xl"
          viewBox="0 0 160 190"
          fill="none"
        >
          <path
            d="M58 25C58 14 70 7 80 7C90 7 102 14 102 25"
            stroke="#FDE68A"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            d="M62 29H98L106 48H54L62 29Z"
            fill="#F59E0B"
          />

          <path
            d="M53 45C33 57 22 82 26 115C31 153 51 174 80 174C109 174 129 153 134 115C138 82 127 57 107 45H53Z"
            fill="url(#bagGradient)"
            stroke="#FDE68A"
            strokeWidth="4"
          />

          <text
            x="80"
            y="125"
            textAnchor="middle"
            fontSize="62"
            fontWeight="900"
            fill="#7C2D12"
          >
            ₹
          </text>

          <defs>
            <linearGradient id="bagGradient" x1="30" y1="45" x2="130" y2="170">
              <stop stopColor="#FDE68A" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
          </defs>
        </svg>

        {/* Green approval circle */}
        <div className="absolute right-2 top-20 flex h-20 w-20 rotate-6 items-center justify-center rounded-full border-4 border-white/60 bg-emerald-500 shadow-2xl">
          <svg width="42" height="42" viewBox="0 0 42 42">
            <path
              d="M9 22L17 30L33 12"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Document */}
        <div className="absolute bottom-0 right-24 h-20 w-16 rotate-6 rounded-xl border-2 border-white/40 bg-white p-2 shadow-2xl">
          <div className="h-2 w-9 rounded bg-violet-400" />
          <div className="mt-2 h-1.5 w-11 rounded bg-slate-300" />
          <div className="mt-2 h-1.5 w-8 rounded bg-slate-300" />
          <div className="mt-2 h-1.5 w-10 rounded bg-slate-300" />
          <div className="mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600">
            ✓
          </div>
        </div>

        {/* Coins */}
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="h-7 w-7 rounded-full border-2 border-yellow-100 bg-yellow-400 shadow-lg" />
          <span className="h-10 w-10 rounded-full border-2 border-yellow-100 bg-yellow-500 shadow-lg" />
          <span className="h-6 w-6 rounded-full border-2 border-yellow-100 bg-yellow-300 shadow-lg" />
        </div>

        {/* AI badge */}
        <div className="absolute right-1 top-0 rounded-full border border-cyan-200/30 bg-cyan-300/20 px-3 py-1 text-[8px] font-black tracking-[0.18em] text-cyan-100 backdrop-blur">
          AI POWERED
        </div>
      </div>
    </section>
  );
}
