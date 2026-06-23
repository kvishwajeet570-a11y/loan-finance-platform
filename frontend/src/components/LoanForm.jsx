"use client";

import React, { useState } from "react";

import axios from "axios";


export default function LoanForm() {

  /* ========================================
     STATES
  ======================================== */

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      fullName: "",

      email: "",

      phone: "",

      loanType: "",

      amount: "",

      dob: "",

      panNo: "",

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

      [name]:
        name === "amount"
          ? Number(value)
          : value,

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

          "https://loan-finance-platform.onrender.com/api/loan/apply",

          formData

        );


      /* SUCCESS */

      alert(
        response.data.message
      );

      console.log(
        response.data
      );


      /* RESET FORM */

      setFormData({

        fullName: "",

        email: "",

        phone: "",

        loanType: "",

        amount: "",

        dob: "",

        panNo: "",

      });

    } catch (error) {

      if (
        axios.isAxiosError(error)
      ) {

        console.log(
          error.response?.data
        );

        alert(

          error.response?.data?.message ||

          "Loan Application Failed"

        );

      } else {

        console.log(error);

        alert(
          "Something went wrong"
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="py-24 bg-[#081120] text-white">

      <div className="max-w-5xl mx-auto px-6">


        {/* HEADING */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">

            Apply For Loan

          </h2>

          <p className="text-gray-400 mt-4 text-xl">

            Fill the form to apply for your loan

          </p>

        </div>


        {/* FORM */}

        <form

          onSubmit={handleSubmit}

          className="bg-white/5 border border-white/10 rounded-[40px] p-10"

        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


            {/* FULL NAME */}

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-[#15203a] border border-white/10 rounded-2xl px-5 py-5 outline-none"
              required
            />


            {/* EMAIL */}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#15203a] border border-white/10 rounded-2xl px-5 py-5 outline-none"
              required
            />


            {/* PHONE */}

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="bg-[#15203a] border border-white/10 rounded-2xl px-5 py-5 outline-none"
              required
            />


            {/* LOAN TYPE */}

            <select
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
              className="bg-[#15203a] border border-white/10 rounded-2xl px-5 py-5 outline-none"
              required
            >

              <option value="">
                Select Loan Type
              </option>

              <option value="Personal Loan">
                Personal Loan
              </option>

              <option value="Home Loan">
                Home Loan
              </option>

              <option value="Business Loan">
                Business Loan
              </option>

              <option value="Education Loan">
                Education Loan
              </option>

            </select>


            {/* LOAN AMOUNT */}

            <input
              type="number"
              name="amount"
              placeholder="Loan Amount"
              value={formData.amount}
              onChange={handleChange}
              className="bg-[#15203a] border border-white/10 rounded-2xl px-5 py-5 outline-none"
              required
            />


            {/* DATE OF BIRTH */}

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="bg-[#15203a] border border-white/10 rounded-2xl px-5 py-5 outline-none"
              required
            />


            {/* PAN CARD */}

            <input
              type="text"
              name="panNo"
              placeholder="PAN Card Number"
              value={formData.panNo}
              onChange={handleChange}
              className="bg-[#15203a] border border-white/10 rounded-2xl px-5 py-5 outline-none md:col-span-2"
              required
            />

          </div>


          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-10 bg-gradient-to-r from-cyan-500 to-purple-500 py-5 rounded-2xl text-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
          >

            {
              loading
                ? "Submitting..."
                : "Submit Application"
            }

          </button>

        </form>

      </div>

    </section>

  );

}