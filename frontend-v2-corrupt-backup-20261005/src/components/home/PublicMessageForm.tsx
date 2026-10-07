"use client";

import { FormEvent, useState } from "react";
import { MessageSquare, Phone, Mail, User, Send, CheckCircle2 } from "lucide-react";
import {
  submitPublicLead,
  PublicLeadPayload,
} from "@/services/publicLead";

const loanTypes = [
  { value: "PERSONAL_LOAN", label: "Personal Loan" },
  { value: "BUSINESS_LOAN", label: "Business Loan" },
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "CAR_LOAN", label: "Car Loan" },
  { value: "LAP", label: "Loan Against Property" },
  { value: "CREDIT_CARD", label: "Credit Card" },
];

export default function PublicMessageForm() {
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    productType: "PERSONAL_LOAN",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    const fullName = form.fullName.trim();
    const mobileNumber = form.mobileNumber.replace(/\D/g, "");
    const email = form.email.trim();
    const remarks = form.remarks.trim();

    if (fullName.length < 3) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!remarks) {
      setError("Please enter your message.");
      return;
    }

    const payload: PublicLeadPayload = {
      fullName,
      mobileNumber,
      ...(email ? { email } : {}),
      productType: form.productType as PublicLeadPayload["productType"],
      remarks,
      source: "WEBSITE",
      priority: "MEDIUM",
    };

    try {
      setLoading(true);

      const response = await submitPublicLead(payload);

      if (!response.success) {
        throw new Error(
          response.message || "Unable to submit your message."
        );
      }

      setSuccess(
        "Thank you! Your message has been submitted successfully. Our team will contact you shortly."
      );

      setForm({
        fullName: "",
        mobileNumber: "",
        email: "",
        productType: "PERSONAL_LOAN",
        remarks: "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="send-message"
      className="relative overflow-hidden bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">

          {/* LEFT CONTENT */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm !text-slate-950 opacity-100 font-semibold text-blue-700">
              <MessageSquare className="h-4 w-4" />
              Get In Touch
            </div>

            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Have a question?
              <span className="block text-blue-600">
                Send us a message.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Tell us what you need and our team will get in touch with
              you. No login or registration is required.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm !text-slate-950 opacity-100 font-semibold text-slate-900">
                    Quick Response
                  </p>
                  <p className="text-sm !text-slate-950 opacity-100 text-slate-500">
                    Our team will contact you soon.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm !text-slate-950 opacity-100 font-semibold text-slate-900">
                    No Registration Required
                  </p>
                  <p className="text-sm !text-slate-950 opacity-100 text-slate-500">
                    Submit your enquiry directly from the website.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:p-8">
            <div className="mb-7">
              <h3 className="text-2xl font-bold text-slate-900">
                Send Message
              </h3>
              <p className="mt-1 text-sm !text-slate-950 opacity-100 text-slate-500">
                Fill in your details and tell us how we can help.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm !text-slate-950 opacity-100 font-semibold text-slate-700">
                    Full Name *
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={form.fullName}
                      onChange={(e) =>
                        updateField("fullName", e.target.value)
                      }
                      placeholder="Enter your name"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm !text-slate-950 opacity-100 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm !text-slate-950 opacity-100 font-semibold text-slate-700">
                    Mobile Number *
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={form.mobileNumber}
                      onChange={(e) =>
                        updateField(
                          "mobileNumber",
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      inputMode="numeric"
                      placeholder="10-digit mobile"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm !text-slate-950 opacity-100 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm !text-slate-950 opacity-100 font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm !text-slate-950 opacity-100 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm !text-slate-950 opacity-100 font-semibold text-slate-700">
                  Looking For
                </label>

                <select
                  value={form.productType}
                  onChange={(e) =>
                    updateField("productType", e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm !text-slate-950 opacity-100 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  {loanTypes.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm !text-slate-950 opacity-100 font-semibold text-slate-700">
                  Your Message *
                </label>

                <textarea
                  value={form.remarks}
                  onChange={(e) =>
                    updateField("remarks", e.target.value.slice(0, 1000))
                  }
                  rows={5}
                  placeholder="Tell us what you need..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm !text-slate-950 opacity-100 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.remarks.length}/1000
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm !text-slate-950 opacity-100 font-medium text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm !text-slate-950 opacity-100 font-medium text-green-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Your information will be handled securely by our team.
              </p>

            </form>
          </div>

        </div>
      </div>
<style jsx>{`
  input,
  textarea,
  select {
    color: #0f172a !important;
    opacity: 1 !important;
    -webkit-text-fill-color: #0f172a !important;
  }

  input::placeholder,
  textarea::placeholder {
    color: #94a3b8 !important;
    opacity: 1 !important;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    -webkit-text-fill-color: #0f172a !important;
    color: #0f172a !important;
    caret-color: #0f172a !important;
    transition: background-color 9999s ease-in-out 0s;
  }
`}</style>

    </section>
  );
}

