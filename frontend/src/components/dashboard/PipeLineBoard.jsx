"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function PipeLineBoard() {

  const [
    loans,
    setLoans
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


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

          "Failed to fetch pipeline data"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchLoans();

  }, []);


  /* ========================================
     CALCULATIONS
  ======================================== */

  const pendingLoans =
    loans.filter(

      (loan) =>

        loan.status === "pending"

    );


  const approvedLoans =
    loans.filter(

      (loan) =>

        loan.status === "approved"

    );


  const rejectedLoans =
    loans.filter(

      (loan) =>

        loan.status === "rejected"

    );


  const totalVolume =
    loans.reduce(

      (acc, loan) =>

        acc + Number(

          loan.amount || 0

        ),

      0

    );


  /* ========================================
     PIPELINE CARD
  ======================================== */

  const PipelineCard = ({
    title,
    value,
    amount,
    icon,
    gradient,
    textColor,
  }) => (

    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-2xl hover:scale-[1.02] transition-all duration-300`}>

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


      <div className="relative z-10">

        {/* TOP */}

        <div className="flex items-center justify-between">

          <div>

            <p className={`text-sm font-medium ${textColor}`}>

              {title}

            </p>


            <h2 className="text-5xl font-black mt-4">

              {value}

            </h2>

          </div>


          {/* ICON */}

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-3xl">

            {icon}

          </div>

        </div>


        {/* AMOUNT */}

        <div className="mt-6">

          <p className={`text-sm ${textColor}`}>

            Loan Volume

          </p>


          <h3 className="text-2xl font-bold mt-2">

            ₹{

              Number(

                amount

              ).toLocaleString()

            }

          </h3>

        </div>

      </div>

    </div>

  );


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Loan Pipeline

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time loan workflow tracking 🚀

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold">

          {

            loans.length

          } Total Applications

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

        ) : (

          <>

            {/* PIPELINE CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {/* PENDING */}

              <PipelineCard

                title="Pending Loans"

                value={

                  pendingLoans.length

                }

                amount={

                  pendingLoans.reduce(

                    (acc, loan) =>

                      acc +

                      Number(

                        loan.amount || 0

                      ),

                    0

                  )

                }

                icon="⏳"

                gradient="from-yellow-400 to-orange-500"

                textColor="text-black/70"

              />


              {/* APPROVED */}

              <PipelineCard

                title="Approved Loans"

                value={

                  approvedLoans.length

                }

                amount={

                  approvedLoans.reduce(

                    (acc, loan) =>

                      acc +

                      Number(

                        loan.amount || 0

                      ),

                    0

                  )

                }

                icon="✅"

                gradient="from-green-500 to-emerald-600"

                textColor="text-white/80"

              />


              {/* REJECTED */}

              <PipelineCard

                title="Rejected Loans"

                value={

                  rejectedLoans.length

                }

                amount={

                  rejectedLoans.reduce(

                    (acc, loan) =>

                      acc +

                      Number(

                        loan.amount || 0

                      ),

                    0

                  )

                }

                icon="❌"

                gradient="from-red-500 to-rose-600"

                textColor="text-white/80"

              />

            </div>


            {/* TOTAL PIPELINE */}

            <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-8 rounded-3xl shadow-2xl mt-8">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-400/20 blur-3xl rounded-full" />


              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                {/* LEFT */}

                <div>

                  <p className="text-zinc-400 text-lg">

                    Total Loan Pipeline Volume

                  </p>


                  <h1 className="text-6xl font-black mt-5 text-cyan-400">

                    ₹{

                      Number(

                        totalVolume

                      ).toLocaleString()

                    }

                  </h1>


                  <p className="text-zinc-500 mt-4 max-w-2xl">

                    Combined loan amount across all pending, approved & rejected applications.

                  </p>

                </div>


                {/* RIGHT */}

                <div className="grid grid-cols-2 gap-5">

                  {/* APPROVAL RATE */}

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl min-w-[180px]">

                    <p className="text-zinc-400">

                      Approval Rate

                    </p>


                    <h2 className="text-4xl font-black mt-3 text-green-400">

                      {

                        loans.length > 0

                          ? Math.round(

                              (

                                approvedLoans.length /

                                loans.length

                              ) * 100

                            )

                          : 0

                      }%

                    </h2>

                  </div>


                  {/* REJECTION RATE */}

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl min-w-[180px]">

                    <p className="text-zinc-400">

                      Rejection Rate

                    </p>


                    <h2 className="text-4xl font-black mt-3 text-red-400">

                      {

                        loans.length > 0

                          ? Math.round(

                              (

                                rejectedLoans.length /

                                loans.length

                              ) * 100

                            )

                          : 0

                      }%

                    </h2>

                  </div>

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}