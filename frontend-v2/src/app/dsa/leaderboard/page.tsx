"use client";

import React from "react";
import DsaSidebar from "@/components/dsa/DsaSidebar";

const kpis = [
  {
    icon: "👥",
    title: "Total Participants",
    value: "248",
    trend: "↑ 32%",
    bars: [22, 31, 28, 42, 38, 51, 48, 62, 58, 76],
    iconBg: "from-blue-500 to-indigo-600",
    bar: "from-blue-500 to-cyan-400",
  },
  {
    icon: "🏆",
    title: "Your Current Rank",
    value: "#24",
    trend: "↑ 12",
    bars: [18, 28, 25, 39, 34, 48, 45, 59, 54, 72],
    iconBg: "from-amber-400 to-orange-500",
    bar: "from-orange-400 to-yellow-400",
  },
  {
    icon: "⭐",
    title: "Your Total Points",
    value: "980",
    trend: "↑ 18%",
    bars: [20, 28, 25, 40, 36, 48, 45, 61, 57, 75],
    iconBg: "from-violet-500 to-purple-600",
    bar: "from-violet-500 to-purple-400",
  },
  {
    icon: "🎁",
    title: "Rewards Earned",
    value: "3",
    trend: "↑ 50%",
    bars: [18, 27, 23, 38, 34, 47, 42, 58, 54, 73],
    iconBg: "from-emerald-400 to-teal-500",
    bar: "from-emerald-400 to-teal-400",
  },
];

const topThree = [
  {
    position: "2",
    name: "Amit Verma",
    points: "2,410 Points",
    badge: "Star Performer",
    box: "bg-gradient-to-b from-blue-50 to-[#e8f1ff]",
    button: "bg-blue-600",
    medal: "🥈",
  },
  {
    position: "1",
    name: "Rajesh Kumar",
    points: "2,850 Points",
    badge: "🏆 TOP PERFORMER",
    box: "bg-gradient-to-b from-yellow-50 via-yellow-100 to-orange-50",
    button: "bg-orange-500",
    medal: "👑",
  },
  {
    position: "3",
    name: "Suresh Patel",
    points: "1,980 Points",
    badge: "Rising Star",
    box: "bg-gradient-to-b from-orange-50 to-[#fff3e7]",
    button: "bg-orange-400",
    medal: "🥉",
  },
];

const leaderboard = [
  {
    rank: "🥇",
    name: "Rajesh Kumar",
    state: "Maharashtra",
    referrals: "42",
    approved: "35",
    earnings: "₹ 4,85,000",
    achievements: "24",
    points: "2,850",
    trend: "↑ 12%",
  },
  {
    rank: "🥈",
    name: "Amit Verma",
    state: "Delhi",
    referrals: "38",
    approved: "32",
    earnings: "₹ 3,62,000",
    achievements: "22",
    points: "2,410",
    trend: "↑ 8%",
  },
  {
    rank: "🥉",
    name: "Suresh Patel",
    state: "Gujarat",
    referrals: "28",
    approved: "24",
    earnings: "₹ 2,86,000",
    achievements: "18",
    points: "1,980",
    trend: "↑ 15%",
  },
  {
    rank: "4",
    name: "Vikram Singh",
    state: "Rajasthan",
    referrals: "24",
    approved: "20",
    earnings: "₹ 2,24,000",
    achievements: "15",
    points: "1,650",
    trend: "↑ 10%",
  },
  {
    rank: "5",
    name: "Manoj Yadav",
    state: "Uttar Pradesh",
    referrals: "18",
    approved: "15",
    earnings: "₹ 1,85,000",
    achievements: "12",
    points: "1,320",
    trend: "↑ 6%",
  },
  {
    rank: "#24",
    name: "DSA Demo (You)",
    state: "Madhya Pradesh",
    referrals: "12",
    approved: "8",
    earnings: "₹ 98,500",
    achievements: "12",
    points: "980",
    trend: "↑ 18%",
    you: true,
  },
];

const stateData = [
  ["1", "Maharashtra", "48 DSAs"],
  ["2", "Delhi", "42 DSAs"],
  ["3", "Gujarat", "36 DSAs"],
  ["4", "Uttar Pradesh", "28 DSAs"],
  ["5", "Rajasthan", "24 DSAs"],
];

