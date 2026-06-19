"use client";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function MobileRecharge() {

  const [
    mobile,
    setMobile
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

  const rechargeNow =
    async () => {

      try {

        if (

          !mobile ||

          !operator ||

          !amount

        ) {

          toast.error(

            "All fields are required"

          );

          return;

        }


        if (mobile.length < 10) {

          toast.error(

            "Enter valid mobile number"

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

              type: "Mobile",

              mobile,

              operator,

              amount:
                Number(amount),

            }

          );


        if (res.data.success) {

          toast.success(

            "Recharge successful"

          );

          setMobile("");

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

          Mobile Recharge

        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mt-2">

          Instant prepaid mobile recharge 📱

        </p>

      </div>


      {/* FORM */}

      <div className="space-y-5">

        {/* MOBILE NUMBER */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Mobile Number

          </label>

          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) =>
              setMobile(
                e.target.value
              )
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          />

        </div>


        {/* OPERATOR */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Mobile Operator

          </label>

          <select

            value={operator}

            onChange={(e) =>
              setOperator(
                e.target.value
              )
            }

            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"

          >

            <option value="">

              Select Operator

            </option>

            <option value="Jio">

              Jio

            </option>

            <option value="Airtel">

              Airtel

            </option>

            <option value="Vi">

              Vodafone Idea

            </option>

            <option value="BSNL">

              BSNL

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
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          />

        </div>


        {/* QUICK RECHARGE */}

        <div className="grid grid-cols-3 gap-3">

          {

            [199, 399, 699].map(

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

          onClick={rechargeNow}

          disabled={loading}

          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

        >

          {

            loading

              ? "Processing Recharge..."

              : "Recharge Now"

          }

        </button>

      </div>

    </div>

  );

}