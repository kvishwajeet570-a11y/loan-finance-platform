"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  FileText,
  Wallet,
  User,
  ArrowRight,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Clock3,
  XCircle,
  ShieldCheck,
  FolderOpen,
  IndianRupee,
  Activity,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import api from "@/lib/api";

type AnyObject = Record<string, any>;

type UserData = {
  id?: string;
  name?: string;
  email?: string;
  phoneNo?: string;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
};

type DashboardState = {
  user: UserData | null;
  customer: AnyObject | null;
  loans: AnyObject[];
  transactions: AnyObject[];
  documents: AnyObject[];
  kyc: AnyObject | null;
  wallet: AnyObject | null;
  notifications: AnyObject[];
};

const EMPTY_STATE: DashboardState = {
  user: null,
  customer: null,
  loans: [],
  transactions: [],
  documents: [],
  kyc: null,
  wallet: null,
  notifications: [],
};

function unwrap(payload: any): any {
  if (!payload) return null;
  if (payload.data !== undefined) return payload.data;
  if (payload.customer !== undefined) return payload.customer;
  if (payload.user !== undefined) return payload.user;
  return payload;
}

function toArray(payload: any): AnyObject[] {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.loans)) return payload.loans;
  if (Array.isArray(payload.transactions)) return payload.transactions;
  if (Array.isArray(payload.documents)) return payload.documents;
  if (Array.isArray(payload.notifications)) return payload.notifications;
  if (Array.isArray(payload.activities)) return payload.activities;

  if (payload.data && typeof payload.data === "object") {
    if (Array.isArray(payload.data.loans)) return payload.data.loans;
    if (Array.isArray(payload.data.transactions)) {
      return payload.data.transactions;
    }
    if (Array.isArray(payload.data.documents)) {
      return payload.data.documents;
    }
    if (Array.isArray(payload.data.notifications)) {
      return payload.data.notifications;
    }
  }

  return [];
}

function numberValue(...values: any[]): number {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }

  return 0;
}

function formatCurrency(value: any): string {
  return `₹${numberValue(value).toLocaleString("en-IN")}`;
}

