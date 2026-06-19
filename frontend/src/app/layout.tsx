import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "react-hot-toast";


/* ========================================
   METADATA
======================================== */

export const metadata: Metadata = {

  title: "Loan Finance",

  description:
    "Modern Loan Finance Platform",

};


/* ========================================
   ROOT LAYOUT
======================================== */

export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >

      <body
        className="
          min-h-screen
          bg-[#020617]
          text-white
          overflow-x-hidden
          antialiased
        "
      >

        {/* MAIN APP */}

        <main className="w-full min-h-screen">

          {children}

        </main>

        {/* TOASTER */}

        <Toaster

          position="top-right"

          reverseOrder={false}

          toastOptions={{

            duration: 3000,

            style: {

              background: "#0f172a",

              color: "#ffffff",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "16px",

              padding: "14px 18px",

            },

          }}

        />

      </body>

    </html>

  );

}