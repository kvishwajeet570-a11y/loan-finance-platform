"use client";

import { useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

type Lead = {
  id: number;
  customer: string;
  mobile: string;
  loanType: string;
  amount: string;
  agent: string;
  status: "Converted" | "In Progress" | "Pending" | "Rejected";
  date: string;
};

const leads: Lead[] = [
  {
    id: 1,
    customer: "Rahul Sharma",
    mobile: "9876543210",
    loanType: "Personal Loan",
    amount: "₹5,00,000",
    agent: "Rakesh Kumar",
    status: "Converted",
    date: "26 Sep 2026",
  },
  {
    id: 2,
    customer: "Priya Kumari",
    mobile: "9123456780",
    loanType: "Home Loan",
    amount: "₹25,00,000",
    agent: "Suman Yadav",
    status: "In Progress",
    date: "26 Sep 2026",
  },
  {
    id: 3,
    customer: "Amit Verma",
    mobile: "9988776655",
    loanType: "Business Loan",
    amount: "₹10,00,000",
    agent: "Rakesh Kumar",
    status: "Pending",
    date: "25 Sep 2026",
  },
  {
    id: 4,
    customer: "Neha Singh",
    mobile: "8877665544",
    loanType: "Car Loan",
    amount: "₹8,00,000",
    agent: "Amit Singh",
    status: "In Progress",
    date: "25 Sep 2026",
  },
  {
    id: 5,
    customer: "Vikas Yadav",
    mobile: "7766554433",
    loanType: "Personal Loan",
    amount: "₹3,00,000",
    agent: "Neha Verma",
    status: "Rejected",
    date: "24 Sep 2026",
  },
  {
    id: 6,
    customer: "Suresh Patel",
    mobile: "9012345678",
    loanType: "Business Loan",
    amount: "₹15,00,000",
    agent: "Suman Yadav",
    status: "Converted",
    date: "24 Sep 2026",
  },
  {
    id: 7,
    customer: "Anjali Gupta",
    mobile: "9334455667",
    loanType: "Home Loan",
    amount: "₹20,00,000",
    agent: "Rakesh Kumar",
    status: "Pending",
    date: "23 Sep 2026",
  },
  {
    id: 8,
    customer: "Manish Yadav",
    mobile: "7778889990",
    loanType: "Personal Loan",
    amount: "₹4,00,000",
    agent: "Amit Singh",
    status: "In Progress",
    date: "23 Sep 2026",
  },
  {
    id: 9,
    customer: "Pooja Kumari",
    mobile: "9090909090",
    loanType: "Gold Loan",
    amount: "₹2,50,000",
    agent: "Neha Verma",
    status: "Converted",
    date: "22 Sep 2026",
  },
  {
    id: 10,
    customer: "Rohit Kumar",
    mobile: "8989898989",
    loanType: "LAP",
    amount: "₹35,00,000",
    agent: "Rakesh Kumar",
    status: "Pending",
    date: "21 Sep 2026",
  },
];

const agents = [
  { rank: 1, name: "Rakesh Kumar", leads: 42, converted: 28 },
  { rank: 2, name: "Suman Yadav", leads: 28, converted: 18 },
  { rank: 3, name: "Amit Singh", leads: 20, converted: 12 },
  { rank: 4, name: "Neha Verma", leads: 18, converted: 10 },
  { rank: 5, name: "Vikas Kumar", leads: 15, converted: 8 },
];

const activities = [
  {
    text: "New lead assigned to Rakesh Kumar",
    time: "5 mins ago",
    icon: UserPlus,
  },
  {
    text: "Lead converted - Home Loan",
    time: "12 mins ago",
    icon: CheckCircle2,
  },
  {
    text: "New lead from Website Form",
    time: "25 mins ago",
    icon: FileText,
  },
  {
    text: "Lead status updated to In Progress",
    time: "1 hour ago",
    icon: Activity,
  },
  {
    text: "Lead rejected - Low CIBIL Score",
    time: "2 hours ago",
    icon: XCircle,
  },
];

function statusStyle(status: Lead["status"]) {
  if (status === "Converted") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "Rejected") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  if (status === "Pending") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-blue-50 text-blue-700 ring-blue-200";
}

