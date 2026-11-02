import Link from "next/link";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/dsa/reports" className="text-sm font-semibold text-blue-700">
          ← Back to Reports
        </Link>

        <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-800 p-8 text-white">
          <p className="text-sm text-blue-200">DSA FINCORP · REPORTS</p>
          <h1 className="mt-2 text-3xl font-bold">Target Details</h1>
          <p className="mt-3 text-blue-100">Review target progress and monthly achievement.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Report Overview</h2>
          <p className="mt-2 text-sm text-slate-600">
            This report page is ready. Connect the relevant backend API to display actual report data.
          </p>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No live report data loaded yet.
          </div>
        </section>
      </div>
    </main>
  );
}
