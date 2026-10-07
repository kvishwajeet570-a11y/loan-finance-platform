"use client";

import { useEffect, useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";
import {
 Bell,
 Search,
 CheckCheck,
 Settings,
 SlidersHorizontal,
 FileText,
 ShieldCheck,
 IndianRupee,
 Users,
 Megaphone,
 Info,
 Trophy,
 GraduationCap,
 ChevronRight,
 Loader2,
 Archive,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Notification = {
 id: string;
 title: string;
 message: string;
 type?: string;
 channel?: string;
 priority?: string;
 isRead?: boolean;
 isArchived?: boolean;
 createdAt?: string;
 readAt?: string | null;
};

const typeMeta: Record<string, any> = {
 APPLICATION: {
 label: "Application",
 icon: FileText,
 cls: "bg-blue-50 text-blue-700",
 },
 KYC: {
 label: "KYC",
 icon: ShieldCheck,
 cls: "bg-amber-50 text-amber-700",
 },
 PAYMENT: {
 label: "Payment",
 icon: IndianRupee,
 cls: "bg-violet-50 text-violet-700",
 },
 COMMISSION: {
 label: "Commission",
 icon: IndianRupee,
 cls: "bg-violet-50 text-violet-700",
 },
 LEAD: {
 label: "Lead",
 icon: Users,
 cls: "bg-cyan-50 text-cyan-700",
 },
 IMPORTANT: {
 label: "Important",
 icon: Megaphone,
 cls: "bg-red-50 text-red-700",
 },
 SYSTEM: {
 label: "System",
 icon: Info,
 cls: "bg-slate-100 text-slate-700",
 },
 ACHIEVEMENT: {
 label: "Achievement",
 icon: Trophy,
 cls: "bg-emerald-50 text-emerald-700",
 },
 TRAINING: {
 label: "Training",
 icon: GraduationCap,
 cls: "bg-purple-50 text-purple-700",
 },
};

function normalize(raw: any): Notification[] {
 const data = raw?.data ?? raw?.notifications ?? raw;

 if (Array.isArray(data)) return data;

 if (Array.isArray(data?.notifications)) return data.notifications;
 if (Array.isArray(data?.rows)) return data.rows;
 if (Array.isArray(data?.items)) return data.items;
 if (Array.isArray(data?.results)) return data.results;

 return [];
}

function getMeta(type?: string) {
 const key = String(type || "SYSTEM").toUpperCase();
 return (
 typeMeta[key] || {
 label: type || "System",
 icon: Bell,
 cls: "bg-slate-100 text-slate-700",
 }
 );
}

function timeAgo(date?: string) {
 if (!date) return "";

 const diff = Date.now() - new Date(date).getTime();

 if (Number.isNaN(diff)) return "";

 const mins = Math.floor(diff / 60000);
 if (mins < 1) return "Just now";
 if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;

 const hours = Math.floor(mins / 60);
 if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

 const days = Math.floor(hours / 24);
 if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

 return new Date(date).toLocaleDateString("en-IN", {
 day: "2-digit",
 month: "short",
 year: "numeric",
 });
}

export default function DsaNotificationsPage() {
 const [notifications, setNotifications] = useState<Notification[]>([]);
 const [tab, setTab] = useState("ALL");
 const [search, setSearch] = useState("");
 const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
 const [dateFilter, setDateFilter] = useState("ALL");
 const [loading, setLoading] = useState(true);
 const [actionId, setActionId] = useState<string | null>(null);
 const [error, setError] = useState("");

 const getAuth = (): {
 user: any;
 headers: Record<string, string>;
 } => {
 const raw = localStorage.getItem("loan_finance_user");
 const user = raw ? JSON.parse(raw) : null;
 const token = localStorage.getItem("loan_finance_token");

 const headers: Record<string, string> = {};

 if (token) {
 headers["Authorization"] = `Bearer ${token}`;
 }

 return {
 user,
 headers,
 };
 };

 const loadNotifications = async () => {
 try {
 setLoading(true);
 setError("");

 const { user, headers } = getAuth();

 if (!user?.id) {
 setError("DSA user session not found.");
 return;
 }

 const response = await fetch(
 `${API}/notification/user/${user.id}`,
 { headers }
 );

 const json = await response.json();

 if (!response.ok) {
 throw new Error(
 json?.message || "Unable to load notifications."
 );
 }

 setNotifications(normalize(json));
 } catch (err: any) {
 setError(err?.message || "Unable to load notifications.");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadNotifications();
 }, []);

 const unreadCount = useMemo(
 () => notifications.filter((n) => !n.isRead && !n.readAt).length,
 [notifications]
 );

 const importantCount = useMemo(
 () =>
 notifications.filter(
 (n) =>
 String(n.type || "").toUpperCase() === "IMPORTANT" ||
 String(n.priority || "").toUpperCase() === "HIGH"
 ).length,
 [notifications]
 );

 const typeCounts = useMemo(() => {
 const map: Record<string, number> = {};

 notifications.forEach((n) => {
 const type = String(n.type || "SYSTEM").toUpperCase();
 map[type] = (map[type] || 0) + 1;
 });

 return map;
 }, [notifications]);

 const filtered = useMemo(() => {
 const q = search.trim().toLowerCase();

 return notifications.filter((n) => {
 const type = String(n.type || "SYSTEM").toUpperCase();

 const matchesTab =
 tab === "ALL" ||
 (tab === "UNREAD" && !n.isRead && !n.readAt) ||
 (tab === "IMPORTANT" &&
 (type === "IMPORTANT" ||
 String(n.priority || "").toUpperCase() === "HIGH")) ||
 (tab === "APPLICATION" && type === "APPLICATION") ||
 (tab === "KYC" && type === "KYC") ||
 (tab === "PAYMENT" &&
 (type === "PAYMENT" || type === "COMMISSION"));

 const matchesSearch =
 !q ||
 `${n.title} ${n.message} ${n.type || ""}`
 .toLowerCase()
 .includes(q);

 const matchesType =
 selectedTypes.length === 0 || selectedTypes.includes(type);

 return matchesTab && matchesSearch && matchesType;
 });
 }, [notifications, tab, search, selectedTypes, dateFilter]);

 const markAllRead = async () => {
 try {
 const { user, headers } = getAuth();
 if (!user?.id) return;

 setActionId("all");

 const response = await fetch(
 `${API}/notification/user/${user.id}/read-all`,
 {
 method: "PATCH",
 headers: {
 ...headers,
 "Content-Type": "application/json",
 },
 }
 );

 if (!response.ok) {
 const json = await response.json().catch(() => ({}));
 throw new Error(json?.message || "Unable to mark notifications.");
 }

 setNotifications((prev) =>
 prev.map((n) => ({
 ...n,
 isRead: true,
 readAt: new Date().toISOString(),
 }))
 );
 } catch (err: any) {
 setError(err?.message || "Unable to mark all as read.");
 } finally {
 setActionId(null);
 }
 };

 const markRead = async (id: string) => {
 try {
 const { headers } = getAuth();

 setActionId(id);

 const response = await fetch(
 `${API}/notification/${id}/read`,
 {
 method: "PATCH",
 headers: {
 ...headers,
 "Content-Type": "application/json",
 },
 }
 );

 if (!response.ok) {
 const json = await response.json().catch(() => ({}));
 throw new Error(json?.message || "Unable to update notification.");
 }

 setNotifications((prev) =>
 prev.map((n) =>
 n.id === id
 ? {
 ...n,
 isRead: true,
 readAt: new Date().toISOString(),
 }
 : n
 )
 );
 } catch (err: any) {
 setError(err?.message || "Unable to update notification.");
 } finally {
 setActionId(null);
 }
 };

 const toggleType = (type: string) => {
 setSelectedTypes((prev) =>
 prev.includes(type)
 ? prev.filter((x) => x !== type)
 : [...prev, type]
 );
 };

 const tabs = [
 ["ALL", "All", notifications.length],
 ["UNREAD", "Unread", unreadCount],
 ["IMPORTANT", "Important", importantCount],
 ["APPLICATION", "Application", typeCounts.APPLICATION || 0],
 ["KYC", "KYC", typeCounts.KYC || 0],
 [
 "PAYMENT",
 "Payment",
 (typeCounts.PAYMENT || 0) + (typeCounts.COMMISSION || 0),
 ],
 ];

 const availableTypes = Object.keys(typeCounts).filter(
 (type) => typeCounts[type] > 0
 );

 return (
 <DsaShell>
 <div className="min-h-screen bg-[#f4f8fc]">
 <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur md:px-8">
 <div className="relative w-full max-w-[400px]">
 <Search
 size={18}
 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
 />
 <input
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search notifications..."
 className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
 />
 </div>

 <div className="ml-4 flex items-center gap-3">
 <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600">
 <Bell size={18} />
 {unreadCount > 0 && (
 <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
 {unreadCount > 99 ? "99+" : unreadCount}
 </span>
 )}
 </div>

 <div className="hidden text-right sm:block">
 <div className="text-sm font-bold text-slate-900">
 DSA Partner
 </div>
 <div className="text-[11px] font-semibold text-slate-400">
 Partner Portal
 </div>
 </div>

 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-black text-white">
 D
 </div>
 </div>
 </header>

 <main className="px-5 py-7 md:px-8 xl:px-10">
 <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
 <div className="flex items-center gap-4">
 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
 <Bell size={27} />
 </div>

 <div>
 <h1 className="text-[32px] font-black tracking-tight text-slate-900">
 Notifications
 </h1>
 <p className="mt-1 text-sm font-medium text-slate-500">
 Stay updated with your latest alerts and important information.
 </p>
 </div>
 </div>

 <button
 onClick={markAllRead}
 disabled={actionId === "all" || unreadCount === 0}
 className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {actionId === "all" ? (
 <Loader2 size={17} className="animate-spin" />
 ) : (
 <CheckCheck size={17} />
 )}
 Mark All as Read
 </button>
 </div>

 {error && (
 <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
 {error}
 </div>
 )}

 <div className="mb-5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
 <div className="flex min-w-max">
 {tabs.map(([key, label, count]) => (
 <button
 key={key}
 onClick={() => setTab(String(key))}
 className={`relative flex items-center gap-2 px-5 py-4 text-sm font-bold transition ${
 tab === key
 ? "text-blue-700"
 : "text-slate-500 hover:text-slate-800"
 }`}
 >
 {label}

 <span
 className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
 tab === key
 ? "bg-blue-100 text-blue-700"
 : "bg-slate-100 text-slate-500"
 }`}
 >
 {count}
 </span>

 {tab === key && (
 <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-600" />
 )}
 </button>
 ))}
 </div>
 </div>

 <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
 <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
 {loading ? (
 <div className="flex min-h-[420px] items-center justify-center">
 <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
 <Loader2 size={20} className="animate-spin text-blue-600" />
 Loading notifications...
 </div>
 </div>
 ) : filtered.length === 0 ? (
 <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
 <Bell size={28} />
 </div>
 <h3 className="mt-4 text-lg font-black text-slate-900">
 No notifications found
 </h3>
 <p className="mt-1 max-w-sm text-sm font-medium text-slate-500">
 There are no notifications matching your current filters.
 </p>
 </div>
 ) : (
 filtered.map((notification) => {
 const meta = getMeta(notification.type);
 const Icon = meta.icon;
 const unread = !notification.isRead && !notification.readAt;

 return (
 <div
 key={notification.id}
 className={`group flex gap-4 border-b border-slate-100 px-5 py-5 transition hover:bg-slate-50/70 md:px-6 ${
 unread ? "bg-blue-50/20" : "bg-white"
 }`}
 >
 <div className="flex shrink-0 items-start pt-1">
 <span
 className={`h-2.5 w-2.5 rounded-full ${
 unread ? "bg-blue-600" : "border-2 border-slate-300 bg-white"
 }`}
 />
 </div>

 <div
 className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${meta.cls}`}
 >
 <Icon size={20} />
 </div>

 <div className="min-w-0 flex-1">
 <div className="flex flex-wrap items-start justify-between gap-2">
 <div>
 <h3
 className={`text-[15px] ${
 unread
 ? "font-black text-slate-900"
 : "font-bold text-slate-800"
 }`}
 >
 {notification.title}
 </h3>

 <p className="mt-1 text-sm leading-6 text-slate-500">
 {notification.message}
 </p>

 <div className="mt-1.5 text-[11px] font-semibold text-slate-400">
 {timeAgo(notification.createdAt)}
 </div>
 </div>

 <div className="flex items-center gap-2">
 <span
 className={`rounded-full px-3 py-1 text-[10px] font-black ${meta.cls}`}
 >
 {meta.label}
 </span>

 {unread && (
 <button
 onClick={() => markRead(notification.id)}
 disabled={actionId === notification.id}
 className="hidden rounded-lg px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 group-hover:block"
 >
 {actionId === notification.id
 ? "..."
 : "Mark read"}
 </button>
 )}

 <ChevronRight
 size={18}
 className="text-slate-300"
 />
 </div>
 </div>
 </div>
 </div>
 );
 })
 )}
 </section>

 <aside className="space-y-5">
 <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
 <div className="flex items-start gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
 <Settings size={19} />
 </div>

 <div>
 <h3 className="text-sm font-black text-slate-900">
 Notification Preferences
 </h3>
 <p className="mt-1 text-xs leading-5 text-slate-500">
 Manage how you receive notifications.
 </p>
 </div>
 </div>

 <button className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100">
 Manage Preferences
 </button>
 </div>

 <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <SlidersHorizontal size={18} className="text-slate-600" />
 <h3 className="text-sm font-black text-slate-900">
 Filter by Type
 </h3>
 </div>

 <div className="space-y-3">
 {availableTypes.length === 0 ? (
 <p className="text-xs font-medium text-slate-400">
 No notification types available.
 </p>
 ) : (
 availableTypes.map((type) => (
 <label
 key={type}
 className="flex cursor-pointer items-center gap-3 text-xs font-semibold text-slate-600"
 >
 <input
 type="checkbox"
 checked={selectedTypes.includes(type)}
 onChange={() => toggleType(type)}
 className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
 />

 <span className="flex-1">
 {getMeta(type).label}
 </span>

 <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500">
 {typeCounts[type]}
 </span>
 </label>
 ))
 )}
 </div>
 </div>

 <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
 <div className="mb-4 flex items-center gap-2">
 <Archive size={18} className="text-slate-600" />
 <h3 className="text-sm font-black text-slate-900">
 Notification Summary
 </h3>
 </div>

 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-slate-500">
 Total
 </span>
 <span className="text-sm font-black text-slate-900">
 {notifications.length}
 </span>
 </div>

 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-slate-500">
 Unread
 </span>
 <span className="text-sm font-black text-blue-600">
 {unreadCount}
 </span>
 </div>

 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-slate-500">
 Important
 </span>
 <span className="text-sm font-black text-red-600">
 {importantCount}
 </span>
 </div>
 </div>
 </div>
 </aside>
 </div>
 </main>
 </div>
 </DsaShell>
 );
}





