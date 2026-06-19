"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ReferralLeaderboard() {

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    leaderboard,
    setLeaderboard
  ] = useState([]);


  const [
    currentUser,
    setCurrentUser
  ] = useState(null);


  /* ========================================
     FETCH LEADERBOARD
  ======================================== */

  const fetchLeaderboard =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/referral/leaderboard"

          );


        if (res.data.success) {

          setLeaderboard(

            res.data.leaderboard

          );


          /* ========================================
             CURRENT USER
          ======================================== */

          const userId =
            localStorage.getItem("userId");


          const current =
            res.data.leaderboard.find(

              (item) =>

                item.userId === userId

            );


          setCurrentUser(current);

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
     GET RANK ICON
  ======================================== */

  const getRankIcon =
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


  /* ========================================
     GET CARD STYLE
  ======================================== */

  const getCardStyle =
    (index) => {

      if (index === 0) {

        return "from-yellow-400 to-orange-500";

      }

      if (index === 1) {

        return "from-zinc-400 to-zinc-600";

      }

      if (index === 2) {

        return "from-amber-700 to-orange-900";

      }

      return "from-black via-zinc-900 to-zinc-800";

    };


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Referral Leaderboard

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Top earners & highest referral performers 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          Top Performers

        </div>

      </div>


      {/* CURRENT USER RANK */}

      {

        currentUser && !loading && (

          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl mb-8">

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              <div>

                <p className="text-white/80">

                  Your Current Ranking

                </p>


                <h2 className="text-6xl font-black mt-4">

                  #{

                    currentUser.rank

                  }

                </h2>

              </div>


              <div className="grid grid-cols-2 gap-5">

                {/* REFERRALS */}

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                  <p className="text-white/70 text-sm">

                    Referrals

                  </p>


                  <h3 className="text-4xl font-black mt-3">

                    {

                      currentUser.totalReferrals

                    }

                  </h3>

                </div>


                {/* EARNINGS */}

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                  <p className="text-white/70 text-sm">

                    Earnings

                  </p>


                  <h3 className="text-4xl font-black mt-3 text-yellow-300">

                    ₹{

                      Number(

                        currentUser.totalEarnings

                      ).toLocaleString()

                    }

                  </h3>

                </div>

              </div>

            </div>

          </div>

        )

      }


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-6">

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

        ) : leaderboard.length === 0 ? (

          <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white rounded-3xl p-10 text-center shadow-2xl">

            <div className="absolute top-0 right-0 w-52 h-52 bg-purple-500/20 blur-3xl rounded-full" />


            <div className="relative z-10">

              <div className="text-7xl mb-6">

                🏆

              </div>


              <h3 className="text-3xl font-black">

                No Leaderboard Data

              </h3>


              <p className="text-zinc-400 mt-4">

                Referral rankings will appear here

              </p>

            </div>

          </div>

        ) : (

          <div className="space-y-6">

            {

              leaderboard.map(

                (user, index) => (

                  <div

                    key={user.userId}

                    className={`relative overflow-hidden bg-gradient-to-br ${

                      getCardStyle(index)

                    } text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300`}

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                      {/* LEFT */}

                      <div className="flex items-center gap-5">

                        {/* RANK */}

                        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-4xl shadow-xl">

                          {

                            getRankIcon(index)

                          }

                        </div>


                        {/* DETAILS */}

                        <div>

                          <div className="flex items-center gap-3">

                            <h3 className="text-3xl font-black">

                              {

                                user.name

                              }

                            </h3>


                            {

                              currentUser?.userId === user.userId && (

                                <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm font-semibold">

                                  You

                                </span>

                              )

                            }

                          </div>


                          <p className="text-white/70 mt-3">

                            Rank #

                            {

                              index + 1

                            }

                            {" "}Referral Partner

                          </p>


                          <div className="flex flex-wrap items-center gap-4 mt-5">

                            {/* REFERRALS */}

                            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold">

                              👥 {

                                user.totalReferrals

                              } Referrals

                            </div>


                            {/* SUCCESS */}

                            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold">

                              ✅ {

                                user.successRate

                              }% Success

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div className="text-right">

                        <h2 className="text-6xl font-black text-yellow-300">

                          ₹{

                            Number(

                              user.totalEarnings

                            ).toLocaleString()

                          }

                        </h2>


                        <p className="text-white/70 mt-3">

                          Total Earnings

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


      {/* BOTTOM SECTION */}

      {

        !loading && leaderboard.length > 0 && (

          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-3xl p-8 mt-8 shadow-2xl">

            <div className="absolute top-0 right-0 w-52 h-52 bg-white/20 blur-3xl rounded-full" />


            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

              {/* LEFT */}

              <div>

                <h2 className="text-5xl font-black">

                  Become

                  <span className="text-yellow-300">

                    {" "}Top Leader

                  </span>

                </h2>


                <p className="text-white/80 mt-5 max-w-2xl leading-relaxed text-lg">

                  Invite more friends, increase your referral rewards & climb the leaderboard rankings faster 🚀

                </p>

              </div>


              {/* RIGHT */}

              <div className="grid grid-cols-2 gap-5">

                {/* TOP REWARD */}

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                  <p className="text-white/70 text-sm">

                    Top Reward

                  </p>


                  <h3 className="text-4xl font-black mt-3 text-yellow-300">

                    ₹{

                      Number(

                        leaderboard[0]?.totalEarnings || 0

                      ).toLocaleString()

                    }

                  </h3>

                </div>


                {/* ACTIVE USERS */}

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

                  <p className="text-white/70 text-sm">

                    Active Leaders

                  </p>


                  <h3 className="text-4xl font-black mt-3">

                    {

                      leaderboard.length

                    }

                  </h3>

                </div>

              </div>

            </div>

          </div>

        )

      }

    </div>

  );

}