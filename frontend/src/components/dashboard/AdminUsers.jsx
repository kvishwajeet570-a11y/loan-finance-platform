"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function AdminUsers() {

  const [
    users,
    setUsers
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH USERS
  ======================================== */

  const fetchUsers =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/admin/users"

          );


        if (res.data.success) {

          setUsers(

            res.data.users

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch users"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     BLOCK USER
  ======================================== */

  const blockUser =
    async (userId) => {

      try {

        const res =
          await api.post(

            "/admin/block-user",

            {

              userId,

            }

          );


        if (res.data.success) {

          toast.success(

            "User blocked successfully"

          );

          fetchUsers();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to block user"

        );

      }

    };


  /* ========================================
     UNBLOCK USER
  ======================================== */

  const unblockUser =
    async (userId) => {

      try {

        const res =
          await api.post(

            "/admin/unblock-user",

            {

              userId,

            }

          );


        if (res.data.success) {

          toast.success(

            "User unblocked successfully"

          );

          fetchUsers();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to unblock user"

        );

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchUsers();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Manage Users

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Manage all registered users

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            users.length
          } Users

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-4">

            {

              [1, 2, 3].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : users.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-xl font-semibold text-black dark:text-white">

              No Users Found

            </h3>

          </div>

        ) : (

          <div className="space-y-5">

            {

              users.map(

                (user) => (

                  <div

                    key={user.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl"

                  >

                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />


                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                      <div>

                        <h3 className="text-2xl font-bold">

                          {
                            user.name
                          }

                        </h3>

                        <p className="text-zinc-300 mt-1">

                          {
                            user.email
                          }

                        </p>

                        <p className="text-zinc-400 text-sm mt-3">

                          Joined:

                          {

                            new Date(

                              user.createdAt

                            ).toLocaleDateString()

                          }

                        </p>

                      </div>


                      <div className="flex flex-col items-end gap-4">

                        <div className={`px-4 py-2 rounded-2xl text-sm font-medium ${

                          user.isBlocked

                            ? "bg-red-500"

                            : "bg-green-500"

                        }`}>

                          {

                            user.isBlocked

                              ? "Blocked"

                              : "Active"

                          }

                        </div>


                        {

                          user.isBlocked ? (

                            <button

                              onClick={() =>
                                unblockUser(
                                  user.id
                                )
                              }

                              className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-2xl font-semibold transition-all duration-300"

                            >

                              Unblock User

                            </button>

                          ) : (

                            <button

                              onClick={() =>
                                blockUser(
                                  user.id
                                )
                              }

                              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-2xl font-semibold transition-all duration-300"

                            >

                              Block User

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