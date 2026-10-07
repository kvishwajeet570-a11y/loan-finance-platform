"use client";

import DsaSidebar from "@/components/dsa/DsaSidebar";

const stats = [
  ["📖", "42", "Courses Available", "↑ 8 this month", "blue"],
  ["✓", "18", "Courses Completed", "↑ 4 this month", "green"],
  ["◷", "26.5", "Learning Hours", "↑ 6.2 hrs", "purple"],
  ["🏆", "7", "Certificates Earned", "↑ 2 this month", "orange"],
];

const categories = [
  ["🏦", "Product Training", "12 Courses", "cyan"],
  ["📈", "Sales & Conversion", "9 Courses", "purple"],
  ["📄", "Process & KYC", "8 Courses", "green"],
  ["👥", "Customer Handling", "7 Courses", "orange"],
  ["🏛️", "Lender Knowledge", "6 Courses", "pink"],
  ["🚀", "Advanced DSA Skills", "5 Courses", "blue"],
];

const blogs = [
  ["Top 10 Tips to Increase Loan Approvals", "05 Oct 2026", "8 min read", "👨‍💼"],
  ["How to Handle Customer Rejections", "03 Oct 2026", "6 min read", "🤝"],
  ["Complete Guide to Home Loan in 2026", "01 Oct 2026", "10 min read", "🏠"],
];

const liveClasses = [
  ["08", "Oct", "How to Convert Hot Leads", "10:00 AM - 11:00 AM", "Rajesh Verma"],
  ["10", "Oct", "Home Loan Product Deep Dive", "03:00 PM - 04:00 PM", "Neha Sharma"],
  ["12", "Oct", "KYC & Documentation Process", "11:00 AM - 12:00 PM", "Amit Singh"],
];

const courses = [
  ["🏠", "Home Loan Essentials", "PRODUCT TRAINING", "51 min", "10 lessons", "4.8", "Intermediate", "25%"],
  ["👥", "Customer Conversation Skills", "SALES TRAINING", "31 min", "7 lessons", "4.6", "Beginner", "0%"],
  ["📋", "KYC & Documentation", "PROCESS TRAINING", "28 min", "5 lessons", "4.9", "Beginner", "100%"],
  ["🏛️", "Lender Policy Masterclass", "LENDER KNOWLEDGE", "46 min", "9 lessons", "4.7", "Advanced", "61%"],
];

