"use client";

import { useRef } from "react";

import Navbar from "@/components/Navbar";

import Hero from "@/components/Hero";

import Stats from "@/components/Stats";

import Services from "@/components/Services";

import EmiCalculator from "@/components/EmiCalculator";

import LoanForm from "@/components/LoanForm";

import Career from "@/components/Career";

import Testimonials from "@/components/Testimonials";

import Contact from "@/components/Contact";

import Notification from "@/components/Notification";

import Footer from "@/components/Footer";

export default function Home() {

  /* ========================================
     LOAN FORM SCROLL REF
  ======================================== */

  const loanFormRef =
    useRef<HTMLDivElement>(null);

  /* ========================================
     SCROLL FUNCTION
  ======================================== */

  const scrollToLoanForm = () => {

    loanFormRef.current
      ?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

  };

  return (

    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-gradient-to-br
        from-[#020617]
        via-[#0f172a]
        to-[#111827]
        text-white
      "
    >

      {/* ========================================
          GLOBAL BACKGROUND GLOW EFFECTS
      ======================================== */}

      <div className="pointer-events-none fixed left-[-120px] top-[-120px] z-0 h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-120px] right-[-120px] z-0 h-[350px] w-[350px] rounded-full bg-purple-500/20 blur-[120px]" />

      <div className="pointer-events-none fixed left-[45%] top-[40%] z-0 h-[250px] w-[250px] rounded-full bg-blue-500/10 blur-[120px]" />

      {/* ========================================
          MAIN CONTENT WRAPPER
      ======================================== */}

      <div className="relative z-10 w-full">

        {/* ========================================
            RESPONSIVE CONTAINER
        ======================================== */}

        <div
          className="
            mx-auto
            w-full
            max-w-[1700px]
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
            2xl:px-12
          "
        >

          {/* ========================================
              NAVBAR
          ======================================== */}

          <Navbar />

          {/* ========================================
              HERO SECTION
          ======================================== */}

          <section className="w-full overflow-hidden">

            <Hero
              scrollToLoanForm={
                scrollToLoanForm
              }
            />

          </section>

          {/* ========================================
              STATS SECTION
          ======================================== */}

          <section className="w-full overflow-hidden">

            <Stats />

          </section>

          {/* ========================================
              SERVICES SECTION
          ======================================== */}

          <section className="w-full overflow-hidden">

            <Services />

          </section>

          {/* ========================================
              EMI CALCULATOR
          ======================================== */}

          <section className="w-full overflow-hidden">

            <EmiCalculator />

          </section>

          {/* ========================================
              LOAN FORM
          ======================================== */}

          <section
            ref={loanFormRef}
            className="
              w-full
              overflow-hidden
              scroll-mt-24
            "
          >

            <LoanForm />

          </section>

          {/* ========================================
              CAREER SECTION
          ======================================== */}

          <section className="w-full overflow-hidden">

            <Career />

          </section>

          {/* ========================================
              TESTIMONIALS SECTION
          ======================================== */}

          <section className="w-full overflow-hidden">

            <Testimonials />

          </section>

          {/* ========================================
              CONTACT SECTION
          ======================================== */}

          <section className="w-full overflow-hidden">

            <Contact />

          </section>

          {/* ========================================
              FOOTER
          ======================================== */}

          <section className="w-full overflow-hidden">

            <Footer />

          </section>

        </div>

      </div>

      {/* ========================================
          FLOATING NOTIFICATION
      ======================================== */}

      <Notification />

    </main>

  );

}