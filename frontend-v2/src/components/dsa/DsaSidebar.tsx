"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserRound,
  FileText,
  ShieldCheck,
  Wallet,
  ReceiptText,
  BadgeIndianRupee,
  TrendingUp,
  Trophy,
  GraduationCap,
  Calculator,
  CircleGauge,
  CreditCard,
  LifeBuoy,
  UserCog,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Plus,
  Sparkles,
  Search,
  Building2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Item = {
  label: string;
  href: string;
  icon: any;
  children?: { label: string; href: string }[];
};

const groups = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dsa/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/dsa/analytics", icon: BarChart3 },
      { label: "Notifications", href: "/dsa/notifications", icon: Bell },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      {
        label: "Leads",
        href: "/dsa/leads",
        icon: Users,
        children: [
          { label: "My Leads", href: "/dsa/leads" },
          { label: "Leads Report & Filter", href: "/dsa/leads/report" },
          { label: "Disbursed Leads", href: "/dsa/leads/disbursed" },
        ],
      },
      {
        label: "Sub Agent",
        href: "/dsa/sub-agent",
        icon: Users,
        children: [
          { label: "My Sub Agent", href: "/dsa/sub-agent" },
          { label: "Add New Sub Agent", href: "/dsa/sub-agent/add" },
          { label: "Sub Agent Leads", href: "/dsa/sub-agent/leads" },
        ],
      },
      {
        label: "Customers",
        href: "/dsa/customers",
        icon: UserRound,
        children: [
          { label: "All Customers", href: "/dsa/customers" },
        ],
      },
      {
        label: "Loan Applications",
        href: "/dsa/loan-applications",
        icon: FileText,
        children: [
          { label: "All Applications", href: "/dsa/loan-applications" },
        ],
      },
      {
        label: "KYC Verification",
        href: "/dsa/kyc",
        icon: ShieldCheck,
        children: [
          { label: "Pending KYC", href: "/dsa/kyc?status=PENDING" },
          { label: "Under Review", href: "/dsa/kyc?status=UNDER_REVIEW" },
          { label: "Approved", href: "/dsa/kyc?status=APPROVED" },
          { label: "Rejected", href: "/dsa/kyc?status=REJECTED" },
        ],
      },
    ],
  },
  {
    title: "FINANCE",
    items: [
      {
        label: "Commission",
        href: "/dsa/commission",
        icon: BadgeIndianRupee,
        children: [
          { label: "Overview", href: "/dsa/commission" },
          { label: "Pending", href: "/dsa/commission?status=PENDING" },
          { label: "Approved", href: "/dsa/commission?status=APPROVED" },
          { label: "History", href: "/dsa/commission?tab=history" },
        ],
      },
      {
        label: "Wallet",
        href: "/dsa/wallet",
        icon: Wallet,
        children: [
          { label: "Overview", href: "/dsa/wallet" },
          { label: "Earnings", href: "/dsa/wallet?tab=earnings" },
          { label: "Cashback", href: "/dsa/wallet?tab=cashback" },
          { label: "Withdrawal", href: "/dsa/wallet?tab=withdrawal" },
        ],
      },
      {
        label: "My Payout",
        href: "/dsa/payout",
        icon: Wallet,
        children: [
          { label: "Payout Overview", href: "/dsa/payout" },
          { label: "Payout Chart", href: "/dsa/payout/chart" },
        ],
      },      {
        label: "Transactions",
        href: "/dsa/transactions",
        icon: ReceiptText,
        children: [
          { label: "All Transactions", href: "/dsa/transactions" },
          { label: "Credit", href: "/dsa/transactions?type=CREDIT" },
          { label: "Debit", href: "/dsa/transactions?type=DEBIT" },
        ],
      },
      {
        label: "Reports",
        href: "/dsa/reports",
        icon: TrendingUp,
        children: [
          { label: "Business Report", href: "/dsa/reports?type=business" },
          { label: "Loan Report", href: "/dsa/reports?type=loan" },
          { label: "Commission Report", href: "/dsa/reports?type=commission" },
          { label: "Customer Report", href: "/dsa/reports?type=customer" },
        ],
      },
    ],
  },
  {
    title: "GROWTH",
    items: [
      {
        label: "Refer & Earn",
        href: "/dsa/referral",
        icon: TrendingUp,
        children: [
          { label: "Referral Link", href: "/dsa/referral" },
          { label: "My Referrals", href: "/dsa/referral?tab=referrals" },
          { label: "Referral Earnings", href: "/dsa/referral?tab=earnings" },
        ],
      },
      {
        label: "Achievements",
        href: "/dsa/achievements",
        icon: Trophy,
        children: [
          { label: "Milestones", href: "/dsa/achievements" },
          { label: "Completed", href: "/dsa/achievements?status=completed" },
        ],
      },
      {
        label: "Leaderboard",
        href: "/dsa/leaderboard",
        icon: Trophy,
        children: [
          { label: "Overall", href: "/dsa/leaderboard" },
          { label: "Weekly", href: "/dsa/leaderboard?period=weekly" },
          { label: "Monthly", href: "/dsa/leaderboard?period=monthly" },
        ],
      },
      {
        label: "Training Center",
        href: "/dsa/training",
        icon: GraduationCap,
        children: [
          { label: "Training Videos", href: "/dsa/training" },
          { label: "Product Training", href: "/dsa/training?type=product" },
          { label: "Sales Training", href: "/dsa/training?type=sales" },
        ],
      },
    ],
  },
  {
    title: "TOOLS",
    items: [
      { label: "EMI Calculator", href: "/dsa/tools/emi-calculator", icon: Calculator },
      { label: "Loan Eligibility", href: "/dsa/tools/loan-eligibility", icon: CircleGauge },
      { label: "Credit Score", href: "/dsa/tools/credit-score", icon: CreditCard },
    ],
  },
  {
    title: "PIN CODE",
    items: [
      {
        label: "Pin Code",
        href: "/dsa/pin-code",
        icon: Calculator,
        children: [
          { label: "Pin Code", href: "/dsa/pin-code" },
          { label: "Company", href: "/dsa/company" },
        ],
      },
    ],
  },  {
    title: "RESOURCES",
    items: [
      {
        label: "Marketing",
        href: "/dsa/marketing",
        icon: TrendingUp,
        children: [
          { label: "Marketing Overview", href: "/dsa/marketing" },
          { label: "Marketing Materials", href: "/dsa/marketing/materials" },
          { label: "Banners & Posters", href: "/dsa/marketing/banners" },
        ],
      },
      {
        label: "Advisor Training",
        href: "/dsa/advisor-training",
        icon: GraduationCap,
        children: [
          { label: "Training Overview", href: "/dsa/advisor-training" },
          { label: "Training Videos", href: "/dsa/advisor-training/videos" },
          { label: "Training Documents", href: "/dsa/advisor-training/documents" },
        ],
      },
      {
        label: "Lender Policy",
        href: "/dsa/lender-policy",
        icon: FileText,
        children: [
          { label: "All Lender Policies", href: "/dsa/lender-policy" },
          { label: "Lender List", href: "/dsa/lender-policy/lenders" },
          { label: "Policy Documents", href: "/dsa/lender-policy/documents" },
        ],
      },
    ],
  },  {
    title: "SUPPORT",
    items: [
      {
        label: "Help & Support",
        href: "/dsa/support",
        icon: LifeBuoy,
        children: [
          { label: "FAQ", href: "/dsa/support?tab=faq" },
          { label: "My Tickets", href: "/dsa/support?tab=tickets" },
          { label: "Create Ticket", href: "/dsa/support?tab=create" },
        ],
      },
      {
        label: "Profile",
        href: "/dsa/profile",
        icon: UserCog,
        children: [
          { label: "Personal Details", href: "/dsa/profile" },
          { label: "KYC & Documents", href: "/dsa/profile?tab=kyc" },
          { label: "Bank Details", href: "/dsa/profile?tab=bank" },
          { label: "Security", href: "/dsa/profile?tab=security" },
        ],
      },
    ],
  },
] as { title: string; items: Item[] }[];

