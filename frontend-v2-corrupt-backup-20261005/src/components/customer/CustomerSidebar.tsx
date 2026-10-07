"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Award,
  Bell,
  Building2,
  Car,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  FileText,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";

type ChildItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: ChildItem[];
};

type Section = {
  title: string;
  items: MenuItem[];
};

const sections: Section[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/customer/dashboard",
        icon: <LayoutDashboard size={18} />,
      },
    ],
  },

  {
    title: "FINANCE",
    items: [
      {
        label: "Loans",
        icon: <CreditCard size={18} />,
        children: [
          { label: "Apply Loan", href: "/apply" },
          { label: "My Loans", href: "/customer/loans" },
          { label: "Loan Status", href: "/customer/loans/status" },
        ],
      },
      {
        label: "Bank Accounts",
        icon: <Building2 size={18} />,
        children: [
          { label: "My Accounts", href: "/customer/bank-accounts" },
          { label: "Add Account", href: "/customer/bank-accounts/add" },
        ],
      },
      {
        label: "Wallet",
        icon: <Wallet size={18} />,
        children: [
          { label: "Balance", href: "/customer/wallet" },
          { label: "Transactions", href: "/customer/wallet/transactions" },
          { label: "Statement", href: "/customer/wallet/statement" },
        ],
      },
      {
        label: "Recharge",
        icon: <Receipt size={18} />,
        children: [
          { label: "Mobile Recharge", href: "/customer/recharge/mobile" },
          { label: "DTH Recharge", href: "/customer/recharge/dth" },
          { label: "FASTag Recharge", href: "/customer/recharge/fastag" },
          { label: "Recharge History", href: "/customer/recharge/history" },
        ],
      },
      {
        label: "Transactions",
        icon: <Activity size={18} />,
        children: [
          { label: "All Transactions", href: "/customer/transactions" },
          { label: "Credit", href: "/customer/transactions/credit" },
          { label: "Debit", href: "/customer/transactions/debit" },
        ],
      },
    ],
  },

  {
    title: "SERVICES",
    items: [
      {
        label: "KYC",
        icon: <ShieldCheck size={18} />,
        children: [
          { label: "My KYC", href: "/customer/kyc" },
          { label: "KYC Status", href: "/customer/kyc/status" },
        ],
      },
      {
        label: "Documents",
        icon: <FileText size={18} />,
        children: [
          { label: "My Documents", href: "/customer/documents" },
          { label: "Upload Document", href: "/customer/documents/upload" },
        ],
      },
      {
        label: "Credit Score",
        icon: <CreditCard size={18} />,
        children: [
          { label: "My Score", href: "/customer/credit-score" },
          { label: "Score History", href: "/customer/credit-score/history" },
          {
            label: "Loan Eligibility",
            href: "/customer/credit-score/eligibility",
          },
        ],
      },
      {
        label: "FASTag",
        icon: <Car size={18} />,
        children: [
          { label: "My FASTags", href: "/customer/fastag" },
          { label: "Add FASTag", href: "/customer/fastag/add" },
          { label: "FASTag Details", href: "/customer/fastag/details" },
        ],
      },
    ],
  },

  {
    title: "REWARDS",
    items: [
      {
        label: "Referrals",
        icon: <Users size={18} />,
        children: [
          { label: "My Referrals", href: "/customer/referrals" },
          { label: "Referral History", href: "/customer/referrals/history" },
          { label: "Rewards", href: "/customer/referrals/rewards" },
        ],
      },
      {
        label: "Earnings",
        icon: <IndianRupee size={18} />,
        children: [
          { label: "My Commissions", href: "/customer/earnings" },
          { label: "Commission History", href: "/customer/earnings/history" },
        ],
      },
      {
        label: "Achievements",
        href: "/customer/achievements",
        icon: <Award size={18} />,
      },
    ],
  },

  {
    title: "ACCOUNT",
    items: [
      {
        label: "Notifications",
        href: "/customer/notifications",
        icon: <Bell size={18} />,
      },
      {
        label: "Support",
        icon: <Ticket size={18} />,
        children: [
          { label: "Create Ticket", href: "/customer/support/create" },
          { label: "My Tickets", href: "/customer/support" },
        ],
      },
      {
        label: "Profile",
        icon: <User size={18} />,
        children: [
          { label: "My Profile", href: "/customer/profile" },
          { label: "Security", href: "/customer/profile/security" },
        ],
      },
    ],
  },
];