const achievementData = [
  ["🏆", "Most Referrals", "Rajesh Kumar", "42"],
  ["💰", "Highest Earnings", "Amit Verma", "₹ 4,85,000"],
  ["🎯", "Most Approvals", "Rajesh Kumar", "35"],
  ["🚀", "Fastest Growth", "Suresh Patel", "180%"],
  ["🎁", "Most Rewards", "Amit Verma", "8"],
];

function MiniBars({
  bars,
  color,
}: {
  bars: number[];
  color: string;
}) {
  return (
    <div className="mt-3 flex h-8 items-end gap-[3px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-[4px] bg-gradient-to-t ${color}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function DsaLeaderboardPage() {
  return (
    <>
      <DsaSidebar />

      <div className="min-h-screen bg-[#f1f6fc] lg:pl-[278px]">
        <main className="min-h-screen px-3 py-3 sm:px-5 lg:px-7">

          {/* =====================================================
              TOP HEADER
          ===================================================== */}
          <header className="mb-3 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-[0_4px_18px_rgba(30,64,175,.07)]">

            <div className="flex h-10 flex-1 items-center rounded-xl border border-[#dbe7f7] bg-white px-4 text-[11px] text-slate-400">
              <span className="mr-3 text-blue-600">⌕</span>
              Search by customer name, mobile number, application no...
            </div>

            <button className="hidden h-10 rounded-xl border border-[#dbe7f7] bg-white px-4 text-[11px] font-semibold text-slate-600 xl:block">
              ▣ &nbsp; 01 Oct 2026 - 07 Oct 2026
              <span className="ml-2">⌄</span>
            </button>

            <button className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(37,99,235,.25)]">
              🎁 Refer &amp; Earn
            </button>

            <button className="hidden h-10 w-10 rounded-xl border border-slate-200 bg-white text-sm lg:block">
              🔔
            </button>

            <div className="hidden h-10 items-center gap-2 rounded-xl bg-white px-2 lg:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-[10px] font-black text-white">
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
              <span className="ml-2 text-xs">⌄</span>
            </div>
          </header>

          {/* =====================================================
              PREMIUM HERO
          ===================================================== */}
          <section className="relative mb-3 overflow-hidden rounded-[22px] border border-cyan-300/50 bg-gradient-to-r from-[#031a50] via-[#103eaa] to-[#30117d] px-6 py-6 text-white shadow-[0_12px_40px_rgba(30,64,175,.28)] sm:px-8 lg:min-h-[245px] lg:px-10">

            {/* glow */}
            <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="pointer-events-none absolute right-[30%] top-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full border border-cyan-300/20" />
            <div className="pointer-events-none absolute right-12 -bottom-44 h-80 w-80 rounded-full border border-blue-200/10" />

            <div className="relative grid items-center lg:grid-cols-[1fr_360px]">

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-blue-950/30 px-4 py-1.5 text-[10px] font-black tracking-[2px] text-cyan-100">
                  🏆 &nbsp; DSA LEADERBOARD
                </div>

                <h1 className="text-[38px] font-black leading-[1.02] tracking-tight sm:text-[48px] lg:text-[52px]">
                  Top Performers
                  <br />
                  <span className="text-white">Lead.</span>{" "}
                  <span className="text-cyan-300">Earn.</span>{" "}
                  <span className="text-yellow-300">Inspire.</span>
                </h1>

                <p className="mt-3 max-w-[650px] text-[13px] leading-5 text-blue-100">
                  Track top performing DSA partners, climb the leaderboard
                  and win exclusive rewards with DSA FinCorp.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    🏅 Monthly Rankings
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    ⭐ Earn Rewards
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    🎁 Get Recognition
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[9px] font-bold">
                    📊 Be a Top Performer
                  </span>
                </div>
              </div>

              {/* HERO RIGHT */}
              <div className="mt-6 rounded-[22px] border border-cyan-300/35 bg-[#071e5a]/65 p-5 backdrop-blur lg:mt-0">
                <p className="text-[20px] font-black leading-tight">
                  Your Performance
                </p>

                <p className="text-[20px] font-black text-yellow-300">
                  Keep Climbing!
                </p>

                <div className="mt-5 space-y-3 text-[11px] font-semibold">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
                      🏆
                    </span>
                    Improve Your Rank
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500">
                      📊
                    </span>
                    Earn More Points
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500">
                      🎁
                    </span>
                    Win Exciting Rewards
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 text-slate-900">
                      ⭐
                    </span>
                    Be a Top DSA
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* =====================================================
              KPI CARDS
          ===================================================== */}
          <section className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item) => (
              <div
                key={item.title}
                className="rounded-[16px] border border-slate-200/90 bg-white px-4 py-4 shadow-[0_4px_18px_rgba(15,23,42,.06)]"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.iconBg} text-xl shadow-lg`}
                  >
                    {item.icon}
                  </div>

                  <span className="text-[13px] font-black text-emerald-500">
                    {item.trend}
                  </span>
                </div>

                <p className="mt-3 text-[10px] font-semibold text-[#172e66]">
                  {item.title}
                </p>

                <p className="mt-1 text-[25px] font-black leading-none text-[#061957]">
                  {item.value}
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  vs. previous month
                </p>

                <MiniBars bars={item.bars} color={item.bar} />
              </div>
            ))}
          </section>

          {/* =====================================================
              TOP 3 + FILTERS
          ===================================================== */}
          <section className="mb-3 grid gap-3 xl:grid-cols-[1.35fr_1fr]">

            {/* TOP THREE */}
            <div className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,.05)]">

              <div className="mb-2 flex items-start gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <h2 className="text-[18px] font-black text-[#09205c]">
                    Top 3 DSAs This Month
                  </h2>
                  <p className="text-[9px] text-slate-400">
                    Leading the way with outstanding performance
                  </p>
                </div>
              </div>

              <div className="grid h-[225px] grid-cols-3 items-end gap-2">

                {topThree.map((item) => (
                  <div
                    key={item.name}
                    className={`relative flex h-[150px] flex-col items-center justify-end rounded-t-[20px] px-2 pb-4 pt-10 ${item.box} ${
                      item.position === "1"
                        ? "h-[205px] shadow-[0_12px_30px_rgba(245,158,11,.18)]"
                        : ""
                    }`}
                  >

                    <div className="absolute -top-9 flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-br from-slate-600 to-slate-950 text-lg font-black text-white shadow-xl">
                      {item.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </div>

                    <div className="absolute -top-7 text-3xl">
                      {item.medal}
                    </div>

                    <p className="mt-5 text-[12px] font-black text-[#10255e]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-[12px] font-black text-blue-700">
                      {item.points}
                    </p>

                    <span
                      className={`mt-3 rounded-full px-4 py-1 text-[8px] font-black text-white ${item.button}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                ))}

              </div>
            </div>

            {/* FILTERS */}
            <div className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,.05)]">

              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  ⚙
                </span>

                <div>
                  <h2 className="text-[18px] font-black text-[#09205c]">
                    Leaderboard Filters
                  </h2>
                  <p className="text-[9px] text-slate-400">
                    Customize your leaderboard view
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {["This Month", "All States", "Total Points"].map((x) => (
                  <button
                    key={x}
                    className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600"
                  >
                    {x}
                    <span>⌄</span>
                  </button>
                ))}
              </div>

              <button className="mt-2 h-10 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-[11px] font-black text-white shadow-lg">
                Apply Filters
              </button>

              <div className="mt-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                <p className="text-[11px] font-black text-blue-700">
                  👑 &nbsp; Your Rank This Month
                </p>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-blue-700 text-xs font-black text-white shadow-md">
                      DS
                    </div>

                    <div>
                      <p className="text-[12px] font-black text-slate-800">
                        DSA Demo (You)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Rank #24 of 248
                      </p>
                    </div>
                  </div>

                  <div className="hidden grid-cols-3 gap-7 md:grid">
                    <div>
                      <p className="text-[8px] text-slate-400">
                        Total Points
                      </p>
                      <p className="text-[13px] font-black">980</p>
                      <p className="text-[8px] font-bold text-emerald-500">
                        ↑ 18%
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] text-slate-400">
                        Achievements
                      </p>
                      <p className="text-[13px] font-black">12</p>
                      <p className="text-[8px] font-bold text-emerald-500">
                        ↑ 33%
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] text-slate-400">
                        Rewards
                      </p>
                      <p className="text-[13px] font-black">3</p>
                      <p className="text-[8px] font-bold text-emerald-500">
                        ↑ 50%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              COMPLETE LEADERBOARD + RIGHT CARDS
          ===================================================== */}
          <section className="grid gap-3 xl:grid-cols-[1fr_300px]">

            {/* TABLE */}
            <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,.05)]">

              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                    📊
                  </span>

                  <div>
                    <h2 className="text-[17px] font-black text-[#09205c]">
                      Complete Leaderboard
                    </h2>
                    <p className="text-[9px] text-slate-400">
                      Top performing DSA partners based on achievements,
                      referrals and earnings
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px]">
                  <thead>
                    <tr className="bg-[#f7faff] text-left text-[9px] font-black uppercase text-[#193675]">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">DSA Name</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Total Referrals</th>
                      <th className="px-4 py-3">Approved</th>
                      <th className="px-4 py-3">Total Earnings</th>
                      <th className="px-4 py-3">Achievements</th>
                      <th className="px-4 py-3">Points</th>
                      <th className="px-4 py-3">Trend</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaderboard.map((row) => (
                      <tr
                        key={row.name}
                        className={`border-t border-slate-100 ${
                          row.you
                            ? "bg-blue-50/90"
                            : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-[11px] font-black text-slate-500">
                          {row.rank}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-900 text-[9px] font-black text-white">
                              {row.name
                                .split(" ")
                                .map((x) => x[0])
                                .join("")}
                            </div>

                            <span
                              className={`text-[10px] font-black ${
                                row.you
                                  ? "text-blue-700"
                                  : "text-slate-700"
                              }`}
                            >
                              {row.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-[10px] text-slate-600">
                          {row.state}
                        </td>

                        <td className="px-4 py-3 text-[10px] text-slate-600">
                          {row.referrals}
                        </td>

                        <td className="px-4 py-3 text-[10px] text-slate-600">
                          {row.approved}
                        </td>

                        <td className="px-4 py-3 text-[10px] font-black text-emerald-600">
                          {row.earnings}
                        </td>

                        <td className="px-4 py-3 text-[10px] text-slate-600">
                          {row.achievements}
                        </td>

                        <td className="px-4 py-3 text-[11px] font-black text-blue-700">
                          {row.points}
                        </td>

                        <td className="px-4 py-3 text-[10px] font-black text-emerald-500">
                          {row.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT CARDS */}
            <div className="space-y-3">

              {/* STATE */}
              <div className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    🌎
                  </span>
                  <h3 className="text-[15px] font-black text-[#09205c]">
                    Top Performers by State
                  </h3>
                </div>

                <div className="mt-3 space-y-2">
                  {stateData.map((item) => (
                    <div
                      key={item[1]}
                      className="flex items-center justify-between border-b border-slate-100 py-1.5 text-[10px]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-black ${
                            item[0] === "1"
                              ? "text-orange-500"
                              : "text-blue-600"
                          }`}
                        >
                          {item[0]}
                        </span>
                        <span className="font-semibold text-slate-700">
                          {item[1]}
                        </span>
                      </div>

                      <span className="font-black text-slate-700">
                        {item[2]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACHIEVEMENTS */}
              <div className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    ⭐
                  </span>
                  <h3 className="text-[15px] font-black text-[#09205c]">
                    Top Achievements
                  </h3>
                </div>

                <div className="mt-3 space-y-3">
                  {achievementData.map((item) => (
                    <div
                      key={item[1]}
                      className="flex items-center gap-2 text-[9px]"
                    >
                      <span className="text-base">{item[0]}</span>

                      <span className="flex-1 text-slate-500">
                        {item[1]}
                      </span>

                      <span className="text-right font-bold text-slate-700">
                        {item[2]}
                        <br />
                        <b className="text-[9px] text-[#0b1d59]">
                          {item[3]}
                        </b>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-5 border-t border-slate-200 py-4 text-center text-[10px] text-slate-400">
            DSA FinCorp • Leaderboard • Rewards • Recognition • Professional DSA Management
          </footer>

        </main>
      </div>
    </>
  );
}
