"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function AccountSettings() {

  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    user,
    setUser
  ] = useState({

    id: "",

    name: "",

    email: "",

  });


  /* ========================================
     GET USER DATA
  ======================================== */

  useEffect(() => {

    fetchProfile();

  }, []);


  const fetchProfile =
    async () => {

      try {

        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "User not found"
          );

          return;

        }


        const res =
          await api.get(

            `/profile/${userId}`

          );


        if (res.data.success) {

          setUser({

            id:
              res.data.user.id,

            name:
              res.data.user.name,

            email:
              res.data.user.email,

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load profile"
        );

      }

    };


  /* ========================================
     HANDLE UPDATE
  ======================================== */

  const handleUpdate =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.put(

            "/profile/update",

            {

              userId:
                user.id,

              name:
                user.name,

              email:
                user.email,

            }

          );


        if (res.data.success) {

          toast.success(
            "Profile updated successfully"
          );

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Update failed"
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">

      <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">

        Account Settings

      </h2>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          value={user.name}
          onChange={(e) =>
            setUser({

              ...user,

              name:
                e.target.value,

            })
          }
          className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={user.email}
          onChange={(e) =>
            setUser({

              ...user,

              email:
                e.target.value,

            })
          }
          className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-black hover:bg-zinc-800 text-white p-4 rounded-2xl font-semibold transition-all duration-300"
        >

          {
            loading
              ? "Saving..."
              : "Save Changes"
          }

        </button>

      </div>

    </div>

  );

}