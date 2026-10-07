"use client";

import React, { useState } from "react";
import DsaSidebar from "@/components/dsa/DsaSidebar";

const rows = [
  ["🥇", "Rajesh Kumar", "Maharashtra", "42", "35", "₹ 4,85,000", "24", "2,850", "+12%"],
  ["🥈", "Amit Verma", "Delhi", "38", "32", "₹ 3,62,000", "22", "2,410", "+8%"],
  ["🥉", "Suresh Patel", "Gujarat", "28", "24", "₹ 2,86,000", "18", "1,980", "+15%"],
  ["4", "Vikram Singh", "Rajasthan", "24", "20", "₹ 2,24,000", "15", "1,650", "+10%"],
  ["5", "Manoj Yadav", "Uttar Pradesh", "18", "15", "₹ 1,85,000", "12", "1,320", "+6%"],
];

export default function LeaderboardPage() {
  const [state, setState] = useState("All States");
  const [sort, setSort] = useState("Total Points");

  const filtered = rows.filter(
    (r) => state === "All States" || r[2] === state
  );

  return (
    <>
      <DsaSidebar />

      <div className="min-h-screen bg-[#f3f7fd] lg:pl-[278px]">
        <main className="px-4 py-5 sm:px-6 lg:px-7">

          {/* TOP BAR */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex h-12 flex-1 items-center rounded-2xl border bg-white px-4 shadow-sm lg:max-w-[590px]">
              <span className="mr-3 text-blue-600">⌕</span>
              <span className="text-xs text-slate-400">
                Search by customer name, mobile number, application no...
              </span>
            </div>

            <button className="rounded-xl border bg-white px-5 py-3 text-xs font-bold">
              📅 01 Oct 2026 - 07 Oct 2026
            </button>

            <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg">
              🎁 Refer & Earn
            </button>

            <button className="relative h-11 w-11 rounded-xl border bg-white">
              🔔
              <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[9px] text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-xs font-black text-white">
                DS
              </div>
              <div>
                <p className="text-xs font-black">DSA Demo</p>
                <p className="text-[9px] text-slate-400">DSA Partner</p>
              </div>
            </div>
          </div>

          {/* HERO */}
          <section className="relative mb-4 overflow-hidden rounded-[25px] bg-gradient-to-br from-[#06255f] via-[#111d66] to-[#35106d] px-7 py-7 text-white shadow-xl sm:px-10">
            <div className="absolute right-10 top-5 text-[100px] opacity-20">
              🏆
            </div>

            <div className="relative max-w-3xl">
              <div className="mb-4 inline-block rounded-full border border-cyan-400/40 bg-blue-400/20 px-4 py-2 text-[10px] font-black tracking-[2px]">
                🏆 DSA LEADERBOARD
              </div>

              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Top Performers
                <br />
                Lead. <span className="text-cyan-300">Earn.</span>{" "}
                <span className="text-yellow-300">Inspire.</span>
              </h1>

              <p className="mt-3 text-sm text-blue-100 sm:text-base">
                Track top performing DSA partners, climb the leaderboard
                and win exclusive rewards with DSA FinCorp.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold">
                  🏅 Monthly Rankings
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold">
                  ⭐ Earn Rewards
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold">
                  🎁 Get Recognition
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold">
                  📊 Be a Top Performer
                </span>
              </div>
            </div>

            <div className="absolute right-8 top-8 hidden w-64 rounded-3xl border border-blue-300/30 bg-[#08245a]/80 p-5 lg:block">
              <h3 className="text-lg font-black">
                Your Performance
                <br />
                Keep <span className="text-yellow-300">Climbing!</span>
              </h3>

              <div className="mt-4 space-y-3 text-xs font-bold">
                <p>🏆 Improve Your Rank</p>
                <p>📈 Earn More Points</p>
                <p>🎁 Win Exciting Rewards</p>
                <p>⭐ Be a Top DSA</p>
              </div>
            </div>
          </section>

          {/* KPI CARDS */}
          <section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["👥", "Total Participants", "248", "↑ 32%", "blue"],
              ["🏆", "Your Current Rank", "#24", "↑ 12", "orange"],
              ["⭐", "Your Total Points", "980", "↑ 18%", "purple"],
              ["🎁", "Rewards Earned", "3", "↑ 50%", "green"],
            ].map(([icon, title, value, trend, color]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex justify-between">
                  <div className={lex h-12 w-12 items-center justify-center rounded-xl bg--500 text-xl text-white}>
                    {icon}
                  </div>
                  <span className="text-xs font-black text-emerald-500">
                    {trend}
                  </span>
                </div>

                <p className="mt-4 text-xs font-semibold text-slate-500">
                  {title}
                </p>
                <p className="text-2xl font-black text-[#102347]">
                  {value}
                </p>
                <p className="text-[10px] text-slate-400">
                  vs. previous month
                </p>

                <div className="mt-4 flex h-7 items-end gap-1">
                  {[4,6,5,8,7,10,8,12,10,14].map((h,i) => (
                    <span
                      key={i}
                      style={{ height: ${h * 2}px }}
                      className="flex-1 rounded-t bg-gradient-to-t from-blue-500 to-cyan-300"
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* TOP 3 */}
          <section className="mb-4 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">
              🏆 Top 3 DSAs This Month
            </h2>
            <p className="text-xs text-slate-400">
              Leading the way with outstanding performance
            </p>

            <div className="mt-6 grid items-end gap-4 md:grid-cols-3">
              <div className="rounded-t-3xl bg-blue-50 p-5 text-center">
                <div className="text-4xl">🥈</div>
                <p className="mt-2 font-black">Amit Verma</p>
                <p className="text-sm font-bold text-blue-600">
                  2,410 Points
                </p>
                <span className="mt-3 inline-block rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white">
                  Star Performer
                </span>
              </div>

              <div className="rounded-t-[35px] bg-gradient-to-b from-yellow-100 to-orange-50 p-6 text-center shadow-lg">
                <div className="text-5xl">👑</div>
                <p className="mt-2 text-lg font-black">Rajesh Kumar</p>
                <p className="font-black text-orange-600">2,850 Points</p>
                <span className="mt-3 inline-block rounded-full bg-orange-500 px-4 py-2 text-[10px] font-black text-white">
                  🏆 TOP PERFORMER
                </span>
              </div>

              <div className="rounded-t-3xl bg-orange-50 p-5 text-center">
                <div className="text-4xl">🥉</div>
                <p className="mt-2 font-black">Suresh Patel</p>
                <p className="text-sm font-bold text-orange-600">
                  1,980 Points
                </p>
                <span className="mt-3 inline-block rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white">
                  Rising Star
                </span>
              </div>
            </div>
          </section>

          {/* FILTER + CURRENT RANK */}
          <section className="mb-4 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">
                  ⚙️ Leaderboard Filters
                </h2>
                <p className="text-xs text-slate-400">
                  Customize your leaderboard view
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <select className="rounded-xl border px-4 py-3 text-xs font-bold">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>

              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-xl border px-4 py-3 text-xs font-bold"
              >
                <option>All States</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Gujarat</option>
                <option>Rajasthan</option>
                <option>Uttar Pradesh</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border px-4 py-3 text-xs font-bold"
              >
                <option>Total Points</option>
                <option>Total Earnings</option>
                <option>Referrals</option>
              </select>
            </div>

            <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-black text-white">
              Apply Filters
            </button>

            <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <p className="text-xs font-black text-blue-700">
                👑 Your Rank This Month
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 font-black text-white">
                  DS
                </div>
                <div>
                  <p className="text-sm font-black">DSA Demo (You)</p>
                  <p className="text-xs text-slate-500">
                    Rank #24 of 248
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* LEADERBOARD */}
          <section className="grid gap-4 xl:grid-cols-[1fr_310px]">
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="border-b p-5">
                <h2 className="text-lg font-black">
                  📊 Complete Leaderboard
                </h2>
                <p className="text-xs text-slate-400">
                  Top performing DSA partners based on achievements,
                  referrals and earnings
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-4">#</th>
                      <th>DSA Name</th>
                      <th>State</th>
                      <th>Referrals</th>
                      <th>Approved</th>
                      <th>Total Earnings</th>
                      <th>Achievements</th>
                      <th>Points</th>
                      <th>Trend</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((r) => (
                      <tr
                        key={r[1]}
                        className="border-t text-xs hover:bg-blue-50"
                      >
                        <td className="px-4 py-4 text-lg">{r[0]}</td>
                        <td className="font-black">{r[1]}</td>
                        <td className="text-slate-500">{r[2]}</td>
                        <td>{r[3]}</td>
                        <td>{r[4]}</td>
                        <td className="font-bold text-emerald-600">{r[5]}</td>
                        <td>{r[6]}</td>
                        <td className="font-black text-blue-700">{r[7]}</td>
                        <td className="font-black text-emerald-500">{r[8]}</td>
                      </tr>
                    ))}

                    <tr className="border-t-2 border-blue-200 bg-blue-50 text-xs">
                      <td className="px-4 py-4 font-black">#24</td>
                      <td className="font-black text-blue-700">
                        🔵 DSA Demo (You)
                      </td>
                      <td>Madhya Pradesh</td>
                      <td>12</td>
                      <td>8</td>
                      <td className="font-black">₹ 98,500</td>
                      <td>12</td>
                      <td className="font-black text-blue-700">980</td>
                      <td className="font-black text-emerald-500">↑ 18%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT PANELS */}
            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="font-black">🌍 Top Performers by State</h3>

                <div className="mt-4 space-y-3">
                  {[
                    ["1", "Maharashtra", "48 DSAs"],
                    ["2", "Delhi", "42 DSAs"],
                    ["3", "Gujarat", "36 DSAs"],
                    ["4", "Uttar Pradesh", "28 DSAs"],
                    ["5", "Rajasthan", "24 DSAs"],
                  ].map((x) => (
                    <div
                      key={x[1]}
                      className="flex items-center justify-between border-b pb-3 text-xs"
                    >
                      <span>
                        <b className="mr-2 text-blue-600">{x[0]}</b>
                        {x[1]}
                      </span>
                      <b>{x[2]}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="font-black">⭐ Top Achievements</h3>

                <div className="mt-4 space-y-4">
                  <p className="flex justify-between text-xs">
                    🏆 Most Referrals <b>42</b>
                  </p>
                  <p className="flex justify-between text-xs">
                    💰 Highest Earnings <b>₹ 4,85,000</b>
                  </p>
                  <p className="flex justify-between text-xs">
                    🎯 Most Approvals <b>35</b>
                  </p>
                  <p className="flex justify-between text-xs">
                    🚀 Fastest Growth <b>180%</b>
                  </p>
                  <p className="flex justify-between text-xs">
                    🎁 Most Rewards <b>8</b>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 border-t pt-4 text-center text-[11px] text-slate-400">
            DSA FinCorp • Leaderboard • Rewards • Recognition • Professional DSA Management
          </div>

        </main>
      </div>
    </>
  );
}
