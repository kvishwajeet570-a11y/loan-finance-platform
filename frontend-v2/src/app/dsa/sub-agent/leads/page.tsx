"use client";

import { useEffect, useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";
import {
  Activity,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  Phone,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

type RawLead = {
  id: string;
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  city?: string;
  state?: string;
  pincode?: string;
  productType?: string;
  source?: string;
  status?: string;
  priority?: string;
  loanAmount?: number | null;
  monthlyIncome?: number | null;
  assignedTo?: string | null;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type RawSubAgent = {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  phoneNo?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  parentDsaId?: string;
  createdAt?: string;
  _count?: {
    loans?: number;
  };
};

type Lead = RawLead & {
  agentName: string;
};

function getAuth() {
  if (typeof window === "undefined") {
    return { userId: "", token: "" };
  }

  try {
    const raw = localStorage.getItem("loan_finance_user");
    const user = raw ? JSON.parse(raw) : null;

    return {
      userId: String(user?.id || user?.userId || ""),
      token: localStorage.getItem("loan_finance_token") || "",
    };
  } catch {
    return {
      userId: "",
      token: localStorage.getItem("loan_finance_token") || "",
    };
  }
}

function formatMoney(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLoanType(value?: string) {
  if (!value) return "Other Loan";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatStatus(value?: string) {
  const status = String(value || "NEW").toUpperCase();

  const labels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    IN_PROGRESS: "In Progress",
    PENDING: "Pending",
    CONVERTED: "Converted",
    REJECTED: "Rejected",
    CLOSED: "Closed",
  };

  return labels[status] || formatLoanType(status);
}

function statusStyle(value?: string) {
  const status = String(value || "NEW").toUpperCase();

  if (status === "CONVERTED") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "REJECTED") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  if (
    status === "IN_PROGRESS" ||
    status === "CONTACTED"
  ) {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  if (status === "PENDING") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-violet-50 text-violet-700 ring-violet-200";
}

function relativeTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const diff = Date.now() - date.getTime();

  if (diff < 60_000) return "Just now";

  const minutes = Math.floor(diff / 60_000);

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return formatDate(value);
}

function last30Days() {
  const result: string[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    result.push(date.toISOString().slice(0, 10));
  }

  return result;
}

export default function SubAgentLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<RawSubAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [agent, setAgent] = useState("ALL");
  const [loanType, setLoanType] = useState("ALL");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const { userId, token } = getAuth();

      if (!userId) {
        throw new Error("DSA user information not found. Please login again.");
      }

      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const [leadResponse, agentResponse] = await Promise.all([
        fetch(`${API}/lead?limit=1000`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${API}/sub-agent/dsa/${encodeURIComponent(userId)}`, {
          headers,
          cache: "no-store",
        }),
      ]);

      if (!leadResponse.ok) {
        throw new Error(`Lead API failed with status ${leadResponse.status}`);
      }

      if (!agentResponse.ok) {
        throw new Error(`Sub Agent API failed with status ${agentResponse.status}`);
      }

      const leadJson = await leadResponse.json();
      const agentJson = await agentResponse.json();

      const rawLeads: RawLead[] = Array.isArray(leadJson?.data)
        ? leadJson.data
        : Array.isArray(leadJson)
          ? leadJson
          : [];

      const rawAgents: RawSubAgent[] = Array.isArray(agentJson?.data)
        ? agentJson.data
        : Array.isArray(agentJson)
          ? agentJson
          : [];

      const agentMap = new Map<string, string>();

      rawAgents.forEach((item) => {
        agentMap.set(
          String(item.id),
          item.fullName || item.name || "Unnamed Sub Agent"
        );
      });

      const subAgentIds = new Set(rawAgents.map((item) => String(item.id)));

      const realSubAgentLeads: Lead[] = rawLeads
        .filter(
          (lead) =>
            !!lead.assignedTo &&
            subAgentIds.has(String(lead.assignedTo))
        )
        .map((lead) => ({
          ...lead,
          agentName:
            agentMap.get(String(lead.assignedTo)) || "Unknown Sub Agent",
        }));

      setAgents(rawAgents);
      setLeads(realSubAgentLeads);
      setPage(1);
    } catch (err) {
      console.error("[SUB AGENT LEADS] LOAD ERROR:", err);

      setLeads([]);
      setAgents([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Sub Agent Leads."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const loanTypes = useMemo(() => {
    return Array.from(
      new Set(
        leads
          .map((lead) => String(lead.productType || "").trim())
          .filter(Boolean)
      )
    ).sort();
  }, [leads]);

  const statuses = useMemo(() => {
    return Array.from(
      new Set(
        leads
          .map((lead) => String(lead.status || "NEW").toUpperCase())
          .filter(Boolean)
      )
    ).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !q ||
        String(lead.fullName || "").toLowerCase().includes(q) ||
        String(lead.mobileNumber || "").toLowerCase().includes(q) ||
        String(lead.email || "").toLowerCase().includes(q) ||
        String(lead.agentName || "").toLowerCase().includes(q) ||
        String(lead.productType || "").toLowerCase().includes(q);

      const matchesStatus =
        status === "ALL" ||
        String(lead.status || "NEW").toUpperCase() === status;

      const matchesAgent =
        agent === "ALL" ||
        String(lead.assignedTo || "") === agent;

      const matchesLoan =
        loanType === "ALL" ||
        String(lead.productType || "") === loanType;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAgent &&
        matchesLoan
      );
    });
  }, [leads, search, status, agent, loanType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage]);

  const stats = useMemo(() => {
    const total = leads.length;

    const converted = leads.filter(
      (lead) => String(lead.status || "").toUpperCase() === "CONVERTED"
    ).length;

    const rejected = leads.filter(
      (lead) => String(lead.status || "").toUpperCase() === "REJECTED"
    ).length;

    const pending = leads.filter((lead) =>
      ["NEW", "PENDING"].includes(
        String(lead.status || "NEW").toUpperCase()
      )
    ).length;

    const active = leads.filter((lead) =>
      ["CONTACTED", "IN_PROGRESS"].includes(
        String(lead.status || "").toUpperCase()
      )
    ).length;

    const highPriority = leads.filter(
      (lead) =>
        String(lead.priority || "").toUpperCase() === "HIGH"
    ).length;

    const loanAmount = leads.reduce(
      (sum, lead) => sum + Number(lead.loanAmount || 0),
      0
    );

    const conversionRate =
      total > 0 ? Math.round((converted / total) * 1000) / 10 : 0;

    return {
      total,
      converted,
      rejected,
      pending,
      active,
      highPriority,
      loanAmount,
      conversionRate,
    };
  }, [leads]);

  const topAgents = useMemo(() => {
    return agents
      .map((subAgent) => {
        const agentLeads = leads.filter(
          (lead) =>
            String(lead.assignedTo || "") === String(subAgent.id)
        );

        const converted = agentLeads.filter(
          (lead) =>
            String(lead.status || "").toUpperCase() === "CONVERTED"
        ).length;

        return {
          id: subAgent.id,
          name:
            subAgent.fullName ||
            subAgent.name ||
            "Unnamed Sub Agent",
          leads: agentLeads.length,
          converted,
        };
      })
      .filter((item) => item.leads > 0)
      .sort((a, b) => {
        if (b.leads !== a.leads) return b.leads - a.leads;
        return b.converted - a.converted;
      })
      .slice(0, 5);
  }, [agents, leads]);

  const statusDistribution = useMemo(() => {
    const result = [
      {
        label: "In Progress",
        value: leads.filter((lead) =>
          ["CONTACTED", "IN_PROGRESS"].includes(
            String(lead.status || "").toUpperCase()
          )
        ).length,
        className: "bg-blue-600",
      },
      {
        label: "Converted",
        value: stats.converted,
        className: "bg-emerald-500",
      },
      {
        label: "Pending",
        value: stats.pending,
        className: "bg-amber-500",
      },
      {
        label: "Rejected",
        value: stats.rejected,
        className: "bg-rose-500",
      },
    ];

    return result;
  }, [leads, stats]);

  const trend = useMemo(() => {
    const days = last30Days();

    return days.map((day) => {
      const total = leads.filter((lead) => {
        if (!lead.createdAt) return false;

        return new Date(lead.createdAt)
          .toISOString()
          .slice(0, 10) === day;
      }).length;

      const converted = leads.filter((lead) => {
        if (!lead.createdAt) return false;

        return (
          new Date(lead.createdAt).toISOString().slice(0, 10) === day &&
          String(lead.status || "").toUpperCase() === "CONVERTED"
        );
      }).length;

      return {
        day,
        total,
        converted,
      };
    });
  }, [leads]);

  const maxTrend = Math.max(
    1,
    ...trend.map((item) => item.total)
  );

  const recentActivity = useMemo(() => {
    return [...leads]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [leads]);

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setAgent("ALL");
    setLoanType("ALL");
    setPage(1);
  }

  function exportCsv() {
    if (!filteredLeads.length) return;

    const header = [
      "Customer",
      "Mobile",
      "Email",
      "Loan Type",
      "Loan Amount",
      "Sub Agent",
      "Status",
      "Priority",
      "City",
      "State",
      "Created",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.fullName || "",
      lead.mobileNumber || "",
      lead.email || "",
      formatLoanType(lead.productType),
      lead.loanAmount ?? "",
      lead.agentName,
      formatStatus(lead.status),
      lead.priority || "",
      lead.city || "",
      lead.state || "",
      lead.createdAt || "",
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `sub-agent-leads-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DsaShell>
      <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">

          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Dashboard</span>
              <span>/</span>
              <span>Sub Agent</span>
              <span>/</span>
              <span className="text-blue-600">Leads</span>
            </div>

            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                  <Users size={23} />
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    Sub Agent Leads
                  </h1>

                  <p className="mt-0.5 text-[15px] font-medium text-slate-500">
                    Real leads generated and assigned to your Sub Agents.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={!filteredLeads.length}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-[15px] font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download size={16} />
                  Export
                </button>

                <a
                  href="/dsa/leads"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-[15px] font-black text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus size={17} />
                  Add New Lead
                </a>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-[15px] font-bold text-rose-700">
              {error}
            </div>
          )}

          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              {
                title: "Total Leads",
                value: stats.total,
                note: "Real Sub Agent Leads",
                icon: Users,
                box: "from-blue-50 to-indigo-50",
                iconBg: "bg-blue-600",
              },
              {
                title: "Active Leads",
                value: stats.active,
                note: "Contacted / In Progress",
                icon: Activity,
                box: "from-emerald-50 to-green-50",
                iconBg: "bg-emerald-600",
              },
              {
                title: "Converted",
                value: stats.converted,
                note: "Successfully Converted",
                icon: CheckCircle2,
                box: "from-amber-50 to-yellow-50",
                iconBg: "bg-amber-500",
              },
              {
                title: "Rejected",
                value: stats.rejected,
                note: "Rejected Leads",
                icon: XCircle,
                box: "from-rose-50 to-red-50",
                iconBg: "bg-rose-500",
              },
              {
                title: "Pending",
                value: stats.pending,
                note: "New / Pending",
                icon: FileText,
                box: "from-violet-50 to-purple-50",
                iconBg: "bg-violet-600",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${item.box} p-4 shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[15px] font-black uppercase tracking-[0.14em] text-slate-500">
                        {item.title}
                      </p>

                      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        {loading ? "—" : item.value}
                      </p>

                      <p className="mt-1 text-[15px] font-bold text-slate-500">
                        {item.note}
                      </p>
                    </div>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} text-white shadow-md`}
                    >
                      <Icon size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-5 grid gap-4 xl:grid-cols-[1.5fr_0.9fr_0.8fr]">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">
                    Lead Trend
                  </h2>
                  <p className="mt-0.5 text-[15px] font-medium text-slate-400">
                    Last 30 days from database
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[15px] font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    Total
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Converted
                  </span>
                </div>
              </div>

              <div className="mt-6 flex h-40 items-end gap-1.5 overflow-hidden rounded-xl bg-slate-50 px-3 pb-5 pt-4">
                {trend.map((item) => (
                  <div
                    key={item.day}
                    className="group relative flex h-full flex-1 items-end"
                    title={`${item.day}: ${item.total} leads, ${item.converted} converted`}
                  >
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-400 transition group-hover:from-blue-700 group-hover:to-indigo-500"
                      style={{
                        height: `${Math.max(
                          item.total > 0 ? 8 : 2,
                          (item.total / maxTrend) * 100
                        )}%`,
                      }}
                    />

                    {item.converted > 0 && (
                      <div
                        className="absolute bottom-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-emerald-500"
                        style={{
                          height: `${Math.max(
                            5,
                            (item.converted / maxTrend) * 100
                          )}%`,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-between text-[9px] font-bold text-slate-400">
                <span>{trend[0]?.day}</span>
                <span>{trend[14]?.day}</span>
                <span>{trend[29]?.day}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">
                    Lead Status Distribution
                  </h2>
                  <p className="mt-0.5 text-[15px] font-medium text-slate-400">
                    Current database status
                  </p>
                </div>

                <BarChart3 size={18} className="text-blue-600" />
              </div>

              <div className="mt-5 flex items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-slate-100">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: (() => {
                        const total = Math.max(stats.total, 1);
                        let cursor = 0;

                        const segments = statusDistribution.map((item) => {
                          const start = cursor;
                          cursor += (item.value / total) * 360;

                          const color =
                            item.label === "In Progress"
                              ? "#2563eb"
                              : item.label === "Converted"
                                ? "#10b981"
                                : item.label === "Pending"
                                  ? "#f59e0b"
                                  : "#f43f5e";

                          return `${color} ${start}deg ${cursor}deg`;
                        });

                        return `conic-gradient(${segments.join(", ")})`;
                      })(),
                    }}
                  />

                  <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="text-2xl font-black text-slate-950">
                      {stats.total}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      Total Leads
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {statusDistribution.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-[15px]"
                  >
                    <span className="flex items-center gap-2 font-bold text-slate-600">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${item.className}`}
                      />
                      {item.label}
                    </span>

                    <span className="font-black text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">
                    Top Sub Agents
                  </h2>
                  <p className="mt-0.5 text-[15px] font-medium text-slate-400">
                    Based on real lead count
                  </p>
                </div>

                <Users size={18} className="text-blue-600" />
              </div>

              <div className="mt-4 space-y-2">
                {topAgents.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-5 text-center text-[15px] font-bold text-slate-400">
                    No assigned leads yet.
                  </div>
                ) : (
                  topAgents.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-black text-slate-500 shadow-sm">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-black text-slate-800">
                          {item.name}
                        </p>

                        <p className="mt-0.5 text-[9px] font-bold text-slate-400">
                          {item.converted} Converted
                        </p>
                      </div>

                      <span className="text-[15px] font-black text-blue-600">
                        {item.leads}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Filter size={17} className="text-blue-600" />
              <h2 className="text-[15px] font-black text-slate-950">
                Filter Leads
              </h2>
            </div>

            <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, mobile, email, Sub Agent..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-[15px] font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[15px] font-bold text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="ALL">All Status</option>

                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {formatStatus(item)}
                  </option>
                ))}
              </select>

              <select
                value={agent}
                onChange={(event) => {
                  setAgent(event.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[15px] font-bold text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="ALL">All Sub Agents</option>

                {agents.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName || item.name || "Unnamed Sub Agent"}
                  </option>
                ))}
              </select>

              <select
                value={loanType}
                onChange={(event) => {
                  setLoanType(event.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[15px] font-bold text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="ALL">All Loan Types</option>

                {loanTypes.map((item) => (
                  <option key={item} value={item}>
                    {formatLoanType(item)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
              >
                <RefreshCw size={15} />
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-950">
                      All Sub Agent Leads
                    </h2>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[15px] font-black text-emerald-700">
                      {filteredLeads.length}
                    </span>
                  </div>

                  <p className="mt-1 text-[15px] font-medium text-slate-400">
                    Only real database leads assigned to your Sub Agents.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 px-3 py-2 text-[15px] font-black text-blue-700">
                  Total Loan Amount: {formatMoney(stats.loanAmount)}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        #
                      </th>

                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        Customer
                      </th>

                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        Loan Type
                      </th>

                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        Sub Agent
                      </th>

                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        Created
                      </th>

                      <th className="px-4 py-3 text-[15px] font-black uppercase tracking-wider text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-20 text-center">
                          <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-slate-200 border-t-blue-600">
                            <span />
                          </div>

                          <p className="mt-4 text-[15px] font-bold text-slate-500">
                            Loading real database leads...
                          </p>
                        </td>
                      </tr>
                    ) : visibleLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-20 text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Users size={24} />
                          </div>

                          <h3 className="mt-4 text-base font-black text-slate-800">
                            No Sub Agent Leads Found
                          </h3>

                          <p className="mt-1 text-[15px] font-medium text-slate-400">
                            No real lead is currently assigned to your Sub Agents.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      visibleLeads.map((lead, index) => (
                        <tr
                          key={lead.id}
                          className="border-b border-slate-50 transition hover:bg-blue-50/30"
                        >
                          <td className="px-4 py-4 text-[15px] font-black text-slate-400">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>

                          <td className="px-4 py-4">
                            <div>
                              <p className="text-[15px] font-black text-slate-800">
                                {lead.fullName || "Unnamed Customer"}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-[15px] font-medium text-slate-400">
                                <Phone size={10} />
                                {lead.mobileNumber || "No mobile"}
                              </p>

                              {lead.email && (
                                <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                                  {lead.email}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[15px] font-black text-blue-700">
                              {formatLoanType(lead.productType)}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-[15px] font-black text-slate-800">
                            {formatMoney(lead.loanAmount)}
                          </td>

                          <td className="px-4 py-4">
                            <span className="text-[15px] font-bold text-slate-700">
                              {lead.agentName}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[15px] font-black ring-1 ${statusStyle(
                                lead.status
                              )}`}
                            >
                              {formatStatus(lead.status)}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-xs font-bold text-slate-500">
                            {formatDate(lead.createdAt)}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <a
                                href={`/dsa/leads/${lead.id}`}
                                title="View Lead"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
                              >
                                <Eye size={15} />
                              </a>

                              {lead.mobileNumber && (
                                <a
                                  href={`tel:${lead.mobileNumber}`}
                                  title="Call"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"
                                >
                                  <Phone size={15} />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
                <p className="text-[15px] font-medium text-slate-400">
                  Showing{" "}
                  <span className="font-black text-slate-700">
                    {visibleLeads.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-slate-700">
                    {filteredLeads.length}
                  </span>{" "}
                  leads
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, index) => index + 1
                  ).map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setPage(item)}
                      className={`h-8 min-w-8 rounded-lg px-2 text-[15px] font-black ${
                        currentPage === item
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setPage((value) =>
                        Math.min(totalPages, value + 1)
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-5">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-950">
                    Recent Activity
                  </h2>

                  <TrendingUp size={18} className="text-blue-600" />
                </div>

                <div className="mt-4 space-y-3">
                  {recentActivity.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-5 text-center text-[15px] font-bold text-slate-400">
                      No activity yet.
                    </div>
                  ) : (
                    recentActivity.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex gap-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          {String(lead.status || "").toUpperCase() ===
                          "CONVERTED" ? (
                            <CheckCircle2 size={15} />
                          ) : String(lead.status || "").toUpperCase() ===
                            "REJECTED" ? (
                            <XCircle size={15} />
                          ) : (
                            <UserPlus size={15} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[15px] font-bold leading-4 text-slate-700">
                            {lead.fullName || "Lead"} —{" "}
                            {formatStatus(lead.status)}
                          </p>

                          <p className="mt-0.5 text-[15px] font-medium text-slate-400">
                            {lead.agentName} ·{" "}
                            {relativeTime(
                              lead.updatedAt || lead.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-5 text-white shadow-xl shadow-blue-200">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  <p className="text-[15px] font-black uppercase tracking-wider">
                    Performance
                  </p>
                </div>

                <p className="mt-5 text-4xl font-black">
                  {stats.conversionRate}%
                </p>

                <p className="mt-1 text-[15px] font-medium text-blue-100">
                  Overall lead conversion rate
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{
                      width: `${Math.min(stats.conversionRate, 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[9px] font-bold text-blue-100">
                  <span>Current</span>
                  <span>{stats.converted} Converted</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-black text-slate-950">
                  Network Summary
                </h2>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-slate-500">
                      Total Sub Agents
                    </span>
                    <span className="text-[15px] font-black text-slate-900">
                      {agents.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-slate-500">
                      Agents With Leads
                    </span>
                    <span className="text-[15px] font-black text-slate-900">
                      {topAgents.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-slate-500">
                      High Priority
                    </span>
                    <span className="text-[15px] font-black text-rose-600">
                      {stats.highPriority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-slate-500">
                      Loan Value
                    </span>
                    <span className="text-[15px] font-black text-blue-600">
                      {formatMoney(stats.loanAmount)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DsaShell>
  );
}





