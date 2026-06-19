"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  TrendingUp,
  Wallet,
  Activity,
  IndianRupee,
  RefreshCcw,
  ArrowUpRight,
} from "lucide-react";

const EMPTY_MONTHS = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
  { month: "Jul", revenue: 0 },
  { month: "Aug", revenue: 0 },
  { month: "Sep", revenue: 0 },
  { month: "Oct", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
];

export default function RevenueChart() {
  const [mounted, setMounted] = useState(false);

  const [chartData, setChartData] = useState(EMPTY_MONTHS);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalTransactions: 0,
    avgRevenue: 0,
    highestRevenue: 0,
  });

  const fetchRevenueAnalytics = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/revenue/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setChartData(
          Array.isArray(res.data.analytics)
            ? res.data.analytics
            : EMPTY_MONTHS
        );

        setStats({
          totalRevenue:
            Number(res.data.stats?.totalRevenue) || 0,

          monthlyGrowth:
            Number(res.data.stats?.monthlyGrowth) || 0,

          totalTransactions:
            Number(res.data.stats?.totalTransactions) || 0,

          avgRevenue:
            Number(res.data.stats?.avgRevenue) || 0,

          highestRevenue:
            Number(res.data.stats?.highestRevenue) || 0,
        });
      } else {
        setChartData(EMPTY_MONTHS);
      }
    } catch (error) {
      console.log("REVENUE ERROR =>", error);

      toast.error("Failed to load analytics");

      setChartData(EMPTY_MONTHS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    fetchRevenueAnalytics();
  }, []);

  if (!mounted) {
    return null;
  }

  const StatCard = ({
    title,
    value,
    icon,
    gradient,
  }) => {
    return (
      <div
        className={`
          relative
          overflow-hidden
          rounded-3xl
          ${gradient}
          p-6
          text-white
          min-h-[180px]
          flex
          flex-col
          justify-between
          shadow-2xl
          border
          border-white/10
        `}
      >
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            {icon}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-white/70 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-black mt-3 break-words">
            {value}
          </h2>
        </div>
      </div>
    );
  };

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-gradient-to-br
        from-[#07111f]
        via-[#0f172a]
        to-[#111827]
        p-5
        sm:p-6
        lg:p-8
        min-w-0
      "
    >
      <div
        className="
          relative
          z-10
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
          mb-8
        "
      >
        <div>
          <div
            className="
              inline-flex
              items-center
              gap-2
              bg-cyan-500/10
              border
              border-cyan-400/20
              px-4
              py-2
              rounded-full
              text-cyan-400
              text-sm
              font-semibold
              mb-5
            "
          >
            <Activity size={16} />
            Live Revenue Analytics
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white">
            Business Revenue
          </h2>
        </div>

        <button
          onClick={fetchRevenueAnalytics}
          className="
            flex
            items-center
            justify-center
            gap-3
            bg-white/10
            hover:bg-cyan-500/20
            border
            border-white/10
            text-white
            px-6
            py-4
            rounded-2xl
            font-semibold
          "
        >
          <RefreshCcw size={18} />
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="h-[500px] flex items-center justify-center text-white text-xl font-bold">
          Loading Analytics...
        </div>
      ) : (
        <>
          <div
            className="
              relative
              z-10
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-5
              gap-5
              min-w-0
            "
          >
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              icon={<IndianRupee size={28} />}
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
            />

            <StatCard
              title="Monthly Growth"
              value={`${stats.monthlyGrowth}%`}
              icon={<TrendingUp size={28} />}
              gradient="bg-gradient-to-br from-emerald-500 to-green-700"
            />

            <StatCard
              title="Transactions"
              value={stats.totalTransactions.toLocaleString()}
              icon={<Activity size={28} />}
              gradient="bg-gradient-to-br from-purple-500 to-fuchsia-700"
            />

            <StatCard
              title="Avg Revenue"
              value={`₹${stats.avgRevenue.toLocaleString()}`}
              icon={<Wallet size={28} />}
              gradient="bg-gradient-to-br from-orange-500 to-red-600"
            />

            <StatCard
              title="Highest Revenue"
              value={`₹${stats.highestRevenue.toLocaleString()}`}
              icon={<ArrowUpRight size={28} />}
              gradient="bg-gradient-to-br from-pink-500 to-rose-600"
            />
          </div>

          <div
            className="
              relative
              z-10
              mt-8
              rounded-[32px]
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              p-4
              lg:p-8
              overflow-hidden
              w-full
            "
          >
            <div
              style={{
                width: "100%",
                height: "450px",
                minWidth: 0,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
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

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                  />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}