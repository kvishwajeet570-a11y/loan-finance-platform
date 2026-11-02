"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users, FileText, ShieldCheck, IndianRupee, Clock3,
  BriefcaseBusiness, Wallet, CreditCard, RefreshCw,
  Download, MapPin, Activity, TrendingUp, Crown,
  AlertCircle, BarChart3
} from "lucide-react";
import {ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, LabelList } from "recharts";
import { IndiaSvgMap } from "vardhan-maps/react";
import api from "@/lib/api";

type AnyData = any;

const C = {
  blue: "#168bff", purple: "#b33cff", green: "#00d49a",
  yellow: "#ffb323", pink: "#ff397b", cyan: "#08c8f8"
};

const STATE_POINTS: Record<string, {x:number;y:number}> = {
  "bihar":{x:67,y:47},"jharkhand":{x:65,y:54},
  "uttar pradesh":{x:59,y:42},"delhi":{x:54,y:39},
  "maharashtra":{x:43,y:68},"karnataka":{x:48,y:81},
  "tamil nadu":{x:55,y:90},"west bengal":{x:74,y:53},
  "rajasthan":{x:37,y:48},"gujarat":{x:29,y:57},
  "madhya pradesh":{x:49,y:57},"punjab":{x:45,y:32},
  "haryana":{x:51,y:37},"assam":{x:86,y:46},
  "kerala":{x:49,y:91},"odisha":{x:68,y:65},
  "chhattisgarh":{x:59,y:63},"telangana":{x:57,y:75},
  "goa":{x:39,y:76},"uttarakhand":{x:62,y:32},
  "himachal pradesh":{x:57,y:27},"sikkim":{x:78,y:43}
};

const unwrap = (r:AnyData) => r?.data?.data ?? r?.data ?? {};
const arr = (v:AnyData):AnyData[] => Array.isArray(v) ? v : [];
const rowsFrom = (v:AnyData, depth = 0):AnyData[] => {
  if (depth > 5 || v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v !== "object") return [];
  for (const key of ["data","items","results","loanTypes","products","statuses","statusCounts","records"]) {
    if (v[key] !== undefined && v[key] !== v) {
      const found = rowsFrom(v[key], depth + 1);
      if (found.length) return found;
    }
  }
  return [];
};
const num = (v:AnyData) => typeof v === "number" && Number.isFinite(v) ? v : null;
const fmt = (v:AnyData) => num(v) === null ? "—" : new Intl.NumberFormat("en-IN").format(v);
const money = (v:AnyData) => num(v) === null ? "—" : "₹" + new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(v);
const pick = (o:AnyData, keys:string[]) => {
  for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null) return o[k];
  return null;
};

function Panel({title,subtitle,icon:Icon,children,className=""}:AnyData) {
  return <section className={`rounded-2xl border border-cyan-400/20 bg-[#06182b] p-3 shadow-[0_0_22px_rgba(0,180,255,.06)] ${className}`}>
    <div className="mb-3 flex items-center gap-2">
      <Icon size={19} className="text-cyan-300"/>
      <div><h2 className="text-sm font-black text-white">{title}</h2>
      <p className="text-[10px] text-slate-400">{subtitle}</p></div>
    </div>
    {children}
  </section>;
}

function KpiCard({title,value,note,icon:Icon,color,glow}:AnyData) {
  return <div className="relative flex min-h-[112px] items-center gap-3 overflow-hidden rounded-2xl border bg-gradient-to-br from-[#102a43] to-[#061426] p-3"
    style={{borderColor:color+"99",boxShadow:`0 0 17px ${glow}`}}>
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
      style={{background:`${color}25`,border:`1px solid ${color}88`,color,boxShadow:`0 0 18px ${glow}`}}>
      <Icon size={27}/>
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-300">{title}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-[9px] text-slate-400">{note}</p>
    </div>
    <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full blur-2xl" style={{background:glow}}/>
  </div>;
}

