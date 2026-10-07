"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Smartphone,
  Wifi,
  Phone,
  MessageSquare,
  Zap,
  Gift,
  Tv,
  Globe,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Star,
  ShieldCheck,
  X,
} from "lucide-react";

type Plan = {
  id: string;
  operator: string;
  category: string;
  title: string;
  amount: number;
  validity: string;
  data: string;
  voice: string;
  sms: string;
  benefits: string[];
  popular?: boolean;
};

const operators = ["ALL", "JIO", "AIRTEL", "VI", "BSNL"];

const categories = [
  {
    key: "ALL",
    label: "All Plans",
    icon: Sparkles,
  },
  {
    key: "UNLIMITED",
    label: "Unlimited",
    icon: Zap,
  },
  {
    key: "DATA",
    label: "Data",
    icon: Wifi,
  },
  {
    key: "VOICE",
    label: "Voice",
    icon: Phone,
  },
  {
    key: "SMS",
    label: "SMS",
    icon: MessageSquare,
  },
  {
    key: "TOPUP",
    label: "Top Up",
    icon: Smartphone,
  },
  {
    key: "5G",
    label: "5G",
    icon: Zap,
  },
  {
    key: "OTT",
    label: "OTT",
    icon: Tv,
  },
  {
    key: "ROAMING",
    label: "Roaming",
    icon: Globe,
  },
  {
    key: "SPECIAL",
    label: "Special Offers",
    icon: Gift,
  },
];

