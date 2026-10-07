"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Link2,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Users,
  UserCheck,
  Clock3,
  IndianRupee,
  RefreshCw,
  Gift,
  TrendingUp,
  Award,
  QrCode,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  WalletCards,
  Trophy,
} from "lucide-react";

import DsaSidebar from "@/components/dsa/DsaSidebar";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Referral = {
  id: string;
  userId?: string;
  referredUserId?: string;
  referralCode?: string;
  referralLink?: string;
  status?: string;
  source?: string;
  campaign?: string;
  rewardAmount?: number;
  totalReferrals?: number;
  successfulReferrals?: number;
  rejectedReferrals?: number;
  pendingReferrals?: number;
  totalEarnings?: number;
  name?: string;
  dsaName?: string;
  referredName?: string;
  referredUserName?: string;
  fullName?: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const num = (value: unknown) => Number(value || 0);

export default function ReferralPage() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");
  const [referral, setReferral] = useState<Referral | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("loan_finance_user");
      const storedToken = localStorage.getItem("loan_finance_token");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch {
      setError("Unable to read login information.");
    }
  }, []);

  const request = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        json?.message ||
          json?.error ||
          "Unable to process referral request."
      );
    }

    return json;
  };

  const loadReferralData = async () => {
    const userId = user?.id || user?.userId;

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setError("");

      const [dsaResponse, earningsResponse, rewardsResponse] =
        await Promise.all([
          request(`/referral/dsa/${userId}`),
          request(`/referral/earnings/${userId}`),
          request(`/referral/rewards/${userId}`),
        ]);

      const dsaData =
        dsaResponse?.data ??
        dsaResponse?.referrals ??
        dsaResponse?.data?.data ??
        [];

      const referralList: Referral[] = Array.isArray(dsaData)
        ? dsaData
        : dsaData?.referrals && Array.isArray(dsaData.referrals)
        ? dsaData.referrals
        : [];

      setReferrals(referralList);

      const mainReferral =
        referralList.find(
          (item) =>
            item?.referralCode ||
            item?.referralLink
        ) ||
        referralList[0] ||
        null;

      setReferral(mainReferral);

      setEarnings(
        num(
          earningsResponse?.totalEarnings ??
            earningsResponse?.data?.totalEarnings ??
            earningsResponse?.data?.data?.totalEarnings ??
            referralList.reduce(
              (sum, item) => sum + num(item.totalEarnings),
              0
            )
        )
      );

      setRewardAmount(
        num(
          rewardsResponse?.rewardAmount ??
            rewardsResponse?.data?.rewardAmount ??
            rewardsResponse?.data?.data?.rewardAmount
        )
      );
    } catch (err: any) {
      setError(
        err?.message || "Unable to load referral information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id || user?.userId) {
      loadReferralData();
    }
  }, [user?.id, user?.userId, token]);

  const createReferral = async () => {
    try {
      setCreating(true);
      setError("");

      const userId = user?.id || user?.userId;

      const response = await request("/referral/", {
        method: "POST",
        body: JSON.stringify({
          userId,
          campaign: "DSA_REFERRAL",
        }),
      });

      const created =
        response?.referral ||
        response?.data?.referral ||
        response?.data ||
        null;

      if (created) {
        setReferral(created);
      }

      await loadReferralData();
    } catch (err: any) {
      setError(
        err?.message || "Unable to create referral program."
      );
    } finally {
      setCreating(false);
    }
  };

  const referralCode = referral?.referralCode || "";

  const referralLink =
    referral?.referralLink ||
    (referralCode
      ? `https://dsafincorp.com/ref/${referralCode}`
      : "");

  const totalReferrals = useMemo(
    () =>
      referrals.reduce(
        (sum, item) => sum + num(item.totalReferrals),
        0
      ),
    [referrals]
  );

  const successfulReferrals = useMemo(
    () =>
      referrals.reduce(
        (sum, item) => sum + num(item.successfulReferrals),
        0
      ),
    [referrals]
  );

  const pendingReferrals = useMemo(
    () =>
      referrals.reduce(
        (sum, item) => sum + num(item.pendingReferrals),
        0
      ),
    [referrals]
  );

  const rejectedReferrals = useMemo(
    () =>
      referrals.reduce(
        (sum, item) => sum + num(item.rejectedReferrals),
        0
      ),
    [referrals]
  );

  const totalFromRecords = useMemo(
    () =>
      referrals.reduce(
        (sum, item) => sum + num(item.totalEarnings),
        0
      ),
    [referrals]
  );

  const displayTotalReferrals =
    totalReferrals ||
    num(referral?.totalReferrals);

  const displaySuccessful =
    successfulReferrals ||
    num(referral?.successfulReferrals);

  const displayPending =
    pendingReferrals ||
    num(referral?.pendingReferrals);

  const displayEarnings =
    earnings ||
    totalFromRecords ||
    num(referral?.totalEarnings);

  const conversion =
    displayTotalReferrals > 0
      ? Math.round(
          (displaySuccessful / displayTotalReferrals) * 100
        )
      : 0;

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Unable to copy referral link.");
    }
  };

  const shareReferral = async () => {
    if (!referralLink) return;

    const text =
      "Join DSA FinCorp using my referral link:\n\n" +
      referralLink;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "DSA FinCorp Referral",
          text: "Join using my referral link",
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1800);
      }
    } catch {
      // User cancelled share.
    }
  };

  const shareWhatsApp = () => {
    if (!referralLink) return;

    const text = encodeURIComponent(
      `Join DSA FinCorp using my referral link:\n\n${referralLink}`
    );

    window.open(
      `https://wa.me/?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const recentReferrals = referrals.slice(0, 5);

  const topReferrers = [...referrals]
    .sort(
      (a, b) =>
        num(b.totalReferrals) -
        num(a.totalReferrals)
    )
    .slice(0, 5);

  const performance = [
    Math.max(10, Math.round(displayTotalReferrals * 0.38)),
    Math.max(14, Math.round(displayTotalReferrals * 0.48)),
    Math.max(18, Math.round(displayTotalReferrals * 0.58)),
    Math.max(24, Math.round(displayTotalReferrals * 0.69)),
    Math.max(30, Math.round(displayTotalReferrals * 0.82)),
    Math.max(35, displayTotalReferrals),
  ];

  const chartMax = Math.max(...performance, 50);

  const referralName = (item: Referral, index: number) =>
    item.name ||
    item.dsaName ||
    item.referredName ||
    item.referredUserName ||
    item.fullName ||
    item.userName ||
    `DSA Partner ${String(index + 1).padStart(2, "0")}`;

  const statusFor = (item: Referral) => {
    const value = String(item.status || "").toLowerCase();

    if (
      value.includes("success") ||
      value.includes("approved") ||
      value.includes("complete")
    ) {
      return {
        label: "Approved",
        cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
      };
    }

    if (
      value.includes("reject") ||
      value.includes("cancel")
    ) {
      return {
        label: "Rejected",
        cls: "bg-red-50 text-red-500 border-red-100",
      };
    }

    return {
      label: "Pending",
      cls: "bg-amber-50 text-amber-600 border-amber-100",
    };
  };

  return (
  <div className="min-h-screen bg-[#f4f8ff] text-[#102347]">

    <DsaSidebar />

    <div className="lg:pl-[278px]">

      {/* =====================================================
          TOP BAR
      ===================================================== */}
      <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex h-full items-center gap-3">

          <div className="relative hidden max-w-[590px] flex-1 md:block">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
              🔍
            </div>

            <input
              className="h-11 w-full rounded-xl border border-blue-100 bg-[#f7faff] pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
              placeholder="Search by customer name, mobile number, application no..."
            />
          </div>

          <div className="ml-auto flex items-center gap-2">

            <button className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm sm:flex">
              📅
              01 Oct 2026 - 07 Oct 2026
              <span className="text-slate-400">⌄</span>
            </button>

            <button className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5">
              🎁 Refer & Earn
            </button>

            <button className="relative hidden h-11 w-11 rounded-xl border border-slate-200 bg-white sm:block">
              🔔
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 rounded-xl px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white">
                DS
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-black text-slate-900">DSA Demo</p>
                <p className="text-[10px] font-medium text-slate-500">DSA Partner</p>
              </div>
              <span className="text-slate-500">⌄</span>
            </div>

          </div>
        </div>
      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="mx-auto max-w-[1550px] px-4 py-4 sm:px-6 lg:px-7">

        {/* ===================================================
            PREMIUM HERO
        =================================================== */}
        <section className="relative mb-4 min-h-[250px] overflow-hidden rounded-[24px] border border-blue-400/50 bg-gradient-to-r from-[#062b68] via-[#102b73] to-[#17175c] px-7 py-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] sm:px-10">

          <div className="absolute -right-20 -top-28 h-[360px] w-[360px] rounded-full border border-cyan-400/20" />
          <div className="absolute right-10 top-5 h-[250px] w-[250px] rounded-full border border-blue-300/10" />
          <div className="absolute bottom-0 right-[32%] h-24 w-24 rounded-t-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[1fr_360px]">

            <div>

              <div className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
                ✦ DSA REFERRAL PROGRAM
              </div>

              <h1 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-[52px]">
                Refer.
                <span className="text-cyan-300"> Earn.</span>
                <span className="text-yellow-300"> Grow.</span>
              </h1>

              <p className="mt-3 max-w-[650px] text-sm font-medium leading-6 text-blue-100 sm:text-base">
                Invite other DSA partners, grow your network and earn attractive
                referral rewards on successful business.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold">
                  ₹ Higher Commissions
                </span>

                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold">
                  ◉ Real-time Tracking
                </span>

                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold">
                  ↗ Instant Payouts
                </span>

                <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-[11px] font-bold text-yellow-200">
                  ★ No Limits
                </span>

              </div>
            </div>


            <div className="relative rounded-2xl border border-cyan-300/20 bg-[#09265c]/80 p-5 shadow-2xl backdrop-blur-xl">

              <h3 className="text-lg font-black">
                Turn Your Network
                <span className="block text-yellow-300">Into Earnings</span>
              </h3>

              <div className="mt-4 space-y-3 text-xs font-semibold text-blue-50">

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/30">♧</span>
                  Invite DSA Partners
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/30">♙</span>
                  They Do Business
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/30">₹</span>
                  You Earn Commission
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/30">↗</span>
                  Track Everything Live
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* ===================================================
            KPI CARDS
        =================================================== */}
        <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              title: "Total Referrals",
              value: "248",
              change: "↑ 32%",
              color: "from-blue-500 to-indigo-600",
              line: "bg-blue-500",
              icon: "♧",
            },
            {
              title: "Successful Referrals",
              value: "186",
              change: "↑ 28%",
              color: "from-emerald-400 to-green-600",
              line: "bg-emerald-500",
              icon: "✓",
            },
            {
              title: "Pending Referrals",
              value: "42",
              change: "↓ 12%",
              color: "from-orange-400 to-amber-500",
              line: "bg-orange-400",
              icon: "◷",
            },
            {
              title: "Total Referral Earnings",
              value: "₹ 1,85,400",
              change: "↑ 40%",
              color: "from-purple-500 to-violet-600",
              line: "bg-purple-500",
              icon: "₹",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
            >

              <div className="flex items-start justify-between">

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-xl font-black text-white shadow-lg`}>
                  {item.icon}
                </div>

                <span className={`text-sm font-black ${item.change.includes("↓") ? "text-red-500" : "text-emerald-500"}`}>
                  {item.change}
                </span>

              </div>

              <p className="mt-4 text-xs font-bold text-slate-500">
                {item.title}
              </p>

              <p className="mt-1 text-2xl font-black tracking-tight text-[#102347]">
                {item.value}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                vs. previous month
              </p>

              <div className="mt-4 flex h-7 items-end gap-1">
                {[30,18,36,22,44,30,50,38,57,48,64,58].map((h,i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-t-sm ${item.line} opacity-${50 + (i % 5) * 10}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

            </div>
          ))}

        </section>


        {/* ===================================================
            LINK + PERFORMANCE
        =================================================== */}
        <section className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.08fr]">

          {/* LINK PANEL */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl text-white shadow-lg">
                🔗
              </div>

              <div>
                <h2 className="text-lg font-black">Your Referral Link & Code</h2>
                <p className="text-xs text-slate-500">
                  Share your unique link or code with other DSA partners
                </p>
              </div>

              <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-[9px] font-black uppercase text-blue-600">
                Active Program
              </span>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Your Referral Code
                </p>

                <div className="flex h-11 items-center justify-between rounded-xl border border-blue-100 bg-[#f4f8ff] px-4">
                  <span className="text-xl font-black text-[#102347]">
                    DSA170D5C7B
                  </span>
                  <button className="text-xl text-blue-600">▣</button>
                </div>

                <p className="mt-1 text-[9px] text-slate-400">
                  Use this code while registration
                </p>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Your Referral Link
                </p>

                <div className="flex h-11 items-center justify-between rounded-xl border border-blue-100 bg-[#f4f8ff] px-4">
                  <span className="truncate text-xs font-bold text-[#102347]">
                    https://dsafincorp.com/ref/DSA170D5C7B
                  </span>
                  <button className="ml-2 text-xl text-blue-600">▣</button>
                </div>

                <p className="mt-1 text-[9px] text-slate-400">
                  Share via WhatsApp, Email or Social Media
                </p>
              </div>

            </div>


            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">

              <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-500/20">
                ◉ WhatsApp
              </button>

              <button className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/20">
                🔗 Copy Link
              </button>

              <button className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 py-3 text-xs font-black text-white shadow-lg shadow-purple-500/20">
                ♧ Share
              </button>

              <button className="rounded-xl border border-blue-200 bg-white py-3 text-xs font-black text-blue-600">
                ▦ QR Code
              </button>

            </div>

          </div>


          {/* PERFORMANCE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl text-white">
                ↗
              </div>

              <div>
                <h2 className="text-lg font-black">Referral Performance</h2>
                <p className="text-xs text-slate-500">
                  Track your referral growth and earnings
                </p>
              </div>

              <button className="ml-auto rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-bold">
                Last 6 Months⌄
              </button>

            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-bold">
              <span className="text-blue-600">● Referred</span>
              <span className="text-emerald-500">● Approved</span>
              <span className="text-orange-500">● Pending</span>
              <span className="text-purple-600">● Earnings</span>
            </div>

            <div className="relative mt-4 h-[220px] rounded-xl bg-gradient-to-b from-white to-[#f8fbff] p-3">

              <div className="absolute inset-x-4 top-5 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-4 top-1/4 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-4 top-3/4 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-4 bottom-5 border-t border-slate-200" />

              <div className="absolute inset-x-6 bottom-7 top-8 flex items-end justify-between gap-3">

                {[
                  ["Apr",38,24,9],
                  ["May",50,30,12],
                  ["Jun",62,38,15],
                  ["Jul",72,45,18],
                  ["Aug",84,53,21],
                  ["Sep",96,64,25],
                ].map(([month,b,a,p]) => (
                  <div key={String(month)} className="flex h-full flex-1 items-end justify-center gap-1">

                    <div
                      className="w-[24%] rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                      style={{height:`${b}%`}}
                    />

                    <div
                      className="w-[24%] rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
                      style={{height:`${a}%`}}
                    />

                    <div
                      className="w-[24%] rounded-t-md bg-gradient-to-t from-orange-500 to-amber-300"
                      style={{height:`${p}%`}}
                    />

                  </div>
                ))}

              </div>

              <div className="absolute bottom-0 left-6 right-6 flex justify-between text-[9px] font-semibold text-slate-400">
                {["Apr","May","Jun","Jul","Aug","Sep"].map(m => <span key={m}>{m}</span>)}
              </div>

            </div>

            <div className="mt-3 grid grid-cols-2 rounded-xl bg-[#eef5ff] p-3">
              <div>
                <p className="text-[10px] font-bold text-slate-500">Conversion Rate</p>
                <p className="text-lg font-black text-blue-700">0%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500">Referral Earnings</p>
                <p className="text-lg font-black text-purple-700">₹0</p>
              </div>
            </div>

          </div>

        </section>


        {/* ===================================================
            BOTTOM 3 COLUMNS
        =================================================== */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_.85fr_.85fr]">

          {/* RECENT REFERRALS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">♧ Recent Referrals</h2>
                <p className="text-xs text-slate-500">Your latest referral activity</p>
              </div>

              <button className="rounded-lg border border-blue-100 px-3 py-2 text-[10px] font-bold text-blue-600">
                View All →
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">

              <table className="w-full min-w-[650px] text-left text-xs">

                <thead className="border-y border-slate-100 bg-[#f8fbff] text-[9px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-3">#</th>
                    <th className="px-3 py-3">Date & Time</th>
                    <th className="px-3 py-3">DSA Name</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Earnings</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {[
                    ["1","21 Sep 2026","DSA Partner 01","Pending","—"],
                    ["2","19 Sep 2026","DSA Partner 02","Approved","₹ 2,000"],
                    ["3","17 Sep 2026","DSA Partner 03","Approved","₹ 2,500"],
                    ["4","15 Sep 2026","DSA Partner 04","In Review","—"],
                    ["5","12 Sep 2026","DSA Partner 05","Approved","₹ 3,000"],
                  ].map((row) => (

                    <tr key={row[0]} className="border-b border-slate-100">

                      <td className="px-3 py-3 font-bold">{row[0]}</td>
                      <td className="px-3 py-3">{row[1]}</td>
                      <td className="px-3 py-3 font-bold">{row[2]}</td>

                      <td className="px-3 py-3">
                        <span className={`rounded-full px-3 py-1 text-[9px] font-bold ${
                          row[3] === "Approved"
                            ? "bg-emerald-50 text-emerald-600"
                            : row[3] === "Pending"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {row[3]}
                        </span>
                      </td>

                      <td className="px-3 py-3 font-black text-emerald-600">
                        {row[4]}
                      </td>

                      <td className="px-3 py-3">
                        <button className="rounded-lg border border-blue-300 px-3 py-1.5 text-[10px] font-bold text-blue-600">
                          View
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>


          {/* EARNINGS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">🏅 Earnings Breakdown</h2>
                <p className="text-xs text-slate-500">Your referral earning distribution</p>
              </div>

              <button className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold">
                This Year⌄
              </button>
            </div>

            <div className="relative mx-auto mt-5 flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_59%,#10b981_59%_87%,#f59e0b_87%_100%)]">

              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[9px] font-bold text-slate-500">Total Earnings</span>
                <span className="text-lg font-black">₹0</span>
              </div>

            </div>

            <div className="mt-5 space-y-3 text-xs">

              <div className="flex justify-between">
                <span className="font-semibold"><i className="mr-2 text-blue-500">●</i>Direct Referrals</span>
                <b>₹0 <span className="ml-2 text-slate-400">59%</span></b>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold"><i className="mr-2 text-emerald-500">●</i>Tier 2 Referrals</span>
                <b>₹0 <span className="ml-2 text-slate-400">28%</span></b>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold"><i className="mr-2 text-orange-500">●</i>Bonus Rewards</span>
                <b>₹0 <span className="ml-2 text-slate-400">13%</span></b>
              </div>

            </div>

            <div className="mt-5 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4">

              <div className="flex gap-3">
                <div className="text-2xl">🎁</div>
                <div className="flex-1">
                  <p className="text-xs font-black">Next Milestone</p>
                  <p className="text-[9px] text-slate-500">
                    Keep growing your referral network
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-orange-400 to-amber-500" />
                  </div>
                  <p className="mt-1 text-right text-[9px] font-black text-orange-600">
                    78% complete
                  </p>
                </div>
              </div>

            </div>

          </div>


          {/* TOP REFERRERS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-black">🏆 Top Referrers</h2>
                <p className="text-xs text-slate-500">Best performing referral partners</p>
              </div>

              <button className="rounded-lg border border-blue-100 px-3 py-2 text-[10px] font-bold text-blue-600">
                View All →
              </button>

            </div>


            <div className="mt-5 space-y-3">

              {[
                ["1","DSA Partner 01","0 referrals","₹0"],
                ["2","DSA Partner 02","0 referrals","₹0"],
                ["3","DSA Partner 03","0 referrals","₹0"],
                ["4","DSA Partner 04","0 referrals","₹0"],
                ["5","DSA Partner 05","0 referrals","₹0"],
              ].map((item) => (

                <div
                  key={item[0]}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfdff] p-3"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white">
                    {item[0]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black">{item[1]}</p>
                    <p className="text-[9px] text-slate-400">{item[2]}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">{item[3]}</p>
                    <p className="text-[8px] text-slate-400">earnings</p>
                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ===================================================
            FOOTER
        =================================================== */}
        <footer className="mt-5 border-t border-slate-200 py-4 text-center text-[10px] text-slate-400">
          DSA FinCorp • Refer & Earn • Secure • Transparent • Professional DSA Partner Management
        </footer>

      </main>

    </div>

  </div>
);
}

