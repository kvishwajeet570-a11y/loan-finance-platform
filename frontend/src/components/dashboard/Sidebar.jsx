"use client";

import {
  useEffect,
  useState,
} from "react";

import {

  Home,
  Users,
 Briefcase,
  Wallet,
  Trophy,
  Bell,
  Award,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  BarChart3,
  Shield,
  Sparkles,
  UserCircle2,

} from "lucide-react";

import toast from "react-hot-toast";

import api from "@/lib/api";

export default function Sidebar(props) {

  const {

    activePage = "dashboard",

    setActivePage,

  } = props;

  /* ========================================
     STATES
  ======================================== */

  const [
    collapsed,
    setCollapsed
  ] = useState(false);

  const [
    user,
    setUser
  ] = useState({

    name: "",

    role: "",

    avatar: "",

  });

  const [
    loading,
    setLoading
  ] = useState(true);

  /* ========================================
     MENUS
  ======================================== */

  const menus = [

    {

      name: "Dashboard",

      value: "dashboard",

      icon: Home,

      color:
        "from-cyan-500 to-blue-600",

    },

    {

      name: "My Leads",

      value: "myleads",

      icon: Users,

      color:
        "from-purple-500 to-fuchsia-600",

    },

    {

      name: "Applications",

      value: "applications",

      icon: Briefcase,

      color:
        "from-emerald-500 to-green-600",

    },

    {

      name: "Commission",

      value: "commission",

      icon: Wallet,

      color:
        "from-orange-500 to-red-500",

    },

    {

      name: "Leaderboard",

      value: "leaderboard",

      icon: Trophy,

      color:
        "from-yellow-400 to-orange-500",

    },

    {

      name: "Notifications",

      value: "notifications",

      icon: Bell,

      color:
        "from-pink-500 to-rose-600",

    },

    {

      name: "Achievements",

      value: "achievements",

      icon: Award,

      color:
        "from-indigo-500 to-blue-700",

    },

    {

      name: "Analytics",

      value: "analytics",

      icon: BarChart3,

      color:
        "from-cyan-400 to-teal-500",

    },

    {

      name: "Security",

      value: "security",

      icon: Shield,

      color:
        "from-red-500 to-pink-600",

    },

    {

      name: "Settings",

      value: "settings",

      icon: Settings,

      color:
        "from-slate-500 to-zinc-700",

    },

  ];

  /* ========================================
     FETCH USER
  ======================================== */

  const fetchUser =
    async () => {

      try {

        setLoading(true);

        const userId =
          localStorage.getItem("userId");

        if (!userId) {

          return;

        }

        const res =
          await api.get(

            `/user/profile/${userId}`

          );

        if (res.data.success) {

          setUser({

            name:
              res.data.user.name ||

              "LoanPay User",

            role:
              res.data.user.role ||

              "Financial Agent",

            avatar:
              res.data.user.avatar ||

              "",

          });

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     LOGOUT
  ======================================== */

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "userId"
      );

      toast.success(
        "Logged out successfully"
      );

      window.location.href =
        "/login";

    };

  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchUser();

  }, []);

  return (

    <div

      className={`

        relative

        min-h-screen

        transition-all

        duration-500

        border-r

        border-white/10

        bg-gradient-to-b

        from-[#020617]

        via-[#081120]

        to-[#0f172a]

        backdrop-blur-3xl

        shadow-[0_25px_120px_rgba(0,0,0,0.65)]

        before:absolute

        before:inset-0

        before:bg-white/[0.02]

        before:pointer-events-none

        overflow-hidden

        ${

          collapsed

            ? "w-[105px]"

            : "w-[290px]"

        }

      `}

    >

      {/* ========================================
          GLOW EFFECTS
      ======================================== */}

      <div className="absolute top-[-60px] left-[-40px] w-[240px] h-[240px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-80px] right-[-60px] w-[220px] h-[220px] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="absolute top-[40%] left-[30%] w-[160px] h-[160px] bg-purple-500/10 blur-[100px] rounded-full" />

      {/* ========================================
          SIDEBAR CONTENT
      ======================================== */}

      <div className="relative z-10 flex flex-col h-screen p-5">

        {/* ========================================
            TOP
        ======================================== */}

        <div className="flex items-center justify-between">

          {/* LOGO */}

          {

            !collapsed && (

              <div>

                <div className="flex items-center gap-3">

                  <div className="relative w-14 h-14 rounded-[20px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.25)]">

                    <Sparkles
                      className="text-white"
                      size={24}
                    />

                  </div>

                  <div>

                    <h1 className="text-[30px] leading-none font-black tracking-[-0.04em] text-white">

                      LoanPay

                    </h1>

                    <p className="text-cyan-400 text-sm mt-1">

                      Fintech Platform

                    </p>

                  </div>

                </div>

              </div>

            )

          }

          {/* TOGGLE */}

          <button

            onClick={() =>

              setCollapsed(
                !collapsed
              )
            }

            className="w-11 h-11 rounded-[18px] bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-105"

          >

            {

              collapsed

                ? (

                  <ChevronRight
                    size={20}
                  />

                )

                : (

                  <ChevronLeft
                    size={20}
                  />

                )

            }

          </button>

        </div>

        {/* ========================================
            USER PROFILE
        ======================================== */}

        <div className="mt-8">

          {

            loading ? (

              <div className="animate-pulse h-[110px] rounded-[30px] bg-white/5" />

            ) : (

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">

                {/* INNER GLOW */}

                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full" />

                <div className="relative z-10 flex items-center gap-4">

                  {/* AVATAR */}

                  <div className="relative w-14 h-14 rounded-[18px] bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.25)] overflow-hidden">

                    {

                      user.avatar ? (

                        <img

                          src={user.avatar}

                          alt="avatar"

                          className="w-full h-full object-cover"

                        />

                      ) : (

                        <UserCircle2

                          size={34}

                          className="text-white"

                        />

                      )

                    }

                  </div>

                  {/* INFO */}

                  {

                    !collapsed && (

                      <div className="min-w-0">

                        <h2 className="text-lg font-black text-white truncate">

                          {

                            user.name

                          }

                        </h2>

                        <p className="text-cyan-400 text-sm mt-1 truncate">

                          {

                            user.role

                          }

                        </p>

                      </div>

                    )

                  }

                </div>

              </div>

            )

          }

        </div>

        {/* ========================================
            MENUS
        ======================================== */}

        <div className="flex-1 overflow-y-auto mt-8 pr-1 custom-scrollbar">

          <div className="space-y-3">

            {

              menus.map((menu, index) => {

                const Icon =
                  menu.icon;

                const active =
                  activePage ===
                  menu.value;

                return (

                  <button

                    key={index}

                    onClick={() => {

                      if (

                        setActivePage

                      ) {

                        setActivePage(
                          menu.value
                        );

                      }

                    }}

                    className={`

                      group

                      relative

                      overflow-hidden

                      w-full

                      flex

                      items-center

                      gap-4

                      px-4

                      py-4

                      rounded-[28px]

                      transition-all

                      duration-300

                      border

                      ${

                        active

                          ? `

                            bg-gradient-to-r

                            ${menu.color}

                            border-transparent

                            shadow-[0_15px_50px_rgba(0,0,0,0.35)]

                            text-white

                            scale-[1.02]

                          `

                          : `

                            bg-white/[0.03]

                            border-white/10

                            hover:bg-white/[0.06]

                            text-slate-300

                            hover:text-white

                          `

                      }

                    `}

                  >

                    {/* HOVER GLOW */}

                    {

                      !active && (

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />

                      )

                    }

                    {/* ICON */}

                    <div

                      className={`

                        relative

                        z-10

                        flex

                        items-center

                        justify-center

                        rounded-[18px]

                        transition-all

                        duration-300

                        ${

                          active

                            ? "bg-white/15 w-12 h-12"

                            : "bg-white/[0.05] group-hover:bg-white/[0.08] w-12 h-12"

                        }

                      `}

                    >

                      <Icon size={22} />

                    </div>

                    {/* LABEL */}

                    {

                      !collapsed && (

                        <div className="relative z-10 text-left">

                          <h3 className="font-bold text-base">

                            {

                              menu.name

                            }

                          </h3>

                          <p className="text-xs opacity-70 mt-1">

                            Manage {

                              menu.name

                            }

                          </p>

                        </div>

                      )

                    }

                  </button>

                );

              })

            }

          </div>

        </div>

        {/* ========================================
            BOTTOM PANEL
        ======================================== */}

        <div className="mt-6">

          {/* PREMIUM CARD */}

          {

            !collapsed && (

              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] mb-5">

                {/* GLOW */}

                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-xl">

                    🚀 Premium Plan

                  </div>

                  <h2 className="text-[32px] leading-none font-black mt-5">

                    Grow Faster

                  </h2>

                  <p className="text-white/80 mt-3 text-sm leading-7">

                    Unlock advanced analytics, premium leads & enterprise dashboard features.

                  </p>

                  <button className="mt-5 w-full bg-white text-black py-3 rounded-[20px] font-bold hover:scale-[1.02] hover:opacity-95 transition-all duration-300">

                    Upgrade Now

                  </button>

                </div>

              </div>

            )

          }

          {/* LOGOUT */}

          <button

            onClick={handleLogout}

            className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-400 py-4 rounded-[22px] font-bold transition-all duration-300 hover:scale-[1.01]"

          >

            <LogOut size={20} />

            {

              !collapsed &&

              "Logout"

            }

          </button>

        </div>

      </div>

    </div>

  );

}