"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function CareerCard() {

  const [
    jobs,
    setJobs
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    applyingId,
    setApplyingId
  ] = useState("");


  /* ========================================
     FETCH JOBS
  ======================================== */

  const fetchJobs =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/job/all"

          );


        if (res.data.success) {

          setJobs(

            res.data.jobs

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch careers"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     APPLY JOB
  ======================================== */

  const applyJob =
    async (jobId) => {

      try {

        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        setApplyingId(jobId);


        const res =
          await api.post(

            "/job/create",

            {

              userId,

              jobId,

            }

          );


        if (res.data.success) {

          toast.success(

            "Application submitted successfully"

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to apply"

        );

      } finally {

        setApplyingId("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchJobs();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Careers

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Join our fintech startup team 🚀

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            jobs.length
          } Openings

        </div>

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

        ) : jobs.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-10 text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Jobs Available

            </h3>

            <p className="text-zinc-500 mt-2">

              New openings will appear here

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {

              jobs.map(

                (job) => (

                  <div

                    key={job.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300"

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />


                    {/* TOP */}

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="text-2xl font-bold">

                          {
                            job.title
                          }

                        </h3>

                        <p className="text-zinc-300 mt-2">

                          {
                            job.department
                          }

                        </p>

                      </div>


                      <div className="bg-white/10 px-4 py-2 rounded-2xl text-sm">

                        {
                          job.type
                        }

                      </div>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="text-zinc-300 mt-6 leading-relaxed">

                      {
                        job.description
                      }

                    </p>


                    {/* SALARY */}

                    <div className="mt-6">

                      <p className="text-zinc-400 text-sm">

                        Salary Package

                      </p>

                      <h2 className="text-3xl font-bold text-green-400 mt-2">

                        ₹{
                          job.salary
                        }

                      </h2>

                    </div>


                    {/* LOCATION */}

                    <div className="mt-4 text-zinc-300">

                      📍 {
                        job.location
                      }

                    </div>


                    {/* BUTTON */}

                    <button

                      onClick={() =>
                        applyJob(
                          job.id
                        )
                      }

                      disabled={
                        applyingId === job.id
                      }

                      className="w-full mt-8 bg-white text-black hover:bg-zinc-200 py-4 rounded-2xl font-bold transition-all duration-300"

                    >

                      {

                        applyingId === job.id

                          ? "Applying..."

                          : "Apply Now"

                      }

                    </button>

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