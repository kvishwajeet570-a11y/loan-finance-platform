"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ReferralHistory() {

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    referrals,
    setReferrals
  ] = useState([]);


  const [
    filter,
    setFilter
  ] = useState("all");


  const [
    totalRewards,
    setTotalRewards
  ] = useState(0);


  /* ========================================
     FETCH REFERRAL HISTORY
  ======================================== */

  const fetchReferralHistory =
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

            `/referral/history/${userId}`

          );


        if (res.data.success) {

          setReferrals(

            res.data.history

          );


          /* ========================================
             TOTAL REWARDS
          ======================================== */

          const rewards =
            res.data.history.reduce(

              (acc, item) =>

                acc +

                Number(

                  item.reward || 0

                ),

              0

            );


          setTotalRewards(

            rewards

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch referral history"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchReferralHistory();

  }, []);


  /* ========================================
     FILTER REFERRALS
  ======================================== */

  const filteredReferrals =

    filter === "all"

      ? referrals

      : referrals.filter(

          (item) =>

            item.status === filter

        );


  /* ========================================
     STATUS STYLE
  ======================================== */

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "completed":

          return {

            bg:
              "bg-green-500/10",

            text:
              "text-green-400",

            border:
              "border-green-500/20",

            icon:
              "✅",

          };

        case "pending":

          return {

            bg:
              "bg-yellow-500/10",

            text:
              "text-yellow-400",

            border:
              "border-yellow-500/20",

            icon:
              "⏳",

          };

        default:

          return {

            bg:
              "bg-zinc-500/10",

            text:
              "text-zinc-400",

            border:
              "border-zinc-500/20",

            icon:
              "⚡",

          };

      }

    };


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Referral History

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Track all referral joins & reward earnings 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          {

            filteredReferrals.length

          } Referrals

        </div>

      </div>


      {/* TOP STATS */}

      {

        !loading && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* TOTAL REFERRALS */}

            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                <p className="text-white/80">

                  Total Referrals

                </p>


                <h2 className="text-5xl font-black mt-4">

                  {

                    referrals.length

                  }

                </h2>

              </div>

            </div>


            {/* TOTAL REWARDS */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                <p className="text-white/80">

                  Total Rewards

                </p>


                <h2 className="text-5xl font-black mt-4">

                  ₹{

                    Number(

                      totalRewards

                    ).toLocaleString()

                  }

                </h2>

              </div>

            </div>


            {/* SUCCESS RATE */}

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <div className="relative z-10">

                <p className="text-white/80">

                  Successful Referrals

                </p>


                <h2 className="text-5xl font-black mt-4">

                  {

                    referrals.filter(

                      (item) =>

                        item.status === "completed"

                    ).length

                  }

                </h2>

              </div>

            </div>

          </div>

        )

      }


      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-8">

        {

          [

            "all",

            "completed",

            "pending",

          ].map(

            (status) => (

              <button

                key={status}

                onClick={() =>
                  setFilter(
                    status
                  )
                }

                className={`px-5 py-3 rounded-2xl font-semibold capitalize transition-all duration-300 ${

                  filter === status

                    ? "bg-black text-white"

                    : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"

                }`}

              >

                {

                  status

                }

              </button>

            )

          )

        }

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-5">

            {

              [1, 2, 3].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : filteredReferrals.length === 0 ? (

          <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white rounded-3xl p-10 text-center shadow-2xl">

            <div className="absolute top-0 right-0 w-52 h-52 bg-purple-500/20 blur-3xl rounded-full" />


            <div className="relative z-10">

              <div className="text-7xl mb-6">

                👥

              </div>


              <h3 className="text-3xl font-black">

                No Referral History

              </h3>


              <p className="text-zinc-400 mt-4 max-w-xl mx-auto">

                Your successful referrals & earned rewards will appear here.

              </p>

            </div>

          </div>

        ) : (

          <div className="space-y-6">

            {

              filteredReferrals.map(

                (item) => {

                  const statusStyle =
                    getStatusStyle(

                      item.status

                    );


                  return (

                    <div

                      key={item.id}

                      className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300"

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />


                      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                        {/* LEFT */}

                        <div className="flex items-start gap-5">

                          {/* ICON */}

                          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-3xl shadow-xl">

                            👤

                          </div>


                          {/* DETAILS */}

                          <div>

                            <h3 className="text-2xl font-black">

                              {

                                item.name

                              }

                            </h3>


                            <p className="text-zinc-400 mt-3">

                              Joined using your referral code

                            </p>


                            <div className="flex flex-wrap items-center gap-4 mt-5">

                              {/* STATUS */}

                              <div className={`px-4 py-2 rounded-2xl border text-sm font-semibold capitalize ${

                                statusStyle.bg

                              } ${

                                statusStyle.text

                              } ${

                                statusStyle.border

                              }`}>

                                {

                                  statusStyle.icon

                                }

                                {" "}

                                {

                                  item.status

                                }

                              </div>


                              {/* DATE */}

                              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-sm text-zinc-300">

                                📅 {

                                  new Date(

                                    item.createdAt

                                  ).toLocaleDateString()

                                }

                              </div>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="text-right">

                          <h2 className="text-5xl font-black text-green-400">

                            + ₹{

                              Number(

                                item.reward

                              ).toLocaleString()

                            }

                          </h2>


                          <p className="text-zinc-400 mt-3">

                            Referral Reward

                          </p>

                        </div>

                      </div>

                    </div>

                  );

                }

              )

            }

          </div>

        )

      }

    </div>

  );

}