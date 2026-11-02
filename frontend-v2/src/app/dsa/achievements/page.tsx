"use client";

import React, { useEffect, useState } from "react";
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
  Flame, Rocket } from "lucide-react";


const rupee = "₹";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    amber: "from-yellow-300 via-amber-400 to-orange-600",
    blue: "from-cyan-300 via-blue-500 to-indigo-700",
    purple: "from-fuchsia-300 via-purple-500 to-violet-700",
    green: "from-lime-300 via-emerald-500 to-teal-700",
    slate: "from-slate-200 via-slate-400 to-slate-700",
  };

  const gradient = gradients[color] || gradients.blue;

  return (
    <div
      className={`group/badge relative mx-auto flex h-[76px] w-[76px] items-center justify-center transition-all duration-300 hover:-translate-y-1 ${
        locked ? "opacity-60 grayscale-[35%]" : ""
      }`}
    >
      <div
        className={`absolute inset-3 rounded-full bg-gradient-to-br ${gradient} opacity-60 blur-xl transition-all duration-300 group-hover/badge:inset-1 group-hover/badge:opacity-90`}
      />
      <div
        className={`absolute inset-[9px] rotate-45 rounded-[22px] border border-white/70 bg-gradient-to-br ${gradient} shadow-[0_8px_18px_rgba(30,64,175,0.28)] transition-transform duration-300 group-hover/badge:rotate-[55deg] group-hover/badge:scale-110`}
      />
      <div className="absolute inset-[15px] rounded-[17px] border border-white/40 bg-white/15 shadow-inner backdrop-blur-[2px]" />
      <div className="absolute left-[20px] top-[17px] h-3 w-6 rotate-[-35deg] rounded-full bg-white/35 blur-[2px]" />
      <div className="relative z-10 text-white drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover/badge:scale-110">
        <Icon size={29} strokeWidth={2.3} />
      </div>
      {!locked && (
        <Sparkles
          size={16}
          className="absolute right-0 top-0 z-20 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.7)]"
        />
      )}
    </div>
  );
}