export default function KpiPerformancePage() {
  const [dashboard,setDashboard] = useState<AnyData>({});
  const [monthly,setMonthly] = useState<AnyData[]>([]);
  const [statuses,setStatuses] = useState<AnyData[]>([]);
  const [products,setProducts] = useState<AnyData[]>([]);
  const [customers,setCustomers] = useState<AnyData[]>([]);
  const [activities,setActivities] = useState<AnyData[]>([]);
  const [commission,setCommission] = useState<AnyData>({});
  const [dsaRows,setDsaRows] = useState<AnyData[]>([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const endpoints = [
      "/analytics/dashboard",
      "/analytics/monthly-loans",
      "/analytics/loan-status",
      "/analytics/loan-type",
      "/analytics/top-customers",
      "/analytics/recent-activities",
      "/super-admin/commission-dashboard",
      "/super-admin/dsa"
    ];
    const results = await Promise.allSettled(endpoints.map(p => api.get(p)));
    const data = results.map(r => r.status === "fulfilled" ? unwrap(r.value) : null);

    if (results.every(r => r.status === "rejected")) {
      setError("Analytics APIs could not be reached. Please check your connection and permissions.");
    }

    setDashboard(data[0]?.statistics ?? data[0]?.data?.statistics ?? {});
    setMonthly(arr(data[1]?.data ?? data[1]?.monthlyLoans ?? data[1]?.monthly ?? data[1]));
    setStatuses(rowsFrom(data[2]).map((x:any) => ({
      ...x,
      status: String(pick(x,["status","name","_id","label","loanStatus"]) ?? "Unknown"),
      count: Number(pick(x,["count","total","value","applications","totalApplications"]) ?? x?._count?.status ?? x?._count?.id ?? x?._count?._all ?? 0)
    })).filter((x:any) => Number.isFinite(x.count) && x.count > 0));
    setProducts(rowsFrom(data[3]).map((x:any,i:number) => ({
      ...x,
      loanType: String(pick(x,["loanType","type","name","product","productName","_id","label"]) ?? `Product ${i+1}`),
      count: Number(pick(x,["count","total","applications","totalLoans","totalApplications","applicationCount"]) ?? x?._count?.loanType ?? x?._count?.id ?? x?._count?._all ?? 0)
    })).filter((x:any) => Number.isFinite(x.count) && x.count > 0));
    setCustomers(arr(data[4]?.data ?? data[4]?.customers ?? data[4]));
    setActivities(arr(data[5]?.data ?? data[5]?.activities ?? data[5]));
    setCommission(data[6]?.data ?? data[6] ?? {});
    setDsaRows(arr(data[7]?.data ?? data[7]?.dsa ?? data[7]));
    setLoading(false);
  },[]);

  useEffect(() => {
    load();
    const timer = setInterval(load,30000);
    return () => clearInterval(timer);
  },[load]);

  const totalUsers = pick(dashboard,["totalUsers"]);
  const totalLoans = pick(dashboard,["totalLoans"]);
  const pendingLoans = pick(dashboard,["pendingLoans"]);
  const totalCommission = pick(commission,["totalCommissionAmount","transactionCommission"]);
  const activeDsa = dsaRows.length ? dsaRows.filter(x => x.isActive === true || x.active === true).length : null;

  const stateRows = useMemo(() => {
    const counts:Record<string,number> = {};
    activities.forEach((a) => {
      const candidates = [a,a.user,a.customer,a.profile,a.loan,a.metadata,a.details].filter(Boolean);
      let state = "";
      for (const o of candidates) {
        state = pick(o,["state","stateName","state_name","currentState","permanentState","addressState","city","cityName","location","region"]) ?? "";
        if (typeof state === "string" && state.trim()) break;
        state = "";
      }
      const key = String(state).trim();
      if (key && STATE_POINTS[key.toLowerCase()]) counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name,count]) => ({name,count}))
      .sort((a,b) => b.count-a.count).slice(0,5);
  },[activities]);

  const maxState = Math.max(1,...stateRows.map(x=>x.count));
  const maxProduct = Math.max(1,...products.map(x=>Number(pick(x,["count","total","applications","totalLoans"]))||0));
  const statusColors = [C.green,C.blue,C.yellow,C.pink,C.purple,C.cyan];
  const statusData = statuses.map((s) => ({
    name:String(pick(s,["status","name","_id"]) ?? "Unknown"),
    value:Number(pick(s,["count","total","value"]) ?? 0)
  })).filter(x=>x.value>0);

  const trendData = monthly.map((m) => ({
    month:String(pick(m,["month","label","_id"]) ?? ""),
    applications:Number(pick(m,["count","total","applications","totalLoans"]) ?? 0),
    kyc:Number(pick(m,["kycCompleted","kyc","completedKyc"]) ?? 0),
    disbursed:Number(pick(m,["disbursed","disbursedCount"]) ?? 0)
  }));

  const exportReport = () => {
    const rows = [
      ["Metric","Value"],
      ["Total Users",fmt(totalUsers)],
      ["Loan Applications",fmt(totalLoans)],
      ["KYC Completed","Unavailable - verified metric not connected"],
      ["Total Disbursed","Unavailable - verified metric not connected"],
      ["Pending Applications",fmt(pendingLoans)],
      ["Active DSAs",fmt(activeDsa)],
      ["Total Commission",money(totalCommission)],
      ["New Accounts (KYP)","Unavailable - verified metric not connected"],
      [],
      ["Top States","Activity Count"],
      ...stateRows.map(s=>[s.name,s.count])
    ];
    const csv = rows.map(r=>r.map(x=>`"${String(x ?? "").replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url;a.download=`AIFIN-KPI-${new Date().toISOString().slice(0,10)}.csv`;a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    {title:"Total Users",value:fmt(totalUsers),note:"Registered platform users",icon:Users,color:C.blue,glow:"rgba(22,139,255,.3)"},
    {title:"Loan Applications",value:fmt(totalLoans),note:"All recorded applications",icon:FileText,color:C.purple,glow:"rgba(179,60,255,.3)"},
    {title:"KYC Completed",value:"—",note:"Verified KYC metric unavailable",icon:ShieldCheck,color:C.green,glow:"rgba(0,212,154,.3)"},
    {title:"Total Disbursed",value:"—",note:"Verified disbursal metric unavailable",icon:IndianRupee,color:C.yellow,glow:"rgba(255,179,35,.3)"},
    {title:"Pending Applications",value:fmt(pendingLoans),note:"Current pending loan records",icon:Clock3,color:C.pink,glow:"rgba(255,57,123,.3)"},
    {title:"Active DSAs",value:fmt(activeDsa),note:"Verified active flag only",icon:BriefcaseBusiness,color:C.cyan,glow:"rgba(8,200,248,.3)"},
    {title:"Total Commission",value:money(totalCommission),note:"Commission dashboard aggregate",icon:Wallet,color:C.blue,glow:"rgba(22,139,255,.3)"},
    {title:"New Accounts (KYP)",value:"—",note:"Verified KYP metric unavailable",icon:CreditCard,color:C.purple,glow:"rgba(179,60,255,.3)"}
  ];

  return <main className="min-h-screen bg-[#020b18] p-3 text-white sm:p-5">
    <div className="mx-auto max-w-[1800px] space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/20 pb-4">
        <div>
          <p className="text-[10px] font-black tracking-[.2em] text-cyan-300">DATA DRIVEN INSIGHTS</p>
          <h1 className="text-3xl font-black tracking-tight">KPI &amp; Performance</h1>
          <p className="text-xs text-slate-400">Complete business analytics, growth metrics &amp; performance insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-blue-300/20 bg-[#0b2038] px-4 py-2 text-xs">
            <b>Last 30 Days</b><p className="text-[10px] text-slate-400">Live backend reporting</p>
          </div>
          <button onClick={load} disabled={loading} className="rounded-xl border border-cyan-300/30 bg-[#0b2038] p-3 text-cyan-200 hover:bg-blue-500/20">
            <RefreshCw size={18} className={loading?"animate-spin":""}/>
          </button>
          <button onClick={exportReport} className="flex items-center gap-2 rounded-xl border border-blue-400 bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-3 text-xs font-black shadow-[0_0_20px_rgba(22,139,255,.3)]">
            <Download size={16}/> Export Report
          </button>
        </div>
      </header>

      {error && <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200"><AlertCircle className="mr-2 inline" size={15}/>{error}</div>}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(c=><KpiCard key={c.title} {...c}/>)}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-3 2xl:grid-cols-[1fr_1fr]">
        <Panel title="India Activity Heatmap" subtitle="State-wise platform activity · Backend location records" icon={MapPin}>
          <div className="grid min-w-0 gap-3 lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-cyan-300/15 bg-[#031326] p-2">
              <div className="pointer-events-none absolute inset-0 opacity-30" style={{backgroundImage:"linear-gradient(rgba(34,211,238,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.12) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
              <div className="relative z-10 w-full max-w-[430px] [&_svg]:!h-auto [&_svg]:!w-full [&_path]:!fill-[#0b3554] [&_path]:!stroke-cyan-300 [&_path]:!stroke-[0.7]">
                <IndiaSvgMap level="state" resolution="low"/>
              </div>
              {stateRows.map((s,i)=>{
                const p=STATE_POINTS[s.name.toLowerCase()];
                if(!p)return null;
                const color=[C.pink,C.yellow,C.cyan,C.purple,C.green][i];
                return <div key={s.name} className="absolute z-20" style={{left:`${p.x}%`,top:`${p.y}%`}}>
                  <span className="absolute -inset-2 animate-ping rounded-full opacity-60" style={{background:color}}/>
                  <span className="relative block h-3 w-3 rounded-full border-2 border-white shadow-[0_0_15px_currentColor]" style={{background:color,color}} title={`${s.name}: ${s.count}`}/>
                </div>;
              })}
              <span className="absolute bottom-2 left-3 text-[8px] text-slate-500">Geographic illustration · Not GPS tracking</span>
            </div>
            <div className="rounded-xl border border-cyan-300/15 bg-gradient-to-b from-[#0b2038] to-[#071326] p-3">
              <div className="mb-3 flex items-center justify-between"><b className="text-sm">Top States</b><span className="rounded-full border border-cyan-400/30 px-2 py-1 text-[9px] text-cyan-300">{stateRows.length} LOCATIONS</span></div>
              {stateRows.length ? <div className="space-y-4">{stateRows.map((s,i)=>{
                const color=[C.yellow,C.blue,C.pink,C.purple,C.cyan][i];
                return <div key={s.name}>
                  <div className="mb-1 flex items-center gap-2 text-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md font-black text-slate-950" style={{background:color}}>{i+1}</span>
                    <b className="flex-1" style={{color}}>{s.name}</b>
                    <b>{fmt(s.count)}</b><span className="w-10 text-right text-slate-400">{Math.round(s.count/maxState*100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full" style={{width:`${s.count/maxState*100}%`,background:`linear-gradient(90deg,${color},${C.cyan})`,boxShadow:`0 0 12px ${color}`}}/></div>
                </div>;
              })}</div> : <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-cyan-300/20 p-4 text-center"><MapPin size={28} className="mb-3 text-cyan-300"/><b className="text-xs">State activity data not available</b><p className="mt-2 text-[10px] text-slate-500">The API has not returned usable state or city fields. No sample locations are displayed.</p></div>}
            </div>
          </div>
        </Panel>

        <Panel title="Application Trend" subtitle="Monthly applications, KYC completed and disbursed" icon={Activity}>
          <div className="h-[320px]">
            {trendData.length ? <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{top:15,right:12,left:0,bottom:5}}>
                <CartesianGrid stroke="#18334b" strokeDasharray="3 3"/>
                <XAxis dataKey="month" tick={{fill:"#94a3b8",fontSize:10}}/>
                <YAxis tick={{fill:"#94a3b8",fontSize:10}}/>
                <Tooltip contentStyle={{background:"#07182b",border:"1px solid #24516d",borderRadius:12,color:"#fff"}}/>
                <Line type="monotone" dataKey="applications" name="Applications" stroke={C.cyan} strokeWidth={3} dot={{r:3}}/>
                {trendData.some(x=>x.kyc>0)&&<Line type="monotone" dataKey="kyc" name="KYC Completed" stroke={C.purple} strokeWidth={3} dot={{r:3}}/>}
                {trendData.some(x=>x.disbursed>0)&&<Line type="monotone" dataKey="disbursed" name="Disbursed" stroke={C.green} strokeWidth={3} dot={{r:3}}/>}
              </LineChart>
            </ResponsiveContainer> : <div className="flex h-full items-center justify-center text-xs text-slate-500">No monthly trend records returned by API</div>}
          </div>
          <div className="flex flex-wrap gap-4 border-t border-cyan-300/10 pt-3 text-[10px] text-slate-300">
            <span style={{color:C.cyan}}>● Applications</span><span style={{color:C.purple}}>● KYC (when available)</span><span style={{color:C.green}}>● Disbursed (when available)</span>
          </div>
        </Panel>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[1.05fr_1fr]">
        <Panel title="Loan Product Performance" subtitle="Applications by loan product" icon={BarChart3}>
          <div className="h-[280px]">
            {products.length ? <ResponsiveContainer width="100%" height="100%">
              <BarChart data={products} margin={{top:15,right:8,left:0,bottom:25}}>
                <CartesianGrid stroke="#18334b" strokeDasharray="3 3"/>
                <XAxis dataKey="loanType" tick={{fill:"#cbd5e1",fontSize:10}}/>
                <YAxis tick={{fill:"#94a3b8",fontSize:10}}/>
                <Tooltip contentStyle={{background:"#07182b",border:"1px solid #24516d",borderRadius:12,color:"#fff"}}/>
                <Bar dataKey="count" name="Applications" radius={[8,8,0,0]} minPointSize={5} maxBarSize={52}>
                  {products.map((_,i)=><Cell key={i} fill={[C.blue,C.purple,C.cyan,C.green,C.yellow,C.pink][i%6]}/>)}
                <LabelList dataKey="count" position="top" fill="#e2e8f0" fontSize={11} fontWeight={700}/></Bar>
              </BarChart>
            </ResponsiveContainer> : <div className="flex h-full items-center justify-center text-xs text-slate-500">No loan product records returned by API</div>}
          </div>
        </Panel>

        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
          <Panel title="Application Status Distribution" subtitle="Status counts from loan analytics API" icon={ShieldCheck}>
            <div className="h-[280px]">
              {statusData.length ? <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={108} paddingAngle={5} stroke="#06182b" strokeWidth={3} cornerRadius={5}>
                    {statusData.map((_,i)=><Cell key={i} fill={statusColors[i%statusColors.length]}/>)}
                  </Pie>
                  <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="25" fontWeight="900">
                    {fmt(statusData.reduce((sum,s) => sum + s.value,0))}
                  </text>
                  <text x="50%" y="58%" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    Total Records
                  </text>
                  <Tooltip contentStyle={{background:"#07182b",border:"1px solid #24516d",borderRadius:12,color:"#fff"}}/>
                </PieChart>
              </ResponsiveContainer> : <div className="flex h-full items-center justify-center text-center text-xs text-slate-500">No status distribution records returned by API</div>}
            </div>
            <div className="space-y-2">{statusData.map((s,i)=><div key={s.name} className="flex items-center justify-between text-xs"><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-sm" style={{background:statusColors[i%statusColors.length]}}/>{s.name}</span><b>{fmt(s.value)}</b></div>)}</div>
          </Panel>

          <Panel title="Top Customers" subtitle="Top customer records from analytics API" icon={Crown}>
            <div className="space-y-3">
              {customers.slice(0,5).map((c,i)=>{
                const name=pick(c,["name","fullName","customerName"]) ?? "Customer";
                const amount=pick(c,["totalAmount","loanAmount","amount","totalLoansAmount"]);
                const count=pick(c,["loanCount","totalLoans","count"]);
                const color=[C.yellow,C.blue,C.pink,C.purple,C.cyan][i];
                return <div key={c.id ?? i} className="flex items-center gap-2 rounded-lg border border-cyan-300/10 bg-[#0a2035] p-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md font-black text-slate-950" style={{background:color}}>{i+1}</span>
                  <div className="min-w-0 flex-1"><b className="block truncate text-xs">{name}</b><span className="text-[9px] text-slate-400">{count===null?"Loan count unavailable":`${fmt(count)} loans`}</span></div>
                  <b className="text-xs text-cyan-300">{money(amount)}</b>
                </div>;
              })}
              {!customers.length&&<div className="flex min-h-[180px] items-center justify-center text-center text-xs text-slate-500">No top customer records returned by API</div>}
            </div>
          </Panel>
        </div>
      </section>
      <p className="pb-3 text-center text-[9px] text-slate-600">AIFIN · KPI data is sourced from connected backend analytics APIs</p>
    </div>
  </main>;
}





