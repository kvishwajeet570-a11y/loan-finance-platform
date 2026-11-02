"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

type AnyRecord = Record<string, any>;

const panel =
  "rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg";
const button =
  "rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-50";

function extractRows(payload: any): AnyRecord[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.sessions)) return payload.data.sessions;
  if (Array.isArray(payload?.data?.logs)) return payload.data.logs;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  if (Array.isArray(payload?.logs)) return payload.logs;
  return [];
}

function StatCard({
  title,
  value,
  subtitle,
  accent = "text-cyan-400",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div className={panel}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${accent}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

export default function SecurityCenterPage() {
  const [tab, setTab] = useState<"logs" | "sessions">("logs");
  const [logs, setLogs] = useState<AnyRecord[]>([]);
  const [sessions, setSessions] = useState<AnyRecord[]>([]);
  const [logStats, setLogStats] = useState<AnyRecord>({});
  const [sessionStats, setSessionStats] = useState<AnyRecord>({});
  const [severity, setSeverity] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [logResult, logAnalytics, sessionResult, sessionAnalytics] =
        await Promise.allSettled([
          api.get("/security-log"),
          api.get("/security-log/analytics"),
          api.get("/sessions"),
          api.get("/sessions/analytics"),
        ]);

      const failures: string[] = [];

      if (logResult.status === "fulfilled") {
        const payload = logResult.value.data;
        let rows = extractRows(payload);
        if (severity !== "ALL") {
          rows = rows.filter(
            (item) =>
              String(item.severity || "").toUpperCase() === severity
          );
        }
        setLogs(rows);
      } else {
        setLogs([]);
        failures.push("Security Logs");
      }

      if (logAnalytics.status === "fulfilled") {
        setLogStats(logAnalytics.value.data?.data || {});
      } else {
        setLogStats({});
        failures.push("Security Analytics");
      }

      if (sessionResult.status === "fulfilled") {
        setSessions(extractRows(sessionResult.value.data));
      } else {
        setSessions([]);
        failures.push("Sessions");
      }

      if (sessionAnalytics.status === "fulfilled") {
        setSessionStats(sessionAnalytics.value.data?.data || {});
      } else {
        setSessionStats({});
        failures.push("Session Analytics");
      }

      if (failures.length) {
        setError(
          "कुछ APIs उपलब्ध नहीं हैं: " +
            failures.join(", ") +
            ". Backend server और API connection जाँचें।"
        );
      }
    } catch {
      setError("Backend से data प्राप्त नहीं हुआ। Server और API URL जाँचें।");
    } finally {
      setLoading(false);
    }
  }, [severity]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const performSessionAction = async (
    id: string,
    action: "logout" | "delete"
  ) => {
    if (!id) return;

    const confirmed = window.confirm(
      action === "logout"
        ? "क्या इस session को Force Logout करना है?"
        : "क्या इस session को permanently delete करना है?"
    );

    if (!confirmed) return;

    setBusyId(id);
    setNotice("");
    setError("");

    try {
      if (action === "logout") {
        await api.patch(`/sessions/${encodeURIComponent(id)}/logout`);
      } else {
        await api.delete(`/sessions/${encodeURIComponent(id)}`);
      }
      setNotice(
        action === "logout"
          ? "Session logout request successful."
          : "Session delete request successful."
      );
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Action failed. Permission और backend status जाँचें।"
      );
    } finally {
      setBusyId("");
    }
  };

  const formatDate = (value: any) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  };

  const totalLogs = logStats.totalLogs ?? logs.length;
  const criticalLogs = logStats.criticalLogs ?? "—";
  const failedEvents = logStats.failedEvents ?? "—";
  const totalSessions =
    sessionStats.totalSessions ?? sessions.length;
  const activeSessions = sessionStats.activeSessions ?? "—";
  const inactiveSessions = sessionStats.inactiveSessions ?? "—";

  return (
    <main className="min-h-screen bg-[#070d19] px-4 py-7 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              Super Admin Control
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Security Center
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Security monitoring, audit events and active session management.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className={`${button} border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20`}
          >
            {loading ? "Refreshing..." : "↻ Refresh Data"}
          </button>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
        {notice && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {notice}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Total Security Events" value={totalLogs} subtitle="Recorded security events" />
          <StatCard title="Critical Events" value={criticalLogs} subtitle="Critical severity records" accent="text-red-400" />
          <StatCard title="Failed Events" value={failedEvents} subtitle="Events marked FAILED" accent="text-amber-400" />
          <StatCard title="Total Sessions" value={totalSessions} subtitle="Recorded user sessions" />
          <StatCard title="Active Sessions" value={activeSessions} subtitle="Currently active sessions" accent="text-emerald-400" />
          <StatCard title="Inactive Sessions" value={inactiveSessions} subtitle="Inactive session records" accent="text-amber-400" />
        </section>

        <section className={panel}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTab("logs")}
              className={`${button} ${
                tab === "logs"
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Security Logs
            </button>
            <button
              onClick={() => setTab("sessions")}
              className={`${button} ${
                tab === "sessions"
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Session Management
            </button>
          </div>

          {tab === "logs" && (
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Security Events</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Latest events returned by the Security Log API
                  </p>
                </div>
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                >
                  <option value="ALL">All Severity</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr className="border-b border-slate-800">
                      <th className="p-3">Event</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr
                        key={log.id || index}
                        className="border-b border-slate-800/70 hover:bg-slate-800/40"
                      >
                        <td className="p-3">
                          <p className="font-semibold text-slate-200">{log.action || "—"}</p>
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {log.description || log.module || "—"}
                          </p>
                        </td>
                        <td className="p-3 text-slate-300">
                          {log.user?.name || log.userId || "System"}
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">
                            {log.severity || "—"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{log.status || "—"}</td>
                        <td className="p-3 text-slate-400">{log.ipAddress || "—"}</td>
                        <td className="p-3 text-xs text-slate-400">{formatDate(log.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!loading && logs.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                  No security log records available.
                </p>
              )}
            </div>
          )}

          {tab === "sessions" && (
            <div className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Session Management</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Review sessions and revoke access when necessary.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr className="border-b border-slate-800">
                      <th className="p-3">User</th>
                      <th className="p-3">Session ID</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Login Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session, index) => {
                      const id = String(session.id || "");
                      return (
                        <tr
                          key={id || index}
                          className="border-b border-slate-800/70 hover:bg-slate-800/40"
                        >
                          <td className="p-3">
                            <p className="font-semibold">{session.user?.name || session.userId || "—"}</p>
                            <p className="text-xs text-slate-500">{session.user?.email || ""}</p>
                          </td>
                          <td className="max-w-[150px] truncate p-3 text-xs text-slate-400">{id || "—"}</td>
                          <td className="p-3 text-slate-400">{session.ipAddress || "—"}</td>
                          <td className="p-3 text-xs text-slate-400">{formatDate(session.loginAt)}</td>
                          <td className="p-3">
                            <span className={`rounded-full px-2 py-1 text-xs ${session.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-700 text-slate-300"}`}>
                              {session.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                disabled={!id || !session.isActive || busyId === id}
                                onClick={() => performSessionAction(id, "logout")}
                                className={`${button} bg-amber-500/10 text-amber-300 hover:bg-amber-500/20`}
                              >
                                Logout
                              </button>
                              <button
                                disabled={!id || busyId === id}
                                onClick={() => performSessionAction(id, "delete")}
                                className={`${button} bg-red-500/10 text-red-300 hover:bg-red-500/20`}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {!loading && sessions.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                  No session records available.
                </p>
              )}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-600">
          Security Center · Live API data · Access controlled by backend authorization
        </p>
      </div>
    </main>
  );
}
