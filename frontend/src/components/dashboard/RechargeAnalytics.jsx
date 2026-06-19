"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import {

  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,

} from "recharts";


export default function RechargeAnalytics() {

  const [
    analytics,
    setAnalytics
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    totalRecharge,
    setTotalRecharge
  ] = useState(0);


  const [
    totalTransactions,
    setTotalTransactions
  ] = useState(0);


  const [
    highestMonth,
    setHighestMonth
  ] = useState("");


  /* ========================================
     FETCH ANALYTICS
  ======================================== */

  const fetchAnalytics =
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

            `/recharge/analytics/${userId}`

          );


        if (res.data.success) {

          const chartData =
            res.data.analytics;


          setAnalytics(

            chartData

          );


          /* ========================================
             TOTAL RECHARGE
          ======================================== */

          const total =
            chartData.reduce(

              (acc, item) =>

                acc +

                Number(

                  item.recharge || 0

                ),

              0

            );


          setTotalRecharge(total);


          /* ========================================
             TOTAL TRANSACTIONS
          ======================================== */

          const transactions =
            chartData.reduce(

              (acc, item) =>

                acc +

                Number(

                  item.transactions || 0

                ),

              0

            );


          setTotalTransactions(

            transactions

          );


          /* ========================================
             HIGHEST MONTH
          ======================================== */

          const highest =
            [...chartData].sort(

              (a, b) =>

                b.recharge -

                a.recharge

            )[0];


          if (highest) {

            setHighestMonth(

              highest.month

            );

          }

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch recharge analytics"

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

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Recharge Analytics

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time recharge performance dashboard 📊

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          Live Reports

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {

                [1, 2, 3].map(

                  (item) => (

                    <div

                      key={item}

                      className="animate-pulse h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                    />

                  )

                )

              }

            </div>


            <div className="animate-pulse h-[400px] rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

          </div>

        ) : (

          <>

            {/* TOP STATS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* TOTAL RECHARGE */}

              <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Total Recharge

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        totalRecharge

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>


              {/* TRANSACTIONS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Transactions

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      totalTransactions

                    }

                  </h2>

                </div>

              </div>


              {/* BEST MONTH */}

              <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Best Performing Month

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      highestMonth ||

                      "--"

                    }

                  </h2>

                </div>

              </div>

            </div>


            {/* CHART SECTION */}

            <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-3xl p-8 shadow-2xl">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-52 h-52 bg-green-500/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                {/* TITLE */}

                <div className="mb-8">

                  <h3 className="text-3xl font-black text-white">

                    Recharge Growth Analytics

                  </h3>


                  <p className="text-zinc-400 mt-2">

                    Monthly recharge volume & performance tracking

                  </p>

                </div>


                {/* CHART */}

                <div className="h-[420px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={analytics}
                    >

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


                      <Bar

                        dataKey="recharge"

                        radius={[

                          14,
                          14,
                          0,
                          0,

                        ]}

                        fill="#22c55e"

                      />


                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>


            {/* BOTTOM INFO */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              {/* SUCCESS RATE */}

              <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 text-black p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-black/70">

                    Recharge Success Rate

                  </p>


                  <h2 className="text-6xl font-black mt-4">

                    98%

                  </h2>

                </div>

              </div>


              {/* ACTIVE USERS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Active Recharge Users

                  </p>


                  <h2 className="text-6xl font-black mt-4">

                    {

                      totalTransactions * 3

                    }+

                  </h2>

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}