function formatDate(value: any): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(status: any): string {
  return String(status || "unknown")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function statusClass(status: any): string {
  const s = normalizeStatus(status);

  if (
    s.includes("approved") ||
    s.includes("disbursed") ||
    s.includes("verified") ||
    s.includes("success")
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    s.includes("pending") ||
    s.includes("processing") ||
    s.includes("review")
  ) {
    return "bg-amber-50 text-amber-700";
  }

  if (
    s.includes("reject") ||
    s.includes("failed") ||
    s.includes("blocked")
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

function statusIcon(status: any) {
  const s = normalizeStatus(status);

  if (
    s.includes("approved") ||
    s.includes("disbursed") ||
    s.includes("verified") ||
    s.includes("success")
  ) {
    return <CheckCircle2 size={14} />;
  }

  if (
    s.includes("pending") ||
    s.includes("processing") ||
    s.includes("review")
  ) {
    return <Clock3 size={14} />;
  }

  if (
    s.includes("reject") ||
    s.includes("failed") ||
    s.includes("blocked")
  ) {
    return <XCircle size={14} />;
  }

  return <Activity size={14} />;
}

export default function CustomerDashboardPage() {
  const router = useRouter();

  const [state, setState] = useState<DashboardState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("loan_finance_token");
      const storedUser = localStorage.getItem("loan_finance_user");

      if (!token) {
        router.replace("/login");
        return;
      }

      let loggedUser: UserData = {};

      try {
        loggedUser = storedUser
          ? JSON.parse(storedUser)
          : {};
      } catch {
        loggedUser = {};
      }

      const userId = loggedUser?.id;

      if (!userId) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      const authConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const results = await Promise.allSettled([
        api.get(`/user/${userId}`, authConfig),
        api.get(`/customer/user/${userId}`, authConfig),
        api.get(`/user/${userId}/loans`, authConfig),
        api.get(`/user/${userId}/transactions`, authConfig),
        api.get(`/user/${userId}/documents`, authConfig),
        api.get(`/user/${userId}/kyc`, authConfig),
        api.get(`/user/${userId}/wallet`, authConfig),
        api.get(`/user/${userId}/notifications`, authConfig),
        api.get("/wallet/me", authConfig),
        api.get("/wallet/balance", authConfig),
      ]);

      const getResult = (index: number) => {
        const result = results[index];

        if (result?.status === "fulfilled") {
          return result.value.data;
        }

        return null;
      };

      const userResponse = getResult(0);
      const customerResponse = getResult(1);

      const userFromApi =
        unwrap(userResponse) ||
        loggedUser;

      const customerFromApi =
        unwrap(customerResponse);

      const loans = toArray(getResult(2));
      const transactions = toArray(getResult(3));
      const documents = toArray(getResult(4));
      const kycResponse = unwrap(getResult(5));

      const walletResponse =
        unwrap(getResult(8)) ||
        unwrap(getResult(9)) ||
        unwrap(getResult(6));

      const notifications = toArray(getResult(7));

      setState({
        user: {
          ...loggedUser,
          ...userFromApi,
        },
        customer: customerFromApi,
        loans,
        transactions,
        documents,
        kyc: kycResponse,
        wallet: walletResponse,
        notifications,
      });

      const failedRequests = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (failedRequests === results.length) {
        setError(
          "Customer data could not be loaded. Please check the backend/API."
        );
      }
    } catch (err: any) {
      console.error("Customer Dashboard Error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Failed to load customer dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const refreshDashboard = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const logout = () => {
    localStorage.removeItem("loan_finance_token");
    localStorage.removeItem("loan_finance_user");
    router.replace("/login");
  };

  const activeLoans = useMemo(
    () =>
      state.loans.filter((loan) => {
        const status = normalizeStatus(loan?.status);

        return (
          status.includes("approved") ||
          status.includes("disbursed") ||
          status.includes("active") ||
          status.includes("processing") ||
          status.includes("pending")
        );
      }),
    [state.loans]
  );

  const totalLoanAmount = useMemo(
    () =>
      state.loans.reduce(
        (sum, loan) =>
          sum +
          numberValue(
            loan?.amount,
            loan?.loanAmount,
            loan?.requestedAmount
          ),
        0
      ),
    [state.loans]
  );

  const walletBalance = numberValue(
    state.wallet?.balance,
    state.wallet?.walletBalance,
    state.wallet?.currentBalance
  );

  const customerName =
    state.user?.name ||
    state.customer?.name ||
    "Customer";

  const customerEmail =
    state.user?.email ||
    state.customer?.email ||
    "";

  const pendingLoans = state.loans.filter((loan) =>
    normalizeStatus(loan?.status).includes("pending")
  ).length;

  const approvedLoans = state.loans.filter((loan) => {
    const s = normalizeStatus(loan?.status);

    return (
      s.includes("approved") ||
      s.includes("disbursed")
    );
  }).length;

  const kycStatus =
    state.kyc?.status ||
    state.kyc?.kycStatus ||
    (state.user?.isVerified ? "verified" : "pending");

  const firstName =
    customerName.split(" ")[0] || "Customer";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/customer/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <IndianRupee size={22} />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight text-[#06295c]">
                India Loan Finance
              </div>
              <div className="text-xs font-medium text-slate-500">
                Customer Panel
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="hidden rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50 sm:block"
              title="Refresh"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>

            <Link
              href="/customer/notifications"
              className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50"
            >
              <Bell size={18} />

              {state.notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {state.notifications.length > 9
                    ? "9+"
                    : state.notifications.length}
                </span>
              )}
            </Link>

            <div className="hidden text-right sm:block">
              <div className="text-sm font-bold text-slate-900">
                {customerName}
              </div>
              <div className="text-xs text-slate-500">
                {customerEmail}
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-[#10192e] px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* LOADING */}
        {loading && (
          <div className="space-y-6">
            <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* ERROR */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={19} />
                <div className="flex-1">
                  <div className="font-bold">
                    Unable to load some customer data
                  </div>
                  <div className="mt-1 text-sm">
                    {error}
                  </div>
                </div>

                <button
                  onClick={refreshDashboard}
                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"
                >
                  Retry
                </button>
              </div>
            )}

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-7 text-white shadow-xl shadow-blue-100 sm:p-9">
              <div className="relative z-10">
                <div className="text-sm font-semibold text-blue-100">
                  Welcome back
                </div>

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {firstName}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                  Manage your loan applications, documents,
                  profile and financial services from your Customer Panel.
                </p>
              </div>

              <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/10" />
            </section>

            {/* STAT CARDS */}
            <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<CreditCard size={20} />}
                iconClass="bg-blue-50 text-blue-600"
                title="Active Loans"
                value={activeLoans.length}
                subtitle={`${approvedLoans} approved/disbursed`}
              />

              <StatCard
                icon={<IndianRupee size={20} />}
                iconClass="bg-emerald-50 text-emerald-600"
                title="Loan Amount"
                value={formatCurrency(totalLoanAmount)}
                subtitle={`${state.loans.length} total applications`}
              />

              <StatCard
                icon={<FileText size={20} />}
                iconClass="bg-purple-50 text-purple-600"
                title="Applications"
                value={state.loans.length}
                subtitle={`${pendingLoans} pending`}
              />

              <StatCard
                icon={<Wallet size={20} />}
                iconClass="bg-orange-50 text-orange-600"
                title="Wallet Balance"
                value={formatCurrency(walletBalance)}
                subtitle="Available balance"
              />
            </section>

            {/* QUICK ACTIONS */}
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">
                  Quick Actions
                </h2>

                <button
                  onClick={refreshDashboard}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 sm:hidden"
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                  href="/apply"
                  icon={<CreditCard size={20} />}
                  title="Apply for Loan"
                  subtitle="Start a new loan application"
                />

                <ActionCard
                  href="/customer/loan-history"
                  icon={<FileText size={20} />}
                  title="My Applications"
                  subtitle="Track your applications"
                />

                <ActionCard
                  href="/customer/profile"
                  icon={<User size={20} />}
                  title="My Profile"
                  subtitle="Manage your account details"
                />

                <ActionCard
                  href="/customer/wallet"
                  icon={<Wallet size={20} />}
                  title="Wallet"
                  subtitle="View wallet and transactions"
                />
              </div>
            </section>

            {/* MAIN GRID */}
            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* RECENT APPLICATIONS */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="font-black text-slate-900">
                      Recent Applications
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Your latest loan applications
                    </p>
                  </div>

                  <Link
                    href="/customer/loan-history"
                    className="flex items-center gap-1 text-sm font-bold text-blue-600"
                  >
                    View all
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {state.loans.length === 0 ? (
                  <EmptyState
                    icon={<FileText size={25} />}
                    title="No loan applications yet"
                    subtitle="Start your first loan application."
                    href="/apply"
                    action="Apply Now"
                  />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {state.loans.slice(0, 5).map((loan, index) => {
                      const status =
                        loan?.status || "Pending";

                      return (
                        <div
                          key={
                            loan?.id ||
                            loan?.applicationId ||
                            index
                          }
                          className="flex items-center justify-between gap-4 px-6 py-5"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <CreditCard size={19} />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-sm font-black text-slate-900">
                                {loan?.loanType ||
                                  loan?.productType ||
                                  "Loan Application"}
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                {formatDate(
                                  loan?.createdAt ||
                                    loan?.applicationDate
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-slate-900">
                              {formatCurrency(
                                loan?.amount ||
                                  loan?.loanAmount
                              )}
                            </div>

                            <span
                              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(
                                status
                              )}`}
                            >
                              {statusIcon(status)}
                              {normalizeStatus(status)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ACCOUNT STATUS */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-black text-slate-900">
                  Account Status
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Current verification status
                </p>

                <div className="mt-6 space-y-4">
                  <StatusRow
                    icon={<ShieldCheck size={18} />}
                    title="Account"
                    status={
                      state.user?.isActive === false
                        ? "Inactive"
                        : "Active"
                    }
                    success={state.user?.isActive !== false}
                  />

                  <StatusRow
                    icon={<ShieldCheck size={18} />}
                    title="Email / Account Verification"
                    status={
                      state.user?.isVerified
                        ? "Verified"
                        : "Pending"
                    }
                    success={!!state.user?.isVerified}
                  />

                  <StatusRow
                    icon={<FolderOpen size={18} />}
                    title="KYC"
                    status={
                      kycStatus || "Pending"
                    }
                    success={
                      normalizeStatus(kycStatus).includes(
                        "verified"
                      ) ||
                      normalizeStatus(kycStatus).includes(
                        "approved"
                      )
                    }
                  />

                  <StatusRow
                    icon={<FileText size={18} />}
                    title="Documents"
                    status={`${state.documents.length} uploaded`}
                    success={state.documents.length > 0}
                  />
                </div>

                <Link
                  href="/customer/profile"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
                >
                  Manage Profile
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            {/* TRANSACTIONS */}
            <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="font-black text-slate-900">
                    Recent Transactions
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Latest wallet/account activity
                  </p>
                </div>

                <Link
                  href="/customer/transactions"
                  className="flex items-center gap-1 text-sm font-bold text-blue-600"
                >
                  View all
                  <ChevronRight size={16} />
                </Link>
              </div>

              {state.transactions.length === 0 ? (
                <EmptyState
                  icon={<Activity size={25} />}
                  title="No transactions yet"
                  subtitle="Your recent transactions will appear here."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {state.transactions.slice(0, 5).map(
                    (transaction, index) => {
                      const amount = numberValue(
                        transaction?.amount,
                        transaction?.transactionAmount
                      );

                      const type =
                        transaction?.type ||
                        transaction?.category ||
                        "Transaction";

                      return (
                        <div
                          key={
                            transaction?.id ||
                            transaction?.transactionId ||
                            index
                          }
                          className="flex items-center justify-between gap-4 px-6 py-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                              <Activity size={17} />
                            </div>

                            <div>
                              <div className="text-sm font-bold text-slate-900">
                                {type}
                              </div>

                              <div className="text-xs text-slate-500">
                                {formatDate(
                                  transaction?.createdAt ||
                                    transaction?.date
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-slate-900">
                              {formatCurrency(amount)}
                            </div>

                            <div
                              className={`text-[11px] font-bold capitalize ${
                                normalizeStatus(
                                  transaction?.status
                                ).includes("success") ||
                                normalizeStatus(
                                  transaction?.status
                                ).includes("completed")
                                  ? "text-emerald-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {normalizeStatus(
                                transaction?.status ||
                                  "recorded"
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>

            {/* NOTIFICATIONS */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="font-black text-slate-900">
                    Notifications
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Latest account updates
                  </p>
                </div>

                <Link
                  href="/customer/notifications"
                  className="flex items-center gap-1 text-sm font-bold text-blue-600"
                >
                  View all
                  <ChevronRight size={16} />
                </Link>
              </div>

              {state.notifications.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Bell
                    size={25}
                    className="mx-auto text-slate-300"
                  />

                  <div className="mt-3 text-sm font-bold text-slate-700">
                    No new notifications
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    You are all caught up.
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {state.notifications
                    .slice(0, 4)
                    .map((notification, index) => (
                      <div
                        key={
                          notification?.id ||
                          index
                        }
                        className="flex gap-4 px-6 py-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Bell size={17} />
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900">
                            {notification?.title ||
                              "Notification"}
                          </div>

                          <div className="mt-1 text-xs leading-5 text-slate-500">
                            {notification?.message ||
                              notification?.description ||
                              "You have a new account update."}
                          </div>

                          <div className="mt-1 text-[10px] text-slate-400">
                            {formatDate(
                              notification?.createdAt
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  iconClass,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  value: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="mt-4 text-xs font-semibold text-slate-500">
        {title}
      </div>

      <div className="mt-1 text-2xl font-black tracking-tight text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-[11px] text-slate-400">
        {subtitle}
      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black text-slate-900">
            {title}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {subtitle}
          </div>
        </div>

        <ArrowRight
          size={16}
          className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
        />
      </div>
    </Link>
  );
}

function StatusRow({
  icon,
  title,
  status,
  success,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  success: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          success
            ? "bg-emerald-50 text-emerald-600"
            : "bg-amber-50 text-amber-600"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-slate-700">
          {title}
        </div>

        <div
          className={`mt-0.5 text-xs font-semibold ${
            success
              ? "text-emerald-600"
              : "text-amber-600"
          }`}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <div className="mt-4 text-sm font-black text-slate-800">
        {title}
      </div>

      <div className="mt-1 text-xs text-slate-500">
        {subtitle}
      </div>

      {href && action && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
        >
          {action}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
