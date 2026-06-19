"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function RechargePlans({

  mobile,
  operator,
  onSelectPlan,

}) {

  const [
    plans,
    setPlans
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    selectedCategory,
    setSelectedCategory
  ] = useState("popular");


  const [
    selectedPlan,
    setSelectedPlan
  ] = useState(null);


  /* ========================================
     FETCH PLANS
  ======================================== */

  const fetchPlans =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            `/recharge/plans?operator=${operator}`

          );


        if (res.data.success) {

          setPlans(

            res.data.plans

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to load recharge plans"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    if (operator) {

      fetchPlans();

    }

  }, [operator]);


  /* ========================================
     FILTER PLANS
  ======================================== */

  const filteredPlans =

    selectedCategory === "all"

      ? plans

      : plans.filter(

          (plan) =>

            plan.category ===

            selectedCategory

        );


  /* ========================================
     SELECT PLAN
  ======================================== */

  const handleSelectPlan =
    (plan) => {

      setSelectedPlan(plan);


      if (onSelectPlan) {

        onSelectPlan(plan);

      }


      toast.success(

        `₹${plan.price} plan selected`

      );

    };


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Recharge Plans

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Smart plans with cashback & unlimited benefits 🚀

          </p>

        </div>


        {/* OPERATOR */}

        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold shadow-xl">

          {

            operator ||

            "No Operator Selected"

          }

        </div>

      </div>


      {/* USER INFO */}

      {

        mobile && (

          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl mb-8">

            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

              <div>

                <p className="text-white/80">

                  Recharge Number

                </p>


                <h2 className="text-4xl font-black mt-3">

                  {

                    mobile

                  }

                </h2>

              </div>


              <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">

                📡 {

                  operator

                }

              </div>

            </div>

          </div>

        )

      }


      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-8">

        {

          [

            "all",

            "popular",

            "data",

            "unlimited",

            "topup",

          ].map(

            (category) => (

              <button

                key={category}

                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }

                className={`px-5 py-3 rounded-2xl font-semibold capitalize transition-all duration-300 ${

                  selectedCategory === category

                    ? "bg-black text-white"

                    : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"

                }`}

              >

                {

                  category

                }

              </button>

            )

          )

        }

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {

              [1, 2, 3, 4, 5, 6].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-72 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : filteredPlans.length === 0 ? (

          <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white rounded-3xl p-10 text-center shadow-2xl">

            <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-500/20 blur-3xl rounded-full" />


            <div className="relative z-10">

              <div className="text-7xl mb-6">

                📱

              </div>


              <h3 className="text-3xl font-black">

                No Plans Available

              </h3>


              <p className="text-zinc-400 mt-4">

                Recharge plans will appear here

              </p>

            </div>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {

              filteredPlans.map(

                (plan) => (

                  <div

                    key={plan.id}

                    className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer ${

                      selectedPlan?.id === plan.id

                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"

                        : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"

                    }`}

                    onClick={() =>
                      handleSelectPlan(
                        plan
                      )
                    }

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


                    <div className="relative z-10">

                      {/* TOP */}

                      <div className="flex items-center justify-between mb-6">

                        <div>

                          <p className={`text-sm ${

                            selectedPlan?.id === plan.id

                              ? "text-white/80"

                              : "text-zinc-500 dark:text-zinc-400"

                          }`}>

                            Recharge Plan

                          </p>


                          <h2 className="text-5xl font-black mt-3">

                            ₹{

                              plan.price

                            }

                          </h2>

                        </div>


                        {/* BADGE */}

                        <div className={`px-4 py-2 rounded-2xl text-sm font-semibold capitalize ${

                          selectedPlan?.id === plan.id

                            ? "bg-white/10"

                            : "bg-black text-white"

                        }`}>

                          {

                            plan.category

                          }

                        </div>

                      </div>


                      {/* BENEFITS */}

                      <div className="space-y-4">

                        <div className="flex items-center justify-between">

                          <span className={`text-sm ${

                            selectedPlan?.id === plan.id

                              ? "text-white/70"

                              : "text-zinc-500 dark:text-zinc-400"

                          }`}>

                            Validity

                          </span>


                          <span className="font-bold">

                            {

                              plan.validity

                            }

                          </span>

                        </div>


                        <div className="flex items-center justify-between">

                          <span className={`text-sm ${

                            selectedPlan?.id === plan.id

                              ? "text-white/70"

                              : "text-zinc-500 dark:text-zinc-400"

                          }`}>

                            Data

                          </span>


                          <span className="font-bold">

                            {

                              plan.data

                            }

                          </span>

                        </div>


                        <div className="flex items-center justify-between">

                          <span className={`text-sm ${

                            selectedPlan?.id === plan.id

                              ? "text-white/70"

                              : "text-zinc-500 dark:text-zinc-400"

                          }`}>

                            Calls

                          </span>


                          <span className="font-bold">

                            {

                              plan.calls

                            }

                          </span>

                        </div>


                        <div className="flex items-center justify-between">

                          <span className={`text-sm ${

                            selectedPlan?.id === plan.id

                              ? "text-white/70"

                              : "text-zinc-500 dark:text-zinc-400"

                          }`}>

                            SMS

                          </span>


                          <span className="font-bold">

                            {

                              plan.sms

                            }

                          </span>

                        </div>

                      </div>


                      {/* CASHBACK */}

                      {

                        plan.cashback > 0 && (

                          <div className={`mt-6 px-4 py-3 rounded-2xl font-semibold ${

                            selectedPlan?.id === plan.id

                              ? "bg-white/10"

                              : "bg-green-500 text-white"

                          }`}>

                            🎁 Cashback ₹{

                              plan.cashback

                            }

                          </div>

                        )

                      }


                      {/* BUTTON */}

                      <button

                        className={`w-full mt-6 py-4 rounded-2xl font-black text-lg transition-all duration-300 ${

                          selectedPlan?.id === plan.id

                            ? "bg-white text-black"

                            : "bg-black text-white"

                        }`}

                      >

                        {

                          selectedPlan?.id === plan.id

                            ? "Selected"

                            : "Choose Plan"

                        }

                      </button>

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