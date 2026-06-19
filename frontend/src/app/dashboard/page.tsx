"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

import RevenueChart from "@/components/dashboard/RevenueChart";
import PipelineFunnel from "@/components/dashboard/PipelineFunnel";
import LeadBreakdown from "@/components/dashboard/LeadBreakdown";
import LoanAnalytics from "@/components/dashboard/LoanAnalytics";

import Achievements from "@/components/dashboard/Achievements";
import MyLeads from "@/components/dashboard/MyLeads";
import LoanApplications from "@/components/dashboard/LoanApplications";
import CommissionCard from "@/components/dashboard/CommissionCard";
import Leaderboard from "@/components/dashboard/Leaderboard";
import DashboardNotifications from "@/components/dashboard/DashboardNotifications";
import RevenueAnalytics from "@/components/dashboard/RevenueAnalytics";
import SecuritySettings from "@/components/dashboard/SecuritySettings";
import AccountSettings from "@/components/dashboard/AccountSettings";

import {
  TrendingUp,
  Users,
  Wallet,
  Activity,
  Sparkles,
} from "lucide-react";

/* ========================================
   TYPES
======================================== */

interface DashboardData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  activeLoans: number;
}

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  borderColor: string;
  gradient: string;
}

interface DashboardSectionProps {
  children: ReactNode;
}

/* ========================================
   KPI CARD
======================================== */

function KpiCard({
  title,
  value,
  icon,
  borderColor,
  gradient,
}: KpiCardProps) {

  return (

    <div
      className={`

        rounded-[32px]
        border
        ${borderColor}
        ${gradient}
        backdrop-blur-2xl
        p-8
        min-h-[240px]
        flex
        flex-col
        justify-between

      `}
    >

      {/* ICON */}

      <div
        className="

          w-16
          h-16
          rounded-2xl
          bg-white/10
          border
          border-white/10
          flex
          items-center
          justify-center

        "
      >

        {icon}

      </div>

      {/* CONTENT */}

      <div>

        <p className="text-gray-400">

          {title}

        </p>

        <h2
          className="

            text-4xl
            xl:text-5xl
            font-black
            text-white
            mt-4
            break-words

          "
        >

          {value}

        </h2>

      </div>

    </div>

  );

}

/* ========================================
   SECTION WRAPPER
======================================== */

function DashboardSection({
  children,
}: DashboardSectionProps) {

  return (

    <section
      className="

        w-full
        rounded-[36px]
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-2xl
        p-4
        lg:p-6
        overflow-hidden

      "
    >

      {children}

    </section>

  );

}

/* ========================================
   PAGE
======================================== */

