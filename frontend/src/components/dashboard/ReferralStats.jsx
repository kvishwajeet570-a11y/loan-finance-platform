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


export default function ReferralStats() {

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    stats,
    setStats
  ] = useState({

    totalReferrals: 0,

    totalEarnings: 0,

    successfulReferrals: 0,

    pendingReferrals: 0,

    monthlyGrowth: 0,

    conversionRate: 0,

  });


  const [
    analytics,
    setAnalytics
  ] = useState([]);


  /* ========================================
     FETCH REFERRAL STATS
  ======================================== */

  const fetchReferralStats =
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

            `/referral/stats/${userId}`

          );


        if (res.data.success) {

          setStats({

            totalReferrals:
              res.data.stats.totalReferrals || 0,

            totalEarnings:
              res.data.stats.totalEarnings || 0,

            successfulReferrals:
              res.data.stats.successfulReferrals || 0,

            pendingReferrals:
              res.data.stats.pendingReferrals || 0,

            monthlyGrowth:
              res.data.stats.monthlyGrowth || 0,

            conversionRate:
              res.data.stats.conversionRate || 0,

          });


          setAnalytics(

            res.data.analytics || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch referral stats"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchReferralStats();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Referral Statistics

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time referral analytics & earnings dashboard 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          Live Referral Data

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

              {/* TOTAL REFERRALS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Total Referrals

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.totalReferrals

                    }

                  </h2>

                </div>

              </div>


              {/* TOTAL EARNINGS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Total Earnings

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        stats.totalEarnings

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>


              {/* SUCCESSFUL */}

              <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Successful Referrals

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.successfulReferrals

                    }

                  </h2>

                </div>

              </div>


              {/* CONVERSION */}

              <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 text-black p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-black/70">

                    Conversion Rate

                  </p>


                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.conversionRate

                    }%

                  </h2>

                </div>

              </div>

            </div>


            {/* MAIN ANALYTICS */}

            <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-3xl p-8 mt-8 shadow-2xl">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-52 h-52 bg-purple-500/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                {/* TITLE */}

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

                  <div>

                    <h3 className="text-3xl font-black text-white">

                      Referral Growth Analytics

                    </h3>


                    <p className="text-zinc-400 mt-2">

                      Monthly referral performance & earnings growth tracking

                    </p>

                  </div>


                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl">

                    📈 +

                    {

                      stats.monthlyGrowth

                    }%

                    Growth

                  </div>

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

                          id="colorReferral"

                          x1="0"

                          y1="0"

                          x2="0"

                          y2="1"

                        >

                          <stop

                            offset="5%"

                            stopColor="#a855f7"

                            stopOpacity={0.8}

                          />

                          <stop

                            offset="95%"

                            stopColor="#a855f7"

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

                        dataKey="referrals"

                        stroke="#a855f7"

                        fillOpacity={1}

                        fill="url(#colorReferral)"

                        strokeWidth={4}

                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>


            {/* EXTRA STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              {/* PENDING */}

              <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Pending Referrals

                  </p>


                  <h2 className="text-6xl font-black mt-4">

                    {

                      stats.pendingReferrals

                    }

                  </h2>


                  <p className="text-white/70 mt-4">

                    Waiting for verification & reward activation

                  </p>

                </div>

              </div>


              {/* BONUS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-white/80">

                    Average Reward Per Referral

                  </p>


                  <h2 className="text-6xl font-black mt-4">

                    ₹{

                      stats.totalReferrals > 0

                        ? Math.round(

                            stats.totalEarnings /

                            stats.totalReferrals

                          )

                        : 0

                    }

                  </h2>


                  <p className="text-white/70 mt-4">

                    Estimated average earnings from each referral

                  </p>

                </div>

              </div>

            </div>


            {/* BOTTOM BANNER */}

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-3xl p-8 mt-8 shadow-2xl">

              <div className="absolute top-0 right-0 w-52 h-52 bg-white/20 blur-3xl rounded-full" />


              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                {/* LEFT */}

                <div>

                  <h2 className="text-5xl font-black">

                    Grow Faster

                    <span className="text-yellow-300">

                      {" "}Earn Bigger

                    </span>

                  </h2>


                  <p className="text-white/80 mt-5 max-w-2xl leading-relaxed text-lg">

                    Share your referral code with more friends and unlock premium cashback rewards & bonus incentives 🎉

                  </p>

                </div>


                {/* RIGHT */}

                <div className="grid grid-cols-2 gap-5">

                  {/* TOP GOAL */}

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                    <p className="text-white/70 text-sm">

                      Next Goal

                    </p>


                    <h3 className="text-4xl font-black mt-3">

                      50+

                    </h3>

                  </div>


                  {/* BONUS */}

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                    <p className="text-white/70 text-sm">

                      Bonus Reward

                    </p>


                    <h3 className="text-4xl font-black mt-3 text-yellow-300">

                      ₹25K

                    </h3>

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