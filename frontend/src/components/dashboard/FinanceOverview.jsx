"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function FinanceOverview() {

  const [
    finance,
    setFinance
  ] = useState({

    totalRevenue: 0,

    monthlyProfit: 0,

    pendingPayments: 0,

    totalTransactions: 0,

  });


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH FINANCE OVERVIEW
  ======================================== */

  const fetchFinanceOverview =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/revenue/analytics"

          );


        if (res.data.success) {

          setFinance({

            totalRevenue:
              res.data.totalRevenue || 0,

            monthlyProfit:
              res.data.monthlyProfit || 0,

            pendingPayments:
              res.data.pendingPayments || 0,

            totalTransactions:
              res.data.totalTransactions || 0,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch finance overview"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchFinanceOverview();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Finance Overview

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Real-time financial analytics 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          Live Analytics

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {

              [1, 2, 3, 4].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* TOTAL REVENUE */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl text-white shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">

                💰

              </div>


              <p className="text-white/80">

                Total Revenue

              </p>


              <h2 className="text-4xl font-bold mt-4">

                ₹{

                  Number(

                    finance.totalRevenue

                  ).toLocaleString()

                }

              </h2>

            </div>


            {/* MONTHLY PROFIT */}

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-3xl text-white shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">

                📈

              </div>


              <p className="text-white/80">

                Monthly Profit

              </p>


              <h2 className="text-4xl font-bold mt-4">

                ₹{

                  Number(

                    finance.monthlyProfit

                  ).toLocaleString()

                }

              </h2>

            </div>


            {/* PENDING PAYMENTS */}

            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-black shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-5">

                ⏳

              </div>


              <p className="text-black/70">

                Pending Payments

              </p>


              <h2 className="text-4xl font-bold mt-4">

                ₹{

                  Number(

                    finance.pendingPayments

                  ).toLocaleString()

                }

              </h2>

            </div>


            {/* TOTAL TRANSACTIONS */}

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-600 p-6 rounded-3xl text-white shadow-2xl">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />


              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">

                🔄

              </div>


              <p className="text-white/80">

                Transactions

              </p>


              <h2 className="text-4xl font-bold mt-4">

                {

                  Number(

                    finance.totalTransactions

                  ).toLocaleString()

                }

              </h2>

            </div>

          </div>

        )

      }

    </div>

  );

}