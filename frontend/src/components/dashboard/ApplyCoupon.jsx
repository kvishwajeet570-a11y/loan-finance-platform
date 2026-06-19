"use client";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ApplyCoupon() {

  const [
    code,
    setCode
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    discount,
    setDiscount
  ] = useState(null);


  /* ========================================
     APPLY COUPON
  ======================================== */

  const applyCoupon =
    async () => {

      try {

        if (!code) {

          toast.error(

            "Please enter coupon code"

          );

          return;

        }


        setLoading(true);


        const res =
          await api.post(

            "/coupon/apply",

            {

              code,

            }

          );


        if (res.data.success) {

          setDiscount(

            res.data.discount

          );

          toast.success(

            "Coupon applied successfully"

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          error?.response?.data?.message ||

          "Invalid coupon"

        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="text-3xl font-bold text-black dark:text-white">

          Apply Coupon

        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mt-1">

          Save money using discount coupons

        </p>

      </div>


      {/* INPUT */}

      <div className="space-y-5">

        <input

          type="text"

          value={code}

          onChange={(e) =>
            setCode(
              e.target.value
            )
          }

          placeholder="Enter Coupon Code"

          className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none uppercase"

        />


        {/* BUTTON */}

        <button

          onClick={applyCoupon}

          disabled={loading}

          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300"

        >

          {

            loading

              ? "Applying..."

              : "Apply Coupon"

          }

        </button>


        {/* SUCCESS */}

        {

          discount && (

            <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 p-5 rounded-2xl">

              <h3 className="text-2xl font-bold text-green-600">

                🎉 Coupon Applied

              </h3>

              <p className="text-zinc-700 dark:text-zinc-300 mt-2">

                You received

                <span className="font-bold">

                  {" "}

                  {discount}% OFF

                </span>

              </p>

            </div>

          )

        }

      </div>

    </div>

  );

}