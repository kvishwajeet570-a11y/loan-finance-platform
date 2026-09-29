"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X,
  UserCog,
  Handshake,
  BriefcaseBusiness,
  ScrollText,
  KeyRound,
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/super-admin/users",
    icon: Users,
  },
  {
    label: "Admins",
    href: "/super-admin/admins",
    icon: UserCog,
  },
  {
    label: "DSA Management",
    href: "/super-admin/dsa",
    icon: BriefcaseBusiness,
  },
  {
    label: "Partners",
    href: "/super-admin/partners",
    icon: Handshake,
  },
  {
    label: "Loans",
    href: "/super-admin/loans",
    icon: WalletCards,
  },
  {
    label: "Bank Accounts",
    href: "/super-admin/bank-accounts",
    icon: Building2,
  },
  {
    label: "Roles",
    href: "/super-admin/roles",
    icon: ShieldCheck,
  },
  {
    label: "Permissions",
    href: "/super-admin/permissions",
    icon: KeyRound,
  },
  {
    label: "Reports",
    href: "/super-admin/reports",
    icon: FileText,
  },
  {
    label: "Analytics",
    href: "/super-admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Activity Logs",
    href: "/super-admin/activity",
    icon: Activity,
  },
  {
    label: "Audit Logs",
    href: "/super-admin/audit-logs",
    icon: ScrollText,
  },
  {
    label: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("loan_finance_token");
    localStorage.removeItem("loan_finance_user");
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-[#071426] text-white transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-[82px]" : "w-[270px]"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-950/30">
              <ShieldCheck size={23} strokeWidth={2.4} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-[15px] font-black tracking-tight">
                  India Loan Finance
                </div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                  Super Admin
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <div className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              Control Center
            </div>
          )}

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  title={collapsed ? item.label : undefined}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                      : "text-slate-300 hover:bg-white/7 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.5 : 2}
                  />

                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/7 hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <>
                <PanelLeftClose size={19} />
                Collapse Sidebar
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-[285px] bg-[#071426] text-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <ShieldCheck size={23} />
            </div>

            <div>
              <div className="text-[15px] font-black">
                India Loan Finance
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                Super Admin
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="h-[calc(100vh-76px)] overflow-y-auto px-3 py-5">
          <div className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Control Center
          </div>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push(item.href);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-white/7 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Area */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-[82px]" : "lg:pl-[270px]"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-600">
                  Central Control
                </div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  Super Admin Panel
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              <div className="hidden h-8 w-px bg-slate-200 sm:block" />

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white">
                  SA
                </div>

                <div className="hidden min-w-0 sm:block">
                  <div className="max-w-[130px] truncate text-xs font-black text-slate-900">
                    Super Administrator
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Full Control
                  </div>
                </div>

                <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
              </div>

              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

