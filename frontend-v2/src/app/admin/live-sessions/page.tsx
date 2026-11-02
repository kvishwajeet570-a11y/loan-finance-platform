"use client";

import { useCallback, useEffect, useState } from "react";

const API =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

type Session = {
  id: string;
  title: string;
  description?: string | null;
  startsAt: string;
  platform?: string | null;
  meetingLink?: string | null;
  status: string;
};

export default function AdminLiveSessionsPage() {
  const [items, setItems] = useState<Session[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [platform, setPlatform] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = () =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem("loan_finance_token") ||
        localStorage.getItem("token") ||
        "";

  const request = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token()}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed (${response.status})`);
    }
    return data;
  };

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request("/live-sessions/admin/all");
      setItems(Array.isArray(data) ? data : data.sessions || data.data || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  async function createSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await request("/live-sessions/admin", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          startsAt: new Date(startsAt).toISOString(),
          platform,
          meetingLink: meetingLink.trim(),
        }),
      });

      setTitle("");
      setDescription("");
      setStartsAt("");
      setMeetingLink("");
      setMessage("Session created. Publish it when it is ready for DSA users.");
      await loadSessions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create session.");
    } finally {
      setSaving(false);
    }
  }

  async function publishSession(id: string) {
    setMessage("");
    try {
      await request(`/live-sessions/admin/${id}/publish`, { method: "PATCH" });
      setMessage("Session published.");
      await loadSessions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish session.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Training Management
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">
            Live Training Sessions
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create sessions, add the meeting link and publish them for DSA users.
          </p>
        </header>

        <form onSubmit={createSession}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Create a session</h2>

          <label className="block text-sm font-semibold text-slate-700">
            Session title
            <input required maxLength={160} value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-3"
              placeholder="e.g. Customer Handling & Closing" />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Description
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-3"
              rows={3} placeholder="What will this session cover?" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Date and time
              <input required type="datetime-local" value={startsAt}
                onChange={e => setStartsAt(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-3" />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Meeting platform
              <select value={platform} onChange={e => setPlatform(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-3">
                <option>Google Meet</option>
                <option>Zoom</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Meeting URL
            <input required type="url" value={meetingLink}
              onChange={e => setMeetingLink(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-3"
              placeholder="https://meet.google.com/..." />
          </label>

          <button disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
            {saving ? "Creating..." : "Create Session"}
          </button>
        </form>

        {message && (
          <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            {message}
          </p>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">All sessions</h2>
            <button onClick={() => void loadSessions()}
              className="text-sm font-bold text-blue-600">Refresh</button>
          </div>

          {loading ? <p className="text-sm text-slate-500">Loading sessions...</p> :
            items.length === 0 ? <p className="text-sm text-slate-500">
              No sessions created yet.
            </p> :
            <div className="space-y-3">
              {items.map(item => (
                <article key={item.id}
                  className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
                      <p className="mt-2 text-sm text-slate-500">
                        {new Date(item.startsAt).toLocaleString()} · {item.platform || "Online"}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-500">{item.meetingLink}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                      {item.status}
                    </span>
                  </div>
                  {item.status !== "PUBLISHED" && item.status !== "PUBLISHED".toLowerCase() && (
                    <button onClick={() => void publishSession(item.id)}
                      className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white">
                      Publish for DSA
                    </button>
                  )}
                </article>
              ))}
            </div>
          }
        </section>
      </div>
    </main>
  );
}
