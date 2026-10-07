"use client";

import React from "react";
import DsaSidebar from "@/components/dsa/DsaSidebar";

const stats = [
  {
    icon: "▶",
    title: "Courses Available",
    value: "42",
    trend: "+8 this month",
    bg: "from-blue-500 to-indigo-600",
  },
  {
    icon: "✓",
    title: "Courses Completed",
    value: "18",
    trend: "+4 this month",
    bg: "from-emerald-400 to-teal-600",
  },
  {
    icon: "⏱",
    title: "Learning Hours",
    value: "26.5",
    trend: "+6.2 hrs",
    bg: "from-violet-500 to-purple-700",
  },
  {
    icon: "🏆",
    title: "Certificates",
    value: "7",
    trend: "+2 earned",
    bg: "from-orange-400 to-amber-600",
  },
];

const categories = [
  {
    icon: "💳",
    title: "Product Training",
    desc: "Learn loan products, eligibility and lender offerings.",
    courses: "12 Courses",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: "📈",
    title: "Sales & Conversion",
    desc: "Improve lead handling, pitching and conversion skills.",
    courses: "9 Courses",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: "📋",
    title: "Process & KYC",
    desc: "Master documentation, KYC and application processes.",
    courses: "8 Courses",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: "🤝",
    title: "Customer Handling",
    desc: "Build better communication and customer experience.",
    courses: "7 Courses",
    color: "from-orange-400 to-yellow-400",
  },
  {
    icon: "🏦",
    title: "Lender Knowledge",
    desc: "Understand lender policies, criteria and products.",
    courses: "6 Courses",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: "🚀",
    title: "Advanced DSA Skills",
    desc: "Advanced strategies to grow your DSA business.",
    courses: "5 Courses",
    color: "from-indigo-500 to-blue-600",
  },
];

const courses = [
  {
    icon: "💰",
    title: "Personal Loan Masterclass",
    category: "Product Training",
    duration: "42 min",
    lessons: "8 Lessons",
    progress: 72,
    level: "Intermediate",
    color: "from-blue-600 to-cyan-500",
  },
  {
    icon: "🎯",
    title: "Lead Conversion Blueprint",
    category: "Sales Training",
    duration: "36 min",
    lessons: "6 Lessons",
    progress: 48,
    level: "Advanced",
    color: "from-purple-600 to-violet-500",
  },
  {
    icon: "📑",
    title: "KYC & Documentation",
    category: "Process Training",
    duration: "28 min",
    lessons: "5 Lessons",
    progress: 100,
    level: "Beginner",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: "🏠",
    title: "Home Loan Essentials",
    category: "Product Training",
    duration: "51 min",
    lessons: "10 Lessons",
    progress: 25,
    level: "Intermediate",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: "📞",
    title: "Customer Conversation Skills",
    category: "Sales Training",
    duration: "31 min",
    lessons: "7 Lessons",
    progress: 0,
    level: "Beginner",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: "🏦",
    title: "Lender Policy Masterclass",
    category: "Lender Knowledge",
    duration: "46 min",
    lessons: "9 Lessons",
    progress: 61,
    level: "Advanced",
    color: "from-indigo-600 to-blue-500",
  },
];

const activity = [
  ["Personal Loan Masterclass", "Today, 06:42 PM", "72%", "▶"],
  ["KYC & Documentation", "Yesterday, 08:15 PM", "100%", "✓"],
  ["Lead Conversion Blueprint", "05 Oct 2026", "48%", "▶"],
  ["Home Loan Essentials", "03 Oct 2026", "25%", "▶"],
];

