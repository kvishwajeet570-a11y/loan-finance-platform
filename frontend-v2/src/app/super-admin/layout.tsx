"use client";

import {
  Activity, BarChart3, Bell, BookOpen, Building2, ChevronDown,
  ChevronLeft, ChevronRight, CircleDollarSign, ClipboardCheck,
  FileText, Handshake, LayoutDashboard, LogOut, Menu, Search,
  Settings, ShieldCheck, Users, Wallet, X, UserCog, BriefcaseBusiness,
  ScrollText, KeyRound, Megaphone, Headset, Landmark, TrendingUp,
  FileCheck, Network, Database, LockKeyhole, HeartPulse, Target,
  BadgeCheck, CreditCard, Banknote, ChartNoAxesCombined
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  href: string;
};

type MenuGroup = {
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
};

const navigation: MenuGroup[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { label: "Overview", href: "/super-admin/dashboard" },
      { label: "Live Monitoring", href: "/super-admin/monitoring" },
      { label: "KPI & Performance", href: "/super-admin/kpi" },
      { label: "System Health", href: "/super-admin/system-health" }
    ]
  },
  {
    label: "Customer Management",
    icon: Users,
    items: [
      { label: "All Customers", href: "/super-admin/customers" },
      { label: "Customer Verification", href: "/super-admin/customers/verification" },
      { label: "Blocked Customers", href: "/super-admin/blocked-customers" },
      { label: "Risk Flags", href: "/super-admin/risk-flags" }
    ]
  },
  {
    label: "DSA & Partner Management",
    icon: BriefcaseBusiness,
    items: [
      { label: "DSA & Partner Management", href: "/super-admin/dsa" },
      { label: "Performance & Reports", href: "/super-admin/dsa-performance" }
    ]
  },
  {
    label: "Loan Management",
    icon: Wallet,
    items: [
      { label: "All Loans", href: "/super-admin/loans" },
      { label: "Loan History", href: "/super-admin/loans/history" }
    ]
  },
  {
    label: "Lead & CRM",
    icon: Target,
    items: [
      { label: "All Leads", href: "/super-admin/leads" },
      { label: "Lead Assignment", href: "/super-admin/lead-assignment" },
      { label: "Follow-ups", href: "/super-admin/follow-ups" },
      { label: "Lead Pipeline", href: "/super-admin/lead-pipeline" }
    ]
  },
  {
    label: "KYC & Documents",
    icon: FileCheck,
    items: [
      { label: "KYC Review", href: "/super-admin/kyc-review" },
      { label: "Document Verification", href: "/super-admin/documents" },
      { label: "Rejected Documents", href: "/super-admin/rejected-documents" }
    ]
  },
  {
    label: "Wallet & Transactions",
    icon: CreditCard,
    items: [
      { label: "Wallet Overview", href: "/super-admin/wallets" },
      { label: "Transaction History", href: "/super-admin/transactions" },
      { label: "Ledger", href: "/super-admin/ledger" },
      { label: "Wallet Adjustments", href: "/super-admin/wallet-adjustments" },
      { label: "Bank Accounts", href: "/super-admin/bank-accounts" }
    ]
  },
  {
    label: "Commission & Payout",
    icon: CircleDollarSign,
    items: [
      { label: "Commission Overview", href: "/super-admin/commission" },
      { label: "Commission Rules", href: "/super-admin/commission-rules" },
      { label: "Payout", href: "/super-admin/payouts" },
      { label: "Settlements", href: "/super-admin/settlements" }
    ]
  },
  {
    label: "Lender & Products",
    icon: Landmark,
    items: [
      { label: "Lender Directory", href: "/super-admin/lenders" },
      { label: "Loan Products", href: "/super-admin/products" },
      { label: "Lender Policies", href: "/super-admin/lender-policies" },
      { label: "Serviceability", href: "/super-admin/serviceability" }
    ]
  },
  {
    label: "Referral Network",
    icon: Network,
    items: [
      { label: "Referral Tracking", href: "/super-admin/referrals" },
      { label: "Partner Network", href: "/super-admin/partner-network" },
      { label: "Referral Rewards", href: "/super-admin/referral-rewards" }
    ]
  },
  {
    label: "Reports & Analytics",
    icon: ChartNoAxesCombined,
    items: [
      { label: "Business Reports", href: "/super-admin/reports" },
      { label: "Financial Reports", href: "/super-admin/financial-reports" },
      { label: "DSA Reports", href: "/super-admin/dsa-reports" },
      { label: "Custom Reports", href: "/super-admin/custom-reports" },
      { label: "Analytics", href: "/super-admin/analytics" }
    ]
  },
  {
    label: "Marketing & CMS",
    icon: Megaphone,
    items: [
      { label: "Banners", href: "/super-admin/banners" },
      { label: "Blogs", href: "/super-admin/blogs" },
      { label: "Pages & CMS", href: "/super-admin/cms" },
      { label: "Campaigns", href: "/super-admin/campaigns" },
      { label: "Coupons", href: "/super-admin/coupons" }
    ]
  },
  {
    label: "Training & Support",
    icon: Headset,
    items: [
      { label: "Training", href: "/super-admin/training" },
      { label: "Live Sessions", href: "/super-admin/live-sessions" },
      { label: "Support Tickets", href: "/super-admin/support" },
      { label: "Complaints", href: "/super-admin/complaints" }
    ]
  },
  {
    label: "Notifications",
    icon: Bell,
    items: [
      { label: "Notification Center", href: "/super-admin/notifications" },
      { label: "Push Notifications", href: "/super-admin/notifications/push" },
      { label: "Email & SMS", href: "/super-admin/notifications/email-sms" },
      { label: "WhatsApp", href: "/super-admin/notifications/whatsapp" },
      { label: "Notification Logs", href: "/super-admin/notification-logs" }
    ]
  },
  {
    label: "Employee & Access Control",
    icon: UserCog,
    items: [
      { label: "Admin Users", href: "/super-admin/admins" },
      { label: "Roles", href: "/super-admin/roles" },
      { label: "Permissions", href: "/super-admin/permissions" },
      { label: "Login History", href: "/super-admin/login-history" }
    ]
  },
  {
    label: "System Settings & Audit",
    icon: Settings,
    items: [
      { label: "General Settings", href: "/super-admin/settings" },
      { label: "API Settings", href: "/super-admin/api-settings" },
      { label: "Security Center", href: "/super-admin/security-center" },
      { label: "Activity Logs", href: "/super-admin/activity" },
      { label: "Audit Logs", href: "/super-admin/audit-logs" },
      { label: "Backup & Recovery", href: "/super-admin/backups" }
    ]
  }
];

