"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

import api from "@/lib/api";


export default function MonthlyRevenueChart() {

  const [
    revenueData,
    setRevenueData
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    totalRevenue,
    setTotalRevenue
  ] = useState(0);


  const [
    growth,
    setGrowth
  ] = useState(0);


  /* ========================================
     FETCH MONTHLY REVENUE
  ======================================== */

  const fetchRevenue =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/revenue/monthly"

          );


        if (res.data.success) {

          setRevenueData(

            res.data.revenueData || []

          );


          setTotalRevenue(

            res.data.totalRevenue || 0

          );


          setGrowth(

            res.data.growth || 0

          );

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

    fetchRevenue();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Monthly Revenue Analytics

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time business growth insights 📈

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          Live Revenue

        </div>

      </div>


      {/* ========================================
          TOP CARDS
      ======================================== */}

      {

        !loading && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

            {/* TOTAL REVENUE */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Total Revenue

              </p>


              <h2 className="text-5xl font-black mt-4">

                ₹{

                  Number(

                    totalRevenue

                  ).toLocaleString()

                }

              </h2>

            </div>


            {/* GROWTH */}

            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Monthly Growth

              </p>


              <h2 className="text-5xl font-black mt-4">

                {

                  growth

                }%

              </h2>

            </div>

          </div>

        )

      }


      {/* ========================================
          LOADING
      ======================================== */}

      {

        loading ? (

          <div className="animate-pulse h-[420px] rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

        ) : revenueData.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Revenue Data Found

            </h3>

            <p className="text-zinc-500 mt-2">

              Monthly revenue analytics will appear here

            </p>

          </div>

        ) : (

          <>

            {/* ========================================
                CHART
            ======================================== */}

            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5">

              <div className="h-[420px]">

                <ResponsiveContainer>

                  <AreaChart

                    data={revenueData}

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

                      stroke="#3f3f46"

                    />


                    <XAxis

                      dataKey="month"

                      stroke="#71717a"

                    />


                    <YAxis

                      stroke="#71717a"

                    />


                    <Tooltip />


                    <Area

                      type="monotone"

                      dataKey="revenue"

                      stroke="#06b6d4"

                      fillOpacity={1}

                      fill="url(#colorRevenue)"

                      strokeWidth={4}

                    />


                    <Line

                      type="monotone"

                      dataKey="revenue"

                      stroke="#22c55e"

                      strokeWidth={4}

                      dot={{

                        r: 6,

                      }}

                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>


            {/* ========================================
                MONTHLY CARDS
            ======================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

              {

                revenueData.map(

                  (

                    item,
                    index

                  ) => (

                    <div

                      key={index}

                      className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-5 rounded-3xl shadow-xl"

                    >

                      <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-400/20 blur-3xl rounded-full" />


                      <p className="text-zinc-400">

                        {

                          item.month

                        }

                      </p>


                      <h2 className="text-4xl font-black mt-4 text-cyan-400">

                        ₹{

                          Number(

                            item.revenue

                          ).toLocaleString()

                        }

                      </h2>


                      <p className="text-zinc-500 mt-3 text-sm">

                        Monthly Revenue

                      </p>

                    </div>

                  )

                )

              }

            </div>

          </>

        )

      }

    </div>

  );

}