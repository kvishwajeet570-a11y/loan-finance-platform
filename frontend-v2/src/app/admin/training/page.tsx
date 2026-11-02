"use client";

import React, { useCallback, useEffect, useState } from "react";

type TrainingResource = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  type: string;
  fileUrl: string;
  posterUrl?: string | null;
  fileName: string;
  fileSize?: number | null;
  status: string;
  createdAt: string;
  publishedAt?: string | null;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const API_ORIGIN = API_BASE.replace(/\/api$/, "");

function assetUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

function token() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("loan_finance_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const authToken = token();

  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || body.error || `Request failed (${response.status})`);
  }

  return body as T;
}

export default function AdminTrainingPage() {
  const [items, setItems] = useState<TrainingResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Loan Products");
  const [type, setType] = useState<"VIDEO" | "DOCUMENT">("VIDEO");
  const [file, setFile] = useState<File | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await request<{ data?: TrainingResource[] }>(
        "/training/admin/all"
      );
      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Training list load नहीं हुई।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function uploadTraining(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("पहले video या document चुनें।");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("description", description.trim());
      form.append("category", category);
      form.append("type", type);
      form.append("file", file);

      await request("/training/admin/upload", {
        method: "POST",
        body: form,
      });

      setTitle("");
      setDescription("");
      setFile(null);
      const input = document.getElementById("training-file") as HTMLInputElement | null;
      if (input) input.value = "";
      setNotice("Upload सफल हुआ। सामग्री Draft में सेव है; DSA को दिखाने के लिए Publish करें।");
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload असफल हुआ।");
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(item: TrainingResource, action: "publish" | "archive") {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      await request(`/training/admin/${encodeURIComponent(item.id)}/${action}`, {
        method: "PATCH",
      });
      setNotice(action === "publish" ? "Training publish हो गई।" : "Training archive हो गई।");
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status update असफल हुआ।");
    } finally {
      setBusy(false);
    }
  }

  const published = items.filter((item) => item.status === "PUBLISHED").length;
  const drafts = items.filter((item) => item.status === "DRAFT").length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-[#071b52] via-blue-800 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
            DSA FinCorp · Admin Console
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Training Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-blue-100">
            Videos और learning documents upload करें, review करें और DSA partners के लिए publish करें।
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-blue-100">Published</p>
              <p className="mt-1 text-3xl font-black">{published}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-blue-100">Drafts</p>
              <p className="mt-1 text-3xl font-black">{drafts}</p>
            </div>
          </div>
        </header>

        {notice && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {notice}
          </div>
        )}
        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-black">Upload Learning Material</h2>
            <p className="mt-1 text-sm text-slate-500">
              MP4, WebM, MOV videos या PDF, DOC, DOCX, PPT, PPTX documents।
            </p>
          </div>

          <form onSubmit={uploadTraining} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold">
                Training title *
                <input
                  required
                  maxLength={180}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="जैसे Personal Loan Product Training"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block text-sm font-semibold">
                Category *
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-600"
                >
                  <option>Loan Products</option>
                  <option>Sales & Marketing</option>
                  <option>Compliance</option>
                  <option>Digital Tools</option>
                  <option>Customer Handling</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-semibold">
              Description
              <textarea
                rows={3}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="इस training में क्या सिखाया जाएगा?"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold">
                Material type *
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value as "VIDEO" | "DOCUMENT");
                    setFile(null);
                    const input = document.getElementById("training-file") as HTMLInputElement | null;
                    if (input) input.value = "";
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal"
                >
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document / Presentation</option>
                </select>
              </label>

              <label className="block text-sm font-semibold">
                Select file *
                <input
                  id="training-file"
                  required
                  type="file"
                  accept={type === "VIDEO" ? "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" : ".pdf,.doc,.docx,.ppt,.pptx"}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-bold file:text-blue-700"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Maximum file size: 200 MB
                </span>
              </label>
            </div>

            {file && (
              <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
                Selected: <strong>{file.name}</strong> · {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={busy || !file || !title.trim()}
                className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Please wait..." : "Upload as Draft"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setFile(null);
                  const input = document.getElementById("training-file") as HTMLInputElement | null;
                  if (input) input.value = "";
                }}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold hover:bg-slate-50"
              >
                Clear form
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-black">Training Library</h2>
              <p className="mt-1 text-sm text-slate-500">Uploaded resources और publication status</p>
            </div>
            <button onClick={() => void loadItems()} disabled={loading} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50 disabled:opacity-50">
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <p className="p-8 text-sm text-slate-500">Training list लोड हो रही है...</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-sm text-slate-500">अभी कोई training upload नहीं हुई है। ऊपर से पहली training upload करें।</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <article key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{item.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${item.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" : item.status === "ARCHIVED" ? "bg-slate-200 text-slate-700" : "bg-amber-100 text-amber-800"}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.category} · {item.type} · {item.fileName}
                    </p>
                    {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
                    <a className="mt-2 inline-block text-sm font-bold text-blue-700 underline" href={assetUrl(item.fileUrl)} target="_blank" rel="noreferrer">
                      Open uploaded file
                    </a>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {(item.status === "DRAFT" || item.status === "PENDING_REVIEW") && (
                      <button disabled={busy} onClick={() => void updateStatus(item, "publish")} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                        Approve & Publish
                      </button>
                    )}
                    {item.status === "PUBLISHED" && (
                      <button disabled={busy} onClick={() => void updateStatus(item, "archive")} className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold hover:bg-slate-50 disabled:opacity-50">
                        Archive
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}