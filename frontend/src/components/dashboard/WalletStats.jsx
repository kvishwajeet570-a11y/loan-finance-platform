"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  Wallet,
  BadgeIndianRupee,
  ArrowDownCircle,
  TrendingUp,
  Sparkles,
  RefreshCcw,
  Activity,
  ShieldCheck,
  CreditCard,
  Coins,

} from "lucide-react";


export default function WalletStats() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    stats,
    setStats
  ] = useState({

    balance: 0,

    cashback: 0,

    spent: 0,

    transactions: 0,

  });


  /* ========================================
     FETCH WALLET STATS
  ======================================== */

  const fetchWalletStats =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        const res =
          await api.get(

            `/wallet/stats/${userId}`

          );


        if (res.data.success) {

          setStats({

            balance:
              res.data.stats.balance || 0,

            cashback:
              res.data.stats.cashback || 0,

            spent:
              res.data.stats.spent || 0,

            transactions:
              res.data.stats.transactions || 0,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch wallet stats"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchWalletStats();

  }, []);


  /* ========================================
     CARD DATA
  ======================================== */

  const cards = [

    {

      title: "Total Balance",

      value: `₹${stats.balance.toLocaleString()}`,

      icon: Wallet,

      color:

        "from-emerald-500 to-green-700",

      glow:
        "bg-emerald-500/10",

      text:
        "text-emerald-400",

      badge:
        "+18% Growth",

    },

    {

      title: "Cashback Earned",

      value: `₹${stats.cashback.toLocaleString()}`,

      icon: Coins,

      color:

        "from-cyan-500 to-blue-700",

      glow:
        "bg-cyan-500/10",

      text:
        "text-cyan-400",

      badge:
        "Rewards",

    },

    {

      title: "Total Spent",

      value: `₹${stats.spent.toLocaleString()}`,

      icon: ArrowDownCircle,

      color:

        "from-red-500 to-rose-700",

      glow:
        "bg-red-500/10",

      text:
        "text-red-400",

      badge:
        "Expenses",

    },

    {

      title: "Transactions",

      value:
        stats.transactions.toLocaleString(),

      icon: Activity,

      color:

        "from-purple-500 to-indigo-700",

      glow:
        "bg-purple-500/10",

      text:
        "text-purple-400",

      badge:
        "Live Data",

    },

  ];


  return (

    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            Advanced Wallet Analytics

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Wallet Statistics

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Real-time wallet insights, cashback earnings,
            transaction monitoring & spending analytics.

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchWalletStats}

          className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh Stats

        </button>

      </div>


      {/* ========================================
          STATS GRID
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {

          cards.map(

            (
              card,
              index
            ) => {

              const Icon =
                card.icon;

              return (

                <div

                  key={index}

                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:border-cyan-400/20 transition-all duration-500 hover:-translate-y-2"

                >

                  {/* GLOW */}

                  <div

                    className={`absolute top-0 right-0 w-[140px] h-[140px] ${card.glow} blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500`}

                  />


                  {/* CONTENT */}

                  <div className="relative z-10">

                    {/* TOP */}

                    <div className="flex items-center justify-between">

                      <div

                        className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-2xl`}

                      >

                        <Icon size={30} />

                      </div>


                      <span

                        className={`px-4 py-2 rounded-full text-sm font-bold border ${card.glow} ${card.text} border-white/10`}

                      >

                        {card.badge}

                      </span>

                    </div>


                    {/* TITLE */}

                    <p className="text-slate-400 mt-8 text-lg">

                      {card.title}

                    </p>


                    {/* VALUE */}

                    {

                      loading ? (

                        <div className="w-40 h-12 bg-white/10 rounded-2xl animate-pulse mt-4" />

                      ) : (

                        <h2 className="text-4xl font-black text-white mt-4 tracking-tight">

                          {card.value}

                        </h2>

                      )

                    }


                    {/* FOOTER */}

                    <div className="flex items-center gap-2 mt-8 text-sm text-slate-400">

                      <TrendingUp
                        size={16}
                        className={card.text}
                      />

                      Updated just now

                    </div>

                  </div>

                </div>

              );

            }

          )

        }

      </div>


      {/* ========================================
          FOOTER
      ======================================== */}

      <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">

            <ShieldCheck size={28} />

          </div>


          <div>

            <h3 className="text-white font-black text-xl">

              Smart Wallet Protection

            </h3>


            <p className="text-slate-400 mt-1">

              Your wallet activity is encrypted and monitored in real-time.

            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-400/20 px-5 py-3 rounded-2xl text-cyan-400 font-bold">

          <CreditCard size={18} />

          Wallet Analytics Live

        </div>

      </div>

    </div>

  );

}