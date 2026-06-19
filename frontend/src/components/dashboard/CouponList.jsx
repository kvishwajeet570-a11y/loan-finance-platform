"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function CouponList() {

  const [
    coupons,
    setCoupons
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    applyingCoupon,
    setApplyingCoupon
  ] = useState("");


  /* ========================================
     FETCH COUPONS
  ======================================== */

  const fetchCoupons =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/coupon"

          );


        if (res.data.success) {

          setCoupons(

            res.data.coupons

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to load coupons"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     APPLY COUPON
  ======================================== */

  const applyCoupon =
    async (couponCode) => {

      try {

        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        setApplyingCoupon(couponCode);


        const res =
          await api.post(

            "/coupon/apply",

            {

              userId,

              code:
                couponCode,

            }

          );


        if (res.data.success) {

          toast.success(

            "Coupon applied successfully"

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to apply coupon"

        );

      } finally {

        setApplyingCoupon("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchCoupons();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Coupon List

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Active cashback & reward coupons 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            coupons.length
          } Coupons

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

        ) : coupons.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Coupons Found

            </h3>

            <p className="text-zinc-500 mt-2">

              New offers will appear here

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {

              coupons.map(

                (coupon) => (

                  <div

                    key={coupon.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300"

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full" />


                    {/* TOP */}

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl inline-block">

                          <p className="text-lg font-bold tracking-widest">

                            {
                              coupon.code
                            }

                          </p>

                        </div>


                        <h2 className="text-4xl font-bold text-green-400 mt-6">

                          ₹{
                            coupon.discount
                          }

                        </h2>


                        <p className="text-zinc-300 mt-2">

                          Cashback Reward

                        </p>

                      </div>


                      <div className="text-5xl">

                        🎁

                      </div>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="text-zinc-400 mt-6 leading-relaxed">

                      {
                        coupon.description
                      }

                    </p>


                    {/* VALIDITY */}

                    <div className="mt-6 text-sm text-zinc-400">

                      ⏳ Valid Till:

                      {" "}

                      {

                        new Date(

                          coupon.expiryDate

                        ).toLocaleDateString()

                      }

                    </div>


                    {/* BUTTON */}

                    <button

                      onClick={() =>
                        applyCoupon(
                          coupon.code
                        )
                      }

                      disabled={
                        applyingCoupon === coupon.code
                      }

                      className="w-full mt-8 bg-white text-black hover:bg-zinc-200 py-4 rounded-2xl font-bold transition-all duration-300"

                    >

                      {

                        applyingCoupon === coupon.code

                          ? "Applying..."

                          : "Apply Coupon"

                      }

                    </button>

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