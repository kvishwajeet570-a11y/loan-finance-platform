"use client";

import { useCallback, useEffect, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell";
import api from "@/lib/api";

interface Banner {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  redirectUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export default function MarketingPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBanners = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/banner/active");
      const data = response.data?.data;

      if (!Array.isArray(data)) {
        throw new Error("Unexpected banner API response");
      }

      setBanners(data);
    } catch (err) {
      console.error("Marketing banner API error:", err);
      setError("Banners load nahi ho paaye. Backend/API connection check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBanners();
  }, [loadBanners]);

  return (
    <DsaShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Marketing
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Live promotional banners from your backend.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadBanners()}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active Banners</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : banners.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Count returned by the live API
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Marketing Materials</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {loading ? "Loading" : "Live banner resources"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              No sample materials are inserted.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">API Connection</p>
            <p className={`mt-2 text-lg font-bold ${error ? "text-red-600" : loading ? "text-amber-600" : "text-emerald-600"}`}>
              {error ? "Error" : loading ? "Connecting..." : "Response received"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              GET /api/banner/active
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Banners & Posters
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Active banners currently returned by the backend.
            </p>
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
              <button
                type="button"
                onClick={() => void loadBanners()}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading live banners...
            </p>
          ) : banners.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-semibold text-slate-700">No active banners</p>
              <p className="mt-1 text-sm text-slate-500">
                The API returned no active banner records.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {banners.map((banner) => (
                <article
                  key={banner.id}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="h-44 w-full bg-slate-100 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900">
                        {banner.title}
                      </h3>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        Active
                      </span>
                    </div>
                    {banner.description && (
                      <p className="text-sm text-slate-600">
                        {banner.description}
                      </p>
                    )}
                    {banner.createdAt && (
                      <p className="text-xs text-slate-400">
                        Created: {new Date(banner.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {banner.redirectUrl && (
                      <a
                        href={banner.redirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-sm font-semibold text-blue-700 underline"
                      >
                        Open destination
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </DsaShell>
  );
}
