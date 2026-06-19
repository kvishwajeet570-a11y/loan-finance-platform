"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function RechargeCard() {

  const router =
    useRouter();


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    stats,
    setStats
  ] = useState({

    totalRecharge: 0,

    cashback: 0,

    totalTransactions: 0,

  });


  /* ========================================
     FETCH RECHARGE STATS
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

            totalRecharge:
              res.data.stats.totalRecharge || 0,

            cashback:
              res.data.stats.cashback || 0,

            totalTransactions:
              res.data.stats.totalTransactions || 0,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch recharge stats"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchRechargeStats();

  }, []);


  return (

    <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white rounded-3xl shadow-2xl p-8">

      {/* GLOW EFFECT */}

      <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 blur-3xl rounded-full" />


      {/* HEADER */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

        {/* LEFT SECTION */}

        <div className="max-w-3xl">

          {/* BADGE */}

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold mb-6">

            ⚡ Instant Recharge Services

          </div>


          {/* TITLE */}

          <h2 className="text-5xl font-black leading-tight">

            Recharge

            <span className="text-yellow-300">

              {" "}Anytime

            </span>

            <br />

            Anywhere

          </h2>


          {/* DESCRIPTION */}

          <p className="mt-6 text-lg text-white/90 leading-relaxed">

            Recharge Mobile, DTH, FASTag & utility services instantly with secure payments, cashback rewards & lightning-fast processing 🚀

          </p>


          {/* FEATURES */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">

              <div className="text-3xl mb-3">

                📱

              </div>

              <h3 className="font-bold">

                Mobile Recharge

              </h3>
            </div>


            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">

              <div className="text-3xl mb-3">

                📺

              </div>

              <h3 className="font-bold">

                DTH Recharge

              </h3>
            </div>


            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">

              <div className="text-3xl mb-3">

                🚗

              </div>

              <h3 className="font-bold">

                FASTag Recharge

              </h3>
            </div>

          </div>

        </div>


        {/* RIGHT SECTION */}

        <div className="w-full xl:w-[420px] space-y-5">

          {/* TOTAL RECHARGE */}

          <div className="bg-white text-black p-6 rounded-3xl shadow-2xl">

            <p className="text-zinc-500 font-medium">

              Total Recharge

            </p>


            <h2 className="text-5xl font-black mt-4">

              {

                loading

                  ? "..."

                  : `₹${

                      Number(

                        stats.totalRecharge

                      ).toLocaleString()

                    }`

              }

            </h2>

          </div>


          {/* STATS */}

          <div className="grid grid-cols-2 gap-5">

            {/* CASHBACK */}

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Cashback

              </p>


              <h3 className="text-3xl font-black mt-3 text-yellow-300">

                ₹{

                  Number(

                    stats.cashback

                  ).toLocaleString()

                }

              </h3>

            </div>


            {/* TRANSACTIONS */}

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Transactions

              </p>


              <h3 className="text-3xl font-black mt-3">

                {

                  stats.totalTransactions

                }

              </h3>

            </div>

          </div>


          {/* ACTION BUTTONS */}

          <div className="grid grid-cols-2 gap-4">

            {/* RECHARGE */}

            <button

              onClick={() =>
                router.push(
                  "/dashboard/recharge"
                )
              }

              className="bg-white hover:bg-zinc-200 text-black py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

            >

              Recharge Now

            </button>


            {/* HISTORY */}

            <button

              onClick={() =>
                router.push(
                  "/dashboard/recharge-history"
                )
              }

              className="bg-black/30 hover:bg-black/40 backdrop-blur-xl border border-white/10 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300"

            >

              View History

            </button>

          </div>

        </div>

      </div>


      {/* BOTTOM BANNER */}

      <div className="relative z-10 mt-10 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        {/* LEFT */}

        <div>

          <h3 className="text-3xl font-black">

            Get Cashback On Every Recharge 🎁

          </h3>


          <p className="text-white/80 mt-3 max-w-2xl leading-relaxed">

            Earn exciting cashback rewards & referral bonuses on every successful recharge transaction.

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={() =>
            router.push(
              "/dashboard/coupons"
            )
          }

          className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

        >

          Claim Offers

        </button>

      </div>

    </div>

  );

}