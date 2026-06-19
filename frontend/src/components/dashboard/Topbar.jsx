"use client";

import {
  useEffect,
  useState,
} from "react";

import {

  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Settings,
  LogOut,
  UserCircle2,
  ChevronDown,

} from "lucide-react";

import toast from "react-hot-toast";

import api from "@/lib/api";

export default function Topbar({

  user,

  setSidebarOpen,

  sidebarOpen,

}) {

  const [
    search,
    setSearch
  ] = useState("");

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    showNotifications,
    setShowNotifications
  ] = useState(false);

  const [
    showProfileMenu,
    setShowProfileMenu
  ] = useState(false);

  const [
    loading,
    setLoading
  ] = useState(true);

  /* ========================================
     FETCH NOTIFICATIONS
  ======================================== */

  const fetchNotifications =
    async () => {

      try {

        setLoading(true);

        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) {

          return;

        }

        const res =
          await api.get(

            `/notifications/${userId}`

          );

        if (res.data.success) {

          setNotifications(

            res.data.notifications || []

          );

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
     EFFECT
  ======================================== */

  useEffect(() => {

    fetchNotifications();

  }, []);

  return (

    <div className="relative overflow-visible">

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full" />

      {/* MAIN */}

      <div className="relative z-20 flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6 bg-gradient-to-r from-[#020617]/90 via-[#081028]/90 to-[#111827]/90 border border-white/10 rounded-[36px] px-6 lg:px-8 py-6 backdrop-blur-3xl shadow-[0_20px_100px_rgba(0,0,0,0.55)]">

        {/* LEFT */}

        <div className="flex items-center gap-5">

          {/* MOBILE MENU */}

          <button

            onClick={() =>

              setSidebarOpen?.(
                !sidebarOpen
              )
            }

            className="2xl:hidden w-14 h-14 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-105"

          >

            {

              sidebarOpen

                ? <X size={24} />

                : <Menu size={24} />

            }

          </button>

          {/* TITLE */}

          <div>

            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-4 shadow-[0_0_30px_rgba(0,229,255,0.12)]">

              <Sparkles size={15} />

              Enterprise CRM Dashboard

            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-[-0.05em] leading-tight">

              LoanPay Dashboard

            </h1>

            <p className="text-slate-400 text-lg mt-3">

              Welcome Back,

              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">

                {" "}

                {

                  user?.name ||

                  "User"

                }

              </span>

              {" "}👋

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex flex-col xl:flex-row xl:items-center gap-5">

          {/* SEARCH */}

          <div className="relative group">

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            <div className="relative flex items-center bg-white/[0.04] border border-white/10 hover:border-cyan-400/20 focus-within:border-cyan-400/30 px-5 py-4 rounded-3xl w-full xl:w-[340px] transition-all duration-300">

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

                placeholder="Search dashboard..."

                className="bg-transparent outline-none ml-3 text-white placeholder:text-slate-500 w-full"

              />

            </div>

          </div>

          {/* ACTIONS */}

          <div className="flex items-center gap-4">

            {/* NOTIFICATIONS */}

            <div className="relative">

              <button

                onClick={() =>

                  setShowNotifications(

                    !showNotifications

                  )
                }

                className="relative w-16 h-16 rounded-3xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-105"

              >

                <Bell size={24} />

                {

                  notifications.length > 0 && (

                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-xs min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(239,68,68,0.45)]">

                      {

                        notifications.length

                      }

                    </span>

                  )

                }

              </button>

              {/* DROPDOWN */}

              {

                showNotifications && (

                  <div className="absolute right-0 mt-5 w-[360px] rounded-[32px] border border-white/10 bg-[#081028]/95 backdrop-blur-3xl overflow-hidden z-50 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">

                    <div className="p-6 border-b border-white/10">

                      <h2 className="text-2xl font-bold text-white">

                        Notifications

                      </h2>

                    </div>

                    <div className="max-h-[420px] overflow-y-auto">

                      {

                        notifications.length === 0

                          ? (

                            <div className="p-8 text-center text-slate-400">

                              No notifications

                            </div>

                          )

                          : notifications.map(

                            (item, index) => (

                              <div
                                key={index}
                                className="p-5 border-b border-white/5 hover:bg-white/[0.03] transition-all"
                              >

                                <p className="text-white">

                                  {

                                    item.message ||

                                    "New notification"

                                  }

                                </p>

                              </div>

                            )

                          )

                      }

                    </div>

                  </div>

                )

              }

            </div>

            {/* SUPPORT */}

            <button className="hidden lg:flex items-center gap-3 bg-white/[0.04] hover:bg-purple-500/10 border border-white/10 hover:border-purple-400/20 text-white px-6 py-4 rounded-3xl transition-all duration-300 hover:scale-105">

              <MessageSquare size={20} />

              <span className="font-semibold">

                Support

              </span>

            </button>

            {/* PROFILE */}

            <div className="relative">

              <button

                onClick={() =>

                  setShowProfileMenu(

                    !showProfileMenu

                  )
                }

                className="flex items-center gap-4 bg-white/[0.04] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/20 px-4 py-3 rounded-3xl transition-all duration-300"

              >

                <div className="relative">

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(0,229,255,0.25)]">

                    <UserCircle2
                      size={34}
                    />

                  </div>

                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#081028] animate-pulse"></span>

                </div>

                <div className="hidden md:block text-left">

                  <h3 className="text-white font-bold text-lg">

                    {

                      user?.name ||

                      "User"

                    }

                  </h3>

                  <p className="text-emerald-400 text-sm">

                    ● Online

                  </p>

                </div>

                <ChevronDown className="text-slate-400" />

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}