export default function SuperAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const activeGroup = navigation.find(group =>
      group.items.some(item =>
        pathname === item.href || pathname.startsWith(item.href + "/")
      )
    );

    if (activeGroup) {
      setExpanded(previous =>
        previous.includes(activeGroup.label)
          ? previous
          : [...previous, activeGroup.label]
      );
    }
  }, [pathname]);

  const filteredNavigation = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return navigation;

    return navigation
      .map(group => {
        const groupMatches = group.label.toLowerCase().includes(query);
        const items = groupMatches
          ? group.items
          : group.items.filter(item =>
              item.label.toLowerCase().includes(query)
            );

        return { ...group, items };
      })
      .filter(group => group.items.length > 0);
  }, [search]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const logout = () => {
    localStorage.removeItem("loan_finance_token");
    localStorage.removeItem("loan_finance_user");
    router.push("/login");
  };

  const toggleGroup = (label: string) => {
    setExpanded(previous =>
      previous.includes(label)
        ? previous.filter(item => item !== label)
        : [...previous, label]
    );
  };

  const renderNavigation = (mobile = false) => (
    <nav className="space-y-2">
      {filteredNavigation.map(group => {
        const Icon = group.icon;
        const isExpanded = search.length > 0 || expanded.includes(group.label);
        const groupActive = group.items.some(item => isActive(item.href));

        return (
          <div key={group.label}>
            <button
              type="button"
              title={collapsed && !mobile ? group.label : undefined}
              onClick={() => {
                if (collapsed && !mobile) {
                  setCollapsed(false);
                  setExpanded(previous => [...previous, group.label]);
                } else {
                  toggleGroup(group.label);
                }
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                groupActive
                  ? "bg-blue-600/15 text-blue-300"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              } ${collapsed && !mobile ? "justify-center" : ""}`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon size={19} className="shrink-0" />
                {(!collapsed || mobile) && (
                  <span className="truncate">{group.label}</span>
                )}
              </span>

              {(!collapsed || mobile) && (
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {isExpanded && (!collapsed || mobile) && (
              <div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">
                {group.items.map(item => {
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        router.push(item.href);
                      }}
                      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition ${
                        active
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                          : "text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#020d1a] text-white">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-[#071426] text-white transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-[82px]" : "w-[285px]"
        }`}
      >
        <div className="flex h-[76px] shrink-0 items-center border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <ShieldCheck size={23} strokeWidth={2.4} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-[15px] font-black">
                  AIFIN
                </div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                  Super Admin Control
                </div>
              </div>
            )}
          </div>
        </div>

        {!collapsed && (
          <div className="px-3 pt-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search modules..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <div className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              Enterprise Control Center
            </div>
          )}
          {renderNavigation()}
        </div>

        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setCollapsed(value => !value)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
            {!collapsed && "Collapse Sidebar"}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-50 bg-slate-950/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[300px] flex-col bg-[#071426] text-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <ShieldCheck size={23} />
            </div>
            <div>
              <div className="text-[15px] font-black">AIFIN</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                Super Admin
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-3 pt-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search modules..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {renderNavigation(true)}
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div
        className={`min-h-screen bg-[#020d1a] text-white transition-all duration-300 ${
          collapsed ? "lg:pl-[82px]" : "lg:pl-[285px]"
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-cyan-300/15 bg-[#07182b]/95 text-white backdrop-blur-xl">
          <div className="flex h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-cyan-300/20 bg-[#0b2038] p-2.5 text-cyan-100 shadow-sm lg:hidden"
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                  Central Control
                </div>
                <h1 className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
                  Super Admin Panel
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => router.push("/super-admin/notifications")}
                title="Notifications"
                className="relative rounded-xl border border-cyan-300/20 bg-[#0b2038] p-2.5 text-cyan-200 shadow-sm hover:bg-blue-500/15 hover:text-white"
              >
                <Bell size={19} />
              </button>

              <div className="hidden h-8 w-px bg-cyan-300/15 sm:block" />

              <div className="hidden items-center gap-2.5 rounded-xl border border-cyan-300/20 bg-[#0b2038] px-2.5 py-2 shadow-sm sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white">
                  SA
                </div>
                <div>
                  <div className="text-xs font-black text-white">
                    Super Administrator
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Control Panel
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="rounded-xl border border-red-400/20 bg-red-500/10 p-2.5 text-red-300 transition hover:bg-red-500/20"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] min-w-0 bg-[#020d1a] p-4 text-white sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}