const plans: Plan[] = [
  {
    id: "jio-199",
    operator: "JIO",
    category: "UNLIMITED",
    title: "Unlimited Value Pack",
    amount: 199,
    validity: "18 Days",
    data: "1.5 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["Unlimited 5G", "Jio Apps"],
    popular: true,
  },
  {
    id: "jio-299",
    operator: "JIO",
    category: "UNLIMITED",
    title: "Daily Data Combo",
    amount: 299,
    validity: "28 Days",
    data: "1.5 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["Unlimited 5G", "Jio Apps"],
    popular: true,
  },
  {
    id: "jio-349",
    operator: "JIO",
    category: "5G",
    title: "True 5G Plan",
    amount: 349,
    validity: "28 Days",
    data: "2 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["Unlimited 5G", "JioTV", "JioCinema"],
  },
  {
    id: "jio-399",
    operator: "JIO",
    category: "DATA",
    title: "High Data Pack",
    amount: 399,
    validity: "28 Days",
    data: "2.5 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["5G Data", "Jio Apps"],
  },
  {
    id: "airtel-199",
    operator: "AIRTEL",
    category: "UNLIMITED",
    title: "Smart Recharge",
    amount: 199,
    validity: "28 Days",
    data: "2 GB Total",
    voice: "Unlimited Calls",
    sms: "100 SMS",
    benefits: ["Free Hellotune"],
  },
  {
    id: "airtel-299",
    operator: "AIRTEL",
    category: "UNLIMITED",
    title: "Unlimited Combo",
    amount: 299,
    validity: "28 Days",
    data: "1.5 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["Unlimited 5G", "Hellotune"],
    popular: true,
  },
  {
    id: "airtel-349",
    operator: "AIRTEL",
    category: "5G",
    title: "5G Power Pack",
    amount: 349,
    validity: "28 Days",
    data: "2 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["Unlimited 5G", "Apple Music"],
  },
  {
    id: "airtel-399",
    operator: "AIRTEL",
    category: "OTT",
    title: "Entertainment Combo",
    amount: 399,
    validity: "28 Days",
    data: "2.5 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["OTT Benefits", "Unlimited 5G"],
  },
  {
    id: "vi-199",
    operator: "VI",
    category: "UNLIMITED",
    title: "Unlimited Calling Pack",
    amount: 199,
    validity: "28 Days",
    data: "2 GB Total",
    voice: "Unlimited Calls",
    sms: "300 SMS",
    benefits: ["Weekend Data Rollover"],
  },
  {
    id: "vi-299",
    operator: "VI",
    category: "DATA",
    title: "Daily Data Combo",
    amount: 299,
    validity: "28 Days",
    data: "1.5 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["Night Data", "Weekend Data"],
    popular: true,
  },
  {
    id: "vi-349",
    operator: "VI",
    category: "5G",
    title: "5G Unlimited Pack",
    amount: 349,
    validity: "28 Days",
    data: "2 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["5G Data", "Weekend Data"],
  },
  {
    id: "bsnl-147",
    operator: "BSNL",
    category: "VOICE",
    title: "Voice Saver",
    amount: 147,
    validity: "30 Days",
    data: "5 GB",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["National Roaming"],
  },
  {
    id: "bsnl-229",
    operator: "BSNL",
    category: "DATA",
    title: "Daily Data Combo",
    amount: 229,
    validity: "30 Days",
    data: "2 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["National Roaming"],
  },
  {
    id: "bsnl-299",
    operator: "BSNL",
    category: "UNLIMITED",
    title: "Full Combo Pack",
    amount: 299,
    validity: "30 Days",
    data: "3 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["National Roaming"],
    popular: true,
  },
  {
    id: "topup-10",
    operator: "JIO",
    category: "TOPUP",
    title: "Talktime Top Up",
    amount: 10,
    validity: "Existing Plan",
    data: "N/A",
    voice: "Talktime",
    sms: "N/A",
    benefits: ["Top Up"],
  },
  {
    id: "topup-20",
    operator: "AIRTEL",
    category: "TOPUP",
    title: "Talktime Top Up",
    amount: 20,
    validity: "Existing Plan",
    data: "N/A",
    voice: "Talktime",
    sms: "N/A",
    benefits: ["Top Up"],
  },
  {
    id: "data-19",
    operator: "JIO",
    category: "DATA",
    title: "Data Booster",
    amount: 19,
    validity: "1 Day",
    data: "1 GB",
    voice: "N/A",
    sms: "N/A",
    benefits: ["Data Booster"],
  },
  {
    id: "data-29",
    operator: "AIRTEL",
    category: "DATA",
    title: "Extra Data",
    amount: 29,
    validity: "1 Day",
    data: "2 GB",
    voice: "N/A",
    sms: "N/A",
    benefits: ["Data Booster"],
  },
  {
    id: "sms-36",
    operator: "BSNL",
    category: "SMS",
    title: "SMS Pack",
    amount: 36,
    validity: "30 Days",
    data: "N/A",
    voice: "N/A",
    sms: "Unlimited SMS",
    benefits: ["SMS Alerts"],
  },
  {
    id: "roaming-299",
    operator: "VI",
    category: "ROAMING",
    title: "International Roaming",
    amount: 299,
    validity: "1 Day",
    data: "1 GB",
    voice: "100 Minutes",
    sms: "100 SMS",
    benefits: ["International Roaming"],
  },
  {
    id: "ott-499",
    operator: "AIRTEL",
    category: "OTT",
    title: "Entertainment Pack",
    amount: 499,
    validity: "28 Days",
    data: "3 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["OTT Apps", "Music", "Movies"],
  },
  {
    id: "special-599",
    operator: "JIO",
    category: "SPECIAL",
    title: "Super Value Offer",
    amount: 599,
    validity: "84 Days",
    data: "1.5 GB/Day",
    voice: "Unlimited Calls",
    sms: "100 SMS/Day",
    benefits: ["5G", "Entertainment", "Rewards"],
  },
];

function operatorClass(operator: string) {
  if (operator === "JIO")
    return "bg-blue-600";
  if (operator === "AIRTEL")
    return "bg-red-500";
  if (operator === "VI")
    return "bg-red-700";
  return "bg-orange-500";
}

