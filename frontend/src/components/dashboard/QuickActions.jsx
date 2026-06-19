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


export default function QuickActions() {

  const router =
    useRouter();


  const [
    walletBalance,
    setWalletBalance
  ] = useState(0);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH USER DATA
  ======================================== */

  const fetchUserData =
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

            `/wallet/${userId}`

          );


        if (res.data.success) {

          setWalletBalance(

            res.data.wallet.balance || 0

          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchUserData();

  }, []);


  /* ========================================
     ACTION BUTTONS
  ======================================== */

  const actions = [

    {

      title:
        "Add Money",

      description:
        "Top up your wallet instantly",

      icon:
        "💰",

      gradient:
        "from-black to-zinc-800",

      route:
        "/dashboard/wallet",

    },

    {

      title:
        "Recharge",

      description:
        "Mobile, DTH & FASTag recharge",

      icon:
        "📱",

      gradient:
        "from-cyan-500 to-blue-600",

      route:
        "/dashboard/recharge",

    },

    {

      title:
        "Coupons",

      description:
        "Apply cashback offers",

      icon:
        "🎁",

      gradient:
        "from-green-500 to-emerald-600",

      route:
        "/dashboard/coupons",

    },

    {

      title:
        "Referral",

      description:
        "Invite friends & earn rewards",

      icon:
        "👥",

      gradient:
        "from-purple-500 to-fuchsia-600",

      route:
        "/dashboard/referrals",

    },

    {

      title:
        "Loan Apply",

      description:
        "Apply for instant loans",

      icon:
        "🏦",

      gradient:
        "from-yellow-400 to-orange-500",

      route:
        "/dashboard/apply-loan",

    },

    {

      title:
        "Transactions",

      description:
        "View payment history",

      icon:
        "📊",

      gradient:
        "from-red-500 to-rose-600",

      route:
        "/dashboard/transactions",

    },

  ];


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-black text-black dark:text-white">

            Quick Actions

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Smart shortcuts for faster finance management ⚡

          </p>

        </div>


        {/* WALLET */}

        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 py-4 rounded-3xl shadow-xl min-w-[260px]">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 blur-3xl rounded-full" />


          <div className="relative z-10">

            <p className="text-white/80 text-sm">

              Wallet Balance

            </p>


            <h2 className="text-4xl font-black mt-2">

              {

                loading

                  ? "..."

                  : `₹${

                      Number(

                        walletBalance

                      ).toLocaleString()

                    }`

              }

            </h2>

          </div>

        </div>

      </div>


      {/* ACTION GRID */}

      {

        loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {

              [1, 2, 3, 4, 5, 6].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-52 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {

              actions.map(

                (action, index) => (

                  <button

                    key={index}

                    onClick={() =>
                      router.push(
                        action.route
                      )
                    }

                    className={`group relative overflow-hidden bg-gradient-to-br ${

                      action.gradient

                    } text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.03] transition-all duration-300 text-left`}

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                    <div className="relative z-10">

                      {/* ICON */}

                      <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl shadow-xl mb-6 group-hover:scale-110 transition-all duration-300">

                        {

                          action.icon

                        }

                      </div>


                      {/* TITLE */}

                      <h3 className="text-2xl font-black">

                        {

                          action.title

                        }

                      </h3>


                      {/* DESCRIPTION */}

                      <p className="text-white/80 mt-3 leading-relaxed">

                        {

                          action.description

                        }

                      </p>


                      {/* ACTION */}

                      <div className="flex items-center gap-2 mt-6 font-semibold">

                        Open

                        <span className="group-hover:translate-x-2 transition-all duration-300">

                          →

                        </span>

                      </div>

                    </div>

                  </button>

                )

              )

            }

          </div>

        )

      }


      {/* BOTTOM INFO */}

      <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-8 rounded-3xl shadow-2xl">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />


        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          {/* LEFT */}

          <div>

            <p className="text-zinc-400 text-lg">

              Smart Finance Dashboard

            </p>


            <h2 className="text-5xl font-black mt-4">

              All Services

              <span className="text-cyan-400">

                {" "}One Place

              </span>

            </h2>


            <p className="text-zinc-500 mt-4 max-w-2xl leading-relaxed">

              Access wallet, recharge, referrals, cashback offers, transactions & loan services instantly with a premium fintech experience.

            </p>

          </div>


          {/* RIGHT */}

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl min-w-[170px]">

              <p className="text-zinc-400">

                Active Services

              </p>


              <h2 className="text-4xl font-black mt-3 text-cyan-400">

                12+

              </h2>

            </div>


            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl min-w-[170px]">

              <p className="text-zinc-400">

                Secure Payments

              </p>


              <h2 className="text-4xl font-black mt-3 text-green-400">

                100%

              </h2>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}