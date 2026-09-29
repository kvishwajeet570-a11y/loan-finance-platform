import { Phone, Mail, MapPin, Clock3, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";



export default function Footer() {
  return (
    <footer className="w-full">

      {/* ================= CTA MOUNTAIN BANNER ================= */}
      <section className="relative w-full h-[170px] sm:h-[190px] overflow-hidden">

        <img
          src="/images/footer/footer-mountain.png"
          alt="Build a better tomorrow"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "fill",
            objectPosition: "center center",
          }}
        />

        {/* readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003d78]/85 via-[#0059a8]/35 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] items-center justify-between gap-8 px-8 lg:px-14">

          {/* CTA TEXT */}
          <div className="max-w-[700px] text-white">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
              Ready to Build a Better Tomorrow?
            </h2>

            <p className="mt-2 text-base font-medium text-white/95 sm:text-lg">
              Join thousands of satisfied customers and take the next step
              towards your dreams.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">

            <Link
              href="/apply"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 text-base font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
            >
              Apply for Loan
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/dsa/register"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-white/90 bg-[#003b72]/45 px-7 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-[#003b72]"
            >
              Become a DSA Partner
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>
      </section>

      {/* ================= DARK FOOTER ================= */}
      <section className="w-full bg-[#001f3b] text-white">

        <div className="mx-auto max-w-[1500px] px-8 py-10 lg:px-14 lg:py-12">

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.1fr_1.1fr_1.1fr_1.4fr]">

            {/* BRAND */}
            <div>
              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-extrabold shadow-lg">
                  IL
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">
                    India Loan Finance
                  </h3>

                  <p className="mt-0.5 text-[10px] font-bold tracking-[0.18em] text-white/65">
                    YOUR GROWTH OUR SUPPORT
                  </p>
                </div>

              </div>

              <p className="mt-5 max-w-[280px] text-sm leading-6 text-white/70">
                Empowering individuals and businesses with simple, fast and
                reliable financial solutions.
              </p>

              {/* SOCIAL */}
              <div className="mt-5 flex gap-3">

                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-blue-600"
                >
                  <span className="text-sm font-extrabold">f</span>
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-blue-600"
                >
                  <span className="text-sm font-extrabold">◎</span>
                </a>

                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-blue-600"
                >
                  <span className="text-sm font-extrabold">in</span>
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-blue-600"
                >
                  <span className="text-xs font-extrabold">▶</span>
                </a>

              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="mb-5 text-base font-extrabold">
                Quick Links
              </h4>

              <div className="space-y-3 text-sm text-white/70">
                <Link href="/" className="block hover:text-white">Home</Link>
                <Link href="/loans" className="block hover:text-white">Loans</Link>
                <Link href="/#emi-calculator" className="block hover:text-white">EMI Calculator</Link>
                <Link href="/about" className="block hover:text-white">About Us</Link>
                <Link href="/contact" className="block hover:text-white">Contact Us</Link>
              </div>
            </div>

            {/* LOAN PRODUCTS */}
            <div>
              <h4 className="mb-5 text-base font-extrabold">
                Loan Products
              </h4>

              <div className="space-y-3 text-sm text-white/70">
                <Link href="/loans/personal" className="block hover:text-white">Personal Loan</Link>
                <Link href="/loans/home" className="block hover:text-white">Home Loan</Link>
                <Link href="/loans/business" className="block hover:text-white">Business Loan</Link>
                <Link href="/loans/car" className="block hover:text-white">Car Loan</Link>
                <Link href="/loans/education" className="block hover:text-white">Education Loan</Link>
                <Link href="/loans/consumer" className="block hover:text-white">Consumer Loan</Link>
              </div>
            </div>

            {/* CUSTOMERS */}
            <div>
              <h4 className="mb-5 text-base font-extrabold">
                For Customers
              </h4>

              <div className="space-y-3 text-sm text-white/70">
                <Link href="/apply" className="block hover:text-white">Apply for Loan</Link>
                <Link href="/login" className="block hover:text-white">Customer Login</Link>
                <Link href="/#emi-calculator" className="block hover:text-white">EMI Calculator</Link>
                <Link href="/eligibility" className="block hover:text-white">Eligibility</Link>
                <Link href="/support" className="block hover:text-white">Support</Link>
                <Link href="/faq" className="block hover:text-white">FAQs</Link>
              </div>
            </div>

            {/* DSA */}
            <div>
              <h4 className="mb-5 text-base font-extrabold">
                For DSA
              </h4>

              <div className="space-y-3 text-sm text-white/70">
                <Link href="/dsa/register" className="block hover:text-white">Join as DSA</Link>
                <Link href="/login" className="block hover:text-white">DSA Login</Link>
                <Link href="/dsa/dashboard" className="block hover:text-white">DSA Workspace</Link>
                <Link href="/dsa/benefits" className="block hover:text-white">Partner Benefits</Link>
                <Link href="/support" className="block hover:text-white">Support</Link>
                <Link href="/dsa/training" className="block hover:text-white">Training</Link>
              </div>
            </div>

            {/* CONTACT */}
            <div id="contact-section" className="scroll-mt-24">
              <h4 className="mb-5 text-base font-extrabold">
                Contact Us
              </h4>

              <div className="space-y-4 text-sm text-white/75">

                <div className="flex items-center gap-3">
                  <Phone size={19} className="shrink-0 text-cyan-400" />
                  <span>+91 8292908077</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={19} className="shrink-0 text-cyan-400" />
                  <span>support@indialoanfinance.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={19} className="shrink-0 text-cyan-400" />
                  <span>India</span>
                </div><div className="flex items-center gap-3">
                  <Clock3 size={19} className="shrink-0 text-cyan-400" />
                  <span>Mon - Sat : 9AM - 7PM</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex min-h-[54px] max-w-[1500px] items-center justify-between gap-4 px-8 text-xs text-white/60 lg:px-14">

            <p>
              © 2026 India Loan Finance. All rights reserved.
            </p>

            <p>
              Same People. Bigger Possibilities.
            </p>

          </div>
        </div>

      </section>

      {/* BACK TO TOP */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-700"
      >
        ↑
      </button>

    </footer>
  );
}





















