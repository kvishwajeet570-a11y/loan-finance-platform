"use client";

import React from "react";
import {
  Trophy,
  Medal,
  Gift,
  Target,
  Award,
  Users,
  Star,
  Lock,
  CheckCircle2,
  Crown,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Zap,
  ShieldCheck,
  Search,
  CalendarDays,
  Bell,
  ChevronDown,
  Sparkles,
  Gem,
  Flame,
} from "lucide-react";

import DsaSidebar from "@/components/dsa/DsaSidebar";

const rupee = "₹";

const stats = [
  {
    title: "Total Achievements",
    value: "12",
    change: "↑ 50%",
    sub: "vs. previous month",
    icon: Medal,
    iconClass: "from-blue-500 to-indigo-600",
    lineClass: "bg-blue-500",
  },
  {
    title: "Badges Earned",
    value: "8",
    change: "↑ 33%",
    sub: "vs. previous month",
    icon: Award,
    iconClass: "from-emerald-400 to-green-600",
    lineClass: "bg-emerald-500",
  },
  {
    title: "Milestones Completed",
    value: "5",
    change: "↑ 25%",
    sub: "vs. previous month",
    icon: Target,
    iconClass: "from-orange-400 to-amber-600",
    lineClass: "bg-orange-500",
  },
  {
    title: "Rewards Unlocked",
    value: "3",
    change: "↑ 200%",
    sub: "vs. previous month",
    icon: Gift,
    iconClass: "from-violet-500 to-purple-700",
    lineClass: "bg-violet-500",
  },
];

const recentAchievements = [
  {
    title: "First Referral",
    date: "05 Sep 2026",
    icon: Medal,
    gradient: "from-amber-400 to-orange-500",
    status: "Completed",
  },
  {
    title: "5 Referrals",
    date: "12 Sep 2026",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    status: "Completed",
  },
  {
    title: "₹ 50K Earnings",
    date: "18 Sep 2026",
    icon: Gift,
    gradient: "from-violet-500 to-purple-600",
    status: "Completed",
  },
  {
    title: "Top Performer",
    date: "25 Sep 2026",
    icon: Crown,
    gradient: "from-emerald-400 to-green-600",
    status: "Completed",
  },
  {
    title: "100 Referrals",
    date: "",
    icon: Lock,
    gradient: "from-slate-400 to-slate-600",
    status: "In Progress",
  },
];

const badges = [
  {
    title: "First Referral",
    icon: Medal,
    color: "amber",
    completed: true,
    progress: 100,
  },
  {
    title: "5 Referrals",
    icon: Users,
    color: "blue",
    completed: true,
    progress: 100,
  },
  {
    title: "₹ 50K Earnings",
    icon: Gift,
    color: "purple",
    completed: true,
    progress: 100,
  },
  {
    title: "Top Performer",
    icon: Crown,
    color: "green",
    completed: true,
    progress: 100,
  },
  {
    title: "10 Referrals",
    icon: Lock,
    color: "slate",
    completed: false,
    progress: 70,
  },
  {
    title: "₹ 1 Lakh Earnings",
    icon: Lock,
    color: "slate",
    completed: false,
    progress: 35,
  },
  {
    title: "50 Referrals",
    icon: Lock,
    color: "slate",
    completed: false,
    progress: 20,
  },
  {
    title: "Annual Champion",
    icon: Lock,
    color: "slate",
    completed: false,
    progress: 10,
  },
];

const milestones = [
  {
    title: "10 Successful Referrals",
    value: "7 / 10",
    percent: 70,
    icon: Users,
    color: "blue",
  },
  {
    title: "₹ 1,00,000 Total Earnings",
    value: "₹ 52,400 / ₹ 1,00,000",
    percent: 52,
    icon: Gift,
    color: "orange",
  },
  {
    title: "25 Approved Referrals",
    value: "18 / 25",
    percent: 72,
    icon: CheckCircle2,
    color: "green",
  },
  {
    title: "Top 10 Leaderboard Rank",
    value: "#24 / Top 10",
    percent: 40,
    icon: Trophy,
    color: "yellow",
  },
  {
    title: "Annual Business Target",
    value: "₹ 5L / ₹ 10L",
    percent: 50,
    icon: BarChart3,
    color: "blue",
  },
];

const leaderboard = [
  { rank: 1, name: "Rajesh Kumar", achievements: 24, points: "2,850", medal: "🥇" },
  { rank: 2, name: "Amit Verma", achievements: 22, points: "2,410", medal: "🥈" },
  { rank: 3, name: "Suresh Patel", achievements: 18, points: "1,980", medal: "🥉" },
  { rank: 4, name: "Vikram Singh", achievements: 15, points: "1,650", medal: "" },
  { rank: 5, name: "Manoj Yadav", achievements: 12, points: "1,320", medal: "" },
];

