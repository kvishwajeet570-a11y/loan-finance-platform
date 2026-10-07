"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DsaShell from "@/components/dsa/DsaShell";

const API =
 process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const RUPEE = "\u20B9";

const money = (n: number) =>
 `${RUPEE}${Number(n || 0).toLocaleString("en-IN")}`;

const compact = (n: number) => {
 n = Number(n || 0);
 if (n >= 10000000) return `${RUPEE}${(n / 1e7).toFixed(1)}Cr`;
 if (n >= 100000) return `${RUPEE}${(n / 1e5).toFixed(1)}L`;
 if (n >= 1000) return `${RUPEE}${(n / 1e3).toFixed(1)}K`;
 return money(n);
};

export default function DsaDashboard() {
 const [d, setD] = useState<any>(null);
 const [u, setU] = useState<any>(null);
 const [err, setErr] = useState("");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 (async () => {
 try {
 const raw = localStorage.getItem("loan_finance_user");

 if (!raw) {
 throw new Error("DSA session not found.");
 }

 const user = JSON.parse(raw);
 setU(user);

 const token = localStorage.getItem("loan_finance_token");

 const r = await fetch(
 `${API}/dsa/dashboard/${user.id}`,
 {
 cache: "no-store",
 headers: token
 ? { Authorization: `Bearer ${token}` }
 : {},
 }
 );

 const j = await r.json();

 if (!r.ok || !j.success) {
 throw new Error(
 j.message || "Dashboard API failed."
 );
 }

 setD({
 ...j.data,
 loanProducts:
 j.data.loanProducts?.length
 ? j.data.loanProducts
 : [
 {
 name: "Personal Loan",
 value: 0,
 amount: 0,
 },
 {
 name: "Business Loan",
 value: 0,
 amount: 0,
 },
 {
 name: "Home Loan",
 value: 0,
 amount: 0,
 },
 {
 name: "Loan Against Property",
 value: 0,
 amount: 0,
 },
 {
 name: "Car Loan",
 value: 0,
 amount: 0,
 },
 {
 name: "Credit Card",
 value: 0,
 amount: 0,
 },
 ],
 });
 } catch (e: any) {
 setErr(
 e.message || "Unable to load dashboard."
 );
 } finally {
 setLoading(false);
 }
 })();
 }, []);

 const max = Math.max(
 ...(d?.monthlyTrend || []).map(
 (x: any) => x.applications
 ),
 1
 );

 const ptotal = (d?.loanProducts || []).reduce(
 (a: number, x: any) => a + Number(x.value || 0),
 0
 );

 const products = useMemo(
 () => d?.loanProducts || [],
 [d]
 );

 return (
 <DsaShell>
 <style jsx global>{`
 .dsa-ui main {
 max-width: 1800px !important;
 margin: auto;
 }

 .dsa-ui section,
 .dsa-ui .card {
 border-radius: 22px !important;
 }

 .dsa-ui h2 {
 font-size: 1.35rem !important;
 letter-spacing: -0.02em;
 }

 .dsa-ui .hero {
 min-height: 350px !important;
 height: 350px !important;
 }

 .dsa-ui .kpi-card {
 min-height: 145px !important;
 }

 .dsa-ui .chart-card {
 min-height: 410px !important;
 }

 .dsa-ui .product-card {
 min-height: 410px !important;
 }

 .dsa-ui table th,
 .dsa-ui table td {
 padding-top: 14px !important;
 padding-bottom: 14px !important;
 }

 @media (max-width: 768px) {
 .dsa-ui .hero {
 min-height: 310px !important;
 height: 310px !important;
 }
 }
 `}</style>

 <div className="dsa-ui">
 <div className="min-h-screen bg-[#f4f8fd] text-[#071a3d]">

 {/* TOP BAR */}
 <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl md:px-8">

 <div className="hidden h-11 w-[440px] items-center gap-3 rounded-xl bg-[#f1f6fc] px-4 md:flex">
 <span className="text-xl text-blue-600">
 Search
 </span>
 <span className="text-sm text-slate-400">
 Search applications, customers, products...
 </span>
 </div>

 <div className="ml-auto flex items-center gap-4">

 <Link
 href="/dsa/notifications"
 className="relative flex h-10 w-10 items-center justify-center rounded-full text-lg transition hover:bg-slate-100"
 >
 Bell
 {!!d?.unreadNotifications && (
 <b className="absolute right-0 top-0 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] text-white">
 {d.unreadNotifications}
 </b>
 )}
 </Link>

 <div className="h-8 w-px bg-slate-200" />

 <div className="flex items-center gap-3">
 <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-base font-black text-white shadow-lg">
 {String(
 u?.name || "D"
 )[0].toUpperCase()}
 </div>

 <div className="hidden md:block">
 <p className="text-sm font-black">
 {u?.name || "DSA Agent"}
 </p>
 <p className="text-[11px] text-slate-400">
 DSA Partner
 </p>
 </div>

 <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
 </div>
 </div>
 </header>

 <main className="space-y-5 p-4 md:p-6">

 {/* HERO */}
 <section
 className="hero relative overflow-hidden rounded-[24px] bg-[#06275b] text-white shadow-xl"
 style={{
 backgroundImage:
 'url("/images/dsa/dsa-dashboard-banner.png")',
 backgroundSize: "cover",
 backgroundPosition: "center center",
 backgroundRepeat: "no-repeat",
 }}
 >

 {/* dark/blue overlay */}
 <div className="absolute inset-0 bg-gradient-to-r from-[#021a43]/95 via-[#063b78]/60 to-transparent" />

 {/* subtle bottom gradient */}
 <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#031c43]/70 to-transparent" />

 {/* HERO CONTENT */}
 <div className="relative z-10 flex h-full flex-col justify-between p-7 md:p-10">

 <div className="max-w-[700px]">

 <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
 DSA FinCorp
 <span className="mx-2 text-cyan-300">
 |
 </span>
 Trusted Loan Partner
 </div>

 <h1 className="max-w-[650px] text-4xl font-black leading-[1.02] tracking-tight md:text-5xl">
 Financial Freedom for a
 <span className="block text-cyan-300">
 Brighter Tomorrow
 </span>
 </h1>

 <p className="mt-4 text-sm font-medium text-blue-50 md:text-base">
 Your Effort
 <span className="mx-2 text-cyan-300">
 |
 </span>
 Our Support
 <span className="mx-2 text-cyan-300">
 |
 </span>
 Bigger Opportunities
 </p>

 <div className="mt-6 flex flex-wrap gap-3">
 <Link
 href="/dsa/apply-loan"
 className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-blue-500"
 >
 Apply Now →
 </Link>

 <Link
 href="/dsa/products"
 className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20"
 >
 Explore Products
 </Link>
 </div>
 </div>

 {/* BENEFITS */}
 <div className="hidden max-w-[950px] grid-cols-4 gap-3 lg:grid">

 {[
 [
 "Higher Commission",
 "More earning potential",
 ],
 [
 "Dedicated Support",
 "Partner assistance",
 ],
 [
 "Fast Processing",
 "Smooth loan journey",
 ],
 [
 "Pan India Network",
 "Multiple loan products",
 ],
 ].map(([title, sub]) => (
 <div
 key={title}
 className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md"
 >
 <p className="text-xs font-black text-white">
 {title}
 </p>
 <p className="mt-1 text-[10px] text-blue-100">
 {sub}
 </p>
 </div>
 ))}
 </div>

 </div>
 </section>

 {err && (
 <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
 {err}
 </div>
 )}

 {/* KPI */}
 <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

 {[
 [
 "Total Applications",
 d?.summary?.totalLeads || 0,
 "APPLICATIONS",
 "blue",
 ],
 [
 "Approved",
 d?.summary?.approvedLoans || 0,
 "SUCCESS RATE",
 "green",
 ],
 [
 "In Progress",
 d?.summary?.pendingLoans || 0,
 "LIVE ACCOUNT DATA",
 "orange",
 ],
 [
 "Rejected",
 d?.summary?.rejectedLoans || 0,
 "IMPROVE & REAPPLY",
 "red",
 ],
 [
 "Total Commission",
 money(d?.summary?.totalEarnings || 0),
 "LIVE ACCOUNT DATA",
 "cyan",
 ],
 ].map(([title, value, sub, color]: any) => {

 const chartColor =
 color === "green"
 ? "#10b981"
 : color === "orange"
 ? "#f59e0b"
 : color === "red"
 ? "#ef4444"
 : color === "cyan"
 ? "#06b6d4"
 : "#1683ff";

 return (
 <div
 key={title}
 className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
 >

 <div className="flex items-start justify-between">

 <div
 className={`flex h-12 w-12 items-center justify-center rounded-full bg-${color}-50 text-2xl font-black text-${color}-600 shadow-sm`}
 >
 {title === "Total Applications"
 ? String.fromCodePoint(0x1F4CB)
 : title === "Approved"
 ? String.fromCodePoint(0x2705)
 : title === "Rejected"
 ? String.fromCodePoint(0x274C)
 : title === "In Progress"
 ? String.fromCodePoint(0x23F3)
 : title === "Total Commission"
 ? RUPEE
 : String.fromCodePoint(0x1F4CB)}
 </div>

 {title === "Total Applications" && (
 <span className="rounded-full bg-blue-500 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-sm">
 LIVE
 </span>
 )}

 </div>

 <div className="mt-3 flex items-end justify-between">

 <div className="min-w-0">

 <p className="text-xs font-bold text-slate-400">
 {title}
 </p>

 <p className="mt-1 text-3xl font-black tracking-tight text-[#071a3d]">
 {loading ? "-" : value}
 </p>

 <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
 {sub}
 </p>

 <p className="mt-1 text-[10px] font-semibold text-slate-400">
 Live account data
 </p>

 </div>

 <div className="h-16 w-32 shrink-0">

 <svg
 viewBox="0 0 160 60"
 className="h-full w-full"
 preserveAspectRatio="none"
 >

 <defs>
 <linearGradient
 id={`kpi-gradient-${color}`}
 x1="0"
 y1="0"
 x2="0"
 y2="1"
 >
 <stop
 offset="0%"
 stopColor={chartColor}
 stopOpacity="0.30"
 />
 <stop
 offset="100%"
 stopColor={chartColor}
 stopOpacity="0"
 />
 </linearGradient>
 </defs>

 <path
 d="M4 52 C18 48 20 39 34 43 C47 47 50 27 64 34 C78 41 83 23 96 29 C110 36 113 17 127 23 C140 29 145 10 156 13 L156 60 L4 60 Z"
 fill={`url(#kpi-gradient-${color})`}
 />

 <path
 d="M4 52 C18 48 20 39 34 43 C47 47 50 27 64 34 C78 41 83 23 96 29 C110 36 113 17 127 23 C140 29 145 10 156 13"
 fill="none"
 stroke={chartColor}
 strokeWidth="3"
 strokeLinecap="round"
 strokeLinejoin="round"
 />

 </svg>

 </div>

 </div>

 <div
 className="absolute bottom-0 left-0 right-0 h-1"
 style={{ backgroundColor: chartColor }}
 />

 </div>
 );
 })}

 </section>

{/* CHART + PRODUCTS + SIDE */}
 <section className="grid gap-5 xl:grid-cols-12">

 {/* CHART */}
 <div className="chart-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-7">

 <div className="flex items-start justify-between">
 <div>
 <h2 className="text-2xl font-black">
 Loan Applications
 </h2>
 <p className="mt-1 text-sm text-slate-400">
 Real application activity
 </p>
 </div>

 <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold text-slate-600">
 This Month
 </span>
 </div>

 <div className="mt-8 flex h-[285px] items-end gap-3 border-b border-slate-100">

 {(d?.monthlyTrend || []).map(
 (x: any) => (
 <div
 key={x.month}
 className="flex h-full flex-1 flex-col items-center justify-end"
 >
 <span className="mb-2 text-[11px] font-black text-slate-500">
 {x.applications}
 </span>

 <div
 className="w-[65%] max-w-12 rounded-t-xl bg-gradient-to-t from-blue-700 to-cyan-400 shadow-lg shadow-blue-100"
 style={{
 height: `${
 x.applications
 ? Math.max(
 (x.applications /
 max) *
 100,
 7
 )
 : 2
 }%`,
 }}
 />

 <span className="mt-3 text-[11px] font-bold text-slate-400">
 {x.month}
 </span>
 </div>
 )
 )}
 </div>

 <div className="mt-5 flex flex-wrap gap-5 text-[10px] font-bold text-slate-400">
 <span>
 <i className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
 Applications
 </span>

 <span>
 <i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
 Approved
 </span>

 <span>
 <i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />
 Pending
 </span>

 <span>
 <i className="mr-1 inline-block h-2 w-2 rounded-full bg-red-400" />
 Rejected
 </span>
 </div>
 </div>

 {/* PRODUCTS */}
 <div className="product-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">

 <div className="flex items-start justify-between">
 <div>
 <h2 className="text-2xl font-black">
 Product Distribution
 </h2>
 <p className="mt-1 text-sm text-slate-400">
 Actual loan products
 </p>
 </div>

 <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-600">
 Live
 </span>
 </div>

 <div className="mt-5 flex items-center gap-5">

 <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
 {(() => {
 let cursor = 0;

 const colors = [
 "#1683F8",
 "#A855F7",
 "#F59E0B",
 "#10B981",
 "#EF4444",
 ];

 const stops = products
 .filter((x: any) => Number(x.value || 0) > 0)
 .map((x: any, i: number) => {
 const pct = ptotal
 ? (Number(x.value || 0) / ptotal) * 100
 : 0;

 const startPct = cursor;
 cursor += pct;

 return `${colors[i % colors.length]} ${startPct}% ${cursor}%`;
 })
 .join(", ");

 return (
 <>
 <div
 className="absolute inset-0 rounded-full shadow-inner"
 style={{
 background: stops
 ? `conic-gradient(${stops})`
 : "conic-gradient(#e2e8f0 0% 100%)",
 }}
 />

 <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white shadow-sm">
 <span className="text-2xl font-black text-[#071a3d]">
 {ptotal}
 </span>
 <span className="text-[10px] font-bold text-slate-400">
 Total
 </span>
 </div>
 </>
 );
 })()}
 </div>

 <div className="min-w-0 flex-1 space-y-4">
 {products
 .filter((x: any) => Number(x.value || 0) > 0)
 .map((x: any, i: number) => {
 const pct = ptotal
 ? (Number(x.value || 0) / ptotal) * 100
 : 0;

 const colors = [
 "bg-blue-500",
 "bg-purple-500",
 "bg-amber-500",
 "bg-emerald-500",
 "bg-red-500",
 ];

 return (
 <div key={x.name}>
 <div className="flex items-center justify-between gap-2">
 <div className="flex min-w-0 items-center gap-2">
 <span
 className={`h-3 w-3 shrink-0 rounded-full ${colors[i % colors.length]}`}
 />
 <span className="truncate text-[11px] font-bold text-slate-700">
 {String(x.name)
 .replaceAll("_", " ")}
 </span>
 </div>

 <span className="shrink-0 text-[11px] font-black text-blue-600">
 {x.value} ({Math.round(pct)}%)
 </span>
 </div>

 <p className="mt-1 text-[9px] font-medium text-slate-400">
 {money(x.amount)}
 </p>
 </div>
 );
 })}

 {products.filter(
 (x: any) => Number(x.value || 0) > 0
 ).length === 0 && (
 <div className="py-6 text-center text-xs font-semibold text-slate-400">
 No product data available
 </div>
 )}
 </div>

 </div>
 </div>

 {/* RANK + WALLET */}
 <div className="space-y-5 xl:col-span-2">

 <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
 <p className="text-xs font-black text-amber-500">
 YOUR RANK
 </p>

<div className="DASHBOARD_TROPHY_ICON mt-1 flex items-center justify-center">
 <div className="relative flex h-28 w-28 items-center justify-center">

 <div className="absolute inset-1 rounded-full bg-yellow-300/30 blur-xl"></div>

 <div className="absolute inset-0 rounded-2xl border border-yellow-300 bg-gradient-to-br from-yellow-50 via-amber-200 to-yellow-400 shadow-[0_10px_30px_rgba(245,158,11,0.40)]"></div>

 <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-white/80 via-yellow-100/40 to-amber-300/40 ring-1 ring-yellow-200"></div>

 <span className="absolute left-1 top-2 text-2xl">✨</span>
 <span className="absolute right-1 top-4 text-lg">⭐</span>

 <span className="relative z-10 text-[5.2rem] leading-none drop-shadow-[0_8px_8px_rgba(120,70,0,0.30)]">
 🏆
 </span>

 <span className="absolute -bottom-1 left-1/2 z-20 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
 Top Performer
 </span>

 </div>
</div>



 <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
 Trophy
 </div>

 <p className="mt-3 text-sm font-black">
 {d?.rank
 ? `Rank #${d.rank}`
 : "-"}
 </p>

 <p className="mt-1 text-[10px] text-slate-400">
 Based on approved commission
 </p>
 </div>

 <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
 <p className="text-xs font-black text-emerald-500">
 WALLET BALANCE
 </p>

 <p className="mt-3 text-2xl font-black">
 {d?.wallet
 ? money(d.wallet.balance)
 : "-"}
 </p>

 <Link
 href="/dsa/wallet"
 className="mt-5 block rounded-xl bg-blue-600 py-3 text-center text-xs font-black text-white shadow-md transition hover:bg-blue-700"
 >
 Open Wallet →
 </Link>
 </div>
 </div>
 </section>

 {/* RECENT APPLICATIONS */}
 <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-black">
 Recent Applications
 </h2>
 <p className="mt-1 text-sm text-slate-400">
 Latest assigned records
 </p>
 </div>

 <Link
 href="/dsa/loan-applications"
 className="text-xs font-black text-blue-600"
 >
 View All →
 </Link>
 </div>

 {d?.recentApplications?.length ? (
 <div className="mt-5 overflow-x-auto">
 <table className="w-full min-w-[700px] text-left">

 <thead>
 <tr className="border-b text-[10px] font-black uppercase tracking-wider text-slate-400">
 <th className="p-3">#</th>
 <th className="p-3">Customer</th>
 <th className="p-3">Loan Type</th>
 <th className="p-3">Amount</th>
 <th className="p-3">Status</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>

 <tbody>
 {d.recentApplications.map(
 (x: any, i: number) => (
 <tr
 key={x.id}
 className="border-b border-slate-50 text-xs transition hover:bg-slate-50"
 >
 <td className="p-3 font-bold">
 {i + 1}
 </td>

 <td className="p-3 font-black">
 {x.fullName}
 </td>

 <td className="p-3">
 {String(
 x.loanType
 ).replaceAll(
 "_",
 " "
 )}
 </td>

 <td className="p-3 font-bold">
 {money(x.amount)}
 </td>

 <td className="p-3">
 <span
 className={`rounded-full border px-3 py-1 text-[10px] font-black ${
 String(
 x.status
 ).toUpperCase() ===
 "APPROVED"
 ? "border-emerald-100 bg-emerald-50 text-emerald-600"
 : String(
 x.status
 ).toUpperCase() ===
 "REJECTED"
 ? "border-red-100 bg-red-50 text-red-600"
 : "border-amber-100 bg-amber-50 text-amber-600"
 }`}
 >
 {x.status}
 </span>
 </td>

 <td className="p-3 text-slate-400">
 {new Date(
 x.createdAt
 ).toLocaleDateString(
 "en-IN"
 )}
 </td>
 </tr>
 )
 )}
 </tbody>
 </table>
 </div>
 ) : (
 <div className="mt-5 rounded-xl bg-slate-50 p-12 text-center text-sm text-slate-400">
 No applications assigned yet.
 </div>
 )}
 </section>

 {/* QUICK ACTIONS */}
 <section className="grid gap-5 md:grid-cols-2">

 <Link
 href="/dsa/referral"
 className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
 >
 <p className="text-xs font-black text-blue-500">
 GROW YOUR NETWORK
 </p>

 
<div className="DASHBOARD_GIFT_ICON flex items-center justify-center">
 <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-md ring-1 ring-purple-100">
 <span className="text-5xl leading-none drop-shadow-sm">{"🎁"}</span>
 </div>
</div>
<h2 className="mt-2 text-2xl font-black">
 Refer & Earn
 </h2>

 <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
 Refer DSA partners and grow your
 financial network.
 </p>

 <div className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white">
 Open Referrals →
 </div>
 </Link>

 <Link
 href="/dsa/support"
 className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
 >
 <p className="text-xs font-black text-emerald-500">
 PARTNER CARE
 </p>

 <h2 className="mt-2 text-2xl font-black">
 Help & Support
 </h2>

 <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
 We are here to help you with
 your DSA account.
 </p>

 <div className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-white">
 Contact Support →
 </div>
 </Link>
 </section>

 <footer className="pb-5 text-center text-[11px] font-bold tracking-wider text-slate-400">
 © DSA FinCorp * Secure Partner Workspace * Live Database
 </footer>

 </main>
 </div>
 </div>
 </DsaShell>
 );
}







