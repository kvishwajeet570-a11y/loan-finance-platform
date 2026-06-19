"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  RefreshCcw,
  Sparkles,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  CreditCard,
  Smartphone,
  BadgeIndianRupee,
  TrendingUp,
  Activity,
  Download,

} from "lucide-react";


export default function WalletTransactions() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    transactions,
    setTransactions
  ] = useState([]);


  const [
    search,
    setSearch
  ] = useState("");


  const [
    filter,
    setFilter
  ] = useState("all");


  /* ========================================
     FETCH TRANSACTIONS
  ======================================== */

  const fetchTransactions =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        const res =
          await api.get(

            `/wallet/transactions/${userId}`

          );


        if (res.data.success) {

          setTransactions(

            res.data.transactions || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load transactions"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchTransactions();

  }, []);


  /* ========================================
     FILTERED TRANSACTIONS
  ======================================== */

  const filteredTransactions =
    useMemo(() => {

      return transactions.filter(

        (item) => {

          const matchesSearch =

            item.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );


          const matchesFilter =

            filter === "all"

              ? true

              : item.type === filter;


          return (

            matchesSearch &&
            matchesFilter

          );

        }

      );

    }, [

      transactions,
      search,
      filter,

    ]);


  /* ========================================
     TOTALS
  ======================================== */

  const totalCredit =
    transactions

      .filter(

        (item) =>

          item.type === "credit"

      )

      .reduce(

        (acc, item) =>

          acc + item.amount,

        0

      );


  const totalDebit =
    transactions

      .filter(

        (item) =>

          item.type === "debit"

      )

      .reduce(

        (acc, item) =>

          acc + item.amount,

        0

      );


  /* ========================================
     GET ICON
  ======================================== */

  const getTransactionIcon =
    (category) => {

      switch (category) {

        case "wallet":

          return (

            <Wallet size={24} />

          );


        case "mobile":

          return (

            <Smartphone size={24} />

          );


        case "card":

          return (

            <CreditCard size={24} />

          );


        default:

          return (

            <BadgeIndianRupee size={24} />

          );

      }

    };


  return (

    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            Real-Time Financial Tracking

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Wallet Transactions

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Monitor all wallet activities, recharge payments,
            money transfers & financial operations live.

          </p>

        </div>


        {/* ACTIONS */}

        <div className="flex flex-wrap gap-4">

          <button className="flex items-center gap-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300">

            <Download size={18} />

            Export Report

          </button>


          <button

            onClick={fetchTransactions}

            className="group flex items-center gap-3 bg-cyan-500 text-white px-6 py-4 rounded-2xl font-bold hover:opacity-90 transition-all duration-300 shadow-2xl"

          >

            <RefreshCcw

              size={18}

              className="group-hover:rotate-180 transition-all duration-500"

            />

            Refresh

          </button>

        </div>

      </div>


      {/* ========================================
          ANALYTICS CARDS
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* CREDIT */}

        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <ArrowUpRight size={42} />


            <p className="text-white/80 mt-8 text-lg">

              Total Credit

            </p>


            <h2 className="text-5xl font-black mt-3">

              ₹{

                totalCredit.toLocaleString()

              }

            </h2>

          </div>

        </div>


        {/* DEBIT */}

        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-red-500 to-rose-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <ArrowDownLeft size={42} />


            <p className="text-white/80 mt-8 text-lg">

              Total Debit

            </p>


            <h2 className="text-5xl font-black mt-3">

              ₹{

                totalDebit.toLocaleString()

              }

            </h2>

          </div>

        </div>


        {/* TOTAL */}

        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <TrendingUp size={42} />


            <p className="text-white/80 mt-8 text-lg">

              Transactions

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                transactions.length

              }

            </h2>

          </div>

        </div>

      </div>


      {/* ========================================
          FILTER SECTION
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 mb-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* SEARCH */}

          <div className="flex items-center gap-3 bg-[#0f172a] border border-white/10 px-5 py-4 rounded-2xl">

            <Search
              size={20}
              className="text-slate-400"
            />


            <input

              type="text"

              value={search}

              onChange={(e) =>

                setSearch(
                  e.target.value
                )
              }

              placeholder="Search transactions..."

              className="bg-transparent outline-none text-white placeholder:text-slate-400 w-full"

            />

          </div>


          {/* FILTER */}

          <div className="flex items-center gap-3 bg-[#0f172a] border border-white/10 px-5 py-4 rounded-2xl">

            <Filter
              size={20}
              className="text-slate-400"
            />


            <select

              value={filter}

              onChange={(e) =>

                setFilter(
                  e.target.value
                )
              }

              className="bg-transparent outline-none text-white w-full"

            >

              <option
                value="all"
                className="bg-black"
              >

                All Transactions

              </option>

              <option
                value="credit"
                className="bg-black"
              >

                Credit

              </option>

              <option
                value="debit"
                className="bg-black"
              >

                Debit

              </option>

            </select>

          </div>


          {/* LIVE */}

          <div className="flex items-center justify-center gap-3 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl px-5 py-4 text-cyan-400 font-bold">

            <Activity size={20} />

            Live Transaction Monitoring

          </div>

        </div>

      </div>


      {/* ========================================
          TRANSACTION LIST
      ======================================== */}

      <div className="space-y-5">

        {

          loading ? (

            <div className="space-y-5">

              {

                [1, 2, 3, 4].map(

                  (item) => (

                    <div

                      key={item}

                      className="animate-pulse h-32 rounded-[30px] bg-white/5"

                    />

                  )

                )

              }

            </div>

          ) : filteredTransactions.length === 0 ? (

            <div className="flex flex-col items-center justify-center text-center py-24 bg-white/5 border border-white/10 rounded-[32px]">

              <XCircle
                size={70}
                className="text-slate-500"
              />


              <h3 className="text-3xl font-black text-white mt-8">

                No Transactions Found

              </h3>


              <p className="text-slate-400 mt-4 max-w-lg">

                No wallet transactions available for selected filters.

              </p>

            </div>

          ) : (

            filteredTransactions.map(

              (item, index) => (

                <div

                  key={index}

                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:border-cyan-400/20 transition-all duration-300 hover:-translate-y-1"

                >

                  {/* GLOW */}

                  <div className="absolute top-0 right-0 w-[160px] h-[160px] bg-cyan-500/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />


                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* LEFT */}

                    <div className="flex items-center gap-5">

                      {/* ICON */}

                      <div

                        className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${
                          item.type === "credit"

                            ? "bg-gradient-to-br from-emerald-500 to-green-700 text-white"

                            : "bg-gradient-to-br from-red-500 to-rose-700 text-white"
                        }`}

                      >

                        {

                          getTransactionIcon(
                            item.category
                          )

                        }

                      </div>


                      {/* INFO */}

                      <div>

                        <h3 className="text-2xl font-black text-white">

                          {item.title}

                        </h3>


                        <p className="text-slate-400 mt-2">

                          {

                            item.description ||

                            "Transaction completed successfully"

                          }

                        </p>


                        <div className="flex flex-wrap items-center gap-4 mt-5">

                          <div className="flex items-center gap-2 text-slate-400 text-sm">

                            <CalendarDays size={16} />

                            {

                              item.date ||

                              "12 May 2026"

                            }

                          </div>


                          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">

                            <CheckCircle2 size={16} />

                            {

                              item.status ||

                              "Success"

                            }

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* RIGHT */}

                    <div className="text-right">

                      <h2

                        className={`text-4xl font-black ${
                          item.type === "credit"

                            ? "text-emerald-400"

                            : "text-red-400"
                        }`}

                      >

                        {

                          item.type === "credit"

                            ? "+"

                            : "-"
                        }

                        ₹{

                          item.amount.toLocaleString()

                        }

                      </h2>


                      <div

                        className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold border ${
                          item.type === "credit"

                            ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-400"

                            : "bg-red-500/10 border-red-400/20 text-red-400"
                        }`}

                      >

                        {

                          item.type === "credit"

                            ? (

                              <ArrowUpRight size={16} />

                            ) : (

                              <ArrowDownLeft size={16} />

                            )

                        }

                        {

                          item.type === "credit"

                            ? "Money Added"

                            : "Money Spent"

                        }

                      </div>

                    </div>

                  </div>

                </div>

              )

            )

          )

        }

      </div>


      {/* ========================================
          FOOTER
      ======================================== */}

      <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">

            <Wallet size={28} />

          </div>


          <div>

            <h3 className="text-white font-black text-xl">

              Smart Financial Monitoring

            </h3>


            <p className="text-slate-400 mt-1">

              AI-powered wallet transaction analytics & live tracking.

            </p>

          </div>

        </div>


        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-400/20 px-5 py-3 rounded-2xl text-emerald-400 font-bold">

          <Clock3 size={18} />

          Transactions Synced Live

        </div>

      </div>

    </div>

  );

}