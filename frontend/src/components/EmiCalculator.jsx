"use client";

import { useState } from "react";

export default function EmiCalculator() {

  const [amount, setAmount] =
    useState(500000);

  const [rate, setRate] =
    useState(10);

  const [years, setYears] =
    useState(5);

  const monthlyRate =
    rate / 12 / 100;

  const months =
    years * 12;

  const emi =
    (
      amount *
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        months
      )
    ) /
    (
      Math.pow(
        1 + monthlyRate,
        months
      ) - 1
    );

  return (

    <section className="py-24 bg-[#081120] text-white">

      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            EMI Calculator
          </h2>

          <p className="text-gray-400 mt-4 text-xl">
            Calculate your monthly loan EMI easily
          </p>

        </div>


        <div className="bg-white/5 border border-white/10 rounded-3xl p-10">

          {/* LOAN AMOUNT */}

          <div className="mb-10">

            <div className="flex justify-between mb-4">

              <h3 className="text-xl font-bold">
                Loan Amount
              </h3>

              <span className="text-cyan-400">
                ₹{amount}
              </span>

            </div>

            <input
              type="range"
              min="50000"
              max="5000000"
              value={amount}
              onChange={(e) =>
                setAmount(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full"
            />

          </div>


          {/* INTEREST RATE */}

          <div className="mb-10">

            <div className="flex justify-between mb-4">

              <h3 className="text-xl font-bold">
                Interest Rate
              </h3>

              <span className="text-cyan-400">
                {rate}%
              </span>

            </div>

            <input
              type="range"
              min="1"
              max="20"
              value={rate}
              onChange={(e) =>
                setRate(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full"
            />

          </div>


          {/* TENURE */}

          <div className="mb-10">

            <div className="flex justify-between mb-4">

              <h3 className="text-xl font-bold">
                Loan Tenure
              </h3>

              <span className="text-cyan-400">
                {years} Years
              </span>

            </div>

            <input
              type="range"
              min="1"
              max="30"
              value={years}
              onChange={(e) =>
                setYears(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full"
            />

          </div>


          {/* RESULT */}

          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl p-10 text-center">

            <h3 className="text-2xl font-bold mb-4">
              Monthly EMI
            </h3>

            <p className="text-5xl font-extrabold">
              ₹{Math.round(emi)}
            </p>

          </div>

        </div>

      </div>

    </section>

  );

}