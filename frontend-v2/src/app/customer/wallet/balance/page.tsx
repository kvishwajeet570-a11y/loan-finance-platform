"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  RefreshCw,
  Plus,
  ArrowUpFromLine,
  ArrowDownToLine,
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  Clock3,
  XCircle,
  ReceiptText,
  Gift,
  Star,
  TrendingUp,
  X,
  Smartphone,
  CreditCard,
  Landmark,
  Banknote,
  ChevronRight,
  Sparkles,
  CircleCheck,
  CircleAlert,
  Download,
} from "lucide-react";
import api from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, any>) => {
      open: () => void;
      on?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

type Transaction = {
  id: string;
  transactionId?: string;
  type?: string;
  amount?: number;
  status?: string;
  description?: string;
  createdAt?: string;
};

type WalletData = {
  id?: string;
  balance?: number;
  cashback?: number;
  rewardBalance?: number;
  totalEarnings?: number;
  transactions?: Transaction[];
};

type BankAccount = {
  id: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  accountHolderName?: string;
  isPrimary?: boolean;
  verificationStatus?: string;
};

function unwrap(payload: any): any {
  if (!payload) return null;
  return payload.data !== undefined ? payload.data : payload;
}

function money(value?: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function maskAccount(value?: string) {
  if (!value) return "•••• ••••";
  const clean = String(value);
  return `•••• ${clean.slice(-4)}`;
}

function positiveType(type?: string) {
  const v = String(type || "").toUpperCase();
  return (
    v.includes("CREDIT") ||
    v.includes("ADD") ||
    v.includes("REWARD") ||
    v.includes("CASHBACK")
  );
}

export default function WalletBalancePage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<"add" | "withdraw" | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [selectedBank, setSelectedBank] = useState("");
  const [agree, setAgree] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const loadWallet = useCallback(async () => {
    try {
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

      const [walletResponse, balanceResponse] = await Promise.all([
        api.get("/wallet/me", config),
        api.get("/wallet/balance", config),
      ]);

      const walletData = unwrap(walletResponse.data);
      const balanceData = unwrap(balanceResponse.data);

      setWallet({
        ...(walletData || {}),
        ...(balanceData || {}),
        transactions: walletData?.transactions || [],
      });

      const user = JSON.parse(storedUser);

      try {
        const bankResponse = await api.get(
          `/bank/user/${user.id}`,
          config
        );

        const bankData = unwrap(bankResponse.data);

        setBanks(
          Array.isArray(bankData)
            ? bankData
            : Array.isArray(bankData?.accounts)
            ? bankData.accounts
            : []
        );
      } catch {
        setBanks([]);
      }
    } catch (err: any) {
      console.error("Wallet Error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load your wallet."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const refreshWallet = async () => {
    setRefreshing(true);
    await loadWallet();
  };

  const openAddMoney = () => {
    setAddAmount("");
    setPaymentMethod("UPI");
    setModal("add");
  };

  const openWithdraw = () => {
    setWithdrawAmount("");
    setModal("withdraw");

    const primary =
      banks.find((b) => b.isPrimary) || banks[0];

    if (primary) {
      setSelectedBank(primary.id);
    }
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(!!window.Razorpay), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(!!window.Razorpay);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const addMoney = async () => {
    const amount = Number(addAmount);

    if (!amount || amount < 10) {
      alert("Minimum amount is ₹10.");
      return;
    }

    if (!agree) {
      alert("Please accept the Terms & Conditions to continue.");
      return;
    }

    if (paymentLoading) return;

    try {
      setPaymentLoading(true);

      const token = localStorage.getItem("loan_finance_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay Checkout could not be loaded. Please check your internet connection and try again.");
      }

      const orderResponse = await api.post(
        "/payment/razorpay/wallet/order",
        { amount, paymentMethod },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const order = unwrap(orderResponse.data);
      if (!order?.orderId || !order?.keyId || !order?.paymentId) {
        throw new Error("Unable to create Razorpay payment order.");
      }

      const Razorpay = window.Razorpay;
      const checkout = new Razorpay({
        key: order.keyId,
        amount: order.amountInPaise,
        currency: order.currency || "INR",
        name: "India Loan Finance",
        description: "Add Money to Wallet",
        order_id: order.orderId,
        prefill: {
          name: order.name || "",
          email: order.email || "",
          contact: order.contact || "",
        },
        notes: {
          purpose: "WALLET_ADD_MONEY",
          paymentMethod,
        },
        theme: {
          color: "#155fe5",
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await api.post(
              "/payment/razorpay/wallet/verify",
              {
                paymentId: order.paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );

            const verified = unwrap(verifyResponse.data);
            setModal(null);
            setAddAmount("");
            await loadWallet();
            alert(`Payment successful. ${money(amount)} added to your wallet.`);
          } catch (verifyError: any) {
            const message =
              verifyError?.response?.data?.message ||
              verifyError?.message ||
              "Payment was received but verification failed. Please contact support before retrying.";
            alert(message);
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      });

      checkout.on?.("payment.failed", (failure: any) => {
        setPaymentLoading(false);
        const message =
          failure?.error?.description ||
          "Payment failed. Please try again.";
        alert(message);
      });

      checkout.open();
    } catch (error: any) {
      setPaymentLoading(false);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to start payment. Please try again.";
      alert(message);
    }
  };

  const withdrawMoney = async () => {
    const amount = Number(withdrawAmount);
    const balance = Number(wallet?.balance || 0);

    if (!amount || amount < 100) {
      alert("Minimum withdrawal amount is ₹100.");
      return;
    }

    if (amount > balance) {
      alert("Withdrawal amount cannot exceed wallet balance.");
      return;
    }

    if (!selectedBank) {
      alert("Please select a bank account.");
      return;
    }

    alert(
      `Withdrawal request of ${money(amount)} is ready for bank transfer integration.`
    );
  };

  const transactions = wallet?.transactions || [];

  return (
    <div className="min-h-screen bg-[#f5f8fc] px-3 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1180px]">

        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              <Sparkles size={13} />
              Digital Wallet
            </div>

            <h1 className="text-[28px] font-black tracking-tight text-slate-950">
              Wallet Balance
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your money, rewards and wallet activity — all in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:flex sm:items-center sm:gap-2">
              <ShieldCheck size={15} />
              100% Secure
            </div>

            <button
              onClick={refreshWallet}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            <CircleAlert size={17} />
            {error}
          </div>
        )}

        {/* HERO */}
        <section className="relative mb-4 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0757d8] via-[#155fe5] to-[#8b35ee] p-6 text-white shadow-xl">
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute bottom-[-100px] left-[48%] h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute right-[22%] top-[-30px] h-28 w-28 rounded-full border-[18px] border-yellow-300/70" />

          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_350px]">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                  <Wallet size={27} />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100">
                    Available Balance
                  </p>
                  <p className="text-xs text-blue-100/80">
                    Your current wallet balance
                  </p>
                </div>
              </div>

              <div className="mt-5 text-[38px] font-black tracking-tight">
                {loading ? "₹0.00" : money(wallet?.balance)}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={openAddMoney}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  Add Money
                </button>

                <button
                  onClick={openWithdraw}
                  className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
                >
                  <ArrowUpFromLine size={18} />
                  Withdraw
                </button>
              </div>
            </div>

            {/* HERO ILLUSTRATION */}
            <div className="relative hidden min-h-[180px] lg:block">
              <div className="absolute right-8 top-7 h-20 w-28 rotate-[-8deg] rounded-2xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-2xl">
                <div className="absolute left-5 top-6 h-8 w-12 rounded-lg border-2 border-white/80" />
              </div>

              <div className="absolute right-32 top-1 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300 text-lg font-black text-yellow-900 shadow-lg">
                ₹
              </div>

              <div className="absolute right-1 top-24 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300 text-lg font-black text-yellow-900 shadow-lg">
                ₹
              </div>

              <div className="absolute bottom-0 right-20 rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-lg font-black italic">
                  Grow Your
                </p>
                <p className="text-lg font-black italic text-yellow-200">
                  Money With Us!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KPI */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Earnings",
              value: wallet?.totalEarnings,
              icon: TrendingUp,
              bg: "bg-emerald-50",
              text: "text-emerald-600",
              sub: "All time earnings",
            },
            {
              label: "Cashback",
              value: wallet?.cashback,
              icon: Gift,
              bg: "bg-violet-50",
              text: "text-violet-600",
              sub: "Total cashback earned",
            },
            {
              label: "Reward Balance",
              value: wallet?.rewardBalance,
              icon: Star,
              bg: "bg-amber-50",
              text: "text-amber-600",
              sub: "Available rewards",
            },
            {
              label: "Total Transactions",
              value: transactions.length,
              icon: ReceiptText,
              bg: "bg-blue-50",
              text: "text-blue-600",
              sub: "All wallet transactions",
              number: true,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.text}`}>
                    <Icon size={19} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-sm font-black text-emerald-600">
                    ↗ +0%
                  </span>
                </div>

                <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 text-xl font-black text-slate-950">
                  {item.number
                    ? item.value || 0
                    : money(item.value)}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <button
            onClick={openAddMoney}
            className="group flex items-center justify-between rounded-[18px] border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Plus size={20} />
              </span>
              <span>
                <span className="block text-sm font-black text-slate-900">
                  Add Money
                </span>
                <span className="block text-xs text-slate-400">
                  Instantly add funds
                </span>
              </span>
            </span>
            <ChevronRight size={18} className="text-slate-300 transition group-hover:text-blue-500" />
          </button>

          <button
            onClick={openWithdraw}
            className="group flex items-center justify-between rounded-[18px] border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ArrowUpFromLine size={20} />
              </span>
              <span>
                <span className="block text-sm font-black text-slate-900">
                  Withdraw
                </span>
                <span className="block text-xs text-slate-400">
                  Transfer to bank
                </span>
              </span>
            </span>
            <ChevronRight size={18} className="text-slate-300" />
          </button>

          <button
            onClick={() => router.push("/customer/wallet/statement")}
            className="group flex items-center justify-between rounded-[18px] border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ReceiptText size={20} />
              </span>
              <span>
                <span className="block text-sm font-black text-slate-900">
                  View Statement
                </span>
                <span className="block text-xs text-slate-400">
                  Download statement
                </span>
              </span>
            </span>
            <ChevronRight size={18} className="text-slate-300" />
          </button>

          <button
            onClick={() => router.push("/customer/wallet/transactions")}
            className="group flex items-center justify-between rounded-[18px] border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <ReceiptText size={20} />
              </span>
              <span>
                <span className="block text-sm font-black text-slate-900">
                  Transaction History
                </span>
                <span className="block text-xs text-slate-400">
                  See all transactions
                </span>
              </span>
            </span>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>

        {/* LOWER CONTENT */}
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_330px]">

          {/* TRANSACTIONS */}
          <section className="overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <ReceiptText size={18} className="text-blue-600" />
                  <h2 className="text-lg font-black text-slate-950">
                    Recent Transactions
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Your latest wallet activity
                </p>
              </div>

              <button
                onClick={() => router.push("/customer/wallet/transactions")}
                className="text-sm font-black text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="flex min-h-[245px] flex-col items-center justify-center px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                  <ReceiptText size={28} />
                </div>

                <h3 className="mt-4 text-base font-black text-slate-800">
                  No transactions yet
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Your wallet activity will appear here once you make a transaction.
                </p>

                <button
                  onClick={openAddMoney}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Money Now
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.slice(0, 6).map((tx) => {
                  const positive = positiveType(tx.type);

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            positive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {positive ? (
                            <ArrowDownToLine size={18} />
                          ) : (
                            <ArrowUpFromLine size={18} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {tx.description || tx.type || "Wallet Transaction"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {tx.createdAt
                              ? new Date(tx.createdAt).toLocaleString("en-IN")
                              : "Recent"}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`text-sm font-black ${
                          positive
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {positive ? "+" : "-"}
                        {money(tx.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* OFFER */}
          <aside className="relative min-h-[300px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#f3efff] via-[#f7f3ff] to-[#fff1f8] p-6">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-purple-200/40" />
            <div className="absolute bottom-[-45px] right-[-15px] h-40 w-40 rounded-full bg-pink-200/30" />

            <div className="relative z-10">
              <div className="text-sm font-black uppercase tracking-[0.2em] text-purple-600">
                Special Offers
              </div>

              <h3 className="mt-3 text-[26px] font-black leading-tight text-slate-950">
                Do More with
                <br />
                <span className="text-purple-600">
                  Your Wallet!
                </span>
              </h3>

              <p className="mt-3 max-w-[230px] text-sm leading-6 text-slate-500">
                Add money, transact and earn exciting rewards.
              </p>

              <button
                onClick={openAddMoney}
                className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200"
              >
                Explore Wallet
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="absolute bottom-3 right-4 text-6xl">
              🎁
            </div>

            <div className="absolute bottom-3 right-20 text-4xl">
              🪙
            </div>
          </aside>
        </div>

        {/* SECURITY */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-sm font-black text-emerald-800">
                Your wallet information is securely connected to your customer account.
              </p>
              <p className="mt-0.5 text-xs text-emerald-600">
                We use secure protection to keep your data safe.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-bold text-emerald-700">
            <span className="flex items-center gap-1.5">
              <LockKeyhole size={15} />
              Stay Safe
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} />
              Trusted Platform
            </span>
            <span className="flex items-center gap-1.5">
              <CircleCheck size={15} />
              100% Secure
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADD MONEY MODAL
      ===================================================== */}
      {modal === "add" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07142f]/70 p-3 backdrop-blur-xl sm:p-6">

          <div className="relative max-h-[95vh] w-full max-w-[640px] overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]">

            {/* TOP VISUAL */}
            <div className="relative h-[185px] overflow-hidden bg-gradient-to-br from-[#0757df] via-[#2464f0] to-[#8139ed] px-7 pt-6 text-white">

              <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
              <div className="absolute -bottom-24 left-[35%] h-56 w-56 rounded-full bg-white/10" />
              <div className="absolute right-[22%] top-7 h-20 w-20 rounded-full border-[13px] border-yellow-300/80" />

              {/* floating coins */}
              <div className="absolute right-[20%] top-4 flex h-12 w-12 rotate-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-yellow-400 text-lg font-black text-yellow-900 shadow-xl">
                ₹
              </div>

              <div className="absolute right-8 top-20 flex h-10 w-10 -rotate-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-yellow-400 text-sm font-black text-yellow-900 shadow-xl">
                ₹
              </div>

              <div className="absolute right-[37%] bottom-5 flex h-9 w-9 rotate-12 items-center justify-center rounded-full border-3 border-yellow-200 bg-yellow-400 text-sm font-black text-yellow-900 shadow-lg">
                ₹
              </div>

              {/* wallet illustration */}
              <div className="absolute right-[11%] top-[54px] h-[76px] w-[142px] rotate-[-7deg] rounded-[20px] border border-white/30 bg-gradient-to-br from-[#62a0ff] to-[#154bc5] shadow-[0_18px_35px_rgba(0,0,0,.3)]">
                <div className="absolute left-5 top-6 h-8 w-12 rounded-lg border-[3px] border-white/90" />
                <div className="absolute right-5 top-7 h-3 w-3 rounded-full bg-white/80" />
                <div className="absolute bottom-4 left-5 h-1.5 w-16 rounded-full bg-white/30" />
              </div>

              <button
                onClick={() => setModal(null)}
                className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                <X size={18} />
              </button>

              <div className="relative z-10 max-w-[310px]">
                <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-blue-100">
                  <Sparkles size={13} />
                  Digital Wallet
                </div>

                <h2 className="text-[25px] font-black leading-tight">
                  Add Money
                  <br />
                  <span className="text-yellow-200">
                    Securely & Instantly
                  </span>
                </h2>

                <p className="mt-2 text-sm leading-5 text-blue-100">
                  Add funds to your wallet and unlock a faster, easier payment experience.
                </p>
              </div>
            </div>

            {/* STEPS */}
            <div className="border-b border-slate-100 bg-white px-6 py-4">
              <div className="flex items-center justify-center gap-2 sm:gap-4">

                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow-md shadow-blue-200">
                    1
                  </span>
                  <span className="text-xs font-black text-blue-600">
                    Amount
                  </span>
                </div>

                <div className="h-px w-10 bg-slate-200 sm:w-16" />

                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">
                    2
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Payment
                  </span>
                </div>

                <div className="h-px w-10 bg-slate-200 sm:w-16" />

                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">
                    3
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Confirm
                  </span>
                </div>

              </div>
            </div>

            <div className="max-h-[calc(95vh-245px)] overflow-y-auto p-5 sm:p-6">

              {/* SECURITY STRIP */}
              <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">

                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <ShieldCheck size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Secure
                    </p>
                    <p className="text-xs text-slate-400">
                      Protected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                    <Smartphone size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Easy Pay
                    </p>
                    <p className="text-xs text-slate-400">
                      UPI & Cards
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <Clock3 size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Fast
                    </p>
                    <p className="text-xs text-slate-400">
                      Instant Credit
                    </p>
                  </div>
                </div>

              </div>

              {/* AMOUNT CARD */}
              <div className="mb-5 rounded-[22px] border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">

                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
                      Enter Amount
                    </label>
                    <p className="mt-1 text-sm text-slate-400">
                      Choose how much you want to add
                    </p>
                  </div>

                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                    MIN ₹100
                  </div>
                </div>

                <div className="relative flex overflow-hidden rounded-2xl border-2 border-blue-100 bg-white transition focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,.08)]">

                  <div className="flex w-14 items-center justify-center border-r border-slate-100 bg-blue-50 text-xl font-black text-blue-700">
                    ₹
                  </div>

                  <input
                    value={addAmount}
                    onChange={(e) =>
                      setAddAmount(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="0"
                    inputMode="numeric"
                    className="w-full bg-transparent px-5 py-4 text-[24px] font-black text-slate-950 outline-none placeholder:text-slate-200"
                  />

                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[500, 1000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAddAmount(String(amount))}
                      className={`rounded-xl border py-2.5 text-xs font-black transition ${
                        addAmount === String(amount)
                          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border-blue-100 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      ₹{amount.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

              </div>

              {/* PAYMENT METHODS */}
              <div className="mb-5">

                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
                      Select Payment Method
                    </label>
                    <p className="mt-1 text-sm text-slate-400">
                      Choose your preferred payment option
                    </p>
                  </div>

                  <span className="text-xs font-black text-emerald-600">
                    🔒 100% SECURE
                  </span>
                </div>

                <div className="grid gap-2">

                  {[
                    {
                      id: "UPI",
                      title: "UPI",
                      sub: "Google Pay • PhonePe • Paytm",
                      icon: Smartphone,
                      badge: "FASTEST",
                    },
                    {
                      id: "CARD",
                      title: "Debit / Credit Card",
                      sub: "Visa • Mastercard • RuPay",
                      icon: CreditCard,
                      badge: "",
                    },
                    {
                      id: "NETBANKING",
                      title: "Net Banking",
                      sub: "All major banks supported",
                      icon: Landmark,
                      badge: "",
                    },
                  ].map((method) => {

                    const Icon = method.icon;
                    const selected =
                      paymentMethod === method.id;

                    return (
                      <button
                        key={method.id}
                        onClick={() =>
                          setPaymentMethod(method.id)
                        }
                        className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3.5 text-left transition-all ${
                          selected
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-[0_5px_20px_rgba(37,99,235,.10)]"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >

                        {selected && (
                          <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />
                        )}

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-white text-blue-600 shadow-sm"
                              : "bg-slate-50 text-slate-500"
                          }`}
                        >
                          <Icon size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-800">
                              {method.title}
                            </p>

                            {method.badge && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-700">
                                {method.badge}
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-sm text-slate-400">
                            {method.sub}
                          </p>
                        </div>

                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            selected
                              ? "border-blue-600"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                          )}
                        </div>

                      </button>
                    );
                  })}

                </div>
              </div>

              {/* SPECIAL OFFER */}
              <div className="relative mb-5 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 p-4">

                <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-purple-200/30" />

                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                    <Gift size={21} />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-900">
                      Wallet Rewards
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Add money and enjoy eligible cashback & rewards.
                    </p>
                  </div>

                  <Sparkles size={20} className="text-purple-500" />
                </div>

              </div>

              {/* AGREEMENT */}
              <label className="mb-5 flex cursor-pointer items-start gap-2.5 rounded-xl bg-slate-50 p-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                />

                <span className="text-sm leading-4 text-slate-500">
                  I agree to the{" "}
                  <span className="font-black text-blue-600">
                    Terms & Conditions
                  </span>{" "}
                  and confirm that the payment information provided by me is correct.
                </span>
              </label>

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-3">

                <button
                  onClick={() => setModal(null)}
                  className="rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={addMoney}
                  disabled={!agree || paymentLoading}
                  className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 text-sm font-black text-white shadow-[0_10px_25px_rgba(79,70,229,.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(79,70,229,.35)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paymentLoading ? "Opening Payment..." : "Continue to Pay"}
                  <ChevronRight size={18} className="transition group-hover:translate-x-1" />
                </button>

              </div>

              {/* FOOTER */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">

                <span className="flex items-center gap-1.5">
                  <LockKeyhole size={13} className="text-emerald-500" />
                  Secure Payment
                </span>

                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-blue-500" />
                  Trusted Platform
                </span>

                <span className="flex items-center gap-1.5">
                  <CircleCheck size={13} className="text-purple-500" />
                  Protected
                </span>

              </div>

            </div>
          </div>
        </div>

              )}

      {/* =====================================================
          WITHDRAW MODAL
      ===================================================== */}
      {modal === "withdraw" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md sm:p-6">
          <div className="relative max-h-[94vh] w-full max-w-[610px] overflow-y-auto rounded-[26px] bg-white shadow-2xl">

            <div className="relative overflow-hidden border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white px-6 py-5">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-purple-100/60" />

              <button
                onClick={() => setModal(null)}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-slate-700"
              >
                <X size={19} />
              </button>

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg">
                  <ArrowUpFromLine size={28} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Withdraw Money
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Transfer your wallet balance securely to your bank account.
                  </p>
                </div>
              </div>

              <div className="relative mt-5 flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-purple-600">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white">
                    1
                  </span>
                  Details
                </div>

                <div className="h-px flex-1 bg-slate-200" />

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300">
                    2
                  </span>
                  Review
                </div>

                <div className="h-px flex-1 bg-slate-200" />

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300">
                    3
                  </span>
                  Confirm
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                    <Wallet size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Available Balance
                    </p>
                    <p className="text-xl font-black text-slate-950">
                      {money(wallet?.balance)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Your current wallet balance
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white px-3 py-2 text-center shadow-sm">
                  <p className="text-xs font-bold text-slate-400">
                    Min. Withdrawal
                  </p>
                  <p className="text-sm font-black text-purple-600">
                    ₹100
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-wider text-slate-700">
                  Enter Amount
                </label>

                <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="flex w-14 items-center justify-center border-r border-slate-200 text-xl font-black text-slate-700">
                    ₹
                  </div>

                  <input
                    value={withdrawAmount}
                    onChange={(e) =>
                      setWithdrawAmount(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="Enter amount"
                    inputMode="numeric"
                    className="w-full bg-transparent px-4 py-4 text-lg font-black outline-none"
                  />
                </div>

                <p className="mt-1.5 text-sm text-slate-400">
                  Minimum: ₹100 &nbsp; | &nbsp; Maximum:{" "}
                  {money(wallet?.balance)}
                </p>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[500, 1000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        setWithdrawAmount(String(amount))
                      }
                      className="rounded-xl border border-purple-100 bg-purple-50/50 py-2.5 text-xs font-black text-purple-600 transition hover:border-purple-400 hover:bg-purple-50"
                    >
                      ₹{amount.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-black uppercase tracking-wider text-slate-700">
                    Select Bank Account
                  </label>

                  <button
                    onClick={() =>
                      router.push(
                        "/customer/bank-accounts/add"
                      )
                    }
                    className="text-xs font-black text-purple-600"
                  >
                    + Add New Bank Account
                  </button>
                </div>

                {banks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                    <Landmark
                      size={25}
                      className="mx-auto text-slate-400"
                    />
                    <p className="mt-2 text-sm font-black text-slate-700">
                      No bank account found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Add a verified bank account to withdraw money.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/customer/bank-accounts/add"
                        )
                      }
                      className="mt-3 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white"
                    >
                      Add Bank Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {banks.slice(0, 4).map((bank) => {
                      const selected =
                        selectedBank === bank.id;

                      return (
                        <button
                          key={bank.id}
                          onClick={() =>
                            setSelectedBank(bank.id)
                          }
                          className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                            selected
                              ? "border-purple-500 bg-purple-50"
                              : "border-slate-200 bg-white hover:border-purple-200"
                          }`}
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                            <Landmark size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-black text-slate-800">
                                {bank.bankName || "Bank Account"}
                              </p>

                              {bank.isPrimary && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-700">
                                  Primary
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-slate-500">
                              Savings Account •{" "}
                              {maskAccount(bank.accountNumber)}
                            </p>

                            <p className="text-xs text-slate-400">
                              IFSC: {bank.ifscCode || "—"}
                            </p>
                          </div>

                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              selected
                                ? "border-purple-600"
                                : "border-slate-300"
                            }`}
                          >
                            {selected && (
                              <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex gap-3">
                  <CircleAlert
                    size={20}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  <div>
                    <p className="text-sm font-black text-orange-700">
                      Important Information
                    </p>

                    <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                      <li>• Funds will be transferred to your selected bank account.</li>
                      <li>• Processing time may be 1–2 business days.</li>
                      <li>• Make sure your bank account details are correct.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-black text-slate-700"
                >
                  Cancel
                </button>

                <button
                  onClick={withdrawMoney}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-200"
                >
                  Review & Withdraw
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <LockKeyhole size={13} className="text-emerald-500" />
                  Secure Transfer
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-blue-500" />
                  Verified Banks
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} className="text-purple-500" />
                  1–2 Business Days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


