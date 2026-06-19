"use client";

import {
  useState,
  useEffect,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";


export default function JobApplicationForm() {

  const [
    jobs,
    setJobs
  ] = useState([]);


  const [
    loadingJobs,
    setLoadingJobs
  ] = useState(true);


  const [
    submitting,
    setSubmitting
  ] = useState(false);


  const [
    formData,
    setFormData
  ] = useState({

    name: "",

    email: "",

    phone: "",

    position: "",

    experience: "",

    resume: "",

  });


  /* ========================================
     FETCH JOBS
  ======================================== */

  const fetchJobs =
    async () => {

      try {

        setLoadingJobs(true);

        const res =
          await api.get(

            "/job"

          );


        if (res.data.success) {

          setJobs(

            res.data.jobs

          );

        }

      } catch (error) {

        console.log(error);

        toast.error(

          "Failed to fetch jobs"

        );

      } finally {

        setLoadingJobs(false);

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

        if (

          !formData.name ||

          !formData.email ||

          !formData.phone ||

          !formData.position ||

          !formData.experience

        ) {

          toast.error(

            "All fields are required"

          );

          return;

        }


        setSubmitting(true);


        const res =
          await api.post(

            "/job/apply",

            formData

          );


        if (res.data.success) {

          toast.success(

            "Application submitted successfully"

          );

          setFormData({

            name: "",

            email: "",

            phone: "",

            position: "",

            experience: "",

            resume: "",

          });

        }

      } catch (error) {

        console.log(error);

        toast.error(

          error?.response?.data?.message ||

          "Application failed"

        );

      } finally {

        setSubmitting(false);

      }

    };


  /* ========================================
     USE EFFECT
  ======================================== */

  useEffect(() => {

    fetchJobs();

  }, []);


  return (

    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-black dark:text-white">

            Job Application

          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mt-2">

            Apply for exciting fintech careers 🚀

          </p>

        </div>


        <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium">

          Careers Portal

        </div>

      </div>


      {/* AVAILABLE JOBS */}

      <div className="mb-8">

        <h3 className="text-xl font-bold text-black dark:text-white mb-5">

          Available Positions

        </h3>


        {

          loadingJobs ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {

                [1, 2].map(

                  (item) => (

                    <div

                      key={item}

                      className="animate-pulse h-40 rounded-3xl bg-zinc-100 dark:bg-zinc-800"

                    />

                  )

                )

              }

            </div>

          ) : jobs.length === 0 ? (

            <div className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-3xl text-center">

              <p className="text-zinc-500">

                No jobs available right now

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {

                jobs.map(

                  (job) => (

                    <div

                      key={job.id}

                      className="relative overflow-hidden bg-gradient-to-br from-black to-zinc-800 text-white p-6 rounded-3xl shadow-xl"

                    >

                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />


                      <h3 className="text-2xl font-bold">

                        {
                          job.title
                        }

                      </h3>


                      <p className="text-zinc-300 mt-3">

                        {
                          job.description
                        }

                      </p>


                      <div className="mt-5 flex items-center justify-between">

                        <span className="bg-white/10 px-4 py-2 rounded-2xl text-sm">

                          {
                            job.type
                          }

                        </span>


                        <span className="text-green-400 font-bold">

                          ₹{
                            job.salary
                          }

                        </span>

                      </div>

                    </div>

                  )

                )

              }

            </div>

          )

        }

      </div>


      {/* APPLICATION FORM */}

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


        {/* POSITION */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Position

          </label>

          <select

            name="position"

            value={formData.position}

            onChange={handleChange}

            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"

          >

            <option value="">

              Select Position

            </option>

            {

              jobs.map(

                (job) => (

                  <option

                    key={job.id}

                    value={job.title}

                  >

                    {

                      job.title

                    }

                  </option>

                )

              )

            }

          </select>

        </div>


        {/* EXPERIENCE */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Experience

          </label>

          <input
            type="text"
            name="experience"
            placeholder="Example: 2 Years"
            value={formData.experience}
            onChange={handleChange}
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
          />

        </div>


        {/* RESUME */}

        <div>

          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">

            Resume Link

          </label>

          <input
            type="text"
            name="resume"
            placeholder="Paste resume drive link"
            value={formData.resume}
            onChange={handleChange}
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
          />

        </div>


        {/* BUTTON */}

        <button

          type="submit"

          disabled={submitting}

          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl"

        >

          {

            submitting

              ? "Submitting Application..."

              : "Apply Now"

          }

        </button>

      </form>

    </div>

  );

}