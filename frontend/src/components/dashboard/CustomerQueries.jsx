"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function CustomerQueries() {

  const [
    queries,
    setQueries
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    replyingId,
    setReplyingId
  ] = useState("");


  /* ========================================
     FETCH CUSTOMER QUERIES
  ======================================== */

  const fetchQueries =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/contact"

          );


        if (res.data.success) {

          setQueries(

            res.data.messages

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch customer queries"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     MARK AS RESOLVED
  ======================================== */

  const resolveQuery =
    async (queryId) => {

      try {

        setReplyingId(queryId);


        const res =
          await api.put(

            `/contact/resolve/${queryId}`

          );


        if (res.data.success) {

          toast.success(

            "Query marked as resolved"

          );

          fetchQueries();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to update query"

        );

      } finally {

        setReplyingId("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchQueries();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Customer Queries

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Manage customer support requests 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            queries.length
          } Queries

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

                    className="animate-pulse h-48 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : queries.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Queries Available

            </h3>

            <p className="text-zinc-500 mt-2">

              Customer support requests will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {

              queries.map(

                (query) => (

                  <div

                    key={query.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl"

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />


                    {/* TOP */}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                      <div>

                        <h3 className="text-2xl font-bold">

                          {
                            query.name
                          }

                        </h3>

                        <p className="text-zinc-300 mt-2">

                          {
                            query.email
                          }

                        </p>

                      </div>


                      <div className={`px-4 py-2 rounded-2xl text-sm font-medium ${

                        query.status === "resolved"

                          ? "bg-green-500"

                          : "bg-yellow-500 text-black"

                      }`}>

                        {

                          query.status === "resolved"

                            ? "Resolved"

                            : "Pending"

                        }

                      </div>

                    </div>


                    {/* MESSAGE */}

                    <div className="mt-6 bg-white/10 backdrop-blur-xl p-5 rounded-2xl">

                      <p className="text-zinc-200 leading-relaxed">

                        {
                          query.message
                        }

                      </p>

                    </div>


                    {/* DATE */}

                    <div className="mt-6 text-sm text-zinc-400">

                      📅 {

                        new Date(

                          query.createdAt

                        ).toLocaleDateString()

                      }

                    </div>


                    {/* BUTTON */}

                    {

                      query.status !== "resolved" && (

                        <button

                          onClick={() =>
                            resolveQuery(
                              query.id
                            )
                          }

                          disabled={
                            replyingId === query.id
                          }

                          className="w-full mt-8 bg-white text-black hover:bg-zinc-200 py-4 rounded-2xl font-bold transition-all duration-300"

                        >

                          {

                            replyingId === query.id

                              ? "Updating..."

                              : "Mark as Resolved"

                          }

                        </button>

                      )

                    }

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