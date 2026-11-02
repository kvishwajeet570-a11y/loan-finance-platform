"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
  Banknote, CheckCircle2, Clock3, IndianRupee, MessageSquareText,
  RefreshCw, Search, ShieldCheck, X, XCircle, Layers3,
  Landmark, Eye, Send, ChevronLeft, ChevronRight, SlidersHorizontal
} from "lucide-react";

type Loan = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  panNo?: string;
  loanType?: string;
  amount?: number;
  eligibleAmount?: number | null;
  sanctionedAmount?: number | null;
  status?: string;
  createdAt?: string;
  userId?: string | null;
  remarks?: string | null;
  rejectionReason?: string | null;
};

type ActionType = "approve" | "reject" | "disburse";

const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("loan_finance_token")
    : null;

const money = (value?: number | null) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const statusClass = (status?: string) => {
  const value = String(status || "PENDING").toUpperCase();
  if (value === "APPROVED")
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  if (value === "REJECTED")
    return "border-rose-400/30 bg-rose-400/10 text-rose-300";
  if (value === "DISBURSED")
    return "border-sky-400/30 bg-sky-400/10 text-sky-300";
  return "border-amber-400/30 bg-amber-400/10 text-amber-300";
};

const statusIcon = (status?: string) => {
  const value = String(status || "PENDING").toUpperCase();
  if (value === "APPROVED") return <CheckCircle2 size={14} />;
  if (value === "REJECTED") return <XCircle size={14} />;
  if (value === "DISBURSED") return <Landmark size={14} />;
  return <Clock3 size={14} />;
};

