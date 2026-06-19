"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function AdminWallet() {

  const [
    wallets,
    setWallets
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH ALL WALLETS
  ======================================== */

  const fetchWallets =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/wallet/admin/all"

          );


        if (res.data.success) {

          setWallets(

            res.data.wallets

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch wallets"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     RESET WALLET
  ======================================== */

  const resetWallet =
    async (walletId) => {

      try {

        const res =
          await api.put(

            `/wallet/reset/${walletId}`

          );


        if (res.data.success) {

          toast.success(

            "Wallet reset successfully"

          );

          fetchWallets();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to reset wallet"

        );

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchWallets();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Admin Wallet Control

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Monitor wallet balances & transactions

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            wallets.length
          } Wallets

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

                    className="animate-pulse h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : wallets.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-xl font-semibold text-black dark:text-white">

              No Wallets Found

            </h3>

          </div>

        ) : (

          <div className="space-y-6">

            {

              wallets.map(

                (wallet) => (

                  <div

                    key={wallet.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl"

                  >

                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />


                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                      <div>

                        <h3 className="text-2xl font-bold">

                          {
                            wallet.user.name
                          }

                        </h3>

                        <p className="text-zinc-300 mt-1">

                          {
                            wallet.user.email
                          }

                        </p>

                      </div>


                      <div className="text-right">

                        <p className="text-zinc-400 text-sm">

                          Wallet Balance

                        </p>

                        <h2 className="text-4xl font-bold text-green-400 mt-2">

                          ₹{

                            wallet.balance.toLocaleString()

                          }

                        </h2>

                      </div>

                    </div>


                    {/* TRANSACTIONS */}

                    <div className="mt-8">

                      <h4 className="text-lg font-semibold mb-4">

                        Recent Transactions

                      </h4>


                      <div className="space-y-3">

                        {

                          wallet.transactions
                            .slice(0, 3)
                            .map(

                              (transaction) => (

                                <div

                                  key={transaction.id}

                                  className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between"

                                >

                                  <div>

                                    <p className="font-medium">

                                      {
                                        transaction.description
                                      }

                                    </p>

                                    <p className="text-zinc-400 text-sm mt-1">

                                      {

                                        new Date(

                                          transaction.createdAt

                                        ).toLocaleDateString()

                                      }

                                    </p>

                                  </div>


                                  <div className={`font-bold text-lg ${

                                    transaction.type === "credit"

                                      ? "text-green-400"

                                      : "text-red-400"

                                  }`}>

                                    {

                                      transaction.type === "credit"

                                        ? "+"

                                        : "-"

                                    }

                                    ₹{

                                      transaction.amount

                                    }

                                  </div>

                                </div>

                              )

                            )

                        }

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="mt-8 flex justify-end">

                      <button

                        onClick={() =>
                          resetWallet(
                            wallet.id
                          )
                        }

                        className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-2xl font-semibold transition-all duration-300"

                      >

                        Reset Wallet

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