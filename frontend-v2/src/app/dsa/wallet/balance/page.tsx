"use client";

import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
  Zap,
  CreditCard,
  ReceiptText,
  HandCoins,
  Landmark,
  List,
  CircleHelp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

function formatMoney(value: number | string | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function unwrap(payload: any) {
  return payload?.data ?? payload;
}

export default function DsaWalletBalancePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [walletError, setWalletError] = useState("");
  const [walletModal, setWalletModal] = useState<"add" | "withdraw" | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

  const loadWallet = useCallback(async () => {
    try {
      setWalletError("");
      const token = localStorage.getItem("loan_finance_token");
      const storedUser = localStorage.getItem("loan_finance_user");

      if (!token || !storedUser) {
        router.replace("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const [walletRes, balanceRes] = await Promise.all([
        api.get("/wallet/me", config),
        api.get("/wallet/balance", config),
      ]);

      const walletData = unwrap(walletRes.data);
      const balanceData = unwrap(balanceRes.data);

      setWallet({
        ...(walletData || {}),
        ...(balanceData || {}),
      });
      setWalletBalance(
        Number(balanceData?.balance ?? walletData?.balance ?? 0)
      );
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setWalletError(
        error?.response?.data?.message || "Wallet data load nahi hua."
      );
    } finally {
      setLoadingWallet(false);
      setRefreshing(false);
    }
  }, [router]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const refreshWallet = async () => {
    setRefreshing(true);
    await loadWallet();
  };

  const money = formatMoney(walletBalance);
  const totalEarnings = formatMoney(wallet?.totalEarnings);
  const pendingAmount = formatMoney(wallet?.pendingAmount);

  const goToTransactions = () => router.push("/dsa/wallet/transactions");
  const goToStatement = () => router.push("/dsa/wallet/statement");
  const addMoneyWithRazorpay = async () => {
    const rawAmount = addAmount;

    const amount = Number(rawAmount);
    if (!Number.isFinite(amount) || amount < 100 || amount > 100000) {
      alert("Amount ₹100 se ₹1,00,000 ke beech hona chahiye.");
      return;
    }

    try {
      const token = localStorage.getItem("loan_finance_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const scriptUrl = "https://checkout.razorpay.com/v1/checkout.js";
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = scriptUrl;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay checkout load nahi hua."));
          document.body.appendChild(script);
        });
      }

      const orderResponse = await api.post(
        "/payment/razorpay/wallet/order",
        { amount, paymentMethod: "ONLINE" },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      const order = unwrap(orderResponse.data);
      if (!order?.orderId || !order?.keyId || !order?.paymentId) {
        throw new Error("Payment order create nahi hua.");
      }

      const RazorpayConstructor = (window as any).Razorpay;
      const checkout = new RazorpayConstructor({
        key: order.keyId,
        amount: order.amountInPaise,
        currency: order.currency || "INR",
        name: "DSA FinCorp",
        description: "Wallet Add Money",
        order_id: order.orderId,
        prefill: {
          name: order.name || "",
          email: order.email || "",
          contact: order.contact || "",
        },
        handler: async (response: any) => {
          try {
            await api.post(
              "/payment/razorpay/wallet/verify",
              {
                paymentId: order.paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            await loadWallet();
            alert("Payment verification successful. Wallet balance refresh ho gaya.");
          } catch (error: any) {
            alert(
              error?.response?.data?.message ||
              "Payment verification confirm nahi hua. Dobara payment karne se pehle support se contact karein."
            );
          }
        },
        modal: { ondismiss: () => {} },
        theme: { color: "#155fe5" },
      });

      checkout.on?.("payment.failed", (failure: any) => {
        alert(failure?.error?.description || "Payment failed. Please try again.");
      });
      checkout.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Add Money start nahi hua.");
    }
  };

  const showWithdrawalNotice = () => { setWalletModal("withdraw"); };

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#07183d]">
{walletError && (
        <div role="alert" className="fixed right-4 top-4 z-50 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-lg">
          {walletError}
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[200px] overflow-hidden bg-[#07172f] text-white lg:block">
        <div className="flex h-[68px] items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1687ff] to-[#673cff] shadow-[0_0_25px_rgba(22,135,255,.35)]">
            <Wallet size={22} />
          </div>
          <div>
            <div className="text-[16px] font-black tracking-tight text-white">
              DSA FINCORP
            </div>
            <div className="text-[8px] font-medium text-blue-300">
              Your Growth, Our Priority
            </div>
          </div>
        </div>

        <div className="px-3 py-5">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem icon={<CreditCard size={18} />} label="Leads" arrow />
          <SidebarItem icon={<FileText size={18} />} label="Applications" />
          <SidebarItem icon={<Building2 size={18} />} label="Customers" />

          <div className="mb-3 mt-6 px-3 text-[10px] font-semibold tracking-wider text-slate-400">
            FINANCE
          </div>

          <SidebarItem icon={<CircleDollarSign size={18} />} label="Commission" />

          <div className="mt-1 rounded-xl bg-gradient-to-r from-[#087cf5] to-[#1565db] shadow-[0_8px_24px_rgba(0,105,255,.25)]">
            <SidebarItem
              icon={<Wallet size={18} />}
              label="Wallet"
              active
              arrowUp
            />

            <div className="mb-2 ml-7 mr-2 border-l border-white/20 pl-2">
              <SubItem label="Balance" active />
              <SubItem label="Transactions" />
              <SubItem label="Statement" />
            </div>
          </div>

          <SidebarItem icon={<ArrowUpRight size={18} />} label="My Payout" />
          <SidebarItem icon={<ReceiptText size={18} />} label="Transactions" />
          <SidebarItem icon={<BarChart3 size={18} />} label="Reports" arrow />

          <div className="mb-3 mt-6 px-3 text-[10px] font-semibold tracking-wider text-slate-400">
            SUPPORT
          </div>

          <SidebarItem icon={<CircleHelp size={18} />} label="Help & Support" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-yellow-300/30 bg-gradient-to-br from-[#102c57] to-[#111b3e] p-4 shadow-xl">
          <div className="mb-2 text-center text-2xl">ðŸ‘‘</div>
          <div className="text-center text-xs font-bold text-yellow-200">
            Premium DSA Panel
          </div>
          <div className="mt-1 text-center text-[10px] leading-4 text-slate-300">
            More Loans
            <br />
            More Earnings
            <br />
            More Growth
          </div>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-300 to-orange-300 py-2 text-[10px] font-bold text-[#18213d]">
            Upgrade Now <ArrowRight size={12} />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden">
          <div className="h-full w-[280px] bg-[#07172f] p-4 text-white">
            <button
              onClick={() => setShowMobileMenu(false)}
              className="mb-6 ml-auto flex rounded-lg bg-white/10 p-2"
            >
              <X size={20} />
            </button>

            <div className="mb-8 text-xl font-black">DSA FINCORP</div>

            <div className="space-y-2 text-sm">
              {[
                "Dashboard",
                "Leads",
                "Applications",
                "Customers",
                "Commission",
                "Wallet",
                "Balance",
                "Transactions",
                "Statement",
                "My Payout",
                "Reports",
                "Help & Support",
                "Settings",
              ].map((x) => (
                <div
                  key={x}
                  className={`rounded-lg px-4 py-3 ${
                    x === "Balance"
                      ? "bg-blue-600"
                      : "bg-white/[0.03]"
                  }`}
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="min-h-screen lg:ml-[200px]">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="hidden w-[390px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 sm:flex">
              <Search size={17} className="text-slate-400" />
              <span className="text-xs text-slate-400">
                Search anything...
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                RS
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold">DSA Partner</div>
                <div className="text-[10px] text-slate-500">Active Account</div>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6">
          {/* PAGE HEADING */}
          <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span>Home</span>
                <ChevronRight size={12} />
                <span>Finance</span>
                <ChevronRight size={12} />
                <span>Wallet</span>
                <ChevronRight size={12} />
                <span className="font-semibold text-blue-600">Balance</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-[36px]">
                Wallet Balance
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your wallet balance, earnings and financial activity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active Wallet
              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] text-slate-500 sm:flex">
                <Clock3 size={15} />
                Last Updated
                <b className="text-slate-700">06 Oct 2026, 10:27 AM</b>
              </div>

              <button onClick={refreshWallet} disabled={refreshing} title="Refresh wallet" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white shadow-lg shadow-blue-500/20 disabled:opacity-60">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {/* ================= PREMIUM WALLET BANNER ================= */}
          <section className="relative mb-5 min-h-[205px] overflow-hidden rounded-[24px] border border-blue-300/30 bg-gradient-to-br from-[#075bea] via-[#073da8] to-[#2812bd] p-6 text-white shadow-[0_20px_60px_rgba(26,79,220,.25)] sm:p-8">
            <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(120,80,255,.35),transparent_65%)]" />
            <div className="absolute bottom-[-120px] left-1/3 h-64 w-64 rounded-full border-[30px] border-blue-300/10" />

            <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[1fr_1.1fr_1.25fr]">
              {/* Balance */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur">
                    <Wallet size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">DSA Wallet</div>
                    <div className="text-[10px] text-blue-200">
                      Your earnings, always with you
                    </div>
                  </div>
                </div>

                <div className="text-5xl font-black tracking-tight sm:text-6xl">
                  {loadingWallet ? "Loading..." : money}
                </div>

                <div className="mt-1 text-sm text-blue-100">
                  Available Wallet Balance
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => { setAddAmount(""); setWalletModal("add"); }}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5"
                  >
                    <Zap size={18} />
                    Add Money
                  </button>
                  <button
                    type="button"
                    onClick={() => { setWithdrawAmount(""); setWalletModal("withdraw"); }}
                    className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
                  >
                    <ArrowUpRight size={18} />
                    Withdraw
                  </button>
                </div>
              </div>

              {/* CODE-BASED WALLET ILLUSTRATION */}
              <div className="relative hidden h-[150px] items-center justify-center lg:flex">
                <div className="absolute h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />

                <div className="relative h-[105px] w-[150px] rotate-[-5deg] rounded-[22px] border-4 border-blue-200/70 bg-gradient-to-br from-[#258cff] to-[#1543b8] shadow-[0_20px_50px_rgba(0,0,0,.35)]">
                  <div className="absolute left-5 top-5 h-8 w-8 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 shadow-lg" />
                  <div className="absolute right-4 top-5 h-5 w-9 rounded-full border-2 border-white/40" />
                  <div className="absolute bottom-5 left-5 h-3 w-20 rounded-full bg-white/20" />
                  <div className="absolute bottom-4 right-4 h-8 w-8 rounded-lg bg-blue-300/30" />
                </div>

                <div className="absolute left-[8%] top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-yellow-100 bg-gradient-to-br from-yellow-200 to-orange-400 text-xl font-black text-orange-700 shadow-lg">
                  ₹
                </div>

                <div className="absolute bottom-3 right-[10%] flex h-14 w-14 items-center justify-center rounded-full border-4 border-yellow-100 bg-gradient-to-br from-yellow-200 to-orange-400 text-xl font-black text-orange-700 shadow-lg">
                  ₹
                </div>

                <div className="absolute bottom-[-4px] left-[45%] flex h-11 w-11 items-center justify-center rounded-full border-4 border-white/50 bg-emerald-500 shadow-xl">
                  <ShieldCheck size={22} />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="lg:text-right">
                <div className="mb-1 text-lg font-black">
                  â€œSimple â€¢ Secure â€¢ Always With Youâ€
                </div>
                <div className="mb-5 text-xs text-blue-100">
                  Manage your funds anytime, anywhere.
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <ActionButton
                    icon={<List size={18} />}
                    label="View Transactions"
                    blue
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================= SUMMARY ================= */}
          <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={<TrendingUp size={21} />}
              title="Total Earnings"
              value={money}
              subtitle="Lifetime earnings"
              tone="green"
            />
            <SummaryCard
              icon={<Wallet size={21} />}
              title="Available Balance"
              value={money}
              subtitle="Ready for use"
              tone="blue"
            />
            <SummaryCard
              icon={<Clock3 size={21} />}
              title="Pending Amount"
              value={money}
              subtitle="Under processing"
              tone="orange"
            />
            <SummaryCard
              icon={<FileText size={21} />}
              title="Total Transactions"
              value="0"
              subtitle="All wallet activity"
              tone="purple"
            />
          </div>

          {/* ================= MAIN GRID ================= */}
          <div className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
            {/* WALLET OVERVIEW */}
            <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,35,70,.05)] sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">Wallet Overview</h2>
                  <p className="text-xs text-slate-500">
                    A complete view of your wallet status
                  </p>
                </div>

                <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="grid items-center gap-7 md:grid-cols-[180px_1fr]">
                {/* Donut */}
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#1677ff_0deg,#59c9ff_90deg,#dcecff_90deg,#e9f1fa_360deg)] p-4">
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-xl font-black">{loadingWallet ? "..." : money}</span>
                    <span className="text-[10px] text-slate-500">
                      Total Balance
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <ProgressRow
                    dot="bg-emerald-500"
                    label="Available Balance"
                    value={money}
                  />
                  <ProgressRow
                    dot="bg-blue-500"
                    label="Pending Amount"
                    value={money}
                  />
                  <ProgressRow
                    dot="bg-orange-500"
                    label="Total Earnings"
                    value={money}
                  />
                  <ProgressRow
                    dot="bg-violet-500"
                    label="Withdrawable Amount"
                    value={money}
                  />
                </div>
              </div>
            </section>

            {/* QUICK ACTIONS */}
            <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,35,70,.05)] sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-black">Quick Actions</h2>
                <p className="text-xs text-slate-500">
                  Perform wallet related actions quickly
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <QuickAction
                  icon={<Zap />}
                  title="Add Money"
                  subtitle="Add funds to wallet"
                  tone="green"
                  onClick={() => { setAddAmount(""); setWalletModal("add"); }}
                />
                <QuickAction
                  icon={<ArrowUpRight />}
                  title="Withdraw"
                  subtitle="Transfer funds to bank"
                  tone="purple"
                  onClick={() => { setWithdrawAmount(""); setWalletModal("withdraw"); }}
                />
                <QuickAction
                  icon={<List />}
                  title="Transactions"
                  subtitle="View wallet activity"
                  tone="blue"
                  onClick={goToTransactions}
                />
                <QuickAction
                  icon={<FileText />}
                  title="Statement"
                  subtitle="Download wallet statement"
                  tone="orange"
                  onClick={goToStatement}
                />
              </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,35,70,.05)] sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">
                    Recent Wallet Activity
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your latest wallet transactions
                  </p>
                </div>

                <button className="hidden items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 sm:flex">
                  View All Transactions <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex min-h-[205px] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <FileText size={26} />
                </div>
                <h3 className="text-sm font-black">No wallet activity yet</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Your wallet transactions will appear here.
                </p>
                <button className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                  View All Transactions
                </button>
              </div>
            </section>

            {/* COMMISSION */}
            <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,35,70,.05)] sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">
                    Commission & Earnings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your commission and earnings breakdown
                  </p>
                </div>

                <select className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <CommissionCard
                  icon={<CircleDollarSign />}
                  title="Total Commission"
                  value={money}
                  tone="green"
                />
                <CommissionCard
                  icon={<CheckCircle2 />}
                  title="Approved Commission"
                  value={money}
                  tone="blue"
                />
                <CommissionCard
                  icon={<Clock3 />}
                  title="Pending Commission"
                  value={money}
                  tone="orange"
                />
                <CommissionCard
                  icon={<HandCoins />}
                  title="Paid Commission"
                  value={money}
                  tone="purple"
                />
              </div>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Commission trend</span>
                  <span>₹0.00</span>
                </div>

                <div className="flex h-14 items-end gap-2">
                  {[18, 30, 22, 42, 28, 35, 48, 25, 40, 32, 44, 52].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-blue-200 to-blue-500/60"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>

                <div className="mt-2 grid grid-cols-12 text-center text-[8px] text-slate-400">
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ================= BOTTOM ================= */}
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            {/* SECURITY */}
            <section className="rounded-[20px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <h2 className="font-black">Your wallet is protected</h2>
                  <p className="text-xs text-slate-500">
                    Secure, trusted and reliable financial transactions.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <SecurityItem
                  icon={<ShieldCheck />}
                  title="Secure Account"
                  subtitle="Your data is safe"
                />
                <SecurityItem
                  icon={<LockKeyhole />}
                  title="Protected Transactions"
                  subtitle="All transactions secured"
                />
                <SecurityItem
                  icon={<CheckCircle2 />}
                  title="Verified Platform"
                  subtitle="Trusted & compliant"
                />
                <SecurityItem
                  icon={<Landmark />}
                  title="Bank-grade Security"
                  subtitle="Enterprise level protection"
                />
              </div>
            </section>

            {/* GROW EARNINGS */}
            <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1745ef] via-[#2637df] to-[#7316e9] p-6 text-white shadow-[0_15px_40px_rgba(54,43,220,.25)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
              <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-cyan-300/10 blur-xl" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 text-yellow-300">
                  <Sparkles size={20} />
                  <span className="text-xs font-bold">DSA GROWTH</span>
                </div>

                <h2 className="text-2xl font-black">Grow your earnings</h2>

                <p className="mt-2 max-w-[310px] text-xs leading-5 text-blue-100">
                  Track commissions, manage your wallet and monitor your
                  financial activity from one place.
                </p>

                <button className="mt-5 flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black text-blue-700 shadow-xl">
                  Explore Wallet
                  <ArrowRight size={15} />
                </button>
              </div>
            </section>
          </div>

          <div className="pb-6 pt-5 text-center text-[10px] text-slate-400">
            Â© 2026 DSA FINCORP â€¢ Secure Wallet Dashboard
          </div>
        </div>
      {/* DSA_WALLET_FORMS_ADDED */}
      {walletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {walletModal === "add" ? "Add Money" : "Withdraw Money"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Available balance: {money}
                </p>
              </div>
              <button type="button" onClick={() => setWalletModal(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {walletModal === "add" ? (
              <form className="space-y-5 p-6" onSubmit={(e) => { e.preventDefault(); void addMoneyWithRazorpay(); }}>
                <label className="block text-sm font-bold text-slate-700">
                  Amount to add (₹)
                  <input type="number" min="100" max="100000" step="1"
                    required value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount, e.g. 1000"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["500", "1000", "5000", "10000"].map((v) => (
                    <button key={v} type="button" onClick={() => setAddAmount(v)}
                      className="rounded-xl border border-blue-100 bg-blue-50 px-2 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100">
                      ₹{Number(v).toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
                <p className="rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                  Payment will be processed through the existing Razorpay checkout. Wallet credit depends on successful server-side verification.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setWalletModal(null)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button>
                  <button type="submit"
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700">Continue to Pay</button>
                </div>
              </form>
            ) : (
              <form className="space-y-5 p-6" onSubmit={(e) => { e.preventDefault(); alert("Withdrawal form is ready, but the DSA withdrawal-request API is not yet connected. No money has been deducted."); }}>
                <label className="block text-sm font-bold text-slate-700">
                  Withdrawal amount (₹)
                  <input type="number" min="100" max={Math.max(100, walletBalance)} step="1"
                    required value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </label>
                <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  Minimum withdrawal: ₹100. A verified withdrawal API and bank-account selection are required before a request can be submitted. This form does not deduct your balance.
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setWalletModal(null)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button>
                  <button type="submit"
                    className="flex-1 rounded-xl bg-slate-400 px-4 py-3 font-bold text-white hover:bg-slate-500">Check Request Setup</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* DSA_WALLET_PREMIUM_MODAL */}
      {walletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-md sm:p-6">
          <div className="relative flex max-h-[94vh] w-full max-w-[550px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-2xl">
            {/* Gradient hero */}
            <div className={`relative shrink-0 overflow-hidden px-6 py-5 text-white ${walletModal === "add" ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" : "bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500"}`}>
              <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-[-55px] right-20 h-32 w-32 rounded-full bg-white/10" />
              <button type="button" onClick={() => setWalletModal(null)} aria-label="Close modal"
                className="absolute right-4 top-4 z-10 rounded-xl border border-white/30 bg-white/10 p-2 hover:bg-white/20">
                <X size={19} />
              </button>
              <div className="relative z-[1] pr-10">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/80">✦ Digital Wallet</div>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {walletModal === "add" ? "Add Money" : "Withdraw Money"}
                </h2>
                <p className="mt-0.5 text-lg font-black text-yellow-200">
                  {walletModal === "add" ? "Securely & Instantly" : "Transfer to Your Bank"}
                </p>
                <p className="mt-2 max-w-[340px] text-xs leading-5 text-white/90">
                  {walletModal === "add" ? "Add funds to your wallet using our payment checkout." : "Review your amount and bank details before requesting a withdrawal."}
                </p>
              </div>
              <div className="pointer-events-none absolute bottom-4 right-8 hidden text-6xl opacity-20 sm:block">
                {walletModal === "add" ? "₹+" : "₹↗"}
              </div>
            </div>

            {/* Progress */}
            <div className="flex shrink-0 items-center justify-center gap-3 border-b border-slate-100 px-4 py-4 text-[11px] font-bold sm:gap-5">
              <span className={`flex items-center gap-2 ${walletModal === "add" ? "text-blue-600" : "text-purple-600"}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${walletModal === "add" ? "bg-blue-600" : "bg-purple-600"}`}>1</span>
                {walletModal === "add" ? "Amount" : "Details"}
              </span>
              <span className="h-px w-8 bg-slate-200 sm:w-12" />
              <span className="flex items-center gap-2 text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50">2</span>
                {walletModal === "add" ? "Payment" : "Review"}
              </span>
              <span className="h-px w-8 bg-slate-200 sm:w-12" />
              <span className="flex items-center gap-2 text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50">3</span>
                Confirm
              </span>
            </div>

            {/* Scrollable form content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              <div className={`mb-5 flex items-center justify-between rounded-2xl border p-4 ${walletModal === "add" ? "border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50" : "border-purple-100 bg-gradient-to-r from-purple-50 to-fuchsia-50"}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ${walletModal === "add" ? "text-blue-600" : "text-purple-600"}`}>
                    <Wallet size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Available Balance</p>
                    <p className="mt-0.5 text-xl font-black text-slate-900">{money}</p>
                    <p className="text-[11px] text-slate-500">Your current wallet balance</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white bg-white/90 px-3 py-2 text-center shadow-sm">
                  <p className="text-[10px] font-semibold text-slate-500">{walletModal === "add" ? "Minimum Add" : "Minimum Withdraw"}</p>
                  <p className={`text-sm font-black ${walletModal === "add" ? "text-blue-700" : "text-purple-700"}`}>₹100</p>
                </div>
              </div>

              {walletModal === "add" ? (
                <form onSubmit={(e) => { e.preventDefault(); void addMoneyWithRazorpay(); }} className="space-y-5">
                  <section>
                    <div className="flex items-center justify-between">
                      <label htmlFor="dsa-add-amount" className="text-xs font-black uppercase tracking-wider text-slate-700">Enter Amount (₹)</label>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">MIN ₹100</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Choose how much you want to add</p>
                    <div className="mt-3 flex overflow-hidden rounded-xl border-2 border-blue-100 focus-within:border-blue-500">
                      <span className="flex items-center bg-blue-50 px-4 text-lg font-black text-blue-700">₹</span>
                      <input id="dsa-add-amount" type="number" min="100" max="100000" step="1" required value={addAmount} onChange={(e) => setAddAmount(e.target.value)} placeholder="Enter amount" className="min-w-0 flex-1 px-4 py-4 text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300" />
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {["500", "1000", "5000", "10000"].map((v) => (
                        <button key={v} type="button" onClick={() => setAddAmount(v)} className={`rounded-xl border px-1 py-3 text-xs font-black transition ${addAmount === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-blue-100 text-blue-600 hover:bg-blue-50"}`}>₹{Number(v).toLocaleString("en-IN")}</button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Select Payment Method</h3>
                        <p className="mt-1 text-xs text-slate-400">Choose your preferred payment option</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600">🔒 SECURE</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3 rounded-xl border border-blue-300 bg-blue-50/80 p-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><CreditCard size={19} /></span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-slate-800">UPI <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] text-emerald-700">FAST</span></p>
                          <p className="mt-1 text-[11px] text-slate-500">Google Pay · PhonePe · Paytm</p>
                        </div>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-600"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /></span>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500"><CreditCard size={19} /></span>
                        <div className="flex-1"><p className="text-xs font-black text-slate-800">Debit / Credit Card</p><p className="mt-1 text-[11px] text-slate-500">Visa · Mastercard · RuPay</p></div>
                        <span className="h-5 w-5 rounded-full border-2 border-slate-300" />
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500"><Landmark size={19} /></span>
                        <div className="flex-1"><p className="text-xs font-black text-slate-800">Net Banking</p><p className="mt-1 text-[11px] text-slate-500">Supported banks via checkout</p></div>
                        <span className="h-5 w-5 rounded-full border-2 border-slate-300" />
                      </div>
                    </div>
                  </section>

                  <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-600">
                    <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    <p>Payments are processed through the existing Razorpay checkout. Wallet credit depends on successful payment verification.</p>
                  </div>
                  <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-600">
                    <input type="checkbox" required className="mt-1 accent-blue-600" />
                    <span>I agree to the <span className="font-bold text-blue-700">Terms & Conditions</span> and confirm the payment amount is correct.</span>
                  </label>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setWalletModal(null)} className="flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:brightness-105">Continue to Pay <span className="ml-1">›</span></button>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-4 text-[10px] font-semibold text-slate-400">
                    <span>♧ Secure Payment</span><span>◇ Trusted Platform</span><span>✓ Protected</span>
                  </div>
                </form>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); alert("UI preview only: withdrawal API and verified bank-account selection must be connected before submitting a real request. No money has been deducted."); }} className="space-y-5">
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Enter Amount (₹)</h3>
                    <div className="mt-3 flex overflow-hidden rounded-xl border border-purple-100 focus-within:border-purple-500">
                      <span className="flex items-center bg-purple-50 px-4 text-lg font-black text-purple-700">₹</span>
                      <input type="number" min="100" max={walletBalance} step="1" required value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter amount" className="min-w-0 flex-1 px-4 py-4 text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300" />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">Minimum: ₹100 <span className="mx-1">|</span> Maximum: {money}</p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {["500", "1000", "5000", "10000"].map((v) => (
                        <button key={v} type="button" disabled={Number(v) > walletBalance} onClick={() => setWithdrawAmount(v)} className={`rounded-xl border px-1 py-3 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${withdrawAmount === v ? "border-purple-500 bg-purple-50 text-purple-700" : "border-purple-100 text-purple-700 hover:bg-purple-50"}`}>₹{Number(v).toLocaleString("en-IN")}</button>
                      ))}
                    </div>
                  </section>
                  <section>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Select Bank Account</h3>
                      <button type="button" onClick={() => alert("Connect your verified saved-bank-account API here before adding a bank account.")} className="text-[10px] font-black text-purple-700 hover:underline">+ Add New Bank Account</button>
                    </div>
                    <div className="mt-3 rounded-xl border border-dashed border-purple-200 bg-purple-50/50 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm"><Landmark size={20} /></span>
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-800">Saved Bank Account</p>
                          <p className="mt-1 text-[11px] text-slate-500">Connect your verified bank-account list</p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black text-amber-700">SETUP NEEDED</span>
                      </div>
                    </div>
                  </section>
                  <label className="block text-xs font-black text-slate-700">Remarks (Optional)
                    <textarea rows={2} maxLength={200} placeholder="Add a note for this request" className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-purple-400" />
                  </label>
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <p className="text-xs font-black text-orange-700">ⓘ Important Information</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-5 text-orange-900">
                      <li>Withdrawal requests require backend verification.</li>
                      <li>Processing time depends on approval and bank transfer.</li>
                      <li>This preview does not transfer money or deduct your balance.</li>
                    </ul>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setWalletModal(null)} className="flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={!withdrawAmount || Number(withdrawAmount) < 100 || Number(withdrawAmount) > walletBalance || withdrawSubmitting} className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-3 text-sm font-black text-white shadow-lg shadow-purple-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">Review & Withdraw <span className="ml-1">›</span></button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({
  icon,
  label,
  active,
  arrow,
  arrowUp,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  arrow?: boolean;
  arrowUp?: boolean;
}) {
  return (
    <div
      className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold ${
        active ? "text-white" : "text-slate-300"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {arrow && <ChevronRight size={14} />}
      {arrowUp && <ChevronDown size={14} />}
    </div>
  );
}

function SubItem({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`mb-1 flex items-center rounded-lg px-3 py-2.5 text-[11px] font-semibold ${
        active
          ? "bg-white/15 text-white shadow-inner"
          : "text-slate-300 hover:bg-white/5"
      }`}
    >
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  green,
  purple,
  blue,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  green?: boolean;
  purple?: boolean;
  blue?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick ?? (() => { if (label === "View Transactions") { window.location.href = "/dsa/wallet/transactions"; } else { alert(label + " feature abhi integrate nahi hai."); } })} className="flex min-h-[62px] items-center justify-center gap-2 rounded-xl bg-white px-2 py-3 text-[10px] font-black text-[#10255b] shadow-lg transition hover:-translate-y-0.5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
          green
            ? "bg-emerald-500"
            : purple
              ? "bg-violet-600"
              : "bg-blue-600"
        }`}
      >
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  tone: "green" | "blue" | "orange" | "purple";
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-500",
    blue: "bg-blue-50 text-blue-500",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-violet-50 text-violet-500",
  };

  return (
    <div className="group rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(15,35,70,.04)] transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[tone]}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
          â†‘ +0%
        </span>
      </div>

      <div className="mt-3 text-[11px] font-semibold text-slate-500">
        {title}
      </div>

      <div className="mt-1 text-2xl font-black tracking-tight">{value}</div>

      <div className="mt-1 text-[10px] text-slate-400">{subtitle}</div>
    </div>
  );
}

function ProgressRow({
  dot,
  label,
  value,
}: {
  dot: string;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span className="flex-1 text-xs font-semibold text-slate-600">
          {label}
        </span>
        <span className="text-xs font-black">{value}</span>
      </div>

      <div className="ml-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-0 rounded-full bg-blue-500" />
      </div>
    </div>
  );
}

function QuickAction({ icon, title, subtitle, tone, onClick }: { icon: React.ReactNode; title: string; subtitle: string; tone: "green" | "purple" | "blue" | "orange"; onClick?: () => void; }) {
  const bg = {
    green: "bg-emerald-500",
    purple: "bg-violet-600",
    blue: "bg-blue-600",
    orange: "bg-orange-500",
  };

  return (
    <button onClick={onClick ?? (() => { if (title === "Transactions") { window.location.href = "/dsa/wallet/transactions"; } else if (title === "Statement") { window.location.href = "/dsa/wallet/statement"; } else { alert(title + " feature abhi integrate nahi hai."); } })} className="group flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${bg[tone]}`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black">{title}</span>
        <span className="mt-1 block text-[10px] text-slate-500">
          {subtitle}
        </span>
      </span>

      <ChevronRight
        size={16}
        className="text-slate-400 transition group-hover:translate-x-1"
      />
    </button>
  );
}

function CommissionCard({
  icon,
  title,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  tone: "green" | "blue" | "orange" | "purple";
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-500",
    blue: "bg-blue-50 text-blue-500",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-violet-50 text-violet-500",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[tone]}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[10px] text-slate-500">{title}</div>
        <div className="mt-0.5 text-base font-black">{value}</div>
      </div>

      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-600">
        â†‘ +0%
      </span>
    </div>
  );
}

function SecurityItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
        {icon}
      </div>

      <div>
        <div className="text-[10px] font-black text-slate-700">{title}</div>
        <div className="text-[8px] text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}

