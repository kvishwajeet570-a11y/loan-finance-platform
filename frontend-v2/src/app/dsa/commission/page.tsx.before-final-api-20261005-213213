'use client';

import { useEffect, useState } from 'react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

type Commission = {
  id: string;
  amount?: number;
  commissionAmount?: number;
  status?: string;
  source?: string;
  createdAt?: string;
  loanId?: string;
  partnerId?: string;
};

export default function CommissionPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCommissions = async () => {
      try {
        setLoading(true);
        setError('');

        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken');

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const userId =
          localStorage.getItem('userId') ||
          localStorage.getItem('user_id');

        const endpoint = userId
          ? `${API_URL}/commission/user/${userId}`
          : `${API_URL}/commission`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Commission API returned ${response.status}`);
        }

        const result = await response.json();

        const data =
          Array.isArray(result) ? result :
          Array.isArray(result?.commissions) ? result.commissions :
          Array.isArray(result?.data) ? result.data :
          Array.isArray(result?.data?.commissions) ? result.data.commissions :
          [];

        setCommissions(data);
      } catch (err) {
        console.error('Commission API error:', err);
        setError('Unable to load real commission data.');
        setCommissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadCommissions();
  }, []);

  const totalCommission = commissions.reduce(
    (sum, item) => sum + Number(item.commissionAmount ?? item.amount ?? 0),
    0
  );

  const approvedCommission = commissions
    .filter((item) => String(item.status).toUpperCase() === 'APPROVED')
    .reduce(
      (sum, item) => sum + Number(item.commissionAmount ?? item.amount ?? 0),
      0
    );

  const pendingCommission = commissions
    .filter((item) => String(item.status).toUpperCase() === 'PENDING')
    .reduce(
      (sum, item) => sum + Number(item.commissionAmount ?? item.amount ?? 0),
      0
    );

  if (loading) {
    return (
      <main className="commission-page min-h-screen bg-[#f4f8ff] px-3 py-4 text-[#101b55]">
        <div className="mx-auto max-w-[1440px] rounded-[20px] bg-white p-8 shadow-sm">
          Loading real commission data...
        </div>
      </main>
    );
  }

  return (
    <main className="commission-page min-h-screen bg-[#f4f8ff] px-3 py-4 text-[#101b55]">
      <div className="mx-auto w-full max-w-[1440px] space-y-4">

        <section className="rounded-[20px] border border-blue-100 bg-gradient-to-r from-white via-[#eef6ff] to-[#dceaff] px-5 py-6 shadow-sm">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Commission
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Real commission data from your backend.
          </p>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Commission</p>
            <p className="mt-2 text-3xl font-black">
              ₹{totalCommission.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Approved</p>
            <p className="mt-2 text-3xl font-black text-green-600">
              ₹{approvedCommission.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-2 text-3xl font-black text-orange-500">
              ₹{pendingCommission.toLocaleString('en-IN')}
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Real Commission History</h2>
            <span className="text-sm text-slate-500">
              {commissions.length} records
            </span>
          </div>

          {commissions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
              No real commission records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Source</th>
                    <th className="px-3 py-3">Loan ID</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {commissions.map((item) => {
                    const amount = Number(
                      item.commissionAmount ?? item.amount ?? 0
                    );

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-50"
                      >
                        <td className="px-3 py-3">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                'en-IN'
                              )
                            : '-'}
                        </td>

                        <td className="px-3 py-3 font-semibold">
                          {item.source || '-'}
                        </td>

                        <td className="px-3 py-3">
                          {item.loanId || '-'}
                        </td>

                        <td className="px-3 py-3 font-bold">
                          ₹{amount.toLocaleString('en-IN')}
                        </td>

                        <td className="px-3 py-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                            {item.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