function MiniSparkline({ color = "blue" }: { color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    orange: "bg-orange-400",
    purple: "bg-violet-500",
  };

  return (
    <div className="mt-3 flex h-7 items-end gap-[3px]">
      {[7, 11, 8, 14, 12, 17, 15, 21, 18, 25, 23, 29].map((h, i) => (
        <span
          key={i}
          className={`w-2 rounded-t-sm opacity-${i > 7 ? "100" : "70"} ${colors[color]}`}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

function BadgeIcon({
  type,
  color,
  locked = false,
}: {
  type: React.ElementType;
  color: string;
  locked?: boolean;
}) {
  const Icon = type;

  const gradients: Record<string, string> = {
    amber: "from-yellow-300 via-amber-400 to-orange-500",
    blue: "from-blue-400 via-blue-500 to-indigo-600",
    purple: "from-purple-400 via-violet-500 to-fuchsia-600",
    green: "from-emerald-300 via-green-500 to-teal-600",
    slate: "from-slate-300 via-slate-400 to-slate-600",
  };

  return (
    <div
      className={`relative mx-auto flex h-[70px] w-[70px] items-center justify-center ${
        locked ? "opacity-80" : ""
      }`}
    >
      <div
        className={`absolute inset-0 rotate-45 rounded-[18px] bg-gradient-to-br ${gradients[color]} shadow-lg`}
      />
      <div className="relative flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-white/20 text-white shadow-inner">
        <Icon size={29} strokeWidth={2.4} />
      </div>
    </div>
  );
}

export default function DsaAchievementsPage() {
  return (
    <div className="min-h-screen bg-[#eef4fb] text-[#102347]">
      <DsaSidebar />

      <div className="lg:pl-[278px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative hidden max-w-[590px] flex-1 md:block">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
              />
              <input
                className="h-11 w-full rounded-xl border border-blue-100 bg-[#f7faff] pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Search by customer name, mobile number, application no..."
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm sm:flex">
                <CalendarDays size={16} className="text-blue-600" />
                01 Oct 2026 - 07 Oct 2026
                <ChevronDown size={14} />
              </button>

              <button className="hidden h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 sm:block">
                Refer & Earn
              </button>

              <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <Bell size={18} />
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                  3
                </span>
              </button>

              <div className="hidden items-center gap-2 pl-1 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white">
                  DS
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-black">DSA Demo</p>
                  <p className="text-[11px] text-slate-500">DSA Partner</p>
                </div>
                <ChevronDown size={15} />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1550px] px-3 py-4 sm:px-5 lg:px-6">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-[24px] border border-blue-400/50 bg-gradient-to-br from-[#061b55] via-[#07398b] to-[#20115f] p-5 text-white shadow-[0_15px_50px_rgba(37,99,235,.25)] sm:p-7 lg:p-8">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute right-[30%] top-0 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-24 right-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_350px]">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
                  <Trophy size={14} className="text-yellow-300" />
                  DSA Achievements
                </div>

                <h1 className="max-w-[760px] text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-[54px]">
                  Celebrate Your{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                    Progress
                  </span>
                </h1>

                <p className="mt-4 max-w-[700px] text-sm leading-6 text-blue-100 sm:text-base">
                  Complete milestones, earn badges and unlock exclusive rewards
                  as you grow your business with DSA FinCorp.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    [CheckCircle2, "Track Milestones"],
                    [Award, "Earn Exclusive Badges"],
                    [Gift, "Get Special Rewards"],
                    [BarChart3, "Climb Leaderboard"],
                  ].map(([Icon, label], i) => {
                    const C = Icon as React.ElementType;
                    return (
                      <button
                        key={i}
                        className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur transition hover:bg-white/20"
                      >
                        <C size={14} />
                        {label as string}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative rounded-[22px] border border-cyan-300/30 bg-[#071f58]/70 p-5 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-orange-500 text-white shadow-lg">
                    <Crown size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Your Journey</p>
                    <p className="text-lg font-black text-yellow-300">
                      Your Achievements
                    </p>
                  </div>
                </div>

                {[
                  [Target, "Complete Targets", "text-emerald-300"],
                  [Award, "Unlock Badges", "text-yellow-300"],
                  [Gift, "Earn Rewards", "text-purple-300"],
                  [Star, "Be a Top Performer", "text-cyan-300"],
                ].map(([Icon, text, cls], i) => {
                  const C = Icon as React.ElementType;
                  return (
                    <div
                      key={i}
                      className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-2.5"
                    >
                      <C size={17} className={cls as string} />
                      <span className="text-xs font-semibold text-white/90">
                        {text as string}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* KPI */}
          <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconClass} text-white shadow-lg`}
                    >
                      <Icon size={23} />
                    </div>

                    <span className="text-sm font-black text-emerald-500">
                      {item.change}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-1 text-2xl font-black tracking-tight">
                    {item.value}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {item.sub}
                  </p>

                  <MiniSparkline
                    color={
                      item.title === "Badges Earned"
                        ? "green"
                        : item.title === "Milestones Completed"
                        ? "orange"
                        : item.title === "Rewards Unlocked"
                        ? "purple"
                        : "blue"
                    }
                  />
                </div>
              );
            })}
          </section>

          {/* JOURNEY + RECENT */}
          <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.15fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <Sparkles size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Your Achievement Journey</h2>
                  <p className="text-xs text-slate-500">
                    Track your overall progress and next milestone
                  </p>
                </div>
              </div>

              <div className="mt-5 grid items-center gap-6 md:grid-cols-[190px_1fr]">
                <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_68%,#e2e8f0_68%_100%)]">
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="text-3xl font-black">68%</span>
                    <span className="text-[11px] text-slate-500">
                      Overall Progress
                    </span>
                    <Crown size={15} className="mt-2 text-yellow-500" />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Next Milestone
                      </p>
                      <p className="mt-1 text-sm font-black">
                        10 Successful Referrals
                      </p>
                    </div>

                    <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                      <ArrowRight size={17} />
                    </button>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                  </div>

                  <div className="mt-2 flex justify-between text-xs font-bold">
                    <span className="text-slate-500">
                      Just 3 more to unlock Silver Partner Badge!
                    </span>
                    <span>7 / 10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <Award size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black">Recent Achievements</h2>
                    <p className="text-xs text-slate-500">
                      Your latest milestones and badges
                    </p>
                  </div>
                </div>

                <button className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {recentAchievements.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 text-center"
                  >
                    <div className="relative mx-auto h-[70px] w-[70px]">
                      <div
                        className={`absolute inset-0 rotate-45 rounded-[18px] bg-gradient-to-br ${item.gradient} shadow-lg`}
                      />
                      <div className="relative flex h-[70px] items-center justify-center text-white">
                        <item.icon size={28} />
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] font-black">{item.title}</p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-black ${
                        item.status === "Completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {item.status}
                    </span>

                    {item.date && (
                      <p className="mt-2 text-[9px] text-slate-400">
                        {item.date}
                      </p>
                    )}

                    {!item.date && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-[68%] rounded-full bg-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BADGES + MILESTONES + LEADERBOARD */}
          <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr_1.05fr]">
            {/* BADGES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-black">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Gem size={18} />
                    </span>
                    Achievement Badges
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Collect badges by completing different milestones
                  </p>
                </div>

                <button className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {badges.map((badge) => (
                  <div
                    key={badge.title}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 text-center transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <BadgeIcon
                      type={badge.icon}
                      color={badge.color}
                      locked={!badge.completed}
                    />

                    <p className="mt-4 text-[11px] font-black">{badge.title}</p>

                    {badge.completed ? (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black text-emerald-600">
                        <CheckCircle2 size={10} />
                        Completed
                      </span>
                    ) : (
                      <div className="mt-3">
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[9px] font-bold text-slate-400">
                          {badge.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* MILESTONES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Target size={18} />
                  </span>
                  Milestone Progress
                </h2>

                <button className="text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {milestones.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title}>
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            item.color === "orange"
                              ? "bg-orange-100 text-orange-500"
                              : item.color === "green"
                              ? "bg-emerald-100 text-emerald-500"
                              : item.color === "yellow"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-2">
                            <p className="truncate text-xs font-black">
                              {item.title}
                            </p>
                            <span className="text-[10px] font-black text-slate-500">
                              {item.percent}%
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LEADERBOARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                    <Trophy size={19} />
                  </span>
                  DSA Leaderboard
                </h2>

                <button className="text-xs font-bold text-blue-600">
                  View All →
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-100">
                <div className="grid grid-cols-[35px_1fr_75px_70px] bg-slate-50 px-3 py-2 text-[9px] font-black uppercase text-slate-400">
                  <span>#</span>
                  <span>DSA Name</span>
                  <span className="text-center">Achievements</span>
                  <span className="text-right">Points</span>
                </div>

                {leaderboard.map((person) => (
                  <div
                    key={person.rank}
                    className="grid grid-cols-[35px_1fr_75px_70px] items-center border-t border-slate-100 px-3 py-3"
                  >
                    <div className="text-sm font-black">
                      {person.medal || person.rank}
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[9px] font-black text-white">
                        {person.name
                          .split(" ")
                          .map((x) => x[0])
                          .join("")}
                      </div>
                      <span className="truncate text-[11px] font-bold">
                        {person.name}
                      </span>
                    </div>

                    <span className="text-center text-[11px] font-black">
                      {person.achievements}
                    </span>

                    <span className="text-right text-[11px] font-black text-blue-700">
                      {person.points}
                    </span>
                  </div>
                ))}

                <div className="grid grid-cols-[35px_1fr_75px_70px] items-center border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-3">
                  <span className="text-xs font-black text-blue-600">#24</span>

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-[9px] font-black text-white">
                      DS
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-blue-700">
                        DSA Demo (You)
                      </p>
                    </div>
                  </div>

                  <span className="text-center text-[11px] font-black">12</span>

                  <span className="text-right text-[11px] font-black text-blue-700">
                    980
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-5 border-t border-slate-200 py-5 text-center text-[10px] font-medium text-slate-400">
            DSA FinCorp • Achievements & Rewards • Secure • Transparent • Professional DSA Partner Management
          </footer>
        </main>
      </div>
    </div>
  );
}
