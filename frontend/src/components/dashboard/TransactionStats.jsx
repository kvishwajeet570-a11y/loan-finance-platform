"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  BadgeIndianRupee,
  TrendingUp,
  Sparkles,
  RefreshCcw,
  CreditCard,
  PiggyBank,
  Activity,

} from "lucide-react";


export default function TransactionStats() {

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

    totalTransactions: 0,

    totalCredit: 0,

    totalDebit: 0,

    cashbackEarned: 0,

    walletBalance: 0,

    successRate: 0,

  });


  /* ========================================
     FETCH STATS
  ======================================== */

  const fetchTransactionStats =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        const res =
          await api.get(

            `/transactions/stats/${userId}`

          );


        if (res.data.success) {

          setStats({

            totalTransactions:
              res.data.stats
                .totalTransactions || 0,

            totalCredit:
              res.data.stats
                .totalCredit || 0,

            totalDebit:
              res.data.stats
                .totalDebit || 0,

            cashbackEarned:
              res.data.stats
                .cashbackEarned || 0,

            walletBalance:
              res.data.stats
                .walletBalance || 0,

            successRate:
              res.data.stats
                .successRate || 0,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch transaction stats"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchTransactionStats();

  }, []);


  /* ========================================
     STATS DATA
  ======================================== */

  const statsCards = [

    {

      title:
        "Total Transactions",

      value:
        stats.totalTransactions.toLocaleString(),

      icon: Wallet,

      gradient:
        "from-cyan-500 to-blue-700",

      glow:
        "bg-cyan-500/20",

      text:
        "All successful activities",

    },

    {

      title:
        "Total Credit",

      value:
        `₹ ${stats.totalCredit.toLocaleString()}`,

      icon:
        ArrowDownLeft,

      gradient:
        "from-emerald-500 to-green-700",

      glow:
        "bg-emerald-500/20",

      text:
        "Incoming payments & rewards",

    },

    {

      title:
        "Total Debit",

      value:
        `₹ ${stats.totalDebit.toLocaleString()}`,

      icon:
        ArrowUpRight,

      gradient:
        "from-red-500 to-rose-700",

      glow:
        "bg-red-500/20",

      text:
        "Outgoing transactions",

    },

    {

      title:
        "Cashback Earned",

      value:
        `₹ ${stats.cashbackEarned.toLocaleString()}`,

      icon:
        BadgeIndianRupee,

      gradient:
        "from-indigo-500 to-purple-700",

      glow:
        "bg-purple-500/20",

      text:
        "Total cashback rewards",

    },

    {

      title:
        "Wallet Balance",

      value:
        `₹ ${stats.walletBalance.toLocaleString()}`,

      icon:
        PiggyBank,

      gradient:
        "from-yellow-400 to-orange-600",

      glow:
        "bg-yellow-500/20",

      text:
        "Current available balance",

    },

    {

      title:
        "Success Rate",

      value:
        `${stats.successRate}%`,

      icon:
        TrendingUp,

      gradient:
        "from-pink-500 to-fuchsia-700",

      glow:
        "bg-pink-500/20",

      text:
        "Successful transaction ratio",

    },

  ];


  return (

    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            Real-Time Financial Insights

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Transaction Statistics

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Monitor credits, debits, cashback earnings,
            wallet balance & live financial performance analytics.

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchTransactionStats}

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
          OVERVIEW BANNER
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 mb-8 text-white shadow-2xl">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-white/10 blur-[100px] rounded-full" />


        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">

              🚀 Financial Dashboard

            </div>


            <h2 className="text-5xl font-black mt-6">

              Smart Transaction Monitoring

            </h2>


            <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">

              Get advanced insights into your financial
              activities, transaction flow & wallet growth performance.

            </p>

          </div>


          {/* RIGHT */}

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Growth

              </p>


              <h3 className="text-4xl font-black mt-3">

                +45%

              </h3>

            </div>


            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Performance

              </p>


              <h3 className="text-4xl font-black mt-3">

                99%

              </h3>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          STATS GRID
      ======================================== */}

      {

        loading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {

              [1, 2, 3, 4, 5, 6].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-[220px] rounded-[32px] bg-white/5"

                  />

                )

              )

            }

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {

              statsCards.map(

                (

                  item,
                  index

                ) => {

                  const Icon =
                    item.icon;


                  return (

                    <div

                      key={index}

                      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 hover:border-cyan-400/20 backdrop-blur-2xl p-6 transition-all duration-300 hover:scale-[1.02]"

                    >

                      {/* GLOW */}

                      <div className={`absolute top-0 right-0 w-[180px] h-[180px] blur-[100px] rounded-full ${item.glow}`} />


                      {/* CONTENT */}

                      <div className="relative z-10">

                        {/* TOP */}

                        <div className="flex items-center justify-between">

                          {/* ICON */}

                          <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-2xl`}>

                            <Icon size={30} />

                          </div>


                          {/* BADGE */}

                          <div className="bg-white/10 border border-white/10 px-3 py-2 rounded-full text-xs font-bold text-slate-300">

                            LIVE

                          </div>

                        </div>


                        {/* TITLE */}

                        <div className="mt-8">

                          <p className="text-slate-400 text-sm font-semibold">

                            {

                              item.title

                            }

                          </p>


                          <h2 className="text-4xl font-black text-white mt-4 leading-tight">

                            {

                              item.value

                            }

                          </h2>


                          <p className="text-slate-400 mt-4 leading-relaxed">

                            {

                              item.text

                            }

                          </p>

                        </div>


                        {/* FOOTER */}

                        <div className="flex items-center justify-between mt-8">

                          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">

                            <Activity size={16} />

                            Updated Live

                          </div>


                          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">

                            <TrendingUp size={16} />

                            +12%

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                }

              )

            }

          </div>

        )

      }


      {/* ========================================
          EXTRA ANALYTICS
      ======================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        {/* TRANSACTION HEALTH */}

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

          {/* GLOW */}

          <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-cyan-500/10 blur-[100px] rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center gap-4 mb-8">

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-2xl">

                <CreditCard size={30} />

              </div>


              <div>

                <h3 className="text-3xl font-black text-white">

                  Transaction Health

                </h3>


                <p className="text-slate-400 mt-2">

                  Overall system performance

                </p>

              </div>

            </div>


            {/* BARS */}

            <div className="space-y-6">

              {/* SUCCESS */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-slate-300 font-semibold">

                    Successful Transactions

                  </span>


                  <span className="text-cyan-400 font-bold">

                    {

                      stats.successRate

                    }%

                  </span>

                </div>


                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">

                  <div

                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"

                    style={{

                      width:
                        `${stats.successRate}%`,

                    }}

                  />

                </div>

              </div>


              {/* CREDIT */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-slate-300 font-semibold">

                    Credit Ratio

                  </span>


                  <span className="text-emerald-400 font-bold">

                    78%

                  </span>

                </div>


                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">

                  <div

                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"

                    style={{

                      width: "78%",

                    }}

                  />

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* FINANCIAL SUMMARY */}

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

          {/* GLOW */}

          <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-purple-500/10 blur-[100px] rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center gap-4 mb-8">

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-fuchsia-700 flex items-center justify-center text-white shadow-2xl">

                <TrendingUp size={30} />

              </div>


              <div>

                <h3 className="text-3xl font-black text-white">

                  Financial Summary

                </h3>


                <p className="text-slate-400 mt-2">

                  Monthly performance insights

                </p>

              </div>

            </div>


            {/* SUMMARY GRID */}

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

                <p className="text-slate-400 text-sm">

                  Monthly Growth

                </p>


                <h2 className="text-4xl font-black text-white mt-4">

                  +42%

                </h2>

              </div>


              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

                <p className="text-slate-400 text-sm">

                  Cashback Rate

                </p>


                <h2 className="text-4xl font-black text-white mt-4">

                  18%

                </h2>

              </div>


              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

                <p className="text-slate-400 text-sm">

                  Wallet Usage

                </p>


                <h2 className="text-4xl font-black text-white mt-4">

                  89%

                </h2>

              </div>


              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

                <p className="text-slate-400 text-sm">

                  User Activity

                </p>


                <h2 className="text-4xl font-black text-white mt-4">

                  High

                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}