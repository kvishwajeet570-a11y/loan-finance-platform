"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Target,
  Eye,
  Handshake,
  Headphones,
  FileCheck2,
  Building2,
} from "lucide-react";

const services = [
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Car Loan",
  "Education Loan",
  "Loan Against Property",
  "Credit Card",
  "Insurance",
  "Investment & Financial Services",
];

const strengths = [
  {
    icon: Zap,
    title: "Simple & Fast Process",
    text: "A streamlined digital experience designed to make financial applications easier.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    text: "Customer information is handled with appropriate security and privacy practices.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    text: "Our approach is built around understanding customer requirements and providing assistance.",
  },
  {
    icon: Handshake,
    title: "Strong Partner Network",
    text: "We support a growing ecosystem of customers, DSAs and financial partners.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm">
              <Building2 className="h-4 w-4" />
              ABOUT INDIA LOAN FINANCE
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Finance Made Simple.
              <span className="block text-blue-600">
                Opportunities Made Possible.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              India Loan Finance is a technology-driven financial services
              platform designed to make loan and financial-product access
              simpler, faster and more transparent.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              We connect customers with suitable financial solutions through
              a streamlined digital process, helping them explore options
              based on their requirements and eligibility.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="inline-flex h-13 items-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Apply for a Loan
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/#contact-section"
                className="inline-flex h-13 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <span className="text-sm font-black tracking-[0.18em] text-blue-600">
                WHO WE ARE
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Your trusted partner for smarter financial solutions.
              </h2>

              <p className="mt-6 leading-8 text-slate-600">
                We aim to simplify the journey of discovering and accessing
                financial products through technology, transparent
                communication and dedicated support.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Whether you are looking for personal finance, business
                funding, a home loan, vehicle finance or other financial
                services, our platform is designed to help you begin your
                journey from one place.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "Easy digital enquiry and application experience",
                  "Multiple financial product categories",
                  "Transparent communication",
                  "Dedicated customer and partner support",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <span className="font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-600 to-cyan-500 p-8 shadow-2xl shadow-blue-600/20">
                <div className="rounded-[24px] bg-white/10 p-7 backdrop-blur-sm">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600">
                    <Target className="h-8 w-8" />
                  </div>

                  <h3 className="mt-7 text-2xl font-black text-white">
                    Our Commitment
                  </h3>

                  <p className="mt-4 leading-7 text-blue-50">
                    To make financial services more accessible, simple,
                    transparent and technology-driven for every customer.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">

                    <div className="rounded-2xl bg-white/10 p-5">
                      <FileCheck2 className="h-6 w-6 text-white" />
                      <p className="mt-3 text-sm font-bold text-white">
                        Digital Process
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <Headphones className="h-6 w-6 text-white" />
                      <p className="mt-3 text-sm font-bold text-white">
                        Dedicated Support
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY US */}
      {/* WHY INDIA LOAN FINANCE */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50">
                ✦
              </span>
              Why India Loan Finance
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Built around{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                simplicity and trust
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
              Everything we build is focused on creating a better financial
              experience for customers, DSAs, and our growing partner network.
            </p>

          </div>

          {/* FOUR CARDS */}
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* CARD 01 */}
            <div className="group relative min-h-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">

              <div className="absolute -right-8 -bottom-10 h-28 w-28 rounded-full bg-blue-100/80 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
                  <Zap className="h-7 w-7" strokeWidth={2.5} />
                </div>

                <span className="text-4xl font-black text-blue-100">
                  01
                </span>

              </div>

              <div className="relative mt-6">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                  Quick Processing
                </p>

                <h3 className="mt-2 text-xl font-black leading-tight text-slate-950">
                  Simple & Fast Process
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Get started with a seamless digital experience.
                </p>

                <div className="mt-5 space-y-2.5 text-xs font-medium text-slate-600">

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500">
                      ✓
                    </span>
                    Easy online application
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500">
                      ✓
                    </span>
                    Minimal documentation
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500">
                      ✓
                    </span>
                    Faster processing
                  </div>

                </div>

                <div className="mt-6 text-xs font-black text-blue-600">
                  Learn More
                </div>

              </div>
            </div>

            {/* CARD 02 */}
            <div className="group relative min-h-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">

              <div className="absolute -right-8 -bottom-10 h-28 w-28 rounded-full bg-emerald-100/80 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                  <ShieldCheck className="h-7 w-7" strokeWidth={2.5} />
                </div>

                <span className="text-4xl font-black text-emerald-100">
                  02
                </span>

              </div>

              <div className="relative mt-6">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  Secure & Private
                </p>

                <h3 className="mt-2 text-xl font-black leading-tight text-slate-950">
                  Secure Platform
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Your information is always protected with us.
                </p>

                <div className="mt-5 space-y-2.5 text-xs font-medium text-slate-600">

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500">
                      ✓
                    </span>
                    Advanced data security
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500">
                      ✓
                    </span>
                    Privacy focused
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500">
                      ✓
                    </span>
                    Safe & reliable platform
                  </div>

                </div>

                <div className="mt-6 text-xs font-black text-emerald-600">
                  Learn More
                </div>

              </div>
            </div>

            {/* CARD 03 */}
            <div className="group relative min-h-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10">

              <div className="absolute -right-8 -bottom-10 h-28 w-28 rounded-full bg-violet-100/80 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-lg shadow-violet-500/25">
                  <Users className="h-7 w-7" strokeWidth={2.3} />
                </div>

                <span className="text-4xl font-black text-violet-100">
                  03
                </span>

              </div>

              <div className="relative mt-6">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">
                  Customer First
                </p>

                <h3 className="mt-2 text-xl font-black leading-tight text-slate-950">
                  Customer Focused
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Your needs are at the center of everything we do.
                </p>

                <div className="mt-5 space-y-2.5 text-xs font-medium text-slate-600">

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-violet-500 text-violet-500">
                      ✓
                    </span>
                    Personalized support
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-violet-500 text-violet-500">
                      ✓
                    </span>
                    Quick assistance
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-violet-500 text-violet-500">
                      ✓
                    </span>
                    Transparent communication
                  </div>

                </div>

                <div className="mt-6 text-xs font-black text-violet-600">
                  Learn More
                </div>

              </div>
            </div>

            {/* CARD 04 */}
            <div className="group relative min-h-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">

              <div className="absolute -right-8 -bottom-10 h-28 w-28 rounded-full bg-orange-100/80 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25">
                  <Handshake className="h-7 w-7" strokeWidth={2.3} />
                </div>

                <span className="text-4xl font-black text-orange-100">
                  04
                </span>

              </div>

              <div className="relative mt-6">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                  Trusted Network
                </p>

                <h3 className="mt-2 text-xl font-black leading-tight text-slate-950">
                  Strong Partner Network
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Growing together with customers, DSAs and financial partners.
                </p>

                <div className="mt-5 space-y-2.5 text-xs font-medium text-slate-600">

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-orange-500 text-orange-500">
                      ✓
                    </span>
                    Wide partner ecosystem
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-orange-500 text-orange-500">
                      ✓
                    </span>
                    Better loan options
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-orange-500 text-orange-500">
                      ✓
                    </span>
                    Long-term relationships
                  </div>

                </div>

                <div className="mt-6 text-xs font-black text-orange-600">
                  Learn More
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <span className="text-sm font-black tracking-[0.18em] text-blue-600">
                OUR SERVICES
              </span>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Financial solutions in one platform.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Explore a range of financial products and services designed
                to meet different customer requirements.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />

                  <span className="font-semibold text-slate-700">
                    {service}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
                <Target className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Our Mission
              </h3>

              <p className="mt-4 leading-8 text-slate-300">
                To make financial services more accessible, simple,
                transparent and technology-driven for every customer.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                <Eye className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Our Vision
              </h3>

              <p className="mt-4 leading-8 text-slate-300">
                To build a trusted financial-services ecosystem where
                customers, DSAs and financial partners can connect through
                a seamless digital experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-5 text-center">

          <div className="rounded-[30px] bg-gradient-to-r from-blue-600 to-cyan-500 p-10 shadow-2xl shadow-blue-600/20 sm:p-14">

            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Ready to explore your financial options?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-50">
              Start your journey with India Loan Finance today.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <Link
                href="/apply"
                className="inline-flex h-13 items-center gap-2 rounded-xl bg-white px-7 font-black text-blue-600 transition hover:bg-blue-50"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/#send-message"
                className="inline-flex h-13 items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 font-black text-white transition hover:bg-white/20"
              >
                Send Message
              </Link>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
