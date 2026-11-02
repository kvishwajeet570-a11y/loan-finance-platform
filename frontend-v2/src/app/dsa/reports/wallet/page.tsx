"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Row = Record<string, any>;

const pick = (r: Row, ...keys: string[]): any => {
  for (const k of keys) if (r?.[k] !== undefined && r[k] !== null) return r[k];
  return "";
};
const money = (v: any) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(Number(v) || 0);
const dateLabel = (v: any) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};
const statusStyle = (v: string) => {
  const s = v.toUpperCase();
  if (["SUCCESS", "SUCCESSFUL", "COMPLETED"].includes(s)) return "bg-emerald-100 text-emerald-700";
  if (["FAILED", "REJECTED", "CANCELLED"].includes(s)) return "bg-rose-100 text-rose-600";
  if (["PENDING", "PROCESSING"].includes(s)) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
};

export default function WalletReportPage() {
  const [transactions, setTransactions] = useState<Row[]>([]);
  const [wallets, setWallets] = useState<Row[]>([]);
  const [topUsers, setTopUsers] = useState<Row[]>([]);
  const [dashboard, setDashboard] = useState<Row>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
      const token = localStorage.getItem("loan_finance_token");
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const request = async (path: string) => {
        const res = await fetch(`${base}${path}`, { headers, cache: "no-store" });
        if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
        return res.json();
      };
      const results = await Promise.allSettled([
        request("/wallet/dashboard"),
        request("/wallet/analytics"),
        request("/wallet/top-users"),
        request("/transaction"),
        request("/wallet"),
      ]);
      const failures = results.filter(x => x.status === "rejected");
      const unwrap = (x: PromiseSettledResult<any>): any => {
        if (x.status !== "fulfilled") return null;
        const j = x.value;
        if (Array.isArray(j)) return j;
        if (Array.isArray(j?.data)) return j.data;
        for (const k of ["transactions", "wallets", "users", "results"]) {
          if (Array.isArray(j?.[k])) return j[k];
          if (Array.isArray(j?.data?.[k])) return j.data[k];
        }
        return j?.data ?? j;
      };
      if (failures.length === results.length) throw new Error("Wallet APIs returned errors. Check backend and login token.");
      const txRaw = unwrap(results[3]);
      const tx = Array.isArray(txRaw) ? txRaw : Array.isArray(txRaw?.transactions) ? txRaw.transactions : Array.isArray(txRaw?.data) ? txRaw.data : [];
      const ws = unwrap(results[4]);
      const top = unwrap(results[2]);
      const dash = unwrap(results[0]);
      setTransactions(Array.isArray(tx) ? tx : []);
      setWallets(Array.isArray(ws) ? ws : []);
      setTopUsers(Array.isArray(top) ? top : []);
      setDashboard(dash && !Array.isArray(dash) ? dash : {});
      if (failures.length) setError("Some wallet endpoints failed. Displaying data from endpoints that responded.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet report could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const getType = (r: Row) => String(pick(r, "type", "transactionType", "category", "purpose") || "Other").replace(/_/g, " ");
  const getStatus = (r: Row) => String(pick(r, "status", "transactionStatus") || "Unknown");
  const getAmount = (r: Row) => Number(pick(r, "amount", "transactionAmount", "value")) || 0;
  const getDate = (r: Row) => pick(r, "createdAt", "transactionDate", "date", "updatedAt");
  const getUser = (r: Row) => {
    const u = pick(r, "user", "customer", "owner");
    return u?.name || pick(r, "userName", "customerName", "name", "fullName") || "—";
  };
  const getId = (r: Row) => String(pick(r, "transactionId", "referenceId", "id") || "—");
  const getRemark = (r: Row) => String(pick(r, "remark", "description", "purpose", "reference", "narration") || "—");
  const getBalance = (r: Row) => pick(r, "balanceAfter", "walletBalance", "balance", "availableBalance");

  const types = useMemo(() => Array.from(new Set(transactions.map(getType))).sort(), [transactions]);
  const users = useMemo(() => Array.from(new Set(transactions.map(getUser))).filter(x => x !== "—").sort(), [transactions]);

  const filtered = useMemo(() => transactions.filter(r => {
    const q = search.trim().toLowerCase();
    const haystack = [getId(r), getUser(r), getType(r), getStatus(r), getRemark(r), pick(r, "mobile", "phone", "phoneNo")].join(" ").toLowerCase();
    const d = getDate(r) ? new Date(getDate(r)) : null;
    return (!q || haystack.includes(q)) &&
      (type === "ALL" || getType(r) === type) &&
      (status === "ALL" || getStatus(r).toUpperCase() === status) &&
      (userFilter === "ALL" || getUser(r) === userFilter) &&
      (!startDate || (!!d && !Number.isNaN(d.getTime()) && d >= new Date(`${startDate}T00:00:00`))) &&
      (!endDate || (!!d && !Number.isNaN(d.getTime()) && d <= new Date(`${endDate}T23:59:59`)));
  }), [transactions, search, type, status, userFilter, startDate, endDate]);

  useEffect(() => setPage(1), [search, type, status, userFilter, startDate, endDate, pageSize]);

  const totalBalance = Number(pick(dashboard, "totalBalance", "balance", "walletBalance"));
  const balance = totalBalance || wallets.reduce((sum, w) => sum + (Number(pick(w, "balance", "availableBalance")) || 0), 0);
  const credit = transactions.filter(r => ["CREDIT", "ADD_MONEY", "COMMISSION", "RECHARGE", "CASHBACK", "ADJUSTMENT"].some(x => getType(r).toUpperCase().includes(x)))
    .reduce((s, r) => s + getAmount(r), 0);
  const debit = transactions.filter(r => ["DEBIT", "WITHDRAW", "PAYOUT", "TRANSFER"].some(x => getType(r).toUpperCase().includes(x)))
    .reduce((s, r) => s + getAmount(r), 0);
  const totalCount = Number(pick(dashboard, "totalTransactions", "transactionCount")) || transactions.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const typeCounts = types.map(name => ({ name, count: transactions.filter(r => getType(r) === name).length }))
    .sort((a, b) => b.count - a.count).slice(0, 5);
  const totalTypes = Math.max(1, typeCounts.reduce((s, x) => s + x.count, 0));
  const top = topUsers.slice(0, 5);
  const balanceRows = [...transactions].filter(r => getDate(r) && !Number.isNaN(new Date(getDate(r)).getTime())).sort((a, b) => new Date(getDate(a)).getTime() - new Date(getDate(b)).getTime()).slice(-8);
  const trendValue = (r: Row, i: number) => getBalance(r) !== "" ? Number(getBalance(r)) || 0 : transactions.filter(t => new Date(getDate(t) || 0).getTime() <= new Date(getDate(r) || 0).getTime()).reduce((sum, t) => sum + ((["DEBIT", "WITHDRAW", "PAYOUT", "TRANSFER"].some(x => getType(t).toUpperCase().includes(x))) ? -getAmount(t) : getAmount(t)), 0); const maxBal = Math.max(1, ...balanceRows.map((r, i) => trendValue(r, i)));
  const maxUser = Math.max(1, ...top.map(r => Number(pick(r, "balance", "totalEarnings", "totalAmount")) || 0));

  const exportCsv = () => {
    const data = [["Transaction ID", "User", "Type", "Amount", "Balance", "Status", "Date & Time", "Remark"],
      ...filtered.map(r => [getId(r), getUser(r), getType(r), getAmount(r), getBalance(r), getStatus(r), dateLabel(getDate(r)), getRemark(r)])];
    const csv = data.map(row => row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "wallet-report.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Current Balance", value: money(balance), note: "Available wallet balance", icon: "▣", color: "blue" },
    { label: "Total Credit", value: money(credit), note: "Total money added", icon: "♢", color: "green" },
    { label: "Total Debit", value: money(debit), note: "Total amount used", icon: "▣", color: "red" },
    { label: "Total Transactions", value: String(totalCount), note: "All wallet transactions", icon: "⇄", color: "purple" },
  ];

  const palette = ["#10b981", "#2684ff", "#f5a900", "#a855f7", "#f43f5e"];
  const donut = typeCounts.map((x, i) => {
    const before = typeCounts.slice(0, i).reduce((s, y) => s + y.count, 0);
    return `${palette[i % palette.length]} ${before / totalTypes * 100}% ${(before + x.count) / totalTypes * 100}%`;
  }).join(", ");

  return (
    <main className="min-h-screen bg-[#eef4fd] p-3 text-slate-800 sm:p-5">
      <div className="mx-auto max-w-[1800px] space-y-3">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl text-white shadow-lg shadow-blue-200">▣</div>
            <div><h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Wallet Report</h1><p className="mt-1 text-sm text-slate-600">Track wallet balance, transactions, recharges, payouts and wallet activity in real-time.</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">▦ {startDate || "01 Sep 2026"} - {endDate || "13 Oct 2026"}</span>
            <button onClick={exportCsv} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700">⇩ Download Report</button>
          </div>
        </header>

        {error && <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"><span>{error}</span><button onClick={() => void load()} className="font-bold underline">Retry</button></div>}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(c => <div key={c.label} className={`relative rounded-xl border bg-white p-4 shadow-sm ${c.color === "blue" ? "border-blue-100" : c.color === "green" ? "border-emerald-100" : c.color === "red" ? "border-rose-100" : "border-purple-100"}`}>
            <span className={`absolute right-3 top-3 text-sm ${c.color === "blue" ? "text-blue-300" : c.color === "green" ? "text-emerald-300" : c.color === "red" ? "text-rose-300" : "text-purple-300"}`}>×</span>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl text-white shadow-sm ${c.color === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600" : c.color === "green" ? "bg-gradient-to-br from-emerald-400 to-emerald-600" : c.color === "red" ? "bg-gradient-to-br from-rose-400 to-red-600" : "bg-gradient-to-br from-violet-500 to-purple-700"}`}>{c.icon}</div>
              <div className="min-w-0"><p className="text-sm font-semibold text-slate-600">{c.label}</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{loading ? "…" : c.value}</p><p className="mt-1 text-xs text-slate-500">{c.note}</p></div>
            </div>
          </div>)}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(230px,1.6fr)_minmax(120px,.75fr)_minmax(120px,.75fr)_minmax(140px,.8fr)_minmax(135px,.8fr)_minmax(135px,.8fr)_95px_85px]">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="⌕ Search by Txn ID, Name, Remark..." className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3 text-xs outline-none focus:border-blue-500" />
            <select value={type} onChange={e => setType(e.target.value)} className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-3 text-xs font-semibold"><option value="ALL">All Types</option>{types.map(t => <option key={t}>{t}</option>)}</select>
            <select value={status} onChange={e => setStatus(e.target.value)} className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-3 text-xs font-semibold"><option value="ALL">All Status</option>{Array.from(new Set(transactions.map(getStatus))).map(s => <option key={s} value={s.toUpperCase()}>{s}</option>)}</select>
            <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-3 text-xs font-semibold"><option value="ALL">All Users</option>{users.map(u => <option key={u}>{u}</option>)}</select>
            <label className="flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-500">▦ <input type="date" aria-label="Start date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full min-w-0 bg-transparent text-xs outline-none" /></label>
            <label className="flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-500">▦ <input type="date" aria-label="End date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full min-w-0 bg-transparent text-xs outline-none" /></label>
            <button onClick={() => setPage(1)} className="rounded-lg bg-blue-600 px-3 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700">▽ Filter</button>
            <button onClick={() => { setSearch(""); setType("ALL"); setStatus("ALL"); setUserFilter("ALL"); setStartDate(""); setEndDate(""); }} className="rounded-lg border border-slate-200 px-3 py-3 text-xs font-bold hover:bg-slate-50">↻ Reset</button>
          </div>
        </section>

        <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(330px,.9fr)]">
          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600">▣</div><div><h2 className="font-extrabold text-slate-950">Wallet Transactions</h2><p className="mt-1 text-xs text-slate-500">All credit, debit, recharge, payout and adjustment records.</p></div></div>
              <div className="flex gap-2"><button onClick={exportCsv} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">⇩ Export CSV</button><button onClick={() => window.print()} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">▤ Export PDF</button><button onClick={() => void load()} aria-label="Refresh transactions" className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">↻</button></div>
            </div>
            <div className="overflow-x-auto px-2">
              <table className="w-full min-w-[1120px] border-collapse text-left text-xs">
                <thead className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white"><tr>
                  <th className="px-3 py-3"><input type="checkbox" aria-label="Select all visible transactions" checked={visible.length > 0 && visible.every(r => selected.includes(getId(r)))} onChange={e => setSelected(e.target.checked ? Array.from(new Set([...selected, ...visible.map(getId)])) : selected.filter(id => !visible.some(r => getId(r) === id)))} /></th>
                  {["#", "TRANSACTION ID", "USER / NAME", "TYPE", "AMOUNT", "BALANCE", "STATUS", "DATE & TIME", "REMARK"].map(h => <th key={h} className="whitespace-nowrap px-3 py-3 font-bold">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? <tr><td colSpan={10} className="p-12 text-center text-slate-500">Loading transactions from backend…</td></tr> : visible.length === 0 ? <tr><td colSpan={10} className="p-12 text-center text-slate-500">No transactions found in the returned API records.</td></tr> : visible.map((r, i) => {
                    const id = getId(r);
                    const t = getType(r).toUpperCase();
                    const isDebit = ["DEBIT", "WITHDRAW", "PAYOUT", "TRANSFER"].some(x => t.includes(x));
                    return <tr key={id + i} className="hover:bg-blue-50/60">
                      <td className="px-3 py-3"><input type="checkbox" aria-label={`Select transaction ${id}`} checked={selected.includes(id)} onChange={e => setSelected(old => e.target.checked ? [...old, id] : old.filter(x => x !== id))} /></td>
                      <td className="px-3 py-3 text-slate-500">{(page - 1) * pageSize + i + 1}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-blue-700">{id}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-semibold">{getUser(r)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{getType(r)}</td>
                      <td className={`whitespace-nowrap px-3 py-3 font-bold ${isDebit ? "text-rose-600" : "text-emerald-600"}`}>{isDebit ? "− " : "+ "}{money(getAmount(r))}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-semibold">{getBalance(r) !== "" ? money(getBalance(r)) : "—"}</td>
                      <td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-3 py-1.5 font-bold ${statusStyle(getStatus(r))}`}>{getStatus(r)}</span></td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">{dateLabel(getDate(r))}</td>
                      <td className="max-w-44 truncate px-3 py-3 text-slate-500" title={getRemark(r)}>{getRemark(r)}</td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <p className="text-xs text-slate-500">Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} transactions</p>
              <div className="flex items-center gap-1.5"><button disabled={page === 1} onClick={() => setPage(1)} className="rounded-md border px-2.5 py-2 disabled:opacity-40">«</button><button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-md border px-2.5 py-2 disabled:opacity-40">‹</button>{Array.from({ length: Math.min(5, totalPages) }, (_, i) => Math.min(Math.max(1, page - 2) + i, totalPages)).filter((n, i, a) => a.indexOf(n) === i).map(n => <button key={n} onClick={() => setPage(n)} className={`rounded-md border px-3 py-2 text-xs font-bold ${n === page ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 hover:bg-slate-50"}`}>{n}</button>)}<button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-md border px-2.5 py-2 disabled:opacity-40">›</button><button disabled={page >= totalPages} onClick={() => setPage(totalPages)} className="rounded-md border px-2.5 py-2 disabled:opacity-40">»</button><span className="ml-3 text-xs text-slate-500">Show</span><select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="rounded-md border border-slate-200 bg-white px-2 py-2 text-xs">{[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}</select><span className="text-xs text-slate-500">per page</span></div>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-950">Wallet Balance Trend</h2>
                  <p className="mt-1 text-xs text-slate-500">Balance history from available API records</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-slate-600"><i className="h-2.5 w-2.5 rounded-full bg-blue-600"></i>Balance</span>
              </div>
              {balanceRows.length > 0 ? (() => {
                const values = balanceRows.map((r,i) => trendValue(r,i));
                const low = Math.min(0,...values);
                const high = Math.max(1,...values);
                const range = Math.max(1,high-low);
                const pts = values.map((v,i)=>({x: balanceRows.length===1 ? 210 : i*420/(balanceRows.length-1), y: 110-((v-low)/range)*90, value:v}));
                const line = pts.map(p=>`${p.x},${p.y}`).join(" ");
                const area = `0,120 ${line} 420,120`;
                const last = values[values.length-1];
                return <div className="mt-4">
                  <div className="relative h-36 pl-9 pr-1">
                    <div className="absolute inset-y-0 left-9 right-1 flex flex-col justify-between text-[9px] text-slate-500">
                      {[4,3,2,1,0].map(n=><div key={n} className="relative border-t border-dashed border-slate-200"><span className="absolute -left-9 -top-2.5 w-8 text-left">₹{Math.round((low+range*n/4)).toLocaleString("en-IN")}</span></div>)}
                    </div>
                    <svg viewBox="0 0 420 120" preserveAspectRatio="none" className="relative z-10 h-full w-full overflow-visible">
                      <defs><linearGradient id="walletAreaReference" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1677ff" stopOpacity=".28"/><stop offset="100%" stopColor="#1677ff" stopOpacity=".02"/></linearGradient></defs>
                      {pts.length>1 && <polygon points={area} fill="url(#walletAreaReference)"/>}
                      {pts.length>1 && <polyline points={line} fill="none" stroke="#0866f5" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>}
                      {pts.map((p,i)=><circle key={getId(balanceRows[i])+i} cx={p.x} cy={p.y} r="3.6" fill="#0866f5" stroke="#fff" strokeWidth="1.4"/>)}
                    </svg>
                    <span className="absolute right-1 top-1 rounded-md bg-blue-950 px-2 py-1 text-[10px] font-bold text-white">₹{Number(last).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="ml-9 mt-1 flex justify-between gap-1 text-[9px] text-slate-500">{balanceRows.map((r,i)=><span key={getId(r)+i}>{getDate(r)?new Date(getDate(r)).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}):""}</span>)}</div>
                </div>;
              })() : <div className="flex h-40 items-center justify-center text-center text-xs text-slate-400">No dated wallet transactions available to plot.</div>}
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-950">Transaction Type Overview</h2><p className="mt-1 text-xs text-slate-500">Distribution by transaction type</p>
              {typeCounts.length ? <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(${donut})` }}><div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white"><b className="text-xl text-slate-900">{transactions.length}</b><span className="text-[10px] text-slate-500">Total</span></div></div>
                <div className="min-w-[135px] flex-1 space-y-3">{typeCounts.map((x, i) => <div key={x.name} className="flex items-center justify-between gap-2 text-xs"><span className="flex items-center gap-2 text-slate-600"><i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: palette[i % palette.length] }} /><span>{x.name}</span></span><b className="whitespace-nowrap">{x.count} ({Math.round(x.count / totalTypes * 100)}%)</b></div>)}</div>
              </div> : <div className="py-9 text-center text-xs text-slate-400">No transaction type data returned by API.</div>}
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-950">Top Users by Wallet Activity</h2><p className="mt-1 text-xs text-slate-500">Top users returned by backend</p>
              {top.length ? <div className="mt-4 space-y-3">{top.map((u, i) => { const name = pick(u, "user", "owner")?.name || pick(u, "name", "fullName", "userName") || "User"; const amount = Number(pick(u, "balance", "totalEarnings", "totalAmount")) || 0; return <div key={String(pick(u, "id", "userId") || i)} className="flex items-center gap-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">♙</span><span className="w-24 shrink-0 truncate text-xs font-medium text-slate-700">{name}</span><div className="h-2 min-w-8 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-300" style={{ width: `${amount / maxUser * 100}%` }} /></div><b className="whitespace-nowrap text-xs">{money(amount)}</b></div>; })}</div> : <div className="py-7 text-xs text-slate-400">No top-user records returned by API.</div>}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}











