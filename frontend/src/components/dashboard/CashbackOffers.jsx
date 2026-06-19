"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function CashbackOffers() {

  const [
    offers,
    setOffers
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH CASHBACK OFFERS
  ======================================== */

  const fetchOffers =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/cashback"

          );


        if (res.data.success) {

          setOffers(

            res.data.offers

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch cashback offers"

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


        const res =
          await api.post(

            "/cashback/claim",

            {

              userId,

              offerId,

            }

          );


        if (res.data.success) {

          toast.success(

            "Cashback claimed successfully"

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to claim cashback"

        );

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchOffers();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Cashback Offers

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1">

            Earn rewards on transactions 🚀

          </p>

        </div>

        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          {
            offers.length
          } Offers

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

                    className="animate-pulse h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : offers.length === 0 ? (

          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-10 text-center">

            <h3 className="text-2xl font-bold text-black dark:text-white">

              No Cashback Offers

            </h3>

            <p className="text-zinc-500 mt-2">

              New cashback campaigns will appear here

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {

              offers.map(

                (offer) => (

                  <div

                    key={offer.id}

                    className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300"

                  >

                    {/* GLOW */}

                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/20 blur-3xl rounded-full" />


                    {/* TOP */}

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="text-2xl font-bold">

                          {
                            offer.title
                          }

                        </h3>

                        <p className="text-zinc-300 mt-2">

                          {
                            offer.description
                          }

                        </p>

                      </div>


                      <div className="bg-green-500 text-white px-4 py-2 rounded-2xl text-sm font-bold">

                        {
                          offer.cashback
                        }%

                      </div>

                    </div>


                    {/* MINIMUM */}

                    <div className="mt-6">

                      <p className="text-zinc-400 text-sm">

                        Minimum Amount

                      </p>

                      <h2 className="text-3xl font-bold text-green-400 mt-2">

                        ₹{
                          offer.minimumAmount
                        }

                      </h2>

                    </div>


                    {/* VALIDITY */}

                    <div className="mt-4 text-zinc-300">

                      ⏳ Valid Till:

                      {" "}

                      {

                        new Date(

                          offer.expiryDate

                        ).toLocaleDateString()

                      }

                    </div>


                    {/* BUTTON */}

                    <button

                      onClick={() =>
                        claimOffer(
                          offer.id
                        )
                      }

                      className="w-full mt-8 bg-white text-black hover:bg-zinc-200 py-4 rounded-2xl font-bold transition-all duration-300"

                    >

                      Claim Cashback

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