"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function OfferBanner() {

  const [
    offers,
    setOffers
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    claimingId,
    setClaimingId
  ] = useState("");


  /* ========================================
     FETCH OFFERS
  ======================================== */

  const fetchOffers =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/coupon/offers"

          );


        if (res.data.success) {

          setOffers(

            res.data.offers

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch offers"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     CLAIM OFFER
  ======================================== */

  const claimOffer =
    async (offerId) => {

      try {

        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        setClaimingId(offerId);


        const res =
          await api.post(

            "/coupon/claim",

            {

              userId,

              offerId,

            }

          );


        if (res.data.success) {

          toast.success(

            "Offer claimed successfully 🎉"

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          error?.response?.data?.message ||

          "Failed to claim offer"

        );

      } finally {

        setClaimingId("");

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchOffers();

  }, []);


  return (

    <div className="space-y-6">

      {

        loading ? (

          <div className="space-y-6">

            {

              [1, 2].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-72 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : offers.length === 0 ? (

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-10 rounded-3xl shadow-xl text-center">

            <h2 className="text-3xl font-bold text-black dark:text-white">

              No Offers Available

            </h2>

            <p className="text-zinc-500 mt-3">

              Latest cashback & finance offers will appear here

            </p>

          </div>

        ) : (

          offers.map(

            (offer) => (

              <div

                key={offer.id}

                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 p-8 rounded-3xl shadow-2xl text-white"

              >

                {/* GLOW */}

                <div className="absolute top-0 right-0 w-52 h-52 bg-white/20 blur-3xl rounded-full" />


                {/* CONTENT */}

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                  {/* LEFT */}

                  <div className="max-w-3xl">

                    {/* BADGE */}

                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold mb-5">

                      🔥 Limited Time Offer

                    </div>


                    {/* TITLE */}

                    <h2 className="text-4xl md:text-5xl font-black leading-tight">

                      {

                        offer.title

                      }

                    </h2>


                    {/* DESCRIPTION */}

                    <p className="mt-5 text-lg text-white/90 leading-relaxed">

                      {

                        offer.description

                      }

                    </p>


                    {/* DETAILS */}

                    <div className="flex flex-wrap items-center gap-4 mt-6">

                      <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">

                        💰 Cashback:

                        {" "}

                        <span className="font-bold">

                          ₹{

                            offer.cashbackAmount

                          }

                        </span>

                      </div>


                      <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">

                        🎟 Code:

                        {" "}

                        <span className="font-bold uppercase">

                          {

                            offer.code

                          }

                        </span>

                      </div>


                      <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">

                        ⏳ Valid Till:

                        {" "}

                        <span className="font-bold">

                          {

                            new Date(

                              offer.expiryDate

                            ).toLocaleDateString()

                          }

                        </span>

                      </div>

                    </div>

                  </div>


                  {/* RIGHT */}

                  <div className="flex flex-col items-start xl:items-end gap-5">

                    {/* OFFER VALUE */}

                    <div className="bg-white text-black px-8 py-6 rounded-3xl shadow-2xl text-center">

                      <p className="text-zinc-500 font-medium">

                        Cashback

                      </p>


                      <h1 className="text-5xl font-black mt-3">

                        ₹{

                          offer.cashbackAmount

                        }

                      </h1>

                    </div>


                    {/* BUTTON */}

                    <button

                      onClick={() =>
                        claimOffer(
                          offer.id
                        )
                      }

                      disabled={
                        claimingId === offer.id
                      }

                      className="bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

                    >

                      {

                        claimingId === offer.id

                          ? "Claiming..."

                          : "Claim Offer"

                      }

                    </button>

                  </div>

                </div>

              </div>

            )

          )

        )

      }

    </div>

  );

}