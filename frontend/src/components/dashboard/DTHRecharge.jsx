"use client";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function DTHRecharge() {

  const [
    subscriberId,
    setSubscriberId
  ] = useState("");


  const [
    operator,
    setOperator
  ] = useState("");


  const [
    amount,
    setAmount
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  /* ========================================
     HANDLE RECHARGE
  ======================================== */

  const handleRecharge =
    async () => {

      try {

        if (

          !subscriberId ||

          !operator ||

          !amount

        ) {

          toast.error(

            "All fields are required"

          );

          return;

        }


        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        setLoading(true);


        const res =
          await api.post(

            "/recharge/create",

            {

              userId,

              type: "DTH",

              subscriberId,

              operator,

              amount:
                Number(amount),

            }

          );


        if (res.data.success) {

          toast.success(

            "DTH Recharge Successful"

          );

          setSubscriberId("");

          setOperator("");

          setAmount("");

        }

      } catch (error) {

        console.log(error);

        toast.error(

          error?.response?.data?.message ||

          "Recharge failed"

        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-black dark:text-white">

          DTH Recharge

        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mt-2">

          Recharge your DTH instantly 🚀

        </p>

      </div>


      {/* FORM */}

      <div className="space-y-5">

        {/* SUBSCRIBER ID */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Subscriber ID

          </label>

          <input
            type="text"
            placeholder="Enter Subscriber ID"
            value={subscriberId}
            onChange={(e) =>
              setSubscriberId(
                e.target.value
              )
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />

        </div>


        {/* OPERATOR */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            DTH Operator

          </label>

          <select

            value={operator}

            onChange={(e) =>
              setOperator(
                e.target.value
              )
            }

            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"

          >

            <option value="">

              Select Operator

            </option>

            <option value="Tata Play">

              Tata Play

            </option>

            <option value="Airtel Digital TV">

              Airtel Digital TV

            </option>

            <option value="Dish TV">

              Dish TV

            </option>

            <option value="Sun Direct">

              Sun Direct

            </option>

            <option value="d2h">

              d2h

            </option>

          </select>

        </div>


        {/* AMOUNT */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Recharge Amount

          </label>

          <input
            type="number"
            placeholder="Enter Recharge Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />

        </div>


        {/* QUICK AMOUNTS */}

        <div className="grid grid-cols-3 gap-3">

          {

            [199, 399, 599].map(

              (money) => (

                <button

                  key={money}

                  onClick={() =>
                    setAmount(
                      String(money)
                    )
                  }

                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-600 hover:text-white text-black dark:text-white py-3 rounded-2xl font-semibold transition-all duration-300"

                >

                  ₹{money}

                </button>

              )

            )

          }

        </div>


        {/* BUTTON */}

        <button

          onClick={handleRecharge}

          disabled={loading}

          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

        >

          {

            loading

              ? "Processing..."

              : "Recharge Now"

          }

        </button>

      </div>

    </div>

  );

}