"use client";

import { useEffect, useMemo, useState } from "react";

type TrainingResource = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  type?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  status?: string | null;
};

type LiveSession = {
  id: string;
  title: string;
  description?: string | null;
  startsAt: string;
  platform?: string | null;
  meetingLink?: string | null;
  status?: string | null;
  registrations?: { id: string; status?: string }[];
};

type BlogPost = {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  slug?: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function readJson(url: string, token?: string) {
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function formatDate(value?: string | null) {
  if (!value) return "Date not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EmptyState({ children }: { children: string }) {
  return (
    <div className="rounded-xl border border-dashed border-blue-200 bg-[#f8fbff] p-5 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export default function TrainingPage() {
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [registering, setRegistering] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const failed: string[] = [];
      const token =
        localStorage.getItem("loan_finance_token") ||
        localStorage.getItem("token") ||
        "";

      const results = await Promise.allSettled([
        readJson(`${API_BASE}/training`, token),
        readJson(`${API_BASE}/live-sessions`, token),
        readJson(`${API_BASE}/blog/published?limit=6`),
      ]);

      if (!active) return;

      const trainingResult = results[0];
      if (trainingResult.status === "fulfilled") {
        const payload = trainingResult.value;
        setResources(Array.isArray(payload?.data) ? payload.data : []);
      } else {
        failed.push("Training resources");
        setResources([]);
      }

      const sessionResult = results[1];
      if (sessionResult.status === "fulfilled") {
        const payload = sessionResult.value;
        setSessions(Array.isArray(payload?.data) ? payload.data : []);
      } else {
        failed.push("Live sessions");
        setSessions([]);
      }

      const blogResult = results[2];
      if (blogResult.status === "fulfilled") {
        const payload = blogResult.value;
        setBlogs(
          Array.isArray(payload?.blogs)
            ? payload.blogs
            : Array.isArray(payload?.data)
              ? payload.data
              : []
        );
      } else {
        failed.push("Published blogs");
        setBlogs([]);
      }

      setErrors(failed);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const search = query.trim().toLowerCase();

  const filteredResources = useMemo(
    () =>
      resources.filter((item) =>
        [item.title, item.description, item.category, item.type]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search)
      ),
    [resources, search]
  );

  const filteredSessions = useMemo(
    () =>
      sessions.filter((item) =>
        [item.title, item.description, item.platform]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search)
      ),
    [sessions, search]
  );

  const filteredBlogs = useMemo(
    () =>
      blogs.filter((item) =>
        [item.title, item.excerpt, item.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search)
      ),
    [blogs, search]
  );

  async function registerForSession(sessionId: string) {
    const token =
      localStorage.getItem("loan_finance_token") ||
      localStorage.getItem("token") ||
      "";

    if (!token) {
      setNotice("Please log in again to register for a live session.");
      return;
    }

    setRegistering(sessionId);
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE}/live-sessions/${encodeURIComponent(sessionId)}/register`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Registration failed.");
      }

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                registrations: [
                  ...(session.registrations || []).filter(
                    (registration) => registration.status !== "REGISTERED"
                  ),
                  { id: "current-registration", status: "REGISTERED" },
                ],
              }
            : session
        )
      );
      setNotice(payload?.message || "Registration confirmed.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Registration failed."
      );
    } finally {
      setRegistering(null);
    }
  }

  return (
    <>

      <div className="min-h-screen bg-[#eef5ff] ">
        <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-[1540px] flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-[42px] min-w-[220px] flex-1 rounded-xl border border-blue-200 bg-[#f8fbff] px-4 text-sm outline-none focus:border-blue-500"
              placeholder="Search training, blogs and live sessions..."
              aria-label="Search training content"
            />
            <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-xs font-bold text-slate-600">
              DSA FinCorp · Training Hub
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1540px] px-3 py-4 sm:px-5">
          <section className="relative overflow-hidden rounded-[22px] border border-cyan-300 bg-[#071b63] shadow-[0_0_35px_rgba(0,110,255,.20)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#031957]/95 via-[#073aa8]/85 to-[#351078]/90" />
            <div className="relative px-6 py-8 sm:px-10 sm:py-10">
              <span className="inline-flex rounded-full border border-cyan-300/70 bg-slate-950/40 px-4 py-1.5 text-[11px] font-black tracking-[2px] text-white">
                DSA TRAINING HUB
              </span>
              <p className="mt-3 text-xs font-bold tracking-[2px] text-cyan-200">
                SKILLS · KNOWLEDGE · PROFESSIONAL GROWTH
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
                Learn <span className="text-cyan-300">Today</span>
                <br />
                Lead <span className="text-purple-300">Tomorrow</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-50">
                Access published training resources, upcoming live sessions and
                published articles from your training hub.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-white">
                <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                  Published resources: {resources.length}
                </span>
                <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                  Live sessions: {sessions.length}
                </span>
                <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                  Published articles: {blogs.length}
                </span>
              </div>
            </div>
          </section>

          {notice && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-blue-200 bg-white p-3 text-sm text-blue-800"
            >
              {notice}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Could not load: {errors.join(", ")}. Check that the backend is
              running and you are logged in. Available sections may still show
              their loaded data.
            </div>
          )}

          <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Published Resources",
                value: resources.length,
                icon: "📚",
                color: "bg-blue-600",
              },
              {
                label: "Upcoming Live Sessions",
                value: sessions.filter(
                  (session) => new Date(session.startsAt).getTime() >= Date.now()
                ).length,
                icon: "🎥",
                color: "bg-emerald-500",
              },
              {
                label: "Published Articles",
                value: blogs.length,
                icon: "📰",
                color: "bg-purple-600",
              },
              {
                label: "Learning Progress",
                value: "Not tracked",
                icon: "📈",
                color: "bg-orange-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#07165f]">
                      {stat.value}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#07165f]">
                    📚 Published Training Resources
                  </h2>
                  <p className="text-xs text-slate-500">
                    Resources published by your training administrator
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {filteredResources.length}
                </span>
              </div>

              {loading ? (
                <EmptyState>Loading published resources...</EmptyState>
              ) : filteredResources.length === 0 ? (
                <EmptyState>
                  No published training resources found.
                </EmptyState>
              ) : (
                <div className="space-y-3">
                  {filteredResources.map((resource) => (
                    <article
                      key={resource.id}
                      className="rounded-xl border border-blue-100 bg-[#f8fbff] p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-black text-blue-700">
                          {resource.category || "Training"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                          {resource.type || "RESOURCE"}
                        </span>
                      </div>
                      <h3 className="mt-2 font-black text-[#07165f]">
                        {resource.title}
                      </h3>
                      {resource.description && (
                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {resource.description}
                        </p>
                      )}
                      {resource.fileUrl ? (
                        <a
                          href={
                            resource.fileUrl.startsWith("http")
                              ? resource.fileUrl
                              : `${API_BASE.replace(/\/api\/?$/, "")}${resource.fileUrl.startsWith("/") ? "" : "/"}${resource.fileUrl}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700"
                        >
                          Open Resource ↗
                        </a>
                      ) : (
                        <p className="mt-3 text-xs text-slate-500">
                          No resource link available.
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#07165f]">
                    🎥 Upcoming Live Sessions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Published sessions from the live training API
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {filteredSessions.length}
                </span>
              </div>

              {loading ? (
                <EmptyState>Loading live sessions...</EmptyState>
              ) : filteredSessions.length === 0 ? (
                <EmptyState>No published live sessions found.</EmptyState>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => {
                    const registered = (session.registrations || []).some(
                      (registration) =>
                        registration.status === "REGISTERED" ||
                        registration.status === "CONFIRMED"
                    );
                    const upcoming =
                      new Date(session.startsAt).getTime() >= Date.now();

                    return (
                      <article
                        key={session.id}
                        className="rounded-xl border border-blue-100 bg-[#f8fbff] p-4"
                      >
                        <h3 className="font-black text-[#07165f]">
                          {session.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(session.startsAt)}
                          {session.platform ? ` · ${session.platform}` : ""}
                        </p>
                        {session.description && (
                          <p className="mt-2 text-sm text-slate-600">
                            {session.description}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {registered ? (
                            <span className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                              Registered
                            </span>
                          ) : upcoming ? (
                            <button
                              type="button"
                              disabled={registering === session.id}
                              onClick={() => registerForSession(session.id)}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                            >
                              {registering === session.id
                                ? "Registering..."
                                : "Register"}
                            </button>
                          ) : (
                            <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                              Session ended
                            </span>
                          )}
                          {registered && session.meetingLink && upcoming && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700"
                            >
                              Meeting Link ↗
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-[#07165f]">
                  📰 Published Training Articles
                </h2>
                <p className="text-xs text-slate-500">
                  Articles returned by the published blog endpoint
                </p>
              </div>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                {filteredBlogs.length}
              </span>
            </div>

            {loading ? (
              <EmptyState>Loading published articles...</EmptyState>
            ) : filteredBlogs.length === 0 ? (
              <EmptyState>No published articles found.</EmptyState>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="rounded-xl border border-blue-100 bg-[#f8fbff] p-4"
                  >
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-black text-purple-700">
                      {blog.category || "Article"}
                    </span>
                    <h3 className="mt-3 font-black text-[#07165f]">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="mt-2 text-sm leading-5 text-slate-600">
                        {blog.excerpt}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-slate-500">
                      {formatDate(blog.publishedAt)}
                    </p>
                    {blog.slug && (
                      <a
                        href={`/blog/${encodeURIComponent(blog.slug)}`}
                        className="mt-3 inline-flex text-xs font-black text-blue-700"
                      >
                        Read Article →
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="py-6 text-center text-[10px] font-semibold text-slate-400">
            DSA FinCorp · Training Hub · Published Learning Resources
          </footer>
        </main>
      </div>
    </>
  );
}

