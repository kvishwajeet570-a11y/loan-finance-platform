"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Info,
  Landmark,
  Lock,
  MoreVertical,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserPlus,
  Wallet,
  X,
} from "lucide-react";

type Category =
  | "All"
  | "Unread"
  | "Urgent"
  | "Loans"
  | "KYC"
  | "Earnings"
  | "Lenders"
  | "Security";

type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  category: string;
  type: "urgent" | "success" | "important" | "action" | "info" | "security";
  unread: boolean;
  action: string;
};

const notifications: Notification[] = [
  {
    id: 1,
    title: "Documents Required",
    description:
      "Personal Loan application #LN-2481 requires 2 additional documents (Income Proof, Bank Statement).",
    time: "12 minutes ago",
    category: "Loans",
    type: "urgent",
    unread: true,
    action: "View Application",
  },
  {
    id: 2,
    title: "Application Approved",
    description:
      "Your customer Rajesh Kumar's Personal Loan application #LN-2460 has been approved by HDFC Bank.",
    time: "45 minutes ago",
    category: "Loans",
    type: "success",
    unread: true,
    action: "View Details",
  },
  {
    id: 3,
    title: "Commission Credited",
    description:
      "₹12,450 commission has been credited to your wallet for application #LN-2438.",
    time: "2 hours ago",
    category: "Earnings",
    type: "important",
    unread: true,
    action: "View Earnings",
  },
  {
    id: 4,
    title: "New Lead Assigned",
    description:
      "A new Home Loan lead has been assigned to you: Priya Sharma (₹35,00,000 - Delhi).",
    time: "4 hours ago",
    category: "Loans",
    type: "action",
    unread: true,
    action: "View Lead",
  },
  {
    id: 5,
    title: "Lender Policy Update",
    description:
      "HDFC Bank has updated its Personal Loan eligibility policy. Please review the new guidelines.",
    time: "6 hours ago",
    category: "Lenders",
    type: "info",
    unread: false,
    action: "View Policy",
  },
  {
    id: 6,
    title: "KYC Verification Pending",
    description:
      "Your PAN verification is pending. Please complete your KYC to avoid service interruption.",
    time: "1 day ago",
    category: "KYC",
    type: "action",
    unread: true,
    action: "Complete KYC",
  },
  {
    id: 7,
    title: "New Login Detected",
    description:
      "New login from Chrome on Windows detected from Patna, Bihar. If this wasn't you, secure your account.",
    time: "1 day ago",
    category: "Security",
    type: "security",
    unread: true,
    action: "View Activity",
  },
  {
    id: 8,
    title: "Monthly Performance Report",
    description:
      "Your September 2026 performance report is now available. You processed 56 applications with 81% approval rate.",
    time: "1 day ago",
    category: "Performance",
    type: "success",
    unread: false,
    action: "View Report",
  },
];

const filters: Category[] = [
  "All",
  "Unread",
  "Urgent",
  "Loans",
  "KYC",
  "Earnings",
  "Lenders",
  "Security",
];

function typeConfig(type: Notification["type"]) {
  switch (type) {
    case "urgent":
      return {
        bg: "bg-red-50",
        iconBg: "bg-red-100",
        text: "text-red-600",
        badge: "bg-red-50 text-red-600 border-red-200",
        Icon: FileText,
        label: "Urgent",
      };
    case "success":
      return {
        bg: "bg-emerald-50/60",
        iconBg: "bg-emerald-100",
        text: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Icon: CheckCircle2,
        label: "Success",
      };
    case "important":
      return {
        bg: "bg-amber-50/70",
        iconBg: "bg-amber-100",
        text: "text-orange-600",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        Icon: Wallet,
        label: "Important",
      };
    case "action":
      return {
        bg: "bg-orange-50/60",
        iconBg: "bg-orange-100",
        text: "text-orange-600",
        badge: "bg-orange-50 text-orange-700 border-orange-200",
        Icon: UserPlus,
        label: "Action Required",
      };
    case "security":
      return {
        bg: "bg-blue-50/60",
        iconBg: "bg-blue-100",
        text: "text-blue-600",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        Icon: Lock,
        label: "Security",
      };
    default:
      return {
        bg: "bg-slate-50",
        iconBg: "bg-blue-50",
        text: "text-blue-600",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        Icon: Landmark,
        label: "Informational",
      };
  }
}

