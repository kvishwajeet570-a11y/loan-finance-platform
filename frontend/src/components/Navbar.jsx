"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  return (

    <header className="fixed top-0 left-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* LOGO */}

        <Link
          href="/"
          className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
        >
          LoanPay
        </Link>


        {/* DESKTOP MENU */}

        <nav className="hidden md:flex items-center gap-10 text-white">

          <Link
            href="/"
            className="hover:text-cyan-400 transition-all"
          >
            Home
          </Link>

          <Link
            href="/careers"
            className="hover:text-cyan-400 transition-all"
          >
            Careers
          </Link>

          <Link
            href="/contact"
            className="hover:text-cyan-400 transition-all"
          >
            Contact
          </Link>

        </nav>


        {/* BUTTONS */}

        <div className="hidden md:flex items-center gap-4">

          {/* DASHBOARD PROTECTED */}

          <div
            className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-5 py-3 rounded-2xl text-sm"
          >
            Dashboard Available After Login
          </div>

          <Link
            href="/login"
            className="border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-2xl text-white font-bold hover:scale-105 transition-all"
          >
            Register
          </Link>

        </div>


        {/* MOBILE MENU BUTTON */}

        <button
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>

      </div>


      {/* MOBILE MENU */}

      {

        menuOpen && (

          <div className="md:hidden bg-[#081120] border-t border-white/10 px-6 py-6 space-y-5 text-white">

            <Link
              href="/"
              className="block"
            >
              Home
            </Link>

            <Link
              href="/careers"
              className="block"
            >
              Careers
            </Link>

            <Link
              href="/contact"
              className="block"
            >
              Contact
            </Link>


            {/* DASHBOARD LOCK */}

            <div className="text-yellow-300 text-sm border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 rounded-2xl">

              Dashboard available only after login

            </div>


            <Link
              href="/login"
              className="block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="block"
            >
              Register
            </Link>

          </div>

        )

      }

    </header>

  );

}