"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function PromoSlider() {

  const [
    offers,
    setOffers
  ] = useState([]);


  const [
    currentSlide,
    setCurrentSlide
  ] = useState(0);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH PROMOTIONS
  ======================================== */

  const fetchPromotions =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/promotion/trending"

          );


        if (res.data.success) {

          setOffers(

            res.data.promotions

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch promotions"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     AUTO SLIDER
  ======================================== */

  useEffect(() => {

    fetchPromotions();

  }, []);


  useEffect(() => {

    if (offers.length === 0) return;


    const interval =
      setInterval(() => {

        setCurrentSlide(

          (prev) =>

            prev ===

            offers.length - 1

              ? 0

              : prev + 1

        );

      }, 4000);


    return () =>
      clearInterval(interval);

  }, [offers]);


  /* ========================================
     NEXT SLIDE
  ======================================== */

  const nextSlide = () => {

    setCurrentSlide(

      currentSlide ===

        offers.length - 1

        ? 0

        : currentSlide + 1

    );

  };


  /* ========================================
     PREVIOUS SLIDE
  ======================================== */

  const prevSlide = () => {

    setCurrentSlide(

      currentSlide === 0

        ? offers.length - 1

        : currentSlide - 1

    );

  };


  return (

    <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white rounded-3xl shadow-2xl p-6">

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />


      {/* HEADER */}

      <div className="relative z-10 flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-black">

            Trending Offers

          </h2>

          <p className="text-zinc-400 mt-2">

            Live cashback & reward promotions 🎉

          </p>

        </div>


        <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold">

          Live Offers

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="animate-pulse h-[320px] rounded-3xl bg-white/5" />

        ) : offers.length === 0 ? (

          <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center">

            <h3 className="text-2xl font-bold">

              No Offers Available

            </h3>

            <p className="text-zinc-400 mt-3">

              Promotions will appear here

            </p>

          </div>

        ) : (

          <>

            {/* SLIDER */}

            <div className="relative h-[340px] overflow-hidden rounded-3xl">

              {

                offers.map(

                  (

                    offer,
                    index

                  ) => (

                    <div

                      key={offer.id}

                      className={`absolute inset-0 transition-all duration-700 ${

                        currentSlide === index

                          ? "opacity-100 translate-x-0"

                          : index < currentSlide

                          ? "opacity-0 -translate-x-full"

                          : "opacity-0 translate-x-full"

                      }`}

                    >

                      <div className={`relative overflow-hidden h-full rounded-3xl p-8 bg-gradient-to-br ${

                        offer.gradient ||

                        "from-purple-600 via-blue-600 to-cyan-500"

                      }`}>

                        {/* INNER GLOW */}

                        <div className="absolute top-0 right-0 w-52 h-52 bg-white/20 blur-3xl rounded-full" />


                        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between h-full gap-8">

                          {/* LEFT */}

                          <div className="max-w-3xl">

                            {/* BADGE */}

                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold mb-5">

                              🔥 Trending Offer

                            </div>


                            {/* TITLE */}

                            <h2 className="text-5xl font-black leading-tight">

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


                            {/* TAGS */}

                            <div className="flex flex-wrap items-center gap-4 mt-6">

                              <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">

                                🎁 Cashback:

                                {" "}

                                <span className="font-bold">

                                  ₹{

                                    offer.cashback

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

                            {/* VALUE */}

                            <div className="bg-white text-black px-8 py-6 rounded-3xl shadow-2xl text-center">

                              <p className="text-zinc-500 font-medium">

                                Cashback

                              </p>


                              <h1 className="text-6xl font-black mt-3">

                                ₹{

                                  offer.cashback

                                }

                              </h1>

                            </div>


                            {/* BUTTON */}

                            <button className="bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl">

                              Claim Offer

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  )

                )

              }

            </div>


            {/* CONTROLS */}

            <div className="flex items-center justify-between mt-8">

              {/* LEFT */}

              <div className="flex items-center gap-3">

                <button

                  onClick={prevSlide}

                  className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center text-2xl transition-all duration-300"

                >

                  ←

                </button>


                <button

                  onClick={nextSlide}

                  className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center text-2xl transition-all duration-300"

                >

                  →

                </button>

              </div>


              {/* DOTS */}

              <div className="flex items-center gap-3">

                {

                  offers.map(

                    (

                      _,
                      index

                    ) => (

                      <button

                        key={index}

                        onClick={() =>
                          setCurrentSlide(
                            index
                          )
                        }

                        className={`transition-all duration-300 rounded-full ${

                          currentSlide === index

                            ? "w-10 h-3 bg-cyan-400"

                            : "w-3 h-3 bg-white/30"

                        }`}

                      />

                    )

                  )

                }

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}