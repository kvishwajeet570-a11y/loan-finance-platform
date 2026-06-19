"use client";

import { useState } from "react";

import api from "@/lib/api";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router =
    useRouter();

  /* ========================================
     STATES
  ======================================== */

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState(false);

  /* ========================================
     LOGIN
  ======================================== */

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (loading) return;

      try {

        setLoading(true);

        setMessage("");

        setSuccess(false);

        if (
          !email.trim() ||
          !password.trim()
        ) {

          setMessage(
            "All fields are required"
          );

          return;

        }

        const response =
          await api.post(

            "/auth/login",

            {
              email:
                email.trim(),

              password,
            }

          );

        setSuccess(true);

        setMessage(

          response.data.message ||

          "Login successful"

        );

        /* TOKEN */

        if (
          response.data.token
        ) {

          localStorage.setItem(

            "token",

            response.data.token

          );

        }

        /* USER */

        if (
          response.data.user
        ) {

          localStorage.setItem(

            "user",

            JSON.stringify(
              response.data.user
            )

          );

        }

        /* REDIRECT */

        setTimeout(() => {

          router.replace(
            "/dashboard"
          );

        }, 1000);

      } catch (error: any) {

        console.log(
          "LOGIN ERROR =>",
          error
        );

        setSuccess(false);

        if (
          error.response
        ) {

          setMessage(

            error.response.data
              ?.message ||

            "Login failed"

          );

        } else if (
          error.request
        ) {

          setMessage(
            "Backend not responding"
          );

        } else {

          setMessage(

            error.message ||

            "Something went wrong"

          );

        }

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     UI
  ======================================== */

  return (

    <main className="min-h-screen bg-[#020617] grid lg:grid-cols-2 overflow-hidden relative">

      {/* BACKGROUND LIGHTS */}

      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-500/10 blur-[160px] rounded-full"></div>

      {/* ========================================
          LEFT SIDE
      ======================================== */}

      <section className="relative hidden lg:flex flex-col justify-between p-16 border-r border-white/10 overflow-hidden">

        {/* HERO EFFECTS */}

        <div className="hero-grid"></div>

        <div className="hero-light-cyan"></div>

        <div className="hero-light-purple"></div>

        <div className="hero-light-pink"></div>

        {/* FLOATING ORBS */}

        <div className="floating-orb orb-cyan top-[18%] left-[12%]"></div>

        <div className="floating-orb orb-purple top-[55%] left-[72%]"></div>

        <div className="floating-orb orb-pink bottom-[18%] left-[30%]"></div>

        {/* LOGO */}

        <div className="relative z-10">

          <div className="flex items-center gap-4">

            <div className="w-[72px] h-[72px] rounded-[28px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-[0_0_60px_rgba(6,182,212,0.45)] border border-white/10">

              L

            </div>

            <div>

              <h1 className="text-4xl font-bold text-white tracking-tight">

                LoanPay

              </h1>

              <p className="text-slate-300/70 text-sm mt-1">

                Smart Fintech Platform

              </p>

            </div>

          </div>

        </div>

        {/* CENTER CONTENT */}

        <div className="relative z-10 max-w-2xl">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs tracking-[0.3em] uppercase font-semibold mb-8">

            Modern Finance Ecosystem

          </div>

          <h1 className="text-7xl leading-[1.02] font-extrabold text-white tracking-[-0.06em]">

            Secure Banking
            <br />

            & Loan
            <br />

            <span className="hero-gradient-text">
              Management
            </span>

            <br />

            <span className="hero-gradient-text">
              Platform
            </span>

          </h1>

          <p className="mt-10 text-xl text-slate-300/80 leading-9 max-w-xl">

            Manage loans, analytics,
            commissions, wallet systems,
            and customer insights with a
            next-generation fintech
            dashboard designed for modern
            enterprises.

          </p>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-6 mt-14">

            <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-white/[0.02] hover:-translate-y-1 hover:border-cyan-400/20 transition-all duration-300">

              <h2 className="text-4xl font-black hero-gradient-text">

                24K+

              </h2>

              <p className="text-slate-300/70 mt-3 text-sm">

                Active Users

              </p>

            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-white/[0.02] hover:-translate-y-1 hover:border-purple-400/20 transition-all duration-300">

              <h2 className="text-4xl font-black hero-gradient-text">

                ₹12Cr+

              </h2>

              <p className="text-slate-300/70 mt-3 text-sm">

                Revenue

              </p>

            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-white/[0.02] hover:-translate-y-1 hover:border-cyan-400/20 transition-all duration-300">

              <h2 className="text-4xl font-black hero-gradient-text">

                99.9%

              </h2>

              <p className="text-slate-300/70 mt-3 text-sm">

                Secure

              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="relative z-10 text-sm text-slate-400/70">

          © 2026 LoanPay Finance System

        </div>

      </section>

      {/* ========================================
          RIGHT SIDE
      ======================================== */}

      <section className="flex items-center justify-start lg:pl-28 px-6 py-10 relative z-10">

        <div className="w-full max-w-lg">

          {/* MOBILE LOGO */}

          <div className="lg:hidden flex items-center gap-3 mb-10">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">

              L

            </div>

            <div>

              <h1 className="text-2xl font-bold text-white">

                LoanPay

              </h1>

              <p className="text-gray-400 text-sm">

                Smart Finance Platform

              </p>

            </div>

          </div>

          {/* LOGIN CARD */}

          <div className="glass-card p-10 md:p-12 bg-gradient-to-b from-white/[0.06] to-white/[0.03] fade-in border border-cyan-400/10 shadow-[0_0_60px_rgba(6,182,212,0.08)]">

            <div className="mb-10">

              <h1 className="text-5xl font-bold text-white tracking-tight">

                Welcome Back

              </h1>

              <p className="text-slate-300/80 mt-4 leading-8 text-[16px]">

                Login to access your
                secure fintech dashboard
                and manage your financial
                ecosystem seamlessly.

              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleLogin}
              autoComplete="off"
            >

              {/* EMAIL */}

              <div className="mb-6">

                <label className="block text-sm text-gray-300 mb-3">

                  Email Address

                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="input-field hover:border-cyan-400/30"
                  required
                />

              </div>

              {/* PASSWORD */}

              <div className="mb-4">

                <label className="block text-sm text-gray-300 mb-3">

                  Password

                </label>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="input-field hover:border-cyan-400/30"
                  required
                />

              </div>

              {/* OPTIONS */}

              <div className="flex items-center justify-between mb-8">

                <label className="flex items-center gap-2 text-sm text-gray-400">

                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  />

                  Show Password

                </label>

                <a
                  href="/forgot-password"
                  className="text-cyan-400 hover:text-cyan-300 text-sm transition-all"
                >

                  Forgot Password?

                </a>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="primary-btn w-full text-lg tracking-wide shadow-[0_0_40px_rgba(6,182,212,0.25)] hover:shadow-[0_0_55px_rgba(139,92,246,0.35)]"

              >

                {
                  loading
                    ? "Logging in..."
                    : "Login"
                }

              </button>

              {/* MESSAGE */}

              {
                message && (

                  <p
                    className={`mt-5 text-center font-medium ${

                      success
                        ? "text-green-400"
                        : "text-red-400"

                    }`}
                  >

                    {message}

                  </p>

                )
              }

              {/* DIVIDER */}

              <div className="flex items-center my-8">

                <div className="flex-1 border-t border-white/10"></div>

                <span className="px-4 text-gray-500 text-sm">

                  OR

                </span>

                <div className="flex-1 border-t border-white/10"></div>

              </div>

              {/* REGISTER */}

              <a
                href="/register"
                className="secondary-btn flex items-center justify-center"

              >

                Create Account

              </a>

            </form>

          </div>

        </div>

      </section>

    </main>

  );

}