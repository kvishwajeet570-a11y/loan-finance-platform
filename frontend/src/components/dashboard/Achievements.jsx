"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function Achievements() {

  const [
    achievements,
    setAchievements
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH ACHIEVEMENTS
  ======================================== */

  const fetchAchievements =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/achievement"

          );


        if (res.data.success) {

          setAchievements(

            res.data.achievements

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch achievements"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchAchievements();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Achievements

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Your latest rewards & milestones

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            achievements.length
          } Total

        </div>

      </div>


      {/* LOADING */}

      {

        loading && (

          <div className="space-y-4">

            {

              [1, 2, 3].map((item) => (

                <div

                  key={item}

                  className="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-28 rounded-2xl"

                />

              ))

            }

          </div>

        )

      }


      {/* EMPTY */}

      {

        !loading &&

        achievements.length === 0 && (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-xl font-semibold text-black dark:text-white">

              No Achievements Yet

            </h3>

            <p className="text-zinc-500 mt-2">

              Complete tasks & earn rewards

            </p>

          </div>

        )

      }


      {/* ACHIEVEMENTS */}

      {

        !loading &&

        achievements.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {

              achievements.map(

                (achievement) => (

                  <div

                    key={achievement.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300"

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />


                    {/* ICON */}

                    <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl mb-5">

                      🏆

                    </div>


                    {/* TITLE */}

                    <h3 className="text-2xl font-bold">

                      {
                        achievement.title
                      }

                    </h3>


                    {/* DESCRIPTION */}

                    <p className="text-zinc-300 mt-3 leading-relaxed">

                      {
                        achievement.description
                      }

                    </p>


                    {/* DATE */}

                    <p className="text-zinc-400 text-sm mt-5">

                      {

                        new Date(

                          achievement.createdAt

                        ).toLocaleDateString()

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