export default function DashboardPage() {

  /* ========================================
     STATES
  ======================================== */

  const [
    activePage,
    setActivePage,
  ] = useState("dashboard");

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    user,
    setUser,
  ] = useState<any>(null);

  const [
    dashboardData,
    setDashboardData,
  ] = useState<DashboardData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    activeLoans: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* ========================================
     LOAD USER
  ======================================== */

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);

  /* ========================================
     FETCH DASHBOARD
  ======================================== */

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          setLoading(true);

          setError("");

          const token =
            localStorage.getItem(
              "token"
            );

          const response =
            await api.get(
              "/revenue/analytics",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setDashboardData({

            totalRevenue:
              response.data
                ?.totalRevenue || 0,

            monthlyRevenue:
              response.data
                ?.monthlyRevenue || 0,

            totalUsers:
              response.data
                ?.totalUsers || 0,

            activeLoans:
              response.data
                ?.activeLoans || 0,

          });

        } catch (error: any) {

          console.log(
            "DASHBOARD ERROR =>",
            error
          );

          setError(
            "Failed to load dashboard"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchDashboard();

  }, []);

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (

      <main
        className="

          min-h-screen
          bg-[#020617]
          flex
          items-center
          justify-center

        "
      >

        <div
          className="

            w-24
            h-24
            rounded-full
            border-[6px]
            border-cyan-400
            border-t-purple-500
            animate-spin

          "
        />

      </main>

    );

  }

  /* ========================================
     ERROR
  ======================================== */

  if (error) {

    return (

      <main
        className="

          min-h-screen
          bg-[#020617]
          flex
          items-center
          justify-center
          px-6

        "
      >

        <div
          className="

            max-w-lg
            w-full
            rounded-[32px]
            border
            border-red-500/20
            bg-red-500/10
            backdrop-blur-xl
            p-10
            text-center

          "
        >

          <h1
            className="

              text-4xl
              font-bold
              text-red-400

            "
          >

            Dashboard Error

          </h1>

          <p
            className="

              text-gray-300
              mt-5

            "
          >

            {error}

          </p>

        </div>

      </main>

    );

  }

  /* ========================================
     RENDER PAGE
  ======================================== */

  const renderPage = () => {

    switch (activePage) {

      case "achievements":
        return <Achievements />;

      case "myleads":
        return <MyLeads />;

      case "applications":
        return <LoanApplications />;

      case "commission":
        return <CommissionCard />;

      case "leaderboard":
        return <Leaderboard />;

      case "notifications":
        return <DashboardNotifications />;

      case "analytics":
        return <RevenueAnalytics />;

      case "security":
        return <SecuritySettings />;

      case "settings":
        return <AccountSettings />;

      default:

        return (

          <div
            className="

              w-full
              space-y-8

            "
          >

            {/* HERO */}

            <section
              className="

                relative
                overflow-hidden
                rounded-[36px]
                border
                border-cyan-400/10
                bg-gradient-to-br
                from-cyan-500/10
                via-blue-500/5
                to-purple-500/10
                backdrop-blur-2xl
                p-6
                lg:p-10

              "
            >

              <div className="relative z-10">

                <div
                  className="

                    inline-flex
                    items-center
                    gap-2
                    px-5
                    py-2
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                    text-cyan-300
                    text-xs
                    uppercase
                    font-semibold
                    mb-6

                  "
                >

                  <Sparkles size={14} />

                  Premium Fintech Dashboard

                </div>

                <h1
                  className="

                    text-4xl
                    md:text-5xl
                    xl:text-6xl
                    font-black
                    text-white
                    leading-tight

                  "
                >

                  Welcome Back,
                  <br />

                  <span
                    className="

                      bg-gradient-to-r
                      from-cyan-400
                      via-blue-500
                      to-purple-500
                      bg-clip-text
                      text-transparent

                    "
                  >

                    {
                      user?.name ||
                      "Financial Partner"
                    }

                  </span>

                </h1>

              </div>

            </section>

            {/* KPI SECTION */}

            <section
              className="

                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-6

              "
            >

              <KpiCard
                title="Total Revenue"
                value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
                icon={
                  <Wallet
                    className="text-cyan-400"
                    size={30}
                  />
                }
                borderColor="border-cyan-400/10"
                gradient="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5"
              />

              <KpiCard
                title="Monthly Revenue"
                value={`₹${dashboardData.monthlyRevenue.toLocaleString()}`}
                icon={
                  <TrendingUp
                    className="text-purple-400"
                    size={30}
                  />
                }
                borderColor="border-purple-400/10"
                gradient="bg-gradient-to-br from-purple-500/10 to-purple-500/5"
              />

              <KpiCard
                title="Total Users"
                value={dashboardData.totalUsers.toLocaleString()}
                icon={
                  <Users
                    className="text-blue-400"
                    size={30}
                  />
                }
                borderColor="border-blue-400/10"
                gradient="bg-gradient-to-br from-blue-500/10 to-blue-500/5"
              />

              <KpiCard
                title="Active Loans"
                value={dashboardData.activeLoans.toLocaleString()}
                icon={
                  <Activity
                    className="text-emerald-400"
                    size={30}
                  />
                }
                borderColor="border-emerald-400/10"
                gradient="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5"
              />

            </section>

            {/* ROW 1 */}

            <DashboardSection>

              <RevenueChart />

            </DashboardSection>

            {/* ROW 2 */}

            <DashboardSection>

              <PipelineFunnel />

            </DashboardSection>

            {/* ROW 3 */}

            <DashboardSection>

              <LeadBreakdown />

            </DashboardSection>

            {/* ROW 4 */}

            <DashboardSection>

              <LoanAnalytics />

            </DashboardSection>

          </div>

        );

    }

  };

  return (

    <main
      className="

        min-h-screen
        bg-[#020617]
        flex
        overflow-hidden

      "
    >

      {/* SIDEBAR */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* CONTENT */}

      <section
        className="

          flex-1
          overflow-y-auto
          overflow-x-hidden
          relative

        "
      >

        <div
          className="

            relative
            z-10
            p-4
            lg:p-8

          "
        >

          {/* TOPBAR */}

          <Topbar
            user={user}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* PAGE */}

          <div className="mt-8">

            {renderPage()}

          </div>

        </div>

      </section>

    </main>

  );

}