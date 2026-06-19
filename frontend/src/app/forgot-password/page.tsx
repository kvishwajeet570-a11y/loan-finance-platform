"use client";

import { useState } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

/* ========================================
   API URL
======================================== */

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL ||

  "http://localhost:5000";

export default function ForgotPasswordPage() {

  const router =
    useRouter();

  /* ========================================
     STATES
  ======================================== */

  const [email, setEmail] =
    useState("");

  const [
    lockedEmail,
    setLockedEmail,
  ] = useState("");

  const [otp, setOtp] =
    useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [otpSent, setOtpSent] =
    useState(false);

  /* ========================================
     PASSWORD VALIDATION
  ======================================== */

  const passwordValidation = {

    minLength:
      newPassword.length >= 8,

    upperCase:
      /[A-Z]/.test(
        newPassword
      ),

    lowerCase:
      /[a-z]/.test(
        newPassword
      ),

    number:
      /[0-9]/.test(
        newPassword
      ),

    specialChar:
      /[!@#$%^&*]/.test(
        newPassword
      ),

  };

  const isStrongPassword =

    passwordValidation.minLength &&
    passwordValidation.upperCase &&
    passwordValidation.lowerCase &&
    passwordValidation.number &&
    passwordValidation.specialChar;

  /* ========================================
     SEND OTP
  ======================================== */

  const handleForgotPassword =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (loading) return;

      try {

        setLoading(true);

        setMessage("");

        setSuccess(false);

        if (!email.trim()) {

          setMessage(
            "Please enter email"
          );

          return;

        }

        const response =
          await axios.post(

            `${API_URL}/api/auth/forgot-password`,

            {

              email:
                email.trim(),

            }

          );

        setLockedEmail(
          email.trim()
        );

        setOtpSent(true);

        setSuccess(true);

        setMessage(

          response.data.message ||

          "OTP sent successfully"

        );

      } catch (error: any) {

        console.log(
          "FORGOT PASSWORD ERROR =>",
          error
        );

        setSuccess(false);

        if (
          error.response
        ) {

          setMessage(

            error.response.data
              ?.message ||

            "Something went wrong"

          );

        } else if (
          error.request
        ) {

          setMessage(
            "Backend server not responding"
          );

        } else {

          setMessage(
            error.message
          );

        }

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     RESET PASSWORD
  ======================================== */

  const handleResetPassword =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (loading) return;

      try {

        setLoading(true);

        setMessage("");

        setSuccess(false);

        if (!otp.trim()) {

          setMessage(
            "Please enter OTP"
          );

          return;

        }

        if (
          newPassword !==
          confirmPassword
        ) {

          setMessage(
            "Passwords do not match"
          );

          return;

        }

        if (
          !isStrongPassword
        ) {

          setMessage(

            "Password must contain uppercase, lowercase, number and special character"

          );

          return;

        }

        const response =
          await axios.post(

            `${API_URL}/api/auth/reset-password`,

            {

              email:
                lockedEmail ||
                email,

              otp:
                otp.trim(),

              password:
                newPassword,

            }

          );

        setSuccess(true);

        setMessage(

          response.data.message ||

          "Password reset successful"

        );

        setTimeout(() => {

          router.replace(
            "/login"
          );

        }, 1500);

      } catch (error: any) {

        console.log(
          "RESET PASSWORD ERROR =>",
          error
        );

        setSuccess(false);

        if (
          error.response
        ) {

          setMessage(

            error.response.data
              ?.message ||

            "Something went wrong"

          );

        } else if (
          error.request
        ) {

          setMessage(
            "Backend server not responding"
          );

        } else {

          setMessage(
            error.message
          );

        }

      } finally {

        setLoading(false);

      }

    };

  return (

    <main className="min-h-screen bg-[#020617] grid lg:grid-cols-2 overflow-hidden relative">

      {/* BACKGROUND LIGHTS */}

      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-500/10 blur-[160px] rounded-full"></div>

      {/* ========================================
          LEFT SIDE
      ======================================== */}

      <section className="hidden lg:flex relative flex-col justify-between p-16 border-r border-white/10 overflow-hidden">

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

        <div className="relative z-10 flex items-center gap-4">

          <div className="w-[72px] h-[72px] rounded-[28px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-[0_0_60px_rgba(6,182,212,0.45)] border border-white/10">

            L

          </div>

          <div>

            <h1 className="text-4xl font-bold text-white tracking-tight">

              LoanPay

            </h1>

            <p className="text-slate-300/70 text-sm mt-1">

              Smart Finance Platform

            </p>

          </div>

        </div>

        {/* CONTENT */}

        <div className="relative z-10 max-w-2xl">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs tracking-[0.3em] uppercase font-semibold mb-8">

            Secure Recovery System

          </div>

          <h1 className="text-7xl leading-[1.02] font-extrabold text-white tracking-[-0.06em]">

            Securely
            <br />

            Recover
            <br />

            <span className="hero-gradient-text">
              Your Account
            </span>

          </h1>

          <p className="mt-10 text-xl text-slate-300/80 leading-9 max-w-xl">

            Reset your password with
            enterprise-grade security,
            OTP verification, and secure
            fintech authentication flow.

          </p>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-6 mt-14">

            <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-white/[0.02] hover:-translate-y-1 hover:border-cyan-400/20 transition-all duration-300">

              <h2 className="text-4xl font-black hero-gradient-text">

                24/7

              </h2>

              <p className="text-slate-300/70 mt-3 text-sm">

                Protection

              </p>

            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-white/[0.02] hover:-translate-y-1 hover:border-purple-400/20 transition-all duration-300">

              <h2 className="text-4xl font-black hero-gradient-text">

                OTP

              </h2>

              <p className="text-slate-300/70 mt-3 text-sm">

                Verification

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

        <div className="w-full max-w-xl">

          {/* CARD */}

          <div className="glass-card p-10 md:p-12 bg-gradient-to-b from-white/[0.06] to-white/[0.03] fade-in border border-cyan-400/10 shadow-[0_0_60px_rgba(6,182,212,0.08)]">

            <div className="mb-10">

              <h1 className="text-5xl font-bold text-white tracking-tight">

                Forgot Password

              </h1>

              <p className="text-slate-300/80 mt-4 leading-8 text-[16px]">

                Recover your account
                securely using OTP-based
                password reset system.

              </p>

            </div>

            {/* FORM */}

            <form

              onSubmit={
                otpSent
                  ? handleResetPassword
                  : handleForgotPassword
              }

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

                  value={
                    lockedEmail ||
                    email
                  }

                  readOnly={otpSent}

                  onChange={(e) => {

                    if (!otpSent) {

                      setEmail(
                        e.target.value
                      );

                    }

                  }}

                  className="input-field hover:border-cyan-400/30"

                  required

                />

              </div>

              {/* OTP */}

              {
                otpSent && (

                  <div className="mb-6">

                    <label className="block text-sm text-gray-300 mb-3">

                      Enter OTP

                    </label>

                    <input

                      type="text"

                      placeholder="Enter OTP"

                      value={otp}

                      onChange={(e) =>
                        setOtp(
                          e.target.value
                        )
                      }

                      className="input-field hover:border-cyan-400/30"

                      required

                    />

                  </div>

                )
              }

              {/* BUTTON */}

              <button

                type="submit"

                disabled={loading}

                className="primary-btn w-full text-lg tracking-wide shadow-[0_0_40px_rgba(6,182,212,0.25)] hover:shadow-[0_0_55px_rgba(139,92,246,0.35)]"

              >

                {

                  loading

                    ? otpSent
                      ? "Resetting Password..."
                      : "Sending OTP..."

                    : otpSent
                    ? "Reset Password"
                    : "Send OTP"

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

            </form>

          </div>

        </div>

      </section>

    </main>

  );

}