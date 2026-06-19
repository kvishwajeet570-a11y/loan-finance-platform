"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function OperatorSelect({

  value,

  onChange,

}) {

  const [
    operators,
    setOperators
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* ========================================
     FETCH OPERATORS
  ======================================== */

  const fetchOperators =
    async () => {

      try {

        setLoading(true);


        const res =
          await api.get(

            "/recharge/operators"

          );


        if (res.data.success) {

          setOperators(

            res.data.operators

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to load operators"

        );

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchOperators();

  }, []);


  return (

    <div className="space-y-3">

      {/* LABEL */}

      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">

        Mobile Operator

      </label>


      {/* SELECT */}

      <div className="relative">

        <select

          value={value}

          onChange={onChange}

          disabled={loading}

          className="w-full appearance-none bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-lg"

        >

          <option value="">

            {

              loading

                ? "Loading Operators..."

                : "Select Operator"

            }

          </option>


          {

            operators.map(

              (operator) => (

                <option

                  key={operator.id}

                  value={operator.name}

                >

                  {

                    operator.name

                  }

                </option>

              )

            )

          }

        </select>


        {/* DROPDOWN ICON */}

        <div className="absolute top-1/2 right-5 -translate-y-1/2 text-zinc-500 pointer-events-none">

          ⌄

        </div>

      </div>


      {/* QUICK OPERATORS */}

      {

        !loading && (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">

            {

              operators.slice(0, 4).map(

                (operator) => (

                  <button

                    key={operator.id}

                    type="button"

                    onClick={() =>
                      onChange({

                        target: {

                          value:
                            operator.name,

                        },

                      })
                    }

                    className={`relative overflow-hidden border rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] ${

                      value === operator.name

                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent"

                        : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border-zinc-200 dark:border-zinc-700"

                    }`}

                  >

                    {/* GLOW */}

                    {

                      value === operator.name && (

                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 blur-2xl rounded-full" />

                      )

                    }


                    <div className="relative z-10">

                      {/* LOGO */}

                      <div className="text-2xl mb-2">

                        {

                          operator.name === "Jio"

                            ? "📶"

                            : operator.name === "Airtel"

                            ? "📡"

                            : operator.name === "Vi"

                            ? "📱"

                            : "☎️"

                        }

                      </div>


                      {/* NAME */}

                      <h3 className="font-bold">

                        {

                          operator.name

                        }

                      </h3>

                    </div>

                  </button>

                )

              )

            }

          </div>

        )

      }

    </div>

  );

}