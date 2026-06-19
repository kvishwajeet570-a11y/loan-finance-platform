"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function CommissionCard() {

  const [
    commission,
    setCommission
  ] = useState(0);


  const [
    monthlyCommission,
    setMonthlyCommission
  ] = useState(0);


  const [
    totalReferrals,
    setTotalReferrals
  ] = useState(0);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH COMMISSION
  ======================================== */

  const fetchCommission =
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

            `/commission?userId=${userId}`

          );


        if (res.data.success) {

          setCommission(

            res.data.totalCommission || 0

          );

          setMonthlyCommission(

            res.data.monthlyCommission || 0

          );

          setTotalReferrals(

            res.data.totalReferrals || 0

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch commission"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchCommission();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Commission Earnings

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Your referral & commission analytics

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          Live Data

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-5">

            <div className="animate-pulse h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="animate-pulse h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

              <div className="animate-pulse h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

            </div>

          </div>

        ) : (

          <>

            {/* MAIN CARD */}

            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 p-8 rounded-3xl text-white shadow-2xl">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


              <p className="text-lg text-white/80">

                Total Earnings

              </p>


              <h1 className="text-5xl md:text-6xl font-bold mt-4">

                ₹{

                  Number(

                    commission

                  ).toLocaleString()

                }

              </h1>


              <p className="mt-4 text-white/80">

                Commission earned from referrals & rewards

              </p>

            </div>


            {/* STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* MONTHLY */}

              <div className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 blur-3xl rounded-full" />


                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">

                  💰

                </div>


                <p className="text-zinc-400">

                  Monthly Earnings

                </p>


                <h2 className="text-4xl font-bold text-green-400 mt-3">

                  ₹{

                    Number(

                      monthlyCommission

                    ).toLocaleString()

                  }

                </h2>

              </div>


              {/* REFERRALS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />


                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">

                  👥

                </div>


                <p className="text-zinc-400">

                  Total Referrals

                </p>


                <h2 className="text-4xl font-bold text-cyan-400 mt-3">

                  {

                    totalReferrals

                  }

                </h2>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}