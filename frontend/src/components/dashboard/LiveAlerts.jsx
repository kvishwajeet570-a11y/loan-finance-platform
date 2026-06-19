"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function LiveAlerts() {

  const [
    alerts,
    setAlerts
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    activeId,
    setActiveId
  ] = useState("");


  /* ========================================
     FETCH LIVE ALERTS
  ======================================== */

  const fetchAlerts =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/notification/live"

          );


        if (res.data.success) {

          setAlerts(

            res.data.alerts

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch live alerts"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     MARK ALERT AS READ
  ======================================== */

  const markAsRead =
    async (alertId) => {

      try {

        setActiveId(alertId);


        const res =
          await api.put(

            `/notification/read/${alertId}`

          );


        if (res.data.success) {

          setAlerts(

            alerts.map(

              (alert) =>

                alert.id === alertId

                  ? {

                      ...alert,

                      isRead: true,

                    }

                  : alert

            )

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to update alert"

        );

      } finally {

        setActiveId("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchAlerts();

  }, []);


  /* ========================================
     ALERT TYPE COLORS
  ======================================== */

  const getAlertStyle =
    (type) => {

      switch (type) {

        case "warning":

          return {

            bg:
              "from-red-500 to-rose-600",

            icon:
              "⚠️",

          };

        case "offer":

          return {

            bg:
              "from-green-500 to-emerald-600",

            icon:
              "🎁",

          };

        case "maintenance":

          return {

            bg:
              "from-orange-500 to-amber-600",

            icon:
              "🛠️",

          };

        default:

          return {

            bg:
              "from-cyan-500 to-blue-600",

            icon:
              "🔔",

          };

      }

    };


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-red-500">

            Live Alerts

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time system & finance alerts 🚨

          </p>

        </div>


        <div className="bg-red-500 text-white px-4 py-2 rounded-2xl text-sm font-medium animate-pulse">

          LIVE

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

                    className="animate-pulse h-36 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : alerts.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Live Alerts

            </h3>

            <p className="text-zinc-500 mt-2">

              New system alerts will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {

              alerts.map(

                (alert) => {

                  const style =
                    getAlertStyle(

                      alert.type

                    );


                  return (

                    <div

                      key={alert.id}

                      className={`relative overflow-hidden bg-gradient-to-br ${

                        style.bg

                      } text-white p-6 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.01]`}

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

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

                                alert.title

                              }

                            </h3>


                            <p className="text-white/80 mt-3 leading-relaxed max-w-2xl">

                              {

                                alert.message

                              }

                            </p>


                            <div className="mt-5 flex items-center gap-4 flex-wrap">

                              <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm">

                                {

                                  alert.type

                                }

                              </span>


                              <span className="text-white/70 text-sm">

                                📅 {

                                  new Date(

                                    alert.createdAt

                                  ).toLocaleString()

                                }

                              </span>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="flex flex-col items-start lg:items-end gap-4">

                          <div className={`px-4 py-2 rounded-2xl text-sm font-bold ${

                            alert.isRead

                              ? "bg-green-500"

                              : "bg-black/30"

                          }`}>

                            {

                              alert.isRead

                                ? "Read"

                                : "Unread"

                            }

                          </div>


                          {

                            !alert.isRead && (

                              <button

                                onClick={() =>
                                  markAsRead(
                                    alert.id
                                  )
                                }

                                disabled={
                                  activeId === alert.id
                                }

                                className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-2xl font-bold transition-all duration-300"

                              >

                                {

                                  activeId === alert.id

                                    ? "Updating..."

                                    : "Mark as Read"

                                }

                              </button>

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