export default function AdvisorTrainingPage() {
  return (
    <>
      <DsaSidebar />

      <div className="min-h-screen bg-[#f2f7fc] lg:pl-[278px]">
        <main className="min-h-screen px-3 py-3 sm:px-5 lg:px-7">

          {/* TOP HEADER */}
          <header className="mb-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm">
            <div className="flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-[11px] text-slate-400">
              <span className="mr-3 text-blue-600">⌕</span>
              Search training, courses, products, lessons...
            </div>

            <button className="hidden h-10 rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-semibold text-slate-600 xl:block">
              📅 &nbsp; My Learning
            </button>

            <button className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-[11px] font-black text-white shadow-lg">
              🎓 Training Center
            </button>

            <button className="hidden h-10 w-10 rounded-xl border border-slate-200 bg-white lg:block">
              🔔
            </button>

            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-[10px] font-black text-white">
                DS
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-800">
                  DSA Demo
                </p>
                <p className="text-[8px] text-slate-400">
                  DSA Partner
                </p>
              </div>
            </div>
          </header>

          {/* PREMIUM HERO */}
          <section className="relative mb-3 overflow-hidden rounded-[24px] border border-cyan-300/40 bg-gradient-to-r from-[#04184c] via-[#123da4] to-[#32127c] px-6 py-7 text-white shadow-[0_15px_45px_rgba(30,64,175,.28)] sm:px-9 lg:min-h-[245px]">

            <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute right-[25%] top-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-cyan-200/20" />
            <div className="pointer-events-none absolute right-20 -bottom-40 h-80 w-80 rounded-full border border-blue-200/10" />

            <div className="relative grid items-center lg:grid-cols-[1fr_350px]">

              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-300/50 bg-blue-950/30 px-4 py-1.5 text-[10px] font-black tracking-[2px] text-cyan-100">
                  🎓 &nbsp; DSA TRAINING CENTER
                </div>

                <h1 className="text-[38px] font-black leading-[1.03] tracking-tight sm:text-[48px] lg:text-[52px]">
                  Learn.
                  <span className="text-cyan-300"> Grow.</span>
                  <br />
                  <span className="text-yellow-300">Lead.</span>{" "}
                  <span className="text-white">Succeed.</span>
                </h1>

                <p className="mt-3 max-w-[650px] text-[13px] leading-5 text-blue-100">
                  Upgrade your DSA skills with structured product training,
                  sales strategies, process guides and expert learning.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    🎯 Skill Development
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    💳 Product Knowledge
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    🚀 Sales Growth
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    🏆 Earn Certificates
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-[22px] border border-cyan-300/30 bg-[#071d5b]/70 p-5 backdrop-blur lg:mt-0">
                <p className="text-[19px] font-black">
                  Your Learning Journey
                </p>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[34px] font-black text-cyan-300">
                      68%
                    </p>
                    <p className="text-[9px] text-blue-200">
                      Overall completion
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[9px] font-black text-emerald-300">
                    ON TRACK
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[17px] font-black">18</p>
                    <p className="text-[8px] text-blue-200">Completed</p>
                  </div>
                  <div>
                    <p className="text-[17px] font-black">24</p>
                    <p className="text-[8px] text-blue-200">In Progress</p>
                  </div>
                  <div>
                    <p className="text-[17px] font-black">7</p>
                    <p className="text-[8px] text-blue-200">Certificates</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* KPI */}
          <section className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.title}
                className="rounded-[17px] border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,.06)]"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.bg} text-xl text-white shadow-lg`}>
                    {item.icon}
                  </div>

                  <span className="text-[10px] font-black text-emerald-500">
                    {item.trend}
                  </span>
                </div>

                <p className="mt-3 text-[10px] font-semibold text-slate-500">
                  {item.title}
                </p>

                <p className="mt-1 text-[27px] font-black text-[#071b58]">
                  {item.value}
                </p>
              </div>
            ))}
          </section>

          {/* CONTINUE LEARNING */}
          <section className="mb-3 rounded-[17px] border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  ▶
                </span>
                <div>
                  <h2 className="text-[18px] font-black text-[#071b58]">
                    Continue Learning
                  </h2>
                  <p className="text-[9px] text-slate-400">
                    Pick up exactly where you left off
                  </p>
                </div>
              </div>

              <button className="rounded-lg border border-blue-200 px-3 py-2 text-[9px] font-black text-blue-600">
                View My Learning →
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">

              <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl text-white shadow-lg">
                    💰
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-[8px] font-black text-blue-700">
                          PRODUCT TRAINING
                        </span>

                        <h3 className="mt-2 text-[15px] font-black text-[#071b58]">
                          Personal Loan Masterclass
                        </h3>

                        <p className="mt-1 text-[9px] text-slate-500">
                          Learn product positioning, eligibility,
                          documentation and lender selection.
                        </p>
                      </div>

                      <span className="text-[10px] font-black text-blue-700">
                        72%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[8px] text-slate-400">
                        6 of 8 lessons completed
                      </span>

                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-[9px] font-black text-white shadow">
                        Continue Course →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
                <p className="text-[10px] font-black text-orange-600">
                  🔥 RECOMMENDED NEXT
                </p>

                <h3 className="mt-2 text-[14px] font-black text-[#071b58]">
                  Lead Conversion Blueprint
                </h3>

                <p className="mt-1 text-[9px] leading-4 text-slate-500">
                  Master the complete journey from lead to successful
                  disbursal.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[8px] text-slate-500">
                    36 min • 6 lessons
                  </span>

                  <button className="rounded-lg bg-orange-500 px-3 py-2 text-[9px] font-black text-white">
                    Start →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* CATEGORIES */}
          <section className="mb-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[19px] font-black text-[#071b58]">
                  Explore Training
                </h2>
                <p className="text-[9px] text-slate-400">
                  Choose the skill you want to improve
                </p>
              </div>

              <button className="text-[10px] font-black text-blue-600">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-[17px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-xl text-white shadow-lg`}>
                      {item.icon}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[13px] font-black text-[#071b58]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[9px] leading-4 text-slate-400">
                        {item.desc}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-blue-600">
                          {item.courses}
                        </span>

                        <span className="text-[11px] font-black text-slate-400 group-hover:text-blue-600">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COURSE LIBRARY */}
          <section className="mb-3 rounded-[17px] border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[19px] font-black text-[#071b58]">
                  Training Library
                </h2>
                <p className="text-[9px] text-slate-400">
                  Learn at your own pace with expert-curated courses
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-lg bg-blue-600 px-3 py-2 text-[9px] font-black text-white">
                  All Courses
                </button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-500">
                  In Progress
                </button>
                <button className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-500 sm:block">
                  Completed
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.title}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${course.color}`}>
                    <div className="text-4xl drop-shadow-lg">
                      {course.icon}
                    </div>

                    <span className="absolute left-3 top-3 rounded-full bg-black/20 px-2 py-1 text-[8px] font-black text-white backdrop-blur">
                      {course.category}
                    </span>

                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-black text-slate-700">
                      {course.level}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-[13px] font-black text-[#071b58]">
                      {course.title}
                    </h3>

                    <div className="mt-2 flex gap-3 text-[8px] text-slate-400">
                      <span>⏱ {course.duration}</span>
                      <span>📚 {course.lessons}</span>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-[8px]">
                        <span className="font-semibold text-slate-400">
                          Progress
                        </span>
                        <span className="font-black text-blue-600">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className={`mt-4 w-full rounded-lg py-2.5 text-[9px] font-black ${
                        course.progress === 100
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {course.progress === 100
                        ? "✓ Completed"
                        : course.progress > 0
                        ? "Continue Learning →"
                        : "Start Course →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LOWER SECTION */}
          <section className="grid gap-3 xl:grid-cols-[1.2fr_.8fr]">

            {/* RECENT ACTIVITY */}
            <div className="rounded-[17px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[17px] font-black text-[#071b58]">
                    Recent Learning Activity
                  </h2>
                  <p className="text-[9px] text-slate-400">
                    Your latest training progress
                  </p>
                </div>

                <button className="text-[9px] font-black text-blue-600">
                  View History →
                </button>
              </div>

              <div className="space-y-2">
                {activity.map((item) => (
                  <div
                    key={item[0]}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      {item[3]}
                    </div>

                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-700">
                        {item[0]}
                      </p>
                      <p className="text-[8px] text-slate-400">
                        {item[1]}
                      </p>
                    </div>

                    <div className="w-24">
                      <div className="mb-1 text-right text-[8px] font-black text-blue-600">
                        {item[2]}
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                          style={{ width: item[2] }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CERTIFICATE */}
            <div className="relative overflow-hidden rounded-[17px] bg-gradient-to-br from-[#071b58] via-[#173e9f] to-[#35117d] p-5 text-white shadow-xl">

              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10" />

              <p className="text-[9px] font-black tracking-[2px] text-cyan-300">
                🏆 YOUR ACHIEVEMENT
              </p>

              <h2 className="mt-2 text-[22px] font-black">
                Keep Learning.
                <br />
                Keep Winning.
              </h2>

              <p className="mt-2 text-[9px] leading-4 text-blue-100">
                Complete more courses and unlock premium certificates,
                recognition badges and exclusive DSA rewards.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <p className="text-xl font-black">7</p>
                  <p className="text-[7px] text-blue-200">
                    Certificates
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <p className="text-xl font-black">18</p>
                  <p className="text-[7px] text-blue-200">
                    Completed
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <p className="text-xl font-black">68%</p>
                  <p className="text-[7px] text-blue-200">
                    Progress
                  </p>
                </div>
              </div>

              <button className="mt-5 rounded-xl bg-white px-5 py-2.5 text-[9px] font-black text-blue-700 shadow-lg">
                View My Certificates →
              </button>
            </div>
          </section>

          <footer className="mt-5 border-t border-slate-200 py-4 text-center text-[9px] text-slate-400">
            DSA FinCorp • Training Center • Learn • Grow • Perform • Professional DSA Partner Education
          </footer>

        </main>
      </div>
    </>
  );
}
