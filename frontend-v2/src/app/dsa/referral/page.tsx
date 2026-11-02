"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users, UserCheck, Clock3, Wallet, Copy, Share2, RefreshCw,
  Gift, TrendingUp, Link2, CheckCircle2, AlertCircle, ArrowUpRight,
  Sparkles, CalendarDays, Search, ChevronRight
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
  referredUser?: { name?: string; fullName?: string; email?: string };
};

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const money = (value: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const dateText = (value?: string) => {
  if (!value) return "â€”";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "â€”"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

function getArray(payload: any): Referral[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.referrals)) return payload.referrals;
  if (Array.isArray(payload?.data?.referrals)) return payload.data.referrals;
  return [];
}

function getAmount(payload: any, keys: string[]) {
  for (const key of keys) {
    const value = payload?.[key] ?? payload?.data?.[key];
    if (value !== undefined && value !== null && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

export default function MyReferralsPage() {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<number | null>(null);
  const [rewards, setRewards] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"referrals" | "history" | "rewards">("referrals");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("loan_finance_user");
      const savedToken = localStorage.getItem("loan_finance_token") || "";
      const parsed = rawUser ? JSON.parse(rawUser) : null;
      setUserId(String(parsed?.id || parsed?.user?.id || parsed?.userId || ""));
      setToken(savedToken);
    } catch {
      setError("Login details read nahi ho sake. Dobara login karke try karein.");
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!userId || !token) {
      setLoading(false);
      if (!token) setError("Session nahi mila. Please login karke referral page dobara kholein.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

    try {
      const responses = await Promise.all([
        fetch(`${API}/referral/dsa/${encodeURIComponent(userId)}`, { headers, cache: "no-store" }),
        fetch(`${API}/referral/earnings/${encodeURIComponent(userId)}?source=DSA`, { headers, cache: "no-store" }),
        fetch(`${API}/referral/rewards/${encodeURIComponent(userId)}?source=DSA`, { headers, cache: "no-store" }),
        fetch(`${API}/referral/history/${encodeURIComponent(userId)}?source=DSA`, { headers, cache: "no-store" }),
      ]);

      const payloads = await Promise.all(responses.map(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body?.message || `Referral API error (${response.status})`);
        }
        return body;
      }));

      setReferrals(getArray(payloads[0]));
      setEarnings(getAmount(payloads[1], ["totalEarnings", "earnings", "total", "amount"]));
      setRewards(getAmount(payloads[2], ["rewardAmount", "rewards", "totalRewards", "amount"]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Referral data load nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId && token) void loadData();
  }, [userId, token, loadData]);

  const summary = useMemo(() => {
    const total = referrals.reduce((sum, item) => sum + (Number(item.totalReferrals) || 0), 0);
    const successful = referrals.reduce((sum, item) => sum + (Number(item.successfulReferrals) || 0), 0);
    const pending = referrals.reduce((sum, item) => sum + (Number(item.pendingReferrals) || 0), 0);
    const rejected = referrals.reduce((sum, item) => sum + (Number(item.rejectedReferrals) || 0), 0);
    return {
      total: total || referrals.length,
      successful,
      pending,
      rejected,
      earned: earnings ?? referrals.reduce((sum, item) => sum + (Number(item.totalEarnings) || 0), 0),
      reward: rewards ?? referrals.reduce((sum, item) => sum + (Number(item.rewardAmount) || 0), 0),
    };
  }, [referrals, earnings, rewards]);

  const primaryReferral = referrals.find((item) => item.referralCode || item.referralLink);
  const code = primaryReferral?.referralCode || "";
  const link = primaryReferral?.referralLink ||
    (code ? `${typeof window !== "undefined" ? window.location.origin : ""}/ref/${encodeURIComponent(code)}` : "");

  const filtered = referrals.filter((item) => {
    const text = `${item.referredUser?.name || item.referredUser?.fullName || ""} ${item.referredUser?.email || ""} ${item.status || ""} ${item.referralCode || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  async function copyLink() {
    if (!link) {
      setNotice("Aapka referral link abhi available nahi hai.");
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setNotice("Referral link copied successfully.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice("Copy nahi hua. Referral link ko select karke manually copy karein.");
    }
  }

  async function shareLink() {
    if (!link) {
      setNotice("Aapka referral link abhi available nahi hai.");
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join me on DSA FinCorp",
          text: "Mere referral link se DSA FinCorp par connect karein.",
          url: link,
        });
      } else {
        await copyLink();
      }
    } catch (e) {
      if (!(e instanceof Error) || e.name !== "AbortError") {
        setNotice("Share nahi ho saka. Copy Link option try karein.");
      }
    }
  }

  const stats = [
    { label: "Total Referrals", value: summary.total.toLocaleString("en-IN"), sub: "Referral records", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Successful", value: summary.successful.toLocaleString("en-IN"), sub: "Successful referrals", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending", value: summary.pending.toLocaleString("en-IN"), sub: "Awaiting status update", icon: Clock3, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Earnings", value: money(summary.earned), sub: "Reported by referral API", icon: Wallet, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950 p-6 text-white shadow-xl sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-200">
                <Sparkles size={14} /> DSA GROWTH HUB
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                My <span className="text-emerald-300">Referrals</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Apna referral network grow karein, progress track karein aur apne referral performance ko ek jagah dekhein.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={copyLink} disabled={!link} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50">
                  {copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}
                  {copied ? "Copied!" : "Copy Referral Link"}
                </button>
                <button onClick={shareLink} disabled={!link} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50">
                  <Share2 size={17} /> Share Link
                </button>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-md lg:max-w-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-100">Your Referral Code</span>
                <div className="rounded-lg bg-emerald-300/15 p-2 text-emerald-200"><Link2 size={20} /></div>
              </div>
              <div className="mt-3 break-all text-2xl font-black tracking-widest text-white sm:text-3xl">
                {loading ? "Loading..." : code || "Not available"}
              </div>
              <div className="mt-4 h-px bg-white/15" />
              <p className="mt-3 text-xs leading-5 text-blue-100/80">
                {link ? link : "Referral code/link API se available hone par yahan dikhega."}
              </p>
            </div>
          </div>
        </section>

        {notice && (
          <div role="status" className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <CheckCircle2 size={17} /> {notice}
          </div>
        )}

        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span>{error}</span></div>
            <button onClick={() => void loadData()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 font-semibold hover:bg-rose-100">
              <RefreshCw size={15} /> Retry
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-3 break-words text-2xl font-extrabold tracking-tight text-slate-900">
                      {loading ? <span className="inline-block h-7 w-24 animate-pulse rounded bg-slate-100" /> : stat.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}><Icon size={22} /></div>
                </div>
                <p className="mt-3 text-xs text-slate-500">{stat.sub}</p>
              </article>
            );
          })}
        </section>

        <nav aria-label="Referral sections" className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {([
            { id: "referrals", label: "My Referrals", icon: Users },
            { id: "history", label: "History", icon: Clock3 },
            { id: "rewards", label: "Rewards", icon: Gift },
          ] as const).map((tab) => {
            const TabIcon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <TabIcon size={17} />
                {tab.label}
              </button>
            );
          })}
        </nav>
{activeTab === "rewards" && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Referral Performance</h2>
                <p className="mt-1 text-sm text-slate-500">Aapke available referral records ka overview</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Live API data</span>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Successful</p>
                <p className="mt-2 text-2xl font-extrabold text-emerald-800">{loading ? "â€”" : summary.successful}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${summary.total ? Math.min(100, (summary.successful / summary.total) * 100) : 0}%` }} /></div>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
                <p className="mt-2 text-2xl font-extrabold text-amber-800">{loading ? "â€”" : summary.pending}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${summary.total ? Math.min(100, (summary.pending / summary.total) * 100) : 0}%` }} /></div>
              </div>
              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Rejected</p>
                <p className="mt-2 text-2xl font-extrabold text-rose-800">{loading ? "â€”" : summary.rejected}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rose-100"><div className="h-full rounded-full bg-rose-500" style={{ width: `${summary.total ? Math.min(100, (summary.rejected / summary.total) * 100) : 0}%` }} /></div>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <TrendingUp size={19} className="mt-0.5 shrink-0 text-blue-700" />
              <p className="text-sm leading-6 text-blue-900">Referral status aur earning figures backend response par depend karte hain. Koi sample referral ya estimated earning yahan generate nahi ki jaati.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600"><Gift size={22} /></div>
              <div><h2 className="font-bold text-slate-900">Reward Summary</h2><p className="mt-1 text-xs text-slate-500">Reported reward amount</p></div>
            </div>
            <p className="mt-6 text-3xl font-black tracking-tight text-slate-900">{loading ? "â€”" : money(summary.reward)}</p>
            <p className="mt-2 text-sm text-slate-500">Rewards API se prapt total</p>
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Reported earnings</span>
                <span className="font-bold text-slate-900">{loading ? "â€”" : money(summary.earned)}</span>
              </div>
              <div className="my-3 h-px bg-slate-200" />
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Referral records</span>
                <span className="font-bold text-slate-900">{loading ? "â€”" : referrals.length}</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Yeh summary earning ka final payout confirmation nahi hai. Paid rewards ko verified transaction ledger se alag confirm karna chahiye.</p>
          </article>
        </section>

        )}

{activeTab !== "rewards" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activeTab === "history" ? "Referral History" : "My Referral Records"}</h2>
              <p className="mt-1 text-sm text-slate-500">{activeTab === "history" ? "Referral records ki dates aur current status dekhein." : "Aapke referral entries aur unka current status."}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search referrals..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white sm:w-60" />
              </div>
              <button onClick={() => void loadData()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Referral</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Reward</th>
                  <th className="px-6 py-4 text-right font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw size={20} className="mx-auto mb-3 animate-spin" /> Referral records load ho rahe hain...
                  </td></tr>
                )}
                {!loading && filtered.map((item, index) => {
                  const status = String(item.status || "PENDING").toUpperCase();
                  const statusClass = status === "REWARDED" || status === "APPROVED" || status === "PAID"
                    ? "bg-emerald-50 text-emerald-700"
                    : status === "REJECTED" || status === "EXPIRED"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-amber-50 text-amber-700";
                  return (
                    <tr key={item.id || `${item.referralCode || "ref"}-${index}`} className="transition hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-emerald-100 font-bold text-blue-800">
                            {(item.referredUser?.name || item.referredUser?.fullName || "R").slice(0, 1).toUpperCase()}
                          </div>
                          <div><p className="font-semibold text-slate-900">{item.referredUser?.name || item.referredUser?.fullName || (item.referredUserId ? `Referred user ${item.referredUserId.slice(0, 7)}` : item.referralCode || "Referral record")}</p><p className="mt-1 text-xs text-slate-500">{item.referredUser?.email || item.referralCode || "â€”"}</p></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600"><span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-slate-400" />{dateText(item.createdAt)}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass}`}>{status}</span></td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-800">{money(item.rewardAmount)}</td>
                      <td className="px-6 py-4 text-right"><button onClick={() => setNotice(`Referral status: ${status}`)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-semibold text-blue-700 hover:bg-blue-50">View <ChevronRight size={15} /></button></td>
                    </tr>
                  );
                })}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Users size={26} /></div>
                    <h3 className="mt-4 font-bold text-slate-800">{search ? "No matching referrals" : "No referral records yet"}</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{search ? "Search term badal kar dobara try karein." : "Jab backend par aapke referral records honge, woh yahan dikhai denge. Abhi koi demo data nahi dikhaya ja raha."}</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">
            <span>Showing {loading ? "â€”" : filtered.length} referral record(s)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Data loaded from API</span>
          </div>
        </section>

        )}

        <footer className="flex flex-col gap-2 pb-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>DSA FinCorp Â· Referral Growth</span>
          <span className="inline-flex items-center gap-1.5"><ArrowUpRight size={13} /> Build your network responsibly</span>
        </footer>
      </div>
    </main>
  );
}


