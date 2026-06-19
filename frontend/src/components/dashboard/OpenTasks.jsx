"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function OpenTasks() {

  const [
    tasks,
    setTasks
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    activeFilter,
    setActiveFilter
  ] = useState("all");


  const [
    processingId,
    setProcessingId
  ] = useState("");


  /* ========================================
     FETCH TASKS
  ======================================== */

  const fetchTasks =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/task/open"

          );


        if (res.data.success) {

          setTasks(

            res.data.tasks

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch tasks"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     COMPLETE TASK
  ======================================== */

  const completeTask =
    async (taskId) => {

      try {

        setProcessingId(taskId);


        const res =
          await api.put(

            `/task/complete/${taskId}`

          );


        if (res.data.success) {

          toast.success(

            "Task completed successfully"

          );

          setTasks(

            tasks.map(

              (task) =>

                task.id === taskId

                  ? {

                      ...task,

                      status: "completed",

                    }

                  : task

            )

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to complete task"

        );

      } finally {

        setProcessingId("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchTasks();

  }, []);


  /* ========================================
     FILTER TASKS
  ======================================== */

  const filteredTasks =

    activeFilter === "all"

      ? tasks

      : tasks.filter(

          (task) =>

            task.priority === activeFilter

        );


  /* ========================================
     TASK STYLE
  ======================================== */

  const getTaskStyle =
    (priority) => {

      switch (priority) {

        case "high":

          return {

            bg:
              "from-red-500 to-rose-600",

            icon:
              "🔥",

          };

        case "medium":

          return {

            bg:
              "from-yellow-400 to-orange-500",

            icon:
              "⚡",

          };

        case "low":

          return {

            bg:
              "from-green-500 to-emerald-600",

            icon:
              "✅",

          };

        default:

          return {

            bg:
              "from-cyan-500 to-blue-600",

            icon:
              "📌",

          };

      }

    };


  /* ========================================
     STATS
  ======================================== */

  const completedTasks =
    tasks.filter(

      (task) =>

        task.status === "completed"

    ).length;


  const pendingTasks =
    tasks.filter(

      (task) =>

        task.status !== "completed"

    ).length;


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Open Tasks

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Manage pending verifications & follow-ups 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold">

          {

            filteredTasks.length

          } Active Tasks

        </div>

      </div>


      {/* TOP STATS */}

      {

        !loading && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* TOTAL */}

            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Total Tasks

              </p>


              <h2 className="text-5xl font-black mt-4">

                {

                  tasks.length

                }

              </h2>

            </div>


            {/* PENDING */}

            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 text-black p-6 rounded-3xl shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-black/70">

                Pending Tasks

              </p>


              <h2 className="text-5xl font-black mt-4">

                {

                  pendingTasks

                }

              </h2>

            </div>


            {/* COMPLETED */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Completed Tasks

              </p>


              <h2 className="text-5xl font-black mt-4">

                {

                  completedTasks

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

            "high",

            "medium",

            "low",

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

                    className="animate-pulse h-52 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : filteredTasks.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Tasks Found

            </h3>

            <p className="text-zinc-500 mt-2">

              Your active tasks will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {

              filteredTasks.map(

                (task) => {

                  const style =
                    getTaskStyle(

                      task.priority

                    );


                  return (

                    <div

                      key={task.id}

                      className={`relative overflow-hidden bg-gradient-to-br ${

                        style.bg

                      } text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300`}

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                        {/* LEFT */}

                        <div className="flex items-start gap-5">

                          {/* ICON */}

                          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl">

                            {

                              style.icon

                            }

                          </div>


                          {/* CONTENT */}

                          <div>

                            <h3 className="text-2xl font-bold">

                              {

                                task.title

                              }

                            </h3>


                            <p className="text-white/80 mt-3 leading-relaxed max-w-2xl">

                              {

                                task.description

                              }

                            </p>


                            <div className="flex flex-wrap items-center gap-4 mt-5">

                              <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm font-semibold capitalize">

                                Priority:

                                {" "}

                                {

                                  task.priority

                                }

                              </span>


                              <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm font-semibold capitalize">

                                Status:

                                {" "}

                                {

                                  task.status

                                }

                              </span>


                              <span className="text-white/70 text-sm">

                                📅 {

                                  new Date(

                                    task.createdAt

                                  ).toLocaleDateString()

                                }

                              </span>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="flex flex-col gap-4">

                          {

                            task.status !== "completed" ? (

                              <button

                                onClick={() =>
                                  completeTask(
                                    task.id
                                  )
                                }

                                disabled={
                                  processingId === task.id
                                }

                                className="bg-white text-black hover:bg-zinc-200 px-6 py-4 rounded-2xl font-bold transition-all duration-300"

                              >

                                {

                                  processingId === task.id

                                    ? "Updating..."

                                    : "Complete Task"

                                }

                              </button>

                            ) : (

                              <div className="bg-green-500 px-6 py-4 rounded-2xl font-bold text-center">

                                ✅ Completed

                              </div>

                            )

                          }

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