export default function DsaSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState(0);
  const [unread, setUnread] = useState(0);
  const [sidebarSearch, setSidebarSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("loan_finance_user");
      const current = raw ? JSON.parse(raw) : null;
      setUser(current);

      if (current?.id) {
        const token = localStorage.getItem("loan_finance_token");

        fetch(`${API}/dsa/dashboard/${current.id}`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        })
          .then((r) => r.json())
          .then((json) => {
            const data = json?.data || json;
            setWallet(Number(data?.wallet?.balance || 0));
            setUnread(Number(data?.unreadNotifications || 0));
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    const next: Record<string, boolean> = {};

    groups.forEach((group) => {
      group.items.forEach((item) => {
        if (
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`)
        ) {
          next[item.label] = true;
        }
      });
    });

    setOpen((old) => ({ ...next, ...old }));
  }, [pathname]);

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const q = sidebarSearch.trim().toLowerCase();

        if (!q) return true;

        const itemMatch = item.label.toLowerCase().includes(q);

        const childMatch = item.children?.some((child) =>
          child.label.toLowerCase().includes(q)
        );

        return itemMatch || childMatch;
      }),
    }))
    .filter((group) => group.items.length > 0);

  const toggle = (label: string) => {
    setOpen((old) => ({
      ...old,
      [label]: !old[label],
    }));
  };

  const logout = () => {
    localStorage.removeItem("loan_finance_token");
    localStorage.removeItem("loan_finance_user");
    router.push("/login");
  };

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "DSA Partner";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white shadow-[8px_0_35px_rgba(15,23,42,0.06)] transition-all duration-300 ${
        collapsed ? "w-[78px]" : "w-[278px]"
      }`}
    >
      <div className="flex h-[76px] items-center border-b border-slate-100 px-4">
        {!collapsed ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-white shadow-lg shadow-blue-200">
              <Sparkles size={21} />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[18px] font-black tracking-tight text-slate-900">
                DSA FinCorp
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Partner Portal
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-white shadow-lg shadow-blue-200">
            <Sparkles size={21} />
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-2 hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:flex"
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronDown size={17} />}
        </button>
      </div>

      {!collapsed && (
        <div className="mx-3 mt-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
              {String(displayName).slice(0, 1).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-slate-900">
                {displayName}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active Partner
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white p-2.5 shadow-sm">
              <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Wallet
              </div>
              <div className="mt-1 text-[15px] font-black text-slate-900">
                ₹{wallet.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="rounded-xl bg-white p-2.5 shadow-sm">
              <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Alerts
              </div>
              <div className="mt-1 text-[15px] font-black text-slate-900">
                {unread}
              </div>
            </div>
          </div>
        </div>
      )}

      {!collapsed && (
        <Link
          href="/dsa/apply-loan"
          className="mx-3 mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-4 py-3 text-[13px] font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Apply Apply New Loan Application
        </Link>
      )}

      {!collapsed && (
        <div className="mx-3 mt-3 mb-2">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search sidebar..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-[13px] font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {sidebarSearch && (
              <button
                type="button"
                onClick={() => setSidebarSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-5">
        {filteredGroups.map((group) => (
          <div key={group.title} className="mb-5">
            {!collapsed && (
              <div className="mb-2 px-2 text-[10px] font-black tracking-[0.16em] text-slate-400">
                {group.title}
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                const hasChildren =
                  Array.isArray(item.children) && item.children.length > 0;

                return (
                  <div key={item.label}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold transition ${
                          active
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-100"
                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                        }`}
                      >
                        <Icon
                          size={17}
                          strokeWidth={active ? 2.5 : 2}
                          className="shrink-0"
                        />

                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}

                        {!collapsed &&
                          item.label === "Notifications" &&
                          unread > 0 && (
                            <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                              {unread > 99 ? "99+" : unread}
                            </span>
                          )}
                      </Link>

                      {!collapsed && hasChildren && (
                        <button
                          onClick={() => toggle(item.label)}
                          className={`ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                            active
                              ? "text-blue-600"
                              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          }`}
                        >
                          {open[item.label] ? (
                            <ChevronDown size={15} />
                          ) : (
                            <ChevronRight size={15} />
                          )}
                        </button>
                      )}
                    </div>

                    {!collapsed && hasChildren && open[item.label] && (
                      <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-blue-100 pl-3">
                        {item.children!.map((child) => {
                          const childActive =
                            pathname === child.href.split("?")[0] &&
                            (child.href.includes("?")
                              ? window.location.search ===
                                `?${child.href.split("?")[1]}`
                              : true);

                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={`block rounded-lg px-3 py-2 text-[12px] font-semibold transition ${
                                childActive
                                  ? "bg-blue-50 font-bold text-blue-700"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-500">
            Grow your business with DSA FinCorp
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}















