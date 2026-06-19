"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import {

  Crown,
  Trophy,
  Medal,
  Star,
  TrendingUp,
  RefreshCcw,
  Sparkles,
  Award,
  Flame,

} from "lucide-react";


export default function TopPerformers() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    performers,
    setPerformers
  ] = useState([]);


  /* ========================================
     FETCH PERFORMERS
  ======================================== */

  const fetchTopPerformers =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/leaderboard/top-performers"

          );


        if (res.data.success) {

          setPerformers(

            res.data.performers || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch performers"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     GET RANK ICON
  ======================================== */

  const getRankIcon =
    (index) => {

      if (index === 0) {

        return (

          <div className="relative">

            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-60 rounded-full" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center shadow-2xl">

              <Crown
                size={34}
                className="text-white"
              />

            </div>

          </div>

        );

      }


      if (index === 1) {

        return (

          <div className="relative">

            <div className="absolute inset-0 bg-slate-300 blur-2xl opacity-60 rounded-full" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-2xl">

              <Trophy
                size={34}
                className="text-white"
              />

            </div>

          </div>

        );

      }


      if (index === 2) {

        return (

          <div className="relative">

            <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-60 rounded-full" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-2xl">

              <Medal
                size={34}
                className="text-white"
              />

            </div>

          </div>

        );

      }


      return (

        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl">

          <Star
            size={30}
            className="text-white"
          />

        </div>

      );

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchTopPerformers();

  }, []);


  return (

    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl p-6 lg:p-8">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-yellow-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-cyan-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-400/20 px-4 py-2 rounded-full text-yellow-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            Elite Performance Ranking

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Top Performers

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Discover the highest-performing agents, revenue leaders &
            top achievers across the LoanPay fintech ecosystem 🚀

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchTopPerformers}

          className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh Rankings

        </button>

      </div>


      {/* ========================================
          TOP STATS
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* TOTAL */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <Award size={42} />


            <p className="mt-6 text-white/80">

              Top Agents

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                performers.length

              }

            </h2>

          </div>

        </div>


        {/* GROWTH */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <TrendingUp size={42} />


            <p className="mt-6 text-white/80">

              Revenue Growth

            </p>


            <h2 className="text-5xl font-black mt-3">

              +32%

            </h2>

          </div>

        </div>


        {/* PERFORMANCE */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <Flame size={42} />


            <p className="mt-6 text-white/80">

              Performance Rate

            </p>


            <h2 className="text-5xl font-black mt-3">

              98%

            </h2>

          </div>

        </div>

      </div>


      {/* ========================================
          PERFORMERS LIST
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 lg:p-8">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-cyan-500/10 blur-[100px] rounded-full" />


        {/* TITLE */}

        <div className="relative z-10 flex items-center justify-between gap-5 mb-8">

          <div>

            <h3 className="text-3xl font-black text-white">

              Leaderboard Rankings

            </h3>


            <p className="text-slate-400 mt-2">

              Real-time ranking based on earnings & performance

            </p>

          </div>


          <div className="hidden md:flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold">

            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />

            Live Rankings

          </div>

        </div>


        {/* LOADING */}

        {

          loading ? (

            <div className="space-y-5">

              {

                [1, 2, 3, 4].map(

                  (item) => (

                    <div

                      key={item}

                      className="animate-pulse h-[140px] rounded-3xl bg-white/5"

                    />

                  )

                )

              }

            </div>

          ) : performers.length === 0 ? (

            <div className="flex flex-col items-center justify-center text-center py-20">

              <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">

                <Trophy size={44} />

              </div>


              <h3 className="text-3xl font-black text-white mt-6">

                No Rankings Found

              </h3>


              <p className="text-slate-400 mt-3">

                Top performers will appear here.

              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {

                performers.map(

                  (

                    performer,
                    index

                  ) => (

                    <div

                      key={performer.id || index}

                      className={`group relative overflow-hidden rounded-[32px] border transition-all duration-300 hover:scale-[1.01] ${

                        index === 0

                          ? "border-yellow-400/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"

                          : index === 1

                          ? "border-slate-400/20 bg-gradient-to-r from-slate-500/10 to-slate-700/10"

                          : index === 2

                          ? "border-orange-400/20 bg-gradient-to-r from-orange-500/10 to-red-500/10"

                          : "border-white/10 bg-white/5"

                      } p-6 lg:p-7`}

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-[140px] h-[140px] bg-white/5 blur-[80px] rounded-full" />


                      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                        {/* LEFT */}

                        <div className="flex items-center gap-5">

                          {/* RANK ICON */}

                          {

                            getRankIcon(

                              index

                            )

                          }


                          {/* USER */}

                          <div>

                            <div className="flex items-center gap-3">

                              <h3 className="text-2xl font-black text-white">

                                {

                                  performer.name

                                }

                              </h3>


                              {

                                index === 0 && (

                                  <span className="bg-yellow-500/10 border border-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">

                                    #1 Champion

                                  </span>

                                )

                              }

                            </div>


                            <p className="text-slate-400 mt-3">

                              {

                                performer.role ||

                                "Senior Loan Advisor"

                              }

                            </p>


                            <div className="flex flex-wrap items-center gap-3 mt-5">

                              <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold">

                                {

                                  performer.totalDeals ||

                                  0

                                } Deals

                              </div>


                              <div className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">

                                {

                                  performer.successRate ||

                                  95

                                }% Success

                              </div>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="text-left xl:text-right">

                          <p className="text-slate-400 text-sm font-semibold">

                            Total Earnings

                          </p>


                          <h2 className="text-5xl font-black text-white mt-3">

                            ₹{

                              Number(

                                performer.amount ||

                                performer.earnings ||

                                0

                              ).toLocaleString()

                            }

                          </h2>


                          <p className="text-cyan-400 mt-4 font-semibold">

                            +12% This Month

                          </p>

                        </div>

                      </div>

                    </div>

                  )

                )

              }

            </div>

          )

        }

      </div>


      {/* ========================================
          BOTTOM BANNER
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 mt-8 text-white shadow-2xl">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white/10 blur-[100px] rounded-full" />


        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">

              🚀 Performance Rewards

            </div>


            <h2 className="text-5xl font-black mt-6">

              Become #1 Performer

            </h2>


            <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">

              Close more deals, grow your revenue &
              unlock premium bonuses, rewards & leaderboard achievements.

            </p>

          </div>


          {/* RIGHT */}

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Monthly Bonus

              </p>


              <h3 className="text-4xl font-black mt-3">

                ₹50K

              </h3>

            </div>


            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Rewards

              </p>


              <h3 className="text-4xl font-black mt-3">

                VIP

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}