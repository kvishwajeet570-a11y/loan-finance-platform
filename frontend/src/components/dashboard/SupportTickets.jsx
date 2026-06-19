"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import {

  Headphones,
  Send,
  MessageSquare,
  Clock,
  ShieldCheck,
  Paperclip,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,

} from "lucide-react";


export default function SupportTicket() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    submitting,
    setSubmitting
  ] = useState(false);


  const [
    tickets,
    setTickets
  ] = useState([]);


  const [
    formData,
    setFormData
  ] = useState({

    subject: "",

    category: "",

    priority: "medium",

    message: "",

  });


  /* ========================================
     FETCH TICKETS
  ======================================== */

  const fetchTickets =
    async () => {

      try {

        setLoading(true);


        const userId =
          localStorage.getItem("userId");


        if (!userId) {

          return;

        }


        const res =
          await api.get(

            `/support/my-tickets/${userId}`

          );


        if (res.data.success) {

          setTickets(

            res.data.tickets || []

          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

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
     SUBMIT TICKET
  ======================================== */

  const submitTicket =
    async () => {

      try {

        if (

          !formData.subject ||

          !formData.category ||

          !formData.message

        ) {

          toast.error(

            "Please fill all required fields"

          );

          return;

        }


        setSubmitting(true);


        const userId =
          localStorage.getItem("userId");


        const res =
          await api.post(

            "/support/create-ticket",

            {

              userId,

              ...formData,

            }

          );


        if (res.data.success) {

          toast.success(

            "Support ticket submitted successfully 🎉"

          );


          setFormData({

            subject: "",

            category: "",

            priority: "medium",

            message: "",

          });


          fetchTickets();

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to submit support ticket"

        );

      } finally {

        setSubmitting(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchTickets();

  }, []);


  return (

    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl p-6 lg:p-8">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-purple-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Headphones size={16} />

            24x7 Customer Support

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Support Center

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Submit issues, track support requests &
            get instant assistance from the LoanPay support team.

          </p>

        </div>


        <button

          onClick={fetchTickets}

          className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/20 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"

        >

          <RefreshCcw

            size={18}

            className="group-hover:rotate-180 transition-all duration-500"

          />

          Refresh Tickets

        </button>

      </div>


      {/* ========================================
          TOP STATUS CARDS
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* ACTIVE */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <MessageSquare size={42} />


            <p className="mt-6 text-white/80">

              Total Tickets

            </p>


            <h2 className="text-5xl font-black mt-3">

              {

                tickets.length

              }

            </h2>

          </div>

        </div>


        {/* RESPONSE */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <Clock size={42} />


            <p className="mt-6 text-white/80">

              Avg Response

            </p>


            <h2 className="text-5xl font-black mt-3">

              15m

            </h2>

          </div>

        </div>


        {/* PROTECTION */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-fuchsia-700 p-6 text-white shadow-2xl">

          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 blur-3xl rounded-full" />


          <div className="relative z-10">

            <ShieldCheck size={42} />


            <p className="mt-6 text-white/80">

              Secure Support

            </p>


            <h2 className="text-5xl font-black mt-3">

              100%

            </h2>

          </div>

        </div>

      </div>


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ========================================
            LEFT FORM
        ======================================== */}

        <div className="xl:col-span-3">

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 lg:p-8">

            {/* GLOW */}

            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-500/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              {/* TITLE */}

              <div className="mb-8">

                <h3 className="text-3xl font-black text-white">

                  Create Support Ticket

                </h3>


                <p className="text-slate-400 mt-3">

                  Describe your issue and our support team will assist you shortly.

                </p>

              </div>


              {/* FORM */}

              <div className="space-y-6">

                {/* SUBJECT */}

                <div>

                  <label className="text-slate-300 text-sm font-semibold mb-3 block">

                    Ticket Subject

                  </label>


                  <input

                    type="text"

                    name="subject"

                    value={formData.subject}

                    onChange={handleChange}

                    placeholder="Enter ticket subject"

                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white p-5 rounded-2xl outline-none transition-all duration-300"

                  />

                </div>


                {/* CATEGORY + PRIORITY */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* CATEGORY */}

                  <div>

                    <label className="text-slate-300 text-sm font-semibold mb-3 block">

                      Category

                    </label>


                    <select

                      name="category"

                      value={formData.category}

                      onChange={handleChange}

                      className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white p-5 rounded-2xl outline-none transition-all duration-300"

                    >

                      <option
                        value=""
                        className="bg-[#0f172a]"
                      >

                        Select Category

                      </option>

                      <option
                        value="Loan"
                        className="bg-[#0f172a]"
                      >

                        Loan Issue

                      </option>

                      <option
                        value="Payment"
                        className="bg-[#0f172a]"
                      >

                        Payment Problem

                      </option>

                      <option
                        value="Recharge"
                        className="bg-[#0f172a]"
                      >

                        Recharge Issue

                      </option>

                      <option
                        value="Referral"
                        className="bg-[#0f172a]"
                      >

                        Referral Issue

                      </option>

                      <option
                        value="Technical"
                        className="bg-[#0f172a]"
                      >

                        Technical Support

                      </option>

                    </select>

                  </div>


                  {/* PRIORITY */}

                  <div>

                    <label className="text-slate-300 text-sm font-semibold mb-3 block">

                      Priority

                    </label>


                    <select

                      name="priority"

                      value={formData.priority}

                      onChange={handleChange}

                      className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white p-5 rounded-2xl outline-none transition-all duration-300"

                    >

                      <option
                        value="low"
                        className="bg-[#0f172a]"
                      >

                        Low

                      </option>

                      <option
                        value="medium"
                        className="bg-[#0f172a]"
                      >

                        Medium

                      </option>

                      <option
                        value="high"
                        className="bg-[#0f172a]"
                      >

                        High

                      </option>

                      <option
                        value="urgent"
                        className="bg-[#0f172a]"
                      >

                        Urgent

                      </option>

                    </select>

                  </div>

                </div>


                {/* MESSAGE */}

                <div>

                  <label className="text-slate-300 text-sm font-semibold mb-3 block">

                    Describe Your Issue

                  </label>


                  <textarea

                    rows={7}

                    name="message"

                    value={formData.message}

                    onChange={handleChange}

                    placeholder="Explain your issue in detail..."

                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white p-5 rounded-2xl outline-none transition-all duration-300 resize-none"

                  />

                </div>


                {/* ACTIONS */}

                <div className="flex flex-col md:flex-row gap-5">

                  {/* ATTACH */}

                  <button

                    type="button"

                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-5 px-6 rounded-2xl font-semibold transition-all duration-300"

                  >

                    <Paperclip size={18} />

                    Attach Files

                  </button>


                  {/* SUBMIT */}

                  <button

                    onClick={submitTicket}

                    disabled={submitting}

                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl"

                  >

                    <Send size={20} />

                    {

                      submitting

                        ? "Submitting Ticket..."

                        : "Submit Support Ticket"

                    }

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            RIGHT TICKETS
        ======================================== */}

        <div className="xl:col-span-2">

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 lg:p-8 h-full">

            {/* GLOW */}

            <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-purple-500/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              {/* HEADER */}

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h3 className="text-3xl font-black text-white">

                    Recent Tickets

                  </h3>


                  <p className="text-slate-400 mt-2">

                    Track all your support requests

                  </p>

                </div>


                <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold">

                  {

                    tickets.length

                  } Active

                </div>

              </div>


              {/* TICKETS */}

              {

                loading ? (

                  <div className="space-y-5">

                    {

                      [1, 2, 3].map(

                        (item) => (

                          <div

                            key={item}

                            className="animate-pulse h-[120px] rounded-3xl bg-white/5"

                          />

                        )

                      )

                    }

                  </div>

                ) : tickets.length === 0 ? (

                  <div className="flex flex-col items-center justify-center text-center py-20">

                    <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">

                      <MessageSquare size={40} />

                    </div>


                    <h3 className="text-2xl font-black text-white mt-6">

                      No Tickets Yet

                    </h3>


                    <p className="text-slate-400 mt-3">

                      Your submitted tickets will appear here.

                    </p>

                  </div>

                ) : (

                  <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2">

                    {

                      tickets.map(

                        (ticket) => (

                          <div

                            key={ticket.id}

                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-cyan-400/20 transition-all duration-300"

                          >

                            {/* STATUS */}

                            <div className="flex items-start justify-between gap-5">

                              <div>

                                <h4 className="text-xl font-black text-white">

                                  {

                                    ticket.subject

                                  }

                                </h4>


                                <p className="text-slate-400 mt-2 text-sm">

                                  {

                                    ticket.category

                                  }

                                </p>

                              </div>


                              <div

                                className={`px-4 py-2 rounded-full text-xs font-bold ${

                                  ticket.status ===
                                  "resolved"

                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20"

                                    : ticket.status ===
                                      "pending"

                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/20"

                                    : "bg-red-500/10 text-red-400 border border-red-400/20"

                                }`}

                              >

                                {

                                  ticket.status

                                }

                              </div>

                            </div>


                            {/* MESSAGE */}

                            <p className="text-slate-300 mt-5 leading-relaxed">

                              {

                                ticket.message

                              }

                            </p>


                            {/* FOOTER */}

                            <div className="flex items-center justify-between mt-6">

                              <div className="flex items-center gap-2 text-sm text-slate-400">

                                <Clock size={15} />

                                {

                                  new Date(

                                    ticket.createdAt

                                  ).toLocaleDateString()

                                }

                              </div>


                              <div

                                className={`flex items-center gap-2 text-sm font-semibold ${

                                  ticket.priority ===
                                  "urgent"

                                    ? "text-red-400"

                                    : ticket.priority ===
                                      "high"

                                    ? "text-yellow-400"

                                    : "text-cyan-400"

                                }`}

                              >

                                <AlertTriangle size={15} />

                                {

                                  ticket.priority

                                }

                              </div>

                            </div>

                          </div>

                        )

                      )

                    }

                  </div>

                )

              }

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          BOTTOM PANEL
      ======================================== */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 mt-8 text-white shadow-2xl">

        <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-white/10 blur-[100px] rounded-full" />


        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">

              💬 Premium Support

            </div>


            <h2 className="text-5xl font-black mt-6">

              Need Instant Help?

            </h2>


            <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">

              Connect with our premium customer support team for priority assistance & faster issue resolution.

            </p>

          </div>


          {/* RIGHT */}

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Avg Rating

              </p>


              <h3 className="text-4xl font-black mt-3">

                4.9★

              </h3>

            </div>


            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl">

              <p className="text-white/70 text-sm">

                Support Time

              </p>


              <h3 className="text-4xl font-black mt-3">

                24x7

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}