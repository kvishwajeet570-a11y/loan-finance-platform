"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ProfileStats() {

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    stats,
    setStats
  ] = useState({

    totalLoans: 0,

    walletBalance: 0,

    cashbackEarned: 0,

    referrals: 0,

    approvedLoans: 0,

    pendingLoans: 0,

  });


  /* ========================================
     FETCH PROFILE STATS
  ======================================== */

  const fetchProfileStats =
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

            `/dashboard/profile-stats/${userId}`

          );


        if (res.data.success) {

          setStats({

            totalLoans:
              res.data.stats.totalLoans || 0,

            walletBalance:
              res.data.stats.walletBalance || 0,

            cashbackEarned:
              res.data.stats.cashbackEarned || 0,

            referrals:
              res.data.stats.referrals || 0,

            approvedLoans:
              res.data.stats.approvedLoans || 0,

            pendingLoans:
              res.data.stats.pendingLoans || 0,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch profile stats"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchProfileStats();

  }, []);


  /* ========================================
     STAT CARD
  ======================================== */

  const StatCard = ({
    title,
    value,
    icon,
    gradient,
    textColor,
    subtitle,
  }) => (

    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-2xl hover:scale-[1.03] transition-all duration-300`}>

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


      <div className="relative z-10">

        {/* TOP */}

        <div className="flex items-center justify-between">

          <div>

            <p className={`text-sm font-medium ${textColor}`}>

              {title}

            </p>


            <h2 className="text-5xl font-black mt-4 break-words">

              {value}

            </h2>

          </div>


          {/* ICON */}

          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-3xl shadow-xl">

            {icon}

          </div>

        </div>


        {/* SUBTITLE */}

        <p className={`mt-6 text-sm ${textColor}`}>

          {subtitle}

        </p>

      </div>

    </div>

  );


  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Profile Analytics

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time performance & finance insights 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          Live Dashboard

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {

              [1, 2, 3, 4].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <>

            {/* MAIN STATS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

              {/* TOTAL LOANS */}

              <StatCard

                title="Total Loans"

                value={

                  stats.totalLoans

                }

                icon="🏦"

                gradient="from-cyan-500 to-blue-600"

                textColor="text-white/80"

                subtitle="Overall loan applications"

              />


              {/* WALLET */}

              <StatCard

                title="Wallet Balance"

                value={`₹${

                  Number(

                    stats.walletBalance

                  ).toLocaleString()

                }`}

                icon="💰"

                gradient="from-green-500 to-emerald-600"

                textColor="text-white/80"

                subtitle="Available wallet funds"

              />


              {/* CASHBACK */}

              <StatCard

                title="Cashback Earned"

                value={`₹${

                  Number(

                    stats.cashbackEarned

                  ).toLocaleString()

                }`}

                icon="🎁"

                gradient="from-purple-500 to-fuchsia-600"

                textColor="text-white/80"

                subtitle="Total rewards & cashback"

              />


              {/* REFERRALS */}

              <StatCard

                title="Referrals"

                value={

                  stats.referrals

                }

                icon="👥"

                gradient="from-yellow-400 to-orange-500"

                textColor="text-black/70"

                subtitle="Friends invited successfully"

              />

            </div>


            {/* EXTRA ANALYTICS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* APPROVED */}

              <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-8 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-zinc-400 text-lg">

                    Approved Loans

                  </p>


                  <h2 className="text-6xl font-black mt-5 text-green-400">

                    {

                      stats.approvedLoans

                    }

                  </h2>


                  <div className="mt-6 w-full h-4 bg-white/10 rounded-full overflow-hidden">

                    <div

                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"

                      style={{

                        width: `${

                          stats.totalLoans > 0

                            ? (

                                stats.approvedLoans /

                                stats.totalLoans

                              ) * 100

                            : 0

                        }%`,

                      }}

                    />

                  </div>

                </div>

              </div>


              {/* PENDING */}

              <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-8 rounded-3xl shadow-2xl">

                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full" />


                <div className="relative z-10">

                  <p className="text-zinc-400 text-lg">

                    Pending Loans

                  </p>


                  <h2 className="text-6xl font-black mt-5 text-yellow-400">

                    {

                      stats.pendingLoans

                    }

                  </h2>


                  <div className="mt-6 w-full h-4 bg-white/10 rounded-full overflow-hidden">

                    <div

                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"

                      style={{

                        width: `${

                          stats.totalLoans > 0

                            ? (

                                stats.pendingLoans /

                                stats.totalLoans

                              ) * 100

                            : 0

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