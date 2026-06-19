"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function AdminRechargeRequests() {

  const [
    requests,
    setRequests
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH RECHARGE REQUESTS
  ======================================== */

  const fetchRequests =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/recharge/all"

          );


        if (res.data.success) {

          setRequests(

            res.data.recharges

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch recharge requests"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     APPROVE RECHARGE
  ======================================== */

  const approveRecharge =
    async (id) => {

      try {

        const res =
          await api.put(

            `/recharge/approve/${id}`

          );


        if (res.data.success) {

          toast.success(

            "Recharge approved"

          );

          fetchRequests();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Approval failed"

        );

      }

    };


  /* ========================================
     REJECT RECHARGE
  ======================================== */

  const rejectRecharge =
    async (id) => {

      try {

        const res =
          await api.put(

            `/recharge/reject/${id}`

          );


        if (res.data.success) {

          toast.success(

            "Recharge rejected"

          );

          fetchRequests();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Reject failed"

        );

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchRequests();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Recharge Requests

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Manage pending wallet recharges

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            requests.length
          } Requests

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

                    className="animate-pulse h-28 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : requests.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-xl font-semibold text-black dark:text-white">

              No Pending Requests

            </h3>

            <p className="text-zinc-500 mt-2">

              All recharge requests are processed

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {

              requests.map(

                (request) => (

                  <div

                    key={request.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl"

                  >

                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />


                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="text-2xl font-bold">

                          {
                            request.user.name
                          }

                        </h3>

                        <p className="text-zinc-300 mt-1">

                          {
                            request.user.email
                          }

                        </p>

                      </div>


                      <div className="bg-white/10 px-4 py-2 rounded-2xl text-sm">

                        {
                          request.paymentMethod
                        }

                      </div>

                    </div>


                    <div className="mt-6">

                      <p className="text-zinc-400 text-sm">

                        Recharge Amount

                      </p>

                      <h2 className="text-4xl font-bold text-green-400 mt-2">

                        ₹{
                          request.amount
                        }

                      </h2>

                    </div>


                    <p className="text-zinc-400 mt-4 text-sm">

                      {

                        new Date(

                          request.createdAt

                        ).toLocaleDateString()

                      }

                    </p>


                    <div className="flex gap-4 mt-6">

                      <button

                        onClick={() =>
                          approveRecharge(
                            request.id
                          )
                        }

                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300"

                      >

                        Approve

                      </button>


                      <button

                        onClick={() =>
                          rejectRecharge(
                            request.id
                          )
                        }

                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300"

                      >

                        Reject

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