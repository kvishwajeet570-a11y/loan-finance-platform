"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Wallet,
  CreditCard,
  BadgeIndianRupee,
  CalendarDays,
  Briefcase,
  Award,
  Pencil,
  Camera,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Activity,
  Globe,
  X,
  Upload,

} from "lucide-react";

export default function UserProfile() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    saving,
    setSaving
  ] = useState(false);

  const [
    showEditModal,
    setShowEditModal
  ] = useState(false);

  const [
    user,
    setUser
  ] = useState(null);

  const [
    formData,
    setFormData
  ] = useState({

    name: "",

    email: "",

    phone: "",

    city: "",

    role: "",

    profileImage: "",

  });

  /* ========================================
     PROFILE COMPLETION
  ======================================== */

  const profileCompletion =
    useMemo(() => {

      if (!user) return 0;

      let completed = 0;

      const fields = [

        user?.name,

        user?.email,

        user?.phone,

        user?.city,

        user?.role,

        user?.profileImage,

      ];

      fields.forEach((field) => {

        if (field) completed++;

      });

      return Math.round(
        (completed / fields.length) * 100
      );

    }, [user]);

  /* ========================================
     FETCH USER
  ======================================== */

  const fetchUserProfile =
    async () => {

      try {

        setLoading(true);

        const userId =
          localStorage.getItem(
            "userId"
          );

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.get(

            `/user/profile/${userId}`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        if (res.data.success) {

          setUser(
            res.data.user
          );

          setFormData({

            name:
              res.data.user?.name || "",

            email:
              res.data.user?.email || "",

            phone:
              res.data.user?.phone || "",

            city:
              res.data.user?.city || "",

            role:
              res.data.user?.role || "",

            profileImage:
              res.data.user?.profileImage || "",

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch profile"
        );

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     UPDATE PROFILE
  ======================================== */

  const updateProfile =
    async () => {

      try {

        setSaving(true);

        const userId =
          localStorage.getItem(
            "userId"
          );

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.put(

            `/user/update-profile/${userId}`,

            formData,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        if (res.data.success) {

          toast.success(
            "Profile updated successfully 🚀"
          );

          setUser(
            res.data.user
          );

          setShowEditModal(false);

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to update profile"
        );

      } finally {

        setSaving(false);

      }

    };

  /* ========================================
     HANDLE CHANGE
  ======================================== */

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,

      });

    };

  /* ========================================
     EFFECT
  ======================================== */

  useEffect(() => {

    fetchUserProfile();

  }, []);

  return (

    <>

      {/* ========================================
          MAIN CONTAINER
      ======================================== */}

      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] p-6 lg:p-8 shadow-[0_20px_100px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

        <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-blue-500/10 blur-[120px] rounded-full" />

        {/* HEADER */}

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

          <div>

            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

              <Sparkles size={15} />

              Enterprise User Profile

            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white">

              User Profile

            </h2>

            <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

              Manage profile, financial insights,
              security status & user analytics.

            </p>

          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap gap-4">

            <button

              onClick={fetchUserProfile}

              className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl transition-all duration-300"

            >

              <RefreshCcw

                size={18}

                className="group-hover:rotate-180 transition-all duration-500"

              />

              Refresh

            </button>

            <button

              onClick={() =>
                setShowEditModal(true)
              }

              className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl"

            >

              <Pencil size={18} />

              Edit Profile

            </button>

          </div>

        </div>

        {

          loading ? (

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {

                [1, 2, 3].map(

                  (item) => (

                    <div

                      key={item}

                      className="animate-pulse h-[450px] rounded-[32px] bg-white/5"

                    />

                  )

                )

              }

            </div>

          ) : (

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* LEFT */}

              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-white/10 blur-[100px] rounded-full" />

                <div className="relative z-10">

                  {/* IMAGE */}

                  <div className="relative w-fit mx-auto">

                    <img

                      src={

                        user?.profileImage ||

                        "https://i.pravatar.cc/300"

                      }

                      alt="profile"

                      className="w-40 h-40 rounded-full border-4 border-white/20 object-cover shadow-2xl"

                    />

                    <button className="absolute bottom-2 right-2 w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl">

                      <Camera size={20} />

                    </button>

                  </div>

                  {/* INFO */}

                  <div className="text-center mt-8">

                    <h2 className="text-4xl font-black">

                      {

                        user?.name ||

                        "User Name"

                      }

                    </h2>

                    <p className="text-white/80 text-lg mt-3">

                      {

                        user?.role ||

                        "Loan Advisor"

                      }

                    </p>

                    <div className="flex items-center justify-center gap-2 mt-5 text-emerald-300 font-semibold">

                      <CheckCircle2 size={18} />

                      Verified Account

                    </div>

                  </div>

                  {/* PROFILE COMPLETION */}

                  <div className="mt-10">

                    <div className="flex items-center justify-between mb-3">

                      <p className="text-white/80 font-semibold">

                        Profile Completion

                      </p>

                      <p className="font-black">

                        {

                          profileCompletion

                        }%

                      </p>

                    </div>

                    <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">

                      <div

                        className="h-full bg-white rounded-full transition-all duration-700"

                        style={{

                          width: `${profileCompletion}%`,

                        }}

                      />

                    </div>

                  </div>

                  {/* STATS */}

                  <div className="grid grid-cols-2 gap-5 mt-10">

                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">

                      <p className="text-white/70 text-sm">

                        Wallet

                      </p>

                      <h3 className="text-3xl font-black mt-3">

                        ₹{

                          Number(

                            user?.walletBalance || 0

                          ).toLocaleString()

                        }

                      </h3>

                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">

                      <p className="text-white/70 text-sm">

                        Cashback

                      </p>

                      <h3 className="text-3xl font-black mt-3">

                        ₹{

                          Number(

                            user?.cashback || 0

                          ).toLocaleString()

                        }

                      </h3>

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT */}

              <div className="xl:col-span-2 space-y-8">

                {/* PERSONAL INFO */}

                <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

                  <div className="flex items-center gap-4 mb-8">

                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-2xl">

                      <User size={30} />

                    </div>

                    <div>

                      <h3 className="text-3xl font-black text-white">

                        Personal Information

                      </h3>

                      <p className="text-slate-400 mt-2">

                        Real-time account information

                      </p>

                    </div>

                  </div>

                  {/* GRID */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {[

                      {

                        icon: User,

                        label: "Full Name",

                        value:
                          user?.name ||

                          "N/A",

                      },

                      {

                        icon: Mail,

                        label: "Email",

                        value:
                          user?.email ||

                          "N/A",

                      },

                      {

                        icon: Phone,

                        label: "Phone",

                        value:
                          user?.phone ||

                          "N/A",

                      },

                      {

                        icon: MapPin,

                        label: "Location",

                        value:
                          user?.city ||

                          "N/A",

                      },

                      {

                        icon: Briefcase,

                        label: "Role",

                        value:
                          user?.role ||

                          "N/A",

                      },

                      {

                        icon: CalendarDays,

                        label: "Joined",

                        value:
                          user?.createdAt

                            ? new Date(

                                user.createdAt

                              ).toLocaleDateString()

                            : "N/A",

                      },

                    ].map((item, index) => {

                      const Icon =
                        item.icon;

                      return (

                        <div

                          key={index}

                          className="bg-white/5 border border-white/10 rounded-3xl p-5"

                        >

                          <div className="flex items-center gap-3 text-cyan-400 mb-4">

                            <Icon size={20} />

                            <span className="font-semibold">

                              {

                                item.label

                              }

                            </span>

                          </div>

                          <h3 className="text-2xl font-black text-white break-all">

                            {

                              item.value

                            }

                          </h3>

                        </div>

                      );

                    })}

                  </div>

                </div>

                {/* ANALYTICS */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* FINANCIAL */}

                  <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

                    <div className="flex items-center gap-4 mb-8">

                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-2xl">

                        <Wallet size={30} />

                      </div>

                      <div>

                        <h3 className="text-3xl font-black text-white">

                          Financial Overview

                        </h3>

                        <p className="text-slate-400 mt-2">

                          Wallet & transactions

                        </p>

                      </div>

                    </div>

                    <div className="space-y-5">

                      {[

                        {

                          icon: Wallet,

                          label:
                            "Wallet Balance",

                          value: `₹${Number(

                            user?.walletBalance || 0

                          ).toLocaleString()}`,

                          color:
                            "text-cyan-400",

                        },

                        {

                          icon:
                            BadgeIndianRupee,

                          label:
                            "Cashback",

                          value: `₹${Number(

                            user?.cashback || 0

                          ).toLocaleString()}`,

                          color:
                            "text-emerald-400",

                        },

                        {

                          icon:
                            CreditCard,

                          label:
                            "Transactions",

                          value:
                            user?.transactions ||

                            0,

                          color:
                            "text-purple-400",

                        },

                      ].map((item, index) => {

                        const Icon =
                          item.icon;

                        return (

                          <div

                            key={index}

                            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-5"

                          >

                            <div className="flex items-center gap-3">

                              <Icon

                                size={20}

                                className={

                                  item.color

                                }

                              />

                              <span className="text-white font-semibold">

                                {

                                  item.label

                                }

                              </span>

                            </div>

                            <h3 className={`

                              text-2xl

                              font-black

                              ${item.color}

                            `}>

                              {

                                item.value

                              }

                            </h3>

                          </div>

                        );

                      })}

                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

                    <div className="flex items-center gap-4 mb-8">

                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-white shadow-2xl">

                        <ShieldCheck size={30} />

                      </div>

                      <div>

                        <h3 className="text-3xl font-black text-white">

                          Account Status

                        </h3>

                        <p className="text-slate-400 mt-2">

                          Security & activity

                        </p>

                      </div>

                    </div>

                    <div className="space-y-5">

                      {[

                        {

                          icon:
                            CheckCircle2,

                          label:
                            "Status",

                          value:
                            "Active",

                          color:
                            "text-emerald-400",

                        },

                        {

                          icon:
                            TrendingUp,

                          label:
                            "Activity",

                          value:
                            "High",

                          color:
                            "text-cyan-400",

                        },

                        {

                          icon:
                            Globe,

                          label:
                            "Devices",

                          value:
                            "3 Devices",

                          color:
                            "text-yellow-400",

                        },

                        {

                          icon:
                            Award,

                          label:
                            "Membership",

                          value:
                            "Premium",

                          color:
                            "text-pink-400",

                        },

                      ].map((item, index) => {

                        const Icon =
                          item.icon;

                        return (

                          <div

                            key={index}

                            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-5"

                          >

                            <div className="flex items-center gap-3">

                              <Icon

                                size={20}

                                className={

                                  item.color

                                }

                              />

                              <span className="text-white font-semibold">

                                {

                                  item.label

                                }

                              </span>

                            </div>

                            <span className={`

                              font-black

                              text-xl

                              ${item.color}

                            `}>

                              {

                                item.value

                              }

                            </span>

                          </div>

                        );

                      })}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )

        }

      </div>

      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {

        showEditModal && (

          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

            <div className="relative w-full max-w-3xl rounded-[36px] border border-white/10 bg-gradient-to-br from-[#07111f] via-[#0f172a] to-[#111827] p-8 shadow-[0_25px_100px_rgba(0,0,0,0.55)]">

              {/* CLOSE */}

              <button

                onClick={() =>
                  setShowEditModal(false)
                }

                className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center"

              >

                <X size={22} />

              </button>

              {/* HEADER */}

              <div className="mb-8">

                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

                  <Upload size={15} />

                  Update Profile

                </div>

                <h2 className="text-4xl font-black text-white">

                  Edit Profile

                </h2>

                <p className="text-slate-400 text-lg mt-3">

                  Update your personal information & profile details.

                </p>

              </div>

              {/* FORM */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {[

                  {

                    label:
                      "Full Name",

                    name:
                      "name",

                  },

                  {

                    label:
                      "Email",

                    name:
                      "email",

                  },

                  {

                    label:
                      "Phone",

                    name:
                      "phone",

                  },

                  {

                    label:
                      "City",

                    name:
                      "city",

                  },

                  {

                    label:
                      "Role",

                    name:
                      "role",

                  },

                  {

                    label:
                      "Profile Image URL",

                    name:
                      "profileImage",

                  },

                ].map((item, index) => (

                  <div key={index}>

                    <label className="text-slate-300 text-sm font-semibold mb-3 block">

                      {

                        item.label

                      }

                    </label>

                    <input

                      type="text"

                      name={item.name}

                      value={

                        formData[
                          item.name
                        ]

                      }

                      onChange={handleChange}

                      placeholder={

                        item.label

                      }

                      className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-400/30 text-white p-4 rounded-2xl outline-none transition-all duration-300"

                    />

                  </div>

                ))}

              </div>

              {/* BUTTON */}

              <button

                onClick={updateProfile}

                disabled={saving}

                className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

              >

                {

                  saving

                    ? "Updating Profile..."

                    : "Save Changes"

                }

              </button>

            </div>

          </div>

        )

      }

    </>

  );

}