"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import {

  Shield,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  Fingerprint,
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
  Monitor,
  MapPin,
  Clock3,
  Wifi,

} from "lucide-react";

export default function SecuritySettings() {

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
    showPassword,
    setShowPassword
  ] = useState(false);

  const [
    devices,
    setDevices
  ] = useState([]);

  const [
    settings,
    setSettings
  ] = useState({

    twoFactor: false,

    biometricLogin: false,

    loginAlerts: true,

    transactionPin: true,

    deviceTracking: true,

    currentPassword: "",

    newPassword: "",

    confirmPassword: "",

  });

  /* ========================================
     PASSWORD STRENGTH
  ======================================== */

  const passwordStrength =
    useMemo(() => {

      const password =
        settings.newPassword;

      let score = 0;

      if (password.length >= 8)
        score++;

      if (/[A-Z]/.test(password))
        score++;

      if (/[0-9]/.test(password))
        score++;

      if (/[^A-Za-z0-9]/.test(password))
        score++;

      if (score <= 1) {

        return {

          label: "Weak",

          width: "25%",

          color:
            "from-red-500 to-rose-600",

        };

      }

      if (score <= 3) {

        return {

          label: "Medium",

          width: "65%",

          color:
            "from-yellow-400 to-orange-500",

        };

      }

      return {

        label: "Strong",

        width: "100%",

        color:
          "from-emerald-500 to-green-600",

      };

    }, [

      settings.newPassword

    ]);

  /* ========================================
     SECURITY SCORE
  ======================================== */

  const securityScore =
    useMemo(() => {

      let score = 40;

      if (
        settings.twoFactor
      ) score += 20;

      if (
        settings.biometricLogin
      ) score += 15;

      if (
        settings.loginAlerts
      ) score += 10;

      if (
        settings.transactionPin
      ) score += 10;

      if (
        settings.deviceTracking
      ) score += 5;

      return score;

    }, [

      settings

    ]);

  /* ========================================
     FETCH SETTINGS
  ======================================== */

  const fetchSecuritySettings =
    async () => {

      try {

        setLoading(true);

        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }

        const res =
          await api.get(

            `/security/settings/${userId}`

          );

        if (res.data.success) {

          setSettings(

            (prev) => ({

              ...prev,

              twoFactor:
                res.data.settings
                  ?.twoFactor ||

                false,

              biometricLogin:
                res.data.settings
                  ?.biometricLogin ||

                false,

              loginAlerts:
                res.data.settings
                  ?.loginAlerts ??

                true,

              transactionPin:
                res.data.settings
                  ?.transactionPin ??

                true,

              deviceTracking:
                res.data.settings
                  ?.deviceTracking ??

                true,

            })

          );

        }

        /* MOCK ACTIVE DEVICES */

        setDevices([

          {

            id: 1,

            device:
              "Chrome on Windows",

            location:
              "Patna, India",

            active:
              "Active Now",

          },

          {

            id: 2,

            device:
              "iPhone Safari",

            location:
              "Delhi, India",

            active:
              "2 hours ago",

          },

          {

            id: 3,

            device:
              "MacBook Pro",

            location:
              "Mumbai, India",

            active:
              "Yesterday",

          },

        ]);

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch security settings"

        );

      } finally {

        setLoading(false);

      }

    };

  /* ========================================
     TOGGLE
  ======================================== */

  const handleToggle =
    (field) => {

      setSettings({

        ...settings,

        [field]:
          !settings[field],

      });

    };

  /* ========================================
     SAVE SETTINGS
  ======================================== */

  const saveSettings =
    async () => {

      try {

        setSaving(true);

        const userId =
          localStorage.getItem(
            "userId"
          );

        const res =
          await api.post(

            "/security/update-settings",

            {

              userId,

              settings,

            }

          );

        if (res.data.success) {

          toast.success(

            "Security settings updated 🚀"

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to save settings"

        );

      } finally {

        setSaving(false);

      }

    };

  /* ========================================
     UPDATE PASSWORD
  ======================================== */

  const updatePassword =
    async () => {

      try {

        if (

          !settings.currentPassword ||

          !settings.newPassword ||

          !settings.confirmPassword

        ) {

          toast.error(

            "Please fill all fields"

          );

          return;

        }

        if (

          settings.newPassword !==

          settings.confirmPassword

        ) {

          toast.error(

            "Passwords do not match"

          );

          return;

        }

        setSaving(true);

        const userId =
          localStorage.getItem(
            "userId"
          );

        const res =
          await api.post(

            "/security/update-password",

            {

              userId,

              currentPassword:
                settings.currentPassword,

              newPassword:
                settings.newPassword,

            }

          );

        if (res.data.success) {

          toast.success(

            "Password updated successfully 🔐"

          );

          setSettings({

            ...settings,

            currentPassword: "",

            newPassword: "",

            confirmPassword: "",

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to update password"

        );

      } finally {

        setSaving(false);

      }

    };

  /* ========================================
     EFFECT
  ======================================== */

  useEffect(() => {

    fetchSecuritySettings();

  }, []);

  /* ========================================
     TOGGLE UI
  ======================================== */

  const ToggleSwitch = ({
    enabled,
    onClick,
  }) => (

    <button

      onClick={onClick}

      className={`

        relative

        w-20

        h-10

        rounded-full

        transition-all

        duration-300

        ${

          enabled

            ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.45)]"

            : "bg-slate-700"

        }

      `}

    >

      <div

        className={`

          absolute

          top-1

          w-8

          h-8

          rounded-full

          bg-white

          transition-all

          duration-300

          shadow-xl

          ${

            enabled

              ? "left-11"

              : "left-1"

          }

        `}

      />

    </button>

  );

  return (

    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#07111f] via-[#0f172a] to-[#111827] shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-3xl p-6 lg:p-8">

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[240px] h-[240px] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* HEADER */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Shield size={16} />

            Enterprise Security Center

          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white">

            Security Settings

          </h2>

          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Protect your account with advanced authentication,
            password protection & live device monitoring.

          </p>

        </div>

        <button

          onClick={fetchSecuritySettings}

          className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh

        </button>

      </div>

      {

        loading ? (

          <div className="space-y-6">

            {

              [1, 2, 3].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-[180px] rounded-3xl bg-white/5"

                  />

                )

              )

            }

          </div>

        ) : (

          <>

            {/* TOP CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* SCORE */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <Shield size={42} />

                  <p className="mt-6 text-white/80">

                    Security Score

                  </p>

                  <h2 className="text-5xl font-black mt-3">

                    {securityScore}%

                  </h2>

                </div>

              </div>

              {/* STATUS */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <CheckCircle2 size={42} />

                  <p className="mt-6 text-white/80">

                    Account Status

                  </p>

                  <h2 className="text-4xl font-black mt-3">

                    Protected

                  </h2>

                </div>

              </div>

              {/* ALERTS */}

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-fuchsia-700 p-6 text-white shadow-2xl">

                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <AlertTriangle size={42} />

                  <p className="mt-6 text-white/80">

                    Threat Alerts

                  </p>

                  <h2 className="text-4xl font-black mt-3">

                    Active

                  </h2>

                </div>

              </div>

            </div>

            {/* SECURITY OPTIONS */}

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 lg:p-8">

              <div className="flex items-center gap-3 mb-8">

                <Lock className="text-cyan-400" />

                <h3 className="text-3xl font-black text-white">

                  Account Protection

                </h3>

              </div>

              <div className="space-y-5">

                {[

                  {

                    title:
                      "Two Factor Authentication",

                    desc:
                      "Extra protection during login",

                    icon:
                      Shield,

                    field:
                      "twoFactor",

                  },

                  {

                    title:
                      "Biometric Login",

                    desc:
                      "Fingerprint & face unlock support",

                    icon:
                      Fingerprint,

                    field:
                      "biometricLogin",

                  },

                  {

                    title:
                      "Login Alerts",

                    desc:
                      "Get suspicious login notifications",

                    icon:
                      Smartphone,

                    field:
                      "loginAlerts",

                  },

                  {

                    title:
                      "Transaction PIN",

                    desc:
                      "Protect transactions with secure PIN",

                    icon:
                      Lock,

                    field:
                      "transactionPin",

                  },

                  {

                    title:
                      "Device Tracking",

                    desc:
                      "Monitor active sessions & devices",

                    icon:
                      Monitor,

                    field:
                      "deviceTracking",

                  },

                ].map((item, index) => {

                  const Icon =
                    item.icon;

                  return (

                    <div

                      key={index}

                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/20 transition-all duration-300"

                    >

                      <div className="flex items-start gap-5">

                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">

                          <Icon size={28} />

                        </div>

                        <div>

                          <h4 className="text-xl font-bold text-white">

                            {item.title}

                          </h4>

                          <p className="text-slate-400 mt-2">

                            {item.desc}

                          </p>

                        </div>

                      </div>

                      <ToggleSwitch

                        enabled={
                          settings[
                            item.field
                          ]
                        }

                        onClick={() =>
                          handleToggle(
                            item.field
                          )
                        }

                      />

                    </div>

                  );

                })}

              </div>

              <button

                onClick={saveSettings}

                disabled={saving}

                className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

              >

                {

                  saving

                    ? "Saving Security Settings..."

                    : "Save Security Settings"

                }

              </button>

            </div>

            {/* PASSWORD */}

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 lg:p-8 mt-8">

              <div className="flex items-center gap-3 mb-8">

                <Lock className="text-cyan-400" />

                <h3 className="text-3xl font-black text-white">

                  Change Password

                </h3>

              </div>

              {/* INPUTS */}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {[

                  {

                    label:
                      "Current Password",

                    field:
                      "currentPassword",

                  },

                  {

                    label:
                      "New Password",

                    field:
                      "newPassword",

                  },

                  {

                    label:
                      "Confirm Password",

                    field:
                      "confirmPassword",

                  },

                ].map((item, index) => (

                  <div key={index}>

                    <label className="text-slate-300 text-sm font-semibold mb-3 block">

                      {item.label}

                    </label>

                    <div className="relative">

                      <input

                        type={

                          showPassword

                            ? "text"

                            : "password"

                        }

                        placeholder={
                          item.label
                        }

                        value={
                          settings[
                            item.field
                          ]
                        }

                        onChange={(e) =>

                          setSettings({

                            ...settings,

                            [item.field]:
                              e.target.value,

                          })

                        }

                        className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-400/30 text-white p-4 rounded-2xl outline-none transition-all duration-300"

                      />

                      {

                        index === 2 && (

                          <button

                            type="button"

                            onClick={() =>

                              setShowPassword(

                                !showPassword

                              )
                            }

                            className="absolute top-4 right-4 text-slate-400 hover:text-white"

                          >

                            {

                              showPassword

                                ? <EyeOff size={20} />

                                : <Eye size={20} />

                            }

                          </button>

                        )

                      }

                    </div>

                  </div>

                ))}

              </div>

              {/* PASSWORD STRENGTH */}

              {

                settings.newPassword && (

                  <div className="mt-8">

                    <div className="flex items-center justify-between mb-3">

                      <p className="text-slate-300 font-semibold">

                        Password Strength

                      </p>

                      <p className="text-white font-bold">

                        {

                          passwordStrength.label

                        }

                      </p>

                    </div>

                    <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden border border-white/10">

                      <div

                        className={`

                          h-full

                          bg-gradient-to-r

                          ${passwordStrength.color}

                          transition-all

                          duration-500

                        `}

                        style={{

                          width:
                            passwordStrength.width,

                        }}

                      />

                    </div>

                  </div>

                )

              }

              <button

                onClick={updatePassword}

                disabled={saving}

                className="w-full mt-8 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:opacity-90 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

              >

                {

                  saving

                    ? "Updating Password..."

                    : "Update Password"

                }

              </button>

            </div>

            {/* ACTIVE DEVICES */}

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 lg:p-8 mt-8">

              <div className="flex items-center gap-3 mb-8">

                <Monitor className="text-cyan-400" />

                <h3 className="text-3xl font-black text-white">

                  Active Devices

                </h3>

              </div>

              <div className="space-y-5">

                {

                  devices.map(

                    (device) => (

                      <div

                        key={device.id}

                        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-5 rounded-3xl bg-white/[0.03] border border-white/10"

                      >

                        <div className="flex items-start gap-5">

                          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">

                            <Monitor size={28} />

                          </div>

                          <div>

                            <h4 className="text-xl font-bold text-white">

                              {

                                device.device

                              }

                            </h4>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-400">

                              <div className="flex items-center gap-2">

                                <MapPin size={16} />

                                {

                                  device.location

                                }

                              </div>

                              <div className="flex items-center gap-2">

                                <Clock3 size={16} />

                                {

                                  device.active

                                }

                              </div>

                            </div>

                          </div>

                        </div>

                        <button className="bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-400 px-6 py-3 rounded-2xl font-bold transition-all duration-300">

                          Logout Device

                        </button>

                      </div>

                    )

                  )

                }

              </div>

            </div>

            {/* FOOTER */}

            <div className="mt-8 rounded-[32px] border border-cyan-400/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6">

              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">

                    <Wifi size={28} />

                  </div>

                  <div>

                    <h3 className="text-2xl font-black text-white">

                      Security Monitoring Active

                    </h3>

                    <p className="text-slate-400 mt-1">

                      Your account is protected with enterprise-grade monitoring.

                    </p>

                  </div>

                </div>

                <div className="text-emerald-400 font-bold text-lg">

                  No Threats Detected

                </div>

              </div>

            </div>

          </>

        )

      }

    </div>

  );

}