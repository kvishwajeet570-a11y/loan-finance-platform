"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function Leaderboard() {

  const [
    leaders,
    setLeaders
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH LEADERBOARD
  ======================================== */

  const fetchLeaderboard =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/loan/all"

          );


        if (res.data.success) {

          const loans =
            res.data.loans;


          /* ========================================
             GROUP USERS
          ======================================== */

          const groupedUsers = {};


          loans.forEach(

            (loan) => {

              if (

                loan.status === "approved"

              ) {

                if (

                  groupedUsers[loan.fullName]

                ) {

                  groupedUsers[loan.fullName] +=

                    Number(

                      loan.amount

                    );

                } else {

                  groupedUsers[loan.fullName] =

                    Number(

                      loan.amount

                    );

                }

              }

            }

          );


          /* ========================================
             CONVERT ARRAY
          ======================================== */

          const leaderboardData =

            Object.entries(

              groupedUsers

            )

              .map(

                ([name, amount]) => ({

                  name,

                  amount,

                })

              )

              .sort(

                (a, b) =>

                  b.amount - a.amount

              );


          setLeaders(

            leaderboardData

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch leaderboard"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchLeaderboard();

  }, []);


  /* ========================================
     GET MEDAL
  ======================================== */

  const getMedal =
    (index) => {

      if (index === 0) {

        return "🥇";

      }

      if (index === 1) {

        return "🥈";

      }

      if (index === 2) {

        return "🥉";

      }

      return "🏅";

    };


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Leaderboard

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Top performing loan leaders 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          Top Rankings

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-5">

            {

              [1, 2, 3, 4].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-28 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : leaders.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Leaderboard Data

            </h3>

            <p className="text-zinc-500 mt-2">

              Approved loan rankings will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {

              leaders.map(

                (leader, index) => (

                  <div

                    key={index}

                    className={`relative overflow-hidden p-6 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.01] ${

                      index === 0

                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black"

                        : index === 1

                        ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-black"

                        : index === 2

                        ? "bg-gradient-to-br from-amber-700 to-yellow-800 text-white"

                        : "bg-gradient-to-br from-black to-zinc-800 text-white"

                    }`}

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


                    <div className="flex items-center justify-between">

                      {/* LEFT */}

                      <div className="flex items-center gap-5">

                        {/* RANK */}

                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold ${

                          index <= 2

                            ? "bg-white/20"

                            : "bg-white/10"

                        }`}>

                          {

                            getMedal(index)

                          }

                        </div>


                        {/* USER */}

                        <div>

                          <h3 className="text-2xl font-bold">

                            {

                              leader.name

                            }

                          </h3>


                          <p className={`mt-2 ${

                            index <= 1

                              ? "text-black/70"

                              : "text-zinc-300"

                          }`}>

                            Rank #

                            {

                              index + 1

                            }

                          </p>

                        </div>

                      </div>


                      {/* AMOUNT */}

                      <div className="text-right">

                        <p className={`text-sm ${

                          index <= 1

                            ? "text-black/70"

                            : "text-zinc-400"

                        }`}>

                          Approved Loan Volume

                        </p>


                        <h2 className="text-4xl font-black mt-2">

                          ₹{

                            Number(

                              leader.amount

                            ).toLocaleString()

                          }

                        </h2>

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

  );

}