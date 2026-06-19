"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  Wallet,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Plus,
  TrendingUp,
  Activity,

} from "lucide-react";


export default function WalletCard() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    showBalance,
    setShowBalance
  ] = useState(true);


  const [
    wallet,
    setWallet
  ] = useState({

    balance: 0,

    monthlyIncome: 0,

    monthlyExpense: 0,

    cashback: 0,

  });


  /* ========================================
     FETCH WALLET
  ======================================== */

  const fetchWallet =
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

          setWallet({

            balance:
              res.data.wallet.balance || 0,

            monthlyIncome:
              res.data.wallet.monthlyIncome || 0,

            monthlyExpense:
              res.data.wallet.monthlyExpense || 0,

            cashback:
              res.data.wallet.cashback || 0,

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

    fetchWallet();

  }, []);


  return (

    <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] border border-white/10 p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[220px] h-[220px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex items-start justify-between">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold">

            <Sparkles size={15} />

            Secure Wallet

          </div>


          <h2 className="text-3xl font-black text-white mt-6">

            Wallet Balance

          </h2>


          <p className="text-slate-400 mt-3 text-lg">

            Real-time digital wallet overview

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchWallet}

          className="group w-14 h-14 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 flex items-center justify-center text-white transition-all duration-300"

        >

          <RefreshCcw

            size={20}

            className="group-hover:rotate-180 transition-all duration-500"

          />

        </button>

      </div>


      {/* ========================================
          MAIN WALLET CARD
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 mt-8 text-white shadow-2xl">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-white/10 blur-[100px] rounded-full" />


        <div className="relative z-10">

          {/* TOP */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">

                <Wallet size={38} />

              </div>


              <div>

                <p className="text-white/70 text-lg">

                  Available Balance

                </p>


                {

                  loading ? (

                    <div className="w-48 h-14 bg-white/10 rounded-2xl animate-pulse mt-4" />

                  ) : (

                    <h1 className="text-5xl md:text-6xl font-black mt-3 tracking-tight">

                      {

                        showBalance

                          ? `₹${wallet.balance.toLocaleString()}`

                          : "₹ ••••••"

                      }

                    </h1>

                  )

                }

              </div>

            </div>


            {/* SHOW HIDE */}

            <button

              onClick={() =>

                setShowBalance(

                  !showBalance

                )
              }

              className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300"

            >

              {

                showBalance ? (

                  <EyeOff size={22} />

                ) : (

                  <Eye size={22} />

                )

              }

            </button>

          </div>


          {/* CARD NUMBER */}

          <div className="mt-10 flex items-center justify-between">

            <div>

              <p className="text-white/70 text-sm">

                Virtual Wallet ID

              </p>


              <h3 className="text-2xl font-black tracking-[4px] mt-2">

                4587 •••• 2254

              </h3>

            </div>


            <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">

              <div className="flex items-center gap-2 text-sm font-bold">

                <ShieldCheck size={16} />

                Protected

              </div>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="grid grid-cols-2 gap-5 mt-10">

            <button className="flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black hover:opacity-90 transition-all duration-300 shadow-2xl">

              <Plus size={20} />

              Add Money

            </button>


            <button className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-2xl font-black transition-all duration-300 backdrop-blur-xl">

              <CreditCard size={20} />

              Withdraw

            </button>

          </div>

        </div>

      </div>


      {/* ========================================
          ANALYTICS GRID
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        {/* INCOME */}

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-xl">

                <ArrowUpRight size={26} />

              </div>


              <span className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">

                Credit

              </span>

            </div>


            <p className="text-slate-400 mt-8">

              Monthly Income

            </p>


            {

              loading ? (

                <div className="w-28 h-10 bg-white/10 rounded-xl animate-pulse mt-3" />

              ) : (

                <h3 className="text-4xl font-black text-white mt-3">

                  ₹{

                    wallet.monthlyIncome.toLocaleString()

                  }

                </h3>

              )

            }

          </div>

        </div>


        {/* EXPENSE */}

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-xl">

                <ArrowDownLeft size={26} />

              </div>


              <span className="bg-red-500/10 border border-red-400/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold">

                Debit

              </span>

            </div>


            <p className="text-slate-400 mt-8">

              Monthly Expense

            </p>


            {

              loading ? (

                <div className="w-28 h-10 bg-white/10 rounded-xl animate-pulse mt-3" />

              ) : (

                <h3 className="text-4xl font-black text-white mt-3">

                  ₹{

                    wallet.monthlyExpense.toLocaleString()

                  }

                </h3>

              )

            }

          </div>

        </div>


        {/* CASHBACK */}

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-xl">

                <TrendingUp size={26} />

              </div>


              <span className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold">

                Rewards

              </span>

            </div>


            <p className="text-slate-400 mt-8">

              Cashback Earned

            </p>


            {

              loading ? (

                <div className="w-28 h-10 bg-white/10 rounded-xl animate-pulse mt-3" />

              ) : (

                <h3 className="text-4xl font-black text-white mt-3">

                  ₹{

                    wallet.cashback.toLocaleString()

                  }

                </h3>

              )

            }

          </div>

        </div>

      </div>


      {/* ========================================
          FOOTER STATUS
      ======================================== */}

      <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">

            <ShieldCheck size={28} />

          </div>


          <div>

            <h3 className="text-white font-black text-xl">

              Wallet Protected

            </h3>


            <p className="text-slate-400 mt-1">

              End-to-end encrypted financial protection

            </p>

          </div>

        </div>


        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-400/20 px-5 py-3 rounded-2xl text-emerald-400 font-bold">

          <Activity size={18} />

          Wallet Active & Secure

        </div>

      </div>

    </div>

  );

}