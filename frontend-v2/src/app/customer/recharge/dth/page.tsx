"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Crown,
  IndianRupee,
  Info,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tv,
  Wallet,
  Zap,
} from "lucide-react";
import api from "@/lib/api";

type User = {
  id: string;
  name?: string;
  fullName?: string;
};

type Operator = {
  id: string;
  name: string;
  logo: string;
  subtitle: string;
  tone: string;
};

type Plan = {
  id: string;
  operator: string;
  name: string;
  price: number;
  channels: number;
  hd: number;
  validity: string;
  category: string;
  language: string;
  description: string;
  popular?: boolean;
  featured?: boolean;
};

type Recharge = {
  id: string;
  mobileNumber?: string;
  operator?: string;
  amount?: number;
  rechargeType?: string;
  status?: string;
  createdAt?: string;
};

const operators: Operator[] = [
  {
    id: "TATA_PLAY",
    name: "Tata Play",
    logo: "TATA",
    subtitle: "Entertainment & regional",
    tone: "from-red-500 to-orange-500",
  },
  {
    id: "AIRTEL_DTH",
    name: "Airtel DTH",
    logo: "airtel",
    subtitle: "HD, family & sports",
    tone: "from-red-600 to-rose-500",
  },
  {
    id: "DISH_TV",
    name: "Dish TV",
    logo: "dish",
    subtitle: "Family & regional",
    tone: "from-blue-600 to-cyan-500",
  },
  {
    id: "D2H",
    name: "Videocon d2h",
    logo: "d2h",
    subtitle: "Entertainment & combo",
    tone: "from-indigo-600 to-violet-500",
  },
  {
    id: "SUN_DIRECT",
    name: "Sun Direct",
    logo: "SUN",
    subtitle: "South & regional",
    tone: "from-orange-500 to-yellow-400",
  },
];

const plans: Plan[] = [
  {
    id: "tp1",
    operator: "TATA_PLAY",
    name: "Hindi Dhamaaka",
    price: 235,
    channels: 65,
    hd: 1,
    validity: "1 Month",
    category: "Entertainment",
    language: "Hindi",
    description: "TV shows, movies, news, music, kids & lifestyle",
    popular: true,
  },
  {
    id: "tp2",
    operator: "TATA_PLAY",
    name: "Marathi Super Value",
    price: 83,
    channels: 13,
    hd: 0,
    validity: "1 Month",
    category: "Regional",
    language: "Marathi",
    description: "Popular Marathi entertainment and news",
  },
  {
    id: "tp3",
    operator: "TATA_PLAY",
    name: "OTT Entertainment",
    price: 399,
    channels: 80,
    hd: 20,
    validity: "1 Month",
    category: "OTT",
    language: "Multi",
    description: "Entertainment pack with premium OTT content",
    featured: true,
  },
  {
    id: "air1",
    operator: "AIRTEL_DTH",
    name: "Family Sports HD",
    price: 399,
    channels: 100,
    hd: 40,
    validity: "1 Month",
    category: "Sports",
    language: "Hindi",
    description: "Family entertainment, kids & sports",
    popular: true,
  },
  {
    id: "air2",
    operator: "AIRTEL_DTH",
    name: "Hindi Basic HD",
    price: 249,
    channels: 47,
    hd: 47,
    validity: "1 Month",
    category: "HD Packs",
    language: "Hindi",
    description: "Hindi entertainment, news and movies",
  },
  {
    id: "air3",
    operator: "AIRTEL_DTH",
    name: "Premium Hindi",
    price: 329,
    channels: 56,
    hd: 56,
    validity: "1 Month",
    category: "Entertainment",
    language: "Hindi",
    description: "Premium Hindi entertainment channels",
  },
  {
    id: "dish1",
    operator: "DISH_TV",
    name: "Super Family Pack",
    price: 299,
    channels: 75,
    hd: 15,
    validity: "1 Month",
    category: "Family",
    language: "Multi",
    description: "Movies, sports, news & regional entertainment",
    popular: true,
  },
  {
    id: "dish2",
    operator: "DISH_TV",
    name: "Family HSM",
    price: 219,
    channels: 39,
    hd: 0,
    validity: "1 Month",
    category: "Family",
    language: "Hindi",
    description: "News, entertainment and movies",
  },
  {
    id: "d2h1",
    operator: "D2H",
    name: "Entertainment Plus",
    price: 249,
    channels: 60,
    hd: 8,
    validity: "1 Month",
    category: "Entertainment",
    language: "Multi",
    description: "Entertainment, news, movies and kids",
    popular: true,
  },
  {
    id: "d2h2",
    operator: "D2H",
    name: "Sports HD Combo",
    price: 399,
    channels: 85,
    hd: 20,
    validity: "1 Month",
    category: "Sports",
    language: "Multi",
    description: "Sports, entertainment and news",
  },
  {
    id: "sun1",
    operator: "SUN_DIRECT",
    name: "Tamil Ultimate",
    price: 165,
    channels: 23,
    hd: 23,
    validity: "1 Month",
    category: "Regional",
    language: "Tamil",
    description: "Popular Tamil entertainment, movies, music and news channels",
  },
  {
    id: "sun2",
    operator: "SUN_DIRECT",
    name: "Telugu Joy",
    price: 208,
    channels: 16,
    hd: 0,
    validity: "1 Month",
    category: "Regional",
    language: "Telugu",
    description: "Popular Telugu entertainment, movies and regional channels",
  },
];

