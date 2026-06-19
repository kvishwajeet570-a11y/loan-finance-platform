"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ReferralCard() {

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    copied,
    setCopied
  ] = useState(false);


  const [
    referral,
    setReferral
  ] = useState({

    code: "",

    totalReferrals: 0,

    totalEarnings: 0,

    pendingRewards: 0,

  });


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

          setReferral({

            code:
              res.data.referral.code ||

              "",

            totalReferrals:
              res.data.referral.totalReferrals || 0,

            totalEarnings:
              res.data.referral.totalEarnings || 0,

            pendingRewards:
              res.data.referral.pendingRewards || 0,

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
     COPY CODE
  ======================================== */

  const copyCode =
    async () => {

      try {

        await navigator.clipboard.writeText(

          referral.code

        );


        setCopied(true);

        toast.success(

          "Referral code copied 🚀"

        );


        setTimeout(() => {

          setCopied(false);

        }, 2000);

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to copy code"

        );

      }

    };


  /* ========================================
     SHARE REFERRAL
  ======================================== */

  const shareReferral =
    async () => {

      try {

        const shareText =

          `Join now using my referral code ${referral.code} and earn cashback rewards 🎉`;


        if (navigator.share) {

          await navigator.share({

            title:
              "Referral Invite",

            text:
              shareText,

          });

        } else {

          await navigator.clipboard.writeText(

            shareText

          );

          toast.success(

            "Referral message copied"

          );

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

    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-3xl shadow-2xl p-8">

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 blur-3xl rounded-full" />


      {/* HEADER */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold mb-5">

            🎁 Refer & Earn Program

          </div>


          <h2 className="text-5xl font-black leading-tight">

            Invite Friends

            <br />

            Earn Rewards 🚀

          </h2>


          <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">

            Share your referral code with friends and earn instant cashback rewards for every successful signup.

          </p>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-2 gap-5 w-full xl:w-[420px]">

          {/* REFERRALS */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

            <p className="text-white/70 text-sm">

              Referrals

            </p>


            <h2 className="text-4xl font-black mt-3">

              {

                referral.totalReferrals

              }

            </h2>

          </div>


          {/* EARNINGS */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">

            <p className="text-white/70 text-sm">

              Earnings

            </p>


            <h2 className="text-4xl font-black mt-3 text-yellow-300">

              ₹{

                Number(

                  referral.totalEarnings

                ).toLocaleString()

              }

            </h2>

          </div>


          {/* PENDING */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl col-span-2">

            <p className="text-white/70 text-sm">

              Pending Rewards

            </p>


            <h2 className="text-5xl font-black mt-3">

              ₹{

                Number(

                  referral.pendingRewards

                ).toLocaleString()

              }

            </h2>

          </div>

        </div>

      </div>


      {/* REFERRAL CODE SECTION */}

      <div className="relative z-10 mt-10 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          {/* LEFT */}

          <div>

            <p className="text-white/70 mb-3">

              Your Referral Code

            </p>


            {

              loading ? (

                <div className="animate-pulse h-16 w-72 rounded-2xl bg-white/10" />

              ) : (

                <h2 className="text-6xl font-black tracking-[8px]">

                  {

                    referral.code

                  }

                </h2>

              )

            }

          </div>


          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4">

            {/* COPY */}

            <button

              onClick={copyCode}

              disabled={loading}

              className="bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

            >

              {

                copied

                  ? "Copied ✅"

                  : "Copy Code"

              }

            </button>


            {/* SHARE */}

            <button

              onClick={shareReferral}

              disabled={loading}

              className="bg-black/30 hover:bg-black/40 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300"

            >

              Share Invite

            </button>

          </div>

        </div>

      </div>


      {/* BOTTOM BENEFITS */}

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

        {/* BENEFIT 1 */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

          <div className="text-4xl mb-4">

            💸

          </div>


          <h3 className="text-2xl font-black">

            Instant Cashback

          </h3>


          <p className="text-white/70 mt-3 leading-relaxed">

            Earn cashback rewards instantly after successful referrals.

          </p>

        </div>


        {/* BENEFIT 2 */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

          <div className="text-4xl mb-4">

            ⚡

          </div>


          <h3 className="text-2xl font-black">

            Fast Rewards

          </h3>


          <p className="text-white/70 mt-3 leading-relaxed">

            Rewards are automatically credited to your wallet balance.

          </p>

        </div>


        {/* BENEFIT 3 */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

          <div className="text-4xl mb-4">

            🚀

          </div>


          <h3 className="text-2xl font-black">

            Unlimited Referrals

          </h3>


          <p className="text-white/70 mt-3 leading-relaxed">

            Invite unlimited friends and maximize your earnings potential.

          </p>

        </div>

      </div>

    </div>

  );

}