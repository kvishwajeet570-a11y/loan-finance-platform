"use client";

import { useState } from "react";

import axios from "axios";


export default function Contact() {

  /* ========================================
     STATES
  ======================================== */

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      phone: "",

      message: "",

    });


  /* ========================================
     HANDLE CHANGE
  ======================================== */

  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData({

      ...formData,

      [name]: value,

    });

  };


  /* ========================================
     HANDLE SUBMIT
  ======================================== */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await axios.post(

          "http://localhost:5000/api/contact/send",


          formData

        );

      alert(
        response.data.message
      );

      setFormData({

        name: "",

        email: "",

        phone: "",

        message: "",

      });

    } catch (error) {

      console.log(error);

      alert(
        "Message Failed"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="py-24 bg-[#020617] text-white">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT */}

        <div>

          <h2 className="text-5xl font-bold mb-6">
            Contact Us
          </h2>

          <p className="text-gray-400 text-lg mb-8">
            Feel free to contact our support team anytime.
          </p>

          <div className="space-y-6">

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">

              <h3 className="text-xl font-bold">
                Phone
              </h3>

              <p className="text-gray-400 mt-2">
                +91 8292908077
              </p>

            </div>


            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">

              <h3 className="text-xl font-bold">
                Email
              </h3>

              <p className="text-gray-400 mt-2">
                admin@indialoanfinance.com
              </p>

            </div>


            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">

              <h3 className="text-xl font-bold">
                Address
              </h3>

              <p className="text-gray-400 mt-2">
                Mumbai, India
              </p>

            </div>

          </div>

        </div>


        {/* RIGHT */}

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-8"
        >

          <h3 className="text-3xl font-bold mb-8">
            Send Message
          </h3>

          <div className="space-y-6">

            {/* NAME */}

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#15203a] border border-white/10 rounded-2xl px-5 py-4 outline-none"
              required
            />


            {/* EMAIL */}

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#15203a] border border-white/10 rounded-2xl px-5 py-4 outline-none"
              required
            />


            {/* PHONE */}

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#15203a] border border-white/10 rounded-2xl px-5 py-4 outline-none"
              required
            />


            {/* MESSAGE */}

            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-[#15203a] border border-white/10 rounded-2xl px-5 py-4 outline-none"
              required
            ></textarea>


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 py-4 rounded-2xl font-bold"
            >

              {
                loading
                  ? "Sending..."
                  : "Send Message"
              }

            </button>

          </div>

        </form>

      </div>

    </section>

  );

}