export default function DsaAchievementsPage() {
  const [achievementData, setAchievementData] = useState<any[]>([]);
  const [achievementLoading, setAchievementLoading] = useState(true);
  const [achievementError, setAchievementError] = useState("");
  const [displayName, setDisplayName] = useState("DSA Partner");
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    let active = true;

    const loadAchievements = async () => {
      try {
        const token = localStorage.getItem("loan_finance_token");
        const rawUser = localStorage.getItem("loan_finance_user");
        const user = rawUser ? JSON.parse(rawUser) : null;

        if (active && user?.name) setDisplayName(String(user.name));
        if (!token) throw new Error("Login required. Please sign in again.");

        const response = await fetch(`${API_URL}/achievements`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || result?.success !== true) {
          throw new Error(result?.message || `API request failed (${response.status})`);
        }

        if (!Array.isArray(result?.data?.achievements)) {
          throw new Error("Unexpected achievements API response.");
        }

        if (active) setAchievementData(result.data.achievements);
        if (active) setSuccessfulReferrals(Number(result.data.successfulReferrals) || 0);
        if (active) setTotalEarnings(Number(result.data.totalEarnings) || 0);
      } catch (error) {
        if (active) {
          setAchievementError(error instanceof Error ? error.message : "Unable to load achievements.");
          setAchievementData([]);
        }
      } finally {
        if (active) setAchievementLoading(false);
      }
    };

    loadAchievements();
    return () => { active = false; };
  }, []);

  const stats = [
    { title: "Total Achievements", value: String(achievementData.length), change: "", sub: "Database records", icon: Medal, iconClass: "from-blue-500 to-indigo-600", lineClass: "bg-blue-500" },
    { title: "Badges Earned", value: String(achievementData.length), change: "", sub: "Earned achievements", icon: Award, iconClass: "from-emerald-400 to-green-600", lineClass: "bg-emerald-500" },
    { title: "Milestones Completed", value: String([successfulReferrals >= 1, successfulReferrals >= 5, totalEarnings >= 50000, successfulReferrals >= 100].filter(Boolean).length), change: "", sub: "Based on referral performance", icon: Target, iconClass: "from-orange-400 to-amber-600", lineClass: "bg-orange-500" },
    { title: "Recorded Rewards", value: rupee + achievementData.reduce((sum, item) => sum + (Number(item.reward) || 0), 0).toLocaleString("en-IN"), change: "", sub: "Rewards recorded in database", icon: Gift, iconClass: "from-violet-500 to-purple-700", lineClass: "bg-violet-500" },
  ];

  const recentAchievements = achievementData;
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      try {
        const token = localStorage.getItem("loan_finance_token");
        if (!token) return;

        const response = await fetch(`${API_URL}/leaderboard/achievements`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();
        if (!response.ok || result?.success !== true || !Array.isArray(result?.data)) {
          throw new Error(result?.message || "Unable to load leaderboard.");
        }

        if (active) setLeaderboardData(result.data);
      } catch (error) {
        console.error("Achievement leaderboard load failed:", error);
        if (active) setLeaderboardData([]);
      }
    };

    loadLeaderboard();
    return () => { active = false; };
  }, []);

  const badges = achievementData.map((item: any) => {
    const title = String(item.title || "");

    const isFirstReferral = title.includes("First Referral");
    const isFiveReferrals = title.includes("5 Referrals");
    const isEarnings = title.includes("50K") || title.includes("Earnings");
    const isHundredReferrals = title.includes("100 Referrals");

    return {
      title,
      icon: isFirstReferral ? Medal
        : isFiveReferrals ? Users
        : isEarnings ? Gift
        : isHundredReferrals ? Lock
        : Crown,
      color: isFirstReferral ? "orange"
        : isFiveReferrals ? "blue"
        : isEarnings ? "purple"
        : isHundredReferrals ? "slate"
        : "green",
      completed: isFirstReferral ? successfulReferrals >= 1
        : isFiveReferrals ? successfulReferrals >= 5
        : isEarnings ? totalEarnings >= 50000
        : isHundredReferrals ? successfulReferrals >= 100
        : false,
      progress: isFirstReferral ? Math.min(100, successfulReferrals * 100)
        : isFiveReferrals ? Math.min(100, Math.round(successfulReferrals / 5 * 100))
        : isEarnings ? Math.min(100, Math.round(totalEarnings / 50000 * 100))
        : isHundredReferrals ? Math.min(100, successfulReferrals)
        : 0,
    };
  });

  const milestones: Array<{
    title: string;
    value: string;
    percent: number;
    icon: React.ElementType;
    color: string;
  }> = [
    { title: "Successful Referrals", value: `${successfulReferrals} / 10`, percent: Math.min(100, Math.round(successfulReferrals / 10 * 100)), icon: Users, color: "blue" },
    { title: "Referral Earnings", value: `${rupee}${totalEarnings.toLocaleString("en-IN")} / ${rupee}50,000`, percent: Math.min(100, Math.round(totalEarnings / 50000 * 100)), icon: Gift, color: "green" },
    { title: "100 Referrals", value: `${successfulReferrals} / 100`, percent: Math.min(100, Math.round(successfulReferrals / 100 * 100)), icon: Target, color: "orange" },
  ];

  const leaderboard = leaderboardData.map((item: any, index: number) => ({
    rank: Number(item.rank) || index + 1,
    name: String(item.name || "DSA Partner"),
    achievements: Number(item.totalAchievements) || 0,
    points: (Number(item.totalRewards) || 0).toLocaleString("en-IN"),
    medal: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "",
  }));

  return (
    <div className="min-h-screen bg-[#eef4fb] text-[#102347]">

      <div className="">
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
                  <p className="text-sm font-black">{displayName}</p>
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
                <div style={{ "--journey-progress": `${Math.min(100, Math.round(successfulReferrals / 10 * 100))}%` } as React.CSSProperties} className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_var(--journey-progress),#e2e8f0_var(--journey-progress)_100%)]">
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="text-3xl font-black">{Math.min(100, Math.round(successfulReferrals / 10 * 100))}%</span>
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
                        {successfulReferrals >= 10 ? "100 Successful Referrals" : "10 Successful Referrals"}
                      </p>
                    </div>

                    <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                      <ArrowRight size={17} />
                    </button>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${Math.min(100, Math.round(successfulReferrals / 10 * 100))}%` }} />
                  </div>

                  <div className="mt-2 flex justify-between text-xs font-bold">
                    <span className="text-slate-500">
                      {Math.max(0, 10 - successfulReferrals)} more referrals to reach 10!
                    </span>
                    <span>{Math.min(successfulReferrals, 10)} / 10</span>
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

                <button type="button" onClick={() => setShowAllAchievements(v => !v)} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">{showAllAchievements ? "Show Less ↑" : "View All →"}</button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {achievementLoading ? (
                  <p className="col-span-full py-8 text-center text-sm text-slate-500">Loading achievements…</p>
                ) : achievementError ? (
                  <p className="col-span-full rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">{achievementError}</p>
                ) : recentAchievements.length === 0 ? (
                  <p className="col-span-full py-8 text-center text-sm text-slate-500">No achievements recorded yet. Complete a successful referral to get started.</p>
                ) : (showAllAchievements ? recentAchievements : recentAchievements.slice(0, 5)).map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 text-center"
                  >
                    <div className="group/icon relative mx-auto h-[82px] w-[82px]">
                      <div className={`absolute inset-1 rounded-[25px] opacity-25 blur-xl transition-all duration-300 group-hover/icon:opacity-60 ${
                        String(item.title).includes("First Referral")
                          ? "bg-orange-500"
                          : String(item.title).includes("5 Referrals")
                          ? "bg-sky-500"
                          : String(item.title).includes("Earnings") || String(item.title).includes("50K")
                          ? "bg-fuchsia-500"
                          : String(item.title).includes("100 Referrals")
                          ? "bg-slate-500"
                          : "bg-emerald-500"
                      }`} />
                      <div className={`absolute inset-1 rotate-45 rounded-[24px] border border-white/60 shadow-xl transition-transform duration-300 group-hover/icon:rotate-[55deg] group-hover/icon:scale-105 ${
                        String(item.title).includes("First Referral")
                          ? "bg-gradient-to-br from-amber-300 via-orange-500 to-rose-600"
                          : String(item.title).includes("5 Referrals")
                          ? "bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-700"
                          : String(item.title).includes("Earnings") || String(item.title).includes("50K")
                          ? "bg-gradient-to-br from-pink-300 via-purple-500 to-violet-700"
                          : String(item.title).includes("100 Referrals")
                          ? "bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700"
                          : "bg-gradient-to-br from-emerald-300 via-green-500 to-teal-700"
                      }`} />
                      <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]">
                        {String(item.title).includes("First Referral") ? <Trophy size={35} strokeWidth={2.1} /> :
                         String(item.title).includes("5 Referrals") ? <Rocket size={35} strokeWidth={2.1} /> :
                         String(item.title).includes("50K") || String(item.title).includes("Earnings") ? <Gem size={35} strokeWidth={2.1} /> :
                         String(item.title).includes("100 Referrals") ? <Crown size={35} strokeWidth={2.1} /> :
                         <Star size={35} strokeWidth={2.1} />}
                      </div>
                      <Sparkles className="absolute -right-1 top-0 text-amber-400 drop-shadow-sm" size={19} />
                      <span className="absolute -bottom-0.5 -left-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-cyan-300 shadow" />
                    </div>

                    <p className="mt-3 text-[11px] font-black">{item.title}</p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-black ${
                        item.status === "Completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      Recorded
                    </span>

                    {item.date && (
                      <p className="mt-2 text-[9px] text-slate-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
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

                <button type="button" onClick={() => setShowAllBadges(v => !v)} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">{showAllBadges ? "Show Less ↑" : "View All →"}</button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {badges.length === 0 && <p className="col-span-full py-6 text-center text-xs text-slate-500">Badges will appear when achievements are earned.</p>}
                {(showAllBadges ? badges : badges.slice(0, 4)).map((badge) => (
                  <div
                    key={badge.title}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 text-center transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <BadgeIcon
                      type={badge.icon}
                      color={badge.color}
                      locked={false}
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

                <button type="button" onClick={() => setShowAllMilestones(v => !v)} className="text-xs font-bold text-blue-600">{showAllMilestones ? "Show Less ↑" : "View All →"}</button>
              </div>

              <div className="mt-5 space-y-5">
                {milestones.length === 0 && <p className="py-6 text-center text-xs text-slate-500">Milestone progress is not available yet.</p>}
                {(showAllMilestones ? milestones : milestones.slice(0, 3)).map((item) => {
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

                <button type="button" onClick={() => setShowAllLeaderboard(v => !v)} className="text-xs font-bold text-blue-600">{showAllLeaderboard ? "Show Less ↑" : "View All →"}</button>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-100">
                <div className="grid grid-cols-[35px_1fr_75px_70px] bg-slate-50 px-3 py-2 text-[9px] font-black uppercase text-slate-400">
                  <span>#</span>
                  <span>DSA Name</span>
                  <span className="text-center">Achievements</span>
                  <span className="text-right">Points</span>
                </div>

                {(showAllLeaderboard ? leaderboard : leaderboard.slice(0, 5)).map((person) => (
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

















