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
  Wallet,
  IndianRupee,
  RefreshCw,
  PlusCircle,
  Gift,
  TrendingUp,
  Award,
  AlertCircle,
} from "lucide-react";

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
  rewardPaidAmount?: number;
  totalReferrals?: number;
  successfulReferrals?: number;
  rejectedReferrals?: number;
  pendingReferrals?: number;
  totalEarnings?: number;
  createdAt?: string;
  paidAt?: string;
  expiresAt?: string;
  referredUser?: {
    id?: string;
    name?: string;
    email?: string;
    phoneNo?: string;
  };
};

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function ReferralPage() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");

  const [referral, setReferral] = useState<Referral | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  const [earnings, setEarnings] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "referrals" | "earnings"
  >("overview");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(
        "loan_finance_user"
      );
      const storedToken = localStorage.getItem(
        "loan_finance_token"
      );

      const parsedUser = storedUser
        ? JSON.parse(storedUser)
        : null;

      setUser(parsedUser);
      setToken(storedToken || "");
    } catch {
      setError("Unable to read login session.");
    }
  }, []);

  const userId = user?.id || user?.userId;

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    }),
    [token]
  );

  const request = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const response = await fetch(`${API}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        ...authHeaders,
        ...(options.headers || {}),
      },
      cache: "no-store",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(
        json?.message ||
          json?.error ||
          "Request failed."
      );
    }

    return json;
  };

  const loadReferralData = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const [
        dsaResponse,
        earningsResponse,
        rewardsResponse,
      ] = await Promise.all([
        request(`/referral/dsa/${userId}`),
        request(`/referral/earnings/${userId}`),
        request(`/referral/rewards/${userId}`),
      ]);

      const dsaData =
        dsaResponse?.data ??
        dsaResponse?.referrals ??
        [];

      const referralList = Array.isArray(dsaData)
        ? dsaData
        : [];

      setReferrals(referralList);

      /*
       * Backend returns user-specific referral records.
       * Usually there is one main referral-program record.
       */
      const mainReferral =
        referralList.find(
          (item: Referral) =>
            item.userId === userId
        ) ||
        referralList[0] ||
        null;

      setReferral(mainReferral);

      setEarnings(
        Number(
          earningsResponse?.totalEarnings ??
            earningsResponse?.data?.totalEarnings ??
            0
        )
      );

      setRewardAmount(
        Number(
          rewardsResponse?.rewardAmount ??
            rewardsResponse?.data?.rewardAmount ??
            0
        )
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to load referral information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadReferralData();
    }
  }, [userId]);

  const createReferral = async () => {
    if (!userId) {
      setError("User session not found. Please login again.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await request("/referral/", {
        method: "POST",
        body: JSON.stringify({
          userId,
          source: "DSA",
          campaign: "DSA_REFERRAL",
        }),
      });

      const created =
        response?.referral ||
        response?.data ||
        null;

      if (created) {
        setReferral(created);
      }

      await loadReferralData();
    } catch (err: any) {
      /*
       * Existing backend returns an error when a referral
       * setup already exists. In that case we simply reload it.
       */
      if (
        String(err?.message || "").toLowerCase().includes(
          "exists"
        )
      ) {
        await loadReferralData();
      } else {
        setError(
          err?.message ||
            "Unable to create referral program."
        );
      }
    } finally {
      setCreating(false);
    }
  };

  const referralCode =
    referral?.referralCode || "";

  const referralLink =
    referral?.referralLink ||
    (referralCode
      ? `https://dsafincorp.com/ref/${referralCode}`
      : "");

  const totalReferrals = referrals.reduce(
    (sum, item) =>
      sum + Number(item.totalReferrals || 0),
    0
  );

  const successfulReferrals = referrals.reduce(
    (sum, item) =>
      sum + Number(item.successfulReferrals || 0),
    0
  );

  const pendingReferrals = referrals.reduce(
    (sum, item) =>
      sum + Number(item.pendingReferrals || 0),
    0
  );

  const rejectedReferrals = referrals.reduce(
    (sum, item) =>
      sum + Number(item.rejectedReferrals || 0),
    0
  );

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy referral link.");
    }
  };

  const shareWhatsApp = () => {
    if (!referralLink) return;

    const text = encodeURIComponent(
      `Join India Loan Finance using my referral link:\n\n${referralLink}`
    );

    window.open(
      `https://wa.me/?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareReferral = async () => {
    if (!referralLink) return;

    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title: "India Loan Finance Referral",
          text: "Join using my referral link",
          url: referralLink,
        });
      } catch {
        // User cancelled share.
      }
    } else {
      await copyReferralLink();
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyle = (status?: string) => {
    const value = String(
      status || ""
    ).toUpperCase();

    if (value === "PAID") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (
      value === "REWARDED" ||
      value === "APPROVED"
    ) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (value === "REJECTED") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3">
                  <Gift size={28} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Refer & Earn
                  </h1>

                  <p className="mt-1 text-sm text-blue-100 sm:text-base">
                    Refer new users and earn rewards through
                    your referral program.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={loadReferralData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* TABS */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("referrals")}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              activeTab === "referrals"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            My Referrals
          </button>

          <button
            onClick={() => setActiveTab("earnings")}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              activeTab === "earnings"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Referral Earnings
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <RefreshCw
                size={24}
                className="animate-spin"
              />
              Loading referral data...
            </div>
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">

                {/* STATS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <Users
                      className="text-blue-600"
                      size={25}
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Total Referrals
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {totalReferrals}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <UserCheck
                      className="text-emerald-600"
                      size={25}
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Successful
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {successfulReferrals}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <Clock3
                      className="text-amber-600"
                      size={25}
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Pending
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {pendingReferrals}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <IndianRupee
                      className="text-purple-600"
                      size={25}
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Total Earnings
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {money(earnings)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <Wallet
                      className="text-cyan-600"
                      size={25}
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Reward Amount
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {money(rewardAmount)}
                    </p>
                  </div>

                </div>

                {/* REFERRAL LINK */}
                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Link2 size={24} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Your Referral Link
                        </h2>

                        <p className="text-sm text-slate-500">
                          Share this link with your referrals.
                        </p>
                      </div>
                    </div>

                    {!referral ? (
                      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                        <Gift
                          size={38}
                          className="mx-auto text-blue-600"
                        />

                        <h3 className="mt-4 font-bold text-slate-900">
                          Referral program not activated
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          Create your referral profile to get
                          your unique referral code and link.
                        </p>

                        <button
                          onClick={createReferral}
                          disabled={creating}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          {creating ? (
                            <RefreshCw
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <PlusCircle size={18} />
                          )}

                          {creating
                            ? "Creating..."
                            : "Activate Refer & Earn"}
                        </button>

                      </div>
                    ) : (
                      <div className="mt-6 space-y-4">

                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Referral Code
                          </p>

                          <div className="flex items-center gap-3">
                            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg font-bold tracking-wider text-slate-900">
                              {referralCode || "—"}
                            </div>

                            <button
                              onClick={async () => {
                                if (!referralCode) return;

                                await navigator.clipboard.writeText(
                                  referralCode
                                );

                                setCopied(true);

                                setTimeout(
                                  () => setCopied(false),
                                  2000
                                );
                              }}
                              className="rounded-xl border border-slate-300 p-3 hover:bg-slate-50"
                              title="Copy referral code"
                            >
                              {copied ? (
                                <Check
                                  size={20}
                                  className="text-emerald-600"
                                />
                              ) : (
                                <Copy size={20} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Referral Link
                          </p>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                              <span className="block truncate">
                                {referralLink}
                              </span>
                            </div>

                            <button
                              onClick={copyReferralLink}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                            >
                              {copied ? (
                                <>
                                  <Check size={18} />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={18} />
                                  Copy Link
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <button
                            onClick={shareWhatsApp}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                          >
                            <MessageCircle size={18} />
                            WhatsApp
                          </button>

                          <button
                            onClick={shareReferral}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <Share2 size={18} />
                            Share
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* EARNING CARD */}
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg">

                    <TrendingUp size={30} />

                    <p className="mt-6 text-sm text-emerald-100">
                      Referral Earnings
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                      {money(earnings)}
                    </p>

                    <div className="mt-6 border-t border-white/20 pt-5">
                      <p className="text-sm text-emerald-100">
                        Reward Amount
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {money(rewardAmount)}
                      </p>
                    </div>

                    <div className="mt-6 rounded-xl bg-white/10 p-4">
                      <p className="text-sm leading-6 text-emerald-50">
                        Referral rewards are credited according
                        to the referral program rules and successful
                        referral processing.
                      </p>
                    </div>

                  </div>

                </div>

                {/* HOW IT WORKS */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">
                    How Refer & Earn Works
                  </h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-4">

                    {[
                      {
                        icon: Link2,
                        title: "1. Get Your Link",
                        text: "Use your unique referral link or referral code.",
                      },
                      {
                        icon: Share2,
                        title: "2. Share",
                        text: "Share your referral link with new users.",
                      },
                      {
                        icon: Users,
                        title: "3. Referral",
                        text: "A new user registers through your referral.",
                      },
                      {
                        icon: Award,
                        title: "4. Earn Reward",
                        text: "Eligible referral rewards are recorded in your account.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="rounded-xl border border-slate-200 p-5"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Icon size={22} />
                          </div>

                          <h3 className="mt-4 font-bold text-slate-900">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}

                  </div>
                </div>

              </div>
            )}

            {/* REFERRALS */}
            {activeTab === "referrals" && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    My Referrals
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    View your referral activity and referral status.
                  </p>
                </div>

                {referrals.length === 0 ? (
                  <div className="flex min-h-[350px] flex-col items-center justify-center p-8 text-center">
                    <Users
                      size={42}
                      className="text-slate-300"
                    />

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      No referrals yet
                    </h3>

                    <p className="mt-2 max-w-md text-sm text-slate-500">
                      Share your referral link to start building
                      your referral network.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left">
                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Referral Code
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Campaign
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Referrals
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Successful
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Earnings
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Status
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Created
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {referrals.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <span className="font-mono text-sm font-bold text-slate-900">
                                {item.referralCode || "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {item.campaign || "—"}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                              {item.totalReferrals || 0}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-emerald-700">
                              {item.successfulReferrals || 0}
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-slate-900">
                              {money(
                                Number(
                                  item.totalEarnings || 0
                                )
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(
                                  item.status
                                )}`}
                              >
                                {item.status || "PENDING"}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {formatDate(item.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* EARNINGS */}
            {activeTab === "earnings" && (
              <div className="space-y-6">

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <IndianRupee
                      size={25}
                      className="text-emerald-600"
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Total Earnings
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {money(earnings)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <Gift
                      size={25}
                      className="text-purple-600"
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Reward Amount
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {money(rewardAmount)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <UserCheck
                      size={25}
                      className="text-blue-600"
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Successful Referrals
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {successfulReferrals}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <Clock3
                      size={25}
                      className="text-amber-600"
                    />
                    <p className="mt-4 text-sm text-slate-500">
                      Pending Referrals
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {pendingReferrals}
                    </p>
                  </div>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">
                    Earnings History
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Referral earning information returned by your
                    referral records.
                  </p>

                  {referrals.length === 0 ? (
                    <div className="py-16 text-center">
                      <Wallet
                        size={40}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-4 font-semibold text-slate-700">
                        No earnings history yet
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {referrals.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-900">
                              Referral {item.referralCode || "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="font-bold text-emerald-600">
                              {money(
                                Number(
                                  item.totalEarnings || 0
                                )
                              )}
                            </p>

                            <span
                              className={`mt-1 inline-block rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyle(
                                item.status
                              )}`}
                            >
                              {item.status || "PENDING"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}

        {/* FOOTER */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="font-bold text-slate-900">
            India Loan Finance — Refer & Earn
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Your referral rewards and earnings are based on the
            referral records maintained by the platform.
          </p>
        </div>

      </div>
    </div>
  );
}
