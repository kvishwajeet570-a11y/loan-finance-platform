"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
 Phone,
 Mail,
 MapPin,
 Clock,
 Headphones,
 HelpCircle,
 MessageSquare,
 Ticket,
 PlusCircle,
 ChevronRight,
 Search,
 RefreshCw,
 CheckCircle2,
 AlertCircle,
 LifeBuoy,
 FileText,
 ShieldCheck,
} from "lucide-react";

const API =
 process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type TicketItem = {
 id: string;
 subject?: string;
 message?: string;
 status?: string;
 priority?: string;
 createdAt?: string;
 updatedAt?: string;
};

export default function DsaSupportPage() {
 const [activeView, setActiveView] = useState("home");
 const [tickets, setTickets] = useState<TicketItem[]>([]);
 const [loadingTickets, setLoadingTickets] = useState(false);
 const [ticketError, setTicketError] = useState("");

 const [subject, setSubject] = useState("");
 const [message, setMessage] = useState("");
 const [priority, setPriority] = useState("medium");
 const [submitting, setSubmitting] = useState(false);
 const [submitMessage, setSubmitMessage] = useState("");
 const [submitError, setSubmitError] = useState("");

 const getAuth = () => {
 if (typeof window === "undefined") {
 return { token: "", user: null };
 }

 const token = localStorage.getItem("loan_finance_token") || "";
 const rawUser = localStorage.getItem("loan_finance_user");

 let user: any = null;

 try {
 user = rawUser ? JSON.parse(rawUser) : null;
 } catch {
 user = null;
 }

 return { token, user };
 };

 const loadTickets = async () => {
 setLoadingTickets(true);
 setTicketError("");

 try {
 const { token, user } = getAuth();
 const userId = user?.id || user?.userId;

 if (!userId) {
 setTicketError("User session not found. Please login again.");
 return;
 }

 const response = await fetch(
 `${API}/support/user/${userId}`,
 {
 cache: "no-store",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 ...(token
 ? { Authorization: `Bearer ${token}` }
 : {}),
 },
 }
 );

 const json = await response.json();

 if (!response.ok) {
 throw new Error(
 json?.message || "Failed to load support tickets."
 );
 }

 const data = json?.data ?? json;

 if (Array.isArray(data)) {
 setTickets(data);
 } else if (Array.isArray(data?.tickets)) {
 setTickets(data.tickets);
 } else if (Array.isArray(data?.data)) {
 setTickets(data.data);
 } else {
 setTickets([]);
 }
 } catch (error: any) {
 setTicketError(
 error?.message || "Unable to load your tickets."
 );
 } finally {
 setLoadingTickets(false);
 }
 };

 useEffect(() => {
 if (activeView === "tickets") {
 loadTickets();
 }
 }, [activeView]);

 const createTicket = async () => {
 setSubmitMessage("");
 setSubmitError("");

 if (!subject.trim()) {
 setSubmitError("Please enter a subject.");
 return;
 }

 if (!message.trim()) {
 setSubmitError("Please describe your issue.");
 return;
 }

 setSubmitting(true);

 try {
 const { token, user } = getAuth();
 const userId = user?.id || user?.userId;

 if (!userId) {
 throw new Error("User session not found. Please login again.");
 }

 const response = await fetch(`${API}/support`, {
 method: "POST",
 credentials: "include",
 headers: {
 "Content-Type": "application/json",
 ...(token
 ? { Authorization: `Bearer ${token}` }
 : {}),
 },
 body: JSON.stringify({
 userId,
 subject: subject.trim(),
 message: message.trim(),
 priority,
 }),
 });

 const json = await response.json();

 if (!response.ok) {
 throw new Error(
 json?.message || "Failed to create support ticket."
 );
 }

 setSubject("");
 setMessage("");
 setPriority("medium");
 setSubmitMessage(
 "Your support ticket has been created successfully."
 );

 setTimeout(() => {
 setActiveView("tickets");
 }, 800);
 } catch (error: any) {
 setSubmitError(
 error?.message || "Unable to create support ticket."
 );
 } finally {
 setSubmitting(false);
 }
 };

 const formatDate = (date?: string) => {
 if (!date) return "—";

 const d = new Date(date);

 if (Number.isNaN(d.getTime())) return "—";

 return d.toLocaleString("en-IN", {
 day: "2-digit",
 month: "short",
 year: "numeric",
 hour: "2-digit",
 minute: "2-digit",
 });
 };

 const statusClass = (status?: string) => {
 const value = String(status || "").toLowerCase();

 if (
 value.includes("resolved") ||
 value.includes("closed") ||
 value.includes("complete")
 ) {
 return "bg-emerald-50 text-emerald-700 border-emerald-200";
 }

 if (
 value.includes("pending") ||
 value.includes("open")
 ) {
 return "bg-amber-50 text-amber-700 border-amber-200";
 }

 return "bg-blue-50 text-blue-700 border-blue-200";
 };

 return (
 <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
 <div className="mx-auto max-w-7xl space-y-6">

 {/* Header */}
 <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg">
 <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
 <div>
 <div className="mb-2 flex items-center gap-3">
 <div className="rounded-xl bg-white/15 p-3">
 <LifeBuoy size={28} />
 </div>

 <div>
 <h1 className="text-2xl font-bold sm:text-3xl">
 Help & Support
 </h1>

 <p className="mt-1 text-sm text-blue-100 sm:text-base">
 We are here to help you with your DSA account,
 loans and platform related queries.
 </p>
 </div>
 </div>
 </div>

 <div className="flex flex-wrap gap-2">
 <button
 onClick={() => setActiveView("home")}
 className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
 activeView === "home"
 ? "bg-white text-blue-700"
 : "bg-white/10 text-white hover:bg-white/20"
 }`}
 >
 Support Home
 </button>

 <button
 onClick={() => setActiveView("tickets")}
 className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
 activeView === "tickets"
 ? "bg-white text-blue-700"
 : "bg-white/10 text-white hover:bg-white/20"
 }`}
 >
 My Tickets
 </button>

 <button
 onClick={() => setActiveView("create")}
 className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
 activeView === "create"
 ? "bg-white text-blue-700"
 : "bg-white/10 text-white hover:bg-white/20"
 }`}
 >
 Create Ticket
 </button>
 </div>
 </div>
 </div>

 {/* HOME */}
 {activeView === "home" && (
 <>
 {/* Contact Details */}
 <div>
 <h2 className="mb-4 text-xl font-bold text-slate-900">
 Contact Support
 </h2>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

 <a
 href="tel:+918292908077"
 className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
 >
 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
 <Phone size={24} />
 </div>

 <p className="text-sm font-medium text-slate-500">
 Call Us
 </p>

 <p className="mt-1 text-lg font-bold text-slate-900">
 +91 8292908077
 </p>

 <p className="mt-2 text-xs text-slate-500">
 Speak with our support team
 </p>
 </a>

 <a
 href="mailto:support@indialoanfinance.com"
 className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
 >
 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
 <Mail size={24} />
 </div>

 <p className="text-sm font-medium text-slate-500">
 Email Us
 </p>

 <p className="mt-1 break-all text-base font-bold text-slate-900">
 support@indialoanfinance.com
 </p>

 <p className="mt-2 text-xs text-slate-500">
 Send us your query
 </p>
 </a>

 <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
 <MapPin size={24} />
 </div>

 <p className="text-sm font-medium text-slate-500">
 Location
 </p>

 <p className="mt-1 text-lg font-bold text-slate-900">
 India
 </p>

 <p className="mt-2 text-xs text-slate-500">
 India Loan Finance support
 </p>
 </div>

 <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
 <Clock size={24} />
 </div>

 <p className="text-sm font-medium text-slate-500">
 Support Hours
 </p>

 <p className="mt-1 text-lg font-bold text-slate-900">
 Mon - Sat
 </p>

 <p className="mt-2 text-sm text-slate-500">
 9:00 AM - 7:00 PM
 </p>
 </div>

 </div>
 </div>

 {/* Quick Support */}
 <div className="grid gap-5 lg:grid-cols-3">

 <button
 onClick={() => setActiveView("create")}
 className="group rounded-2xl border border-blue-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
 >
 <div className="mb-5 flex items-center justify-between">
 <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
 <Ticket size={25} />
 </div>

 <ChevronRight
 className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
 size={22}
 />
 </div>

 <h3 className="text-lg font-bold text-slate-900">
 Create Support Ticket
 </h3>

 <p className="mt-2 text-sm leading-6 text-slate-500">
 Raise a support request for any issue related to
 your DSA account, loan application or services.
 </p>
 </button>

 <button
 onClick={() => setActiveView("tickets")}
 className="group rounded-2xl border border-emerald-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
 >
 <div className="mb-5 flex items-center justify-between">
 <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
 <MessageSquare size={25} />
 </div>

 <ChevronRight
 className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
 size={22}
 />
 </div>

 <h3 className="text-lg font-bold text-slate-900">
 My Support Tickets
 </h3>

 <p className="mt-2 text-sm leading-6 text-slate-500">
 Check your previous support requests and track
 their current status.
 </p>
 </button>

 <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
 <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
 <HelpCircle size={25} />
 </div>

 <h3 className="text-lg font-bold text-slate-900">
 Frequently Asked Questions
 </h3>

 <p className="mt-2 text-sm leading-6 text-slate-500">
 Find answers to common questions about loans,
 KYC, commissions and DSA services.
 </p>

 <button
 onClick={() => {
 window.location.href =
 "/dsa/support?view=faq";
 }}
 className="mt-4 text-sm font-bold text-purple-600 hover:text-purple-800"
 >
 View FAQs →
 </button>
 </div>

 </div>

 {/* Support Links */}
 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
 <h2 className="mb-5 text-xl font-bold text-slate-900">
 Support Resources
 </h2>

 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

 <button
 onClick={() => setActiveView("create")}
 className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
 >
 <Headphones className="text-blue-600" size={20} />
 <span className="font-semibold text-slate-800">
 Help Center
 </span>
 </button>

 <a
 href="/dsa/support?view=faq"
 className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
 >
 <HelpCircle className="text-blue-600" size={20} />
 <span className="font-semibold text-slate-800">
 FAQs
 </span>
 </a>

 <a
 href="/terms"
 className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
 >
 <FileText className="text-blue-600" size={20} />
 <span className="font-semibold text-slate-800">
 Terms & Conditions
 </span>
 </a>

 <a
 href="/privacy"
 className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
 >
 <ShieldCheck className="text-blue-600" size={20} />
 <span className="font-semibold text-slate-800">
 Privacy Policy
 </span>
 </a>

 </div>
 </div>
 </>
 )}

 {/* CREATE TICKET */}
 {activeView === "create" && (
 <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
 <div className="mb-6">
 <h2 className="text-2xl font-bold text-slate-900">
 Create Support Ticket
 </h2>

 <p className="mt-1 text-sm text-slate-500">
 Tell us what you need help with and our support team
 will assist you.
 </p>
 </div>

 {submitMessage && (
 <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
 <CheckCircle2 size={20} />
 {submitMessage}
 </div>
 )}

 {submitError && (
 <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
 <AlertCircle size={20} />
 {submitError}
 </div>
 )}

 <div className="space-y-5">

 <div>
 <label className="mb-2 block text-sm font-semibold text-slate-700">
 Subject
 </label>

 <input
 value={subject}
 onChange={(e) => setSubject(e.target.value)}
 placeholder="Enter your issue subject"
 className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
 />
 </div>

 <div>
 <label className="mb-2 block text-sm font-semibold text-slate-700">
 Priority
 </label>

 <select
 value={priority}
 onChange={(e) => setPriority(e.target.value)}
 className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
 >
 <option value="low">Low</option>
 <option value="medium">Medium</option>
 <option value="high">High</option>
 <option value="urgent">Urgent</option>
 </select>
 </div>

 <div>
 <label className="mb-2 block text-sm font-semibold text-slate-700">
 Describe Your Issue
 </label>

 <textarea
 value={message}
 onChange={(e) => setMessage(e.target.value)}
 placeholder="Explain your issue in detail..."
 rows={7}
 className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
 />
 </div>

 <button
 onClick={createTicket}
 disabled={submitting}
 className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
 >
 {submitting ? (
 <>
 <RefreshCw
 size={18}
 className="animate-spin"
 />
 Creating Ticket...
 </>
 ) : (
 <>
 <PlusCircle size={18} />
 Create Support Ticket
 </>
 )}
 </button>

 </div>
 </div>

 <div className="space-y-5">

 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
 <h3 className="text-lg font-bold text-slate-900">
 Contact Details
 </h3>

 <div className="mt-5 space-y-4">

 <a
 href="tel:+918292908077"
 className="flex items-start gap-3"
 >
 <Phone
 size={19}
 className="mt-0.5 text-blue-600"
 />

 <div>
 <p className="text-xs text-slate-500">
 Phone
 </p>

 <p className="font-semibold text-slate-900">
 +91 8292908077
 </p>
 </div>
 </a>

 <a
 href="mailto:support@indialoanfinance.com"
 className="flex items-start gap-3"
 >
 <Mail
 size={19}
 className="mt-0.5 text-blue-600"
 />

 <div>
 <p className="text-xs text-slate-500">
 Email
 </p>

 <p className="break-all font-semibold text-slate-900">
 support@indialoanfinance.com
 </p>
 </div>
 </a>

 <div className="flex items-start gap-3">
 <Clock
 size={19}
 className="mt-0.5 text-blue-600"
 />

 <div>
 <p className="text-xs text-slate-500">
 Support Hours
 </p>

 <p className="font-semibold text-slate-900">
 Mon - Sat, 9AM - 7PM
 </p>
 </div>
 </div>

 </div>
 </div>

 <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
 <h3 className="font-bold text-blue-900">
 Need urgent help?
 </h3>

 <p className="mt-2 text-sm leading-6 text-blue-800">
 For urgent support, please call our support number
 during support hours.
 </p>

 <a
 href="tel:+918292908077"
 className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
 >
 <Phone size={17} />
 Call Support
 </a>
 </div>

 </div>
 </div>
 )}

 {/* MY TICKETS */}
 {activeView === "tickets" && (
 <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

 <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-2xl font-bold text-slate-900">
 My Support Tickets
 </h2>

 <p className="mt-1 text-sm text-slate-500">
 Track all support requests submitted from your
 DSA account.
 </p>
 </div>

 <button
 onClick={loadTickets}
 disabled={loadingTickets}
 className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
 >
 <RefreshCw
 size={17}
 className={
 loadingTickets ? "animate-spin" : ""
 }
 />
 Refresh
 </button>
 </div>

 {ticketError && (
 <div className="m-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
 <AlertCircle size={20} />
 {ticketError}
 </div>
 )}

 {loadingTickets ? (
 <div className="flex min-h-[300px] items-center justify-center p-8">
 <div className="flex items-center gap-3 text-slate-500">
 <RefreshCw
 size={22}
 className="animate-spin"
 />
 Loading tickets...
 </div>
 </div>
 ) : tickets.length === 0 ? (
 <div className="flex min-h-[350px] flex-col items-center justify-center p-8 text-center">
 <div className="rounded-full bg-blue-50 p-5 text-blue-600">
 <Ticket size={35} />
 </div>

 <h3 className="mt-5 text-lg font-bold text-slate-900">
 No support tickets yet
 </h3>

 <p className="mt-2 max-w-md text-sm text-slate-500">
 You have not created any support ticket yet.
 Create a ticket whenever you need assistance.
 </p>

 <button
 onClick={() => setActiveView("create")}
 className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
 >
 <PlusCircle size={18} />
 Create Ticket
 </button>
 </div>
 ) : (
 <div className="divide-y divide-slate-100">
 {tickets.map((ticket) => (
 <div
 key={ticket.id}
 className="p-5 transition hover:bg-slate-50 sm:p-6"
 >
 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

 <div className="min-w-0">
 <div className="flex flex-wrap items-center gap-2">
 <h3 className="font-bold text-slate-900">
 {ticket.subject || "Support Request"}
 </h3>

 <span
 className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(
 ticket.status
 )}`}
 >
 {ticket.status || "Open"}
 </span>
 </div>

 <p className="mt-2 line-clamp-2 text-sm text-slate-500">
 {ticket.message ||
 "No description available."}
 </p>

 <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
 <span>
 Ticket ID: {ticket.id}
 </span>

 <span>
 Created: {formatDate(ticket.createdAt)}
 </span>

 {ticket.priority && (
 <span>
 Priority: {ticket.priority}
 </span>
 )}
 </div>
 </div>

 <button
 onClick={() => {
 window.location.href =
 `/dsa/support/${ticket.id}`;
 }}
 className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
 >
 View Ticket
 <ChevronRight size={17} />
 </button>

 </div>
 </div>
 ))}
 </div>
 )}

 </div>
 )}

 {/* Footer Contact */}
 <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
 <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
 <div>
 <p className="font-bold text-slate-900">
 India Loan Finance Support
 </p>

 <p className="mt-1 text-sm text-slate-500">
 Need assistance? Our support team is available
 Mon - Sat, 9AM - 7PM.
 </p>
 </div>

 <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
 <a
 href="tel:+918292908077"
 className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"
 >
 <Phone size={17} />
 Call
 </a>

 <a
 href="mailto:support@indialoanfinance.com"
 className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
 >
 <Mail size={17} />
 Email
 </a>
 </div>
 </div>
 </div>

 </div>
 </div>
 );
}

