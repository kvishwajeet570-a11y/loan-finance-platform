"use client";

export default function KycPremiumBanner() {
  return (
    <section className="relative mb-4 h-[158px] overflow-hidden rounded-2xl border border-blue-200/20 bg-[#06184f] shadow-[0_12px_35px_rgba(7,63,168,0.25)]">

      <div className="absolute inset-0 bg-gradient-to-r from-[#06184f] via-[#0a3f9f] to-[#079ee8]" />

      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="absolute left-[38%] top-[-70px] h-52 w-52 rounded-full bg-indigo-400/10 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="absolute left-0 top-0 h-[2px] w-[45%] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

      {/* LEFT */}
      <div className="relative z-10 flex h-full items-center px-6 lg:px-8">

        <div className="max-w-[540px]">

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1 backdrop-blur-md">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />

            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-100">
              Smart KYC Security
            </span>

          </div>

          <h2 className="text-[28px] font-black leading-none tracking-tight text-white sm:text-[32px]">

            Secure

            <span className="ml-2 bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              Verification
            </span>

          </h2>

          <p className="mt-2 text-[10px] font-semibold tracking-wide text-blue-100 sm:text-[11px]">
            Identity protection • Document validation • Real-time verification
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">

            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[8px] font-bold text-white backdrop-blur-md">
              PAN
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[8px] font-bold text-white backdrop-blur-md">
              BANK
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[8px] font-bold text-white backdrop-blur-md">
              DOCUMENT
            </span>

            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[8px] font-bold text-emerald-100">
              VERIFIED
            </span>

          </div>

        </div>

      </div>

      {/* CENTER SHIELD */}
      <div className="absolute right-[31%] top-1/2 hidden -translate-y-1/2 lg:flex">

        <div className="absolute -inset-7 rounded-full border border-cyan-300/10" />

        <div className="absolute -inset-4 rounded-full border border-cyan-200/15" />

        <div className="absolute -inset-2 rounded-full bg-cyan-300/10 blur-xl" />

        <div className="relative flex h-[82px] w-[82px] items-center justify-center rounded-[24px] border border-white/30 bg-white/10 shadow-[0_0_35px_rgba(34,211,238,0.28)] backdrop-blur-xl">

          <svg
            viewBox="0 0 64 64"
            className="h-12 w-12 text-cyan-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M32 5L51 13V28C51 41 43 52 32 58C21 52 13 41 13 28V13L32 5Z" />
            <path d="M22 31L28 37L43 21" />
          </svg>

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="absolute right-5 top-1/2 z-20 hidden h-[124px] w-[265px] -translate-y-1/2 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl lg:block">

        <div className="flex items-center justify-between">

          <div>

            <div className="text-[11px] font-black text-white">
              Protected KYC
            </div>

            <div className="mt-0.5 text-[8px] font-semibold text-cyan-100">
              Verification Control Center
            </div>

          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/15">

            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-emerald-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l2.5 2.5L16 9" />
            </svg>

          </div>

        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">

          <div className="rounded-xl border border-white/10 bg-white/10 px-2 py-2">
            <div className="text-[7px] font-bold text-blue-100">
              ID CHECK
            </div>
            <div className="mt-1 text-[8px] font-black text-emerald-300">
              SECURE
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-2 py-2">
            <div className="text-[7px] font-bold text-blue-100">
              DOCUMENT
            </div>
            <div className="mt-1 text-[8px] font-black text-cyan-300">
              VERIFIED
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-2 py-2">
            <div className="text-[7px] font-bold text-blue-100">
              STATUS
            </div>
            <div className="mt-1 text-[8px] font-black text-emerald-300">
              LIVE
            </div>
          </div>

        </div>

      </div>

      {/* FLOATING LIGHTS */}
      <div className="absolute right-[27%] top-7 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,1)]" />

      <div className="absolute right-[24%] bottom-8 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,1)]" />

      <div className="absolute right-[35%] top-10 h-1.5 w-1.5 rounded-full bg-blue-200 shadow-[0_0_10px_rgba(147,197,253,1)]" />

      <div className="absolute bottom-2 left-[8%] h-[2px] w-[84%] rounded-full bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent shadow-[0_0_14px_rgba(103,232,249,0.7)]" />

    </section>
  );
}