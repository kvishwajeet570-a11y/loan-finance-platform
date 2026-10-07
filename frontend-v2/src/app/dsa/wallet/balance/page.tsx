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
import { useState } from "react";

const money = "₹0.00";

export default function DsaWalletBalancePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#07183d]">
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
          <div className="mb-2 text-center text-2xl">👑</div>
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

              <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white shadow-lg shadow-blue-500/20">
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
                  ₹0.00
                </div>

                <div className="mt-1 text-sm text-blue-100">
                  Available Wallet Balance
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1.5 text-[10px] font-bold">
                    <ShieldCheck size={13} />
                    Active Wallet
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold">
                    <LockKeyhole size={13} />
                    Secure & Encrypted
                  </span>
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
                  “Simple • Secure • Always With You”
                </div>
                <div className="mb-5 text-xs text-blue-100">
                  Manage your funds anytime, anywhere.
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <ActionButton
                    icon={<Zap size={18} />}
                    label="Add Money"
                    green
                  />
                  <ActionButton
                    icon={<ArrowUpRight size={18} />}
                    label="Withdraw"
                    purple
                  />
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
                    <span className="text-xl font-black">₹0.00</span>
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
                />
                <QuickAction
                  icon={<ArrowUpRight />}
                  title="Withdraw"
                  subtitle="Transfer funds to bank"
                  tone="purple"
                />
                <QuickAction
                  icon={<List />}
                  title="Transactions"
                  subtitle="View wallet activity"
                  tone="blue"
                />
                <QuickAction
                  icon={<FileText />}
                  title="Statement"
                  subtitle="Download wallet statement"
                  tone="orange"
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
            © 2026 DSA FINCORP • Secure Wallet Dashboard
          </div>
        </div>
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
}: {
  icon: React.ReactNode;
  label: string;
  green?: boolean;
  purple?: boolean;
  blue?: boolean;
}) {
  return (
    <button className="flex min-h-[62px] items-center justify-center gap-2 rounded-xl bg-white px-2 py-3 text-[10px] font-black text-[#10255b] shadow-lg transition hover:-translate-y-0.5">
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
          ↑ +0%
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

function QuickAction({
  icon,
  title,
  subtitle,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "green" | "purple" | "blue" | "orange";
}) {
  const bg = {
    green: "bg-emerald-500",
    purple: "bg-violet-600",
    blue: "bg-blue-600",
    orange: "bg-orange-500",
  };

  return (
    <button className="group flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
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
        ↑ +0%
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
