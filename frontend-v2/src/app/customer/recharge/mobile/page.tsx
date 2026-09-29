"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  Zap,
  ShieldCheck,
  Gift,
  Wallet,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Wifi,
  CreditCard,
  History,
  BadgeIndianRupee,
  Signal,
  X,
} from "lucide-react";
import api from "@/lib/api";

type RechargeItem = {
  id: string;
  mobileNumber?: string;
  operator?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  rechargeType?: string;
};

const operators = [
  {
    key: "JIO",
    name: "Jio",
    subtitle: "Reliance Jio",
    logo: "Jio",
    cls: "bg-blue-600",
  },
  {
    key: "AIRTEL",
    name: "Airtel",
    subtitle: "Bharti Airtel",
    logo: "airtel",
    cls: "bg-red-500",
  },
  {
    key: "VI",
    name: "Vi",
    subtitle: "Vodafone Idea",
    logo: "Vi",
    cls: "bg-red-600",
  },
  {
    key: "BSNL",
    name: "BSNL",
    subtitle: "Bharat Sanchar",
    logo: "BSNL",
    cls: "bg-white text-slate-800",
  },
];

const quickAmounts = [99, 199, 299, 399, 499, 599, 999];

function unwrap(payload: any) {
  if (!payload) return null;
  return payload.data !== undefined ? payload.data : payload;
}

