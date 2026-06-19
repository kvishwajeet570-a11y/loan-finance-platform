"use client";

export default function Hero({

  scrollToLoanForm,

}) {

  return (

    <section className="relative min-h-screen bg-gradient-to-br from-[#020617] via-[#081120] to-[#111827] text-white flex items-center overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[140px]"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[140px]"></div>


      <div className="max-w-7xl mx-auto px-6 flex flex-col justify-center items-start relative z-10">

        <p className="text-cyan-400 text-xl font-semibold mb-6">

          India's Trusted Fintech Platform

        </p>


        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight max-w-5xl">

          Fast & Secure <br />

          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">

            Loan Finance

          </span>

        </h1>


        <p className="text-gray-400 text-xl mt-8 leading-9 max-w-3xl">

          Apply for personal, home, business,
          and education loans instantly with
          low interest rates and fast approval.

        </p>


        {/* BUTTONS */}

        <div className="flex flex-wrap gap-6 mt-10">


          {/* APPLY LOAN BUTTON */}

          <button

            onClick={scrollToLoanForm}

            className="bg-gradient-to-r from-cyan-500 to-purple-500 px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-all"

          >

            Apply Loan

          </button>


          {/* LEARN MORE BUTTON */}

          <button className="border border-white/20 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all">

            Learn More

          </button>

        </div>


        {/* STATS */}

        <div className="flex flex-wrap gap-12 mt-16">

          <div>

            <h3 className="text-4xl font-bold text-cyan-400">

              250K+

            </h3>

            <p className="text-gray-400 mt-2">

              Customers

            </p>

          </div>


          <div>

            <h3 className="text-4xl font-bold text-purple-400">

              ₹500Cr+

            </h3>

            <p className="text-gray-400 mt-2">

              Loans Approved

            </p>

          </div>


          <div>

            <h3 className="text-4xl font-bold text-green-400">

              98%

            </h3>

            <p className="text-gray-400 mt-2">

              Success Rate

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}