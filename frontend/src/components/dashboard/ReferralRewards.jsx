"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ReferralRewards() {

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    rewards,
    setRewards
  ] = useState({

    totalRewards: 0,

    pendingRewards: 0,

    claimedRewards: 0,

    totalReferrals: 0,

    bonusRewards: 0,

  });


  const [
    recentRewards,
    setRecentRewards
  ] = useState([]);


  /* ========================================
     FETCH REWARDS
  ======================================== */

  const fetchRewards =
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

            `/referral/rewards/${userId}`

          );


        if (res.data.success) {

          setRewards({

            totalRewards:
              res.data.rewards.totalRewards || 0,

            pendingRewards:
              res.data.rewards.pendingRewards || 0,

            claimedRewards:
              res.data.rewards.claimedRewards || 0,

            totalReferrals:
              res.data.rewards.totalReferrals || 0,

            bonusRewards:
              res.data.rewards.bonusRewards || 0,

          });


          setRecentRewards(

            res.data.recentRewards || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch rewards"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     CLAIM REWARD
  ======================================== */

  const claimRewards =
    async () => {

      try {

        if (

          rewards.pendingRewards <= 0

        ) {

          toast.error(

            "No pending rewards available"

          );

          return;

        }


        const userId =
          localStorage.getItem("userId");


        const res =
          await api.post(

            "/referral/claim-rewards",

            {

              userId,

            }

          );


        if (res.data.success) {

          toast.success(

            "Rewards claimed successfully 🎉"

          );

          fetchRewards();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to claim rewards"

        );

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchRewards();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Referral Rewards

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Track your referral earnings & cashback rewards 🎁

          </p>

        </div>


        <button

          onClick={claimRewards}

          disabled={

            rewards.pendingRewards <= 0

          }

          className="bg-black hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl"

        >

          Claim Rewards

        </button>

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


            <div className="animate-pulse h-[400px] rounded-3xl bg-zinc-100 dark:bg-zinc-800" />

          </div>

        ) : (

          <>

            {/* MAIN REWARD CARD */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white rounded-3xl p-8 shadow-2xl">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 blur-3xl rounded-full" />


              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                {/* LEFT */}

                <div>

                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold mb-6">

                    💸 Reward Wallet

                  </div>


                  <h2 className="text-7xl font-black">

                    ₹{

                      Number(

                        rewards.totalRewards

                      ).toLocaleString()

                    }

                  </h2>


                  <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">

                    Total rewards earned from successful referrals, bonuses & cashback programs 🚀

                  </p>

                </div>


                {/* RIGHT */}

                <div className="grid grid-cols-2 gap-5 w-full xl:w-[420px]">

                  {/* PENDING */}

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                    <p className="text-white/70 text-sm">

                      Pending

                    </p>


                    <h3 className="text-4xl font-black mt-3 text-yellow-300">

                      ₹{

                        Number(

                          rewards.pendingRewards

                        ).toLocaleString()

                      }

                    </h3>

                  </div>


                  {/* CLAIMED */}

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                    <p className="text-white/70 text-sm">

                      Claimed

                    </p>


                    <h3 className="text-4xl font-black mt-3">

                      ₹{

                        Number(

                          rewards.claimedRewards

                        ).toLocaleString()

                      }

                    </h3>

                  </div>


                  {/* REFERRALS */}

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                    <p className="text-white/70 text-sm">

                      Referrals

                    </p>


                    <h3 className="text-4xl font-black mt-3">

                      {

                        rewards.totalReferrals

                      }

                    </h3>

                  </div>


                  {/* BONUS */}

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                    <p className="text-white/70 text-sm">

                      Bonus

                    </p>


                    <h3 className="text-4xl font-black mt-3 text-cyan-300">

                      ₹{

                        Number(

                          rewards.bonusRewards

                        ).toLocaleString()

                      }

                    </h3>

                  </div>

                </div>

              </div>

            </div>


            {/* RECENT REWARDS */}

            <div className="mt-8">

              <div className="flex items-center justify-between mb-6">

                <h3 className="text-3xl font-black text-black dark:text-white">

                  Recent Rewards

                </h3>


                <div className="bg-zinc-100 dark:bg-zinc-800 px-5 py-3 rounded-2xl text-sm font-semibold">

                  {

                    recentRewards.length

                  } Transactions

                </div>

              </div>


              {

                recentRewards.length === 0 ? (

                  <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white rounded-3xl p-10 text-center shadow-2xl">

                    <div className="absolute top-0 right-0 w-52 h-52 bg-green-500/20 blur-3xl rounded-full" />


                    <div className="relative z-10">

                      <div className="text-7xl mb-6">

                        🎁

                      </div>


                      <h3 className="text-3xl font-black">

                        No Rewards Yet

                      </h3>


                      <p className="text-zinc-400 mt-4">

                        Referral rewards will appear here

                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="space-y-6">

                    {

                      recentRewards.map(

                        (reward) => (

                          <div

                            key={reward.id}

                            className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300"

                          >

                            {/* GLOW */}

                            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 blur-3xl rounded-full" />


                            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                              {/* LEFT */}

                              <div className="flex items-start gap-5">

                                {/* ICON */}

                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-3xl shadow-xl">

                                  🎉

                                </div>


                                {/* DETAILS */}

                                <div>

                                  <h3 className="text-2xl font-black">

                                    {

                                      reward.title

                                    }

                                  </h3>


                                  <p className="text-zinc-400 mt-3 leading-relaxed">

                                    {

                                      reward.description

                                    }

                                  </p>


                                  <div className="flex flex-wrap items-center gap-4 mt-5">

                                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-2xl text-sm font-semibold">

                                      ✅ Completed

                                    </div>


                                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-sm text-zinc-300">

                                      📅 {

                                        new Date(

                                          reward.createdAt

                                        ).toLocaleDateString()

                                      }

                                    </div>

                                  </div>

                                </div>

                              </div>


                              {/* RIGHT */}

                              <div className="text-right">

                                <h2 className="text-6xl font-black text-green-400">

                                  + ₹{

                                    Number(

                                      reward.amount

                                    ).toLocaleString()

                                  }

                                </h2>


                                <p className="text-zinc-400 mt-3">

                                  Reward Earned

                                </p>

                              </div>

                            </div>

                          </div>

                        )

                      )

                    }

                  </div>

                )

              }

            </div>


            {/* BOTTOM BANNER */}

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-3xl p-8 mt-8 shadow-2xl">

              <div className="absolute top-0 right-0 w-52 h-52 bg-white/20 blur-3xl rounded-full" />


              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                {/* LEFT */}

                <div>

                  <h2 className="text-5xl font-black">

                    Earn More

                    <span className="text-yellow-300">

                      {" "}Rewards

                    </span>

                  </h2>


                  <p className="text-white/80 mt-5 max-w-2xl leading-relaxed text-lg">

                    Invite more friends and unlock exclusive referral bonuses & cashback offers 🎉

                  </p>

                </div>


                {/* RIGHT */}

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

                  <p className="text-white/70 text-sm">

                    Next Bonus Target

                  </p>


                  <h3 className="text-5xl font-black mt-4">

                    ₹10,000

                  </h3>


                  <div className="w-full h-4 bg-white/10 rounded-full mt-5 overflow-hidden">

                    <div

                      className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"

                      style={{

                        width: `${

                          Math.min(

                            (

                              rewards.totalRewards /

                              10000

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