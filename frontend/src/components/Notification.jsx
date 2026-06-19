"use client";

import { useEffect, useState } from "react";

import axios from "axios";


export default function Notification() {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* ========================================
     FETCH APPROVED LOANS
  ======================================== */

  const fetchNotifications =
    async () => {

      try {

        const response =
          await axios.get(

            "http://localhost:5000/api/loan/all"

          );


        const approvedLoans =
          response.data.loans.filter(

            (loan) =>

              loan.status ===
              "approved"

          );


        setNotifications(
          approvedLoans
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


  /* ========================================
     AUTO FETCH
  ======================================== */

  useEffect(() => {

    fetchNotifications();

    const interval =
      setInterval(() => {

        fetchNotifications();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);


  /* ========================================
     LOADING
  ======================================== */

  if (loading) return null;


  /* ========================================
     NO NOTIFICATIONS
  ======================================== */

  if (
    notifications.length === 0
  ) {

    return null;

  }


  return (

    <div className="fixed top-24 right-6 z-50 space-y-4">

      {

        notifications.map((loan) => (

          <div

            key={loan.id}

            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-5 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl animate-pulse"

          >

            <h3 className="font-bold text-lg">

              🎉 Loan Approved

            </h3>

            <p className="text-sm mt-2">

              {

                loan.fullName

              }'s {

                loan.loanType

              } has been approved successfully.

            </p>

          </div>

        ))

      }

    </div>

  );

}