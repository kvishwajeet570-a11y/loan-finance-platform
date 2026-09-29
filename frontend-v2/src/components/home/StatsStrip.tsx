"use client";

type SymbolProps = {
  type: "customers" | "loans" | "dsa" | "applications";
};

function PremiumSymbol({ type }: SymbolProps) {
  return (
    <div className="relative h-[64px] w-[64px] shrink-0">
      {/* Outer glow */}
      <div
        className={`absolute inset-0 rounded-full blur-md ${
          type === "loans" || type === "applications"
            ? "bg-emerald-200/60"
            : "bg-blue-200/70"
        }`}
      />

      {/* Main outer circle */}
      <div
        className={`absolute inset-0 rounded-full border-[2px] bg-white ${
          type === "loans" || type === "applications"
            ? "border-emerald-300"
            : "border-blue-300"
        }`}
      />

      {/* Decorative circle */}
      <div
        className={`absolute inset-[4px] rounded-full border-[1.5px] ${
          type === "loans" || type === "applications"
            ? "border-emerald-200 bg-emerald-50/70"
            : "border-blue-200 bg-blue-50/80"
        }`}
      />

      {/* Inner circle */}
      <div className="absolute inset-[9px] rounded-full border-2 border-white bg-white shadow-[0_4px_14px_rgba(30,80,150,0.15)]" />

      {/* CUSTOM SYMBOL */}
      <svg
        viewBox="0 0 64 64"
        className={`absolute inset-0 z-10 h-full w-full ${
          type === "loans" || type === "applications"
            ? "text-emerald-500"
            : "text-blue-600"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* CUSTOM CUSTOMERS SYMBOL */}
        {type === "customers" && (
          <>
            <circle cx="32" cy="25" r="7" fill="currentColor" stroke="none" />
            <circle cx="20" cy="29" r="5" fill="currentColor" stroke="none" />
            <circle cx="44" cy="29" r="5" fill="currentColor" stroke="none" />

            <path
              d="M18 45c1-7 6-11 14-11s13 4 14 11"
              fill="currentColor"
              stroke="none"
            />

            <path
              d="M10 44c1-5 4-8 10-8 3 0 5 1 7 3"
              strokeWidth="3"
            />

            <path
              d="M54 44c-1-5-4-8-10-8-3 0-5 1-7 3"
              strokeWidth="3"
            />
          </>
        )}

        {/* CUSTOM LOAN / MONEY SYMBOL */}
        {type === "loans" && (
          <>
            <circle
              cx="32"
              cy="32"
              r="15"
              fill="currentColor"
              stroke="none"
              opacity="0.12"
            />

            <circle cx="32" cy="32" r="13" />

            <path d="M32 23v18" />
            <path d="M27 27c1-2 3-3 5-3 3 0 5 2 5 4s-2 4-5 4-5 2-5 4 2 4 5 4c2 0 4-1 5-3" />

            <path d="M21 17l4-3" />
            <path d="M43 17l-4-3" />
          </>
        )}

        {/* CUSTOM DSA PARTNERS SYMBOL */}
        {type === "dsa" && (
          <>
            <circle cx="32" cy="22" r="6" fill="currentColor" stroke="none" />

            <circle cx="19" cy="27" r="4.5" fill="currentColor" stroke="none" />
            <circle cx="45" cy="27" r="4.5" fill="currentColor" stroke="none" />

            <path
              d="M20 45c1-6 5-10 12-10s11 4 12 10"
              fill="currentColor"
              stroke="none"
            />

            <path
              d="M10 43c1-5 4-7 9-7 2 0 4 1 6 2"
              strokeWidth="3"
            />

            <path
              d="M54 43c-1-5-4-7-9-7-2 0-4 1-6 2"
              strokeWidth="3"
            />

            <path d="M25 49h14" strokeWidth="3.5" />
          </>
        )}

        {/* CUSTOM APPLICATION / APPROVAL SYMBOL */}
        {type === "applications" && (
          <>
            <circle
              cx="32"
              cy="32"
              r="15"
              fill="currentColor"
              stroke="none"
              opacity="0.12"
            />

            <circle cx="32" cy="32" r="14" />

            <path
              d="M24 32l5 5 11-12"
              strokeWidth="4"
            />

            <path d="M32 14v4" />
            <path d="M32 46v4" />
            <path d="M14 32h4" />
            <path d="M46 32h4" />
          </>
        )}
      </svg>

      {/* Highlight */}
      <span className="absolute left-[15px] top-[8px] z-20 h-[6px] w-[15px] rounded-full bg-white/90" />
    </div>
  );
}

const stats = [
  {
    label: "Customers",
    type: "customers" as const,
  },
  {
    label: "Loans Processed",
    type: "loans" as const,
  },
  {
    label: "DSA Partners",
    type: "dsa" as const,
  },
  {
    label: "Applications",
    type: "applications" as const,
  },
];

export default function StatsStrip() {
  return (
    <section className="relative z-20 mx-auto -mt-7 w-full max-w-[1100px] px-4">
      <div className="grid grid-cols-2 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_14px_38px_rgba(15,45,90,0.14)] md:grid-cols-4">

        {stats.map(({ label, type }, index) => (
          <div
            key={label}
            className="group relative flex min-h-[102px] items-center gap-4 px-5 py-4 transition-all duration-300 hover:bg-blue-50/30"
          >

            {/* Divider */}
            {index !== 3 && (
              <div className="absolute right-0 top-1/2 hidden h-14 -translate-y-1/2 border-r border-slate-200 md:block" />
            )}

            <PremiumSymbol type={type} />

            {/* Content */}
            <div className="min-w-0">
              <div className="text-[21px] font-black leading-none text-[#142f63]">
                —
              </div>

              <div className="mt-1 whitespace-nowrap text-[11px] font-semibold text-slate-500">
                {label}
              </div>

              <div className="mt-2 h-[3px] w-10 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full w-7 rounded-full transition-all duration-300 group-hover:w-10 ${
                    type === "loans" || type === "applications"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  }`}
                />
              </div>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
