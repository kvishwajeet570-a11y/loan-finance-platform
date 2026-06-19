"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  Filter,
  CalendarDays,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  RefreshCcw,
  TrendingUp,
  BadgeIndianRupee,
  Sparkles,
  X,

} from "lucide-react";


export default function TransactionFilters() {

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
    filteredTransactions,
    setFilteredTransactions
  ] = useState([]);


  const [
    search,
    setSearch
  ] = useState("");


  const [
    type,
    setType
  ] = useState("all");


  const [
    status,
    setStatus
  ] = useState("all");


  const [
    fromDate,
    setFromDate
  ] = useState("");


  const [
    toDate,
    setToDate
  ] = useState("");


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

            `/transactions/${userId}`

          );


        if (res.data.success) {

          setTransactions(

            res.data.transactions || []

          );


          setFilteredTransactions(

            res.data.transactions || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch transactions"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     APPLY FILTERS
  ======================================== */

  const applyFilters =
    () => {

      let data = [
        ...transactions
      ];


      /* SEARCH */

      if (search) {

        data = data.filter(

          (item) =>

            item.title
              ?.toLowerCase()
              .includes(

                search.toLowerCase()

              ) ||

            item.transactionId
              ?.toLowerCase()
              .includes(

                search.toLowerCase()

              )

        );

      }


      /* TYPE */

      if (type !== "all") {

        data = data.filter(

          (item) =>

            item.type === type

        );

      }


      /* STATUS */

      if (status !== "all") {

        data = data.filter(

          (item) =>

            item.status === status

        );

      }


      /* DATE FILTER */

      if (fromDate) {

        data = data.filter(

          (item) =>

            new Date(

              item.createdAt

            ) >= new Date(fromDate)

        );

      }


      if (toDate) {

        data = data.filter(

          (item) =>

            new Date(

              item.createdAt

            ) <= new Date(toDate)

        );

      }


      setFilteredTransactions(
        data
      );


      toast.success(
        "Filters applied successfully"
      );

    };


  /* ========================================
     RESET FILTERS
  ======================================== */

  const resetFilters =
    () => {

      setSearch("");

      setType("all");

      setStatus("all");

      setFromDate("");

      setToDate("");


      setFilteredTransactions(
        transactions
      );


      toast.success(
        "Filters reset"
      );

    };


  /* ========================================
     TOTALS
  ======================================== */

  const totalCredit =
    filteredTransactions

      .filter(

        (item) =>

          item.type === "credit"

      )

      .reduce(

        (acc, item) =>

          acc + Number(item.amount),

        0

      );


  const totalDebit =
    filteredTransactions

      .filter(

        (item) =>

          item.type === "debit"

      )

      .reduce(

        (acc, item) =>

          acc + Number(item.amount),

        0

      );


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchTransactions();

  }, []);


  return (

    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            Smart Transaction Filters

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Transaction Analytics

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Search, filter & analyze all wallet, recharge,
            EMI & loan transactions in real-time.

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchTransactions}

          className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh Data

        </button>

      </div>


      {/* ========================================
          TOP STATS
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* CREDIT */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <ArrowDownLeft size={42} />


            <p className="mt-6 text-white/80">

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

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-rose-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <ArrowUpRight size={42} />


            <p className="mt-6 text-white/80">

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

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <Wallet size={42} />


            <p className="mt-6 text-white/80">

              Transactions

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                filteredTransactions.length

              }

            </h2>

          </div>

        </div>

      </div>


      {/* ========================================
          FILTER PANEL
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 lg:p-8 mb-8">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-500/10 blur-[100px] rounded-full" />


        <div className="relative z-10">

          {/* TITLE */}

          <div className="flex items-center gap-3 mb-8">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-2xl">

              <Filter size={26} />

            </div>


            <div>

              <h3 className="text-3xl font-black text-white">

                Advanced Filters

              </h3>


              <p className="text-slate-400 mt-1">

                Apply smart filters to your transaction history

              </p>

            </div>

          </div>


          {/* FILTER GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

            {/* SEARCH */}

            <div className="relative">

              <Search

                size={18}

                className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

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

                className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

              />

            </div>


            {/* TYPE */}

            <select

              value={type}

              onChange={(e) =>

                setType(

                  e.target.value

                )
              }

              className="bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white px-5 py-4 rounded-2xl outline-none transition-all duration-300"

            >

              <option
                value="all"
                className="bg-[#0f172a]"
              >

                All Types

              </option>

              <option
                value="credit"
                className="bg-[#0f172a]"
              >

                Credit

              </option>

              <option
                value="debit"
                className="bg-[#0f172a]"
              >

                Debit

              </option>

            </select>


            {/* STATUS */}

            <select

              value={status}

              onChange={(e) =>

                setStatus(

                  e.target.value

                )
              }

              className="bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white px-5 py-4 rounded-2xl outline-none transition-all duration-300"

            >

              <option
                value="all"
                className="bg-[#0f172a]"
              >

                All Status

              </option>

              <option
                value="success"
                className="bg-[#0f172a]"
              >

                Success

              </option>

              <option
                value="pending"
                className="bg-[#0f172a]"
              >

                Pending

              </option>

              <option
                value="failed"
                className="bg-[#0f172a]"
              >

                Failed

              </option>

            </select>


            {/* FROM DATE */}

            <div className="relative">

              <CalendarDays

                size={18}

                className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

              />


              <input

                type="date"

                value={fromDate}

                onChange={(e) =>

                  setFromDate(

                    e.target.value

                  )
                }

                className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

              />

            </div>


            {/* TO DATE */}

            <div className="relative">

              <CalendarDays

                size={18}

                className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

              />


              <input

                type="date"

                value={toDate}

                onChange={(e) =>

                  setToDate(

                    e.target.value

                  )
                }

                className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

              />

            </div>

          </div>


          {/* BUTTONS */}

          <div className="flex flex-col md:flex-row gap-5 mt-8">

            {/* APPLY */}

            <button

              onClick={applyFilters}

              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

            >

              <Filter size={20} />

              Apply Filters

            </button>


            {/* RESET */}

            <button

              onClick={resetFilters}

              className="flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-400 px-8 py-5 rounded-2xl font-bold transition-all duration-300"

            >

              <X size={20} />

              Reset

            </button>

          </div>

        </div>

      </div>


      {/* ========================================
          TRANSACTION LIST
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 lg:p-8">

        {/* TITLE */}

        <div className="flex items-center justify-between gap-5 mb-8">

          <div>

            <h3 className="text-3xl font-black text-white">

              Transaction History

            </h3>


            <p className="text-slate-400 mt-2">

              Real-time filtered transaction records

            </p>

          </div>


          <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold">

            {

              filteredTransactions.length

            } Results

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

                      className="animate-pulse h-[120px] rounded-3xl bg-white/5"

                    />

                  )

                )

              }

            </div>

          ) : filteredTransactions.length === 0 ? (

            <div className="flex flex-col items-center justify-center text-center py-20">

              <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">

                <BadgeIndianRupee size={42} />

              </div>


              <h3 className="text-3xl font-black text-white mt-6">

                No Transactions Found

              </h3>


              <p className="text-slate-400 mt-3">

                Try changing the applied filters.

              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {

                filteredTransactions.map(

                  (

                    item,
                    index

                  ) => (

                    <div

                      key={item.id || index}

                      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 hover:border-cyan-400/20 p-6 transition-all duration-300 hover:scale-[1.01]"

                    >

                      {/* GLOW */}

                      <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-cyan-500/10 blur-[80px] rounded-full" />


                      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                        {/* LEFT */}

                        <div className="flex items-center gap-5">

                          {/* ICON */}

                          <div

                            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${

                              item.type ===
                              "credit"

                                ? "bg-gradient-to-br from-emerald-500 to-green-700"

                                : "bg-gradient-to-br from-red-500 to-rose-700"

                            } text-white`}

                          >

                            {

                              item.type ===
                              "credit"

                                ? (

                                  <ArrowDownLeft size={28} />

                                ) : (

                                  <ArrowUpRight size={28} />

                                )

                            }

                          </div>


                          {/* DETAILS */}

                          <div>

                            <h3 className="text-2xl font-black text-white">

                              {

                                item.title ||

                                "Transaction"

                              }

                            </h3>


                            <p className="text-slate-400 mt-2">

                              {

                                item.transactionId ||

                                "TXN0001"

                              }

                            </p>


                            <div className="flex flex-wrap items-center gap-3 mt-4">

                              <div

                                className={`px-4 py-2 rounded-full text-xs font-bold ${

                                  item.status ===
                                  "success"

                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20"

                                    : item.status ===
                                      "pending"

                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/20"

                                    : "bg-red-500/10 text-red-400 border border-red-400/20"

                                }`}

                              >

                                {

                                  item.status

                                }

                              </div>


                              <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-4 py-2 rounded-full text-xs font-bold uppercase">

                                {

                                  item.type

                                }

                              </div>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="text-left xl:text-right">

                          <p className="text-slate-400 text-sm font-semibold">

                            Transaction Amount

                          </p>


                          <h2

                            className={`text-5xl font-black mt-3 ${

                              item.type ===
                              "credit"

                                ? "text-emerald-400"

                                : "text-red-400"

                            }`}

                          >

                            {

                              item.type ===
                              "credit"

                                ? "+"

                                : "-"

                            }

                            ₹{

                              Number(

                                item.amount

                              ).toLocaleString()

                            }

                          </h2>


                          <p className="text-cyan-400 mt-4 font-semibold">

                            {

                              new Date(

                                item.createdAt

                              ).toLocaleDateString()

                            }

                          </p>

                        </div>

                      </div>

                    </div>

                  )

                )

              }

            </div>

          )

        }

      </div>


      {/* ========================================
          BOTTOM BANNER
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 mt-8 text-white shadow-2xl">

        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white/10 blur-[100px] rounded-full" />


        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">

              📊 Financial Insights

            </div>


            <h2 className="text-5xl font-black mt-6">

              Smart Transaction Tracking

            </h2>


            <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">

              Monitor all wallet payments, loan EMIs,
              cashback rewards & recharge activities with advanced analytics.

            </p>

          </div>


          {/* RIGHT */}

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Growth

              </p>


              <h3 className="text-4xl font-black mt-3">

                +42%

              </h3>

            </div>


            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Success Rate

              </p>


              <h3 className="text-4xl font-black mt-3">

                99%

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}