"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function DashboardNotifications() {

  const [
    notifications,
    setNotifications
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
     FETCH NOTIFICATIONS
  ======================================== */

  const fetchNotifications =
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

            `/notification/${userId}`

          );


        if (res.data.success) {

          setNotifications(

            res.data.notifications

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch notifications"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     MARK AS READ
  ======================================== */

  const markAsRead =
    async (notificationId) => {

      try {

        setActiveId(notificationId);


        const res =
          await api.put(

            `/notification/read/${notificationId}`

          );


        if (res.data.success) {

          setNotifications(

            notifications.map(

              (item) =>

                item.id === notificationId

                  ? {

                      ...item,

                      isRead: true,

                    }

                  : item

            )

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to update notification"

        );

      } finally {

        setActiveId("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchNotifications();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Notifications

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time alerts & updates 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            notifications.length
          } Alerts

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

                    className="animate-pulse h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : notifications.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-10 text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Notifications Found

            </h3>

            <p className="text-zinc-500 mt-2">

              New updates will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {

              notifications.map(

                (notification) => (

                  <div

                    key={notification.id}

                    className={`relative overflow-hidden p-6 rounded-3xl shadow-xl transition-all duration-300 border ${

                      notification.isRead

                        ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"

                        : "bg-gradient-to-br from-black to-zinc-800 border-transparent text-white"

                    }`}

                  >

                    {/* GLOW */}

                    {

                      !notification.isRead && (

                        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />

                      )

                    }


                    <div className="flex items-start justify-between gap-5">

                      {/* LEFT */}

                      <div className="flex gap-4">

                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${

                          notification.isRead

                            ? "bg-zinc-200 dark:bg-zinc-700"

                            : "bg-white/10"

                        }`}>

                          🔔

                        </div>


                        <div>

                          <h3 className={`text-xl font-bold ${

                            notification.isRead

                              ? "text-black dark:text-white"

                              : "text-white"

                          }`}>

                            {

                              notification.title

                            }

                          </h3>


                          <p className={`mt-3 leading-relaxed ${

                            notification.isRead

                              ? "text-zinc-600 dark:text-zinc-300"

                              : "text-zinc-300"

                          }`}>

                            {

                              notification.message

                            }

                          </p>


                          <div className={`mt-5 text-sm ${

                            notification.isRead

                              ? "text-zinc-500"

                              : "text-zinc-400"

                          }`}>

                            📅 {

                              new Date(

                                notification.createdAt

                              ).toLocaleDateString()

                            }

                          </div>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div className="flex flex-col items-end gap-4">

                        <div className={`px-4 py-2 rounded-2xl text-sm font-semibold ${

                          notification.isRead

                            ? "bg-green-500 text-white"

                            : "bg-yellow-400 text-black"

                        }`}>

                          {

                            notification.isRead

                              ? "Read"

                              : "Unread"

                          }

                        </div>


                        {

                          !notification.isRead && (

                            <button

                              onClick={() =>
                                markAsRead(
                                  notification.id
                                )
                              }

                              disabled={
                                activeId === notification.id
                              }

                              className="bg-white text-black hover:bg-zinc-200 px-5 py-3 rounded-2xl font-bold transition-all duration-300"

                            >

                              {

                                activeId === notification.id

                                  ? "Updating..."

                                  : "Mark as Read"

                              }

                            </button>

                          )

                        }

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