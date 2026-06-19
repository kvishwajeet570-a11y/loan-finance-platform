"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function RechargeForm() {

  const router =
    useRouter();


  const [
    mobile,
    setMobile
  ] = useState("");


  const [
    amount,
    setAmount
  ] = useState("");


  const [
    operator,
    setOperator
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    operators,
    setOperators
  ] = useState([]);


  const [
    walletBalance,
    setWalletBalance
  ] = useState(0);


  /* ========================================
     FETCH OPERATORS
  ======================================== */

  const fetchOperators =
    async () => {

      try {

        const res =
          await api.get(

            "/recharge/operators"

          );


        if (res.data.success) {

          setOperators(

            res.data.operators

          );

        }

      } catch (error) {

        console.log(error);

      }

    };


  /* ========================================
     FETCH WALLET
  ======================================== */

  const fetchWallet =
    async () => {

      try {

        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          return;

        }


        const res =
          await api.get(

            `/wallet/${userId}`

          );


        if (res.data.success) {

          setWalletBalance(

            res.data.wallet.balance || 0

          );

        }

      } catch (error) {

        console.log(error);

      }

    };


  /* ========================================
     AUTO DETECT OPERATOR
  ======================================== */

  const detectOperator =
    (number) => {

      if (

        number.startsWith("98") ||

        number.startsWith("99")

      ) {

        setOperator("Jio");

      }

      else if (

        number.startsWith("88") ||

        number.startsWith("89")

      ) {

        setOperator("Airtel");

      }

      else if (

        number.startsWith("78") ||

        number.startsWith("79")

      ) {

        setOperator("Vi");

      }

      else if (

        number.startsWith("94") ||

        number.startsWith("95")

      ) {

        setOperator("BSNL");

      }

    };


  /* ========================================
     HANDLE MOBILE CHANGE
  ======================================== */

  const handleMobileChange =
    (e) => {

      const value =
        e.target.value;

      setMobile(value);

      if (value.length >= 2) {

        detectOperator(value);

      }

    };


  /* ========================================
     HANDLE RECHARGE
  ======================================== */

  const handleRecharge =
    async () => {

      try {

        if (

          !mobile ||

          !amount ||

          !operator

        ) {

          toast.error(

            "Please fill all fields"

          );

          return;

        }


        if (

          mobile.length !== 10

        ) {

          toast.error(

            "Invalid mobile number"

          );

          return;

        }


        if (

          Number(amount) < 10

        ) {

          toast.error(

            "Minimum recharge is ₹10"

          );

          return;

        }


        if (

          Number(amount) >

          walletBalance

        ) {

          toast.error(

            "Insufficient wallet balance"

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

            "/recharge/mobile",

            {

              userId,

              mobile,

              operator,

              amount:
                Number(amount),

            }

          );


        if (res.data.success) {

          toast.success(

            "Recharge successful 🚀"

          );


          setMobile("");

          setAmount("");

          setOperator("");


          fetchWallet();


          setTimeout(() => {

            router.push(

              "/dashboard/recharge-history"

            );

          }, 1500);

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


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchOperators();

    fetchWallet();

  }, []);


  return (

    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6">

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />


      {/* HEADER */}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-4xl font-black text-black dark:text-white">

            Instant Recharge

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Mobile recharge with secure wallet payments ⚡

          </p>

        </div>


        {/* WALLET */}

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 py-4 rounded-3xl shadow-xl min-w-[260px]">

          <p className="text-white/80 text-sm">

            Wallet Balance

          </p>


          <h2 className="text-4xl font-black mt-2">

            ₹{

              Number(

                walletBalance

              ).toLocaleString()

            }

          </h2>

        </div>

      </div>


      {/* FORM */}

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* LEFT */}

        <div className="space-y-6">

          {/* MOBILE */}

          <div>

            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">

              Mobile Number

            </label>


            <input

              type="number"

              value={mobile}

              onChange={handleMobileChange}

              placeholder="Enter Mobile Number"

              className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white p-5 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"

            />

          </div>


          {/* OPERATOR */}

          <div>

            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">

              Operator

            </label>


            <select

              value={operator}

              onChange={(e) =>
                setOperator(
                  e.target.value
                )
              }

              className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white p-5 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"

            >

              <option value="">

                Select Operator

              </option>


              {

                operators.map(

                  (item) => (

                    <option

                      key={item.id}

                      value={item.name}

                    >

                      {

                        item.name

                      }

                    </option>

                  )

                )

              }

            </select>

          </div>


          {/* AMOUNT */}

          <div>

            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">

              Recharge Amount

            </label>


            <input

              type="number"

              value={amount}

              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }

              placeholder="Enter Recharge Amount"

              className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white p-5 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"

            />

          </div>


          {/* QUICK AMOUNTS */}

          <div>

            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">

              Quick Recharge

            </p>


            <div className="grid grid-cols-4 gap-3">

              {

                [

                  199,
                  299,
                  399,
                  599,

                ].map(

                  (price) => (

                    <button

                      key={price}

                      onClick={() =>
                        setAmount(
                          String(price)
                        )
                      }

                      className="bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 py-4 rounded-2xl font-bold"

                    >

                      ₹{price}

                    </button>

                  )

                )

              }

            </div>

          </div>


          {/* BUTTON */}

          <button

            onClick={handleRecharge}

            disabled={loading}

            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

          >

            {

              loading

                ? "Processing Recharge..."

                : "Recharge Now"

            }

          </button>

        </div>


        {/* RIGHT */}

        <div className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-3xl p-8 text-white shadow-2xl">

          {/* GLOW */}

          <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-500/20 blur-3xl rounded-full" />


          <div className="relative z-10">

            {/* TITLE */}

            <div className="mb-8">

              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-semibold mb-5">

                ⚡ Fast Recharge

              </div>


              <h2 className="text-5xl font-black leading-tight">

                Smart Recharge

                <span className="text-cyan-400">

                  {" "}System

                </span>

              </h2>


              <p className="text-zinc-400 mt-5 leading-relaxed">

                Secure & instant recharge processing with cashback rewards and live wallet deduction.

              </p>

            </div>


            {/* LIVE PREVIEW */}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

              <p className="text-zinc-400">

                Recharge Preview

              </p>


              <div className="mt-6 space-y-5">

                <div className="flex justify-between items-center">

                  <span className="text-zinc-400">

                    Mobile

                  </span>


                  <span className="font-bold">

                    {

                      mobile ||

                      "----------"

                    }

                  </span>

                </div>


                <div className="flex justify-between items-center">

                  <span className="text-zinc-400">

                    Operator

                  </span>


                  <span className="font-bold text-cyan-400">

                    {

                      operator ||

                      "--"

                    }

                  </span>

                </div>


                <div className="flex justify-between items-center">

                  <span className="text-zinc-400">

                    Recharge Amount

                  </span>


                  <span className="font-black text-3xl text-green-400">

                    ₹{

                      amount || 0

                    }

                  </span>

                </div>

              </div>

            </div>


            {/* FEATURES */}

            <div className="grid grid-cols-2 gap-4 mt-6">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                <div className="text-3xl mb-3">

                  🔒

                </div>

                <h3 className="font-bold">

                  Secure Payment

                </h3>

              </div>


              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                <div className="text-3xl mb-3">

                  🎁

                </div>

                <h3 className="font-bold">

                  Cashback Rewards

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}