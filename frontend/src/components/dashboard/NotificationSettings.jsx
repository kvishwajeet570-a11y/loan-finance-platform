"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function NotificationSettings() {

  const [
    emailNotifications,
    setEmailNotifications,
  ] = useState(true);


  const [
    smsNotifications,
    setSmsNotifications,
  ] = useState(false);


  const [
    pushNotifications,
    setPushNotifications,
  ] = useState(true);


  const [
    marketingNotifications,
    setMarketingNotifications,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  /* ========================================
     FETCH SETTINGS
  ======================================== */

  const fetchSettings =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        const res =
          await api.get(

            `/notification/settings/${userId}`

          );


        if (res.data.success) {

          const settings =
            res.data.settings;


          setEmailNotifications(

            settings.emailNotifications

          );


          setSmsNotifications(

            settings.smsNotifications

          );


          setPushNotifications(

            settings.pushNotifications

          );


          setMarketingNotifications(

            settings.marketingNotifications

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to load settings"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     SAVE SETTINGS
  ======================================== */

  const saveSettings =
    async () => {

      try {

        setSaving(true);


        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        const res =
          await api.put(

            "/notification/settings/update",

            {

              userId,

              emailNotifications,

              smsNotifications,

              pushNotifications,

              marketingNotifications,

            }

          );


        if (res.data.success) {

          toast.success(

            "Notification settings updated"

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to update settings"

        );

      } finally {

        setSaving(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchSettings();

  }, []);


  /* ========================================
     TOGGLE CARD
  ======================================== */

  const ToggleCard = ({
    title,
    description,
    value,
    setValue,
    icon,
    color,
  }) => (

    <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl">

      {/* GLOW */}

      <div className={`absolute top-0 right-0 w-28 h-28 ${color} opacity-10 blur-3xl rounded-full`} />


      <div className="flex items-center justify-between gap-5">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          {/* ICON */}

          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white bg-gradient-to-br ${color}`}>

            {icon}

          </div>


          {/* CONTENT */}

          <div>

            <h3 className="text-xl font-bold text-black dark:text-white">

              {title}

            </h3>


            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">

              {description}

            </p>

          </div>

        </div>


        {/* SWITCH */}

        <button

          onClick={() =>
            setValue(!value)
          }

          className={`relative w-16 h-9 rounded-full transition-all duration-300 ${

            value

              ? "bg-green-500"

              : "bg-zinc-300 dark:bg-zinc-700"

          }`}

        >

          <div className={`absolute top-1 w-7 h-7 rounded-full bg-white transition-all duration-300 ${

            value

              ? "translate-x-8"

              : "translate-x-1"

          }`} />

        </button>

      </div>

    </div>

  );


  return (

    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Notification Settings

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Manage alerts, reminders & updates 🔔

          </p>

        </div>


        <div className="bg-black text-white px-5 py-3 rounded-2xl font-semibold">

          Smart Preferences

        </div>

      </div>


      {/* LOADING */}

      {

        loading ? (

          <div className="space-y-5">

            {

              [1, 2, 3, 4].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-28 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <>

            {/* SETTINGS */}

            <div className="space-y-5">

              {/* EMAIL */}

              <ToggleCard

                title="Email Notifications"

                description="Receive loan updates & account alerts via email"

                value={emailNotifications}

                setValue={setEmailNotifications}

                icon="📧"

                color="from-cyan-500 to-blue-600"

              />


              {/* SMS */}

              <ToggleCard

                title="SMS Notifications"

                description="Get important alerts directly on your phone"

                value={smsNotifications}

                setValue={setSmsNotifications}

                icon="📱"

                color="from-green-500 to-emerald-600"

              />


              {/* PUSH */}

              <ToggleCard

                title="Push Notifications"

                description="Receive real-time mobile app notifications"

                value={pushNotifications}

                setValue={setPushNotifications}

                icon="🔔"

                color="from-purple-500 to-fuchsia-600"

              />


              {/* MARKETING */}

              <ToggleCard

                title="Marketing Notifications"

                description="Offers, cashback deals & promotional campaigns"

                value={marketingNotifications}

                setValue={setMarketingNotifications}

                icon="🎁"

                color="from-yellow-400 to-orange-500"

              />

            </div>


            {/* SAVE BUTTON */}

            <button

              onClick={saveSettings}

              disabled={saving}

              className="w-full mt-8 bg-gradient-to-r from-black to-zinc-800 hover:opacity-90 text-white py-4 rounded-3xl font-bold text-lg transition-all duration-300 shadow-2xl"

            >

              {

                saving

                  ? "Saving Settings..."

                  : "Save Notification Settings"

              }

            </button>

          </>

        )

      }

    </div>

  );

}