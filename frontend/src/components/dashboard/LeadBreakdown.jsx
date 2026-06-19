"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import {

  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
  IndianRupee,
  Activity,
  Sparkles,
  ArrowUpRight,

} from "lucide-react";

export default function LeadBreakdown() {

  /* ========================================
     STATES
  ======================================== */

  const [
    leads,
    setLeads
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  /* ========================================
     FETCH LEADS
  ======================================== */

  const fetchLeads =
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

          setLeads(

            res.data.loans || []

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch leads"

        );

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     EFFECT
  ======================================== */

  useEffect(() => {

    fetchLeads();

  }, []);

  /* ========================================
     CALCULATIONS
  ======================================== */

  const totalLeads =
    leads.length;

  const approvedLeads =
    leads.filter(

      (lead) =>

        lead.status ===
        "approved"

    ).length;

  const pendingLeads =
    leads.filter(

      (lead) =>

        lead.status ===
        "pending"

    ).length;

  const rejectedLeads =
    leads.filter(

      (lead) =>

        lead.status ===
        "rejected"

    ).length;

  const totalLoanAmount =
    leads.reduce(

      (acc, lead) =>

        acc +

        Number(

          lead.amount || 0

        ),

      0

    );

  const approvalRate =
    totalLeads > 0

      ? Math.round(

          (

            approvedLeads /

            totalLeads

          ) * 100

        )

      : 0;

  const rejectionRate =
    totalLeads > 0

      ? Math.round(

          (

            rejectedLeads /

            totalLeads

          ) * 100

        )

      : 0;

  /* ========================================
     CARD
  ======================================== */

  const AnalyticsCard = ({
    title,
    value,
    icon,
    gradient,
    glow,
    textColor = "text-white",
    subtitle,
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

      <div className={`

        absolute

        top-0

        right-0

        w-32

        h-32

        rounded-full

        blur-3xl

        opacity-30

        ${glow}

      `} />

      {/* CONTENT */}

      <div className="relative z-10">

        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xl">

          {icon}

        </div>

        <p className="mt-6 opacity-80 text-sm font-medium">

          {title}

        </p>

        <h2 className="text-5xl font-black mt-4">

          {value}

        </h2>

        {

          subtitle && (

            <p className="mt-4 opacity-80">

              {subtitle}

            </p>

          )

        }

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

            Lead Intelligence

          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white">

            Lead Breakdown

          </h2>

          <p className="text-slate-400 text-lg mt-4 max-w-2xl">

            Real-time business lead analytics,
            approval performance & conversion tracking.

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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

            {

              [1, 2, 3, 4, 5].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-44 rounded-[32px] bg-white/5"

                  />

                )

              )

            }

          </div>

        ) : totalLeads === 0 ? (

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-14 text-center">

            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mx-auto">

              <Users
                size={36}
                className="text-cyan-400"
              />

            </div>

            <h3 className="text-4xl font-black text-white mt-8">

              No Leads Found

            </h3>

            <p className="text-slate-400 mt-4 text-lg">

              Loan applications will appear here once users apply.

            </p>

          </div>

        ) : (

          <>

            {/* KPI */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

              {/* TOTAL */}

              <AnalyticsCard

                title="Total Leads"

                value={totalLeads}

                icon={

                  <Users size={28} />

                }

                gradient="from-cyan-500 to-blue-600"

                glow="bg-cyan-400"

                subtitle="Total loan applications"

              />

              {/* APPROVED */}

              <AnalyticsCard

                title="Approved"

                value={approvedLeads}

                icon={

                  <CheckCircle2 size={28} />

                }

                gradient="from-emerald-500 to-green-700"

                glow="bg-emerald-400"

                subtitle="Successfully approved"

              />

              {/* PENDING */}

              <AnalyticsCard

                title="Pending"

                value={pendingLeads}

                icon={

                  <Clock3 size={28} />

                }

                gradient="from-yellow-400 to-orange-500"

                glow="bg-yellow-300"

                textColor="text-black"

                subtitle="Waiting for approval"

              />

              {/* REJECTED */}

              <AnalyticsCard

                title="Rejected"

                value={rejectedLeads}

                icon={

                  <XCircle size={28} />

                }

                gradient="from-red-500 to-rose-600"

                glow="bg-red-400"

                subtitle="Rejected applications"

              />

              {/* APPROVAL RATE */}

              <AnalyticsCard

                title="Approval Rate"

                value={`${approvalRate}%`}

                icon={

                  <TrendingUp size={28} />

                }

                gradient="from-purple-500 to-fuchsia-700"

                glow="bg-purple-400"

                subtitle="Business conversion ratio"

              />

            </div>

            {/* VOLUME */}

            <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#020617] via-[#081120] to-[#111827] border border-white/10 p-8 mt-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full" />

              {/* CONTENT */}

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                {/* LEFT */}

                <div>

                  <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold">

                    <IndianRupee size={16} />

                    Total Loan Volume

                  </div>

                  <h1 className="text-6xl md:text-7xl font-black mt-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

                    ₹{

                      Number(

                        totalLoanAmount

                      ).toLocaleString()

                    }

                  </h1>

                  <p className="text-slate-400 text-lg mt-5 max-w-2xl">

                    Combined financial volume generated through all loan applications & customer financing requests.

                  </p>

                </div>

                {/* RIGHT */}

                <div className="grid grid-cols-2 gap-5 min-w-[320px]">

                  {/* HEALTH */}

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">

                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">

                      <Activity size={28} />

                    </div>

                    <p className="text-slate-400 mt-5">

                      Lead Health

                    </p>

                    <h2 className="text-4xl font-black text-white mt-3">

                      Excellent

                    </h2>

                  </div>

                  {/* REJECTION */}

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">

                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-400/20 flex items-center justify-center text-red-400">

                      <ArrowUpRight size={28} />

                    </div>

                    <p className="text-slate-400 mt-5">

                      Rejection Rate

                    </p>

                    <h2 className="text-4xl font-black text-white mt-3">

                      {

                        rejectionRate

                      }%

                    </h2>

                  </div>

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}