interface CustomerSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function CustomerSidebar({
  collapsed,
  setCollapsed,
}: CustomerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("Customer");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("loan_finance_user");

      if (raw) {
        const user = JSON.parse(raw);

        if (user?.name) {
          setCustomerName(user.name);
        }

        if (user?.email) {
          setCustomerEmail(user.email);
        }
      }
    } catch {
      // Ignore invalid localStorage data.
    }
  }, []);

  const isActive = (href?: string) => {
    if (!href) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isParentActive = (item: MenuItem) => {
    return (
      isActive(item.href) ||
      Boolean(item.children?.some((child) => isActive(child.href)))
    );
  };

  const filteredSections = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return sections;
    }

    return sections
      .map((section) => {
        const items = section.items
          .map((item) => {
            const itemMatches = item.label.toLowerCase().includes(keyword);

            if (itemMatches) {
              return item;
            }

            const matchingChildren = item.children?.filter((child) =>
              child.label.toLowerCase().includes(keyword)
            );

            if (matchingChildren && matchingChildren.length > 0) {
              return {
                ...item,
                children: matchingChildren,
              };
            }

            return null;
          })
          .filter(Boolean) as MenuItem[];

        return {
          ...section,
          items,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [search]);

  useEffect(() => {
    if (search.trim()) {
      const firstWithChildren = filteredSections
        .flatMap((section) => section.items)
        .find((item) => item.children);

      if (firstWithChildren) {
        setOpenMenu(firstWithChildren.label);
      }
    }
  }, [search, filteredSections]);

  const logout = () => {
    localStorage.removeItem("loan_finance_token");
    localStorage.removeItem("loan_finance_user");
    router.replace("/login");
  };

  const getInitial = () => {
    return customerName.trim().charAt(0).toUpperCase() || "C";
  };

  const handleMenuClick = (item: MenuItem) => {
    if (!item.children) {
      setMobileOpen(false);
      return;
    }

    if (collapsed) {
      setCollapsed(false);
      setOpenMenu(item.label);
      return;
    }

    setOpenMenu((current) =>
      current === item.label ? null : item.label
    );
  };

  const handleChildClick = () => {
    setMobileOpen(false);
  };

  const renderNavigation = () => (
    <nav className="space-y-5">
      {filteredSections.map((section) => (
        <div key={section.title}>
          {!collapsed && (
            <div className="mb-2 flex items-center gap-2 px-2">
              <span className="whitespace-nowrap text-[9px] font-extrabold tracking-[0.18em] text-slate-400">
                {section.title}
              </span>

              <span className="h-px flex-1 bg-slate-100" />
            </div>
          )}

          {collapsed && (
            <div className="mx-auto mb-2 h-px w-8 bg-slate-100" />
          )}

          <div className="space-y-1">
            {section.items.map((item) => {
              const active = isParentActive(item);
              const expanded = active || openMenu === item.label;

              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                      collapsed
                        ? "justify-center px-2 py-2.5"
                        : "gap-3 px-3 py-2.5"
                    } ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                    )}

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-600"
                      }`}
                    >
                      {item.icon}
                    </span>

                    {!collapsed && (
                      <span className="truncate text-[13px] font-semibold">
                        {item.label}
                      </span>
                    )}

                    {!collapsed && item.label === "Notifications" && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[9px] font-black text-white">
                        3
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    title={collapsed ? item.label : undefined}
                    onClick={() => handleMenuClick(item)}
                    className={`group relative flex w-full items-center rounded-xl transition-all duration-200 ${
                      collapsed
                        ? "justify-center px-2 py-2.5"
                        : "justify-between px-3 py-2.5"
                    } ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                    )}

                    <span
                      className={`flex items-center ${
                        collapsed ? "" : "gap-3"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                          active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-600"
                        }`}
                      >
                        {item.icon}
                      </span>

                      {!collapsed && (
                        <span className="text-[13px] font-semibold">
                          {item.label}
                        </span>
                      )}
                    </span>

                    {!collapsed && (
                      <span
                        className={`transition ${
                          expanded ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {expanded ? (
                          <ChevronDown size={15} />
                        ) : (
                          <ChevronRight size={15} />
                        )}
                      </span>
                    )}
                  </button>

                  {!collapsed && expanded && (
                    <div className="ml-7 mt-1.5 border-l border-slate-200 pl-4">
                      <div className="space-y-0.5">
                        {item.children.map((child) => {
                          const childActive = isActive(child.href);

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={handleChildClick}
                              className={`relative flex items-center rounded-lg px-3 py-2 text-[11px] font-medium transition-all ${
                                childActive
                                  ? "bg-blue-600 font-semibold text-white shadow-sm shadow-blue-100"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                              }`}
                            >
                              {childActive && (
                                <span className="absolute -left-[19px] h-2 w-2 rounded-full bg-blue-600 ring-4 ring-white" />
                              )}

                              <span>{child.label}</span>

                              {!childActive && (
                                <ChevronRight
                                  size={11}
                                  className="ml-auto text-slate-300"
                                />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredSections.length === 0 && (
        <div className="px-2 py-8 text-center">
          <Search
            size={22}
            className="mx-auto mb-2 text-slate-300"
          />

          {!collapsed && (
            <p className="text-xs font-semibold text-slate-400">
              No menu found
            </p>
          )}
        </div>
      )}
    </nav>
  );

  const renderSidebarContent = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="shrink-0 border-b border-slate-100 px-4 py-4">
        <div
          className={`flex items-center ${
            collapsed && !mobile
              ? "justify-center"
              : "gap-3"
          }`}
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100">
            <IndianRupee size={22} strokeWidth={2.5} />

            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          {(!collapsed || mobile) && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-extrabold tracking-tight text-[#06295c]">
                India Loan Finance
              </div>

              <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-600">
                Customer Panel
              </div>
            </div>
          )}

          {mobile && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {(!collapsed || mobile) && (
        <div className="shrink-0 px-4 pb-3 pt-4">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
            <Search
              size={16}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="min-w-0 flex-1 bg-transparent text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Loan */}
      {(!collapsed || mobile) && (
        <div className="shrink-0 px-4 pb-4">
          <Link
            href="/apply"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2.5 text-white shadow-md shadow-blue-100 transition hover:shadow-lg hover:shadow-blue-200"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <Sparkles size={15} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-extrabold">
                Apply for a Loan
              </span>

              <span className="block text-[9px] font-medium text-blue-100">
                Start a new application
              </span>
            </span>

            <ChevronRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {renderNavigation()}
      </div>

      {/* Customer Footer */}
      <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 p-3">
        {(!collapsed || mobile) && (
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-extrabold text-white">
                {getInitial()}
              </div>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-bold text-slate-800">
                {customerName}
              </div>

              <div className="truncate text-[9px] text-slate-400">
                {customerEmail || "Customer Account"}
              </div>
            </div>

            <span className="text-[8px] font-bold text-emerald-600">
              Online
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          title={collapsed && !mobile ? "Logout" : undefined}
          className={`group flex w-full items-center rounded-xl py-2.5 text-[12px] font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600 ${
            collapsed && !mobile
              ? "justify-center px-2"
              : "gap-3 px-2"
          }`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-red-100 group-hover:text-red-600">
            <LogOut size={16} />
          </span>

          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden border-r border-slate-200 bg-white shadow-[4px_0_20px_rgba(15,23,42,0.04)] transition-all duration-300 lg:block ${
          collapsed ? "w-[88px]" : "w-72"
        }`}
      >
        {renderSidebarContent({ mobile: false })}

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:border-blue-200 hover:text-blue-600"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight size={14} />
          ) : (
            <ChevronsLeft size={14} />
          )}
        </button>
      </aside>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-200 transition hover:scale-105 lg:hidden"
        aria-label="Open customer menu"
      >
        <Menu size={21} />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="fixed inset-y-0 left-0 z-[60] w-80 max-w-[88vw] bg-white shadow-2xl lg:hidden">
            {renderSidebarContent({ mobile: true })}
          </aside>
        </>
      )}
    </>
  );
}

