"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function EditProfile() {

  const [
    formData,
    setFormData
  ] = useState({

    name: "",

    email: "",

    phone: "",

    city: "",

  });


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    fetching,
    setFetching
  ] = useState(true);


  /* ========================================
     FETCH PROFILE
  ======================================== */

  const fetchProfile =
    async () => {

      try {

        setFetching(true);

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

            `/profile/${userId}`

          );


        if (res.data.success) {

          setFormData({

            name:
              res.data.user.name || "",

            email:
              res.data.user.email || "",

            phone:
              res.data.user.phone || "",

            city:
              res.data.user.city || "",

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch profile"

        );

      } finally {

        setFetching(false);

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
     HANDLE SUBMIT
  ======================================== */

  const handleSubmit =
    async (e) => {

      try {

        e.preventDefault();

        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          toast.error(
            "Please login first"
          );

          return;

        }


        setLoading(true);


        const res =
          await api.put(

            "/profile/update",

            {

              userId,

              ...formData,

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

          "Failed to update profile"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchProfile();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-black dark:text-white">

          Edit Profile

        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mt-2">

          Update your personal details 🚀

        </p>

      </div>


      {/* LOADING */}

      {

        fetching ? (

          <div className="space-y-5">

            {

              [1, 2, 3, 4].map(

                (item) => (

                  <div

                    key={item}

                    className="animate-pulse h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800"

                  />

                )

              )

            }

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

                Full Name

              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              />

            </div>


            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

                Email Address

              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              />

            </div>


            {/* PHONE */}

            <div>

              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

                Phone Number

              </label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              />

            </div>


            {/* CITY */}

            <div>

              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

                City

              </label>

              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              />

            </div>


            {/* BUTTON */}

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

            >

              {

                loading

                  ? "Saving Changes..."

                  : "Save Changes"

              }

            </button>

          </form>

        )

      }

    </div>

  );

}