function money(value: any) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function MobileRechargePage() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState("");
  const [operator, setOperator] = useState("JIO");
  const [rechargeType, setRechargeType] = useState("PREPAID");
  const [amount, setAmount] = useState("299");

  const [walletBalance, setWalletBalance] = useState(0);
  const [recentRecharges, setRecentRecharges] = useState<RechargeItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPlans, setShowPlans] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("loan_finance_token");
      const storedUser = localStorage.getItem("loan_finance_user");

      if (!token || !storedUser) {
        router.replace("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      try {
        const balanceResponse = await api.get(
          "/wallet/balance",
          config
        );

        const balance = unwrap(balanceResponse.data);

        setWalletBalance(
          Number(
            balance?.balance ??
            balance?.availableBalance ??
            0
          )
        );
      } catch {
        setWalletBalance(0);
      }

      try {
        const user = JSON.parse(storedUser);

        const rechargeResponse = await api.get(
          `/recharge/user/${user.id}`,
          config
        );

        const rechargeData = unwrap(rechargeResponse.data);

        const list =
          Array.isArray(rechargeData)
            ? rechargeData
            : rechargeData?.items ||
              rechargeData?.recharges ||
              [];

        setRecentRecharges(list.slice(0, 5));
      } catch {
        setRecentRecharges([]);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load recharge information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isValidMobile =
    /^[6-9]\d{9}$/.test(mobileNumber);

  const rechargeAmount = Number(amount || 0);

  const handleRecharge = async () => {
    setMessage("");
    setError("");

    if (!isValidMobile) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!rechargeAmount || rechargeAmount < 10) {
      setError("Please enter a valid recharge amount.");
      return;
    }

    if (rechargeAmount > walletBalance) {
      setError("Insufficient wallet balance.");
      return;
    }

    try {
      setProcessing(true);

      const token = localStorage.getItem(
        "loan_finance_token"
      );

      const storedUser = localStorage.getItem(
        "loan_finance_user"
      );

      const user = storedUser
        ? JSON.parse(storedUser)
        : null;

      const response = await api.post(
        "/recharge",
        {
          userId: user?.id,
          mobileNumber,
          operator,
          amount: rechargeAmount,
          rechargeType,
          type: "MOBILE",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data?.success !== false) {
        setMessage(
          response.data?.message ||
            "Recharge request submitted successfully."
        );

        setMobileNumber("");
        await loadData();
      } else {
        setError(
          response.data?.message ||
            "Recharge could not be processed."
        );
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Recharge service is currently unavailable."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">

        {/* TOP BAR */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() =>
              router.push("/customer/wallet/balance")
            }
            className="flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-800"
          >
            ← Back to Wallet
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            Home
            <ChevronRight size={13} />
            Recharge
            <ChevronRight size={13} />
            <span className="text-blue-600">
              Mobile Recharge
            </span>
          </div>
        </div>

        {/* =====================================================
            ULTRA AI HERO BANNER
        ===================================================== */}
        <div className="relative mb-4 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0d2fbd] via-[#3155f5] to-[#9a3df0] px-6 py-7 text-white shadow-[0_20px_50px_rgba(37,70,220,0.22)] sm:px-9">

          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-pulse" />
          <div className="absolute right-28 top-[-70px] h-56 w-56 rounded-full bg-cyan-300/20 blur-2xl animate-pulse" />
          <div className="absolute bottom-[-100px] right-[-30px] h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative z-10 grid items-center gap-7 lg:grid-cols-[1fr_430px]">

            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100">
                <Zap size={14} className="fill-yellow-300 text-yellow-300" />
                Fast • Secure • Reliable
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Mobile{" "}
                <span className="text-cyan-200">
                  Recharge
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-base font-medium text-blue-50">
                Stay Connected, Always!
              </p>

              <p className="mt-1 max-w-xl text-sm text-blue-100/90">
                Recharge your mobile instantly with
                powerful wallet technology, best plans
                and exclusive offers.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Zap size={15} className="text-yellow-300" />
                    Instant Recharge
                  </div>
                  <p className="mt-0.5 text-[9px] text-blue-100">
                    In Seconds
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <ShieldCheck
                      size={15}
                      className="text-emerald-300"
                    />
                    100% Secure
                  </div>
                  <p className="mt-0.5 text-[9px] text-blue-100">
                    Safe & Encrypted
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Gift
                      size={15}
                      className="text-pink-200"
                    />
                    Best Offers
                  </div>
                  <p className="mt-0.5 text-[9px] text-blue-100">
                    Save More
                  </p>
                </div>
              </div>
            </div>

            {/* AI PHONE / ANIMATION */}
            <div className="relative hidden h-[185px] lg:block">

              <div className="absolute right-20 top-5 h-24 w-24 rounded-full bg-blue-500/40 blur-xl animate-pulse" />

              <div className="absolute right-4 top-[-5px] h-28 w-28 rounded-full bg-purple-400/30 blur-2xl animate-pulse" />

              <div className="absolute right-16 top-1 flex h-36 w-72 rotate-[-7deg] items-center justify-center rounded-[32px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">

                <div className="relative h-40 w-24 rounded-[22px] border-[5px] border-slate-900 bg-gradient-to-b from-blue-600 to-purple-700 shadow-[0_0_45px_rgba(80,120,255,0.65)]">

                  <div className="absolute left-1/2 top-1.5 h-2.5 w-10 -translate-x-1/2 rounded-full bg-slate-950" />

                  <div className="flex h-full flex-col items-center justify-center">
                    <Zap
                      size={32}
                      className="mb-2 fill-yellow-300 text-yellow-300 animate-pulse"
                    />
                    <span className="text-[10px] font-black">
                      STAY
                    </span>
                    <span className="text-[10px] font-black">
                      CONNECTED
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-400 shadow-lg">
                    <CheckCircle2 size={15} />
                  </div>
                </div>

                <div className="absolute -left-5 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xs font-black shadow-xl animate-bounce">
                  Jio
                </div>

                <div className="absolute -right-5 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xs font-black shadow-xl animate-bounce">
                  Vi
                </div>

                <div className="absolute bottom-0 left-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-[9px] font-black shadow-xl">
                  airtel
                </div>

                <div className="absolute bottom-[-5px] right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[8px] font-black text-slate-700 shadow-xl">
                  BSNL
                </div>
              </div>

              <div className="absolute right-[-2px] top-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black backdrop-blur">
                ✨ AI Smart Recharge
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mb-4 flex flex-wrap overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            className="flex flex-1 items-center justify-center gap-2 border-b-2 border-blue-600 bg-blue-50 px-5 py-3.5 text-sm font-black text-blue-600"
          >
            <Smartphone size={17} />
            Mobile Recharge
          </button>

          <button
            onClick={() =>
              router.push("/customer/recharge/dth")
            }
            className="flex flex-1 items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
          >
            <Wifi size={17} />
            DTH Recharge
          </button>

          <button
            onClick={() =>
              router.push("/customer/recharge/fastag")
            }
            className="flex flex-1 items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
          >
            <CreditCard size={17} />
            FASTag Recharge
          </button>

          <button
            onClick={() =>
              router.push("/customer/recharge/history")
            }
            className="flex flex-1 items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
          >
            <History size={17} />
            Recharge History
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">

          {/* MAIN FORM */}
          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Smartphone size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Recharge Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enter your number, choose operator and select a plan.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPlans(true)}
                className="hidden rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black text-blue-600 sm:block"
              >
                ✨ View Plans
              </button>
            </div>

            {/* MOBILE NUMBER */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                Mobile Number
              </label>

              <div className={`flex overflow-hidden rounded-2xl border bg-white transition ${
                mobileNumber && !isValidMobile
                  ? "border-red-300"
                  : isValidMobile
                  ? "border-emerald-400"
                  : "border-slate-200"
              }`}>

                <div className="flex w-20 items-center justify-center border-r border-slate-200 bg-slate-50 text-sm font-black text-slate-700">
                  +91
                </div>

                <input
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  inputMode="numeric"
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-4 text-base font-bold text-slate-900 outline-none"
                />

                <div className="flex w-14 items-center justify-center">
                  {isValidMobile ? (
                    <CheckCircle2
                      size={22}
                      className="text-emerald-500"
                    />
                  ) : (
                    <Smartphone
                      size={20}
                      className="text-slate-300"
                    />
                  )}
                </div>
              </div>

              <div className="mt-1.5 text-[10px]">
                {isValidMobile ? (
                  <span className="font-bold text-emerald-600">
                    ✓ Valid mobile number
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Enter your 10-digit mobile number
                  </span>
                )}
              </div>
            </div>

            {/* OPERATOR */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Select Operator
                </label>

                <span className="text-[10px] font-bold text-slate-400">
                  {operator} selected
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {operators.map((item) => {
                  const selected =
                    operator === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() =>
                        setOperator(item.key)
                      }
                      className={`relative rounded-2xl border p-4 text-center transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 shadow-[0_8px_25px_rgba(37,99,235,0.12)]"
                          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      {selected && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <CheckCircle2 size={13} />
                        </div>
                      )}

                      <div
                        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-black ${
                          item.cls
                        }`}
                      >
                        {item.logo}
                      </div>

                      <p className="mt-2 text-sm font-black text-slate-900">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        {item.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RECHARGE TYPE */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                Recharge Type
              </label>

              <div className="grid grid-cols-2 gap-2">
                {["PREPAID", "POSTPAID"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setRechargeType(type)
                    }
                    className={`rounded-xl py-3 text-sm font-black transition ${
                      rechargeType === type
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type === "PREPAID"
                      ? "Prepaid"
                      : "Postpaid"}
                  </button>
                ))}
              </div>
            </div>

            {/* PLANS STRIP */}
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                  <Gift size={20} />
                </div>

                <div>
                  <p className="text-sm font-black text-purple-800">
                    Get Best Plans
                  </p>
                  <p className="text-[10px] text-purple-500">
                    Browse latest operator plans & offers
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPlans(true)}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-xs font-black text-white shadow-md"
              >
                View Plans →
              </button>
            </div>

            {/* AMOUNT */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Recharge Amount
                </label>

                <button
                  onClick={() => setShowPlans(true)}
                  className="text-xs font-black text-blue-600"
                >
                  Browse Plans
                </button>
              </div>

              <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex w-14 items-center justify-center border-r border-slate-200 bg-slate-50 text-xl font-black text-slate-600">
                  ₹
                </div>

                <input
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  inputMode="numeric"
                  placeholder="Enter amount"
                  className="w-full px-4 py-4 text-lg font-black outline-none"
                />
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() =>
                      setAmount(String(value))
                    }
                    className={`rounded-xl border py-2.5 text-xs font-black transition ${
                      Number(amount) === value
                        ? "border-blue-600 bg-blue-600 text-white shadow-md"
                        : "border-slate-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    ₹{value}
                  </button>
                ))}
              </div>
            </div>

            {/* WALLET + CTA */}
            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1.4fr]">

              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <Wallet size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Wallet Balance
                    </p>

                    <p className="text-xl font-black text-slate-950">
                      {money(walletBalance)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRecharge}
                disabled={processing || loading}
                className="group flex min-h-[70px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-base font-black text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:scale-[1.01] hover:shadow-[0_16px_38px_rgba(79,70,229,0.36)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <RefreshCw
                      size={21}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap
                      size={21}
                      className="fill-white"
                    />
                    Recharge Now
                    <ArrowRight
                      size={20}
                      className="transition group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </div>

            {/* ALERTS */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                <X size={16} />
                {error}
              </div>
            )}

            {message && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={16} />
                {message}
              </div>
            )}

            <p className="mt-4 text-center text-[10px] text-slate-400">
              By proceeding, you agree to our{" "}
              <span className="font-bold text-blue-600">
                Terms & Conditions
              </span>
            </p>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">

            {/* WALLET */}
            <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#071c50] via-[#123fca] to-[#6625dc] p-6 text-white shadow-xl">
              <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute bottom-[-60px] left-20 h-36 w-36 rounded-full bg-cyan-300/10 blur-xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Wallet size={23} />
                    </div>

                    <div>
                      <p className="text-lg font-black">
                        Wallet Balance
                      </p>
                      <p className="text-[10px] text-blue-100">
                        Available Balance
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-400 px-3 py-1 text-[9px] font-black text-white">
                    WALLET
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black">
                  {money(walletBalance)}
                </p>

                <button
                  onClick={() =>
                    router.push("/customer/wallet/balance")
                  }
                  className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold backdrop-blur hover:bg-white/15"
                >
                  Manage Wallet
                  <ArrowRight size={16} />
                </button>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <button
                    onClick={() =>
                      router.push("/customer/wallet/statement")
                    }
                    className="rounded-xl bg-white/10 p-3 text-[10px] font-bold"
                  >
                    <History
                      size={17}
                      className="mx-auto mb-1"
                    />
                    Statement
                  </button>

                  <button
                    onClick={() =>
                      router.push("/customer/wallet/transactions")
                    }
                    className="rounded-xl bg-white/10 p-3 text-[10px] font-bold"
                  >
                    <Signal
                      size={17}
                      className="mx-auto mb-1"
                    />
                    Transactions
                  </button>

                  <button
                    onClick={() =>
                      router.push("/customer/wallet/balance")
                    }
                    className="rounded-xl bg-white/10 p-3 text-[10px] font-bold"
                  >
                    <Wallet
                      size={17}
                      className="mx-auto mb-1"
                    />
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* OFFER */}
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 p-5 text-white shadow-lg">
              <div className="absolute right-[-20px] top-[-20px] text-7xl opacity-20">
                🎁
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                  <Gift size={16} />
                  Special Offer
                </div>

                <p className="mt-2 text-xl font-black">
                  Get up to 5% Cashback
                </p>

                <p className="text-xs text-white/80">
                  on selected mobile recharges
                </p>

                <button
                  onClick={() => setShowPlans(true)}
                  className="mt-4 rounded-xl bg-white px-4 py-2 text-xs font-black text-rose-600 shadow-md"
                >
                  View Offers →
                </button>
              </div>
            </div>

            {/* WHY */}
            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black text-slate-950">
                Why Recharge with Us?
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  [Zap, "Instant Processing", "Recharge in seconds"],
                  [Gift, "Best Plans & Offers", "Save more every day"],
                  [ShieldCheck, "Secure & Safe", "Protected payments"],
                  [CircleHelp, "24/7 Support", "We are always here"],
                ].map(([Icon, title, sub]: any) => (
                  <div
                    key={title}
                    className="rounded-xl bg-slate-50 p-3"
                  >
                    <Icon
                      size={20}
                      className="mb-2 text-blue-600"
                    />
                    <p className="text-xs font-black text-slate-800">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      {sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT */}
            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Recent Recharges
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Your latest recharge activity
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push("/customer/recharge/history")
                  }
                  className="text-xs font-black text-blue-600"
                >
                  View All →
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {recentRecharges.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-5 text-center">
                    <History
                      size={23}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-2 text-xs font-black text-slate-600">
                      No recent recharges
                    </p>
                    <p className="mt-1 text-[9px] text-slate-400">
                      Your recharge activity will appear here.
                    </p>
                  </div>
                ) : (
                  recentRecharges.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white">
                        {String(
                          item.operator || "JIO"
                        ).slice(0, 4)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-slate-800">
                          {item.mobileNumber || "Mobile Recharge"}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900">
                          {money(item.amount)}
                        </p>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black text-emerald-600">
                          {String(
                            item.status || "PENDING"
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECURE FOOTER */}
        <div className="mt-4 grid gap-3 rounded-[20px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 p-5 sm:grid-cols-3">

          <div className="flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <ShieldCheck size={23} />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-700">
                100% Secure
              </p>
              <p className="text-[9px] text-slate-500">
                Your payments are safe
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-y border-emerald-100 py-3 sm:border-x sm:border-y-0 sm:py-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
              <Signal size={23} />
            </div>
            <div>
              <p className="text-xs font-black text-blue-700">
                All Major Operators
              </p>
              <p className="text-[9px] text-slate-500">
                Jio, Airtel, Vi, BSNL & More
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm">
              <Sparkles size={23} />
            </div>
            <div>
              <p className="text-xs font-black text-purple-700">
                Best Experience
              </p>
              <p className="text-[9px] text-slate-500">
                Fast, Simple & Reliable
              </p>
            </div>
          </div>
        </div>

        {/* PLANS MODAL */}
        {showPlans && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
            <div className="w-full max-w-[620px] overflow-hidden rounded-[26px] bg-white shadow-2xl">

              <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <button
                  onClick={() => setShowPlans(false)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"
                >
                  <X size={18} />
                </button>

                <Sparkles size={28} />

                <h2 className="mt-3 text-2xl font-black">
                  Best Recharge Plans
                </h2>

                <p className="mt-1 text-xs text-blue-100">
                  Select an amount and recharge instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3">
                {[199, 299, 399, 499, 599, 999].map(
                  (value) => (
                    <button
                      key={value}
                      onClick={() => {
                        setAmount(String(value));
                        setShowPlans(false);
                      }}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-blue-600">
                          ₹{value}
                        </span>

                        <BadgeIndianRupee
                          size={17}
                          className="text-purple-500"
                        />
                      </div>

                      <p className="mt-2 text-[10px] font-bold text-slate-500">
                        Recommended Plan
                      </p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        High-speed benefits
                      </p>
                    </button>
                  )
                )}
              </div>

              <div className="border-t border-slate-100 p-5">
                <button
                  onClick={() => setShowPlans(false)}
                  className="w-full rounded-xl bg-slate-100 py-3 text-sm font-black text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
