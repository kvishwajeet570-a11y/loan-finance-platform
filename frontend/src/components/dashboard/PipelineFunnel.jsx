"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import {

  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock3,
  XCircle,
  Activity,
  Sparkles,
  ArrowUpRight,

} from "lucide-react";

export default function PipelineFunnel() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    stats,
    setStats
  ] = useState({

    total: 0,

    approved: 0,

    pending: 0,

    rejected: 0,

    approvedPercent: 0,

    pendingPercent: 0,

    rejectedPercent: 0,

    totalVolume: 0,

  });

  /* ========================================
     FETCH PIPELINE DATA
  ======================================== */

  const fetchPipelineData =
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

          /* TOTAL */

          const totalLoans =
            loans.length;

          /* APPROVED */

          const approvedLoans =
            loans.filter(

              (loan) =>

                loan.status ===
                "approved"

            );

          /* PENDING */

          const pendingLoans =
            loans.filter(

              (loan) =>

                loan.status ===
                "pending"

            );

          /* REJECTED */

          const rejectedLoans =
            loans.filter(

              (loan) =>

                loan.status ===
                "rejected"

            );

          /* PERCENTAGES */

          const approvedPercent =

            totalLoans > 0

              ? Math.round(

                  (

                    approvedLoans.length /

                    totalLoans

                  ) * 100

                )

              : 0;

          const pendingPercent =

            totalLoans > 0

              ? Math.round(

                  (

                    pendingLoans.length /

                    totalLoans

                  ) * 100

                )

              : 0;

          const rejectedPercent =

            totalLoans > 0

              ? Math.round(

                  (

                    rejectedLoans.length /

                    totalLoans

                  ) * 100

                )

              : 0;

          /* TOTAL VOLUME */

          const totalVolume =
            loans.reduce(

              (acc, loan) =>

                acc +

                Number(

                  loan.amount || 0

                ),

              0

            );

          setStats({

            total:
              totalLoans,

            approved:
              approvedLoans.length,

            pending:
              pendingLoans.length,

            rejected:
              rejectedLoans.length,

            approvedPercent,

            pendingPercent,

            rejectedPercent,

            totalVolume,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch funnel analytics"

        );

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     EFFECT
  ======================================== */

  useEffect(() => {

    fetchPipelineData();

  }, []);

  /* ========================================
     FUNNEL BAR
  ======================================== */

  const FunnelBar = ({
    title,
    percent,
    count,
    gradient,
    icon,
    glow,
  }) => (

    <div className="space-y-4">

      {/* TOP */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          {/* ICON */}

          <div

            className={`

              relative

              w-14

              h-14

              rounded-2xl

              bg-gradient-to-br

              ${gradient}

              flex

              items-center

              justify-center

              text-white

              shadow-[0_10px_40px_rgba(0,0,0,0.35)]

            `}

          >

            <div

              className={`

                absolute

                inset-0

                rounded-2xl

                blur-xl

                opacity-40

                ${glow}

              `}

            />

            <div className="relative z-10">

              {icon}

            </div>

          </div>

          {/* INFO */}

          <div>

            <h3 className="text-xl font-black text-white">

              {title}

            </h3>

            <p className="text-slate-400 mt-1">

              {count} Applications

            </p>

          </div>

        </div>

        {/* PERCENT */}

        <div className="text-right">

          <h2 className="text-4xl font-black text-white">

            {percent}%

          </h2>

        </div>

      </div>

      {/* BAR */}

      <div className="relative w-full h-5 bg-white/5 rounded-full overflow-hidden border border-white/10">

        {/* ACTIVE */}

        <div

          className={`

            absolute

            left-0

            top-0

            h-full

            bg-gradient-to-r

            ${gradient}

            rounded-full

            transition-all

            duration-1000

            shadow-[0_0_40px_rgba(255,255,255,0.25)]

          `}

          style={{

            width: `${percent}%`,

          }}

        />

        {/* GLOW */}

        <div

          className={`

            absolute

            top-0

            h-full

            blur-2xl

            opacity-40

            ${glow}

          `}

          style={{

            width: `${percent}%`,

          }}

        />

      </div>

    </div>

  );

  return (

    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#07111f] via-[#0f172a] to-[#111827] shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-3xl p-6 lg:p-8">

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[240px] h-[240px] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* HEADER */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={16} />

            Pipeline Analytics

          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white">

            Pipeline Funnel

          </h2>

          <p className="text-slate-400 text-lg mt-4 max-w-2xl">

            Real-time loan conversion analytics &
            business approval performance tracking.

          </p>

        </div>

        {/* TOTAL */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 px-8 py-6 text-white shadow-2xl min-w-[260px]">

          <div className="absolute top-0 right-0 w-28 h-28 bg-white/15 blur-3xl rounded-full" />

          <div className="relative z-10">

            <p className="text-white/80">

              Total Pipeline Leads

            </p>

            <h2 className="text-5xl font-black mt-3">

              {stats.total}

            </h2>

          </div>

        </div>

      </div>

      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-6">

            {

              [1, 2, 3].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-28 rounded-3xl bg-white/5"

                  />

                )

              )

            }

          </div>

        ) : (

          <>

            {/* KPI */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* TOTAL VOLUME */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">

                    <Wallet size={28} />

                  </div>

                  <p className="text-white/80 mt-6">

                    Total Pipeline Volume

                  </p>

                  <h2 className="text-5xl font-black mt-4">

                    ₹{

                      Number(

                        stats.totalVolume

                      ).toLocaleString()

                    }

                  </h2>

                </div>

              </div>

              {/* SUCCESS */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">

                    <TrendingUp size={28} />

                  </div>

                  <p className="text-white/80 mt-6">

                    Conversion Rate

                  </p>

                  <h2 className="text-5xl font-black mt-4">

                    {

                      stats.approvedPercent

                    }%

                  </h2>

                </div>

              </div>

            </div>

            {/* FUNNEL */}

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 lg:p-8 space-y-10">

              {/* APPROVED */}

              <FunnelBar

                title="Approved Loans"

                percent={

                  stats.approvedPercent

                }

                count={

                  stats.approved

                }

                gradient="from-emerald-500 to-green-600"

                glow="bg-emerald-400"

                icon={

                  <CheckCircle2 size={28} />

                }

              />

              {/* PENDING */}

              <FunnelBar

                title="Pending Loans"

                percent={

                  stats.pendingPercent

                }

                count={

                  stats.pending

                }

                gradient="from-yellow-400 to-orange-500"

                glow="bg-yellow-400"

                icon={

                  <Clock3 size={28} />

                }

              />

              {/* REJECTED */}

              <FunnelBar

                title="Rejected Loans"

                percent={

                  stats.rejectedPercent

                }

                count={

                  stats.rejected

                }

                gradient="from-red-500 to-rose-600"

                glow="bg-red-500"

                icon={

                  <XCircle size={28} />

                }

              />

            </div>

            {/* BOTTOM */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              {/* APPROVED */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <p className="text-white/80">

                      Approved

                    </p>

                    <CheckCircle2 size={22} />

                  </div>

                  <h2 className="text-5xl font-black mt-6">

                    {

                      stats.approved

                    }

                  </h2>

                </div>

              </div>

              {/* PENDING */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-black shadow-2xl">

                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <p className="text-black/70">

                      Pending

                    </p>

                    <Clock3 size={22} />

                  </div>

                  <h2 className="text-5xl font-black mt-6">

                    {

                      stats.pending

                    }

                  </h2>

                </div>

              </div>

              {/* REJECTED */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <p className="text-white/80">

                      Rejected

                    </p>

                    <XCircle size={22} />

                  </div>

                  <h2 className="text-5xl font-black mt-6">

                    {

                      stats.rejected

                    }

                  </h2>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6">

              <div className="flex items-center justify-between flex-wrap gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">

                    <Activity size={28} />

                  </div>

                  <div>

                    <h3 className="text-2xl font-black text-white">

                      Live Funnel Tracking

                    </h3>

                    <p className="text-slate-400 mt-1">

                      Real-time business loan pipeline performance

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">

                  <ArrowUpRight size={22} />

                  System Performing Excellent

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}