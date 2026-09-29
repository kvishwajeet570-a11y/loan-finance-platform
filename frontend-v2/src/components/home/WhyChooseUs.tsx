import {
  ArrowRight,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  Zap,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Zap,
    title: "Simple & Fast Process",
    description: "Get started with a seamless digital experience.",
    points: [
      "Easy online application",
      "Minimal documentation",
      "Faster processing",
    ],
    label: "Quick Processing",
    tone: "blue",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Secure Platform",
    description: "Your information is always protected with us.",
    points: [
      "Advanced data security",
      "Privacy focused",
      "Safe & reliable platform",
    ],
    label: "Secure & Private",
    tone: "green",
  },
  {
    number: "03",
    icon: UsersRound,
    title: "Customer Focused",
    description: "Your needs are at the center of everything we do.",
    points: [
      "Personalized support",
      "Quick assistance",
      "Transparent communication",
    ],
    label: "Customer First",
    tone: "purple",
  },
  {
    number: "04",
    icon: Handshake,
    title: "Strong Partner Network",
    description: "Growing together with customers, DSAs and financial partners.",
    points: [
      "Wide partner ecosystem",
      "Better loan options",
      "Long-term relationships",
    ],
    label: "Trusted Network",
    tone: "orange",
  },
];

const toneStyles: Record<
  string,
  {
    icon: string;
    iconBg: string;
    border: string;
    glow: string;
    check: string;
    link: string;
    number: string;
  }