const categories = [
  "All Plans",
  "Popular",
  "HD Packs",
  "Sports",
  "Entertainment",
  "Regional",
  "Family",
  "OTT",
  "Kids",
  "News",
];

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const mask = (value = "") =>
  value.length > 4
    ? `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`
    : value;

export default function DthRechargePage() {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [operator, setOperator] = useState("TATA_PLAY");
  const [category, setCategory] = useState("All Plans");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [detailsPlan, setDetailsPlan] = useState<Plan | null>(null);
  const [recent, setRecent] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const token = localStorage.getItem("loan_finance_token");
      const stored = localStorage.getItem("loan_finance_user");

      if (!token || !stored) {
        window.location.href = "/login";
        return;
      }

      const currentUser = JSON.parse(stored) as User;
      setUser(currentUser);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const [walletRes, rechargeRes] = await Promise.all([
        api.get("/wallet/balance", config),
        api.get(`/recharge/user/${currentUser.id}`, config),
      ]);

      const walletData =
        walletRes?.data?.data ||
        walletRes?.data?.wallet ||
        walletRes?.data ||
        {};

      setWallet(Number(walletData?.balance || 0));

      const raw =
        rechargeRes?.data?.data ||
        rechargeRes?.data?.recharges ||
        [];

      setRecent(
        (Array.isArray(raw) ? raw : [])
          .filter(
            (x: Recharge) =>
              String(x.rechargeType || "").toUpperCase() === "DTH"
          )
          .slice(0, 5)
      );
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        window.location.href = "/login";
        return;
      }

      setMessage(
        error?.response?.data?.message ||
          "Unable to load DTH recharge data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredPlans = useMemo(() => {
    const q = search.trim().toLowerCase();

    const result = plans.filter((plan) => {
      if (plan.operator !== operator) return false;

      const categoryMatch =
        category === "All Plans"
          ? true
          : category === "Popular"
            ? !!plan.popular
            : plan.category === category;

      if (!categoryMatch) return false;

      if (!q) return true;

      return (
        plan.name.toLowerCase().includes(q) ||
        plan.language.toLowerCase().includes(q) ||
        plan.category.toLowerCase().includes(q) ||
        plan.description.toLowerCase().includes(q)
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "channels") return b.channels - a.channels;
      return Number(b.popular) - Number(a.popular);
    });
  }, [operator, category, search, sort]);

  const currentOperator =
    operators.find((x) => x.id === operator) || operators[0];

  const choosePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setAmount(String(plan.price));
    setMessage("");
  };

  const copyId = async () => {
    if (!customerId) return;

    try {
      await navigator.clipboard.writeText(customerId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const recharge = async () => {
    const value = Number(amount);

    if (!customerId.trim()) {
      setMessage("Please enter your DTH Customer / Subscriber ID.");
      return;
    }

    if (!/^[A-Za-z0-9]{6,15}$/.test(customerId.trim())) {
      setMessage("Please enter a valid Customer / Subscriber ID.");
      return;
    }

    if (!value || value < 10) {
      setMessage("Minimum recharge amount is ₹10.");
      return;
    }

    if (value > wallet) {
      setMessage("Insufficient wallet balance.");
      return;
    }

    if (!user?.id) {
      setMessage("User session expired. Please login again.");
      return;
    }

    try {
      setProcessing(true);
      setMessage("");

      const token = localStorage.getItem("loan_finance_token");

      const response = await api.post(
        "/recharge",
        {
          userId: user.id,
          mobileNumber: customerId.trim(),
          operator,
          amount: value,
          rechargeType: "DTH",
          paymentMethod: "Wallet",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Recharge failed."
        );
      }

      setAmount("");
      setSelectedPlan(null);
      setMessage(
        `DTH recharge of ${money(value)} completed successfully.`
      );

      await loadData();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        window.location.href = "/login";
        return;
      }

      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "DTH recharge failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f5f7ff]">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-xl">
          <Loader2 size={22} className="animate-spin text-indigo-600" />
          <span className="font-bold text-slate-700">
            Loading DTH Recharge...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7ff]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6">

        {/* BREADCRUMB */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/customer/dashboard">Dashboard</Link>
              <ChevronRight size={13} />
              <span>Recharge</span>
              <ChevronRight size={13} />
              <span className="font-black text-indigo-600">
                DTH Recharge
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
              DTH Recharge
            </h1>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-600"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* PREMIUM HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#080f3f] shadow-[0_25px_80px_rgba(31,41,139,.25)]">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="absolute -bottom-32 left-[35%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/5" />

          <div className="relative grid min-h-[330px] items-center gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.15fr]">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black tracking-wider text-cyan-200 backdrop-blur-xl">
                <Sparkles size={13} />
                PREMIUM DTH EXPERIENCE
              </div>

              <h2 className="mt-5 max-w-xl text-4xl font-black leading-[1.02] text-white md:text-6xl">
                Entertainment
                <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                  Never Stops!
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-6 text-indigo-100 md:text-base">
                Recharge your DTH connection with a faster, smarter
                and premium digital experience.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[9px] font-bold text-indigo-200">
                    OPERATORS
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    5+
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[9px] font-bold text-indigo-200">
                    PLAN TYPES
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    10+
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[9px] font-bold text-indigo-200">
                    PAYMENT
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    Wallet
                  </p>
                </div>
              </div>
            </div>

            {/* CINEMATIC TV */}
            <div className="relative hidden h-[280px] items-center justify-center lg:flex">
              <div className="absolute h-60 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

              <div className="relative w-[430px] rotate-[-2deg] rounded-[26px] border-[7px] border-slate-900 bg-black p-2 shadow-[0_35px_90px_rgba(0,0,0,.6)]">
                <div className="absolute -bottom-7 left-1/2 h-8 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />

                <div className="overflow-hidden rounded-[17px] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[8px] font-black text-white">
                      LIVE TV
                    </span>
                    <span className="text-[9px] font-black text-white/80">
                      4K ENTERTAINMENT
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["MOVIE", "🎬"],
                      ["SPORTS", "🏆"],
                      ["NEWS", "📰"],
                      ["KIDS", "🧸"],
                      ["MUSIC", "🎵"],
                      ["LIVE", "📺"],
                    ].map(([name, icon]) => (
                      <div
                        key={name}
                        className="rounded-xl border border-white/10 bg-white/15 p-4 text-center backdrop-blur"
                      >
                        <div className="text-2xl">{icon}</div>
                        <p className="mt-2 text-[9px] font-black text-white">
                          {name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATUS */}
        {message && (
          <div
            className={`mt-5 flex items-center gap-3 rounded-2xl border p-4 text-sm font-black ${
              message.toLowerCase().includes("success")
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {/* OPERATOR STRIP */}
        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                Choose Provider
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Select Your DTH Operator
              </h2>
            </div>

            <span className="hidden text-xs font-bold text-slate-400 md:block">
              {currentOperator.name} selected
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {operators.map((item) => {
              const active = operator === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setOperator(item.id);
                    setSelectedPlan(null);
                    setAmount("");
                    setCategory("All Plans");
                  }}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-xl shadow-indigo-100"
                      : "border-slate-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
                  }`}
                >
                  {active && (
                    <div className="absolute right-3 top-3 rounded-full bg-indigo-600 p-1.5 text-white shadow-lg">
                      <Check size={11} />
                    </div>
                  )}

                  <div
                    className={`flex h-12 items-center justify-center rounded-xl bg-gradient-to-r ${item.tone} text-sm font-black text-white shadow-lg`}
                  >
                    {item.logo}
                  </div>

                  <p className="mt-3 font-black text-slate-900">
                    {item.name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    {item.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* CUSTOMER CARD */}
            <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-indigo-100/60 blur-3xl" />

              <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                      <Tv size={19} />
                    </span>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                        Connection Details
                      </p>

                      <h2 className="text-xl font-black text-slate-950">
                        DTH Customer ID
                      </h2>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    Enter your Customer ID / Subscriber ID to continue.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700">
                  <ShieldCheck size={15} />
                  SECURE CONNECTION
                </div>
              </div>

              <div className="relative mt-6">
                <Tv
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                />

                <input
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(
                      e.target.value
                        .replace(/[^A-Za-z0-9]/g, "")
                        .slice(0, 15)
                    );
                    setMessage("");
                  }}
                  placeholder="Enter Customer ID / Subscriber ID"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-14 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

                {customerId && (
                  <button
                    onClick={copyId}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {copied ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-semibold text-slate-400">
                <span>✓ Fast processing</span>
                <span>✓ Secure payment</span>
                <span>✓ Multiple plans</span>
              </div>
            </section>

            {/* PLAN SECTION */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                    Plans & Packs
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {currentOperator.name} Plans
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Browse plans and select the one that suits you.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search plans..."
                      className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <button
                    onClick={() =>
                      setSort(
                        sort === "recommended"
                          ? "low"
                          : sort === "low"
                            ? "high"
                            : sort === "high"
                              ? "channels"
                              : "recommended"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                  >
                    <ArrowDownUp size={14} />
                    Sort
                  </button>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-[10px] font-black transition ${
                      category === item
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold text-slate-500">
                  Showing{" "}
                  <span className="font-black text-slate-900">
                    {filteredPlans.length}
                  </span>{" "}
                  plans
                </p>

                <span className="text-[10px] font-bold text-slate-400">
                  {sort === "low"
                    ? "Price: Low to High"
                    : sort === "high"
                      ? "Price: High to Low"
                      : sort === "channels"
                        ? "Most Channels"
                        : "Recommended"}
                </span>
              </div>

              {/* PLAN CARDS */}
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredPlans.map((plan) => (
                  <article
                    key={plan.id}
                    className={`group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      selectedPlan?.id === plan.id
                        ? "border-indigo-500 ring-2 ring-indigo-100"
                        : "border-slate-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-2.5 py-1 text-[8px] font-black text-white shadow">
                        MOST POPULAR
                      </div>
                    )}

                    {plan.featured && (
                      <div className="absolute left-3 top-3 rounded-full bg-violet-100 px-2.5 py-1 text-[8px] font-black text-violet-700">
                        FEATURED
                      </div>
                    )}

                    <button
                      onClick={() => setDetailsPlan(plan)}
                      className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-300 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Info size={16} />
                    </button>

                    <div className="mt-8">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-indigo-600">
                          {currentOperator.logo}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[8px] font-black text-slate-500">
                          {plan.language}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-black text-slate-900">
                        {plan.name}
                      </h3>

                      <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-slate-50 p-2 text-center">
                        <p className="text-sm font-black text-slate-900">
                          {plan.channels}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400">
                          Channels
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2 text-center">
                        <p className="text-sm font-black text-slate-900">
                          {plan.hd}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400">
                          HD
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2 text-center">
                        <p className="text-sm font-black text-slate-900">
                          30
                        </p>
                        <p className="text-[8px] font-bold text-slate-400">
                          Days
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-black text-slate-950">
                          {money(plan.price)}
                        </p>

                        <p className="text-[9px] text-slate-400">
                          {plan.validity}
                        </p>
                      </div>

                      <button
                        onClick={() => choosePlan(plan)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-[10px] font-black text-white shadow-lg shadow-indigo-100 hover:from-indigo-600 hover:to-purple-700"
                      >
                        Select
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </article>
                ))}

                {!filteredPlans.length && (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                    <Search size={34} className="mx-auto text-slate-300" />
                    <p className="mt-3 font-black text-slate-700">
                      No plans found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try another category or search keyword.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5">

            {/* WALLET */}
            <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#1726b8] via-[#4430d9] to-[#7424db] p-5 text-white shadow-2xl">
              <div className="absolute" />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-indigo-100">
                    Available Wallet
                  </p>

                  <p className="mt-2 text-4xl font-black">
                    {money(wallet)}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-indigo-100">
                    Ready for your DTH recharge
                  </p>
                </div>

                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <Wallet size={23} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  href="/customer/wallet/balance"
                  className="rounded-xl bg-white/10 px-3 py-2.5 text-center text-[10px] font-black hover:bg-white/20"
                >
                  Wallet
                </Link>

                <Link
                  href="/customer/wallet/transactions"
                  className="rounded-xl bg-white/10 px-3 py-2.5 text-center text-[10px] font-black hover:bg-white/20"
                >
                  Transactions
                </Link>
              </div>

              <Link
                href="/customer/wallet/statement"
                className="mt-3 block rounded-xl bg-white/10 px-3 py-2.5 text-center text-[10px] font-black hover:bg-white/20"
              >
                View Statement →
              </Link>

              <div className="my-5 h-px bg-white/15" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-indigo-100">
                    RECHARGING
                  </p>

                  <p className="mt-1 font-black">
                    {currentOperator.name}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 px-3 py-2 text-[9px] font-black">
                  WALLET
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[10px] font-black text-indigo-100">
                  Recharge Amount
                </label>

                <div className="relative">
                  <IndianRupee
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300"
                  />

                  <input
                    value={amount}
                    onChange={(e) => {
                      setAmount(
                        e.target.value.replace(/[^\d.]/g, "")
                      );
                      setSelectedPlan(null);
                      setMessage("");
                    }}
                    placeholder="Enter amount"
                    inputMode="decimal"
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-4 pl-10 pr-3 text-xl font-black text-white outline-none placeholder:text-indigo-200 focus:bg-white/15"
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {[100, 200, 300, 500].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setAmount(String(value));
                      setSelectedPlan(null);
                    }}
                    className="rounded-xl border border-white/10 bg-white/10 py-2 text-[10px] font-black hover:bg-white/20"
                  >
                    ₹{value}
                  </button>
                ))}
              </div>

              {selectedPlan && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/15 p-2">
                      <Crown size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black">
                        {selectedPlan.name}
                      </p>

                      <p className="text-[9px] text-indigo-100">
                        {selectedPlan.channels} Channels •{" "}
                        {selectedPlan.validity}
                      </p>
                    </div>

                    <p className="font-black">
                      {money(selectedPlan.price)}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={recharge}
                disabled={processing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-xs font-black text-indigo-700 shadow-xl hover:bg-indigo-50 disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Recharge Now
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-semibold text-indigo-100">
                <LockKeyhole size={12} />
                Protected Wallet Payment
              </div>
            </section>

            {/* PREMIUM OFFER */}
            <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 p-5 text-white shadow-xl">
              <div className="absolute -right-8 -top-10 text-[110px] font-black opacity-10">
                %
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[8px] font-black">
                  <Sparkles size={11} />
                  LIMITED OFFER
                </div>

                <h3 className="mt-3 text-2xl font-black">
                  Get up to 5% Cashback
                </h3>

                <p className="mt-1 max-w-[250px] text-[10px] leading-5 text-white/85">
                  Recharge selected DTH plans and unlock available offers.
                </p>

                <button className="mt-4 rounded-xl bg-white px-4 py-2.5 text-[10px] font-black text-pink-600 shadow-lg">
                  Explore Offers →
                </button>
              </div>
            </section>

            {/* RECENT */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-indigo-500">
                    Activity
                  </p>

                  <h3 className="mt-1 font-black text-slate-950">
                    Recent DTH Recharge
                  </h3>
                </div>

                <Link
                  href="/customer/recharge/recent"
                  className="text-[10px] font-black text-indigo-600"
                >
                  View All →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {recent.length ? (
                  recent.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-xs font-black text-indigo-600">
                        TV
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-slate-900">
                          {item.operator || "DTH"}
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          {mask(item.mobileNumber)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900">
                          {money(Number(item.amount || 0))}
                        </p>

                        <p className="mt-1 text-[8px] font-black text-emerald-600">
                          {String(item.status || "PENDING")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Clock3 size={28} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-xs font-black text-slate-500">
                      No DTH recharge yet
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* QUICK SERVICES */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-black text-slate-950">
                Quick Services
              </h3>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Link
                  href="/customer/recharge/mobile"
                  className="rounded-2xl bg-blue-50 p-4 text-center transition hover:-translate-y-1 hover:bg-blue-100"
                >
                  <div className="text-lg font-black text-blue-600">M</div>
                  <p className="mt-1 text-[9px] font-black text-slate-700">
                    Mobile
                  </p>
                </Link>

                <Link
                  href="/customer/recharge/fastag"
                  className="rounded-2xl bg-orange-50 p-4 text-center transition hover:-translate-y-1 hover:bg-orange-100"
                >
                  <div className="text-lg font-black text-orange-600">F</div>
                  <p className="mt-1 text-[9px] font-black text-slate-700">
                    FASTag
                  </p>
                </Link>

                <Link
                  href="/customer/recharge/recent"
                  className="rounded-2xl bg-violet-50 p-4 text-center transition hover:-translate-y-1 hover:bg-violet-100"
                >
                  <div className="text-lg font-black text-violet-600">R</div>
                  <p className="mt-1 text-[9px] font-black text-slate-700">
                    History
                  </p>
                </Link>
              </div>
            </section>
          </aside>
        </div>

        {/* TRUST BAR */}
        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                icon: <Zap size={19} />,
                title: "Fast Recharge",
                text: "Quick digital experience",
              },
              {
                icon: <ShieldCheck size={19} />,
                title: "Secure Payment",
                text: "Wallet protected",
              },
              {
                icon: <Tv size={19} />,
                title: "Multiple DTH",
                text: "Choose your operator",
              },
              {
                icon: <Crown size={19} />,
                title: "Premium Plans",
                text: "Flexible packs",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0 md:border-b-0 md:border-r md:pb-0 md:last:border-0"
              >
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  {item.icon}
                </div>

                <div>
                  <p className="text-xs font-black text-slate-900">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[9px] font-semibold text-slate-400">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* PLAN DETAILS MODAL */}
      {detailsPlan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setDetailsPlan(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-indigo-100">
                    Plan Details
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {detailsPlan.name}
                  </h3>
                </div>

                <button
                  onClick={() => setDetailsPlan(null)}
                  className="rounded-xl bg-white/10 px-3 py-2 text-sm font-black hover:bg-white/20"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[9px] font-bold text-slate-400">
                    PRICE
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {money(detailsPlan.price)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[9px] font-bold text-slate-400">
                    VALIDITY
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950">
                    {detailsPlan.validity}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[9px] font-bold text-slate-400">
                    CHANNELS
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950">
                    {detailsPlan.channels}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[9px] font-bold text-slate-400">
                    HD CHANNELS
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950">
                    {detailsPlan.hd}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                {detailsPlan.description}
              </p>

              <button
                onClick={() => {
                  choosePlan(detailsPlan);
                  setDetailsPlan(null);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 text-xs font-black text-white shadow-xl"
              >
                Select This Plan
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

