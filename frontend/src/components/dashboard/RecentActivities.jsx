"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function RecentActivities() {

  const [
    activities,
    setActivities
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    activeFilter,
    setActiveFilter
  ] = useState("all");


  /* ========================================
     FETCH ACTIVITIES
  ======================================== */

  const fetchActivities =
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

            `/activity/user/${userId}`

          );


        if (res.data.success) {

          setActivities(

            res.data.activities

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch activities"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchActivities();

  }, []);


  /* ========================================
     FILTER ACTIVITIES
  ======================================== */

  const filteredActivities =

    activeFilter === "all"

      ? activities

      : activities.filter(

          (activity) =>

            activity.type === activeFilter

        );


  /* ========================================
     GET STYLE
  ======================================== */

  const getActivityStyle =
    (type) => {

      switch (type) {

        case "wallet":

          return {

            gradient:
              "from-green-500 to-emerald-600",

            icon:
              "💰",

            amountColor:
              "text-green-400",

          };

        case "recharge":

          return {

            gradient:
              "from-red-500 to-rose-600",

            icon:
              "📱",

            amountColor:
              "text-red-400",

          };

        case "cashback":

          return {

            gradient:
              "from-cyan-500 to-blue-600",

            icon:
              "🎁",

            amountColor:
              "text-cyan-400",

          };

        case "loan":

          return {

            gradient:
              "from-purple-500 to-fuchsia-600",

            icon:
              "🏦",

            amountColor:
              "text-purple-400",

          };

        default:

          return {

            gradient:
              "from-zinc-700 to-zinc-900",

            icon:
              "⚡",

            amountColor:
              "text-white",

          };

      }

    };


  /* ========================================
     TOTAL CALCULATIONS
  ======================================== */

  const totalCredit =
    activities

      .filter(

        (item) =>

          item.transactionType === "credit"

      )

      .reduce(

        (acc, item) =>

          acc +

          Number(

            item.amount || 0

          ),

        0

      );


  const totalDebit =
    activities

      .filter(

        (item) =>

          item.transactionType === "debit"

      )

      .reduce(

        (acc, item) =>

          acc +

          Number(

            item.amount || 0

          ),

        0

      );


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-black text-black dark:text-white">

            Recent Activities

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time transaction & activity history ⚡

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold">

          {

            filteredActivities.length

          } Activities

        </div>

      </div>


      {/* TOP CARDS */}

      {

        !loading && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* CREDIT */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Total Credit

              </p>


              <h2 className="text-5xl font-black mt-4">

                ₹{

                  Number(

                    totalCredit

                  ).toLocaleString()

                }

              </h2>

            </div>


            {/* DEBIT */}

            <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 text-white p-6 rounded-3xl shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Total Debit

              </p>


              <h2 className="text-5xl font-black mt-4">

                ₹{

                  Number(

                    totalDebit

                  ).toLocaleString()

                }

              </h2>

            </div>

          </div>

        )

      }


      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-8">

        {

          [

            "all",

            "wallet",

            "recharge",

            "cashback",

            "loan",

          ].map(

            (filter) => (

              <button

                key={filter}

                onClick={() =>
                  setActiveFilter(
                    filter
                  )
                }

                className={`px-5 py-3 rounded-2xl font-semibold capitalize transition-all duration-300 ${

                  activeFilter === filter

                    ? "bg-black text-white"

                    : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"

                }`}

              >

                {

                  filter

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

                    className="animate-pulse h-36 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : filteredActivities.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Activities Found

            </h3>

            <p className="text-zinc-500 mt-2">

              Your recent transactions will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {

              filteredActivities.map(

                (activity) => {

                  const style =
                    getActivityStyle(

                      activity.type

                    );


                  return (

                    <div

                      key={activity.id}

                      className={`relative overflow-hidden bg-gradient-to-br ${

                        style.gradient

                      } text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300`}

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


                      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                        {/* LEFT */}

                        <div className="flex items-start gap-5">

                          {/* ICON */}

                          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl shadow-xl">

                            {

                              style.icon

                            }

                          </div>


                          {/* CONTENT */}

                          <div>

                            <h3 className="text-2xl font-black">

                              {

                                activity.title

                              }

                            </h3>


                            <p className="text-white/80 mt-3 leading-relaxed max-w-2xl">

                              {

                                activity.description

                              }

                            </p>


                            <div className="flex flex-wrap items-center gap-4 mt-5">

                              <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm font-semibold capitalize">

                                {

                                  activity.type

                                }

                              </span>


                              <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm font-semibold capitalize">

                                {

                                  activity.status

                                }

                              </span>


                              <span className="text-white/70 text-sm">

                                📅 {

                                  new Date(

                                    activity.createdAt

                                  ).toLocaleString()

                                }

                              </span>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="text-right">

                          <h2 className={`text-5xl font-black ${

                            style.amountColor

                          }`}>

                            {

                              activity.transactionType === "credit"

                                ? "+"

                                : "-"

                            }

                            ₹{

                              Number(

                                activity.amount

                              ).toLocaleString()

                            }

                          </h2>


                          <p className="text-white/70 mt-3">

                            Transaction Amount

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