> = {
  blue: {
    icon: "text-blue-600",
    iconBg: "from-sky-400 to-blue-600",
    border: "hover:border-blue-300",
    glow: "bg-blue-100/70",
    check: "text-blue-600",
    link: "text-blue-700",
    number: "text-blue-100",
  },
  green: {
    icon: "text-emerald-600",
    iconBg: "from-emerald-400 to-green-600",
    border: "hover:border-emerald-300",
    glow: "bg-emerald-100/60",
    check: "text-emerald-600",
    link: "text-emerald-700",
    number: "text-emerald-100",
  },
  purple: {
    icon: "text-violet-600",
    iconBg: "from-violet-400 to-indigo-600",
    border: "hover:border-violet-300",
    glow: "bg-violet-100/60",
    check: "text-violet-600",
    link: "text-indigo-700",
    number: "text-violet-100",
  },
  orange: {
    icon: "text-orange-600",
    iconBg: "from-amber-400 to-orange-600",
    border: "hover:border-orange-300",
    glow: "bg-orange-100/60",
    check: "text-orange-600",
    link: "text-orange-700",
    number: "text-orange-100",
  },
};

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 lg:py-24">
      {/* Decorative background */}
      <div className="pointer-events-none absolute left-[-150px] top-[-120px] h-[330px] w-[330px] rounded-full bg-blue-100/70 blur-[2px]" />
      <div className="pointer-events-none absolute left-[-70px] top-[-20px] h-[240px] w-[240px] rounded-full border-[70px] border-blue-100/40" />
      <div className="pointer-events-none absolute right-[-140px] bottom-[120px] h-[300px] w-[300px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-5 lg:px-8">
        {/* Heading */}
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            <Sparkles size={14} />
            Why India Loan Finance
          </div>

          <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-[#07132f] sm:text-5xl lg:text-[54px]">
            Built around{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              simplicity and trust.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
            Everything we build is focused on creating a better financial
            experience for customers, DSAs, and our growing partner network.
          </p>

          {/* Side message */}
          <div className="absolute -right-2 top-8 hidden rotate-[-5deg] xl:block">
            <div className="font-serif text-xl italic leading-7 text-blue-900/70">
              Your
              <br />
              Financial Growth
              <br />
              Partner
            </div>
            <div className="ml-5 mt-2 h-1 w-28 rotate-[-7deg] rounded-full bg-blue-500" />
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;
            const style = toneStyles[item.tone];

            return (
              <article
                key={item.number}
                className={`group relative min-h-[425px] overflow-hidden rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_65px_rgba(15,23,42,0.13)] ${style.border}`}
              >
                {/* Decorative glow */}
                <div
                  className={`absolute -bottom-20 -right-16 h-48 w-48 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${style.glow}`}
                />

                {/* Number */}
                <div
                  className={`absolute right-6 top-5 text-[46px] font-black tracking-tight ${style.number}`}
                >
                  {item.number}
                </div>

                {/* Icon */}
                <div
                  className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-[20px] bg-gradient-to-br ${style.iconBg} text-white shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2`}
                >
                  <Icon size={35} strokeWidth={2.1} />
                </div>

                {/* Label */}
                <div
                  className={`relative mt-7 text-[10px] font-black uppercase tracking-[0.18em] ${style.icon}`}
                >
                  {item.label}
                </div>

                {/* Content */}
                <h3 className="relative mt-2 max-w-[290px] text-[23px] font-black leading-tight tracking-tight text-[#07132f]">
                  {item.title}
                </h3>

                <p className="relative mt-3 max-w-[300px] text-sm font-medium leading-6 text-slate-500">
                  {item.description}
                </p>

                {/* Points */}
                <div className="relative mt-5 space-y-2.5">
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2.5 text-sm font-medium text-slate-600"
                    >
                      <CheckCircle2
                        size={19}
                        strokeWidth={2.5}
                        className={`shrink-0 ${style.check}`}
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom link */}
                <div className="absolute bottom-6 left-7 right-7 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span
                    className={`text-sm font-black ${style.link} transition-transform group-hover:translate-x-1`}
                  >
                    Learn More
                  </span>

                  <ArrowRight
                    size={19}
                    className={`${style.link} transition-transform group-hover:translate-x-1`}
                  />
                </div>

                {/* Decorative bottom illustration */}
                <div className="pointer-events-none absolute bottom-0 right-0 opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:opacity-30">
                  {item.tone === "blue" && (
                    <div className="flex h-20 w-24 items-end justify-center rounded-tl-[70px] bg-blue-200">
                      <div className="mb-3 h-10 w-7 rounded-md bg-blue-500" />
                    </div>
                  )}

                  {item.tone === "green" && (
                    <div className="flex h-20 w-24 items-center justify-center rounded-tl-[70px] bg-emerald-200">
                      <ShieldCheck size={48} className="text-emerald-600" />
                    </div>
                  )}

                  {item.tone === "purple" && (
                    <div className="flex h-20 w-24 items-end justify-center rounded-tl-[70px] bg-violet-200">
                      <UsersRound size={55} className="mb-2 text-violet-600" />
                    </div>
                  )}

                  {item.tone === "orange" && (
                    <div className="flex h-20 w-24 items-end justify-center rounded-tl-[70px] bg-orange-200">
                      <TrendingUp
                        size={58}
                        className="mb-2 text-orange-600"
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Confidence banner */}
        <div className="relative mt-7 overflow-hidden rounded-[30px] bg-gradient-to-r from-[#061a48] via-[#073b8f] to-[#079bd0] shadow-[0_22px_70px_rgba(7,59,143,0.22)]">
          <div className="absolute right-[-100px] top-[-150px] h-[350px] w-[350px] rounded-full bg-cyan-400/20 blur-2xl" />
          <div className="absolute bottom-[-180px] left-[35%] h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 px-7 py-8 sm:px-10 lg:flex-row lg:items-center lg:px-12 lg:py-9">
            {/* Banner text */}
            <div className="lg:w-[42%]">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">
                <ShieldCheck size={14} />
                Built for confidence
              </div>

              <h3 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
                A simpler way to move forward{" "}
                <span className="text-cyan-300">financially.</span>
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                We are here to make your financial journey easier, safer and
                more rewarding.
              </p>
            </div>

            {/* Banner features */}
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: UsersRound,
                  first: "Customer",
                  second: "Focus",
                },
                {
                  icon: ShieldCheck,
                  first: "Data",
                  second: "Protection",
                },
                {
                  icon: Zap,
                  first: "Faster",
                  second: "Assistance",
                },
                {
                  icon: TrendingUp,
                  first: "Strong",
                  second: "Network",
                },
              ].map(({ icon: FeatureIcon, first, second }) => {

                return (
                  <div
                    key={`${first}-${second}`}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur">
                      <FeatureIcon size={23} />
                    </div>
                    <div className="mt-2 text-sm font-black text-white">
                      {first}
                    </div>
                    <div className="text-[11px] font-medium text-blue-100">
                      {second}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <a
                href="/register"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-black text-[#073b8f] shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                Get Started Now
                <ArrowRight size={18} />
              </a>

              <div className="mt-3 text-center text-[10px] font-bold text-blue-100">
                Your Growth Our Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

