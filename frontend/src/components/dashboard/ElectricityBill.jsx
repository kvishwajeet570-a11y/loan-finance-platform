"use client";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ElectricityBill() {

  const [
    consumerNumber,
    setConsumerNumber
  ] = useState("");


  const [
    provider,
    setProvider
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
     HANDLE BILL PAYMENT
  ======================================== */

  const handlePayment =
    async () => {

      try {

        if (

          !consumerNumber ||

          !provider ||

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

              type: "Electricity",

              consumerNumber,

              provider,

              amount:
                Number(amount),

            }

          );


        if (res.data.success) {

          toast.success(

            "Electricity bill paid successfully"

          );

          setConsumerNumber("");

          setProvider("");

          setAmount("");

        }

      } catch (error) {

        console.log(error);

        toast.error(

          error?.response?.data?.message ||

          "Bill payment failed"

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

          Electricity Bill Payment

        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mt-2">

          Pay your electricity bills instantly ⚡

        </p>

      </div>


      {/* FORM */}

      <div className="space-y-5">

        {/* CONSUMER NUMBER */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Consumer Number

          </label>

          <input
            type="text"
            placeholder="Enter Consumer Number"
            value={consumerNumber}
            onChange={(e) =>
              setConsumerNumber(
                e.target.value
              )
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
          />

        </div>


        {/* PROVIDER */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Electricity Provider

          </label>

          <select

            value={provider}

            onChange={(e) =>
              setProvider(
                e.target.value
              )
            }

            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"

          >

            <option value="">

              Select Provider

            </option>

            <option value="BSES">

              BSES

            </option>

            <option value="Tata Power">

              Tata Power

            </option>

            <option value="Adani Electricity">

              Adani Electricity

            </option>

            <option value="UPPCL">

              UPPCL

            </option>

            <option value="MSEB">

              MSEB

            </option>

          </select>

        </div>


        {/* AMOUNT */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Bill Amount

          </label>

          <input
            type="number"
            placeholder="Enter Bill Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
          />

        </div>


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

                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-yellow-500 hover:text-black text-black dark:text-white py-3 rounded-2xl font-semibold transition-all duration-300"

                >

                  ₹{money}

                </button>

              )

            )

          }

        </div>


        {/* BUTTON */}

        <button

          onClick={handlePayment}

          disabled={loading}

          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-black py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

        >

          {

            loading

              ? "Processing Payment..."

              : "Pay Bill"

          }

        </button>

      </div>

    </div>

  );

}