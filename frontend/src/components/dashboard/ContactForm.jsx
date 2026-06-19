"use client";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function ContactForm() {

  const [
    formData,
    setFormData
  ] = useState({

    name: "",

    email: "",

    message: "",

  });


  const [
    loading,
    setLoading
  ] = useState(false);


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
    async () => {

      try {

        if (

          !formData.name ||

          !formData.email ||

          !formData.message

        ) {

          toast.error(

            "All fields are required"

          );

          return;

        }


        setLoading(true);


        const res =
          await api.post(

            "/contact/send",

            formData

          );


        if (res.data.success) {

          toast.success(

            "Message sent successfully"

          );

          setFormData({

            name: "",

            email: "",

            message: "",

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to send message"

        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-black dark:text-white">

          Contact Support

        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mt-2">

          Need help? Send us your query 🚀

        </p>

      </div>


      {/* FORM */}

      <div className="space-y-5">

        {/* NAME */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Full Name

          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
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
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
          />

        </div>


        {/* MESSAGE */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Message

          </label>

          <textarea
            rows={5}
            name="message"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
          />

        </div>


        {/* BUTTON */}

        <button

          onClick={handleSubmit}

          disabled={loading}

          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

        >

          {

            loading

              ? "Sending..."

              : "Send Message"

          }

        </button>

      </div>

    </div>

  );

}