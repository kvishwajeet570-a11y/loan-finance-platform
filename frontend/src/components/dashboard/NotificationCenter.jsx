"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function NotificationCenter() {

  const [
    notifications,
    setNotifications
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

            `/notification/user/${userId}`

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
    async (id) => {

      try {

        const res =
          await api.put(

            `/notification/read/${id}`

          );


        if (res.data.success) {

          setNotifications(

            notifications.map(

              (item) =>

                item.id === id

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

      }

    };


  /* ========================================
     DELETE NOTIFICATION
  ======================================== */

  const deleteNotification =
    async (id) => {

      try {

        const res =
          await api.delete(

            `/notification/delete/${id}`

          );


        if (res.data.success) {

          toast.success(

            "Notification deleted"

          );

          setNotifications(

            notifications.filter(

              (item) =>

                item.id !== id

            )

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Delete failed"

        );

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchNotifications();

  }, []);


  /* ========================================
     FILTERED DATA
  ======================================== */

  const filteredNotifications =

    activeFilter === "all"

      ? notifications

      : notifications.filter(

          (item) =>

            item.type === activeFilter

        );


  /* ========================================
     GET TYPE STYLE
  ======================================== */

  const getTypeStyle =
    (type) => {

      switch (type) {

        case "success":

          return {

            bg:
              "from-green-500 to-emerald-600",

            icon:
              "🎉",

          };

        case "warning":

          return {

            bg:
              "from-yellow-400 to-orange-500",

            icon:
              "⚠️",

          };

        case "error":

          return {

            bg:
              "from-red-500 to-rose-600",

            icon:
              "❌",

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

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Notification Center

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time alerts, reminders & updates 🔔

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold">

          {

            filteredNotifications.length

          } Notifications

        </div>

      </div>


      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-8">

        {

          [

            "all",

            "success",

            "warning",

            "error",

            "info",

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

                    className="animate-pulse h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : filteredNotifications.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Notifications Found

            </h3>

            <p className="text-zinc-500 mt-2">

              Your latest updates will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {

              filteredNotifications.map(

                (notification) => {

                  const style =
                    getTypeStyle(

                      notification.type

                    );


                  return (

                    <div

                      key={notification.id}

                      className={`relative overflow-hidden bg-gradient-to-br ${

                        style.bg

                      } text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300`}

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

                                notification.title

                              }

                            </h3>


                            <p className="text-white/80 mt-3 leading-relaxed max-w-2xl">

                              {

                                notification.message

                              }

                            </p>


                            <div className="flex flex-wrap items-center gap-4 mt-5">

                              <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm font-semibold capitalize">

                                {

                                  notification.type

                                }

                              </span>


                              <span className="text-white/70 text-sm">

                                📅 {

                                  new Date(

                                    notification.createdAt

                                  ).toLocaleString()

                                }

                              </span>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="flex flex-col gap-3">

                          {/* STATUS */}

                          <div className={`px-4 py-2 rounded-2xl text-sm font-bold text-center ${

                            notification.isRead

                              ? "bg-green-500"

                              : "bg-black/30"

                          }`}>

                            {

                              notification.isRead

                                ? "Read"

                                : "Unread"

                            }

                          </div>


                          {/* READ BUTTON */}

                          {

                            !notification.isRead && (

                              <button

                                onClick={() =>
                                  markAsRead(
                                    notification.id
                                  )
                                }

                                className="bg-white text-black hover:bg-zinc-200 px-5 py-3 rounded-2xl font-semibold transition-all duration-300"

                              >

                                Mark as Read

                              </button>

                            )

                          }


                          {/* DELETE */}

                          <button

                            onClick={() =>
                              deleteNotification(
                                notification.id
                              )
                            }

                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"

                          >

                            Delete

                          </button>

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