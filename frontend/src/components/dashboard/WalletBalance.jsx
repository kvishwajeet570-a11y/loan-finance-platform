"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  BadgeIndianRupee,
  TrendingUp,
  Sparkles,
  RefreshCcw,
  ShieldCheck,
  Activity,
  Plus,

} from "lucide-react";


export default function WalletBalance() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    walletData,
    setWalletData
  ] = useState({

    balance: 0,

    cashback: 0,

    monthlyIncome: 0,

    monthlyExpense: 0,

    transactions: 0,

  });


  /* ========================================
     FETCH WALLET
  ======================================== */

  const fetchWalletData =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        const res =
          await api.get(

            `/wallet/${userId}`

          );


        if (res.data.success) {

          setWalletData({

            balance:
              res.data.wallet.balance || 0,

            cashback:
              res.data.wallet.cashback || 0,

            monthlyIncome:
              res.data.wallet.monthlyIncome || 0,

            monthlyExpense:
              res.data.wallet.monthlyExpense || 0,

            transactions:
              res.data.wallet.transactions || 0,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load wallet"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchWalletData();

  }, []);


  return (

    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            Smart Wallet System

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Wallet Balance

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Monitor wallet funds, cashback earnings,
            monthly transactions & financial activity.

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchWalletData}

          className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh Wallet

        </button>

      </div>


      {/* ========================================
          MAIN CARD
      ======================================== */}

      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 lg:p-10 text-white shadow-2xl">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-white/10 blur-[120px] rounded-full" />


        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 rounded-full text-sm font-semibold backdrop-blur-xl">

              <ShieldCheck size={18} />

              Secure Digital Wallet

            </div>


            <h2 className="text-2xl font-semibold text-white/80 mt-8">

              Available Balance

            </h2>


            {

              loading ? (

                <div className="w-56 h-16 bg-white/10 rounded-2xl animate-pulse mt-5" />

              ) : (

                <h1 className="text-6xl md:text-7xl font-black mt-5 tracking-tight">

                  ₹{

                    walletData.balance.toLocaleString()

                  }

                </h1>

              )

            }


            <div className="flex items-center gap-4 mt-8">

              <button className="flex items-center gap-3 bg-white text-black px-6 py-4 rounded-2xl font-black hover:opacity-90 transition-all duration-300 shadow-2xl">

                <Plus size={20} />

                Add Money

              </button>


              <button className="flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-4 rounded-2xl font-black hover:bg-white/20 transition-all duration-300 backdrop-blur-xl">

                <CreditCard size={20} />

                Withdraw

              </button>

            </div>

          </div>


          {/* RIGHT */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full xl:max-w-[480px]">

            {/* CASHBACK */}

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">

              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <BadgeIndianRupee size={28} />

                </div>


                <span className="text-emerald-300 text-sm font-bold">

                  +12%

                </span>

              </div>


              <p className="text-white/70 mt-6">

                Cashback Earned

              </p>


              {

                loading ? (

                  <div className="w-24 h-10 bg-white/10 rounded-xl animate-pulse mt-3" />

                ) : (

                  <h3 className="text-4xl font-black mt-3">

                    ₹{

                      walletData.cashback.toLocaleString()

                    }

                  </h3>

                )

              }

            </div>


            {/* TRANSACTIONS */}

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">

              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Activity size={28} />

                </div>


                <span className="text-cyan-300 text-sm font-bold">

                  Live

                </span>

              </div>


              <p className="text-white/70 mt-6">

                Transactions

              </p>


              {

                loading ? (

                  <div className="w-24 h-10 bg-white/10 rounded-xl animate-pulse mt-3" />

                ) : (

                  <h3 className="text-4xl font-black mt-3">

                    {

                      walletData.transactions.toLocaleString()

                    }

                  </h3>

                )

              }

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          ANALYTICS GRID
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        {/* MONTHLY INCOME */}

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-xl">

                <ArrowUpRight size={30} />

              </div>


              <span className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">

                Income

              </span>

            </div>


            <p className="text-slate-400 mt-8 text-lg">

              Monthly Credit

            </p>


            {

              loading ? (

                <div className="w-32 h-12 bg-white/10 rounded-xl animate-pulse mt-3" />

              ) : (

                <h2 className="text-4xl font-black text-white mt-3">

                  ₹{

                    walletData.monthlyIncome.toLocaleString()

                  }

                </h2>

              )

            }

          </div>

        </div>


        {/* MONTHLY EXPENSE */}

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-28 h-28 bg-red-500/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-xl">

                <ArrowDownLeft size={30} />

              </div>


              <span className="bg-red-500/10 border border-red-400/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold">

                Expense

              </span>

            </div>


            <p className="text-slate-400 mt-8 text-lg">

              Monthly Debit

            </p>


            {

              loading ? (

                <div className="w-32 h-12 bg-white/10 rounded-xl animate-pulse mt-3" />

              ) : (

                <h2 className="text-4xl font-black text-white mt-3">

                  ₹{

                    walletData.monthlyExpense.toLocaleString()

                  }

                </h2>

              )

            }

          </div>

        </div>


        {/* GROWTH */}

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-xl">

                <TrendingUp size={30} />

              </div>


              <span className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold">

                +18%

              </span>

            </div>


            <p className="text-slate-400 mt-8 text-lg">

              Wallet Growth

            </p>


            <h2 className="text-4xl font-black text-white mt-3">

              Excellent

            </h2>

          </div>

        </div>


        {/* STATUS */}

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-white shadow-xl">

                <ShieldCheck size={30} />

              </div>


              <span className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">

                Active

              </span>

            </div>


            <p className="text-slate-400 mt-8 text-lg">

              Wallet Security

            </p>


            <h2 className="text-4xl font-black text-white mt-3">

              Protected

            </h2>

          </div>

        </div>

      </div>

    </div>

  );

}