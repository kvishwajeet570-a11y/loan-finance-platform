"use client";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function EMIPayment() {

  const [
    amount,
    setAmount
  ] = useState("");


  const [
    paymentMethod,
    setPaymentMethod
  ] = useState("");


  const [
    loanId,
    setLoanId
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  /* ========================================
     HANDLE EMI PAYMENT
  ======================================== */

  const handlePayment =
    async () => {

      try {

        if (

          !amount ||

          !paymentMethod ||

          !loanId

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

            "/loan/pay-emi",

            {

              userId,

              loanId,

              amount:
                Number(amount),

              paymentMethod,

            }

          );


        if (res.data.success) {

          toast.success(

            "EMI Payment Successful"

          );

          setAmount("");

          setPaymentMethod("");

          setLoanId("");

        }

      } catch (error) {

        console.log(error);

        toast.error(

          error?.response?.data?.message ||

          "Payment failed"

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

          EMI Payment

        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mt-2">

          Pay your loan EMI securely 💳

        </p>

      </div>


      {/* FORM */}

      <div className="space-y-5">

        {/* LOAN ID */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Loan ID

          </label>

          <input
            type="text"
            placeholder="Enter Loan ID"
            value={loanId}
            onChange={(e) =>
              setLoanId(
                e.target.value
              )
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          />

        </div>


        {/* EMI AMOUNT */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            EMI Amount

          </label>

          <input
            type="number"
            placeholder="Enter EMI Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          />

        </div>


        {/* PAYMENT METHOD */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Payment Method

          </label>

          <select

            value={paymentMethod}

            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }

            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"

          >

            <option value="">

              Select Payment Method

            </option>

            <option value="UPI">

              UPI

            </option>

            <option value="Credit Card">

              Credit Card

            </option>

            <option value="Debit Card">

              Debit Card

            </option>

            <option value="Net Banking">

              Net Banking

            </option>

            <option value="Wallet">

              Wallet

            </option>

          </select>

        </div>


        {/* QUICK AMOUNTS */}

        <div className="grid grid-cols-3 gap-3">

          {

            [1000, 2500, 5000].map(

              (money) => (

                <button

                  key={money}

                  onClick={() =>
                    setAmount(
                      String(money)
                    )
                  }

                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-green-600 hover:text-white text-black dark:text-white py-3 rounded-2xl font-semibold transition-all duration-300"

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

          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

        >

          {

            loading

              ? "Processing Payment..."

              : "Pay EMI"

          }

        </button>

      </div>

    </div>

  );

}