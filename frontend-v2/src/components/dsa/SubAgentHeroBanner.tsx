"use client";

export default function SubAgentHeroBanner() {
  return (
    <div className="relative mb-4 w-full overflow-hidden rounded-[14px]">
      <img
        src="/images/dsa/sub-agent-person-final.png?v=202609262220"
        alt="Add New Sub Agent"
        className="block h-auto w-full object-cover"
      />

      {/* LEFT CONTENT */}
      <div className="absolute inset-y-0 left-0 flex w-[48%] items-start">
        <div className="absolute inset-0 bg-gradient-to-r from-[#075FA5]/80 via-[#168BD0]/35 to-transparent" />

        <div className="relative z-10 px-[4%] pt-[6%] text-white">
          <h1 className="text-[clamp(22px,2.25vw,36px)] font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_2px_4px_rgba(0,42,80,0.55)]">
            <span className="text-white">Add New </span>
            <span className="text-[#FFD84D] drop-shadow-[0_2px_3px_rgba(70,45,0,0.45)]">
              Sub Agent
            </span>
          </h1>

          <p className="mt-2 max-w-[430px] text-[clamp(10px,0.85vw,14px)] font-medium leading-[1.45] text-white drop-shadow-[0_1px_3px_rgba(0,35,70,0.75)]">
            Register a new Sub Agent under your DSA account and
            <br />
            grow your business together.
          </p>

          <div className="mt-4 flex items-center gap-[clamp(10px,1.2vw,24px)]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#19C98B] text-lg font-bold text-white shadow-lg">
                +
              </span>
              <span className="text-[clamp(9px,0.72vw,12px)] font-bold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,35,70,0.8)]">
                Expand
                <br />
                Your Team
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#168BFF] text-lg font-bold text-white shadow-lg">
                ↗
              </span>
              <span className="text-[clamp(9px,0.72vw,12px)] font-bold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,35,70,0.8)]">
                Increase
                <br />
                Your Business
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5B82E] text-base font-bold text-white shadow-lg">
                ₹
              </span>
              <span className="text-[clamp(9px,0.72vw,12px)] font-bold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,35,70,0.8)]">
                Earn Higher
                <br />
                Commission
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GROW TOGETHER */}
      <div className="absolute left-[57%] top-[8%] z-20 hidden text-center md:block">
        <div className="font-serif text-[clamp(18px,1.7vw,28px)] font-bold italic leading-[0.9] text-white drop-shadow-[0_2px_5px_rgba(0,40,80,0.7)]">
          Grow
          <br />
          <span className="text-[#FFF3B0]">Together</span>
        </div>

        <div className="mt-0 text-[clamp(24px,2.2vw,38px)] leading-none text-white drop-shadow-[0_2px_4px_rgba(0,40,80,0.7)]">
          ↗
        </div>
      </div>
    </div>
  );
}

