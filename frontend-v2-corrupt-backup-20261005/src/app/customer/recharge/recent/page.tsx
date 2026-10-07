"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ArrowDownUp,
  CheckCircle2,
  Clock3,
  CreditCard,
  History,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Tv,
  WalletCards,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import api from "@/lib/api";

type User = {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
};

type Recharge = {
  id: string;
  mobileNumber?: string;
  operator?: string;
  amount?: number;
  rechargeType?: string;
  status?: string;
  createdAt?: string;
  paymentMethod?: string;
};

function unwrap(response: any) {
  return response?.data?.data ?? response?.data ?? response;
}

function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function key(value?: string) {
  return String(value || "").toUpperCase();
}

function service(value?: string) {
  const type = key(value);

  if (type === "MOBILE") return "Mobile";
  if (type === "DTH") return "DTH";
  if (type === "FASTAG") return "FASTag";

  return value || "Recharge";
}

function maskNumber(value?: string) {
  if (!value) return "—";

  const text = String(value);

  if (text.length <= 4) return text;

  return `${text.slice(0, 2)}••••${text.slice(-4)}`;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RechargeHistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [sortNewest, setSortNewest] = useState(true);

  const [selected, setSelected] = useState<Recharge | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("loan_finance_user");

      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      setUser(null);
    }
  }, []);

  async function loadData(refresh = false) {
    if (!user?.id) return;

    try {
      setError("");

      if (refresh) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem("loan_finance_token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        : {
            withCredentials: true,
          };

      const [historyResult, walletResult] = await Promise.allSettled([
        api.get(`/recharge/user/${user.id}`, config),
        api.get("/wallet/balance", config),
      ]);

      if (historyResult.status === "fulfilled") {
        const data = unwrap(historyResult.value);

        setRecharges(Array.isArray(data) ? data : []);
      } else {
        setRecharges([]);
        setError("Unable to load recharge history.");
      }

      if (walletResult.status === "fulfilled") {
        const data = unwrap(walletResult.value);

        setWalletBalance(
          Number(
            data?.balance ??
              data?.wallet?.balance ??
              data?.data?.balance ??
              0
          )
        );
      }
    } catch (err: any) {
      console.error("Recharge history error:", err);

      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Unable to load recharge history.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = recharges.length;

    const successful = recharges.filter(
      (r) => key(r.status) === "SUCCESS"
    ).length;

    const pending = recharges.filter((r) =>
      ["PENDING", "PROCESSING"].includes(key(r.status))
    ).length;

    const failed = recharges.filter((r) =>
      ["FAILED", "REFUNDED", "CANCELLED"].includes(key(r.status))
    ).length;

    const value = recharges
      .filter((r) => key(r.status) === "SUCCESS")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const mobileValue = recharges
      .filter(
        (r) =>
          key(r.rechargeType) === "MOBILE" &&
          key(r.status) === "SUCCESS"
      )
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const dthValue = recharges
      .filter(
        (r) =>
          key(r.rechargeType) === "DTH" &&
          key(r.status) === "SUCCESS"
      )
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const fastagValue = recharges
      .filter(
        (r) =>
          key(r.rechargeType) === "FASTAG" &&
          key(r.status) === "SUCCESS"
      )
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    return {
      total,
      successful,
      pending,
      failed,
      value,
      mobileValue,
      dthValue,
      fastagValue,
    };
  }, [recharges]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return [...recharges]
      .filter((r) => {
        const matchesSearch =
          !q ||
          String(r.operator || "").toLowerCase().includes(q) ||
          String(r.mobileNumber || "").toLowerCase().includes(q) ||
          String(r.amount || "").includes(q) ||
          String(r.rechargeType || "").toLowerCase().includes(q);

        const currentStatus = key(r.status);

        const matchesStatus =
          status === "ALL" ||
          (status === "SUCCESS" && currentStatus === "SUCCESS") ||
          (status === "PENDING" &&
            ["PENDING", "PROCESSING"].includes(currentStatus)) ||
          (status === "FAILED" &&
            ["FAILED", "REFUNDED", "CANCELLED"].includes(currentStatus));

        const currentService = key(r.rechargeType);

        const matchesService =
          serviceFilter === "ALL" ||
          currentService === serviceFilter;

        return matchesSearch && matchesStatus && matchesService;
      })
      .sort((a, b) => {
        const aDate = new Date(a.createdAt || 0).getTime();
        const bDate = new Date(b.createdAt || 0).getTime();

        return sortNewest ? bDate - aDate : aDate - bDate;
      });
  }, [recharges, search, status, serviceFilter, sortNewest]);

  const successRate =
    stats.total > 0
      ? Math.round((stats.successful / stats.total) * 100)
      : 0;

  const average =
    stats.successful > 0
      ? Math.round(stats.value / stats.successful)
      : 0;

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#112d6c]">
      <main className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold text-[#8396b5]">
              <span>Dashboard</span>
              <span>›</span>
              <span>Recharge</span>
              <span>›</span>
              <span className="text-[#1d62ea]">Recharge History</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#102f70]">
              Recharge Center
            </h1>

            <p className="mt-1 text-xs text-[#7287a9]">
              Manage, search and track your complete recharge activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/customer/recharge/mobile"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#165dfb] to-[#7035f4] px-5 py-3 text-[11px] font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
            >
              <Zap size={14} />
              New Recharge
            </Link>

            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-[#d9e5f5] bg-white px-4 py-3 text-[11px] font-black text-[#456184] shadow-sm"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* HERO */}
        <section className="relative mb-5 overflow-hidden rounded-[30px] border border-[#c9e2ff] bg-gradient-to-br from-[#eef8ff] via-[#e4f1ff] to-[#eef2ff] p-6 shadow-[0_18px_55px_rgba(54,101,180,.10)] sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-[35%] h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_390px] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9def8] bg-white/90 px-3.5 py-2 text-[10px] font-black text-[#1856c9] shadow-sm">
                <ArrowDownUp size={13} />
                SMART RECHARGE ANALYTICS
              </div>

              <h2 className="max-w-[760px] text-[40px] font-black leading-[.98] tracking-[-2px] text-[#0c2b6b] sm:text-[52px] lg:text-[58px]">
                Every Recharge.
                <br />
                <span className="bg-gradient-to-r from-[#1764ff] via-[#1595ff] to-[#7648ee] bg-clip-text text-transparent">
                  One Smart History.
                </span>
              </h2>

              <p className="mt-5 max-w-[690px] text-sm leading-6 text-[#536b91]">
                View your complete recharge activity, track status, review
                spending and quickly manage your favourite services.
              </p>

              <div className="mt-6 grid max-w-[700px] grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-[#cfe1f7] bg-white/85 p-4 shadow-sm">
                  <Zap size={17} className="mb-3 text-blue-600" />
                  <div className="text-xl font-black text-[#123574]">
                    {stats.total}
                  </div>
                  <div className="mt-1 text-[10px] font-bold text-[#7d91af]">
                    Total
                  </div>
                </div>

                <div className="rounded-2xl border border-[#cfe1f7] bg-white/85 p-4 shadow-sm">
                  <CheckCircle2
                    size={17}
                    className="mb-3 text-emerald-500"
                  />
                  <div className="text-xl font-black text-[#123574]">
                    {stats.successful}
                  </div>
                  <div className="mt-1 text-[10px] font-bold text-[#7d91af]">
                    Successful
                  </div>
                </div>

                <div className="rounded-2xl border border-[#cfe1f7] bg-white/85 p-4 shadow-sm">
                  <Clock3 size={17} className="mb-3 text-amber-500" />
                  <div className="text-xl font-black text-[#123574]">
                    {stats.pending}
                  </div>
                  <div className="mt-1 text-[10px] font-bold text-[#7d91af]">
                    Pending
                  </div>
                </div>

                <div className="rounded-2xl border border-[#cfe1f7] bg-white/85 p-4 shadow-sm">
                  <CreditCard size={17} className="mb-3 text-violet-500" />
                  <div className="text-xl font-black text-[#123574]">
                    {money(stats.value)}
                  </div>
                  <div className="mt-1 text-[10px] font-bold text-[#7d91af]">
                    Value
                  </div>
                </div>
              </div>
            </div>

            {/* WALLET */}
            <div className="rounded-[27px] border border-white/60 bg-gradient-to-br from-[#347cf7] via-[#4968ee] to-[#7434f1] p-6 text-white shadow-[0_20px_50px_rgba(52,92,220,.25)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-black tracking-wide text-white/75">
                    WALLET BALANCE
                  </div>

                  <div className="mt-1 text-[34px] font-black">
                    {money(walletBalance)}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/15 p-3.5">
                  <WalletCards size={23} />
                </div>
              </div>

              <div className="my-5 h-px bg-white/20" />

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <div className="text-lg font-black">
                    {recharges.filter(
                      (r) => key(r.rechargeType) === "MOBILE"
                    ).length}
                  </div>
                  <div className="text-[9px] text-white/75">
                    Mobile
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <div className="text-lg font-black">
                    {recharges.filter(
                      (r) => key(r.rechargeType) === "DTH"
                    ).length}
                  </div>
                  <div className="text-[9px] text-white/75">
                    DTH
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <div className="text-lg font-black">
                    {recharges.filter(
                      (r) => key(r.rechargeType) === "FASTAG"
                    ).length}
                  </div>
                  <div className="text-[9px] text-white/75">
                    FASTag
                  </div>
                </div>
              </div>

              <Link
                href="/customer/wallet/balance"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-[11px] font-black text-[#3154d8] transition hover:bg-blue-50"
              >
                Manage Wallet
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
            <span>{error}</span>

            <button
              onClick={() => loadData()}
              className="rounded-lg bg-white px-3 py-2 text-[10px] font-black shadow-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* ANALYTICS */}
        <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          <div className="rounded-[23px] border border-[#dce7f5] bg-white p-5 shadow-[0_8px_30px_rgba(47,84,135,.06)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black tracking-wide text-[#7990b1]">
                  TOTAL SPENDING
                </div>
                <div className="mt-1 text-2xl font-black text-[#123574]">
                  {money(stats.value)}
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#edf3fb]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1764ff] to-[#7544f3]"
                style={{
                  width: `${Math.min(stats.value > 0 ? 100 : 0, 100)}%`,
                }}
              />
            </div>

            <div className="mt-2 text-[10px] text-[#8a9bb5]">
              Successful recharge value
            </div>
          </div>

          <div className="rounded-[23px] border border-[#dce7f5] bg-white p-5 shadow-[0_8px_30px_rgba(47,84,135,.06)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black tracking-wide text-[#7990b1]">
                  SUCCESS RATE
                </div>

                <div className="mt-1 text-2xl font-black text-[#123574]">
                  {successRate}%
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#edf3fb]">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${successRate}%`,
                }}
              />
            </div>

            <div className="mt-2 text-[10px] text-[#8a9bb5]">
              {stats.successful} completed out of {stats.total}
            </div>
          </div>

          <div className="rounded-[23px] border border-[#dce7f5] bg-white p-5 shadow-[0_8px_30px_rgba(47,84,135,.06)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black tracking-wide text-[#7990b1]">
                  AVERAGE RECHARGE
                </div>

                <div className="mt-1 text-2xl font-black text-[#123574]">
                  {money(average)}
                </div>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <CreditCard size={18} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[9px] font-bold">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
                Mobile
                <br />
                {money(stats.mobileValue)}
              </div>

              <div className="rounded-xl bg-violet-50 p-2 text-violet-700">
                DTH
                <br />
                {money(stats.dthValue)}
              </div>

              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                FASTag
                <br />
                {money(stats.fastagValue)}
              </div>
            </div>
          </div>
        </section>

        {/* FILTER PANEL */}
        <section className="mb-5 rounded-[25px] border border-[#dce7f5] bg-white p-5 shadow-[0_8px_30px_rgba(47,84,135,.06)]">
          <div className="mb-4">
            <div className="text-[10px] font-black tracking-wide text-[#2161e8]">
              SMART FILTERS
            </div>

            <h3 className="mt-1 text-xl font-black text-[#102f70]">
              Find a Recharge
            </h3>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_auto]">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ca1bd]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search operator, number, amount..."
                className="h-11 w-full rounded-xl border border-[#dce7f5] bg-[#fbfdff] pl-10 pr-4 text-xs font-semibold text-[#27456f] outline-none transition focus:border-[#6fa0ff] focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-xl border border-[#dce7f5] bg-[#fbfdff] px-3 text-xs font-black text-[#476284] outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Successful</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed / Refund</option>
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="h-11 rounded-xl border border-[#dce7f5] bg-[#fbfdff] px-3 text-xs font-black text-[#476284] outline-none"
            >
              <option value="ALL">All Services</option>
              <option value="MOBILE">Mobile</option>
              <option value="DTH">DTH</option>
              <option value="FASTAG">FASTag</option>
            </select>

            <button
              onClick={() => setSortNewest((v) => !v)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dce7f5] bg-[#fbfdff] px-4 text-xs font-black text-[#476284] hover:border-[#75a4ff]"
            >
              <ArrowDownUp size={14} />
              {sortNewest ? "Newest" : "Oldest"}
            </button>
          </div>
        </section>

        {/* HISTORY LIST */}
        <section className="overflow-hidden rounded-[26px] border border-[#dce7f5] bg-white shadow-[0_8px_30px_rgba(47,84,135,.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2f8] px-5 py-5 sm:px-6">
            <div>
              <h3 className="text-xl font-black text-[#102f70]">
                Recharge History
              </h3>

              <p className="mt-1 text-[10px] text-[#8395b1]">
                Showing {filtered.length} recharge
                {filtered.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#f0f6ff] px-3 py-2 text-[9px] font-black text-[#3c6fc2]">
              <ShieldCheck size={13} />
              Secure Digital History
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-32 animate-pulse rounded-2xl bg-[#f1f6fc]"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-[330px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <History size={29} />
              </div>

              <h4 className="mt-5 text-lg font-black text-[#17366f]">
                No recharge found
              </h4>

              <p className="mt-1 max-w-md text-xs leading-5 text-[#8295b3]">
                No recharge matches your current filters. Complete a recharge
                and it will appear here automatically.
              </p>

              <Link
                href="/customer/recharge/mobile"
                className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#155dfc] to-[#6935f5] px-5 py-3 text-[11px] font-black text-white shadow-lg shadow-blue-100"
              >
                Start New Recharge
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#edf2f8]">
              {filtered.map((item) => {
                const currentStatus = key(item.status);
                const currentService = key(item.rechargeType);

                const success = currentStatus === "SUCCESS";

                const pending = [
                  "PENDING",
                  "PROCESSING",
                ].includes(currentStatus);

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="group flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-[#f8fbff] sm:flex-row sm:items-center sm:px-6"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        currentService === "MOBILE"
                          ? "bg-blue-50 text-blue-600"
                          : currentService === "DTH"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {currentService === "MOBILE" ? (
                        <Smartphone size={21} />
                      ) : currentService === "DTH" ? (
                        <Tv size={21} />
                      ) : (
                        <CreditCard size={21} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#17366f]">
                          {item.operator || service(item.rechargeType)}
                        </span>

                        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[9px] font-black text-[#4a70a9]">
                          {service(item.rechargeType)}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#8497b3]">
                        <span>{maskNumber(item.mobileNumber)}</span>
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                        <span>•</span>
                        <span>{formatTime(item.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-right">
                        <div className="text-base font-black text-[#132f6e]">
                          {money(Number(item.amount || 0))}
                        </div>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[9px] font-black ${
                            success
                              ? "bg-emerald-50 text-emerald-600"
                              : pending
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {success
                            ? "Success"
                            : pending
                            ? "Pending"
                            : "Failed / Refund"}
                        </span>
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-[#b2c2d9] transition group-hover:translate-x-1 group-hover:text-blue-600"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* QUICK SERVICES */}
        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <Link
            href="/customer/recharge/mobile"
            className="group rounded-[22px] border border-[#dce7f5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Smartphone size={19} />
              </div>

              <ArrowRight
                size={15}
                className="text-[#a5b7ce] group-hover:text-blue-600"
              />
            </div>

            <div className="mt-4 text-sm font-black text-[#17366f]">
              Mobile Recharge
            </div>

            <div className="mt-1 text-[10px] text-[#8799b4]">
              Recharge any mobile number instantly.
            </div>
          </Link>

          <Link
            href="/customer/recharge/dth"
            className="group rounded-[22px] border border-[#dce7f5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <Tv size={19} />
              </div>

              <ArrowRight
                size={15}
                className="text-[#a5b7ce] group-hover:text-violet-600"
              />
            </div>

            <div className="mt-4 text-sm font-black text-[#17366f]">
              DTH Recharge
            </div>

            <div className="mt-1 text-[10px] text-[#8799b4]">
              Keep your entertainment active.
            </div>
          </Link>

          <Link
            href="/customer/recharge/fastag"
            className="group rounded-[22px] border border-[#dce7f5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CreditCard size={19} />
              </div>

              <ArrowRight
                size={15}
                className="text-[#a5b7ce] group-hover:text-emerald-600"
              />
            </div>

            <div className="mt-4 text-sm font-black text-[#17366f]">
              FASTag Recharge
            </div>

            <div className="mt-1 text-[10px] text-[#8799b4]">
              Recharge your FASTag for smoother travel.
            </div>
          </Link>
        </section>

        {/* SECURITY FOOTER */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-[9px] font-bold text-[#8ca0bb]">
          <span className="flex items-center gap-1.5">
            <LockKeyhole size={11} />
            Secure Payments
          </span>

          <span>•</span>

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={11} />
            Trusted Platform
          </span>

          <span>•</span>

          <span>Made in India 🇮🇳</span>
        </div>
      </main>

      {/* DETAILS MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#123267]/20 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-[27px] border border-[#d9e5f5] bg-white shadow-[0_30px_100px_rgba(20,50,100,.24)]"
          >
            <div className="bg-gradient-to-r from-[#1764f8] to-[#6e37ef] p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-black tracking-[1px] text-white/75">
                    RECHARGE DETAILS
                  </div>

                  <div className="mt-1 text-3xl font-black">
                    {money(Number(selected.amount || 0))}
                  </div>

                  <div className="mt-1 text-[10px] text-white/75">
                    {service(selected.rechargeType)}
                  </div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-5">
              {[
                ["Service", service(selected.rechargeType)],
                ["Operator", selected.operator || "—"],
                ["Number / ID", selected.mobileNumber || "—"],
                ["Amount", money(Number(selected.amount || 0))],
                ["Status", selected.status || "—"],
                ["Payment", selected.paymentMethod || "Wallet"],
                ["Date", formatDate(selected.createdAt)],
                ["Transaction ID", selected.id],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-xl bg-[#f7faff] px-4 py-3"
                >
                  <span className="text-[10px] font-semibold text-[#8295b2]">
                    {label}
                  </span>

                  <span className="max-w-[62%] truncate text-right text-[11px] font-black text-[#17366f]">
                    {value}
                  </span>
                </div>
              ))}

              <Link
                href={
                  key(selected.rechargeType) === "DTH"
                    ? "/customer/recharge/dth"
                    : key(selected.rechargeType) === "FASTAG"
                    ? "/customer/recharge/fastag"
                    : "/customer/recharge/mobile"
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#155dfc] to-[#6935f5] py-3 text-[11px] font-black text-white"
              >
                Repeat Recharge
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={() => setSelected(null)}
                className="w-full rounded-xl border border-[#dce7f5] bg-white py-3 text-[11px] font-black text-[#526b8f]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
