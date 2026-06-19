"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function AdminAnalytics() {

  const [
    analytics,
    setAnalytics
  ] = useState({

    totalUsers: 0,

    totalLoans: 0,

    approvedLoans: 0,

    pendingLoans: 0,

    rejectedLoans: 0,

    totalTransactions: 0,

    totalRecharge: 0,

    totalWalletBalance: 0,

    totalRevenue: 0,

    totalReferrals: 0,

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

            "/analytics/dashboard"

          );


        if (res.data.success) {

          setAnalytics(

            res.data.analytics

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to load analytics"

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


  /* ========================================
     CARD DATA
  ======================================== */

  const cards = [

    {

      title:
        "Total Users",

      value:
        analytics.totalUsers,

      icon:
        "👥",

    },

    {

      title:
        "Total Revenue",

      value:
        `₹${analytics.totalRevenue.toLocaleString()}`,

      icon:
        "💰",

    },

    {

      title:
        "Approved Loans",

      value:
        analytics.approvedLoans,

      icon:
        "✅",

    },

    {

      title:
        "Pending Loans",

      value:
        analytics.pendingLoans,

      icon:
        "⏳",

    },

    {

      title:
        "Rejected Loans",

      value:
        analytics.rejectedLoans,

      icon:
        "❌",

    },

    {

      title:
        "Wallet Balance",

      value:
        `₹${analytics.totalWalletBalance.toLocaleString()}`,

      icon:
        "🏦",

    },

  ];


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Admin Analytics

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Real-time business insights

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          Live Data

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {

              [1, 2, 3, 4, 5, 6].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-36 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {

              cards.map(

                (

                  card,

                  index

                ) => (

                  <div

                    key={index}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300"

                  >

                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />

                    <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl mb-5">

                      {
                        card.icon
                      }

                    </div>

                    <h3 className="text-zinc-300 text-sm font-medium">

                      {
                        card.title
                      }

                    </h3>

                    <p className="text-3xl font-bold mt-3">

                      {
                        card.value
                      }

                    </p>

                  </div>

                )

              )

            }

          </div>

        )

      }

    </div>

  );

}