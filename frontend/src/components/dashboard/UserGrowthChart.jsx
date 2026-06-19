"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,

} from "recharts";

import {

  Users,
  TrendingUp,
  Activity,
  RefreshCcw,
  Sparkles,
  ArrowUpRight,
  UserPlus,
  BarChart3,
  CalendarDays,

} from "lucide-react";


export default function UserGrowthChart() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    chartData,
    setChartData
  ] = useState([]);


  const [
    totalUsers,
    setTotalUsers
  ] = useState(0);


  const [
    growthRate,
    setGrowthRate
  ] = useState(0);


  const [
    activeUsers,
    setActiveUsers
  ] = useState(0);


  /* ========================================
     FETCH USER ANALYTICS
  ======================================== */

  const fetchUserGrowth =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/analytics/user-growth"

          );


        if (res.data.success) {

          setChartData(

            res.data.chartData || []

          );


          setTotalUsers(

            res.data.totalUsers || 0

          );


          setGrowthRate(

            res.data.growthRate || 0

          );


          setActiveUsers(

            res.data.activeUsers || 0

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load analytics"
        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchUserGrowth();

  }, []);


  /* ========================================
     CUSTOM TOOLTIP
  ======================================== */

  const CustomTooltip =
    ({
      active,
      payload,
      label,
    }) => {

      if (

        active &&
        payload &&
        payload.length

      ) {

        return (

          <div className="bg-[#081028] border border-cyan-400/20 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">

            <p className="text-cyan-400 font-bold text-lg mb-3">

              {label}

            </p>


            <p className="text-white text-xl font-black">

              {

                payload[0].value

              } Users

            </p>


            <p className="text-slate-400 text-sm mt-2">

              User registrations this month

            </p>

          </div>

        );

      }


      return null;

    };


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

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            AI Powered User Analytics

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">

            User Growth Analytics

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Monitor platform growth, active users,
            registration trends & monthly engagement analytics.

          </p>

        </div>


        {/* RIGHT */}

        <button

          onClick={fetchUserGrowth}

          className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh Analytics

        </button>

      </div>


      {/* ========================================
          OVERVIEW BANNER
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 mb-8 text-white shadow-2xl">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white/10 blur-[100px] rounded-full" />


        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">

              🚀 Growth Monitoring

            </div>


            <h2 className="text-5xl font-black mt-6 leading-tight">

              Real-Time User Growth Tracking

            </h2>


            <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">

              Track registrations, monthly active users,
              platform growth & customer engagement in real-time.

            </p>

          </div>


          {/* RIGHT */}

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Growth

              </p>


              <h3 className="text-4xl font-black mt-3">

                +{growthRate}%

              </h3>

            </div>


            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Active Users

              </p>


              <h3 className="text-4xl font-black mt-3">

                {

                  activeUsers.toLocaleString()

                }

              </h3>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          STATS GRID
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* TOTAL USERS */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <Users size={42} />


            <p className="mt-6 text-white/80">

              Total Users

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                totalUsers.toLocaleString()

              }

            </h2>

          </div>

        </div>


        {/* GROWTH RATE */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <TrendingUp size={42} />


            <p className="mt-6 text-white/80">

              Monthly Growth

            </p>


            <h2 className="text-5xl font-black mt-3">

              +{growthRate}%

            </h2>

          </div>

        </div>


        {/* ACTIVE USERS */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <Activity size={42} />


            <p className="mt-6 text-white/80">

              Active Users

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                activeUsers.toLocaleString()

              }

            </h2>

          </div>

        </div>

      </div>


      {/* ========================================
          CHART SECTION
      ======================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ========================================
            MAIN CHART
        ======================================== */}

        <div className="xl:col-span-2 relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 lg:p-8">

          {/* GLOW */}

          <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-cyan-500/10 blur-[100px] rounded-full" />


          <div className="relative z-10">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

              <div>

                <h3 className="text-3xl font-black text-white">

                  User Growth Trend

                </h3>


                <p className="text-slate-400 mt-2">

                  Monthly registration analytics

                </p>

              </div>


              <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-400/20 px-4 py-3 rounded-2xl text-cyan-400 font-semibold">

                <BarChart3 size={18} />

                Live Analytics

              </div>

            </div>


            {/* CHART */}

            <div className="w-full h-[420px]">

              {

                loading ? (

                  <div className="animate-pulse w-full h-full rounded-3xl bg-white/5" />

                ) : (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <AreaChart

                      data={chartData}

                      margin={{

                        top: 10,

                        right: 20,

                        left: -10,

                        bottom: 0,

                      }}

                    >

                      {/* GRADIENT */}

                      <defs>

                        <linearGradient
                          id="colorUsers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >

                          <stop
                            offset="5%"
                            stopColor="#06b6d4"
                            stopOpacity={0.8}
                          />

                          <stop
                            offset="95%"
                            stopColor="#06b6d4"
                            stopOpacity={0}
                          />

                        </linearGradient>

                      </defs>


                      {/* GRID */}

                      <CartesianGrid

                        strokeDasharray="3 3"

                        stroke="#1e293b"

                      />


                      {/* X AXIS */}

                      <XAxis

                        dataKey="month"

                        stroke="#94a3b8"

                        tickLine={false}

                        axisLine={false}

                      />


                      {/* Y AXIS */}

                      <YAxis

                        stroke="#94a3b8"

                        tickLine={false}

                        axisLine={false}

                      />


                      {/* TOOLTIP */}

                      <Tooltip

                        content={
                          <CustomTooltip />
                        }

                      />


                      {/* AREA */}

                      <Area

                        type="monotone"

                        dataKey="users"

                        stroke="#06b6d4"

                        strokeWidth={4}

                        fillOpacity={1}

                        fill="url(#colorUsers)"

                        activeDot={{

                          r: 8,

                          fill: "#06b6d4",

                        }}

                      />

                    </AreaChart>

                  </ResponsiveContainer>

                )

              }

            </div>

          </div>

        </div>


        {/* ========================================
            RIGHT SIDE PANEL
        ======================================== */}

        <div className="space-y-8">

          {/* ========================================
              PERFORMANCE CARD
          ======================================== */}

          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-8 text-white shadow-2xl">

            <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-white/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">

                📈 Performance

              </div>


              <h2 className="text-4xl font-black mt-8 leading-tight">

                Fastest Growing Platform

              </h2>


              <p className="text-white/80 mt-6 leading-relaxed">

                User registrations are increasing rapidly
                with strong engagement & retention rates.

              </p>


              <div className="flex items-center gap-3 mt-8 text-white">

                <ArrowUpRight size={28} />

                <span className="text-2xl font-black">

                  +{growthRate}% This Month

                </span>

              </div>

            </div>

          </div>


          {/* ========================================
              QUICK INSIGHTS
          ======================================== */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

            <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-cyan-500/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              <h3 className="text-3xl font-black text-white mb-8">

                Quick Insights

              </h3>


              <div className="space-y-5">

                {/* CARD */}

                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">

                      <UserPlus size={26} />

                    </div>


                    <div>

                      <h4 className="text-white font-bold">

                        New Users

                      </h4>


                      <p className="text-slate-400 text-sm mt-1">

                        This Month

                      </p>

                    </div>

                  </div>


                  <h3 className="text-3xl font-black text-white">

                    1.2K

                  </h3>

                </div>


                {/* CARD */}

                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">

                      <TrendingUp size={26} />

                    </div>


                    <div>

                      <h4 className="text-white font-bold">

                        Engagement

                      </h4>


                      <p className="text-slate-400 text-sm mt-1">

                        Avg Activity

                      </p>

                    </div>

                  </div>


                  <h3 className="text-3xl font-black text-white">

                    92%

                  </h3>

                </div>


                {/* CARD */}

                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">

                      <CalendarDays size={26} />

                    </div>


                    <div>

                      <h4 className="text-white font-bold">

                        Avg Daily

                      </h4>


                      <p className="text-slate-400 text-sm mt-1">

                        Registrations

                      </p>

                    </div>

                  </div>


                  <h3 className="text-3xl font-black text-white">

                    245

                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}