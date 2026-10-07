"use client";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Banknote,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  LockKeyhole,
  Percent,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

const RUPEE = String.fromCharCode(8377);

type Payout = {
  id: string;
  date: string;
  product: string;
  disbursed: string;
  gross: string;
  tds: string;
  net: string;
  status: string;
};

type EligibilityItem = [string, string];

type PayoutData = {
  summary?: {
    availablePayout?: number;
    totalCommission?: number;
    pendingPayout?: number;
    paidPayout?: number;
    tdsDeducted?: number;
  };
  payouts?: any[];
  bankAccount?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    isVerified?: boolean;
  } | null;
  eligibility?: {
    eligible?: boolean;
    reason?: string;
  };
  monthlySlab?: {
    currentDisbursement?: number;
    targetDisbursement?: number;
    percentage?: number;
    currentSlab?: string;
    nextSlab?: string;
    remaining?: number;
  };
};

function money(value: number | string | null | undefined) {
  const amount = Number(value || 0);
  return (
    RUPEE +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function dateText(value: string | Date | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function maskAccount(value?: string) {
  if (!value) return "-";
  const clean = String(value).replace(/\s+/g, "");
  if (clean.length <= 4) return clean;
  return "**** **** " + clean.slice(-4);
}

function Status({ value }: { value: string }) {
  const normalized = String(value || "").toLowerCase();

  const styles: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700",
    paid: "bg-emerald-50 text-emerald-700",
    processing: "bg-blue-50 text-blue-700",
    pending: "bg-amber-50 text-amber-700",
    confirmation: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-600",
    failed: "bg-red-50 text-red-600",
    "recovery hold": "bg-red-50 text-red-600",
  };

  const label =
    normalized === "success"
      ? "Success"
      : normalized === "paid"
        ? "Paid"
        : normalized === "processing"
          ? "Processing"
          : normalized === "pending"
            ? "Pending"
            : normalized === "confirmation"
              ? "Confirmation"
              : normalized === "approved"
                ? "Approved"
                : normalized === "rejected"
                  ? "Rejected"
                  : normalized === "failed"
                    ? "Failed"
                    : value || "Pending";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        styles[normalized] || "bg-slate-50 text-slate-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  iconClass,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconClass: string;
  badge?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
        {badge && (
          <span className="rounded-full bg-pink-50 px-2 py-1 text-[9px] font-bold text-pink-600">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-3 text-[11px] font-semibold text-slate-500">{title}</p>
      <p className="mt-1 truncate whitespace-nowrap text-[21px] font-black tracking-tight text-[#071b45]">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-slate-500">{subtitle}</p>
    </div>
  );
}

export default function DsaPayoutPage() {
  const [data, setData] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPayout = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("loan_finance_token")
          : null;

      if (!token) {
        setError("Please login again to view your payout.");
        return;
      }

      const response = await api.get("/payout/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data?.data || response.data || null);
    } catch (err: any) {
      console.error("Payout load error:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to load payout information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayout();
  }, []);

  const requestPayout = async () => {
    try {
      setRequesting(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("loan_finance_token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const available = Number(data?.summary?.availablePayout || 0);

      if (available <= 0) {
        setError("No payout amount is currently available.");
        return;
      }

      const response = await api.post(
        "/payout/request",
        { amount: available },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message || "Payout request submitted successfully."
      );

      await loadPayout();
    } catch (err: any) {
      console.error("Payout request error:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to submit payout request."
      );
    } finally {
      setRequesting(false);
    }
  };

  const summary = data?.summary || {};
  const bank = data?.bankAccount;
  const eligible = Boolean(data?.eligibility?.eligible);

  const payouts: Payout[] = useMemo(() => {
    return (data?.payouts || []).map((item: any) => {
      const gross = Number(
        item.gross ??
          item.amount ??
          item.commission ??
          item.netAmount ??
          0
      );

      const tds = Number(item.tds ?? item.tax ?? 0);

      const net = Number(
        item.net ??
          item.netAmount ??
          Math.max(gross - tds, 0)
      );

      return {
        id:
          item.id ||
          item.transactionId ||
          item.referenceId ||
          "-",
        date: dateText(item.createdAt || item.date),
        product:
          item.product ||
          item.loanType ||
          item.description ||
          "Payout",
        disbursed: money(
          item.disbursedAmount ??
            item.loanAmount ??
            item.disbursed ??
            0
        ),
        gross: money(gross),
        tds: money(tds),
        net: money(net),
        status: item.status || "Pending",
      };
    });
  }, [data?.payouts]);

  const eligibility: EligibilityItem[] = [
    ["KYC Verified", data?.eligibility ? (eligible ? "Completed" : "Pending") : "Checking"],
    ["PAN Verified", eligible ? "Completed" : "Pending"],
    [
      "Bank Account Verified",
      bank?.isVerified ? "Completed" : "Pending",
    ],
    [
      "Eligible Disbursements",
      data?.monthlySlab?.currentDisbursement
        ? `${RUPEE}${Number(data.monthlySlab.currentDisbursement).toLocaleString("en-IN")}`
        : "-",
    ],
    [
      "No Recovery / Hold",
      eligible ? "Clear" : "Review",
    ],
  ];

  const currentDisbursement = Number(
    data?.monthlySlab?.currentDisbursement || 0
  );
  const targetDisbursement = Number(
    data?.monthlySlab?.targetDisbursement || 0
  );
  const slabPercentage = Math.min(
    100,
    Math.max(
      0,
      Number(
        data?.monthlySlab?.percentage ??
          (targetDisbursement
            ? (currentDisbursement / targetDisbursement) * 100
            : 0)
      )
    )
  );

  const remaining =
    Number(
      data?.monthlySlab?.remaining ??
        Math.max(targetDisbursement - currentDisbursement, 0)
    );

  const monthName = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#eef6ff] px-1.5 py-2 text-[#071b45] sm:px-2 lg:px-3">
      <div className="mx-auto w-full max-w-[1400px] min-w-0 space-y-2.5">

        {/* HERO */}
        <section className="relative min-h-[135px] overflow-hidden rounded-[22px] bg-gradient-to-r from-[#061d57] via-[#073b9d] to-[#0878ee] px-4 py-4 text-white shadow-lg sm:px-5 sm:py-5">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute bottom-[-100px] right-[28%] h-52 w-52 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-yellow-300 ring-1 ring-white/20">
                  <Wallet size={25} />
                </div>

                <div>
                  <h1 className="text-3xl font-black leading-none tracking-tight sm:text-4xl">
                    My <span className="text-yellow-300">Payout</span>
                  </h1>
                  <p className="mt-1 text-xs font-medium text-blue-100 sm:text-sm">
                    Track your commission, check eligibility and withdraw your earnings
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-[650px] text-xs leading-5 text-blue-100 sm:text-sm">
                Get instant payout after Bank/NBFC disbursement confirmation.
                Track every earning with complete transparency.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold">
                  <ShieldCheck size={13} />
                  Transparent Process
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold">
                  <Zap size={13} className="text-yellow-300" />
                  On-Time Payout
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold">
                  <LockKeyhole size={13} className="text-emerald-300" />
                  Secure & Safe
                </span>
              </div>
            </div>

            <div className="hidden w-[260px] shrink-0 space-y-2 lg:block">
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-yellow-300" />
                  <div>
                    <p className="text-sm font-black">Instant Payout</p>
                    <p className="text-[9px] text-blue-100">
                      After Bank/NBFC Disbursement Confirmation
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-cyan-300" />
                  <div>
                    <p className="text-sm font-black">Higher Slab %</p>
                    <p className="text-[9px] text-blue-100">
                      Earn More Each Month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE MESSAGE */}
        {(message || error) && (
          <div
            className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
              error
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {/* STATS */}
        <section className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            icon={<Wallet size={20} />}
            title="Available Payout"
            value={loading ? "Loading..." : money(summary.availablePayout)}
            subtitle="Eligible for payout"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={<CircleDollarSign size={20} />}
            title="Total Commission"
            value={loading ? "Loading..." : money(summary.totalCommission)}
            subtitle="Total earnings till date"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={<Clock3 size={20} />}
            title="Pending Payout"
            value={loading ? "Loading..." : money(summary.pendingPayout)}
            subtitle="Under processing"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            icon={<CreditCard size={20} />}
            title="Paid Payout"
            value={loading ? "Loading..." : money(summary.paidPayout)}
            subtitle="Total amount paid"
            iconClass="bg-purple-50 text-purple-600"
          />

          <StatCard
            icon={<Receipt size={20} />}
            title="TDS Deducted"
            value={loading ? "Loading..." : money(summary.tdsDeducted)}
            subtitle="As per Income Tax Act"
            iconClass="bg-pink-50 text-pink-600"
          />
        </section>

        {/* SLAB / ELIGIBILITY / BANK */}
        <section className="grid grid-cols-1 gap-2.5 xl:grid-cols-[1.3fr_1fr_1fr]">

          {/* MONTHLY SLAB */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" />
                <h2 className="text-base font-black">Monthly Slab Progress</h2>
              </div>

              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700">
                <CalendarDays size={13} />
                {monthName.toUpperCase()}
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">
                  Net Disbursement (Current Month)
                </p>

                <p className="mt-1 text-xl font-black">
                  {money(currentDisbursement)} / {money(targetDisbursement)}
                </p>
              </div>

              <span className="text-lg font-black text-blue-600">
                {Math.round(slabPercentage)}%
              </span>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                style={{ width: `${slabPercentage}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-blue-50 p-3">
                <div className="flex items-center gap-2 text-emerald-600">
                  <BarChart3 size={18} />
                </div>
                <p className="mt-2 text-[10px] text-slate-500">Current Slab</p>
                <p className="text-sm font-black">
                  {data?.monthlySlab?.currentSlab || "No Slab"}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Sparkles size={18} />
                </div>
                <p className="mt-2 text-[10px] text-slate-500">Next Slab</p>
                <p className="text-sm font-black">
                  {data?.monthlySlab?.nextSlab || "—"}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-[11px] font-bold text-blue-700">
              <CircleDollarSign size={15} />
              {remaining > 0
                ? `${money(remaining)} more disbursement to reach next slab`
                : "Next slab target reached"}
            </div>
          </div>

          {/* ELIGIBILITY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600" />
              <h2 className="text-base font-black">Payout Eligibility</h2>
            </div>

            <div className="mt-3">
              {eligibility.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0"
                >
                  <span className="flex min-w-0 items-center gap-2 text-[11px] font-semibold">
                    <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                    {label}
                  </span>

                  <span className="shrink-0 text-[10px] font-bold text-emerald-600">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div
              className={`mt-3 flex items-center gap-3 rounded-xl p-3 ${
                eligible ? "bg-emerald-50" : "bg-amber-50"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                  eligible ? "bg-emerald-500" : "bg-amber-500"
                }`}
              >
                {eligible ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Clock3 size={20} />
                )}
              </div>

              <div>
                <p
                  className={`text-sm font-black ${
                    eligible ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {eligible
                    ? "You are eligible for payout"
                    : "Payout eligibility pending"}
                </p>
                <p
                  className={`text-[10px] ${
                    eligible ? "text-emerald-700/80" : "text-amber-700/80"
                  }`}
                >
                  {data?.eligibility?.reason ||
                    (eligible
                      ? "Request payout to withdraw your earnings."
                      : "Complete the required payout conditions.")}
                </p>
              </div>
            </div>
          </div>

          {/* BANK */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                <h2 className="text-base font-black">Registered Bank Account</h2>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                  bank?.isVerified
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {bank?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Building2 size={23} />
                </div>

                <div>
                  <p className="text-sm font-black">
                    {bank?.bankName || "Bank Account Not Added"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    A/C No: {maskAccount(bank?.accountNumber)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    IFSC: {bank?.ifscCode || "-"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-600">
                Account Holder:{" "}
                <span className="font-bold text-slate-800">
                  {bank?.accountHolderName || "-"}
                </span>
              </p>

              <button
                type="button"
                onClick={() => window.location.href = "/dsa/kyc"}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-700"
              >
                <LockKeyhole size={14} />
                Change Account
              </button>
            </div>
          </div>
        </section>

        {/* PROCESS FLOW */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-blue-600" />
            <h2 className="text-base font-black">Payout Process Flow</h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
            {[
              ["Loan Disbursed", "From Bank/NBFC", CheckCircle2],
              ["Banker Confirmation", "Verification in progress", CheckCircle2],
              ["Payout Eligible", "As per slab & policy", CheckCircle2],
              ["TDS Deduction", "As per IT Act", Percent],
              ["Payout Release", "Bank Transfer (NEFT/IMPS)", Wallet],
            ].map(([title, sub, Icon], index) => (
              <div
                key={String(title)}
                className="relative flex items-center gap-3 md:block"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      index < 3
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-[11px] font-black">{String(title)}</p>
                    <p className="text-[9px] text-slate-500">{String(sub)}</p>
                  </div>
                </div>

                {index < 4 && (
                  <div className="hidden text-center text-xl text-slate-300 md:absolute md:right-[-18px] md:top-3 md:block">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* RECENT PAYOUTS + QUICK ACTIONS */}
        <section className="grid grid-cols-1 gap-2.5 xl:grid-cols-[minmax(0,1fr)_280px]">

          {/* TABLE */}
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-blue-600" />
                <h2 className="text-base font-black">Recent Payouts</h2>
              </div>

              <button
                type="button"
                onClick={() => window.location.href = "/dsa/payout"}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-[10px] font-bold text-blue-600 transition hover:bg-blue-50"
              >
                View All Payouts
                <ArrowRight size={13} />
              </button>
            </div>

            <div id="payout-history" className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-xs font-semibold text-slate-500">
                  Loading payout history...
                </div>
              ) : payouts.length === 0 ? (
                <div className="p-8 text-center text-xs font-semibold text-slate-500">
                  No payout transactions found.
                </div>
              ) : (
                <table className="w-full min-w-0 text-left">
                  <thead>
                    <tr className="bg-[#f3f7fc] text-[10px] font-bold text-slate-600">
                      <th className="px-4 py-3">Payout ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Disbursed Amount</th>
                      <th className="px-4 py-3">Gross Payout</th>
                      <th className="px-4 py-3">TDS</th>
                      <th className="px-4 py-3">Net Payout</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payouts.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 text-[10px] transition hover:bg-blue-50/40"
                      >
                        <td className="px-4 py-3 font-black text-blue-600">
                          {item.id}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {item.date}
                        </td>
                        <td className="px-4 py-3 font-bold">{item.product}</td>
                        <td className="px-4 py-3">{item.disbursed}</td>
                        <td className="px-4 py-3">{item.gross}</td>
                        <td className="px-4 py-3">{item.tds}</td>
                        <td className="px-4 py-3 font-black">{item.net}</td>
                        <td className="px-4 py-3">
                          <Status value={item.status} />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              setMessage(`Payout ${item.id} status: ${item.status}`)
                            }
                            className="rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-600 hover:bg-blue-100"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              <h2 className="text-base font-black">Quick Actions</h2>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={requesting || !eligible}
                onClick={requestPayout}
                className="group flex w-full items-center justify-between rounded-xl bg-emerald-50 p-3 text-left transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
                    <Wallet size={17} />
                  </span>
                  <span>
                    <span className="block text-xs font-black text-emerald-700">
                      {requesting ? "Submitting..." : "Request Payout"}
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      Withdraw your eligible earnings
                    </span>
                  </span>
                </span>
                <ChevronRight size={17} className="text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => window.location.href = "/dsa/wallet/statement"}
                className="group flex w-full items-center justify-between rounded-xl bg-blue-50 p-3 text-left transition hover:bg-blue-100"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white">
                    <Download size={17} />
                  </span>
                  <span>
                    <span className="block text-xs font-black text-blue-700">
                      Download Statement
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      PDF / Excel (FY 2026-27)
                    </span>
                  </span>
                </span>
                <ChevronRight size={17} className="text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => window.location.href = "/dsa/payout"}
                className="group flex w-full items-center justify-between rounded-xl bg-purple-50 p-3 text-left transition hover:bg-purple-100"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500 text-white">
                    <Clock3 size={17} />
                  </span>
                  <span>
                    <span className="block text-xs font-black text-purple-700">
                      View Payout History
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      Check all transactions
                    </span>
                  </span>
                </span>
                <ChevronRight size={17} className="text-purple-600" />
              </button>

              <button
                type="button"
                onClick={() => window.location.href = "/dsa/wallet/balance"}
                className="group flex w-full items-center justify-between rounded-xl bg-amber-50 p-3 text-left transition hover:bg-amber-100"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                    <Sparkles size={17} />
                  </span>
                  <span>
                    <span className="block text-xs font-black text-amber-700">
                      Payout Settings
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      Bank account, notifications
                    </span>
                  </span>
                </span>
                <ChevronRight size={17} className="text-amber-600" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white">
              <LockKeyhole size={17} />
              <div>
                <p className="text-xs font-black">Secure Payout</p>
                <p className="text-[9px] text-blue-100">
                  Your payout data is protected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 py-1 text-[9px] font-medium text-slate-500">
          <ShieldCheck size={12} className="text-emerald-500" />
          Secure &bull; Transparent &bull; Professional DSA Payout Management
        </div>
      </div>
    </main>
  );
}





