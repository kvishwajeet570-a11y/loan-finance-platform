"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Award, BadgeCheck, Gift, IndianRupee, LoaderCircle,
  RefreshCw, Sparkles, Users, Trophy, LockKeyhole, Copy, Share2
} from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  description: string;
  reward?: number | string | null;
  createdAt: string;
};

type ApiData = {
  referralCode?: string | null;
  referralLink?: string | null;
  achievements?: Achievement[];
  totalAchievements?: number;
  totalRewards?: number;
  latestAchievement?: Achievement | null;
  totalReferrals?: number;
  successfulReferrals?: number;
  pendingReferrals?: number;
  totalEarnings?: number;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: ApiData;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function CustomerAchievementsPage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("loan_finance_token");

      if (!token) {
        setError("Session not found. Please sign in again.");
        return;
      }

      const response = await fetch(`${API_BASE}/achievements`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load achievements.");
      }

      setData(result.data ?? {});
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load achievement data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const copyReferralLink = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(`${label} copied`);
      window.setTimeout(() => setCopyMessage(""), 2000);
    } catch {
      setCopyMessage("Copy failed. Please copy manually.");
    }
  };

  const shareReferralLink = async () => {
    const link = data?.referralLink;
    if (!link) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join me at India Loan Finance",
          text: "Use my referral link to get started:",
          url: link,
        });
      } else {
        await copyReferralLink(link, "Referral link");
      }
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name !== "AbortError") {
        await copyReferralLink(link, "Referral link");
      }
    }
  };
  const achievements = data?.achievements ?? [];

  const successfulReferrals = Number(data?.successfulReferrals ?? 0);

  // Progress indicators only; these thresholds do not award money.
  const milestones = [
    { target: 1, title: "First Successful Referral", description: "Complete your first successful referral.", color: "emerald" },
    { target: 5, title: "Referral Builder", description: "Reach five successful referrals.", color: "blue" },
    { target: 10, title: "Referral Champion", description: "Reach ten successful referrals.", color: "violet" },
  ].map((item) => ({
    ...item,
    completed: successfulReferrals >= item.target,
    percent: Math.min(100, Math.round((successfulReferrals / item.target) * 100)),
  }));

  const stats = [
    {
      title: "Achievements Earned",
      value: String(data?.totalAchievements ?? achievements.length),
      note: "Achievements recorded for your account",
      icon: Trophy,
      color: "from-blue-500 to-indigo-600",
      glow: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Rewards",
      value: money(data?.totalRewards),
      note: "Recorded achievement rewards",
      icon: IndianRupee,
      color: "from-emerald-400 to-green-600",
      glow: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Total Referrals",
      value: String(data?.totalReferrals ?? 0),
      note: `${data?.successfulReferrals ?? 0} successful referrals`,
      icon: Users,
      color: "from-violet-500 to-purple-700",
      glow: "bg-violet-100 text-violet-700",
    },
    {
      title: "Referral Earnings",
      value: money(data?.totalEarnings),
      note: `${data?.pendingReferrals ?? 0} pending referrals`,
      icon: Gift,
      color: "from-amber-400 to-orange-500",
      glow: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-3 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* GRAPHICAL ACHIEVEMENT BANNER */}
        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#e5f1ff] via-white to-[#c7e5ff] shadow-sm ring-1 ring-blue-100">
          <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-40 w-64 rounded-full bg-cyan-200/50 blur-3xl" />

          <div className="relative grid min-h-[260px] items-center gap-4 px-5 py-7 sm:px-9 md:grid-cols-[1.3fr_0.7fr]">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-700 shadow-sm">
                <Sparkles size={15} />
                YOUR ACHIEVEMENT JOURNEY
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                My <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Achievements</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Celebrate your milestones, explore your recorded rewards,
                and track your referral performance with LoanFinance.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm">
                <Award size={18} />
                Every milestone counts
              </div>
            </div>

            {/* Decorative illustration only; no invented metrics */}
            <div className="relative hidden h-52 items-center justify-center md:flex">
              <div className="absolute h-44 w-44 rounded-full border border-blue-200/80 bg-white/40 shadow-[0_0_70px_rgba(59,130,246,0.20)]" />
              <div className="absolute h-36 w-36 rounded-full border border-dashed border-blue-300" />
              <div className="absolute left-9 top-7 text-blue-500"><Sparkles size={24} /></div>
              <div className="absolute right-8 top-12 text-cyan-500"><Sparkles size={18} /></div>
              <div className="absolute bottom-8 left-12 text-indigo-400"><Award size={22} /></div>
              <div className="relative flex h-32 w-32 items-center justify-center rounded-[32px] border border-white bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 shadow-[0_20px_40px_rgba(37,99,235,0.35)]">
                <Trophy size={68} strokeWidth={1.5} className="text-amber-300 drop-shadow-lg" />
                <span className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-lg">
                  <Sparkles size={19} />
                </span>
              </div>
              <div className="absolute bottom-1 h-4 w-40 rounded-[50%] bg-blue-400/20 blur-md" />
            </div>
          </div>
        </section>

        {/* REAL API SUMMARY */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="mt-3 break-words text-2xl font-black tracking-tight text-slate-950">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.glow}`}>
                    <Icon size={23} />
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">{stat.note}</p>
                <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${stat.color} opacity-80`} />
              </article>
            );
          })}
        </section>

        {/* MY REFERRAL CODE: loaded from the authenticated API */}
        <section className="rounded-[26px] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Share2 size={21} />
                </span>
                <h2 className="text-xl font-extrabold text-slate-950">My Referral Code</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Share your personal link with friends. Referral progress updates when real activity is recorded.
              </p>
            </div>
            {data?.referralCode ? (
              <span className="rounded-xl border border-blue-200 bg-white px-4 py-3 font-mono text-lg font-black tracking-wider text-blue-800">
                {data.referralCode}
              </span>
            ) : (
              <span className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-500">
                {loading ? "Loading referral code…" : "Referral code unavailable"}
              </span>
            )}
          </div>

          {data?.referralLink && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void copyReferralLink(data.referralCode || "", "Referral code")}
                disabled={!data.referralCode}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Copy size={17} /> Copy Code
              </button>
              <button
                type="button"
                onClick={() => void copyReferralLink(data.referralLink || "", "Referral link")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50"
              >
                <Copy size={17} /> Copy Link
              </button>
              <button
                type="button"
                onClick={() => void shareReferralLink()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Share2 size={17} /> Share
              </button>
            </div>
          )}

          {copyMessage && (
            <p role="status" className="mt-3 text-sm font-semibold text-blue-700">
              {copyMessage}
            </p>
          )}
        </section>
        {/* REFERRAL MILESTONES: calculated from authenticated API data */}
        <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles size={21} />
                </span>
                <h2 className="text-xl font-extrabold text-slate-950">Referral Milestones</h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Progress is calculated from your successful referrals returned by the API.
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              {loading ? "Loading…" : `${successfulReferrals} successful referrals`}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {milestones.map((item) => (
              <article
                key={item.target}
                className={`relative overflow-hidden rounded-2xl border p-5 ${
                  item.completed
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                    : "border-slate-200 bg-gradient-to-br from-slate-50 to-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    item.completed ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-600"
                  }`}>
                    {item.completed ? <BadgeCheck size={25} /> : <Award size={25} />}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    item.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {item.completed ? "Completed" : "In progress"}
                  </span>
                </div>

                <h3 className="mt-4 font-extrabold text-slate-900">{item.title}</h3>
                <p className="mt-1 min-h-10 text-sm leading-5 text-slate-600">{item.description}</p>

                <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{loading ? "—" : `${Math.min(successfulReferrals, item.target)} / ${item.target}`}</span>
                  <span>{loading ? "—" : `${item.percent}%`}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.completed ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-cyan-400"
                    }`}
                    style={{ width: `${loading ? 0 : item.percent}%` }}
                  />
                </div>
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            These are progress indicators, not cash rewards. Any payable reward must be recorded and verified separately in the backend.
          </p>
        </section>

        {/* ACHIEVEMENT HISTORY */}
        <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Trophy size={21} />
                </span>
                <h2 className="text-xl font-extrabold text-slate-950">Achievement History</h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Actual achievement records returned by your account.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                {loading ? "Loading…" : `${achievements.length} records`}
              </span>
              <button
                type="button"
                onClick={() => void loadData()}
                disabled={loading}
                aria-label="Refresh achievements"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {error ? (
            <div role="alert" className="m-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
              <p className="font-semibold">{error}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-100"
              >
                <RefreshCw size={15} /> Try again
              </button>
            </div>
          ) : loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <LoaderCircle size={32} className="animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-500">Loading real achievement data…</p>
            </div>
          ) : achievements.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
                <Award size={40} strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900">Your journey starts here</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                No achievement records were returned for your account yet.
                This section will show records when they are saved in the backend.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-6">
              {achievements.map((item, index) => (
                <article
                  key={item.id}
                  className="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
                    index % 3 === 0 ? "bg-emerald-200/40" :
                    index % 3 === 1 ? "bg-blue-200/50" : "bg-violet-200/40"
                  }`} />

                  <div className="relative flex items-start gap-3">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                      index % 3 === 0 ? "bg-emerald-50 text-emerald-600" :
                      index % 3 === 1 ? "bg-blue-50 text-blue-600" :
                      "bg-violet-50 text-violet-600"
                    }`}>
                      <Award size={30} strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-extrabold text-slate-900">{item.title}</h3>
                      <p className="mt-1 whitespace-pre-line break-words text-sm leading-5 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <BadgeCheck size={19} className="shrink-0 text-emerald-500" />
                  </div>

                  <div className="relative mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">Recorded {dateLabel(item.createdAt)}</p>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-extrabold text-emerald-700">
                      <IndianRupee size={15} />
                      {money(item.reward)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="px-1 pb-3 text-xs leading-5 text-slate-400">
          All figures and achievement cards come from the authenticated API.
          Decorative graphics do not represent additional rewards or progress.
        </p>
      </div>
    </main>
  );
}


