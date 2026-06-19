"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {

  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

import api from "@/lib/api";

import {

  CheckCircle2,
  Clock3,
  XCircle,
  Sparkles,
  Activity,
  IndianRupee,
  TrendingUp,

} from "lucide-react";


/* ========================================
   COLORS
======================================== */

const COLORS = [

  "#22c55e",

  "#facc15",

  "#ef4444",

];


/* ========================================
   COMPONENT
======================================== */

export default function LoanStatusChart() {

  /* ========================================
     STATES
  ======================================== */

  const [
    chartData,
    setChartData,
  ] = useState([

    {
      name: "Approved",
      value: 0,
    },

    {
      name: "Pending",
      value: 0,
    },

    {
      name: "Rejected",
      value: 0,
    },

  ]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    totalLoans,
    setTotalLoans,
  ] = useState(0);

  const [
    totalAmount,
    setTotalAmount,
  ] = useState(0);

  const [
    approvalRate,
    setApprovalRate,
  ] = useState(0);


  /* ========================================
     FETCH LOAN STATUS
  ======================================== */

  const fetchLoanStatus =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.get(

            "/loan/all",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        if (res.data.success) {

          const loans =
            res.data.loans || [];

          /* APPROVED */

          const approved =
            loans.filter(

              (loan) =>

                loan.status ===
                "approved"

            ).length;

          /* PENDING */

          const pending =
            loans.filter(

              (loan) =>

                loan.status ===
                "pending"

            ).length;

          /* REJECTED */

          const rejected =
            loans.filter(

              (loan) =>

                loan.status ===
                "rejected"

            ).length;

          /* AMOUNT */

          const amount =
            loans.reduce(

              (acc, loan) =>

                acc +

                Number(

                  loan.amount || 0

                ),

              0

            );

          /* APPROVAL RATE */

          const rate =
            loans.length > 0

              ? Math.round(

                  (

                    approved /

                    loans.length

                  ) * 100

                )

              : 0;

          /* CHART */

          setChartData([

            {

              name: "Approved",

              value: approved,

            },

            {

              name: "Pending",

              value: pending,

            },

            {

              name: "Rejected",

              value: rejected,

            },

          ]);

          setTotalLoans(
            loans.length
          );

          setTotalAmount(
            amount
          );

          setApprovalRate(
            rate
          );

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch analytics"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     EFFECT
  ======================================== */

  useEffect(() => {

    fetchLoanStatus();

  }, []);


  /* ========================================
     CARD
  ======================================== */

  const StatusCard = ({
    title,
    value,
    icon,
    gradient,
    textColor = "text-white",
  }) => (

    <div className={`

      relative

      overflow-hidden

      rounded-[32px]

      bg-gradient-to-br

      ${gradient}

      p-6

      shadow-[0_20px_60px_rgba(0,0,0,0.35)]

      ${textColor}

    `}>

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />

      <div className="relative z-10 flex items-center justify-between">

        <div>

          <p className="opacity-80">

            {title}

          </p>

          <h2 className="text-5xl font-black mt-5">

            {value}

          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl">

          {icon}

        </div>

      </div>

    </div>

  );


  return (

    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#07111f] via-[#0f172a] to-[#111827] shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-3xl p-6 lg:p-8">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* HEADER */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={16} />

            Loan Intelligence

          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white">

            Loan Status Analytics

          </h2>

          <p className="text-slate-400 text-lg mt-4 max-w-2xl">

            Real-time approved vs pending vs rejected loan performance tracking.

          </p>

        </div>

        {/* LIVE */}

        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-400/20 px-5 py-3 rounded-full text-emerald-400 font-semibold">

          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />

          Live Analytics

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {

                [1, 2].map(

                  (item) => (

                    <div

                      key={item}

                      className="animate-pulse h-40 rounded-[32px] bg-white/5"

                    />

                  )

                )

              }

            </div>

            <div className="animate-pulse h-[420px] rounded-[32px] bg-white/5" />

          </div>

        ) : (

          <>

            {/* TOP STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

              {/* TOTAL LOANS */}

              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                    <Activity size={28} />

                  </div>

                  <p className="text-white/80 mt-6">

                    Total Loans

                  </p>

                  <h2 className="text-6xl font-black mt-4">

                    {totalLoans}

                  </h2>

                </div>

              </div>

              {/* TOTAL AMOUNT */}

              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                    <IndianRupee size={28} />

                  </div>

                  <p className="text-white/80 mt-6">

                    Loan Volume

                  </p>

                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        totalAmount

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>

            </div>


            {/* CHART SECTION */}

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">

              {/* CHART GLOW */}

              <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-cyan-500/10 blur-[100px] rounded-full" />

              {/* TOP */}

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                <div>

                  <h3 className="text-3xl font-black text-white">

                    Status Distribution

                  </h3>

                  <p className="text-slate-400 mt-2">

                    Approval, pending & rejection breakdown

                  </p>

                </div>

                {/* APPROVAL */}

                <div className="bg-emerald-500/10 border border-emerald-400/20 px-5 py-3 rounded-full text-emerald-400 font-bold">

                  {approvalRate}% Approval Rate

                </div>

              </div>


              {/* CHART */}

              <div className="relative z-10 w-full min-w-0 h-[420px]">

                <ResponsiveContainer
                  width="99%"
                  height={420}
                >

                  <PieChart>

                    <Pie

                      data={chartData}

                      cx="50%"

                      cy="50%"

                      innerRadius={100}

                      outerRadius={160}

                      paddingAngle={5}

                      dataKey="value"

                      animationDuration={2000}

                    >

                      {

                        chartData.map(

                          (
                            entry,
                            index
                          ) => (

                            <Cell

                              key={`cell-${index}`}

                              fill={
                                COLORS[index]
                              }

                            />

                          )

                        )

                      }

                    </Pie>

                    <Tooltip

                      contentStyle={{

                        background:
                          "#020617",

                        border:
                          "1px solid rgba(255,255,255,0.08)",

                        borderRadius:
                          "20px",

                        color:
                          "#fff",

                      }}

                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>


            {/* STATUS CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              <StatusCard

                title="Approved"

                value={
                  chartData[0].value
                }

                icon={
                  <CheckCircle2 size={30} />
                }

                gradient="from-emerald-500 to-green-700"

              />

              <StatusCard

                title="Pending"

                value={
                  chartData[1].value
                }

                icon={
                  <Clock3 size={30} />
                }

                gradient="from-yellow-400 to-orange-500"

                textColor="text-black"

              />

              <StatusCard

                title="Rejected"

                value={
                  chartData[2].value
                }

                icon={
                  <XCircle size={30} />
                }

                gradient="from-red-500 to-rose-600"

              />

            </div>


            {/* FOOTER */}

            <div className="mt-8 rounded-[32px] border border-cyan-400/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6">

              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                <div>

                  <h3 className="text-2xl font-black text-white">

                    Loan Performance Insights

                  </h3>

                  <p className="text-slate-400 mt-2">

                    Real-time loan processing & approval ecosystem analytics.

                  </p>

                </div>

                <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg">

                  <TrendingUp size={24} />

                  System Performance Excellent

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}