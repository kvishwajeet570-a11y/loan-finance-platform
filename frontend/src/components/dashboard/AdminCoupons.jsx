"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function AdminCoupons() {

  const [
    coupons,
    setCoupons
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    code,
    setCode
  ] = useState("");


  const [
    discount,
    setDiscount
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
     CREATE COUPON
  ======================================== */

  const createCoupon =
    async () => {

      try {

        if (

          !code ||

          !discount

        ) {

          toast.error(

            "All fields are required"

          );

          return;

        }


        const res =
          await api.post(

            "/coupon/create",

            {

              code,

              discount:
                Number(discount),

            }

          );


        if (res.data.success) {

          toast.success(

            "Coupon created successfully"

          );

          setCode("");

          setDiscount("");

          fetchCoupons();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to create coupon"

        );

      }

    };


  /* ========================================
     DELETE COUPON
  ======================================== */

  const deleteCoupon =
    async (id) => {

      try {

        const res =
          await api.delete(

            `/coupon/delete/${id}`

          );


        if (res.data.success) {

          toast.success(

            "Coupon deleted"

          );

          fetchCoupons();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Delete failed"

        );

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

            Admin Coupons

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Manage discount coupons

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            coupons.length
          } Coupons

        </div>

      </div>


      {/* CREATE FORM */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <input
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
            )
          }
          className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none"
        />

        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) =>
            setDiscount(
              e.target.value
            )
          }
          className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none"
        />

        <button
          onClick={createCoupon}
          className="bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition-all duration-300"

        >

          + Create Coupon

        </button>

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

                    className="animate-pulse h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {

              coupons.map(

                (coupon) => (

                  <div

                    key={coupon.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl"

                  >

                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 blur-3xl rounded-full" />

                    <h3 className="text-2xl font-bold tracking-widest">

                      {
                        coupon.code
                      }

                    </h3>

                    <p className="text-4xl font-bold text-green-400 mt-4">

                      {
                        coupon.discount
                      }%

                    </p>

                    <p className="text-zinc-400 mt-4 text-sm">

                      {

                        new Date(

                          coupon.createdAt

                        ).toLocaleDateString()

                      }

                    </p>

                    <button

                      onClick={() =>
                        deleteCoupon(
                          coupon.id
                        )
                      }

                      className="mt-5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300"

                    >

                      Delete

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