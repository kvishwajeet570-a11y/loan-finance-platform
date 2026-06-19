"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function MyLeads() {

  const [
    leads,
    setLeads
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
     FETCH MY LEADS
  ======================================== */

  const fetchLeads =
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

            `/loan/user/${userId}`

          );


        if (res.data.success) {

          setLeads(

            res.data.loans

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch leads"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchLeads();

  }, []);


  /* ========================================
     FILTER LEADS
  ======================================== */

  const filteredLeads =

    activeFilter === "all"

      ? leads

      : leads.filter(

          (lead) =>

            lead.status === activeFilter

        );


  /* ========================================
     STATUS STYLE
  ======================================== */

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "approved":

          return {

            bg:
              "bg-green-500",

            text:
              "text-white",

            icon:
              "✅",

          };

        case "pending":

          return {

            bg:
              "bg-yellow-400",

            text:
              "text-black",

            icon:
              "⏳",

          };

        case "rejected":

          return {

            bg:
              "bg-red-500",

            text:
              "text-white",

            icon:
              "❌",

          };

        default:

          return {

            bg:
              "bg-zinc-500",

            text:
              "text-white",

            icon:
              "📄",

          };

      }

    };


  /* ========================================
     TOTAL AMOUNT
  ======================================== */

  const totalAmount =
    filteredLeads.reduce(

      (acc, lead) =>

        acc + Number(

          lead.amount || 0

        ),

      0

    );


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            My Leads

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Track all your submitted loan leads 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold">

          {

            filteredLeads.length

          } Leads

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

                Total Leads

              </p>


              <h2 className="text-5xl font-black mt-4">

                {

                  leads.length

                }

              </h2>

            </div>


            {/* TOTAL AMOUNT */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Loan Volume

              </p>


              <h2 className="text-5xl font-black mt-4">

                ₹{

                  Number(

                    totalAmount

                  ).toLocaleString()

                }

              </h2>

            </div>


            {/* APPROVED */}

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <p className="text-white/80">

                Approved Leads

              </p>


              <h2 className="text-5xl font-black mt-4">

                {

                  leads.filter(

                    (lead) =>

                      lead.status === "approved"

                  ).length

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

            "approved",

            "pending",

            "rejected",

          ].map(

            (filter) => (

              <button

                key={filter}

                onClick={() =>
                  setActiveFilter(
                    filter
                  )
                }

                className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 capitalize ${

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

                    className="animate-pulse h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : filteredLeads.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Leads Found

            </h3>

            <p className="text-zinc-500 mt-2">

              Your loan leads will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {

              filteredLeads.map(

                (lead) => {

                  const style =
                    getStatusStyle(

                      lead.status

                    );


                  return (

                    <div

                      key={lead.id}

                      className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-300"

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />


                      {/* TOP */}

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div>

                          <h3 className="text-3xl font-bold text-cyan-400">

                            {

                              lead.loanType

                            }

                          </h3>


                          <p className="text-zinc-400 mt-2">

                            Lead ID:

                            {" "}

                            {

                              lead.id

                            }

                          </p>

                        </div>


                        {/* STATUS */}

                        <div className={`${

                          style.bg

                        } ${

                          style.text

                        } px-5 py-3 rounded-2xl font-bold flex items-center gap-2 uppercase`}>

                          <span>

                            {

                              style.icon

                            }

                          </span>

                          {

                            lead.status

                          }

                        </div>

                      </div>


                      {/* DETAILS */}

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

                        {/* NAME */}

                        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">

                          <p className="text-zinc-400 text-sm">

                            Full Name

                          </p>


                          <h3 className="text-xl font-bold mt-3">

                            {

                              lead.fullName

                            }

                          </h3>

                        </div>


                        {/* EMAIL */}

                        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">

                          <p className="text-zinc-400 text-sm">

                            Email

                          </p>


                          <h3 className="text-lg font-semibold mt-3 break-all">

                            {

                              lead.email

                            }

                          </h3>

                        </div>


                        {/* PHONE */}

                        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">

                          <p className="text-zinc-400 text-sm">

                            Phone

                          </p>


                          <h3 className="text-xl font-bold mt-3">

                            {

                              lead.phone

                            }

                          </h3>

                        </div>


                        {/* AMOUNT */}

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl shadow-xl">

                          <p className="text-white/80 text-sm">

                            Loan Amount

                          </p>


                          <h2 className="text-4xl font-black mt-3">

                            ₹{

                              Number(

                                lead.amount

                              ).toLocaleString()

                            }

                          </h2>

                        </div>

                      </div>


                      {/* EXTRA DETAILS */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                        {/* PURPOSE */}

                        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">

                          <p className="text-zinc-400 text-sm">

                            Loan Purpose

                          </p>


                          <h3 className="text-lg font-semibold mt-3">

                            {

                              lead.purpose ||

                              "Not Provided"

                            }

                          </h3>

                        </div>


                        {/* DATE */}

                        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">

                          <p className="text-zinc-400 text-sm">

                            Applied On

                          </p>


                          <h3 className="text-lg font-semibold mt-3">

                            {

                              new Date(

                                lead.createdAt

                              ).toLocaleDateString()

                            }

                          </h3>

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