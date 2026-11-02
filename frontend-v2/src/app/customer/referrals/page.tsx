"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users, Gift, Clock3, Wallet, Copy, Share2, RefreshCw,
  Search, CalendarDays, CheckCircle2, AlertCircle, Link2
} from "lucide-react";

type Referral = {
  id?: string;
  referralCode?: string;
  referralLink?: string;
  referredUserId?: string | null;
  status?: string;
  totalReferrals?: number;
  successfulReferrals?: number;
  pendingReferrals?: number;
  rejectedReferrals?: number;
  rewardAmount?: number;
  rewardPaidAmount?: number;
  totalEarnings?: number;
  createdAt?: string;
  updatedAt?: string;
  referredUser?: { name?: string; fullName?: string; email?: string };
};

type Tab = "referrals" | "history" | "rewards";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const money = (n: unknown) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2
}).format(Number(n) || 0);

const dateText = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

function arrayFrom(payload: any): Referral[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.referrals)) return payload.referrals;
  return [];
}

export default function CustomerReferralsPage() {
  const [tab, setTab] = useState<Tab>("referrals");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<number | null>(null);
  const [rewards, setRewards] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("loan_finance_user");
      const parsed = raw ? JSON.parse(raw) : null;
      setUserId(String(parsed?.id || parsed?.user?.id || parsed?.userId || ""));
      setToken(localStorage.getItem("loan_finance_token") || "");
    } catch {
      setError("Login details read nahi ho sake. Dobara login karein.");
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!userId || !token) {
      setLoading(false);
      if (!token || !userId) setError("Customer session nahi mila. Dobara login karke try karein.");
      return;
    }

    setLoading(true);
    setError("");
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

    try {
      const [refRes, earnRes, rewardRes, historyRes] = await Promise.all([
        fetch(`${API}/referral/customer/${encodeURIComponent(userId)}`, {
          headers, cache: "no-store"
        }),
        fetch(`${API}/referral/earnings/${encodeURIComponent(userId)}`, {
          headers, cache: "no-store"
        }),
        fetch(`${API}/referral/rewards/${encodeURIComponent(userId)}`, {
          headers, cache: "no-store"
        }),
        fetch(`${API}/referral/history/${encodeURIComponent(userId)}`, { headers, cache: "no-store" })
      ]);

      const [refPayload, earnPayload, rewardPayload] = await Promise.all(
        [refRes, earnRes, rewardRes, historyRes].map(async (res, index) => {
          if (index === 3 && !res.ok) return { success: true, data: [] };
          const body = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(body?.message || `Referral API error (${res.status})`);
          return body;
        })
      );

      setRows(arrayFrom(refPayload));
      const earn = Number(earnPayload?.totalEarnings ?? earnPayload?.data?.totalEarnings);
      const reward = Number(rewardPayload?.rewardAmount ?? rewardPayload?.data?.rewardAmount);
      setEarnings(Number.isFinite(earn) ? earn : null);
      setRewards(Number.isFinite(reward) ? reward : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Referral data load nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId && token) void loadData();
  }, [userId, token, loadData]);

  const filtered = useMemo(() => rows.filter((r) => {
    const text = [
      r.referredUser?.name, r.referredUser?.fullName,
      r.referredUser?.email, r.status, r.referralCode, r.referredUserId
    ].filter(Boolean).join(" ").toLowerCase();
    return text.includes(search.toLowerCase());
  }), [rows, search]);

  const totalEarnings = earnings ?? rows.reduce((s, r) => s + (Number(r.totalEarnings) || 0), 0);
  const totalRewards = rewards ?? rows.reduce((s, r) => s + (Number(r.rewardAmount) || 0), 0);
  const successful = rows.reduce((s, r) => s + (Number(r.successfulReferrals) || 0), 0);
  const pending = rows.reduce((s, r) => s + (Number(r.pendingReferrals) || 0), 0);
  const primary = rows.find((r) => r.referralCode || r.referralLink);
  const code = primary?.referralCode || "";
  const link = primary?.referralLink ||
    (code && typeof window !== "undefined"
      ? `${window.location.origin}/ref/${encodeURIComponent(code)}` : "");

  async function copyLink() {
    if (!link) {
      setNotice("Referral link abhi available nahi hai.");
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      setNotice("Referral link copied.");
    } catch {
      setNotice("Copy nahi hua. Link manually copy karein.");
    }
  }

  async function shareLink() {
    if (!link) {
      setNotice("Referral link abhi available nahi hai.");
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({ title: "My referral link", url: link });
      } else {
        await copyLink();
      }
    } catch (e) {
      if (!(e instanceof Error) || e.name !== "AbortError") {
        setNotice("Share nahi ho saka.");
      }
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "referrals", label: "My Referrals", icon: Users },
    { id: "history", label: "Referral History", icon: Clock3 },
    { id: "rewards", label: "Rewards", icon: Gift }
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-6 text-white shadow-lg sm:p-9">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">
                <Gift size={14} /> CUSTOMER REWARDS
              </span>
              <h1 className="mt-4 text-3xl font-black sm:text-4xl">Referral Centre</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                Apne referral records, status aur available rewards ek hi jagah manage karein.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => void copyLink()} disabled={!link}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-950 disabled:opacity-50">
                  <Copy size={16} /> Copy Referral Link
                </button>
                <button onClick={() => void shareLink()} disabled={!link}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold disabled:opacity-50">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
            <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 lg:max-w-sm">
              <div className="flex items-center gap-2 text-sm text-blue-100"><Link2 size={17} /> Your referral code</div>
              <p className="mt-3 break-all text-2xl font-black">{loading ? "Loading..." : code || "Not available"}</p>
              <p className="mt-3 break-all text-xs text-blue-100">{link || "Referral link API se milne par yahan dikhega."}</p>
            </div>
          </div>
        </section>

        {notice && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{notice}</div>}
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <span className="flex items-center gap-2"><AlertCircle size={17} /> {error}</span>
            <button onClick={() => void loadData()} className="rounded-lg border border-rose-200 bg-white px-3 py-2 font-semibold">Retry</button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Referral Records", value: rows.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Successful", value: successful, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending", value: pending, icon: Clock3, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Total Earnings", value: money(totalEarnings), icon: Wallet, color: "text-violet-600", bg: "bg-violet-50" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-extrabold">{loading ? "—" : item.value}</p>
                  </div>
                  <span className={`rounded-xl p-3 ${item.bg} ${item.color}`}><Icon size={22} /></span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="space-y-4">
          <nav aria-label="Referral sections" className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" onClick={() => setTab(item.id)}
                  aria-current={tab === item.id ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${tab === item.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                  <Icon size={17} /> {item.label}
                </button>
              );
            })}
          </nav>

          {tab === "rewards" ? (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-violet-50 p-3 text-violet-600"><Gift size={23} /></span>
                  <div><h2 className="font-bold">Reported Rewards</h2><p className="text-sm text-slate-500">Rewards API se prapt amount</p></div>
                </div>
                <p className="mt-6 text-3xl font-black">{loading ? "—" : money(totalRewards)}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><Wallet size={23} /></span>
                  <div><h2 className="font-bold">Reported Earnings</h2><p className="text-sm text-slate-500">Earnings API se prapt amount</p></div>
                </div>
                <p className="mt-6 text-3xl font-black">{loading ? "—" : money(totalEarnings)}</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">Yeh API-reported totals hain; verified payout history ka substitute nahi.</p>
              </article>
            </section>
          ) : (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold">{tab === "history" ? "Referral History" : "My Referrals"}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {tab === "history" ? "Referral records ki date aur current status." : "Aapke referral records aur unka current status."}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search referrals..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 sm:w-60" />
                  </div>
                  <button onClick={() => void loadData()} disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Referral</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && <tr><td colSpan={4} className="px-5 py-12 text-center text-slate-500">Referral records load ho rahe hain...</td></tr>}
                    {!loading && filtered.map((item, index) => {
                      const status = String(item.status || "PENDING").toUpperCase();
                      const color = ["APPROVED", "REWARDED", "PAID"].includes(status)
                        ? "bg-emerald-50 text-emerald-700"
                        : ["REJECTED", "EXPIRED"].includes(status)
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700";
                      return (
                        <tr key={item.id || `${item.referralCode || "ref"}-${index}`} className="hover:bg-slate-50">
                          <td className="px-5 py-4">
                            <p className="font-semibold">{item.referredUser?.name || item.referredUser?.fullName || (item.referredUserId ? `User ${item.referredUserId.slice(0, 7)}` : item.referralCode || "Referral record")}</p>
                            <p className="mt-1 text-xs text-slate-500">{item.referredUser?.email || item.referralCode || "—"}</p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600"><span className="inline-flex items-center gap-2"><CalendarDays size={14} />{dateText(tab === "history" ? item.updatedAt || item.createdAt : item.createdAt)}</span></td>
                          <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>{status}</span></td>
                          <td className="whitespace-nowrap px-5 py-4 text-right font-semibold">{money(item.rewardAmount)}</td>
                        </tr>
                      );
                    })}
                    {!loading && filtered.length === 0 && (
                      <tr><td colSpan={4} className="px-5 py-14 text-center">
                        <Users size={28} className="mx-auto text-slate-300" />
                        <p className="mt-3 font-bold text-slate-700">{search ? "No matching referrals" : "No referral records yet"}</p>
                        <p className="mt-1 text-sm text-slate-500">Backend se records aane par yahan dikhai denge. Koi demo data nahi dikhaya ja raha.</p>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
                Showing {loading ? "—" : filtered.length} record(s)
              </div>
            </section>
          )}
        </section>
        <footer className="pb-3 text-xs text-slate-400">India Loan Finance · Customer Referral Centre</footer>
      </div>
    </main>
  );
}