export default function DsaNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [selected, setSelected] = useState<Notification>(notifications[0]);
  const [readIds, setReadIds] = useState<number[]>([5, 8]);
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id)
  ).length;

  const filtered = notifications.filter((notification) => {
    const matchesFilter =
      activeFilter === "All"
        ? true
        : activeFilter === "Unread"
        ? !readIds.includes(notification.id)
        : activeFilter === "Urgent"
        ? notification.type === "urgent"
        : notification.category === activeFilter;

    const matchesSearch =
      notification.title.toLowerCase().includes(search.toLowerCase()) ||
      notification.description.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const markRead = (id: number) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  const markAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  return (
    <main className="min-h-screen bg-[#f7faff] px-4 py-5 md:px-7 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* TOP HEADER */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <span>DSA Portal</span>
              <span>/</span>
              <span className="font-semibold text-slate-600">
                Notifications
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#071a45] md:text-4xl">
              Notification Center
            </h1>

            <p className="mt-1 text-sm text-slate-500 md:text-base">
              Stay updated with your applications, earnings, KYC, lender
              updates and more.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Settings size={17} />
              Notification Settings
            </button>

            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              <Check size={17} />
              Mark All as Read
            </button>
          </div>
        </div>

        {/* SETTINGS PANEL */}
        {showSettings && (
          <div className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  Notification Preferences
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Manage how DSA FinCorp sends important notifications.
                </p>
              </div>

              <button onClick={() => setShowSettings(false)}>
                <X size={19} className="text-slate-400" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {["Loan Updates", "KYC Alerts", "Earnings", "Security"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">
                        {item}
                      </span>
                      <div className="h-6 w-11 rounded-full bg-blue-600 p-1">
                        <div className="ml-auto h-4 w-4 rounded-full bg-white shadow" />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* AI SUMMARY */}
        <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                <Sparkles size={27} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  AI Smart Summary
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Here's what you need to know today.
                </p>
              </div>
            </div>

            {[
              ["7", "Total Notifications", FileText, "blue"],
              ["2", "Require Action", AlertCircle, "red"],
              ["3", "Loan Updates", FileText, "blue"],
              ["2", "Informational", Info, "green"],
            ].map(([value, label, Icon, color]: any) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    color === "red"
                      ? "bg-red-100 text-red-600"
                      : color === "green"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Icon size={19} />
                </div>

                <div>
                  <p className="text-xl font-extrabold text-slate-900">
                    {value}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI ASSISTANT */}
        <section className="mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <Sparkles size={23} />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900">
                  AI Notification Assistant
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  I analyzed your notifications.{" "}
                  <strong>2 items need your immediate attention.</strong>
                </p>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg">
              View Recommendations
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* SEARCH */}
        <div className="mb-4 flex rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search size={19} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications, applications, lenders..."
            className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* FILTERS */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => {
            const count =
              filter === "All"
                ? notifications.length
                : filter === "Unread"
                ? unreadCount
                : filter === "Urgent"
                ? notifications.filter((n) => n.type === "urgent").length
                : notifications.filter((n) => n.category === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                {filter === "All" && "⚡"}
                {filter === "Unread" && "●"}
                {filter === "Urgent" && "!"}
                {filter === "Loans" && "▣"}
                {filter === "KYC" && "◈"}
                {filter === "Earnings" && "₹"}
                {filter === "Lenders" && "⌂"}
                {filter === "Security" && "🔒"}

                {filter}

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeFilter === filter
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">

          {/* NOTIFICATION LIST */}
          <section className="space-y-3">
            {filtered.map((notification) => {
              const config = typeConfig(notification.type);
              const Icon = config.Icon;
              const isUnread = !readIds.includes(notification.id);
              const isSelected = selected.id === notification.id;

              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    setSelected(notification);
                    markRead(notification.id);
                  }}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition md:p-5 ${
                    isSelected
                      ? "border-blue-300 ring-2 ring-blue-100"
                      : "border-slate-200"
                  } ${
                    isUnread
                      ? config.bg
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {isUnread && (
                    <span className="absolute left-2 top-7 h-2.5 w-2.5 rounded-full bg-blue-600" />
                  )}

                  <div className="flex gap-4 pl-2">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.text}`}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-extrabold text-slate-900">
                            {notification.title}
                          </h3>

                          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                            {notification.description}
                          </p>
                        </div>

                        <div className="shrink-0 text-xs font-medium text-slate-400">
                          {notification.time}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${config.badge}`}
                        >
                          {config.label}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(notification);
                              markRead(notification.id);
                            }}
                            className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                          >
                            {notification.action}
                          </button>

                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                          >
                            <MoreVertical size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
                <Bell className="mx-auto text-slate-300" size={40} />
                <h3 className="mt-3 font-bold text-slate-700">
                  No notifications found
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Try another category or search term.
                </p>
              </div>
            )}
          </section>

          {/* RIGHT DETAIL PANEL */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Notification Details
                </h2>

                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              {(() => {
                const config = typeConfig(selected.type);
                const Icon = config.Icon;

                return (
                  <>
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.text}`}
                      >
                        <Icon size={22} />
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900">
                          {selected.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                          <span>{selected.time}</span>
                          <span>•</span>
                          <span>08 Oct 2026</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-sm leading-6 text-slate-600">
                      <p>Hi DSA Agent,</p>
                      <p className="mt-3">{selected.description}</p>
                    </div>

                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                      <p className="text-sm font-extrabold text-red-800">
                        Missing Documents:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-red-700">
                        <li>• Income Proof (Last 3 months)</li>
                        <li>• Bank Statement (Last 6 months)</li>
                      </ul>
                    </div>

                    <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700">
                      {selected.action}
                      <ArrowRight size={17} />
                    </button>

                    <button
                      onClick={() => markRead(selected.id)}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <Check size={17} />
                      Mark as Read
                    </button>
                  </>
                );
              })()}
            </div>

            {/* RELATED APPLICATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-extrabold text-slate-900">
                Related Application
              </h2>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={19} />
                  </div>

                  <span className="font-extrabold text-blue-700">
                    LN-2481
                  </span>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                  Documents Pending
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                {[
                  ["Customer Name", "Amit Kumar"],
                  ["Loan Type", "Personal Loan"],
                  ["Loan Amount", "₹5,00,000"],
                  ["Lender", "ICICI Bank"],
                  ["Applied On", "07 Oct 2026"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-3 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <span className="text-slate-400">{label}</span>
                    <span className="font-bold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-bold text-blue-600">
                Open Application
                <ArrowRight size={16} />
              </button>
            </div>

            {/* NOTIFICATION HEALTH */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp size={19} />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900">
                    Notification Health
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your notification response
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">
                    Read Rate
                  </span>
                  <span className="font-extrabold text-slate-900">
                    86%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
