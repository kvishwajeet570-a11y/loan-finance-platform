"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function LoanApplications() {

  const [
    loans,
    setLoans
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    updatingId,
    setUpdatingId
  ] = useState("");


  /* ========================================
     FETCH LOANS
  ======================================== */

  const fetchLoans =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/loan/all"

          );


        if (res.data.success) {

          setLoans(

            res.data.loans

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch loans"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     UPDATE LOAN STATUS
  ======================================== */

  const updateLoanStatus =
    async (

      loanId,

      status

    ) => {

      try {

        setUpdatingId(loanId);


        const res =
          await api.put(

            `/loan/update/${loanId}`,

            {

              status,

            }

          );


        if (res.data.success) {

          toast.success(

            `Loan ${status} successfully`

          );

          fetchLoans();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to update loan"

        );

      } finally {

        setUpdatingId("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchLoans();

  }, []);


  /* ========================================
     STATUS COLORS
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

          };

        case "pending":

          return {

            bg:
              "bg-yellow-400",

            text:
              "text-black",

          };

        case "rejected":

          return {

            bg:
              "bg-red-500",

            text:
              "text-white",

          };

        default:

          return {

            bg:
              "bg-zinc-500",

            text:
              "text-white",

          };

      }

    };


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Loan Applications

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Manage all customer loan applications 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {

            loans.length

          } Applications

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

                    className="animate-pulse h-60 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : loans.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Loan Applications Found

            </h3>

            <p className="text-zinc-500 mt-2">

              Customer applications will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {

              loans.map(

                (loan) => {

                  const style =
                    getStatusStyle(

                      loan.status

                    );


                  return (

                    <div

                      key={loan.id}

                      className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-2xl"

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />


                      {/* TOP */}

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div>

                          <h3 className="text-3xl font-bold text-cyan-400">

                            {

                              loan.loanType

                            }

                          </h3>


                          <p className="text-zinc-400 mt-2">

                            Loan ID:

                            {" "}

                            {

                              loan.id

                            }

                          </p>

                        </div>


                        {/* STATUS */}

                        <div className={`${

                          style.bg

                        } ${

                          style.text

                        } px-5 py-3 rounded-2xl font-bold text-sm uppercase`}>

                          {

                            loan.status

                          }

                        </div>

                      </div>


                      {/* CUSTOMER INFO */}

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

                        {/* NAME */}

                        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">

                          <p className="text-zinc-400 text-sm">

                            Full Name

                          </p>


                          <h3 className="text-xl font-bold mt-3">

                            {

                              loan.fullName

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

                              loan.email

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

                              loan.phone

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

                                loan.amount

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

                              loan.purpose ||

                              "Not Provided"

                            }

                          </h3>

                        </div>


                        {/* CREATED */}

                        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">

                          <p className="text-zinc-400 text-sm">

                            Applied On

                          </p>


                          <h3 className="text-lg font-semibold mt-3">

                            {

                              new Date(

                                loan.createdAt

                              ).toLocaleDateString()

                            }

                          </h3>

                        </div>

                      </div>


                      {/* ACTION BUTTONS */}

                      {

                        loan.status === "pending" && (

                          <div className="flex flex-col md:flex-row gap-4 mt-8">

                            {/* APPROVE */}

                            <button

                              onClick={() =>
                                updateLoanStatus(

                                  loan.id,

                                  "approved"

                                )
                              }

                              disabled={
                                updatingId === loan.id
                              }

                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300"

                            >

                              {

                                updatingId === loan.id

                                  ? "Processing..."

                                  : "Approve Loan"

                              }

                            </button>


                            {/* REJECT */}

                            <button

                              onClick={() =>
                                updateLoanStatus(

                                  loan.id,

                                  "rejected"

                                )
                              }

                              disabled={
                                updatingId === loan.id
                              }

                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300"

                            >

                              {

                                updatingId === loan.id

                                  ? "Processing..."

                                  : "Reject Loan"

                              }

                            </button>

                          </div>

                        )

                      }

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