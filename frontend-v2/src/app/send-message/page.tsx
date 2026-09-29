"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  sendMessage,
  SendMessagePayload,
} from "@/services/sendMessage";

export default function SendMessagePage() {
  const [form, setForm] = useState({
    userId: "",
    title: "",
    message: "",
    type: "sms",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] =
    useState("");

  const characterCount = useMemo(
    () => form.message.length,
    [form.message]
  );

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setResponseMessage("");

    if (!form.userId.trim()) {
      setError("Please enter the recipient User ID.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a message title.");
      return;
    }

    if (!form.message.trim()) {
      setError("Please enter the message.");
      return;
    }

    try {
      setLoading(true);

      const payload: SendMessagePayload = {
        userId: form.userId.trim(),
        title: form.title.trim(),
        message: form.message.trim(),
        type: "sms",
      };

      const response = await sendMessage(payload);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Message could not be sent."
        );
      }

      setSuccess(true);
      setResponseMessage(
        response.message ||
          "Message submitted successfully."
      );

      setForm({
        userId: "",
        title: "",
        message: "",
        type: "sms",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to send message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">

          {/* LEFT INFORMATION */}
          <aside className="rounded-[30px] bg-gradient-to-br from-[#002f63] via-[#0059a8] to-[#0087c9] p-7 text-white shadow-2xl sm:p-9 lg:h-fit">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black">
              <MessageSquareText size={16} />
              SMS Communication
            </div>

            <h1 className="mt-7 text-3xl font-black leading-tight sm:text-4xl">
              Send Customer
              <br />
              Message
            </h1>

            <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
              Send a message to a registered customer
              through the notification system.
            </p>

            <div className="mt-8 space-y-4">

              <InfoItem
                icon={<UserRound size={19} />}
                title="Recipient"
                text="Target a specific customer using their User ID."
              />

              <InfoItem
                icon={<Smartphone size={19} />}
                title="SMS Channel"
                text="The request is sent through the backend SMS notification endpoint."
              />

              <InfoItem
                icon={<ShieldCheck size={19} />}
                title="Backend Controlled"
                text="Message submission is handled by your Express backend."
              />

              <InfoItem
                icon={<Clock3 size={19} />}
                title="Ready for Provider"
                text="SMS gateway integration can be connected separately."
              />

            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-white/60">
                API Endpoint
              </p>

              <p className="mt-2 break-all font-mono text-xs text-white/90">
                POST /api/notification/send-sms
              </p>
            </div>
          </aside>

          {/* FORM */}
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.10)] sm:p-9">

            <div className="border-b border-slate-100 pb-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Communication Center
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Send Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the recipient and message details
                below.
              </p>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                <XCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p>Message submitted successfully.</p>

                  {responseMessage && (
                    <p className="mt-1 text-xs font-medium">
                      {responseMessage}
                    </p>
                  )}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* USER ID */}
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Recipient User ID
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={form.userId}
                    onChange={(e) =>
                      updateField(
                        "userId",
                        e.target.value
                      )
                    }
                    placeholder="Enter customer User ID"
                    className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  This must match the customer ID used by
                  the backend notification system.
                </p>
              </div>

              {/* TYPE */}
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Message Channel
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    updateField(
                      "type",
                      e.target.value
                    )
                  }
                  className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="sms">
                    SMS
                  </option>
                </select>
              </div>

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Message Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateField(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Example: Loan Application Update"
                  maxLength={100}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-black text-slate-700">
                    Message
                  </label>

                  <span
                    className={`text-xs font-bold ${
                      characterCount > 160
                        ? "text-red-600"
                        : "text-slate-400"
                    }`}
                  >
                    {characterCount} characters
                  </span>
                </div>

                <textarea
                  value={form.message}
                  onChange={(e) =>
                    updateField(
                      "message",
                      e.target.value
                    )
                  }
                  placeholder="Type your message here..."
                  rows={6}
                  maxLength={1000}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Keep the SMS concise. Actual SMS segmentation
                  depends on the final SMS provider.
                </p>
              </div>

              {/* PREVIEW */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

                <div className="flex items-center gap-2">
                  <Smartphone
                    size={18}
                    className="text-blue-600"
                  />

                  <p className="text-sm font-black text-slate-800">
                    Message Preview
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                  <p className="text-xs font-black text-slate-900">
                    {form.title ||
                      "Message Title"}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {form.message ||
                      "Your message preview will appear here."}
                  </p>

                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <MessageSquareText
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <p className="text-center text-xs font-medium text-slate-400">
                Backend API • Secure request • SMS-ready architecture
              </p>

            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>

      <div>
        <p className="text-sm font-extrabold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/60">
          {text}
        </p>
      </div>
    </div>
  );
}