export default function TrainingPage() {
  return (
    <>
      <DsaSidebar />

      <div className="min-h-screen bg-[#eef5ff] lg:pl-[278px]">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 h-[62px] border-b border-blue-100 bg-white/95 px-4 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="flex h-full items-center gap-3">
            <div className="relative flex-1 max-w-[585px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-blue-700">
                ⌕
              </span>
              <input
                className="h-[42px] w-full rounded-xl border border-blue-200 bg-[#f8fbff] pl-11 pr-4 text-sm outline-none focus:border-blue-500"
                placeholder="Search courses, blogs, live classes, training resources..."
              />
            </div>

            <button className="hidden h-[42px] rounded-xl border border-blue-100 bg-white px-4 text-xs font-bold text-slate-700 md:block">
              ▣ &nbsp; 01 Oct 2026 - 07 Oct 2026⌄
            </button>

            <button className="h-[42px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-black text-white shadow-lg shadow-blue-500/20">
              🎁 Refer & Earn
            </button>

            <button className="hidden h-10 w-10 rounded-xl border border-slate-200 bg-white md:block">
              🔔
            </button>

            <div className="hidden items-center gap-2 md:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-xs font-black text-white">
                DS
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">DSA Demo</p>
                <p className="text-[9px] text-slate-500">DSA Partner</p>
              </div>
              <span>⌄</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1540px] px-3 py-3 sm:px-5">

          {/* PREMIUM TRAINING HERO */}
          <section className="relative overflow-hidden rounded-[22px] border border-cyan-300 bg-[#071b63] shadow-[0_0_35px_rgba(0,110,255,.30)]">
  <img
    src="/dsa-training-banner.png"
    alt=""
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-[#031957]/75 via-[#073aa8]/55 to-[#351078]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_40%,rgba(0,240,255,.28),transparent_30%),radial-gradient(circle_at_65%_20%,rgba(139,92,246,.30),transparent_30%)]" />

            <div className="relative grid min-h-[250px] lg:grid-cols-[1fr_330px]">
              <div className="px-7 py-6 sm:px-10">
                <div className="inline-flex rounded-full border border-cyan-300/70 bg-slate-950/40 px-4 py-1.5 text-[11px] font-black tracking-[2px] text-white">
                  🏅 DSA TRAINING HUB
                </div>

                <p className="mt-2 text-[9px] font-bold tracking-[3px] text-cyan-200">
                  SKILLS • KNOWLEDGE • CERTIFICATIONS • GROWTH
                </p>

                <h1 className="mt-2 text-4xl font-black leading-[1.02] text-white sm:text-5xl">
                  Learn <span className="text-cyan-300">Today</span>
                  <br />
                  Lead <span className="text-purple-300">Tomorrow</span>
                </h1>

                <p className="mt-3 max-w-[650px] text-sm leading-5 text-blue-50">
                  Expert-led training, real-world case studies and industry
                  insights to help you grow your skills, increase conversions
                  and build a successful DSA business.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-lg">
                    Start Learning →
                  </button>

                  <button className="rounded-xl border border-white/50 bg-white/10 px-5 py-2.5 text-xs font-black text-white">
                    ▶ Watch Intro
                  </button>
                </div>
              </div>

              {/* LEARNING JOURNEY */}
              <div className="m-4 rounded-[20px] border border-cyan-300/50 bg-blue-950/45 p-5 backdrop-blur-xl">
                <h2 className="text-xl font-black text-white">
                  Your Learning Journey
                </h2>

                <div className="mt-3 flex items-center gap-5">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-[11px] border-cyan-400 border-r-blue-900 border-b-blue-900">
                    <span className="text-2xl font-black text-white">68%</span>
                  </div>

                  <div className="space-y-2 text-[11px] font-bold text-white">
                    <p>🟢 18 Completed</p>
                    <p>🟢 24 In Progress</p>
                    <p>🔵 7 Certificates</p>
                    <p>🟣 42 Total Courses</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-blue-300/40 bg-blue-600/30 p-3 text-[10px] font-bold text-white">
                  🚀 “Small steps today, bigger achievements tomorrow!”
                </div>
              </div>
            </div>
          </section>

          {/* STAT CARDS */}
          <section className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(([icon, value, title, trend, color]) => (
              <div
                key={title}
                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${
                      color === "blue"
                        ? "bg-blue-600"
                        : color === "green"
                        ? "bg-emerald-500"
                        : color === "purple"
                        ? "bg-purple-600"
                        : "bg-orange-500"
                    }`}
                  >
                    {icon}
                  </div>

                  <span className="text-[11px] font-black text-emerald-500">
                    {trend}
                  </span>
                </div>

                <p className="mt-3 text-3xl font-black text-[#07165f]">
                  {value}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  {title}
                </p>

                <div className="mt-3 flex h-5 items-end gap-1">
                  {[4,7,5,9,6,10,8,13,10,15].map((h,i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-t ${
                        color === "green"
                          ? "bg-emerald-400"
                          : color === "purple"
                          ? "bg-purple-400"
                          : color === "orange"
                          ? "bg-orange-400"
                          : "bg-blue-400"
                      }`}
                      style={{ height: `${h * 1.35}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* LEARNING + LIVE */}
          <section className="mt-3 grid gap-3 xl:grid-cols-[1fr_1fr_330px]">

            {/* CONTINUE */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#07165f]">
                    ▶ Continue Learning
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pick up where you left off
                  </p>
                </div>
                <button className="text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl bg-[#edf5ff]">
                <div className="relative flex h-[145px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#082b93] via-blue-600 to-indigo-900">
                  <div className="text-7xl">🏠</div>
                  <div className="absolute bottom-2 left-3 rounded bg-black/60 px-2 py-1 text-[9px] font-black text-white">
                    PERSONAL LOAN MASTERCLASS
                  </div>
                  <div className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-700">
                    ▶
                  </div>
                </div>

                <div className="p-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[9px] font-black text-blue-600">
                    PRODUCT TRAINING
                  </span>

                  <h3 className="mt-2 text-base font-black text-[#07165f]">
                    Personal Loan Masterclass
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Learn product positioning, eligibility, documentation and
                    lender selection with real examples.
                  </p>

                  <div className="mt-3 h-2 rounded-full bg-blue-100">
                    <div className="h-full w-[72%] rounded-full bg-cyan-500" />
                  </div>

                  <div className="mt-2 flex justify-between text-[9px] text-slate-500">
                    <span>▣ 6 of 8 lessons</span>
                    <span>◷ 42 min</span>
                    <span>Intermediate</span>
                    <b className="text-blue-600">72%</b>
                  </div>

                  <button className="mt-3 w-full rounded-lg bg-blue-600 py-2.5 text-xs font-black text-white">
                    Continue Learning →
                  </button>
                </div>
              </div>
            </div>

            {/* RECOMMENDED */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#07165f]">
                    🔥 Recommended For You
                  </h2>
                  <p className="text-xs text-slate-500">
                    Selected based on your learning journey
                  </p>
                </div>
                <button className="text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-3 rounded-xl bg-gradient-to-br from-[#fff5f1] to-white p-3">
                <div className="flex h-[145px] items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-fuchsia-600 to-purple-800 text-7xl">
                  📈
                </div>

                <span className="mt-3 inline-block rounded-full bg-purple-100 px-3 py-1 text-[9px] font-black text-purple-600">
                  SALES TRAINING
                </span>

                <h3 className="mt-2 text-base font-black text-[#07165f]">
                  Lead Conversion Blueprint
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Master the complete lead to disbursal journey with proven
                  strategies.
                </p>

                <div className="mt-3 flex gap-4 text-[9px] text-slate-500">
                  <span>◷ 36 min</span>
                  <span>▣ 6 lessons</span>
                  <span>Advanced</span>
                </div>

                <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 py-2.5 text-xs font-black text-white">
                  Start Learning →
                </button>
              </div>
            </div>

            {/* LIVE */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#07165f]">
                  🎥 Upcoming Live Classes
                </h2>
                <button className="text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {liveClasses.map(([day, month, title, time, trainer]) => (
                  <div
                    key={title}
                    className="flex gap-2 rounded-xl border border-blue-100 bg-[#f8fbff] p-2"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50">
                      <b className="text-xl text-[#07165f]">{day}</b>
                      <span className="text-[9px] font-bold text-slate-500">
                        {month}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black text-[#07165f]">
                        {title}
                      </p>
                      <p className="mt-1 text-[9px] text-slate-500">
                        ◷ {time}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        ♙ By: {trainer}
                      </p>
                    </div>

                    <button className="self-center rounded-lg bg-blue-600 px-3 py-2 text-[9px] font-black text-white">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CATEGORIES + BLOG */}
          <section className="mt-3 grid gap-3 xl:grid-cols-[1fr_330px]">
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#07165f]">
                    ▶ Training Categories
                  </h2>
                  <p className="text-xs text-slate-500">
                    Choose a category to start learning
                  </p>
                </div>

                <button className="text-xs font-bold text-blue-600">
                  View All Categories →
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                {categories.map(([icon, title, count, color]) => (
                  <div
                    key={title}
                    className={`rounded-xl p-3 text-center text-white shadow-sm ${
                      color === "cyan"
                        ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                        : color === "purple"
                        ? "bg-gradient-to-br from-purple-500 to-fuchsia-500"
                        : color === "green"
                        ? "bg-gradient-to-br from-emerald-400 to-green-500"
                        : color === "orange"
                        ? "bg-gradient-to-br from-orange-400 to-amber-500"
                        : color === "pink"
                        ? "bg-gradient-to-br from-pink-400 to-rose-500"
                        : "bg-gradient-to-br from-blue-400 to-indigo-500"
                    }`}
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl">
                      {icon}
                    </div>
                    <p className="mt-2 text-[10px] font-black">{title}</p>
                    <p className="mt-1 text-[9px]">{count}</p>
                    <div className="mt-1 text-right text-xs">→</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOG */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#07165f]">
                  📖 Latest from DSA Blog
                </h2>
                <button className="text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {blogs.map(([title, date, time, icon]) => (
                  <article
                    key={title}
                    className="flex gap-3 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 text-2xl">
                      {icon}
                    </div>

                    <div>
                      <h3 className="text-[11px] font-black text-[#07165f]">
                        {title}
                      </h3>
                      <p className="mt-1 text-[9px] text-slate-500">
                        Boost your approval rate with expert insights...
                      </p>
                      <p className="mt-1 text-[8px] text-slate-400">
                        ◷ {date} • {time}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* POPULAR COURSES + CERTIFICATE */}
          <section className="mt-3 grid gap-3 xl:grid-cols-[1fr_330px]">
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#07165f]">
                    💚 Popular Courses
                  </h2>
                  <p className="text-xs text-slate-500">
                    Most enrolled courses by DSA partners
                  </p>
                </div>

                <button className="text-xs font-bold text-blue-600">
                  View All Courses →
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {courses.map(
                  ([icon, title, category, time, lessons, rating, level, progress]) => (
                    <div
                      key={title}
                      className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 text-5xl">
                        {icon}
                        <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-[8px] font-bold text-white">
                          ▶
                        </span>
                      </div>

                      <div className="p-3">
                        <h3 className="text-[11px] font-black text-[#07165f]">
                          {title}
                        </h3>

                        <span className="mt-1 inline-block rounded bg-blue-50 px-2 py-1 text-[8px] font-black text-blue-600">
                          {category}
                        </span>

                        <div className="mt-2 flex flex-wrap gap-2 text-[8px] text-slate-500">
                          <span>◷ {time}</span>
                          <span>▣ {lessons}</span>
                        </div>

                        <div className="mt-2 flex justify-between text-[8px]">
                          <span>⭐ {rating}</span>
                          <span>{level}</span>
                        </div>

                        <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-cyan-500"
                            style={{ width: progress }}
                          />
                        </div>

                        <p className="mt-1 text-right text-[8px] font-bold text-blue-600">
                          {progress}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* CERTIFICATE */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#07165f]">
                  🏆 Your Certificates
                </h2>
                <button className="text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-blue-100">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 text-7xl">
                  🏅
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-[#07165f]">
                      KYC & Documentation
                    </h3>

                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-black text-emerald-600">
                      Completed
                    </span>
                  </div>

                  <p className="mt-2 text-[10px] text-slate-500">
                    Certificate of Completion
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    ◷ 15 Sep 2026
                  </p>

                  <p className="mt-2 text-[10px] font-bold text-blue-700">
                    ✓ DSA FinCorp
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-5 text-center text-[10px] font-semibold text-slate-400">
            DSA FinCorp • Training Hub • Learning • Certifications • Professional DSA Management
          </footer>
        </main>
      </div>
    </>
  );
}


