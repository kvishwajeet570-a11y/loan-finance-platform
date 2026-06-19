"use client";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function AddMoneyModal() {

  const [
    open,
    setOpen
  ] = useState(false);


  const [
    amount,
    setAmount
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  /* ========================================
     HANDLE ADD MONEY
  ======================================== */

  const handleAddMoney =
    async () => {

      try {

        if (!amount) {

          toast.error(
            "Please enter amount"
          );

          return;

        }


        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "User not found"
          );

          return;

        }


        setLoading(true);


        const res =
          await api.post(

            "/wallet/add-money",

            {

              userId,

              amount:
                Number(amount),

            }

          );


        if (res.data.success) {

          toast.success(
            "Money added successfully"
          );

          setAmount("");

          setOpen(false);

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to add money"
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <>

      {/* OPEN BUTTON */}

      <button

        onClick={() =>
          setOpen(true)
        }

        className="bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg"

      >

        + Add Money

      </button>


      {/* MODAL */}

      {

        open && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">

              {/* HEADER */}

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold text-black dark:text-white">

                  Add Money

                </h2>

                <button

                  onClick={() =>
                    setOpen(false)
                  }

                  className="text-zinc-500 hover:text-red-500 text-xl"

                >

                  ✕

                </button>

              </div>


              {/* INPUT */}

              <div className="space-y-5">

                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                  className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none"
                />


                {/* QUICK AMOUNTS */}

                <div className="grid grid-cols-3 gap-3">

                  {

                    [500, 1000, 2000].map(

                      (money) => (

                        <button

                          key={money}

                          onClick={() =>
                            setAmount(
                              String(money)
                            )
                          }

                          className="bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white transition-all duration-300 py-3 rounded-2xl font-medium"

                        >

                          ₹{money}

                        </button>

                      )

                    )

                  }

                </div>


                {/* SUBMIT */}

                <button

                  onClick={
                    handleAddMoney
                  }

                  disabled={loading}

                  className="w-full bg-black hover:bg-zinc-800 text-white py-4 rounded-2xl font-semibold transition-all duration-300"

                >

                  {

                    loading

                      ? "Processing..."

                      : "Add Money"

                  }

                </button>

              </div>

            </div>

          </div>

        )

      }

    </>

  );

}