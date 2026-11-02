"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell, CheckCheck, RefreshCw, Inbox, Clock3, Sparkles,
  Heart, CalendarDays, Users, Wallet, FileText, ShieldCheck,
  Info, AlertTriangle, Send, Mail, ChevronRight, PartyPopper, Share2, Trash2, X, Calendar, Eye, Copy
} from "lucide-react";

type Notice = {
  id: string;
  title: string;
  message: string;
  type?: string | null;
  isRead: boolean;
  createdAt: string;
  priority?: string | null;
  channel?: string | null;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  items?: Notice[];
};

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function getIcon(type?: string | null) {
  const value = (type || "").toLowerCase();
  if (value.includes("referral")) return Users;
  if (value.includes("loan")) return FileText;
  if (value.includes("wallet") || value.includes("payment") || value.includes("commission")) return Wallet;
  if (value.includes("kyc") || value.includes("security")) return ShieldCheck;
  if (value.includes("alert") || value.includes("urgent")) return AlertTriangle;
  if (value.includes("email")) return Mail;
  return Info;
}

export default function CustomerNotificationsPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState<string[]>([]);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [detailItem, setDetailItem] = useState<Notice | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("loan_finance_token");
      if (!token) {
        setItems([]);
        setError("Your session was not found. Please sign in again.");
        return;
      }

      const response = await fetch(`${API}/profile/notifications`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        cache: "no-store"
      });

      if (response.status === 401 || response.status === 403) {
        setItems([]);
        setError("Your session has expired or access is denied. Please sign in again.");
        return;
      }

      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load your notifications.");
      }
      setItems(Array.isArray(result.items) ? result.items : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load notifications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const markOneRead = useCallback(async (id: string) => {
    if (markingId || markingAll) return;
    const token = localStorage.getItem("loan_finance_token");
    if (!token) {
      setActionError("Session not found. Please sign in again.");
      return;
    }

    setMarkingId(id);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(
        `${API}/profile/notifications/${encodeURIComponent(id)}/read`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not mark this notification as read.");
      }

      setItems(current => current.map(item =>
        item.id === id ? { ...item, isRead: true } : item
      ));
      setActionSuccess("Notification marked as read.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not update notification.");
    } finally {
      setMarkingId(null);
    }
  }, [markingId, markingAll]);

  const markAllRead = useCallback(async () => {
    if (markingAll || markingId || unread === 0) return;
    const token = localStorage.getItem("loan_finance_token");
    if (!token) {
      setActionError("Session not found. Please sign in again.");
      return;
    }

    setMarkingAll(true);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(`${API}/profile/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not mark notifications as read.");
      }

      setItems(current => current.map(item => ({ ...item, isRead: true })));
      setActionSuccess(
        `All notifications marked as read (${result.updatedCount ?? unread} updated).`
      );
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not update notifications.");
    } finally {
      setMarkingAll(false);
    }
  }, [markingAll, markingId, items]);

  const shareNotification = useCallback(async (item: Notice) => {
    const text = `${item.title}\n${item.message}\nDate: ${formatDate(item.createdAt)}`;
    setActionError("");
    setActionSuccess("");
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: item.title, text });
        setActionSuccess("Share sheet opened.");
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setActionSuccess("Notification details copied. You can paste them anywhere.");
      } else {
        throw new Error("Sharing is unavailable in this browser. Please copy the notification manually.");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setActionError(e instanceof Error ? e.message : "Unable to share notification.");
    }
  }, []);

  const copyNotification = useCallback(async (item: Notice) => {
    const text = `${item.title}\n${item.message}\nDate: ${formatDate(item.createdAt)}\nStatus: ${item.isRead ? "Read" : "Unread"}`;
    try {
      await navigator.clipboard.writeText(text);
      setActionError("");
      setActionSuccess("Notification details copied to clipboard.");
    } catch {
      setActionError("Clipboard access is unavailable. Try Share instead.");
    }
  }, []);

  const deleteNotification = useCallback(async (item: Notice) => {
    const confirmed = window.confirm(`Delete this notification?\n\n"${item.title}"\n\nThis action cannot be undone.`);
    if (!confirmed) return;

    const token = localStorage.getItem("loan_finance_token");
    if (!token) {
      setActionError("Session not found. Please sign in again.");
      return;
    }

    setDeletingId(item.id);
    setActionError("");
    setActionSuccess("");
    try {
      const response = await fetch(
        `${API}/profile/notifications/${encodeURIComponent(item.id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not delete this notification.");
      }

      setItems(current => current.filter(n => n.id !== item.id));
      setLiked(current => current.filter(id => id !== item.id));
      setDetailItem(current => current?.id === item.id ? null : current);
      setActionSuccess("Notification deleted successfully.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not delete notification.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const unread = useMemo(() => items.filter(n => !n.isRead).length, [items]);
  const shown = useMemo(() => {
    return items.filter(n => {
      if (filter === "unread" && n.isRead) return false;
      if (filter === "read" && !n.isRead) return false;
      if (dateFilter) {
        const date = new Date(n.createdAt);
        if (Number.isNaN(date.getTime())) return false;
        const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        if (localDate !== dateFilter) return false;
      }
      return true;
    });
  }, [items, filter, dateFilter]);

  const latest = items.length
    ? items.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b)
    : null;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_#e0f2fe_0%,_#f8faff_38%,_#fff1f8_100%)] px-3 py-5 text-slate-900 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-5 sm:space-y-6">

        {/* Premium pastel notification banner */}
        <section className="relative isolate min-h-[245px] overflow-hidden rounded-[30px] border border-white/90 bg-gradient-to-br from-white via-sky-50 to-fuchsia-100 px-5 py-7 shadow-[0_20px_60px_-25px_rgba(99,102,241,.30)] sm:px-9 sm:py-9 lg:min-h-[265px]">
          <div className="absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
          <div className="absolute right-[18%] top-12 -z-10 h-48 w-48 rounded-full bg-pink-300/40 blur-3xl" />
          <div className="absolute bottom-[-100px] right-1/3 -z-10 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />

          <div className="relative z-10 max-w-[65%] sm:max-w-[62%]">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/75 px-3 py-2 text-[10px] font-extrabold tracking-[.13em] text-indigo-800 shadow-sm sm:text-xs">
              <Bell className="h-4 w-4" /> CUSTOMER NOTIFICATION CENTER
            </span>
            <h1 className="mt-5 text-3xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Your <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">Notifications</span>
              <Heart className="ml-2 inline h-6 w-6 fill-pink-400 text-pink-400 sm:h-8 sm:w-8" />
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Stay informed about your account, loan updates and important activity.
            </p>
            <p className="mt-1 text-sm font-medium text-indigo-700/80">
              All your latest updates, together in one place.
            </p>
          </div>

          {/* Decorative illustration built from real UI icons */}
          <div className="pointer-events-none absolute bottom-0 right-1 top-0 flex w-[42%] items-center justify-center sm:right-5 sm:w-[39%]">
            <div className="absolute right-[12%] top-[17%] text-pink-400">
              <Sparkles className="h-6 w-6 sm:h-9 sm:w-9" />
            </div>
            <div className="absolute bottom-[18%] left-[8%] text-violet-400">
              <Sparkles className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <div className="absolute right-[7%] top-[54%] rotate-12 text-sky-500">
              <Send className="h-7 w-7 sm:h-10 sm:w-10" />
            </div>
            <div className="relative flex h-28 w-28 rotate-[-7deg] items-center justify-center rounded-[30px] border border-white/90 bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-600 shadow-[0_22px_45px_-12px_rgba(79,70,229,.50)] sm:h-40 sm:w-40 sm:rounded-[40px]">
              <div className="absolute inset-3 rounded-[23px] border border-white/30 bg-white/10 sm:rounded-[32px]" />
              <div className="relative flex h-[72%] w-[67%] flex-col items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/95 shadow-xl sm:gap-3 sm:rounded-3xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Bell className="h-5 w-5 sm:h-8 sm:w-8" />
                </div>
                <div className="h-1.5 w-[65%] rounded-full bg-indigo-200" />
                <div className="h-1.5 w-[45%] rounded-full bg-pink-200" />
                <div className="h-1.5 w-[55%] rounded-full bg-sky-200" />
              </div>
              <div className="absolute -right-5 -top-5 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br from-orange-300 to-pink-500 text-white shadow-xl sm:-right-7 sm:-top-7 sm:h-[68px] sm:w-[68px] sm:rounded-3xl">
                <Bell className="h-6 w-6 sm:h-9 sm:w-9" />
              </div>
              <div className="absolute -bottom-4 -left-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-pink-100 text-pink-500 shadow-lg sm:-bottom-5 sm:-left-6 sm:h-14 sm:w-14">
                <Heart className="h-5 w-5 fill-pink-400 sm:h-7 sm:w-7" />
              </div>
            </div>
            <div className="absolute bottom-5 right-1 hidden rotate-[-7deg] text-right font-serif text-lg italic leading-tight text-violet-600 sm:block lg:text-2xl">
              Good things<br />keep you updated
              <Heart className="ml-1 inline h-4 w-4 fill-pink-400 text-pink-400" />
            </div>
          </div>
        </section>

        {/* Live-data summary cards */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {[
            { title: "Total Updates", value: items.length, sub: "From your account", icon: Inbox, color: "sky", bg: "from-sky-50 to-blue-50" },
            { title: "Unread", value: unread, sub: "New updates", icon: Bell, color: "orange", bg: "from-orange-50 to-rose-50" },
            { title: "Read", value: items.length - unread, sub: "Previous updates", icon: CheckCheck, color: "emerald", bg: "from-emerald-50 to-teal-50" },
          ].map(card => {
            const Icon = card.icon;
            const colorClass = card.color === "sky" ? "bg-sky-500 text-white shadow-sky-200" :
              card.color === "orange" ? "bg-orange-500 text-white shadow-orange-200" :
              "bg-emerald-400 text-white shadow-emerald-200";
            return (
              <div key={card.title} className={`relative overflow-hidden rounded-[25px] border border-white bg-gradient-to-br ${card.bg} p-4 shadow-[0_8px_25px_-15px_rgba(51,65,85,.35)] ring-1 ring-slate-200/40 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-lg sm:h-14 sm:w-14 ${colorClass}`}>
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500 sm:text-sm">{card.title}</p>
                    <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{card.value}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">{card.sub}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="relative overflow-hidden rounded-[25px] border border-white bg-gradient-to-br from-violet-50 to-fuchsia-100 p-4 shadow-[0_8px_25px_-15px_rgba(51,65,85,.35)] ring-1 ring-slate-200/40 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-200 sm:h-14 sm:w-14">
                <Clock3 className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500 sm:text-sm">Last Update</p>
                <p className="mt-1 truncate text-sm font-extrabold text-slate-900 sm:text-base">{latest ? new Date(latest.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "No updates yet"}</p>
                <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">{latest ? new Date(latest.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Waiting for activity"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Activity panel */}
        <section className="overflow-hidden rounded-[30px] border border-white bg-white/90 shadow-[0_18px_55px_-25px_rgba(99,102,241,.25)] ring-1 ring-slate-200/70 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-orange-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight sm:text-xl">Recent Activity</h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">Your latest account notifications</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => void markAllRead()}
                disabled={loading || refreshing || markingAll || markingId !== null || unread === 0}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
                {markingAll ? "Marking..." : "Mark all as read"}
              </button>
              <button
                onClick={() => void load(true)}
              disabled={loading || refreshing}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
              </button>
            </div>
          </div>

          {(actionError || actionSuccess) && (
            <div
              role="status"
              className={`mx-5 mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold sm:mx-7 ${
                actionError
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {actionError || actionSuccess}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-4 sm:px-7">
            {([
              ["all", "All Notifications", items.length],
              ["unread", "Unread", unread],
              ["read", "Read", items.length - unread]
            ] as const).map(([id, label, count]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-extrabold transition sm:px-5 sm:text-sm ${
                  filter === id
                    ? "bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-pink-200 hover:bg-pink-50"
                }`}
              >
                {label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${filter === id ? "bg-white text-indigo-700" : "bg-slate-100 text-slate-600"}`}>{count}</span>
              </button>
            ))}
            <span className="ml-auto hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:inline-flex">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Account data
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 via-white to-violet-50/60 px-5 py-3 sm:px-7">
            <label htmlFor="notification-date-filter" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
              <Calendar className="h-4 w-4 text-indigo-500" />
              Filter by date
            </label>
            <input
              id="notification-date-filter"
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter("")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Clear date
              </button>
            )}
            <span className="text-xs text-slate-500">
              {shown.length} matching update{shown.length === 1 ? "" : "s"}
            </span>
          </div>

          {error ? (
            <div className="m-5 rounded-3xl border border-rose-200 bg-rose-50 p-6 sm:m-7">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle className="h-5 w-5" /> Could not load notifications
              </div>
              <p className="mt-2 text-sm leading-6 text-rose-700">{error}</p>
              <button onClick={() => void load(true)} className="mt-4 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700">Try again</button>
            </div>
          ) : loading ? (
            <div className="space-y-4 p-6 sm:p-8">
              {[1, 2, 3].map(n => <div key={n} className="flex animate-pulse gap-4 rounded-2xl bg-slate-50 p-5"><div className="h-14 w-14 rounded-2xl bg-slate-200" /><div className="flex-1 space-y-3 py-1"><div className="h-4 w-1/3 rounded bg-slate-200" /><div className="h-3 w-4/5 rounded bg-slate-200" /><div className="h-3 w-1/4 rounded bg-slate-200" /></div></div>)}
            </div>
          ) : shown.length === 0 ? (
            <div className="px-5 py-14 text-center sm:py-16">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-sky-100 via-violet-100 to-pink-100 text-indigo-600 shadow-inner">
                <Bell className="h-9 w-9" />
                <Heart className="absolute -right-2 -top-2 h-6 w-6 fill-pink-400 text-pink-400" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900">
                {filter === "unread" ? "You are all caught up!" : filter === "read" ? "Nothing read yet" : "Your story starts here"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {filter === "unread" ? "There are no unread updates right now. Enjoy a little peace of mind." : "When your account receives a real update, it will appear here automatically."}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-xs font-semibold text-pink-600">
                <Heart className="h-3.5 w-3.5 fill-pink-400" /> Stay updated, stay ahead
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4 sm:p-6">
              {shown.map(item => {
                const Icon = getIcon(item.type);
                const isLiked = liked.includes(item.id);
                return (
                  <article key={item.id} className={`group relative overflow-hidden rounded-[25px] border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_-20px_rgba(99,102,241,.4)] sm:p-5 ${
                    !item.isRead
                      ? "border-indigo-100 bg-gradient-to-r from-sky-50/90 via-white to-pink-50/70 shadow-sm"
                      : "border-slate-100 bg-white hover:border-violet-100"
                  }`}>
                    {!item.isRead && <span className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-blue-500 via-violet-500 to-pink-400" />}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] shadow-sm sm:h-14 sm:w-14 ${
                        !item.isRead ? "bg-gradient-to-br from-sky-100 to-indigo-100 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        {!item.isRead && <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-blue-600" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`break-words text-sm sm:text-base ${!item.isRead ? "font-extrabold text-slate-900" : "font-bold text-slate-700"}`}>{item.title}</h3>
                          {!item.isRead && <span className="rounded-full bg-gradient-to-r from-pink-100 to-fuchsia-100 px-2.5 py-1 text-[9px] font-black tracking-wider text-pink-600">NEW</span>}
                          {item.priority?.toLowerCase() === "high" && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[9px] font-black text-amber-800">IMPORTANT</span>}
                        </div>
                        <p className="mt-2 break-words text-sm leading-6 text-slate-600">{item.message}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-100">
                            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(item.createdAt)}
                          </span>
                          {item.type && <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-bold capitalize text-indigo-600">{item.type.replace(/[_-]/g, " ")}</span>}
                          {item.channel && <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-semibold text-sky-700"><Send className="h-3 w-3" /> {item.channel}</span>}
                          <button
                            type="button"
                            onClick={() => setDetailItem(item)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-bold text-violet-700 transition hover:bg-violet-50"
                          >
                            <Eye className="h-3.5 w-3.5" /> Details
                          </button>
                          <button
                            type="button"
                            onClick={() => void shareNotification(item)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-[11px] font-bold text-sky-700 transition hover:bg-sky-50"
                          >
                            <Share2 className="h-3.5 w-3.5" /> Share
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteNotification(item)}
                            disabled={deletingId !== null}
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>                          {!item.isRead && (
                            <button
                              type="button"
                              onClick={() => void markOneRead(item.id)}
                              disabled={markingId !== null || markingAll}
                              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              {markingId === item.id ? "Marking..." : "Mark as read"}
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label={isLiked ? "Remove favorite" : "Favorite notification"}
                        title="Add a visual favorite"
                        onClick={() => setLiked(prev => isLiked ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                        className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:scale-110 sm:flex ${isLiked ? "bg-pink-50 text-pink-500" : "text-pink-300 hover:bg-pink-50 hover:text-pink-500"}`}
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? "fill-pink-400" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetailItem(item)}
                        aria-label={`View details for ${item.title}`}
                        title="View notification details"
                        className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </article>
                );
              })}

              <div className="flex items-center justify-center gap-2 px-3 py-3 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Showing {shown.length} of {items.length} notifications returned by your authenticated account API.
              </div>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="border-t border-slate-100 bg-gradient-to-r from-pink-50/80 via-white to-violet-50/80 px-5 py-5 sm:px-7">
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-500">
                    <Heart className="h-5 w-5 fill-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">{unread === 0 ? "You are all caught up!" : `${unread} update${unread === 1 ? "" : "s"} waiting for you`}</p>
                    <p className="mt-0.5 text-xs text-slate-500">We will keep your account updates together here.</p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 font-serif text-lg italic text-violet-600 sm:flex">
                  Stay updated, stay ahead <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
                </div>
              </div>
            </div>
          )}
        </section>

        <p className="pb-2 text-center text-[11px] text-slate-400">
          Secure account notifications · Live data from India Loan Finance
        </p>
      </div>

      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setDetailItem(null); }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-detail-title"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-white bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-pink-50 p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Notification details</p>
                  <h2 id="notification-detail-title" className="mt-1 text-lg font-black text-slate-900">Full update</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                aria-label="Close notification details"
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-5 sm:p-7">
              <div>
                <h3 className="break-words text-xl font-black text-slate-900">{detailItem.title}</h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{detailItem.message}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Received on</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">{formatDate(detailItem.createdAt)}</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Read status</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">{detailItem.isRead ? "Read" : "Unread"}</p>
                </div>
                <div className="rounded-2xl bg-pink-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Type</p>
                  <p className="mt-1 break-words text-sm font-extrabold capitalize text-slate-900">{(detailItem.type || "General").replace(/[_-]/g, " ")}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Priority / Channel</p>
                  <p className="mt-1 break-words text-sm font-extrabold capitalize text-slate-900">{detailItem.priority || "Normal"} / {detailItem.channel || "App"}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => void copyNotification(detailItem)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Copy className="h-4 w-4" /> Copy details
                </button>
                <button
                  type="button"
                  onClick={() => void shareNotification(detailItem)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
                <button
                  type="button"
                  onClick={() => void deleteNotification(detailItem)}
                  disabled={deletingId !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}




