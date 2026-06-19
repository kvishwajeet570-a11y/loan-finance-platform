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
  Search,
  Filter,
  RefreshCcw,
  Sparkles,
  CalendarDays,
  CreditCard,
  Smartphone,
  BadgeIndianRupee,
  TrendingUp,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,

} from "lucide-react";


export default function WalletHistory() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    history,
    setHistory
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
     FETCH HISTORY
  ======================================== */

  const fetchWalletHistory =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        const res =
          await api.get(

            `/wallet/history/${userId}`

          );


        if (res.data.success) {

          setHistory(

            res.data.transactions || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load wallet history"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchWalletHistory();

  }, []);


  /* ========================================
     FILTER DATA
  ======================================== */

  const filteredHistory =
    history.filter((item) => {

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

    });


  /* ========================================
     TOTALS
  ======================================== */

  const totalCredit =
    history

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
    history

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
     ICONS
  ======================================== */

  const getIcon =
    (category) => {

      switch (category) {

        case "wallet":

          return (

            <Wallet size={22} />

          );


        case "mobile":

          return (

            <Smartphone size={22} />

          );


        case "card":

          return (

            <CreditCard size={22} />

          );


        default:

          return (

            <BadgeIndianRupee size={22} />

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

            Smart Transaction Tracking

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Wallet History

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            View wallet transactions, recharge history,
            payment analytics & financial activities.

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchWalletHistory}

          className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh History

        </button>

      </div>


      {/* ========================================
          STATS GRID
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


        {/* TRANSACTIONS */}

        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <TrendingUp size={42} />


            <p className="text-white/80 mt-8 text-lg">

              Total Transactions

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                history.length

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

              placeholder="Search transaction..."

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


          {/* STATUS */}

          <div className="flex items-center justify-center gap-3 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl px-5 py-4 text-cyan-400 font-bold">

            <Clock3 size={20} />

            Live Transaction Tracking

          </div>

        </div>

      </div>


      {/* ========================================
          HISTORY LIST
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

          ) : filteredHistory.length === 0 ? (

            <div className="flex flex-col items-center justify-center text-center py-24 bg-white/5 border border-white/10 rounded-[32px]">

              <XCircle
                size={70}
                className="text-slate-500"
              />


              <h3 className="text-3xl font-black text-white mt-8">

                No Transactions Found

              </h3>


              <p className="text-slate-400 mt-4 max-w-lg">

                No wallet activity available for the selected filters.

              </p>

            </div>

          ) : (

            filteredHistory.map(

              (item, index) => (

                <div

                  key={index}

                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:border-cyan-400/20 transition-all duration-300"

                >

                  {/* GLOW */}

                  <div className="absolute top-0 right-0 w-[140px] h-[140px] bg-cyan-500/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />


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

                          getIcon(
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

                            "Wallet transaction completed successfully"

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
          FOOTER STATUS
      ======================================== */}

      <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">

            <Wallet size={28} />

          </div>


          <div>

            <h3 className="text-white font-black text-xl">

              Smart Wallet Monitoring

            </h3>


            <p className="text-slate-400 mt-1">

              Real-time transaction analysis & secure tracking

            </p>

          </div>

        </div>


        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-400/20 px-5 py-3 rounded-2xl text-emerald-400 font-bold">

          <Loader2 size={18} />

          Transactions Synced Live

        </div>

      </div>

    </div>

  );

}