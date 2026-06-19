"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function InviteFriends() {

  const [
    referralData,
    setReferralData
  ] = useState({

    referralCode: "",

    totalReferrals: 0,

    totalRewards: 0,

    referralLink: "",

  });


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH REFERRAL DATA
  ======================================== */

  const fetchReferralData =
    async () => {

      try {

        setLoading(true);

        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        const res =
          await api.get(

            `/referral/${userId}`

          );


        if (res.data.success) {

          setReferralData({

            referralCode:
              res.data.referral.code ||

              "",

            totalReferrals:
              res.data.referral.totalReferrals ||

              0,

            totalRewards:
              res.data.referral.totalRewards ||

              0,

            referralLink:
              res.data.referral.link ||

              "",

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch referral data"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     COPY REFERRAL CODE
  ======================================== */

  const copyCode =
    async () => {

      try {

        await navigator.clipboard.writeText(

          referralData.referralCode

        );

        toast.success(

          "Referral code copied"

        );

      } catch (error) {

        console.log(error);

      }

    };


  /* ========================================
     COPY REFERRAL LINK
  ======================================== */

  const copyLink =
    async () => {

      try {

        await navigator.clipboard.writeText(

          referralData.referralLink

        );

        toast.success(

          "Referral link copied"

        );

      } catch (error) {

        console.log(error);

      }

    };


  /* ========================================
     SHARE REFERRAL
  ======================================== */

  const shareReferral =
    async () => {

      try {

        if (navigator.share) {

          await navigator.share({

            title:
              "Join Our Fintech Platform",

            text:
              `Use my referral code ${referralData.referralCode} and earn cashback rewards 🚀`,

            url:
              referralData.referralLink,

          });

        } else {

          copyLink();

        }

      } catch (error) {

        console.log(error);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchReferralData();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Invite Friends

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Invite friends & earn cashback rewards 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          Referral Program

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

                    className="animate-pulse h-36 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <>

            {/* MAIN CARD */}

            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-8 rounded-3xl shadow-2xl">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full" />


              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                {/* LEFT */}

                <div>

                  <p className="text-white/80 text-lg">

                    Your Referral Code

                  </p>


                  <h1 className="text-5xl font-black tracking-widest mt-4">

                    {

                      referralData.referralCode

                    }

                  </h1>


                  <p className="mt-5 text-white/80 max-w-xl">

                    Share this referral code with friends and earn cashback rewards on every successful signup.

                  </p>

                </div>


                {/* BUTTON */}

                <button

                  onClick={copyCode}

                  className="bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

                >

                  Copy Code

                </button>

              </div>

            </div>


            {/* STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* REFERRALS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />


                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">

                  👥

                </div>


                <p className="text-zinc-400">

                  Total Referrals

                </p>


                <h2 className="text-5xl font-bold text-cyan-400 mt-4">

                  {

                    referralData.totalReferrals

                  }

                </h2>

              </div>


              {/* REWARDS */}

              <div className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 blur-3xl rounded-full" />


                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-5">

                  💰

                </div>


                <p className="text-zinc-400">

                  Total Rewards

                </p>


                <h2 className="text-5xl font-bold text-green-400 mt-4">

                  ₹{

                    Number(

                      referralData.totalRewards

                    ).toLocaleString()

                  }

                </h2>

              </div>

            </div>


            {/* REFERRAL LINK */}

            <div className="mt-6 bg-zinc-100 dark:bg-zinc-800 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-700">

              <h3 className="text-xl font-bold text-black dark:text-white mb-4">

                Referral Link

              </h3>


              <div className="flex flex-col lg:flex-row gap-4">

                <input
                  type="text"
                  readOnly
                  value={
                    referralData.referralLink
                  }
                  className="flex-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white p-4 rounded-2xl outline-none"
                />


                <button

                  onClick={copyLink}

                  className="bg-black hover:bg-zinc-800 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"

                >

                  Copy Link

                </button>


                <button

                  onClick={shareReferral}

                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"

                >

                  Share Now

                </button>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}