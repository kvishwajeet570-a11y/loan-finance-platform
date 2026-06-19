"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  Search,
  Filter,
  RefreshCcw,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Sparkles,
  CalendarDays,

} from "lucide-react";


export default function TransactionTable() {

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
    typeFilter,
    setTypeFilter
  ] = useState("all");


  const [
    statusFilter,
    setStatusFilter
  ] = useState("all");


  const [
    currentPage,
    setCurrentPage
  ] = useState(1);


  const itemsPerPage = 8;


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
     FILTER DATA
  ======================================== */

  useEffect(() => {

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

    if (

      typeFilter !== "all"

    ) {

      data = data.filter(

        (item) =>

          item.type ===
          typeFilter

      );

    }


    /* STATUS */

    if (

      statusFilter !== "all"

    ) {

      data = data.filter(

        (item) =>

          item.status ===
          statusFilter

      );

    }


    setFilteredTransactions(
      data
    );

    setCurrentPage(1);

  }, [

    search,

    typeFilter,

    statusFilter,

    transactions,

  ]);


  /* ========================================
     PAGINATION
  ======================================== */

  const totalPages =
    Math.ceil(

      filteredTransactions.length /

      itemsPerPage

    );


  const paginatedData =
    useMemo(() => {

      const start =
        (currentPage - 1) *

        itemsPerPage;


      return filteredTransactions.slice(

        start,

        start + itemsPerPage

      );

    }, [

      currentPage,

      filteredTransactions,

    ]);


  /* ========================================
     STATUS STYLE
  ======================================== */

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "success":

          return {

            bg:
              "bg-emerald-500/10",

            text:
              "text-emerald-400",

            border:
              "border-emerald-400/20",

            icon:
              <CheckCircle2 size={16} />,

          };


        case "pending":

          return {

            bg:
              "bg-yellow-500/10",

            text:
              "text-yellow-400",

            border:
              "border-yellow-400/20",

            icon:
              <Clock3 size={16} />,

          };


        default:

          return {

            bg:
              "bg-red-500/10",

            text:
              "text-red-400",

            border:
              "border-red-400/20",

            icon:
              <XCircle size={16} />,

          };

      }

    };


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

      <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            Real-Time Transaction Management

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Transaction Table

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Track, search & manage all financial activities,
            payments, wallet transfers & recharge transactions.

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

        {/* TOTAL */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <Wallet size={42} />


            <p className="mt-6 text-white/80">

              Total Transactions

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                filteredTransactions.length

              }

            </h2>

          </div>

        </div>


        {/* CREDIT */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <ArrowDownLeft size={42} />


            <p className="mt-6 text-white/80">

              Credit Transactions

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                filteredTransactions.filter(

                  (item) =>

                    item.type ===
                    "credit"

                ).length

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

              Debit Transactions

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                filteredTransactions.filter(

                  (item) =>

                    item.type ===
                    "debit"

                ).length

              }

            </h2>

          </div>

        </div>

      </div>


      {/* ========================================
          FILTERS
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 mb-8">

        <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-cyan-500/10 blur-[100px] rounded-full" />


        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

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

            value={typeFilter}

            onChange={(e) =>

              setTypeFilter(

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

            value={statusFilter}

            onChange={(e) =>

              setStatusFilter(

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


          {/* DATE */}

          <div className="relative">

            <CalendarDays

              size={18}

              className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

            />


            <input

              type="date"

              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

            />

          </div>

        </div>

      </div>


      {/* ========================================
          TABLE
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl">

        {/* TABLE HEADER */}

        <div className="flex items-center justify-between gap-5 px-6 py-6 border-b border-white/10">

          <div>

            <h3 className="text-3xl font-black text-white">

              Transaction Records

            </h3>


            <p className="text-slate-400 mt-2">

              Detailed transaction history

            </p>

          </div>


          <button className="flex items-center gap-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 text-cyan-400 px-5 py-3 rounded-2xl font-semibold transition-all duration-300">

            <Download size={18} />

            Export

          </button>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>

              <tr className="border-b border-white/10">

                <th className="text-left px-6 py-5 text-slate-400 font-semibold">

                  Transaction

                </th>

                <th className="text-left px-6 py-5 text-slate-400 font-semibold">

                  Type

                </th>

                <th className="text-left px-6 py-5 text-slate-400 font-semibold">

                  Amount

                </th>

                <th className="text-left px-6 py-5 text-slate-400 font-semibold">

                  Status

                </th>

                <th className="text-left px-6 py-5 text-slate-400 font-semibold">

                  Date

                </th>

                <th className="text-left px-6 py-5 text-slate-400 font-semibold">

                  Actions

                </th>

              </tr>

            </thead>


            <tbody>

              {

                loading ? (

                  [1, 2, 3, 4].map(

                    (item) => (

                      <tr
                        key={item}

                        className="border-b border-white/5"

                      >

                        <td
                          colSpan={6}

                          className="px-6 py-8"

                        >

                          <div className="animate-pulse h-16 rounded-2xl bg-white/5" />

                        </td>

                      </tr>

                    )

                  )

                ) : paginatedData.length === 0 ? (

                  <tr>

                    <td

                      colSpan={6}

                      className="py-20 text-center"

                    >

                      <div className="flex flex-col items-center">

                        <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">

                          <Wallet size={42} />

                        </div>


                        <h3 className="text-3xl font-black text-white mt-6">

                          No Transactions Found

                        </h3>


                        <p className="text-slate-400 mt-3">

                          Try changing filters or search terms.

                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  paginatedData.map(

                    (

                      item,
                      index

                    ) => {

                      const statusStyle =
                        getStatusStyle(

                          item.status

                        );


                      return (

                        <tr

                          key={

                            item.id ||

                            index

                          }

                          className="border-b border-white/5 hover:bg-white/5 transition-all duration-300"

                        >

                          {/* TRANSACTION */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              {/* ICON */}

                              <div

                                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${

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

                                      <ArrowDownLeft size={24} />

                                    ) : (

                                      <ArrowUpRight size={24} />

                                    )

                                }

                              </div>


                              {/* INFO */}

                              <div>

                                <h3 className="text-white font-bold text-lg">

                                  {

                                    item.title ||

                                    "Wallet Transaction"

                                  }

                                </h3>


                                <p className="text-slate-400 text-sm mt-1">

                                  {

                                    item.transactionId ||

                                    "TXN0001"

                                  }

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* TYPE */}

                          <td className="px-6 py-5">

                            <div

                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase ${

                                item.type ===
                                "credit"

                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20"

                                  : "bg-red-500/10 text-red-400 border border-red-400/20"

                              }`}

                            >

                              {

                                item.type ===
                                "credit"

                                  ? (

                                    <ArrowDownLeft size={16} />

                                  ) : (

                                    <ArrowUpRight size={16} />

                                  )

                              }

                              {

                                item.type

                              }

                            </div>

                          </td>


                          {/* AMOUNT */}

                          <td className="px-6 py-5">

                            <h3

                              className={`text-2xl font-black ${

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

                            </h3>

                          </td>


                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <div

                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold capitalize ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}

                            >

                              {

                                statusStyle.icon

                              }

                              {

                                item.status

                              }

                            </div>

                          </td>


                          {/* DATE */}

                          <td className="px-6 py-5">

                            <p className="text-white font-semibold">

                              {

                                new Date(

                                  item.createdAt

                                ).toLocaleDateString()

                              }

                            </p>


                            <p className="text-slate-400 text-sm mt-1">

                              {

                                new Date(

                                  item.createdAt

                                ).toLocaleTimeString()

                              }

                            </p>

                          </td>


                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <button className="w-12 h-12 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 text-cyan-400 flex items-center justify-center transition-all duration-300">

                                <Eye size={18} />

                              </button>


                              <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all duration-300">

                                <Download size={18} />

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }

                  )

                )

              }

            </tbody>

          </table>

        </div>


        {/* ========================================
            PAGINATION
        ======================================== */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 px-6 py-6 border-t border-white/10">

          {/* LEFT */}

          <p className="text-slate-400">

            Showing

            <span className="text-white font-bold">

              {" "}

              {

                paginatedData.length

              }

            </span>

            {" "}of

            <span className="text-white font-bold">

              {" "}

              {

                filteredTransactions.length

              }

            </span>

            {" "}transactions

          </p>


          {/* RIGHT */}

          <div className="flex items-center gap-4">

            {/* PREV */}

            <button

              disabled={
                currentPage === 1
              }

              onClick={() =>

                setCurrentPage(

                  currentPage - 1

                )
              }

              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-40"

            >

              <ChevronLeft size={20} />

            </button>


            {/* PAGE */}

            <div className="px-6 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-bold">

              Page {

                currentPage

              } / {

                totalPages || 1

              }

            </div>


            {/* NEXT */}

            <button

              disabled={
                currentPage ===
                totalPages ||

                totalPages === 0
              }

              onClick={() =>

                setCurrentPage(

                  currentPage + 1

                )
              }

              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white flex items-center justify-center transition-all duration-300 disabled:opacity-40"

            >

              <ChevronRight size={20} />

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}