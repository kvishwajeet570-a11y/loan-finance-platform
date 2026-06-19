"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function NotificationCard() {

  const [
    notifications,
    setNotifications
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


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
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchNotifications();

  }, []);


  /* ========================================
     GET TYPE STYLE
  ======================================== */

  const getTypeStyle =
    (type) => {

      switch (type) {

        case "success":

          return {

            border:
              "border-green-500",

            bg:
              "from-green-500 to-emerald-600",

            icon:
              "✅",

          };

        case "warning":

          return {

            border:
              "border-yellow-400",

            bg:
              "from-yellow-400 to-orange-500",

            icon:
              "⚠️",

          };

        case "error":

          return {

            border:
              "border-red-500",

            bg:
              "from-red-500 to-rose-600",

            icon:
              "❌",

          };

        default:

          return {

            border:
              "border-cyan-500",

            bg:
              "from-cyan-500 to-blue-600",

            icon:
              "🔔",

          };

      }

    };


  return (

    <div className="space-y-5">

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

        ) : notifications.length === 0 ? (

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-10 rounded-3xl shadow-xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Notifications

            </h3>

            <p className="text-zinc-500 mt-2">

              Your latest notifications will appear here

            </p>

          </div>

        ) : (

          notifications.map(

            (notification) => {

              const style =
                getTypeStyle(

                  notification.type

                );


              return (

                <div

                  key={notification.id}

                  className={`relative overflow-hidden bg-white dark:bg-zinc-900 border-l-4 ${

                    style.border

                  } border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300`}

                >

                  {/* GLOW */}

                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${

                    style.bg

                  } opacity-10 blur-3xl rounded-full`} />


                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* LEFT */}

                    <div className="flex items-start gap-5">

                      {/* ICON */}

                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${

                        style.bg

                      } flex items-center justify-center text-3xl shadow-xl`}>

                        {

                          style.icon

                        }

                      </div>


                      {/* CONTENT */}

                      <div>

                        <h3 className="text-2xl font-bold text-black dark:text-white">

                          {

                            notification.title

                          }

                        </h3>


                        <p className="text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed max-w-2xl">

                          {

                            notification.message

                          }

                        </p>


                        <div className="flex items-center gap-4 flex-wrap mt-5">

                          <span className={`bg-gradient-to-r ${

                            style.bg

                          } text-white px-4 py-2 rounded-2xl text-sm font-semibold`}>

                            {

                              notification.type

                            }

                          </span>


                          <span className="text-zinc-500 text-sm">

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

                    <div className="flex flex-col items-start lg:items-end gap-4">

                      <div className={`px-4 py-2 rounded-2xl text-sm font-bold ${

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

                            className="bg-black hover:bg-zinc-800 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"

                          >

                            Mark as Read

                          </button>

                        )

                      }

                    </div>

                  </div>

                </div>

              );

            }

          )

        )

      }

    </div>

  );

}