"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function money(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString("en-IN")}`
    : "—";
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-slate-900">
        {value === null || value === undefined || value === "" ? "—" : String(value)}
      </p>
    </div>
  );
}

export default function ApplicationDetailsPage() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadApplication() {
      try {
        const id = new URLSearchParams(window.location.search).get("id") || "";
        if (!id) {
          throw new Error("Application ID missing hai. Reports page se View button kholen.");
        }

        setApplicationId(id);

        const token = localStorage.getItem("loan_finance_token");
        if (!token) {
          throw new Error("Login session nahi mila. Dobara login karein.");
        }

        const response = await fetch(`${API_URL}/reports/dsa`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Application data load nahi ho saka.");
        }

        const applications = result.data?.recentApplications ?? [];
        const found = applications.find(
          (item: any) => String(item.id) === String(id)
        );

        if (!found) {
          throw new Error(
            "Yeh application Reports API ke recent records mein nahi mili. Full application details ke liye dedicated detail API ki zaroorat ho sakti hai."
          );
        }

        if (active) {
          setApplication(found);
          setError("");
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Data load nahi ho saka.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadApplication();
    return () => {
      active = false;
    };
  }, []);

  const status = String(application?.status ?? "Unknown");
  const approved = /approved|disbursed/i.test(status);
  const rejected = /rejected|declined/i.test(status);
  const statusStyle = approved
    ? "bg-emerald-50 text-emerald-700"
    : rejected
      ? "bg-rose-50 text-rose-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div className="min-h-screen bg-[#f3f7fd] text-[#102347]">

      <main className="min-w-0 ">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              DSA Reports / Applications
            </p>
            <h1 className="mt-1 text-xl font-black sm:text-2xl">
              Application Details
            </h1>
          </div>
          <button
            onClick={() => (window.location.href = "/dsa/reports")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold hover:bg-slate-50"
          >
            ← Back to Reports
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-7">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Application details load ho rahi hain...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-amber-200 bg-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
                !
              </div>
              <h2 className="mt-4 text-lg font-black text-slate-900">
                Application details unavailable
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {error}
              </p>
              {applicationId && (
                <p className="mt-3 text-xs text-slate-500">
                  Requested Application ID: {applicationId}
                </p>
              )}
              <button
                onClick={() => (window.location.href = "/dsa/reports")}
                className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                Back to Reports
              </button>
            </div>
          ) : (
            <>
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-[#102347] via-blue-800 to-indigo-700 p-5 text-white sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-blue-100">
                        APPLICATION REFERENCE
                      </p>
                      <h2 className="mt-2 break-all text-xl font-black sm:text-2xl">
                        {String(application.id ?? applicationId)}
                      </h2>
                      <p className="mt-2 text-sm text-blue-100">
                        Submitted {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-xs font-black ${statusStyle}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
                  <Detail label="Customer Name" value={application.fullName} />
                  <Detail label="Loan Type" value={application.loanType} />
                  <Detail label="Requested Loan Amount" value={money(application.amount)} />
                  <Detail label="Application Status" value={status} />
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-7">
                  <div className="mb-5">
                    <h2 className="text-lg font-black">Application Information</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Details currently supplied by the Reports API
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Detail label="Application ID" value={application.id} />
                    <Detail label="Customer Name" value={application.fullName} />
                    <Detail label="Loan Product" value={application.loanType} />
                    <Detail label="Loan Amount" value={money(application.amount)} />
                    <Detail label="Created Date & Time" value={formatDate(application.createdAt)} />
                    <Detail label="Current Status" value={status} />
                  </div>
                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm font-bold text-blue-900">Data integrity note</p>
                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      Mobile number, PAN, DOB, lender decision, EMI and document
                      details are shown only when the authorized API supplies them.
                      Missing fields are not fabricated.
                    </p>
                  </div>
                </div>

                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="text-lg font-black">Status Timeline</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Confirmed events available in this response
                  </p>
                  <div className="mt-6 space-y-6">
                    <div className="flex gap-3">
                      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                      <div>
                        <p className="text-sm font-bold">Application created</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${approved ? "bg-emerald-500 ring-emerald-50" : rejected ? "bg-rose-500 ring-rose-50" : "bg-amber-500 ring-amber-50"}`} />
                      <div>
                        <p className="text-sm font-bold">Current application status</p>
                        <p className="mt-1 text-xs text-slate-500">{status}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                    A complete historical timeline requires status-change events
                    from the backend. This page does not invent missing events.
                  </p>
                </aside>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">
                  Application details are scoped to the authenticated DSA Reports response.
                </p>
                <button
                  onClick={() => (window.location.href = "/dsa/reports")}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
                >
                  Finish · Back to Reports
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

