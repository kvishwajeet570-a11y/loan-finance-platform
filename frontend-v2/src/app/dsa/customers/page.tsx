"use client";

import { useEffect, useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Loan = {
  id: string;
  userId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  loanType?: string;
  amount?: number;
  status?: string;
  city?: string;
  state?: string;
  createdAt?: string;
};

type Customer = {
  key: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  applications: number;
  totalAmount: number;
  approved: number;
  pending: number;
  rejected: number;
  latestDate?: string;
};

const money = (v: number) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

function statusStyle(status: string) {
  const s = status.toUpperCase();

  if (s === "APPROVED")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (s === "PENDING")
    return "bg-amber-50 text-amber-700 border-amber-200";

  if (s === "REJECTED")
    return "bg-red-50 text-red-700 border-red-200";

  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function DsaCustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openCustomerMenu, setOpenCustomerMenu] = useState<string | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [product, setProduct] = useState("ALL");

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(
        localStorage.getItem("loan_finance_user") || "{}"
      );

      if (!user?.id) {
        throw new Error("DSA login session not found.");
      }

      const token = localStorage.getItem("loan_finance_token");

      const res = await fetch(`${API}/dsa/${user.id}/loans`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Unable to load customers.");
      }

      const rows = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.loans)
        ? json.loans
        : [];

      setLoans(rows);
    } catch (e: any) {
      setError(e?.message || "Unable to load customers.");
      setLoans([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();

    for (const loan of loans) {
      const key = String(
        loan.userId ||
          loan.phone ||
          loan.email ||
          loan.fullName ||
          loan.id
      );

      const s = String(loan.status || "").toUpperCase();

      if (!map.has(key)) {
        map.set(key, {
          key,
          userId: loan.userId,
          name: loan.fullName || "Unnamed Customer",
          email: loan.email,
          phone: loan.phone,
          city: loan.city,
          state: loan.state,
          applications: 1,
          totalAmount: Number(loan.amount || 0),
          approved: s === "APPROVED" ? 1 : 0,
          pending: s === "PENDING" ? 1 : 0,
          rejected: s === "REJECTED" ? 1 : 0,
          latestDate: loan.createdAt,
        });
      } else {
        const c = map.get(key)!;

        c.applications += 1;
        c.totalAmount += Number(loan.amount || 0);

        if (s === "APPROVED") c.approved += 1;
        if (s === "PENDING") c.pending += 1;
        if (s === "REJECTED") c.rejected += 1;

        if (
          loan.createdAt &&
          (!c.latestDate ||
            new Date(loan.createdAt).getTime() >
              new Date(c.latestDate).getTime())
        ) {
          c.latestDate = loan.createdAt;
        }

        c.name = loan.fullName || c.name;
        c.email = loan.email || c.email;
        c.phone = loan.phone || c.phone;
        c.city = loan.city || c.city;
        c.state = loan.state || c.state;
      }
    }

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.latestDate || 0).getTime() -
        new Date(a.latestDate || 0).getTime()
    );
  }, [loans]);

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          customers
            .map((c) => [c.city, c.state].filter(Boolean).join(", "))
            .filter(Boolean)
        )
      ),
    [customers]
  );

  const products = useMemo(
    () =>
      Array.from(
        new Set(loans.map((x) => x.loanType).filter(Boolean) as string[])
      ),
    [loans]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return customers.filter((c) => {
      const text = [
        c.name,
        c.email,
        c.phone,
        c.city,
        c.state,
        c.userId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || text.includes(q);

      const matchesStatus =
        status === "ALL" ||
        (status === "APPROVED" && c.approved > 0) ||
        (status === "PENDING" && c.pending > 0) ||
        (status === "REJECTED" && c.rejected > 0);

      const customerLocation = [c.city, c.state]
        .filter(Boolean)
        .join(", ");

      const matchesLocation =
        location === "ALL" || customerLocation === location;

      const customerLoans = loans.filter(
        (l) =>
          String(l.userId || l.phone || l.email || l.fullName || l.id) ===
          c.key
      );

      const matchesProduct =
        product === "ALL" ||
        customerLoans.some((l) => l.loanType === product);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesProduct
      );
    });
  }, [customers, loans, search, status, location, product]);

  const stats = useMemo(
    () => ({
      customers: customers.length,
      applications: loans.length,
      approved: loans.filter(
        (x) => String(x.status).toUpperCase() === "APPROVED"
      ).length,
      value: loans.reduce((sum, x) => sum + Number(x.amount || 0), 0),
    }),
    [customers, loans]
  );

  return (
    <DsaShell>
      <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
        <style jsx global>{`
          .customer-premium {
            background:
              radial-gradient(circle at 85% 5%, rgba(37, 99, 235, .10), transparent 25%),
              radial-gradient(circle at 5% 30%, rgba(14, 165, 233, .08), transparent 22%),
              #f4f7fb;
          }

          .customer-card {
            box-shadow:
              0 8px 30px rgba(15, 23, 42, .055),
              0 1px 2px rgba(15, 23, 42, .04);
          }

          .customer-row {
            transition: all .18s ease;
          }

          .customer-row:hover {
            background: #f8fbff;
            transform: translateY(-1px);
          }
        `}</style>

        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-5 py-4 backdrop-blur-xl md:px-8 xl:px-10">
          <div className="mx-auto flex max-w-[1850px] items-center gap-4">
            <div className="relative hidden max-w-xl flex-1 md:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                ⌕
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers, loans, applications..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right lg:block">
                <p className="text-xs font-bold text-slate-400">
                  PARTNER PORTAL
                </p>
                <p className="text-sm font-black text-slate-800">
                  DSA FinCorp
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm">
                🔔
              </div>
            </div>
          </div>
        </header>

        <main className="customer-premium mx-auto min-h-[215px] max-w-[1850px] p-5 md:p-8 xl:p-10">
          <div className="mb-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <span className="text-blue-600">⌂</span>
                Dashboard
                <span>›</span>
                <span className="text-slate-900">Customers</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl text-white shadow-lg shadow-blue-500/25">
                  👥
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                    Customers
                  </h1>
                  <p className="mt-1 text-base font-medium text-slate-500">
                    Your customers, their loan applications and complete history
                  </p>
                </div>
              </div>
            </div>

            <div className="customer-hero relative overflow-hidden rounded-[28px] border border-blue-200/50 shadow-2xl shadow-blue-900/15">
              <div
                className="relative flex min-h-[390px] w-full items-center justify-between overflow-hidden bg-center bg-cover bg-no-repeat px-8 py-8 md:min-h-[390px] md:px-10"
                style={{
                  backgroundImage: 'linear-gradient(90deg,rgba(3,25,70,.72) 0%,rgba(5,55,125,.48) 38%,rgba(0,119,182,.20) 72%,rgba(0,0,0,.04) 100%),url("/images/dsa/dsa-dashboard-banner.png")', backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                }}
              >
                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex rounded-full border border-cyan-300/30 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[.18em] text-cyan-200 backdrop-blur">
                    DSA FinCorp • Customer Growth
                  </span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                    Happy Customers,
                  </h2>
                  <p className="text-3xl font-black text-cyan-200 md:text-4xl">
                    Higher Earnings!
                  </p>
                  <p className="mt-3 max-w-md text-sm font-medium leading-6 text-blue-100 md:text-base">
                    Build stronger customer relationships, grow your loan
                    portfolio and unlock more business opportunities.
                  </p>
                </div>

                <div className="relative z-10 hidden items-center gap-3 md:flex">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-right -translate-x-28 backdrop-blur-xl">
                    <p className="text-xs font-bold text-cyan-200">
                      CUSTOMER PORTFOLIO
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {stats.customers}
                    </p>
                    <p className="text-xs text-blue-100">Live Customers</p>
                  </div>
                  <div className="text-6xl font-black text-cyan-300 drop-shadow-lg">
                    ↗
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(34,211,238,.22),transparent_30%)]" />
              </div>
            </div>
          </div>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Customers",
                value: stats.customers,
                icon: "👥",
                box: "from-blue-500 to-cyan-500",
              },
              {
                title: "Total Applications",
                value: stats.applications,
                icon: "▤",
                box: "from-violet-500 to-purple-600",
              },
              {
                title: "Approved Applications",
                value: stats.approved,
                icon: "✓",
                box: "from-emerald-500 to-green-600",
              },
              {
                title: "Total Loan Value",
                value: money(stats.value),
                icon: "₹",
                box: "from-orange-400 to-amber-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="customer-card rounded-3xl border border-slate-200/80 bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.box} text-2xl font-black text-white shadow-lg`}
                  >
                    {item.icon}
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                    LIVE
                  </span>
                </div>

                <p className="mt-5 text-sm font-bold text-slate-500">
                  {item.title}
                </p>

                <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {item.value}
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Calculated from live backend data
                </p>
              </div>
            ))}
          </section>

          <section className="customer-card mt-6 rounded-3xl border border-slate-200/80 bg-white p-4 md:p-5">
            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                  ⌕
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, phone, email, location..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-blue-400 focus:bg-white"
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="ALL">All Locations</option>
                {locations.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>

              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="ALL">All Loan Products</option>
                {products.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>

              <button
                onClick={loadCustomers}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                ↻ Refresh
              </button>
            </div>
          </section>

          <section className="customer-card mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-blue-600">👥</span>
                  <h2 className="text-2xl font-black text-slate-950">
                    Customer Directory
                  </h2>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {filtered.length} customers from your assigned applications
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm">
                  ⇩ Export
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[215px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                  <p className="mt-4 font-bold text-slate-500">
                    Loading live customer data...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="m-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                <p className="font-black">Unable to load customers</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex min-h-[215px] flex-col items-center justify-center text-center">
                <div className="text-6xl">👥</div>
                <h3 className="mt-4 text-xl font-black text-slate-800">
                  No customers found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  No assigned customer records match your current filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px]">
                  <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <tr className="text-left text-xs font-black uppercase tracking-wider text-blue-900">
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Applications</th>
                      <th className="px-6 py-4">Total Loan Value</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last Activity</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((customer, index) => {
                      const primary =
                        customer.approved > 0
                          ? "APPROVED"
                          : customer.pending > 0
                          ? "PENDING"
                          : customer.rejected > 0
                          ? "REJECTED"
                          : "ACTIVE";

                      return (
                        <tr key={customer.key} className="customer-row">
                          <td className="px-6 py-5 text-sm font-bold text-slate-400">
                            {index + 1}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-cyan-100 text-base font-black text-blue-700 shadow-md">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <p className="font-black text-slate-900">
                                  {customer.name}
                                </p>
                                <p className="text-xs font-semibold text-slate-400">
                                  {customer.userId || "Customer"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-slate-700">
                              ☎ {customer.phone || "—"}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400">
                              ✉ {customer.email || "—"}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                            📍{" "}
                            {[customer.city, customer.state]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </td>

                          <td className="px-6 py-5 text-sm font-black text-slate-900">
                            {customer.applications}
                          </td>

                          <td className="px-6 py-5 text-sm font-black text-slate-900">
                            {money(customer.totalAmount)}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-black ${statusStyle(
                                primary
                              )}`}
                            >
                              {primary}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm font-semibold text-slate-500">
                            {customer.latestDate
                              ? new Date(
                                  customer.latestDate
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>

                          <td className="px-6 py-5">
                            <div className="relative flex items-center gap-2">

                              {/* VIEW CUSTOMER */}
                              <button
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setOpenCustomerMenu(null);
                                }}
                                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-600 hover:text-white"
                              >
                                View
                              </button>

                              {/* CALL */}
                              {customer.phone && (
                                <a
                                  href={`tel:${customer.phone}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm transition hover:scale-105"
                                  title="Call customer"
                                >
                                  ☎
                                </a>
                              )}

                              {/* MORE ACTIONS */}
                              <button
                                onClick={() =>
                                  setOpenCustomerMenu(
                                    openCustomerMenu === customer.key
                                      ? null
                                      : customer.key
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-600 transition hover:bg-slate-200"
                                title="More actions"
                              >
                                ⋯
                              </button>

                              {openCustomerMenu === customer.key && (
                                <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">

                                  <button
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setOpenCustomerMenu(null);
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-blue-50"
                                  >
                                    👤 View Customer
                                  </button>

                                  {customer.phone && (
                                    <>
                                      <a
                                        href={`tel:${customer.phone}`}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50"
                                      >
                                        ☎ Call Customer
                                      </a>

                                      <a
                                        href={`https://wa.me/${String(customer.phone).replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-green-50"
                                      >
                                        💬 WhatsApp
                                      </a>
                                    </>
                                  )}

                                  {customer.email && (
                                    <a
                                      href={`mailto:${customer.email}`}
                                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-purple-50"
                                    >
                                      ✉ Email Customer
                                    </a>
                                  )}

                                  <button
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setOpenCustomerMenu(null);
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
                                  >
                                    📄 Application Details
                                  </button>

                                </div>
                              )}

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Showing {filtered.length} of {customers.length} customers
                </p>

                <div className="flex items-center gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
                    ‹
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-black text-white shadow-md">
                    1
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 font-bold text-slate-600">
                    2
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 font-bold text-slate-600">
                    3
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
                    ›
                  </button>
                </div>
              </div>
            )}
          </section>

          <footer className="py-7 text-center text-xs font-semibold text-slate-400">
            DSA FinCorp • Partner Portal • Customer Management
          </footer>
        
      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
                    Customer Profile
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {selectedCustomer.name}
                  </h2>
                  <p className="mt-1 text-sm text-blue-100">
                    {selectedCustomer.phone || "No phone"} •{" "}
                    {selectedCustomer.email || "No email"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg font-bold hover:bg-white/30"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Location
                </p>
                <p className="mt-1 font-black text-slate-800">
                  {[selectedCustomer.city, selectedCustomer.state]
                    .filter(Boolean)
                    .join(", ") || "Not available"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Applications
                </p>
                <p className="mt-1 text-2xl font-black text-blue-600">
                  {selectedCustomer.applications}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Total Loan Value
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {money(selectedCustomer.totalAmount)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Application Status
                </p>
                <p className="mt-1 font-black">
                  {selectedCustomer.approved > 0
                    ? "APPROVED"
                    : selectedCustomer.pending > 0
                      ? "PENDING"
                      : selectedCustomer.rejected > 0
                        ? "REJECTED"
                        : "NO STATUS"}
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">

              {selectedCustomer.phone && (
                <>
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-600"
                  >
                    ☎ Call
                  </a>

                  <a
                    href={`https://wa.me/${String(selectedCustomer.phone).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-green-500 px-4 py-2.5 text-sm font-black text-white hover:bg-green-600"
                  >
                    💬 WhatsApp
                  </a>
                </>
              )}

              {selectedCustomer.email && (
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-black text-white hover:bg-purple-700"
                >
                  ✉ Email
                </a>
              )}

              <button
                onClick={() => setSelectedCustomer(null)}
                className="ml-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}</main>
      </div>
    </DsaShell>
  );
}
