export default function SuperAdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loanTypeFilter, setLoanTypeFilter] = useState("ALL");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [actionType, setActionType] = useState<ActionType>("approve");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadLoans = useCallback(async () => {
    try {
      setLoading(true);
      setNotice(null);
      const token = getToken();
      const response = await api.get("/super-admin/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data;
      const records: Loan[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.loans)
          ? data.loans
          : [];

      setLoans(records);
      setSelectedLoan((current) => {
        if (current) {
          return records.find((loan) => loan.id === current.id) || records[0] || null;
        }
        return records.find(
          (loan) => String(loan.status || "PENDING").toUpperCase() === "PENDING"
        ) || records[0] || null;
      });
    } catch (error: any) {
      console.error("Super Admin Loans Error:", error);
      setNotice({
        type: "error",
        text: error?.response?.data?.message || "Unable to load loan applications.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLoans();
  }, [loadLoans]);

  const counts = useMemo(() => {
    const result = {
      ALL: loans.length,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      DISBURSED: 0,
    };
    loans.forEach((loan) => {
      const status = String(loan.status || "PENDING").toUpperCase();
      if (status in result) {
        result[status as keyof typeof result] += 1;
      }
    });
    return result;
  }, [loans]);

  const loanTypes = useMemo(
    () => Array.from(new Set(loans.map((loan) => loan.loanType).filter(Boolean))) as string[],
    [loans]
  );

  const filteredLoans = useMemo(() => {
    const query = search.toLowerCase().trim();
    return loans.filter((loan) => {
      const status = String(loan.status || "PENDING").toUpperCase();
      const matchesStatus = activeFilter === "ALL" || status === activeFilter;
      const matchesType = loanTypeFilter === "ALL" || loan.loanType === loanTypeFilter;
      const matchesSearch =
        !query ||
        [loan.id, loan.fullName, loan.phone, loan.panNo, loan.status, loan.loanType]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [loans, search, activeFilter, loanTypeFilter]);

  const selectedAmount = selectedLoan
    ? Number(
        amounts[selectedLoan.id] ??
        selectedLoan.sanctionedAmount ??
        selectedLoan.eligibleAmount ??
        selectedLoan.amount ??
        0
      )
    : 0;

  const openLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setActionType(
      String(loan.status).toUpperCase() === "APPROVED" ? "disburse" : "approve"
    );
    setMessage("");
  };

  const notificationTitle =
    actionType === "approve"
      ? "Loan Approval Update"
      : actionType === "reject"
        ? "Loan Application Update"
        : "Loan Disbursement Update";

  const previewMessage =
    message.trim() ||
    (actionType === "approve"
      ? "Your loan application has been approved."
      : actionType === "reject"
        ? "Your loan application status has been updated."
        : "Your loan disbursement status has been updated.");

  const actionLabel =
    actionType === "approve"
      ? "Approve & Notify"
      : actionType === "reject"
        ? "Reject & Notify"
        : "Disburse & Notify";

  const pendingAction = async () => {
    if (!selectedLoan) return;

    const cleanMessage = message.trim();
    if (!cleanMessage) {
      setNotice({ type: "error", text: "Please enter a customer message." });
      return;
    }

    if (actionType === "approve" &&
        (!Number.isFinite(selectedAmount) || selectedAmount <= 0)) {
      setNotice({ type: "error", text: "Enter a valid sanctioned amount." });
      return;
    }

    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const url = `/super-admin/loans/${selectedLoan.id}/${actionType}`;

      const payload = actionType === "approve"
        ? { sanctionedAmount: selectedAmount, message: cleanMessage }
        : actionType === "reject"
          ? { reason: cleanMessage, message: cleanMessage }
          : { message: cleanMessage };

      const response = await api.patch(url, payload, { headers });
      const notified = response.data?.notificationSent === true;

      setNotice({
        type: "success",
        text: notified
          ? `${actionType.toUpperCase()} successful. Customer notification saved to their account.`
          : `${actionType.toUpperCase()} successful, but this loan has no linked customer account for notification.`,
      });

      setMessage("");
      await loadLoans();
    } catch (error: any) {
      console.error("Loan action failed:", error);
      setNotice({
        type: "error",
        text: error?.response?.data?.message || "Loan action failed. Please try again.",
      });
    }
  };

  const cards = [
    {
      key: "ALL",
      label: "Total Applications",
      value: counts.ALL,
      icon: <Layers3 size={21} />,
      color: "cyan",
    },
    {
      key: "PENDING",
      label: "Pending Review",
      value: counts.PENDING,
      icon: <Clock3 size={21} />,
      color: "amber",
    },
    {
      key: "APPROVED",
      label: "Approved",
      value: counts.APPROVED,
      icon: <CheckCircle2 size={21} />,
      color: "green",
    },
    {
      key: "REJECTED",
      label: "Rejected",
      value: counts.REJECTED,
      icon: <XCircle size={21} />,
      color: "rose",
    },
    {
      key: "DISBURSED",
      label: "Disbursed",
      value: counts.DISBURSED,
      icon: <Landmark size={21} />,
      color: "blue",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050c19] p-3 text-white sm:p-5">
      <div className="mx-auto max-w-[1700px] space-y-5">

        {/* PAGE HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-r from-[#101d48] via-[#101a39] to-[#07182c] p-6 shadow-2xl shadow-blue-950/30 md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-32 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 -bottom-32 h-52 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-700 shadow-lg shadow-blue-600/30">
              <Layers3 size={32} />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[.25em] text-cyan-300">
                Central Loan Control
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
                Loan Applications
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Review, approve, reject or disburse customer loan requests with remarks and notification.
              </p>
            </div>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          {cards.map((card) => {
            const colors: Record<string, string> = {
              cyan: "border-cyan-500/40 bg-cyan-500/[.07] text-cyan-300",
              amber: "border-amber-500/40 bg-amber-500/[.07] text-amber-300",
              green: "border-emerald-500/40 bg-emerald-500/[.07] text-emerald-300",
              rose: "border-rose-500/40 bg-rose-500/[.07] text-rose-300",
              blue: "border-blue-500/40 bg-blue-500/[.07] text-blue-300",
            };
            return (
              <button
                key={card.key}
                onClick={() => setActiveFilter(card.key)}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:brightness-125 ${colors[card.color]} ${
                  activeFilter === card.key ? "ring-2 ring-white/20" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    {card.icon}
                  </span>
                  <span className="text-2xl font-black tabular-nums text-white">
                    {card.value.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200">{card.label}</p>
              </button>
            );
          })}
        </section>

        {notice && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${
            notice.type === "error"
              ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
              : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          }`}>
            {notice.text}
          </div>
        )}

        {/* MAIN CONTENT */}
        <section className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1.7fr)_minmax(390px,.9fr)]">

          {/* LOAN TABLE */}
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-700/60 bg-[#091629] shadow-xl shadow-black/20">
            <div className="flex flex-col gap-3 border-b border-white/10 p-4 xl:flex-row xl:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, phone, PAN or loan ID..."
                  className="w-full rounded-xl border border-slate-700 bg-[#071321] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs text-slate-400">Status:</label>
                <select
                  value={activeFilter}
                  onChange={(event) => setActiveFilter(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-[#101f34] px-3 py-3 text-sm text-white outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="DISBURSED">Disbursed</option>
                </select>

                <label className="text-xs text-slate-400">Loan Type:</label>
                <select
                  value={loanTypeFilter}
                  onChange={(event) => setLoanTypeFilter(event.target.value)}
                  className="max-w-[150px] rounded-xl border border-slate-700 bg-[#101f34] px-3 py-3 text-sm text-white outline-none"
                >
                  <option value="ALL">All Types</option>
                  {loanTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <button
                  onClick={() => void loadLoans()}
                  disabled={loading}
                  title="Refresh loans"
                  className="rounded-xl border border-slate-600 bg-slate-800 p-3 text-cyan-200 transition hover:bg-slate-700 disabled:opacity-50"
                >
                  <RefreshCw size={19} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#10213a] text-xs font-bold text-slate-300">
                  <tr>
                    <th className="px-4 py-4">Applicant</th>
                    <th className="px-4 py-4">Loan Details</th>
                    <th className="px-4 py-4">Requested</th>
                    <th className="px-4 py-4">Eligible Limit</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[.07]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                        <RefreshCw className="mx-auto mb-3 animate-spin text-cyan-300" />
                        Loading real loan applications...
                      </td>
                    </tr>
                  ) : filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                        <Banknote className="mx-auto mb-3 opacity-50" size={30} />
                        No loan applications found.
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map((loan, index) => {
                      const status = String(loan.status || "PENDING").toUpperCase();
                      const eligible = loan.eligibleAmount;
                      const initials = (loan.fullName || "CU")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase();

                      return (
                        <tr
                          key={loan.id}
                          className={`transition hover:bg-blue-400/[.05] ${
                            selectedLoan?.id === loan.id ? "bg-blue-500/[.09]" : ""
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                ["bg-blue-600", "bg-indigo-600", "bg-emerald-600", "bg-purple-600"][index % 4]
                              }`}>
                                {initials || "CU"}
                              </div>
                              <div className="min-w-0">
                                <p className="max-w-[145px] truncate text-sm font-bold text-white">
                                  {loan.fullName || "Customer"}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {loan.phone || "No phone"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-semibold text-slate-200">
                              {loan.loanType || "Loan"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              ID: {loan.id}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold tabular-nums text-white">
                            {money(loan.amount)}
                          </td>
                          <td className="px-4 py-4">
                            {eligible != null ? (
                              <span className="rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300">
                                {money(eligible)}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">Not assessed</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-bold ${statusClass(status)}`}>
                              {statusIcon(status)}
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => openLoan(loan)}
                              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-blue-400/40 bg-blue-600/20 px-4 py-2.5 text-xs font-bold text-blue-200 transition hover:bg-blue-600/40"
                            >
                              {status === "PENDING" ? (
                                <>Process <ChevronRight size={15} /></>
                              ) : (
                                <><Eye size={15} /> View</>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredLoans.length} of {loans.length} loaded applications
              </span>
              <span className="text-slate-500">
                Page-level pagination depends on the backend API response.
              </span>
            </div>
          </div>

          {/* PROCESS PANEL */}
          <aside className="min-w-0 overflow-hidden rounded-2xl border border-blue-400/30 bg-gradient-to-b from-[#0c1c34] to-[#071322] shadow-2xl shadow-blue-950/20">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[.025] px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">
                  Loan Decision Center
                </p>
                <h2 className="mt-1 text-lg font-black">Process Loan Application</h2>
              </div>
              <ShieldCheck className="text-cyan-300" size={23} />
            </div>

            {!selectedLoan ? (
              <div className="p-10 text-center text-slate-400">
                <Banknote className="mx-auto mb-3" size={34} />
                Select a loan application to view details.
              </div>
            ) : (
              <div className="space-y-5 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-sm font-black">
                    {(selectedLoan.fullName || "CU")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">
                      {selectedLoan.fullName || "Customer"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {selectedLoan.phone || "Phone not available"}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-bold ${statusClass(selectedLoan.status)}`}>
                    {statusIcon(selectedLoan.status)}
                    {selectedLoan.status || "PENDING"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-700/70 bg-[#0a1b30] p-3">
                  <div>
                    <p className="text-[10px] text-slate-400">Loan Type</p>
                    <p className="mt-1 break-words text-xs font-bold text-white">
                      {selectedLoan.loanType || "Loan"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Requested</p>
                    <p className="mt-1 text-xs font-bold text-white">
                      {money(selectedLoan.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Eligible Limit</p>
                    <p className="mt-1 text-xs font-bold text-emerald-300">
                      {selectedLoan.eligibleAmount != null
                        ? money(selectedLoan.eligibleAmount)
                        : "Not assessed"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Select Action
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ["approve", "Approve", <CheckCircle2 size={17} />],
                      ["reject", "Reject", <XCircle size={17} />],
                      ["disburse", "Disburse", <Landmark size={17} />],
                    ] as const).map(([value, label, icon]) => (
                      <button
                        key={value}
                        onClick={() => setActionType(value)}
                        className={`flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs font-bold transition ${
                          actionType === value
                            ? value === "approve"
                              ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-950/30"
                              : value === "reject"
                                ? "border-rose-400 bg-rose-500/15 text-rose-300"
                                : "border-blue-400 bg-blue-500/15 text-blue-300"
                            : "border-slate-700 bg-[#0a1729] text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {actionType !== "reject" && (
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-300">
                      {actionType === "approve" ? "Sanction Amount" : "Disbursement Amount"}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex min-w-0 flex-1">
                        <span className="flex items-center rounded-l-xl border border-r-0 border-slate-700 bg-[#10213a] px-3 text-cyan-300">
                          <IndianRupee size={17} />
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={selectedLoan ? (
                            amounts[selectedLoan.id] ??
                            String(
                              selectedLoan.sanctionedAmount ??
                              selectedLoan.eligibleAmount ??
                              selectedLoan.amount ??
                              ""
                            )
                          ) : ""}
                          onChange={(event) => setAmounts((previous) => ({
                            ...previous,
                            [selectedLoan.id]: event.target.value,
                          }))}
                          className="min-w-0 w-full rounded-r-xl border border-slate-700 bg-[#071321] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      {actionType === "approve" && selectedLoan.eligibleAmount != null && (
                        <button
                          onClick={() => setAmounts((previous) => ({
                            ...previous,
                            [selectedLoan.id]: String(selectedLoan.eligibleAmount),
                          }))}
                          className="rounded-xl border border-slate-600 bg-slate-800 px-3 text-xs font-bold text-cyan-200 hover:bg-slate-700"
                        >
                          Use Eligible Limit
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300">
                    Admin Remark / Customer Message
                    <span className="text-rose-300"> *</span>
                  </label>
                  <textarea
                    value={message}
                    maxLength={300}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    placeholder={
                      actionType === "approve"
                        ? "Enter approval message for the customer..."
                        : actionType === "reject"
                          ? "Enter clear reason for rejection..."
                          : "Enter disbursement confirmation message..."
                    }
                    className="w-full resize-y rounded-xl border border-slate-700 bg-[#071321] p-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                  <p className="mt-1 text-right text-[10px] text-slate-500">
                    {message.length}/300
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/[.07] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-300">
                    <MessageSquareText size={17} />
                    Customer Notification Preview
                  </div>
                  <p className="text-xs font-bold text-white">{notificationTitle}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                    Dear {selectedLoan.fullName || "Customer"}, {previewMessage}
                  </p>
                  {actionType !== "reject" && (
                    <p className="mt-2 text-xs font-bold text-emerald-300">
                      Amount: {money(selectedAmount)}
                    </p>
                  )}
                  {!selectedLoan.userId && (
                    <p className="mt-2 text-xs text-amber-300">
                      No linked customer account. In-app notification delivery requires a linked account.
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <button
                    onClick={() => setMessage("")}
                    className="rounded-xl border border-slate-600 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5"
                  >
                    Clear Message
                  </button>
                  <button
                    onClick={pendingAction}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white transition ${
                      actionType === "approve"
                        ? "bg-emerald-500 hover:bg-emerald-400"
                        : actionType === "reject"
                          ? "bg-rose-600 hover:bg-rose-500"
                          : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    <Send size={17} />
                    {actionLabel}
                  </button>
                </div>

                <p className="text-center text-[10px] text-slate-500">
                  Decision is saved to the loan record. In-app notification is sent only to the linked customer account.
                </p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

