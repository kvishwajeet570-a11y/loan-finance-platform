"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import {

  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,

} from "recharts";


export default function RechargeStats() {

  const [
    stats,
    setStats
  ] = useState({

    totalRecharges: 0,

    successful: 0,

    failed: 0,

    pending: 0,

    cashbackEarned: 0,

    totalSpent: 0,

  });


  const [
    analytics,
    setAnalytics
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH STATS
  ======================================== */

  const fetchRechargeStats =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        const res =
          await api.get(

            `/recharge/stats/${userId}`

          );


        if (res.data.success) {

          setStats({

            totalRecharges:
              res.data.stats.totalRecharges || 0,

            successful:
              res.data.stats.successful || 0,

            failed:
              res.data.stats.failed || 0,

            pending:
              res.data.stats.pending || 0,

            cashbackEarned:
              res.data.stats.cashbackEarned || 0,

            totalSpent:
              res.data.stats.totalSpent || 0,

          });


          setAnalytics(

            res.data.analytics || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch recharge statistics"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     SUCCESS RATE
  ======================================== */

  const successRate =

    stats.totalRecharges > 0

      ? Math.round(

          (

            stats.successful /

            stats.totalRecharges

          ) * 100

        )

      : 0;


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchRechargeStats();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Recharge Statistics

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time recharge insights & analytics ⚡

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          Live Data

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              {

                [1, 2, 3, 4].map(

                  (item) => (

                    <div

                      key={item}

                      className="animate-pulse h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                    />

                  )

                )

              }

            </div>


            <div className="animate-pulse h-[420px] rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

          </div>

        ) : (

          <>

            {/* TOP STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              {/* TOTAL */}

              <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Total Recharges

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.totalRecharges

                    }

                  </h2>

                </div>

              </div>


              {/* SUCCESS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Successful

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.successful

                    }

                  </h2>

                </div>

              </div>


              {/* CASHBACK */}

              <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 text-black p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-black/70">

                    Cashback Earned

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        stats.cashbackEarned

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>


              {/* TOTAL SPENT */}

              <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Total Spent

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        stats.totalSpent

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>

            </div>


            {/* SUCCESS RATE */}

            <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white rounded-3xl p-8 mt-8 shadow-2xl">

              <div className="absolute top-0 right-0 w-52 h-52 bg-green-500/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                  {/* LEFT */}

                  <div>

                    <p className="text-zinc-400 text-lg">

                      Recharge Success Rate

                    </p>


                    <h2 className="text-7xl font-black mt-4 text-green-400">

                      {

                        successRate

                      }%

                    </h2>


                    <p className="text-zinc-500 mt-4 max-w-2xl leading-relaxed">

                      Based on completed recharge transactions & successful payment processing.

                    </p>

                  </div>


                  {/* RIGHT */}

                  <div className="w-full xl:w-[420px]">

                    <div className="flex justify-between mb-3">

                      <span className="text-zinc-400">

                        Performance

                      </span>


                      <span className="font-bold text-green-400">

                        {

                          successRate

                        }%

                      </span>

                    </div>


                    <div className="w-full h-5 bg-zinc-700 rounded-full overflow-hidden">

                      <div

                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700"

                        style={{

                          width: `${

                            successRate

                          }%`,

                        }}

                      />

                    </div>


                    <div className="grid grid-cols-2 gap-5 mt-6">

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                        <p className="text-zinc-400 text-sm">

                          Failed

                        </p>


                        <h3 className="text-4xl font-black mt-3 text-red-400">

                          {

                            stats.failed

                          }

                        </h3>

                      </div>


                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                        <p className="text-zinc-400 text-sm">

                          Pending

                        </p>


                        <h3 className="text-4xl font-black mt-3 text-yellow-400">

                          {

                            stats.pending

                          }

                        </h3>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* ANALYTICS CHART */}

            <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-3xl p-8 mt-8 shadow-2xl">

              <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-500/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                {/* TITLE */}

                <div className="mb-8">

                  <h3 className="text-3xl font-black text-white">

                    Recharge Growth Analytics

                  </h3>


                  <p className="text-zinc-400 mt-2">

                    Monthly recharge transaction growth tracking

                  </p>

                </div>


                {/* CHART */}

                <div className="h-[420px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <AreaChart
                      data={analytics}
                    >

                      <defs>

                        <linearGradient

                          id="colorRecharge"

                          x1="0"

                          y1="0"

                          x2="0"

                          y2="1"

                        >

                          <stop

                            offset="5%"

                            stopColor="#06b6d4"

                            stopOpacity={0.8}

                          />

                          <stop

                            offset="95%"

                            stopColor="#06b6d4"

                            stopOpacity={0}

                          />

                        </linearGradient>

                      </defs>


                      <CartesianGrid

                        strokeDasharray="3 3"

                        stroke="#27272a"

                      />


                      <XAxis

                        dataKey="month"

                        stroke="#a1a1aa"

                      />


                      <YAxis

                        stroke="#a1a1aa"

                      />


                      <Tooltip

                        contentStyle={{

                          backgroundColor:
                            "#18181b",

                          border:
                            "1px solid #27272a",

                          borderRadius:
                            "20px",

                          color:
                            "#fff",

                        }}

                      />


                      <Area

                        type="monotone"

                        dataKey="recharges"

                        stroke="#06b6d4"

                        fillOpacity={1}

                        fill="url(#colorRecharge)"

                        strokeWidth={4}

                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}