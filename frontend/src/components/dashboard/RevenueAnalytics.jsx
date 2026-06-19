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
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,

} from "recharts";


export default function RevenueAnalytics() {

  const [
    analytics,
    setAnalytics
  ] = useState([]);


  const [
    stats,
    setStats
  ] = useState({

    totalRevenue: 0,

    monthlyGrowth: 0,

    highestRevenue: 0,

    totalTransactions: 0,

  });


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH ANALYTICS
  ======================================== */

  const fetchAnalytics =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/analytics/revenue"

          );


        if (res.data.success) {

          setAnalytics(

            res.data.analytics || []

          );


          setStats({

            totalRevenue:
              res.data.stats.totalRevenue || 0,

            monthlyGrowth:
              res.data.stats.monthlyGrowth || 0,

            highestRevenue:
              res.data.stats.highestRevenue || 0,

            totalTransactions:
              res.data.stats.totalTransactions || 0,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch revenue analytics"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchAnalytics();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Revenue Analytics

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time business revenue insights & growth tracking 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          Live Revenue Data

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


            <div className="animate-pulse h-[450px] rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

          </div>

        ) : (

          <>

            {/* TOP STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              {/* TOTAL REVENUE */}

              <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Total Revenue

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        stats.totalRevenue

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>


              {/* GROWTH */}

              <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Monthly Growth

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.monthlyGrowth

                    }%

                  </h2>

                </div>

              </div>


              {/* HIGHEST */}

              <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Highest Revenue

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        stats.highestRevenue

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>


              {/* TRANSACTIONS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 text-black p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-black/70">

                    Transactions

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.totalTransactions

                    }

                  </h2>

                </div>

              </div>

            </div>


            {/* MAIN CHART */}

            <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-3xl p-8 mt-8 shadow-2xl">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                {/* TITLE */}

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

                  <div>

                    <h3 className="text-3xl font-black text-white">

                      Revenue Growth Overview

                    </h3>


                    <p className="text-zinc-400 mt-2">

                      Track monthly revenue growth & financial performance

                    </p>

                  </div>


                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl">

                    📈 Business Growth

                  </div>

                </div>


                {/* CHART */}

                <div className="h-[450px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <AreaChart
                      data={analytics}
                    >

                      <defs>

                        <linearGradient

                          id="colorRevenue"

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

                        dataKey="revenue"

                        stroke="#06b6d4"

                        fillOpacity={1}

                        fill="url(#colorRevenue)"

                        strokeWidth={4}

                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>


            {/* EXTRA CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              {/* REVENUE STATUS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Revenue Performance

                  </p>


                  <h2 className="text-6xl font-black mt-4">

                    Excellent 🚀

                  </h2>


                  <p className="text-white/70 mt-4 leading-relaxed">

                    Your platform revenue is growing steadily with strong business performance.

                  </p>

                </div>

              </div>


              {/* TARGET */}

              <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Revenue Target

                  </p>


                  <h2 className="text-6xl font-black mt-4">

                    ₹10L

                  </h2>


                  <div className="w-full h-4 bg-white/10 rounded-full mt-6 overflow-hidden">

                    <div

                      className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"

                      style={{

                        width: `${

                          Math.min(

                            (

                              stats.totalRevenue /

                              1000000

                            ) * 100,

                            100

                          )

                        }%`,

                      }}

                    />

                  </div>

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}