export default function SubAgentLeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [agent, setAgent] = useState("ALL");
  const [loanType, setLoanType] = useState("ALL");
  const [page, setPage] = useState(1);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();

      const matchesSearch =
        !q ||
        lead.customer.toLowerCase().includes(q) ||
        lead.mobile.includes(q) ||
        lead.loanType.toLowerCase().includes(q) ||
        lead.agent.toLowerCase().includes(q);

      const matchesStatus = status === "ALL" || lead.status === status;
      const matchesAgent = agent === "ALL" || lead.agent === agent;
      const matchesLoan = loanType === "ALL" || lead.loanType === loanType;

      return matchesSearch && matchesStatus && matchesAgent && matchesLoan;
    });
  }, [search, status, agent, loanType]);

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setAgent("ALL");
    setLoanType("ALL");
    setPage(1);
  };

  return (
    <DsaShell>
      <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 overflow-x-hidden px-3 pb-8 sm:px-5 lg:px-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Dashboard</span>
              <span>/</span>
              <span>Sub Agent</span>
              <span>/</span>
              <span className="text-blue-600">Leads</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <Users size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Sub Agent Leads
                </h1>
                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  Manage, track and convert leads generated by your Sub Agents.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
              <CalendarDays size={16} />
              01 Sep 2026 - 26 Sep 2026
              <ChevronDown size={15} />
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800">
              <Download size={16} />
              Export
              <ChevronDown size={14} />
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-indigo-700">
              <Plus size={17} />
              Add New Lead
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              title: "Total Leads",
              value: "142",
              change: "+18%",
              note: "All Sub Agent Leads",
              icon: Users,
              box: "from-blue-50 to-indigo-50",
              iconBg: "bg-blue-600",
            },
            {
              title: "Active Leads",
              value: "96",
              change: "+12%",
              note: "In Progress",
              icon: Activity,
              box: "from-emerald-50 to-green-50",
              iconBg: "bg-emerald-600",
            },
            {
              title: "Converted",
              value: "28",
              change: "+25%",
              note: "Loan Approved",
              icon: UserCheck,
              box: "from-amber-50 to-yellow-50",
              iconBg: "bg-amber-500",
            },
            {
              title: "Rejected",
              value: "8",
              change: "-10%",
              note: "Not Eligible",
              icon: XCircle,
              box: "from-rose-50 to-red-50",
              iconBg: "bg-rose-500",
            },
            {
              title: "Pending",
              value: "38",
              change: "+5%",
              note: "Under Review",
              icon: Clock3,
              box: "from-violet-50 to-purple-50",
              iconBg: "bg-violet-600",
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`rounded-2xl border border-white bg-gradient-to-br ${card.box} p-4 shadow-sm ring-1 ring-slate-100`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-950">
                      {card.value}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-600">
                        {card.change}
                      </span>
                      <TrendingUp size={12} className="text-emerald-500" />
                    </div>

                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      {card.note}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-md`}
                  >
                    <Icon size={19} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ANALYTICS */}
        <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr_0.95fr]">
          {/* TREND */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-950">
                  Lead Trend
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  Last 30 days performance
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  Total Leads
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Converted
                </span>
              </div>
            </div>

            <div className="relative mt-5 h-48 overflow-hidden rounded-xl bg-slate-50 p-4">
              <div className="absolute inset-x-4 top-6 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-4 bottom-8 border-t border-dashed border-slate-200" />

              <div className="absolute bottom-8 left-4 right-4 flex items-end justify-between gap-2">
                {[34, 42, 38, 50, 46, 61, 55, 70, 64, 78, 72, 88, 82, 96].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="group relative flex h-36 flex-1 items-end"
                    >
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-400 transition-all group-hover:from-blue-700 group-hover:to-indigo-500"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[9px] font-bold text-slate-400">
                <span>27 Aug</span>
                <span>31 Aug</span>
                <span>4 Sep</span>
                <span>8 Sep</span>
                <span>12 Sep</span>
                <span>16 Sep</span>
                <span>20 Sep</span>
                <span>24 Sep</span>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-950">
              Lead Status Distribution
            </h2>

            <div className="mt-6 flex items-center justify-center">
              <div
                className="relative flex h-36 w-36 items-center justify-center rounded-full"
                style={{
                  background:
                    "conic-gradient(#2563eb 0deg 244deg, #10b981 244deg 315deg, #f59e0b 315deg 350deg, #f43f5e 350deg 360deg)",
                }}
              >
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-2xl font-black text-slate-950">
                    142
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Total Leads
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              {[
                ["In Progress", "96", "bg-blue-600"],
                ["Converted", "28", "bg-emerald-500"],
                ["Pending", "38", "bg-amber-500"],
                ["Rejected", "8", "bg-rose-500"],
              ].map(([name, value, color]) => (
                <div
                  key={name}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2 font-bold text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    {name}
                  </span>
                  <span className="font-black text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP AGENTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-950">
                Top Sub Agents
              </h2>
              <button className="text-xs font-black text-blue-600">
                View All
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {agents.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-slate-500 shadow-sm">
                    {item.rank}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-slate-800">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      {item.converted} Converted
                    </p>
                  </div>

                  <span className="text-xs font-black text-blue-600">
                    {item.leads}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-blue-600" />
            <h2 className="text-sm font-black text-slate-950">Filter Leads</h2>
          </div>

          <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, mobile, email, Sub Agent..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Converted">Converted</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={agent}
              onChange={(e) => {
                setAgent(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600 outline-none"
            >
              <option value="ALL">All Sub Agents</option>
              {agents.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={loanType}
              onChange={(e) => {
                setLoanType(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600 outline-none"
            >
              <option value="ALL">All Loan Types</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Car Loan">Car Loan</option>
              <option value="Gold Loan">Gold Loan</option>
              <option value="LAP">LAP</option>
            </select>

            <button
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 hover:bg-slate-50"
            >
              <RefreshCcw size={15} />
              Reset
            </button>
          </div>
        </div>

        {/* MAIN TABLE + ACTIVITY */}
        <div className="grid gap-5 xl:grid-cols-[1fr_310px]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-950">
                    All Sub Agent Leads
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                    {filteredLeads.length}
                  </span>
                </div>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Search, filter and manage your complete lead network.
                </p>
              </div>

              <button className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">
                <Zap size={14} className="text-amber-500" />
                Bulk Actions
                <ChevronDown size={13} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="w-12 px-4 py-3 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Loan Type
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Sub Agent
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Created
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-50 transition hover:bg-blue-50/30"
                    >
                      <td className="px-4 py-4">
                        <input type="checkbox" className="rounded" />
                      </td>

                      <td className="px-4 py-4 text-xs font-bold text-slate-400">
                        {lead.id}
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            {lead.customer}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <Phone size={10} />
                            {lead.mobile}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-black text-blue-700">
                          {lead.loanType}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs font-black text-slate-800">
                        {lead.amount}
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-slate-700">
                          {lead.agent}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${statusStyle(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-[11px] font-bold text-slate-500">
                        {lead.date}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50">
                            <Eye size={15} />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50">
                            <Phone size={15} />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
                            <MoreVertical size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <Search size={24} />
                        </div>
                        <h3 className="mt-4 text-base font-black text-slate-800">
                          No Leads Found
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-bold text-slate-400">
                Showing{" "}
                <span className="text-slate-700">
                  {filteredLeads.length}
                </span>{" "}
                leads
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronLeft size={15} />
                </button>

                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-black ${
                      page === n
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage(page + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT ACTIVITY */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-950">
                  Recent Activity
                </h2>
                <button className="text-xs font-black text-blue-600">
                  View All
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {activities.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.text} className="relative flex gap-3">
                      {index !== activities.length - 1 && (
                        <span className="absolute left-[13px] top-8 h-8 border-l border-dashed border-slate-200" />
                      )}

                      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Icon size={14} />
                      </div>

                      <div>
                        <p className="text-xs font-bold leading-4 text-slate-700">
                          {item.text}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-slate-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-black text-slate-950">
                Quick Actions
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center gap-2 rounded-xl bg-blue-50 p-3 text-blue-700 transition hover:bg-blue-100">
                  <Plus size={18} />
                  <span className="text-[10px] font-black">Add Lead</span>
                </button>

                <button className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-700 transition hover:bg-emerald-100">
                  <Download size={18} />
                  <span className="text-[10px] font-black">Import Leads</span>
                </button>

                <button className="flex flex-col items-center gap-2 rounded-xl bg-violet-50 p-3 text-violet-700 transition hover:bg-violet-100">
                  <UserPlus size={18} />
                  <span className="text-[10px] font-black">Assign Lead</span>
                </button>

                <button className="flex flex-col items-center gap-2 rounded-xl bg-amber-50 p-3 text-amber-700 transition hover:bg-amber-100">
                  <BarChart3 size={18} />
                  <span className="text-[10px] font-black">Report</span>
                </button>
              </div>
            </div>

            {/* PERFORMANCE CARD */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#071b49] via-blue-800 to-indigo-700 p-5 text-white shadow-xl">
              <div className="flex items-center gap-2">
                <Zap size={17} className="text-yellow-300" />
                <span className="text-xs font-black uppercase tracking-widest text-blue-100">
                  Performance
                </span>
              </div>

              <p className="mt-4 text-3xl font-black">19.7%</p>
              <p className="mt-1 text-xs font-medium text-blue-100">
                Overall lead conversion rate
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[68%] rounded-full bg-emerald-400" />
              </div>

              <div className="mt-3 flex justify-between text-[10px] font-bold text-blue-100">
                <span>Current</span>
                <span>Target 30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DsaShell>
  );
}

