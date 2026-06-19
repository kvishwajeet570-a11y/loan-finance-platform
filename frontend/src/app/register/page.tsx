"use client";

import { useState } from "react";

import api from "@/lib/api";

import { useRouter } from "next/navigation";

import {

  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,

} from "lucide-react";

export default function RegisterPage() {

  const router =
    useRouter();

  /* ========================================
     STATES
  ======================================== */

  const [
    formData,
    setFormData,
  ] = useState({

    name: "",

    email: "",

    phoneNo: "",

    password: "",

    confirmPassword: "",

  });

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    otpSent,
    setOtpSent,
  ] = useState(false);

  const [
    otpVerified,
    setOtpVerified,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /* ========================================
     PASSWORD VALIDATION
  ======================================== */

  const passwordValidation = {

    minLength:
      formData.password.length >= 8,

    upperCase:
      /[A-Z]/.test(
        formData.password
      ),

    lowerCase:
      /[a-z]/.test(
        formData.password
      ),

    number:
      /[0-9]/.test(
        formData.password
      ),

    specialChar:
      /[!@#$%^&*]/.test(
        formData.password
      ),

  };

  const isStrongPassword =

    passwordValidation.minLength &&
    passwordValidation.upperCase &&
    passwordValidation.lowerCase &&
    passwordValidation.number &&
    passwordValidation.specialChar;

  /* ========================================
     HANDLE CHANGE
  ======================================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  /* ========================================
     SEND OTP
  ======================================== */

  const handleSendOtp =
    async () => {

      if (!formData.email.trim()) {

        setSuccess(false);

        setMessage(
          "Please enter email first"
        );

        return;

      }

      try {

        setLoading(true);

        setMessage("");

        const response =
          await api.post(

            "/auth/send-register-otp",

            {

              email:
                formData.email.trim(),

            }

          );

        setOtpSent(true);

        setSuccess(true);

        setMessage(

          response.data.message ||

          "OTP sent successfully"

        );

      } catch (error: any) {

        setSuccess(false);

        setMessage(

          error.response?.data
            ?.message ||

          "Failed to send OTP"

        );

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     VERIFY OTP
  ======================================== */

  const handleVerifyOtp =
    async () => {

      if (!otp.trim()) {

        setSuccess(false);

        setMessage(
          "Please enter OTP"
        );

        return;

      }

      try {

        setLoading(true);

        setMessage("");

        const response =
          await api.post(

            "/auth/verify-register-otp",

            {

              email:
                formData.email.trim(),

              otp:
                otp.trim(),

            }

          );

        setOtpVerified(true);

        setSuccess(true);

        setMessage(

          response.data.message ||

          "OTP verified successfully"

        );

      } catch (error: any) {

        setSuccess(false);

        setMessage(

          error.response?.data
            ?.message ||

          "Invalid OTP"

        );

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     REGISTER
  ======================================== */

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (!otpVerified) {

        setSuccess(false);

        setMessage(
          "Please verify OTP first"
        );

        return;

      }

      if (!isStrongPassword) {

        setSuccess(false);

        setMessage(
          "Weak password"
        );

        return;

      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {

        setSuccess(false);

        setMessage(
          "Passwords do not match"
        );

        return;

      }

      try {

        setLoading(true);

        setMessage("");

        const response =
          await api.post(

            "/auth/register",

            {

              name:
                formData.name,

              email:
                formData.email,

              phoneNo:
                formData.phoneNo,

              password:
                formData.password,

            }

          );

        setSuccess(true);

        setMessage(

          response.data.message ||

          "Account created successfully"

        );

        setTimeout(() => {

          router.push(
            "/login"
          );

        }, 1500);

      } catch (error: any) {

        setSuccess(false);

        setMessage(

          error.response?.data
            ?.message ||

          "Registration failed"

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <main className="min-h-screen bg-[#020617] flex overflow-hidden relative">

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]"></div>

      {/* LEFT */}

      <section className="hidden lg:flex w-1/2 relative flex-col justify-between px-16 py-12 border-r border-white/10 overflow-hidden">

        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* LOGO */}

        <div className="relative z-10 flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.45)]">

            <ShieldCheck
              className="text-white"
              size={28}
            />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-white">

              LoanPay

            </h1>

            <p className="text-gray-400">

              Smart Finance Platform

            </p>

          </div>

        </div>

        {/* HERO */}

        <div className="relative z-10 max-w-2xl">

          <p className="text-cyan-400 tracking-[0.35em] uppercase text-sm font-semibold mb-6">

            Secure. Smart. Reliable.

          </p>

          <h1 className="text-7xl font-black leading-[1] tracking-[-0.06em] text-white">

            Build Your
            <br />

            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

              Financial

            </span>

            {" "}Future

          </h1>

          <p className="mt-8 text-xl text-gray-300 leading-9 max-w-xl">

            Join the next generation
            fintech platform and manage
            loans, analytics, payments
            and much more with complete
            security.

          </p>

          {/* ANALYTICS CARD */}

          <div className="mt-14 rounded-[32px] border border-cyan-500/20 bg-white/[0.03] backdrop-blur-xl p-8 shadow-[0_0_80px_rgba(0,229,255,0.08)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-sm">

                  Total Loans

                </p>

                <h2 className="text-4xl font-bold text-white mt-2">

                  ₹12,45,00,000

                </h2>

                <p className="text-emerald-400 mt-3">

                  ↑ 18.2%

                  <span className="text-gray-500 ml-2">

                    vs last month

                  </span>

                </p>

              </div>

              <div className="w-28 h-28 rounded-full border-[12px] border-cyan-400 border-t-purple-500 border-r-blue-500 flex items-center justify-center text-4xl font-bold text-white">

                78%

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="relative z-10 flex gap-12">

          <div>

            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4">

              <ShieldCheck
                className="text-cyan-400"
                size={26}
              />

            </div>

            <h3 className="text-white font-semibold">

              Bank Level Security

            </h3>

            <p className="text-gray-400 mt-2">

              Your data is encrypted

            </p>

          </div>

          <div>

            <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mb-4">

              <ArrowRight
                className="text-purple-400"
                size={26}
              />

            </div>

            <h3 className="text-white font-semibold">

              Fast Onboarding

            </h3>

            <p className="text-gray-400 mt-2">

              Quick registration flow

            </p>

          </div>

        </div>

      </section>

      {/* RIGHT */}

      <section className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">

        <div className="w-full max-w-3xl rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-10 shadow-[0_0_120px_rgba(0,229,255,0.08)]">

          {/* HEADER */}

          <div className="flex items-center gap-5 mb-10">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">

              <User
                className="text-white"
                size={32}
              />

            </div>

            <div>

              <h1 className="text-5xl font-bold text-white">

                Create Account

              </h1>

              <p className="text-gray-400 mt-2 text-lg">

                Fill in the details to
                get started

              </p>

            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* NAME */}

            <div>

              <label className="block text-white font-medium mb-3">

                Full Name

              </label>

              <div className="relative">

                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full h-16 rounded-2xl bg-transparent border border-white/10 pl-14 pr-5 text-white outline-none focus:border-cyan-400 transition-all"
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-white font-medium mb-3">

                Email Address

              </label>

              <div className="flex gap-4">

                <div className="relative flex-1">

                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                    size={20}
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full h-16 rounded-2xl bg-transparent border border-white/10 pl-14 pr-5 text-white outline-none focus:border-cyan-400 transition-all"
                    required
                  />

                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="h-16 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-[0_0_30px_rgba(6,182,212,0.35)]"

                >

                  Send OTP

                </button>

              </div>

            </div>

            {/* OTP */}

            {
              otpSent && (

                <div>

                  <label className="block text-white font-medium mb-3">

                    OTP Verification

                  </label>

                  <div className="flex gap-4 items-center">

                    <div className="relative flex-1">

                      <ShieldCheck
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                        size={20}
                      />

                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value
                          )
                        }
                        placeholder="Enter OTP"
                        className="w-full h-16 rounded-2xl bg-transparent border border-white/10 pl-14 pr-5 text-white outline-none focus:border-cyan-400 transition-all"
                        required
                      />

                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="h-16 px-8 rounded-2xl border border-cyan-400/30 text-cyan-400 font-semibold"

                    >

                      Verify OTP

                    </button>

                    {
                      otpVerified && (

                        <div className="w-12 h-12 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-xl">

                          ✓

                        </div>

                      )
                    }

                  </div>

                </div>

              )
            }

            {/* PHONE */}

            <div>

              <label className="block text-white font-medium mb-3">

                Phone Number

              </label>

              <div className="relative">

                <Phone
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />

                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full h-16 rounded-2xl bg-transparent border border-white/10 pl-14 pr-5 text-white outline-none focus:border-cyan-400 transition-all"
                  required
                />

              </div>

            </div>

            {/* PASSWORDS */}

            <div className="grid grid-cols-2 gap-5">

              {/* PASSWORD */}

              <div>

                <label className="block text-white font-medium mb-3">

                  Password

                </label>

                <div className="relative">

                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                    size={20}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full h-16 rounded-2xl bg-transparent border border-white/10 pl-14 pr-14 text-white outline-none focus:border-cyan-400 transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                  >

                    {
                      showPassword
                        ? <EyeOff size={20} />
                        : <Eye size={20} />
                    }

                  </button>

                </div>

              </div>

              {/* CONFIRM */}

              <div>

                <label className="block text-white font-medium mb-3">

                  Confirm Password

                </label>

                <div className="relative">

                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                    size={20}
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full h-16 rounded-2xl bg-transparent border border-white/10 pl-14 pr-14 text-white outline-none focus:border-cyan-400 transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                  >

                    {
                      showConfirmPassword
                        ? <EyeOff size={20} />
                        : <Eye size={20} />
                    }

                  </button>

                </div>

              </div>

            </div>

            {/* PASSWORD RULES */}

            <div className="flex flex-wrap gap-3">

              {
                Object.entries(
                  passwordValidation
                ).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className={`px-4 py-2 rounded-xl text-sm border ${

                        value

                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"

                          : "bg-white/[0.03] border-white/10 text-gray-500"

                      }`}
                    >

                      {
                        key ===
                        "minLength"

                          ? "8+ Characters"

                          : key ===
                            "upperCase"

                          ? "Uppercase"

                          : key ===
                            "lowerCase"

                          ? "Lowercase"

                          : key ===
                            "number"

                          ? "Number"

                          : "Special Character"
                      }

                    </div>

                  )
                )
              }

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={
                loading ||
                !otpVerified
              }
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white text-xl font-semibold shadow-[0_0_50px_rgba(6,182,212,0.35)] hover:scale-[1.01] transition-all"

            >

              {
                loading

                  ? "Creating Account..."

                  : "Create Account →"
              }

            </button>

            {/* MESSAGE */}

            {
              message && (

                <p
                  className={`text-center font-medium ${

                    success
                      ? "text-emerald-400"
                      : "text-red-400"

                  }`}
                >

                  {message}

                </p>

              )
            }

            {/* LOGIN */}

            <div className="text-center pt-3 text-gray-400">

              Already have an account?

              <a
                href="/login"
                className="text-cyan-400 ml-2 hover:text-cyan-300"
              >

                Login

              </a>

            </div>

          </form>

        </div>

      </section>

    </main>

  );

}