export default function MobilePlansPage() {
  const router = useRouter();

  const [operator, setOperator] =
    useState("ALL");

  const [category, setCategory] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState(5000);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const operatorMatch =
        operator === "ALL" ||
        plan.operator === operator;

      const categoryMatch =
        category === "ALL" ||
        plan.category === category;

      const searchMatch =
        !search ||
        `${plan.title} ${plan.operator} ${plan.data} ${plan.voice} ${plan.sms} ${plan.benefits.join(
          " "
        )}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const priceMatch =
        plan.amount <= maxPrice;

      return (
        operatorMatch &&
        categoryMatch &&
        searchMatch &&
        priceMatch
      );
    });
  }, [
    operator,
    category,
    search,
    maxPrice,
  ]);

  const choosePlan = (amount: number) => {
    router.push(
      `/customer/recharge/mobile?amount=${amount}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">

        {/* HEADER */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() =>
              router.push("/customer/recharge/mobile")
            }
            className="flex items-center gap-2 text-sm font-black text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Recharge
          </button>

          <div className="text-xs font-bold text-slate-400">
            Home
            <ChevronRight
              size={13}
              className="mx-1 inline"
            />
            Recharge
            <ChevronRight
              size={13}
              className="mx-1 inline"
            />
            <span className="text-blue-600">
              All Plans
            </span>
          </div>
        </div>

        {/* HERO */}
        <div className="relative mb-5 overflow-hidden rounded-[26px] bg-gradient-to-r from-[#071d68] via-[#1950df] to-[#9c35e9] px-6 py-8 text-white shadow-[0_20px_50px_rgba(37,70,220,0.22)] sm:px-10">

          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />
          <div className="absolute bottom-[-120px] left-1/2 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">

            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                <Sparkles size={15} />
                Smart Recharge Plans
              </div>

              <h1 className="mt-2 text-4xl font-black sm:text-5xl">
                Explore All{" "}
                <span className="text-cyan-200">
                  Recharge Plans
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-100">
                Data, Voice, Combo, SMS, 5G, OTT,
                Top-Up, Roaming and Special Offers —
                everything in one place.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <div className="rounded-xl bg-white/10 px-4 py-2 text-xs font-black backdrop-blur">
                  ⚡ Fast Search
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-2 text-xs font-black backdrop-blur">
                  📱 All Operators
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-2 text-xs font-black backdrop-blur">
                  🎁 Best Offers
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative flex h-40 w-64 items-center justify-center">

                <div className="absolute h-32 w-32 rounded-full bg-cyan-300/20 blur-xl animate-pulse" />

                <div className="relative flex h-32 w-24 flex-col items-center justify-center rounded-[24px] border-4 border-slate-900 bg-gradient-to-b from-blue-500 to-purple-700 shadow-[0_0_50px_rgba(100,150,255,0.6)]">
                  <Smartphone size={34} />
                  <span className="mt-2 text-[9px] font-black">
                    ALL PLANS
                  </span>
                </div>

                <div className="absolute left-0 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xs font-black shadow-xl">
                  Jio
                </div>

                <div className="absolute right-0 top-1 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xs font-black shadow-xl">
                  Vi
                </div>

                <div className="absolute bottom-0 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-[9px] font-black shadow-xl">
                  airtel
                </div>

                <div className="absolute bottom-[-3px] right-8 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[8px] font-black text-slate-800 shadow-xl">
                  BSNL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sparkles size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Total Plans
                </p>
                <p className="text-2xl font-black text-slate-950">
                  {plans.length}+
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Wifi size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Data Plans
                </p>
                <p className="text-2xl font-black text-slate-950">
                  {plans.filter(
                    (p) =>
                      p.category === "DATA" ||
                      p.category === "5G"
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Voice / Combo
                </p>
                <p className="text-2xl font-black text-slate-950">
                  {plans.filter(
                    (p) =>
                      p.category === "VOICE" ||
                      p.category === "UNLIMITED"
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <Gift size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Offers
                </p>
                <p className="text-2xl font-black text-slate-950">
                  {plans.filter(
                    (p) =>
                      p.category === "OTT" ||
                      p.category === "SPECIAL"
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className="mb-5 rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search plans, data, voice, OTT, validity..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <select
              value={operator}
              onChange={(e) =>
                setOperator(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-black outline-none"
            >
              {operators.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL"
                    ? "All Operators"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  Number(e.target.value)
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-black outline-none"
            >
              <option value={5000}>
                Any Price
              </option>
              <option value={199}>
                Under ₹199
              </option>
              <option value={299}>
                Under ₹299
              </option>
              <option value={499}>
                Under ₹499
              </option>
              <option value={999}>
                Under ₹999
              </option>
            </select>
          </div>

          {/* CATEGORY SCROLLER */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const Icon = item.icon;
              const active =
                category === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setCategory(item.key)
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {category === "ALL"
                ? "All Recharge Plans"
                : categories.find(
                    (x) => x.key === category
                  )?.label}
            </h2>

            <p className="text-xs text-slate-400">
              Showing {filteredPlans.length} plans
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs font-bold text-emerald-600 sm:flex">
            <ShieldCheck size={16} />
            Secure Recharge
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-16 text-center">
            <Search
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-black text-slate-800">
              No plans found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Try another operator, category or search.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="group relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >

                {plan.popular && (
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black text-amber-600">
                    <Star
                      size={11}
                      className="fill-amber-500"
                    />
                    POPULAR
                  </div>
                )}

                <div className="p-5">

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-[10px] font-black text-white shadow-md ${operatorClass(
                        plan.operator
                      )}`}
                    >
                      {plan.operator}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {plan.operator}
                      </p>

                      <h3 className="truncate text-base font-black text-slate-900">
                        {plan.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Plan Price
                      </p>

                      <p className="text-3xl font-black text-blue-600">
                        ₹{plan.amount}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 px-3 py-2 text-right">
                      <p className="text-[9px] font-bold text-slate-400">
                        Validity
                      </p>
                      <p className="text-xs font-black text-blue-700">
                        {plan.validity}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[8px] font-bold uppercase text-slate-400">
                        Data
                      </p>
                      <p className="mt-1 text-xs font-black text-slate-800">
                        {plan.data}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[8px] font-bold uppercase text-slate-400">
                        Voice
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-black text-slate-800">
                        {plan.voice}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[8px] font-bold uppercase text-slate-400">
                        SMS
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-black text-slate-800">
                        {plan.sms}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {plan.benefits.map(
                      (benefit) => (
                        <span
                          key={benefit}
                          className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700"
                        >
                          <CheckCircle2 size={10} />
                          {benefit}
                        </span>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      choosePlan(plan.amount)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 text-sm font-black text-white shadow-md transition hover:shadow-lg"
                  >
                    Recharge ₹{plan.amount}
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-6 grid gap-3 rounded-[22px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 p-5 sm:grid-cols-3">

          <div className="flex items-center justify-center gap-3">
            <ShieldCheck
              size={24}
              className="text-emerald-600"
            />
            <div>
              <p className="text-xs font-black text-emerald-700">
                Secure Plans
              </p>
              <p className="text-[9px] text-slate-500">
                Safe & reliable recharge
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-y border-emerald-100 py-3 sm:border-x sm:border-y-0">
            <Smartphone
              size={24}
              className="text-blue-600"
            />
            <div>
              <p className="text-xs font-black text-blue-700">
                Multiple Operators
              </p>
              <p className="text-[9px] text-slate-500">
                Jio • Airtel • Vi • BSNL
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Gift
              size={24}
              className="text-purple-600"
            />
            <div>
              <p className="text-xs font-black text-purple-700">
                Best Offers
              </p>
              <p className="text-[9px] text-slate-500">
                Data • Voice • OTT • 5G
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
